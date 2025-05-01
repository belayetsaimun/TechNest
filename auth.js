document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding form
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === target) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Password toggle functionality
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Change icon
            button.classList.toggle('fa-eye');
            button.classList.toggle('fa-eye-slash');
        });
    });
    
    // Password strength meter
    const passwordInput = document.getElementById('signup-password');
    const strengthSegments = document.querySelectorAll('.strength-segment');
    const strengthText = document.querySelector('.strength-text');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }
    
    function checkPasswordStrength() {
        const password = passwordInput.value;
        let strength = 0;
        
        // Reset strength meter
        strengthSegments.forEach(segment => {
            segment.classList.remove('active', 'medium', 'strong');
        });
        
        if (password.length === 0) {
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#ff6b6b';
            return;
        }
        
        // Check password strength
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        // Update strength meter
        for (let i = 0; i < strength; i++) {
            strengthSegments[i].classList.add('active');
            
            if (strength === 2) {
                strengthSegments[i].classList.add('medium');
            } else if (strength >= 3) {
                strengthSegments[i].classList.add('strong');
            }
        }
        
        // Update strength text
        if (strength < 2) {
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#ff6b6b';
        } else if (strength === 2) {
            strengthText.textContent = 'Medium';
            strengthText.style.color = '#ffbb55';
        } else if (strength === 3) {
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#2ecc71';
        } else {
            strengthText.textContent = 'Very Strong';
            strengthText.style.color = '#2ecc71';
        }
    }
    
    // Form submissions
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const remember = document.getElementById('remember').checked;
            
            // Here you would typically send the login data to your server
            console.log('Login attempt:', { email, password, remember });
            
            // For demo purposes, show success message
            showNotification('Login successful! Redirecting...', 'success');
            
            // Simulate redirect after login
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            const termsAccepted = document.getElementById('terms').checked;
            
            // Check if passwords match
            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }
            
            // Here you would typically send the signup data to your server
            console.log('Signup attempt:', { name, email, password, termsAccepted });
            
            // For demo purposes, show success message
            showNotification('Account created successfully! Redirecting...', 'success');
            
            // Simulate redirect after signup
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
    
    // Create notification system
    function showNotification(message, type = 'info') {
        // Remove any existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getIconForType(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Add styles dynamically if they don't exist
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background-color: white;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    border-radius: 5px;
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    z-index: 10000;
                    min-width: 300px;
                    transform: translateY(-20px);
                    opacity: 0;
                    animation: slideIn 0.3s forwards;
                }
                
                @keyframes slideIn {
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                }
                
                .notification-content i {
                    margin-right: 10px;
                    font-size: 18px;
                }
                
                .notification.success {
                    border-left: 4px solid #2ecc71;
                }
                
                .notification.error {
                    border-left: 4px solid #e74c3c;
                }
                
                .notification.info {
                    border-left: 4px solid #3498db;
                }
                
                .notification.success i {
                    color: #2ecc71;
                }
                
                .notification.error i {
                    color: #e74c3c;
                }
                
                .notification.info i {
                    color: #3498db;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    transition: color 0.3s;
                }
                
                .notification-close:hover {
                    color: #333;
                }
                
                @media (max-width: 576px) {
                    .notification {
                        left: 20px;
                        right: 20px;
                        min-width: auto;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOut 0.3s forwards';
                
                // Add keyframes if they don't exist
                if (!document.getElementById('notification-keyframes')) {
                    const keyframes = document.createElement('style');
                    keyframes.id = 'notification-keyframes';
                    keyframes.textContent = `
                        @keyframes slideOut {
                            to {
                                transform: translateY(-20px);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(keyframes);
                }
                
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    function getIconForType(type) {
        switch (type) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-exclamation-circle';
            case 'info':
            default:
                return 'fa-info-circle';
        }
    }
    
    // Add link to auth page in existing account icon
    const accountLinks = document.querySelectorAll('.account');
    accountLinks.forEach(link => {
        if (!link.hasAttribute('href')) {
            link.setAttribute('href', 'auth.html');
        }
    });
});