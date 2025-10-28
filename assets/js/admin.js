document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle && sidebar && mainContent) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('sidebar-active');
        });
    }
    
    // Admin dropdown
    const adminDropdownBtn = document.querySelector('.admin-dropdown .dropdown-btn');
    const adminDropdownContent = document.querySelector('.admin-dropdown .dropdown-content');
    
    if (adminDropdownBtn && adminDropdownContent) {
        adminDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            adminDropdownContent.classList.toggle('show');
        });
        
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.admin-dropdown') && adminDropdownContent.classList.contains('show')) {
                adminDropdownContent.classList.remove('show');
            }
        });
    }
    
    // Close alerts
    const alertCloseButtons = document.querySelectorAll('.alert .close-alert');
    if (alertCloseButtons) {
        alertCloseButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const alert = this.closest('.alert');
                if (alert) {
                    alert.style.opacity = '0';
                    setTimeout(function() {
                        alert.style.display = 'none';
                    }, 300);
                }
            });
        });
    }
    
    // Image preview for product forms
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.addEventListener('load', function() {
                    imagePreview.style.backgroundImage = `url(${this.result})`;
                    imagePreview.innerHTML = '';
                });
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Modal handling
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const closeModalButtons = document.querySelectorAll('.close-modal, .cancel-btn');
    
    if (modalTriggers) {
        modalTriggers.forEach(function(trigger) {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('show');
                }
            });
        });
    }
    
    if (closeModalButtons) {
        closeModalButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }
    
    if (modals) {
        modals.forEach(function(modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('show');
                }
            });
        });
    }
    
    // Date range picker initialization for orders page
    const dateFrom = document.querySelector('input[name="date_from"]');
    const dateTo = document.querySelector('input[name="date_to"]');
    
    if (dateFrom && dateTo) {
        dateFrom.addEventListener('change', function() {
            dateTo.min = this.value;
        });
        
        dateTo.addEventListener('change', function() {
            dateFrom.max = this.value;
        });
    }
});