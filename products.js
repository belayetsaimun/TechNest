document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const productGrid = document.querySelector('.product-grid');
    const productCards = document.querySelectorAll('.product-card');
    const sortBySelect = document.getElementById('sort-by');
    const categoryFilter = document.getElementById('category-filter');
    const priceRangeFilter = document.getElementById('price-range');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const pagination = document.querySelector('.pagination');
    const pageButtons = document.querySelectorAll('.page-btn');

    // Initialize cart and wishlist
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Update cart and wishlist counts
    updateCartCount();
    updateWishlistCount();
    
    // Initialize wishlist icons
    initializeWishlistIcons();

    // Filter and Sort Functions
    function applyFilters() {
        const selectedCategory = categoryFilter.value;
        const selectedPriceRange = priceRangeFilter.value;
        
        productCards.forEach(card => {
            const category = card.dataset.category;
            const price = parseFloat(card.dataset.price);
            
            let categoryMatch = selectedCategory === 'all' || category === selectedCategory;
            let priceMatch = true;
            
            if (selectedPriceRange !== 'all') {
                const rangeParts = selectedPriceRange.split('-');
                if (rangeParts.length === 2) {
                    const minPrice = parseFloat(rangeParts[0]);
                    const maxPrice = parseFloat(rangeParts[1]);
                    priceMatch = price >= minPrice && price <= maxPrice;
                } else if (selectedPriceRange.endsWith('+')) {
                    const minPrice = parseFloat(selectedPriceRange.slice(0, -1));
                    priceMatch = price >= minPrice;
                }
            }
            
            if (categoryMatch && priceMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    function sortProducts() {
        const sortValue = sortBySelect.value;
        const products = Array.from(productCards);
        
        products.sort((a, b) => {
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
        
        // Reattach sorted products to the grid
        products.forEach(product => {
            productGrid.appendChild(product);
        });
    }
    
    // Event Listeners
    if (sortBySelect) {
        sortBySelect.addEventListener('change', sortProducts);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (priceRangeFilter) {
        priceRangeFilter.addEventListener('change', applyFilters);
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            sortBySelect.value = 'popularity';
            categoryFilter.value = 'all';
            priceRangeFilter.value = 'all';
            
            productCards.forEach(card => {
                card.style.display = 'block';
            });
            
            sortProducts();
        });
    }
    
    // Pagination (simplified for demo)
    if (pageButtons) {
        pageButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                pageButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // In a real application, you would load the appropriate page of products here
                // For demo, we'll just scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }
    
    // Product Card Action Buttons
    const quickViewBtns = document.querySelectorAll('.quick-view');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const addToWishlistBtns = document.querySelectorAll('.add-to-wishlist');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openQuickView(btn.closest('.product-card'));
        });
    });
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(btn.closest('.product-card'));
        });
    });
    
    addToWishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleWishlist(btn.closest('.product-card'));
        });
    });
    
    // Quick View Modal
    function openQuickView(productCard) {
        const modal = document.getElementById('quickViewModal');
        const overlay = document.getElementById('overlay');
        const closeModal = modal.querySelector('.close-modal');
        
        // Get product data
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        const productOldPrice = productCard.querySelector('.old-price')?.textContent || '';
        const productImage = productCard.querySelector('img').src;
        const productRating = productCard.querySelector('.product-rating').innerHTML;
        
        // Populate modal
        modal.querySelector('h2').textContent = productName;
        modal.querySelector('.current-price').textContent = productPrice;
        modal.querySelector('.product-quick-view-image img').src = productImage;
        modal.querySelector('.product-rating').innerHTML = productRating;
        
        if (productOldPrice) {
            modal.querySelector('.old-price').textContent = productOldPrice;
            modal.querySelector('.old-price').style.display = 'inline';
            
            // Calculate discount percentage
            const currentPrice = parseFloat(productPrice.replace(/[৳,]/g, ''));
            const oldPrice = parseFloat(productOldPrice.replace(/[৳,]/g, ''));
            const discountPercent = Math.round((oldPrice - currentPrice) / oldPrice * 100);
            
            modal.querySelector('.discount').textContent = `-${discountPercent}%`;
            modal.querySelector('.discount').style.display = 'inline';
        } else {
            modal.querySelector('.old-price').style.display = 'none';
            modal.querySelector('.discount').style.display = 'none';
        }
        
        // Set product data attributes for add to cart functionality
        modal.dataset.id = productCard.dataset.id;
        modal.dataset.name = productName;
        modal.dataset.price = productCard.dataset.price;
        modal.dataset.image = productImage;
        
        // Show modal
        modal.style.display = 'block';
        overlay.style.display = 'block';
        
        // Close modal event
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            overlay.style.display = 'none';
        });
        
        // Add to cart button in modal
        const addToCartBtn = modal.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            addToCartFromModal(modal);
        });
        
        // Buy now button in modal
        const buyNowBtn = modal.querySelector('.buy-now-btn');
        buyNowBtn.addEventListener('click', () => {
            showBuyNowModal(modal);
        });
    }
    
    // Helper Functions
    function addToCart(productCard) {
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        
        // Show notification
        showNotification(`Added ${productName} to cart!`, 'success');
        
        // Open cart sidebar
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        cartSidebar.style.right = '0';
        overlay.style.display = 'block';
        
        // Update cart UI in sidebar
        updateCartUI();
    }
    
    function addToCartFromModal(modal) {
        const productId = modal.dataset.id;
        const productName = modal.dataset.name;
        const productPrice = parseFloat(modal.dataset.price);
        const productImage = modal.dataset.image;
        const quantity = parseInt(modal.querySelector('.quantity-selector input').value);
        
        // Create product object
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity
        };
        
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push(product);
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        
        // Close modal
        modal.style.display = 'none';
        
        // Show notification
        showNotification(`Added ${productName} to cart!`, 'success');
        
        // Open cart sidebar
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        cartSidebar.style.right = '0';
        overlay.style.display = 'block';
        
        // Update cart UI in sidebar
        updateCartUI();
    }
    
    function showBuyNowModal(quickViewModal) {
        const buyNowModal = document.getElementById('buyNowModal');
        const productName = quickViewModal.dataset.name;
        const productPrice = quickViewModal.dataset.price;
        const productImage = quickViewModal.dataset.image;
        const quantity = quickViewModal.querySelector('.quantity-selector input').value;
        
        // Format price with ৳ symbol
        const formattedPrice = `৳${parseFloat(productPrice).toLocaleString('en-IN')}`;
        
        // Close quick view modal
        quickViewModal.style.display = 'none';
        
        // Populate buy now modal
        buyNowModal.querySelector('.buy-now-product-image img').src = productImage;
        buyNowModal.querySelector('.buy-now-product-info h3').textContent = productName;
        buyNowModal.querySelector('.price').textContent = formattedPrice;
        buyNowModal.querySelector('.product-name').textContent = productName;
        buyNowModal.querySelector('.product-price').textContent = formattedPrice;
        
        // Calculate total
        const total = parseFloat(productPrice) * parseInt(quantity);
        buyNowModal.querySelector('.product-quantity').textContent = quantity;
        buyNowModal.querySelector('.product-total').textContent = `৳${total.toLocaleString('en-IN')}`;
        
        // Store product data in modal
        buyNowModal.dataset.id = quickViewModal.dataset.id;
        buyNowModal.dataset.name = productName;
        buyNowModal.dataset.price = productPrice;
        buyNowModal.dataset.image = productImage;
        
        // Show buy now modal
        buyNowModal.style.display = 'block';
        
        // Add to cart from buy now modal
        const addToCartFromBuyNowBtn = buyNowModal.querySelector('.add-to-cart-from-buynow');
        addToCartFromBuyNowBtn.addEventListener('click', () => {
            const productId = buyNowModal.dataset.id;
            const productName = buyNowModal.dataset.name;
            const productPrice = buyNowModal.dataset.price;
            const productImage = buyNowModal.dataset.image;
            const quantity = buyNowModal.querySelector('.quantity-selector input').value;
            
            // Add to cart
            const product = {
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: parseInt(quantity)
            };
            
            // Check if product is already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += parseInt(quantity);
            } else {
                cart.push(product);
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            
            // Close buy now modal
            buyNowModal.style.display = 'none';
            
            // Show notification
            showNotification(`Added ${productName} to cart!`, 'success');
            
            // Open cart sidebar
            const cartSidebar = document.getElementById('cartSidebar');
            const overlay = document.getElementById('overlay');
            cartSidebar.style.right = '0';
            overlay.style.display = 'block';
            
            // Update cart UI in sidebar
            updateCartUI();
        });
    }
    
    function toggleWishlist(productCard) {
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
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far');
            
            // Show notification
            showNotification(`Removed ${productName} from wishlist!`, 'info');
        } else {
            // Add to wishlist
            wishlist.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            });
            
            // Update heart icon
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
            
            // Show notification
            showNotification(`Added ${productName} to wishlist!`, 'success');
        }
        
        // Save to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update UI
        updateWishlistCount();
    }
    
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
    
    function updateWishlistCount() {
        const wishlistCount = document.querySelector('.wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = wishlist.length;
        }
    }
    
    function updateCartUI() {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total span:last-child');
        const checkoutBtn = document.querySelector('.checkout-btn');
        
        if (!cartItems || !cartTotal) return;
        
        if (cart.length === 0) {
            // Show empty cart message
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <p>Your cart is empty</p>
                    <a href="#" class="btn secondary-btn">Start Shopping</a>
                </div>
            `;
            
            cartTotal.textContent = '৳0.00';
            
            if (checkoutBtn) {
                checkoutBtn.style.display = 'none';
            }
        } else {
            // Clear cart items
            cartItems.innerHTML = '';
            
            // Add each cart item
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
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="10">
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <button class="remove-item"><i class="fas fa-trash"></i></button>
                `;
                
                cartItems.appendChild(cartItem);
                
                // Add event listeners
                const minusBtn = cartItem.querySelector('.minus');
                const plusBtn = cartItem.querySelector('.plus');
                const removeBtn = cartItem.querySelector('.remove-item');
                const quantityInput = cartItem.querySelector('input');
                
                minusBtn.addEventListener('click', () => {
                    const currentValue = parseInt(quantityInput.value);
                    if (currentValue > 1) {
                        quantityInput.value = currentValue - 1;
                        updateCartItemQuantity(item.id, currentValue - 1);
                    }
                });
                
                plusBtn.addEventListener('click', () => {
                    const currentValue = parseInt(quantityInput.value);
                    if (currentValue < 10) {
                        quantityInput.value = currentValue + 1;
                        updateCartItemQuantity(item.id, currentValue + 1);
                    }
                });
                
                removeBtn.addEventListener('click', () => {
                    removeFromCart(item.id);
                });
            });
            
            // Calculate total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
            
            if (checkoutBtn) {
                checkoutBtn.style.display = 'block';
            }
        }
    }
    
    function updateCartItemQuantity(productId, quantity) {
        // Find item in cart
        const cartItem = cart.find(item => item.id === productId);
        
        if (cartItem) {
            cartItem.quantity = quantity;
            
            // Update UI
            const cartItemElement = document.querySelector(`.cart-item[data-id="${productId}"]`);
            const priceElement = cartItemElement.querySelector('.cart-item-price');
            
            // Format with ৳ symbol
            priceElement.textContent = `৳${(cartItem.price * quantity).toLocaleString('en-IN')}`;
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const cartTotal = document.querySelector('.cart-total span:last-child');
            
            if (cartTotal) {
                cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
            }
        }