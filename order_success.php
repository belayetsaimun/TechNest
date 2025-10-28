<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

if (!isLoggedIn()) {
    redirect('auth/auth.php'); // Redirect to your unified auth page
}

// Get the order ID from the URL, or redirect if not present
if (!isset($_GET['order_id'])) {
    redirect('index.php');
}

$order_id = sanitize($_GET['order_id']);
$user_id = $_SESSION['user_id'];

// Fetch the user's order to display details
$sql = "SELECT * FROM orders WHERE id = ? AND user_id = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "ii", $order_id, $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$order = mysqli_fetch_assoc($result);

if (!$order) {
    // If order doesn't exist or doesn't belong to the user, redirect
    $_SESSION['error'] = "Could not find the specified order.";
    redirect('index.php');
}

$active_page = 'checkout.php';
$title = "Order Successful - TechNest";
include 'includes/header.php';
?>

<section class="container" style="padding-top: 50px; padding-bottom: 50px; text-align: center; max-width: 700px;">
    <div class="success-icon" style="font-size: 70px; color: var(--success-color); margin-bottom: 20px;">
        <i class="fas fa-check-circle fa-beat"></i>
    </div>
    <h2>Order Placed Successfully!</h2>
    <p>Thank you for your purchase. Your order has been confirmed.</p>
    <p>We've sent a confirmation email to <strong><?php echo htmlspecialchars($order['email']); ?></strong>.</p>
    
    <div class="order-details" style="margin: 30px 0; text-align: left; padding: 25px; background: var(--background-color); border-radius: 12px; border-left: 4px solid var(--primary-color);">
        <h3>Order Summary</h3>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color); margin-bottom: 10px;">
            <span>Order Number:</span> <strong>#TN<?php echo htmlspecialchars($order['id']); ?></strong>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0;">
            <span>Order Date:</span> <strong><?php echo date("F j, Y", strtotime($order['created_at'])); ?></strong>
        </div>
        <div style="display: flex; justify-content: space-between; padding-top: 10px; margin-top: 10px; border-top: 1px solid var(--border-color); font-size: 1.2rem;">
            <strong>Order Total:</strong> <strong>৳<?php echo number_format($order['total_amount']); ?></strong>
        </div>
    </div>
    
    <div class="success-actions" style="display: flex; justify-content: center; gap: 20px;">
        <a href="<?php echo BASE_URL; ?>products.php" class="btn secondary-btn"><i class="fas fa-shopping-bag"></i> Continue Shopping</a>
        <a href="<?php echo BASE_URL; ?>auth/profile.php" class="btn primary-btn"><i class="fas fa-user-circle"></i> View My Orders</a>
    </div>
</section>

<?php
include 'includes/footer.php';
?>