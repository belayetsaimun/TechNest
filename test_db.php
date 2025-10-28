<?php
// Include config file
require_once 'includes/config.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Database Connection Test</h2>";

// Test connection
if ($conn) {
    echo "<p>Database connection successful!</p>";
    
    // Test users table
    $result = mysqli_query($conn, "SHOW TABLES LIKE 'users'");
    if (mysqli_num_rows($result) > 0) {
        echo "<p>Users table exists.</p>";
        
        // Show table structure
        $result = mysqli_query($conn, "DESCRIBE users");
        echo "<h3>Users Table Structure:</h3>";
        echo "<table border='1'>";
        echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
        while ($row = mysqli_fetch_assoc($result)) {
            echo "<tr>";
            echo "<td>" . $row['Field'] . "</td>";
            echo "<td>" . $row['Type'] . "</td>";
            echo "<td>" . $row['Null'] . "</td>";
            echo "<td>" . $row['Key'] . "</td>";
            echo "<td>" . $row['Default'] . "</td>";
            echo "<td>" . $row['Extra'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        // Test insertion
        $testName = "Test User";
        $testEmail = "test_" . time() . "@example.com";
        $testPassword = password_hash("password123", PASSWORD_DEFAULT);
        
        $query = "INSERT INTO users (name, email, password) VALUES ('$testName', '$testEmail', '$testPassword')";
        echo "<h3>Testing Insertion:</h3>";
        echo "<p>Query: " . htmlspecialchars($query) . "</p>";
        
        if (mysqli_query($conn, $query)) {
            $insertId = mysqli_insert_id($conn);
            echo "<p style='color:green'>Test user inserted successfully! ID: " . $insertId . "</p>";
            
            // Cleanup the test data
            mysqli_query($conn, "DELETE FROM users WHERE id = $insertId");
            echo "<p>Test data removed.</p>";
        } else {
            echo "<p style='color:red'>Error inserting test user: " . mysqli_error($conn) . "</p>";
        }
    } else {
        echo "<p style='color:red'>Users table does not exist!</p>";
        
        // Show SQL to create table
        echo "<h3>SQL to create table:</h3>";
        echo "<pre>" . htmlspecialchars("
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;") . "</pre>";
    }
} else {
    echo "<p style='color:red'>Database connection failed: " . mysqli_connect_error() . "</p>";
}
?>