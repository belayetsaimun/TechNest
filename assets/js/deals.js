document.addEventListener('DOMContentLoaded', function() {
    console.log('Deals page script initialized');

    // State management
    const cartKey = typeof currentUserId !== 'undefined' && currentUserId ? `cart_${currentUserId}` : 'cart_guest';
    const wishlistKey = typeof currentUserId !== 'undefined' && currentUserId ? `wishlist_${currentUserId}` : 'wishlist_guest';

    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    let wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
    
    // Use global notification tracking to prevent duplicates
    window.activeNotifications = window.activeNotifications || [];

    // Initialize all components
    initCountdowns();
    initDealOfTheDay();
    initDealCategories();
    initCouponCopy();
    initQuickView();
    initCartActions();
    initCartSidebar();
    initWishlistSidebar();
    initLoadMore();
    initFaqAccordion();

    // Update UI on page load
    updateCartCount(cart);
    updateWishlistCount(wishlist);
    updateWishlistIcons(wishlist);

    function initCountdowns() {
        // Main page countdown
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7); // 7 days from now
        
        const interval = setInterval(function() {
            updateCountdown(
                endDate, 
                'days', 
                'hours', 
                'minutes', 
                'seconds'
            );
        }, 1000);

        // Individual deal countdowns
        document.querySelectorAll('.deal-timer').forEach(timer => {
            const expires = timer.dataset.expires;
            if (!expires) return;
            
            const expiryDate = new Date(expires);
            setInterval(() => {
                updateDealCountdown(expiryDate, timer.querySelector('.deal-countdown'));
            }, 1000);
        });
    }

    function updateCountdown(endDate, daysElementId, hoursElementId, minutesElementId, secondsElementId) {
        const now = new Date().getTime();
        const distance = endDate - now;
        
        // If countdown is finished
        if (distance < 0) {
            document.getElementById(daysElementId).textContent = "00";
            document.getElementById(hoursElementId).textContent = "00";
            document.getElementById(minutesElementId).textContent = "00";
            document.getElementById(secondsElementId).textContent = "00";
            return;
        }
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result
        document.getElementById(daysElementId).textContent = days.toString().padStart(2, '0');
        document.getElementById(hoursElementId).textContent = hours.toString().padStart(2, '0');
        document.getElementById(minutesElementId).textContent = minutes.toString().padStart(2, '0');
        document.getElementById(secondsElementId).textContent = seconds.toString().padStart(2, '0');
    }

    function updateDealCountdown(endDate, countdownElement) {
        if (!countdownElement) return;
        
        const now = new Date().getTime();
        const distance = endDate - now;
        
        if (distance < 0) {
            countdownElement.innerHTML = '<span class="expired">Expired</span>';
            return;
        }
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }

    // Deal of the Day Timer
    function initDealOfTheDay() {
        // Set timer for 24 hours from now
        const dotdEnd = new Date();
        dotdEnd.setHours(dotdEnd.getHours() + 24);
        
        // Update the timer every second
        setInterval(() => {
            const now = new Date().getTime();
            const distance = dotdEnd - now;
            
            if (distance < 0) {
                document.getElementById('dotd-hours').textContent = "00";
                document.getElementById('dotd-minutes').textContent = "00";
                document.getElementById('dotd-seconds').textContent = "00";
                return;
            }
            
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('dotd-hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('dotd-minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('dotd-seconds').textContent = seconds.toString().padStart(2, '0');
        }, 1000);

        // Add event listeners to Deal of the Day buttons
        const buyNowBtn = document.querySelector('.dotd-actions .buy-now-btn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Create a product object for the Deal of the Day
                const dotdProduct = {
                    id: 'dotd-macbook-pro',
                    name: 'MacBook Pro M3',
                    price: 189999,
                    image: 'assets/images/macprom3.png',
                    category: 'laptops',
                    brand: 'Apple',
                    quantity: 1
                };
                
                // Clear cart and add only this item for direct checkout
                cart = [dotdProduct];
                localStorage.setItem(cartKey, JSON.stringify(cart));
                
                // Redirect to checkout
                window.location.href = "checkout.php";
            });
        }

        const addToCartBtn = document.querySelector('.dotd-actions .add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                // Create a product object for the Deal of the Day
                const dotdProduct = {
                    id: 'dotd-macbook-pro',
                    name: 'MacBook Pro M3',
                    price: 189999,
                    image: 'assets/images/macprom3.png',
                    category: 'laptops',
                    brand: 'Apple',
                    quantity: 1
                };
                
                addItemToCart(dotdProduct);
            });
        }
    }

    // Deal Categories Filter
    function initDealCategories() {
        const categoryButtons = document.querySelectorAll('.deal-category');
        const dealCards = document.querySelectorAll('.deal-card');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                
                // Update active button state
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter deals
                dealCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Coupon Copy Functionality
    function initCouponCopy() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const couponCode = this.dataset.coupon;
                
                // Create temporary input to copy from
                const tempInput = document.createElement('input');
                tempInput.value = couponCode;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                
                // Update button text temporarily
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
                
                showNotification(`Coupon code "${couponCode}" copied to clipboard!`, 'success');
            });
        });
    }

    // Quick View Modal
    function initQuickView() {
        // The custom quick view implementation has replaced this
        // This function is kept as a legacy placeholder
    }

    // Main cart function - fixed to show sidebar instantly
    function addItemToCart(product) {
        console.log("Adding to cart from deals page:", product);
        
        // Check if product already in cart
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex > -1) {
            // Update quantity if already in cart
            cart[existingItemIndex].quantity += product.quantity || 1;
        } else {
            // Add new item to cart
            cart.push({
                ...product,
                quantity: product.quantity || 1
            });
        }
        
        // Save to localStorage
        localStorage.setItem(cartKey, JSON.stringify(cart));
        
        // Update UI
        updateCartCount(cart);
        
        // Show notification
        showNotification(`${product.name} added to your cart!`, 'success');
        
        // Update and show the cart sidebar immediately
        updateCartUI(cart);
        showCartSidebar();
        
        // Dispatch event for other scripts
        document.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { product, cart, action: 'add', source: 'deals' }
        }));
    }

    // Show Notification - FIXED to prevent duplicate notifications using global tracking
    function showNotification(message, type = 'success') {
        // Check if notification with same message already exists
        if (window.activeNotifications.includes(message)) {
            console.log("Prevented duplicate notification:", message);
            return;
        }
        
        // Add to global active notifications
        window.activeNotifications.push(message);
        
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconClass = type === 'success' ? 'fa-check-circle' : 
                          type === 'error' ? 'fa-exclamation-circle' : 
                          'fa-info-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${iconClass}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        container.appendChild(notification);
        
        notification.querySelector('.notification-close').addEventListener('click', function() {
            removeNotification(notification, message);
        });
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                removeNotification(notification, message);
            }
        }, 3000);
    }
    
    function removeNotification(notification, message) {
        notification.classList.add('fade-out');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
                
                // Remove from active notifications
                const index = window.activeNotifications.indexOf(message);
                if (index > -1) {
                    window.activeNotifications.splice(index, 1);
                }
            }
        }, 300);
    }

    // Cart UI functionality
    function initCartSidebar() {
        const cartBtn = document.getElementById('cartBtn');
        const closeCartBtn = document.querySelector('.close-cart');
        const continueShopping = document.querySelector('.continue-shopping');
        const overlay = document.getElementById('overlay');
        
        if (cartBtn) {
            cartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showCartSidebar();
            });
        }
        
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', function() {
                hideCartSidebar();
            });
        }
        
        if (continueShopping) {
            continueShopping.addEventListener('click', function() {
                hideCartSidebar();
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', function() {
                hideCartSidebar();
                hideWishlistSidebar();
            });
        }
    }

    function showCartSidebar() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const overlay = document.getElementById('overlay');
        
        if (cartSidebar) {
            updateCartUI(cart);
            cartSidebar.style.right = '0';
            if (overlay) overlay.style.display = 'block';
        }
    }

    function hideCartSidebar() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const overlay = document.getElementById('overlay');
        
        if (cartSidebar) {
            cartSidebar.style.right = '-400px';
            if (overlay && !document.querySelector('.wishlist-sidebar[style*="right: 0"]')) {
                overlay.style.display = 'none';
            }
        }
    }

    function updateCartUI(cart) {
        console.log("Updating cart UI in deals.js");
        const cartSidebar = document.querySelector('.cart-sidebar');
        if (!cartSidebar) {
            console.error("Cart sidebar not found");
            return;
        }
        
        const cartItems = cartSidebar.querySelector('.cart-items');
        const emptyCart = cartSidebar.querySelector('.empty-cart');
        const cartSummary = cartSidebar.querySelector('.cart-summary');
        
        if (!cartItems || !emptyCart || !cartSummary) {
            console.error("Required cart elements not found");
            return;
        }
        
        // Update cart count
        updateCartCount(cart);
        
        // Clear current items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            // Show empty cart message
            emptyCart.style.display = 'flex';
            cartSummary.style.display = 'none';
        } else {
            // Hide empty cart message and show summary
            emptyCart.style.display = 'none';
            cartSummary.style.display = 'block';
            
            let subtotal = 0;
            
            cart.forEach(item => {
                const itemPrice = parseFloat(item.price);
                const itemQuantity = parseInt(item.quantity);
                const itemTotal = itemPrice * itemQuantity;
                subtotal += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.dataset.id = item.id;
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">৳${itemTotal.toLocaleString()}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" value="${itemQuantity}" min="1" max="10" readonly>
                            <button class="quantity-btn plus" data-id="${item.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItems.appendChild(cartItem);
            });
            
            // Add event listeners for cart controls
            attachCartItemEventListeners(cartItems);
            
            // Calculate shipping and total
            const shipping = subtotal > 50000 ? 0 : 150;
            const total = subtotal + shipping;
            
            // Update summary
            cartSidebar.querySelector('.cart-subtotal').textContent = `৳${subtotal.toLocaleString()}`;
            cartSidebar.querySelector('.cart-shipping').textContent = shipping === 0 ? 'Free' : `৳${shipping}`;
            cartSidebar.querySelector('.cart-total').textContent = `৳${total.toLocaleString()}`;
        }
    }

    function attachCartItemEventListeners(cartItems) {
        const minusBtns = cartItems.querySelectorAll('.quantity-btn.minus');
        const plusBtns = cartItems.querySelectorAll('.quantity-btn.plus');
        const removeItemBtns = cartItems.querySelectorAll('.remove-item');
        
        minusBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                updateCartItemQuantity(this.dataset.id, -1);
            });
        });
        
        plusBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                updateCartItemQuantity(this.dataset.id, 1);
            });
        });
        
        removeItemBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                removeCartItem(this.dataset.id);
            });
        });
    }

    function updateCartItemQuantity(itemId, change) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) return;
        
        const newQuantity = cart[itemIndex].quantity + change;
        
        if (newQuantity <= 0) {
            // Remove the item if quantity would be 0 or less
            removeCartItem(itemId);
            return;
        }
        
        if (newQuantity > 10) {
            showNotification("Maximum quantity is 10 per item.", "info");
            return;
        }
        
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem(cartKey, JSON.stringify(cart));
        updateCartUI(cart);
        
        // Fire event for other scripts
        document.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { itemId, change, cart, action: 'updateQuantity', source: 'deals' }
        }));
    }

    function removeCartItem(itemId) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) return;
        
        const removedItem = cart[itemIndex];
        cart.splice(itemIndex, 1);
        
        localStorage.setItem(cartKey, JSON.stringify(cart));
        updateCartUI(cart);
        
        showNotification(`${removedItem.name} removed from cart.`, 'info');
        
        // Fire event for other scripts
        document.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { itemId, cart, action: 'remove', removedItem, source: 'deals' }
        }));
    }

    function updateCartCount(cart) {
        const count = cart.reduce((total, item) => total + parseInt(item.quantity || 1), 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = count;
            // Add animation
            element.classList.add('pulse');
            setTimeout(() => element.classList.remove('pulse'), 500);
        });
    }

    // Wishlist functionality
    function initWishlistSidebar() {
        const wishlistBtn = document.getElementById('wishlistBtn');
        const closeWishlistBtn = document.querySelector('.close-wishlist');
        const overlay = document.getElementById('overlay');
        
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showWishlistSidebar();
            });
        }
        
        if (closeWishlistBtn) {
            closeWishlistBtn.addEventListener('click', function() {
                hideWishlistSidebar();
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', function() {
                hideWishlistSidebar();
                hideCartSidebar();
            });
        }
        
        // Clear wishlist button
        const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');
        if (clearWishlistBtn) {
            clearWishlistBtn.addEventListener('click', function() {
                if (wishlist.length === 0) return;
                
                if (confirm('Are you sure you want to clear your entire wishlist?')) {
                    wishlist = [];
                    localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
                    updateWishlistUI(wishlist);
                    updateWishlistIcons(wishlist);
                    showNotification('Wishlist has been cleared.', 'info');
                }
            });
        }
    }

    function showWishlistSidebar() {
        const wishlistSidebar = document.querySelector('.wishlist-sidebar');
        const overlay = document.getElementById('overlay');
        
        if (wishlistSidebar) {
            updateWishlistUI(wishlist);
            wishlistSidebar.style.right = '0';
            if (overlay) overlay.style.display = 'block';
        }
    }

    function hideWishlistSidebar() {
        const wishlistSidebar = document.querySelector('.wishlist-sidebar');
        const overlay = document.getElementById('overlay');
        
        if (wishlistSidebar) {
            wishlistSidebar.style.right = '-400px';
            if (overlay && !document.querySelector('.cart-sidebar[style*="right: 0"]')) {
                overlay.style.display = 'none';
            }
        }
    }

    function updateWishlistUI(wishlist) {
        const wishlistSidebar = document.querySelector('.wishlist-sidebar');
        if (!wishlistSidebar) return;
        
        const wishlistItems = wishlistSidebar.querySelector('.wishlist-items');
        const emptyWishlist = wishlistSidebar.querySelector('.empty-wishlist');
        const wishlistActions = wishlistSidebar.querySelector('.wishlist-actions');
        
        // Update wishlist count
        updateWishlistCount(wishlist.length);
        
        // Clear existing items
        wishlistItems.innerHTML = '';
        
        if (wishlist.length === 0) {
            // Show empty wishlist message
            if (emptyWishlist) emptyWishlist.style.display = 'flex';
            if (wishlistActions) wishlistActions.style.display = 'none';
        } else {
            // Hide empty wishlist message and show actions
            if (emptyWishlist) emptyWishlist.style.display = 'none';
            if (wishlistActions) wishlistActions.style.display = 'flex';
            
            // Generate wishlist items
            wishlist.forEach(item => {
                const wishlistItem = document.createElement('div');
                wishlistItem.className = 'wishlist-item';
                wishlistItem.dataset.id = item.id;
                wishlistItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="wishlist-item-info">
                        <h4>${item.name}</h4>
                        <p class="wishlist-item-price">৳${parseFloat(item.price).toLocaleString()}</p>
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="move-to-cart" data-id="${item.id}" title="Add to Cart">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="remove-from-wishlist" data-id="${item.id}" title="Remove">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                wishlistItems.appendChild(wishlistItem);
            });
            
            // Add event listeners for wishlist items
            attachWishlistItemListeners(wishlistItems);
        }
    }

    function attachWishlistItemListeners(wishlistItems) {
        const moveToCartButtons = wishlistItems.querySelectorAll('.move-to-cart');
        const removeButtons = wishlistItems.querySelectorAll('.remove-from-wishlist');
        
        moveToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                moveToCart(this.dataset.id);
            });
        });
        
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                removeFromWishlist(this.dataset.id);
            });
        });
    }

    function moveToCart(itemId) {
        const itemIndex = wishlist.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        
        const item = {...wishlist[itemIndex], quantity: 1};
        
        // Add to cart
        addItemToCart(item);
        
        // Remove from wishlist
        removeFromWishlist(itemId);
    }

    function removeFromWishlist(itemId) {
        const itemIndex = wishlist.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        
        const itemName = wishlist[itemIndex].name;
        
        wishlist.splice(itemIndex, 1);
        localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
        
        updateWishlistUI(wishlist);
        updateWishlistIcons(wishlist);
        
        showNotification(`${itemName} removed from wishlist.`, 'info');
        
        // Dispatch event for other scripts
        document.dispatchEvent(new CustomEvent('wishlistUpdated', { 
            detail: { itemId, wishlist, action: 'remove', source: 'deals' }
        }));
    }

    function updateWishlistCount(count) {
        const wishlistCountElements = document.querySelectorAll('.wishlist-count');
        wishlistCountElements.forEach(element => {
            element.textContent = count;
        });
    }

    function updateWishlistIcons(wishlist) {
        const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
        
        wishlistButtons.forEach(button => {
            const productCard = button.closest('.deal-card, .product-card');
            if (!productCard) return;
            
            const productId = productCard.dataset.id;
            const inWishlist = wishlist.some(item => item.id === productId);
            
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = inWishlist ? 'fas fa-heart' : 'far fa-heart';
            }
        });
    }
    
    // Initialize cart functionality
    function initCartActions() {
        // Add to cart buttons
        document.addEventListener('click', function(e) {
            const addToCartBtn = e.target.closest('.add-to-cart');
            if (!addToCartBtn) return;
            
            e.preventDefault();
            
            const productCard = addToCartBtn.closest('.deal-card, .product-card');
            if (!productCard) return;
            
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: parseFloat(productCard.dataset.price),
                image: productCard.dataset.image,
                category: productCard.dataset.category,
                brand: productCard.dataset.brand,
                quantity: 1
            };
            
            addItemToCart(product);
        });
        
        // Add to wishlist buttons
        document.addEventListener('click', function(e) {
            const wishlistBtn = e.target.closest('.add-to-wishlist');
            if (!wishlistBtn) return;
            
            e.preventDefault();
            
            const productCard = wishlistBtn.closest('.deal-card, .product-card');
            if (!productCard) return;
            
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: parseFloat(productCard.dataset.price),
                image: productCard.dataset.image,
                category: productCard.dataset.category,
                brand: productCard.dataset.brand
            };
            
            toggleWishlistItem(product, wishlistBtn);
        });
    }
    
    function toggleWishlistItem(product, button) {
        // Check if product already in wishlist
        const existingItemIndex = wishlist.findIndex(item => item.id === product.id);
        
        if (existingItemIndex > -1) {
            // Remove from wishlist
            wishlist.splice(existingItemIndex, 1);
            
            // Update button icon
            if (button && button.querySelector('i')) {
                button.querySelector('i').className = 'far fa-heart';
            }
            
            showNotification(`${product.name} removed from your wishlist.`, 'info');
        } else {
            // Add to wishlist
            wishlist.push(product);
            
            // Update button icon
            if (button && button.querySelector('i')) {
                button.querySelector('i').className = 'fas fa-heart';
            }
            
            showNotification(`${product.name} added to your wishlist!`, 'success');
            
            // Show wishlist sidebar immediately
            updateWishlistUI(wishlist);
            showWishlistSidebar();
        }
        
        // Save to localStorage
        localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
        
        // Update count and icons
        updateWishlistCount(wishlist.length);
        updateWishlistIcons(wishlist);
        
        // Dispatch event for other scripts
        document.dispatchEvent(new CustomEvent('wishlistUpdated', { 
            detail: { 
                product, 
                wishlist, 
                action: existingItemIndex > -1 ? 'remove' : 'add', 
                source: 'deals' 
            }
        }));
    }
    
    // Load more button functionality
    function initLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;
        
        let visibleCards = 8;
        const dealCards = document.querySelectorAll('.deal-card');
        
        // Initially hide cards beyond the visible limit
        if (dealCards.length > visibleCards) {
            for (let i = visibleCards; i < dealCards.length; i++) {
                dealCards[i].style.display = 'none';
            }
            
            loadMoreBtn.style.display = 'flex';
        } else {
            loadMoreBtn.style.display = 'none';
        }
        
        loadMoreBtn.addEventListener('click', function() {
            // Show more cards
            const nextBatch = Math.min(visibleCards + 4, dealCards.length);
            
            for (let i = visibleCards; i < nextBatch; i++) {
                dealCards[i].style.display = 'flex';
                dealCards[i].classList.add('fade-in');
            }
            
            visibleCards = nextBatch;
            
            // Hide button if all cards are visible
            if (visibleCards >= dealCards.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }

    // Listen for cart updates from other scripts
    document.addEventListener('cartUpdated', function(event) {
        // Only process events from other sources
        if (event.detail.source !== 'deals') {
            console.log('Cart updated from external script:', event.detail);
            cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
            updateCartCount(cart);
            
            // If cart sidebar is currently visible, update its contents
            const cartSidebar = document.querySelector('.cart-sidebar');
            if (cartSidebar && cartSidebar.style.right === '0px') {
                updateCartUI(cart);
            }
        }
    });

    // Listen for wishlist updates from other scripts
    document.addEventListener('wishlistUpdated', function(event) {
        // Only process events from other sources
        if (event.detail.source !== 'deals') {
            wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
            updateWishlistCount(wishlist.length);
            updateWishlistIcons(wishlist);
            
            // If wishlist sidebar is currently visible, update its contents
            const wishlistSidebar = document.querySelector('.wishlist-sidebar');
            if (wishlistSidebar && wishlistSidebar.style.right === '0px') {
                updateWishlistUI(wishlist);
            }
        }
    });

    function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    const questions = document.querySelectorAll('.faq-question');

    if (!questions.length) {
        return;
    }

    // Make the first item active by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }

    questions.forEach(question => {
        question.addEventListener('click', () => {
            const parentItem = question.closest('.faq-item');

            // If the clicked item is already active, close it. Otherwise, handle accordion logic.
            if (parentItem.classList.contains('active')) {
                parentItem.classList.remove('active');
            } else {
                // Remove 'active' from all other items
                faqItems.forEach(item => {
                    item.classList.remove('active');
                });

                // Add 'active' to the clicked item's parent
                parentItem.classList.add('active');
            }
        });
    });
}
    
    // Make functions available globally for other scripts
    window.addItemToCart = addItemToCart;
    window.showNotification = showNotification;
    window.removeNotification = removeNotification;
    window.showCartSidebar = showCartSidebar;
    window.updateCartUI = updateCartUI;
    window.updateWishlistUI = updateWishlistUI;
    window.showWishlistSidebar = showWishlistSidebar;
});