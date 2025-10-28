<?php
$active_page = 'products';
$page_js = 'products.js';
require_once 'includes/config.php';
require_once 'includes/functions.php';

$page_title = 'All Products';
$sql_conditions = []; // Use an array to hold multiple WHERE conditions

// Check for a category filter in the URL
if (isset($_GET['category']) && !empty($_GET['category'])) {
    $selected_category = sanitize($_GET['category']);
    $page_title = ucfirst($selected_category);
    $sql_conditions[] = "category = '$selected_category'";
}

// Check for a search query in the URL
if (isset($_GET['search']) && !empty($_GET['search'])) {
    $search_query = sanitize($_GET['search']);
    $page_title = 'Results for "' . htmlspecialchars($search_query) . '"';
    // Search in name, brand, and category
    $sql_conditions[] = "(name LIKE '%$search_query%' OR brand LIKE '%$search_query%' OR category LIKE '%$search_query%')";
}

// Check for a brand filter in the URL
if (isset($_GET['brand']) && !empty($_GET['brand'])) {
    $selected_brand = sanitize($_GET['brand']);
    $page_title = 'Products by ' . ucfirst($selected_brand);
    $sql_conditions[] = "brand = '$selected_brand'";
}

// Build the final SQL query string
$sql = "SELECT * FROM products";
if (!empty($sql_conditions)) {
    $sql .= " WHERE " . implode(' AND ', $sql_conditions);
}

$result = mysqli_query($conn, $sql);
$product_count = $result ? mysqli_num_rows($result) : 0;
$title = "$page_title - TechNest";

include 'includes/header.php';
?>

<section class="products-hero">
    <div class="products-hero-container">
        <div class="products-hero-content">
            <div class="tech-badge">PREMIUM COLLECTION</div>
            <h1><?php echo htmlspecialchars($page_title); ?></h1>
            <h2 class="gradient-text">Innovation Meets Excellence</h2>
            <p class="hero-description">Explore our curated collection of cutting-edge technology. From smartphones to smart homes, find the perfect tech companion for your digital lifestyle.</p>
            
            <div class="hero-stats">
                <div class="stat-item">
                    <div class="stat-number">25+</div>
                    <div class="stat-label">Products</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">10+</div>
                    <div class="stat-label">Brands</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">24/7</div>
                    <div class="stat-label">Support</div>
                </div>
            </div>
        </div>
        <div class="products-hero-visual">
            <div class="floating-products">
                <div class="floating-product floating-product-1">
                    <img src="<?php echo BASE_URL; ?>assets/images/iphone16W.png" alt="iPhone">
                </div>
                <div class="floating-product floating-product-2">
                    <img src="<?php echo BASE_URL; ?>assets/images/macbookW.png" alt="MacBook">
                </div>
                <div class="floating-product floating-product-3">
                    <img src="<?php echo BASE_URL; ?>assets/images/appwatch.png" alt="Apple Watch">
                </div>
            </div>
        </div>
    </div>
    <div class="hero-backdrop"></div>
</section>

<section class="filters-section">
    <div class="container">
        <div class="filters-header">
            <h3><i class="fas fa-filter"></i> Filter & Sort</h3>
            <div class="results-count">
                <span id="results-count">
                <?php 
                echo $product_count . " Product" . ($product_count != 1 ? 's' : '') . " Found"; 
                ?>
                </span>
            </div>
        </div>
        
        <div class="enhanced-filters">
            <div class="filter-group">
                <label for="sort-by"><i class="fas fa-sort"></i> Sort By</label>
                <select id="sort-by" class="filter-select">
                    <option value="popularity">Most Popular</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Top Rated</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label for="category-filter"><i class="fas fa-th-large"></i> Category</label>
                <select id="category-filter" class="filter-select">
                    <option value="all">All Categories</option>
                    <option value="phones">Smartphones</option>
                    <option value="laptops">Laptops</option>
                    <option value="tablets">Tablets</option>
                    <option value="headphones">Headphones</option>
                    <option value="earbuds">Earbuds</option>
                    <option value="smartwatches">Smartwatches</option>
                    <option value="cameras">Cameras</option>
                    <option value="gaming">Gaming</option>
                    <option value="accessories">Accessories</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label for="price-range"><i class="fas fa-tag"></i> Price Range</label>
                <select id="price-range" class="filter-select">
                    <option value="all">All Prices</option>
                    <option value="0-10000">Under ৳10,000</option>
                    <option value="10000-25000">৳10,000 - ৳25,000</option>
                    <option value="25000-50000">৳25,000 - ৳50,000</option>
                    <option value="50000-100000">৳50,000 - ৳100,000</option>
                    <option value="100000+">Over ৳100,000</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label for="brand-filter"><i class="fas fa-star"></i> Brand</label>
                <select id="brand-filter" class="filter-select">
                    <option value="all">All Brands</option>
                    <option value="apple">Apple</option>
                    <option value="samsung">Samsung</option>
                    <option value="sony">Sony</option>
                    <option value="canon">Canon</option>
                    <option value="dell">Dell</option>
                    <option value="anker">Anker</option>
                    <option value="lg">LG</option>
                    <option value="logitech">Logitech</option>
                    <option value="nintendo">Nintendo</option>
                    <option value="google">Google</option>
                </select>
            </div>
            
            <button id="reset-filters" class="btn secondary-btn">
                <i class="fas fa-undo"></i> Reset All
            </button>
        </div>
    </div>
</section>

<section class="products-showcase">
    <div class="container">
        <div class="enhanced-product-grid" id="product-grid">
            <?php
            // [FIX] This PHP block has been corrected.
            // It creates the JS array AND displays the initial product cards.
            $products_for_js = [];
            if ($result && mysqli_num_rows($result) > 0) {
                while ($product = mysqli_fetch_assoc($result)) {
                    $products_for_js[] = $product; // Add product to the JS array
            ?>
                    <div class="product-card" 
                         data-id="<?php echo $product['id']; ?>" 
                         data-name="<?php echo htmlspecialchars($product['name']); ?>" 
                         data-price="<?php echo $product['price']; ?>" 
                         data-image="assets/images/<?php echo htmlspecialchars($product['image_url']); ?>"
                         data-category="<?php echo htmlspecialchars($product['category']); ?>"
                         data-brand="<?php echo htmlspecialchars($product['brand']); ?>"
                         data-rating="<?php echo $product['rating']; ?>"
                         data-colors="<?php echo htmlspecialchars($product['available_colors']); ?>"
                         data-features="<?php echo htmlspecialchars($product['features']); ?>">
                         

                        <div class="product-image">
                            <img src="assets/images/<?php echo htmlspecialchars($product['image_url']); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>">
                            <div class="product-actions">
                                <a href="#" class="quick-view tooltip-container"><i class="fas fa-eye"></i><span class="tooltip">Quick View</span></a>
                                <a href="#" class="add-to-wishlist tooltip-container"><i class="far fa-heart"></i><span class="tooltip">Add to Wishlist</span></a>
                                <a href="#" class="add-to-cart tooltip-container"><i class="fas fa-shopping-cart"></i><span class="tooltip">Add to Cart</span></a>
                            </div>
                        </div>
                        <div class="product-info">
                            <div class="product-category"><?php echo htmlspecialchars(ucfirst($product['category'])); ?></div>
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
                } // End of while loop
            } else {
                echo '<p style="text-align: center; grid-column: 1 / -1;">No products found matching your criteria.</p>';
            }
            ?>
        </div>
        
        <div class="enhanced-pagination" id="pagination-container"></div>
    </div>
</section>
<script>
    const allProducts = <?php echo json_encode($products_for_js); ?>;
</script>

<?php
include 'includes/footer.php';
?>