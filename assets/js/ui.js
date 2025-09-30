// ui.js — header/footer injection + small helpers
const BRAND = { name: "Campus Threads", tagline: "Affordable gear for everyday students." };

function currentPage() {
  const file = location.pathname.split('/').pop() || 'index.html';
  return file.toLowerCase();
}

function navLink(href, label) {
  const page = currentPage();
  const isCurrent = page === href.toLowerCase();
  return `<a href="${href}" ${isCurrent ? 'aria-current="page"' : ''}>${label}</a>`;
}

function renderHeader() {
  const el = document.getElementById('app-header');
  if (!el) return;
  el.innerHTML = `
    <header class="header">
      <div class="container header__inner" role="navigation" aria-label="Main">
        <a class="brand" href="index.html">
          <img class="brand__logo" src="assets/img/logo.svg" alt="${BRAND.name} logo" />
          <span>${BRAND.name}</span>
        </a>
        <nav class="nav">
          ${navLink('index.html','Home')}
          ${navLink('products.html','Shop')}
          ${navLink('about.html','About')}
          ${navLink('contact.html','Contact')}
          ${navLink('cart.html','Cart')}
        </nav>
        <div class="header__tools">
          <div class="header__search" role="search">
            <input id="globalSearch" type="search" placeholder="Search…" aria-label="Site search" />
          </div>
        </div>
      </div>
    </header>`;

  // Lightweight global search navigation
  const globalSearch = document.getElementById('globalSearch');
  if (globalSearch) {
    globalSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = encodeURIComponent(globalSearch.value.trim());
        if (q) window.location.href = `products.html#q=${q}`;
      }
    });
  }
}

function renderFooter() {
  const el = document.getElementById('app-footer');
  if (!el) return;
  const year = new Date().getFullYear();
  el.innerHTML = `
    <footer class="footer">
      <div class="container footer__inner">
        <div>
          <strong>${BRAND.name}</strong><br/>
          <small>${BRAND.tagline}</small>
        </div>
        <div>
          <a href="about.html">About</a> ·
          <a href="contact.html">Contact</a> ·
          <a href="products.html">Shop</a>
        </div>
        <small>&copy; ${year} ${BRAND.name}. Built for a college assignment.</small>
      </div>
    </footer>`;
}

function formatPrice(value) { return `$${value.toFixed(2)}`; }
function qs(sel, ctx=document) { return ctx.querySelector(sel); }
function qsa(sel, ctx=document) { return Array.from(ctx.querySelectorAll(sel)); }

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
});
