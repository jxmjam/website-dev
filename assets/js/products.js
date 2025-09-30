// products.js — list + detail rendering from products.json
async function fetchProducts() {
  const res = await fetch('assets/data/products.json');
  if (!res.ok) throw new Error('Failed to load products.json');
  return res.json();
}

function getHashQuery(key) {
  if (!location.hash.startsWith('#')) return null;
  const params = new URLSearchParams(location.hash.slice(1));
  return params.get(key);
}

function starRating(r) {
  const full = '★'.repeat(Math.round(r));
  const empty = '☆'.repeat(5 - Math.round(r));
  return `<span class="rating" aria-label="Rating ${r} out of 5">${full}${empty}</span>`;
}

function renderCard(p) {
  return `<article class="product-card" role="listitem">
    <a href="product.html?id=${p.id}" aria-label="View ${p.name}">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
    </a>
    <div class="product-card__meta">
      <strong>${p.name}</strong>
      <span class="price">${formatPrice(p.price)}</span>
    </div>
    <div class="product-card__meta">
      ${starRating(p.rating)}
      <span class="badge">${p.category}</span>
    </div>
    <div>
      <button class="btn btn--primary" data-add="${p.id}">Add to Cart</button>
      <a class="btn" href="product.html?id=${p.id}">Details</a>
    </div>
  </article>`;
}

function applyFilters(products) {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const cat = document.getElementById('categorySelect')?.value || '';
  let filtered = products.filter(p =>
    (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) &&
    (!cat || p.category === cat)
  );

  const sort = document.getElementById('sortSelect')?.value || 'featured';
  if (sort === 'price-asc') filtered.sort((a,b)=>a.price-b.price);
  if (sort === 'price-desc') filtered.sort((a,b)=>b.price-a.price);
  if (sort === 'rating-desc') filtered.sort((a,b)=>b.rating-a.rating);
  return filtered;
}

async function initProductsPage() {
  const container = document.getElementById('productsGrid');
  if (!container) return;
  const data = await fetchProducts();

  // Populate categories
  const catSelect = document.getElementById('categorySelect');
  const cats = Array.from(new Set(data.map(p=>p.category))).sort();
  for (const c of cats) {
    const opt = document.createElement('option'); opt.value=c; opt.textContent=c; catSelect.appendChild(opt);
  }

  // Pre-fill search from hash (#q=...)
  const initialQ = getHashQuery('q');
  if (initialQ && document.getElementById('searchInput')) {
    document.getElementById('searchInput').value = decodeURIComponent(initialQ);
  }

  const render = () => {
    const items = applyFilters(data);
    container.innerHTML = items.map(renderCard).join('');
    container.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-add');
        const product = data.find(p => String(p.id) === String(id));
        Cart.add(product, 1);
      });
    });
  };

  ['searchInput','categorySelect','sortSelect'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', render);
    if (el && el.tagName === 'SELECT') el.addEventListener('change', render);
  });

  render();
}

async function initProductDetail() {
  const wrap = document.getElementById('productContainer');
  if (!wrap) return;
  const data = await fetchProducts();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const p = data.find(x => String(x.id) === String(id));
  if (!p) {
    wrap.innerHTML = '<p>Product not found.</p>';
    return;
  }
  wrap.innerHTML = `
    <div class="product-detail__img"><img src="${p.image}" alt="${p.name}"></div>
    <div class="product-detail__buy">
      <h1>${p.name}</h1>
      <p>${starRating(p.rating)}</p>
      <p class="price">${formatPrice(p.price)}</p>
      <p>${p.description}</p>
      <label for="qty">Quantity</label>
      <input id="qty" type="number" min="1" value="1" style="max-width:100px">
      <button class="btn btn--primary" id="addBtn">Add to Cart</button>
      <a href="products.html" class="btn">Back to Shop</a>
    </div>
  `;
  document.getElementById('addBtn').addEventListener('click', () => {
    const qty = Math.max(1, parseInt(document.getElementById('qty').value || '1', 10));
    Cart.add(p, qty);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initProductsPage();
  initProductDetail();
});
