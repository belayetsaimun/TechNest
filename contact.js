document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart and wishlist
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Update cart and wishlist counts
    updateCartCount();
    updateWishlistCount();
    
    // Handle FAQ toggles
    initFAQs();
    
    // Handle contact form submission
    initContactForm();
    
    // Cart Side Bar Navigation
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const continueShopping = document.querySelector('.continue-shopping');
    const overlay = document.getElementById('overlay');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.style.right = '0';
            overlay.style.display = 'block';
            updateCartUI();
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }
    
    if (continueShopping) {
        continueShopping.addEventListener('click', () => {
            cartSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }
    
    // Wishlist Sidebar Navigation
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const closeWishlist = document.querySelector('.close-wishlist');
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            wishlistSidebar.style.right = '0';
            overlay.style.display = 'block';
            updateWishlistUI();
        });
    }
    
    if (closeWishlist) {
        closeWishlist.addEventListener('click', () => {
            wishlistSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }
    
    // Close sidebars when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            cartSidebar.style.right = '-400px';
            wishlistSidebar.style.right = '-400px';
            
            // Close the success modal if it's open
            const successModal = document.getElementById('successModal');
            if (successModal) {
                successModal.style.display = 'none';
            }
            
            overlay.style.display = 'none';
        });
    }
    
    // Helper Functions
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
    
    function updateWishlistCount() {
        const wishlistCount = document.querySelector('.wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = wishlist.length;
        }
    }
    
    function updateCartUI() {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total span:last-child');
        const checkoutBtn = document.querySelector('.checkout-btn');
        
        if (!cartItems || !cartTotal) return;
        
        if (cart.length === 0) {
            // Show empty cart message
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn secondary-btn">Start Shopping</a>
                </div>
            `;
            
            cartTotal.textContent = '৳0.00';
            
            if (checkoutBtn) {
                checkoutBtn.style.display = 'none';
            }
        } else {
            // Clear cart items
            cartItems.innerHTML = '';
            
            // Add each cart item
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.dataset.id = item.id;
                
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">৳${(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="10">
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <button class="remove-item"><i class="fas fa-trash"></i></button>
                `;
                
                cartItems.appendChild(cartItem);
                
                // Add event listeners
                const minusBtn = cartItem.querySelector('.minus');
                const plusBtn = cartItem.querySelector('.plus');
                const removeBtn = cartItem.querySelector('.remove-item');
                const quantityInput = cartItem.querySelector('input');
                
                minusBtn.addEventListener('click', () => {
                    const currentValue = parseInt(quantityInput.value);
                    if (currentValue > 1) {
                        quantityInput.value = currentValue - 1;
                        updateCartItemQuantity(item.id, currentValue - 1);
                    }
                });
                
                plusBtn.addEventListener('click', () => {
                    const currentValue = parseInt(quantityInput.value);
                    if (currentValue < 10) {
                        quantityInput.value = currentValue + 1;
                        updateCartItemQuantity(item.id, currentValue + 1);
                    }
                });
                
                removeBtn.addEventListener('click', () => {
                    removeFromCart(item.id);
                });
            });
            
            // Calculate total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
            
            if (checkoutBtn) {
                checkoutBtn.style.display = 'block';
            }
        }
    }
    
    function updateWishlistUI() {
        const wishlistItems = document.querySelector('.wishlist-items');
        const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');
        
        if (!wishlistItems || !clearWishlistBtn) return;
        
        if (wishlist.length === 0) {
            // Show empty wishlist message
            wishlistItems.innerHTML = `
                <div class="empty-wishlist">
                    <div class="empty-wishlist-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <p>Your wishlist is empty</p>
                    <a href="products.html" class="btn secondary-btn">Discover Products</a>
                </div>
            `;
            
            clearWishlistBtn.style.display = 'none';
        } else {
            // Clear wishlist items
            wishlistItems.innerHTML = '';
            
            // Add each wishlist item
            wishlist.forEach(item => {
                const wishlistItem = document.createElement('div');
                wishlistItem.className = 'wishlist-item';
                wishlistItem.dataset.id = item.id;
                
                wishlistItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="wishlist-item-info">
                        <h4>${item.name}</h4>
                        <p class="wishlist-item-price">৳${item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="move-to-cart"><i class="fas fa-shopping-cart"></i></button>
                        <button class="remove-from-wishlist"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                wishlistItems.appendChild(wishlistItem);
                
                // Add event listeners
                const moveToCartBtn = wishlistItem.querySelector('.move-to-cart');
                const removeBtn = wishlistItem.querySelector('.remove-from-wishlist');
                
                moveToCartBtn.addEventListener('click', () => {
                    // Add to cart
                    addItemToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: 1
                    });
                    
                    // Remove from wishlist
                    removeFromWishlist(item.id);
                });
                
                removeBtn.addEventListener('click', () => {
                    removeFromWishlist(item.id);
                });
            });
            
            clearWishlistBtn.style.display = 'block';
            
            // Add event listener to clear wishlist button
            clearWishlistBtn.addEventListener('click', () => {
                clearWishlist();
            });
        }
    }
    
    function updateCartItemQuantity(productId, quantity) {
        // Find item in cart
        const cartItem = cart.find(item => item.id === productId);
        
        if (cartItem) {
            cartItem.quantity = quantity;
            
            // Update UI
            const cartItemElement = document.querySelector(`.cart-item[data-id="${productId}"]`);
            const priceElement = cartItemElement.querySelector('.cart-item-price');
            
            // Format with ৳ symbol
            priceElement.textContent = `৳${(cartItem.price * quantity).toLocaleString('en-IN')}`;
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const cartTotal = document.querySelector('.cart-total span:last-child');
            
            if (cartTotal) {
                cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
            }
            
            // Update cart count
            updateCartCount();
        }
    }
    
    function removeFromCart(productId) {
        // Find item index in cart
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            // Remove from cart array
            cart.splice(itemIndex, 1);
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            updateCartUI();
        }
    }
    
    function addItemToCart(product) {
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            cart.push(product);
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        updateCartUI();
        
        // Show cart sidebar
        cartSidebar.style.right = '0';
        wishlistSidebar.style.right = '-400px';
        overlay.style.display = 'block';
    }
    
    function removeFromWishlist(productId) {
        // Find item index in wishlist
        const itemIndex = wishlist.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            // Remove from wishlist array
            wishlist.splice(itemIndex, 1);
            
            // Save to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Update UI
            updateWishlistCount();
            updateWishlistUI();
        }
    }
    
    function clearWishlist() {
        // Clear wishlist array
        wishlist = [];
        
        // Save to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update UI
        updateWishlistCount();
        updateWishlistUI();
    }
    
    // Initialize FAQs
    function initFAQs() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Toggle active class on clicked item
                item.classList.toggle('active');
                
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        });
    }
    
    // Initialize Contact Form
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        const successModal = document.getElementById('successModal');
        const closeSuccessBtn = document.querySelector('.close-success-btn');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const subject = document.getElementById('subject').value;
                const message = document.getElementById('message').value;
                
                // Simple validation
                if (!name || !email || !subject || !message) {
                    showNotification('Please fill in all required fields.', 'error');
                    return;
                }
                
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showNotification('Please enter a valid email address.', 'error');
                    return;
                }
                
                // In a real application, you would send form data to server
                console.log('Form submitted:', { name, email, phone, subject, message });
                
                // Show success modal
                if (successModal) {
                    successModal.style.display = 'block';
                    overlay.style.display = 'block';
                    
                    // Reset form
                    contactForm.reset();
                }
            });
        }
        
        // Close success modal
        if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener('click', () => {
                successModal.style.display = 'none';
                overlay.style.display = 'none';
            });
        }
    }
    
    // Show notification function
    function showNotification(message, type = 'success') {
        // Remove any existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: white;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                border-radius: 5px;
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                z-index: 10000;
                min-width: 300px;
                transform: translateY(-20px);
                opacity: 0;
                animation: notificationSlideIn 0.3s forwards;
            }
            
            @keyframes notificationSlideIn {
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
            }
            
            .notification-content i {
                margin-right: 10px;
                font-size: 18px;
            }
            
            .notification.success {
                border-left: 4px solid #2ecc71;
            }
            
            .notification.info {
                border-left: 4px solid #3498db;
            }
            
            .notification.error {
                border-left: 4px solid #e74c3c;
            }
            
            .notification.success i {
                color: #2ecc71;
            }
            
            .notification.info i {
                color: #3498db;
            }
            
            .notification.error i {
                color: #e74c3c;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                transition: color 0.3s;
            }
            
            .notification-close:hover {
                color: #333;
            }
        `;
        
        document.head.appendChild(style);
        
        // Add close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'notificationSlideOut 0.3s forwards';
                
                // Add slide out animation
                const slideOutStyle = document.createElement('style');
                slideOutStyle.textContent = `
                    @keyframes notificationSlideOut {
                        to {
                            transform: translateY(-20px);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(slideOutStyle);
                
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }
});