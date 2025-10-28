document.addEventListener('DOMContentLoaded', function() {
    // =====================================================
    // Mobile Navigation Toggle
    // =====================================================
    const menuIcon = document.getElementById('menuIcon');
    const navLinks = document.getElementById('navLinks');
    const closeMenu = document.getElementById('closeMenu');
    const overlay = document.getElementById('overlay');
    
    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', function() {
            navLinks.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    }
    
    if (closeMenu && navLinks) {
        closeMenu.addEventListener('click', function() {
            navLinks.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // =====================================================
    // Cart & Wishlist Sidebar Functionality - FIXED VERSION
    // =====================================================
    
    // Cart sidebar
    const cartBtn = document.querySelector('.cart');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    
    if (cartBtn && cartSidebar) {
        // Open cart
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.classList.add('no-scroll');
            
            // Close wishlist if open
            if (wishlistSidebar && wishlistSidebar.classList.contains('active')) {
                wishlistSidebar.classList.remove('active');
            }
        });
        
        // Close cart
        if (closeCart) {
            closeCart.addEventListener('click', function() {
                cartSidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        }
        
        // Continue shopping button also closes cart
        const continueShoppingBtn = document.querySelector('.continue-shopping');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', function() {
                cartSidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        }
    }
    
    // Wishlist sidebar
    const wishlistBtn = document.querySelector('.wishlist');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const closeWishlist = document.querySelector('.close-wishlist');
    
    if (wishlistBtn && wishlistSidebar) {
        // Open wishlist
        wishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            wishlistSidebar.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.classList.add('no-scroll');
            
            // Close cart if open
            if (cartSidebar && cartSidebar.classList.contains('active')) {
                cartSidebar.classList.remove('active');
            }
        });
        
        // Close wishlist
        if (closeWishlist) {
            closeWishlist.addEventListener('click', function() {
                wishlistSidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        }
    }
    
    // =====================================================
    // FIX: Improve Cart Item Layout
    // =====================================================
    function improveCartItemLayout() {
        // Restructure cart items for better mobile experience
        const cartItems = document.querySelectorAll('.cart-item:not(.improved)');
        
        if (cartItems.length > 0) {
            cartItems.forEach(item => {
                // Skip if already improved
                if (item.classList.contains('improved')) return;
                
                const image = item.querySelector('.cart-item-image');
                const details = item.querySelector('.cart-item-details');
                const title = item.querySelector('.cart-item-title');
                const price = item.querySelector('.cart-item-price');
                const controls = item.querySelector('.cart-item-controls');
                const removeBtn = item.querySelector('.remove-item');
                
                if (!image || !details) return; // Skip if missing key elements
                
                // Create new structure
                const topDiv = document.createElement('div');
                topDiv.className = 'cart-item-top';
                
                // Move existing elements into new structure
                item.insertBefore(topDiv, item.firstChild);
                topDiv.appendChild(image.cloneNode(true));
                topDiv.appendChild(details.cloneNode(true));
                
                // Remove original elements
                if (image.parentNode) image.parentNode.removeChild(image);
                if (details.parentNode) details.parentNode.removeChild(details);
                
                // Move remove button to top right if it exists
                if (removeBtn) {
                    topDiv.appendChild(removeBtn);
                }
                
                // Mark as improved
                item.classList.add('improved');
            });
        }
        
        // Do the same for wishlist items
        const wishlistItems = document.querySelectorAll('.wishlist-item:not(.improved)');
        
        if (wishlistItems.length > 0) {
            wishlistItems.forEach(item => {
                // Skip if already improved
                if (item.classList.contains('improved')) return;
                
                const image = item.querySelector('.wishlist-item-image');
                const details = item.querySelector('.wishlist-item-details');
                const removeBtn = item.querySelector('.remove-item');
                
                if (!image || !details) return; // Skip if missing key elements
                
                // Create new structure
                const topDiv = document.createElement('div');
                topDiv.className = 'wishlist-item-top';
                
                // Move existing elements into new structure
                item.insertBefore(topDiv, item.firstChild);
                topDiv.appendChild(image.cloneNode(true));
                topDiv.appendChild(details.cloneNode(true));
                
                // Remove original elements
                if (image.parentNode) image.parentNode.removeChild(image);
                if (details.parentNode) details.parentNode.removeChild(details);
                
                // Move remove button to top right if it exists
                if (removeBtn) {
                    topDiv.appendChild(removeBtn);
                }
                
                // Mark as improved
                item.classList.add('improved');
            });
        }
    }
    
    // Run on load
    improveCartItemLayout();
    
    // Run when cart is opened (in case of dynamic content)
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            // Short delay to allow any dynamic content to load
            setTimeout(improveCartItemLayout, 100);
        });
    }
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            // Short delay to allow any dynamic content to load
            setTimeout(improveCartItemLayout, 100);
        });
    }
    
    // =====================================================
    // Mobile Search
    // =====================================================
    const searchContainer = document.querySelector('.search-container');
    let searchToggle = document.querySelector('.search-toggle');
    
    // Create search toggle button if it doesn't exist on mobile
    if (!searchToggle && window.innerWidth <= 768) {
        searchToggle = document.createElement('div');
        searchToggle.className = 'search-toggle';
        searchToggle.innerHTML = '<i class="fas fa-search"></i>';
        
        // Add to navbar
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            navActions.prepend(searchToggle);
        }
    }
    
    // Toggle search function
    if (searchToggle && searchContainer) {
        searchToggle.addEventListener('click', function() {
            searchContainer.classList.toggle('active');
            if (searchContainer.classList.contains('active')) {
                searchContainer.querySelector('input').focus();
            }
        });
    }
    
    // =====================================================
    // Overlay Functionality
    // =====================================================
    if (overlay) {
        overlay.addEventListener('click', function() {
            // Close all active elements
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
            
            if (cartSidebar && cartSidebar.classList.contains('active')) {
                cartSidebar.classList.remove('active');
            }
            
            if (wishlistSidebar && wishlistSidebar.classList.contains('active')) {
                wishlistSidebar.classList.remove('active');
            }
            
            if (searchContainer && searchContainer.classList.contains('active')) {
                searchContainer.classList.remove('active');
            }
            
            // Remove overlay and enable scrolling
            this.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // =====================================================
    // Close with ESC key
    // =====================================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close all active elements
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
            
            if (cartSidebar && cartSidebar.classList.contains('active')) {
                cartSidebar.classList.remove('active');
            }
            
            if (wishlistSidebar && wishlistSidebar.classList.contains('active')) {
                wishlistSidebar.classList.remove('active');
            }
            
            if (searchContainer && searchContainer.classList.contains('active')) {
                searchContainer.classList.remove('active');
            }
            
            // Remove overlay and enable scrolling
            if (overlay) overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
    
    // =====================================================
    // Responsive Table Handling
    // =====================================================
    const tables = document.querySelectorAll('table:not(.responsive-table)');
    if (tables.length > 0) {
        tables.forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
            table.classList.add('responsive-table');
        });
    }
    
    // =====================================================
    // Window Resize Handler
    // =====================================================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Reset mobile menu when returning to desktop
            if (window.innerWidth > 992) {
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
                
                if (overlay) overlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
            
            // Handle search visibility
            if (window.innerWidth > 768) {
                if (searchContainer) searchContainer.classList.remove('active');
            }
        }, 250);
    });
    
    // =====================================================
    // Mobile Button Simplification
    // =====================================================
    function simplifyButtonsOnMobile() {
        if (window.innerWidth <= 576) {
            const productActionButtons = document.querySelectorAll('.product-action-buttons .btn');
            productActionButtons.forEach(btn => {
                if (btn.textContent.includes('Add to Cart') && !btn.classList.contains('simplified')) {
                    btn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
                    btn.classList.add('icon-only', 'simplified');
                }
                if (btn.textContent.includes('Wishlist') && !btn.classList.contains('simplified')) {
                    btn.innerHTML = '<i class="fas fa-heart"></i>';
                    btn.classList.add('icon-only', 'simplified');
                }
            });
        }
    }
    
    // Run on load
    simplifyButtonsOnMobile();
    
    // Run on resize
    window.addEventListener('resize', function() {
        simplifyButtonsOnMobile();
    });
});