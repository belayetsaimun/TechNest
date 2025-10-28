document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact.js loaded and executing.');

    // Initialize all features specific to the contact page
    initContactForm();
    initFAQs();

    /**
     * [FIX] This is the core logic for the contact form.
     * It now only performs client-side validation. If the form is valid,
     * it allows the browser to submit the data to your 'process_contact.php' script.
     */
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(event) {
            // Step 1: Validate the form fields before sending
            const isFormValid = validateForm();

            // Step 2: If the form is NOT valid, STOP it from submitting
            if (!isFormValid) {
                event.preventDefault(); // This is the crucial change
                showNotification('Please correct the highlighted errors before sending.', 'error');
            }
            // If the form IS valid, this script does nothing, and the form submits normally.
        });

        const resetBtn = contactForm.querySelector('.reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                clearFormErrors();
                contactForm.reset();
            });
        }
    }

    /**
     * Validates all required fields in the contact form.
     * @returns {boolean} - True if the form is valid, false otherwise.
     */
    function validateForm() {
        let isValid = true;
        clearFormErrors(); // Clear previous errors first

        const requiredFields = {
            'name': 'Full name is required.',
            'email': 'Email address is required.',
            'subject': 'Please select a subject.',
            'message': 'Message is required.'
        };
        
        for (const fieldName in requiredFields) {
            const field = document.getElementById(fieldName);
            if (!field.value.trim()) {
                showFieldError(field, requiredFields[fieldName]);
                isValid = false;
            }
        }

        const emailField = document.getElementById('email');
        if (emailField.value.trim() && !/\S+@\S+\.\S+/.test(emailField.value)) {
            showFieldError(emailField, 'Please enter a valid email address.');
            isValid = false;
        }
        
        return isValid;
    }

    /**
     * Displays an error message for a specific form field.
     * @param {HTMLElement} field - The input field element.
     * @param {string} message - The error message to display.
     */
    function showFieldError(field, message) {
        const inputWrapper = field.closest('.input-wrapper');
        inputWrapper.classList.add('error');
        // You can create and append an error message element here if you want
    }

    /**
     * Clears all validation error styles from the form.
     */
    function clearFormErrors() {
        document.querySelectorAll('.input-wrapper.error').forEach(wrapper => {
            wrapper.classList.remove('error');
        });
    }

    /**
     * Initializes the accordion functionality for the FAQ section.
     */
    function initFAQs() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    item.classList.toggle('active');
                });
            }
        });

        const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
        const faqCategories = document.querySelectorAll('.faq-category-content');
        faqCategoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                faqCategoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                faqCategories.forEach(cat => {
                    cat.classList.toggle('active', cat.dataset.category === category);
                });
            });
        });
    }

    /**
     * Shows a temporary notification toast.
     * @param {string} message - The message to display.
     * @param {string} type - The type of notification (e.g., 'success', 'error', 'info').
     */
    function showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        const iconClass = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        notification.innerHTML = `<div class="notification-content"><i class="fas ${iconClass}"></i><span>${message}</span></div><button class="notification-close">&times;</button>`;
        
        container.appendChild(notification);
        
        notification.querySelector('.notification-close').addEventListener('click', () => notification.remove());
        setTimeout(() => notification.remove(), 4000);
    }
});