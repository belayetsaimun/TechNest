<?php
// Include required files
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/functions.php';

// Check for "remember me" cookies
if (!isLoggedIn() && isset($_COOKIE['user_id']) && isset($_COOKIE['remember_token'])) {
    $userId = $_COOKIE['user_id'];
    $token = $_COOKIE['remember_token'];
    
    $query = "SELECT * FROM users WHERE id = '$userId' AND remember_token = '$token'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) === 1) {
        $user = mysqli_fetch_assoc($result);
        
        // Set session variables
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
    }
}
?>