// cart.js — cart page rendering
function line(p) {
  const total = p.qty * p.price;
  return `<div class="cart__item">
    <img src="${p.image}" alt="${p.name}">
    <div>
      <strong>${p.name}</strong>
      <div>${formatPrice(p.price)} each</div>
    </div>
    <input type="number" min="1" value="${p.qty}" data-qty="${p.id}" aria-label="Quantity for ${p.name}" style="width:70px">
    <button class="btn btn--ghost" data-remove="${p.id}" aria-label="Remove ${p.name}">Remove</button>
  </div>`;
}

function renderCart() {
  const items = Cart.get();
  const wrap = document.getElementById('cartContainer');
  if (!wrap) return;
  if (items.length === 0) {
    wrap.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  wrap.innerHTML = items.map(line).join('') + `<div class="cart__totals">Subtotal: ${formatPrice(Cart.subtotal())}</div>`;

  wrap.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-remove');
      Cart.remove(id); renderCart();
    });
  });
  wrap.querySelectorAll('[data-qty]').forEach(input => {
    input.addEventListener('input', () => {
      const id = input.getAttribute('data-qty');
      const qty = Math.max(1, parseInt(input.value || '1', 10));
      Cart.update(id, qty); renderCart();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  const clear = document.getElementById('clearCartBtn');
  if (clear) clear.addEventListener('click', () => { Cart.clear(); renderCart(); });
});
