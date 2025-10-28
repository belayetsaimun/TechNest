<?php
// If someone tries to access auth/index.html (which gets routed to index.php)
require_once '../includes/config.php';
require_once '../includes/functions.php';

// Redirect to login page with an error message
$_SESSION['error'] = "Page not found. You've been redirected to the login page.";
header("Location: " . BASE_URL . "auth/login.php");
exit();
?>