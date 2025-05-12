// Cart Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cartItemsTable = document.getElementById('cartItemsTable');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartTableContainer = document.getElementById('cartTableContainer');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const updateCartBtn = document.getElementById('updateCartBtn');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const cartDiscount = document.getElementById('cartDiscount');
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoCodeInput = document.getElementById('promoCode');
    const cartCount = document.querySelector('.cart-count');
    const proceedToCheckoutBtn = document.getElementById('proceedToCheckoutBtn');
    
    // Shipping options
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    
    // Initialize cart from localStorage
    let cart = [];
    let discount = 0;
    let activePromoCode = '';
    
    // Promo codes (in a real application, these would be stored on the server)
    const promoCodes = [
        { code: 'WELCOME10', discount: 0.1, minAmount: 10000 },
        { code: 'SUMMER25', discount: 0.25, minAmount: 50000 }
    ];
    
    initializeCart();
    
    // Event Listeners
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    if (updateCartBtn) {
        updateCartBtn.addEventListener('click', updateCart);
    }
    
    if (applyPromoBtn && promoCodeInput) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    // Add event listeners for shipping option changes
    shippingOptions.forEach(option => {
        option.addEventListener('change', updateOrderSummary);
    });
    
    // Setup event listeners for cart items
    setupCartItemEventListeners();
    
    // Functions
    function initializeCart() {
        try {
            // Get cart from localStorage
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
                console.log('Loaded cart from localStorage:', cart);
            } else {
                cart = [];
                console.log('No saved cart found, initialized empty cart');
            }
            
            // Update UI
            updateCartCount();
            updateCartUI();
        } catch (error) {
            console.error('Error initializing cart:', error);
            // Reset cart if there's an error
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
    
    function updateCartCount() {
        if (cartCount) {
            // Calculate total items in cart
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
    
    function updateCartUI() {
        if (!cartItemsTable || !emptyCartMessage || !cartTableContainer) return;
        
        if (cart.length === 0) {
            // Show empty cart message
            cartTableContainer.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            
            // Hide clear cart and update buttons
            if (clearCartBtn) clearCartBtn.style.display = 'none';
            if (updateCartBtn) updateCartBtn.style.display = 'none';
            
            // Hide checkout button or disable it
            if (proceedToCheckoutBtn) {
                proceedToCheckoutBtn.classList.add('disabled');
                proceedToCheckoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showNotification('Your cart is empty. Add some products first!', 'error');
                });
            }
        } else {
            // Show cart table and hide empty message
            cartTableContainer.style.display = 'block';
            emptyCartMessage.style.display = 'none';
            
            // Show clear cart and update buttons
            if (clearCartBtn) clearCartBtn.style.display = 'inline-block';
            if (updateCartBtn) updateCartBtn.style.display = 'inline-block';
            
            // Enable checkout button
            if (proceedToCheckoutBtn) {
                proceedToCheckoutBtn.classList.remove('disabled');
                // Remove any click event listeners
                const newBtn = proceedToCheckoutBtn.cloneNode(true);
                proceedToCheckoutBtn.parentNode.replaceChild(newBtn, proceedToCheckoutBtn);
                proceedToCheckoutBtn = newBtn;
            }
            
            // Render cart items
            renderCartItems();
            
            // Update order summary
            updateOrderSummary();
        }
    }
    
    function renderCartItems() {
        if (!cartItemsTable) return;
        
        // Clear current cart items
        cartItemsTable.innerHTML = '';
        
        // Render each cart item
        cart.forEach(item => {
            const cartItem = document.createElement('tr');
            cartItem.className = 'cart-item';
            cartItem.dataset.id = item.id;
            
            // Get color variant from image path
            const colorVariant = getColorVariant(item.image);
            
            // Calculate item subtotal
            const subtotal = item.price * item.quantity;
            
            // Generate HTML for the cart item
            cartItem.innerHTML = `
                <td class="product-remove">
                    <button class="remove-item" data-id="${item.id}"><i class="fas fa-times"></i></button>
                </td>
                <td class="product-thumbnail">
                    <a href="product-details.html?id=${item.id}">
                        <img src="${item.image}" alt="${item.name}">
                    </a>
                </td>
                <td class="product-name">
                    <a href="product-details.html?id=${item.id}">${item.name}</a>
                    ${colorVariant ? `<div class="product-variant">Color: ${colorVariant}</div>` : ''}
                </td>
                <td class="product-price">
                    <span>৳${item.price.toLocaleString('en-IN')}</span>
                </td>
                <td class="product-quantity">
                    <div class="quantity-selector">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="10" class="qty-input" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </td>
                <td class="product-subtotal">
                    <span>৳${subtotal.toLocaleString('en-IN')}</span>
                </td>
            `;
            
            cartItemsTable.appendChild(cartItem);
        });
        
        // Re-attach event listeners to new elements
        setupCartItemEventListeners();
    }
    
    function getColorVariant(imagePath) {
        // Extract color variant from image path
        if (imagePath.includes('W.png')) return 'White';
        if (imagePath.includes('B.png')) return 'Black';
        if (imagePath.includes('BL.png')) return 'Blue';
        return '';
    }
    
    function setupCartItemEventListeners() {
        // Remove item buttons
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                removeFromCart(productId);
            });
        });
        
        // Quantity inputs
        const qtyInputs = document.querySelectorAll('.qty-input');
        qtyInputs.forEach(input => {
            input.addEventListener('change', function() {
                const productId = this.dataset.id;
                let quantity = parseInt(this.value);
                
                // Validate quantity
                if (isNaN(quantity) || quantity < 1) quantity = 1;
                if (quantity > 10) quantity = 10;
                
                this.value = quantity;
                
                updateCartItemQuantity(productId, quantity);
            });
        });
        
        // Quantity plus buttons
        const plusButtons = document.querySelectorAll('.quantity-btn.plus');
        plusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const input = this.parentElement.querySelector('input');
                let currentValue = parseInt(input.value);
                
                if (currentValue < 10) {
                    currentValue++;
                    input.value = currentValue;
                    updateCartItemQuantity(productId, currentValue);
                }
            });
        });
        
        // Quantity minus buttons
        const minusButtons = document.querySelectorAll('.quantity-btn.minus');
        minusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const input = this.parentElement.querySelector('input');
                let currentValue = parseInt(input.value);
                
                if (currentValue > 1) {
                    currentValue--;
                    input.value = currentValue;
                    updateCartItemQuantity(productId, currentValue);
                }
            });
        });
    }
    
    function updateCartItemQuantity(productId, quantity) {
        // Find the item in the cart
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            // Update the quantity
            cart[itemIndex].quantity = quantity;
            
            // Update the UI (subtotal for this item)
            const subtotal = cart[itemIndex].price * quantity;
            
            const subtotalElement = document.querySelector(`tr[data-id="${productId}"] .product-subtotal span`);
            if (subtotalElement) {
                subtotalElement.textContent = `৳${subtotal.toLocaleString('en-IN')}`;
            }
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count and order summary
            updateCartCount();
            updateOrderSummary();
        }
    }
    
    function removeFromCart(productId) {
        // Find the item in the cart
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = cart[itemIndex];
            
            // Remove the item from the cart
            cart.splice(itemIndex, 1);
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            updateCartUI();
            
            // Show notification
            showNotification(`Removed ${removedItem.name} from cart!`, 'info');
        }
    }
    
    function clearCart() {
        // Ask for confirmation
        if (confirm('Are you sure you want to clear your cart?')) {
            // Clear cart array
            cart = [];
            
            // Save empty cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Reset active promo code
            activePromoCode = '';
            discount = 0;
            if (promoCodeInput) promoCodeInput.value = '';
            
            // Update UI
            updateCartCount();
            updateCartUI();
            
            // Show notification
            showNotification('Cart cleared!', 'info');
        }
    }
    
    function updateCart() {
        // Update cart from quantity inputs
        const qtyInputs = document.querySelectorAll('.qty-input');
        let updated = false;
        
        qtyInputs.forEach(input => {
            const productId = input.dataset.id;
            let quantity = parseInt(input.value);
            
            // Validate quantity
            if (isNaN(quantity) || quantity < 1) quantity = 1;
            if (quantity > 10) quantity = 10;
            
            input.value = quantity;
            
            // Find the item in the cart
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex !== -1 && cart[itemIndex].quantity !== quantity) {
                // Update the quantity
                cart[itemIndex].quantity = quantity;
                updated = true;
            }
        });
        
        if (updated) {
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            renderCartItems();
            updateOrderSummary();
            
            // Show notification
            showNotification('Cart updated!', 'success');
        } else {
            showNotification('No changes to update', 'info');
        }
    }
    
    function updateOrderSummary() {
        if (!cartSubtotal || !cartTotal || !cartDiscount) return;
        
        // Calculate subtotal
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Get selected shipping cost
        let shippingCost = 0;
        const selectedShipping = document.querySelector('input[name="shipping"]:checked');
        if (selectedShipping) {
            shippingCost = parseFloat(selectedShipping.value);
        }
        
        // Apply free shipping for orders over ৳5,000 if that option is selected
        if (subtotal >= 5000 && selectedShipping && selectedShipping.id === 'free-shipping') {
            shippingCost = 0;
        }
        
        // Calculate discount amount
        const discountAmount = subtotal * discount;
        
        // Calculate total
        const total = subtotal + shippingCost - discountAmount;
        
        // Update UI
        cartSubtotal.textContent = `৳${subtotal.toLocaleString('en-IN')}`;
        cartDiscount.textContent = `৳${discountAmount.toLocaleString('en-IN')}`;
        cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
    }
    
    function applyPromoCode() {
        if (!promoCodeInput) return;
        
        const code = promoCodeInput.value.trim().toUpperCase();
        
        if (code === '') {
            showNotification('Please enter a promo code', 'error');
            return;
        }
        
        // Calculate subtotal
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Check if code exists and if minimum amount is met
        const promoCode = promoCodes.find(promo => promo.code === code);
        
        if (promoCode) {
            if (subtotal >= promoCode.minAmount) {
                discount = promoCode.discount;
                activePromoCode = code;
                updateOrderSummary();
                showNotification(`Promo code ${code} applied! You got ${discount * 100}% off!`, 'success');
            } else {
                showNotification(`Minimum order amount of ৳${promoCode.minAmount.toLocaleString('en-IN')} required for this code`, 'error');
            }
        } else {
            showNotification('Invalid promo code', 'error');
        }
    }
    
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
        
        // Add close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOut 0.3s forwards';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
});