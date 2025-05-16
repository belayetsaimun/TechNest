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
    
    // Initialize buy now buttons
    initBuyNowButtons();
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
    const featuredProductImage = document.querySelector('.featured-image img');
    
    console.log('Color options found:', colorOptions.length);
    console.log('Selected color text element:', selectedColorText);
    console.log('Featured product image:', featuredProductImage);
    
    if (!colorOptions.length || !selectedColorText || !featuredProductImage) {
        console.error('Missing elements for color selection functionality');
        return;
    }
    
    // Store the original image path to use as base
    const baseImagePath = featuredProductImage.src;
    console.log('Original image path:', baseImagePath);
    
    // Extract the path parts more precisely
    const pathParts = baseImagePath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const basePath = featuredProductImage.src.substring(0, featuredProductImage.src.lastIndexOf('/') + 1);
    
    console.log('Base path:', basePath);
    console.log('File name:', fileName);
    
    // Extract the base filename (remove color suffix and extension)
    const fileNameBase = fileName.substring(0, fileName.length - 5); // Remove last letter (color) and extension (.png)
    const fileExtension = '.png';
    
    console.log('File name base:', fileNameBase);
    console.log('File extension:', fileExtension);
    
    colorOptions.forEach(color => {
        color.addEventListener('click', () => {
            console.log('Color clicked:', color.getAttribute('data-color'));
            
            // Update active color
            colorOptions.forEach(c => c.classList.remove('active'));
            color.classList.add('active');
            
            // Update selected color text
            const colorName = color.getAttribute('data-color');
            selectedColorText.textContent = `Selected: ${colorName}`;
            
            // Change product image based on color
            let colorSuffix = '';
            if (color.classList.contains('black')) colorSuffix = 'B';
            else if (color.classList.contains('titanium')) colorSuffix = 'T';
            else if (color.classList.contains('blue')) colorSuffix = 'BL';
            else if (color.classList.contains('gold')) colorSuffix = 'G';
            else colorSuffix = 'W'; // Default to white
            
            // Create new image path with color suffix
            const newImagePath = basePath + fileNameBase + colorSuffix + fileExtension;
            console.log('New image path:', newImagePath);
            
            // Apply fade effect and change image
            featuredProductImage.style.opacity = '0';
            setTimeout(() => {
                featuredProductImage.src = newImagePath;
                featuredProductImage.style.opacity = '1';
            }, 300);
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
    
    console.log('Add to cart buttons found:', addToCartBtns.length);
    
    // Add to cart button in quick view modal
    const quickViewAddToCartBtn = document.querySelector('.add-to-cart-btn');
    
    // Handle add to cart from product cards
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add to cart button clicked:', this);
            
            // Get product data from closest product card
            const card = this.closest('.product-card') || this.closest('.featured-container');
            console.log('Found container:', card);
            
            if (card) {
                let productId, productName, productPrice, productImage, productColor;
                
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
                    const imageElement = card.querySelector('.featured-image img');
                    
                    productId = 'featured-1';
                    productName = nameElement ? nameElement.textContent : 'Featured Product';
                    productPrice = priceElement ? parseFloat(priceElement.textContent.replace(/[৳,]/g, '')) : 0;
                    productImage = imageElement ? imageElement.src : '';
                    
                    // Get selected color if available
                    const selectedColorElement = card.querySelector('.color.active');
                    if (selectedColorElement) {
                        productColor = selectedColorElement.getAttribute('data-color');
                    }
                }
                
                console.log('Product details:', {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    color: productColor
                });
                
                // Create product object
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1,
                    color: productColor || 'Default'
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
            } else {
                console.error('Could not find product container');
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
                if (priceElement) {
                    priceElement.textContent = `৳${(cart[itemIndex].price * quantity).toLocaleString('en-IN')}`;
                }
            }
            
            // Update cart in localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count and total
            updateCartUIElements(cart);
        }
    }
    
    // Remove cart item
    function removeCartItem(itemId, cart) {
        // Filter out the item to be removed
        const updatedCart = cart.filter(item => item.id !== itemId);
        
        // Update cart in localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Update cart UI
        updateCartUIElements(updatedCart);
        
        // Update cart sidebar
        updateCartSidebar(updatedCart);
    }
}

// Initialize Buy Now buttons
function initBuyNowButtons() {
    const buyNowBtns = document.querySelectorAll('.buy-now, .featured-actions .secondary-btn');
    
    console.log('Buy now buttons found:', buyNowBtns.length);
    
    buyNowBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Buy now button clicked');
            
            // Get product data from closest product card
            const card = this.closest('.product-card') || this.closest('.featured-container');
            
            if (card) {
                let productId, productName, productPrice, productImage, productColor;
                
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
                    const imageElement = card.querySelector('.featured-image img');
                    
                    productId = 'featured-1';
                    productName = nameElement ? nameElement.textContent : 'Featured Product';
                    productPrice = priceElement ? parseFloat(priceElement.textContent.replace(/[৳,]/g, '')) : 0;
                    productImage = imageElement ? imageElement.src : '';
                    
                    // Get selected color if available
                    const selectedColorElement = card.querySelector('.color.active');
                    if (selectedColorElement) {
                        productColor = selectedColorElement.getAttribute('data-color');
                    }
                }
                
                // Create product object
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1,
                    color: productColor || 'Default'
                };
                
                // Add to cart first
                addToCartHandler(product);
                
                // Redirect to checkout page
                window.location.href = 'checkout.html';
            }
        });
    });
}

// Add to Wishlist Functionality
function initAddToWishlist() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn, .featured-actions .wishlist-btn');
    
    console.log('Wishlist buttons found:', wishlistBtns.length);
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Wishlist button clicked:', this);
            
            // Get product data from closest product card or featured container
            const card = this.closest('.product-card') || this.closest('.featured-container');
            console.log('Found container:', card);
            
            if (card) {
                let productId, productName, productPrice, productImage, productColor;
                
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
                    const imageElement = card.querySelector('.featured-image img');
                    
                    productId = 'featured-1';
                    productName = nameElement ? nameElement.textContent : 'Featured Product';
                    productPrice = priceElement ? parseFloat(priceElement.textContent.replace(/[৳,]/g, '')) : 0;
                    productImage = imageElement ? imageElement.src : '';
                    
                    // Get selected color if available
                    const selectedColorElement = card.querySelector('.color.active');
                    if (selectedColorElement) {
                        productColor = selectedColorElement.getAttribute('data-color');
                    }
                }
                
                console.log('Adding to wishlist:', {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    color: productColor
                });
                
                // Create product object
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    color: productColor || 'Default'
                };
                
                // Add to wishlist
                addToWishlist(product, this);
            } else {
                console.error('Could not find product container');
            }
        });
    });
    
    // Add to wishlist functionality
    function addToWishlist(product, button) {
        // Get wishlist from localStorage
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        // Check if product is already in wishlist
        const existingItemIndex = wishlist.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // Remove from wishlist if already there
            wishlist = wishlist.filter(item => item.id !== product.id);
            button.classList.remove('active');
            showNotification(`Removed ${product.name} from wishlist!`, 'info');
        } else {
            // Add to wishlist
            wishlist.push(product);
            button.classList.add('active');
            showNotification(`Added ${product.name} to wishlist!`, 'success');
        }
        
        // Save wishlist to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update wishlist UI
        updateWishlistUI();
        
        // Add heart animation
        addHeartAnimation(button);
    }
    
    // Update wishlist UI
    function updateWishlistUI() {
        // Get wishlist from localStorage
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        // Update wishlist count
        const wishlistCount = document.querySelector('.wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = wishlist.length;
        }
        
        // Update button states for all products on page
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const card = btn.closest('.product-card') || btn.closest('.featured-container');
            if (!card) return;
            
            let productId;
            if (card.classList.contains('product-card')) {
                productId = card.getAttribute('data-id');
            } else {
                productId = 'featured-1';
            }
            
            // Check if this product is in the wishlist
            const inWishlist = wishlist.some(item => item.id === productId);
            
            // Update button state
            if (inWishlist) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Add heart animation
    function addHeartAnimation(button) {
        const heart = document.createElement('div');
        heart.className = 'heart-animation';
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        
        button.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
    
    // Initialize wishlist UI on page load
    updateWishlistUI();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-info-circle"></i>'}
        </div>
        <div class="notification-message">${message}</div>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto close after 3 seconds
    const timeout = setTimeout(() => {
        closeNotification(notification);
    }, 3000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.close-notification');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            clearTimeout(timeout);
            closeNotification(notification);
        });
    }
    
    // Helper function to close notification
    function closeNotification(notif) {
        notif.classList.remove('show');
        setTimeout(() => {
            notif.remove();
        }, 300);
    }
}

// Enhanced logging for wishlist buttons
document.querySelectorAll('.wishlist-btn, .featured-actions .wishlist-btn').forEach((btn, index) => {
    console.log(`Wishlist button ${index}:`, btn);
    console.log('Parent container:', btn.closest('.product-card') || btn.closest('.featured-container'));
});

// Check featured container structure
const featuredContainer = document.querySelector('.featured-container');
if (featuredContainer) {
    console.log('Featured container found:', featuredContainer);
    console.log('Featured name:', featuredContainer.querySelector('h3')?.textContent);
    console.log('Featured price:', featuredContainer.querySelector('.price')?.textContent);
    console.log('Featured image:', featuredContainer.querySelector('.featured-image img')?.src);
    console.log('Featured has wishlist button:', !!featuredContainer.querySelector('.wishlist-btn'));
}