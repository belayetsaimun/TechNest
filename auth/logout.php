<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Remove the remember me cookies if they exist
if (isset($_COOKIE['remember_token'])) {
    setcookie('remember_token', '', time() - 3600, '/');
    setcookie('user_id', '', time() - 3600, '/');
}

// Set a success message before destroying the session
$message = "You have been successfully logged out";

// Destroy session data
session_unset();
session_destroy();

// Start a new session to be able to show the success message
session_start();
$_SESSION['success'] = $message;

// Redirect to login page
header("Location: " . BASE_URL . "auth/login.php");
exit();
?>