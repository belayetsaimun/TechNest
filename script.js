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
        const modalImage = quickViewModal.querySelector('img');
        const modalRating = quickViewModal.querySelector('.product-rating');
        const modalOldPrice = quickViewModal.querySelector('.old-price');
        const modalDiscount = quickViewModal.querySelector('.discount');
        
        if (modalTitle) modalTitle.textContent = productName;
        if (modalPrice) modalPrice.textContent = `৳${productPrice.toLocaleString('en-IN')}`;
        if (modalImage) {
            modalImage.src = productImage;
            modalImage.alt = productName;
        }
        
        if (modalRating && ratingHTML) {
            modalRating.innerHTML = ratingHTML;
        }
        
        // Generate a more dynamic product description based on the product
        let description = '';
        if (productName.includes('iPhone') || productName.includes('Iphone')) {
            description = `The ${productName} offers a stunning display, advanced camera system, and powerful performance in a sleek design. With its A-series chip, it provides exceptional speed for games, AR, and machine learning.`;
        } else if (productName.includes('AirPods') || productName.includes('Earbuds')) {
            description = `Experience immersive sound with the ${productName}. Featuring active noise cancellation, easy setup, and comfortable fit, these earbuds deliver crystal-clear audio for music, calls, and more.`;
        } else if (productName.includes('Watch') || productName.includes('SmartFit')) {
            description = `The ${productName} helps you stay connected, active, and healthy. Track your workouts, monitor your heart rate, and receive notifications right on your wrist with this sleek and innovative smartwatch.`;
        } else if (productName.includes('MacBook') || productName.includes('Laptop')) {
            description = `Powerful and portable, the ${productName} features a stunning Retina display, all-day battery life, and high-performance processors. Perfect for creative work, coding, and everyday tasks.`;
        } else if (productName.includes('Bass') || productName.includes('headphone')) {
            description = `Immerse yourself in rich, detailed sound with the ${productName}. These premium headphones feature active noise cancellation, comfortable ear cups, and long battery life for extended listening sessions.`;
        } else {
            description = `The ${productName} offers premium quality, exceptional performance, and innovative features at a great value. Experience the perfect blend of technology and design with this cutting-edge device.`;
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
        
        // Show modal
        quickViewModal.style.display = 'block';
        overlay.style.display = 'block';
        
        // Setup event listeners for the modal
        setupQuickViewEventListeners();
    }
    
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
        
        // Quantity buttons
        quantityBtns.forEach(btn => {
            btn.onclick = () => {
                const input = btn.parentElement.querySelector('input');
                let currentValue = parseInt(input.value);
                
                if (btn.classList.contains('minus') && currentValue > 1) {
                    input.value = currentValue - 1;
                } else if (btn.classList.contains('plus') && currentValue < 10) {
                    input.value = currentValue + 1;
                }
            };
        });
        
        // Color options
        colorOptions.forEach(option => {
            option.onclick = () => {
                colorOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            };
        });
    }
    
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
        
        addItemToCart(product);
        
        // Close modal
        quickViewModal.style.display = 'none';
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
    
    // Buy Now Button in Quick View Modal
    function showBuyNowModal() {
        if (!quickViewModal || !buyNowModal) return;
        
        const productName = quickViewModal.dataset.name;
        const productPrice = quickViewModal.dataset.price;
        const productImage = quickViewModal.dataset.image;
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        const quantity = quantityInput ? quantityInput.value : 1;
        
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
            productTotalElement.textContent = `৳${(parseFloat(productPrice) * parseInt(quantity)).toLocaleString('en-IN')}`;
        }
        
        // Reset quantity input
        const buyNowQuantityInput = buyNowModal.querySelector('.quantity-selector input');
        if (buyNowQuantityInput) {
            buyNowQuantityInput.value = quantity;
        }
        
        // Store product data in modal
        buyNowModal.dataset.id = quickViewModal.dataset.id;
        buyNowModal.dataset.name = productName;
        buyNowModal.dataset.price = productPrice;
        buyNowModal.dataset.image = productImage;
        
        // Setup event listeners for buy now modal
        setupBuyNowEventListeners();
    }
    
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
            };
        }
        
        // Quantity buttons
        quantityBtns.forEach(btn => {
            btn.onclick = () => {
                const input = btn.parentElement.querySelector('input');
                if (!input) return;
                
                let currentValue = parseInt(input.value);
                
                if (btn.classList.contains('minus') && currentValue > 1) {
                    input.value = currentValue - 1;
                    updateBuyNowTotal();
                } else if (btn.classList.contains('plus') && currentValue < 10) {
                    input.value = currentValue + 1;
                    updateBuyNowTotal();
                }
            };
        });
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
    }
    
    // Quantity Buttons in Modals and Cart
    function setupQuantityButtons() {
        const quantityBtns = document.querySelectorAll('.quantity-btn');
        
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                if (!input) return;
                
                const currentValue = parseInt(input.value);
                
                if (this.classList.contains('minus') && currentValue > 1) {
                    input.value = currentValue - 1;
                    
                    // If in buy now modal, update totals
                    if (this.closest('#buyNowModal')) {
                        updateBuyNowTotal();
                    }
                    
                    // If in cart, update item quantity
                    if (this.closest('.cart-item')) {
                        const cartItem = this.closest('.cart-item');
                        const productId = cartItem.dataset.id;
                        updateCartItemQuantity(productId, currentValue - 1);
                    }
                    
                } else if (this.classList.contains('plus') && currentValue < 10) {
                    input.value = currentValue + 1;
                    
                    // If in buy now modal, update totals
                    if (this.closest('#buyNowModal')) {
                        updateBuyNowTotal();
                    }
                    
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
                priceElement.textContent = `৳${itemPrice.toLocaleString('en-IN')}`;
            }
            
            // Update localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart total and count
            updateCartTotal();
            updateCartCount();
        }
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
    
    // Cart and Wishlist Functions
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
        
        // Show notification
        showNotification(`Added ${product.name} to cart!`, 'success');
        
        // Show cart sidebar
        if (cartSidebar) {
            cartSidebar.style.right = '0';
            overlay.style.display = 'block';
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
    
    function updateCartCount() {
        if (!cartCount) return;
        
        // Calculate total items in cart
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart count badge
        cartCount.textContent = totalItems;
    }
    
    function updateWishlistCount() {
        if (!wishlistCount) return;
        
        // Update wishlist count badge
        wishlistCount.textContent = wishlist.length;
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
    
    function setupCartItemEventListeners(cartItem) {
        if (!cartItem) return;
        
        const minusBtn = cartItem.querySelector('.minus');
        const plusBtn = cartItem.querySelector('.plus');
        const input = cartItem.querySelector('input');
        const removeBtn = cartItem.querySelector('.remove-item');
        const productId = cartItem.dataset.id;
        
        // Minus button
        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                if (!input) return;
                
                const currentValue = parseInt(input.value);
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    updateCartItemQuantity(productId, currentValue - 1);
                }
            });
        }
        
        // Plus button
        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                if (!input) return;
                
                const currentValue = parseInt(input.value);
                if (currentValue < 10) {
                    input.value = currentValue + 1;
                    updateCartItemQuantity(productId, currentValue + 1);
                }
            });
        }
        
        // Input change
        if (input) {
            input.addEventListener('change', () => {
                let newValue = parseInt(input.value);
                
                // Ensure value is between 1 and 10
                if (isNaN(newValue) || newValue < 1) newValue = 1;
                if (newValue > 10) newValue = 10;
                
                input.value = newValue;
                updateCartItemQuantity(productId, newValue);
            });
        }
        
        // Remove button
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                removeFromCart(productId);
                
                // Show notification
                const item = cart.find(item => item.id === productId);
                if (item) {
                    showNotification(`Removed ${item.name} from cart!`, 'info');
                }
            });
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
                    
                    // Show wishlist sidebar
                    if (wishlistSidebar) {
                        wishlistSidebar.style.right = '-400px';
                    }
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
    
    function updateCartTotal() {
        if (!cartTotal) return;
        
        // Calculate cart total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Update cart total display
        cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
    }
    
    function performSearch(query) {
        if (query.trim() === '') return;
        
        // In a real app, you would redirect to search results page
        // Here, we'll redirect to products page with search query
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
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
});