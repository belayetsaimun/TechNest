// Deals Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timers
    initCountdowns();
    
    // Initialize Deal of the Day timer
    initDealOfTheDay();
    
    // Initialize Deal Categories Filter
    initDealCategories();
    
    // Initialize FAQ accordions
    initFaqAccordions();
    
    // Initialize Copy Coupon Buttons
    initCouponCopy();
    
    // Initialize Add to Cart Buttons
    initAddToCart();
    
    // Initialize Load More Button
    initLoadMore();
});

// Countdown Timer Logic
function initCountdowns() {
    // Main countdown in hero section
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7 days from now
    
    // Update hero countdown every second
    setInterval(() => {
        updateCountdown(endDate, 'days', 'hours', 'minutes', 'seconds');
    }, 1000);
    
    // Individual deal countdowns
    const dealTimers = document.querySelectorAll('.deal-timer');
    dealTimers.forEach(timer => {
        const expiryDate = new Date(timer.dataset.expires);
        const countdownElement = timer.querySelector('.deal-countdown');
        
        // Initial update
        updateDealCountdown(expiryDate, countdownElement);
        
        // Update every minute
        setInterval(() => {
            updateDealCountdown(expiryDate, countdownElement);
        }, 60000); // Every minute
    });
}

function updateCountdown(endDate, daysElementId, hoursElementId, minutesElementId, secondsElementId) {
    const now = new Date().getTime();
    const distance = endDate - now;
    
    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update DOM elements
    document.getElementById(daysElementId).textContent = days.toString().padStart(2, '0');
    document.getElementById(hoursElementId).textContent = hours.toString().padStart(2, '0');
    document.getElementById(minutesElementId).textContent = minutes.toString().padStart(2, '0');
    document.getElementById(secondsElementId).textContent = seconds.toString().padStart(2, '0');
}

function updateDealCountdown(endDate, countdownElement) {
    const now = new Date().getTime();
    const distance = endDate - now;
    
    if (distance <= 0) {
        countdownElement.textContent = 'Expired';
        countdownElement.parentElement.classList.add('expired');
        return;
    }
    
    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
    // Format countdown text
    let countdownText = '';
    if (days > 0) {
        countdownText += `${days}d `;
    }
    countdownText += `${hours}h ${minutes}m`;
    
    // Update element
    countdownElement.textContent = countdownText;
}

// Deal of the Day Timer
function initDealOfTheDay() {
    // Set end time to midnight tonight
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    // Update timer every second
    setInterval(() => {
        const currentTime = new Date();
        const timeLeft = endOfDay - currentTime;
        
        if (timeLeft <= 0) {
            // Reset to next day if passed
            endOfDay.setDate(endOfDay.getDate() + 1);
            return;
        }
        
        // Calculate hours, minutes, seconds
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Update DOM
        document.getElementById('dotd-hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('dotd-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('dotd-seconds').textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Deal Categories Filter
function initDealCategories() {
    const categoryButtons = document.querySelectorAll('.deal-category');
    const dealCards = document.querySelectorAll('.deal-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.dataset.category;
            
            // Filter deals
            dealCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    // Add animation
                    card.classList.add('fade-in');
                    setTimeout(() => {
                        card.classList.remove('fade-in');
                    }, 500);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// FAQ Accordions
function initFaqAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle active class on clicked item
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't already open
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Coupon Copy Functionality
function initCouponCopy() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    const notification = document.getElementById('couponNotification');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const couponCode = button.dataset.coupon;
            
            // Copy to clipboard
            navigator.clipboard.writeText(couponCode).then(() => {
                // Show notification
                notification.classList.add('show');
                
                // Change button text
                button.innerHTML = '<i class="fas fa-check"></i> Copied';
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
                
                // Hide notification after 3 seconds
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }).catch(err => {
                console.error('Could not copy coupon code: ', err);
            });
        });
    });
}

// Add to Cart Functionality
function initAddToCart() {
    const addToCartButtons = document.querySelectorAll('.btn');
    
    addToCartButtons.forEach(button => {
        if (button.innerHTML.includes('Add to Cart') || button.classList.contains('add-to-cart-btn')) {
            button.addEventListener('click', function(e) {
                // Prevent default button behavior
                e.preventDefault();
                
                // Get closest deal card or product info container
                const productElement = button.closest('.deal-card') || button.closest('.dotd-content');
                
                if (!productElement) return;
                
                // Get product name (if available)
                const productName = productElement.querySelector('h3') ? 
                                    productElement.querySelector('h3').textContent : 
                                    'Selected Product';
                
                // Get product price and image
                const price = getProductPrice(productElement);
                const image = getProductImage(productElement);
                
                // Create a product object
                const product = {
                    id: generateProductId(productName),
                    name: productName,
                    price: price,
                    image: image,
                    quantity: 1
                };
                
                // Add to cart
                addToCartHandler(product);
                
                // Add animation to the button
                button.classList.add('added');
                button.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
                
                // Reset button after animation
                setTimeout(() => {
                    button.classList.remove('added');
                    button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                }, 2000);
            });
        }
    });
    
    // Buy Now button
    const buyNowBtn = document.querySelector('.buy-now-btn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productElement = buyNowBtn.closest('.dotd-content');
            if (!productElement) return;
            
            const productName = productElement.querySelector('.dotd-title').textContent;
            const price = getProductPrice(productElement);
            const image = getProductImage(productElement);
            
            // Create product object
            const product = {
                id: generateProductId(productName),
                name: productName,
                price: price,
                image: image,
                quantity: 1
            };
            
            // Add to cart then redirect to checkout
            addToCartHandler(product);
            
            // Redirect to checkout page
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 500);
        });
    }
}

// Helper function to generate a consistent product ID
function generateProductId(productName) {
    return productName.toLowerCase().replace(/[^a-z0-9]/g, '') + Date.now().toString().slice(-4);
}

// Helper function to handle adding to cart
function addToCartHandler(product) {
    // Try to use the main site's cart function first
    if (typeof window.addToCart === 'function') {
        // If the main site has a function that takes a product card element
        const dummyCard = createDummyProductCard(product);
        window.addToCart(dummyCard);
        return;
    }
    
    if (typeof window.addItemToCart === 'function') {
        // If the main site has a function that takes a product object
        window.addItemToCart(product);
        return;
    }
    
    // Fallback if neither function exists
    addToCartFallback(product);
}

// Create a dummy product card element for compatibility with main site's addToCart function
function createDummyProductCard(product) {
    const dummyCard = document.createElement('div');
    dummyCard.className = 'product-card';
    dummyCard.dataset.id = product.id;
    dummyCard.dataset.name = product.name;
    dummyCard.dataset.price = product.price;
    dummyCard.dataset.image = product.image;
    return dummyCard;
}

// Helper function to get product price
function getProductPrice(productElement) {
    const priceElement = productElement.querySelector('.current-price');
    if (!priceElement) return 0;
    
    // Extract price from the element (removing currency symbol and commas)
    const priceText = priceElement.textContent;
    return parseFloat(priceText.replace(/[৳,]/g, ''));
}

// Helper function to get product image
function getProductImage(productElement) {
    // Check if element is deal card
    if (productElement.classList.contains('deal-card')) {
        const imgElement = productElement.querySelector('.deal-image img');
        return imgElement ? imgElement.src : '';
    }
    
    // If it's the Deal of the Day section
    if (productElement.classList.contains('dotd-content')) {
        const imgElement = document.querySelector('.dotd-image img');
        return imgElement ? imgElement.src : '';
    }
    
    return '';
}

// Fallback function if main script's cart functions are not available
function addToCartFallback(product) {
    console.log('Using cart fallback functionality');
    
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // Increase quantity if item already exists
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item to cart
        cart.push(product);
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart UI elements
    updateCartUIElements(cart);
    
    // Show cart sidebar if possible
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    if (cartSidebar && overlay) {
        cartSidebar.style.right = '0';
        overlay.style.display = 'block';
        
        // Update cart sidebar content
        updateCartSidebar(cart);
    }
    
    // Show notification
    showNotification(`Added ${product.name} to cart!`, 'success');
}

// Update cart UI elements (count, total, etc.)
function updateCartUIElements(cart) {
    // Update cart count badge
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Update cart total if visible
    const cartTotal = document.querySelector('.cart-total span:last-child');
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
    }
    
    // Try to use main site's update functions if available
    if (typeof window.updateCartCount === 'function') {
        window.updateCartCount();
    }
    
    if (typeof window.updateCartUI === 'function') {
        window.updateCartUI();
    }
}

// Update cart sidebar content with products
function updateCartSidebar(cart) {
    const cartItems = document.querySelector('.cart-items');
    if (!cartItems) return;
    
    // Clear existing items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart message
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <p>Your cart is empty</p>
                <a href="#featured" class="btn secondary-btn">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    // Create cart items
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
        
        // Add event listeners for cart item controls
        setupCartItemEventListeners(cartItem, cart);
    });
}

// Set up event listeners for cart item controls
function setupCartItemEventListeners(cartItem, cart) {
    const minusBtn = cartItem.querySelector('.minus');
    const plusBtn = cartItem.querySelector('.plus');
    const input = cartItem.querySelector('input');
    const removeBtn = cartItem.querySelector('.remove-item');
    const productId = cartItem.dataset.id;
    
    // Minus button
    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            if (!input) return;
            
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateCartItemQuantity(productId, currentValue - 1, cart);
            }
        });
    }
    
    // Plus button
    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            if (!input) return;
            
            const currentValue = parseInt(input.value);
            if (currentValue < 10) {
                input.value = currentValue + 1;
                updateCartItemQuantity(productId, currentValue + 1, cart);
            }
        });
    }
    
    // Input change
    if (input) {
        input.addEventListener('change', () => {
            let newValue = parseInt(input.value);
            
            // Ensure value is between 1 and 10
            if (isNaN(newValue) || newValue < 1) newValue = 1;
            if (newValue > 10) newValue = 10;
            
            input.value = newValue;
            updateCartItemQuantity(productId, newValue, cart);
        });
    }
    
    // Remove button
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            removeCartItem(productId, cart);
        });
    }
}

// Update cart item quantity
function updateCartItemQuantity(productId, quantity, cart) {
    // Find the item in the cart
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        // Update the quantity
        cart[itemIndex].quantity = quantity;
        
        // Update the UI
        const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);
        if (cartItem) {
            const priceElement = cartItem.querySelector('.cart-item-price');
            const itemPrice = cart[itemIndex].price * quantity;
            priceElement.textContent = `৳${itemPrice.toLocaleString('en-IN')}`;
        }
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart total and count
        updateCartUIElements(cart);
    }
}

// Remove item from cart
function removeCartItem(productId, cart) {
    // Find the item in the cart
    const itemIndex = cart.findIndex(item => item.id === productId);
    const item = cart[itemIndex];
    
    if (itemIndex !== -1) {
        // Remove the item from the cart
        cart.splice(itemIndex, 1);
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartUIElements(cart);
        updateCartSidebar(cart);
        
        // Show notification
        if (item) {
            showNotification(`Removed ${item.name} from cart!`, 'info');
        }
    }
}

// Simple notification function
function showNotification(message, type = 'success') {
    // Check if notification function exists in main script
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Create fallback notification if needed
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification ${type}`;
    
    notificationElement.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notificationElement);
    
    // Show notification
    setTimeout(() => {
        notificationElement.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notificationElement.classList.remove('show');
        setTimeout(() => {
            notificationElement.remove();
        }, 300);
    }, 3000);
}

// Load More Functionality
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', () => {
        // In a real site, this would load more deals via AJAX
        // For this example, we'll just simulate loading
        
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        // Simulate delay
        setTimeout(() => {
            loadMoreBtn.innerHTML = 'No More Deals Available';
            loadMoreBtn.disabled = true;
            loadMoreBtn.style.opacity = '0.5';
            loadMoreBtn.style.cursor = 'not-allowed';
        }, 1500);
    });
}

// Add CSS animation class
document.head.insertAdjacentHTML('beforeend', `
<style>
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease forwards;
    }
    
    @keyframes addedAnimation {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .primary-btn.added {
        animation: addedAnimation 0.5s ease;
        background-color: #2ecc71 !important;
        border-color: #2ecc71 !important;
    }
    
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
    }
    
    .notification-content i {
        font-size: 20px;
        margin-right: 10px;
    }
    
    .notification-content i.fa-check-circle {
        color: #2ecc71;
    }
    
    .notification-content i.fa-info-circle {
        color: #3498db;
    }
</style>
`);