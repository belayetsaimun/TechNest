<?php
$active_page = 'home';
require_once 'includes/config.php';
require_once 'includes/functions.php';

// Set title
$title = "TechNest - Premium Tech Gadgets";

// Include header
include 'includes/header.php';
?>

<!-- Hero Section -->
<section class="hero">
    <div class="hero-container">
        <div class="hero-content">
            <div class="tech-badge">NEW RELEASE</div>
            <h1>iPhone 16 Pro</h1>
            <h2 class="gradient-text">Premium. Powerful. Perfected.</h2>
            <p class="hero-description">Introducing our most advanced iPhone ever with breakthrough camera system, incredible performance, and stunning design.</p>
            
            <div class="feature-cards">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-camera"></i>
                    </div>
                    <div class="feature-info">
                        <h3>48MP Camera</h3>
                        <p>Stunning detail with 4x optical zoom</p>
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-microchip"></i>
                    </div>
                    <div class="feature-info">
                        <h3>A17 Pro Chip</h3>
                        <p>Lightning-fast performance</p>
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-battery-full"></i>
                    </div>
                    <div class="feature-info">
                        <h3>All-day Battery</h3>
                        <p>Up to 29 hours of video playback</p>
                    </div>
                </div>
            </div>
            
            <div class="hero-buttons">
                <a href="products.php" class="btn primary-btn">Buy Now <i class="fas fa-arrow-right"></i></a>
                <a href="categories.php?category=phones" class="btn secondary-btn">Learn More</a>
            </div>
            
            <div class="tech-specs">
                <div class="spec-item">
                    <div class="spec-value">A17 Pro</div>
                    <div class="spec-label">Chip</div>
                </div>
                <div class="spec-item">
                    <div class="spec-value">6.7"</div>
                    <div class="spec-label">Display</div>
                </div>
                <div class="spec-item">
                    <div class="spec-value">48MP</div>
                    <div class="spec-label">Camera</div>
                </div>
                <div class="spec-item">
                    <div class="spec-value">8K</div>
                    <div class="spec-label">Video</div>
                </div>
            </div>
        </div>
        <div class="hero-product">
            <img src="assets/images/hero1.png" alt="iPhone 16 Pro Colors" class="iphone-display-image">
        </div>
    </div>
    <div class="hero-backdrop"></div>
</section>

<!-- Features Section -->
<section class="features">
    <div class="features-container">
        <div class="feature-item">
            <div class="feature-icon">
                <i class="fas fa-truck"></i>
            </div>
            <div class="feature-content">
                <h3>Free Shipping</h3>
                <p>On all orders above ৳50,000</p>
            </div>
        </div>
        
        <div class="feature-item">
            <div class="feature-icon">
                <i class="fas fa-shield-alt"></i>
            </div>
            <div class="feature-content">
                <h3>2 Year Warranty</h3>
                <p>On all TechNest products</p>
            </div>
        </div>
        
        <div class="feature-item">
            <div class="feature-icon">
                <i class="fas fa-headset"></i>
            </div>
            <div class="feature-content">
                <h3>24/7 Support</h3>
                <p>Dedicated customer service</p>
            </div>
        </div>
        
        <div class="feature-item">
            <div class="feature-icon">
                <i class="fas fa-undo"></i>
            </div>
            <div class="feature-content">
                <h3>Easy Returns</h3>
                <p>30-day money back guarantee</p>
            </div>
        </div>
    </div>
</section>

<!-- Featured Products Section -->
<section class="products" id="featured">
    <div class="section-header">
        <h2>Featured Products</h2>
        <p>Our most popular tech gadgets</p>
    </div>
    <div class="product-grid">
        <?php
        // Fetches products, now including the new available_colors column
        $sql = "SELECT * FROM products WHERE is_featured = 1 ORDER BY created_at DESC LIMIT 8";
        $result = mysqli_query($conn, $sql);

        if (mysqli_num_rows($result) > 0) {
            while ($product = mysqli_fetch_assoc($result)) {
        ?>
            <div class="product-card" 
                 data-id="<?php echo $product['id']; ?>" 
                 data-name="<?php echo htmlspecialchars($product['name']); ?>" 
                 data-price="<?php echo $product['price']; ?>" 
                 data-image="<?php echo BASE_URL . 'assets/images/' . htmlspecialchars($product['image_url']); ?>"
                 data-category="<?php echo htmlspecialchars($product['category']); ?>"
                 data-brand="<?php echo htmlspecialchars($product['brand']); ?>"
                 data-rating="<?php echo $product['rating']; ?>"
                 data-colors="<?php echo htmlspecialchars($product['available_colors']); ?>"
                 data-features="<?php echo htmlspecialchars($product['features']); ?>">
        
                <div class="product-image">
                    <img src="<?php echo BASE_URL . 'assets/images/' . htmlspecialchars($product['image_url']); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>">
                    <div class="product-actions">
                        <a href="#" class="quick-view quick-view-btn tooltip-container">
                            <i class="fas fa-eye"></i><span class="tooltip">Quick View</span>
                        </a>
                        <a href="#" class="add-to-wishlist tooltip-container">
                            <i class="far fa-heart"></i><span class="tooltip">Add to Wishlist</span>
                        </a>
                        <a href="#" class="add-to-cart tooltip-container">
                            <i class="fas fa-shopping-cart"></i><span class="tooltip">Add to Cart</span>
                        </a>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category"><?php echo htmlspecialchars($product['category']); ?></div>
                    <h3><?php echo htmlspecialchars($product['name']); ?></h3>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <span>(<?php echo $product['review_count']; ?>)</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">৳<?php echo number_format($product['price']); ?></span>
                        <?php if (!empty($product['old_price']) && $product['old_price'] > 0): ?>
                            <span class="old-price">৳<?php echo number_format($product['old_price']); ?></span>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php
            } // End of while loop
        } else {
            echo "<p>No featured products found.</p>";
        }
        ?>
    </div>
    <a href="<?php echo BASE_URL; ?>products.php" class="btn view-all-btn pulse-animation">
        Explore All Products
        <span class="btn-icon"><i class="fas fa-arrow-right"></i></span>
    </a>
</section>

<!-- Categories Section -->
<section class="categories" id="categories">
    <div class="section-header">
        <h2>Shop By Category</h2>
        <p>Browse our tech collections</p>
    </div>
    <div class="category-grid">
        <?php
        // SQL query to get each unique category and the count of products in it
        $category_sql = "SELECT category, COUNT(*) as product_count FROM products GROUP BY category ORDER BY product_count DESC";
        $category_result = mysqli_query($conn, $category_sql);

        if (mysqli_num_rows($category_result) > 0) {
            while ($category_row = mysqli_fetch_assoc($category_result)) {
                $category_name = $category_row['category'];
                $product_count = $category_row['product_count'];
                
                // Set default icon and image based on category name
                $icon_class = 'fa-laptop'; // default icon
                $image_file = 'Laptops.png'; // default image

                if ($category_name == 'phones') {
                    $icon_class = 'fa-mobile-alt';
                    $image_file = 'iphone.png';
                } elseif ($category_name == 'headphones') {
                    $icon_class = 'fa-headphones';
                    $image_file = 'headphones.png';
                } elseif ($category_name == 'earbuds') {
                    $icon_class = 'fa-dot-circle';
                    $image_file = 'airpodsM.png';
                } elseif ($category_name == 'tablets') {
                    $icon_class = 'fa-tablet-alt';
                    $image_file = 'ipads.png';
                } elseif ($category_name == 'smartwatches') {
                    $icon_class = 'fa-stopwatch';
                    $image_file = 'apple-watch.png';
                }
        ?>
                <div class="category-card">
                    <a href="<?php echo BASE_URL; ?>products.php?category=<?php echo urlencode($category_name); ?>">
                        <div class="category-image">
                            <img src="<?php echo BASE_URL; ?>assets/images/<?php echo $image_file; ?>" alt="<?php echo htmlspecialchars(ucfirst($category_name)); ?>">
                            <div class="hover-overlay"></div>
                        </div>
                        <div class="category-info">
                            <h3><i class="fas <?php echo $icon_class; ?>"></i> <?php echo htmlspecialchars(ucfirst($category_name)); ?></h3>
                            <p>
                                <span class="product-count"><?php echo $product_count; ?> Products</span>
                                <span class="shop-now">Shop Now <i class="fas fa-arrow-right"></i></span>
                            </p>
                        </div>
                    </a>
                </div>
        <?php
            }
        }
        ?>
    </div>
</section>

<!-- Deals Section -->
<section class="deals" id="deals">
    <div class="deal-banner">
        <div class="deal-content">
            <div class="tech-badge sale-badge">HOT DEAL</div>
            <h2>Limited Time Offer</h2>
            <h3>Save up to 50% on selected items</h3>
            <p>Hurry up! Offer ends in:</p>
            
            <div class="countdown" id="countdown">
                <div class="countdown-item">
                    <span id="days">00</span>
                    <p>Days</p>
                </div>
                <div class="countdown-item">
                    <span id="hours">00</span>
                    <p>Hours</p>
                </div>
                <div class="countdown-item">
                    <span id="minutes">00</span>
                    <p>Minutes</p>
                </div>
                <div class="countdown-item">
                    <span id="seconds">00</span>
                    <p>Seconds</p>
                </div>
            </div>
            
            <a href="deals.php?sale=true" class="btn primary-btn">Shop the Sale <i class="fas fa-tag"></i></a>
        </div>
    </div>
</section>

<!-- Testimonials Section -->
    <section class="testimonials">
        <div class="section-header">
            <h2>What Our Customers Say</h2>
            <p>Read reviews from our satisfied customers</p>
        </div>
        <div class="testimonial-wrapper">
            <div class="testimonial-carousel" id="testimonialCarousel">
                <!-- Slide 1 -->
                <div class="testimonial-slide">
                    <div class="testimonial-card">
                        <div class="testimonial-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <p class="testimonial-text">"Upgraded to the MacBook Pro 16-inch M3 from TechNest and the performance is breathtaking. As a video editor, rendering times have been cut in half. The Liquid Retina XDR display is stunning. Absolutely essential for any creative professional."</p>
                        <div class="testimonial-author">
                            <div class="author-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <div>
                                <h4>Ramim Kaiser</h4>
                                <p>Verified Buyer</p>
                            </div>
                        </div>
                    </div>
                    <div class="testimonial-card">
                        <div class="testimonial-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half-alt"></i>
                        </div>
                        <p class="testimonial-text">"The customer service at TechNest is exceptional! They went above and beyond to help me with my order. The AirPods Pro are fantastic too!"</p>
                        <div class="testimonial-author">
                            <div class="author-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <div>
                                <h4>Abrar Hoque</h4>
                                <p>Verified Buyer</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Slide 2 -->
                <div class="testimonial-slide">
                    <div class="testimonial-card">
                        <div class="testimonial-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <p class="testimonial-text">"I bought the Samsung Galaxy S24 Ultra, and the 200MP camera is a game-changer. The S Pen is more useful than I ever imagined for taking quick notes. TechNest's customer support was very helpful in answering my questions before I bought it."</p>
                        <div class="testimonial-author">
                            <div class="author-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <div>
                                <h4>Anika Sheikh</h4>
                                <p>Verified Buyer</p>
                            </div>
                        </div>
                    </div>
                    <div class="testimonial-card">
                        <div class="testimonial-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <p class="testimonial-text">"I was hesitant about the price of the Canon EOS R5, but it's worth every taka. The 8K video quality is insane, and the autofocus is lightning fast. TechNest delivered it quickly and safely. Their 2-year warranty gives me total peace of mind."</p>
                        <div class="testimonial-author">
                            <div class="author-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <div>
                                <h4>Farhan Shahriar</h4>
                                <p>Verified Buyer</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Slide 3 -->
                <div class="testimonial-slide">
                    <div class="testimonial-card">
                        <div class="testimonial-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="far fa-star"></i>
                        </div>
                        <p class="testimonial-text">"The Sony WH-1000XM5 headphones are simply the best for noise cancellation. Perfect for my daily commute and focusing at work. The sound is crystal clear. TechNest had a great deal on them during their flash sale!"</p>
                        <div class="testimonial-author">
                            <div class="author-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <div>
                                <h4>Turja Das</h4>
                                <p>Verified Buyer</p>
                            </div>
                        </div>
                    </div>
                    <div class="testimonial-card">
                        <div class="testimonial-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <p class="testimonial-text">"Finally got my hands on a PlayStation 5 from TechNest! The experience is next-level, from the haptic feedback on the controller to the instant load times. The service was fantastic, and I couldn't be happier with my purchase."</p>
                        <div class="testimonial-author">
                            <div class="author-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <div>
                                <h4>Riyad Mahmud</h4>
                                <p>Verified Buyer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="testimonial-dots">
            <span class="dot active" data-slide="0"></span>
            <span class="dot" data-slide="1"></span>
            <span class="dot" data-slide="2"></span>
        </div>
    </section>
<!-- Newsletter Section -->
<section class="newsletter">
    <div class="newsletter-content">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Get the latest updates on new products and exclusive offers</p>
        
        <form class="newsletter-form" action="<?php echo BASE_URL; ?>process_newsletter.php" method="POST">
            <input type="email" name="email" placeholder="Your Email Address" required>
            <button type="submit" class="btn primary-btn">Subscribe <i class="fas fa-paper-plane"></i></button>
        </form>
    </div>
</section>
    
<?php include 'includes/footer.php'; ?>