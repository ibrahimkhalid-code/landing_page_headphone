// ===========================
// MOBILE MENU FUNCTIONALITY
// ===========================

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-content')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ===========================
// SHOPPING CART FUNCTIONALITY
// ===========================

class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.modal = document.getElementById('cartModal');
        this.closeBtn = document.querySelector('.close');
        this.cartItemsContainer = document.getElementById('cartItems');
        this.subtotalElement = document.getElementById('subtotal');
        this.shippingElement = document.getElementById('shipping');
        this.totalElement = document.getElementById('total');
        this.cartBtns = document.querySelectorAll('#headerCartBtn, #productCartBtn');
        this.checkoutBtn = document.getElementById('checkoutBtn');
        
        this.initEventListeners();
        this.shippingCost = 0;
    }

    initEventListeners() {
        // Cart button listeners
        this.cartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const color = document.querySelector('.color-option.active');
                const colorName = color ? color.getAttribute('data-color') : 'black';
                this.addItem({
                    id: 'mello-725i',
                    name: 'MELLO DREAM 725i',
                    price: 25.00,
                    color: colorName,
                    quantity: 1
                });
            });
        });

        // Modal close
        this.closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Checkout
        this.checkoutBtn.addEventListener('click', () => this.checkout());
    }

    addItem(product) {
        // Check if item with same color already exists
        const existingItem = this.items.find(
            item => item.id === product.id && item.color === product.color
        );

        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            this.items.push(product);
        }

        this.saveCart();
        this.openModal();
        this.updateCartUI();
        this.showNotification('Product added to cart!');
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.saveCart();
        this.updateCartUI();
    }

    updateCartUI() {
        // Clear container
        this.cartItemsContainer.innerHTML = '';

        if (this.items.length === 0) {
            this.cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            this.updateSummary();
            return;
        }

        // Add items
        this.items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-details">Color: ${this.capitalizeColor(item.color)} × ${item.quantity}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="cart-item-remove" data-index="${index}">×</button>
                </div>
            `;
            this.cartItemsContainer.appendChild(itemElement);
        });

        // Add remove listeners
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.removeItem(index);
            });
        });

        this.updateSummary();
    }

    updateSummary() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.shippingCost = subtotal > 50 ? 0 : 10;
        const total = subtotal + this.shippingCost;

        this.subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        this.shippingElement.textContent = this.shippingCost === 0 ? 'FREE' : `$${this.shippingCost.toFixed(2)}`;
        this.totalElement.textContent = `$${total.toFixed(2)}`;
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    openModal() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert(`Proceeding to checkout with ${this.items.length} item(s). Total: $${(this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + this.shippingCost).toFixed(2)}`);
        // In a real app, redirect to checkout page
        this.items = [];
        this.saveCart();
        this.updateCartUI();
        this.closeModal();
    }

    capitalizeColor(color) {
        return color.charAt(0).toUpperCase() + color.slice(1);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ===========================
// COLOR SELECTION
// ===========================

function initColorSelection() {
    const colorOptions = document.querySelectorAll('.color-option');
    const colorNameSpan = document.querySelector('.color-name');

    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all
            colorOptions.forEach(opt => opt.classList.remove('active'));
            // Add to clicked
            option.classList.add('active');
            // Update color name
            const colorMap = {
                'gray': 'Gray',
                'pink': 'Pink',
                'blue': 'Royal Blue',
                'black': 'Royal Black'
            };
            colorNameSpan.textContent = colorMap[option.getAttribute('data-color')];
        });
    });
}

// ===========================
// PRODUCT IMAGE THUMBNAILS
// ===========================

function initThumbnails() {
    const mainImage = document.querySelector('.main-product-image img');
    const thumbnails = document.querySelectorAll('.thumbnail');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Remove active class
            thumbnails.forEach(t => t.classList.remove('active'));
            // Add to clicked
            thumb.classList.add('active');
            // Update main image
            const newSrc = thumb.querySelector('img').src;
            mainImage.src = newSrc;
        });
    });
}

// ===========================
// SOCIAL MEDIA ICONS
// ===========================

function initSocialIcons() {
    const socialLinks = document.querySelectorAll('.social-icon');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                width: 20px;
                height: 20px;
                pointer-events: none;
                animation: ripple-animation 0.6s ease-out;
            `;
            
            link.style.position = 'relative';
            link.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ===========================
// NEWSLETTER FORM
// ===========================

function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        
        // Simple email validation
        if (email) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: var(--success-color);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            `;
            notification.textContent = `Thanks for subscribing with ${email}!`;
            document.body.appendChild(notification);
            
            form.reset();
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    });
}

// ===========================
// BACK TO TOP BUTTON
// ===========================

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize cart
    const cart = new ShoppingCart();
    
    // Initialize other features
    initColorSelection();
    initThumbnails();
    initNewsletterForm();
    initSocialIcons();
    initBackToTop();

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// ===========================
// UTILITY: Add CSS variables to document
// ===========================

const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--primary-dark);
    }

    @keyframes iconPulse {
        0% {
            box-shadow: 0 0 0 0 rgba(255, 107, 74, 0.4);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(255, 107, 74, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(255, 107, 74, 0);
        }
    }

    .social-icon:active {
        animation: iconPulse 0.6s ease-out;
    }
`;
document.head.appendChild(style);
