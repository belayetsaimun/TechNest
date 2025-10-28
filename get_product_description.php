<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $product_id = (int)$_GET['id'];
    
    // Sanitize input
    $product_id = mysqli_real_escape_string($conn, $product_id);
    
    // Query to get product description
    $sql = "SELECT description FROM products WHERE id = '$product_id'";
    $result = mysqli_query($conn, $sql);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $product = mysqli_fetch_assoc($result);
        
        // Return description as JSON
        header('Content-Type: application/json');
        echo json_encode(['description' => $product['description']]);
    } else {
        // Product not found
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Product not found']);
    }
} else {
    // Invalid ID parameter
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid product ID']);
}
?>