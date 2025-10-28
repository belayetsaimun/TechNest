<?php
require_once 'auth_check.php';
require_once '../includes/config.php';
require_once '../includes/functions.php';

$page_title = "Messages";

// Handle message read status update
if(isset($_GET['action']) && $_GET['action'] == 'mark_read' && isset($_GET['id'])) {
    $message_id = (int) $_GET['id'];
    
    $update_sql = "UPDATE messages SET is_read = 1 WHERE id = ?";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->bind_param('i', $message_id);
    
    if($update_stmt->execute()) {
        $_SESSION['admin_message'] = [
            'type' => 'success',
            'text' => 'Message marked as read.'
        ];
    } else {
        $_SESSION['admin_message'] = [
            'type' => 'error',
            'text' => 'Failed to update message status.'
        ];
    }
    
    header('Location: messages.php');
    exit();
}

// Handle message deletion
if(isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['id'])) {
    $message_id = (int) $_GET['id'];
    
    $delete_sql = "DELETE FROM messages WHERE id = ?";
    $delete_stmt = $conn->prepare($delete_sql);
    $delete_stmt->bind_param('i', $message_id);
    
    if($delete_stmt->execute()) {
        $_SESSION['admin_message'] = [
            'type' => 'success',
            'text' => 'Message has been deleted.'
        ];
    } else {
        $_SESSION['admin_message'] = [
            'type' => 'error',
            'text' => 'Failed to delete message.'
        ];
    }
    
    header('Location: messages.php');
    exit();
}

// Get messages with filters and pagination
$current_page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$items_per_page = 10;
$offset = ($current_page - 1) * $items_per_page;

$search = isset($_GET['search']) ? sanitize($_GET['search']) : '';
$read_status = isset($_GET['read_status']) ? sanitize($_GET['read_status']) : '';

$where_clauses = [];
$params = [];
$param_types = '';

if(!empty($search)) {
    $where_clauses[] = "(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)";
    $search_param = "%$search%";
    $params[] = $search_param;
    $params[] = $search_param;
    $params[] = $search_param;
    $params[] = $search_param;
    $param_types .= 'ssss';
}

if($read_status != '') {
    $read_status_value = ($read_status == 'read') ? 1 : 0;
    $where_clauses[] = "is_read = ?";
    $params[] = $read_status_value;
    $param_types .= 'i';
}

$where_sql = !empty($where_clauses) ? 'WHERE ' . implode(' AND ', $where_clauses) : '';

// Count total messages for pagination
$count_sql = "SELECT COUNT(*) as total FROM messages $where_sql";
$count_stmt = $conn->prepare($count_sql);

if(!empty($params)) {
    $count_stmt->bind_param($param_types, ...$params);
}

$count_stmt->execute();
$count_result = $count_stmt->get_result();
$total_messages = $count_result->fetch_assoc()['total'];
$total_pages = ceil($total_messages / $items_per_page);

// Get messages with pagination
$sql = "SELECT * FROM messages $where_sql ORDER BY received_at DESC LIMIT ?, ?";
$stmt = $conn->prepare($sql);

// Add pagination parameters
$params[] = $offset;
$params[] = $items_per_page;
$param_types .= 'ii';

$stmt->bind_param($param_types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

// Get view message if ID is provided
$view_message = null;
if(isset($_GET['view']) && is_numeric($_GET['view'])) {
    $message_id = (int)$_GET['view'];
    
    // Update read status
    $update_sql = "UPDATE messages SET is_read = 1 WHERE id = ?";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->bind_param('i', $message_id);
    $update_stmt->execute();
    
    // Get message details
    $message_sql = "SELECT * FROM messages WHERE id = ?";
    $message_stmt = $conn->prepare($message_sql);
    $message_stmt->bind_param('i', $message_id);
    $message_stmt->execute();
    $message_result = $message_stmt->get_result();
    
    if($message_result->num_rows > 0) {
        $view_message = $message_result->fetch_assoc();
    }
}

include 'includes/header.php';
?>

<style>
.message-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
}

.message-status-filter {
    min-width: 150px;
}

.message-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    margin-top: 20px;
}

.message-item {
    display: flex;
    flex-direction: column;
    background-color: var(--card-color);
    border-radius: 10px;
    padding: 0;
    box-shadow: var(--shadow);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.message-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.message-item.unread {
    border-left: 3px solid var(--primary-color);
}

.message-header {
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
    background-color: var(--background-color);
    border-bottom: 1px solid var(--border-color);
}

.message-sender {
    display: flex;
    align-items: center;
    gap: 10px;
}

.sender-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
}

.sender-info {
    display: flex;
    flex-direction: column;
}

.sender-name {
    font-weight: 600;
    color: var(--dark-color);
}

.sender-email {
    font-size: 12px;
    color: var(--text-light);
}

.message-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
}

.message-date {
    font-size: 12px;
    color: var(--text-light);
}

.message-badge {
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 600;
}

.unread-badge {
    background-color: rgba(0, 82, 204, 0.1);
    color: var(--primary-color);
}

.read-badge {
    background-color: var(--background-color);
    color: var(--text-light);
}

.message-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.message-subject {
    font-weight: 600;
    font-size: 18px;
    color: var(--dark-color);
}

.message-body {
    color: var(--text-color);
    line-height: 1.6;
    white-space: pre-line;
}

.message-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 0 20px 15px 20px;
}

.message-view {
    margin-top: 20px;
    background-color: var(--card-color);
    border-radius: 10px;
    padding: 20px;
    box-shadow: var(--shadow);
}

.message-view-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-color);
}

.message-view-sender {
    display: flex;
    align-items: center;
    gap: 15px;
}

.message-view-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 20px;
}

.message-view-sender-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.message-view-name {
    font-weight: 600;
    font-size: 18px;
    color: var(--dark-color);
}

.message-view-email {
    color: var(--text-light);
}

.message-view-date {
    color: var(--text-light);
    font-size: 14px;
}

.message-view-subject {
    font-size: 24px;
    font-weight: 600;
    color: var(--dark-color);
    margin-bottom: 20px;
}

.message-view-body {
    color: var(--text-color);
    line-height: 1.8;
    white-space: pre-line;
    margin-bottom: 30px;
    padding: 20px;
    background-color: var(--background-color);
    border-radius: 10px;
}

.message-view-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.no-messages {
    text-align: center;
    padding: 50px 0;
    color: var(--text-light);
}
</style>

<div class="messages-management">
    <?php if(!isset($_GET['view'])): ?>
        <div class="management-actions">
            <div class="filter-section">
                <form action="messages.php" method="get" class="filter-form message-filter">
                    <div class="search-input">
                        <input type="text" name="search" placeholder="Search messages..." value="<?php echo htmlspecialchars($search); ?>">
                        <button type="submit" class="search-btn">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                    
                    <select name="read_status" class="message-status-filter">
                        <option value="">All Messages</option>
                        <option value="unread" <?php if($read_status == 'unread') echo 'selected'; ?>>Unread</option>
                        <option value="read" <?php if($read_status == 'read') echo 'selected'; ?>>Read</option>
                    </select>
                    
                    <button type="submit" class="btn primary-btn">
                        <i class="fas fa-filter"></i> Filter
                    </button>
                    
                    <?php if(!empty($search) || $read_status !== ''): ?>
                        <a href="messages.php" class="btn secondary-btn">
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
        
        <div class="message-list">
            <?php if($result->num_rows > 0): ?>
                <?php while($message = $result->fetch_assoc()): ?>
                    <div class="message-item <?php echo $message['is_read'] ? '' : 'unread'; ?>">
                        <div class="message-header">
                            <div class="message-sender">
                                <div class="sender-avatar">
                                    <?php echo strtoupper(substr($message['name'], 0, 1)); ?>
                                </div>
                                <div class="sender-info">
                                    <div class="sender-name"><?php echo htmlspecialchars($message['name']); ?></div>
                                    <div class="sender-email"><?php echo htmlspecialchars($message['email']); ?></div>
                                </div>
                            </div>
                            <div class="message-meta">
                                <div class="message-date"><?php echo date('M d, Y H:i', strtotime($message['received_at'])); ?></div>
                                <div class="message-badge <?php echo $message['is_read'] ? 'read-badge' : 'unread-badge'; ?>">
                                    <?php echo $message['is_read'] ? 'Read' : 'Unread'; ?>
                                </div>
                            </div>
                        </div>
                        <div class="message-content">
                            <div class="message-subject"><?php echo htmlspecialchars($message['subject']); ?></div>
                            <div class="message-body"><?php echo htmlspecialchars(substr($message['message'], 0, 150)) . (strlen($message['message']) > 150 ? '...' : ''); ?></div>
                        </div>
                        <div class="message-actions">
                            <a href="messages.php?view=<?php echo $message['id']; ?>" class="btn primary-btn">
                                <i class="fas fa-envelope-open-text"></i> Read
                            </a>
                            <?php if(!$message['is_read']): ?>
                                <a href="messages.php?action=mark_read&id=<?php echo $message['id']; ?>" class="btn secondary-btn">
                                    <i class="fas fa-check"></i> Mark as Read
                                </a>
                            <?php endif; ?>
                            <button class="btn danger-btn" onclick="confirmDelete(<?php echo $message['id']; ?>)">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                <?php endwhile; ?>
            <?php else: ?>
                <div class="no-messages">
                    <i class="fas fa-envelope" style="font-size: 48px; color: var(--text-light); margin-bottom: 15px;"></i>
                    <p>No messages found.</p>
                </div>
            <?php endif; ?>
        </div>
        
        <?php if($total_pages > 1): ?>
            <div class="pagination">
                <?php if($current_page > 1): ?>
                    <a href="?page=<?php echo $current_page - 1; ?><?php if(!empty($search)) echo '&search=' . urlencode($search); ?><?php if($read_status !== '') echo '&read_status=' . urlencode($read_status); ?>" class="page-link">
                        <i class="fas fa-chevron-left"></i> Previous
                    </a>
                <?php endif; ?>
                
                <?php
                // Show limited page numbers with ellipsis
                $start_page = max(1, $current_page - 2);
                $end_page = min($total_pages, $current_page + 2);
                
                if($start_page > 1) {
                    echo '<a href="?page=1' . (!empty($search) ? '&search=' . urlencode($search) : '') . ($read_status !== '' ? '&read_status=' . urlencode($read_status) : '') . '" class="page-link">1</a>';
                    if($start_page > 2) {
                        echo '<span class="ellipsis">...</span>';
                    }
                }
                
                for($i = $start_page; $i <= $end_page; $i++) {
                    echo '<a href="?page=' . $i . (!empty($search) ? '&search=' . urlencode($search) : '') . ($read_status !== '' ? '&read_status=' . urlencode($read_status) : '') . '" class="page-link ' . ($i == $current_page ? 'active' : '') . '">' . $i . '</a>';
                }
                
                if($end_page < $total_pages) {
                    if($end_page < $total_pages - 1) {
                        echo '<span class="ellipsis">...</span>';
                    }
                    echo '<a href="?page=' . $total_pages . (!empty($search) ? '&search=' . urlencode($search) : '') . ($read_status !== '' ? '&read_status=' . urlencode($read_status) : '') . '" class="page-link">' . $total_pages . '</a>';
                }
                ?>
                
                <?php if($current_page < $total_pages): ?>
                    <a href="?page=<?php echo $current_page + 1; ?><?php if(!empty($search)) echo '&search=' . urlencode($search); ?><?php if($read_status !== '') echo '&read_status=' . urlencode($read_status); ?>" class="page-link">
                        Next <i class="fas fa-chevron-right"></i>
                    </a>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    <?php else: ?>
        <!-- View Message -->
        <?php if($view_message): ?>
            <div class="message-view">
                <div class="message-view-header">
                    <div class="message-view-sender">
                        <div class="message-view-avatar">
                            <?php echo strtoupper(substr($view_message['name'], 0, 1)); ?>
                        </div>
                        <div class="message-view-sender-info">
                            <div class="message-view-name"><?php echo htmlspecialchars($view_message['name']); ?></div>
                            <div class="message-view-email"><?php echo htmlspecialchars($view_message['email']); ?></div>
                            <?php if($view_message['phone']): ?>
                                <div class="message-view-phone"><i class="fas fa-phone"></i> <?php echo htmlspecialchars($view_message['phone']); ?></div>
                            <?php endif; ?>
                        </div>
                    </div>
                    <div class="message-view-date">
                        <i class="fas fa-calendar"></i> <?php echo date('F d, Y', strtotime($view_message['received_at'])); ?>
                        <br>
                        <i class="fas fa-clock"></i> <?php echo date('h:i A', strtotime($view_message['received_at'])); ?>
                    </div>
                </div>
                
                <div class="message-view-subject"><?php echo htmlspecialchars($view_message['subject']); ?></div>
                <div class="message-view-body"><?php echo htmlspecialchars($view_message['message']); ?></div>
                
                <div class="message-view-actions">
                    <a href="messages.php" class="btn secondary-btn">
                        <i class="fas fa-arrow-left"></i> Back to Messages
                    </a>
                    <button class="btn danger-btn" onclick="confirmDelete(<?php echo $view_message['id']; ?>)">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        <?php else: ?>
            <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i> Message not found.
                <button type="button" class="close-alert">&times;</button>
            </div>
            
            <div class="message-view-actions" style="margin-top: 20px;">
                <a href="messages.php" class="btn secondary-btn">
                    <i class="fas fa-arrow-left"></i> Back to Messages
                </a>
            </div>
        <?php endif; ?>
    <?php endif; ?>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal" id="deleteModal">
    <div class="modal-content" style="max-width: 400px;">
        <div class="modal-header">
            <h3><i class="fas fa-trash"></i> Delete Message</h3>
            <button type="button" class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <p>Are you sure you want to delete this message?</p>
            <p class="warning"><i class="fas fa-exclamation-triangle"></i> This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn secondary-btn cancel-btn">Cancel</button>
            <a href="#" id="deleteLink" class="btn danger-btn">Delete</a>
        </div>
    </div>
</div>

<script>
function confirmDelete(id) {
    document.getElementById('deleteLink').href = 'messages.php?action=delete&id=' + id;
    document.getElementById('deleteModal').classList.add('show');
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('deleteModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.classList.remove('show');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.classList.remove('show');
        });
    }
});
</script>

<?php include 'includes/footer.php'; ?>