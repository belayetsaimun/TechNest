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
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const emptyCart = document.querySelector('.empty-cart');
    const cartTotal = document.querySelector('.cart-total span:last-child');
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Wishlist Sidebar
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const closeWishlist = document.querySelector('.close-wishlist');
    const wishlistCount = document.querySelector('.wishlist-count');
    const wishlistItems = document.querySelector('.wishlist-items');
    const emptyWishlist = document.querySelector('.empty-wishlist');
    const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');

    // Quick View Modal
    const quickViewModal = document.getElementById('quickViewModal');
    const closeModal = document.querySelector('.close-modal');
    const quickViewBtns = document.querySelectorAll('.quick-view');
    
    // Buy Now Modal
    const buyNowModal = document.getElementById('buyNowModal');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    const addToCartFromBuyNowBtn = document.querySelector('.add-to-cart-from-buynow');

    // Add to Cart Buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const addToCartModalBtn = document.querySelector('.add-to-cart-btn');
    
    // Add to Wishlist Buttons
    const addToWishlistBtns = document.querySelectorAll('.add-to-wishlist');
    
    // Quantity Selectors
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    
    // New Arrivals Slider
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const productSlider = document.querySelector('.product-slider');
    
    // Testimonial Carousel
    const dots = document.querySelectorAll('.dot');
    
    // Countdown Timer
    initCountdown();
    
    // Color Options
    const colorOptions = document.querySelectorAll('.color-option');
    
    // Initialize Shopping Cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Update Cart and Wishlist UI on page load
    updateCartCount();
    updateCartUI();
    updateWishlistCount();
    updateWishlistUI();
    
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
    
    // Quick View Modal Functions
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = btn.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            const productImage = productCard.querySelector('img').src;
            
            // Populate modal with product details
            const modalTitle = quickViewModal.querySelector('h2');
            const modalPrice = quickViewModal.querySelector('.current-price');
            const modalImage = quickViewModal.querySelector('img');
            
            modalTitle.textContent = productName;
            modalPrice.textContent = productPrice;
            modalImage.src = productImage;
            
            // Show modal
            quickViewModal.style.display = 'block';
            overlay.style.display = 'block';
            
            // Store product data in the modal for use with add to cart
            quickViewModal.dataset.id = productCard.dataset.id;
            quickViewModal.dataset.name = productName;
            quickViewModal.dataset.price = productCard.dataset.price;
            quickViewModal.dataset.image = productImage;
        });
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            quickViewModal.style.display = 'none';
            buyNowModal.style.display = 'none';
            overlay.style.display = 'none';
        });
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
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = btn.closest('.product-card');
            addToCart(productCard);
        });
    });
    
    if (addToCartModalBtn) {
        addToCartModalBtn.addEventListener('click', () => {
            addToCartFromModal();
        });
    }
    
    // Add to Wishlist Functionality
    addToWishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = btn.closest('.product-card');
            toggleWishlist(productCard);
            
            // Toggle heart icon
            const heartIcon = btn.querySelector('i');
            heartIcon.classList.toggle('far');
            heartIcon.classList.toggle('fas');
        });
    });
    
    // Buy Now Button in Quick View Modal
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            const productName = quickViewModal.dataset.name;
            const productPrice = quickViewModal.dataset.price;
            const productImage = quickViewModal.dataset.image;
            const quantity = quickViewModal.querySelector('.quantity-selector input').value;
            
            // Close quick view modal
            quickViewModal.style.display = 'none';
            
            // Show buy now modal
            buyNowModal.style.display = 'block';
            
            // Populate buy now modal
            buyNowModal.querySelector('.buy-now-product-image img').src = productImage;
            buyNowModal.querySelector('.buy-now-product-info h3').textContent = productName;
            buyNowModal.querySelector('.price').textContent = `$${parseFloat(productPrice).toFixed(2)}`;
            buyNowModal.querySelector('.product-name').textContent = productName;
            buyNowModal.querySelector('.product-price').textContent = `$${parseFloat(productPrice).toFixed(2)}`;
            buyNowModal.querySelector('.product-total').textContent = `$${(parseFloat(productPrice) * parseInt(quantity)).toFixed(2)}`;
            
            // Store product data in modal
            buyNowModal.dataset.id = quickViewModal.dataset.id;
            buyNowModal.dataset.name = productName;
            buyNowModal.dataset.price = productPrice;
            buyNowModal.dataset.image = productImage;
        });
    }
    
    // Add to Cart from Buy Now Modal
    if (addToCartFromBuyNowBtn) {
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
            
            addItemToCart(product);
            
            // Close buy now modal
            buyNowModal.style.display = 'none';
            
            // Show cart sidebar
            cartSidebar.style.right = '0';
        });
    }
    
    // Quantity Buttons in Modals and Cart
    function setupQuantityButtons() {
        const quantityBtns = document.querySelectorAll('.quantity-btn');
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const input = btn.parentElement.querySelector('input');
                const currentValue = parseInt(input.value);
                
                if (btn.classList.contains('minus') && currentValue > 1) {
                    input.value = currentValue - 1;
                    
                    // If in buy now modal, update totals
                    if (btn.closest('#buyNowModal')) {
                        updateBuyNowTotal();
                    }
                    
                    // If in cart, update item quantity
                    if (btn.closest('.cart-item')) {
                        const cartItem = btn.closest('.cart-item');
                        const productId = cartItem.dataset.id;
                        updateCartItemQuantity(productId, currentValue - 1);
                    }
                    
                } else if (btn.classList.contains('plus') && currentValue < 10) {
                    input.value = currentValue + 1;
                    
                    // If in buy now modal, update totals
                    if (btn.closest('#buyNowModal')) {
                        updateBuyNowTotal();
                    }
                    
                    // If in cart, update item quantity
                    if (btn.closest('.cart-item')) {
                        const cartItem = btn.closest('.cart-item');
                        const productId = cartItem.dataset.id;
                        updateCartItemQuantity(productId, currentValue + 1);
                    }
                }
            });
        });
    }
    
    // Setup quantity buttons on page load
    setupQuantityButtons();
    
    // Update Buy Now Modal Total
    function updateBuyNowTotal() {
        const price = parseFloat(buyNowModal.dataset.price);
        const quantity = parseInt(buyNowModal.querySelector('.quantity-selector input').value);
        const total = price * quantity;
        
        buyNowModal.querySelector('.product-quantity').textContent = quantity;
        buyNowModal.querySelector('.product-total').textContent = `$${total.toFixed(2)}`;
    }
    
    // Update Cart Item Quantity
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
                priceElement.textContent = `$${itemPrice.toFixed(2)}`;
            }
            
            // Update localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart total
            updateCartTotal();
        }
    }
    
    // Slider Controls
    if (prevBtn && nextBtn && productSlider) {
        prevBtn.addEventListener('click', () => {
            productSlider.scrollBy({
                left: -330,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', () => {
            productSlider.scrollBy({
                left: 330,
                behavior: 'smooth'
            });
        });
    }
    
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
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
        });
    });
    
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
    
    // Cart and Wishlist Functions
    function addToCart(productCard) {
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
    
    function addItemToCart(product) {
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            // Increase quantity if item already exists
            existingItem.quantity += product.quantity;
        } else {
            // Add new item to cart
            cart.push(product);
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        updateCartUI();
        
        // Show cart sidebar
        cartSidebar.style.right = '0';
        overlay.style.display = 'block';
    }
    
    function addToCartFromModal() {
        const productId = quickViewModal.dataset.id;
        const productName = quickViewModal.dataset.name;
        const productPrice = quickViewModal.dataset.price;
        const productImage = quickViewModal.dataset.image;
        const quantity = parseInt(quickViewModal.querySelector('.quantity-selector input').value);
        
        // Create product object
        const product = {
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            image: productImage,
            quantity: quantity
        };
        
        addItemToCart(product);
        
        // Close modal
        quickViewModal.style.display = 'none';
    }
    
    function toggleWishlist(productCard) {
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        
        // Check if product is already in wishlist
        const existingItemIndex = wishlist.findIndex(item => item.id === productId);
        
        if (existingItemIndex !== -1) {
            // Remove from wishlist
            wishlist.splice(existingItemIndex, 1);
        } else {
            // Add to wishlist
            wishlist.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            });
        }
        
        // Save wishlist to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update UI
        updateWishlistCount();
        updateWishlistUI();
        
        // Show wishlist sidebar for new additions (optional)
        if (existingItemIndex === -1) {
            wishlistSidebar.style.right = '0';
            overlay.style.display = 'block';
        }
    }
    
    function removeFromCart(productId) {
        // Find the item in the cart
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            // Remove the item from the cart
            cart.splice(itemIndex, 1);
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            updateCartUI();
        }
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
    }
    
    function updateCartCount() {
        // Calculate total items in cart
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart count badge
        cartCount.textContent = totalItems;
    }
    
    function updateWishlistCount() {
        // Update wishlist count badge
        wishlistCount.textContent = wishlist.length;
    }
    
    function updateCartUI() {
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
            cartTotal.textContent = '$0.00';
            
            // Hide checkout button
            checkoutBtn.style.display = 'none';
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
                        <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="10">
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <button class="remove-item"><i class="fas fa-trash"></i></button>
                `;
                
                cartItems.appendChild(cartItem);
                
                // Add event listener to remove button
                const removeBtn = cartItem.querySelector('.remove-item');
                removeBtn.addEventListener('click', () => {
                    removeFromCart(item.id);
                });
            });
            
            // Update cart total
            updateCartTotal();
            
            // Show checkout button
            checkoutBtn.style.display = 'block';
            
            // Setup quantity buttons for new cart items
            setupQuantityButtons();
        }
    }
    
    function updateWishlistUI() {
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
            clearWishlistBtn.style.display = 'none';
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
                        <p class="wishlist-item-price">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="move-to-cart"><i class="fas fa-shopping-cart"></i></button>
                        <button class="remove-from-wishlist"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                wishlistItems.appendChild(wishlistItem);
                
                // Add event listener to move to cart button
                const moveToCartBtn = wishlistItem.querySelector('.move-to-cart');
                moveToCartBtn.addEventListener('click', () => {
                    // Add to cart
                    addItemToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: 1
                    });
                    
                    // Remove from wishlist
                    removeFromWishlist(item.id);
                    
                    // Update product card heart icon
                    const productCard = document.querySelector(`.product-card[data-id="${item.id}"]`);
                    if (productCard) {
                        const heartIcon = productCard.querySelector('.add-to-wishlist i');
                        if (heartIcon) {
                            heartIcon.classList.remove('fas');
                            heartIcon.classList.add('far');
                        }
                    }
                    
                    // Show cart sidebar
                    wishlistSidebar.style.right = '-400px';
                    cartSidebar.style.right = '0';
                });
                
                // Add event listener to remove button
                const removeBtn = wishlistItem.querySelector('.remove-from-wishlist');
                removeBtn.addEventListener('click', () => {
                    removeFromWishlist(item.id);
                    
                    // Update product card heart icon
                    const productCard = document.querySelector(`.product-card[data-id="${item.id}"]`);
                    if (productCard) {
                        const heartIcon = productCard.querySelector('.add-to-wishlist i');
                        if (heartIcon) {
                            heartIcon.classList.remove('fas');
                            heartIcon.classList.add('far');
                        }
                    }
                });
            });
            
            // Show clear wishlist button
            clearWishlistBtn.style.display = 'block';
        }
    }
    
    function updateCartTotal() {
        // Calculate cart total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Update cart total display
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    function performSearch(query) {
        if (query.trim() === '') return;
        
        // In a real application, you would redirect to a search results page
        // or fetch results from a backend API
        alert(`Searching for: ${query}`);
        searchInput.value = '';
        searchInput.classList.remove('active');
    }
    
    function createCartItem(name, price, image, quantity = 1) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${image}" alt="${name}">
            <div class="cart-item-info">
                <h4>${name}</h4>
                <p class="cart-item-price">${price}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" value="${quantity}" min="1" max="10">
                    <button class="quantity-btn plus">+</button>
                </div>
            </div>
            <button class="remove-item"><i class="fas fa-trash"></i></button>
        `;
        
        // Add event listeners to new elements
        const minusBtn = cartItem.querySelector('.minus');
        const plusBtn = cartItem.querySelector('.plus');
        const removeBtn = cartItem.querySelector('.remove-item');
        const input = cartItem.querySelector('input');
        
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateCartTotal();
            }
        });
        
        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue < 10) {
                input.value = currentValue + 1;
                updateCartTotal();
            }
        });
        
        removeBtn.addEventListener('click', () => {
            cartItem.remove();
            updateCartCount();
            updateCartTotal();
        });
        
        return cartItem;
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
            if (document.getElementById('days')) {
                document.getElementById('days').textContent = days.toString().padStart(2, '0');
                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            }
            
            // If countdown is finished
            if (distance < 0) {
                clearInterval(countdownInterval);
                if (document.getElementById('days')) {
                    document.getElementById('days').textContent = '00';
                    document.getElementById('hours').textContent = '00';
                    document.getElementById('minutes').textContent = '00';
                    document.getElementById('seconds').textContent = '00';
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
                    if (window.innerWidth <= 768) {
                        navLinks.style.right = '-300px';
                        overlay.style.display = 'none';
                    }
                    
                    // Close sidebars if open
                    cartSidebar.style.right = '-400px';
                    wishlistSidebar.style.right = '-400px';
                    
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
    
    // Initialize the UI - update wishlist icons based on localStorage
    function initializeWishlistIcons() {
        const wishlistIds = wishlist.map(item => item.id);
        
        // Find all wishlist icons
        document.querySelectorAll('.add-to-wishlist').forEach(btn => {
            const productCard = btn.closest('.product-card');
            const productId = productCard.dataset.id;
            const heartIcon = btn.querySelector('i');
            
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
                alert('Your cart is empty. Add some products first!');
            }
            // Otherwise, allow normal link navigation to checkout.html
        });
    }
});