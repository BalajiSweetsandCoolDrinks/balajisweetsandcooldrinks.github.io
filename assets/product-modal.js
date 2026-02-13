// Product Modal Component - Shared across all product pages
let productState = {
    name: '',
    basePrice: 0,
    currentWeight: 0.25,
    quantity: 1,
    image: ''
};

function openProduct(name, price, img) {
    productState = { 
        name: name, 
        basePrice: price, 
        currentWeight: 0.25, 
        quantity: 1, 
        image: img 
    };
    
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalImg = document.getElementById('modalImg');
    const qtyVal = document.getElementById('qtyVal');
    
    if (modalTitle) modalTitle.innerText = name;
    if (modalImg) modalImg.src = img;
    if (qtyVal) qtyVal.innerText = 1;
    
    // Reset size buttons
    const sizeBtns = document.querySelectorAll('.size-btn');
    if (sizeBtns.length > 0) {
        sizeBtns.forEach(btn => btn.classList.remove('active'));
        sizeBtns[0].classList.add('active');
    }
    
    calculatePrice();
    if (modalOverlay) modalOverlay.style.display = 'flex';
}

function updateSize(weight, btn) {
    productState.currentWeight = weight;
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    calculatePrice();
}

function updateQty(val) {
    productState.quantity = Math.max(1, productState.quantity + val);
    const qtyVal = document.getElementById('qtyVal');
    if (qtyVal) qtyVal.innerText = productState.quantity;
    calculatePrice();
}

function calculatePrice() {
    const unitCount = productState.currentWeight / 0.25;
    const total = (productState.basePrice * unitCount) * productState.quantity;
    const modalPrice = document.getElementById('modalPrice');
    if (modalPrice) modalPrice.innerText = "₹ " + total.toLocaleString();
}

function addToCart() {
    const weightLabel = productState.currentWeight < 1 
        ? (productState.currentWeight * 1000) + "Gms" 
        : "1kg";
    
    const item = {
        id: productState.name.replace(/\s+/g,'-').toLowerCase() + '-' + 
            (productState.currentWeight < 1 ? Math.round(productState.currentWeight * 1000) + 'g' : '1kg'),
        title: productState.name,
        price: productState.basePrice * (productState.currentWeight / 0.25),
        qty: productState.quantity,
        weight: weightLabel,
        image: productState.image
    };
    
    if (typeof addToCartItem === 'function') {
        addToCartItem(item);
    }
    closeModalFunc();
}

function closeModalFunc() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.style.display = 'none';
}

function injectProductModal() {
    // Check if modal already exists
    if (document.getElementById('modalOverlay')) return;
    
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;
    
    modalContainer.innerHTML = `
    <div class="modal-overlay" id="modalOverlay">
        <div class="product-modal">
            <span class="close-modal" id="closeModal">&times;</span>
            <img id="modalImg" src="" style="width:100%; height:250px; object-fit:cover;">
            
            <div class="modal-body">
                <h2 id="modalTitle" style="margin:0; color:#c45a3f; font-family:'Playfair Display', serif;"></h2>
                <p id="modalPrice" style="font-size:26px; font-weight:700; margin:12px 0 22px; color:#c45a3f;"></p>
                
                <span class="option-label">Size:</span>
                <div class="size-container">
                    <button class="size-btn active" onclick="updateSize(0.25, this)">250 Gms</button>
                    <button class="size-btn" onclick="updateSize(0.5, this)">500 Gms</button>
                    <button class="size-btn" onclick="updateSize(1.0, this)">1 kg</button>
                </div>

                <div class="action-row">
                    <div class="qty-input">
                        <button class="qty-btn" onclick="updateQty(-1)">-</button>
                        <span id="qtyVal">1</span>
                        <button class="qty-btn" onclick="updateQty(1)">+</button>
                    </div>
                    <button class="add-btn" onclick="addToCart()">ADD TO CART</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Attach event listeners
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.onclick = closeModalFunc;
    }
    
    window.onclick = function(event) {
        const modalOverlay = document.getElementById('modalOverlay');
        if (event.target === modalOverlay) closeModalFunc();
    };
}

function injectFloatingCart() {
    // Check if cart float already exists
    if (document.querySelector('.cart-float')) return;
    
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return;
    
    cartContainer.innerHTML = `
    <a href="cart.html" class="cart-float" aria-label="Open cart">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span class="cart-count" id="cartCount">0</span>
    </a>
    `;
}

// Initialize modal and cart when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            injectProductModal();
            injectFloatingCart();
        }, 0);
    });
} else {
    setTimeout(() => {
        injectProductModal();
        injectFloatingCart();
    }, 0);
}

