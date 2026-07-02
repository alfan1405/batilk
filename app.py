from __future__ import annotations

import base64
import io
import json
import os
from typing import List, Tuple

from flask import Flask, jsonify, request, send_from_directory

try:
    # Prefer lightweight runtime
    from tflite_runtime.interpreter import Interpreter  # type: ignore
except Exception:  # pragma: no cover
    # Fallback to full tensorflow (if available)
    from tensorflow.lite.python.interpreter import Interpreter  # type: ignore

import numpy as np
from PIL import Image


app = Flask(__name__, static_folder=".", static_url_path="")

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(PROJECT_DIR, "models", "batik_model.tflite")

CLASS_LABELS: List[str] = [
    "JawaBarat_GongSibolong",
    "JawaBarat_MegaMendung",
    "JawaTengah_BokorKencono",
    "JawaTengah_Sidomukti",
    "JawaTengah_Sidomulyo",
    "JawaTengah_Srikaton",
    "JawaTengah_Tribusono",
    "JawaTengah_Truntum",
    "Yogyakarta_Kawung",
    "Yogyakarta_Parang",
    "Yogyakarta_SekarJagad",
    "Yogyakarta_Sidoluhur",
    "Yogyakarta_WahyuTumurun",
    "Yogyakarta_Wirasat",
]


def _load_interpreter() -> Tuple[Interpreter, np.ndarray, List[int]]:
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model tidak ditemukan: {MODEL_PATH}")

    interpreter = Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()

    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    input_index = input_details[0]["index"]
    output_index = output_details[0]["index"]

    input_shape = input_details[0]["shape"]  # e.g. [1, 224, 224, 3]
    return interpreter, np.array([input_index, output_index], dtype=np.int32), input_shape


INTERPRETER, IO_INDEX, INPUT_SHAPE = _load_interpreter()
INPUT_HEIGHT = int(INPUT_SHAPE[1])
INPUT_WIDTH = int(INPUT_SHAPE[2])
INPUT_CHANNELS = int(INPUT_SHAPE[3])


def _decode_base64_data_url(data_url: str) -> bytes:
    # Expected: data:image/jpeg;base64,AAAA...
    if "," not in data_url:
        raise ValueError("Format base64 data URL tidak valid")
    header, b64 = data_url.split(",", 1)
    if not header.startswith("data:"):
        raise ValueError("Format data URL tidak valid")
    return base64.b64decode(b64)


def _preprocess_image(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((INPUT_WIDTH, INPUT_HEIGHT))

    arr = np.asarray(img, dtype=np.float32)

    # Sesuaikan normalisasi dengan implementasi yang pernah ada di JS:
    # variant 1: /255.0, variant 2: /127.5 - 1, variant 3: tanpa normalisasi
    # Karena backend single-run, kita pilih /255.0 yang paling umum stabil.
    arr = arr / 255.0

    # [H,W,C] -> [1,H,W,C]
    arr = np.expand_dims(arr, axis=0)

    if INPUT_CHANNELS == 1:
        arr = arr.mean(axis=-1, keepdims=True)

    return arr.astype(np.float32)


@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(silent=True) or {}

    # Accept either {"image": "dataurl"} or {"imageDataUrl": "dataurl"}
    data_url = payload.get("image") or payload.get("imageDataUrl")
    if not data_url:
        return jsonify({"error": "Missing field 'image' (base64 data URL)"}), 400

    try:
        image_bytes = _decode_base64_data_url(data_url)
        input_tensor = _preprocess_image(image_bytes)

        input_index = int(IO_INDEX[0])
        output_index = int(IO_INDEX[1])

        INTERPRETER.set_tensor(input_index, input_tensor)
        INTERPRETER.invoke()

        output = INTERPRETER.get_tensor(output_index)
        scores = output.reshape(-1).tolist()

        best_index = int(np.argmax(scores))
        label = CLASS_LABELS[best_index] if 0 <= best_index < len(CLASS_LABELS) else "Motif tidak dikenali"

        return jsonify(
            {
                "label": label,
                "index": best_index,
                "scores": scores,
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Serve static files from current project folder.
# This enables opening batiklens.html by browsing http://localhost:5000/batiklens.html
@app.route("/", defaults={"path": "batiklens.html"})
@app.route("/<path:path>")
def static_proxy(path: str):
    # Security: prevent directory traversal
    safe_path = os.path.normpath(path).lstrip(os.sep)

    # If client requests known static resources, serve them
    if os.path.exists(os.path.join(PROJECT_DIR, safe_path)):
        directory = PROJECT_DIR
        # send_from_directory expects directory + path
        return send_from_directory(directory, safe_path)

    # Fallback: try to serve batiklens.html for SPA-ish behavior
    return send_from_directory(PROJECT_DIR, "batiklens.html")


if __name__ == "__main__":
    # Dev server
    app.run(host="127.0.0.1", port=5000, debug=True)

