document.addEventListener('DOMContentLoaded', function() {
    console.log('New Arrivals script initialized - Updated 2025-07-11 16:37');

    // Global variables and state
    const cartKey = typeof currentUserId !== 'undefined' && currentUserId ? `cart_${currentUserId}` : 'cart_guest';
    const wishlistKey = typeof currentUserId !== 'undefined' && currentUserId ? `wishlist_${currentUserId}` : 'wishlist_guest';
    
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    let wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
    
    // Use global notification tracking
    window.activeNotifications = window.activeNotifications || [];
    
    // Expose global functions for other scripts
    window.addToCartHandler = addToCartHandler;
    window.showNotification = window.showNotification || showNotification;
    window.updateWishlistUI = updateWishlistUI;
    window.showWishlistSidebar = showWishlistSidebar;
    
    // Initialize components
    initializeCartCount();
    initializeWishlistCount();
    setProductCardAnimationDelay();
    initProductFilter();
    initProductSorting();
    
    // FIXED: Make sure the color selection function runs and properly selects
    setTimeout(initColorSelection, 100);  // Small delay to ensure DOM is ready
    
    // CRITICAL FIX: Completely rewritten coming soon slider functionality with explicit slide display control
    setTimeout(initFixedComingSoonSlider, 100);
    
    initPagination();
    
    // CRITICAL FIX: Simplified notify buttons functionality with direct notification
    initFixedNotifyButtons();
    
    initQuickView();
    initAddToCart();
    initBuyNowButtons();
    
    // FIXED: Fix for featured products section
    initFixedFeaturedProductActions();
    
    initAddToWishlist();
    initSidebars();

    // Update UI on page load
    updateWishlistButtonStates();
    
    // FIXED: Completely rewritten featured product initialization function 
    function initFixedFeaturedProductActions() {
        console.log("Initializing featured product actions (FIXED)");
        
        // Direct DOM selections for featured section elements
        const featuredSection = document.querySelector('.featured-arrival');
        if (!featuredSection) {
            console.log("Featured arrival section not found");
            return;
        }
        
        // Find the buttons with more specific selectors
        const featuredAddCartBtn = featuredSection.querySelector('.featured-add-cart') || 
                                  featuredSection.querySelector('.add-to-cart-btn') || 
                                  featuredSection.querySelector('button[id^="featuredAdd"]');
                                  
        const featuredBuyNowBtn = featuredSection.querySelector('.featured-buy-now') || 
                                  featuredSection.querySelector('.buy-now-btn') ||
                                  featuredSection.querySelector('button[id^="featuredBuy"]');
                                  
        const featuredWishlistBtn = featuredSection.querySelector('.featured-wishlist') || 
                                    featuredSection.querySelector('.wishlist-btn') ||
                                    featuredSection.querySelector('button[id^="featuredWish"]');
        
        console.log("Featured buttons found:", {
            addToCart: featuredAddCartBtn ? "Yes" : "No",
            buyNow: featuredBuyNowBtn ? "Yes" : "No", 
            wishlist: featuredWishlistBtn ? "Yes" : "No"
        });
        
        // Add to Cart button
        if (featuredAddCartBtn) {
            // FIXED: Use direct event listener without cloning
            featuredAddCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Featured add to cart button clicked");
                
                try {
                    // Get product information with better error handling
                    const productName = featuredSection.querySelector('h3')?.textContent || 
                                        featuredSection.querySelector('.product-title')?.textContent || 
                                        'iPhone 16 Pro Max';
                                        
                    const priceElement = featuredSection.querySelector('.price-main') || 
                                         featuredSection.querySelector('.current-price');
                    const priceText = priceElement?.textContent || '৳219,999';
                    const productPrice = parseFloat(priceText.replace(/[৳,]/g, '')) || 219999;
                    
                    const imageElement = featuredSection.querySelector('.featured-image img') || 
                                         featuredSection.querySelector('.product-image');
                    const productImage = imageElement?.src || 'assets/images/iphone16T.png';
                    
                    // Get selected color with better error handling
                    let colorName = "Titanium";
                    const selectedColor = featuredSection.querySelector('.colors .color.active') || 
                                          featuredSection.querySelector('.color-option.active');
                    if (selectedColor) {
                        colorName = selectedColor.getAttribute('data-color') || 
                                    selectedColor.getAttribute('title') || colorName;
                    }
                    
                    const product = {
                        id: 'iphone16pro-' + colorName.toLowerCase(),
                        name: productName + ' - ' + colorName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1,
                        category: 'phones'
                    };
                    
                    console.log("Adding featured product to cart:", product);
                    addToCartHandler(product);
                    
                    // Show extra notification for confirmation
                    showNotification(`${product.name} added to cart!`, 'success');
                } catch (error) {
                    console.error("Error adding featured product to cart:", error);
                    showNotification("Error adding product to cart. Please try again.", "error");
                }
            });
        }
        
        // Buy Now button
        if (featuredBuyNowBtn) {
            // FIXED: Use direct event listener without cloning
            featuredBuyNowBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Featured buy now button clicked");
                
                try {
                    // Get product information with better error handling
                    const productName = featuredSection.querySelector('h3')?.textContent || 
                                        featuredSection.querySelector('.product-title')?.textContent || 
                                        'iPhone 16 Pro Max';
                                        
                    const priceElement = featuredSection.querySelector('.price-main') || 
                                         featuredSection.querySelector('.current-price');
                    const priceText = priceElement?.textContent || '৳219,999';
                    const productPrice = parseFloat(priceText.replace(/[৳,]/g, '')) || 219999;
                    
                    const imageElement = featuredSection.querySelector('.featured-image img') || 
                                         featuredSection.querySelector('.product-image');
                    const productImage = imageElement?.src || 'assets/images/iphone16T.png';
                    
                    // Get selected color with better error handling
                    let colorName = "Titanium";
                    const selectedColor = featuredSection.querySelector('.colors .color.active') || 
                                          featuredSection.querySelector('.color-option.active');
                    if (selectedColor) {
                        colorName = selectedColor.getAttribute('data-color') || 
                                    selectedColor.getAttribute('title') || colorName;
                    }
                    
                    const product = {
                        id: 'iphone16pro-' + colorName.toLowerCase(),
                        name: productName + ' - ' + colorName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1,
                        category: 'phones'
                    };
                    
                    // Set the cart to only this item for direct checkout
                    cart = [product];
                    localStorage.setItem(cartKey, JSON.stringify(cart));
                    
                    // Redirect to checkout
                    window.location.href = 'checkout.php';
                } catch (error) {
                    console.error("Error with buy now functionality:", error);
                    showNotification("Error processing your request. Please try again.", "error");
                }
            });
        }
        
        // Wishlist button
        if (featuredWishlistBtn) {
            // FIXED: Use direct event listener without cloning
            featuredWishlistBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Featured wishlist button clicked");
                
                try {
                    // Get product information with better error handling
                    const productName = featuredSection.querySelector('h3')?.textContent || 
                                        featuredSection.querySelector('.product-title')?.textContent || 
                                        'iPhone 16 Pro Max';
                                        
                    const priceElement = featuredSection.querySelector('.price-main') || 
                                         featuredSection.querySelector('.current-price');
                    const priceText = priceElement?.textContent || '৳219,999';
                    const productPrice = parseFloat(priceText.replace(/[৳,]/g, '')) || 219999;
                    
                    const imageElement = featuredSection.querySelector('.featured-image img') || 
                                         featuredSection.querySelector('.product-image');
                    const productImage = imageElement?.src || 'assets/images/iphone16T.png';
                    
                    // Get selected color with better error handling
                    let colorName = "Titanium";
                    const selectedColor = featuredSection.querySelector('.colors .color.active') || 
                                          featuredSection.querySelector('.color-option.active');
                    if (selectedColor) {
                        colorName = selectedColor.getAttribute('data-color') || 
                                    selectedColor.getAttribute('title') || colorName;
                    }
                    
                    const product = {
                        id: 'iphone16pro-' + colorName.toLowerCase(),
                        name: productName + ' - ' + colorName,
                        price: productPrice,
                        image: productImage,
                        category: 'phones'
                    };
                    
                    toggleWishlistItem(product, featuredWishlistBtn);
                } catch (error) {
                    console.error("Error with wishlist functionality:", error);
                    showNotification("Error updating your wishlist. Please try again.", "error");
                }
            });
        }
        
        console.log("Featured arrival section initialization completed");
    }

    // Initialize cart count from localStorage
    function initializeCartCount() {
        updateCartCountDisplay(cart.reduce((total, item) => total + parseInt(item.quantity || 1), 0));
    }

    // Initialize wishlist count from localStorage
    function initializeWishlistCount() {
        updateWishlistCountDisplay(wishlist.length);
    }

    // Update cart count display
    function updateCartCountDisplay(count) {
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.classList.add('pulse');
            setTimeout(() => element.classList.remove('pulse'), 500);
        });
    }

    // Update wishlist count display
    function updateWishlistCountDisplay(count) {
        const wishlistCountElements = document.querySelectorAll('.wishlist-count');
        wishlistCountElements.forEach(element => {
            element.textContent = count;
        });
    }

    // Set animation delay for product cards based on their position
    function setProductCardAnimationDelay() {
        const products = document.querySelectorAll('.product-card');
        products.forEach((product, index) => {
            product.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Product Filter Functionality
    function initProductFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update active filters display
                updateActiveFilters(filter);
                
                // Apply filter
                if (filter === 'all') {
                    productCards.forEach(card => {
                        card.style.display = 'flex';
                    });
                } else {
                    productCards.forEach(card => {
                        const category = card.dataset.category;
                        if (category === filter || 
                            (filter === 'audio' && (category === 'headphones' || category === 'earbuds')) ||
                            (filter === 'wearables' && (category === 'smartwatches' || category === 'fitness'))) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    }

    // Update active filters display
    function updateActiveFilters(category) {
        const activeFiltersContainer = document.getElementById('activeFilters');
        if (!activeFiltersContainer) return;
        
        if (category === 'all') {
            activeFiltersContainer.innerHTML = '';
            return;
        }
        
        const categoryMap = {
            'phones': 'Smartphones',
            'tablets': 'Tablets',
            'laptops': 'Laptops',
            'audio': 'Audio Devices',
            'wearables': 'Wearables'
        };
        
        const filterName = categoryMap[category] || category;
        
        activeFiltersContainer.innerHTML = `
            <div class="active-filter">
                <span>${filterName}</span>
                <button class="clear-filter" onclick="clearFilter()">×</button>
            </div>
        `;
    }

    // Clear filter function
    function clearFilter() {
        document.querySelector('.filter-btn[data-filter="all"]').click();
    }

    // Make clearFilter available globally
    window.clearFilter = clearFilter;

    // Product Sorting
    function initProductSorting() {
        const sortSelect = document.getElementById('sort-select');
        if (!sortSelect) return;
        
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const productsGrid = document.getElementById('productsGrid');
            const products = Array.from(productsGrid.querySelectorAll('.product-card'));
            
            products.sort((a, b) => {
                switch (sortValue) {
                    case 'price-low':
                        return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                    case 'price-high':
                        return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                    case 'popular':
                        return parseInt(b.querySelector('.product-rating span').textContent.match(/\d+/)[0]) - 
                               parseInt(a.querySelector('.product-rating span').textContent.match(/\d+/)[0]);
                    case 'rating':
                        return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
                    case 'newest':
                    default:
                        return 0; // Keep current order for newest
                }
            });
            
            // Reorder in the DOM
            products.forEach(product => productsGrid.appendChild(product));
        });
    }

    // FIXED: Color Selection in Featured Product
    function initColorSelection() {
        console.log("Initializing color selection");
        const colorOptions = document.querySelectorAll('.colors .color, .color-option');
        const featuredProductImage = document.getElementById('featuredProductImage') || document.querySelector('.featured-image img');
        
        if (!colorOptions.length || !featuredProductImage) {
            console.log("Color options or featured image not found");
            return;
        }
        
        // Make sure one color is active by default
        let hasActive = false;
        colorOptions.forEach(option => {
            if (option.classList.contains('active')) hasActive = true;
        });
        
        if (!hasActive && colorOptions.length > 0) {
            colorOptions[0].classList.add('active');
        }
        
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                console.log("Color option clicked:", this.getAttribute('data-color') || this.getAttribute('title'));
                
                // Remove active class from all colors
                colorOptions.forEach(color => color.classList.remove('active'));
                
                // Add active class to selected color
                this.classList.add('active');
                
                // Update selected color text
                const colorName = this.getAttribute('data-color') || this.getAttribute('title') || "Default";
                const selectedColorText = document.querySelector('.selected-color strong');
                if (selectedColorText) {
                    selectedColorText.textContent = colorName;
                }
                
                // Update product image based on color
                const baseImagePath = 'assets/images/iphone16';
                let colorSuffix = '';
                
                const colorLower = colorName.toLowerCase();
                if (colorLower === 'white') colorSuffix = 'W';
                else if (colorLower === 'black') colorSuffix = 'B';
                else if (colorLower === 'blue') colorSuffix = 'BL';
                else if (colorLower === 'titanium') colorSuffix = 'T';
                else colorSuffix = ''; // Default
                
                // Apply fade effect and change image
                featuredProductImage.style.opacity = '0';
                setTimeout(() => {
                    // Check if we need to update image source based on color
                    if (colorSuffix) {
                        const currentSrc = featuredProductImage.src;
                        const urlParts = currentSrc.split('/');
                        let filename = urlParts.pop();
                        const basePath = urlParts.join('/') + '/';
                        
                        // Remove any existing color suffix and add the new one
                        filename = filename.replace(/[WBLT]{1,2}\.(png|jpg|jpeg|webp)$/i, '.$1');
                        const newFilename = filename.replace(/\.(png|jpg|jpeg|webp)$/i, `${colorSuffix}.$1`);
                        featuredProductImage.src = basePath + newFilename;
                    }
                    
                    featuredProductImage.style.opacity = '1';
                    
                    // Update wishlist button state after color change
                    updateWishlistButtonStates();
                }, 300);
            });
        });
    }

    // CRITICAL FIX: Coming Soon Slider Functionality - now properly shows all slides
    function initFixedComingSoonSlider() {
        console.log("Initializing fixed coming soon slider");
        
        const slider = document.querySelector('#comingSoonSlider');
        if (!slider) {
            console.error('Coming soon slider element not found');
            return;
        }
        
        // Get all slides, navigation buttons and dots
        const slides = slider.querySelectorAll('.coming-soon-slide');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const dots = document.querySelectorAll('.slider-dots .dot');
        
        if (slides.length === 0) {
            console.error('No slides found in coming soon slider');
            return;
        }
        
        console.log(`Found ${slides.length} coming soon slides`);
        
        // Initialize current slide index
        let currentSlide = 0;
        
        // CRITICAL FIX: Set initial styles for all slides explicitly
        slides.forEach((slide, index) => {
            // The first slide is visible, all others are hidden
            slide.style.display = index === 0 ? 'block' : 'none';
            slide.classList.toggle('active', index === 0);
        });
        
        // Apply active class to the first dot
        if (dots.length > 0) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[0].classList.add('active');
        }
        
        // Function to go to a specific slide
        function goToSlide(index) {
            // Hide all slides first
            slides.forEach((slide, i) => {
                slide.style.display = 'none';
                slide.classList.remove('active');
                if (dots[i]) dots[i].classList.remove('active');
            });
            
            // Show the target slide
            if (slides[index]) {
                slides[index].style.display = 'block';
                slides[index].classList.add('active');
                if (dots[index]) dots[index].classList.add('active');
            }
            
            // Update current slide index
            currentSlide = index;
        }
        
        // Previous button handler
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                // Calculate the previous slide index with wrap-around
                const prevSlide = (currentSlide - 1 + slides.length) % slides.length;
                goToSlide(prevSlide);
            });
        }
        
        // Next button handler
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                // Calculate the next slide index with wrap-around
                const nextSlide = (currentSlide + 1) % slides.length;
                goToSlide(nextSlide);
            });
        }
        
        // Dot navigation handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                goToSlide(index);
            });
        });
        
        // Set up auto-advance
        let autoAdvance = setInterval(() => {
            const nextSlide = (currentSlide + 1) % slides.length;
            goToSlide(nextSlide);
        }, 5000);
        
        // Pause auto-advance on hover
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoAdvance);
        });
        
        slider.addEventListener('mouseleave', () => {
            autoAdvance = setInterval(() => {
                const nextSlide = (currentSlide + 1) % slides.length;
                goToSlide(nextSlide);
            }, 5000);
        });
        
        console.log('Coming soon slider fixed and initialized');
    }

    // Initialize Pagination (Load More)
    function initPagination() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;
        
        const productsGrid = document.getElementById('productsGrid');
        const products = productsGrid.querySelectorAll('.product-card');
        const productsPerPage = 8;
        let currentlyShown = productsPerPage;
        
        // Initially hide products beyond the first page
        if (products.length > productsPerPage) {
            for (let i = productsPerPage; i < products.length; i++) {
                products[i].style.display = 'none';
                products[i].classList.add('load-more-hidden');
            }
        } else {
            loadMoreBtn.style.display = 'none';
        }
        
        loadMoreBtn.addEventListener('click', function() {
            // Calculate how many more to show
            const nextBatch = Math.min(currentlyShown + productsPerPage, products.length);
            
            // Show the next batch
            for (let i = currentlyShown; i < nextBatch; i++) {
                products[i].classList.remove('load-more-hidden');
                products[i].style.display = 'flex';
                products[i].classList.add('fade-in');
            }
            
            // Update counter
            currentlyShown = nextBatch;
            
            // Hide button if all products are shown
            if (currentlyShown >= products.length) {
                loadMoreBtn.style.display = 'none';
            }
            
            showNotification('More products loaded!', 'success');
        });
    }

    // CRITICAL FIX: Simplified Notify Buttons Functionality with direct notification
    function initFixedNotifyButtons() {
        console.log("Initializing fixed notify buttons");
        const notifyButtons = document.querySelectorAll('.notify-btn');
        
        if (notifyButtons.length === 0) {
            console.log("No notify buttons found");
            return;
        }
        
        console.log(`Found ${notifyButtons.length} notify buttons`);
        
        notifyButtons.forEach(button => {
            // Clean up by using a fresh event listener
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get product name
                const productCard = this.closest('.coming-soon-card');
                let productName = "this product";
                if (productCard) {
                    const nameEl = productCard.querySelector('h3');
                    if (nameEl) {
                        productName = nameEl.textContent.trim();
                    }
                }
                
                // CRITICAL FIX: Now shows notification immediately after clicking
                showNotification(`You'll be notified when ${productName} becomes available!`, 'success');
                
                // Update button state
                this.innerHTML = '<i class="fas fa-check"></i> Notification Set';
                this.classList.add('notification-set');
                this.disabled = true;
            });
        });
    }

    // Initialize Quick View functionality
    function initQuickView() {
        // Custom quick view implementation has replaced this function
        // Left as a placeholder for backwards compatibility
    }

    // Add to Cart Functionality
    function initAddToCart() {
        // Attach event listener to product cards
        document.addEventListener('click', function(e) {
            const addToCartBtn = e.target.closest('.add-to-cart');
            if (!addToCartBtn) return;
            
            e.preventDefault();
            
            const productCard = addToCartBtn.closest('.product-card');
            if (!productCard) return;
            
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: parseFloat(productCard.dataset.price),
                image: productCard.dataset.image,
                quantity: 1
            };
            
            addToCartHandler(product);
        });
    }

    // Add to cart handler - FIXED to show sidebar instantly
    function addToCartHandler(product) {
        console.log("Adding to cart from new arrivals:", product);
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // Update quantity if already in cart
            cart[existingItemIndex].quantity += product.quantity || 1;
        } else {
            // Add new item to cart
            cart.push({
                ...product,
                quantity: product.quantity || 1
            });
        }
        
        // Save to localStorage
        localStorage.setItem(cartKey, JSON.stringify(cart));
        
        // Update UI
        updateCartCountDisplay(cart.reduce((total, item) => total + parseInt(item.quantity || 1), 0));
        
        // Use global notification function if available
        showNotification(`${product.name} added to cart!`, 'success');
        
        // Update and show cart sidebar immediately
        updateCartUI(cart);
        showCartSidebar();
        
        // Dispatch a custom event that other scripts can listen for
        document.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { product, cart, action: 'add', source: 'newArrivals' }
        }));
    }

    // Initialize Buy Now buttons
    function initBuyNowButtons() {
        document.addEventListener('click', function(e) {
            const buyNowBtn = e.target.closest('.buy-now');
            if (!buyNowBtn) return;
            
            e.preventDefault();
            
            const productCard = buyNowBtn.closest('.product-card');
            if (!productCard) return;
            
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: parseFloat(productCard.dataset.price),
                image: productCard.dataset.image,
                quantity: 1
            };
            
            // Set the cart to only this item for direct checkout
            cart = [product];
            localStorage.setItem(cartKey, JSON.stringify(cart));
            
            // Redirect to checkout
            window.location.href = 'checkout.php';
        });
    }
    
    // Add to Wishlist Functionality
    function initAddToWishlist() {
        document.addEventListener('click', function(e) {
            const wishlistBtn = e.target.closest('.add-to-wishlist');
            if (!wishlistBtn) return;
            
            e.preventDefault();
            
            const productCard = wishlistBtn.closest('.product-card');
            if (!productCard) return;
            
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: parseFloat(productCard.dataset.price),
                image: productCard.dataset.image
            };
            
            toggleWishlistItem(product, wishlistBtn);
        });
    }

    // Toggle wishlist item - FIXED to show sidebar immediately
    function toggleWishlistItem(product, button) {
        // Check if product is already in wishlist
        const existingItemIndex = wishlist.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // Remove from wishlist
            wishlist.splice(existingItemIndex, 1);
            
            // Update button icon
            if (button && button.querySelector('i')) {
                button.querySelector('i').className = 'far fa-heart';
            }
            
            showNotification(`${product.name} removed from wishlist.`, 'info');
        } else {
            // Add to wishlist
            wishlist.push(product);
            
            // Update button icon
            if (button && button.querySelector('i')) {
                button.querySelector('i').className = 'fas fa-heart';
            }
            
            showNotification(`${product.name} added to wishlist!`, 'success');
            
            // Show wishlist sidebar immediately
            updateWishlistUI(wishlist);
            showWishlistSidebar();
        }
        
        // Save to localStorage
        localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
        
        // Update count and buttons
        updateWishlistCount();
        updateWishlistButtonStates();
        
        // Add animation
        addHeartAnimation(button);
        
        // Dispatch event for other scripts
        document.dispatchEvent(new CustomEvent('wishlistUpdated', { 
            detail: { product, wishlist, action: existingItemIndex !== -1 ? 'remove' : 'add', source: 'newArrivals' }
        }));
    }

    function showCartSidebar() {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        
        if (!cartSidebar || !overlay) {
            console.error("Cart sidebar or overlay not found");
            return;
        }
        
        // Show sidebar
        cartSidebar.style.right = '0';
        overlay.style.display = 'block';
    }

    function updateCartUI(cart) {
        console.log("Updating cart UI in new-arrivals.js");
        const cartSidebar = document.getElementById('cartSidebar');
        if (!cartSidebar) {
            console.error("Cart sidebar not found for updating UI");
            return;
        }
        
        const cartItems = cartSidebar.querySelector('.cart-items');
        const emptyCart = cartSidebar.querySelector('.empty-cart');
        const cartSummary = cartSidebar.querySelector('.cart-summary');
        
        if (!cartItems || !emptyCart || !cartSummary) {
            console.error("Required cart elements not found");
            return;
        }
        
        // Clear current items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            // Show empty cart message
            emptyCart.style.display = 'flex';
            cartSummary.style.display = 'none';
            return;
        }
        
        // Hide empty cart message and show summary
        emptyCart.style.display = 'none';
        cartSummary.style.display = 'block';
        
        // Generate HTML for cart items
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemPrice = parseFloat(item.price);
            const itemQuantity = parseInt(item.quantity);
            const itemTotal = itemPrice * itemQuantity;
            subtotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.dataset.id = item.id;
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">৳${itemTotal.toLocaleString()}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}"><i class="fas fa-minus"></i></button>
                        <input type="number" value="${itemQuantity}" min="1" max="10" readonly>
                        <button class="quantity-btn plus" data-id="${item.id}"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Add event listeners to cart items
        cartItems.querySelectorAll('.cart-item').forEach(item => {
            const minusBtn = item.querySelector('.minus');
            const plusBtn = item.querySelector('.plus');
            const removeBtn = item.querySelector('.remove-item');
            
            const id = item.dataset.id;
            
            if (minusBtn) {
                minusBtn.addEventListener('click', function() {
                    handleCartQuantityChange(id, -1);
                });
            }
            
            if (plusBtn) {
                plusBtn.addEventListener('click', function() {
                    handleCartQuantityChange(id, 1);
                });
            }
            
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    removeCartItem(id);
                });
            }
        });
        
        // Update cart summary
        const shipping = subtotal > 50000 ? 0 : 150;
        const total = subtotal + shipping;
        
        cartSidebar.querySelector('.cart-subtotal').textContent = `৳${subtotal.toLocaleString()}`;
        cartSidebar.querySelector('.cart-shipping').textContent = shipping === 0 ? 'Free' : `৳${shipping}`;
        cartSidebar.querySelector('.cart-total').textContent = `৳${total.toLocaleString()}`;
    }

    function handleCartQuantityChange(id, change) {
        const itemIndex = cart.findIndex(item => item.id === id);
        
        if (itemIndex === -1) return;
        
        const newQuantity = parseInt(cart[itemIndex].quantity) + change;
        
        if (newQuantity <= 0) {
            // Remove the item if quantity would be 0 or less
            removeCartItem(id);
            return;
        }
        
        if (newQuantity > 10) {
            showNotification("Maximum quantity is 10 per item.", "info");
            return;
        }
        
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem(cartKey, JSON.stringify(cart));
        
        updateCartUI(cart);
        updateCartCountDisplay(cart.reduce((total, item) => total + parseInt(item.quantity || 1), 0));
        
        // Dispatch event for other scripts
        document.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { itemId: id, change, cart, action: 'updateQuantity', source: 'newArrivals' }
        }));
    }

    function removeCartItem(id) {
        const itemIndex = cart.findIndex(item => item.id === id);
        
        if (itemIndex === -1) return;
        
        const removedItem = cart[itemIndex];
        cart.splice(itemIndex, 1);
        
        localStorage.setItem(cartKey, JSON.stringify(cart));
        
        updateCartUI(cart);
        updateCartCountDisplay(cart.reduce((total, item) => total + parseInt(item.quantity || 1), 0));
        
        showNotification(`${removedItem.name} removed from cart.`, "info");
        
        // Dispatch event for other scripts
        document.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { itemId: id, cart, action: 'remove', removedItem, source: 'newArrivals' }
        }));
    }

    function showNotification(message, type = 'info') {
        // Use global notification tracking
        if (window.activeNotifications && window.activeNotifications.includes(message)) {
            console.log("Prevented duplicate notification:", message);
            return;
        }
        
        // Track this notification globally
        if (window.activeNotifications) {
            window.activeNotifications.push(message);
        } else {
            window.activeNotifications = [message];
        }
        
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconClass = type === 'success' ? 'fa-check-circle' : 
                          type === 'error' ? 'fa-exclamation-circle' : 
                          'fa-info-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${iconClass}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        container.appendChild(notification);
        
        // Add close button event
        notification.querySelector('.notification-close').addEventListener('click', function() {
            removeNotification(notification, message);
        });
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            removeNotification(notification, message);
        }, 3000);
    }
    
    function removeNotification(notification, message) {
        if (!notification.parentElement) return;
        
        notification.classList.add('fade-out');
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
                
                // Remove from global active notifications
                if (window.activeNotifications) {
                    const index = window.activeNotifications.indexOf(message);
                    if (index > -1) {
                        window.activeNotifications.splice(index, 1);
                    }
                }
            }
        }, 300);
    }
    
    function updateWishlistCount() {
        updateWishlistCountDisplay(wishlist.length);
    }
    
    // Update wishlist button states
    function updateWishlistButtonStates() {
        const wishlistBtns = document.querySelectorAll('.add-to-wishlist');
        
        wishlistBtns.forEach(btn => {
            const productCard = btn.closest('.product-card');
            if (!productCard) return;
            
            const productId = productCard.dataset.id;
            const inWishlist = wishlist.some(item => item.id === productId);
            
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = inWishlist ? 'fas fa-heart' : 'far fa-heart';
            }
        });
        
        // Also update featured product wishlist button
        const featuredWishlistBtn = document.querySelector('.featured-wishlist');
        if (featuredWishlistBtn) {
            const selectedColor = document.querySelector('.colors .color.active') || 
                                 document.querySelector('.color-option.active');
            
            const colorName = selectedColor ? 
                             (selectedColor.getAttribute('data-color') || 
                              selectedColor.getAttribute('title') || 
                              'Titanium') : 'Titanium';
                              
            const featuredProductId = 'iphone16pro-' + colorName.toLowerCase();
            
            const inWishlist = wishlist.some(item => item.id === featuredProductId);
            
            const icon = featuredWishlistBtn.querySelector('i');
            if (icon) {
                icon.className = inWishlist ? 'fas fa-heart' : 'far fa-heart';
            }
        }
    }

    // Add heart animation
    function addHeartAnimation(button) {
        if (!button) return;
        
        const heart = document.createElement('div');
        heart.className = 'heart-animation';
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        
        button.style.position = 'relative';
        button.appendChild(heart);
        
        // Remove after animation completes
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 1000);
    }

    // Initialize Cart and Wishlist Sidebars
    function initSidebars() {
        const cartBtn = document.getElementById('cartBtn');
        const wishlistBtn = document.getElementById('wishlistBtn');
        const closeCart = document.querySelector('.close-cart');
        const closeWishlist = document.querySelector('.close-wishlist');
        const continueShoppingBtn = document.querySelector('.continue-shopping');
        const overlay = document.getElementById('overlay');
        
        if (cartBtn) {
            cartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showCartSidebar();
            });
        }
        
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showWishlistSidebar();
            });
        }
        
        if (closeCart) {
            closeCart.addEventListener('click', hideCartSidebar);
        }
        
        if (closeWishlist) {
            closeWishlist.addEventListener('click', hideWishlistSidebar);
        }
        
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', hideCartSidebar);
        }
        
        if (overlay) {
            overlay.addEventListener('click', function() {
                hideCartSidebar();
                hideWishlistSidebar();
            });
        }
        
        // Clear wishlist button
        const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');
        if (clearWishlistBtn) {
            clearWishlistBtn.addEventListener('click', function() {
                wishlist = [];
                localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
                updateWishlistCountDisplay(0);
                updateWishlistUI(wishlist);
                updateWishlistButtonStates();
                showNotification('Wishlist cleared!', 'info');
            });
        }
    }

    function hideCartSidebar() {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        
        if (!cartSidebar) return;
        
        cartSidebar.style.right = '-400px';
        
        // Only hide overlay if wishlist isn't showing
        const wishlistSidebar = document.querySelector('.wishlist-sidebar');
        if (overlay && (!wishlistSidebar || wishlistSidebar.style.right !== '0px')) {
            overlay.style.display = 'none';
        }
    }

    function showWishlistSidebar() {
        const wishlistSidebar = document.getElementById('wishlistSidebar');
        const overlay = document.getElementById('overlay');
        
        if (!wishlistSidebar || !overlay) {
            console.error("Wishlist sidebar or overlay not found");
            return;
        }
        
        // Update wishlist UI first
        updateWishlistUI(wishlist);
        
        // Show sidebar
        wishlistSidebar.style.right = '0';
        overlay.style.display = 'block';
    }

    function hideWishlistSidebar() {
        const wishlistSidebar = document.getElementById('wishlistSidebar');
        const overlay = document.getElementById('overlay');
        
        if (!wishlistSidebar) return;
        
        wishlistSidebar.style.right = '-400px';
        
        // Only hide overlay if cart isn't showing
        const cartSidebar = document.querySelector('.cart-sidebar');
        if (overlay && (!cartSidebar || cartSidebar.style.right !== '0px')) {
            overlay.style.display = 'none';
        }
    }

    function updateWishlistUI(wishlist) {
        const wishlistSidebar = document.getElementById('wishlistSidebar');
        if (!wishlistSidebar) {
            console.error("Wishlist sidebar not found");
            return;
        }
        
        const wishlistItems = wishlistSidebar.querySelector('.wishlist-items');
        const emptyWishlist = wishlistSidebar.querySelector('.empty-wishlist');
        const wishlistActions = wishlistSidebar.querySelector('.wishlist-actions');
        
        if (!wishlistItems || !emptyWishlist || !wishlistActions) {
            console.error("Required wishlist elements not found");
            return;
        }
        
        // Clear current items
        wishlistItems.innerHTML = '';
        
        if (wishlist.length === 0) {
            // Show empty wishlist message
            emptyWishlist.style.display = 'flex';
            wishlistActions.style.display = 'none';
            return;
        }
        
        // Hide empty wishlist message and show actions
        emptyWishlist.style.display = 'none';
        wishlistActions.style.display = 'flex';
        
        // Generate HTML for wishlist items
        wishlist.forEach(item => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item';
            wishlistItem.dataset.id = item.id;
            wishlistItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="wishlist-item-info">
                    <h4>${item.name}</h4>
                    <p class="wishlist-item-price">৳${parseFloat(item.price).toLocaleString()}</p>
                </div>
                <div class="wishlist-item-actions">
                    <button class="move-to-cart" data-id="${item.id}" title="Add to Cart">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="remove-from-wishlist" data-id="${item.id}" title="Remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            wishlistItems.appendChild(wishlistItem);
        });
        
        // Add event listeners for wishlist items
        attachWishlistItemEventListeners(wishlistItems);
    }
    
    function attachWishlistItemEventListeners(wishlistItems) {
        const moveToCartBtns = wishlistItems.querySelectorAll('.move-to-cart');
        const removeBtns = wishlistItems.querySelectorAll('.remove-from-wishlist');
        
        moveToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                moveToCart(this.dataset.id);
            });
        });
        
        removeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                removeWishlistItem(this.dataset.id);
            });
        });
    }
    
    function moveToCart(id) {
        const itemIndex = wishlist.findIndex(item => item.id === id);
        
        if (itemIndex === -1) return;
        
        const item = wishlist[itemIndex];
        
        // Add to cart
        addToCartHandler({...item, quantity: 1});
        
        // Remove from wishlist
        removeWishlistItem(id);
    }
    
    function removeWishlistItem(id) {
        const itemIndex = wishlist.findIndex(item => item.id === id);
        
        if (itemIndex === -1) return;
        
        const removedItem = wishlist[itemIndex];
        wishlist.splice(itemIndex, 1);
        
        localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
        updateWishlistUI(wishlist);
        updateWishlistCountDisplay(wishlist.length);
        updateWishlistButtonStates();
        
        showNotification(`${removedItem.name} removed from wishlist.`, 'info');
        
        // Dispatch event for other scripts
        document.dispatchEvent(new CustomEvent('wishlistUpdated', {
            detail: { itemId: id, wishlist, action: 'remove', source: 'newArrivals' }
        }));
    }

    // Listen for cart updates from other scripts
    document.addEventListener('cartUpdated', function(e) {
        // Only process events from other sources
        if (e.detail.source !== 'newArrivals') {
            console.log("Cart update received from external source:", e.detail);
            cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
            updateCartCountDisplay(cart.reduce((total, item) => total + parseInt(item.quantity || 1), 0));
            
            // If cart sidebar is open, update its contents
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar && cartSidebar.style.right === '0px') {
                updateCartUI(cart);
            }
        }
    });
    
    // Listen for wishlist updates from other scripts
    document.addEventListener('wishlistUpdated', function(e) {
        // Only process events from other sources
        if (e.detail.source !== 'newArrivals') {
            console.log("Wishlist update received from external source:", e.detail);
            wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
            updateWishlistCountDisplay(wishlist.length);
            updateWishlistButtonStates();
            
            // If wishlist sidebar is open, update its contents
            const wishlistSidebar = document.getElementById('wishlistSidebar');
            if (wishlistSidebar && wishlistSidebar.style.right === '0px') {
                updateWishlistUI(wishlist);
            }
        }
    });
    
    // Make important functions available globally
    window.showCartSidebar = showCartSidebar;
    window.updateCartUI = updateCartUI;
    window.showWishlistSidebar = showWishlistSidebar;
    window.updateWishlistUI = updateWishlistUI;
});