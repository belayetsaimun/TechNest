document.addEventListener('DOMContentLoaded', function() {
    const tabsContainer = document.querySelector('.auth-tabs');
    const activeTab = document.querySelector('.auth-tab.active');

    // If the active tab is the 'Sign Up' button, add the class to move the slider.
    if (tabsContainer && activeTab && activeTab.dataset.target === 'signup-form') {
        tabsContainer.classList.add('signup-active');
    }
    
    // Password toggle functionality only
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            button.classList.toggle('fa-eye');
            button.classList.toggle('fa-eye-slash');
        });
    });
    
    // Password strength meter logic
    const passwordInput = document.getElementById('signup-password');
    const strengthSegments = document.querySelectorAll('.strength-segment');
    const strengthText = document.querySelector('.strength-text');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            // Password strength logic
            const password = this.value;
            let strength = 0;
            
            if (password.length >= 8) strength += 1;
            if (/[A-Z]/.test(password)) strength += 1;
            if (/[0-9]/.test(password)) strength += 1;
            if (/[^A-Za-z0-9]/.test(password)) strength += 1;
            
            // Update UI based on password strength
            // (implementation as in your original code)
        });
    }
});