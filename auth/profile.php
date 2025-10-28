<?php
$active_page = 'account';
$page_css = 'auth.css';
$page_js = 'auth.js';

// Include header from parent directory
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/auth.php';

// CORRECTED: Redirect to login.php if the user is not logged in.
if (!isLoggedIn()) {
    $_SESSION['error'] = "Please login to view your profile.";
    redirect('login.php');
    exit();
}

// Get the current user's data
$user = getCurrentUser();

// --- Handle Profile Update POST Request ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_profile'])) {
    $name = sanitize($_POST['name']);
    $current_password = $_POST['current_password'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Validate name
    if (empty($name)) {
        $_SESSION['error'] = "Name cannot be empty.";
    } else {
        $userId = $_SESSION['user_id'];
        $update_query_parts = [];
        $update_params = [];
        $update_types = '';
        
        // Check if name needs updating
        if ($name !== $user['name']) {
            $update_query_parts[] = "name = ?";
            $update_params[] = $name;
            $update_types .= 's';
        }
        
        // Check if password needs updating
        if (!empty($new_password)) {
            if (strlen($new_password) < 8) {
                $_SESSION['error'] = "New password must be at least 8 characters.";
            } elseif ($new_password !== $confirm_password) {
                $_SESSION['error'] = "New passwords do not match.";
            } elseif (empty($current_password)) {
                $_SESSION['error'] = "You must enter your current password to set a new one.";
            } else {
                // Verify current password before changing
                $query = "SELECT password FROM users WHERE id = ?";
                $stmt = mysqli_prepare($conn, $query);
                mysqli_stmt_bind_param($stmt, "i", $userId);
                mysqli_stmt_execute($stmt);
                $result = mysqli_stmt_get_result($stmt);

                if ($result && mysqli_num_rows($result) > 0) {
                    $userData = mysqli_fetch_assoc($result);
                    if (password_verify($current_password, $userData['password'])) {
                        $update_query_parts[] = "password = ?";
                        $update_params[] = password_hash($new_password, PASSWORD_DEFAULT);
                        $update_types .= 's';
                    } else {
                        $_SESSION['error'] = "Your current password is incorrect.";
                    }
                } else {
                    $_SESSION['error'] = "Could not verify your identity. Please log out and log in again.";
                }
            }
        }
        
        // If there are fields to update and no errors, run the secure query
        if (!empty($update_query_parts) && !isset($_SESSION['error'])) {
            $update_params[] = $userId;
            $update_types .= 'i';
            
            $update_sql = "UPDATE users SET " . implode(", ", $update_query_parts) . " WHERE id = ?";
            
            $update_stmt = mysqli_prepare($conn, $update_sql);
            mysqli_stmt_bind_param($update_stmt, $update_types, ...$update_params);

            if (mysqli_stmt_execute($update_stmt)) {
                $_SESSION['success'] = "Profile updated successfully!";
            } else {
                $_SESSION['error'] = "Failed to update profile due to a database error.";
            }
        } elseif (empty($update_query_parts) && !isset($_SESSION['error'])) {
             $_SESSION['info'] = "No changes were made to your profile.";
        }
    }
    // Redirect to show session messages
    redirect('auth/profile.php');
    exit();
}

// --- FETCH USER'S ORDER HISTORY WITH DETAILED INFORMATION ---
$orders_sql = "SELECT id, name, email, phone, address, city, state, zipcode, 
               total_amount, payment_method, status, order_notes, created_at 
               FROM orders 
               WHERE user_id = ? 
               ORDER BY created_at DESC";

$stmt = mysqli_prepare($conn, $orders_sql);
mysqli_stmt_bind_param($stmt, "i", $_SESSION['user_id']);
mysqli_stmt_execute($stmt);
$orders_result = mysqli_stmt_get_result($stmt);

$orders = [];
while ($order = mysqli_fetch_assoc($orders_result)) {
    $order_id = $order['id'];
    
    $items_sql = "SELECT oi.product_id, oi.product_name, oi.quantity, oi.price 
                  FROM order_items oi
                  WHERE oi.order_id = ?";
    
    $items_stmt = mysqli_prepare($conn, $items_sql);
    mysqli_stmt_bind_param($items_stmt, "i", $order_id);
    mysqli_stmt_execute($items_stmt);
    $items_result = mysqli_stmt_get_result($items_stmt);
    
    $order_items = [];
    while ($item = mysqli_fetch_assoc($items_result)) {
        $item['image_url'] = 'placeholder.jpg'; // Default image
        
        $product_query = "SELECT image_url FROM products WHERE id = ? LIMIT 1";
        $product_stmt = mysqli_prepare($conn, $product_query);
        
        if ($product_stmt) {
            mysqli_stmt_bind_param($product_stmt, "i", $item['product_id']);
            mysqli_stmt_execute($product_stmt);
            $product_result = mysqli_stmt_get_result($product_stmt);
            
            if ($product_data = mysqli_fetch_assoc($product_result)) {
                if (!empty($product_data['image_url'])) {
                    $item['image_url'] = $product_data['image_url'];
                }
            }
            mysqli_stmt_close($product_stmt);
        }
        $order_items[] = $item;
    }
    
    $order['items'] = $order_items;
    $orders[] = $order;
}

// Set the title
$title = "My Profile - TechNest";

// Include the header
include '../includes/header.php';
?>

<section class="auth-hero profile-hero">
    <div class="auth-hero-backdrop"></div>
    <div class="auth-container">
        <div class="profile-grid">
            <div class="profile-form-container">
                <h2><i class="fas fa-user"></i> Profile Information</h2>
                <p class="auth-subtitle">Update your account details below.</p>
                <form id="profile-form" method="post" action="profile.php" class="auth-form active">
                    <div class="form-group">
                        <label for="profile-name">Full Name</label>
                        <div class="input-group">
                            <i class="fas fa-user"></i>
                            <input type="text" id="profile-name" name="name" value="<?php echo htmlspecialchars($user['name']); ?>" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="profile-email">Email Address</label>
                        <div class="input-group">
                            <i class="fas fa-envelope"></i>
                            <input type="email" id="profile-email" value="<?php echo htmlspecialchars($user['email']); ?>" disabled>
                            <small class="form-help">Email address cannot be changed.</small>
                        </div>
                    </div>
                    <hr class="form-divider">
                    <p class="auth-subtitle">Leave password fields blank to keep your current password.</p>
                     <div class="form-group">
                        <label for="current-password">Current Password</label>
                        <div class="input-group">
                            <i class="fas fa-lock"></i>
                            <input type="password" id="current-password" name="current_password" placeholder="Required to set a new password">
                            <i class="fas fa-eye toggle-password"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="new-password">New Password</label>
                        <div class="input-group">
                            <i class="fas fa-key"></i>
                            <input type="password" id="new-password" name="new_password" placeholder="Enter new password (min. 8 characters)">
                            <i class="fas fa-eye toggle-password"></i>
                        </div>
                    </div>
                     <div class="form-group">
                        <label for="confirm-password">Confirm New Password</label>
                        <div class="input-group">
                            <i class="fas fa-key"></i>
                            <input type="password" id="confirm-password" name="confirm_password" placeholder="Confirm new password">
                        </div>
                    </div>
                    <button type="submit" name="update_profile" class="btn primary-btn auth-btn">
                        <span>Update Profile</span> <i class="fas fa-save"></i>
                    </button>
                </form>
            </div>
            
            <div class="order-history-container">
                <h2><i class="fas fa-box-open"></i> Order History</h2>
                <div class="order-history-list">
                    <?php if (count($orders) > 0): ?>
                        <div class="orders-list">
                            <?php foreach ($orders as $order): ?>
                                <div class="order-card">
                                    <div class="order-header" data-order-id="<?php echo $order['id']; ?>">
                                        <div class="order-header-details">
                                            <div class="order-id">#TN<?php echo $order['id']; ?></div>
                                            <div class="order-date"><?php echo date("d M, Y", strtotime($order['created_at'])); ?></div>
                                            <div class="order-status-badge">
                                                <span class="status <?php echo strtolower($order['status']); ?>"><?php echo htmlspecialchars($order['status']); ?></span>
                                            </div>
                                            <div class="order-amount">৳<?php echo number_format($order['total_amount']); ?></div>
                                        </div>
                                        <button class="order-expand-btn">
                                            <i class="fas fa-chevron-down"></i>
                                        </button>
                                    </div>
                                    <div class="order-details">
                                        <div class="order-details-grid">
                                            <div class="order-items-list">
                                                <h3>Items Ordered</h3>
                                                <div class="order-items-table">
                                                    <?php if (count($order['items']) > 0): ?>
                                                        <?php foreach($order['items'] as $item): ?>
                                                            <div class="order-item">
                                                                <div class="order-item-image">
                                                                    <?php 
                                                                        $image_path = __DIR__ . "/../assets/images/" . htmlspecialchars($item['image_url'] ?? 'placeholder.jpg');
                                                                        if (!file_exists($image_path) || empty($item['image_url'])) {
                                                                            $image_url = BASE_URL . "assets/images/placeholder.jpg";
                                                                        } else {
                                                                            $image_url = BASE_URL . "assets/images/" . htmlspecialchars($item['image_url']);
                                                                        }
                                                                    ?>
                                                                    <img src="<?php echo $image_url; ?>" alt="<?php echo htmlspecialchars($item['product_name']); ?>">
                                                                </div>
                                                                <div class="order-item-details">
                                                                    <h4><?php echo htmlspecialchars($item['product_name']); ?></h4>
                                                                    <div class="order-item-meta">
                                                                        <span>Qty: <?php echo $item['quantity']; ?></span>
                                                                        <span>Price: ৳<?php echo number_format($item['price']); ?></span>
                                                                    </div>
                                                                </div>
                                                                <div class="order-item-total">
                                                                    ৳<?php echo number_format($item['price'] * $item['quantity']); ?>
                                                                </div>
                                                            </div>
                                                        <?php endforeach; ?>
                                                    <?php else: ?>
                                                        <div class="no-items-message">No items found for this order.</div>
                                                    <?php endif; ?>
                                                </div>
                                            </div>
                                            <div class="order-info">
                                                <div class="order-info-section">
                                                    <h4><i class="fas fa-map-marker-alt"></i> Shipping Address</h4>
                                                    <p>
                                                        <?php echo htmlspecialchars($order['name']); ?><br>
                                                        <?php echo htmlspecialchars($order['address']); ?><br>
                                                        <?php echo htmlspecialchars($order['city']); ?>, 
                                                        <?php echo htmlspecialchars($order['state']); ?> <?php echo htmlspecialchars($order['zipcode']); ?><br>
                                                        Phone: <?php echo htmlspecialchars($order['phone']); ?>
                                                    </p>
                                                </div>
                                                <div class="order-info-section">
                                                    <h4><i class="fas fa-credit-card"></i> Payment Method</h4>
                                                    <p><?php echo htmlspecialchars($order['payment_method']); ?></p>
                                                </div>
                                                <?php if (!empty($order['order_notes'])): ?>
                                                <div class="order-info-section">
                                                    <h4><i class="fas fa-clipboard-list"></i> Order Notes</h4>
                                                    <p><?php echo htmlspecialchars($order['order_notes']); ?></p>
                                                </div>
                                                <?php endif; ?>
                                                <div class="order-info-section">
                                                    <h4><i class="fas fa-clock"></i> Order Date & Time</h4>
                                                    <p><?php echo date("d M, Y h:i A", strtotime($order['created_at'])); ?></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php else: ?>
                        <div class="empty-orders">
                            <div class="empty-orders-icon"><i class="fas fa-shopping-bag"></i></div>
                            <p>You have not placed any orders yet.</p>
                            <a href="<?php echo BASE_URL; ?>products.php" class="btn primary-btn">Start Shopping</a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
/* Updated Profile Page Styling */

/* Grid Layout */
.profile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    overflow: hidden;
    margin: 20px auto;
    max-width: 1200px;
}

.profile-form-container,
.order-history-container {
    padding: 30px;
    background-color: #fff;
}

.profile-form-container h2,
.order-history-container h2 {
    font-size: 20px;
    margin-bottom: 10px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 10px;
}

.profile-form-container h2 i,
.order-history-container h2 i {
    color: var(--primary-color);
}

.auth-subtitle {
    color: #666;
    margin-bottom: 20px;
}

/* Enhanced Order History Styles */
.order-history-container {
    background-color: #f8f9fa;
    height: 100%;
    max-height: none; /* Remove max-height to prevent cutoff */
    position: relative;
}

.order-history-list {
    overflow-y: auto;
    max-height: 650px; /* Set max height for scrollable area */
    padding-right: 5px;
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.order-card {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid #eee;
}

.order-card:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    background-color: #fff;
}

.order-header-details {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 10px;
    align-items: center;
    width: 100%;
}

.order-id {
    font-weight: 600;
    color: var(--primary-color);
    font-size: 14px;
}

.order-date {
    color: #777;
    font-size: 14px;
}

.order-status-badge {
    text-align: center;
}

.order-amount {
    font-weight: 600;
    text-align: right;
    color: #333;
}

.order-expand-btn {
    background: none;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: #777;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.order-expand-btn:hover {
    background-color: #f0f0f0;
}

.order-expand-btn i {
    transition: transform 0.3s ease;
}

.order-card.expanded .order-expand-btn i {
    transform: rotate(180deg);
}

/* Fix for order details display */
.order-details {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.6s ease;
}

.order-card.expanded .order-details {
    max-height: none; /* Allow content to expand fully */
    overflow: visible;
}

.order-details-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
}

.order-items-list h3,
.order-info h4 {
    margin-bottom: 15px;
    font-size: 16px;
    color: #333;
    font-weight: 600;
}

.order-items-table {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
}

.order-item {
    display: grid;
    grid-template-columns: 60px 1fr auto;
    gap: 15px;
    align-items: center;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 8px;
}

.order-item-image {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #eee;
}

.order-item-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.order-item-details h4 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
    color: #333;
}

.order-item-meta {
    display: flex;
    gap: 10px;
    font-size: 13px;
    color: #777;
}

.order-item-total {
    font-weight: 600;
    color: var(--primary-color);
}

.order-info {
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 10px;
}

.order-info-section {
    margin-bottom: 15px;
}

.order-info-section:last-child {
    margin-bottom: 0;
}

.order-info-section h4 {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #333;
    font-size: 14px;
    margin-bottom: 8px;
}

.order-info-section h4 i {
    color: var(--primary-color);
}

.order-info-section p {
    font-size: 14px;
    color: #555;
    line-height: 1.5;
    background-color: #fff;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #eee;
}

.empty-orders {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    text-align: center;
}

.empty-orders-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
}

.empty-orders-icon i {
    font-size: 24px;
    color: var(--primary-color);
}

.empty-orders p {
    margin-bottom: 20px;
    color: #777;
}

.no-items-message {
    padding: 20px;
    text-align: center;
    color: #777;
    font-style: italic;
    background-color: #f8f9fa;
    border-radius: 8px;
}

.status {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
}

.status.processing, .status.pending {
    background-color: rgba(243, 156, 18, 0.1);
    color: #f39c12;
}

.status.completed, .status.delivered {
    background-color: rgba(46, 204, 113, 0.1);
    color: #2ecc71;
}

.status.cancelled {
    background-color: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
}

/* Responsive Design */
@media (max-width: 992px) {
    .profile-grid {
        grid-template-columns: 1fr;
    }
    
    .order-history-list {
        max-height: 600px;
    }
}

@media (max-width: 768px) {
    .order-header-details {
        grid-template-columns: 1fr 1fr;
    }
    
    .order-id {
        order: 1;
    }
    
    .order-date {
        order: 2;
    }
    
    .order-status-badge {
        order: 3;
    }
    
    .order-amount {
        order: 4;
        text-align: left;
    }
    
    .order-item {
        grid-template-columns: 50px 1fr;
    }
    
    .order-item-total {
        grid-column: 1 / 3;
        text-align: right;
        margin-top: 10px;
    }
}

/* Fix scrollbar styling */
.order-history-list::-webkit-scrollbar {
    width: 6px;
}

.order-history-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.order-history-list::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
}

.order-history-list::-webkit-scrollbar-thumb:hover {
    background: #aaa;
}

/* Dark Mode Support */
.dark-mode .profile-grid,
.dark-mode .profile-form-container,
.dark-mode .order-card,
.dark-mode .order-header,
.dark-mode .order-item-image,
.dark-mode .order-info-section p {
    background-color: var(--card-color);
    border-color: var(--border-color);
}

.dark-mode .order-history-container,
.dark-mode .order-item,
.dark-mode .order-info {
    background-color: var(--background-color);
}
</style>


<script>
document.addEventListener('DOMContentLoaded', function() {
    // Handle order history expansion
    const orderHeaders = document.querySelectorAll('.order-header');
    orderHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const orderCard = header.closest('.order-card');
            // Close other expanded cards
            document.querySelectorAll('.order-card.expanded').forEach(card => {
                if (card !== orderCard) {
                    card.classList.remove('expanded');
                }
            });
            orderCard.classList.toggle('expanded');
        });
    });
    
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const inputField = this.closest('.input-group').querySelector('input');
            if (inputField) {
                inputField.type = inputField.type === 'password' ? 'text' : 'password';
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            }
        });
    });
});
</script>

<?php include '../includes/footer.php'; ?>