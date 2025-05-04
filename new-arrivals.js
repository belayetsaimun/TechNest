// New Arrivals Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize product filtering
    initProductFilter();
    
    // Initialize product sorting
    initProductSorting();
    
    // Initialize color selection in featured product
    initColorSelection();
    
    // Initialize coming soon slider
    initComingSoonSlider();
    
    // Initialize notify buttons
    initNotifyButtons();
    
    // Initialize quick view functionality
    initQuickView();
    
    // Initialize add to cart functionality
    initAddToCart();
    
    // Initialize add to wishlist functionality
    initAddToWishlist();
    
    // Set animation delay for product cards
    setProductCardAnimationDelay();
    
    // Initialize pagination
    initPagination();
});

// Set animation delay for product cards based on their position
function setProductCardAnimationDelay() {
    const productCards = document.querySelectorAll('.product-card.new-product');
    
    productCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });
}

// Product Filter Functionality
function initProductFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card.new-product');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.getAttribute('data-filter');
            
            // Filter products
            productCards.forEach(card => {
                // First, hide the card with a fade-out effect
                card.classList.add('fade-out');
                
                setTimeout(() => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.classList.remove('hidden');
                        // Reset animation
                        card.style.animation = 'none';
                        card.offsetHeight; // Trigger reflow
                        card.style.animation = null;
                        card.classList.add('fade-in');
                    } else {
                        card.classList.add('hidden');
                    }
                    
                    card.classList.remove('fade-out');
                }, 300);
            });
        });
    });
}

// Product Sorting Functionality
function initProductSorting() {
    const sortSelect = document.getElementById('sort-select');
    const productsGrid = document.querySelector('.products-grid');
    
    if (!sortSelect || !productsGrid) return;
    
    sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        const productCards = Array.from(document.querySelectorAll('.product-card.new-product'));
        
        // Sort product cards based on selected option
        productCards.sort((a, b) => {
            switch (sortValue) {
                case 'newest':
                    return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
                
                case 'price-low':
                    return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
                
                case 'price-high':
                    return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
                
                case 'popular':
                    const aRating = a.querySelector('.product-rating span');
                    const bRating = b.querySelector('.product-rating span');
                    const aReviews = aRating ? parseInt(aRating.textContent.replace(/[()]/g, '')) : 0;
                    const bReviews = bRating ? parseInt(bRating.textContent.replace(/[()]/g, '')) : 0;
                    return bReviews - aReviews;
                
                default:
                    return 0;
            }
        });
        
        // Remove all product cards from grid
        productCards.forEach(card => card.remove());
        
        // Add sorted product cards back to grid with fade-in animation
        productCards.forEach((card, index) => {
            card.style.setProperty('--card-index', index);
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            card.style.animation = null;
            productsGrid.appendChild(card);
        });
    });
}

// Color Selection in Featured Product
function initColorSelection() {
    const colorOptions = document.querySelectorAll('.colors .color');
    const selectedColorText = document.querySelector('.selected-color');
    
    if (!colorOptions.length || !selectedColorText) return;
    
    colorOptions.forEach(color => {
        color.addEventListener('click', () => {
            // Update active color
            colorOptions.forEach(c => c.classList.remove('active'));
            color.classList.add('active');
            
            // Update selected color text
            const colorName = color.getAttribute('data-color');
            selectedColorText.textContent = `Selected: ${colorName}`;
        });
    });
}

// Coming Soon Slider Functionality
function initComingSoonSlider() {
    const sliderContainer = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.coming-soon-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.slider-controls .prev-btn');
    const nextBtn = document.querySelector('.slider-controls .next-btn');
    
    if (!sliderContainer || !slides.length || !dots.length) return;
    
    let currentSlide = 0;
    const slideWidth = 100; // 100%
    
    // Initialize slider position
    updateSliderPosition();
    
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSliderPosition();
        });
    }
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSliderPosition();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSliderPosition();
        });
    });
    
    // Helper function to update slider position
    function updateSliderPosition() {
        // Update slider position
        Array.from(slides).forEach((slide, index) => {
            if (index === currentSlide) {
                slide.style.display = 'flex';
            } else {
                slide.style.display = 'none';
            }
        });
        
        // Update active dot
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Auto rotate slides
    let slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSliderPosition();
    }, 5000);
    
    // Pause auto rotation on hover
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    // Resume auto rotation on mouse leave
    sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSliderPosition();
        }, 5000);
    });
}

// Notify Buttons Functionality
function initNotifyButtons() {
    const notifyBtns = document.querySelectorAll('.notify-btn');
    const notifyModal = document.getElementById('notifyModal');
    const closeModal = notifyModal ? notifyModal.querySelector('.close-modal') : null;
    const overlay = document.getElementById('overlay');
    const notifyForm = notifyModal ? notifyModal.querySelector('.notify-form') : null;
    
    if (!notifyBtns.length || !notifyModal || !overlay) return;
    
    // Open notify modal when clicking notify button
    notifyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get product name from closest card
            const card = btn.closest('.coming-soon-card');
            const productName = card ? card.querySelector('h3').textContent : 'this product';
            
            // Update modal title
            const modalTitle = notifyModal.querySelector('h3');
            if (modalTitle) {
                modalTitle.textContent = `Get Notified about ${productName}`;
            }
            
            // Update modal description
            const modalDesc = notifyModal.querySelector('p');
            if (modalDesc) {
                modalDesc.textContent = `We'll send you an email when ${productName} becomes available.`;
            }
            
            // Show modal
            notifyModal.style.display = 'block';
            overlay.style.display = 'block';
        });
    });
    
    // Close modal when clicking close button
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            notifyModal.style.display = 'none';
            overlay.style.display = 'none';
        });
    }
    
    // Close modal when clicking overlay
    overlay.addEventListener('click', () => {
        notifyModal.style.display = 'none';
        overlay.style.display = 'none';
    });
    
    // Handle notify form submission
    if (notifyForm) {
        notifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = notifyForm.querySelector('#notify-email');
            const checkbox = notifyForm.querySelector('#notify-checkbox');
            
            if (emailInput && emailInput.value) {
                // In a real app, you would send this data to a server
                console.log('Notify email:', emailInput.value);
                console.log('Notify about other products:', checkbox ? checkbox.checked : false);
                
                // Show success message
                showNotification('You will be notified when this product is available!', 'success');
                
                // Close modal
                notifyModal.style.display = 'none';
                overlay.style.display = 'none';
                
                // Reset form
                notifyForm.reset();
            }
        });
    }
}

// Quick View Functionality
function initQuickView() {
    const quickViewBtns = document.querySelectorAll('.quick-view');
    const quickViewModal = document.getElementById('quickViewModal');
    const closeModal = quickViewModal ? quickViewModal.querySelector('.close-modal') : null;
    const overlay = document.getElementById('overlay');
    
    if (!quickViewBtns.length || !quickViewModal || !overlay) return;
    
    // Open quick view modal when clicking quick view button
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get product data from closest product card
            const card = btn.closest('.product-card');
            
            if (card) {
                const productId = card.getAttribute('data-id');
                const productName = card.getAttribute('data-name');
                const productPrice = card.getAttribute('data-price');
                const productImage = card.getAttribute('data-image');
                
                // Get rating from the product card
                const ratingElement = card.querySelector('.product-rating');
                const ratingHTML = ratingElement ? ratingElement.innerHTML : '';
                
                // Get product description
                const descElement = card.querySelector('.product-description p');
                const description = descElement ? descElement.textContent : '';
                
                // Update modal content
                updateQuickViewModal(productId, productName, productPrice, productImage, ratingHTML, description);
                
                // Show modal
                quickViewModal.style.display = 'block';
                overlay.style.display = 'block';
            }
        });
    });
    
    // Close modal when clicking close button
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            quickViewModal.style.display = 'none';
            overlay.style.display = 'none';
        });
    }
    
    // Close modal when clicking overlay
    overlay.addEventListener('click', () => {
        quickViewModal.style.display = 'none';
        overlay.style.display = 'none';
    });
    
    // Helper function to update quick view modal content
    function updateQuickViewModal(id, name, price, image, ratingHTML, description) {
        // Update product name
        const nameElement = quickViewModal.querySelector('h2');
        if (nameElement) nameElement.textContent = name;
        
        // Update product price
        const priceElement = quickViewModal.querySelector('.current-price');
        if (priceElement) priceElement.textContent = `৳${parseInt(price).toLocaleString('en-IN')}`;
        
        // Update product image
        const imageElement = quickViewModal.querySelector('img');
        if (imageElement) {
            imageElement.src = image;
            imageElement.alt = name;
        }
        
        // Update product rating
        const ratingElement = quickViewModal.querySelector('.product-rating');
        if (ratingElement && ratingHTML) ratingElement.innerHTML = ratingHTML;
        
        // Update product description
        const descElement = quickViewModal.querySelector('.product-description p');
        if (descElement) descElement.textContent = description;
        
        // Store product data in modal for add to cart functionality
        quickViewModal.setAttribute('data-id', id);
        quickViewModal.setAttribute('data-name', name);
        quickViewModal.setAttribute('data-price', price);
        quickViewModal.setAttribute('data-image', image);
        
        // Reset quantity input
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        if (quantityInput) quantityInput.value = 1;
        
        // Setup quantity buttons
        setupQuantityButtons();
    }
    
    // Setup quantity buttons
    function setupQuantityButtons() {
        const minusBtn = quickViewModal.querySelector('.minus');
        const plusBtn = quickViewModal.querySelector('.plus');
        const input = quickViewModal.querySelector('.quantity-selector input');
        
        if (!minusBtn || !plusBtn || !input) return;
        
        // Minus button click
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
            }
        });
        
        // Plus button click
        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue < 10) {
                input.value = currentValue + 1;
            }
        });
    }
}

// Add to Cart Functionality
function initAddToCart() {
    // Add to cart buttons in product cards
    const addToCartBtns = document.querySelectorAll('.product-btn, .featured-actions .primary-btn, .add-to-cart');
    
    // Add to cart button in quick view modal
    const quickViewAddToCartBtn = document.querySelector('.add-to-cart-btn');
    
    // Handle add to cart from product cards
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product data from closest product card
            const card = this.closest('.product-card') || this.closest('.featured-container');
            
            if (card) {
                let productId, productName, productPrice, productImage;
                
                // Check if it's a product card or featured product
                if (card.classList.contains('product-card')) {
                    productId = card.getAttribute('data-id');
                    productName = card.getAttribute('data-name');
                    productPrice = parseFloat(card.getAttribute('data-price'));
                    productImage = card.getAttribute('data-image');
                } else {
                    // It's the featured product
                    const nameElement = card.querySelector('h3');
                    const priceElement = card.querySelector('.price');
                    const imageElement = card.querySelector('img');
                    
                    productId = 'featured-1';
                    productName = nameElement ? nameElement.textContent : 'Featured Product';
                    productPrice = priceElement ? parseFloat(priceElement.textContent.replace(/[৳,]/g, '')) : 0;
                    productImage = imageElement ? imageElement.src : '';
                }
                
                // Create product object
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                };
                
                // Add to cart
                addToCartHandler(product);
                
                // Add highlight effect to the card
                if (card.classList.contains('product-card')) {
                    card.classList.add('highlight');
                    setTimeout(() => {
                        card.classList.remove('highlight');
                    }, 1000);
                }
                
                // Change button text temporarily
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }
        });
    });
    
    // Handle add to cart from quick view modal
    if (quickViewAddToCartBtn) {
        quickViewAddToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const modal = document.getElementById('quickViewModal');
            
            if (modal) {
                const productId = modal.getAttribute('data-id');
                const productName = modal.getAttribute('data-name');
                const productPrice = parseFloat(modal.getAttribute('data-price'));
                const productImage = modal.getAttribute('data-image');
                const quantityInput = modal.querySelector('.quantity-selector input');
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                
                // Create product object
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: quantity
                };
                
                // Add to cart
                addToCartHandler(product);
                
                // Close modal
                modal.style.display = 'none';
                document.getElementById('overlay').style.display = 'none';
            }
        });
    }
    
    // Handle add to cart functionality
    function addToCartHandler(product) {
        // Try to use main site's cart functions
        if (typeof window.addToCart === 'function') {
            // Create dummy product card
            const dummyCard = createDummyProductCard(product);
            window.addToCart(dummyCard);
            return;
        }
        
        if (typeof window.addItemToCart === 'function') {
            window.addItemToCart(product);
            return;
        }
        
        // Fallback if main site's functions are not available
        addToCartFallback(product);
    }
    
    // Create dummy product card for compatibility with main site's cart function
    function createDummyProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id;
        card.dataset.name = product.name;
        card.dataset.price = product.price;
        card.dataset.image = product.image;
        return card;
    }
    
    // Fallback add to cart function
    function addToCartFallback(product) {
        console.log('Using cart fallback functionality');
        
        // Get cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
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
        
        // Update cart UI
        updateCartUIElements(cart);
        
        // Show cart sidebar
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        
        if (cartSidebar && overlay) {
            cartSidebar.style.right = '0';
            overlay.style.display = 'block';
            
            // Update cart sidebar content
            updateCartSidebar(cart);
        }
        
        // Show notification
        showNotification(`Added ${product.name} to cart!`, 'success');
    }
    
    // Update cart UI elements
    function updateCartUIElements(cart) {
        // Update cart count badge
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
        
        // Update cart total
        const cartTotal = document.querySelector('.cart-total span:last-child');
        if (cartTotal) {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
        }
        
        // Try to use main site's update functions
        if (typeof window.updateCartCount === 'function') {
            window.updateCartCount();
        }
        
        if (typeof window.updateCartUI === 'function') {
            window.updateCartUI();
        }
    }
    
    // Update cart sidebar content
    function updateCartSidebar(cart) {
        const cartItems = document.querySelector('.cart-items');
        if (!cartItems) return;
        
        // Clear cart items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            // Show empty cart message
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <p>Your cart is empty</p>
                    <a href="#latest-products" class="btn secondary-btn">Start Shopping</a>
                </div>
            `;
            return;
        }
        
        // Add cart items
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
            
            // Setup cart item controls
            setupCartItemControls(cartItem, cart);
        });
    }
    
    // Setup cart item controls
    function setupCartItemControls(cartItem, cart) {
        const minusBtn = cartItem.querySelector('.minus');
        const plusBtn = cartItem.querySelector('.plus');
        const input = cartItem.querySelector('input');
        const removeBtn = cartItem.querySelector('.remove-item');
        const itemId = cartItem.dataset.id;
        
        // Minus button
        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    updateCartItemQuantity(itemId, currentValue - 1, cart);
                }
            });
        }
        
        // Plus button
        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                if (currentValue < 10) {
                    input.value = currentValue + 1;
                    updateCartItemQuantity(itemId, currentValue + 1, cart);
                }
            });
        }
        
        // Input change
        if (input) {
            input.addEventListener('change', () => {
                let value = parseInt(input.value);
                if (isNaN(value) || value < 1) value = 1;
                if (value > 10) value = 10;
                input.value = value;
                updateCartItemQuantity(itemId, value, cart);
            });
        }
        
        // Remove button
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                removeCartItem(itemId, cart);
            });
        }
    }
    
    // Update cart item quantity
    function updateCartItemQuantity(itemId, quantity, cart) {
        // Find item in cart
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
            // Update quantity
            cart[itemIndex].quantity = quantity;
            
            // Update price in UI
            const cartItem = document.querySelector(`.cart-item[data-id="${itemId}"]`);
            if (cartItem) {
                const priceElement = cartItem.querySelector('.cart-item-price');
                const item = cart[itemIndex];
                if (priceElement && item) {
                    priceElement.textContent = `৳${(item.price * quantity).toLocaleString('en-IN')}`;
                }
            }
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart UI
            updateCartUIElements(cart);
        }
    }
    
    // Remove cart item
    function removeCartItem(itemId, cart) {
        // Find item in cart
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
            // Get item name for notification
            const itemName = cart[itemIndex].name;
            
            // Remove item from cart
            cart.splice(itemIndex, 1);
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart UI
            updateCartUIElements(cart);
            updateCartSidebar(cart);
            
            // Show notification
            showNotification(`Removed ${itemName} from cart!`, 'info');
        }
    }
}

// Add to Wishlist Functionality
function initAddToWishlist() {
    const wishlistBtns = document.querySelectorAll('.add-to-wishlist, .featured-actions .tertiary-btn');
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product data
            let productId, productName, productPrice, productImage;
            let isInWishlist = false;
            
            // Check if it's a product card button or featured product button
            if (this.classList.contains('add-to-wishlist')) {
                // It's a product card button
                const card = this.closest('.product-card');
                if (!card) return;
                
                productId = card.getAttribute('data-id');
                productName = card.getAttribute('data-name');
                productPrice = parseFloat(card.getAttribute('data-price'));
                productImage = card.getAttribute('data-image');
                
                // Check if this product is already in wishlist
                const heartIcon = this.querySelector('i');
                isInWishlist = heartIcon && heartIcon.classList.contains('fas');
            } else {
                // It's the featured product button
                const container = this.closest('.featured-container');
                if (!container) return;
                
                const nameElement = container.querySelector('h3');
                const priceElement = container.querySelector('.price');
                const imageElement = container.querySelector('img');
                
                productId = 'featured-1';
                productName = nameElement ? nameElement.textContent : 'Featured Product';
                productPrice = priceElement ? parseFloat(priceElement.textContent.replace(/[৳,]/g, '')) : 0;
                productImage = imageElement ? imageElement.src : '';
                
                // Check if this product is already in wishlist
                isInWishlist = this.innerHTML.includes('Remove from Wishlist');
            }
            
            // Toggle wishlist status
            toggleWishlistItem({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            }, isInWishlist, this);
        });
    });
    
    // Toggle wishlist item function
    function toggleWishlistItem(product, isInWishlist, button) {
        // Try to use main site's wishlist functions
        if (typeof window.toggleWishlist === 'function') {
            // Create dummy product card
            const dummyCard = document.createElement('div');
            dummyCard.className = 'product-card';
            dummyCard.dataset.id = product.id;
            dummyCard.dataset.name = product.name;
            dummyCard.dataset.price = product.price;
            dummyCard.dataset.image = product.image;
            
            // Add wishlist button to dummy card
            const wishlistBtn = document.createElement('a');
            wishlistBtn.className = 'add-to-wishlist';
            const icon = document.createElement('i');
            icon.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
            wishlistBtn.appendChild(icon);
            dummyCard.appendChild(wishlistBtn);
            
            window.toggleWishlist(dummyCard);
            return;
        }
        
        // Fallback wishlist functionality
        toggleWishlistFallback(product, isInWishlist, button);
    }
    
    // Fallback wishlist functionality
    function toggleWishlistFallback(product, isInWishlist, button) {
        // Get wishlist from localStorage
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        if (isInWishlist) {
            // Remove from wishlist
            wishlist = wishlist.filter(item => item.id !== product.id);
            
            // Update button UI
            if (button.classList.contains('add-to-wishlist')) {
                const icon = button.querySelector('i');
                if (icon) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
            } else {
                button.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
            }
            
            // Show notification
            showNotification(`Removed ${product.name} from wishlist!`, 'info');
        } else {
            // Add to wishlist
            wishlist.push(product);
            
            // Update button UI
            if (button.classList.contains('add-to-wishlist')) {
                const icon = button.querySelector('i');
                if (icon) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
            } else {
                button.innerHTML = '<i class="fas fa-heart"></i> Remove from Wishlist';
            }
            
            // Show notification
            showNotification(`Added ${product.name} to wishlist!`, 'success');
        }
        
        // Save wishlist to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update wishlist count
        updateWishlistCount(wishlist);
    }
    
    // Update wishlist count
    function updateWishlistCount(wishlist) {
        const wishlistCount = document.querySelector('.wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = wishlist.length;
        }
        
        // Try to use main site's update function
        if (typeof window.updateWishlistCount === 'function') {
            window.updateWishlistCount();
        }
    }
}

// Pagination Functionality
function initPagination() {
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // In a real app, this would load the next page of products
            // For this demo, we'll just scroll to the top of the products section
            const productsSection = document.getElementById('latest-products');
            if (productsSection) {
                window.scrollTo({
                    top: productsSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Show notification function
function showNotification(message, type = 'success') {
    // Try to use main site's notification function
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback notification function
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification ${type}`;
    
    notificationElement.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notificationElement);
    
    // Add notification styles if they don't exist
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
            
            .notification.success i {
                color: #2ecc71;
            }
            
            .notification.info i {
                color: #3498db;
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
    const closeButton = notificationElement.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notificationElement.style.animation = 'slideOut 0.3s forwards';
        setTimeout(() => {
            if (document.body.contains(notificationElement)) {
                document.body.removeChild(notificationElement);
            }
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notificationElement)) {
            notificationElement.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => {
                if (document.body.contains(notificationElement)) {
                    document.body.removeChild(notificationElement);
                }
            }, 300);
        }
    }, 5000);
}