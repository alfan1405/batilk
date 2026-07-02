// batiklens.js
// Handles: image upload (gallery) + live camera capture for the BatikLens page.
// NOTE: This wires up the *interface* only. The actual ML classification call
// is intentionally left as a clearly-marked stub (see runDetection) so a model
// can be plugged in later without touching the UI logic.

document.addEventListener('DOMContentLoaded', function () {
  var stage = document.getElementById('lensStage');
  var placeholder = document.getElementById('lensPlaceholder');
  var previewImg = document.getElementById('lensPreview');
  var fileInput = document.getElementById('fileInput');
  var galleryBtn = document.getElementById('galleryBtn');
  var cameraBtn = document.getElementById('cameraBtn');
  var detectBtn = document.getElementById('detectBtn');
  var resetBtn = document.getElementById('resetBtn');
  var statusBox = document.getElementById('lensStatus');

  var cameraModal = document.getElementById('cameraModal');
  var cameraVideo = document.getElementById('cameraVideo');
  var captureBtn = document.getElementById('captureBtn');
  var closeCameraBtn = document.getElementById('closeCameraBtn');

  var mediaStream = null;
  // Endpoint Flask untuk inferensi (biarkan bisa di-override kalau perlu)
  window.PREDICT_URL = '/predict';


  var classLabels = [

    'JawaBarat_GongSibolong',
    'JawaBarat_MegaMendung',
    'JawaTengah_BokorKencono',
    'JawaTengah_Sidomukti',
    'JawaTengah_Sidomulyo',
    'JawaTengah_Srikaton',
    'JawaTengah_Tribusono',
    'JawaTengah_Truntum',
    'Yogyakarta_Kawung',
    'Yogyakarta_Parang',
    'Yogyakarta_SekarJagad', 
    'Yogyakarta_Sidoluhur',
    'Yogyakarta_WahyuTumurun',
    'Yogyakarta_Wirasat',
  ];

  function showStatus(message, isPending) {
    statusBox.textContent = message;
    statusBox.classList.add('show');
    statusBox.classList.toggle('pending', !!isPending);
  }

  function clearStatus() {
    statusBox.classList.remove('show', 'pending');
    statusBox.textContent = '';
  }

  function setPreview(srcDataUrl) {
    previewImg.src = srcDataUrl;
    previewImg.style.display = 'block';
    placeholder.style.display = 'none';
    stage.classList.add('has-image');
    detectBtn.disabled = false;
    resetBtn.hidden = false;
    clearStatus();
  }

  function resetStage() {
    previewImg.removeAttribute('src');
    previewImg.style.display = 'none';
    placeholder.style.display = 'flex';
    stage.classList.remove('has-image', 'scanning');
    detectBtn.disabled = true;
    resetBtn.hidden = true;
    clearStatus();
  }

  // ---------- Gallery upload ----------
  galleryBtn.addEventListener('click', function () {
    fileInput.click();
  });

  fileInput.addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showStatus('File yang dipilih bukan gambar. Coba pilih file foto (JPG/PNG).');
      return;
    }
    var reader = new FileReader();
    reader.onload = function (ev) {
      setPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  });

  // ---------- Camera capture ----------
  cameraBtn.addEventListener('click', async function () {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showStatus('Kamera tidak didukung di perangkat/browser ini. Silakan gunakan tombol Galeri.');
      return;
    }
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      cameraVideo.srcObject = mediaStream;
      cameraModal.classList.add('open');
      cameraModal.setAttribute('aria-hidden', 'false');
    } catch (err) {
      showStatus('Tidak bisa mengakses kamera. Pastikan izin kamera diaktifkan, lalu coba lagi.');
    }
  });

  function stopCamera() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(function (track) { track.stop(); });
      mediaStream = null;
    }
    cameraModal.classList.remove('open');
    cameraModal.setAttribute('aria-hidden', 'true');
  }

  closeCameraBtn.addEventListener('click', stopCamera);

  captureBtn.addEventListener('click', function () {
    var canvas = document.createElement('canvas');
    canvas.width = cameraVideo.videoWidth || 480;
    canvas.height = cameraVideo.videoHeight || 480;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
    var dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setPreview(dataUrl);
    stopCamera();
  });

  // close modal on backdrop click
  cameraModal.addEventListener('click', function (e) {
    if (e.target === cameraModal) stopCamera();
  });

  // ---------- Reset ----------
  resetBtn.addEventListener('click', function () {
    resetStage();
    fileInput.value = '';
  });

  // ---------- Detect (stub — model integration point) ----------
  detectBtn.addEventListener('click', function () {
    stage.classList.add('scanning');
    showStatus('Menganalisis motif batik…', true);
    runDetection(previewImg.src);
  });

  /**
   * runDetection(imageDataUrl)
   * STUB — replace the body of this function with a real model call.
   *
   * Example integration points:
   *  - TensorFlow.js: load a model with tf.loadLayersModel(), preprocess the
   *    image from `imageDataUrl` into a tensor, run model.predict(), and map
   *    the output to a class label.
   *  - Remote API: POST the base64 image to your backend / Claude API and
   *    parse the JSON response for the predicted batik motif.
   *
   * For now this only simulates a delay so the interface can be demoed
   * end-to-end before the model is wired in.
   */
  async function runDetection(imageDataUrl) {
    try {
      stage.classList.add('scanning');
      showStatus('Mengirim gambar ke server untuk deteksi…', true);

      // POST base64 data URL to Flask
      var res = await fetch((window.PREDICT_URL || '/predict'), {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageDataUrl })
      });

      var data = await res.json().catch(function () { return null; });

      if (!res.ok) {
        var msg = (data && data.error) ? data.error : ('HTTP ' + res.status);
        throw new Error(msg);
      }

      var label = data && data.label ? data.label : 'Motif tidak dikenali';
      stage.classList.remove('scanning');
      showStatus('Hasil deteksi: ' + label, false);
    } catch (err) {
      console.error('Prediction failed:', err);
      stage.classList.remove('scanning');
      var base = (err && err.message ? err.message : err);
      showStatus('Terjadi kesalahan saat deteksi: ' + base + ' (cek endpoint /predict di server Flask)', false);
    }

  }



  // init
  resetStage();
});
