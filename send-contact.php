<?php
/**
 * Contact Form Handler for Crypto Station
 * Simple and secure PHP script to handle contact form submissions
 */

// Set JSON response header
header('Content-Type: application/json');

// Function to sanitize input data
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function is_valid_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Check if form is submitted via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Initialize response array
    $response = array();
    
    // Get and sanitize form data
    $name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
    $subject = isset($_POST['subject']) ? sanitize_input($_POST['subject']) : '';
    $message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';
    
    // Validation
    $errors = array();
    
    if (empty($name)) {
        $errors[] = "Name is required.";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required.";
    } elseif (!is_valid_email($email)) {
        $errors[] = "Invalid email format.";
    }
    
    if (empty($subject)) {
        $errors[] = "Subject is required.";
    }
    
    if (empty($message)) {
        $errors[] = "Message is required.";
    } elseif (strlen($message) < 10) {
        $errors[] = "Message must be at least 10 characters long.";
    }
    
    // If there are validation errors
    if (!empty($errors)) {
        $response['success'] = false;
        $response['message'] = implode(" ", $errors);
        echo json_encode($response);
        exit;
    }
    
    // Basic spam protection - honeypot field (you can add this to the form as a hidden field)
    if (isset($_POST['website']) && !empty($_POST['website'])) {
        // Likely spam
        $response['success'] = false;
        $response['message'] = "Spam detected.";
        echo json_encode($response);
        exit;
    }
    
    // Prepare email content
    $to = "info@crypto-station.org";
    
    // Email subject
    $email_subject = "Contact Form: " . $subject;
    
    // Email body
    $email_body = "You have received a new message from your website contact form.\n\n";
    $email_body .= "Name: " . $name . "\n";
    $email_body .= "Email: " . $email . "\n";
    $email_body .= "Subject: " . $subject . "\n\n";
    $email_body .= "Message:\n" . $message . "\n";
    $email_body .= "\n---\n";
    $email_body .= "Sent from: crypto-station.org\n";
    $email_body .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $email_body .= "Date: " . date('Y-m-d H:i:s') . "\n";
    
    // Email headers
    $headers = "From: noreply@crypto-station.org\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Attempt to send email
    if (mail($to, $email_subject, $email_body, $headers)) {
        $response['success'] = true;
        $response['message'] = "Thank you for contacting us! We'll get back to you within 24-48 hours.";
        
        // Optional: Log the submission (create a simple log file)
        $log_entry = date('Y-m-d H:i:s') . " | " . $name . " | " . $email . " | " . $subject . "\n";
        file_put_contents('contact_logs.txt', $log_entry, FILE_APPEND | LOCK_EX);
        
    } else {
        $response['success'] = false;
        $response['message'] = "Sorry, there was an error sending your message. Please try again or email us directly at info@crypto-station.org";
        
        // Log the error
        error_log("Contact form mail() failed for: " . $email);
    }
    
    echo json_encode($response);
    
} else {
    // If accessed directly without POST
    $response['success'] = false;
    $response['message'] = "Invalid request method.";
    echo json_encode($response);
}
?>