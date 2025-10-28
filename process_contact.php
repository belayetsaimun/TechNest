<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

// Check if the form was submitted using the POST method
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Sanitize all inputs to prevent XSS and other attacks
    $name = sanitize($_POST['name']);
    $email = sanitize($_POST['email']);
    $phone = sanitize($_POST['phone']);
    $subject = sanitize($_POST['subject']);
    $message = sanitize($_POST['message']);

    // --- Server-Side Validation ---
    // Check for empty required fields
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        $_SESSION['error'] = "Please fill in all required fields.";
        redirect('contact.php');
    }
    // Validate email format
    if (!validateEmail($email)) {
        $_SESSION['error'] = "Please provide a valid email address.";
        redirect('contact.php');
    }

    // --- Insert into Database ---
    // Prepare an SQL statement to prevent SQL injection
    $stmt = mysqli_prepare($conn, "INSERT INTO messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)");
    
    // Bind parameters to the statement
    mysqli_stmt_bind_param($stmt, "sssss", $name, $email, $phone, $subject, $message);

    // Execute the statement
    if (mysqli_stmt_execute($stmt)) {
        // Success! Set a success message and redirect.
        $_SESSION['success'] = "Thank you, $name! Your message has been sent successfully.";
        redirect('contact.php');
    } else {
        // Error handling if the query fails
        $_SESSION['error'] = "Sorry, there was an error sending your message. Please try again later.";
        redirect('contact.php');
    }

    // Close the statement
    mysqli_stmt_close($stmt);

} else {
    // If the page is accessed directly, redirect to the contact page
    redirect('contact.php');
}
?>