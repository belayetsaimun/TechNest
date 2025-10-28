/**
 * TechNest Profile Page JavaScript
 * Modern interactive functionality for the profile page
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile page initialized');
    
    // Initialize all profile page components
    initPasswordToggles();
    initOrdersAccordion();
    initFormValidation();
    initNotifications();
    
    // Animate elements on page load for a smooth entrance
    animateProfileElements();
});

/**
 * Toggle password visibility for password fields
 */
function initPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.style.cursor = 'pointer';
        
        button.addEventListener('click', function() {
            // Find the password input in this button's parent group
            const inputField = this.closest('.input-group').querySelector('input');
            
            if (inputField) {
                // Toggle between password and text types
                if (inputField.type === 'password') {
                    inputField.type = 'text';
                    this.classList.remove('fa-eye');
                    this.classList.add('fa-eye-slash');
                } else {
                    inputField.type = 'password';
                    this.classList.remove('fa-eye-slash');
                    this.classList.add('fa-eye');
                }
                
                // Focus the input field for better UX
                inputField.focus();
            }
        });
    });
}

/**
 * Implement accordion functionality for order history
 */
function initOrdersAccordion() {
    const orderHeaders = document.querySelectorAll('.order-header');
    
    orderHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const orderCard = this.closest('.order-card');
            const wasExpanded = orderCard.classList.contains('expanded');
            
            // Close all other expanded cards first
            document.querySelectorAll('.order-card.expanded').forEach(card => {
                if (card !== orderCard) {
                    card.classList.remove('expanded');
                }
            });
            
            // Toggle this card
            orderCard.classList.toggle('expanded');
            
            // Add a subtle animation when expanding
            if (!wasExpanded) {
                const orderDetails = orderCard.querySelector('.order-details');
                orderDetails.style.opacity = '0';
                setTimeout(() => {
                    orderDetails.style.opacity = '1';
                    orderDetails.style.transition = 'opacity 0.3s ease';
                }, 50);
            }
        });
    });
    
    // Open the first order by default (if any exist)
    const firstOrderHeader = document.querySelector('.order-header');
    if (firstOrderHeader) {
        setTimeout(() => {
            firstOrderHeader.click();
        }, 500); // Short delay for better UX
    }
}

/**
 * Form validation for profile updates
 */
function initFormValidation() {
    const profileForm = document.getElementById('profile-form');
    
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            let isValid = true;
            const newPassword = document.getElementById('new-password');
            const confirmPassword = document.getElementById('confirm-password');
            const currentPassword = document.getElementById('current-password');
            
            // Clear previous validation messages
            clearValidationMessages();
            
            // Validate new password if it's being changed
            if (newPassword && confirmPassword && newPassword.value) {
                // Check password length
                if (newPassword.value.length < 8) {
                    showValidationError(newPassword, 'Password must be at least 8 characters');
                    isValid = false;
                }
                
                // Check password match
                if (newPassword.value !== confirmPassword.value) {
                    showValidationError(confirmPassword, 'Passwords do not match');
                    isValid = false;
                }
                
                // Require current password if new password is provided
                if (currentPassword && !currentPassword.value) {
                    showValidationError(currentPassword, 'Current password is required to set a new password');
                    isValid = false;
                }
            }
            
            // If form is invalid, prevent submission
            if (!isValid) {
                e.preventDefault();
                showNotification('Please correct the form errors', 'error');
            } else {
                // Show loading state on the button
                const submitButton = profileForm.querySelector('button[type="submit"]');
                if (submitButton) {
                    const originalText = submitButton.innerHTML;
                    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
                    submitButton.disabled = true;
                    
                    // Restore button after submission (just in case form doesn't redirect)
                    setTimeout(() => {
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                    }, 3000);
                }
            }
        });
    }
}

/**
 * Show validation error for a field
 */
function showValidationError(inputElement, message) {
    const inputGroup = inputElement.closest('.input-group');
    inputElement.classList.add('is-invalid');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-message';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--profile-danger)';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '5px';
    
    // Insert after the input group
    inputGroup.parentNode.insertBefore(errorElement, inputGroup.nextSibling);
    
    // Add shake animation to the input
    inputElement.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
    
    // Add keypress listener to clear error on typing
    inputElement.addEventListener('input', function() {
        this.classList.remove('is-invalid');
        if (errorElement.parentNode) {
            errorElement.parentNode.removeChild(errorElement);
        }
    }, { once: true });
}

/**
 * Clear all validation messages
 */
function clearValidationMessages() {
    document.querySelectorAll('.validation-message').forEach(el => el.remove());
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
}

/**
 * Initialize notification system
 */
function initNotifications() {
    // Check for PHP session messages and display them
    if (typeof phpMessages !== 'undefined' && phpMessages) {
        if (phpMessages.success) {
            showNotification(phpMessages.success, 'success');
        }
        if (phpMessages.error) {
            showNotification(phpMessages.error, 'error');
        }
        if (phpMessages.info) {
            showNotification(phpMessages.info, 'info');
        }
    }
    
    // Add styles for the notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Show a notification message
 */
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let container = document.getElementById('profile-notifications');
    if (!container) {
        container = document.createElement('div');
        container.id = 'profile-notifications';
        document.body.appendChild(container);
    }
    
    // Create the notification element
    const notification = document.createElement('div');
    notification.className = `profile-notification ${type}`;
    
    // Set icon based on notification type
    const iconClass = type === 'success' ? 'fa-check-circle' : 
                      type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${iconClass}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    container.appendChild(notification);
    
    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Add entrance animations to profile page elements
 */
function animateProfileElements() {
    // Add subtle entrance animations to main elements
    const elements = [
        { selector: '.profile-card h2', delay: 100 },
        { selector: '.profile-form', delay: 300 },
        { selector: '.order-history-container h2', delay: 200 },
        { selector: '.orders-list', delay: 400 }
    ];
    
    elements.forEach(item => {
        const element = document.querySelector(item.selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, item.delay);
        }
    });
}