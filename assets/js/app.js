// app.js — shared app utilities (storage, cart badge, etc.)
const STORAGE_KEYS = { CART: 'ct_cart' };

const Cart = {
  get() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || []; }
    catch { return []; }
  },
  set(items) { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items)); },
  add(item, qty=1) {
    const cart = Cart.get();
    const idx = cart.findIndex(p => p.id === item.id);
    if (idx >= 0) cart[idx].qty += qty;
    else cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, qty });
    Cart.set(cart);
    alert('Added to cart!');
  },
  remove(id) {
    const cart = Cart.get().filter(p => p.id !== id);
    Cart.set(cart);
  },
  update(id, qty) {
    const cart = Cart.get().map(p => (p.id === id ? { ...p, qty } : p));
    Cart.set(cart);
  },
  clear() { localStorage.removeItem(STORAGE_KEYS.CART); },
  count() { return Cart.get().reduce((n, p) => n + p.qty, 0); },
  subtotal() { return Cart.get().reduce((s, p) => s + p.qty * p.price, 0); }
};

// Update cart count in the header title (optional enhancement)
document.addEventListener('visibilitychange', () => {
  // Placeholder for dynamic header cart badge if you add one
});
