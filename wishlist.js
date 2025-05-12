// Wishlist Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const wishlistGrid = document.getElementById('wishlistGrid');
    const emptyWishlistMessage = document.getElementById('emptyWishlistMessage');
    const clearWishlistBtn = document.getElementById('clearWishlistBtn');
    const sortWishlistSelect = document.getElementById('sortWishlist');
    
    // Initialize wishlist from localStorage
    let wishlist = [];
    
    // Load wishlist data
    initializeWishlist();
    
    // Function to initialize wishlist
    function initializeWishlist() {
        try {
            // Get wishlist from localStorage
            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) {
                wishlist = JSON.parse(savedWishlist);
                console.log('Loaded wishlist from localStorage:', wishlist);
            } else {
                wishlist = [];
                console.log('No saved wishlist found, initialized empty wishlist');
            }
            
            // Update UI
            updateWishlistUI();
            updateWishlistCount();
        } catch (error) {
            console.error('Error initializing wishlist:', error);
            // Reset wishlist if there's an error
            wishlist = [];
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistUI();
        }
    }
    
    // Function to update wishlist UI
    function updateWishlistUI() {
        if (wishlist.length === 0) {
            // Show empty wishlist message
            emptyWishlistMessage.style.display = 'block';
            wishlistGrid.style.display = 'none';
        } else {
            // Hide empty wishlist message
            emptyWishlistMessage.style.display = 'none';
            wishlistGrid.style.display = 'grid';
            
            // Clear wishlist grid
            wishlistGrid.innerHTML = '';
            
            // Sort wishlist items if needed
            sortWishlistItems();
            
            // Create wishlist items
            wishlist.forEach(item => {
                const wishlistItem = createWishlistItem(item);
                wishlistGrid.appendChild(wishlistItem);
            });
            
            // Add event listeners to wishlist items
            setupWishlistItemEvents();
        }
    }
    
    // Function to create wishlist item DOM element
    function createWishlistItem(item) {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.dataset.id = item.id;
        wishlistItem.dataset.price = item.price;
        wishlistItem.dataset.name = item.name;
        
        // Format the price with commas for thousands separator
        const formattedPrice = item.price.toLocaleString('en-IN');
        
        // Calculate old price (for demonstration, 5% higher)
        const oldPrice = (item.price * 1.05).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        wishlistItem.innerHTML = `
            <div class="wishlist-item-image">
                <img src="${item.image}" alt="${item.name}">
                <button class="remove-from-wishlist" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="wishlist-item-details">
                <h3>${item.name}</h3>
                <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                    <span>(${Math.floor(Math.random() * 200) + 50})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">৳${formattedPrice}</span>
                    <span class="old-price">৳${oldPrice}</span>
                </div>
                <div class="availability in-stock">
                    <i class="fas fa-check-circle"></i> In Stock
                </div>
                <div class="wishlist-buttons">
                    <button class="btn primary-btn add-to-cart-btn" data-id="${item.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn secondary-btn buy-now-btn" data-id="${item.id}">Buy Now</button>
                </div>
            </div>
        `;
        
        return wishlistItem;
    }
    
    // Function to setup event listeners for wishlist items
    function setupWishlistItemEvents() {
        // Remove from wishlist buttons
        const removeButtons = document.querySelectorAll('.remove-from-wishlist');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                removeFromWishlist(productId);
            });
        });
        
        // Add to cart buttons
        const addToCartButtons = document.querySelectorAll('.wishlist-item .add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const wishlistItem = this.closest('.wishlist-item');
                addToCartFromWishlist(wishlistItem);
            });
        });
        
        // Buy now buttons
        const buyNowButtons = document.querySelectorAll('.wishlist-item .buy-now-btn');
        buyNowButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const wishlistItem = this.closest('.wishlist-item');
                buyNowFromWishlist(wishlistItem);
            });
        });
    }
    
    // Function to remove item from wishlist
    function removeFromWishlist(productId) {
        // Find the item in the wishlist
        const itemIndex = wishlist.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = wishlist[itemIndex];
            
            // Remove the item from the wishlist
            wishlist.splice(itemIndex, 1);
            
            // Save wishlist to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Update UI
            updateWishlistUI();
            updateWishlistCount();
            
            // Show notification
            showNotification(`Removed ${removedItem.name} from wishlist!`, 'info');
        }
    }
    
    // Function to add item to cart from wishlist
    function addToCartFromWishlist(wishlistItem) {
        const productId = wishlistItem.dataset.id;
        const productName = wishlistItem.dataset.name;
        const productPrice = parseFloat(wishlistItem.dataset.price);
        const productImage = wishlistItem.querySelector('img').src;
        
        // Add item to cart
        addItemToCart({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
        
        // Show notification
        showNotification(`Added ${productName} to cart!`, 'success');
    }
    
    // Function to add item to cart
    function addItemToCart(product) {
        // Get cart from localStorage
        let cart = [];
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        
        // Check if product is already in cart
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // Increase quantity if item already exists
            cart[existingItemIndex].quantity += product.quantity;
        } else {
            // Add new item to cart
            cart.push(product);
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount(cart);
    }
    
    // Function to buy now from wishlist
    function buyNowFromWishlist(wishlistItem) {
        const productId = wishlistItem.dataset.id;
        const productName = wishlistItem.dataset.name;
        const productPrice = parseFloat(wishlistItem.dataset.price);
        const productImage = wishlistItem.querySelector('img').src;
        
        // Add item to cart
        addItemToCart({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
        
        // Redirect to checkout page
        window.location.href = 'checkout.html';
    }
    
    // Function to clear wishlist
    function clearWishlist() {
        // Confirm before clearing
        if (confirm('Are you sure you want to clear your wishlist?')) {
            // Clear wishlist array
            wishlist = [];
            
            // Save empty wishlist to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Update UI
            updateWishlistUI();
            updateWishlistCount();
            
            // Show notification
            showNotification('Wishlist cleared!', 'info');
        }
    }
    
    // Function to sort wishlist items
    function sortWishlistItems() {
        const sortBy = sortWishlistSelect.value;
        
        switch (sortBy) {
            case 'name-asc':
                wishlist.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                wishlist.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                wishlist.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                wishlist.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                // If we had timestamp data, we could sort by that
                // For now, we'll leave as is (default order)
                break;
            default:
                // Default sorting (no change)
                break;
        }
    }
    
    // Function to update wishlist count
    function updateWishlistCount() {
        const wishlistCountElements = document.querySelectorAll('.wishlist-count');
        
        wishlistCountElements.forEach(countElement => {
            countElement.textContent = wishlist.length;
        });
    }
    
    // Function to update cart count
    function updateCartCount(cart) {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(countElement => {
            countElement.textContent = totalItems;
        });
    }
    
    // Event Listeners
    if (clearWishlistBtn) {
        clearWishlistBtn.addEventListener('click', clearWishlist);
    }
    
    if (sortWishlistSelect) {
        sortWishlistSelect.addEventListener('change', updateWishlistUI);
    }
    
    // Set up quick view events for related products
    setupQuickViewEvents();
    
    // Setup event listeners for related products
    function setupQuickViewEvents() {
        const quickViewButtons = document.querySelectorAll('.related-products .quick-view');
        const addToCartButtons = document.querySelectorAll('.related-products .add-to-cart');
        const addToWishlistButtons = document.querySelectorAll('.related-products .add-to-wishlist');
        
        quickViewButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productCard = this.closest('.product-card');
                if (productCard) {
                    openQuickView(productCard);
                }
            });
        });
        
        addToCartButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productCard = this.closest('.product-card');
                if (productCard) {
                    addToCart(productCard);
                }
            });
        });
        
        addToWishlistButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productCard = this.closest('.product-card');
                if (productCard) {
                    toggleWishlist(productCard);
                }
            });
        });
    }
    
    // Function to add product to cart (from related products)
    function addToCart(productCard) {
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        
        // Add item to cart
        addItemToCart({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
        
        // Show notification
        showNotification(`Added ${productName} to cart!`, 'success');
    }
    
    // Function to toggle wishlist (from related products)
    function toggleWishlist(productCard) {
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        const heartIcon = productCard.querySelector('.add-to-wishlist i');
        
        // Check if product is already in wishlist
        const existingItemIndex = wishlist.findIndex(item => item.id === productId);
        
        if (existingItemIndex !== -1) {
            // Remove from wishlist
            wishlist.splice(existingItemIndex, 1);
            
            // Update heart icon
            if (heartIcon) {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
            }
            
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
            if (heartIcon) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
            }
            
            // Show notification
            showNotification(`Added ${productName} to wishlist!`, 'success');
        }
        
        // Save wishlist to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update UI
        updateWishlistCount();
    }
    
    // Function to open quick view modal
    function openQuickView(productCard) {
        const quickViewModal = document.getElementById('quickViewModal');
        const overlay = document.getElementById('overlay');
        
        if (!productCard || !quickViewModal) {
            return;
        }
        
        // Get product data
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        
        // Populate modal with product details
        const modalTitle = quickViewModal.querySelector('h2');
        const modalPrice = quickViewModal.querySelector('.current-price');
        const modalImage = quickViewModal.querySelector('.product-quick-view-image img');
        
        if (modalTitle) modalTitle.textContent = productName;
        if (modalPrice) modalPrice.textContent = `৳${productPrice.toLocaleString('en-IN')}`;
        if (modalImage) {
            modalImage.src = productImage;
            modalImage.alt = productName;
        }
        
        // Show modal
        quickViewModal.style.display = 'block';
        overlay.style.display = 'block';
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
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Add close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
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