document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout.js Initialized');

    // Use the same dynamic cart key as the main script
    const cartKey = typeof currentUserId !== 'undefined' && currentUserId ? `cart_${currentUserId}` : 'cart_guest';
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    let deliveryFee = 60; // Default fee

    const orderItemsContainer = document.getElementById('checkout-order-items');
    const orderCountEl = document.getElementById('order-count');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const deliveryEl = document.getElementById('checkout-delivery');
    const totalEl = document.getElementById('checkout-total');
    const checkoutForm = document.getElementById('checkout-form');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const paymentErrorMessage = document.getElementById('payment-error-message');

    // Form validation setup
    setupFormValidation();
    
    // Add mobile toggle for order summary
    const summaryToggle = document.querySelector('.summary-toggle');
    if (summaryToggle) {
        summaryToggle.addEventListener('click', function() {
            const summaryContent = document.querySelector('.order-summary-content');
            const toggleBtn = this.querySelector('.toggle-summary-btn i');
            
            if (summaryContent.classList.contains('collapsed')) {
                summaryContent.classList.remove('collapsed');
                toggleBtn.className = 'fas fa-chevron-up';
            } else {
                summaryContent.classList.add('collapsed');
                toggleBtn.className = 'fas fa-chevron-down';
            }
        });
        
        // Auto-collapse on mobile
        function checkForCollapse() {
            const summaryContent = document.querySelector('.order-summary-content');
            const toggleBtn = document.querySelector('.toggle-summary-btn i');
            
            if (window.innerWidth < 768 && summaryContent) {
                summaryContent.classList.add('collapsed');
                if (toggleBtn) toggleBtn.className = 'fas fa-chevron-down';
            } else if (summaryContent) {
                summaryContent.classList.remove('collapsed');
                if (toggleBtn) toggleBtn.className = 'fas fa-chevron-up';
            }
        }
        
        // Run on load and resize
        checkForCollapse();
        window.addEventListener('resize', checkForCollapse);
    }
    
    // Initialize payment method handlers
    initPaymentMethods();
    
    function setupFormValidation() {
        // Phone number validation (Bangladesh format)
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                const phoneRegex = /^01[3-9]\d{8}$/;
                const isValid = phoneRegex.test(this.value);
                validateField(this, isValid, 'Please enter a valid Bangladesh mobile number');
            });
        }
        
        // Postal code validation
        const zipcodeInput = document.getElementById('zipcode');
        if (zipcodeInput) {
            zipcodeInput.addEventListener('input', function() {
                const isValid = this.value.length >= 4 && !isNaN(this.value);
                validateField(this, isValid, 'Please enter a valid postal code');
            });
        }
        
        // Name validation
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.addEventListener('input', function() {
                const isValid = this.value.trim().length >= 3;
                validateField(this, isValid, 'Name must be at least 3 characters');
            });
        }
        
        // Address validation
        const addressInput = document.getElementById('address');
        if (addressInput) {
            addressInput.addEventListener('input', function() {
                const isValid = this.value.trim().length >= 5;
                validateField(this, isValid, 'Please enter a complete address');
            });
        }
        
        // Payment method validation
        document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
            radio.addEventListener('change', validatePaymentMethod);
        });
        
        // Terms and conditions validation
        const termsCheckbox = document.getElementById('terms-checkbox');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', function() {
                if (!this.checked) {
                    const errorEl = document.createElement('div');
                    errorEl.className = 'error-message';
                    errorEl.textContent = 'You must accept the terms and conditions';
                    
                    // Remove any existing error messages
                    const existingError = this.parentNode.querySelector('.error-message');
                    if (existingError) existingError.remove();
                    
                    this.parentNode.appendChild(errorEl);
                } else {
                    const existingError = this.parentNode.querySelector('.error-message');
                    if (existingError) existingError.remove();
                }
            });
        }
    }
    
    function validateDeliveryOption() {
        const deliveryOptions = document.querySelectorAll('input[name="delivery-location"]');
        const deliveryError = document.getElementById('delivery-error');
        
        let isSelected = false;
        deliveryOptions.forEach(option => {
            if (option.checked) {
                isSelected = true;
            }
        });
        
        if (!isSelected && deliveryError) {
            deliveryError.textContent = 'Please select a delivery option';
            deliveryError.classList.add('visible');
            
            // Highlight the delivery section
            const deliverySection = document.querySelector('.delivery-options-section');
            if (deliverySection) {
                deliverySection.classList.add('error-section');
                deliverySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        } else if (deliveryError) {
            deliveryError.classList.remove('visible');
            const deliverySection = document.querySelector('.delivery-options-section');
            if (deliverySection) {
                deliverySection.classList.remove('error-section');
            }
        }
        
        return true;
    }
    
    function validatePaymentMethod() {
        const paymentSelected = document.querySelector('input[name="payment_method"]:checked');
        
        if (paymentErrorMessage) {
            if (!paymentSelected) {
                paymentErrorMessage.textContent = 'Please select a payment method';
                paymentErrorMessage.classList.add('active');
                return false;
            } else {
                paymentErrorMessage.classList.remove('active');
                return true;
            }
        }
        return !!paymentSelected;
    }
    
    function validateField(field, isValid, errorMessage) {
        // Remove any existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid) {
            // Add error class to input
            field.classList.add('error');
            
            // Create and append error message
            const errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            errorEl.textContent = errorMessage;
            field.parentNode.appendChild(errorEl);
            
            // Set custom validity for form validation
            field.setCustomValidity(errorMessage);
        } else {
            // Remove error class
            field.classList.remove('error');
            
            // Clear custom validity
            field.setCustomValidity('');
        }
    }

    function renderOrderSummary() {
        if (!orderItemsContainer) return;
        
        if (cart.length === 0) {
            if (window.location.pathname.includes('checkout.php')) {
                window.location.href = 'index.php'; 
            }
            return;
        }

        orderItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'order-item';
            itemEl.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-meta">
                        <span class="item-quantity">Qty: ${item.quantity}</span>
                        <span class="item-price-each">৳${Number(item.price).toLocaleString()} each</span>
                    </div>
                </div>
                <p class="item-price">৳${(item.price * item.quantity).toLocaleString()}</p>
            `;
            orderItemsContainer.appendChild(itemEl);
        });
        updateTotals();
    }

    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Calculate free shipping for orders over 50,000
        if (subtotal > 50000) {
            deliveryFee = 0;
        } else {
            const deliveryLocation = document.querySelector('input[name="delivery-location"]:checked')?.value;
            deliveryFee = deliveryLocation === 'inside-dhaka' ? 60 : 150;
        }
        
        const total = subtotal + deliveryFee;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (orderCountEl) orderCountEl.textContent = `(${totalItems} item${totalItems !== 1 ? 's' : ''})`;
        if (subtotalEl) subtotalEl.textContent = `৳${subtotal.toLocaleString()}`;
        if (deliveryEl) {
            const oldText = deliveryEl.textContent;
            const newText = deliveryFee === 0 ? 'Free Shipping' : `৳${deliveryFee}`;
            
            if (oldText !== newText) {
                deliveryEl.classList.add('highlight');
                setTimeout(() => deliveryEl.classList.remove('highlight'), 1000);
            }
            
            deliveryEl.textContent = newText;
        }
        if (totalEl) totalEl.textContent = `৳${total.toLocaleString()}`;
    }

    // Listen for delivery location changes
    document.querySelectorAll('input[name="delivery-location"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Remove any error when user selects an option
            const deliveryError = document.getElementById('delivery-error');
            if (deliveryError) {
                deliveryError.classList.remove('visible');
            }
            
            const deliverySection = document.querySelector('.delivery-options-section');
            if (deliverySection) {
                deliverySection.classList.remove('error-section');
            }
            
            // Show selection animation
            const label = this.nextElementSibling;
            if (label) {
                label.classList.add('pulse');
                setTimeout(() => {
                    label.classList.remove('pulse');
                }, 500);
            }
            
            // Update totals based on selection
            updateTotals();
        });
    });

    // NEW: Payment Methods Handler
    function initPaymentMethods() {
        const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
        
        // Add event listener to payment method radios
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                // Store the selected method in case we need to come back to it
                localStorage.setItem('selectedPayment', this.value);
            });
        });
    }
    
    // NEW: Modal handling functions
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        document.body.style.overflow = 'hidden';
        modal.style.display = 'block';
        
        // Animate opening
        setTimeout(() => {
            modal.classList.add('modal-open');
        }, 10);
        
        // Add close button event listeners
        const closeButtons = modal.querySelectorAll('.close-modal, .cancel-payment-btn');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => closeModal(modalId));
        });
    }
    
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.remove('modal-open');
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    // Process Order Submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields before submission
            const requiredFields = checkoutForm.querySelectorAll('[required]');
            let isValid = true;
            
            // Validate delivery option first
            if (!validateDeliveryOption()) {
                isValid = false;
            }
            
            requiredFields.forEach(field => {
                if (!field.value.trim() && field.type !== 'checkbox') {
                    isValid = false;
                    validateField(field, false, 'This field is required');
                }
                else if (field.type === 'checkbox' && !field.checked) {
                    isValid = false;
                    const errorEl = document.createElement('div');
                    errorEl.className = 'error-message';
                    errorEl.textContent = 'You must accept the terms and conditions';
                    
                    // Remove any existing error messages
                    const existingError = field.parentNode.querySelector('.error-message');
                    if (existingError) existingError.remove();
                    
                    field.parentNode.appendChild(errorEl);
                }
            });
            
            // Validate payment method is selected
            if (!validatePaymentMethod()) {
                isValid = false;
                // Scroll to payment section on mobile
                if (window.innerWidth < 768) {
                    const paymentSection = document.getElementById('payment-options');
                    if (paymentSection) {
                        paymentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
            
            if (!isValid) {
                // Scroll to the first error
                const firstError = checkoutForm.querySelector('.error, .error-message.visible');
                if (firstError) {
                    const scrollTarget = firstError.closest('.form-group, .form-section') || firstError;
                    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            // NEW: Check if we need to handle a payment method with a modal
            const selectedPaymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
            
            if (selectedPaymentMethod === 'bkash') {
                // Show bKash payment modal
                openModal('bkashPaymentModal');
                return; // Stop form submission until payment is complete
            } 
            else if (selectedPaymentMethod === 'rocket') {
                // Show Rocket payment modal
                openModal('rocketPaymentModal');
                return; // Stop form submission until payment is complete
            }
            else if (selectedPaymentMethod === 'card') {
                // Show Card payment modal
                openModal('cardPaymentModal');
                return; // Stop form submission until payment is complete
            }
            else if (selectedPaymentMethod === 'cod') {
                // Continue with normal submission for COD
                processOrderSubmission();
            }
        });
    }
    
    // Submit payment forms for the payment modals
    document.querySelectorAll('.payment-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get the payment method from the form's ID
            const paymentMethod = this.id.replace('-form', '');
            
            // Validate the payment form
            const isValid = validatePaymentForm(paymentMethod);
            
            if (!isValid) return;
            
            // Show processing state
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            // Simulate payment processing
            simulatePaymentProcessing(paymentMethod)
                .then(() => {
                    // Close the modal
                    closeModal(`${paymentMethod}PaymentModal`);
                    
                    // Process the order submission
                    processOrderSubmission();
                })
                .catch(error => {
                    // Show error
                    showNotification(`Payment failed: ${error}`, 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Confirm Payment';
                });
        });
    });
    
    function validatePaymentForm(paymentMethod) {
        let isValid = true;
        const form = document.getElementById(`${paymentMethod}-form`);
        
        if (!form) return false;
        
        // Get all required inputs
        const requiredInputs = form.querySelectorAll('input[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                validateField(input, false, 'This field is required');
            } else {
                // Specific validations based on input type
                switch(input.id) {
                    case 'bkash-number':
                    case 'rocket-number':
                        // Mobile number format (Bangladesh)
                        const phoneRegex = /^01[3-9]\d{8}$/;
                        if (!phoneRegex.test(input.value)) {
                            isValid = false;
                            validateField(input, false, 'Please enter a valid mobile number');
                        }
                        break;
                    case 'bkash-pin':
                    case 'rocket-pin':
                        // PIN should be numeric and have a minimum length
                        if (!/^\d{4,6}$/.test(input.value)) {
                            isValid = false;
                            validateField(input, false, 'PIN must be 4-6 digits');
                        }
                        break;
                    case 'card-number':
                        // Simple credit card validation (removes spaces and checks length)
                        const cardNumber = input.value.replace(/\s+/g, '');
                        if (!/^\d{13,19}$/.test(cardNumber)) {
                            isValid = false;
                            validateField(input, false, 'Please enter a valid card number');
                        }
                        break;
                    case 'card-expiry':
                        // Expiry format MM/YY
                        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(input.value)) {
                            isValid = false;
                            validateField(input, false, 'Use format MM/YY');
                        } else {
                            // Check if card is expired
                            const [month, year] = input.value.split('/');
                            const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
                            const currentDate = new Date();
                            if (expiryDate < currentDate) {
                                isValid = false;
                                validateField(input, false, 'Card is expired');
                            }
                        }
                        break;
                    case 'card-cvv':
                        // CVV should be 3-4 digits
                        if (!/^\d{3,4}$/.test(input.value)) {
                            isValid = false;
                            validateField(input, false, 'CVV must be 3-4 digits');
                        }
                        break;
                }
            }
        });
        
        return isValid;
    }
    
    // Simulate payment processing with a Promise
    function simulatePaymentProcessing(paymentMethod) {
        return new Promise((resolve, reject) => {
            // Simulate a network request delay
            setTimeout(() => {
                // Simulate a 90% success rate
                const isSuccessful = Math.random() < 0.9;
                
                if (isSuccessful) {
                    resolve();
                } else {
                    reject('Transaction declined by payment provider');
                }
            }, 2000); // 2 second delay for simulation
        });
    }
    
    // Process the final order submission
    function processOrderSubmission() {
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing Order...';

        const formData = new FormData(checkoutForm);
        formData.append('cart_items', JSON.stringify(cart));
        
        fetch('process_order.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                localStorage.removeItem(cartKey);
                window.location.href = 'order_success.php?order_id=' + data.order_id;
            } else {
                showNotification('Error: ' + data.message, 'error');
                placeOrderBtn.disabled = false;
                placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Place Order';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred. Please try again.', 'error');
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Place Order';
        });
    }
    
    function showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconClass = type === 'success' ? 'fa-check-circle' : 
                          type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${iconClass}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        container.appendChild(notification);
        notification.querySelector('.notification-close').addEventListener('click', () => notification.remove());
        
        setTimeout(() => notification.remove(), 4000);
    }

    // Add listener for real-time cart updates
    window.addEventListener('storage', function(e) {
        if (e.key === cartKey) {
            cart = JSON.parse(e.newValue) || [];
            renderOrderSummary();
        }
    });

    // Format card number input with spaces
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            // Remove all non-digits
            let input = this.value.replace(/\D/g, '');
            
            // Add spaces after every 4 digits
            let formattedInput = '';
            for (let i = 0; i < input.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedInput += ' ';
                }
                formattedInput += input.charAt(i);
            }
            
            // Update the input value
            this.value = formattedInput;
        });
    }
    
    // Format card expiry input as MM/YY
    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            // Remove all non-digits
            let input = this.value.replace(/\D/g, '');
            
            // Format as MM/YY
            if (input.length > 2) {
                this.value = input.substring(0, 2) + '/' + input.substring(2, 4);
            } else {
                this.value = input;
            }
        });
    }

    // Initial page load
    renderOrderSummary();
});