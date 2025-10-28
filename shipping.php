<?php
$active_page = 'shipping';
require_once 'includes/config.php';
require_once 'includes/functions.php';

// Set title
$title = "Shipping & Returns - TechNest";

// Include header
include 'includes/header.php';
?>

<!-- Hero Section -->
<section class="page-header">
    <div class="container">
        <h1>Shipping & Returns</h1>
        <p>Everything you need to know about our shipping policies and return procedures</p>
    </div>
</section>

<!-- Main Content -->
<section class="shipping-section">
    <div class="container">
        <div class="info-tabs">
            <button class="tab-btn active" data-tab="shipping">Shipping Information</button>
            <button class="tab-btn" data-tab="returns">Return Policy</button>
        </div>
        
        <div class="tab-content active" id="shipping">
            <div class="info-card">
                <div class="info-header">
                    <h2>Shipping Options</h2>
                </div>
                <div class="info-body">
                    <div class="shipping-option">
                        <div class="option-icon">
                            <i class="fas fa-truck"></i>
                        </div>
                        <div class="option-details">
                            <h3>Standard Shipping</h3>
                            <p class="option-desc">Delivered within 3-5 business days</p>
                            <p class="option-price">৳150 (Free on orders over ৳50,000)</p>
                        </div>
                    </div>
                    
                    <div class="shipping-option">
                        <div class="option-icon">
                            <i class="fas fa-shipping-fast"></i>
                        </div>
                        <div class="option-details">
                            <h3>Express Shipping</h3>
                            <p class="option-desc">Delivered within 1-2 business days</p>
                            <p class="option-price">৳300</p>
                        </div>
                    </div>
                    
                    <div class="shipping-option">
                        <div class="option-icon">
                            <i class="fas fa-store"></i>
                        </div>
                        <div class="option-details">
                            <h3>In-Store Pickup</h3>
                            <p class="option-desc">Available within 2 hours of purchase</p>
                            <p class="option-price">Free</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="info-card">
                <div class="info-header">
                    <h2>Delivery Areas</h2>
                </div>
                <div class="info-body">
                    <p>We currently deliver to all major cities and regions across Bangladesh. Delivery times may vary depending on your location.</p>
                    
                    <div class="delivery-areas">
                        <div class="area-column">
                            <h4>Major Cities (1-3 days)</h4>
                            <ul>
                                <li>Dhaka</li>
                                <li>Chattogram</li>
                                <li>Khulna</li>
                                <li>Rajshahi</li>
                                <li>Sylhet</li>
                            </ul>
                        </div>
                        <div class="area-column">
                            <h4>Secondary Cities (2-4 days)</h4>
                            <ul>
                                <li>Barisal</li>
                                <li>Cumilla</li>
                                <li>Narayanganj</li>
                                <li>Rangpur</li>
                                <li>Mymensingh</li>
                            </ul>
                        </div>
                        <div class="area-column">
                            <h4>Other Regions (3-5 days)</h4>
                            <ul>
                                <li>Coastal Areas</li>
                                <li>Northern Districts</li>
                                <li>Rural Areas</li>
                                <li>Island Regions</li>
                            </ul>
                        </div>
                    </div>
                    
                    <p class="note">For delivery to remote areas, additional shipping time and charges may apply.</p>
                </div>
            </div>
            
            <!-- <div class="info-card">
                <div class="info-header">
                    <h2>Order Tracking</h2>
                </div>
                <div class="info-body">
                    <p>Once your order has been shipped, you'll receive a confirmation email with tracking information. You can also track your order by:</p>
                    
                    <div class="tracking-options">
                        <div class="tracking-option">
                            <div class="tracking-icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="tracking-text">
                                <h4>Account Dashboard</h4>
                                <p>Log in to your TechNest account and visit the "Order History" section.</p>
                            </div>
                        </div>
                        
                        <div class="tracking-option">
                            <div class="tracking-icon">
                                <i class="fas fa-globe"></i>
                            </div>
                            <div class="tracking-text">
                                <h4>Order Tracking Page</h4>
                                <p>Use your order number and email to track your order on our tracking page.</p>
                                <a href="#" class="btn secondary-btn">Track Order</a>
                            </div>
                        </div>
                        
                        <div class="tracking-option">
                            <div class="tracking-icon">
                                <i class="fas fa-phone"></i>
                            </div>
                            <div class="tracking-text">
                                <h4>Customer Service</h4>
                                <p>Call our customer service team at +8801581448561 for assistance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             -->
            <div class="info-card">
                <div class="info-header">
                    <h2>Shipping FAQs</h2>
                </div>
                <div class="info-body">
                    <div class="shipping-faq">
                        <h4>When will my order ship?</h4>
                        <p>Orders are typically processed within 24 hours and shipped within 1-2 business days.</p>
                    </div>
                    
                    <div class="shipping-faq">
                        <h4>Can I change my shipping address after placing an order?</h4>
                        <p>You can change your shipping address if the order has not yet been processed. Please contact our customer service team immediately.</p>
                    </div>
                    
                    <div class="shipping-faq">
                        <h4>Do you ship internationally?</h4>
                        <p>Currently, we only ship within Bangladesh. We're working on expanding our shipping options to include international destinations.</p>
                    </div>
                    
                    <div class="shipping-faq">
                        <h4>What if I'm not home when my package arrives?</h4>
                        <p>Our delivery partners will make 2 attempts to deliver your package. If unsuccessful, they will leave a note with instructions for rescheduling or pickup.</p>
                    </div>
                    
                    <div class="shipping-faq">
                        <h4>Do you offer same-day delivery?</h4>
                        <p>Same-day delivery is available in select areas of Dhaka city for orders placed before 12 PM, subject to product availability.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="tab-content" id="returns">
            <div class="info-card">
                <div class="info-header">
                    <h2>Return Policy Overview</h2>
                </div>
                <div class="info-body">
                    <div class="return-highlights">
                        <div class="return-highlight">
                            <div class="highlight-icon">
                                <i class="fas fa-calendar-alt"></i>
                            </div>
                            <div class="highlight-text">
                                <h4>30-Day Returns</h4>
                                <p>Return most items within 30 days of delivery for a full refund.</p>
                            </div>
                        </div>
                        
                        <div class="return-highlight">
                            <div class="highlight-icon">
                                <i class="fas fa-box"></i>
                            </div>
                            <div class="highlight-text">
                                <h4>Original Packaging</h4>
                                <p>Items should be returned in original packaging with all accessories.</p>
                            </div>
                        </div>
                        
                        <div class="return-highlight">
                            <div class="highlight-icon">
                                <i class="fas fa-truck-loading"></i>
                            </div>
                            <div class="highlight-text">
                                <h4>Free Return Shipping</h4>
                                <p>We cover return shipping costs for defective or incorrectly shipped items.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="info-card">
                <div class="info-header">
                    <h2>Return Process</h2>
                </div>
                <div class="info-body">
                    <div class="process-steps">
                        <div class="process-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Initiate a Return</h4>
                                <p>Log in to your account and select the order containing the item you wish to return. Click on "Return Items" and follow the instructions.</p>
                            </div>
                        </div>
                        
                        <div class="process-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Package Your Return</h4>
                                <p>Place the item(s) in the original packaging with all accessories and documentation. Include the return form provided in your order.</p>
                            </div>
                        </div>
                        
                        <div class="process-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Ship the Return</h4>
                                <p>Use the prepaid shipping label (if applicable) or send the package to our returns address. We recommend using a tracked shipping service.</p>
                            </div>
                        </div>
                        
                        <div class="process-step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>Refund Processing</h4>
                                <p>Once we receive and inspect your return, we'll process your refund within 5-7 business days to your original payment method.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="return-address">
                        <h4>Returns Address:</h4>
                        <p>TechNest Returns Department<br>
                        SASH, CUET, Raozan-4349<br>
                        Chattogram, Bangladesh</p>
                    </div>
                </div>
            </div>
            
            <div class="info-card">
                <div class="info-header">
                    <h2>Refund Information</h2>
                </div>
                <div class="info-body">
                    <div class="refund-info">
                        <h4>Refund Methods</h4>
                        <p>Refunds will be issued to the original payment method used for the purchase:</p>
                        <ul>
                            <li><strong>Credit/Debit Card:</strong> 5-7 business days</li>
                            <li><strong>bKash/Rocket:</strong> 3-5 business days</li>
                            <li><strong>Bank Transfer:</strong> 7-10 business days</li>
                            <li><strong>Store Credit:</strong> Immediate</li>
                        </ul>
                    </div>
                    
                    <div class="refund-conditions">
                        <h4>Refund Conditions</h4>
                        <p>The following conditions must be met for a full refund:</p>
                        <ul>
                            <li>Item must be returned within the 30-day return window</li>
                            <li>Item must be in original, unused condition with all tags attached</li>
                            <li>All accessories, manuals, and packaging must be included</li>
                            <li>Proof of purchase must be provided (receipt or order number)</li>
                        </ul>
                    </div>
                    
                    <div class="partial-refunds">
                        <h4>Partial Refunds</h4>
                        <p>Partial refunds may be issued in the following cases:</p>
                        <ul>
                            <li>Item shows signs of use or wear</li>
                            <li>Item is returned without original packaging or accessories</li>
                            <li>Item is returned after the 30-day return period but within 45 days</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="info-card">
                <div class="info-header">
                    <h2>Non-Returnable Items</h2>
                </div>
                <div class="info-body">
                    <p>The following items cannot be returned:</p>
                    <ul class="non-returnable-list">
                        <li>Opened software or digital products</li>
                        <li>Gift cards</li>
                        <li>Personalized or custom-made items</li>
                        <li>Items marked as "Final Sale"</li>
                        <li>Earphones or earbuds once opened (for hygiene reasons)</li>
                        <li>Products with removed serial numbers or warranty seals</li>
                    </ul>
                </div>
            </div>
            
            <div class="info-card">
                <div class="info-header">
                    <h2>Returns FAQs</h2>
                </div>
                <div class="info-body">
                    <div class="shipping-faq">
                        <h4>Can I return a gift?</h4>
                        <p>Yes, gifts can be returned. You'll need the order number or gift receipt. The refund will be issued as store credit if you don't have the original payment method.</p>
                    </div>
                    
                    <div class="shipping-faq">
                        <h4>What if my item arrives damaged?</h4>
                        <p>Please contact us within 48 hours of receiving a damaged item. We'll arrange a replacement or full refund and cover all shipping costs.</p>
                    </div>
                    
                    <div class="shipping-faq">
                        <h4>Can I exchange an item instead of returning it?</h4>
                        <p>Yes, you can exchange items for a different color, size, or model of equal or greater value (paying the difference if applicable).</p>
                    </div>
                    
                    <div class="shipping-faq">
                        <h4>What if I received the wrong item?</h4>
                        <p>If you received an incorrect item, please contact customer service immediately. We'll send the correct item and arrange pickup of the wrong item at no cost to you.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="support-banner">
            <div class="support-content">
                <h3>Need Help with Shipping or Returns?</h3>
                <p>Our customer support team is available to assist you 7 days a week.</p>
                <div class="support-actions">
                    <a href="contact.php" class="btn primary-btn">Contact Support</a>
                    <a href="tel:+8801581448561" class="btn secondary-btn"><i class="fas fa-phone"></i> +88 01581-448561</a>
                </div>
            </div>
        </div>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });
});
</script>

<style>
.page-header {
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    color: white;
    padding: 60px 0;
    text-align: center;
    margin-bottom: 40px;
}

.page-header h1 {
    font-size: 42px;
    margin-bottom: 15px;
    font-weight: 700;
}

.page-header p {
    font-size: 18px;
    max-width: 700px;
    margin: 0 auto;
    opacity: 0.9;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.shipping-section {
    padding: 0 0 80px;
}

/* Tabs */
.info-tabs {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
    border-bottom: 2px solid var(--border-color);
}

.tab-btn {
    padding: 15px 30px;
    font-size: 18px;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    margin: 0 15px;
    cursor: pointer;
    font-weight: 500;
    color: var(--text-color);
    transition: all 0.3s ease;
}

.tab-btn.active {
    color: var(--primary-color);
    border-bottom: 3px solid var(--primary-color);
}

.tab-btn:hover {
    color: var(--primary-color);
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Info Cards */
.info-card {
    background: var(--card-color);
    border-radius: 10px;
    margin-bottom: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.info-header {
    background: linear-gradient(135deg, rgba(0, 82, 204, 0.1), rgba(0, 184, 212, 0.1));
    padding: 20px 25px;
    border-bottom: 1px solid var(--border-color);
}

.info-header h2 {
    margin: 0;
    font-size: 22px;
    color: var(--primary-color);
}

.info-body {
    padding: 25px;
}

/* Shipping Options */
.shipping-option {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-color);
}

.shipping-option:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
}

.option-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    margin-right: 20px;
    flex-shrink: 0;
}

.option-details {
    flex: 1;
}

.option-details h3 {
    margin: 0 0 5px;
    font-size: 18px;
}

.option-desc {
    margin: 0 0 5px;
    color: var(--text-light);
}

.option-price {
    font-weight: 600;
    color: var(--primary-color);
    margin: 0;
}

/* Delivery Areas */
.delivery-areas {
    display: flex;
    flex-wrap: wrap;
    margin: 20px 0;
    gap: 20px;
}

.area-column {
    flex: 1;
    min-width: 200px;
}

.area-column h4 {
    margin: 0 0 10px;
    color: var(--primary-color);
}

.area-column ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.area-column li {
    padding: 5px 0;
    position: relative;
    padding-left: 20px;
}

.area-column li:before {
    content: '\f3c5';
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    position: absolute;
    left: 0;
    color: var(--primary-color);
}

.note {
    background: #fff3cd;
    color: #856404;
    padding: 10px 15px;
    border-radius: 5px;
    margin-top: 20px;
    font-size: 14px;
    display: inline-block;
}

/* Tracking Options */
.tracking-options {
    margin-top: 20px;
}

.tracking-option {
    display: flex;
    margin-bottom: 20px;
}

.tracking-icon {
    width: 50px;
    height: 50px;
    background: rgba(0, 82, 204, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    font-size: 20px;
    margin-right: 20px;
    flex-shrink: 0;
}

.tracking-text h4 {
    margin: 0 0 5px;
}

.tracking-text p {
    margin: 0 0 10px;
}

/* Shipping FAQs */
.shipping-faq {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-color);
}

.shipping-faq:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
}

.shipping-faq h4 {
    margin: 0 0 10px;
    color: var(--primary-color);
}

.shipping-faq p {
    margin: 0;
}

/* Return Policy */
.return-highlights {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
}

.return-highlight {
    flex: 1;
    min-width: 250px;
    display: flex;
    align-items: center;
    background: rgba(0, 82, 204, 0.05);
    padding: 20px;
    border-radius: 8px;
    border-left: 3px solid var(--primary-color);
}

.highlight-icon {
    width: 50px;
    height: 50px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    font-size: 20px;
    margin-right: 20px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.highlight-text h4 {
    margin: 0 0 5px;
}

.highlight-text p {
    margin: 0;
}

/* Process Steps */
.process-steps {
    margin-bottom: 30px;
}

.process-step {
    display: flex;
    margin-bottom: 20px;
}

.step-number {
    width: 40px;
    height: 40px;
    background: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    font-weight: 700;
    margin-right: 20px;
    flex-shrink: 0;
}

.step-content h4 {
    margin: 0 0 5px;
}

.step-content p {
    margin: 0;
}

.return-address {
    background: rgba(0, 82, 204, 0.05);
    padding: 15px 20px;
    border-radius: 8px;
    border-left: 3px solid var(--primary-color);
    margin-top: 20px;
}

.return-address h4 {
    margin: 0 0 10px;
}

.return-address p {
    margin: 0;
    line-height: 1.6;
}

/* Refund Info */
.refund-info, .refund-conditions, .partial-refunds {
    margin-bottom: 20px;
}

.refund-info h4, .refund-conditions h4, .partial-refunds h4 {
    margin: 0 0 10px;
    color: var(--primary-color);
}

.refund-info ul, .refund-conditions ul, .partial-refunds ul {
    padding-left: 20px;
}

.refund-info li, .refund-conditions li, .partial-refunds li {
    margin-bottom: 5px;
}

.non-returnable-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 10px;
    padding: 0;
    list-style: none;
}

.non-returnable-list li {
    background: rgba(255, 0, 0, 0.05);
    padding: 10px 15px;
    border-radius: 5px;
    display: flex;
    align-items: center;
}

.non-returnable-list li:before {
    content: '\f057';
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    color: #dc3545;
    margin-right: 10px;
}

/* Support Banner */
.support-banner {
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    color: white;
    padding: 40px;
    border-radius: 10px;
    margin-top: 50px;
    text-align: center;
}

.support-content h3 {
    margin: 0 0 10px;
    font-size: 24px;
}

.support-content p {
    margin: 0 0 20px;
    opacity: 0.9;
}

.support-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
}

.btn {
    padding: 12px 25px;
}

@media (max-width: 768px) {
    .page-header {
        padding: 40px 0;
    }
    
    .page-header h1 {
        font-size: 32px;
    }
    
    .info-tabs {
        flex-direction: column;
    }
    
    .tab-btn {
        width: 100%;
        border-bottom: 2px solid var(--border-color);
    }
    
    .tab-btn.active {
        border-bottom: 2px solid var(--primary-color);
    }
    
    .shipping-option, .tracking-option, .return-highlight {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .option-icon, .tracking-icon, .highlight-icon {
        margin-bottom: 15px;
    }
    
    .support-actions {
        flex-direction: column;
    }
    
    .delivery-areas {
        flex-direction: column;
    }
}
</style>

<?php include 'includes/footer.php'; ?>