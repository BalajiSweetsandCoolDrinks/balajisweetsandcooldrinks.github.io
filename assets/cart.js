// Shared cart and toast behavior
const CART_KEY = 'bs_cart_v1';
// Centralized WhatsApp phone number (use international format without +)
const WHATSAPP_PHONE = '919962899084';
function loadCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||[]; }catch(e){return[]} }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCartCount(); }
function addToCartItem(item){ const cart = loadCart(); const existing = cart.find(i=>i.id===item.id); if(existing){ existing.qty += item.qty; } else cart.push(item); saveCart(cart); renderCartModal(); showToast('Added to cart'); }
function clearCart(){ localStorage.removeItem(CART_KEY); renderCartModal(); }
function renderCartCount(){ const cart = loadCart(); const total = cart.reduce((s,i)=>s+i.qty,0); const el = document.getElementById('cartCount'); if(el) el.innerText = total; }
function updateItemQty(id, delta){ const cart = loadCart(); const idx = cart.findIndex(i=>i.id===id); if(idx===-1) return; cart[idx].qty = Math.max(0, cart[idx].qty + delta); if(cart[idx].qty === 0) cart.splice(idx,1); saveCart(cart); renderCartModal(); }
function removeItem(id){ const cart = loadCart().filter(i=>i.id!==id); saveCart(cart); renderCartModal(); }
function renderCartModal(){ const cart = loadCart(); const container = document.getElementById('cartItems'); if(!container) return; container.innerHTML=''; if(cart.length===0){ container.innerHTML='<div>Your cart is empty</div>'; const totalEl = document.querySelector('.cart-total'); if(totalEl) totalEl.remove(); return; } let totalPrice = 0; cart.forEach(i=>{ const itemEl = document.createElement('div'); itemEl.className='cart-item'; const itemTotal = (i.price * i.qty); totalPrice += itemTotal; itemEl.innerHTML = `
    <div class="left"><div>${i.title} <small>(${i.weight})</small></div>
      <div class="qty-controls">
        <button aria-label="Decrease" onclick="updateItemQty('${i.id}', -1)">−</button>
        <div style="min-width:28px;text-align:center">${i.qty}</div>
        <button aria-label="Increase" onclick="updateItemQty('${i.id}', 1)">+</button>
        <button class="remove-btn" onclick="removeItem('${i.id}')">✕</button>
      </div>
    </div>
    <div class="right"><div class="item-total">₹${itemTotal}</div></div>
  `; container.appendChild(itemEl); });
  // show cart total
  let totalEl = document.querySelector('.cart-total'); if(!totalEl){ totalEl = document.createElement('div'); totalEl.className='cart-total'; container.parentNode.insertBefore(totalEl, container.nextSibling); }
  totalEl.innerText = 'Total: ₹' + totalPrice;
 }

// Cart UI wiring - finds controls if present on the page
function wireCartUI(){ const cartBtn = document.getElementById('cartBtn'); const cartModal = document.getElementById('cartModal'); if(cartBtn){ cartBtn.addEventListener('click', (e)=>{ e.preventDefault(); if(!cartModal) return; cartModal.style.display = cartModal.style.display==='block' ? 'none' : 'block'; renderCartModal(); }); }
  const clearBtn = document.getElementById('clearCart'); if(clearBtn) clearBtn.addEventListener('click', ()=>{ clearCart(); renderCartModal(); renderCartCount(); });
  const checkout = document.getElementById('checkout'); if(checkout) checkout.addEventListener('click', ()=>{ const cart = loadCart(); if(cart.length===0){ showToast('Cart empty'); return; } showCheckoutDialog(); });
  renderCartCount();
  // ensure cart button uses a white SVG icon (not emoji) for consistent look
  try{ const btn = document.getElementById('cartBtn'); if(btn){ btn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14l.84-2h7.02c.75 0 1.41-.41 1.75-1.03l3.24-6.02-1.86-.99L16.2 9H9.21L8.27 7H3v2h3.27l1.6 3.59-1.35 3.41C6.09 16.94 6 17.31 6 17.68 6 18.4 6.6 19 7.33 19h11.34v-2H7.42c-.06 0-.12-.02-.17-.06.02-.08.05-.16.08-.24L9 12h7.45c.75 0 1.41-.41 1.75-1.03L20 6H7.16z"/></svg><span class="cart-count" id="cartCount">0</span>'; }
  }catch(e){}
}

// Checkout overlay dialog
function showCheckoutDialog(){ // create overlay
  if(document.getElementById('checkoutOverlay')) return; const overlay = document.createElement('div'); overlay.id='checkoutOverlay'; overlay.className='checkout-overlay'; overlay.innerHTML = `
    <div class="checkout-dialog" role="dialog" aria-modal="true">
      <h4>Complete your order</h4>
      <label for="custName">Name</label>
      <input id="custName" placeholder="Your name" />
      <label for="custAddr">Address</label>
      <textarea id="custAddr" rows="3" placeholder="Delivery address (optional)"></textarea>
      <div class="checkout-actions">
        <button class="btn-secondary" id="checkoutCancel">Cancel</button>
        <button class="btn-primary" id="checkoutConfirm">Confirm & WhatsApp</button>
      </div>
    </div>
  `; document.body.appendChild(overlay);
  document.getElementById('checkoutCancel').addEventListener('click', cancelCheckout);
  document.getElementById('checkoutConfirm').addEventListener('click', confirmCheckout);
}

function cancelCheckout(){ const ov = document.getElementById('checkoutOverlay'); if(ov) ov.remove(); }

function confirmCheckout(){ const name = (document.getElementById('custName')||{}).value||''; const addr = (document.getElementById('custAddr')||{}).value||''; const cart = loadCart(); if(cart.length===0){ showToast('Cart empty'); cancelCheckout(); return; }
  // build message with items and per-item totals
  let totalPrice = 0; let text = 'Order%0A'; cart.forEach(i=>{ const itemTotal = i.price * i.qty; totalPrice += itemTotal; text += `${i.qty} x ${i.title} (${i.weight}) - ₹${i.price} = ₹${itemTotal}%0A`; });
  text += `%0ATotal: ₹${totalPrice}%0A`;
  if(name) text += `%0AName: ${encodeURIComponent(name)}%0A`;
  if(addr) text += `Address: ${encodeURIComponent(addr)}%0A`;
  // clear cart before opening WhatsApp
  clearCart();
  // open WhatsApp
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${text}`,'_blank');
  cancelCheckout();
}

// Toast helper
function showToast(msg, timeout=2200){ let t = document.getElementById('toast'); if(!t){ t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role','status'); t.setAttribute('aria-live','polite'); t.style.position='fixed'; t.style.right='20px'; t.style.bottom='180px'; t.style.background='rgba(0,0,0,0.8)'; t.style.color='#fff'; t.style.padding='10px 14px'; t.style.borderRadius='8px'; t.style.boxShadow='0 8px 24px rgba(0,0,0,0.2)'; t.style.zIndex='1300'; t.style.display='none'; document.body.appendChild(t); }
  t.innerText = msg; t.style.display='block'; t.style.opacity='1'; clearTimeout(t._hideTimer); t._hideTimer = setTimeout(()=>{ t.style.transition='opacity 300ms'; t.style.opacity='0'; setTimeout(()=> t.style.display='none', 300); }, timeout);
}

// Auto-wire when script is loaded
if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', wireCartUI); } else { wireCartUI(); }
