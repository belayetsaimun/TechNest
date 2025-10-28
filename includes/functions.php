<?php
require_once __DIR__ . '/config.php';

/**
 * Sanitize input data to prevent XSS attacks
 * * @param string $data Input data
 * @return string Sanitized data
 */
function sanitize($data) {
    global $conn;
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    $data = mysqli_real_escape_string($conn, $data);
    return $data;
}

/**
 * Validate an email address
 * * @param string $email Email to validate
 * @return bool True if valid, false otherwise
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Check if email already exists in database
 * * @param string $email Email to check
 * @return bool True if exists, false otherwise
 */
function emailExists($email) {
    global $conn;
    $email = sanitize($email);
    
    $query = "SELECT id FROM users WHERE email = '$email'";
    $result = mysqli_query($conn, $query);
    
    return mysqli_num_rows($result) > 0;
}

/**
 * Redirect to a specific page
 * * @param string $page Page to redirect to
 * @return void
 */
function redirect($page) {
    // Check if it's already a full URL
    if (strpos($page, 'http://') === 0 || strpos($page, 'https://') === 0) {
        header("Location: " . $page);
    } else {
        // Make sure the BASE_URL is properly defined and accessible here
        header("Location: " . BASE_URL . $page);
    }
    exit();
}

/**
 * Check if user is logged in
 * * @return bool True if logged in, false otherwise
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

/**
 * Get current user data if logged in
 * * @return array|bool User data array or false if not logged in
 */
function getCurrentUser() {
    if (!isLoggedIn()) {
        return false;
    }
    
    global $conn;
    $id = $_SESSION['user_id'];
    
    $query = "SELECT id, name, email, created_at FROM users WHERE id = '$id'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) > 0) {
        return mysqli_fetch_assoc($result);
    }
    
    return false;
}

/**
 * Generate a random token
 * * @param int $length Token length
 * @return string Random token
 */
function generateToken($length = 32) {
    return bin2hex(random_bytes($length));
}

/**
 * Display flash messages
 * * @return void
 */
function displayFlashMessages() {
    if (isset($_SESSION['success'])) {
        // Use a new class 'flow-notification' to avoid conflicting with toast popups
        echo '<div class="flow-notification success">' . $_SESSION['success'] . '</div>';
        unset($_SESSION['success']);
    }
    
    if (isset($_SESSION['error'])) {
        // Use the new class here as well
        echo '<div class="flow-notification error">' . $_SESSION['error'] . '</div>';
        unset($_SESSION['error']);
    }
}
?>