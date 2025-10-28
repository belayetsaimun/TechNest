<?php 
if(!isset($page_title)) {
    $page_title = "Admin Panel";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechNest Admin - <?php echo $page_title; ?></title>
    <link rel="icon" href="<?php echo BASE_URL; ?>assets/images/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="<?php echo BASE_URL; ?>assets/images/favicon.png" type="image/png">
    <link rel="apple-touch-icon" href="<?php echo BASE_URL; ?>assets/images/apple-touch-icon.png">
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
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }
        
        body {
            background-color: var(--background-color);
            color: var(--text-color);
            min-height: 100vh;
            display: flex;
        }
        
        /* Admin Container */
        .admin-container {
            display: flex;
            width: 100%;
        }
        
        /* Sidebar */
        .sidebar {
            width: 250px;
            background-color: var(--dark-color);
            color: white;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            overflow-y: auto;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .sidebar-header {
            padding: 20px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .admin-logo {
            height: 30px;
            margin-right: 10px;
        }
        
        .sidebar-header h2 {
            font-size: 20px;
            color: white;
            margin: 0;
        }
        
        .sidebar-menu {
            padding: 20px 0;
        }
        
        .sidebar-menu ul {
            list-style-type: none;
            padding: 0;
        }
        
        .sidebar-menu ul li {
            margin-bottom: 5px;
        }
        
        .sidebar-menu ul li a {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            transition: all 0.3s ease;
            border-radius: 5px;
            margin: 0 10px;
        }
        
        .sidebar-menu ul li a:hover {
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
        }
        
        .sidebar-menu ul li.active a {
            background-color: var(--primary-color);
            color: white;
        }
        
        .sidebar-menu ul li a i {
            margin-right: 10px;
            width: 20px;
            text-align: center;
        }
        
        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: 250px;
            transition: all 0.3s ease;
            width: calc(100% - 250px);
        }
        
        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background-color: var(--card-color);
            box-shadow: var(--shadow);
            position: sticky;
            top: 0;
            z-index: 900;
        }
        
        .sidebar-toggle {
            background: none;
            border: none;
            color: var(--text-color);
            font-size: 18px;
            cursor: pointer;
            display: none;
        }
        
        .search-box {
            display: flex;
            align-items: center;
            background-color: var(--background-color);
            border-radius: 5px;
            padding: 5px 15px;
            flex: 0 0 300px;
        }
        
        .search-box input {
            border: none;
            background: none;
            outline: none;
            padding: 8px;
            flex: 1;
            color: var(--text-color);
        }
        
        .search-box i {
            color: var(--text-light);
        }
        
        .top-bar-right {
            display: flex;
            align-items: center;
        }
        
        .notifications {
            margin-right: 20px;
            position: relative;
        }
        
        .notification-btn {
            background: none;
            border: none;
            color: var(--text-color);
            font-size: 18px;
            cursor: pointer;
            position: relative;
        }
        
        .badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: var(--secondary-color);
            color: white;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .admin-profile {
            display: flex;
            align-items: center;
            position: relative;
        }
        
        .admin-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
            object-fit: cover;
        }
        
        .admin-info {
            display: flex;
            flex-direction: column;
        }
        
        .admin-name {
            font-weight: 600;
            font-size: 14px;
            color: var(--dark-color);
        }
        
        .admin-role {
            font-size: 12px;
            color: var(--text-light);
        }
        
        .admin-dropdown {
            position: relative;
        }
        
        .dropdown-btn {
            background: none;
            border: none;
            color: var(--text-color);
            cursor: pointer;
            padding: 5px;
        }
        
        .dropdown-content {
            display: none;
            position: absolute;
            right: 0;
            background-color: var(--card-color);
            min-width: 180px;
            box-shadow: var(--shadow);
            border-radius: 5px;
            z-index: 1000;
            padding: 5px 0;
        }
        
        .dropdown-content a {
            display: flex;
            align-items: center;
            padding: 10px 15px;
            color: var(--text-color);
            text-decoration: none;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .dropdown-content a:hover {
            background-color: var(--background-color);
        }
        
        .dropdown-content a i {
            margin-right: 10px;
            width: 18px;
            text-align: center;
        }
        
        .admin-dropdown:hover .dropdown-content {
            display: block;
        }
        
        .content-wrapper {
            padding: 20px;
        }
        
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .page-header h1 {
            font-size: 24px;
            color: var(--dark-color);
        }
        
        .breadcrumb {
            display: flex;
            align-items: center;
            color: var(--text-light);
            font-size: 14px;
        }
        
        .breadcrumb a {
            color: var(--primary-color);
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .breadcrumb a:hover {
            text-decoration: underline;
        }
        
        .breadcrumb .separator {
            margin: 0 10px;
        }
        
        .breadcrumb .current {
            color: var(--text-color);
            font-weight: 500;
        }
        
        .content {
            background-color: var(--card-color);
            border-radius: 5px;
            box-shadow: var(--shadow);
            padding: 20px;
        }
        
        /* Dashboard Stats */
        .dashboard-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background-color: var(--card-color);
            border-radius: 10px;
            box-shadow: var(--shadow);
            padding: 20px;
            display: flex;
            align-items: center;
            overflow: hidden;
            position: relative;
            transition: all 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .stat-icon {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            font-size: 24px;
            margin-right: 15px;
        }
        
        .products-icon {
            background-color: rgba(0, 184, 212, 0.1);
            color: #00b8d4;
        }
        
        .orders-icon {
            background-color: rgba(0, 82, 204, 0.1);
            color: #0052cc;
        }
        
        .revenue-icon {
            background-color: rgba(46, 204, 113, 0.1);
            color: #2ecc71;
        }
        
        .messages-icon {
            background-color: rgba(255, 107, 107, 0.1);
            color: #ff6b6b;
        }
        
        .stat-details {
            flex: 1;
        }
        
        .stat-details h3 {
            font-size: 16px;
            color: var(--text-light);
            margin-bottom: 5px;
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: 700;
            color: var(--dark-color);
            margin-bottom: 5px;
        }
        
        .stat-link {
            display: inline-flex;
            align-items: center;
            color: var(--primary-color);
            font-size: 14px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .stat-link:hover {
            color: var(--accent-color);
        }
        
        .stat-link i {
            margin-left: 5px;
            font-size: 12px;
            transition: transform 0.3s ease;
        }
        
        .stat-link:hover i {
            transform: translateX(3px);
        }
        
        /* Dashboard Widgets */
        .dashboard-widgets {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .widget {
            background-color: var(--card-color);
            border-radius: 10px;
            box-shadow: var(--shadow);
            overflow: hidden;
        }
        
        .widget-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .widget-header h3 {
            font-size: 16px;
            color: var(--dark-color);
            display: flex;
            align-items: center;
        }
        
        .widget-header h3 i {
            margin-right: 10px;
            color: var(--primary-color);
        }
        
        .view-all {
            color: var(--primary-color);
            font-size: 14px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
        }
        
        .view-all i {
            margin-left: 5px;
            font-size: 12px;
            transition: transform 0.3s ease;
        }
        
        .view-all:hover i {
            transform: translateX(3px);
        }
        
        .widget-content {
            padding: 20px;
        }
        
        /* Tables */
        .table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .table th, .table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
            font-size: 14px;
        }
        
        .table th {
            font-weight: 600;
            color: var(--dark-color);
            background-color: var(--background-color);
        }
        
        .table tr:last-child td {
            border-bottom: none;
        }
        
        .table tr:hover td {
            background-color: rgba(0, 0, 0, 0.02);
        }
        
        .status-badge {
            padding: 5px 10px;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 500;
            display: inline-block;
        }
        
        .processing {
            background-color: rgba(255, 193, 7, 0.1);
            color: #ffc107;
        }
        
        .confirmed {
            background-color: rgba(0, 82, 204, 0.1);
            color: #0052cc;
        }
        
        .shipped {
            background-color: rgba(0, 184, 212, 0.1);
            color: #00b8d4;
        }
        
        .delivered {
            background-color: rgba(46, 204, 113, 0.1);
            color: #2ecc71;
        }
        
        .cancelled {
            background-color: rgba(231, 76, 60, 0.1);
            color: #e74c3c;
        }
        
        /* Message List */
        .message-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .message-item {
            background-color: var(--background-color);
            border-radius: 10px;
            padding: 15px;
            position: relative;
        }
        
        .message-item.unread {
            background-color: rgba(0, 82, 204, 0.05);
            border-left: 3px solid var(--primary-color);
        }
        
        .message-sender {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .message-sender i {
            font-size: 24px;
            color: var(--primary-color);
            margin-right: 10px;
        }
        
        .sender-details {
            display: flex;
            flex-direction: column;
        }
        
        .sender-name {
            font-weight: 600;
            color: var(--dark-color);
        }
        
        .sender-email {
            font-size: 12px;
            color: var(--text-light);
        }
        
        .message-preview {
            color: var(--text-color);
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        .message-date {
            font-size: 12px;
            color: var(--text-light);
            align-self: flex-end;
        }
        
        .no-data {
            text-align: center;
            padding: 20px;
            color: var(--text-light);
            font-style: italic;
        }
        
        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            outline: none;
        }
        
        .primary-btn {
            background-color: var(--primary-color);
            color: white;
        }
        
        .primary-btn:hover {
            background-color: #0046b8;
            box-shadow: 0 5px 15px rgba(0, 82, 204, 0.2);
        }
        
        .secondary-btn {
            background-color: var(--background-color);
            color: var(--text-color);
        }
        
        .secondary-btn:hover {
            background-color: var(--border-color);
        }
        
        .danger-btn {
            background-color: var(--danger-color);
            color: white;
        }
        
        .danger-btn:hover {
            background-color: #d63b2c;
            box-shadow: 0 5px 15px rgba(231, 76, 60, 0.2);
        }
        
        .btn i {
            margin-right: 8px;
        }
        
        /* Management Actions */
        .management-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        /* Filter Section */
        .filter-section {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
            flex-wrap: wrap;
            min-width: 300px;
        }
        
        .filter-form {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .search-input {
            position: relative;
            flex: 1;
            min-width: 200px;
        }
        
        .search-input input {
            width: 100%;
            padding: 10px 15px;
            padding-right: 40px;
            border-radius: 5px;
            border: 1px solid var(--border-color);
            outline: none;
        }
        
        .search-input input:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.1);
        }
        
        .search-btn {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--text-light);
            cursor: pointer;
        }
        
        .search-btn:hover {
            color: var(--primary-color);
        }
        
        .filter-section select {
            padding: 10px 15px;
            border-radius: 5px;
            border: 1px solid var(--border-color);
            outline: none;
            background-color: var(--card-color);
            color: var(--text-color);
            cursor: pointer;
        }
        
        .filter-section select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.1);
        }
        
        .reset-btn {
            padding: 10px 15px;
        }
        
        /* Table Responsive */
        .table-responsive {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
        
        /* Alerts */
        .alert {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
            display: flex;
            align-items: center;
        }
        
        .alert-success {
            background-color: #e8f8f0;
            color: var(--success-color);
            border-left: 4px solid var(--success-color);
        }
        
        .alert-error {
            background-color: #ffeaea;
            color: var(--danger-color);
            border-left: 4px solid var(--danger-color);
        }
        
        .alert i {
            margin-right: 10px;
            font-size: 18px;
        }
        
        .close-alert {
            margin-left: auto;
            background: none;
            border: none;
            color: inherit;
            font-size: 18px;
            cursor: pointer;
        }
        
        /* Logo styles */
        .logo-text {
            display: flex;
            align-items: center;
            position: relative;
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -1px;
            text-transform: uppercase;
        }
        
        .tech {
            color: white;
        }
        
        .nest {
            color: #00b8d4;
        }
        
        .bolt-icon {
            position: absolute;
            top: -5px;
            left: -15px;
            font-size: 16px;
            color: #00b8d4;
            transform: rotate(20deg);
        }
        
        /* Pagination */
        .pagination {
            display: flex;
            justify-content: center;
            margin-top: 30px;
            gap: 5px;
        }
        
        .page-link {
            padding: 8px 15px;
            border-radius: 5px;
            background-color: var(--card-color);
            color: var(--text-color);
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 14px;
            display: flex;
            align-items: center;
        }
        
        .page-link.active {
            background-color: var(--primary-color);
            color: white;
        }
        
        .page-link:hover:not(.active) {
            background-color: var(--background-color);
        }
        
        .ellipsis {
            padding: 8px 12px;
            color: var(--text-light);
        }
        
        .page-link i {
            font-size: 12px;
        }
        
        /* Modal */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1100;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal.show {
            display: flex;
            opacity: 1;
        }
        
        .modal-content {
            background-color: var(--card-color);
            border-radius: 10px;
            width: 100%;
            max-width: 500px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transform: translateY(-50px);
            transition: transform 0.3s ease;
        }
        
        .modal.show .modal-content {
            transform: translateY(0);
        }
        
        .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 20px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .modal-header h3 {
            font-size: 18px;
            color: var(--dark-color);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .modal-header h3 i {
            color: var(--danger-color);
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 20px;
            color: var(--text-light);
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .close-modal:hover {
            color: var(--danger-color);
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .modal-footer {
            padding: 15px 20px;
            border-top: 1px solid var(--border-color);
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        
        .warning {
            color: var(--danger-color);
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 10px;
            font-weight: 500;
        }
        
        /* Responsive */
        @media (max-width: 1200px) {
            .dashboard-stats {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .dashboard-widgets {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 992px) {
            .sidebar {
                width: 80px;
            }
            
            .sidebar-header h2, .sidebar-menu ul li a span {
                display: none;
            }
            
            .sidebar-header {
                justify-content: center;
            }
            
            .sidebar-menu ul li a {
                justify-content: center;
                padding: 15px;
            }
            
            .sidebar-menu ul li a i {
                margin-right: 0;
                font-size: 20px;
            }
            
            .main-content {
                margin-left: 80px;
                width: calc(100% - 80px);
            }
            
            .sidebar-toggle {
                display: block;
            }
        }
        
        @media (max-width: 768px) {
            .dashboard-stats {
                grid-template-columns: 1fr;
            }
            
            .search-box {
                flex: 0 0 auto;
                width: 200px;
            }
            
            .admin-info {
                display: none;
            }
        }
        
        @media (max-width: 576px) {
            .sidebar {
                width: 0;
                left: -250px;
            }
            
            .main-content {
                margin-left: 0;
                width: 100%;
            }
            
            .sidebar.show {
                width: 250px;
                left: 0;
            }
            
            .sidebar.show + .main-content {
                margin-left: 0;
            }
            
            .sidebar-header h2, .sidebar-menu ul li a span {
                display: block;
            }
            
            .sidebar-header {
                justify-content: flex-start;
            }
            
            .sidebar-menu ul li a {
                justify-content: flex-start;
                padding: 12px 20px;
            }
            
            .sidebar-menu ul li a i {
                margin-right: 10px;
                font-size: 16px;
            }
            
            .top-bar {
                padding: 10px 15px;
            }
            
            .search-box {
                display: none;
            }
            
            .content-wrapper {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="sidebar">
            <div class="sidebar-header">
                <div class="logo-text">
                    <div class="bolt-icon"><i class="fas fa-bolt"></i></div>
                    <span class="tech">Tech</span><span class="nest">Nest</span>
                </div>
            </div>
            
            <div class="sidebar-menu">
                <ul>
                    <li <?php echo $page_title == "Dashboard" ? 'class="active"' : ''; ?>>
                        <a href="dashboard.php">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li <?php echo $page_title == "Products" ? 'class="active"' : ''; ?>>
                        <a href="products.php">
                            <i class="fas fa-box"></i>
                            <span>Products</span>
                        </a>
                    </li>
                    <li <?php echo $page_title == "Orders" ? 'class="active"' : ''; ?>>
                        <a href="orders.php">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Orders</span>
                        </a>
                    </li>
                    <li <?php echo $page_title == "Messages" ? 'class="active"' : ''; ?>>
                        <a href="messages.php">
                            <i class="fas fa-envelope"></i>
                            <span>Messages</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="main-content">
            <div class="top-bar">
                <button id="sidebar-toggle" class="sidebar-toggle">
                    <i class="fas fa-bars"></i>
                </button>
                
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Search...">
                </div>
                
                <div class="top-bar-right">
                    <div class="notifications">
                        <button class="notification-btn">
                            <i class="fas fa-bell"></i>
                            <span class="badge">5</span>
                        </button>
                    </div>
                    
                    <div class="admin-profile">
                        <img src="https://via.placeholder.com/40" alt="Admin" class="admin-avatar">
                        <div class="admin-info">
                            <span class="admin-name"><?php echo htmlspecialchars($_SESSION['admin_name']); ?></span>
                            <span class="admin-role">Administrator</span>
                        </div>
                        <div class="admin-dropdown">
                            <button class="dropdown-btn">
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            <div class="dropdown-content">
                                <a href="logout.php">
                                    <i class="fas fa-sign-out-alt"></i> Logout
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="content-wrapper">
                <div class="page-header">
                    <h1><?php echo $page_title; ?></h1>
                    <div class="breadcrumb">
                        <a href="dashboard.php">Dashboard</a>
                        <?php if($page_title != "Dashboard"): ?>
                            <span class="separator">/</span>
                            <span class="current"><?php echo $page_title; ?></span>
                        <?php endif; ?>
                    </div>
                </div>
                
                <div class="content"></div>