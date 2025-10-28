<?php 
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/functions.php';
require_once __DIR__ . '/auth.php';

// UPDATED: This function now gets the real username
if (!function_exists('getUserName')) {
    function getUserName() {
        // Use the getCurrentUser() function from functions.php to get user data
        $user = getCurrentUser();
        // Check if user data was found and return the name
        if ($user && isset($user['name'])) {
            return $user['name'];
        }
        // Fallback if no user is found
        return "User"; 
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechNest - Premium Tech Gadgets</title>
    <link rel="icon" href="<?php echo BASE_URL; ?>assets/images/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="<?php echo BASE_URL; ?>assets/images/favicon.png" type="image/png">
    <link rel="apple-touch-icon" href="<?php echo BASE_URL; ?>assets/images/apple-touch-icon.png">
    <meta name="theme-color" content="#0052cc">
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/styles.css">
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/products.css">
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/categories.css">
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/new-arrivals.css">
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/deals.css">
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/contact.css">
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/checkout.css">
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/payment-modals.css">
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/responsive.css">
    <?php if (isset($page_css)): ?>
    <link rel="stylesheet" href="<?php echo BASE_URL . 'assets/css/' . $page_css; ?>">
    <?php endif; ?>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Roboto+Mono:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body class="tech-theme">
    <script>
        const currentUserId = <?php echo json_encode($_SESSION['user_id'] ?? null); ?>;
    </script>
    <div id="notificationContainer" class="notification-container"></div>
    <div id="overlay" class="overlay"></div>

    <header>
        <nav class="navbar">
            <div class="logo">
                <a href="<?php echo BASE_URL; ?>">
                    <div class="logo-text">
                        <div class="bolt-icon"><i class="fas fa-bolt"></i></div>
                        <span class="tech">Tech</span><span class="nest">Nest</span>
                    </div>
                </a>
            </div>
            <div class="nav-links" id="navLinks">
                <i class="fas fa-times" id="closeMenu"></i>
                <ul>
                    <li><a href="<?php echo BASE_URL; ?>" class="<?php echo ($active_page == 'home') ? 'active' : ''; ?>"><i class="fas fa-home"></i> Home</a></li>
                    <li><a href="<?php echo BASE_URL; ?>products.php" class="<?php echo ($active_page == 'products') ? 'active' : ''; ?>"><i class="fas fa-shopping-bag"></i> Products</a></li>
                    <li><a href="<?php echo BASE_URL; ?>categories.php" class="<?php echo ($active_page == 'categories') ? 'active' : ''; ?>"><i class="fas fa-th-large"></i> Categories</a></li>
                    <li><a href="<?php echo BASE_URL; ?>new-arrivals.php" class="<?php echo ($active_page == 'new-arrivals') ? 'active' : ''; ?>"><i class="fas fa-star"></i> New Arrivals</a></li>
                    <li><a href="<?php echo BASE_URL; ?>deals.php" class="<?php echo ($active_page == 'deals') ? 'active' : ''; ?>"><i class="fas fa-tag"></i> Deals</a></li>
                    <li><a href="<?php echo BASE_URL; ?>contact.php" class="<?php echo ($active_page == 'contact') ? 'active' : ''; ?>"><i class="fas fa-envelope"></i> Contact</a></li>
                </ul>
            </div>
            <div class="nav-actions">
                <form class="search-container" id="searchForm" action="<?php echo BASE_URL; ?>products.php" method="GET">
                    <input type="text" name="search" placeholder="Search products..." class="search-input">
                    <button type="submit" class="search-btn"><i class="fas fa-search"></i></button>
                </form>
               
                <?php if (isLoggedIn()): ?>
                <div class="nav-dropdown" id="accountDropdown">
                    <button class="account-dropdown-toggle">
                        <i class="fas fa-user"></i>
                        <span>Hello, <?php echo htmlspecialchars(getUserName()); ?></span>
                        <i class="fas fa-chevron-down dropdown-icon"></i>
                    </button>
                    <div class="nav-dropdown-content">
                        <a href="<?php echo BASE_URL; ?>auth/profile.php">
                            <i class="fas fa-user-circle"></i> My Account
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="<?php echo BASE_URL; ?>auth/logout.php" class="logout-link">
                            <i class="fas fa-sign-out-alt"></i> Sign Out
                        </a>
                    </div>
                </div>
                <?php else: ?>
                <a href="<?php echo BASE_URL; ?>auth/login.php" class="account tooltip-container <?php echo ($active_page == 'account') ? 'active' : ''; ?>">
                    <i class="fas fa-user"></i>
                    <span class="tooltip">Sign In or Sign Up</span>
                </a>
                <?php endif; ?>
                
                <a href="<?php echo BASE_URL; ?>wishlist.php" class="wishlist tooltip-container" id="wishlistBtn">
                    <i class="fas fa-heart"></i>
                    <span class="wishlist-count">0</span>
                    <span class="tooltip">Wishlist</span>
                </a>
                <a href="<?php echo BASE_URL; ?>cart.php" class="cart tooltip-container" id="cartBtn">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="cart-count">0</span>
                    <span class="tooltip">Cart</span>
                </a>
            </div>
            <i class="fas fa-bars" id="menuIcon"></i>
        </nav>
    </header>

    <?php displayFlashMessages(); ?>