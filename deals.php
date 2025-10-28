<?php
$active_page = 'deals';
$title = "TechNest - Premium Tech Deals";
require_once 'includes/config.php';
require_once 'includes/functions.php';
include 'includes/header.php';
?>

<section class="deals-hero-new">
    <div class="deals-hero-overlay"></div>
    <div class="deals-hero-container">
        <div class="hero-left">
            <div class="sale-announcement">
                <div class="sale-badge-large">
                    <span class="sale-value">50%</span>
                    <span class="sale-text">OFF</span>
                </div>
                <h1>MEGA TECH SALE</h1>
            </div>
            <div class="sale-description">
                <p>For a limited time only, get massive savings on our premium collection of smartphones, audio devices, and more!</p>
            </div>
            <div class="countdown-container">
                <div class="countdown-label">HURRY! OFFER ENDS IN:</div>
                <div class="countdown-timer">
                    <div class="timer-block">
                        <div class="time-value" id="days">00</div>
                        <div class="time-label">DAYS</div>
                    </div>
                    <div class="timer-separator">:</div>
                    <div class="timer-block">
                        <div class="time-value" id="hours">00</div>
                        <div class="time-label">HRS</div>
                    </div>
                    <div class="timer-separator">:</div>
                    <div class="timer-block">
                        <div class="time-value" id="minutes">00</div>
                        <div class="time-label">MIN</div>
                    </div>
                    <div class="timer-separator">:</div>
                    <div class="timer-block">
                        <div class="time-value" id="seconds">00</div>
                        <div class="time-label">SEC</div>
                    </div>
                </div>
            </div>
            <div class="hero-action">
                <a href="#featured" class="btn primary-btn shop-now-btn">SHOP DEALS NOW <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
        <div class="hero-right">
            <div class="featured-products-display">
                <div class="product-display-item product-1">
                    <div class="product-discount-tag">-30%</div>
                    <img src="<?php echo BASE_URL; ?>assets/images/iphone16W.png" alt="iPhone 16 Pro">
                </div>
                <div class="product-display-item product-2">
                    <div class="product-discount-tag">-40%</div>
                    <img src="<?php echo BASE_URL; ?>assets/images/headphoneh.png" alt="Headphones">
                </div>
                <div class="product-display-item product-3">
                    <div class="product-discount-tag">-25%</div>
                    <img src="<?php echo BASE_URL; ?>assets/images/appwatch.png" alt="SmartWatch">
                </div>
            </div>
        </div>
    </div>
    <div class="deal-features">
        <div class="deal-feature-item">
            <i class="fas fa-tag"></i>
            <span>Up to 50% Off Selected Items</span>
        </div>
        <div class="deal-feature-item">
            <i class="fas fa-shipping-fast"></i>
            <span>Free Express Shipping</span>
        </div>
        <div class="deal-feature-item">
            <i class="fas fa-gift"></i>
            <span>Free Accessories & Gifts</span>
        </div>
        <div class="deal-feature-item">
            <i class="fas fa-shield-alt"></i>
            <span>Extended Warranty</span>
        </div>
    </div>
</section>

<section class="featured-deals" id="featured">
    <div class="section-header">
        <h2>Limited Time Offers</h2>
        <p>Grab these hot deals before they expire</p>
    </div>

    <div class="deal-categories">
        <button class="deal-category active" data-category="all">All Deals</button>
        <button class="deal-category" data-category="flash-sale">Flash Sale</button>
        <button class="deal-category" data-category="clearance">Clearance</button>
        <button class="deal-category" data-category="bundle">Bundle Offers</button>
        <button class="deal-category" data-category="weekly">Weekly Deals</button>
    </div>

    <div class="deals-grid">
        <?php
        // [UPDATE] We will now fetch deals in two parts and merge them.

        $all_deals = [];

        $specific_deals_sql = "SELECT * FROM products WHERE deal_type IS NOT NULL AND deal_type NOT IN ('coming-soon', 'deal-of-the-day') AND deal_expires > NOW()";
        $specific_deals_result = mysqli_query($conn, $specific_deals_sql);
        if ($specific_deals_result) {
            while ($deal = mysqli_fetch_assoc($specific_deals_result)) {
            // Prevent duplicates by using the product ID as the array key
            $all_deals[$deal['id']] = $deal;
        }
    }

        $exclude_ids = !empty($all_deals) ? implode(',', array_keys($all_deals)) : '0';
        // --- Part 2: Get a few random products to display as deals ---
        $random_deals_sql = "SELECT * FROM products WHERE deal_type IS NULL ORDER BY RAND() LIMIT 4";
        $random_deals_result = mysqli_query($conn, $random_deals_sql);
        if ($random_deals_result) {
            while ($deal = mysqli_fetch_assoc($random_deals_result)) {
                // Create a temporary "deal" for these random products
                $deal['deal_type'] = 'special-offer'; // for styling
                $deal['old_price'] = $deal['price'] * 1.25; // Create a fictional 25% discount
                $all_deals[] = $deal;
            }
        }

        // --- Part 3: Display all the combined deals ---
        if (!empty($all_deals)) {
            // Shuffle the final array to mix specific deals with random ones
            shuffle($all_deals);

            foreach ($all_deals as $product) {
                $old_price = !empty($product['old_price']) ? $product['old_price'] : $product['price'] * 1.25;
                $discount_percentage = round((($old_price - $product['price']) / $old_price) * 100);
        ?>
                <div class="deal-card" 
                     data-category="<?php echo htmlspecialchars($product['deal_type']); ?>" 
                     data-id="<?php echo $product['id']; ?>" 
                     data-name="<?php echo htmlspecialchars($product['name']); ?>" 
                     data-price="<?php echo $product['price']; ?>" 
                     data-image="<?php echo BASE_URL . 'assets/images/' . htmlspecialchars($product['image_url']); ?>"
                     data-brand="<?php echo htmlspecialchars($product['brand']); ?>"
                     data-category="<?php echo htmlspecialchars($product['category']); ?>"
                     data-colors="<?php echo htmlspecialchars($product['available_colors']); ?>"
                     data-features="<?php echo htmlspecialchars($product['features']); ?>">
                     
                    
                    <div class="deal-badge <?php echo htmlspecialchars($product['deal_type']); ?>">
                        <?php echo htmlspecialchars(str_replace('-', ' ', $product['deal_type'])); ?> -<?php echo $discount_percentage; ?>%
                    </div>
                    <div class="deal-image">
                        <img src="<?php echo BASE_URL . 'assets/images/' . htmlspecialchars($product['image_url']); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>">
                        <?php if(!empty($product['deal_expires'])): ?>
                        <div class="deal-overlay">
                            <div class="deal-timer" data-expires="<?php echo $product['deal_expires']; ?>">
                                <i class="fas fa-clock"></i> <span class="deal-countdown">Loading...</span>
                            </div>
                        </div>
                        <?php endif; ?>
                        <div class="product-actions">
                            <a href="#" class="quick-view tooltip-container"><i class="fas fa-eye"></i><span class="tooltip">Quick View</span></a>
                            <a href="#" class="add-to-wishlist tooltip-container"><i class="far fa-heart"></i><span class="tooltip">Add to Wishlist</span></a>
                            <a href="#" class="add-to-cart tooltip-container"><i class="fas fa-shopping-cart"></i><span class="tooltip">Add to Cart</span></a>
                        </div>
                    </div>
                    <div class="deal-info">
                        <div class="product-category"><?php echo htmlspecialchars(ucfirst($product['category'])); ?></div>
                        <h3><?php echo htmlspecialchars($product['name']); ?></h3>
                        <div class="product-rating">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                            <span>(<?php echo $product['review_count']; ?>)</span>
                        </div>
                        <div class="deal-prices">
                            <div class="deal-price">
                                <span class="current-price">৳<?php echo number_format($product['price']); ?></span>
                                <span class="old-price">৳<?php echo number_format($old_price); ?></span>
                            </div>
                            <div class="deal-save">
                                <span>-<?php echo $discount_percentage; ?>%</span>
                            </div>
                        </div>
                    </div>
                </div>
        <?php
            } // End foreach loop
        } else {
            echo "<p style='text-align: center; grid-column: 1 / -1;'>No active deals available right now. Check back soon!</p>";
        }
        ?>
    </div>

    <a href="#" class="btn view-all-btn pulse-animation" id="loadMoreBtn">
        Load More Deals
        <span class="btn-icon"><i class="fas fa-arrow-right"></i></span>
    </a>
</section>

<section class="deal-of-the-day">
    <div class="section-header">
        <h2>Deal of the Day</h2>
        <p>Don't miss out on our best offer today</p>
    </div>

    <div class="dotd-container">
        <div class="dotd-image">
            <img src="<?php echo BASE_URL; ?>assets/images/macprom3.png" alt="MacBook Pro">
            <div class="dotd-badge">
                <div class="badge-text">40% OFF</div>
            </div>
        </div>
        <div class="dotd-content">
            <div class="tech-badge">EXCLUSIVE OFFER</div>
            <h3 class="dotd-title">MacBook Pro M3</h3>
            <div class="dotd-subtitle">16-inch Liquid Retina XDR display, 16GB RAM, 512GB SSD</div>
            
            <div class="dotd-price">
                <div class="price-tag">
                    <span class="current-price">৳189,999</span>
                    <span class="old-price">৳235,000</span>
                </div>
                <div class="save-tag">You Save: <span>৳45,001</span></div>
            </div>
            
            <div class="dotd-features">
                <div class="feature-item">
                    <i class="fas fa-check-circle"></i>
                    <span>M3 Pro chip - Ultimate Performance</span>
                </div>
                <div class="feature-item">
                    <i class="fas fa-check-circle"></i>
                    <span>Up to 22 hours battery life</span>
                </div>
                <div class="feature-item">
                    <i class="fas fa-check-circle"></i>
                    <span>Stunning Liquid Retina XDR display</span>
                </div>
                <div class="feature-item">
                    <i class="fas fa-check-circle"></i>
                    <span>Free AirPods included in this offer</span>
                </div>
            </div>
            
            <div class="dotd-timer">
                <div class="timer-label">Hurry! Offer ends in:</div>
                <div class="timer-display">
                    <div class="timer-item">
                        <span id="dotd-hours">00</span>
                        <span class="timer-label">Hours</span>
                    </div>
                    <div class="timer-divider">:</div>
                    <div class="timer-item">
                        <span id="dotd-minutes">00</span>
                        <span class="timer-label">Mins</span>
                    </div>
                    <div class="timer-divider">:</div>
                    <div class="timer-item">
                        <span id="dotd-seconds">00</span>
                        <span class="timer-label">Secs</span>
                    </div>
                </div>
            </div>
            
            <div class="dotd-progress">
                <div class="progress-container">
                    <div class="progress-bar" style="width: 70%"></div>
                </div>
                <div class="stock-info">
                    <div class="items-sold"><span>42</span> sold</div>
                    <div class="items-available"><span>18</span> left</div>
                </div>
            </div>
            
            <div class="dotd-actions">
                <button class="btn primary-btn buy-now-btn">Buy Now <i class="fas fa-arrow-right"></i></button>
                <button class="btn secondary-btn add-to-cart-btn"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
            </div>
        </div>
    </div>
</section>
<section class="special-offers">
    <div class="section-header">
        <h2>Special Promotions</h2>
        <p>Exclusive offers just for you</p>
    </div>
    
    <div class="offers-banner">
        <div class="offer-card">
            <div class="offer-icon"><i class="fas fa-gift"></i></div>
            <h3>Buy One Get One Free</h3>
            <p>On selected accessories</p>
            <a href="#" class="btn secondary-btn">View Offers</a>
        </div>
        <div class="offer-card">
            <div class="offer-icon"><i class="fas fa-mobile-alt"></i></div>
            <h3>Trade-in & Save</h3>
            <p>Up to ৳50,000 off on new phones</p>
            <a href="#" class="btn secondary-btn">Learn More</a>
        </div>
        <div class="offer-card">
            <div class="offer-icon"><i class="fas fa-percent"></i></div>
            <h3>Student Discount</h3>
            <p>Extra 10% off with valid ID</p>
            <a href="#" class="btn secondary-btn">Check Eligibility</a>
        </div>
    </div>
</section>

<section class="coupons-section">
    <div class="section-header">
        <h2>Exclusive Coupons</h2>
        <p>Save even more with these special codes</p>
    </div>
    
    <div class="coupons-container">
        <div class="coupon-card">
            <div class="coupon-amount">৳5,000 OFF</div>
            <div class="coupon-details">
                <h3>On purchases over ৳50,000</h3>
                <p>Valid on all smartphones and laptops</p>
            </div>
            <div class="coupon-code">
                <span>TECH5K</span>
                <button class="copy-btn" data-coupon="TECH5K">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="coupon-expiry">Expires: July 22, 2025</div>
        </div>
        
        <div class="coupon-card">
            <div class="coupon-amount">15% OFF</div>
            <div class="coupon-details">
                <h3>On all accessories</h3>
                <p>Cases, chargers, screen protectors & more</p>
            </div>
            <div class="coupon-code">
                <span>ACCESS15</span>
                <button class="copy-btn" data-coupon="ACCESS15">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="coupon-expiry">Expires: July 25, 2025</div>
        </div>
        
        <div class="coupon-card">
            <div class="coupon-amount">FREE SHIPPING</div>
            <div class="coupon-details">
                <h3>On any order</h3>
                <p>No minimum purchase required</p>
            </div>
            <div class="coupon-code">
                <span>SHIPFREE</span>
                <button class="copy-btn" data-coupon="SHIPFREE">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="coupon-expiry">Expires: July 23, 2025</div>
        </div>
    </div>
</section>

<!-- <section class="faq-section">
    <div class="section-header">
        <h2>Frequently Asked Questions</h2>
        <p>Everything you need to know about our deals</p>
    </div>
    
    <div class="faq-container">
        <div class="faq-item">
            <div class="faq-question">
                <h3>How long do the flash sales last?</h3>
                <div class="faq-icon"><i class="fas fa-chevron-down"></i></div>
            </div>
            <div class="faq-answer">
                <p>Our flash sales typically last between 24-72 hours, depending on the promotion. Each deal has its own countdown timer showing exactly when the offer expires. Once the timer reaches zero, the deal is removed automatically. Flash sales are designed to create urgency, so they're intentionally short-duration events.</p>
            </div>
        </div>
        
        <div class="faq-item">
            <div class="faq-question">
                <h3>Can I combine multiple discounts or coupons?</h3>
                <div class="faq-icon"><i class="fas fa-chevron-down"></i></div>
            </div>
            <div class="faq-answer">
                <p>Most of our promotions cannot be combined with other offers. Each product can only have one discount applied at checkout. However, free shipping coupons can often be used alongside product discounts. If you're a student or have a special membership, those discounts might apply in addition to sale prices. Check the terms of each promotion for specific details.</p>
            </div>
        </div>
        
        <div class="faq-item">
            <div class="faq-question">
                <h3>What happens if a deal sells out before the timer ends?</h3>
                <div class="faq-icon"><i class="fas fa-chevron-down"></i></div>
            </div>
            <div class="faq-answer">
                <p>All our deals are available while supplies last. Once a product sells out, the deal will be marked as "Sold Out" even if the timer hasn't expired. We recommend adding items to your cart as soon as possible if you're interested. For high-demand products, we sometimes implement a waitlist system in case of cancellations or additional stock becoming available.</p>
            </div>
        </div>
        
        <div class="faq-item">
            <div class="faq-question">
                <h3>Are sale items eligible for returns?</h3>
                <div class="faq-icon"><i class="fas fa-chevron-down"></i></div>
            </div>
            <div class="faq-answer">
                <p>Yes, all sale items follow our standard return policy of 30 days, unless otherwise specified in the product description. If you're not satisfied with your purchase, you can return items in their original condition with all packaging for a full refund. Please note that shipping costs for returns are not refundable unless the item was defective or we made an error in your order.</p>
            </div>
        </div>
        
        <div class="faq-item">
            <div class="faq-question">
                <h3>How do I know if a deal is good value?</h3>
                <div class="faq-icon"><i class="fas fa-chevron-down"></i></div>
            </div>
            <div class="faq-answer">
                <p>We always display the original price alongside the sale price, so you can see exactly how much you're saving. The percentage discount and total amount saved are also clearly shown. All our discounts are calculated based on genuine previous selling prices, not inflated RRPs. We also provide product specifications and feature comparisons to help you make informed decisions about the value.</p>
            </div>
        </div>
    </div>
</section> -->

<!-- Add direct inline styles -->
<style>
    /* FAQ Accordion Direct Styles */
    .faq-section {
        padding: 80px 5%;
        max-width: 1100px;
        margin: 0 auto;
    }
    
    .faq-container {
        margin-top: 40px;
    }
    
    .faq-item {
        background-color: var(--card-color);
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        margin-bottom: 15px;
        overflow: hidden;
        border: 1px solid #eee;
    }
    
    .dark-mode .faq-item {
        border-color: rgba(255, 255, 255, 0.1);
    }
    
    .faq-question {
        padding: 20px 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        position: relative;
    }
    
    .faq-question h3 {
        font-size: 18px;
        margin: 0;
        padding-right: 30px;
    }
    
    .faq-icon {
        position: absolute;
        right: 25px;
        transition: transform 0.3s ease;
    }
    
    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.5s ease;
        padding: 0 25px;
    }
    
    .faq-item.active .faq-answer {
        max-height: 400px;
        padding-bottom: 25px;
    }
    
    .faq-answer p {
        line-height: 1.6;
        margin-top: 0;
    }
    
    .faq-item.active {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        border-color: var(--primary-color, #0052cc);
    }
    
    .faq-item.active .faq-icon i {
        transform: rotate(180deg);
    }
</style>


<section class="newsletter">
    <div class="newsletter-content">
        <h2>Get Exclusive Deal Alerts</h2>
        <p>Subscribe to our newsletter and be the first to know about flash sales and limited-time offers</p>
        <form class="newsletter-form">
            <input type="email" placeholder="Your Email Address" required>
            <button type="submit" class="btn primary-btn">Subscribe <i class="fas fa-paper-plane"></i></button>
        </form>
        <div class="newsletter-benefits">
            <div class="benefit-item">
                <i class="fas fa-bolt"></i>
                <span>Early access to sales</span>
            </div>
            <div class="benefit-item">
                <i class="fas fa-tag"></i>
                <span>Exclusive subscriber offers</span>
            </div>
            <div class="benefit-item">
                <i class="fas fa-bell"></i>
                <span>Sale alerts</span>
            </div>
        </div>
    </div>
</section>

<?php
include 'includes/footer.php';
?>