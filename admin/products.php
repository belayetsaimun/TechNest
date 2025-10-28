<?php
require_once 'auth_check.php';
require_once '../includes/config.php';
require_once '../includes/functions.php';

$page_title = "Products";

// Process product deletion
if(isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['id'])) {
    $product_id = (int) $_GET['id'];
    
    // Get product details first (for image deletion)
    $get_product_sql = "SELECT image_url FROM products WHERE id = ?";
    $get_stmt = $conn->prepare($get_product_sql);
    $get_stmt->bind_param('i', $product_id);
    $get_stmt->execute();
    $product_result = $get_stmt->get_result();
    $product = $product_result->fetch_assoc();
    
    // Delete the product
    $delete_sql = "DELETE FROM products WHERE id = ?";
    $delete_stmt = $conn->prepare($delete_sql);
    $delete_stmt->bind_param('i', $product_id);
    
    if($delete_stmt->execute()) {
        // Delete product image if exists
        if(!empty($product['image_url'])) {
            $image_path = '../assets/images/' . $product['image_url'];
            if(file_exists($image_path)) {
                unlink($image_path);
            }
        }
        
        $_SESSION['admin_message'] = [
            'type' => 'success',
            'text' => 'Product has been deleted successfully.'
        ];
    } else {
        $_SESSION['admin_message'] = [
            'type' => 'error',
            'text' => 'Failed to delete product.'
        ];
    }
    
    header('Location: products.php');
    exit();
}

// Initialize variables
$result = null;
$total_pages = 1;

// Pagination
$current_page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$items_per_page = 10;
$offset = ($current_page - 1) * $items_per_page;

// Filters
$search = isset($_GET['search']) ? sanitize($_GET['search']) : '';
$category = isset($_GET['category']) ? sanitize($_GET['category']) : '';
$brand = isset($_GET['brand']) ? sanitize($_GET['brand']) : '';
$featured = isset($_GET['featured']) ? (int)$_GET['featured'] : -1; // -1 means all

// Build query
$where_clauses = [];
$params = [];
$param_types = '';

if(!empty($search)) {
    $where_clauses[] = "(name LIKE ? OR description LIKE ? OR brand LIKE ?)";
    $search_param = "%$search%";
    $params[] = $search_param;
    $params[] = $search_param;
    $params[] = $search_param;
    $param_types .= 'sss';
}

if(!empty($category)) {
    $where_clauses[] = "category = ?";
    $params[] = $category;
    $param_types .= 's';
}

if(!empty($brand)) {
    $where_clauses[] = "brand = ?";
    $params[] = $brand;
    $param_types .= 's';
}

if($featured >= 0) {
    $where_clauses[] = "is_featured = ?";
    $params[] = $featured;
    $param_types .= 'i';
}

$where_sql = empty($where_clauses) ? "" : " WHERE " . implode(' AND ', $where_clauses);

// Count total products for pagination
$count_sql = "SELECT COUNT(*) as total FROM products" . $where_sql;
$count_stmt = $conn->prepare($count_sql);

if(!empty($params)) {
    $count_stmt->bind_param($param_types, ...$params);
}

$count_stmt->execute();
$count_result = $count_stmt->get_result();
$total_products = $count_result->fetch_assoc()['total'];
$total_pages = ceil($total_products / $items_per_page);

// Get products with pagination
$sql = "SELECT * FROM products" . $where_sql . " ORDER BY id DESC LIMIT ?, ?";
$stmt = $conn->prepare($sql);

// Add pagination parameters
$params[] = $offset;
$params[] = $items_per_page;
$param_types .= 'ii';

$stmt->bind_param($param_types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

// Get all categories for filter
$categories_sql = "SELECT DISTINCT category FROM products ORDER BY category";
$categories_result = $conn->query($categories_sql);

// Get all brands for filter
$brands_sql = "SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL ORDER BY brand";
$brands_result = $conn->query($brands_sql);

include 'includes/header.php';
?>

<div class="content">
    <div class="content-header">
        <div class="content-title">
            <h1><i class="fas fa-box"></i> Products</h1>
            <p>Manage your products inventory</p>
        </div>
        <div class="content-options">
            <a href="add_product.php" class="btn primary-btn">
                <i class="fas fa-plus"></i> Add New Product
            </a>
        </div>
    </div>
    
    <div class="card">
        <div class="card-body">
            <form class="filters-form" action="products.php" method="get">
                <div class="form-group">
                    <input type="text" name="search" placeholder="Search products..." value="<?php echo htmlspecialchars($search); ?>">
                    <button type="submit" class="btn primary-btn">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                
                <div class="form-group">
                    <select name="category" onchange="this.form.submit()">
                        <option value="">All Categories</option>
                        <?php while($cat = $categories_result->fetch_assoc()): ?>
                            <option value="<?php echo htmlspecialchars($cat['category']); ?>" <?php if($category == $cat['category']) echo 'selected'; ?>>
                                <?php echo ucfirst(htmlspecialchars($cat['category'])); ?>
                            </option>
                        <?php endwhile; ?>
                    </select>
                </div>
                
                <div class="form-group">
                    <select name="brand" onchange="this.form.submit()">
                        <option value="">All Brands</option>
                        <?php while($br = $brands_result->fetch_assoc()): ?>
                            <option value="<?php echo htmlspecialchars($br['brand']); ?>" <?php if($brand == $br['brand']) echo 'selected'; ?>>
                                <?php echo ucfirst(htmlspecialchars($br['brand'])); ?>
                            </option>
                        <?php endwhile; ?>
                    </select>
                </div>
                
                <div class="form-group">
                    <select name="featured" onchange="this.form.submit()">
                        <option value="-1" <?php if($featured == -1) echo 'selected'; ?>>All Products</option>
                        <option value="1" <?php if($featured == 1) echo 'selected'; ?>>Featured Only</option>
                        <option value="0" <?php if($featured == 0) echo 'selected'; ?>>Non-Featured Only</option>
                    </select>
                </div>
                
                <?php if(!empty($search) || !empty($category) || !empty($brand) || $featured >= 0): ?>
                    <a href="products.php" class="btn secondary-btn">
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
        <table class="table products-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Featured</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if($result && $result->num_rows > 0): ?>
                    <?php while($product = $result->fetch_assoc()): ?>
                        <tr>
                            <td><?php echo $product['id']; ?></td>
                            <td>
                                <div class="product-image" style="width: 50px; height: 50px; overflow: hidden;">
                                    <?php if(!empty($product['image_url'])): ?>
                                        <img src="../assets/images/<?php echo htmlspecialchars($product['image_url']); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>" style="width: 100%; height: 100%; object-fit: cover;">
                                    <?php else: ?>
                                        <div class="no-image" style="width: 100%; height: 100%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 12px;">No Image</div>
                                    <?php endif; ?>
                                </div>
                            </td>
                            <td>
                                <div class="product-name">
                                    <?php echo htmlspecialchars($product['name']); ?>
                                </div>
                                <?php if(!empty($product['brand'])): ?>
                                    <div class="product-brand" style="color: #777; font-size: 12px;"><?php echo htmlspecialchars($product['brand']); ?></div>
                                <?php endif; ?>
                                <?php if(!empty($product['deal_type'])): ?>
                                    <div class="product-deal-type" style="color: #0052cc; font-size: 11px; margin-top: 3px;">
                                        <i class="fas fa-tag"></i> <?php echo htmlspecialchars(str_replace('-', ' ', ucfirst($product['deal_type']))); ?>
                                    </div>
                                <?php endif; ?>
                            </td>
                            <td><?php echo htmlspecialchars(ucfirst($product['category'] ?? 'N/A')); ?></td>
                            <td>
                                <div class="product-price">৳<?php echo number_format($product['price']); ?></div>
                                <?php if(!empty($product['old_price'])): ?>
                                    <div class="product-old-price" style="text-decoration: line-through; color: #777; font-size: 12px;">৳<?php echo number_format($product['old_price']); ?></div>
                                <?php endif; ?>
                            </td>
                            <td>
                                <span class="status-badge <?php echo $product['stock_quantity'] > 0 ? 'confirmed' : 'cancelled'; ?>">
                                    <?php echo $product['stock_quantity'] > 0 ? $product['stock_quantity'] : 'Out of stock'; ?>
                                </span>
                            </td>
                            <td>
                                <span class="status-badge <?php echo $product['is_featured'] ? 'delivered' : 'processing'; ?>">
                                    <?php echo $product['is_featured'] ? 'Featured' : 'Not Featured'; ?>
                                </span>
                            </td>
                            <td>
                                <div class="action-buttons" style="display: flex; gap: 5px;">
                                    <a href="edit_product.php?id=<?php echo $product['id']; ?>" class="btn primary-btn" style="padding: 5px 10px;" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <button type="button" onclick="confirmDelete(<?php echo $product['id']; ?>, '<?php echo addslashes($product['name']); ?>')" class="btn danger-btn" style="padding: 5px 10px;" title="Delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="8" class="no-data">No products found.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    
    <?php if($total_pages > 1): ?>
        <div class="pagination">
            <?php if($current_page > 1): ?>
                <a href="?page=<?php echo $current_page - 1; ?><?php if(!empty($search)) echo '&search=' . urlencode($search); ?><?php if(!empty($category)) echo '&category=' . urlencode($category); ?><?php if(!empty($brand)) echo '&brand=' . urlencode($brand); ?><?php if($featured >= 0) echo '&featured=' . $featured; ?>" class="page-link">
                    <i class="fas fa-chevron-left"></i> Previous
                </a>
            <?php endif; ?>
            
            <?php
            // Show limited page numbers with ellipsis
            $start_page = max(1, $current_page - 2);
            $end_page = min($total_pages, $current_page + 2);
            
            if($start_page > 1) {
                echo '<a href="?page=1' . 
                    (!empty($search) ? '&search=' . urlencode($search) : '') . 
                    (!empty($category) ? '&category=' . urlencode($category) : '') . 
                    (!empty($brand) ? '&brand=' . urlencode($brand) : '') . 
                    ($featured >= 0 ? '&featured=' . $featured : '') . 
                    '" class="page-link">1</a>';
                if($start_page > 2) {
                    echo '<span class="ellipsis">...</span>';
                }
            }
            
            for($i = $start_page; $i <= $end_page; $i++) {
                echo '<a href="?page=' . $i . 
                    (!empty($search) ? '&search=' . urlencode($search) : '') . 
                    (!empty($category) ? '&category=' . urlencode($category) : '') . 
                    (!empty($brand) ? '&brand=' . urlencode($brand) : '') . 
                    ($featured >= 0 ? '&featured=' . $featured : '') . 
                    '" class="page-link ' . ($i == $current_page ? 'active' : '') . '">' . $i . '</a>';
            }
            
            if($end_page < $total_pages) {
                if($end_page < $total_pages - 1) {
                    echo '<span class="ellipsis">...</span>';
                }
                echo '<a href="?page=' . $total_pages . 
                    (!empty($search) ? '&search=' . urlencode($search) : '') . 
                    (!empty($category) ? '&category=' . urlencode($category) : '') . 
                    (!empty($brand) ? '&brand=' . urlencode($brand) : '') . 
                    ($featured >= 0 ? '&featured=' . $featured : '') . 
                    '" class="page-link">' . $total_pages . '</a>';
            }
            ?>
            
            <?php if($current_page < $total_pages): ?>
                <a href="?page=<?php echo $current_page + 1; ?><?php if(!empty($search)) echo '&search=' . urlencode($search); ?><?php if(!empty($category)) echo '&category=' . urlencode($category); ?><?php if(!empty($brand)) echo '&brand=' . urlencode($brand); ?><?php if($featured >= 0) echo '&featured=' . $featured; ?>" class="page-link">
                    Next <i class="fas fa-chevron-right"></i>
                </a>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal" id="deleteModal">
    <div class="modal-content" style="max-width: 400px;">
        <div class="modal-header">
            <h3><i class="fas fa-trash"></i> Delete Product</h3>
            <button type="button" class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <p>Are you sure you want to delete the product <strong id="productName"></strong>?</p>
            <p class="warning"><i class="fas fa-exclamation-triangle"></i> This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn secondary-btn cancel-btn">Cancel</button>
            <a href="#" id="deleteLink" class="btn danger-btn">Delete</a>
        </div>
    </div>
</div>

<script>
function confirmDelete(id, name) {
    document.getElementById('productName').textContent = name;
    document.getElementById('deleteLink').href = 'products.php?action=delete&id=' + id;
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