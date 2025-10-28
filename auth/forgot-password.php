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

// Process forgot password form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitize($_POST['email']);
    
    // Validate email
    if (empty($email)) {
        $_SESSION['error'] = "Please enter your email address";
    } elseif (!validateEmail($email)) {
        $_SESSION['error'] = "Please enter a valid email address";
    } else {
        // Check if email exists in the database
        global $conn;
        $query = "SELECT * FROM users WHERE email = '$email'";
        $result = mysqli_query($conn, $query);
        
        if (mysqli_num_rows($result) === 1) {
            $user = mysqli_fetch_assoc($result);
            
            // Generate password reset token
            $token = bin2hex(random_bytes(32));
            $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));
            
            // Store token in database
            $updateQuery = "UPDATE users SET 
                           reset_token = '$token', 
                           reset_token_expires = '$expires' 
                           WHERE email = '$email'";
                           
            if (mysqli_query($conn, $updateQuery)) {
                // Construct the reset link
                $resetLink = BASE_URL . "auth/reset-password.php?token=" . $token;
                
                // In a real application, send an email with the reset link
                // For this example, we'll just show the link in a success message
                $_SESSION['success'] = "Password reset link has been sent to your email address. 
                                      <br><small>For demo purposes, here is your reset link: 
                                      <a href='$resetLink'>Reset Password</a></small>";
                
                // Redirect to login page
                redirect('login.php');
                exit();
            } else {
                $_SESSION['error'] = "Failed to process password reset request: " . mysqli_error($conn);
            }
        } else {
            // Don't reveal if email exists or not for security reasons
            $_SESSION['success'] = "If your email exists in our system, you will receive a password reset link.";
            redirect('login.php');
            exit();
        }
    }
}

// Set the title
$title = "Forgot Password - TechNest";

// Include the header
include '../includes/header.php';
?>

<!-- Main Forgot Password Content -->
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
                        <h2>Password Recovery</h2>
                        <p>Enter your email address below to reset your password.</p>
                        <div class="auth-features">
                            <div class="auth-feature">
                                <i class="fas fa-shield-alt"></i>
                                <span>Secure recovery</span>
                            </div>
                            <div class="auth-feature">
                                <i class="fas fa-envelope"></i>
                                <span>Email verification</span>
                            </div>
                            <div class="auth-feature">
                                <i class="fas fa-key"></i>
                                <span>Create new password</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="auth-panel-right">
                <div class="auth-forms">
                    <!-- Forgot Password Form -->
                    <form id="forgot-password-form" class="auth-form active" method="post" action="forgot-password.php">
                        <h2>Forgot Password</h2>
                        <p class="auth-subtitle">Enter your email to receive a password reset link</p>
                        
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <div class="input-group">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="email" name="email" placeholder="Your email address" required>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn primary-btn auth-btn">
                            <span>Send Reset Link</span>
                            <i class="fas fa-paper-plane"></i>
                        </button>
                        
                        <div class="auth-links">
                            <a href="login.php" class="auth-link">
                                <i class="fas fa-arrow-left"></i> Back to Login
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<?php include '../includes/footer.php'; ?>