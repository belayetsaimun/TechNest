<?php
$active_page = 'account';
$page_css = 'auth.css';
$page_js = 'auth.js'; // We'll keep this for other functionality

// Include header from parent directory
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/auth.php';

// Redirect if already logged in
if (isLoggedIn()) {
    redirect('login.php');
}

// Process registration form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = sanitize($_POST['name']);
    $email = sanitize($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $terms = isset($_POST['terms']) ? true : false;
    
    // Validate form data
    if (empty($name) || empty($email) || empty($password) || empty($confirm_password)) {
        $_SESSION['error'] = "Please fill in all required fields";
    } elseif (!validateEmail($email)) {
        $_SESSION['error'] = "Please enter a valid email address";
    } elseif (strlen($password) < 8) {
        $_SESSION['error'] = "Password must be at least 8 characters long";
    } elseif ($password !== $confirm_password) {
        $_SESSION['error'] = "Passwords do not match";
    } elseif (!$terms) {
        $_SESSION['error'] = "You must agree to the Terms & Conditions";
    } elseif (emailExists($email)) {
        $_SESSION['error'] = "Email address is already registered";
    } else {
        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert user into database
        global $conn;
        $query = "INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$hashed_password')";
        
        if (mysqli_query($conn, $query)) {
            // Registration successful
            $_SESSION['success'] = "Registration successful! Please login with your credentials.";
            
            // Directly use header instead of the redirect function for debugging
            header("Location: " . BASE_URL . "auth/login.php");
            exit();
        } else {
            $_SESSION['error'] = "Registration failed: " . mysqli_error($conn);
        }
    }
}

// Set the title
$title = "Register - TechNest";

// Include the header
include '../includes/header.php';
?>

<!-- Main Registration Content -->
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
                <div class="auth-tabs signup-active"> <!-- Added signup-active class to fix the highlight issue -->
                    <button class="auth-tab" data-target="login-form" onclick="window.location.href='login.php'">
                        <i class="fas fa-sign-in-alt"></i> Sign In
                    </button>
                    <button class="auth-tab active" data-target="signup-form">
                        <i class="fas fa-user-plus"></i> Sign Up
                    </button>
                </div>
                
                <div class="auth-forms">
                    <!-- Signup Form -->
                    <form id="signup-form" class="auth-form active" method="post" action="register.php">
                        <h2>Create Account</h2>
                        <p class="auth-subtitle">Join TechNest for exclusive deals</p>
                        
                        <div class="form-group">
                            <label for="signup-name">Full Name</label>
                            <div class="input-group">
                                <i class="fas fa-user"></i>
                                <input type="text" id="signup-name" name="name" placeholder="Your full name" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="signup-email">Email</label>
                            <div class="input-group">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="signup-email" name="email" placeholder="Your email address" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="signup-password">Password</label>
                            <div class="input-group">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="signup-password" name="password" placeholder="Create a password" required>
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
                            <label for="signup-confirm-password">Confirm Password</label>
                            <div class="input-group">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="signup-confirm-password" name="confirm_password" placeholder="Confirm your password" required>
                                <i class="fas fa-eye toggle-password"></i>
                            </div>
                        </div>
                        
                        <div class="form-options">
                            <div class="remember-me">
                                <input type="checkbox" id="terms" name="terms" required>
                                <label for="terms">I agree to the <a href="#">Terms & Conditions</a></label>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn primary-btn auth-btn">
                            <span>Create Account</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Direct inline scripts for functionality -->
<script>
// Password toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Register page script loaded');
    
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
    
    // Password strength meter functionality - DIRECT IMPLEMENTATION
    const passwordInput = document.getElementById('signup-password');
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
                    
                    // Add classes for medium and strong 
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
        
        console.log('Password strength meter initialized');
    }
});
</script>

<!-- Additional inline CSS for password strength meter -->
<style>
.password-strength {
    margin-top: 12px;
    font-size: 12px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.strength-label {
    color: var(--text-light);
    margin-right: 10px;
}

.strength-meter {
    display: inline-flex;
    width: 120px;
    gap: 5px;
    margin-right: 10px;
}

.strength-segment {
    height: 5px;
    flex: 1;
    background-color: var(--border-color);
    border-radius: 2px;
    transition: all 0.3s ease;
}

.strength-segment.active {
    background-color: #ff6b6b; /* Default is weak (red) */
}

.strength-segment.medium {
    background-color: #ffbb55 !important; /* Medium (orange) */
}

.strength-segment.strong {
    background-color: #2ecc71 !important; /* Strong (green) */
}

.strength-text {
    font-weight: 600;
    color: #ff6b6b; /* Default is weak (red) */
    transition: color 0.3s ease;
}

/* Fix for toggle password button */
.input-group .toggle-password {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer !important;
    z-index: 10;
    pointer-events: auto !important;
}
</style>

<?php include '../includes/footer.php'; ?>