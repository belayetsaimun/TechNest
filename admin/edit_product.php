<?php
require_once 'auth_check.php';
require_once '../includes/config.php';
require_once '../includes/functions.php';

$page_title = "Edit Product";

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if product ID is provided
if(!isset($_GET['id']) || empty($_GET['id'])) {
    $_SESSION['admin_message'] = [
        'type' => 'error',
        'text' => 'Product ID is required.'
    ];
    header('Location: products.php');
    exit();
}

$product_id = (int) $_GET['id'];

// Get product details
$sql = "SELECT * FROM products WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $product_id);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows == 0) {
    $_SESSION['admin_message'] = [
        'type' => 'error',
        'text' => 'Product not found.'
    ];
    header('Location: products.php');
    exit();
}

$product = $result->fetch_assoc();

$categories = [
    'phones', 'laptops', 'tablets', 'smartwatches', 'headphones', 
    'earbuds', 'cameras', 'gaming', 'accessories'
];

$brands = [
    'apple', 'samsung', 'sony', 'google', 'dell', 
    'lg', 'canon', 'logitech', 'anker', 'nintendo'
];

// Process form submission
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Uncomment to debug submission data
    // echo "<pre>Form Data: "; print_r($_POST); echo "</pre>"; exit;
    
    $name = sanitize($_POST['name']);
    $description = sanitize($_POST['description']);
    $price = (float) $_POST['price'];
    $old_price = !empty($_POST['old_price']) ? (float) $_POST['old_price'] : NULL;
    $category = sanitize($_POST['category']);
    $brand = sanitize($_POST['brand']);
    $features = sanitize($_POST['features']);
    $available_colors = sanitize($_POST['available_colors']);
    $stock_quantity = (int) $_POST['stock_quantity'];
    $is_featured = isset($_POST['is_featured']) ? 1 : 0;
    $deal_type = isset($_POST['deal_type']) ? $_POST['deal_type'] : '';
    $deal_expires = !empty($_POST['deal_expires']) ? $_POST['deal_expires'] : NULL;
    $progress_claimed = !empty($_POST['progress_claimed']) ? (int) $_POST['progress_claimed'] : NULL;
    
    // Image upload handling
    $image_url = $product['image_url']; // Keep existing image as default
    
    if(isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/webp'];
        $max_size = 2 * 1024 * 1024; // 2MB
        
        if(in_array($_FILES['image']['type'], $allowed_types) && $_FILES['image']['size'] <= $max_size) {
            $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
            $new_filename = uniqid('product_') . '.' . $file_extension;
            $upload_path = '../assets/images/' . $new_filename;
            
            if(move_uploaded_file($_FILES['image']['tmp_name'], $upload_path)) {
                // Delete old image if exists
                if(!empty($product['image_url'])) {
                    $old_image_path = '../assets/images/' . $product['image_url'];
                    if(file_exists($old_image_path)) {
                        unlink($old_image_path);
                    }
                }
                
                $image_url = $new_filename;
            } else {
                $upload_error = "Failed to upload image. Please try again.";
            }
        } else {
            $upload_error = "Invalid image. Please select a JPEG, PNG or WebP file under 2MB.";
        }
    }
    
    // Validate required fields
    $errors = [];
    if(empty($name)) {
        $errors[] = "Product name is required.";
    }
    if(empty($price) || $price <= 0) {
        $errors[] = "Valid price is required.";
    }
    if(empty($category)) {
        $errors[] = "Category is required.";
    }
    if(isset($upload_error)) {
        $errors[] = $upload_error;
    }
    
    if(empty($errors)) {
        // Direct query approach for debugging
        try {
            // First try to update with direct query for the deal_type
            $update_deal_sql = "UPDATE products SET deal_type = ? WHERE id = ?";
            $update_deal_stmt = $conn->prepare($update_deal_sql);
            $update_deal_stmt->bind_param("si", $deal_type, $product_id);
            $deal_update_result = $update_deal_stmt->execute();
            
            // Now update the rest of the product info
            $sql = "UPDATE products SET 
                    name = ?, 
                    description = ?, 
                    price = ?, 
                    old_price = ?, 
                    category = ?, 
                    brand = ?, 
                    image_url = ?, 
                    features = ?, 
                    available_colors = ?, 
                    stock_quantity = ?, 
                    is_featured = ?, 
                    deal_expires = ?, 
                    progress_claimed = ? 
                    WHERE id = ?";
            
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssddsssssiisii", 
                            $name, 
                            $description, 
                            $price, 
                            $old_price, 
                            $category, 
                            $brand, 
                            $image_url, 
                            $features, 
                            $available_colors, 
                            $stock_quantity, 
                            $is_featured,  
                            $deal_expires, 
                            $progress_claimed, 
                            $product_id);
            
            if($stmt->execute()) {
                $_SESSION['admin_message'] = [
                    'type' => 'success',
                    'text' => "Product \"$name\" has been updated successfully."
                ];
                header("Location: products.php");
                exit();
            } else {
                $errors[] = "Error updating product: " . $stmt->error;
            }
        } catch (Exception $e) {
            $errors[] = "Database error: " . $e->getMessage();
        }
    }
}

include 'includes/header.php';
?>

<style>
.form-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
}

.form-section {
    background-color: var(--card-color);
    border-radius: 10px;
    box-shadow: var(--shadow);
    padding: 20px;
    margin-bottom: 20px;
}

.form-section h3 {
    font-size: 16px;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
}

.form-section h3 i {
    margin-right: 10px;
    color: var(--primary-color);
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
}

.form-group label .required {
    color: var(--danger-color);
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="datetime-local"],
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 10px 15px;
    border-radius: 5px;
    border: 1px solid var(--border-color);
    background-color: var(--card-color);
    color: var(--text-color);
    font-size: 14px;
    transition: all 0.3s ease;
}

.form-group input[type="text"]:focus,
.form-group input[type="number"]:focus,
.form-group input[type="datetime-local"]:focus,
.form-group textarea:focus,
.form-group select:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.1);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.help-text {
    display: block;
    font-size: 12px;
    color: var(--text-light);
    margin-top: 5px;
}

.form-check {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.form-check input[type="checkbox"] {
    margin-right: 10px;
}

.image-upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.image-preview {
    width: 180px;
    height: 180px;
    border-radius: 10px;
    border: 2px dashed var(--border-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-light);
    overflow: hidden;
    position: relative;
    background-size: cover;
    background-position: center;
}

.image-preview i {
    font-size: 40px;
    margin-bottom: 10px;
}

.upload-btn {
    background-color: var(--background-color);
    color: var(--text-color);
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
}

.upload-btn:hover {
    background-color: var(--primary-color);
    color: white;
}

.upload-btn input[type="file"] {
    display: none;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 20px;
}

.error-list {
    padding-left: 20px;
    margin-bottom: 0;
}

.error-list li {
    margin-bottom: 5px;
}

.deal-form-group {
    display: none;
}

@media (max-width: 992px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
        gap: 10px;
    }
}
</style>

<div class="product-form-container">
    <?php if(!empty($errors)): ?>
        <div class="alert alert-error">
            <ul class="error-list">
                <?php foreach($errors as $error): ?>
                    <li><i class="fas fa-exclamation-circle"></i> <?php echo $error; ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>
    
    <form class="product-form" method="post" enctype="multipart/form-data">
        <div class="form-grid">
            <div class="form-main">
                <div class="form-section">
                    <h3><i class="fas fa-info-circle"></i> Basic Information</h3>
                    
                    <div class="form-group">
                        <label for="name">Product Name <span class="required">*</span></label>
                        <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($product['name']); ?>" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" name="description" rows="6"><?php echo htmlspecialchars($product['description'] ?? ''); ?></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="price">Price (৳) <span class="required">*</span></label>
                            <input type="number" id="price" name="price" min="0" step="0.01" value="<?php echo htmlspecialchars($product['price']); ?>" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="old_price">Old Price (৳)</label>
                            <input type="number" id="old_price" name="old_price" min="0" step="0.01" value="<?php echo htmlspecialchars($product['old_price'] ?? ''); ?>">
                            <small class="help-text">Leave empty if there's no discount</small>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-tag"></i> Category & Features</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="category">Category <span class="required">*</span></label>
                            <select id="category" name="category" required>
                                <option value="">Select Category</option>
                                <?php foreach($categories as $cat): ?>
                                    <option value="<?php echo $cat; ?>" <?php if($product['category'] == $cat) echo 'selected'; ?>>
                                        <?php echo ucfirst($cat); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="brand">Brand</label>
                            <select id="brand" name="brand">
                                <option value="">Select Brand</option>
                                <?php foreach($brands as $br): ?>
                                    <option value="<?php echo $br; ?>" <?php if($product['brand'] == $br) echo 'selected'; ?>>
                                        <?php echo ucfirst($br); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="features">Features</label>
                        <input type="text" id="features" name="features" value="<?php echo htmlspecialchars($product['features'] ?? ''); ?>" placeholder="e.g. 4K Display,16GB RAM,512GB SSD">
                        <small class="help-text">Separate features with commas</small>
                    </div>
                </div>

                <div class="form-section">
                    <h3><i class="fas fa-percentage"></i> Deal Information</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="deal_type">Deal Type</label>
                            <select id="deal_type" name="deal_type">
                                <option value="">No Deal</option>
                                <option value="flash-sale" <?php echo ($product['deal_type'] == 'flash-sale') ? 'selected' : ''; ?>>Flash Sale</option>
                                <option value="clearance" <?php echo ($product['deal_type'] == 'clearance') ? 'selected' : ''; ?>>Clearance</option>
                                <option value="special_offer" <?php echo ($product['deal_type'] == 'special_offer') ? 'selected' : ''; ?>>Special Offer</option>
                                <option value="bundle" <?php echo ($product['deal_type'] == 'bundle') ? 'selected' : ''; ?>>Bundle Deal</option>
                                <option value="seasonal" <?php echo ($product['deal_type'] == 'seasonal') ? 'selected' : ''; ?>>Seasonal</option>
                                <option value="limited_edition" <?php echo ($product['deal_type'] == 'limited_edition') ? 'selected' : ''; ?>>Limited Edition</option>
                                <option value="deal-of-the-day" <?php echo ($product['deal_type'] == 'deal-of-the-day') ? 'selected' : ''; ?>>Deal of the Day</option>
                                <option value="weekly" <?php echo ($product['deal_type'] == 'weekly') ? 'selected' : ''; ?>>Weekly Deal</option>
                                <option value="coming-soon" <?php echo ($product['deal_type'] == 'coming-soon') ? 'selected' : ''; ?>>Coming Soon</option>
                            </select>
                            
                            <!-- Hidden debug info - uncomment to see current DB value -->
                            <!-- <small style="color:red">Current DB value: '<?php echo $product['deal_type']; ?>'</small> -->
                            
                            <small class="help-text">Select the type of deal or promotion for this product</small>
                        </div>
                    </div>
                    
                    <div id="dealExtraFields" class="<?php echo empty($product['deal_type']) ? 'deal-form-group' : ''; ?>">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="deal_expires">Deal Expiry Date</label>
                                <input type="datetime-local" id="deal_expires" name="deal_expires" value="<?php echo !empty($product['deal_expires']) ? date('Y-m-d\TH:i', strtotime($product['deal_expires'])) : ''; ?>">
                                <small class="help-text">When will this deal end?</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="progress_claimed">Progress Claimed (%)</label>
                                <input type="number" id="progress_claimed" name="progress_claimed" min="0" max="100" value="<?php echo htmlspecialchars($product['progress_claimed'] ?? ''); ?>">
                                <small class="help-text">Percentage of deal claimed (0-100)</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="form-sidebar">
                <div class="form-section">
                    <h3><i class="fas fa-image"></i> Product Image</h3>
                    
                    <div class="image-upload-container">
                        <div class="image-preview" id="imagePreview" <?php if(!empty($product['image_url'])): ?>style="background-image: url('../assets/images/<?php echo htmlspecialchars($product['image_url']); ?>');"<?php endif; ?>>
                            <?php if(empty($product['image_url'])): ?>
                                <i class="fas fa-image"></i>
                                <span>No image selected</span>
                            <?php endif; ?>
                        </div>
                        
                        <label class="upload-btn">
                            <i class="fas fa-upload"></i> <?php echo !empty($product['image_url']) ? 'Change Image' : 'Choose Image'; ?>
                            <input type="file" name="image" id="imageInput" accept="image/jpeg,image/png,image/webp">
                        </label>
                        
                        <small class="help-text">Maximum size: 2MB. JPEG, PNG or WebP formats only.</small>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-cog"></i> Product Options</h3>
                    
                    <div class="form-group">
                        <label for="available_colors">Available Colors</label>
                        <input type="text" id="available_colors" name="available_colors" value="<?php echo htmlspecialchars($product['available_colors'] ?? 'black,white'); ?>" placeholder="e.g. black,white,red">
                        <small class="help-text">Separate colors with commas</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="stock_quantity">Stock Quantity <span class="required">*</span></label>
                        <input type="number" id="stock_quantity" name="stock_quantity" min="0" value="<?php echo htmlspecialchars($product['stock_quantity']); ?>" required>
                    </div>
                    
                    <div class="form-check">
                        <input type="checkbox" id="is_featured" name="is_featured" value="1" <?php echo $product['is_featured'] ? 'checked' : ''; ?>>
                        <label for="is_featured">Featured Product</label>
                    </div>
                    <small class="help-text">Featured products appear on homepage</small>
                </div>
            </div>
        </div>
        
        <div class="form-actions">
            <a href="products.php" class="btn secondary-btn">
                <i class="fas fa-arrow-left"></i> Cancel
            </a>
            <button type="submit" class="btn primary-btn">
                <i class="fas fa-save"></i> Update Product
            </button>
        </div>
    </form>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Image Preview
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    
    if(imageInput && imagePreview) {
        imageInput.addEventListener('change', function() {
            if(this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    imagePreview.style.backgroundImage = 'url(' + e.target.result + ')';
                    imagePreview.innerHTML = '';
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Toggle deal fields visibility
    const dealTypeSelect = document.getElementById('deal_type');
    const dealExtraFields = document.getElementById('dealExtraFields');
    
    if(dealTypeSelect && dealExtraFields) {
        dealTypeSelect.addEventListener('change', function() {
            if(this.value) {
                dealExtraFields.style.display = 'block';
            } else {
                dealExtraFields.style.display = 'none';
            }
        });
        
        // Initialize on page load
        if(dealTypeSelect.value) {
            dealExtraFields.style.display = 'block';
        }
    }
});
</script>

<?php include 'includes/footer.php'; ?>