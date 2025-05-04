/**
 * TechNest - Product Detail Page JavaScript
 * This file contains all functionality specific to the product detail page
 */

// Initialize all components when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Product Gallery
    initProductGallery();
    
    // Product Options (color, storage)
    initProductOptions();
    
    // Quantity Selector
    initQuantitySelector();
    
    // Tabs System (description, specs, reviews, FAQ)
    initTabSystem();
    
    // FAQ Accordion
    initFaqAccordion();
    
    // Review System
    initReviewSystem();
    
    // Action Buttons (add to cart, buy now, wishlist)
    initActionButtons();
    
    // Update cart and wishlist counts on page load
    updateCartCount();
    updateWishlistCount();
});

/**
 * Product Gallery
 * - Main image display
 * - Thumbnail navigation
 * - Image zoom on hover
 */
function initProductGallery() {
    const mainImage = document.getElementById("main-product-image");
    const thumbnails = document.querySelectorAll(".thumbnail");
    
    if (!mainImage || thumbnails.length === 0) return;
    
    // Set up thumbnail click events
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener("click", function() {
            // Update main image source
            const imageUrl = this.getAttribute("data-image");
            if (mainImage && imageUrl) {
                // Apply fade effect during image change
                mainImage.style.opacity = 0;
                
                setTimeout(() => {
                    mainImage.src = imageUrl;
                    mainImage.style.opacity = 1;
                }, 200);
            }
            
            // Update active thumbnail state
            thumbnails.forEach(item => {
                item.classList.remove("active");
            });
            this.classList.add("active");
        });
    });
    
    // Image zoom effect on hover
    if (mainImage) {
        const mainImageContainer = mainImage.parentElement;
        
        mainImageContainer.addEventListener("mousemove", function(e) {
            // Only apply zoom on larger screens
            if (window.innerWidth < 768) return;
            
            const { left, top, width, height } = this.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            mainImage.style.transformOrigin = `${x * 100}% ${y * 100}%`;
            mainImage.style.transform = "scale(1.5)";
        });
        
        mainImageContainer.addEventListener("mouseleave", function() {
            mainImage.style.transform = "scale(1)";
        });
    }
}

/**
 * Product Options
 * - Color selection
 * - Storage selection
 * - Updates price and images based on selection
 */
function initProductOptions() {
    // Color options
    const colorOptions = document.querySelectorAll(".color-option");
    const mainImage = document.getElementById("main-product-image");
    const thumbnails = document.querySelectorAll(".thumbnail");
    
    if (colorOptions.length > 0) {
        colorOptions.forEach(option => {
            option.addEventListener("click", function() {
                // Update active color
                colorOptions.forEach(item => {
                    item.classList.remove("active");
                });
                this.classList.add("active");
                
                // Update main image if color has associated image
                const imageUrl = this.getAttribute("data-image");
                if (mainImage && imageUrl) {
                    mainImage.src = imageUrl;
                    
                    // Update active thumbnail to match the selected color
                    if (thumbnails.length > 0) {
                        thumbnails.forEach(thumbnail => {
                            if (thumbnail.getAttribute("data-image") === imageUrl) {
                                thumbnail.classList.add("active");
                            } else {
                                thumbnail.classList.remove("active");
                            }
                        });
                    }
                }
                
                // Save selected color to session storage for cart
                sessionStorage.setItem("selectedColor", this.getAttribute("data-color"));
            });
        });
    }
    
    // Storage options
    const storageOptions = document.querySelectorAll(".storage-option");
    const priceElement = document.querySelector(".current-price");
    const oldPriceElement = document.querySelector(".old-price");
    
    if (storageOptions.length > 0 && priceElement) {
        storageOptions.forEach(option => {
            option.addEventListener("click", function() {
                // Update active storage
                storageOptions.forEach(item => {
                    item.classList.remove("active");
                });
                this.classList.add("active");
                
                // Update prices based on selected storage
                const price = this.getAttribute("data-price");
                if (price) {
                    // Format price with thousands separators
                    const formattedPrice = Number(price).toLocaleString();
                    priceElement.textContent = `৳${formattedPrice}`;
                    
                    // If there's an old price, update it proportionally
                    if (oldPriceElement) {
                        const currentOldPrice = oldPriceElement.textContent.replace(/[^\d]/g, "");
                        const currentPrice = document.querySelector(".storage-option.active").getAttribute("data-price");
                        const priceRatio = currentOldPrice / currentPrice;
                        
                        const newOldPrice = Math.round(price * priceRatio);
                        oldPriceElement.textContent = `৳${newOldPrice.toLocaleString()}`;
                    }
                    
                    // Save selected storage and price to session storage for cart
                    sessionStorage.setItem("selectedStorage", this.textContent.trim());
                    sessionStorage.setItem("selectedPrice", price);
                }
            });
        });
    }
}

/**
 * Quantity Selector
 * - Increase/decrease product quantity
 * - Enforce min/max limits
 */
function initQuantitySelector() {
    const minusBtn = document.querySelector(".quantity-btn.minus");
    const plusBtn = document.querySelector(".quantity-btn.plus");
    const quantityInput = document.getElementById("quantity");
    
    if (!minusBtn || !plusBtn || !quantityInput) return;
    
    // Decrease quantity button
    minusBtn.addEventListener("click", function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            // Trigger change event to update any dependent elements
            quantityInput.dispatchEvent(new Event("change"));
        }
    });
    
    // Increase quantity button
    plusBtn.addEventListener("click", function() {
        let currentValue = parseInt(quantityInput.value);
        const maxQuantity = parseInt(quantityInput.getAttribute("max") || 10);
        
        if (currentValue < maxQuantity) {
            quantityInput.value = currentValue + 1;
            // Trigger change event to update any dependent elements
            quantityInput.dispatchEvent(new Event("change"));
        }
    });
    
    // Direct input validation
    quantityInput.addEventListener("change", function() {
        let value = parseInt(this.value);
        const minQuantity = parseInt(this.getAttribute("min") || 1);
        const maxQuantity = parseInt(this.getAttribute("max") || 10);
        
        // Ensure value is a valid number within range
        if (isNaN(value) || value < minQuantity) {
            this.value = minQuantity;
        } else if (value > maxQuantity) {
            this.value = maxQuantity;
        }
        
        // Save selected quantity to session storage for cart
        sessionStorage.setItem("selectedQuantity", this.value);
    });
}

/**
 * Tab System
 * - Switches between description, specifications, reviews, and FAQ
 */
function initTabSystem() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");
    
    if (tabButtons.length === 0 || tabPanes.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener("click", function() {
            const targetTabId = this.getAttribute("data-tab");
            
            // Update active state for buttons
            tabButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            
            // Show selected tab content, hide others
            tabPanes.forEach(pane => {
                if (pane.id === targetTabId) {
                    pane.classList.add("active");
                    
                    // Smooth scroll to tab content on mobile
                    if (window.innerWidth < 768) {
                        setTimeout(() => {
                            pane.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 100);
                    }
                } else {
                    pane.classList.remove("active");
                }
            });
            
            // Save active tab to session storage to maintain state on page reload
            sessionStorage.setItem("activeProductTab", targetTabId);
        });
    });
    
    // Restore active tab from session storage
    const savedTab = sessionStorage.getItem("activeProductTab");
    if (savedTab) {
        const savedTabButton = document.querySelector(`.tab-btn[data-tab="${savedTab}"]`);
        if (savedTabButton) {
            savedTabButton.click();
        }
    }
}

/**
 * FAQ Accordion
 * - Expands/collapses FAQ items
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        
        if (question) {
            question.addEventListener("click", function() {
                const isActive = item.classList.contains("active");
                
                // Close all items first
                faqItems.forEach(i => i.classList.remove("active"));
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add("active");
                }
            });
        }
    });
    
    // Open first FAQ item by default
    if (faqItems.length > 0 && !document.querySelector(".faq-item.active")) {
        faqItems[0].classList.add("active");
    }
    
    // Initialize Ask Question button
    const askQuestionBtn = document.querySelector(".ask-question-btn");
    if (askQuestionBtn) {
        askQuestionBtn.addEventListener("click", function() {
            // Show modal or form for asking a new question
            showAskQuestionModal();
        });
    }
}

/**
 * Modal for asking a new question
 */
function showAskQuestionModal() {
    // Create modal container
    const modalContainer = document.createElement("div");
    modalContainer.className = "modal-container";
    modalContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    
    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.style.cssText = `
        background-color: white;
        width: 90%;
        max-width: 500px;
        border-radius: 8px;
        padding: 25px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transform: translateY(20px);
        transition: transform 0.3s;
    `;
    
    // Modal header
    const modalHeader = document.createElement("div");
    modalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    `;
    
    const modalTitle = document.createElement("h3");
    modalTitle.textContent = "Ask a Question";
    modalTitle.style.margin = "0";
    
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&times;";
    closeButton.style.cssText = `
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #777;
    `;
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    
    // Modal form
    const modalForm = document.createElement("form");
    modalForm.innerHTML = `
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Your Question <span style="color: #dc3545;">*</span></label>
            <textarea style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; min-height: 120px; resize: vertical;"></textarea>
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Your Email <span style="color: #dc3545;">*</span></label>
            <input type="email" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <button type="button" class="cancel-btn" style="padding: 10px 20px; background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 5px; cursor: pointer;">Cancel</button>
            <button type="submit" style="padding: 10px 20px; background-color: #4361ee; color: white; border: none; border-radius: 5px; cursor: pointer;">Submit Question</button>
        </div>
    `;
    
    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalForm);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
    
    // Show modal with animation
    setTimeout(() => {
        modalContainer.style.opacity = "1";
        modalContent.style.transform = "translateY(0)";
    }, 10);
    
    // Close modal events
    closeButton.addEventListener("click", closeModal);
    modalContainer.addEventListener("click", function(e) {
        if (e.target === modalContainer) {
            closeModal();
        }
    });
    
    const cancelBtn = modalForm.querySelector(".cancel-btn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", closeModal);
    }
    
    // Handle form submission
    modalForm.addEventListener("submit", function(e) {
        e.preventDefault();
        // Here you would normally send the data to the server
        showNotification("Your question has been submitted. We'll notify you when it's answered.");
        closeModal();
    });
    
    function closeModal() {
        modalContainer.style.opacity = "0";
        modalContent.style.transform = "translateY(20px)";
        
        setTimeout(() => {
            document.body.removeChild(modalContainer);
        }, 300);
    }
}

/**
 * Review System
 * - Review form toggle
 * - Star rating selector
 * - Review filtering
 */
function initReviewSystem() {
    // Write review button
    const writeReviewBtn = document.querySelector(".write-review-btn");
    const reviewForm = document.getElementById("reviewForm");
    const cancelReviewBtn = document.querySelector(".cancel-review-btn");
    
    if (writeReviewBtn && reviewForm) {
        writeReviewBtn.addEventListener("click", function() {
            reviewForm.style.display = "block";
            setTimeout(() => {
                reviewForm.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        });
    }
    
    if (cancelReviewBtn && reviewForm) {
        cancelReviewBtn.addEventListener("click", function() {
            reviewForm.style.display = "none";
        });
    }
    
    // Star rating selector
    const ratingStars = document.querySelectorAll(".rating-selector i");
    if (ratingStars.length > 0) {
        let selectedRating = 0;
        
        ratingStars.forEach(star => {
            // Hover effect
            star.addEventListener("mouseover", function() {
                const rating = parseInt(this.getAttribute("data-rating"));
                
                ratingStars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.remove("far");
                        s.classList.add("fas");
                    } else {
                        s.classList.remove("fas");
                        s.classList.add("far");
                    }
                });
            });
            
            // Click to select rating
            star.addEventListener("click", function() {
                selectedRating = parseInt(this.getAttribute("data-rating"));
                
                // Add hidden input to form with rating value
                let ratingInput = document.getElementById("selected-rating");
                if (!ratingInput) {
                    ratingInput = document.createElement("input");
                    ratingInput.type = "hidden";
                    ratingInput.id = "selected-rating";
                    ratingInput.name = "rating";
                    document.querySelector(".rating-selector").appendChild(ratingInput);
                }
                ratingInput.value = selectedRating;
            });
        });
        
        // Reset to selected rating when mouse leaves
        const ratingContainer = document.querySelector(".rating-selector");
        if (ratingContainer) {
            ratingContainer.addEventListener("mouseleave", function() {
                ratingStars.forEach((star, index) => {
                    if (index < selectedRating) {
                        star.classList.remove("far");
                        star.classList.add("fas");
                    } else {
                        star.classList.remove("fas");
                        star.classList.add("far");
                    }
                });
            });
        }
    }
    
    // Review filters
    const ratingFilter = document.getElementById("rating-filter");
    const sortFilter = document.getElementById("sort-filter");
    const reviewItems = document.querySelectorAll(".review-item");
    
    if (ratingFilter && reviewItems.length > 0) {
        ratingFilter.addEventListener("change", filterReviews);
    }
    
    if (sortFilter && reviewItems.length > 0) {
        sortFilter.addEventListener("change", filterReviews);
    }
    
    function filterReviews() {
        // This is a simplified implementation - in a real application, 
        // you would likely fetch filtered reviews from the server
        const selectedRating = ratingFilter ? ratingFilter.value : "all";
        const selectedSort = sortFilter ? sortFilter.value : "newest";
        
        // Apply visual feedback for filters being active
        if (ratingFilter && ratingFilter.value !== "all") {
            ratingFilter.classList.add("active-filter");
        } else if (ratingFilter) {
            ratingFilter.classList.remove("active-filter");
        }
        
        if (sortFilter) {
            sortFilter.classList.add("active-filter");
        }
        
        // Show notification to indicate filtering is working
        showNotification("Reviews filtered. In a real application, this would fetch filtered reviews from the server.");
    }
    
    // Load more reviews button
    const loadMoreBtn = document.querySelector(".load-more-btn");
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", function() {
            // In a real application, this would load more reviews from the server
            loadMoreBtn.textContent = "Loading...";
            loadMoreBtn.disabled = true;
            
            setTimeout(() => {
                loadMoreBtn.textContent = "No More Reviews";
                showNotification("All reviews loaded.");
            }, 1000);
        });
    }
}

/**
 * Action Buttons
 * - Add to Cart
 * - Buy Now
 * - Add to Wishlist
 */
function initActionButtons() {
    const addToCartBtn = document.querySelector(".add-to-cart-btn");
    const buyNowBtn = document.querySelector(".buy-now-btn");
    const wishlistBtn = document.getElementById("addToWishlist");
    
    // Add to Cart
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", function() {
            const productData = getProductData();
            addToCart(productData);
            toggleCartSidebar(true);
        });
    }
    
    // Buy Now
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", function() {
            const productData = getProductData();
            addToCart(productData);
            // Redirect to checkout
            window.location.href = "checkout.html";
        });
    }
    
    // Wishlist
    if (wishlistBtn) {
        // Check if product is already in wishlist and update button state
        checkWishlistState();
        
        wishlistBtn.addEventListener("click", function() {
            const productData = getProductData();
            toggleWishlist(productData);
            
            // Toggle button appearance
            const icon = this.querySelector("i");
            if (icon) {
                icon.classList.toggle("far");
                icon.classList.toggle("fas");
            }
            
            this.classList.toggle("active");
        });
    }
    
    // Check if current product is in wishlist
    function checkWishlistState() {
        if (!wishlistBtn) return;
        
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const currentProductId = "TN-0001"; // Get this dynamically from the page
        
        const inWishlist = wishlist.some(item => item.id === currentProductId);
        
        if (inWishlist) {
            const icon = wishlistBtn.querySelector("i");
            if (icon) {
                icon.classList.remove("far");
                icon.classList.add("fas");
            }
            wishlistBtn.classList.add("active");
        }
    }
}

/**
 * Get current product data for cart/wishlist
 */
function getProductData() {
    const productName = document.querySelector(".product-info h1").textContent;
    
    // Get selected price
    const priceElement = document.querySelector(".current-price");
    const price = priceElement ? priceElement.textContent.replace(/[^\d]/g, "") : "0";
    
    // Get selected options
    const selectedColor = document.querySelector(".color-option.active");
    const colorName = selectedColor ? selectedColor.getAttribute("data-color") : "Default";
    
    const selectedStorage = document.querySelector(".storage-option.active");
    const storageName = selectedStorage ? selectedStorage.textContent.trim() : "Default";
    
    // Get selected quantity
    const quantityInput = document.getElementById("quantity");
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    // Get product image
    const mainImage = document.getElementById("main-product-image");
    const imageUrl = mainImage ? mainImage.src : "";
    
    return {
        id: "TN-0001", // This should be dynamic based on the product
        name: productName,
        price: price,
        color: colorName,
        storage: storageName,
        quantity: quantity,
        image: imageUrl
    };
}

/**
 * Add product to cart
 */
function addToCart(productData) {
    // Get existing cart or create new one
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if product already exists in cart with same options
    const existingIndex = cart.findIndex(item => 
        item.id === productData.id && 
        item.color === productData.color && 
        item.storage === productData.storage
    );
    
    if (existingIndex > -1) {
        // Update quantity if product already in cart
        cart[existingIndex].quantity += productData.quantity;
    } else {
        // Add new product to cart
        cart.push(productData);
    }
    
    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success notification
    showNotification(`${productData.name} added to cart!`);
}

/**
 * Toggle product in wishlist
 */
function toggleWishlist(productData) {
    // Get existing wishlist or create new one
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    // Check if product already exists in wishlist
    const existingIndex = wishlist.findIndex(item => 
        item.id === productData.id && 
        item.color === productData.color && 
        item.storage === productData.storage
    );
    
    if (existingIndex > -1) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        showNotification(`${productData.name} removed from wishlist!`);
    } else {
        // Add to wishlist
        wishlist.push(productData);
        showNotification(`${productData.name} added to wishlist!`);
    }
    
    // Save updated wishlist
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    
    // Update wishlist count
    updateWishlistCount();
}

/**
 * Update cart count badge
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll(".cart-count").forEach(badge => {
        badge.textContent = totalItems;
        
        // Add animation effect
        badge.classList.add("pulse");
        setTimeout(() => {
            badge.classList.remove("pulse");
        }, 500);
    });
}

/**
 * Update wishlist count badge
 */
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    document.querySelectorAll(".wishlist-count").forEach(badge => {
        badge.textContent = wishlist.length;
        
        // Add animation effect
        badge.classList.add("pulse");
        setTimeout(() => {
            badge.classList.remove("pulse");
        }, 500);
    });
}

/**
 * Toggle cart sidebar
 */
function toggleCartSidebar(show = true) {
    const cartSidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("overlay");
    
    if (!cartSidebar || !overlay) return;
    
    if (show) {
        cartSidebar.classList.add("active");
        overlay.classList.add("active");
        
        // Populate cart items
        populateCartItems();
    } else {
        cartSidebar.classList.remove("active");
        overlay.classList.remove("active");
    }
}

/**
 * Populate items in cart sidebar
 */
function populateCartItems() {
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartTotalElement = document.querySelector(".cart-total span:last-child");
    
    if (!cartItemsContainer || !cartTotalElement) return;
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Clear current content
    cartItemsContainer.innerHTML = "";
    
    if (cart.length === 0) {
        // Show empty cart message
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <p>Your cart is empty</p>
                <a href="products.html" class="btn secondary-btn">Start Shopping</a>
            </div>
        `;
        cartTotalElement.textContent = "৳0";
    } else {
        // Calculate total
        let total = 0;
        
        // Add each cart item
        cart.forEach((product, index) => {
            const itemTotal = product.price * product.quantity;
            total += itemTotal;
            
            // Create cart item element
            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";
            itemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${product.name}</h4>
                    <div class="cart-item-options">
                        <span>${product.color}</span>
                        <span>${product.storage}</span>
                    </div>
                    <div class="cart-item-quantity">
                        <div class="quantity-control">
                            <button class="cart-qty-btn minus" data-index="${index}">-</button>
                            <span>${product.quantity}</span>
                            <button class="cart-qty-btn plus" data-index="${index}">+</button>
                        </div>
                    </div>
                    <div class="cart-item-price">৳${parseInt(product.price).toLocaleString()}</div>
                </div>
                <button class="remove-item" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Update total price
        cartTotalElement.textContent = `৳${total.toLocaleString()}`;
        
        // Add event listeners to cart item controls
        addCartItemEventListeners();
    }
}

/**
 * Add event listeners to cart item controls
 */
function addCartItemEventListeners() {
    // Remove item buttons
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function() {
            const index = parseInt(this.getAttribute("data-index"));
            removeCartItem(index);
        });
    });
    
    // Quantity control buttons
    document.querySelectorAll(".cart-qty-btn").forEach(button => {
        button.addEventListener("click", function() {
            const index = parseInt(this.getAttribute("data-index"));
            const isDecrease = this.classList.contains("minus");
            updateCartItemQuantity(index, isDecrease);
        });
    });
}

/**
 * Remove item from cart
 */
function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Get product details before removing for notification
    const product = cart[index];
    
    // Remove item from cart
    cart.splice(index, 1);
    
    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    populateCartItems();
    
    // Show notification
    if (product) {
        showNotification(`${product.name} removed from cart!`);
    }
}

/**
 * Update cart item quantity
 */
function updateCartItemQuantity(index, decrease = false) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (index >= 0 && index < cart.length) {
        if (decrease) {
            // Decrease quantity
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                removeCartItem(index);
                return;
            }
        } else {
            // Increase quantity (max 10)
            if (cart[index].quantity < 10) {
                cart[index].quantity += 1;
            } else {
                showNotification("Maximum quantity reached");
                return;
            }
        }
        
        // Save updated cart
        localStorage.setItem("cart", JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        populateCartItems();
    }
}

/**
 * Show notification popup
 */
function showNotification(message, type = "success") {
    // Create notification container if it doesn't exist
    let notifContainer = document.querySelector(".notification-container");
    
    if (!notifContainer) {
        notifContainer = document.createElement("div");
        notifContainer.className = "notification-container";
        notifContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 2000;
        `;
        document.body.appendChild(notifContainer);
    }
    
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        background-color: ${type === "success" ? "#4361ee" : "#dc3545"};
        color: white;
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        transform: translateX(100%);
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s;
        max-width: 300px;
    `;
    
    // Add icon based on notification type
    const icon = type === "success" ? "check-circle" : "exclamation-circle";
    
    notification.innerHTML = `
        <i class="fas fa-${icon}" style="margin-right: 10px;"></i>
        <span>${message}</span>
    `;
    
    // Add to container
    notifContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.transform = "translateX(0)";
        notification.style.opacity = "1";
    }, 10);
    
    // Auto-remove after delay
    setTimeout(() => {
        notification.style.transform = "translateX(100%)";
        notification.style.opacity = "0";
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add custom styles for cart item quantity controls
function addCustomStyles() {
    const styleEl = document.createElement("style");
    styleEl.textContent = `
        .cart-item .quantity-control {
            display: flex;
            align-items: center;
            margin-top: 5px;
        }
        
        .cart-item .cart-qty-btn {
            width: 24px;
            height: 24px;
            border: 1px solid #ddd;
            background: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            cursor: pointer;
            border-radius: 3px;
        }
        
        .cart-item .cart-qty-btn:hover {
            background: #e9ecef;
        }
        
        .cart-item .quantity-control span {
            margin: 0 8px;
            font-size: 14px;
        }
        
        .pulse {
            animation: pulse-animation 0.5s;
        }
        
        @keyframes pulse-animation {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(styleEl);
}

// Initialize custom styles
document.addEventListener("DOMContentLoaded", function() {
    addCustomStyles();
});