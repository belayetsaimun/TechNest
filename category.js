/**
 * TechNest E-commerce - Enhanced Category Page JavaScript
 * Complete implementation with fixed bugs and improved functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get category parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // Initialize cart and wishlist
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Update cart and wishlist counts
    updateCartCount();
    updateWishlistCount();
    
    // Set up DOM element constants
    const cartBtn = document.getElementById('cartBtn');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const closeCart = document.querySelector('.close-cart');
    const closeWishlist = document.querySelector('.close-wishlist');
    const overlay = document.getElementById('overlay');
    const menuIcon = document.getElementById('menuIcon');
    const closeMenu = document.getElementById('closeMenu');
    const navLinks = document.getElementById('navLinks');
    const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    
    // Category-specific elements
    const sortBySelect = document.getElementById('sort-by');
    const priceRangeSelect = document.getElementById('price-range');
    const productsGrid = document.getElementById('category-products-grid');
    const paginationContainer = document.querySelector('.pagination');
    
    // Event listeners for mobile menu
    if (menuIcon) {
        menuIcon.addEventListener('click', () => {
            navLinks.style.right = '0';
            overlay.style.display = 'block';
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            navLinks.style.right = '-300px';
            overlay.style.display = 'none';
        });
    }
    
    // Event listeners for cart sidebar
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.style.right = '0';
            overlay.style.display = 'block';
            updateCartUI();
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }
    
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            cartSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }
    
    // Event listeners for wishlist sidebar
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            wishlistSidebar.style.right = '0';
            overlay.style.display = 'block';
            updateWishlistUI();
        });
    }
    
    if (closeWishlist) {
        closeWishlist.addEventListener('click', () => {
            wishlistSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }
    
    if (clearWishlistBtn) {
        clearWishlistBtn.addEventListener('click', clearWishlist);
    }
    
    // Overlay click handler
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (cartSidebar) cartSidebar.style.right = '-400px';
            if (wishlistSidebar) wishlistSidebar.style.right = '-400px';
            if (navLinks && window.innerWidth <= 768) navLinks.style.right = '-300px';
            
            // Close modals
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
            
            overlay.style.display = 'none';
        });
    }
    
    // Load category content if a valid category is specified
    if (categoryParam && categoryData[categoryParam]) {
        loadCategoryContent(categoryParam);
    } else {
        // Redirect to categories page if category not found
        window.location.href = 'categories.html';
    }
    
    // Function to load category content
    function loadCategoryContent(category) {
        const data = categoryData[category];
        
        // Update page title with category name
        document.title = `TechNest - ${data.name}`;
        
        // Update breadcrumb
        const categoryNameElement = document.getElementById('category-name');
        if (categoryNameElement) {
            categoryNameElement.textContent = data.name;
        }
        
        // Update banner content
        const categoryTitleElement = document.getElementById('category-title');
        const categoryDescriptionElement = document.getElementById('category-description');
        
        if (categoryTitleElement) {
            categoryTitleElement.textContent = data.title;
        }
        
        if (categoryDescriptionElement) {
            categoryDescriptionElement.textContent = data.description;
        }
        
        // Update category info
        const categoryImageElement = document.getElementById('category-image');
        const categoryNameTextElement = document.getElementById('category-name-text');
        const categoryLongDescriptionElement = document.getElementById('category-long-description');
        const categoryFeaturesElement = document.getElementById('category-features');
        
        if (categoryImageElement) {
            categoryImageElement.src = data.image;
            categoryImageElement.alt = data.name;
        }
        
        if (categoryNameTextElement) {
            categoryNameTextElement.textContent = data.name;
        }
        
        if (categoryLongDescriptionElement) {
            categoryLongDescriptionElement.textContent = data.longDescription;
        }
        
        if (categoryFeaturesElement) {
            categoryFeaturesElement.innerHTML = '';
            
            data.features.forEach(feature => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
                categoryFeaturesElement.appendChild(li);
            });
        }
        
        // Update products title
        const productsTitleElement = document.getElementById('products-title');
        if (productsTitleElement) {
            productsTitleElement.textContent = `${data.name} Products`;
        }
        
        // Load products with simulated loading delay for better UX
        setTimeout(() => {
            loadProducts(data.products);
        }, 800);
        
        // Load related categories
        loadRelatedCategories(category);
    }
    
    // Function to load products
    function loadProducts(products) {
        if (!productsGrid) return;
        
        // Clear loading spinner
        productsGrid.innerHTML = '';
        
        if (products.length === 0) {
            // Display no products message
            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>No products found in this category.</p>
                </div>
            `;
            return;
        }
        
        // Add products to grid
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;
            productCard.dataset.name = product.name;
            productCard.dataset.price = product.price;
            productCard.dataset.image = product.image;
            productCard.dataset.description = product.description;
            productCard.dataset.stock = product.stock;
            
            // Generate rating stars HTML
            let ratingStars = '';
            const fullStars = Math.floor(product.rating);
            const hasHalfStar = product.rating % 1 !== 0;
            
            for (let i = 0; i < fullStars; i++) {
                ratingStars += '<i class="fas fa-star"></i>';
            }
            
            if (hasHalfStar) {
                ratingStars += '<i class="fas fa-star-half-alt"></i>';
            }
            
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            for (let i = 0; i < emptyStars; i++) {
                ratingStars += '<i class="far fa-star"></i>';
            }
            
            // Set badge class based on badge type
            let badgeClass = '';
            if (product.badge) {
                badgeClass = product.badge.toLowerCase();
                if (badgeClass === 'new') {
                    badgeClass = 'new-badge';
                } else if (badgeClass === 'bestseller') {
                    badgeClass = 'bestseller';
                } else if (badgeClass === 'sale') {
                    badgeClass = 'sale';
                }
            }
            
            // Set product card HTML
            productCard.innerHTML = `
                ${product.badge ? `<div class="product-badge ${badgeClass}">${product.badge}</div>` : ''}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-actions">
                        <a href="#" class="quick-view"><i class="fas fa-eye"></i></a>
                        <a href="#" class="add-to-wishlist"><i class="${wishlist.some(item => item.id === product.id) ? 'fas' : 'far'} fa-heart"></i></a>
                        <a href="#" class="add-to-cart"><i class="fas fa-shopping-cart"></i></a>
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-rating">
                        ${ratingStars}
                        <span>(${product.ratingCount})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">৳${product.price.toLocaleString('en-IN')}</span>
                        ${product.oldPrice ? `<span class="old-price">৳${product.oldPrice.toLocaleString('en-IN')}</span>` : ''}
                    </div>
                    <div class="product-stock">
                        <span class="${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}">
                            ${product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Low Stock (${product.stock} left)` : 'Out of Stock'}
                        </span>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
            
            // Add event listeners to action buttons
            const quickViewBtn = productCard.querySelector('.quick-view');
            const addToCartBtn = productCard.querySelector('.add-to-cart');
            const addToWishlistBtn = productCard.querySelector('.add-to-wishlist');
            
            if (quickViewBtn) {
                quickViewBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    openQuickView(productCard);
                });
            }
            
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    addToCart(productCard);
                });
            }
            
            if (addToWishlistBtn) {
                addToWishlistBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleWishlist(productCard);
                });
            }
        });
        
        // Setup pagination
        setupPagination(products.length);
        
        // Initialize sort and filter functionality
        initSortAndFilter();
    }
    
    // Function to setup pagination
    function setupPagination(totalProducts) {
        if (!paginationContainer) return;
        
        // Clear existing pagination
        paginationContainer.innerHTML = '';
        
        // Calculate total pages (8 products per page)
        const productsPerPage = 8;
        const totalPages = Math.ceil(totalProducts / productsPerPage);
        
        // Add prev button
        if (totalPages > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'page-btn prev';
            prevBtn.setAttribute('aria-label', 'Previous Page');
            prevBtn.innerHTML = '<i class="fas fa-angle-left"></i>';
            prevBtn.addEventListener('click', () => {
                // Logic for previous page
                const activePage = parseInt(document.querySelector('.page-btn.active').textContent);
                if (activePage > 1) {
                    document.querySelector(`.page-btn[data-page="${activePage - 1}"]`).click();
                }
            });
            paginationContainer.appendChild(prevBtn);
        }
        
        // Add page buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-btn' + (i === 1 ? ' active' : '');
            pageBtn.textContent = i;
            pageBtn.dataset.page = i;
            pageBtn.addEventListener('click', function() {
                // Remove active class from all buttons
                document.querySelectorAll('.page-btn').forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show/hide products based on page
                const productCards = document.querySelectorAll('.product-card');
                const startIndex = (i - 1) * productsPerPage;
                const endIndex = startIndex + productsPerPage;
                
                productCards.forEach((card, index) => {
                    if (index >= startIndex && index < endIndex) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Scroll to top of products section
                document.getElementById('category-products-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            paginationContainer.appendChild(pageBtn);
        }
        
        // Add next button
        if (totalPages > 1) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'page-btn next';
            nextBtn.setAttribute('aria-label', 'Next Page');
            nextBtn.innerHTML = '<i class="fas fa-angle-right"></i>';
            nextBtn.addEventListener('click', () => {
                // Logic for next page
                const activePage = parseInt(document.querySelector('.page-btn.active').textContent);
                if (activePage < totalPages) {
                    document.querySelector(`.page-btn[data-page="${activePage + 1}"]`).click();
                }
            });
            paginationContainer.appendChild(nextBtn);
        }
        
        // Initial pagination setup - show only first page
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            if (index < productsPerPage) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Function to load related categories
    function loadRelatedCategories(currentCategory) {
        const relatedCategoriesGrid = document.getElementById('related-categories-grid');
        
        if (!relatedCategoriesGrid) return;
        
        // Clear existing content
        relatedCategoriesGrid.innerHTML = '';
        
        // Get related categories for current category
        const related = relatedCategories[currentCategory] || [];
        
        // Add related categories to grid
        related.forEach(categoryId => {
            const category = categoryData[categoryId];
            
            if (!category) return;
            
            const categoryBox = document.createElement('div');
            categoryBox.className = 'category-box';
            
            categoryBox.innerHTML = `
                <a href="category.html?category=${categoryId}">
                    <div class="category-image">
                        <img src="${category.image}" alt="${category.name}">
                        <div class="category-overlay">
                            <div class="category-content">
                                <h2>${category.name}</h2>
                                <p>${category.products.length} Products</p>
                                <span class="category-btn">Shop Now</span>
                            </div>
                        </div>
                    </div>
                </a>
            `;
            
            relatedCategoriesGrid.appendChild(categoryBox);
        });
    }
    
    // Function to initialize sort and filter functionality
    function initSortAndFilter() {
        if (!sortBySelect || !priceRangeSelect || !productsGrid) return;
        
        const productCards = Array.from(productsGrid.querySelectorAll('.product-card'));
        
        // Sort functionality
        if (sortBySelect) {
            sortBySelect.addEventListener('change', () => {
                const sortValue = sortBySelect.value;
                const productsArray = Array.from(productCards);
                
                productsArray.sort((a, b) => {
                    const priceA = parseFloat(a.dataset.price);
                    const priceB = parseFloat(b.dataset.price);
                    
                    switch (sortValue) {
                        case 'price-asc':
                            return priceA - priceB;
                        case 'price-desc':
                            return priceB - priceA;
                        case 'newest':
                            // Assuming newer products have higher IDs
                            return parseInt(b.dataset.id) - parseInt(a.dataset.id);
                        case 'popularity':
                        default:
                            // Use rating count as popularity metric
                            const ratingA = parseInt(a.querySelector('.product-rating span').textContent.replace(/[()]/g, ''));
                            const ratingB = parseInt(b.querySelector('.product-rating span').textContent.replace(/[()]/g, ''));
                            return ratingB - ratingA;
                    }
                });
                
                // Reattach sorted products to grid
                productsArray.forEach(product => {
                    productsGrid.appendChild(product);
                });
                
                // Reset pagination after sorting
                // Get active page
                const activePage = document.querySelector('.page-btn.active');
                if (activePage) {
                    activePage.click();
                } else {
                    // If no active page, click first page
                    const firstPage = document.querySelector('.page-btn[data-page="1"]');
                    if (firstPage) firstPage.click();
                }
                
                // Show sort notification
                showNotification(`Products sorted by ${sortBySelect.options[sortBySelect.selectedIndex].text}`, 'info');
            });
        }
        
        // Price range filter
        if (priceRangeSelect) {
            priceRangeSelect.addEventListener('change', () => {
                const rangeValue = priceRangeSelect.value;
                let visibleCount = 0;
                
                productCards.forEach(card => {
                    const price = parseFloat(card.dataset.price);
                    
                    if (rangeValue === 'all') {
                        card.style.display = '';
                        visibleCount++;
                        return;
                    }
                    
                    // Parse price range
                    if (rangeValue === '100000+') {
                        if (price >= 100000) {
                            card.style.display = '';
                            visibleCount++;
                        } else {
                            card.style.display = 'none';
                        }
                    } else {
                        const [min, max] = rangeValue.split('-').map(val => parseFloat(val));
                        if (price >= min && price <= max) {
                            card.style.display = '';
                            visibleCount++;
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
                
                // Update pagination based on filtered products
                setupPagination(visibleCount);
                
                // Show filter notification
                const rangeText = priceRangeSelect.options[priceRangeSelect.selectedIndex].text;
                showNotification(`Showing ${visibleCount} products in price range: ${rangeText}`, 'info');
            });
        }
    }
    
    // Quick View Modal
    function openQuickView(productCard) {
        const modal = document.getElementById('quickViewModal');
        const overlay = document.getElementById('overlay');
        
        if (!modal || !overlay || !productCard) return;
        
        // Get product data
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        const productDescription = productCard.dataset.description || 'No description available';
        const productStock = parseInt(productCard.dataset.stock || 0);
        const productRating = productCard.querySelector('.product-rating').innerHTML;
        const productOldPrice = productCard.querySelector('.old-price')?.textContent;
        
        // Populate modal
        const titleElement = modal.querySelector('h2');
        const priceElement = modal.querySelector('.current-price');
        const imageElement = modal.querySelector('.product-quick-view-image img');
        const ratingElement = modal.querySelector('.product-rating');
        const descriptionElement = modal.querySelector('.product-description p');
        
        if (titleElement) titleElement.textContent = productName;
        if (priceElement) priceElement.textContent = `৳${productPrice.toLocaleString('en-IN')}`;
        if (imageElement) {
            imageElement.src = productImage;
            imageElement.alt = productName;
        }
        if (ratingElement) ratingElement.innerHTML = productRating;
        if (descriptionElement) descriptionElement.textContent = productDescription;
        
        // Update stock information
        const metaStockElement = modal.querySelector('.product-meta p:first-child span');
        if (metaStockElement) {
            if (productStock > 10) {
                metaStockElement.textContent = `In Stock (${productStock} available)`;
                metaStockElement.className = 'in-stock';
            } else if (productStock > 0) {
                metaStockElement.textContent = `Low Stock (only ${productStock} left)`;
                metaStockElement.className = 'low-stock';
            } else {
                metaStockElement.textContent = 'Out of Stock';
                metaStockElement.className = 'out-of-stock';
            }
        }
        
        // Set product data as attributes for add to cart functionality
        modal.dataset.id = productId;
        modal.dataset.name = productName;
        modal.dataset.price = productPrice;
        modal.dataset.image = productImage;
        modal.dataset.stock = productStock;
        
        // Check if product has old price/discount
        const oldPriceElement = modal.querySelector('.old-price');
        const discountElement = modal.querySelector('.discount');
        
        if (productOldPrice && oldPriceElement && discountElement) {
            oldPriceElement.textContent = productOldPrice;
            oldPriceElement.style.display = 'inline';
            
            // Calculate discount percentage
            const oldPrice = parseFloat(productOldPrice.replace(/[৳,]/g, ''));
            const discountPercent = Math.round((oldPrice - productPrice) / oldPrice * 100);
            
            discountElement.textContent = `-${discountPercent}%`;
            discountElement.style.display = 'inline';
        } else if (oldPriceElement && discountElement) {
            oldPriceElement.style.display = 'none';
            discountElement.style.display = 'none';
        }
        
        // Set up category info
        const category = categoryParam ? categoryData[categoryParam].name : 'Products';
        const metaCategoryElement = modal.querySelector('.product-meta p:nth-child(2)');
        if (metaCategoryElement) {
            metaCategoryElement.innerHTML = `<strong>Category:</strong> ${category}`;
        }
        
        // Set SKU (using product ID)
        const metaSkuElement = modal.querySelector('.product-meta p:nth-child(3)');
        if (metaSkuElement) {
            metaSkuElement.innerHTML = `<strong>SKU:</strong> TN-${productId.padStart(4, '0')}`;
        }
        
        // Handle out of stock products
        const quantitySection = modal.querySelector('.product-quantity');
        const actionButtons = modal.querySelector('.product-actions');
        const outOfStockMsg = modal.querySelector('.out-of-stock-message');
        
        if (productStock <= 0) {
            // Disable quantity and buttons
            if (quantitySection) {
                quantitySection.style.opacity = '0.5';
                quantitySection.style.pointerEvents = 'none';
            }
            if (actionButtons) {
                actionButtons.style.opacity = '0.5';
                actionButtons.style.pointerEvents = 'none';
            }
            
            // Add out of stock message if it doesn't exist
            if (!outOfStockMsg) {
                const message = document.createElement('div');
                message.className = 'out-of-stock-message';
                message.innerHTML = '<i class="fas fa-exclamation-circle"></i> This product is currently out of stock. Please check back later.';
                
                if (actionButtons && actionButtons.parentNode) {
                    actionButtons.parentNode.insertBefore(message, actionButtons);
                }
            }
        } else {
            // Enable quantity and buttons
            if (quantitySection) {
                quantitySection.style.opacity = '1';
                quantitySection.style.pointerEvents = 'auto';
            }
            if (actionButtons) {
                actionButtons.style.opacity = '1';
                actionButtons.style.pointerEvents = 'auto';
            }
            
            // Remove out of stock message if it exists
            if (outOfStockMsg) {
                outOfStockMsg.remove();
            }
            
            // Set max quantity based on stock
            const quantityInput = modal.querySelector('.quantity-selector input');
            if (quantityInput) {
                quantityInput.max = Math.min(10, productStock);
                quantityInput.value = 1; // Reset to 1
            }
        }
        
        // Show modal
        modal.style.display = 'block';
        overlay.style.display = 'block';
        
        // Add event listeners for the modal
        setupQuickViewEventListeners(modal, productStock);
    }
    
    // Setup event listeners for Quick View modal
    function setupQuickViewEventListeners(modal, stockQuantity) {
        // Modal close event
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.style.display = 'none';
                document.getElementById('overlay').style.display = 'none';
            };
        }
        
        // Add to cart button in modal
        const addToCartBtn = modal.querySelector('.add-to-cart-btn');
        if (addToCartBtn && stockQuantity > 0) {
            addToCartBtn.onclick = () => {
                const quantity = parseInt(modal.querySelector('.quantity-selector input').value);
                
                // Validate quantity against available stock
                const actualQuantity = Math.min(quantity, stockQuantity);
                
                addItemToCart({
                    id: modal.dataset.id,
                    name: modal.dataset.name,
                    price: parseFloat(modal.dataset.price),
                    image: modal.dataset.image,
                    quantity: actualQuantity,
                    stock: stockQuantity
                });
                
                modal.style.display = 'none';
                document.getElementById('overlay').style.display = 'none';
            };
        }
        
        // Buy now button in modal
        const buyNowBtn = modal.querySelector('.buy-now-btn');
        if (buyNowBtn && stockQuantity > 0) {
            buyNowBtn.onclick = () => {
                const quantity = parseInt(modal.querySelector('.quantity-selector input').value);
                
                // Validate quantity against available stock
                const actualQuantity = Math.min(quantity, stockQuantity);
                
                showBuyNowModal({
                    id: modal.dataset.id,
                    name: modal.dataset.name,
                    price: parseFloat(modal.dataset.price),
                    image: modal.dataset.image,
                    quantity: actualQuantity,
                    stock: stockQuantity
                });
                
                modal.style.display = 'none';
            };
        }
        
        // Quantity buttons in modal
        const quantityBtns = modal.querySelectorAll('.quantity-btn');
        const quantityInput = modal.querySelector('.quantity-selector input');
        
        if (quantityBtns && quantityInput) {
            quantityBtns.forEach(btn => {
                btn.onclick = () => {
                    const currentValue = parseInt(quantityInput.value);
                    
                    if (btn.classList.contains('minus') && currentValue > 1) {
                        quantityInput.value = currentValue - 1;
                    } else if (btn.classList.contains('plus') && currentValue < Math.min(10, stockQuantity)) {
                        quantityInput.value = currentValue + 1;
                    }
                };
            });
            
            // Ensure quantity doesn't exceed stock
            quantityInput.max = Math.min(10, stockQuantity);
            
            // Add change event to validate manual input
            quantityInput.onchange = () => {
                let value = parseInt(quantityInput.value);
                
                if (isNaN(value) || value < 1) {
                    value = 1;
                } else if (value > Math.min(10, stockQuantity)) {
                    value = Math.min(10, stockQuantity);
                }
                
                quantityInput.value = value;
            };
        }
        
        // Color options in modal
        const colorOptions = modal.querySelectorAll('.color-option');
        if (colorOptions) {
            colorOptions.forEach(option => {
                option.onclick = () => {
                    colorOptions.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                };
            });
        }
    }
    
    // Buy Now Modal
    function showBuyNowModal(product) {
        const buyNowModal = document.getElementById('buyNowModal');
        const overlay = document.getElementById('overlay');
        
        if (!buyNowModal || !overlay) return;
        
        // Populate modal
        const imageElement = buyNowModal.querySelector('.buy-now-product-image img');
        const nameElement = buyNowModal.querySelector('.buy-now-product-info h3');
        const priceElement = buyNowModal.querySelector('.price');
        const productNameElement = buyNowModal.querySelector('.product-name');
        const productPriceElement = buyNowModal.querySelector('.product-price');
        const productQuantityElement = buyNowModal.querySelector('.product-quantity');
        const productTotalElement = buyNowModal.querySelector('.product-total');
        const quantityInput = buyNowModal.querySelector('.quantity-selector input');
        
        if (imageElement) {
            imageElement.src = product.image;
            imageElement.alt = product.name;
        }
        
        if (nameElement) nameElement.textContent = product.name;
        if (priceElement) priceElement.textContent = `৳${product.price.toLocaleString('en-IN')}`;
        if (productNameElement) productNameElement.textContent = product.name;
        if (productPriceElement) productPriceElement.textContent = `৳${product.price.toLocaleString('en-IN')}`;
        
        // Set initial quantity
        const quantity = product.quantity || 1;
        if (quantityInput) quantityInput.value = quantity;
        if (productQuantityElement) productQuantityElement.textContent = quantity;
        
        // Calculate total
        const total = product.price * quantity;
        if (productTotalElement) productTotalElement.textContent = `৳${total.toLocaleString('en-IN')}`;
        
        // Store product data for add to cart functionality
        buyNowModal.dataset.id = product.id;
        buyNowModal.dataset.name = product.name;
        buyNowModal.dataset.price = product.price;
        buyNowModal.dataset.image = product.image;
        buyNowModal.dataset.stock = product.stock || 0;
        
        // Limit quantity input max value based on stock
        const stockQuantity = parseInt(product.stock || 0);
        if (quantityInput) {
            quantityInput.max = Math.min(10, stockQuantity);
        }
        
        // Show modal
        buyNowModal.style.display = 'block';
        overlay.style.display = 'block';
        
        // Setup event listeners
        setupBuyNowModalListeners(buyNowModal, stockQuantity);
    }
    
    // Setup event listeners for Buy Now modal
    function setupBuyNowModalListeners(modal, stockQuantity) {
        const closeBtn = modal.querySelector('.close-modal');
        const addToCartBtn = modal.querySelector('.add-to-cart-from-buynow');
        const quantityBtns = modal.querySelectorAll('.quantity-btn');
        const quantityInput = modal.querySelector('.quantity-selector input');
        const checkoutBtn = modal.querySelector('.buy-now-actions .primary-btn');
        
        // Close modal
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.style.display = 'none';
                document.getElementById('overlay').style.display = 'none';
            };
        }
        
        // Add to cart
        if (addToCartBtn) {
            addToCartBtn.onclick = () => {
                const quantity = parseInt(quantityInput.value);
                
                // Validate quantity against stock
                const actualQuantity = Math.min(quantity, stockQuantity);
                
                addItemToCart({
                    id: modal.dataset.id,
                    name: modal.dataset.name,
                    price: parseFloat(modal.dataset.price),
                    image: modal.dataset.image,
                    quantity: actualQuantity,
                    stock: stockQuantity
                });
                
                modal.style.display = 'none';
                document.getElementById('overlay').style.display = 'none';
            };
        }
        
        // Quantity buttons
        if (quantityBtns && quantityInput) {
            quantityBtns.forEach(btn => {
                btn.onclick = () => {
                    const currentValue = parseInt(quantityInput.value);
                    
                    if (btn.classList.contains('minus') && currentValue > 1) {
                        quantityInput.value = currentValue - 1;
                        updateBuyNowTotal(modal);
                    } else if (btn.classList.contains('plus') && currentValue < Math.min(10, stockQuantity)) {
                        quantityInput.value = currentValue + 1;
                        updateBuyNowTotal(modal);
                    }
                };
            });
            
            // Add change event for direct input
            quantityInput.onchange = () => {
                let value = parseInt(quantityInput.value);
                
                if (isNaN(value) || value < 1) {
                    value = 1;
                } else if (value > Math.min(10, stockQuantity)) {
                    value = Math.min(10, stockQuantity);
                }
                
                quantityInput.value = value;
                updateBuyNowTotal(modal);
            };
        }
        
        // Checkout button - add validation
        if (checkoutBtn) {
            checkoutBtn.onclick = () => {
                // Add the item to cart and redirect
                const quantity = parseInt(quantityInput.value);
                
                // Validate quantity against stock
                const actualQuantity = Math.min(quantity, stockQuantity);
                
                addItemToCart({
                    id: modal.dataset.id,
                    name: modal.dataset.name,
                    price: parseFloat(modal.dataset.price),
                    image: modal.dataset.image,
                    quantity: actualQuantity,
                    stock: stockQuantity
                });
                
                // Show notification before redirect
                showNotification('Proceeding to checkout...', 'success');
                
                // Small delay before redirect for better UX
                setTimeout(() => {
                    // Redirect to checkout page
                    window.location.href = 'checkout.html';
                }, 1000);
            };
        }
    }
    
    // Update buy now modal total
    function updateBuyNowTotal(modal) {
        if (!modal) return;
        
        const quantityInput = modal.querySelector('.quantity-selector input');
        const productQuantityElement = modal.querySelector('.product-quantity');
        const productTotalElement = modal.querySelector('.product-total');
        
        if (!quantityInput || !productQuantityElement || !productTotalElement) return;
        
        const quantity = parseInt(quantityInput.value);
        const price = parseFloat(modal.dataset.price);
        const total = price * quantity;
        
        productQuantityElement.textContent = quantity;
        productTotalElement.textContent = `৳${total.toLocaleString('en-IN')}`;
    }
    
    // Add to cart function
    function addToCart(productCard) {
        if (!productCard) return;
        
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        const productStock = parseInt(productCard.dataset.stock || 0);
        
        // Check if stock is available
        if (productStock <= 0) {
            showNotification('Sorry, this product is out of stock.', 'error');
            return;
        }
        
        const quantity = 1;
        
        addItemToCart({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity,
            stock: productStock
        });
        
        // Show notification
        showNotification(`Added ${productName} to cart!`, 'success');
    }
    
    // Add item to cart function (used by multiple functions)
    function addItemToCart(product) {
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            // Check if adding more would exceed stock
            const newQuantity = existingItem.quantity + product.quantity;
            const stockLimit = parseInt(product.stock || 0);
            
            if (stockLimit > 0 && newQuantity > stockLimit) {
                // Show notification about stock limit
                showNotification(`Only ${stockLimit} items available in stock.`, 'info');
                existingItem.quantity = stockLimit;
            } else if (newQuantity > 10) {
                // Limit to 10 per item
                showNotification('Maximum quantity per item is 10.', 'info');
                existingItem.quantity = 10;
            } else {
                existingItem.quantity = newQuantity;
            }
        } else {
            cart.push(product);
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        updateCartUI();
        
        // Show cart sidebar
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        
        if (cartSidebar && overlay) {
            cartSidebar.style.right = '0';
            overlay.style.display = 'block';
        }
    }
    
    // Toggle wishlist function
    function toggleWishlist(productCard) {
        if (!productCard) return;
        
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        
        // Check if product is already in wishlist
        const existingItemIndex = wishlist.findIndex(item => item.id === productId);
        const heartIcon = productCard.querySelector('.add-to-wishlist i');
        
        if (existingItemIndex !== -1) {
            // Remove from wishlist
            wishlist.splice(existingItemIndex, 1);
            
            // Update heart icon
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
            
            // Update heart icon
            if (heartIcon) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
            }
            
            // Show notification
            showNotification(`Added ${productName} towishlist`, 'success');
            }
        }
        
        // Save to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update UI
        updateWishlistCount();
        updateWishlistUI();
    }
    
    // Clear wishlist function
    function clearWishlist() {
        // Confirm with user
        if (confirm('Are you sure you want to clear your wishlist?')) {
            // Update all heart icons on page
            document.querySelectorAll('.add-to-wishlist i.fas').forEach(icon => {
                icon.classList.remove('fas');
                icon.classList.add('far');
            });
            
            // Clear wishlist array
            wishlist = [];
            
            // Save to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Update UI
            updateWishlistCount();
            updateWishlistUI();
            
            // Show notification
            showNotification('Your wishlist has been cleared!', 'info');
        }
    }
    
    // Remove from cart function
    function removeFromCart(productId) {
        // Find the item in the cart
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const product = cart[itemIndex];
            
            // Remove the item from the cart
            cart.splice(itemIndex, 1);
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            updateCartUI();
            
            // Show notification
            showNotification(`Removed ${product.name} from cart!`, 'info');
        }
    }
    
    // Remove from wishlist function
    function removeFromWishlist(productId) {
        // Find the item in the wishlist
        const itemIndex = wishlist.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const product = wishlist[itemIndex];
            
            // Remove the item from the wishlist
            wishlist.splice(itemIndex, 1);
            
            // Save to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Update UI
            updateWishlistCount();
            updateWishlistUI();
            
            // Update heart icon on product card if visible
            const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
            if (productCard) {
                const heartIcon = productCard.querySelector('.add-to-wishlist i');
                if (heartIcon) {
                    heartIcon.classList.remove('fas');
                    heartIcon.classList.add('far');
                }
            }
            
            // Show notification
            showNotification(`Removed ${product.name} from wishlist!`, 'info');
        }
    }
    
    // Update cart count
    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
            
            // Add animation class if count > 0
            if (totalItems > 0) {
                cartCountElement.classList.add('bounce');
                setTimeout(() => {
                    cartCountElement.classList.remove('bounce');
                }, 1000);
            }
        }
    }
    
    // Update wishlist count
    function updateWishlistCount() {
        const wishlistCountElement = document.querySelector('.wishlist-count');
        if (wishlistCountElement) {
            wishlistCountElement.textContent = wishlist.length;
            
            // Add animation class if count > 0
            if (wishlist.length > 0) {
                wishlistCountElement.classList.add('bounce');
                setTimeout(() => {
                    wishlistCountElement.classList.remove('bounce');
                }, 1000);
            }
        }
    }
    
    // Update cart UI
    function updateCartUI() {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total span:last-child');
        const checkoutBtn = document.querySelector('.checkout-btn');
        const emptyCart = document.querySelector('.empty-cart');
        
        if (!cartItems) return;
        
        // Clear cart items container (except empty cart message)
        if (emptyCart) emptyCart.style.display = cart.length === 0 ? 'flex' : 'none';
        
        // Remove existing cart items
        document.querySelectorAll('.cart-item').forEach(item => item.remove());
        
        if (cart.length === 0) {
            // Hide checkout button
            if (checkoutBtn) checkoutBtn.style.display = 'none';
            
            // Show empty cart message
            if (emptyCart) emptyCart.style.display = 'flex';
            
            // Update cart total
            if (cartTotal) cartTotal.textContent = '৳0.00';
            
            return;
        }
        
        // Show checkout button
        if (checkoutBtn) checkoutBtn.style.display = 'block';
        
        // Hide empty cart message
        if (emptyCart) emptyCart.style.display = 'none';
        
        // Create cart items
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.dataset.id = item.id;
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">৳${(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" aria-label="Decrease quantity">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="${Math.min(10, item.stock || 10)}" aria-label="Quantity">
                        <button class="quantity-btn plus" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <button class="remove-item" aria-label="Remove item"><i class="fas fa-trash"></i></button>
            `;
            
            cartItems.appendChild(cartItem);
            
            // Setup event listeners for quantity buttons & remove button
            const minusBtn = cartItem.querySelector('.minus');
            const plusBtn = cartItem.querySelector('.plus');
            const quantityInput = cartItem.querySelector('input');
            const removeBtn = cartItem.querySelector('.remove-item');
            
            if (minusBtn) {
                minusBtn.addEventListener('click', () => {
                    if (item.quantity > 1) {
                        item.quantity--;
                        updateCartItemUI(cartItem, item);
                    }
                });
            }
            
            if (plusBtn) {
                plusBtn.addEventListener('click', () => {
                    if (item.quantity < Math.min(10, item.stock || 10)) {
                        item.quantity++;
                        updateCartItemUI(cartItem, item);
                    }
                });
            }
            
            if (quantityInput) {
                quantityInput.addEventListener('change', () => {
                    let value = parseInt(quantityInput.value);
                    
                    if (isNaN(value) || value < 1) {
                        value = 1;
                    } else if (value > Math.min(10, item.stock || 10)) {
                        value = Math.min(10, item.stock || 10);
                    }
                    
                    item.quantity = value;
                    updateCartItemUI(cartItem, item);
                });
            }
            
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    removeFromCart(item.id);
                });
            }
        });
        
        // Calculate and update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) {
            cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Update cart item UI
    function updateCartItemUI(cartItem, item) {
        if (!cartItem) return;
        
        const quantityInput = cartItem.querySelector('input');
        const priceElement = cartItem.querySelector('.cart-item-price');
        
        if (quantityInput) quantityInput.value = item.quantity;
        if (priceElement) {
            priceElement.textContent = `৳${(item.price * item.quantity).toLocaleString('en-IN')}`;
        }
        
        // Update total
        updateCartTotal();
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Update cart total
    function updateCartTotal() {
        const cartTotal = document.querySelector('.cart-total span:last-child');
        if (!cartTotal) return;
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
    }
    
    // Update wishlist UI
    function updateWishlistUI() {
        const wishlistItems = document.querySelector('.wishlist-items');
        const emptyWishlist = document.querySelector('.empty-wishlist');
        const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');
        
        if (!wishlistItems) return;
        
        // Show/hide empty wishlist message
        if (emptyWishlist) {
            emptyWishlist.style.display = wishlist.length === 0 ? 'flex' : 'none';
        }
        
        // Show/hide clear wishlist button
        if (clearWishlistBtn) {
            clearWishlistBtn.style.display = wishlist.length === 0 ? 'none' : 'block';
        }
        
        // Remove existing wishlist items
        document.querySelectorAll('.wishlist-item').forEach(item => item.remove());
        
        if (wishlist.length === 0) return;
        
        // Create wishlist items
        wishlist.forEach(item => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item';
            wishlistItem.dataset.id = item.id;
            
            wishlistItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="wishlist-item-info">
                    <h4>${item.name}</h4>
                    <p class="wishlist-item-price">৳${item.price.toLocaleString('en-IN')}</p>
                </div>
                <div class="wishlist-item-actions">
                    <button class="move-to-cart" aria-label="Move to cart"><i class="fas fa-shopping-cart"></i></button>
                    <button class="remove-from-wishlist" aria-label="Remove from wishlist"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            wishlistItems.appendChild(wishlistItem);
            
            // Add event listeners
            const moveToCartBtn = wishlistItem.querySelector('.move-to-cart');
            const removeBtn = wishlistItem.querySelector('.remove-from-wishlist');
            
            if (moveToCartBtn) {
                moveToCartBtn.addEventListener('click', () => {
                    // Find product stock if available on page
                    let stock = 10; // Default
                    const productCard = document.querySelector(`.product-card[data-id="${item.id}"]`);
                    if (productCard) {
                        stock = parseInt(productCard.dataset.stock || 10);
                    }
                    
                    // Add to cart
                    addItemToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: 1,
                        stock: stock
                    });
                    
                    // Remove from wishlist
                    removeFromWishlist(item.id);
                    
                    // Show wishlist sidebar
                    if (wishlistSidebar) {
                        wishlistSidebar.style.right = '-400px';
                    }
                });
            }
            
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    removeFromWishlist(item.id);
                });
            }
        });
    }
    
    // Show notification function
    function showNotification(message, type = 'success') {
        // Remove any existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Set icon based on type
        let icon = 'fa-check-circle';
        if (type === 'info') icon = 'fa-info-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" aria-label="Close notification"><i class="fas fa-times"></i></button>
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
                    border-radius: 10px;
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
                    font-size: 24px;
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
                    padding: 5px;
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
                
                /* Animation for badge counts */
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-5px);
                    }
                    60% {
                        transform: translateY(-2px);
                    }
                }
                
                .bounce {
                    animation: bounce 0.8s;
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
                    document.body.removeChild(notification);
                }
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOut 0.3s forwards';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Define category data object (in a real app, this would come from a database)
    const categoryData = {
        phones: {
            name: 'Mobile Phones',
            title: 'Premium Mobile Phones',
            description: 'Browse our collection of cutting-edge smartphones',
            longDescription: 'Experience the latest in mobile technology with our premium selection of smartphones. Our mobile phones feature advanced camera systems, powerful processors, stunning displays, and innovative features designed to enhance your digital life.',
            image: 'images/iphone.png',
            features: [
                'Latest processor technology',
                'Advanced camera systems',
                'Premium build quality',
                'Extended battery life',
                'Enhanced security features'
            ],
            products: [
                {
                    id: '1',
                    name: 'TechNest iPhone 16 Pro Max',
                    price: 219999,
                    oldPrice: 225999,
                    image: 'images/iphone16W.png',
                    badge: 'New',
                    rating: 4.5,
                    ratingCount: 120,
                    description: 'The iPhone 16 Pro Max features a stunning 6.9" ProMotion XDR display, A17 Pro chip, 48MP main camera with 5x optical zoom, and all-day battery life.',
                    colors: ['white', 'black', 'blue'],
                    stock: 15
                },
                {
                    id: '2',
                    name: 'TechNest iPhone 16 Pro',
                    price: 189999,
                    oldPrice: 199999,
                    image: 'images/iphone16W.png',
                    badge: 'New',
                    rating: 4.5,
                    ratingCount: 89,
                    description: 'The iPhone 16 Pro features a crisp 6.3" ProMotion XDR display, A17 Pro chip, 48MP main camera with 3x optical zoom, and exceptional battery life.',
                    colors: ['white', 'black', 'blue'],
                    stock: 12
                },
                {
                    id: '3',
                    name: 'TechNest iPhone 16',
                    price: 149999, 
                    oldPrice: 159999,
                    image: 'images/iphone16W.png',
                    badge: 'New',
                    rating: 4.3,
                    ratingCount: 67,
                    description: 'The iPhone 16 features a vibrant 6.1" Super Retina XDR display, A17 chip, advanced dual-camera system, and all-day battery life.',
                    colors: ['white', 'black', 'blue'],
                    stock: 18
                },
                {
                    id: '4',
                    name: 'TechNest Samsung Galaxy S25 Ultra',
                    price: 189999,
                    oldPrice: 199999,
                    image: 'images/iphone16W.png',
                    badge: 'Bestseller',
                    rating: 4.7,
                    ratingCount: 154,
                    description: 'The Galaxy S25 Ultra features a 6.8" Dynamic AMOLED 2X display, Snapdragon 8 Gen 3 processor, 200MP main camera, and 5000mAh battery.',
                    colors: ['black', 'white', 'blue'],
                    stock: 10
                },
                {
                    id: '5',
                    name: 'TechNest Google Pixel 9 Pro',
                    price: 129999,
                    oldPrice: 139999,
                    image: 'images/iphone16W.png',
                    badge: null,
                    rating: 4.6,
                    ratingCount: 87,
                    description: 'The Pixel 9 Pro features a 6.7" QHD+ OLED display, Google Tensor G4 chip, incredible computational photography, and all-day battery life.',
                    colors: ['black', 'white'],
                    stock: 8
                },
                {
                    id: '6',
                    name: 'TechNest Samsung Galaxy Z Fold 6',
                    price: 229999,
                    oldPrice: 249999,
                    image: 'images/iphone16W.png',
                    badge: 'Sale',
                    rating: 4.4,
                    ratingCount: 62,
                    description: 'The Galaxy Z Fold 6 features a foldable 7.6" Dynamic AMOLED 2X main display, Snapdragon 8 Gen 3 processor, and versatile camera system.',
                    colors: ['black', 'blue'],
                    stock: 5
                }
            ]
        },
        headphones: {
            name: 'Headphones',
            title: 'Premium Headphones',
            description: 'Immerse yourself in superior sound quality',
            longDescription: 'Our headphones deliver exceptional audio performance with deep bass, clear mids, and crisp highs. Designed for comfort during extended listening sessions, they feature premium materials and noise cancellation technology for an immersive experience.',
            image: 'images/headphones.png',
            features: [
                'Active noise cancellation',
                'Premium sound quality',
                'Long battery life',
                'Comfortable design for extended use',
                'Bluetooth 5.2 technology'
            ],
            products: [
                {
                    id: '7',
                    name: 'TechNest Bass Boost 2.0',
                    price: 68000,
                    oldPrice: 70000,
                    image: 'images/headphone1.png',
                    badge: 'Bestseller',
                    rating: 5.0,
                    ratingCount: 245,
                    description: 'The Bass Boost 2.0 features premium noise cancellation, 40 hours of battery life, ultra-comfortable ear cups, and dynamic bass enhancement.',
                    colors: ['black', 'white', 'blue'],
                    stock: 20
                },
                {
                    id: '8',
                    name: 'TechNest Studio Pro',
                    price: 85000,
                    oldPrice: 89000,
                    image: 'images/headphone1.png',
                    badge: 'New',
                    rating: 4.8,
                    ratingCount: 128,
                    description: 'The Studio Pro headphones deliver studio-quality sound with adaptive EQ, spatial audio, and premium materials for all-day comfort.',
                    colors: ['black', 'white'],
                    stock: 15
                },
                {
                    id: '9',
                    name: 'TechNest SoundWave Elite',
                    price: 49999,
                    oldPrice: 54999,
                    image: 'images/headphone1.png',
                    badge: 'Sale',
                    rating: 4.6,
                    ratingCount: 196,
                    description: 'The SoundWave Elite features adaptive noise cancellation, transparency mode, 45 hours of battery life, and premium audio drivers.',
                    colors: ['black', 'blue', 'red'],
                    stock: 18
                },
                {
                    id: '10',
                    name: 'TechNest Gaming Master',
                    price: 42999,
                    oldPrice: 47999,
                    image: 'images/headphone1.png',
                    badge: null,
                    rating: 4.7,
                    ratingCount: 162,
                    description: 'The Gaming Master headphones feature 3D spatial audio, ultra-low latency connection, customizable RGB lighting, and premium comfort.',
                    colors: ['black', 'red'],
                    stock: 22
                }
            ]
        },
        // Other category data remains the same...
        // Create similar data for other categories (laptops, earbuds, tablets, smartwatches)
    };
    
    // Related categories mapping
    const relatedCategories = {
        phones: ['tablets', 'accessories', 'earbuds'],
        headphones: ['earbuds', 'accessories', 'laptops'],
        laptops: ['accessories', 'tablets', 'gaming'],
        earbuds: ['headphones', 'accessories', 'phones'],
        tablets: ['accessories', 'laptops', 'phones'],
        smartwatches: ['phones', 'accessories', 'earbuds'],
        gaming: ['accessories', 'laptops', 'headphones'],
        accessories: ['phones', 'headphones', 'tablets']
    };
    
    // Add responsive functionality for smaller screens
    function handleResponsiveLayout() {
        // Mobile responsiveness for filters
        const productsFilters = document.querySelector('.products-filters');
        if (productsFilters && window.innerWidth <= 768) {
            const filterGroups = productsFilters.querySelectorAll('.filter-group');
            filterGroups.forEach(group => {
                group.style.width = '100%';
            });
        }
    }
    
    // Call responsive layout handler on load and resize
    window.addEventListener('resize', handleResponsiveLayout);
    handleResponsiveLayout();
});