<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

// Ensure the user is logged in
if (!isLoggedIn()) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'You must be logged in to place an order.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Start a database transaction for safety
    mysqli_begin_transaction($conn);

    try {
        // 1. Sanitize all inputs, providing default empty strings for optional fields
        $user_id = $_SESSION['user_id'];
        $name = sanitize($_POST['name'] ?? '');
        $email = sanitize($_POST['email'] ?? '');
        $phone = sanitize($_POST['phone'] ?? '');
        $address = sanitize($_POST['address'] ?? '');
        $city = sanitize($_POST['city'] ?? '');
        $zipcode = sanitize($_POST['zipcode'] ?? '');
        $payment_method = sanitize($_POST['payment_method'] ?? 'cod'); // Default to 'cod'
        
        // Retrieve and validate cart items sent from JavaScript
        $cart_items = json_decode($_POST['cart_items'] ?? '[]', true);
        if (empty($cart_items) || !is_array($cart_items)) {
            throw new Exception("Your cart is empty or the data is invalid.");
        }
        
        // 2. Calculate total amount on the server-side for security
        $subtotal = 0;
        foreach ($cart_items as $item) {
            $subtotal += floatval($item['price']) * intval($item['quantity']);
        }
        
        // [FIX] Correctly calculate delivery fee based on subtotal
        $delivery_fee = ($subtotal > 50000) ? 0 : 60;
        $total_amount = $subtotal + $delivery_fee;

        // 3. Insert the main order into the 'orders' table using prepared statements
        // [FIX] Simplified query to match your current form fields
        $order_sql = "INSERT INTO orders (user_id, name, email, phone, address, city, zipcode, total_amount, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt_order = mysqli_prepare($conn, $order_sql);
        
        // [FIX] Corrected the data types string to "issssssds"
        mysqli_stmt_bind_param($stmt_order, "issssssds", $user_id, $name, $email, $phone, $address, $city, $zipcode, $total_amount, $payment_method);
        
        if (!mysqli_stmt_execute($stmt_order)) {
             throw new Exception("Database error: Failed to create order record.");
        }
        
        $order_id = mysqli_insert_id($conn);
        if (!$order_id) {
            throw new Exception("Failed to retrieve new order ID.");
        }

        // 4. Insert each item from the cart into the 'order_items' table
        $item_sql = "INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)";
        $stmt_item = mysqli_prepare($conn, $item_sql);
        
        foreach ($cart_items as $item) {
            $product_id = intval($item['id']);
            $product_name = $item['name'];
            $quantity = intval($item['quantity']);
            $price = floatval($item['price']);
            mysqli_stmt_bind_param($stmt_item, "iisid", $order_id, $product_id, $product_name, $quantity, $price);
            mysqli_stmt_execute($stmt_item);
        }

        // If everything was successful, commit the database changes
        mysqli_commit($conn);

        // 5. Send a success response back to JavaScript
        header('Content-Type: application/json');
        echo json_encode(['status' => 'success', 'order_id' => $order_id]);
        exit();

    } catch (Exception $e) {
        // If anything failed, roll back all database changes
        mysqli_rollback($conn);
        // Send a specific error response
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit();
    }
} else {
    // Redirect if someone accesses this file directly
    redirect('index.php');
}
?>