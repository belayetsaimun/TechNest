document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const couponToggle = document.getElementById('coupon-toggle');
    const couponForm = document.querySelector('.coupon-form');
    const returnToCartBtn = document.getElementById('return-to-cart');
    const proceedPaymentBtn = document.getElementById('proceed-payment');
    const cartLink = document.getElementById('cartLink');
    
    // Cart and Wishlist Elements
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartCount = document.getElementById('header-cart-count');
    
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const closeWishlist = document.querySelector('.close-wishlist');
    const wishlistCount = document.querySelector('.wishlist-count');
    
    // Payment Modal Elements
    const paymentModal = document.getElementById('paymentModal');
    const backToShippingBtn = document.getElementById('back-to-shipping');
    const placeOrderBtn = document.getElementById('place-order');
    const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
    const cardPaymentForm = document.getElementById('card-payment-form');
    const mobilePaymentForm = document.getElementById('mobile-payment-form');
    const codPaymentForm = document.getElementById('cod-payment-form');
    
    // Success Modal Elements
    const successModal = document.getElementById('successModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const overlay = document.getElementById('overlay');
    
    // Initialize Cart and Wishlist from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Update counts based on localStorage
    updateCartCount();
    updateWishlistCount();
    
    // Load cart data into checkout summary
    loadCartToCheckout();
    
    // Handle Coupon Toggle
    if (couponToggle) {
        couponToggle.addEventListener('click', function(e) {
            e.preventDefault();
            if (couponForm.style.display === 'block') {
                couponForm.style.display = 'none';
            } else {
                couponForm.style.display = 'block';
            }
        });
    }
    
    // Handle Return to Cart
    if (returnToCartBtn) {
        returnToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Navigate back to the main page
            window.location.href = 'index.html';
        });
    }
    
    // Handle Cart Link
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Show cart sidebar
            cartSidebar.style.right = '0';
            overlay.style.display = 'block';
        });
    }
    
    // Handle Proceed to Payment
    if (proceedPaymentBtn) {
        proceedPaymentBtn.addEventListener('click', function() {
            // Validate form before proceeding
            if (validateShippingForm()) {
                // Show payment modal
                paymentModal.style.display = 'block';
                overlay.style.display = 'block';
                
                // Update step progress
                const shippingStep = document.querySelector('.progress-step:nth-child(3)');
                const paymentStep = document.querySelector('.progress-step:nth-child(5)');
                const shippingLine = document.querySelector('.progress-line:nth-child(4)');
                
                if (shippingStep && paymentStep && shippingLine) {
                    shippingStep.classList.add('active');
                    shippingLine.classList.add('active');
                    paymentStep.classList.add('active');
                }
            }
        });
    }
    
    // Handle Back to Shipping
    if (backToShippingBtn) {
        backToShippingBtn.addEventListener('click', function() {
            paymentModal.style.display = 'none';
            overlay.style.display = 'none';
            
            // Update step progress
            const shippingStep = document.querySelector('.progress-step:nth-child(3)');
            const paymentStep = document.querySelector('.progress-step:nth-child(5)');
            const shippingLine = document.querySelector('.progress-line:nth-child(4)');
            
            if (shippingStep && paymentStep && shippingLine) {
                paymentStep.classList.remove('active');
                shippingLine.classList.remove('active');
            }
        });
    }
    
    // Handle Payment Method Change
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            updatePaymentForm(this.value);
        });
    });
    
    // Handle Place Order
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            // Validate payment form before proceeding
            if (validatePaymentForm()) {
                // Hide payment modal
                paymentModal.style.display = 'none';
                
                // Update confirmation email in success modal
                const emailInput = document.getElementById('email');
                const confirmationEmail = document.getElementById('confirmation-email');
                if (emailInput && confirmationEmail) {
                    confirmationEmail.textContent = emailInput.value;
                }
                
                // Update payment method in success modal
                const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
                const paymentMethodDisplay = document.getElementById('payment-method-display');
                if (selectedPayment && paymentMethodDisplay) {
                    let paymentMethodText = "Credit Card";
                    
                    switch (selectedPayment.value) {
                        case 'bkash':
                            paymentMethodText = "bKash";
                            break;
                        case 'nagad':
                            paymentMethodText = "Nagad";
                            break;
                        case 'rocket':
                            paymentMethodText = "Rocket";
                            break;
                        case 'cod':
                            paymentMethodText = "Cash on Delivery";
                            break;
                    }
                    
                    paymentMethodDisplay.textContent = paymentMethodText;
                }
                
                // Update order date
                const orderDate = document.getElementById('order-date');
                if (orderDate) {
                    const today = new Date();
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    orderDate.textContent = today.toLocaleDateString('en-US', options);
                }
                
                // Update order total
                const orderTotal = document.getElementById('checkout-total');
                const successTotal = document.getElementById('success-order-total');
                if (orderTotal && successTotal) {
                    successTotal.textContent = orderTotal.textContent;
                }
                
                // Show success modal
                successModal.style.display = 'block';
                overlay.style.display = 'block';
                
                // Clear the cart after successful order
                localStorage.setItem('cart', JSON.stringify([]));
            }
        });
    }
    
    // Cart Functions
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.style.right = '0';
            overlay.style.display = 'block';
            
            // Update cart UI with latest data
            updateCartUI();
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }
    
    // Wishlist Functions
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            wishlistSidebar.style.right = '0';
            overlay.style.display = 'block';
            
            // Update wishlist UI with latest data
            updateWishlistUI();
        });
    }
    
    if (closeWishlist) {
        closeWishlist.addEventListener('click', () => {
            wishlistSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }
    
    // Close Modal Events
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            paymentModal.style.display = 'none';
            successModal.style.display = 'none';
            overlay.style.display = 'none';
        });
    });
    
    // Close modals when clicking overlay
    overlay.addEventListener('click', function() {
        paymentModal.style.display = 'none';
        successModal.style.display = 'none';
        cartSidebar.style.right = '-400px';
        wishlistSidebar.style.right = '-400px';
        overlay.style.display = 'none';
    });
    
    // Helper Functions
    function validateShippingForm() {
        // Get form elements
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const firstname = document.getElementById('firstname');
        const lastname = document.getElementById('lastname');
        const address = document.getElementById('address');
        const city = document.getElementById('city');
        const state = document.getElementById('state');
        const zipcode = document.getElementById('zipcode');
        
        // Simple validation - check if required fields are filled
        if (!email.value || !phone.value || !firstname.value || !lastname.value || 
            !address.value || !city.value || !state.value || !zipcode.value) {
            alert('Please fill in all required fields.');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            alert('Please enter a valid email address.');
            return false;
        }
        
        // Phone validation - basic format check
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phone.value.replace(/\D/g, ''))) {
            alert('Please enter a valid phone number.');
            return false;
        }
        
        return true;
    }
    
    function validatePaymentForm() {
        const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
        
        if (selectedPayment.value === 'card') {
            // Card payment validation
            const cardNumber = document.getElementById('card-number');
            const cardExpiry = document.getElementById('card-expiry');
            const cardCvv = document.getElementById('card-cvv');
            const cardName = document.getElementById('card-name');
            
            if (!cardNumber.value || !cardExpiry.value || !cardCvv.value || !cardName.value) {
                alert('Please fill in all card details.');
                return false;
            }
            
            // Basic card number validation (should be more robust in production)
            if (cardNumber.value.replace(/\D/g, '').length < 13) {
                alert('Please enter a valid card number.');
                return false;
            }
            
            // Basic expiry validation (MM/YY format)
            const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            if (!expiryRegex.test(cardExpiry.value)) {
                alert('Please enter a valid expiry date (MM/YY).');
                return false;
            }
            
            // Basic CVV validation (3-4 digits)
            const cvvRegex = /^[0-9]{3,4}$/;
            if (!cvvRegex.test(cardCvv.value)) {
                alert('Please enter a valid CVV.');
                return false;
            }
            
        } else if (selectedPayment.value === 'bkash' || selectedPayment.value === 'nagad' || selectedPayment.value === 'rocket') {
            // Mobile banking validation
            const mobileNumber = document.getElementById('mobile-number');
            
            if (!mobileNumber.value) {
                alert('Please enter your mobile number.');
                return false;
            }
            
            // Bangladesh mobile number validation (should start with 01)
            const mobileRegex = /^01[3-9][0-9]{8}$/;
            if (!mobileRegex.test(mobileNumber.value)) {
                alert('Please enter a valid mobile number (e.g., 01700000000).');
                return false;
            }
        }
        
        return true;
    }
    
    function updatePaymentForm(paymentMethod) {
        // Hide all payment forms
        cardPaymentForm.style.display = 'none';
        mobilePaymentForm.style.display = 'none';
        codPaymentForm.style.display = 'none';
        
        // Show the selected payment form
        switch (paymentMethod) {
            case 'bkash':
            case 'nagad':
            case 'rocket':
                mobilePaymentForm.style.display = 'block';
                break;
            case 'card':
                cardPaymentForm.style.display = 'block';
                break;
            case 'cod':
                codPaymentForm.style.display = 'block';
                break;
        }
    }
    
    function updateCartCount() {
        // Calculate total items in cart
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update all cart count badges
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }
    
    function updateWishlistCount() {
        // Update wishlist count badge
        const wishlistCountElements = document.querySelectorAll('.wishlist-count');
        wishlistCountElements.forEach(element => {
            element.textContent = wishlist.length;
        });
    }
    
    function updateCartUI() {
        // Get cart items container
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.getElementById('sidebar-cart-total');
        
        if (!cartItems || !cartTotal) return;
        
        // Clear cart items container
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            // Show empty cart message
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <p>Your cart is empty</p>
                    <a href="index.html#featured" class="btn secondary-btn">Start Shopping</a>
                </div>
            `;
            
            // Update cart total
            cartTotal.textContent = '$0.00';
            
        } else {
            // Create cart items
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.dataset.id = item.id;
                
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="10">
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <button class="remove-item"><i class="fas fa-trash"></i></button>
                `;
                
                cartItems.appendChild(cartItem);
                
                // Add event listeners to new elements
                const minusBtn = cartItem.querySelector('.minus');
                const plusBtn = cartItem.querySelector('.plus');
                const removeBtn = cartItem.querySelector('.remove-item');
                const input = cartItem.querySelector('input');
                
                minusBtn.addEventListener('click', () => {
                    const currentValue = parseInt(input.value);
                    if (currentValue > 1) {
                        input.value = currentValue - 1;
                        updateCartItemQuantity(item.id, currentValue - 1);
                    }
                });
                
                plusBtn.addEventListener('click', () => {
                    const currentValue = parseInt(input.value);
                    if (currentValue < 10) {
                        input.value = currentValue + 1;
                        updateCartItemQuantity(item.id, currentValue + 1);
                    }
                });
                
                removeBtn.addEventListener('click', () => {
                    removeFromCart(item.id);
                });
            });
            
            // Calculate cart total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Update cart total display
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
    }
    
    function updateWishlistUI() {
        // Get wishlist items container
        const wishlistItems = document.querySelector('.wishlist-items');
        const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');
        
        if (!wishlistItems || !clearWishlistBtn) return;
        
        // Clear wishlist items container
        wishlistItems.innerHTML = '';
        
        if (wishlist.length === 0) {
            // Show empty wishlist message
            wishlistItems.innerHTML = `
                <div class="empty-wishlist">
                    <div class="empty-wishlist-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <p>Your wishlist is empty</p>
                    <a href="index.html#featured" class="btn secondary-btn">Discover Products</a>
                </div>
            `;
            
            // Hide clear wishlist button
            clearWishlistBtn.style.display = 'none';
        } else {
            // Create wishlist items
            wishlist.forEach(item => {
                const wishlistItem = document.createElement('div');
                wishlistItem.className = 'wishlist-item';
                wishlistItem.dataset.id = item.id;
                
                wishlistItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="wishlist-item-info">
                        <h4>${item.name}</h4>
                        <p class="wishlist-item-price">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="move-to-cart"><i class="fas fa-shopping-cart"></i></button>
                        <button class="remove-from-wishlist"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                wishlistItems.appendChild(wishlistItem);
                
                // Add event listeners to new buttons
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
            
            // Show clear wishlist button
            clearWishlistBtn.style.display = 'block';
            
            // Add event listener to clear wishlist button
            clearWishlistBtn.addEventListener('click', () => {
                clearWishlist();
            });
        }
    }
    
    function addItemToCart(product) {
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            // Increase quantity if item already exists
            existingItem.quantity += product.quantity;
        } else {
            // Add new item to cart
            cart.push(product);
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        updateCartUI();
        
        // Reload checkout summary if on checkout page
        loadCartToCheckout();
    }
    
    function removeFromCart(productId) {
        // Find the item in the cart
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            // Remove the item from the cart
            cart.splice(itemIndex, 1);
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            updateCartUI();
            
            // Reload checkout summary if on checkout page
            loadCartToCheckout();
        }
    }
    
    function updateCartItemQuantity(productId, quantity) {
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
                priceElement.textContent = `$${itemPrice.toFixed(2)}`;
            }
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const cartTotal = document.getElementById('sidebar-cart-total');
            if (cartTotal) {
                cartTotal.textContent = `$${total.toFixed(2)}`;
            }
            
            // Reload checkout summary if on checkout page
            loadCartToCheckout();
        }
    }
    
    function removeFromWishlist(productId) {
        // Find the item in the wishlist
        const itemIndex = wishlist.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            // Remove the item from the wishlist
            wishlist.splice(itemIndex, 1);
            
            // Save wishlist to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Update UI
            updateWishlistCount();
            updateWishlistUI();
        }
    }
    
    function clearWishlist() {
        // Clear wishlist array
        wishlist = [];
        
        // Save empty wishlist to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update UI
        updateWishlistCount();
        updateWishlistUI();
    }
    
    // Function to load cart data and display in checkout summary
    function loadCartToCheckout() {
        // Get order summary elements
        const orderItems = document.getElementById('checkout-order-items');
        const orderCount = document.getElementById('order-count');
        const subtotalElement = document.getElementById('checkout-subtotal');
        const taxElement = document.getElementById('checkout-tax');
        const totalElement = document.getElementById('checkout-total');
        
        // If not on checkout page, exit function
        if (!orderItems || !orderCount || !subtotalElement || !taxElement || !totalElement) {
            return;
        }
        
        // Clear order items
        orderItems.innerHTML = '';
        
        if (cart.length === 0) {
            // Show empty cart message
            orderItems.innerHTML = `
                <div class="empty-order-items">
                    <p>No items in cart. Please add products first.</p>
                    <a href="index.html" class="btn secondary-btn">Return to Shop</a>
                </div>
            `;
            
            // Update counts and totals
            orderCount.textContent = '(0 items)';
            subtotalElement.textContent = '$0.00';
            taxElement.textContent = '$0.00';
            totalElement.textContent = '$0.00';
            
            // Disable proceed button
            const proceedPaymentBtn = document.getElementById('proceed-payment');
            if (proceedPaymentBtn) {
                proceedPaymentBtn.disabled = true;
                proceedPaymentBtn.classList.add('disabled-btn');
            }
        } else {
            // Calculate totals
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.09; // Assuming 9% tax rate
            const total = subtotal + tax;
            
            // Update count text
            const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
            orderCount.textContent = `(${itemCount} item${itemCount > 1 ? 's' : ''})`;
            
            // Display each item in the order summary
            cart.forEach(item => {
                const orderItem = document.createElement('div');
                orderItem.className = 'order-item';
                orderItem.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                        <span class="item-quantity">${item.quantity}</span>
                    </div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p class="item-variant">Quantity: ${item.quantity}</p>
                    </div>
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                `;
                
                orderItems.appendChild(orderItem);
            });
            
            // Update totals
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            taxElement.textContent = `$${tax.toFixed(2)}`;
            totalElement.textContent = `$${total.toFixed(2)}`;
            
            // Enable proceed button
            const proceedPaymentBtn = document.getElementById('proceed-payment');
            if (proceedPaymentBtn) {
                proceedPaymentBtn.disabled = false;
                proceedPaymentBtn.classList.remove('disabled-btn');
            }
        }
    }
    
    // Input Formatting
    const cardNumberInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            // Format card number: XXXX XXXX XXXX XXXX
            let value = this.value.replace(/\D/g, '');
            if (value.length > 16) value = value.slice(0, 16);
            
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            this.value = formattedValue;
        });
    }
    
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function() {
            // Format expiry date: MM/YY
            let value = this.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);
            
            if (value.length > 2) {
                this.value = value.slice(0, 2) + '/' + value.slice(2);
            } else {
                this.value = value;
            }
        });
    }
    
    // Initialize page
    // Set default payment method
    updatePaymentForm('card');
});