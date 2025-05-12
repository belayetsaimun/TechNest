document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Tabs
    const dashboardTabs = document.querySelectorAll('.dashboard-tab');
    const navItems = document.querySelectorAll('.dashboard-nav li');
    const viewAllLinks = document.querySelectorAll('.view-all');
    
    // DOM Elements - Address Form
    const addAddressBtn = document.getElementById('addAddressBtn');
    const addAddressCard = document.getElementById('addAddressCard');
    const addressFormContainer = document.getElementById('addressFormContainer');
    const closeAddressForm = document.getElementById('closeAddressForm');
    const cancelAddressForm = document.getElementById('cancelAddressForm');
    const addressForm = document.getElementById('addressForm');
    
    // DOM Elements - Payment Form
    const addPaymentBtn = document.getElementById('addPaymentBtn');
    const addPaymentCard = document.getElementById('addPaymentCard');
    const paymentFormContainer = document.getElementById('paymentFormContainer');
    const closePaymentForm = document.getElementById('closePaymentForm');
    const cancelPaymentForm = document.getElementById('cancelPaymentForm');
    const paymentForm = document.getElementById('paymentForm');
    const paymentType = document.getElementById('paymentType');
    const cardFields = document.getElementById('cardFields');
    const mobileFields = document.getElementById('mobileFields');
    
    // DOM Elements - Password Strength
    const newPassword = document.getElementById('newPassword');
    const passwordStrength = document.querySelector('.password-strength');
    const strengthSegments = document.querySelectorAll('.strength-segment');
    const strengthText = document.querySelector('.strength-text');
    
    // DOM Elements - Profile Avatar
    const avatarInput = document.getElementById('avatar-input');
    const profileAvatarInput = document.getElementById('profile-avatar-input');
    const userAvatar = document.getElementById('userAvatar');
    const profileAvatar = document.getElementById('profileAvatar');
    
    // Initialize the dashboard
    initializeDashboard();
    
    // Tab Navigation
    function initializeDashboard() {
        // Set initial tab
        showTab('overview');
        
        // Set welcome user name
        const welcomeUserName = document.getElementById('welcomeUserName');
        const userDisplayName = document.getElementById('userDisplayName');
        if (welcomeUserName && userDisplayName) {
            const names = userDisplayName.textContent.split(' ');
            welcomeUserName.textContent = names[0];
        }
        
        // Set current date for "Last login"
        const lastLoginDate = document.getElementById('lastLoginDate');
        if (lastLoginDate) {
            const now = new Date();
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            lastLoginDate.textContent = now.toLocaleDateString('en-US', options);
        }
        
        // Add event listeners for tab navigation
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                showTab(tabId);
            });
        });
        
        // Add event listeners for "View All" links
        viewAllLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                showTab(tabId);
            });
        });
        
        // Add event listeners for Address Form
        if (addAddressBtn && addressFormContainer) {
            addAddressBtn.addEventListener('click', showAddressForm);
        }
        
        if (addAddressCard && addressFormContainer) {
            addAddressCard.addEventListener('click', showAddressForm);
        }
        
        if (closeAddressForm) {
            closeAddressForm.addEventListener('click', hideAddressForm);
        }
        
        if (cancelAddressForm) {
            cancelAddressForm.addEventListener('click', hideAddressForm);
        }
        
        if (addressForm) {
            addressForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // In a real app, you would send the form data to the server
                showNotification('Address saved successfully!', 'success');
                hideAddressForm();
            });
        }
        
        // Add event listeners for Payment Form
        if (addPaymentBtn && paymentFormContainer) {
            addPaymentBtn.addEventListener('click', showPaymentForm);
        }
        
        if (addPaymentCard && paymentFormContainer) {
            addPaymentCard.addEventListener('click', showPaymentForm);
        }
        
        if (closePaymentForm) {
            closePaymentForm.addEventListener('click', hidePaymentForm);
        }
        
        if (cancelPaymentForm) {
            cancelPaymentForm.addEventListener('click', hidePaymentForm);
        }
        
        if (paymentType) {
            paymentType.addEventListener('change', togglePaymentFields);
        }
        
        if (paymentForm) {
            paymentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // In a real app, you would send the form data to the server
                showNotification('Payment method saved successfully!', 'success');
                hidePaymentForm();
            });
        }
        
        // Password Strength Meter
        if (newPassword && passwordStrength) {
            newPassword.addEventListener('input', function() {
                checkPasswordStrength(this.value);
            });
        }
        
        // Profile Avatar Upload
        if (avatarInput && userAvatar) {
            avatarInput.addEventListener('change', function() {
                handleAvatarUpload(this, userAvatar);
            });
        }
        
        if (profileAvatarInput && profileAvatar) {
            profileAvatarInput.addEventListener('change', function() {
                handleAvatarUpload(this, profileAvatar);
                if (userAvatar) {
                    // Sync the avatars
                    userAvatar.src = profileAvatar.src;
                }
            });
        }
        
        // Profile Form Submission
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // In a real app, you would send the form data to the server
                
                // Update display name and email in the sidebar
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const email = document.getElementById('email').value;
                
                const userDisplayName = document.getElementById('userDisplayName');
                const userEmail = document.getElementById('userEmail');
                const welcomeUserName = document.getElementById('welcomeUserName');
                
                if (userDisplayName) {
                    userDisplayName.textContent = `${firstName} ${lastName}`;
                }
                
                if (userEmail) {
                    userEmail.textContent = email;
                }
                
                if (welcomeUserName) {
                    welcomeUserName.textContent = firstName;
                }
                
                showNotification('Profile updated successfully!', 'success');
            });
        }
        
        // Settings Form Submission
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // In a real app, you would send the form data to the server
                showNotification('Settings saved successfully!', 'success');
            });
        }
        
        // Initialize logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                // In a real app, you would perform logout operations
                window.location.href = 'auth.html';
            });
        }
    }
    
    // Function to show a specific tab
    function showTab(tabId) {
        // Hide all tabs
        dashboardTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show the selected tab
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Update active state in navigation
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            }
        });
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
    
    // Address Form Functions
    function showAddressForm() {
        if (addressFormContainer) {
            addressFormContainer.style.display = 'flex';
        }
    }
    
    function hideAddressForm() {
        if (addressFormContainer) {
            addressFormContainer.style.display = 'none';
            if (addressForm) {
                addressForm.reset();
            }
        }
    }
    
    // Payment Form Functions
    function showPaymentForm() {
        if (paymentFormContainer) {
            paymentFormContainer.style.display = 'flex';
        }
    }
    
    function hidePaymentForm() {
        if (paymentFormContainer) {
            paymentFormContainer.style.display = 'none';
            if (paymentForm) {
                paymentForm.reset();
            }
            if (cardFields) {
                cardFields.style.display = 'none';
            }
            if (mobileFields) {
                mobileFields.style.display = 'none';
            }
        }
    }
    
    function togglePaymentFields() {
        const selectedType = paymentType.value;
        
        if (cardFields && mobileFields) {
            if (selectedType === 'credit' || selectedType === 'debit') {
                cardFields.style.display = 'block';
                mobileFields.style.display = 'none';
            } else if (selectedType === 'bkash' || selectedType === 'nagad' || selectedType === 'rocket') {
                cardFields.style.display = 'none';
                mobileFields.style.display = 'block';
            } else {
                cardFields.style.display = 'none';
                mobileFields.style.display = 'none';
            }
        }
    }
    
    // Password Strength Function
    function checkPasswordStrength(password) {
        if (passwordStrength && strengthSegments && strengthText) {
            passwordStrength.style.display = 'block';
            
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
    }
    
    // Avatar Upload Function
    function handleAvatarUpload(input, imgElement) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imgElement.src = e.target.result;
            };
            
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    // Notification Function
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
    
    // Mobile Dashboard Navigation
    const dashboardControl = document.createElement('div');
    dashboardControl.className = 'dashboard-mobile-control';
    dashboardControl.innerHTML = `
        <button class="toggle-dashboard-nav">
            <i class="fas fa-bars"></i>
            <span>Dashboard Menu</span>
        </button>
    `;
    
    // Add dashboard control for mobile
    function setupMobileDashboard() {
        if (window.innerWidth <= 992) {
            if (!document.querySelector('.dashboard-mobile-control')) {
                document.querySelector('.dashboard-content').prepend(dashboardControl);
                
                // Add event listener
                document.querySelector('.toggle-dashboard-nav').addEventListener('click', function() {
                    const sidebar = document.querySelector('.dashboard-sidebar');
                    sidebar.classList.toggle('mobile-visible');
                    
                    // Add mobile styles if they don't exist
                    if (!document.getElementById('mobile-dashboard-styles')) {
                        const style = document.createElement('style');
                        style.id = 'mobile-dashboard-styles';
                        style.textContent = `
                            .dashboard-mobile-control {
                                margin-bottom: 20px;
                            }
                            
                            .toggle-dashboard-nav {
                                display: flex;
                                align-items: center;
                                gap: 10px;
                                background-color: var(--primary-color);
                                color: white;
                                border: none;
                                border-radius: 8px;
                                padding: 12px 20px;
                                font-size: 16px;
                                font-weight: 500;
                                cursor: pointer;
                                width: 100%;
                            }
                            
                            .dashboard-sidebar {
                                display: none;
                                position: fixed;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                z-index: 1000;
                                padding: 20px;
                                overflow-y: auto;
                            }
                            
                            .dashboard-sidebar.mobile-visible {
                                display: block;
                                animation: slideIn 0.3s forwards;
                            }
                            
                            @keyframes slideIn {
                                from { transform: translateX(-100%); }
                                to { transform: translateX(0); }
                            }
                            
                            .dashboard-sidebar .close-sidebar {
                                position: absolute;
                                top: 20px;
                                right: 20px;
                                font-size: 24px;
                                color: var(--dark-color);
                                background: none;
                                border: none;
                                cursor: pointer;
                            }
                        `;
                        document.head.appendChild(style);
                    }
                    
                    // Add close button if it doesn't exist
                    if (sidebar.classList.contains('mobile-visible') && !document.querySelector('.close-sidebar')) {
                        const closeBtn = document.createElement('button');
                        closeBtn.className = 'close-sidebar';
                        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
                        sidebar.appendChild(closeBtn);
                        
                        closeBtn.addEventListener('click', function() {
                            sidebar.classList.remove('mobile-visible');
                        });
                        
                        // Make nav items close the sidebar when clicked
                        document.querySelectorAll('.dashboard-nav li').forEach(item => {
                            item.addEventListener('click', function() {
                                sidebar.classList.remove('mobile-visible');
                            });
                        });
                    }
                });
            }
        } else {
            // Remove mobile control on larger screens
            if (document.querySelector('.dashboard-mobile-control')) {
                document.querySelector('.dashboard-mobile-control').remove();
            }
            
            // Remove mobile-visible class
            document.querySelector('.dashboard-sidebar')?.classList.remove('mobile-visible');
        }
    }
    
    // Initialize mobile dashboard
    setupMobileDashboard();
    
    // Update on window resize
    window.addEventListener('resize', setupMobileDashboard);
    
    // Enhance mini cards with hover effects
    document.querySelectorAll('.mini-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Initialize the cart functionality from script.js
    if (typeof initializeCart === 'function') {
        initializeCart();
    }
});