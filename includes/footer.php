    <!-- Footer -->
    <footer>
        <div class="footer-content">
            <div class="footer-column">
                <div class="footer-logo">
                    <a href="<?php echo BASE_URL; ?>">
                        <div class="logo-text footer-logo-text">
                            <div class="bolt-icon"><i class="fas fa-bolt"></i></div>
                            <span class="tech">Tech</span><span class="nest">Nest</span>
                        </div>
                    </a>
                </div>
                <p>Premium tech gadgets at affordable prices. Experience innovation without breaking the bank.</p>
                <div class="social-icons">
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
            <div class="footer-column">
                <h3>Shop</h3>
                <ul>
                    <li><a href="<?php echo BASE_URL; ?>products.php?category=phones">Mobile Phones</a></li>
                    <li><a href="<?php echo BASE_URL; ?>products.php?category=headphones">Headphones</a></li>
                    <li><a href="<?php echo BASE_URL; ?>products.php?category=earbuds">Earbuds</a></li>
                    <li><a href="<?php echo BASE_URL; ?>products.php?category=laptops">Laptops</a></li>
                    <li><a href="<?php echo BASE_URL; ?>products.php?category=smartwatches">Smartwatches</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Support</h3>
                <ul>
                    <li><a href="<?php echo BASE_URL; ?>contact.php">Contact Us</a></li>
                    <li><a href="<?php echo BASE_URL; ?>faq.php">FAQs</a></li>
                    <li><a href="<?php echo BASE_URL; ?>shipping.php">Shipping & Returns</a></li>
                    <!-- <li><a href="<?php echo BASE_URL; ?>warranty.php">Warranty</a></li>
                    <li><a href="<?php echo BASE_URL; ?>repair.php">Repair Service</a></li> -->
                </ul>
            </div>
            <div class="footer-column">
                <h3>Company</h3>
                <ul>
                    <li><a href="<?php echo BASE_URL; ?>about.php">About Us</a></li>
                    <!-- <li><a href="<?php echo BASE_URL; ?>blog.php">Blog</a></li>
                    <li><a href="<?php echo BASE_URL; ?>careers.php">Careers</a></li>
                    <li><a href="<?php echo BASE_URL; ?>press.php">Press</a></li> -->
                    <li><a href="<?php echo BASE_URL; ?>privacy.php">Privacy Policy</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Contact</h3>
                <ul class="contact-info">
                    <li><i class="fas fa-map-marker-alt"></i> SASH, CUET, Raozan-4349, Chattogram</li>
                    <li><i class="fas fa-phone"></i> +8801581448561</li>
                    <li><i class="fas fa-envelope"></i> support@technest.com</li>
                </ul>
                <div class="payment-methods">
                    <img src="<?php echo BASE_URL; ?>assets/images/bkash.svg" alt="bKash" class="payment-logo">
                    <img src="<?php echo BASE_URL; ?>assets/images/rocket.svg" alt="Rocket" class="payment-logo">
                    <i class="fab fa-cc-visa"></i>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
                <p>&copy; <?php echo date('Y'); ?> TechNest. All Rights Reserved.</p>

        </div>
    </footer>

    <!-- Cart Sidebar -->
    <div class="cart-sidebar" id="cartSidebar">
        <div class="cart-header">
            <h3><i class="fas fa-shopping-cart"></i> Your Cart</h3>
            <span class="close-cart">&times;</span>
        </div>
        <div class="cart-items">
            <!-- Cart items will be added dynamically -->
            <!-- Empty cart message -->
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <p>Your cart is empty</p>
                <a href="<?php echo BASE_URL; ?>products.php" class="btn secondary-btn">Start Shopping</a>
            </div>
        </div>
        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span class="cart-subtotal">৳0.00</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span class="cart-shipping">৳0.00</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span class="cart-total">৳0.00</span>
            </div>
            <a href="<?php echo BASE_URL; ?>checkout.php" class="btn primary-btn checkout-btn">Proceed to Checkout</a>
            <button class="btn secondary-btn continue-shopping">Continue Shopping</button>
        </div>
    </div>
    
    <!-- Wishlist Sidebar -->
    <div class="wishlist-sidebar" id="wishlistSidebar">
        <div class="wishlist-header">
            <h3><i class="fas fa-heart"></i> Your Wishlist</h3>
            <span class="close-wishlist">&times;</span>
        </div>
        <div class="wishlist-items">
            <!-- Wishlist items will be added dynamically -->
            <!-- Empty wishlist message -->
            <div class="empty-wishlist">
                <div class="empty-wishlist-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <p>Your wishlist is empty</p>
                <a href="products.html" class="btn secondary-btn">Discover Products</a>
            </div>
        </div>
        <div class="wishlist-actions">
            <button class="btn primary-btn clear-wishlist-btn">Clear Wishlist</button>
        </div>
    </div>
    
    <!-- Buy Now Modal -->
    <div class="modal" id="buyNowModal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="buy-now-wrapper">
                <h2>Quick Checkout</h2>
                <div class="buy-now-product">
                    <div class="buy-now-product-image">
                        <img src="" alt="Product">
                    </div>
                    <div class="buy-now-product-info">
                        <h3></h3>
                        <div class="price-quantity">
                            <div class="price"></div>
                            <div class="quantity-selector">
                                <button class="quantity-btn minus">-</button>
                                <input type="number" value="1" min="1" max="10">
                                <button class="quantity-btn plus">+</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="buy-now-summary">
                    <div class="summary-row">
                        <span>Product:</span>
                        <span class="product-name"></span>
                    </div>
                    <div class="summary-row">
                        <span>Quantity:</span>
                        <span class="product-quantity">1</span>
                    </div>
                    <div class="summary-row">
                        <span>Price:</span>
                        <span class="product-price"></span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span class="product-total"></span>
                    </div>
                </div>
                <div class="buy-now-actions">
                    <a href="<?php echo BASE_URL; ?>checkout.php" class="btn primary-btn checkout-btn">Proceed to Checkout</a>
                    <button class="btn secondary-btn add-to-cart-from-buynow">Add to Cart</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Notification Toast -->
    <div class="notification-container" id="notificationContainer"></div>
    
    <!-- Overlay -->
    <div class="overlay" id="overlay"></div>

    <!-- Scripts -->
    <script src="<?php echo BASE_URL; ?>assets/js/script.js"></script>
    <script src="<?php echo BASE_URL; ?>assets/js/contact.js"></script>
    <script src="<?php echo BASE_URL; ?>assets/js/checkout.js"></script>
    <script src="<?php echo BASE_URL; ?>assets/js/complete-quickview-replacement.js"></script>
    <script src="<?php echo BASE_URL; ?>assets/js/responsive.js"></script>
    <?php 
    // Conditionally load page-specific JavaScript files
    // This prevents conflicts and improves performance.
    if ($active_page == 'home' || $active_page == 'products') { 
        echo '<script src="' . BASE_URL . 'assets/js/products.js"></script>';
    }
    /*if ($active_page == 'categories') {
        echo '<script src="' . BASE_URL . 'assets/js/categories.js"></script>';
    }
    if ($active_page == 'checkout') {
        echo '<script src="' . BASE_URL . 'assets/js/checkout.js"></script>';
    }
    if ($active_page == 'contact') {
        echo '<script src="' . BASE_URL . 'assets/js/contact.js"></script>';
    }*/

    if ($active_page == 'new-arrivals') {
        echo '<script src="' . BASE_URL . 'assets/js/new-arrivals.js"></script>';
    }

    if ($active_page == 'deals') {
        echo '<script src="' . BASE_URL . 'assets/js/deals.js"></script>';
    }

    ?>

    <!-- <script src="<?php echo BASE_URL; ?>assets/js/instant-sidebar-fix.js"></script> -->
</body>
</html>