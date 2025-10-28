<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

if (!isLoggedIn()) { redirect('auth/login.php'); }

$active_page = 'checkout';
$page_js = 'checkout.js';
$title = "TechNest - Checkout";
$user = getCurrentUser();

include 'includes/header.php';
?>

<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/payment-modals.css">

<div class="breadcrumb">
    <div class="container">
        <ul>
            <li><a href="<?php echo BASE_URL; ?>">Home</a></li>
            <li><a href="<?php echo BASE_URL; ?>cart.php" id="cartLink">Cart</a></li>
            <li class="active">Checkout</li>
        </ul>
    </div>
</div>

<!-- Progress Indicator -->
<div class="checkout-progress-container">
    <div class="checkout-progress">
        <div class="progress-step completed">
            <div class="step-icon"><i class="fas fa-shopping-cart"></i></div>
            <div class="step-label">Cart</div>
        </div>
        <div class="progress-line active"></div>
        <div class="progress-step active">
            <div class="step-icon">2</div>
            <div class="step-label">Shipping</div>
        </div>
        <div class="progress-line"></div>
        <div class="progress-step">
            <div class="step-icon">3</div>
            <div class="step-label">Payment</div>
        </div>
        <div class="progress-line"></div>
        <div class="progress-step">
            <div class="step-icon"><i class="fas fa-check"></i></div>
            <div class="step-label">Confirmation</div>
        </div>
    </div>
</div>

<section class="checkout-container">
    <div class="checkout-wrapper">
        <form id="checkout-form" method="POST">
            <div class="checkout-content">
                <div class="checkout-main">
                    <h2><i class="fas fa-shipping-fast"></i> Shipping Information</h2>
                    <div class="form-section">
                        <h3>Contact Information</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required value="<?php echo htmlspecialchars($user['email']); ?>" readonly>
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone *</label>
                                <input type="tel" id="phone" name="phone" required placeholder="01XXXXXXXXX">
                            </div>
                        </div>
                    </div>
                    <div class="form-section">
                        <h3><i class="fa-solid fa-house"></i>Shipping Address</h3>
                        <div class="form-group">
                            <label for="name">Full Name *</label>
                            <input type="text" id="name" name="name" required value="<?php echo htmlspecialchars($user['name']); ?>">
                        </div>
                        <div class="form-group">
                            <label for="address">Address *</label>
                            <input type="text" id="address" name="address" required placeholder="House/Building, Street">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="city">City *</label>
                                <input type="text" id="city" name="city" required>
                            </div>
                            <div class="form-group">
                                <label for="zipcode">Postal Code *</label>
                                <input type="text" id="zipcode" name="zipcode" required>
                            </div>
                        </div>
                    </div>

                    <div class="form-section delivery-options-section">
                        <h3><i class="fas fa-truck"></i> Delivery Options <span class="required-text">*</span></h3>
                        <div class="delivery-selection-container">
                            <p class="selection-instruction">Please select a delivery option to continue:</p>
                            <div class="shipping-methods">
                                <div class="shipping-method">
                                    <input type="radio" id="inside-dhaka" name="delivery-location" value="inside-dhaka" required>
                                    <label for="inside-dhaka">
                                        <div class="method-info">
                                            <span class="method-title">Inside Dhaka</span>
                                            <span class="method-description">Delivery within 24-48 hours</span>
                                        </div>
                                        <span class="method-price">৳60</span>
                                    </label>
                                </div>
                                <div class="shipping-method">
                                    <input type="radio" id="outside-dhaka" name="delivery-location" value="outside-dhaka" required>
                                    <label for="outside-dhaka">
                                        <div class="method-info">
                                            <span class="method-title">Outside Dhaka</span>
                                            <span class="method-description">Delivery within 2-3 days</span>
                                        </div>
                                        <span class="method-price">৳150</span>
                                    </label>
                                </div>
                            </div>
                            <div id="delivery-error" class="error-message"></div>
                        </div>
                    </div>
                </div>

                <div class="checkout-sidebar">
                    <div class="order-summary">
                        <h3 class="summary-toggle">
                            <i class="fa-solid fa-list-check"></i> Order Summary <span id="order-count"></span>
                            <button type="button" class="toggle-summary-btn">
                                <i class="fas fa-chevron-down"></i>
                            </button>
                        </h3>
                        <div class="order-summary-content">
                            <div class="order-items" id="checkout-order-items"></div>
                            <div class="order-totals">
                                <div class="total-row"><span>Subtotal</span><span id="checkout-subtotal">৳0</span></div>
                                <div class="total-row"><span>Delivery Fee</span><span id="checkout-delivery">৳60</span></div>
                                <div class="total-row final-total"><span>Total</span><span id="checkout-total">৳60</span></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Payment Method Section (moved below order summary) -->
                    <div class="sidebar-payment-section">
                        <h4><i class="fas fa-credit-card"></i> Payment Method</h4>
                        <div class="payment-options" id="payment-options">
                            <div class="payment-option">
                                <input type="radio" id="payment-cod" name="payment_method" value="cod">
                                <label for="payment-cod"><i class="fas fa-money-bill-wave"></i><span>Cash on Delivery</span></label>
                            </div>
                            <div class="payment-option">
                                <input type="radio" id="payment-bkash" name="payment_method" value="bkash">
                                <label for="payment-bkash"><img src="<?php echo BASE_URL; ?>assets/images/bkash.svg" alt="bKash" class="payment-logo-radio"><span>bKash</span></label>
                            </div>
                            <div class="payment-option">
                                <input type="radio" id="payment-rocket" name="payment_method" value="rocket">
                                <label for="payment-rocket"><img src="<?php echo BASE_URL; ?>assets/images/rocket.svg" alt="rocket" class="payment-logo-radio"><span>Rocket</span></label>
                            </div>
                            <div class="payment-option">
                                <input type="radio" id="payment-card" name="payment_method" value="card">
                                <label for="payment-card"><i class="fab fa-cc-visa"></i><span>Credit/Debit Card</span></label>
                            </div>
                            <div class="payment-error-message" id="payment-error-message"></div>
                        </div>
                    </div>
                    
                    <!-- Terms and Conditions Section -->
                    <div class="sidebar-terms-section">
                        <h4><i class="fas fa-file-contract"></i> Terms and Conditions</h4>
                        <div class="terms-container">
                            <div class="terms-content">
                                <p><strong>Order Acceptance:</strong> By placing an order, you agree to these terms and conditions. We reserve the right to refuse or cancel any order for any reason.</p>
                                
                                <p><strong>Delivery:</strong> Delivery timeframes are estimates only. TechNest is not responsible for delays outside our control.</p>
                                
                                <p><strong>Returns &amp; Refunds:</strong> Products may be returned within 7 days of delivery if in original condition. Refunds will be processed within 14 days of receipt.</p>
                                
                                <p><strong>Product Warranty:</strong> All products come with manufacturer warranty. TechNest provides additional 30-day satisfaction guarantee.</p>
                                
                                <p><strong>Payment:</strong> All prices are in BDT. Payment must be received in full before products are shipped.</p>
                                
                                <p><strong>Privacy:</strong> Your personal information is handled according to our privacy policy. We do not share your details with third parties without consent.</p>
                            </div>
                        </div>
                        <div class="terms-agreement">
                            <input type="checkbox" id="terms-checkbox" name="terms_accepted" required>
                            <label for="terms-checkbox">I have read and agree to the terms and conditions</label>
                        </div>
                    </div>
                    
                    <div class="checkout-actions">
                        <button type="submit" class="btn primary-btn" id="place-order-btn">
                            <i class="fas fa-lock"></i> Place Order
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</section>

<!-- bKash Payment Modal -->
<div class="modal" id="bkashPaymentModal">
    <div class="modal-content">
        <button class="close-modal">&times;</button>
        <div class="payment-wrapper">
            <h2><img src="<?php echo BASE_URL; ?>assets/images/bkash.svg" alt="bKash" class="payment-logo"> bKash Payment</h2>
            
            <div class="payment-instructions">
                <p>Please enter your bKash account number and PIN to complete the payment. Your transaction will be processed securely.</p>
                <div class="payment-amount">
                    <span>Total Amount:</span>
                    <span class="amount" id="bkash-amount">৳0</span>
                </div>
            </div>
            
            <form id="bkash-form" class="payment-form">
                <div class="form-group">
                    <label for="bkash-number">bKash Number</label>
                    <div class="input-group">
                        <i class="fas fa-mobile-alt input-icon"></i>
                        <input type="text" id="bkash-number" placeholder="01XXXXXXXXX" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="bkash-pin">PIN</label>
                    <div class="input-group">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" id="bkash-pin" placeholder="Enter PIN" required>
                    </div>
                    <!-- <small class="form-help">For this demo, you can use any PIN (this is not a real payment)</small> -->
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn secondary-btn cancel-payment-btn">Cancel</button>
                    <button type="submit" class="btn primary-btn">Confirm Payment</button>
                </div>
            </form>
            
            <!-- <div class="payment-notes">
                <p><i class="fas fa-info-circle"></i> This is a demonstration. No actual payment will be processed.</p>
            </div> -->
        </div>
    </div>
</div>

<!-- Rocket Payment Modal -->
<div class="modal" id="rocketPaymentModal">
    <div class="modal-content">
        <button class="close-modal">&times;</button>
        <div class="payment-wrapper">
            <h2><img src="<?php echo BASE_URL; ?>assets/images/rocket.svg" alt="Rocket" class="payment-logo"> Rocket Payment</h2>
            
            <div class="payment-instructions">
                <p>Please enter your Rocket account number and PIN to complete the payment. Your transaction will be processed securely.</p>
                <div class="payment-amount">
                    <span>Total Amount:</span>
                    <span class="amount" id="rocket-amount">৳0</span>
                </div>
            </div>
            
            <form id="rocket-form" class="payment-form">
                <div class="form-group">
                    <label for="rocket-number">Rocket Number</label>
                    <div class="input-group">
                        <i class="fas fa-mobile-alt input-icon"></i>
                        <input type="text" id="rocket-number" placeholder="01XXXXXXXXX" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="rocket-pin">PIN</label>
                    <div class="input-group">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" id="rocket-pin" placeholder="Enter PIN" required>
                    </div>
                    <!-- <small class="form-help">For this demo, you can use any PIN (this is not a real payment)</small> -->
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn secondary-btn cancel-payment-btn">Cancel</button>
                    <button type="submit" class="btn primary-btn">Confirm Payment</button>
                </div>
            </form>
            
            <!-- <div class="payment-notes">
                <p><i class="fas fa-info-circle"></i> This is a demonstration. No actual payment will be processed.</p>
            </div> -->
        </div>
    </div>
</div>

<!-- Credit/Debit Card Payment Modal -->
<div class="modal" id="cardPaymentModal">
    <div class="modal-content">
        <button class="close-modal">&times;</button>
        <div class="payment-wrapper">
            <h2><i class="fas fa-credit-card"></i> Credit/Debit Card Payment</h2>
            
            <div class="payment-instructions">
                <p>Enter your card details to complete the payment. All information is encrypted and secure.</p>
                <div class="payment-amount">
                    <span>Total Amount:</span>
                    <span class="amount" id="card-amount">৳0</span>
                </div>
            </div>
            
            <form id="card-form" class="payment-form">
                <div class="form-group">
                    <label for="card-holder">Card Holder Name</label>
                    <div class="input-group">
                        <i class="fas fa-user input-icon"></i>
                        <input type="text" id="card-holder" placeholder="Name on card" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="card-number">Card Number</label>
                    <div class="input-group card-input">
                        <i class="fas fa-credit-card input-icon"></i>
                        <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required>
                        <div class="card-icons">
                            <i class="fab fa-cc-visa"></i>
                            <i class="fab fa-cc-mastercard"></i>
                        </div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="card-expiry">Expiry Date</label>
                        <div class="input-group">
                            <i class="fas fa-calendar-alt input-icon"></i>
                            <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="card-cvv">CVV</label>
                        <div class="input-group">
                            <i class="fas fa-lock input-icon"></i>
                            <input type="password" id="card-cvv" placeholder="123" maxlength="4" required>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn secondary-btn cancel-payment-btn">Cancel</button>
                    <button type="submit" class="btn primary-btn">Pay Now</button>
                </div>
            </form>
            
            <div class="payment-security">
                <div class="security-icons">
                    <i class="fas fa-lock"></i>
                    <i class="fas fa-shield-alt"></i>
                </div>
                <p>Your payment is secure. We use SSL encryption to protect your data.</p>
                <!-- <p class="demo-note"><i class="fas fa-info-circle"></i> This is a demonstration. No actual payment will be processed.</p> -->
            </div>
        </div>
    </div>
</div>

<script>
    // Update payment amounts in modals
    document.addEventListener('DOMContentLoaded', function() {
        const updatePaymentAmounts = function() {
            const totalAmount = document.getElementById('checkout-total').textContent;
            document.getElementById('bkash-amount').textContent = totalAmount;
            document.getElementById('rocket-amount').textContent = totalAmount;
            document.getElementById('card-amount').textContent = totalAmount;
        };
        
        // Run initially and whenever the total changes
        updatePaymentAmounts();
        
        // Set up observers to watch for changes in the total
        const totalObserver = new MutationObserver(updatePaymentAmounts);
        const totalElement = document.getElementById('checkout-total');
        
        if (totalElement) {
            totalObserver.observe(totalElement, { childList: true, characterData: true, subtree: true });
        }
    });
</script>

<?php
include 'includes/footer.php';
?>