# Batik Tradjumas — Website

Website resmi Batik Tradjumas (Depok, Jawa Barat), dibangun sesuai wireframe
dengan 5 halaman: **Home**, **Katalog**, **TradjumasNews**, **BatikCare**, dan
**BatikLens** (fitur deteksi jenis motif batik).

## Struktur Project

```
batik-tradjumas/
├── index.html            # Home — hero, tentang kami, statistik, kontak
├── katalog.html          # Katalog produk batik
├── tradjumasnews.html    # Daftar harga paket pelatihan + berita kegiatan
├── batikcare.html        # Edukasi seputar batik
├── batiklens.html        # Fitur deteksi motif batik (UI siap, ML menyusul)
├── css/
│   └── style.css         # Seluruh styling (1 file, dipakai semua halaman)
├── js/
│   ├── nav.js             # Toggle menu mobile (dipakai semua halaman)
│   ├── katalog.js          # Data dummy produk + render katalog
│   ├── tradjumasnews.js    # Data dummy harga paket & berita
│   └── batiklens.js        # Logika upload galeri, kamera, dan stub deteksi
└── images/                # Placeholder SVG bertema batik (ganti dengan foto asli)
```

## Cara Menjalankan

Buka `index.html` langsung di browser, atau jalankan local server:

```bash
cd batik-tradjumas
python3 -m http.server 8000
# buka http://localhost:8000
```

## Mengganti Data Dummy

- **Produk Katalog** → edit array `products` di `js/katalog.js`
- **Harga paket & berita** → edit array `pricePackages` dan `newsItems` di
  `js/tradjumasnews.js`
- **Foto** → ganti file di folder `images/` (gunakan nama file yang sama agar
  tidak perlu mengubah HTML), atau update path `src` di HTML/JS sesuai foto baru.

## Mengintegrasikan Model Machine Learning di BatikLens

Saat ini `batiklens.html` sudah memiliki:
- Upload gambar dari galeri (`<input type="file">`)
- Pengambilan foto langsung dari kamera (`getUserMedia`)
- Pratinjau gambar, animasi "scanning", dan area status hasil

Yang **belum** ada: logika klasifikasi sungguhan. Titik integrasinya ada di
satu fungsi saja — `runDetection()` di `js/batiklens.js`:

```js
function runDetection(imageDataUrl) {
  // imageDataUrl = base64 data URL dari gambar yang diunggah/difoto
  // Ganti isi fungsi ini dengan pemanggilan model sungguhan.
}
```

Dua pendekatan yang umum dipakai:

1. **TensorFlow.js (berjalan di browser)**
   - Latih model klasifikasi gambar (mis. lewat Teachable Machine atau
     fine-tuning MobileNet) dengan dataset foto motif batik (Gong si Bolong,
     Belimbing Dewa, Parang, dll).
   - Muat model dengan `tf.loadLayersModel()`, ubah `imageDataUrl` jadi
     tensor, lalu `model.predict()`.
   - Tambahkan `<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs">`
     di `batiklens.html`.

2. **API/backend eksternal**
   - Kirim `imageDataUrl` (base64) via `fetch()` POST ke endpoint backend
     yang menjalankan model (mis. Python + PyTorch/TensorFlow di server).
   - Parse response JSON berisi nama motif & tingkat keyakinan, lalu
     tampilkan lewat `showStatus()`.

Setelah model terpasang, hasil deteksi bisa ditampilkan memakai fungsi
`showStatus()` yang sudah ada, misalnya:

```js
showStatus('Motif terdeteksi: Gong si Bolong (akurasi 92%)', false);
```

## Catatan Aksesibilitas & Responsif

- Navigasi mendukung keyboard (skip-link, focus-visible).
- Layout responsif penuh hingga lebar mobile (diuji pada 390px).
- Animasi (efek scan) menghormati `prefers-reduced-motion`.
