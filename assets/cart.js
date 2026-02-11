// Shared cart and toast behavior
const CART_KEY = 'bs_cart_v1';
// Centralized WhatsApp phone number (use international format without +)
const WHATSAPP_PHONE = '919962899084';
function loadCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||[]; }catch(e){return[]} }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCartCount(); }
function addToCartItem(item){ const cart = loadCart(); const existing = cart.find(i=>i.id===item.id); if(existing){ existing.qty += item.qty; } else cart.push(item); saveCart(cart); showToast('Added to cart'); }
function clearCart(){ localStorage.removeItem(CART_KEY); }
function renderCartCount(){ const cart = loadCart(); const total = cart.reduce((s,i)=>s+i.qty,0); const el = document.getElementById('cartCount'); if(el) el.innerText = total; }
function updateItemQty(id, delta){ const cart = loadCart(); const idx = cart.findIndex(i=>i.id===id); if(idx===-1) return; cart[idx].qty = Math.max(0, cart[idx].qty + delta); if(cart[idx].qty === 0) cart.splice(idx,1); saveCart(cart); renderCartCount(); }
function removeItem(id){ const cart = loadCart().filter(i=>i.id!==id); saveCart(cart); renderCartCount(); }

// Toast helper
function showToast(msg, timeout=2200){ let t = document.getElementById('toast'); if(!t){ t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role','status'); t.setAttribute('aria-live','polite'); t.style.position='fixed'; t.style.right='20px'; t.style.bottom='180px'; t.style.background='rgba(0,0,0,0.8)'; t.style.color='#fff'; t.style.padding='10px 14px'; t.style.borderRadius='8px'; t.style.boxShadow='0 8px 24px rgba(0,0,0,0.2)'; t.style.zIndex='1300'; t.style.display='none'; document.body.appendChild(t); }
  t.innerText = msg; t.style.display='block'; t.style.opacity='1'; clearTimeout(t._hideTimer); t._hideTimer = setTimeout(()=>{ t.style.transition='opacity 300ms'; t.style.opacity='0'; setTimeout(()=> t.style.display='none', 300); }, timeout);
}

// Auto-wire when script is loaded
if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', renderCartCount); } else { renderCartCount(); }
