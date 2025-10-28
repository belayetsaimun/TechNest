<?php
session_start();
require_once '../includes/config.php';
require_once '../includes/functions.php';

// Check if admin is already logged in
if(isset($_SESSION['admin_id'])) {
    header('Location: dashboard.php');
    exit();
}

$error = '';

// Process login form
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = sanitize($_POST['username']);
    $password = $_POST['password'];
    
    // Validate input
    if(empty($username) || empty($password)) {
        $error = 'Please enter both username and password';
    } else {
        // Query for admin user
        $sql = "SELECT * FROM admin_users WHERE username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows === 1) {
            $admin = $result->fetch_assoc();
            // Verify password
            if(password_verify($password, $admin['password'])) {
                // Set admin session
                $_SESSION['admin_id'] = $admin['id'];
                $_SESSION['admin_username'] = $admin['username'];
                $_SESSION['admin_name'] = $admin['name'];
                
                // Update last login time
                $update_sql = "UPDATE admin_users SET last_login = NOW() WHERE id = ?";
                $update_stmt = $conn->prepare($update_sql);
                $update_stmt->bind_param('i', $admin['id']);
                $update_stmt->execute();
                
                // Redirect to dashboard
                header('Location: dashboard.php');
                exit();
            } else {
                $error = 'Invalid username or password';
            }
        } else {
            $error = 'Invalid username or password';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechNest Admin - Login</title>
    <link rel="stylesheet" href="../assets/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --primary-color: #0052cc;
            --secondary-color: #ff6b6b;
            --accent-color: #00b8d4;
            --dark-color: #333;
            --light-color: #f8f9fa;
            --text-color: #444;
            --text-light: #777;
            --border-color: #e0e0e0;
            --success-color: #2ecc71;
            --warning-color: #f39c12;
            --danger-color: #e74c3c;
            --background-color: #f5f5f5;
            --card-color: #ffffff;
            --shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        body {
            background-color: var(--background-color);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            font-family: 'Poppins', sans-serif;
        }
        
        .admin-login-container {
            width: 100%;
            max-width: 400px;
            padding: 20px;
        }
        
        .admin-logo {
            height: 40px;
            margin-right: 10px;
        }
        
        .admin-login-card {
            background-color: var(--card-color);
            border-radius: 10px;
            box-shadow: var(--shadow);
            padding: 30px;
            text-align: center;
        }
        
        .admin-login-header {
            margin-bottom: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .admin-login-header h1 {
            font-size: 24px;
            color: var(--dark-color);
            margin-top: 15px;
        }
        
        .alert {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
            display: flex;
            align-items: center;
        }
        
        .alert-danger {
            background-color: #ffeaea;
            color: var(--danger-color);
            border-left: 4px solid var(--danger-color);
        }
        
        .alert i {
            margin-right: 10px;
            font-size: 18px;
        }
        
        .admin-login-form .form-group {
            margin-bottom: 20px;
            text-align: left;
        }
        
        .admin-login-form label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text-color);
        }
        
        .admin-login-form input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid var(--border-color);
            border-radius: 5px;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
        }
        
        .admin-login-form input:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.1);
        }
        
        .admin-login-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, var(--primary-color), #0066cc);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .admin-login-btn:hover {
            background: linear-gradient(135deg, #0066cc, var(--primary-color));
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 82, 204, 0.3);
        }
        
        .admin-login-btn i {
            margin-right: 8px;
        }
        
        .admin-login-footer {
            margin-top: 25px;
            color: var(--text-light);
            font-size: 14px;
        }
        
        .admin-login-footer p {
            margin-bottom: 15px;
        }
        
        .admin-login-footer a {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .admin-login-footer a:hover {
            text-decoration: underline;
        }
        
        /* Logo styles */
        .logo-text {
            display: flex;
            align-items: center;
            position: relative;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -1px;
            text-transform: uppercase;
        }
        
        .tech {
            color: var(--dark-color);
        }
        
        .nest {
            color: var(--primary-color);
        }
        
        .bolt-icon {
            position: absolute;
            top: -5px;
            left: -15px;
            font-size: 18px;
            color: var(--primary-color);
            transform: rotate(20deg);
        }
    </style>
</head>
<body>
    <div class="admin-login-container">
        <div class="admin-login-card">
            <div class="admin-login-header">
                <div class="logo-text">
                    <div class="bolt-icon"><i class="fas fa-bolt"></i></div>
                    <span class="tech">Tech</span><span class="nest">Nest</span>
                </div>
                <h1>Admin Dashboard</h1>
            </div>
            
            <?php if(!empty($error)): ?>
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i> <?php echo $error; ?>
            </div>
            <?php endif; ?>
            
            <form class="admin-login-form" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
                <div class="form-group">
                    <label for="username"><i class="fas fa-user"></i> Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="password"><i class="fas fa-lock"></i> Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit" class="admin-login-btn">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
            </form>
            
            <div class="admin-login-footer">
                <p><i class="fas fa-shield-alt"></i> Secure Administrator Access Only</p>
                <a href="../index.php">Return to Website</a>
            </div>
        </div>
    </div>
</body>

</html>