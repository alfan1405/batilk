// tradjumasnews.js — dummy pricing & news data, rendered into the page.

var pricePackages = [
  { no: 1, name: "Paket Pelatihan Dasar (Canting)", participants: "1 – 10 orang", duration: "2 jam", price: "Rp 75.000 / orang" },
  { no: 2, name: "Paket Pelatihan Cap", participants: "1 – 10 orang", duration: "2 jam", price: "Rp 65.000 / orang" },
  { no: 3, name: "Paket Pelatihan Kelompok Sekolah", participants: "20 – 40 orang", duration: "3 jam", price: "Rp 60.000 / orang" },
  { no: 4, name: "Paket Pelatihan Komunitas / Instansi", participants: "10 – 30 orang", duration: "Half day (4 jam)", price: "Rp 95.000 / orang" },
  { no: 5, name: "Paket Pelatihan Intensif Mewarna Alam", participants: "1 – 8 orang", duration: "Full day (6 jam)", price: "Rp 175.000 / orang" }
];

var newsItems = [
  {
    date: "12 Juni 2026",
    title: "Pelatihan Membatik Bersama Siswa SDN Pengasinan",
    excerpt: "Puluhan siswa belajar teknik dasar mencanting dan mengenal filosofi motif Gong si Bolong langsung dari perajin Tradjumas.",
    img: "images/news-1.svg"
  },
  {
    date: "28 Mei 2026",
    title: "Kunjungan Studi Banding dari Dinas Koperasi Kota Depok",
    excerpt: "Tradjumas berbagi pengalaman membangun UMKM batik lokal sejak 2015 hingga kini memiliki ratusan mitra bisnis.",
    img: "images/news-2.svg"
  },
  {
    date: "15 April 2026",
    title: "Workshop Pewarnaan Alam untuk Komunitas Perempuan Sawangan",
    excerpt: "Peserta diajak mengenal pewarna alami dari tumbuhan lokal sebagai alternatif ramah lingkungan dalam proses membatik.",
    img: "images/news-3.svg"
  },
  {
    date: "2 Maret 2026",
    title: "Tradjumas Hadir di Pameran UMKM Jawa Barat",
    excerpt: "Koleksi batik motif Belimbing Dewa mendapat sambutan hangat dari pengunjung pameran tahunan produk lokal Jawa Barat.",
    img: "images/news-4.svg"
  },
  {
    date: "20 Januari 2026",
    title: "Pelatihan Rutin Bulanan Bersama Warga Kecamatan Sawangan",
    excerpt: "Program pelatihan masyarakat ke-300 sejak berdiri, sebagai bagian dari komitmen melestarikan seni membatik di Depok.",
    img: "images/news-5.svg"
  }
];

function renderPriceTable() {
  var body = document.getElementById('priceTableBody');
  if (!body) return;
  body.innerHTML = pricePackages.map(function (p) {
    return (
      '<tr>' +
        '<td>' + p.no + '</td>' +
        '<td>' + p.name + '</td>' +
        '<td>' + p.participants + '</td>' +
        '<td>' + p.duration + '</td>' +
        '<td>' + p.price + '</td>' +
      '</tr>'
    );
  }).join('');
}

function renderNews() {
  var list = document.getElementById('newsList');
  if (!list) return;
  list.innerHTML = newsItems.map(function (n) {
    return (
      '<article class="news-card">' +
        '<div class="news-img"><img src="' + n.img + '" alt="' + n.title + '" loading="lazy"></div>' +
        '<div class="news-body">' +
          '<span class="news-date">' + n.date + '</span>' +
          '<h3>' + n.title + '</h3>' +
          '<p>' + n.excerpt + '</p>' +
        '</div>' +
      '</article>'
    );
  }).join('');
}

document.addEventListener('DOMContentLoaded', function () {
  renderPriceTable();
  renderNews();
});
