document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const productGrid = document.querySelector('.product-grid');
    const productCards = document.querySelectorAll('.product-card');
    const sortBySelect = document.getElementById('sort-by');
    const categoryFilter = document.getElementById('category-filter');
    const priceRangeFilter = document.getElementById('price-range');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const paginationContainer = document.querySelector('.pagination');
    
    // Quick View Modal Elements
    const quickViewModal = document.getElementById('quickViewModal');
    const quickViewImage = quickViewModal ? quickViewModal.querySelector('.product-quick-view-image img') : null;
    const quickViewTitle = quickViewModal ? quickViewModal.querySelector('h2') : null;
    const quickViewPrice = quickViewModal ? quickViewModal.querySelector('.current-price') : null;
    const quickViewOldPrice = quickViewModal ? quickViewModal.querySelector('.old-price') : null;
    const quickViewDescription = quickViewModal ? quickViewModal.querySelector('.product-description p') : null;
    const quickViewRating = quickViewModal ? quickViewModal.querySelector('.product-rating') : null;
    
    // Cart and Overlay Elements
    const cartSidebar = document.getElementById('cartSidebar');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const overlay = document.getElementById('overlay');
    
    // Store original product order for reset
    const originalProducts = Array.from(productCards);
    
    // Items per page
    const itemsPerPage = 12;
    let currentPage = 1;
    let filteredProducts = originalProducts;
    
    // Initialize cart and wishlist from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Update cart and wishlist counts
    updateCartCount();
    updateWishlistCount();
    
    // Initialize the page
    initializeProductsPage();
    
    function initializeProductsPage() {
        // Check for URL parameters (for direct links)
        checkUrlParameters();
        
        // Set up event listeners
        setupEventListeners();
        
        // Set "All Categories" as default if not set in URL
        if (!window.location.search.includes('category=')) {
            categoryFilter.value = 'all';
        }
        
        // Apply initial filtering and sorting
        applyFilters();
        
        // Update pagination
        updatePagination();
        
        // Initialize wishlist icons
        initializeWishlistIcons();
    }
    
    function checkUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check for search query
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            // Add a visual indicator that search is applied
            const productsHeader = document.querySelector('.products-header h1');
            if (productsHeader) {
                productsHeader.textContent = `Search Results: "${searchQuery}"`;
            }
            
            // Filter products based on search
            filterBySearch(searchQuery);
        }
        
        // Check for category
        const category = urlParams.get('category');
        if (category && categoryFilter) {
            // Set the category filter dropdown
            if (categoryFilter.querySelector(`option[value="${category}"]`)) {
                categoryFilter.value = category;
            }
        }
        
        // Check for price range
        const priceRange = urlParams.get('price');
        if (priceRange && priceRangeFilter) {
            if (priceRangeFilter.querySelector(`option[value="${priceRange}"]`)) {
                priceRangeFilter.value = priceRange;
            }
        }
        
        // Check for sort order
        const sortBy = urlParams.get('sort');
        if (sortBy && sortBySelect) {
            if (sortBySelect.querySelector(`option[value="${sortBy}"]`)) {
                sortBySelect.value = sortBy;
            }
        }
    }
    
    function setupEventListeners() {
        // Sort selector
        if (sortBySelect) {
            sortBySelect.addEventListener('change', function() {
                applyFilters();
                updateUrlParameters();
            });
        }
        
        // Category filter
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                applyFilters();
                updateUrlParameters();
            });
        }
        
        // Price range filter
        if (priceRangeFilter) {
            priceRangeFilter.addEventListener('change', function() {
                applyFilters();
                updateUrlParameters();
            });
        }
        
        // Reset filters button
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', function() {
                resetFilters();
            });
        }
        
        // Add event listeners to Quick View buttons
        document.querySelectorAll('.product-card .quick-view').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productCard = this.closest('.product-card');
                if (productCard) {
                    openQuickView(productCard);
                }
            });
        });
        
        // Add event listeners to Add to Cart buttons
        document.querySelectorAll('.product-card .add-to-cart').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productCard = this.closest('.product-card');
                if (productCard) {
                    addToCart(productCard);
                }
            });
        });
        
        // Add event listeners to Add to Wishlist buttons
        document.querySelectorAll('.product-card .add-to-wishlist').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productCard = this.closest('.product-card');
                if (productCard) {
                    toggleWishlist(productCard);
                }
            });
        });
        
        // Close Quick View Modal
        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                quickViewModal.style.display = 'none';
                overlay.style.display = 'none';
            });
        }
        
        // Close sidebars and modal when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', function() {
                if (quickViewModal) quickViewModal.style.display = 'none';
                if (cartSidebar) cartSidebar.style.right = '-400px';
                if (wishlistSidebar) wishlistSidebar.style.right = '-400px';
                overlay.style.display = 'none';
            });
        }
    }
    
    // Filter by search function
    function filterBySearch(query) {
        if (!query || query.trim() === '') return;
        
        query = query.trim().toLowerCase();
        
        filteredProducts = originalProducts.filter(card => {
            const name = card.dataset.name.toLowerCase();
            return name.includes(query);
        });
        
        // Display filtered products
        displayProducts();
    }
    
    function applyFilters() {
        // Start with all products
        filteredProducts = [...originalProducts];
        
        // Apply category filter
        if (categoryFilter && categoryFilter.value !== 'all') {
            const selectedCategory = categoryFilter.value;
            filteredProducts = filteredProducts.filter(card => {
                return card.dataset.category === selectedCategory;
            });
        }
        
        // Apply price range filter
        if (priceRangeFilter && priceRangeFilter.value !== 'all') {
            const priceRange = priceRangeFilter.value;
            
            filteredProducts = filteredProducts.filter(card => {
                const price = parseFloat(card.dataset.price);
                
                switch (priceRange) {
                    case '0-20000':
                        return price < 20000;
                    case '20000-50000':
                        return price >= 20000 && price <= 50000;
                    case '50000-100000':
                        return price > 50000 && price <= 100000;
                    case '100000+':
                        return price > 100000;
                    default:
                        return true;
                }
            });
        }
        
        // Apply sorting
        if (sortBySelect) {
            const sortValue = sortBySelect.value;
            
            switch (sortValue) {
                case 'popularity':
                    // In a real app, this would sort by a popularity metric
                    // For now, we'll keep the original order which we assume is popularity
                    break;
                    
                case 'price-asc':
                    filteredProducts.sort((a, b) => {
                        return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                    });
                    break;
                    
                case 'price-desc':
                    filteredProducts.sort((a, b) => {
                        return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                    });
                    break;
                    
                case 'newest':
                    // In a real app, this would sort by a date/time field
                    // For now, we'll reverse original order to simulate newest first
                    filteredProducts.reverse();
                    break;
                    
                default:
                    // No sorting
                    break;
            }
        }
        
        // Reset to first page when filters change
        currentPage = 1;
        
        // Show filtered and sorted products
        displayProducts();
        
        // Update pagination based on filtered results
        updatePagination();
    }
    
    function displayProducts() {
        // First hide all products
        originalProducts.forEach(card => {
            card.style.display = 'none';
        });
        
        // Calculate pagination range
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
        
        // Show only the products for current page
        for (let i = startIndex; i < endIndex; i++) {
            if (filteredProducts[i]) {
                filteredProducts[i].style.display = 'block';
            }
        }
        
        // Show "no products found" if no results
        if (filteredProducts.length === 0) {
            showNoProductsMessage();
        } else {
            // Make sure the message is removed if products are found
            removeNoProductsMessage();
        }
        
        // Add animation to displayed products
        animateProducts();
    }
    
    function animateProducts() {
        const visibleProducts = Array.from(document.querySelectorAll('.product-card[style="display: block;"]'));
        
        visibleProducts.forEach((product, index) => {
            product.style.animation = 'none';
            // Using setTimeout to reset the animation flow
            setTimeout(() => {
                product.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
            }, 10);
        });
    }
    
    function showNoProductsMessage() {
        // Remove existing message if any
        removeNoProductsMessage();
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = 'no-products-message';
        messageEl.innerHTML = `
            <div class="empty-search-icon">
                <i class="fas fa-search"></i>
            </div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button class="btn secondary-btn reset-search-btn">Reset Filters</button>
        `;
        
        // Insert after the product grid
        if (productGrid) {
            productGrid.parentNode.insertBefore(messageEl, productGrid.nextSibling);
            
            // Add event listener to the reset button
            const resetBtn = messageEl.querySelector('.reset-search-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', resetFilters);
            }
            
            // Add styles if they don't exist
            if (!document.getElementById('no-products-styles')) {
                const style = document.createElement('style');
                style.id = 'no-products-styles';
                style.textContent = `
                    .no-products-message {
                        text-align: center;
                        padding: 60px 20px;
                        background-color: #f9f9f9;
                        border-radius: 8px;
                        margin-top: 30px;
                        animation: fadeIn 0.5s ease;
                    }
                    
                    .empty-search-icon {
                        font-size: 50px;
                        color: #ddd;
                        margin-bottom: 20px;
                    }
                    
                    .no-products-message h3 {
                        font-size: 24px;
                        color: var(--dark-color);
                        margin-bottom: 10px;
                    }
                    
                    .no-products-message p {
                        color: #777;
                        margin-bottom: 20px;
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    function removeNoProductsMessage() {
        const existingMessage = document.querySelector('.no-products-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
    
    function resetFilters() {
        // Reset filter dropdowns
        if (sortBySelect) sortBySelect.value = 'popularity';
        if (categoryFilter) categoryFilter.value = 'all';
        if (priceRangeFilter) priceRangeFilter.value = 'all';
        
        // Show all products (and reset to original order)
        filteredProducts = [...originalProducts];
        
        // Reset to first page
        currentPage = 1;
        
        // Update display
        displayProducts();
        updatePagination();
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Show a notification
        showNotification('Filters have been reset', 'info');
    }
    
    function updateUrlParameters() {
        const params = new URLSearchParams();
        
        // Add category parameter if not "all"
        if (categoryFilter && categoryFilter.value !== 'all') {
            params.set('category', categoryFilter.value);
        }
        
        // Add price range parameter if not "all"
        if (priceRangeFilter && priceRangeFilter.value !== 'all') {
            params.set('price', priceRangeFilter.value);
        }
        
        // Add sort parameter if not default
        if (sortBySelect && sortBySelect.value !== 'popularity') {
            params.set('sort', sortBySelect.value);
        }
        
        // Update URL without reloading page
        const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({}, document.title, newUrl);
    }
    
    function updatePagination() {
        // Get pagination container
        if (!paginationContainer) return;
        
        // Clear existing pagination
        paginationContainer.innerHTML = '';
        
        // Calculate total pages
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        
        // Add prev button if needed
        if (totalPages > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'page-btn prev';
            prevBtn.innerHTML = '<i class="fas fa-angle-left"></i>';
            
            // Disable if on first page
            if (currentPage === 1) {
                prevBtn.style.opacity = '0.5';
                prevBtn.style.cursor = 'not-allowed';
            }
            
            prevBtn.addEventListener('click', function() {
                if (currentPage > 1) {
                    navigateToPage(currentPage - 1);
                }
            });
            
            paginationContainer.appendChild(prevBtn);
        }
        
        // Add page buttons (max 5 buttons)
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Adjust start page if we're near the end
        if (endPage - startPage < 4 && startPage > 1) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-btn';
            pageBtn.textContent = i;
            
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            
            pageBtn.addEventListener('click', function() {
                navigateToPage(i);
            });
            
            paginationContainer.appendChild(pageBtn);
        }
        
        // Add next button if needed
        if (totalPages > 1) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'page-btn next';
            nextBtn.innerHTML = '<i class="fas fa-angle-right"></i>';
            
            // Disable if on last page
            if (currentPage === totalPages) {
                nextBtn.style.opacity = '0.5';
                nextBtn.style.cursor = 'not-allowed';
            }
            
            nextBtn.addEventListener('click', function() {
                if (currentPage < totalPages) {
                    navigateToPage(currentPage + 1);
                }
            });
            
            paginationContainer.appendChild(nextBtn);
        }
        
        // Hide pagination if 0 or 1 page
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
        } else {
            paginationContainer.style.display = 'flex';
        }
    }
    
    function navigateToPage(pageNumber) {
        // Validate page number
        const maxPage = Math.ceil(filteredProducts.length / itemsPerPage);
        if (pageNumber < 1 || pageNumber > maxPage) return;
        
        // Update current page
        currentPage = pageNumber;
        
        // Update display
        displayProducts();
        
        // Update pagination
        updatePagination();
        
        // Scroll to top of products
        if (productGrid) {
            window.scrollTo({
                top: productGrid.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    }
    
    // Quick View functionality
    function openQuickView(productCard) {
        if (!quickViewModal || !productCard) return;
        
        // Get product data
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        
        // Get rating from the product card
        const ratingElement = productCard.querySelector('.product-rating');
        const ratingHTML = ratingElement ? ratingElement.innerHTML : '';
        
        // Populate modal with product details
        if (quickViewImage) {
            quickViewImage.src = productImage;
            quickViewImage.alt = productName;
        }
        
        if (quickViewTitle) {
            quickViewTitle.textContent = productName;
        }
        
        if (quickViewPrice) {
            quickViewPrice.textContent = `৳${productPrice.toLocaleString('en-IN')}`;
        }
        
        // Get old price if available
        const oldPriceElement = productCard.querySelector('.old-price');
        if (oldPriceElement && quickViewOldPrice) {
            quickViewOldPrice.textContent = oldPriceElement.textContent;
            quickViewOldPrice.style.display = 'inline';
            
            // Calculate discount percentage
            const oldPrice = parseFloat(oldPriceElement.textContent.replace(/[৳,]/g, ''));
            const discountElement = quickViewModal.querySelector('.discount');
            
            if (discountElement && oldPrice > 0) {
                const discountPercent = Math.round((oldPrice - productPrice) / oldPrice * 100);
                discountElement.textContent = `-${discountPercent}%`;
                discountElement.style.display = 'inline';
            }
        } else if (quickViewOldPrice) {
            quickViewOldPrice.style.display = 'none';
            
            // Hide discount percentage
            const discountElement = quickViewModal.querySelector('.discount');
            if (discountElement) {
                discountElement.style.display = 'none';
            }
        }
        
        // Set rating
        if (quickViewRating && ratingHTML) {
            quickViewRating.innerHTML = ratingHTML;
        }
        
        // Generate description based on product name
        if (quickViewDescription) {
            let description = '';
            
            if (productName.includes('iPhone') || productName.includes('Iphone')) {
                description = `The ${productName} offers cutting-edge technology with an exceptional display, advanced camera system, and lightning-fast performance. Packed with the latest A17 Bionic chip, it provides a seamless user experience.`;
            } else if (productName.includes('AirPods') || productName.includes('Earbuds')) {
                description = `Experience immersive sound with the ${productName}. Featuring active noise cancellation, easy setup, and comfortable fit, these earbuds deliver crystal-clear audio for music, calls, and more.`;
            } else if (productName.includes('Bass') || productName.includes('headphone')) {
                description = `Immerse yourself in rich, detailed sound with the ${productName}. These premium headphones feature active noise cancellation, comfortable ear cups, and long battery life for extended listening sessions.`;
            } else if (productName.includes('MacBook') || productName.includes('Laptop')) {
                description = `Powerful and portable, the ${productName} features a stunning Retina display, all-day battery life, and high-performance processors. Perfect for creative work, coding, and everyday tasks.`;
            } else if (productName.includes('Watch') || productName.includes('SmartFit')) {
                description = `The ${productName} helps you stay connected, active, and healthy. Track your workouts, monitor your heart rate, and receive notifications right on your wrist with this sleek and innovative smartwatch.`;
            } else if (productName.includes('Pad') || productName.includes('Tablet')) {
                description = `The versatile ${productName} is perfect for work, creation, and entertainment. With its stunning display, powerful performance, and all-day battery life, it's the ideal companion for productivity and creativity.`;
            } else {
                description = `The ${productName} combines premium quality with exceptional performance and innovative features. Experience the perfect blend of cutting-edge technology and elegant design with this advanced device.`;
            }
            
            quickViewDescription.textContent = description;
        }
        
        // Set product data for add to cart functionality
        quickViewModal.dataset.id = productId;
        quickViewModal.dataset.name = productName;
        quickViewModal.dataset.price = productPrice;
        quickViewModal.dataset.image = productImage;
        
        // Reset quantity input
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        if (quantityInput) {
            quantityInput.value = 1;
        }
        
        // Set up color options
        setupColorOptions();
        
        // Set up add to cart button
        const addToCartBtn = quickViewModal.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.onclick = function() {
                addToCartFromModal();
                quickViewModal.style.display = 'none';
                overlay.style.display = 'none';
                
                // Show cart sidebar
                if (cartSidebar) {
                    cartSidebar.style.right = '0';
                    overlay.style.display = 'block';
                }
            };
        }
        
        // Set up buy now button
        const buyNowBtn = quickViewModal.querySelector('.buy-now-btn');
        if (buyNowBtn) {
            buyNowBtn.onclick = function() {
                const buyNowModal = document.getElementById('buyNowModal');
                if (buyNowModal) {
                    quickViewModal.style.display = 'none';
                    
                    // Populate buy now modal
                    populateBuyNowModal(quickViewModal.dataset);
                    
                    // Show buy now modal
                    buyNowModal.style.display = 'block';
                    overlay.style.display = 'block';
                } else {
                    // Fallback to checkout page
                    addToCartFromModal();
                    window.location.href = 'checkout.html';
                }
            };
        }
        
        // Show the modal
        quickViewModal.style.display = 'block';
        overlay.style.display = 'block';
    }
    
    function setupColorOptions() {
        const colorOptions = quickViewModal.querySelectorAll('.color-option');
        if (!colorOptions || colorOptions.length === 0) return;
        
        // Reset all color options
        colorOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        // Set white as default active color
        const whiteOption = document.querySelector('.color-option.white');
        if (whiteOption) {
            whiteOption.classList.add('active');
        }
        
        // Add click event to color options
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                colorOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Change product image based on color
                changeProductImage(this);
            });
        });
    }
    
    function changeProductImage(colorOption) {
        if (!quickViewImage) return;
        
        // Get base image path
        const baseImage = quickViewModal.dataset.image;
        if (!baseImage) return;
        
        // Get file extension and base name
        const lastDotIndex = baseImage.lastIndexOf('.');
        if (lastDotIndex === -1) return;
        
        const extension = baseImage.substring(lastDotIndex);
        const baseName = baseImage.substring(0, lastDotIndex);
        
        // Remove any existing color suffix
        const baseNameWithoutColor = baseName.replace(/[WB]$/, '');
        
        // Determine color suffix
        let colorSuffix = '';
        if (colorOption.classList.contains('white')) colorSuffix = 'W';
        else if (colorOption.classList.contains('black')) colorSuffix = 'B';
        else if (colorOption.classList.contains('blue')) colorSuffix = 'BL';
        
        // Create new image path
        const newImagePath = baseNameWithoutColor + colorSuffix + extension;
        
        // Apply fade effect and change image
        quickViewImage.style.opacity = '0';
        setTimeout(() => {
            quickViewImage.src = newImagePath;
            quickViewImage.style.opacity = '1';
            
            // Update modal dataset for add to cart
            quickViewModal.dataset.image = newImagePath;
        }, 300);
    }
    
    function addToCartFromModal() {
        if (!quickViewModal) return;
        
        const productId = quickViewModal.dataset.id;
        const productName = quickViewModal.dataset.name;
        const productPrice = parseFloat(quickViewModal.dataset.price);
        const productImage = quickViewModal.dataset.image;
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        // Create product object
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity
        };
        
        // Add product to cart
        addItemToCart(product);
    }
    
    function populateBuyNowModal(productData) {
        const buyNowModal = document.getElementById('buyNowModal');
        if (!buyNowModal) return;
        
        const productName = productData.name;
        const productPrice = parseFloat(productData.price);
        const productImage = productData.image;
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        // Set modal image
        const imageElement = buyNowModal.querySelector('.buy-now-product-image img');
        if (imageElement) {
            imageElement.src = productImage;
            imageElement.alt = productName;
        }
        
        // Set product name
        const nameElement = buyNowModal.querySelector('.buy-now-product-info h3');
        if (nameElement) {
            nameElement.textContent = productName;
        }
        
        // Set price
        const priceElement = buyNowModal.querySelector('.price');
        if (priceElement) {
            priceElement.textContent = `৳${productPrice.toLocaleString('en-IN')}`;
        }
        
        // Set product name in summary
        const productNameElement = buyNowModal.querySelector('.product-name');
        if (productNameElement) {
            productNameElement.textContent = productName;
        }
        
        // Set quantity in summary
        const productQuantityElement = buyNowModal.querySelector('.product-quantity');
        if (productQuantityElement) {
            productQuantityElement.textContent = quantity;
        }
        
        // Set price in summary
        const productPriceElement = buyNowModal.querySelector('.product-price');
        if (productPriceElement) {
            productPriceElement.textContent = `৳${productPrice.toLocaleString('en-IN')}`;
        }
        
        // Calculate and set total
        const productTotalElement = buyNowModal.querySelector('.product-total');
        if (productTotalElement) {
            const total = productPrice * quantity;
            productTotalElement.textContent = `৳${total.toLocaleString('en-IN')}`;
        }
        
        // Set quantity input value
        const buyNowQuantityInput = buyNowModal.querySelector('.quantity-selector input');
        if (buyNowQuantityInput) {
            buyNowQuantityInput.value = quantity;
        }
        
        // Store product data in modal for later use
        buyNowModal.dataset.id = productData.id;
        buyNowModal.dataset.name = productName;
        buyNowModal.dataset.price = productPrice;
        buyNowModal.dataset.image = productImage;
        
        // Set up quantity buttons
        setupBuyNowQuantityButtons();
        
        // Set up Add to Cart button in Buy Now modal
        setupBuyNowAddToCartButton();
    }
    
    function setupBuyNowQuantityButtons() {
        const buyNowModal = document.getElementById('buyNowModal');
        if (!buyNowModal) return;
        
        const minusBtn = buyNowModal.querySelector('.quantity-btn.minus');
        const plusBtn = buyNowModal.querySelector('.quantity-btn.plus');
        const input = buyNowModal.querySelector('.quantity-selector input');
        
        if (minusBtn && input) {
            minusBtn.addEventListener('click', function() {
                let currentValue = parseInt(input.value);
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    updateBuyNowTotal();
                }
            });
        }
        
        if (plusBtn && input) {
            plusBtn.addEventListener('click', function() {
                let currentValue = parseInt(input.value);
                if (currentValue < 10) {
                    input.value = currentValue + 1;
                    updateBuyNowTotal();
                }
            });
        }
    }
    
    function updateBuyNowTotal() {
        const buyNowModal = document.getElementById('buyNowModal');
        if (!buyNowModal) return;
        
        const price = parseFloat(buyNowModal.dataset.price);
        const input = buyNowModal.querySelector('.quantity-selector input');
        if (!input) return;
        
        const quantity = parseInt(input.value);
        const total = price * quantity;
        
        // Update quantity display
        const quantityElement = buyNowModal.querySelector('.product-quantity');
        if (quantityElement) {
            quantityElement.textContent = quantity;
        }
        
        // Update total
        const totalElement = buyNowModal.querySelector('.product-total');
        if (totalElement) {
            totalElement.textContent = `৳${total.toLocaleString('en-IN')}`;
        }
    }
    
    function setupBuyNowAddToCartButton() {
        const buyNowModal = document.getElementById('buyNowModal');
        if (!buyNowModal) return;
        
        const addToCartBtn = buyNowModal.querySelector('.add-to-cart-from-buynow');
        if (!addToCartBtn) return;
        
        addToCartBtn.addEventListener('click', function() {
            const productId = buyNowModal.dataset.id;
            const productName = buyNowModal.dataset.name;
            const productPrice = parseFloat(buyNowModal.dataset.price);
            const productImage = buyNowModal.dataset.image;
            const input = buyNowModal.querySelector('.quantity-selector input');
            const quantity = input ? parseInt(input.value) : 1;
            
            // Create product object
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: quantity
            };
            
            // Add to cart
            addItemToCart(product);
            
            // Close modal
            buyNowModal.style.display = 'none';
            
            // Show cart sidebar
            if (cartSidebar) {
                cartSidebar.style.right = '0';
                overlay.style.display = 'block';
            }
        });
    }
    
    // Cart Functions
    function addToCart(productCard) {
        if (!productCard) return;
        
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        
        // Create product object
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        };
        
        // Add to cart
        addItemToCart(product);
    }
    
    function addItemToCart(product) {
        if (!product || !product.id) return;
        
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            // Update quantity if already in cart
            existingItem.quantity += product.quantity;
        } else {
            // Add new item to cart
            cart.push(product);
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        
        // Show notification
        showNotification(`Added ${product.name} to cart!`, 'success');
    }
    
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (!cartCount) return;
        
        // Calculate total items
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update display
        cartCount.textContent = totalItems;
        
        // Add animation
        cartCount.style.animation = 'none';
        void cartCount.offsetWidth; // Force reflow
        cartCount.style.animation = 'cartCountPulse 0.5s ease';
    }
    
    // Wishlist Functions
    function toggleWishlist(productCard) {
        if (!productCard) return;
        
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        
        // Check if product is already in wishlist
        const existingIndex = wishlist.findIndex(item => item.id === productId);
        
        // Update heart icon
        const heartIcon = productCard.querySelector('.add-to-wishlist i');
        
        if (existingIndex !== -1) {
            // Remove from wishlist
            wishlist.splice(existingIndex, 1);
            
            // Update icon
            if (heartIcon) {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
            }
            
            // Show notification
            showNotification(`Removed ${productName} from wishlist`, 'info');
        } else {
            // Add to wishlist
            wishlist.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            });
            
            // Update icon
            if (heartIcon) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
            }
            
            // Show notification
            showNotification(`Added ${productName} to wishlist!`, 'success');
        }
        
        // Save to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update count
        updateWishlistCount();
    }
    
    function updateWishlistCount() {
        const wishlistCount = document.querySelector('.wishlist-count');
        if (!wishlistCount) return;
        
        // Update count
        wishlistCount.textContent = wishlist.length;
        
        // Add animation
        wishlistCount.style.animation = 'none';
        void wishlistCount.offsetWidth; // Force reflow
        wishlistCount.style.animation = 'cartCountPulse 0.5s ease';
    }
    
    function initializeWishlistIcons() {
        document.querySelectorAll('.product-card').forEach(card => {
            const productId = card.dataset.id;
            const heartIcon = card.querySelector('.add-to-wishlist i');
            
            if (heartIcon) {
                // Check if product is in wishlist
                const isInWishlist = wishlist.some(item => item.id === productId);
                
                if (isInWishlist) {
                    heartIcon.classList.remove('far');
                    heartIcon.classList.add('fas');
                } else {
                    heartIcon.classList.remove('fas');
                    heartIcon.classList.add('far');
                }
            }
        });
    }
    
    // Helper function for showing notifications
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
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Add styles if they don't exist
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
                
                .notification.info {
                    border-left: 4px solid #3498db;
                }
                
                .notification.error {
                    border-left: 4px solid #e74c3c;
                }
                
                .notification.success i {
                    color: #2ecc71;
                }
                
                .notification.info i {
                    color: #3498db;
                }
                
                .notification.error i {
                    color: #e74c3c;
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
                notification.remove();
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
});