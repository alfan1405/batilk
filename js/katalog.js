// katalog.js — dummy product data, rendered into the catalog grid.
// Replace `products` with real data (or fetch from an API/CMS) when ready.

var products = [
  {
    name: "Batik cap monokrom (1 gambar, 2 warna)",
    price: "Rp 450.000",
    size: "2,15 m x 1,15 m",
    type: "Batik Tulis — Katun Primisima",
    img: "images/batik1.jpeg",
    tag: "Tulis"
  },
  {
    name: "Batik cap standar warna (lebih dari 2 warna",
    price: "Rp 285.000",
    size: "2,10 m x 1,10 m",
    type: "Batik Cap — Katun Prima",
    img: "images/batik2.jpeg",
    tag: "Cap"
  },
  {
    name: "Batik cap kombinasi tulis standar warna (3 motif batik)",
    price: "Rp 365.000",
    size: "2,15 m x 1,15 m",
    type: "Tulis & Cap — Katun Primisima",
    img: "images/batik3.jpeg",
    tag: "Kombinasi"
  },
  {
    name: "Kemeja Tanpa Puring",
    price: "Rp 225.000",
    size: "S / M / L / XL",
    type: "Batik Cap — Katun",
    img: "images/batik4.jpeg",
    tag: "Konveksi"
  },
  {
    name: "Kemeja dengan puring",
    price: "Rp 225.000",
    size: "S / M / L / XL",
    type: "Batik Cap — Katun",
    img: "images/batik5.jpeg",
    tag: "Konveksi"
  },
  {
    name: "Syal Ayau Cukin",
    price: "Rp 410.000",
    size: "2,15 m x 1,15 m",
    type: "Batik Tulis — Katun Primisima",
    img: "images/batik6.jpeg",
    tag: "Tulis"
  },
  {
    name: "Ikat Kepala atau Totopong Sunda",
    price: "Rp 65.000",
    size: "Standar dewasa",
    type: "Batik Cap — Katun",
    img: "images/batik7.jpeg",
    tag: "Aksesori"
  },
  {
    name: "Sandal",
    price: "Rp 65.000",
    size: "Standar dewasa",
    type: "Batik Cap — Katun",
    img: "images/batik8.jpeg",
    tag: "Aksesori"
  }
];

function renderCatalog() {
  var grid = document.getElementById('catalogGrid');
  if (!grid) return;

  var html = products.map(function (p) {
    return (
      '<article class="batik-card">' +
        '<div class="card-img">' +
          '<span class="card-tag">' + p.tag + '</span>' +
          '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
        '</div>' +
        '<div class="card-body">' +
          '<h3>' + p.name + '</h3>' +
          '<div class="card-meta">' +
            '<div class="card-meta-row"><span class="label">Harga</span><span class="value card-price">' + p.price + '</span></div>' +
            '<div class="card-meta-row"><span class="label">Ukuran Kain</span><span class="value">' + p.size + '</span></div>' +
            '<div class="card-meta-row"><span class="label">Jenis Kain</span><span class="value">' + p.type + '</span></div>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }).join('');

  grid.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderCatalog);
