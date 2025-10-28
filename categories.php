<?php
$active_page = 'categories';
$title = "TechNest - Shop By Categories";
require_once 'includes/config.php';
require_once 'includes/functions.php';
include 'includes/header.php';
?>

<section class="hero">
    <div class="hero-container">
        <div class="hero-content">
            <div class="tech-badge">EXPLORE CATEGORIES</div>
            <h1>Shop By Categories</h1>
            <h2 class="gradient-text">Find. Explore. Discover.</h2>
            <p class="hero-description">Discover the perfect tech products organized by categories. From smartphones to smart homes, find exactly what you're looking for.</p>
            
            <div class="feature-cards">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-th-large"></i>
                    </div>
                    <div class="feature-info">
                        <h3>8 Categories</h3>
                        <p>Organized for easy Browse</p>
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="feature-info">
                        <h3>Premium Brands</h3>
                        <p>Top quality products only</p>
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-shipping-fast"></i>
                    </div>
                    <div class="feature-info">
                        <h3>Fast Delivery</h3>
                        <p>Quick shipping nationwide</p>
                    </div>
                </div>
            </div>
            
            <div class="hero-buttons">
                <a href="#categories" class="btn primary-btn">Explore Categories <i class="fas fa-arrow-right"></i></a>
                <a href="<?php echo BASE_URL; ?>products.php" class="btn secondary-btn">View All Products</a>
            </div>
            
            <div class="tech-specs">
                <div class="spec-item">
                    <div class="spec-value">200+</div>
                    <div class="spec-label">Products</div>
                </div>
                <div class="spec-item">
                    <div class="spec-value">50+</div>
                    <div class="spec-label">Brands</div>
                </div>
                <div class="spec-item">
                    <div class="spec-value">8</div>
                    <div class="spec-label">Categories</div>
                </div>
                <div class="spec-item">
                    <div class="spec-value">24/7</div>
                    <div class="spec-label">Support</div>
                </div>
            </div>
        </div>
        <div class="hero-product">
            <div class="category-showcase">
                <div class="showcase-item showcase-item-1">
                    <img src="<?php echo BASE_URL; ?>assets/images/iphone.png" alt="Smartphones">
                </div>
                <div class="showcase-item showcase-item-2">
                    <img src="<?php echo BASE_URL; ?>assets/images/macbookW.png" alt="Laptops">
                </div>
                <div class="showcase-item showcase-item-3">
                    <img src="<?php echo BASE_URL; ?>assets/images/appwatch.png" alt="Smartwatches">
                </div>
            </div>
        </div>
    </div>
    <div class="hero-backdrop"></div>
</section>

<section class="features">
    <div class="features-container">
        <div class="feature-item">
            <div class="feature-icon">
                <i class="fas fa-truck"></i>
            </div>
            <div class="feature-content">
                <h3>Free Shipping</h3>
                <p>On all orders above ৳5,000</p>
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

<section class="categories" id="categories">
    <div class="section-header">
        <h2>Shop By Category</h2>
        <p>Browse our comprehensive tech collections</p>
    </div>
    <div class="category-grid">
        <?php
        // SQL query to get each unique category and the count of products in it
        $category_sql = "SELECT category, COUNT(*) as product_count FROM products GROUP BY category ORDER BY product_count DESC";
        $category_result = mysqli_query($conn, $category_sql);

        if (mysqli_num_rows($category_result) > 0) {
            while ($category_row = mysqli_fetch_assoc($category_result)) {
                $category_name = $category_row['category'];
                if (empty($category_name)) continue; // Skip items with no category

                $product_count = $category_row['product_count'];
                
                // Set default icon and image based on category name
                $icon_class = 'fa-laptop'; // default icon
                $image_file = 'Laptops.png'; // default image

                // This mapping helps display a specific icon/image for each category
                $category_map = [
                    'phones' => ['icon' => 'fa-mobile-alt', 'image' => 'iphone.png'],
                    'headphones' => ['icon' => 'fa-headphones', 'image' => 'headphones.png'],
                    'earbuds' => ['icon' => 'fa-dot-circle', 'image' => 'airpodsM.png'],
                    'laptops' => ['icon' => 'fa-laptop', 'image' => 'Laptops.png'],
                    'tablets' => ['icon' => 'fa-tablet-alt', 'image' => 'ipads.png'],
                    'smartwatches' => ['icon' => 'fa-stopwatch', 'image' => 'apple-watch.png'],
                    'gaming' => ['icon' => 'fa-gamepad', 'image' => 'ps5.png'],
                    'accessories' => ['icon' => 'fa-plug', 'image' => 'accessories.png'],
                    'cameras' => ['icon' => 'fa-camera-retro', 'image' => 'CanonB.png']
                ];

                if (array_key_exists($category_name, $category_map)) {
                    $icon_class = $category_map[$category_name]['icon'];
                    $image_file = $category_map[$category_name]['image'];
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
        } else {
            echo "<p>No product categories found.</p>";
        }
        ?>
    </div>
</section>


<section class="brands-section">
    <div class="section-header">
        <h2>Featured Brands</h2>
        <p>Shop from the world's most trusted technology brands</p>
    </div>
    
    <div class="brands-grid">
        <?php
        // [NEW] This whole block is now dynamic

        // SQL query to get each unique brand and the count of products for it
        $brands_sql = "SELECT brand, COUNT(*) as product_count FROM products WHERE brand IS NOT NULL AND brand != '' GROUP BY brand ORDER BY product_count DESC LIMIT 5";
        $brands_result = mysqli_query($conn, $brands_sql);

        if ($brands_result && mysqli_num_rows($brands_result) > 0) {
            while ($brand_row = mysqli_fetch_assoc($brands_result)) {
                $brand_name = $brand_row['brand'];
                // Create a clean filename for the brand logo, e.g., 'brand-apple.png'
                $brand_logo_file = 'brand-' . strtolower($brand_name) . '.png';
        ?>
                <div class="brand-box">
                    <div class="brand-logo">
                        <img src="<?php echo BASE_URL . 'assets/images/' . $brand_logo_file; ?>" alt="<?php echo htmlspecialchars(ucfirst($brand_name)); ?>">
                    </div>
                    <div class="brand-info">
                        <h3><?php echo htmlspecialchars(ucfirst($brand_name)); ?></h3>
                        <p><?php echo $brand_row['product_count']; ?> Products</p>
                        <a href="<?php echo BASE_URL; ?>products.php?brand=<?php echo urlencode($brand_name); ?>" class="brand-link">View Collection <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
        <?php
            }
        } else {
            echo "<p>No brands found.</p>";
        }
        ?>
    </div>
</section>

<section class="newsletter">
    <div class="newsletter-content">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Get the latest updates on new products and exclusive offers</p>
        <form class="newsletter-form">
            <input type="email" placeholder="Your Email Address" required>
            <button type="submit" class="btn primary-btn">Subscribe <i class="fas fa-paper-plane"></i></button>
        </form>
    </div>
</section>

<?php
include 'includes/footer.php';
?>