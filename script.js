// Main document ready function - combines all functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuIcon = document.getElementById('menuIcon');
    const closeMenu = document.getElementById('closeMenu');
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('overlay');

    // Search Functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');

    // Cart Sidebar
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const emptyCart = document.querySelector('.empty-cart');
    const cartTotal = document.querySelector('.cart-total span:last-child');
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Wishlist Sidebar
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const closeWishlist = document.querySelector('.close-wishlist');
    const wishlistItems = document.querySelector('.wishlist-items');
    const emptyWishlist = document.querySelector('.empty-wishlist');
    const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');

    // Quick View Modal
    const quickViewModal = document.getElementById('quickViewModal');
    const closeModal = document.querySelector('.close-modal');
    
    // Fixed: Initialize quickViewBtns correctly
    const quickViewBtns = document.querySelectorAll('.product-card .quick-view');

    // Buy Now Modal
    const buyNowModal = document.getElementById('buyNowModal');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    const addToCartFromBuyNowBtn = document.querySelector('.add-to-cart-from-buynow');

    // Add to Cart Buttons
    const addToCartBtns = document.querySelectorAll('.product-card .add-to-cart');
    const addToCartModalBtn = document.querySelector('.add-to-cart-btn');
    
    // Add to Wishlist Buttons
    const addToWishlistBtns = document.querySelectorAll('.product-card .add-to-wishlist');
    
    // Quantity Selectors
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    
    // New Arrivals Slider - Fixed variables
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const productSlider = document.querySelector('.product-slider');
    
    // Testimonial Carousel
    const dots = document.querySelectorAll('.dot');
    
    // Color Options
    const colorOptions = document.querySelectorAll('.color-option');
    
    // Initialize Shopping Cart from localStorage
    let cart = [];
    let wishlist = [];
    
    // Add style for cart count animation
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes cartCountPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.5); }
            100% { transform: scale(1); }
        }
        
        /* Make sure the cart count is always visible */
        .cart-count {
            display: inline-flex !important;
            justify-content: center;
            align-items: center;
            min-width: 18px;
            min-height: 18px;
            font-weight: bold;
        }
        
        @keyframes totalUpdate {
            0% { opacity: 0.5; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
        }
    `;
    document.head.appendChild(styleElement);
    
    // Initialize the cart and wishlist from localStorage
    initializeCart();
    initializeWishlist();
    
    // Countdown Timer
    initCountdown();
    
    // Mobile Menu Functions
    if (menuIcon) {
        menuIcon.addEventListener('click', () => {
            navLinks.style.right = '0';
            overlay.style.display = 'block';
        });
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            navLinks.style.right = '-300px';
            overlay.style.display = 'none';
        });
    }
    
    // Search Functionality
    const searchForm = document.getElementById('searchForm');
    const mobileSearchToggle = document.getElementById('mobileSearchToggle');
    
    if (searchForm && searchInput) {
        // Handle form submission
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            performSearch(searchInput.value);
        });
        
        // Mobile search toggle
        if (mobileSearchToggle) {
            mobileSearchToggle.addEventListener('click', () => {
                searchForm.classList.toggle('mobile-visible');
                if (searchForm.classList.contains('mobile-visible')) {
                    setTimeout(() => {
                        searchInput.focus();
                    }, 100);
                }
            });
        }
    }
    
    // Cart Functions
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.style.right = '0';
            overlay.style.display = 'block';
            updateCartUI(); // Make sure to update the cart UI before showing it
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
    
    // Wishlist Functions
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            wishlistSidebar.style.right = '0';
            overlay.style.display = 'block';
            updateWishlistUI(); // Make sure to update the wishlist UI before showing it
        });
    }
    
    if (closeWishlist) {
        closeWishlist.addEventListener('click', () => {
            wishlistSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }
    
    if (clearWishlistBtn) {
        clearWishlistBtn.addEventListener('click', () => {
            clearWishlist();
        });
    }
    
    // FIXED: Quick View Modal Functions
    if (quickViewBtns && quickViewBtns.length > 0) {
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = btn.closest('.product-card');
                if (productCard) {
                    openQuickView(productCard);
                } else {
                    console.error('Product card not found');
                }
            });
        });
    }
    
    function openQuickView(productCard) {
        if (!productCard || !quickViewModal) {
            console.error('Missing product card or quick view modal');
            return;
        }
        
        // Get product data
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        
        // Get optional old price if available
        let productOldPrice = '';
        const oldPriceElement = productCard.querySelector('.old-price');
        if (oldPriceElement) {
            productOldPrice = oldPriceElement.textContent;
        }
        
        // Get rating from the product card
        const ratingElement = productCard.querySelector('.product-rating');
        const ratingHTML = ratingElement ? ratingElement.innerHTML : '';
        
        // Populate modal with product details
        const modalTitle = quickViewModal.querySelector('h2');
        const modalPrice = quickViewModal.querySelector('.current-price');
        const modalImage = quickViewModal.querySelector('.product-quick-view-image img');
        const modalRating = quickViewModal.querySelector('.product-rating');
        const modalOldPrice = quickViewModal.querySelector('.old-price');
        const modalDiscount = quickViewModal.querySelector('.discount');
        
        if (modalTitle) modalTitle.textContent = productName;
        if (modalPrice) modalPrice.textContent = `৳${productPrice.toLocaleString('en-IN')}`;
        if (modalImage) {
            modalImage.src = productImage;
            modalImage.alt = productName;
            // Apply transition effect for image changes
            modalImage.style.transition = 'opacity 0.3s ease';
        }
        
        if (modalRating && ratingHTML) {
            modalRating.innerHTML = ratingHTML;
        }
        
        // Generate a more dynamic product description based on the product
        let description = '';
        if (productName.includes('iPhone') || productName.includes('Iphone')) {
            description = `The ${productName} offers a stunning display, advanced camera system, and powerful performance in a sleek design. With its A-series chip, it provides exceptional speed for g[...]`;
        } else if (productName.includes('AirPods') || productName.includes('Earbuds')) {
            description = `Experience immersive sound with the ${productName}. Featuring active noise cancellation, easy setup, and comfortable fit, these earbuds deliver crystal-clear audio for music[...]`;
        } else if (productName.includes('Watch') || productName.includes('SmartFit')) {
            description = `The ${productName} helps you stay connected, active, and healthy. Track your workouts, monitor your heart rate, and receive notifications right on your wrist with this sleek[...]`;
        } else if (productName.includes('MacBook') || productName.includes('Laptop')) {
            description = `Powerful and portable, the ${productName} features a stunning Retina display, all-day battery life, and high-performance processors. Perfect for creative work, coding, and e[...]`;
        } else if (productName.includes('Bass') || productName.includes('headphone')) {
            description = `Immerse yourself in rich, detailed sound with the ${productName}. These premium headphones feature active noise cancellation, comfortable ear cups, and long battery life for[...]`;
        } else {
            description = `The ${productName} offers premium quality, exceptional performance, and innovative features at a great value. Experience the perfect blend of technology and design with this[...]`;
        }
        
        const descriptionElement = quickViewModal.querySelector('.product-description p');
        if (descriptionElement) {
            descriptionElement.textContent = description;
        }
        
        // Set product category based on the product name
        let category = 'Electronics';
        if (productName.includes('iPhone') || productName.includes('Iphone')) {
            category = 'Mobile Phones';
        } else if (productName.includes('AirPods') || productName.includes('Earbuds')) {
            category = 'Earbuds';
        } else if (productName.includes('Watch') || productName.includes('SmartFit')) {
            category = 'Smartwatches';
        } else if (productName.includes('MacBook') || productName.includes('Laptop')) {
            category = 'Laptops';
        } else if (productName.includes('Bass') || productName.includes('headphone')) {
            category = 'Headphones';
        } else if (productName.includes('Pad') || productName.includes('Tablet')) {
            category = 'Tablets';
        }
        
        const categoryElement = quickViewModal.querySelector('.product-meta p:first-child');
        if (categoryElement) {
            categoryElement.innerHTML = `<strong>Category:</strong> ${category}`;
        }
        
        // Set product tags based on the product name
        let tags = '';
        if (productName.includes('iPhone') || productName.includes('Iphone')) {
            tags = 'Smartphone, iOS, Camera, A17 Bionic';
        } else if (productName.includes('AirPods') || productName.includes('Earbuds')) {
            tags = 'Wireless, Bluetooth, Noise Cancellation';
        } else if (productName.includes('Watch') || productName.includes('SmartFit')) {
            tags = 'Fitness Tracker, Health Monitor, GPS';
        } else if (productName.includes('MacBook') || productName.includes('Laptop')) {
            tags = 'macOS, M1 Chip, Retina Display';
        } else if (productName.includes('Bass') || productName.includes('headphone')) {
            tags = 'Wireless, Noise Cancellation, Bluetooth';
        } else {
            tags = 'New Arrival, Premium, TechNest Exclusive';
        }
        
        const tagsElement = quickViewModal.querySelector('.product-meta p:nth-child(2)');
        if (tagsElement) {
            tagsElement.innerHTML = `<strong>Tags:</strong> ${tags}`;
        }
        
        // Handle old price and discount
        if (productOldPrice) {
            // Extract numeric value from old price text
            const oldPriceValue = parseFloat(productOldPrice.replace(/[৳,]/g, ''));
            
            if (modalOldPrice) {
                modalOldPrice.textContent = productOldPrice;
                modalOldPrice.style.display = 'inline';
                
                // Calculate and display discount percentage
                if (modalDiscount && oldPriceValue > 0) {
                    const discountPercent = Math.round((oldPriceValue - productPrice) / oldPriceValue * 100);
                    modalDiscount.textContent = `-${discountPercent}%`;
                    modalDiscount.style.display = 'inline';
                }
            }
        } else {
            // Hide old price and discount if not available
            if (modalOldPrice) modalOldPrice.style.display = 'none';
            if (modalDiscount) modalDiscount.style.display = 'none';
        }
        
        // Reset quantity input
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        if (quantityInput) {
            quantityInput.value = 1;
        }
        
        // Store product data in the modal for use with add to cart
        quickViewModal.dataset.id = productId;
        quickViewModal.dataset.name = productName;
        quickViewModal.dataset.price = productPrice;
        quickViewModal.dataset.image = productImage;
        
        // Setup color variant images
        setupColorVariantImages(productName, productImage);
        
        // Reset all color options and set white as default
        const colorOptions = quickViewModal.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.classList.remove('active');
            if (option.classList.contains('white')) {
                option.classList.add('active');
            }
        });
        
        // Show modal
        quickViewModal.style.display = 'block';
        overlay.style.display = 'block';
        
        // Setup event listeners for the modal
        setupQuickViewEventListeners();
    }
    
    // Function to setup color variant images
    function setupColorVariantImages(productName, baseImage) {
        // Create color variant image paths based on product type and color suffix
        const imageNameParts = baseImage.split('.');
        const extension = imageNameParts.pop(); // Get file extension (png, jpg, etc.)
        let baseName = imageNameParts.join('.'); // Get base filename
        
        // Extract the base product name without color indicator
        let baseProductName = baseName;
        
        // Remove any color indicators (W, B, BL) from the end of the filename
        baseProductName = baseProductName.replace(/W$|B$|BL$/i, '');
        
        // Create variant image paths
        const colorVariants = {
            white: `${baseProductName}W.${extension}`,
            black: `${baseProductName}B.${extension}`,
            blue: `${baseProductName}BL.${extension}`
        };
        
        // Store the image paths in the modal's dataset
        quickViewModal.dataset.imageWhite = colorVariants.white;
        quickViewModal.dataset.imageBlack = colorVariants.black;
        quickViewModal.dataset.imageBlue = colorVariants.blue;
        
        console.log('Color variant images:', colorVariants);
    }
    
    // FIXED: Completely replace the setupQuickViewEventListeners function
    function setupQuickViewEventListeners() {
        const closeModalBtn = quickViewModal.querySelector('.close-modal');
        const addToCartBtn = quickViewModal.querySelector('.add-to-cart-btn');
        const buyNowBtn = quickViewModal.querySelector('.buy-now-btn');
        const quantityBtns = quickViewModal.querySelectorAll('.quantity-btn');
        const colorOptions = quickViewModal.querySelectorAll('.color-option');
        
        // Close modal
        if (closeModalBtn) {
            closeModalBtn.onclick = () => {
                quickViewModal.style.display = 'none';
                overlay.style.display = 'none';
            };
        }
        
        // Add to cart
        if (addToCartBtn) {
            addToCartBtn.onclick = () => {
                addToCartFromModal();
            };
        }
        
        // Buy now
        if (buyNowBtn) {
            buyNowBtn.onclick = () => {
                showBuyNowModal();
            };
        }
        
        // FIXED: Quantity buttons - use onclick instead of addEventListener to prevent multiple handlers
        quantityBtns.forEach(btn => {
            // First remove any existing event handlers by cloning and replacing the button
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            // Then add a new onclick handler
            newBtn.onclick = () => {
                const input = newBtn.parentElement.querySelector('input');
                let currentValue = parseInt(input.value);
                
                if (newBtn.classList.contains('minus') && currentValue > 1) {
                    input.value = currentValue - 1;
                } else if (newBtn.classList.contains('plus') && currentValue < 10) {
                    input.value = currentValue + 1;
                }
            };
        });
        
        // Color options with image switching
        colorOptions.forEach(option => {
            option.onclick = () => {
                // Remove active class from all options
                colorOptions.forEach(opt => opt.classList.remove('active'));
                // Add active class to clicked option
                option.classList.add('active');
                
                // Get the color from the class name
                let selectedColor = '';
                if (option.classList.contains('white')) selectedColor = 'white';
                else if (option.classList.contains('black')) selectedColor = 'black';
                else if (option.classList.contains('blue')) selectedColor = 'blue';
                
                // Change the product image based on selected color
                changeProductImage(selectedColor);
                
                // Update the main product image in the modal dataset
                if (selectedColor && quickViewModal.dataset[`image${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}`]) {
                    quickViewModal.dataset.image = quickViewModal.dataset[`image${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}`];
                }
            };
        });
    }
    
    // Function to change product image based on selected color
    function changeProductImage(color) {
        const modalImage = quickViewModal.querySelector('.product-quick-view-image img');
        if (!modalImage) return;
        
        // Get the color variant image path from the modal's dataset
        const imagePath = quickViewModal.dataset[`image${color.charAt(0).toUpperCase() + color.slice(1)}`];
        
        if (imagePath) {
            // Apply fade transition
            modalImage.style.opacity = '0';
            
            // Create a new Image object to preload
            const img = new Image();
            
            img.onload = function() {
                // Once loaded, update the src and fade it in
                setTimeout(() => {
                    modalImage.src = imagePath;
                    modalImage.style.opacity = '1';
                }, 200);
            };
            
            img.onerror = function() {
                // Error handling - fade back in without changing the image
                console.warn(`Failed to load image for ${color} color variant: ${imagePath}`);
                modalImage.style.opacity = '1';
            };
            
            // Start loading the image
            img.src = imagePath;
        } else {
            console.warn(`No image path found for ${color} color variant`);
        }
    }
    
    // Close modals and sidebar when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (navLinks && window.innerWidth <= 768) {
                navLinks.style.right = '-300px';
            }
            if (cartSidebar) {
                cartSidebar.style.right = '-400px';
            }
            if (wishlistSidebar) {
                wishlistSidebar.style.right = '-400px';
            }
            if (quickViewModal) {
                quickViewModal.style.display = 'none';
            }
            if (buyNowModal) {
                buyNowModal.style.display = 'none';
            }
            overlay.style.display = 'none';
        });
    }
    
    // Add to Cart Functionality
    if (addToCartBtns && addToCartBtns.length > 0) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = btn.closest('.product-card');
                if (productCard) {
                    addToCart(productCard);
                }
            });
        });
    }
    
    // FIXED: Improved function to load cart from localStorage
    function initializeCart() {
        try {
            // Get cart from localStorage
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
                console.log('Loaded cart from localStorage:', cart);
            } else {
                cart = [];
                console.log('No saved cart found, initialized empty cart');
            }
            
            // Update UI
            updateCartCount();
            updateCartUI();
        } catch (error) {
            console.error('Error initializing cart:', error);
            // Reset cart if there's an error
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
    
    // Function to initialize wishlist from localStorage
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
            updateWishlistCount();
            updateWishlistUI();
        } catch (error) {
            console.error('Error initializing wishlist:', error);
            // Reset wishlist if there's an error
            wishlist = [];
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }
    
    // FIXED: Add to Cart From Modal Function
    function addToCartFromModal() {
        if (!quickViewModal) return;
        
        const productId = quickViewModal.dataset.id;
        const productName = quickViewModal.dataset.name;
        const productPrice = parseFloat(quickViewModal.dataset.price);
        const productImage = quickViewModal.dataset.image; // This will now be updated based on color selection
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        console.log('Adding from modal:', productName, 'quantity:', quantity);
        
        // Create product object with selected color variant image
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity
        };
        
        // Add the product to cart
        addItemToCart(product);
        
        // Close modal after adding to cart
        quickViewModal.style.display = 'none';
        overlay.style.display = 'none';
        
        // Show cart sidebar to show the user their updated cart
        cartSidebar.style.right = '0';
        overlay.style.display = 'block';
    }
    
    function addToCart(productCard) {
        if (!productCard) return;
        
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        const quantity = 1;
        
        // Create product object
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity
        };
        
        addItemToCart(product);
    }
    
    // FIXED: Improved addItemToCart function
    function addItemToCart(product) {
        if (!product || !product.id) {
            console.error('Invalid product data:', product);
            return;
        }
        
        // Check if product is already in cart
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // Increase quantity if item already exists
            cart[existingItemIndex].quantity += product.quantity;
            console.log(`Increased quantity for ${product.name} to ${cart[existingItemIndex].quantity}`);
        } else {
            // Add new item to cart
            cart.push(product);
            console.log(`Added new item to cart: ${product.name}, quantity: ${product.quantity}`);
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI immediately 
        updateCartCount();
        updateCartUI();
        
        // Show notification
        showNotification(`Added ${product.name} to cart!`, 'success');
    }
    
    // Add to Wishlist Functionality
    if (addToWishlistBtns && addToWishlistBtns.length > 0) {
        addToWishlistBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = btn.closest('.product-card');
                if (productCard) {
                    toggleWishlist(productCard);
                }
            });
        });
    }
    
    // Buy Now Button in Quick View Modal - UPDATED: Store product data for checkout
    function showBuyNowModal() {
        if (!quickViewModal || !buyNowModal) return;
        
        const productId = quickViewModal.dataset.id;
        const productName = quickViewModal.dataset.name;
        const productPrice = quickViewModal.dataset.price;
        const productImage = quickViewModal.dataset.image; // This will now be the selected color variant
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        // ADDED: Store the buy now product in localStorage
        const buyNowItem = {
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            image: productImage,
            quantity: quantity
        };
        localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
        
        // Close quick view modal
        quickViewModal.style.display = 'none';
        
        // Show buy now modal
        buyNowModal.style.display = 'block';
        
        // Populate buy now modal
        const imageElement = buyNowModal.querySelector('.buy-now-product-image img');
        if (imageElement) {
            imageElement.src = productImage;
            imageElement.alt = productName;
        }
        
        const nameElement = buyNowModal.querySelector('.buy-now-product-info h3');
        if (nameElement) nameElement.textContent = productName;
        
        const priceElement = buyNowModal.querySelector('.price');
        if (priceElement) priceElement.textContent = `৳${parseFloat(productPrice).toLocaleString('en-IN')}`;
        
        const productNameElement = buyNowModal.querySelector('.product-name');
        if (productNameElement) productNameElement.textContent = productName;
        
        const productPriceElement = buyNowModal.querySelector('.product-price');
        if (productPriceElement) productPriceElement.textContent = `৳${parseFloat(productPrice).toLocaleString('en-IN')}`;
        
        const productQuantityElement = buyNowModal.querySelector('.product-quantity');
        if (productQuantityElement) productQuantityElement.textContent = quantity;
        
        const productTotalElement = buyNowModal.querySelector('.product-total');
        if (productTotalElement) {
            productTotalElement.textContent = `৳${(parseFloat(productPrice) * quantity).toLocaleString('en-IN')}`;
        }
        
        // Reset quantity input
        const buyNowQuantityInput = buyNowModal.querySelector('.quantity-selector input');
        if (buyNowQuantityInput) {
            buyNowQuantityInput.value = quantity;
        }
        
        // Store product data in modal
        buyNowModal.dataset.id = productId;
        buyNowModal.dataset.name = productName;
        buyNowModal.dataset.price = productPrice;
        buyNowModal.dataset.image = productImage;
        
        // Setup event listeners for buy now modal
        setupBuyNowEventListeners();
    }
    
    // UPDATED: Modified setupBuyNowEventListeners to add product to cart before checkout
    function setupBuyNowEventListeners() {
        if (!buyNowModal) return;
        
        const closeModalBtn = buyNowModal.querySelector('.close-modal');
        const addToCartBtn = buyNowModal.querySelector('.add-to-cart-from-buynow');
        const quantityBtns = buyNowModal.querySelectorAll('.quantity-btn');
        
        // Close modal
        if (closeModalBtn) {
            closeModalBtn.onclick = () => {
                buyNowModal.style.display = 'none';
                overlay.style.display = 'none';
            };
        }
        
        // Add to cart
        if (addToCartBtn) {
            addToCartBtn.onclick = () => {
                const productId = buyNowModal.dataset.id;
                const productName = buyNowModal.dataset.name;
                const productPrice = parseFloat(buyNowModal.dataset.price);
                const productImage = buyNowModal.dataset.image;
                const quantityInput = buyNowModal.querySelector('.quantity-selector input');
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                
                // Add to cart
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: quantity
                };
                
                addItemToCart(product);
                
                // Close buy now modal
                buyNowModal.style.display = 'none';
                
                // Show cart sidebar
                cartSidebar.style.right = '0';
            };
        }
        
        // FIXED: Quantity buttons - use the same approach as in the quick view modal
        quantityBtns.forEach(btn => {
            // First remove any existing event handlers
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            // Add new onclick handler
            newBtn.onclick = () => {
                const input = newBtn.parentElement.querySelector('input');
                if (!input) return;
                
                let currentValue = parseInt(input.value);
                
                if (newBtn.classList.contains('minus') && currentValue > 1) {
                    input.value = currentValue - 1;
                    updateBuyNowTotal();
                } else if (newBtn.classList.contains('plus') && currentValue < 10) {
                    input.value = currentValue + 1;
                    updateBuyNowTotal();
                }
            };
        });
        
        // ADDED: Direct checkout button - Create temp cart with this product
        const checkoutBtn = buyNowModal.querySelector('.btn.primary-btn');
        if (checkoutBtn) {
            checkoutBtn.onclick = () => {
                const productId = buyNowModal.dataset.id;
                const productName = buyNowModal.dataset.name;
                const productPrice = parseFloat(buyNowModal.dataset.price);
                const productImage = buyNowModal.dataset.image;
                const quantityInput = buyNowModal.querySelector('.quantity-selector input');
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                
                // Create a temporary cart with just this item for checkout
                const tempCart = [{
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: quantity
                }];
                
                // Save to localStorage
                localStorage.setItem('cart', JSON.stringify(tempCart));
                
                // Close modal
                buyNowModal.style.display = 'none';
                overlay.style.display = 'none';
                
                // Navigate to checkout
                window.location.href = 'checkout.html';
            };
        }
    }
    
    // Add to Cart from Buy Now Modal
    if (addToCartFromBuyNowBtn) {
        addToCartFromBuyNowBtn.addEventListener('click', () => {
            if (!buyNowModal) return;
            
            const productId = buyNowModal.dataset.id;
            const productName = buyNowModal.dataset.name;
            const productPrice = buyNowModal.dataset.price;
            const productImage = buyNowModal.dataset.image;
            const quantityInput = buyNowModal.querySelector('.quantity-selector input');
            const quantity = quantityInput ? quantityInput.value : 1;
            
            // Add to cart
            const product = {
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: parseInt(quantity)
            };
            
            addItemToCart(product);
            
            // Close buy now modal
            buyNowModal.style.display = 'none';
            
            // Show cart sidebar
            if (cartSidebar) {
                cartSidebar.style.right = '0';
            }
        });
    }
    
    // Setup quantity buttons on page load
    setupQuantityButtons();
    
    // Update Buy Now Modal Total
    function updateBuyNowTotal() {
        if (!buyNowModal) return;
        
        const price = parseFloat(buyNowModal.dataset.price);
        const quantityInput = buyNowModal.querySelector('.quantity-selector input');
        if (!quantityInput) return;
        
        const quantity = parseInt(quantityInput.value);
        const total = price * quantity;
        
        const quantityElement = buyNowModal.querySelector('.product-quantity');
        if (quantityElement) quantityElement.textContent = quantity;
        
        const totalElement = buyNowModal.querySelector('.product-total');
        if (totalElement) totalElement.textContent = `৳${total.toLocaleString('en-IN')}`;
        
        // Also update the buyNowItem in localStorage if it exists
        const buyNowItem = JSON.parse(localStorage.getItem('buyNowItem'));
        if (buyNowItem) {
            buyNowItem.quantity = quantity;
            localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
        }
    }
    
    // FIXED: Update setupQuantityButtons to prevent multiple event handlers
    function setupQuantityButtons() {
        // This function should only be used for quantity buttons that are 
        // not in the quick view or buy now modals
        const quantityBtns = document.querySelectorAll('.cart-item .quantity-btn');
        
        quantityBtns.forEach(btn => {
            // Remove existing event handlers by cloning
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                if (!input) return;
                
                const currentValue = parseInt(input.value);
                
                if (this.classList.contains('minus') && currentValue > 1) {
                    input.value = currentValue - 1;
                    
                    // If in cart, update item quantity
                    if (this.closest('.cart-item')) {
                        const cartItem = this.closest('.cart-item');
                        const productId = cartItem.dataset.id;
                        updateCartItemQuantity(productId, currentValue - 1);
                    }
                    
                } else if (this.classList.contains('plus') && currentValue < 10) {
                    input.value = currentValue + 1;
                    
                    // If in cart, update item quantity
                    if (this.closest('.cart-item')) {
                        const cartItem = this.closest('.cart-item');
                        const productId = cartItem.dataset.id;
                        updateCartItemQuantity(productId, currentValue + 1);
                    }
                }
            });
        });
    }
    
    // FIXED: Update setupCartItemEventListeners to use the same approach
    function setupCartItemEventListeners(cartItem) {
        if (!cartItem) return;
        
        const minusBtn = cartItem.querySelector('.minus');
        const plusBtn = cartItem.querySelector('.plus');
        const input = cartItem.querySelector('input');
        const removeBtn = cartItem.querySelector('.remove-item');
        const productId = cartItem.dataset.id;
        
        // Minus button - Clone to remove existing handlers
        if (minusBtn) {
            const newMinusBtn = minusBtn.cloneNode(true);
            minusBtn.parentNode.replaceChild(newMinusBtn, minusBtn);
            
            newMinusBtn.addEventListener('click', () => {
                if (!input) return;
                
                const currentValue = parseInt(input.value);
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    updateCartItemQuantity(productId, currentValue - 1);
                }
            });
        }
        
        // Plus button - Clone to remove existing handlers
        if (plusBtn) {
            const newPlusBtn = plusBtn.cloneNode(true);
            plusBtn.parentNode.replaceChild(newPlusBtn, plusBtn);
            
            newPlusBtn.addEventListener('click', () => {
                if (!input) return;
                
                const currentValue = parseInt(input.value);
                if (currentValue < 10) {
                    input.value = currentValue + 1;
                    updateCartItemQuantity(productId, currentValue + 1);
                }
            });
        }
        
        // Input change - Clone to remove existing handlers
        if (input) {
            const newInput = input.cloneNode(true);
            input.parentNode.replaceChild(newInput, input);
            
            newInput.addEventListener('change', () => {
                let newValue = parseInt(newInput.value);
                
                // Ensure value is between 1 and 10
                if (isNaN(newValue) || newValue < 1) newValue = 1;
                if (newValue > 10) newValue = 10;
                
                newInput.value = newValue;
                updateCartItemQuantity(productId, newValue);
            });
        }
        
        // Remove button - Clone to remove existing handlers
        if (removeBtn) {
            const newRemoveBtn = removeBtn.cloneNode(true);
            removeBtn.parentNode.replaceChild(newRemoveBtn, removeBtn);
            
            newRemoveBtn.addEventListener('click', () => {
                removeFromCart(productId);
                
                // Show notification
                const item = cart.find(item => item.id === productId);
                if (item) {
                    showNotification(`Removed ${item.name} from cart!`, 'info');
                }
            });
        }
    }
    
    function updateCartItemQuantity(productId, quantity) {
        // Find the item in the cart
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            // Update the quantity
            cart[itemIndex].quantity = quantity;
            
            // Update the UI
            const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);
            if (cartItem) {
                const priceElement = cartItem.querySelector('.cart-item-price');
                const itemPrice = cart[itemIndex].price * quantity;
                priceElement.textContent = `৳${itemPrice.toLocaleString('en-IN')}`;
            }
            
            // Update localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart total and count
            updateCartTotal();
            updateCartCount();
        }
    }
    
    function updateCartTotal() {
        if (!cartTotal) return;
        
        // Calculate cart total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Update cart total display with animation
        const oldTotal = cartTotal.textContent;
        const newTotal = `৳${total.toLocaleString('en-IN')}`;
        
        if (oldTotal !== newTotal) {
            cartTotal.textContent = newTotal;
            cartTotal.style.animation = 'none';
            setTimeout(() => {
                cartTotal.style.animation = 'totalUpdate 0.5s ease';
            }, 10);
        }
    }
    
    function removeFromCart(productId) {
        // Find the item in the cart
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = cart[itemIndex];
            console.log('Removing item from cart:', removedItem.name);
            
            // Remove the item from the cart
            cart.splice(itemIndex, 1);
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            updateCartUI();
        }
    }
    
    function updateWishlistUI() {
        if (!wishlistItems) return;
        
        // Clear wishlist items container
        wishlistItems.innerHTML = '';
        
        if (wishlist.length === 0) {
            // Show empty wishlist message
            wishlistItems.innerHTML = `
                <div class="empty-wishlist">
                    <div class="empty-wishlist-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <p>Your wishlist is empty</p>
                    <a href="#featured" class="btn secondary-btn">Discover Products</a>
                </div>
            `;
            
            // Hide clear wishlist button
            if (clearWishlistBtn) {
                clearWishlistBtn.style.display = 'none';
            }
        } else {
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
                        <button class="move-to-cart"><i class="fas fa-shopping-cart"></i></button>
                        <button class="remove-from-wishlist"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                wishlistItems.appendChild(wishlistItem);
                
                // Add event listeners for wishlist item controls
                setupWishlistItemEventListeners(wishlistItem);
            });
            
            // Show clear wishlist button
            if (clearWishlistBtn) {
                clearWishlistBtn.style.display = 'block';
            }
        }
    }
    
    function setupWishlistItemEventListeners(wishlistItem) {
        if (!wishlistItem) return;
        
        const moveToCartBtn = wishlistItem.querySelector('.move-to-cart');
        const removeBtn = wishlistItem.querySelector('.remove-from-wishlist');
        const productId = wishlistItem.dataset.id;
        
        // Move to cart button
        if (moveToCartBtn) {
            moveToCartBtn.addEventListener('click', () => {
                const item = wishlist.find(item => item.id === productId);
                
                if (item) {
                    // Add to cart
                    addItemToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: 1
                    });
                    
                    // Remove from wishlist
                    removeFromWishlist(productId);
                    
                    // Show cart sidebar
                    wishlistSidebar.style.right = '-400px';
                    cartSidebar.style.right = '0';
                }
            });
        }
        
        // Remove button
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                const item = wishlist.find(item => item.id === productId);
                
                if (item) {
                    // Show notification
                    showNotification(`Removed ${item.name} from wishlist!`, 'info');
                    
                    // Remove from wishlist
                    removeFromWishlist(productId);
                }
            });
        }
    }
    
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
        updateWishlistUI();
    }
    
    function removeFromWishlist(productId) {
        // Find the item in the wishlist
        const itemIndex = wishlist.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            // Remove the item from the wishlist
            wishlist.splice(itemIndex, 1);
            
            // Save wishlist to localStorage
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
        }
    }
    
    function clearWishlist() {
        // Clear wishlist array
        wishlist = [];
        
        // Save empty wishlist to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update UI
        updateWishlistCount();
        updateWishlistUI();
        
        // Update all heart icons
        document.querySelectorAll('.add-to-wishlist i').forEach(icon => {
            icon.classList.remove('fas');
            icon.classList.add('far');
        });
        
        // Show notification
        showNotification('Wishlist cleared!', 'info');
    }
    
    // FIXED: New Arrivals Slider Controls
    function initializeNewArrivalsSlider() {
        if (prevBtn && nextBtn && productSlider) {
            // Set initial slider styles for proper horizontal scrolling
            productSlider.style.display = 'flex';
            productSlider.style.overflowX = 'hidden';
            productSlider.style.scrollBehavior = 'smooth';
            productSlider.style.gap = '20px';
            productSlider.style.padding = '10px 0';
            
            // Set fixed width for product cards in slider for consistent scrolling
            const productCards = productSlider.querySelectorAll('.product-card');
            productCards.forEach(card => {
                card.style.flex = '0 0 300px';
                card.style.marginRight = '20px';
            });
            
            prevBtn.addEventListener('click', () => {
                productSlider.scrollBy({
                    left: -320,
                    behavior: 'smooth'
                });
            });
            
            nextBtn.addEventListener('click', () => {
                productSlider.scrollBy({
                    left: 320,
                    behavior: 'smooth'
                });
            });
            
            // Initially hide prev button if at start
            if (productSlider.scrollLeft <= 0) {
                prevBtn.style.opacity = '0.5';
                prevBtn.style.cursor = 'not-allowed';
            }
            
            // Update button states on scroll
            productSlider.addEventListener('scroll', () => {
                // Enable/disable prev button
                if (productSlider.scrollLeft <= 0) {
                    prevBtn.style.opacity = '0.5';
                    prevBtn.style.cursor = 'not-allowed';
                } else {
                    prevBtn.style.opacity = '1';
                    prevBtn.style.cursor = 'pointer';
                }
                
                // Enable/disable next button
                if (productSlider.scrollLeft + productSlider.clientWidth >= productSlider.scrollWidth - 10) {
                    nextBtn.style.opacity = '0.5';
                    nextBtn.style.cursor = 'not-allowed';
                } else {
                    nextBtn.style.opacity = '1';
                    nextBtn.style.cursor = 'pointer';
                }
            });
        }
    }
    
    // Call the new arrivals slider initialization
    initializeNewArrivalsSlider();
    
    // Testimonial Carousel - Improved implementation
    function initTestimonialCarousel() {
        const testimonialCarousel = document.getElementById('testimonialCarousel');
        const dots = document.querySelectorAll('.testimonial-dots .dot');
        
        if (!testimonialCarousel || dots.length === 0) return;
        
        let currentSlide = 0;
        const maxSlides = dots.length;
        
        // Function to go to a specific slide
        function goToSlide(slideIndex) {
            // Ensure valid slide index
            if (slideIndex >= maxSlides) slideIndex = 0;
            if (slideIndex < 0) slideIndex = maxSlides - 1;
            
            currentSlide = slideIndex;
            
            // Update carousel position
            testimonialCarousel.style.transform = `translateX(-${currentSlide * 33.333}%)`;
            
            // Update active dot
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Add click event to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                goToSlide(index);
                resetInterval();
            });
        });
        
        // Set up auto-sliding
        let slideInterval = setInterval(nextSlide, 5000);
        
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }
        
        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }
        
        // Pause on hover
        testimonialCarousel.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });
        
        testimonialCarousel.addEventListener('mouseleave', function() {
            slideInterval = setInterval(nextSlide, 5000);
        });
        
        // Add touch/swipe support for mobile
        let touchStartX = 0;
        
        testimonialCarousel.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        testimonialCarousel.addEventListener('touchend', function(e) {
            if (!e.changedTouches || !e.changedTouches[0]) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const difference = touchStartX - touchEndX;
            
            // Minimum swipe distance
            if (Math.abs(difference) < 50) return;
            
            if (difference > 0) {
                // Swipe left - go to next slide
                goToSlide(currentSlide + 1);
            } else {
                // Swipe right - go to previous slide
                goToSlide(currentSlide - 1);
            }
            
            resetInterval();
        }, { passive: true });
        
        // Initialize first slide
        goToSlide(0);
    }
    
    // Initialize the carousel when the DOM is loaded
    initTestimonialCarousel();
    
    // Color Options
    if (colorOptions && colorOptions.length > 0) {
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }
    
    // Add logo animation effect
    const logoText = document.querySelector('.logo-text');
    const boltIcon = document.querySelector('.bolt-icon');
    
    if (logoText && boltIcon) {
        logoText.addEventListener('mouseenter', () => {
            boltIcon.style.transform = 'rotate(30deg) scale(1.2)';
            boltIcon.style.textShadow = '0 0 10px rgba(0, 82, 204, 0.5)';
        });
        
        logoText.addEventListener('mouseleave', () => {
            boltIcon.style.transform = 'rotate(20deg)';
            boltIcon.style.textShadow = 'none';
        });
    }
    
    // Initialize the UI - update wishlist icons based on localStorage
    function initializeWishlistIcons() {
        const wishlistIds = wishlist.map(item => item.id);
        
        // Find all wishlist icons
        document.querySelectorAll('.add-to-wishlist').forEach(btn => {
            const productCard = btn.closest('.product-card');
            if (!productCard) return;
            
            const productId = productCard.dataset.id;
            const heartIcon = btn.querySelector('i');
            
            if (!heartIcon) return;
            
            // Check if this product is in the wishlist
            if (wishlistIds.includes(productId)) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
            }
        });
    }
    
    // Call the function on page load
    initializeWishlistIcons();
    
    // Add event listener to checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            if (cart.length === 0) {
                e.preventDefault();
                showNotification('Your cart is empty. Add some products first!', 'error');
            }
            // Otherwise, allow normal link navigation to checkout.html
        });
    }
    
    // Enhanced category navigation - connecting category cards to category pages
    setupCategoryNavigation();
    
    // Setup special hover effects for view all button
    setupViewAllButton();
    
    // Function to enhance the category navigation
    function setupCategoryNavigation() {
        // Get all category card links
        const categoryLinks = document.querySelectorAll('.category-card a, .category-box a');
        
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Get the category from either data attribute or href parameter
                let category;
                
                if (this.dataset.category) {
                    category = this.dataset.category;
                } else if (this.getAttribute('href').includes('?')) {
                    // Extract from URL parameter if present
                    const hrefParts = this.getAttribute('href').split('?');
                    const urlParams = new URLSearchParams(hrefParts[1]);
                    category = urlParams.get('category');
                }
                
                // Store the selected category in localStorage for potential use
                if (category) {
                    localStorage.setItem('selectedCategory', category);
                }
            });
        });
    }
    
    // Function to enhance the view all button
    function setupViewAllButton() {
        const viewAllBtn = document.querySelector('.view-all-btn');
        
        if (viewAllBtn) {
            // Add enhanced visual effects on hover
            viewAllBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-7px) scale(1.05)';
                this.style.boxShadow = '0 20px 35px rgba(0, 82, 204, 0.4)';
                
                // Animate the arrow icon
                const btnIcon = this.querySelector('.btn-icon');
                if (btnIcon) {
                    btnIcon.style.transform = 'translateX(5px)';
                    btnIcon.style.opacity = '1';
                }
            });
            
            viewAllBtn.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
                
                // Reset the arrow icon
                const btnIcon = this.querySelector('.btn-icon');
                if (btnIcon) {
                    btnIcon.style.transform = 'translateX(0)';
                    btnIcon.style.opacity = '0.7';
                }
            });
            
            // Add click animation
            viewAllBtn.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(-3px)';
                this.style.borderBottom = '1px solid rgba(0, 0, 0, 0.2)';
            });
            
            viewAllBtn.addEventListener('mouseup', function() {
                this.style.transform = 'translateY(-7px) scale(1.05)';
                this.style.borderBottom = '3px solid rgba(0, 0, 0, 0.2)';
            });
        }
    }
    
    function initCountdown() {
        // Set countdown date (7 days from now)
        const countdownDate = new Date();
        countdownDate.setDate(countdownDate.getDate() + 7);
        
        // Update countdown every second
        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;
            
            // Calculate days, hours, minutes, seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Display countdown
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');
            
            if (daysElement && hoursElement && minutesElement && secondsElement) {
                daysElement.textContent = days.toString().padStart(2, '0');
                hoursElement.textContent = hours.toString().padStart(2, '0');
                minutesElement.textContent = minutes.toString().padStart(2, '0');
                secondsElement.textContent = seconds.toString().padStart(2, '0');
            }
            
            // If countdown is finished
            if (distance < 0) {
                clearInterval(countdownInterval);
                if (daysElement && hoursElement && minutesElement && secondsElement) {
                    daysElement.textContent = '00';
                    hoursElement.textContent = '00';
                    minutesElement.textContent = '00';
                    secondsElement.textContent = '00';
                }
            }
        }, 1000);
    }
    
    // Initialize smooth scrolling for all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (window.innerWidth <= 768 && navLinks) {
                        navLinks.style.right = '-300px';
                        if (overlay) overlay.style.display = 'none';
                    }
                    
                    // Close sidebars if open
                    if (cartSidebar) cartSidebar.style.right = '-400px';
                    if (wishlistSidebar) wishlistSidebar.style.right = '-400px';
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
        // Activate navigation links based on scroll position
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    function performSearch(query) {
        if (query.trim() === '') return;
        
        // In a real app, you would redirect to search results page
        // Here, we'll redirect to products page with search query
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
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
    
    // FIXED: Update cart count function
    function updateCartCount() {
        // Select all cart count elements - there might be multiple in different places
        const cartCountElements = document.querySelectorAll('.cart-count');
        if (cartCountElements.length === 0) {
            console.warn('No cart count elements found in the DOM');
            return;
        }
        
        // Calculate total items in cart
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update all cart count badges
        cartCountElements.forEach(countElement => {
            // Update the text content
            countElement.textContent = totalItems;
            
            // Add animation
            countElement.style.animation = 'none';
            // Force reflow to ensure animation restarts
            void countElement.offsetWidth;
            countElement.style.animation = 'cartCountPulse 0.5s ease';
        });
        
        // For debugging
        console.log('Cart updated, total items:', totalItems);
    }
    
    function updateWishlistCount() {
        // Select all wishlist count elements
        const wishlistCountElements = document.querySelectorAll('.wishlist-count');
        if (wishlistCountElements.length === 0) {
            console.warn('No wishlist count elements found in the DOM');
            return;
        }
        
        // Update all wishlist count badges with animation
        wishlistCountElements.forEach(countElement => {
            countElement.textContent = wishlist.length;
            
            // Add a scale animation to the wishlist count
            countElement.style.animation = 'none';
            void countElement.offsetWidth; // Force reflow
            countElement.style.animation = 'cartCountPulse 0.5s ease';
        });
    }
    
    function updateCartUI() {
        if (!cartItems) return;
        
        // Clear cart items container
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            // Show empty cart message
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <p>Your cart is empty</p>
                    <a href="#featured" class="btn secondary-btn">Start Shopping</a>
                </div>
            `;
            
            // Update cart total
            if (cartTotal) {
                cartTotal.textContent = '৳0.00';
            }
            
            // Hide checkout button
            if (checkoutBtn) {
                checkoutBtn.style.display = 'none';
            }
        } else {
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
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="10">
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <button class="remove-item"><i class="fas fa-trash"></i></button>
                `;
                
                cartItems.appendChild(cartItem);
                
                // Add event listeners for cart item controls
                setupCartItemEventListeners(cartItem);
            });
            
            // Update cart total
            updateCartTotal();
            
            // Show checkout button
            if (checkoutBtn) {
                checkoutBtn.style.display = 'block';
            }
        }
    }
});