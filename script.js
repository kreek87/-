// Initialize Lucide Icons
lucide.createIcons();

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for Animations (Fade Up)
const fadeElements = document.querySelectorAll('.fade-up');

const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, appearOptions);

fadeElements.forEach(el => {
    appearOnScroll.observe(el);
});

// Animate hero content immediately on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('visible');
        }
    }, 100);
});

// ====== Shopping Cart Logic ======

// Cart state
let cart = [];

// DOM Elements
const cartToggle = document.getElementById('cart-toggle');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartBadge = document.getElementById('cart-badge');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// Toggle Cart Sidebar
function toggleCart(e) {
    if (e) e.preventDefault();
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('open');
}

if (cartToggle) cartToggle.addEventListener('click', toggleCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

// Add to Cart Event
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const item = {
            id: button.getAttribute('data-id'),
            name: button.getAttribute('data-name'),
            price: parseInt(button.getAttribute('data-price')),
            img: button.getAttribute('data-img'),
            qty: 1
        };

        addToCart(item);
        showToast(`已將 ${item.name} 加入購物車`);
    });
});

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push(item);
    }
    updateCartUI();

    // Bump animation on badge
    cartBadge.classList.add('bump');
    setTimeout(() => cartBadge.classList.remove('bump'), 300);
}

function updateQuantity(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].qty += change;
        if (cart[itemIndex].qty <= 0) {
            cart.splice(itemIndex, 1);
        }
        updateCartUI();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    // 1. Update Badge Number
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalItems;

    // 2. Update Total Price
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    cartTotalPrice.textContent = `NT$ ${totalPrice}`;

    // 3. Render Cart Items
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">您的購物車是空的</div>';
        return;
    }

    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">NT$ ${item.price}</div>
                <div class="cart-item-actions">
                    <div class="qty-controls">
                        <button class="qty-btn minus-btn" data-id="${item.id}"><i data-lucide="minus" size="14"></i></button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn plus-btn" data-id="${item.id}"><i data-lucide="plus" size="14"></i></button>
                    </div>
                    <button class="remove-btn" data-id="${item.id}"><i data-lucide="trash-2" size="14"></i> 移除</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    // Re-initialize dynamic icons
    lucide.createIcons();

    // Attach event listeners to new dynamic buttons
    document.querySelectorAll('.minus-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            updateQuantity(id, -1);
        });
    });

    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            updateQuantity(id, 1);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            removeFromCart(id);
        });
    });
}

// Toast Notification System
function showToast(message) {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="check-circle" size="18"></i> ${message}`;

    toastContainer.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Initialize cart on load
updateCartUI();
