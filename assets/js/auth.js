document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth.js initialized');
    
    // Password toggle functionality - Keep the working version
    function setupPasswordToggles() {
        // Get all toggle password buttons
        const toggleButtons = document.querySelectorAll('.toggle-password');
        console.log(`Found ${toggleButtons.length} password toggle buttons`);
        
        toggleButtons.forEach(function(button, index) {
            // Make sure it's clickable
            button.style.cursor = 'pointer';
            button.style.pointerEvents = 'auto';
            
            // Remove any existing listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add our click listener
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get the input - it should be a sibling
                const inputGroup = this.parentNode;
                const input = inputGroup.querySelector('input[type="password"], input[type="text"]');
                
                console.log(`Toggle button ${index} clicked. Found input:`, input);
                
                if (input) {
                    // Toggle visibility
                    input.type = input.type === 'password' ? 'text' : 'password';
                    
                    // Toggle icon
                    if (input.type === 'text') {
                        this.classList.remove('fa-eye');
                        this.classList.add('fa-eye-slash');
                    } else {
                        this.classList.remove('fa-eye-slash');
                        this.classList.add('fa-eye');
                    }
                    
                    console.log(`Input type changed to: ${input.type}`);
                }
            });
        });
    }
    
    // Run setup
    setupPasswordToggles();
    
    // IMPROVED PASSWORD STRENGTH METER
    function setupPasswordStrengthMeter() {
        const passwordInput = document.getElementById('signup-password');
        if (!passwordInput) {
            console.log('Password strength meter: No signup-password found');
            return;
        }
        
        const strengthMeter = document.querySelector('.strength-meter');
        const strengthText = document.querySelector('.strength-text');
        const strengthSegments = document.querySelectorAll('.strength-segment');
        
        if (!strengthMeter || !strengthText || strengthSegments.length === 0) {
            console.log('Password strength meter: Required elements not found');
            return;
        }
        
        console.log('Password strength meter initialized');
        
        // Function to calculate password strength
        function calculatePasswordStrength(password) {
            let score = 0;
            
            // Length check
            if (password.length >= 8) score += 1;
            
            // Uppercase check
            if (/[A-Z]/.test(password)) score += 1;
            
            // Number check
            if (/[0-9]/.test(password)) score += 1;
            
            // Special character check
            if (/[^A-Za-z0-9]/.test(password)) score += 1;
            
            return score;
        }
        
        // Function to update the strength meter UI
        function updateStrengthMeter(strength) {
            // Define labels and colors for different strength levels
            const labels = ['Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
            const colors = ['#ff6b6b', '#ff6b6b', '#ffbb55', '#2ecc71', '#27ae60'];
            
            // Update the text indicator
            strengthText.textContent = labels[strength];
            strengthText.style.color = colors[strength];
            
            // Update each segment
            strengthSegments.forEach((segment, index) => {
                if (index < strength) {
                    // Activate this segment
                    segment.classList.add('active');
                    
                    // Apply appropriate color class
                    if (strength <= 1) {
                        segment.classList.remove('medium', 'strong');
                    } else if (strength === 2) {
                        segment.classList.add('medium');
                        segment.classList.remove('strong');
                    } else {
                        segment.classList.add('strong');
                        segment.classList.remove('medium');
                    }
                    
                    segment.style.backgroundColor = colors[strength];
                } else {
                    // Deactivate this segment
                    segment.classList.remove('active', 'medium', 'strong');
                    segment.style.backgroundColor = '';
                }
            });
            
            console.log(`Password strength updated: ${labels[strength]}`);
        }
        
        // Add input event listener to password field
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updateStrengthMeter(strength);
        });
        
        // Initial check in case there's a value already
        if (passwordInput.value) {
            const strength = calculatePasswordStrength(passwordInput.value);
            updateStrengthMeter(strength);
        }
    }
    
    // Run password strength meter setup
    setupPasswordStrengthMeter();
    
    // Run both setups again after a short delay to handle any race conditions
    setTimeout(function() {
        setupPasswordToggles();
        setupPasswordStrengthMeter();
    }, 500);
});