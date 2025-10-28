<?php
$active_page = 'account';
$page_css = 'auth.css';
$page_js = 'auth.js';

// Include header from parent directory
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/auth.php';

// Check for token
if (!isset($_GET['token']) || empty($_GET['token'])) {
    $_SESSION['error'] = "Invalid password reset link";
    redirect('login.php');
    exit();
}

$token = sanitize($_GET['token']);
$valid = false;
$user_id = null;
$email = null;

// Verify token
global $conn;
$now = date('Y-m-d H:i:s');
$query = "SELECT id, email FROM users WHERE reset_token = '$token' AND reset_token_expires > '$now'";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) === 1) {
    $user = mysqli_fetch_assoc($result);
    $valid = true;
    $user_id = $user['id'];
    $email = $user['email'];
} else {
    $_SESSION['error'] = "Your password reset link is invalid or has expired";
    redirect('login.php');
    exit();
}

// Process password reset form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['reset_password'])) {
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Validate passwords
    if (empty($password) || empty($confirm_password)) {
        $_SESSION['error'] = "Please fill in all required fields";
    } elseif (strlen($password) < 8) {
        $_SESSION['error'] = "Password must be at least 8 characters long";
    } elseif ($password !== $confirm_password) {
        $_SESSION['error'] = "Passwords do not match";
    } else {
        // Hash the new password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Update password and clear reset tokens
        $updateQuery = "UPDATE users SET 
                       password = '$hashed_password',
                       reset_token = NULL,
                       reset_token_expires = NULL
                       WHERE id = $user_id";
                       
        if (mysqli_query($conn, $updateQuery)) {
            $_SESSION['success'] = "Your password has been reset successfully! You can now login with your new password.";
            redirect('login.php');
            exit();
        } else {
            $_SESSION['error'] = "Failed to update password: " . mysqli_error($conn);
        }
    }
}

// Set the title
$title = "Reset Password - TechNest";

// Include the header
include '../includes/header.php';
?>

<!-- Main Reset Password Content -->
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
                        <h2>Create New Password</h2>
                        <p>Choose a strong, secure password for your TechNest account.</p>
                        <div class="auth-features">
                            <div class="auth-feature">
                                <i class="fas fa-shield-alt"></i>
                                <span>Secure process</span>
                            </div>
                            <div class="auth-feature">
                                <i class="fas fa-lock"></i>
                                <span>Encrypted storage</span>
                            </div>
                            <div class="auth-feature">
                                <i class="fas fa-key"></i>
                                <span>Strong password</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="auth-panel-right">
                <div class="auth-forms">
                    <!-- Reset Password Form -->
                    <form id="reset-password-form" class="auth-form active" method="post" action="reset-password.php?token=<?php echo $token; ?>">
                        <h2>Reset Your Password</h2>
                        <p class="auth-subtitle">Create a new password for <?php echo htmlspecialchars($email); ?></p>
                        
                        <div class="form-group">
                            <label for="password">New Password</label>
                            <div class="input-group">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="password" name="password" placeholder="Create a strong password" required>
                                <i class="fas fa-eye toggle-password"></i>
                            </div>
                            <div class="password-strength">
                                <span class="strength-label">Password strength:</span>
                                <div class="strength-meter">
                                    <div class="strength-segment"></div>
                                    <div class="strength-segment"></div>
                                    <div class="strength-segment"></div>
                                    <div class="strength-segment"></div>
                                </div>
                                <span class="strength-text">Weak</span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="confirm-password">Confirm New Password</label>
                            <div class="input-group">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="confirm-password" name="confirm_password" placeholder="Confirm your password" required>
                                <i class="fas fa-eye toggle-password"></i>
                            </div>
                        </div>
                        
                        <button type="submit" name="reset_password" class="btn primary-btn auth-btn">
                            <span>Reset Password</span>
                            <i class="fas fa-check-circle"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Password Toggle & Strength JS -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Password toggle functionality
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(function(button) {
        button.style.cursor = 'pointer';
        button.addEventListener('click', function() {
            const inputField = this.parentNode.querySelector('input');
            
            if (inputField) {
                if (inputField.type === 'password') {
                    inputField.type = 'text';
                    this.classList.remove('fa-eye');
                    this.classList.add('fa-eye-slash');
                } else {
                    inputField.type = 'password';
                    this.classList.remove('fa-eye-slash');
                    this.classList.add('fa-eye');
                }
            }
        });
    });
    
    // Password strength meter functionality
    const passwordInput = document.getElementById('password');
    const strengthSegments = document.querySelectorAll('.strength-segment');
    const strengthText = document.querySelector('.strength-text');
    
    if (passwordInput && strengthSegments.length > 0 && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            // Add points for different password criteria
            if (password.length >= 8) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            
            // Set the labels and colors based on strength
            const labels = ['Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
            const colors = ['#ff6b6b', '#ff6b6b', '#ffbb55', '#2ecc71', '#27ae60'];
            
            // Update the text indicator
            strengthText.textContent = labels[strength];
            strengthText.style.color = colors[strength];
            
            // Update the strength meter segments
            strengthSegments.forEach((segment, index) => {
                if (index < strength) {
                    segment.classList.add('active');
                    segment.style.backgroundColor = colors[strength];
                    
                    if (strength === 2) {
                        segment.classList.add('medium');
                        segment.classList.remove('strong');
                    } else if (strength >= 3) {
                        segment.classList.add('strong');
                        segment.classList.remove('medium');
                    }
                } else {
                    segment.classList.remove('active', 'medium', 'strong');
                    segment.style.backgroundColor = '';
                }
            });
        });
    }
});
</script>

<?php include '../includes/footer.php'; ?>