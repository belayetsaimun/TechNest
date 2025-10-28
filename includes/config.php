<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Database connection constants
define('DB_HOST', 'localhost');  
define('DB_USER', 'root');       // Default XAMPP username
define('DB_PASS', '');           // Default XAMPP password is empty
define('DB_NAME', 'technest_db');


// Create database connection
$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Set character set to UTF8
mysqli_set_charset($conn, "utf8");

// Base URL for your website - make sure this is correct
define('BASE_URL', 'http://localhost/technest/');
?>