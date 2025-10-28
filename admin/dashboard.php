<?php
require_once 'auth_check.php';
require_once '../includes/config.php';
require_once '../includes/functions.php';

// Get some basic stats for the dashboard
$stats = [
    'products' => 0,
    'orders' => 0,
    'revenue' => 0,
    'messages' => 0
];

// Count products
$result = mysqli_query($conn, "SELECT COUNT(*) as count FROM products");
if($result) {
    $stats['products'] = mysqli_fetch_assoc($result)['count'];
}

// Count orders
$result = mysqli_query($conn, "SELECT COUNT(*) as count FROM orders");
if($result) {
    $stats['orders'] = mysqli_fetch_assoc($result)['count'];
}

// Calculate revenue
$result = mysqli_query($conn, "SELECT SUM(total_amount) as total FROM orders");
if($result) {
    $row = mysqli_fetch_assoc($result);
    $stats['revenue'] = $row['total'] ?? 0;
}

// Count messages
$result = mysqli_query($conn, "SELECT COUNT(*) as count FROM messages");
if($result) {
    $stats['messages'] = mysqli_fetch_assoc($result)['count'];
}

// Get recent orders
$recentOrders = [];
$result = mysqli_query($conn, "SELECT * FROM orders ORDER BY created_at DESC LIMIT 5");
if($result) {
    while($row = mysqli_fetch_assoc($result)) {
        $recentOrders[] = $row;
    }
}

// Get recent messages
$recentMessages = [];
$result = mysqli_query($conn, "SELECT * FROM messages ORDER BY received_at DESC LIMIT 5");
if($result) {
    while($row = mysqli_fetch_assoc($result)) {
        $recentMessages[] = $row;
    }
}

$page_title = "Dashboard";
include 'includes/header.php';
?>

<div class="dashboard-stats">
    <div class="stat-card">
        <div class="stat-icon products-icon">
            <i class="fas fa-box"></i>
        </div>
        <div class="stat-details">
            <h3>Total Products</h3>
            <div class="stat-number"><?php echo number_format($stats['products']); ?></div>
            <a href="products.php" class="stat-link">Manage Products <i class="fas fa-arrow-right"></i></a>
        </div>
    </div>
    
    <div class="stat-card">
        <div class="stat-icon orders-icon">
            <i class="fas fa-shopping-cart"></i>
        </div>
        <div class="stat-details">
            <h3>Total Orders</h3>
            <div class="stat-number"><?php echo number_format($stats['orders']); ?></div>
            <a href="orders.php" class="stat-link">View Orders <i class="fas fa-arrow-right"></i></a>
        </div>
    </div>
    
    <div class="stat-card">
        <div class="stat-icon revenue-icon">
            <i class="fas fa-money-bill-wave"></i>
        </div>
        <div class="stat-details">
            <h3>Total Revenue</h3>
            <div class="stat-number">৳<?php echo number_format($stats['revenue']); ?></div>
            <!-- <a href="orders.php" class="stat-link">View Details <i class="fas fa-arrow-right"></i></a> -->
        </div>
    </div>
    
    <div class="stat-card">
        <div class="stat-icon messages-icon">
            <i class="fas fa-envelope"></i>
        </div>
        <div class="stat-details">
            <h3>Messages</h3>
            <div class="stat-number"><?php echo number_format($stats['messages']); ?></div>
            <a href="messages.php" class="stat-link">View Messages <i class="fas fa-arrow-right"></i></a>
        </div>
    </div>
</div>

<div class="dashboard-widgets">
    <div class="widget recent-orders">
        <div class="widget-header">
            <h3><i class="fas fa-shopping-bag"></i> Recent Orders</h3>
            <a href="orders.php" class="view-all">View All</a>
        </div>
        <div class="widget-content">
            <?php if(count($recentOrders) > 0): ?>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($recentOrders as $order): ?>
                            <tr>
                                <td>#<?php echo $order['id']; ?></td>
                                <td><?php echo htmlspecialchars($order['name']); ?></td>
                                <td>৳<?php echo number_format($order['total_amount']); ?></td>
                                <td>
                                    <span class="status-badge <?php echo strtolower($order['status']); ?>">
                                        <?php echo htmlspecialchars($order['status']); ?>
                                    </span>
                                </td>
                                <td><?php echo date('M d, Y', strtotime($order['created_at'])); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p class="no-data">No recent orders found</p>
            <?php endif; ?>
        </div>
    </div>
    
    <div class="widget recent-messages">
        <div class="widget-header">
            <h3><i class="fas fa-comment-alt"></i> Recent Messages</h3>
            <a href="messages.php" class="view-all">View All</a>
        </div>
        <div class="widget-content">
            <?php if(count($recentMessages) > 0): ?>
                <div class="message-list">
                    <?php foreach($recentMessages as $message): ?>
                        <div class="message-item <?php echo $message['is_read'] ? '' : 'unread'; ?>">
                            <div class="message-sender">
                                <i class="fas fa-user-circle"></i>
                                <div class="sender-details">
                                    <span class="sender-name"><?php echo htmlspecialchars($message['name']); ?></span>
                                    <span class="sender-email"><?php echo htmlspecialchars($message['email']); ?></span>
                                </div>
                            </div>
                            <div class="message-preview">
                                <?php echo htmlspecialchars(substr($message['message'], 0, 80)) . (strlen($message['message']) > 80 ? '...' : ''); ?>
                            </div>
                            <div class="message-date">
                                <?php echo date('M d, Y', strtotime($message['received_at'])); ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <p class="no-data">No messages found</p>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>