<?php
$active_page = 'account';
$page_css = 'auth.css';
$page_js = 'auth.js';
// Include header from parent directory
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/auth.php';

// Redirect if already logged in
if (isLoggedIn()) {
    redirect('profile.php');
}

// Process login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitize($_POST['email']);
    $password = $_POST['password'];
    $remember = isset($_POST['remember']) ? true : false;
    
    // Validate form data
    if (empty($email) || empty($password)) {
        $_SESSION['error'] = "Please fill in all required fields";
    } elseif (!validateEmail($email)) {
        $_SESSION['error'] = "Please enter a valid email address";
    } else {
        // Check if user exists
        global $conn;
        $query = "SELECT * FROM users WHERE email = '$email'";
        $result = mysqli_query($conn, $query);
        
        if (mysqli_num_rows($result) === 1) {
            $user = mysqli_fetch_assoc($result);
            
            // Verify password
            if (password_verify($password, $user['password'])) {
                // Login successful
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['user_email'] = $user['email'];
                
                // Remember me functionality
                if ($remember) {
                    $token = generateToken();
                    $userId = $user['id'];
                    
                    // Update user with remember token
                    $updateQuery = "UPDATE users SET remember_token = '$token' WHERE id = $userId";
                    mysqli_query($conn, $updateQuery);
                    
                    // Set cookie to expire after 30 days
                    setcookie('remember_token', $token, time() + (86400 * 30), '/');
                    setcookie('user_id', $userId, time() + (86400 * 30), '/');
                }
                
                $_SESSION['success'] = "Welcome back, " . $user['name'];
                header("Location: " . BASE_URL . "index.php");
                exit();
            } else {
                $_SESSION['error'] = "Invalid email or password";
            }
        } else {
            $_SESSION['error'] = "Invalid email or password";
        }
    }
}

// Set the title
$title = "Login - TechNest";

// Include the header
include '../includes/header.php';
?>

<!-- Main Login Content -->
<section class="auth-hero">
    <div class="auth-hero-backdrop"></div>
    <div class="auth-container">
        <div class="auth-panel">
            <div class="auth-panel-left">
                <div class="auth-illustration">
                    <div class="auth-illustration-content">
                        <div class="illustration-logo">
                            <div class="logo-text">
                                <div class="bolt-icon"><i class="fas fa-bolt"></i></div>
                                <span class="tech">Tech</span><span class="nest">Nest</span>
                            </div>
                        </div>
                        <h2>Welcome to TechNest</h2>
                        <p>Join our community and discover premium tech gadgets at affordable prices.</p>
                        <div class="auth-features">
                            <div class="auth-feature">
                                <i class="fas fa-shield-alt"></i>
                                <span>Secure checkout</span>
                            </div>
                            <div class="auth-feature">
                                <i class="fas fa-shipping-fast"></i>
                                <span>Fast delivery</span>
                            </div>
                            <div class="auth-feature">
                                <i class="fas fa-undo"></i>
                                <span>Easy returns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="auth-panel-right">
                <div class="auth-tabs">
                    <button class="auth-tab active" data-target="login-form">
                        <i class="fas fa-sign-in-alt"></i> Sign In
                    </button>
                    <button class="auth-tab" data-target="signup-form" onclick="window.location.href='register.php'">
                        <i class="fas fa-user-plus"></i> Sign Up
                    </button>
                </div>
                
                <div class="auth-forms">
                    <!-- Login Form -->
                    <form id="login-form" class="auth-form active" method="post" action="login.php">
                        <h2>Welcome Back</h2>
                        <p class="auth-subtitle">Sign in to access your TechNest account</p>
                        
                        <div class="form-group">
                            <label for="login-email">Email</label>
                            <div class="input-group">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="login-email" name="email" placeholder="Your email address" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <div class="input-group">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="login-password" name="password" placeholder="Your password" required>
                                <i class="fas fa-eye toggle-password"></i>
                            </div>
                        </div>
                        
                        <div class="form-options">
                            <div class="remember-me">
                                <input type="checkbox" id="remember" name="remember">
                                <label for="remember">Remember me</label>
                            </div>
                            <!-- <a href="forgot-password.php" class="forgot-password">Forgot password?</a> -->
                        </div>
                        
                        <button type="submit" class="btn primary-btn auth-btn">
                            <span>Sign In</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        
                        
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Direct password toggle fix -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    console.log('Direct password toggle script loaded');
    
    // Get all password toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    // Add click event to each button
    toggleButtons.forEach(function(button) {
        button.style.cursor = 'pointer'; // Ensure pointer cursor
        button.style.pointerEvents = 'auto'; // Ensure clickable
        
        button.addEventListener('click', function() {
            // Find the input field - it's the previous sibling input
            const inputField = this.parentNode.querySelector('input');
            console.log('Toggle button clicked, found input:', inputField);
            
            if (inputField) {
                // Toggle the input type
                if (inputField.type === 'password') {
                    inputField.type = 'text';
                    this.classList.remove('fa-eye');
                    this.classList.add('fa-eye-slash');
                    console.log('Changed to text');
                } else {
                    inputField.type = 'password';
                    this.classList.remove('fa-eye-slash');
                    this.classList.add('fa-eye');
                    console.log('Changed to password');
                }
            }
        });
    });
});
</script>

<?php include '../includes/footer.php'; ?>