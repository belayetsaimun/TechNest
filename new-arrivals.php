<?php
$active_page = 'new-arrivals';
$title = "TechNest - New Arrivals";
require_once 'includes/config.php';
require_once 'includes/functions.php';
include 'includes/header.php';
?>

<section class="new-arrivals-hero">
    <div class="hero-backdrop"></div>
    <div class="floating-elements">
        <div class="floating-circle circle-1"></div>
        <div class="floating-circle circle-2"></div>
        <div class="floating-circle circle-3"></div>
    </div>
    <div class="hero-container">
        <div class="hero-content">
            <div class="tech-badge new-arrival-badge">
                <i class="fas fa-sparkles"></i>
                JUST ARRIVED
            </div>
            <h1>The Latest Tech</h1>
            <h2 class="gradient-text">Fresh. Innovative. Amazing.</h2>
            <p class="hero-description">
                Discover cutting-edge technology that just landed at TechNest. Be among the first to experience tomorrow's tech today with our exclusive new arrivals collection.
            </p>
            
            <div class="hero-stats">
                <div class="stat-item">
                    <div class="stat-number">15+</div>
                    <div class="stat-label">New Products</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">5</div>
                    <div class="stat-label">Categories</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">24h</div>
                    <div class="stat-label">Fresh Stock</div>
                </div>
            </div>
            
            <div class="hero-buttons">
                <a href="#latest-products" class="btn primary-btn pulse-animation">
                    <i class="fas fa-rocket"></i>
                    Explore New Arrivals
                </a>
                <a href="#featured-arrival" class="btn secondary-btn">
                    <i class="fas fa-star"></i>
                    View Featured
                </a>
            </div>
        </div>
        <div class="hero-product">
            <div class="product-showcase">
                <img src="<?php echo BASE_URL; ?>assets/images/headphoneW.png" alt="Latest Technology Devices" class="showcase-image">
                <div class="showcase-glow"></div>
                <div class="floating-badge new-badge">
                    <i class="fas fa-bolt"></i>
                    NEW
                </div>
                <div class="tech-particles">
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- <section class="filter-section">
    <div class="filter-container">
        <div class="filter-header">
            <h3><i class="fas fa-filter"></i> Filter Products</h3>
            <div class="active-filters" id="activeFilters"></div>
        </div>
        <div class="filter-controls">
            <div class="filter-group">
                <label>Categories:</label>
                <div class="filter-options">
                    <button class="filter-btn active" data-filter="all">
                        <i class="fas fa-th"></i> All
                    </button>
                    <button class="filter-btn" data-filter="phones">
                        <i class="fas fa-mobile-alt"></i> Phones
                    </button>
                    <button class="filter-btn" data-filter="tablets">
                        <i class="fas fa-tablet-alt"></i> Tablets
                    </button>
                    <button class="filter-btn" data-filter="laptops">
                        <i class="fas fa-laptop"></i> Laptops
                    </button>
                    <button class="filter-btn" data-filter="audio">
                        <i class="fas fa-headphones"></i> Audio
                    </button>
                    <button class="filter-btn" data-filter="wearables">
                        <i class="fas fa-watch"></i> Wearables
                    </button>
                </div>
            </div>
            <div class="sort-group">
                <label for="sort-select"><i class="fas fa-sort"></i> Sort by:</label>
                <select id="sort-select" class="sort-select">
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                </select>
            </div>
        </div>
    </div>
</section> -->

<section class="latest-products" id="latest-products">
    <div class="section-header">
        <h2>Latest Arrivals</h2>
        <p>Discover our newest collection of cutting-edge technology</p>
    </div>

    <div class="products-grid" id="productsGrid">
        <?php
        // SQL query to get the most recent products (e.g., the latest 12)
        $sql = "SELECT *, DATEDIFF(NOW(), created_at) as days_ago FROM products ORDER BY created_at DESC LIMIT 12";
        $result = mysqli_query($conn, $sql);

        if ($result && mysqli_num_rows($result) > 0) {
            while ($product = mysqli_fetch_assoc($result)) {
                
                // Determine the "time ago" text
                $days_ago = $product['days_ago'];
                $time_ago_text = '';
                if ($days_ago == 0) {
                    $time_ago_text = 'Added today';
                } elseif ($days_ago == 1) {
                    $time_ago_text = 'Added yesterday';
                } elseif ($days_ago <= 7) {
                    $time_ago_text = "Added $days_ago days ago";
                } else {
                    $time_ago_text = 'Added over a week ago';
                }
        ?>
                <div class="product-card new-product" 
                    data-id="<?php echo $product['id']; ?>" 
                    data-name="<?php echo htmlspecialchars($product['name']); ?>" 
                    data-price="<?php echo $product['price']; ?>" 
                    data-image="<?php echo BASE_URL . 'assets/images/' . htmlspecialchars($product['image_url']); ?>"
                    data-category="<?php echo htmlspecialchars($product['category']); ?>"
                    data-brand="<?php echo htmlspecialchars($product['brand']); ?>"
                    data-rating="<?php echo $product['rating']; ?>"
                    data-colors="<?php echo htmlspecialchars($product['available_colors']); ?>"
                    data-features="<?php echo htmlspecialchars($product['features']); ?>">
                    
                    <div class="product-badge new-badge">Just In</div>
                    <div class="product-image">
                        <img src="<?php echo BASE_URL . 'assets/images/' . htmlspecialchars($product['image_url']); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>">
                        <div class="product-actions">
                            <a href="#" class="quick-view tooltip-container"><i class="fas fa-eye"></i><span class="tooltip">Quick View</span></a>
                            <a href="#" class="add-to-wishlist tooltip-container"><i class="far fa-heart"></i><span class="tooltip">Add to Wishlist</span></a>
                            <a href="#" class="add-to-cart tooltip-container"><i class="fas fa-shopping-cart"></i><span class="tooltip">Add to Cart</span></a>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-category"><?php echo htmlspecialchars(ucfirst($product['category'])); ?></div>
                        <div class="arrival-date">
                            <i class="fas fa-calendar-alt"></i>
                            <?php echo $time_ago_text; ?>
                        </div>
                        <h3><?php echo htmlspecialchars($product['name']); ?></h3>
                        <div class="product-rating">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
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
            } // End while loop
        } else {
            echo "<p>No new products found at the moment. Please check back later!</p>";
        }
        ?>
    </div>
</section>
<div class="load-more-section">
    <button class="btn secondary-btn load-more-btn" id="loadMoreBtn">
        <i class="fas fa-plus-circle"></i>
        Load More Products
        <span class="btn-subtitle">More items available</span>
    </button>
</div>
</section>
<section class="featured-arrival" id="featured-arrival">
    <div class="section-header">
        <h2>Featured New Arrival</h2>
        <p>Spotlight on our most exciting new product</p>
    </div>
    
    <div class="featured-container">
        <div class="featured-image">
            <div class="image-glow"></div>
            <img src="<?php echo BASE_URL; ?>assets/images/iphone16T.png" alt="iPhone 16 Pro Max" id="featuredProductImage">
            <div class="featured-badges">
                <div class="featured-badge spotlight">
                    <i class="fas fa-crown"></i>
                    Editor's Choice
                </div>
                <div class="featured-badge rating">
                    <i class="fas fa-star"></i>
                    4.9/5
                </div>
            </div>
            <div class="tech-specs-preview">
                <div class="spec-preview">
                    <i class="fas fa-microchip"></i>
                    <span>A17 Pro</span>
                </div>
                <div class="spec-preview">
                    <i class="fas fa-camera"></i>
                    <span>48MP</span>
                </div>
                <div class="spec-preview">
                    <i class="fas fa-battery-full"></i>
                    <span>29h</span>
                </div>
            </div>
        </div>
        <div class="featured-content">
            <div class="featured-header">
                <div class="product-category premium">Premium Smartphone</div>
                <h3>iPhone 16 Pro Max</h3>
                <div class="featured-rating">
                    <div class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                    </div>
                    <span class="rating-details">4.8/5 • 1,247 reviews</span>
                </div>
            </div>
            
            <div class="featured-price">
                <div class="price-main">৳219,999</div>
                <div class="price-details">
                    <span class="old-price">৳225,999</span>
                    <span class="discount-badge">Save ৳6,000</span>
                </div>
            </div>
            
            <div class="featured-description">
                <p>Experience the future with the all-new iPhone 16 Pro Max. Featuring the groundbreaking A17 Pro chip, revolutionary camera system, and stunning all-day battery life.</p>
                
                <div class="key-features">
                    <h4><i class="fas fa-sparkles"></i> Key Highlights</h4>
                    <div class="features-grid">
                        <div class="feature-item">
                            <i class="fas fa-mobile-alt"></i>
                            <div>
                                <strong>6.9" Super Retina XDR</strong>
                                <p>ProMotion 120Hz display</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-microchip"></i>
                            <div>
                                <strong>A17 Pro Chip</strong>
                                <p>6-core CPU with Neural Engine</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-camera"></i>
                            <div>
                                <strong>48MP Pro Camera</strong>
                                <p>4x optical zoom range</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-battery-full"></i>
                            <div>
                                <strong>All-Day Battery</strong>
                                <p>Up to 29 hours video playback</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="color-options">
                    <h4><i class="fas fa-palette"></i> Available Colors</h4>
                    <div class="colors">
                        <span class="color black" data-color="Black" title="Black Titanium"></span>
                        <span class="color titanium active" data-color="Titanium" title="Natural Titanium"></span>
                        <span class="color blue" data-color="Blue" title="Blue Titanium"></span>
                        <span class="color white" data-color="White" title="White Titanium"></span>
                    </div>
                    <span class="selected-color">Selected: <strong>Titanium</strong></span>
                </div>
            </div>
            
            <div class="featured-actions">
                <!-- Add unique IDs for featured buttons -->
                <button class="btn primary-btn featured-add-cart" id="featuredAddToCartBtn">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
                <button class="btn secondary-btn featured-buy-now" id="featuredBuyNowBtn">
                    <i class="fas fa-bolt"></i>
                    Buy Now
                </button>
                <button class="wishlist-btn featured-wishlist" id="featuredWishlistBtn">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            
            <div class="additional-info">
                <div class="info-item">
                    <i class="fas fa-truck"></i>
                    <span>Free shipping on orders over ৳5,000</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-shield-alt"></i>
                    <span>2-year warranty with premium support</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-undo"></i>
                    <span>30-day hassle-free returns</span>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="coming-soon">
    <div class="section-header">
        <h2>Coming Soon</h2>
        <p>Get ready for the next wave of innovation</p>
    </div>

    <div class="coming-soon-container">
        <div class="coming-soon-slider" id="comingSoonSlider">
            <div class="coming-soon-slide active">
                <div class="coming-soon-card">
                    <div class="coming-soon-badge countdown">
                        <i class="fas fa-clock"></i>
                        <span>7 Days Left</span>
                    </div>
                    <div class="coming-soon-image">
                        <img src="<?php echo BASE_URL; ?>assets/images/VR.png" alt="VR Headset Pro">
                        <div class="coming-soon-glow"></div>
                    </div>
                    <div class="coming-soon-info">
                        <div class="product-category">Virtual Reality</div>
                        <h3>VR Headset Pro</h3>
                        <p>Next-generation virtual reality with ultra-high resolution, haptic feedback, and wireless freedom for the ultimate immersive experience.</p>
                        <div class="coming-features">
                            <span class="feature-tag">4K Display</span>
                            <span class="feature-tag">Haptic Feedback</span>
                            <span class="feature-tag">Wireless</span>
                        </div>
                        <div class="estimate-price">
                            Est. Price: <span class="price">৳85,000</span>
                        </div>
                        <button class="btn secondary-btn notify-btn">
                            <i class="fas fa-bell"></i>
                            Notify Me
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="coming-soon-slide">
                <div class="coming-soon-card">
                    <div class="coming-soon-badge countdown">
                        <i class="fas fa-clock"></i>
                        <span>14 Days Left</span>
                    </div>
                    <div class="coming-soon-image">
                        <img src="<?php echo BASE_URL; ?>assets/images/drone.png" alt="Sky Explorer Drone">
                        <div class="coming-soon-glow"></div>
                    </div>
                    <div class="coming-soon-info">
                        <div class="product-category">Drones</div>
                        <h3>Sky Explorer Drone</h3>
                        <p>Professional-grade drone with 8K camera, intelligent flight modes, and 40-minute flight time for creators and professionals.</p>
                        <div class="coming-features">
                            <span class="feature-tag">8K Camera</span>
                            <span class="feature-tag">40min Flight</span>
                            <span class="feature-tag">Obstacle Avoid</span>
                        </div>
                        <div class="estimate-price">
                            Est. Price: <span class="price">৳120,000</span>
                        </div>
                        <button class="btn secondary-btn notify-btn">
                            <i class="fas fa-bell"></i>
                            Notify Me
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="coming-soon-slide">
                <div class="coming-soon-card">
                    <div class="coming-soon-badge countdown">
                        <i class="fas fa-clock"></i>
                        <span>21 Days Left</span>
                    </div>
                    <div class="coming-soon-image">
                        <img src="<?php echo BASE_URL; ?>assets/images/shh.png" alt="Smart Home Hub">
                        <div class="coming-soon-glow"></div>
                    </div>
                    <div class="coming-soon-info">
                        <div class="product-category">Smart Home</div>
                        <h3>Smart Home Hub</h3>
                        <p>Central command for your smart home with AI voice assistant, touchscreen display, and seamless device integration.</p>
                        <div class="coming-features">
                            <span class="feature-tag">AI Assistant</span>
                            <span class="feature-tag">Touch Display</span>
                            <span class="feature-tag">Multi-room</span>
                        </div>
                        <div class="estimate-price">
                            Est. Price: <span class="price">৳35,000</span>
                        </div>
                        <button class="btn secondary-btn notify-btn">
                            <i class="fas fa-bell"></i>
                            Notify Me
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="slider-controls">
            <button class="slider-btn prev-btn" id="prevBtn">
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="slider-dots">
                <span class="dot active" data-slide="0"></span>
                <span class="dot" data-slide="1"></span>
                <span class="dot" data-slide="2"></span>
            </div>
            <button class="slider-btn next-btn" id="nextBtn">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    </div>
</section>

<section class="newsletter-section-modern">
    <div class="newsletter-container-modern">
        <div class="newsletter-icon-modern">
            <i class="fas fa-paper-plane"></i>
        </div>
        <h2>Never Miss a New Arrival</h2>
        <p>Be the first to know about our latest products, exclusive deals, and tech innovations. Join over 50,000+ tech enthusiasts!</p>
        
        <div class="newsletter-form-area">
            <form class="newsletter-form-modern" action="<?php echo BASE_URL; ?>process_newsletter.php" method="POST">
                <input type="email" name="email" placeholder="Enter your email address" required>
                <button type="submit" class="btn primary-btn">
                    <i class="fas fa-bell"></i>
                    <span>Subscribe</span>
                </button>
            </form>
            <div class="newsletter-benefits-modern">
                <div class="benefit"><i class="fas fa-bolt"></i> Early access to sales</div>
                <div class="benefit"><i class="fas fa-tags"></i> Exclusive member discounts</div>
                <div class="benefit"><i class="fas fa-newspaper"></i> Tech news & updates</div>
            </div>
        </div>

        <div class="privacy-note-modern">
            <i class="fas fa-lock"></i> We respect your privacy. Unsubscribe anytime.
        </div>
    </div>
</section>

<script>
    
    window.baseUrl = '<?php echo BASE_URL; ?>';
</script>

<?php
include 'includes/footer.php';
?>