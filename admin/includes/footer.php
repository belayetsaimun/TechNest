                </div><!-- .content -->
            </div><!-- .content-wrapper -->
        </div><!-- .main-content -->
    </div><!-- .admin-container -->
    
    <script>
        // Simple admin panel JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            // Sidebar toggle for mobile
            const sidebarToggle = document.getElementById('sidebar-toggle');
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');
            
            if (sidebarToggle) {
                sidebarToggle.addEventListener('click', function() {
                    sidebar.classList.toggle('show');
                    mainContent.classList.toggle('sidebar-open');
                });
            }
            
            // Close alerts
            const closeAlerts = document.querySelectorAll('.close-alert');
            closeAlerts.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    const alert = this.closest('.alert');
                    if (alert) {
                        alert.style.opacity = '0';
                        setTimeout(function() {
                            alert.style.display = 'none';
                        }, 300);
                    }
                });
            });
            
            // Modals
            const modalTriggers = document.querySelectorAll('[data-modal]');
            const modalCloses = document.querySelectorAll('.close-modal, .cancel-btn');
            
            modalTriggers.forEach(function(trigger) {
                trigger.addEventListener('click', function(e) {
                    e.preventDefault();
                    const modalId = this.dataset.modal;
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        modal.classList.add('show');
                    }
                });
            });
            
            modalCloses.forEach(function(close) {
                close.addEventListener('click', function() {
                    const modal = this.closest('.modal');
                    if (modal) {
                        modal.classList.remove('show');
                    }
                });
            });
            
            // Close modal when clicking outside
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('modal')) {
                    e.target.classList.remove('show');
                }
            });
        });
    </script>
</body>
</html>