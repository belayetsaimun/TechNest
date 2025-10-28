<?php
require_once 'auth_check.php';
require_once '../includes/config.php';
require_once '../includes/functions.php';

$page_title = "Orders";

// Process status update
if(isset($_POST['update_status']) && isset($_POST['order_id']) && isset($_POST['status'])) {
    $order_id = (int) $_POST['order_id'];
    $status = sanitize($_POST['status']);
    
    $valid_statuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    if(in_array($status, $valid_statuses)) {
        $update_sql = "UPDATE orders SET status = ? WHERE id = ?";
        $update_stmt = $conn->prepare($update_sql);
        $update_stmt->bind_param('si', $status, $order_id);
        
        if($update_stmt->execute()) {
            $_SESSION['admin_message'] = [
                'type' => 'success',
                'text' => "Order #$order_id status updated to \"$status\"."
            ];
        } else {
            $_SESSION['admin_message'] = [
                'type' => 'error',
                'text' => 'Failed to update order status.'
            ];
        }
    } else {
        $_SESSION['admin_message'] = [
            'type' => 'error',
            'text' => 'Invalid status value.'
        ];
    }
    
    header('Location: orders.php');
    exit();
}

// Handle order view
$view_order = null;
if(isset($_GET['view']) && is_numeric($_GET['view'])) {
    $order_id = (int)$_GET['view'];
    
    // Get order details
    $order_sql = "SELECT * FROM orders WHERE id = ?";
    $order_stmt = $conn->prepare($order_sql);
    $order_stmt->bind_param('i', $order_id);
    $order_stmt->execute();
    $result = $order_stmt->get_result();
    
    if($result->num_rows > 0) {
        $view_order = $result->fetch_assoc();
        
        // Get order items
        $items_sql = "SELECT oi.*, p.image_url 
                       FROM order_items oi 
                       LEFT JOIN products p ON oi.product_id = p.id
                       WHERE oi.order_id = ?";
        $items_stmt = $conn->prepare($items_sql);
        $items_stmt->bind_param('i', $order_id);
        $items_stmt->execute();
        $items_result = $items_stmt->get_result();
        
        $view_order['items'] = [];
        while($item = $items_result->fetch_assoc()) {
            $view_order['items'][] = $item;
        }
    }
}

// Get orders with filters and pagination
$current_page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$items_per_page = 10;
$offset = ($current_page - 1) * $items_per_page;

$search = isset($_GET['search']) ? sanitize($_GET['search']) : '';
$status = isset($_GET['status']) ? sanitize($_GET['status']) : '';
$date_from = isset($_GET['date_from']) ? sanitize($_GET['date_from']) : '';
$date_to = isset($_GET['date_to']) ? sanitize($_GET['date_to']) : '';

$where_clauses = [];
$params = [];
$param_types = '';

if(!empty($search)) {
    $where_clauses[] = "(id = ? OR name LIKE ? OR email LIKE ? OR phone LIKE ?)";
    $search_id = is_numeric($search) ? (int)$search : 0;
    $search_param = "%$search%";
    $params[] = $search_id;
    $params[] = $search_param;
    $params[] = $search_param;
    $params[] = $search_param;
    $param_types .= 'isss';
}

if(!empty($status)) {
    $where_clauses[] = "status = ?";
    $params[] = $status;
    $param_types .= 's';
}

if(!empty($date_from)) {
    $where_clauses[] = "created_at >= ?";
    $params[] = $date_from . ' 00:00:00';
    $param_types .= 's';
}

if(!empty($date_to)) {
    $where_clauses[] = "created_at <= ?";
    $params[] = $date_to . ' 23:59:59';
    $param_types .= 's';
}

$where_sql = !empty($where_clauses) ? 'WHERE ' . implode(' AND ', $where_clauses) : '';

// Count total orders for pagination
$count_sql = "SELECT COUNT(*) as total FROM orders $where_sql";
$count_stmt = $conn->prepare($count_sql);

if(!empty($params)) {
    $count_stmt->bind_param($param_types, ...$params);
}

$count_stmt->execute();
$count_result = $count_stmt->get_result();
$total_orders = $count_result->fetch_assoc()['total'];
$total_pages = ceil($total_orders / $items_per_page);

// Get orders with pagination
$sql = "SELECT * FROM orders $where_sql ORDER BY created_at DESC LIMIT ?, ?";
$stmt = $conn->prepare($sql);

// Add pagination parameters
$params[] = $offset;
$params[] = $items_per_page;
$param_types .= 'ii';

$stmt->bind_param($param_types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

include 'includes/header.php';
?>

<style>
.order-filter {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.order-filter input[type="date"] {
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    font-size: 14px;
}

.order-filter input[type="date"]:focus,
.order-filter select:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.1);
}

.order-details {
    display: none;
    padding: 20px;
    background-color: var(--background-color);
    border-top: 1px solid var(--border-color);
}

.order-row.expanded .order-details {
    display: block;
}

.toggle-details {
    background: none;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    transition: transform 0.3s ease;
}

.order-row.expanded .toggle-details {
    transform: rotate(180deg);
}

.order-items {
    margin-top: 15px;
}

.order-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    background-color: var(--card-color);
    border-radius: 5px;
}

.order-item img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 15px;
}

.order-item-details {
    flex: 1;
}

.order-item-name {
    font-weight: 600;
    margin-bottom: 5px;
}

.order-item-price {
    color: var(--text-light);
    font-size: 14px;
}

.order-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.order-info {
    margin-bottom: 15px;
}

.order-info h4 {
    font-size: 16px;
    margin-bottom: 10px;
}

.order-info p {
    margin-bottom: 5px;
}

.status-form {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
}

.status-form select {
    padding: 8px 12px;
    border-radius: 5px;
    border: 1px solid var(--border-color);
}

.no-orders {
    text-align: center;
    padding: 30px;
    color: var(--text-light);
}


.modal-large .modal-content {
    max-width: 800px;
    width: 95%;
}

/* Add these new styles for better modal scrolling */
.modal.modal-large {
    display: flex;
    align-items: center;
    justify-content: center;
}

.order-view-modal {
    max-width: 800px;
    max-height: 90vh; /* Limit to 90% of viewport height */
    display: flex;
    flex-direction: column;
}

.modal-body {
    overflow-y: auto; /* Enable vertical scrolling */
    max-height: calc(90vh - 120px); /* Adjust based on header/footer height */
    padding-right: 10px; /* Prevent content shift when scrollbar appears */
}

/* Improved scrollbar styling */
.modal-body::-webkit-scrollbar {
    width: 8px;
}

.modal-body::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
    background: var(--text-light);
}

.order-view-modal {
    max-width: 800px;
}

.order-view-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.order-view-header h2 {
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
}

.order-view-status {
    padding: 5px 15px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
    text-transform: capitalize;
}

.order-view-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 30px;
}

.order-view-section {
    background-color: var(--background-color);
    padding: 15px;
    border-radius: 5px;
}

.order-view-section h3 {
    font-size: 16px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
}

.order-view-section p {
    margin-bottom: 5px;
}

.order-view-items {
    margin-bottom: 30px;
}

.order-view-item {
    display: grid;
    grid-template-columns: 60px 1fr auto auto;
    gap: 15px;
    align-items: center;
    padding: 10px;
    background-color: var(--background-color);
    border-radius: 5px;
    margin-bottom: 10px;
}

.order-view-item-image {
    width: 60px;
    height: 60px;
    border-radius: 5px;
    overflow: hidden;
}

.order-view-item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.order-view-item-name {
    font-weight: 600;
}

.order-view-item-price {
    color: var(--text-color);
    font-weight: 500;
}

.order-view-total {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid var(--border-color);
}

.order-view-total span {
    font-weight: 700;
    font-size: 18px;
    color: var(--primary-color);
}

/* Modal styles for order view */
.modal-large .modal-content {
    max-width: 800px;
    width: 95%;
}
</style>

<div class="orders-management">
    <div class="management-actions">
        <div class="filter-section">
            <form action="orders.php" method="get" class="filter-form order-filter">
                <div class="search-input">
                    <input type="text" name="search" placeholder="Search orders..." value="<?php echo htmlspecialchars($search); ?>">
                    <button type="submit" class="search-btn">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                
                <select name="status">
                    <option value="">All Statuses</option>
                    <option value="Processing" <?php if($status == 'Processing') echo 'selected'; ?>>Processing</option>
                    <option value="Confirmed" <?php if($status == 'Confirmed') echo 'selected'; ?>>Confirmed</option>
                    <option value="Shipped" <?php if($status == 'Shipped') echo 'selected'; ?>>Shipped</option>
                    <option value="Delivered" <?php if($status == 'Delivered') echo 'selected'; ?>>Delivered</option>
                    <option value="Cancelled" <?php if($status == 'Cancelled') echo 'selected'; ?>>Cancelled</option>
                </select>
                
                <input type="date" name="date_from" placeholder="From Date" value="<?php echo $date_from; ?>">
                <input type="date" name="date_to" placeholder="To Date" value="<?php echo $date_to; ?>">
                
                <button type="submit" class="btn primary-btn">
                    <i class="fas fa-filter"></i> Filter
                </button>
                
                <?php if(!empty($search) || !empty($status) || !empty($date_from) || !empty($date_to)): ?>
                    <a href="orders.php" class="btn secondary-btn">
                        <i class="fas fa-times"></i> Clear Filters
                    </a>
                <?php endif; ?>
            </form>
        </div>
    </div>
    
    <?php if(isset($_SESSION['admin_message'])): ?>
        <div class="alert alert-<?php echo $_SESSION['admin_message']['type']; ?>">
            <i class="fas fa-<?php echo $_SESSION['admin_message']['type'] == 'success' ? 'check-circle' : 'exclamation-circle'; ?>"></i>
            <?php echo $_SESSION['admin_message']['text']; ?>
            <button type="button" class="close-alert">&times;</button>
        </div>
        <?php unset($_SESSION['admin_message']); ?>
    <?php endif; ?>
    
    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if($result->num_rows > 0): ?>
                    <?php while($order = $result->fetch_assoc()): ?>
                        <tr class="order-row" id="order-<?php echo $order['id']; ?>">
                            <td>#<?php echo $order['id']; ?></td>
                            <td>
                                <div><?php echo htmlspecialchars($order['name']); ?></div>
                                <div style="font-size: 12px; color: var(--text-light);"><?php echo htmlspecialchars($order['email']); ?></div>
                            </td>
                            <td><?php echo date('M d, Y', strtotime($order['created_at'])); ?></td>
                            <td>৳<?php echo number_format($order['total_amount']); ?></td>
                            <td>
                                <span class="status-badge <?php echo strtolower($order['status']); ?>">
                                    <?php echo htmlspecialchars($order['status']); ?>
                                </span>
                            </td>
                            <td>
                                <div class="action-buttons" style="display: flex; gap: 5px;">
                                    <button class="btn primary-btn toggle-details" style="padding: 5px 10px;" data-id="<?php echo $order['id']; ?>" title="Toggle Details">
                                        <i class="fas fa-chevron-down"></i>
                                    </button>
                                    <a href="orders.php?view=<?php echo $order['id']; ?>" class="btn secondary-btn" style="padding: 5px 10px;" title="View Details">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <tr class="order-details-row">
                            <td colspan="6" class="order-details" id="details-<?php echo $order['id']; ?>">
                                <div class="order-meta">
                                    <div class="order-info">
                                        <h4>Customer Information</h4>
                                        <p><strong>Name:</strong> <?php echo htmlspecialchars($order['name']); ?></p>
                                        <p><strong>Email:</strong> <?php echo htmlspecialchars($order['email']); ?></p>
                                        <p><strong>Phone:</strong> <?php echo htmlspecialchars($order['phone']); ?></p>
                                    </div>
                                    
                                    <div class="order-info">
                                        <h4>Shipping Address</h4>
                                        <p><?php echo htmlspecialchars($order['address']); ?></p>
                                        <p><?php echo htmlspecialchars($order['city']); ?>, <?php echo htmlspecialchars($order['state']); ?> <?php echo htmlspecialchars($order['zipcode']); ?></p>
                                    </div>
                                    
                                    <div class="order-info">
                                        <h4>Order Details</h4>
                                        <p><strong>Date:</strong> <?php echo date('M d, Y H:i', strtotime($order['created_at'])); ?></p>
                                        <p><strong>Payment Method:</strong> <?php echo htmlspecialchars($order['payment_method']); ?></p>
                                        <p><strong>Total Amount:</strong> ৳<?php echo number_format($order['total_amount']); ?></p>
                                        
                                        <form method="post" class="status-form">
                                            <input type="hidden" name="order_id" value="<?php echo $order['id']; ?>">
                                            <select name="status" class="status-select">
                                                <option value="Processing" <?php if($order['status'] == 'Processing') echo 'selected'; ?>>Processing</option>
                                                <option value="Confirmed" <?php if($order['status'] == 'Confirmed') echo 'selected'; ?>>Confirmed</option>
                                                <option value="Shipped" <?php if($order['status'] == 'Shipped') echo 'selected'; ?>>Shipped</option>
                                            
                                                <option value="Delivered" <?php if($order['status'] == 'Delivered') echo 'selected'; ?>>Delivered</option>
                                                <option value="Cancelled" <?php if($order['status'] == 'Cancelled') echo 'selected'; ?>>Cancelled</option>
                                            </select>
                                            <button type="submit" name="update_status" class="btn primary-btn" style="padding: 8px 15px;">
                                                <i class="fas fa-save"></i> Update
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                
                                <div class="order-items">
                                    <h4>Order Items</h4>
                                    <?php
                                    // Get order items
                                    $items_sql = "SELECT oi.*, p.image_url 
                                            FROM order_items oi 
                                            LEFT JOIN products p ON oi.product_id = p.id
                                            WHERE oi.order_id = ?";
                                    $items_stmt = $conn->prepare($items_sql);
                                    $items_stmt->bind_param('i', $order['id']);
                                    $items_stmt->execute();
                                    $items_result = $items_stmt->get_result();
                                    
                                    if($items_result->num_rows > 0):
                                        while($item = $items_result->fetch_assoc()):
                                    ?>
                                        <div class="order-item">
                                            <img src="../assets/images/<?php echo !empty($item['image_url']) ? htmlspecialchars($item['image_url']) : 'placeholder.jpg'; ?>" alt="<?php echo htmlspecialchars($item['product_name']); ?>">
                                            <div class="order-item-details">
                                                <div class="order-item-name"><?php echo htmlspecialchars($item['product_name']); ?></div>
                                                <div class="order-item-price">৳<?php echo number_format($item['price']); ?> × <?php echo $item['quantity']; ?></div>
                                            </div>
                                            <div class="order-item-total">৳<?php echo number_format($item['price'] * $item['quantity']); ?></div>
                                        </div>
                                    <?php
                                        endwhile;
                                    else:
                                    ?>
                                        <p>No items found for this order.</p>
                                    <?php endif; ?>
                                </div>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="6" class="no-orders">No orders found.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    
    <?php if($total_pages > 1): ?>
        <div class="pagination">
            <?php if($current_page > 1): ?>
                <a href="?page=<?php echo $current_page - 1; ?><?php if(!empty($search)) echo '&search=' . urlencode($search); ?><?php if(!empty($status)) echo '&status=' . urlencode($status); ?><?php if(!empty($date_from)) echo '&date_from=' . urlencode($date_from); ?><?php if(!empty($date_to)) echo '&date_to=' . urlencode($date_to); ?>" class="page-link">
                    <i class="fas fa-chevron-left"></i> Previous
                </a>
            <?php endif; ?>
            
            <?php
            // Show limited page numbers with ellipsis
            $start_page = max(1, $current_page - 2);
            $end_page = min($total_pages, $current_page + 2);
            
            if($start_page > 1) {
                echo '<a href="?page=1' . (!empty($search) ? '&search=' . urlencode($search) : '') . (!empty($status) ? '&status=' . urlencode($status) : '') . (!empty($date_from) ? '&date_from=' . urlencode($date_from) : '') . (!empty($date_to) ? '&date_to=' . urlencode($date_to) : '') . '" class="page-link">1</a>';
                if($start_page > 2) {
                    echo '<span class="ellipsis">...</span>';
                }
            }
            
            for($i = $start_page; $i <= $end_page; $i++) {
                echo '<a href="?page=' . $i . (!empty($search) ? '&search=' . urlencode($search) : '') . (!empty($status) ? '&status=' . urlencode($status) : '') . (!empty($date_from) ? '&date_from=' . urlencode($date_from) : '') . (!empty($date_to) ? '&date_to=' . urlencode($date_to) : '') . '" class="page-link ' . ($i == $current_page ? 'active' : '') . '">' . $i . '</a>';
            }
            
            if($end_page < $total_pages) {
                if($end_page < $total_pages - 1) {
                    echo '<span class="ellipsis">...</span>';
                }
                echo '<a href="?page=' . $total_pages . (!empty($search) ? '&search=' . urlencode($search) : '') . (!empty($status) ? '&status=' . urlencode($status) : '') . (!empty($date_from) ? '&date_from=' . urlencode($date_from) : '') . (!empty($date_to) ? '&date_to=' . urlencode($date_to) : '') . '" class="page-link">' . $total_pages . '</a>';
            }
            ?>
            
            <?php if($current_page < $total_pages): ?>
                <a href="?page=<?php echo $current_page + 1; ?><?php if(!empty($search)) echo '&search=' . urlencode($search); ?><?php if(!empty($status)) echo '&status=' . urlencode($status); ?><?php if(!empty($date_from)) echo '&date_from=' . urlencode($date_from); ?><?php if(!empty($date_to)) echo '&date_to=' . urlencode($date_to); ?>" class="page-link">
                    Next <i class="fas fa-chevron-right"></i>
                </a>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</div>

<!-- Order View Modal -->
<?php if($view_order): ?>
<div class="modal modal-large show" id="viewOrderModal">
    <div class="modal-content order-view-modal">
        <div class="modal-header">
            <h3><i class="fas fa-shopping-bag"></i> Order Details</h3>
            <button type="button" class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <div class="order-view-header">
                <h2>
                    <i class="fas fa-shopping-cart"></i> Order #<?php echo $view_order['id']; ?>
                </h2>
                <span class="status-badge order-view-status <?php echo strtolower($view_order['status']); ?>">
                    <?php echo htmlspecialchars($view_order['status']); ?>
                </span>
            </div>
            
            <div class="order-view-details">
                <div class="order-view-section">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> <?php echo htmlspecialchars($view_order['name']); ?></p>
                    <p><strong>Email:</strong> <?php echo htmlspecialchars($view_order['email']); ?></p>
                    <p><strong>Phone:</strong> <?php echo htmlspecialchars($view_order['phone']); ?></p>
                    <p><strong>Payment Method:</strong> <?php echo htmlspecialchars($view_order['payment_method']); ?></p>
                    <p><strong>Order Date:</strong> <?php echo date('M d, Y H:i', strtotime($view_order['created_at'])); ?></p>
                </div>
                
                <div class="order-view-section">
                    <h3>Shipping Address</h3>
                    <p><?php echo htmlspecialchars($view_order['name']); ?></p>
                    <p><?php echo htmlspecialchars($view_order['address']); ?></p>
                    <p><?php echo htmlspecialchars($view_order['city']); ?>, <?php echo htmlspecialchars($view_order['state']); ?> <?php echo htmlspecialchars($view_order['zipcode']); ?></p>
                    <p><?php echo htmlspecialchars($view_order['phone']); ?></p>
                    
                    <?php if(!empty($view_order['order_notes'])): ?>
                        <h4 style="margin-top: 15px;">Order Notes</h4>
                        <p><?php echo htmlspecialchars($view_order['order_notes']); ?></p>
                    <?php endif; ?>
                </div>
            </div>
            
            <div class="order-view-items">
                <h3>Order Items</h3>
                
                <?php if(!empty($view_order['items'])): ?>
                    <?php foreach($view_order['items'] as $item): ?>
                        <div class="order-view-item">
                            <div class="order-view-item-image">
                                <img src="../assets/images/<?php echo !empty($item['image_url']) ? htmlspecialchars($item['image_url']) : 'placeholder.jpg'; ?>" alt="<?php echo htmlspecialchars($item['product_name']); ?>">
                            </div>
                            <div class="order-view-item-details">
                                <div class="order-view-item-name"><?php echo htmlspecialchars($item['product_name']); ?></div>
                                <div class="order-view-item-id">Product ID: <?php echo $item['product_id']; ?></div>
                            </div>
                            <div class="order-view-item-quantity">
                                <?php echo $item['quantity']; ?> × ৳<?php echo number_format($item['price']); ?>
                            </div>
                            <div class="order-view-item-price">
                                ৳<?php echo number_format($item['price'] * $item['quantity']); ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                    
                    <div class="order-view-total">
                        <div class="order-view-total-label">Total:</div>
                        <span class="order-view-total-amount">৳<?php echo number_format($view_order['total_amount']); ?></span>
                    </div>
                <?php else: ?>
                    <p>No items found for this order.</p>
                <?php endif; ?>
            </div>
            
            <div class="order-status-update">
                <h3>Update Order Status</h3>
                <form method="post" class="status-form">
                    <input type="hidden" name="order_id" value="<?php echo $view_order['id']; ?>">
                    <select name="status" class="status-select">
                        <option value="Processing" <?php if($view_order['status'] == 'Processing') echo 'selected'; ?>>Processing</option>
                        <option value="Confirmed" <?php if($view_order['status'] == 'Confirmed') echo 'selected'; ?>>Confirmed</option>
                        <option value="Shipped" <?php if($view_order['status'] == 'Shipped') echo 'selected'; ?>>Shipped</option>
                        <option value="Delivered" <?php if($view_order['status'] == 'Delivered') echo 'selected'; ?>>Delivered</option>
                        <option value="Cancelled" <?php if($view_order['status'] == 'Cancelled') echo 'selected'; ?>>Cancelled</option>
                    </select>
                    <button type="submit" name="update_status" class="btn primary-btn">
                        <i class="fas fa-save"></i> Update Status
                    </button>
                </form>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn secondary-btn close-modal">Close</button>
        </div>
    </div>
</div>
<?php endif; ?>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Toggle order details
    const toggleButtons = document.querySelectorAll('.toggle-details');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.dataset.id;
            const orderRow = document.getElementById('order-' + orderId);
            orderRow.classList.toggle('expanded');
            const detailsRow = document.getElementById('details-' + orderId);
            
            if(orderRow.classList.contains('expanded')) {
                detailsRow.style.display = 'block';
                this.querySelector('i').className = 'fas fa-chevron-up';
            } else {
                detailsRow.style.display = 'none';
                this.querySelector('i').className = 'fas fa-chevron-down';
            }
        });
    });
    
    // Close view order modal
    const closeModalButtons = document.querySelectorAll('.close-modal');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = document.getElementById('viewOrderModal');
            if(modal) {
                window.location.href = 'orders.php';
            }
        });
    });
});
</script>

<?php include 'includes/footer.php'; ?>