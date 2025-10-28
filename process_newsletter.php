<?php
// Include the database connection and helper functions
require_once 'includes/config.php';
require_once 'includes/functions.php';

// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Check if the email field is set and not empty
    if (isset($_POST['email']) && !empty($_POST['email'])) {
        
        // Sanitize and validate the email address
        $email = sanitize($_POST['email']);
        if (!validateEmail($email)) {
            $_SESSION['error'] = "Please provide a valid email address.";
            redirect('index.php#newsletter');
        }

        // Check if the email already exists in the subscribers table
        $check_query = "SELECT email FROM subscribers WHERE email = '$email'";
        $check_result = mysqli_query($conn, $check_query);

        if (mysqli_num_rows($check_result) > 0) {
            // Email already exists
            $_SESSION['info'] = "You are already subscribed to our newsletter!";
            redirect('index.php#newsletter');
        } else {
            // Email does not exist, so insert it
            $insert_query = "INSERT INTO subscribers (email) VALUES ('$email')";
            
            if (mysqli_query($conn, $insert_query)) {
                // Success
                $_SESSION['success'] = "Thank you for subscribing! You're now on our list.";
                redirect('index.php#newsletter');
            } else {
                // Database error
                $_SESSION['error'] = "Error: Could not subscribe at this time. Please try again later.";
                redirect('index.php#newsletter');
            }
        }

    } else {
        // Email field was empty
        $_SESSION['error'] = "Email address cannot be empty.";
        redirect('index.php#newsletter');
    }

} else {
    // If someone tries to access this file directly, redirect them
    redirect('index.php');
}
?>