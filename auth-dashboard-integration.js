// Auth-Dashboard Integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize user state
    initializeUserState();
    
    // Check if user is on auth page
    const isAuthPage = window.location.pathname.includes('auth.html');
    
    // Check if user is on dashboard page
    const isDashboardPage = window.location.pathname.includes('dashboard.html');
    
    if (isAuthPage) {
        // Handle auth page specific functionality
        setupAuthFunctionality();
    } else if (isDashboardPage) {
        // Check if user is logged in before allowing dashboard access
        const isLoggedIn = checkUserLoggedIn();
        
        if (!isLoggedIn) {
            // Redirect to auth page if not logged in
            window.location.href = 'auth.html?redirect=dashboard';
        }
    }
    
    // Update UI based on auth state on any page
    updateUIBasedOnAuthState();
    
    // Setup Account Icon Click Handler for all pages
    setupAccountIconHandler();
});

// Function to initialize user state
function initializeUserState() {
    // Check if user data exists in localStorage
    if (!localStorage.getItem('user')) {
        // Set default user state
        localStorage.setItem('user', JSON.stringify({
            loggedIn: false,
            data: null
        }));
    }
}

// Function to check if user is logged in
function checkUserLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.loggedIn;
}

// Function to get user data
function getUserData() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.data : null;
}

// Function to setup auth functionality
function setupAuthFunctionality() {
    // Tab switching functionality from existing auth.js
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
        passwordInput.addEventListener('input', () => {
            checkPasswordStrength(passwordInput.value, strengthSegments, strengthText);
        });
    }
    
    // Form submissions
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const remember = document.getElementById('remember')?.checked || false;
            
            // Here in a real app, you would validate credentials against server
            // For demo purposes, perform a mock login
            performLogin(email, password, remember);
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            const termsAccepted = document.getElementById('terms')?.checked || false;
            
            // Check if passwords match
            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }
            
            // Check if terms are accepted
            if (!termsAccepted) {
                showNotification('You must accept the Terms & Conditions', 'error');
                return;
            }
            
            // Here in a real app, you would send registration data to server
            // For demo purposes, perform a mock registration
            performRegistration(name, email, password);
        });
    }
    
    // Check for redirect parameters
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get('redirect');
    
    if (redirectParam) {
        // Show a message about redirection
        showNotification('Please log in to access your dashboard', 'info');
    }
}

// Function to perform login (mock implementation)
function performLogin(email, password, remember) {
    // In a real app, you would validate credentials with the server
    
    // For demo purposes, create a mock user
    const userData = {
        name: email.split('@')[0], // Extract name from email
        email: email,
        avatar: 'images/avatar-placeholder.png',
        memberSince: new Date().toISOString(),
        membershipLevel: 'Gold',
        lastLogin: new Date().toISOString()
    };
    
    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify({
        loggedIn: true,
        data: userData,
        remember: remember
    }));
    
    // Show success notification
    showNotification('Login successful! Redirecting...', 'success');
    
    // Check if there's a redirect parameter
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get('redirect');
    
    // Redirect after login
    setTimeout(() => {
        if (redirectParam === 'dashboard') {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'index.html';
        }
    }, 1500);
}

// Function to perform registration (mock implementation)
function performRegistration(name, email, password) {
    // In a real app, you would send registration data to the server
    
    // For demo purposes, create a mock user
    const userData = {
        name: name,
        email: email,
        avatar: 'images/avatar-placeholder.png',
        memberSince: new Date().toISOString(),
        membershipLevel: 'Bronze', // New users start at Bronze
        lastLogin: new Date().toISOString()
    };
    
    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify({
        loggedIn: true,
        data: userData,
        remember: true
    }));
    
    // Show success notification
    showNotification('Account created successfully! Redirecting...', 'success');
    
    // Redirect after registration
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// Function to log out
function performLogout() {
    // Clear user session
    localStorage.setItem('user', JSON.stringify({
        loggedIn: false,
        data: null
    }));
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Function to check password strength
function checkPasswordStrength(password, strengthSegments, strengthText) {
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
    let strength = 0;
    
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

// Function to update UI based on auth state
function updateUIBasedOnAuthState() {
    const isLoggedIn = checkUserLoggedIn();
    const userData = getUserData();
    
    // Update account icon and interactions
    const accountLinks = document.querySelectorAll('.account');
    
    accountLinks.forEach(link => {
        if (isLoggedIn) {
            // If logged in, link to dashboard
            link.setAttribute('href', 'dashboard.html');
            
            // Optionally, you can update the icon to show logged in state
            // For example, show a small indicator or user's avatar
            if (userData && userData.avatar) {
                // Create a mini avatar in the account icon
                // This is optional and depends on your design
                // Example: link.innerHTML = `<img src="${userData.avatar}" class="mini-avatar">`;
            }
        } else {
            // If not logged in, link to auth page
            link.setAttribute('href', 'auth.html');
        }
    });
    
    // Update dashboard if on dashboard page
    if (window.location.pathname.includes('dashboard.html') && isLoggedIn && userData) {
        updateDashboardWithUserData(userData);
    }
    
    // Add logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', performLogout);
    }
}

// Function to update dashboard with user data
function updateDashboardWithUserData(userData) {
    // Update user display name
    const userDisplayName = document.getElementById('userDisplayName');
    if (userDisplayName && userData.name) {
        userDisplayName.textContent = userData.name;
    }
    
    // Update user email
    const userEmail = document.getElementById('userEmail');
    if (userEmail && userData.email) {
        userEmail.textContent = userData.email;
    }
    
    // Update welcome message
    const welcomeUserName = document.getElementById('welcomeUserName');
    if (welcomeUserName && userData.name) {
        welcomeUserName.textContent = userData.name.split(' ')[0]; // First name only
    }
    
    // Update last login date
    const lastLoginDate = document.getElementById('lastLoginDate');
    if (lastLoginDate && userData.lastLogin) {
        const loginDate = new Date(userData.lastLogin);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        lastLoginDate.textContent = loginDate.toLocaleDateString('en-US', options);
    }
    
    // Update membership badge
    const statusBadge = document.querySelector('.status-badge');
    if (statusBadge && userData.membershipLevel) {
        statusBadge.textContent = userData.membershipLevel + ' Member';
        statusBadge.className = 'status-badge ' + userData.membershipLevel.toLowerCase();
    }
    
    // Update avatar if available
    const userAvatar = document.getElementById('userAvatar');
    const profileAvatar = document.getElementById('profileAvatar');
    
    if (userData.avatar) {
        if (userAvatar) userAvatar.src = userData.avatar;
        if (profileAvatar) profileAvatar.src = userData.avatar;
    }
    
    // Fill in profile form data
    if (userData.name) {
        const nameParts = userData.name.split(' ');
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        
        if (firstName && nameParts.length > 0) {
            firstName.value = nameParts[0];
        }
        
        if (lastName && nameParts.length > 1) {
            lastName.value = nameParts.slice(1).join(' ');
        }
    }
    
    if (userData.email) {
        const email = document.getElementById('email');
        if (email) email.value = userData.email;
    }
}

// Function to handle account icon click
function setupAccountIconHandler() {
    const accountLinks = document.querySelectorAll('.account');
    
    accountLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const isLoggedIn = checkUserLoggedIn();
            
            if (isLoggedIn) {
                // If logged in, allow normal navigation to dashboard
                // Don't prevent default
            } else {
                // If not logged in, ensure it goes to auth page
                e.preventDefault();
                window.location.href = 'auth.html';
            }
        });
    });
}

// Enhanced notification function that works across both auth and dashboard
function showNotification(message, type = 'success') {
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
            
            @keyframes slideOut {
                to {
                    transform: translateY(-20px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s forwards';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOut 0.3s forwards';
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