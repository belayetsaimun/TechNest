document.addEventListener('DOMContentLoaded', function () {
    console.log('TechNest script Initializing...');

    // --- GLOBAL STATE & HELPERS ---
    const cartKey = typeof currentUserId !== 'undefined' && currentUserId ? `cart_${currentUserId}` : 'cart_guest';
    const wishlistKey = typeof currentUserId !== 'undefined' && currentUserId ? `wishlist_${currentUserId}` : 'wishlist_guest';

    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    let wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
    const getElement = (selector) => document.querySelector(selector);
    const getElements = (selector) => document.querySelectorAll(selector);

    // Make cart and wishlist available globally for other scripts
    window.cart = cart;
    window.wishlist = wishlist;
    window.saveCart = saveCart;
    window.saveWishlist = saveWishlist;

    // --- INITIALIZATION ---
    function init() {
        initGlobalEventListeners();
        updateAllUI();
        
        // --- PAGE-SPECIFIC INITIALIZERS ---
        if (getElement('#countdown')) initCountdown();
        if (getElement('#testimonialCarousel')) initTestimonialCarousel();
        if (getElement('#authContainer')) initAuthSlider();
        initTheme();
    }
    
    function updateAllUI() {
        updateCartCount();
        updateWishlistCount();
        updateWishlistIcons();
        updateCartUI();
        updateWishlistUI();
    }

    // --- EVENT LISTENERS (Delegation Pattern) ---
    function initGlobalEventListeners() {
        // Account Dropdown Toggle
        const accountToggle = getElement('.account-dropdown-toggle');
        if (accountToggle) {
            accountToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                getElement('#accountDropdown').classList.toggle('active');
            });
        }
        
        document.addEventListener('click', (e) => {
            const dropdown = getElement('#accountDropdown');
            if (dropdown && !dropdown.contains(e.target) && !e.target.closest('.account-dropdown-toggle')) {
                dropdown.classList.remove('active');
            }
        });

        // Main click delegation
        document.body.addEventListener('click', function (e) {
            const target = e.target;
            
            // --- CART SIDEBAR ACTIONS ---
            if (target.closest('.cart-items')) {
                if (target.closest('.quantity-btn')) handleCartQuantityChange(target.closest('.quantity-btn'));
                else if (target.closest('.remove-item')) handleCartRemoveItem(target.closest('.remove-item'));
                return;
            }
            
            // --- WISHLIST SIDEBAR ACTIONS ---
            if (target.closest('.wishlist-items')) {
                if (target.closest('.move-to-cart')) handleWishlistMoveToCart(target.closest('.move-to-cart'));
                else if (target.closest('.remove-from-wishlist')) handleWishlistRemove(target.closest('.remove-from-wishlist'));
                return;
            }
            
            // --- PRODUCT CARD ACTIONS ---
            const productCard = target.closest('.product-card, .deal-card');
            if (productCard) {
                if (target.closest('.quick-view')) { 
                    e.preventDefault(); 
                    openQuickView(productCard); 
                } 
                else if (target.closest('.add-to-cart')) { 
                    e.preventDefault(); 
                    addItemToCart(getProductDataFromCard(productCard)); 
                } 
                else if (target.closest('.add-to-wishlist')) { 
                    e.preventDefault(); 
                    toggleWishlistItem(getProductDataFromCard(productCard)); 
                }
            }
            
            // --- MODAL ACTIONS ---
            const modal = target.closest('#quickViewModal');
            if (modal) {
                if (target.closest('.add-to-cart-btn')) handleModalAddToCart(modal);
                if (target.closest('.buy-now-btn')) handleModalBuyNow(modal);
                if (target.closest('.wishlist-btn')) handleModalToggleWishlist(modal);
                if (target.closest('.quantity-btn')) handleModalQuantityChange(target);
                if (target.closest('.color-option')) handleModalColorChange(target, modal);
            }
            
            // --- NAVIGATION/SIDEBAR TOGGLES ---
            if (target.closest('#menuIcon')) toggleSidebar(getElement('#navLinks'), true);
            if (target.closest('#cartBtn')) { 
                e.preventDefault(); 
                toggleSidebar(getElement('#cartSidebar'), true); 
                updateCartUI(); 
            }
            if (target.closest('#wishlistBtn')) { 
                e.preventDefault(); 
                toggleSidebar(getElement('#wishlistSidebar'), true); 
                updateWishlistUI(); 
            }
            
            // --- CLOSE BUTTONS ---
            if (target.matches('.close-cart, .close-wishlist, .close-modal, .continue-shopping') || 
                target.closest('.close-cart, .close-wishlist, .close-modal')) {
                const sidebar = target.closest('.cart-sidebar, .wishlist-sidebar, #navLinks');
                const modalToClose = target.closest('.modal');
                if (sidebar) toggleSidebar(sidebar, false);
                if (modalToClose) hideModal(modalToClose);
            }
            
            // --- OVERLAY CLICK ---
            if (target.matches('#overlay')) {
                getElements('.cart-sidebar, .wishlist-sidebar, #navLinks').forEach(el => toggleSidebar(el, false));
                getElements('.modal.modal-open').forEach(hideModal);
            }
        });
    }

    // --- AUTH SLIDER ---
    function initAuthSlider() {
        const signUpButton = getElement('#signUp');
        const signInButton = getElement('#signIn');
        const container = getElement('#authContainer');

        if(signUpButton) {
            signUpButton.addEventListener('click', () => {
                container.classList.add("right-panel-active");
            });
        }

        if(signInButton) {
            signInButton.addEventListener('click', () => {
                container.classList.remove("right-panel-active");
            });
        }
    }

    // --- QUICK VIEW MODAL ---
    function openQuickView(card){
        const product = getProductDataFromCard(card);
        const modal = getElement('#quickViewModal');
        if(!modal) return;
        
        modal.dataset.product = JSON.stringify(product);
        modal.querySelector('h2').textContent = product.name;
        modal.querySelector('.product-category').textContent = product.category.toUpperCase();
        modal.querySelector('.current-price').textContent = `৳${product.price.toLocaleString()}`;
        modal.querySelector('.main-product-image').src = product.image;
        modal.querySelector('.main-product-image').alt = product.name;
        modal.querySelector('.product-rating').innerHTML = card.querySelector('.product-rating')?.innerHTML || '<span>No reviews yet</span>';
        modal.querySelector('.product-description p').textContent = getProductDescription(product.name);
        modal.querySelector('.specs-grid').innerHTML = getProductSpecificationsHTML(product.name);
        
        const colorOptionsContainer = modal.querySelector('.color-options');
        const colorSection = modal.querySelector('.product-colors');
        if(product.colors && product.colors.length > 0 && product.colors[0]){
            colorOptionsContainer.innerHTML = generateColorOptionsHTML(product.colors);
            colorSection.style.display = 'block';
        } else {
            colorSection.style.display = 'none';
        }
        
        modal.querySelector('.quantity-selector input').value = 1;
        showModal(modal);
    }
    
    function getProductDataFromCard(card){
        const data = card.dataset;
        return {
            id: data.id,
            name: data.name,
            price: parseFloat(data.price),
            image: data.image,
            category: data.category || 'Tech',
            brand: data.brand || 'TechNest',
            colors: data.colors ? data.colors.split(',') : [],
            quantity: 1
        };
    }
    
    function generateColorOptionsHTML(colors){
        if(!colors) return '';
        return colors.map((color,index) => 
            `<span class="color-option ${color.toLowerCase()}" data-color="${color}" title="${color}" 
            style="background-color:${color};${'white'===color.toLowerCase()?'border: 1px solid #ddd;':''}"></span>`
        ).join('');
    }
    
    // --- Modal Color Change Logic ---
    function handleModalColorChange(target, modal) {
        // Visually mark the new color as active
        modal.querySelector('.color-options .active')?.classList.remove('active');
        target.classList.add('active');
        
        const selectedColor = target.dataset.color.toLowerCase();
        
        // Get the product data stored in the modal
        const product = JSON.parse(modal.dataset.product);
        const originalImagePath = product.image;

        // --- Logic to build the new image path ---
        const pathParts = originalImagePath.split('/');
        let filename = pathParts.pop();
        const basePath = pathParts.join('/') + '/';
        
        // Remove any existing color suffix (W, B, BL) from the filename to get a clean base
        filename = filename.replace(/[WBL]{1,2}\.(png|jpg|webp)$/, '.$1');

        let colorSuffix = '';
        if (selectedColor === 'white') colorSuffix = 'W';
        else if (selectedColor === 'black') colorSuffix = 'B';
        else if (selectedColor === 'blue') colorSuffix = 'BL';
        
        // Add the new suffix before the file extension
        const newImageName = filename.replace(/(\.png|\.jpg|\.webp)$/, `${colorSuffix}$1`);
        const newImagePath = basePath + newImageName;
        
        // Update the main image source
        modal.querySelector('.main-product-image').src = newImagePath;
        
        // Update the product data stored in the modal's dataset
        product.image = newImagePath;
        modal.dataset.product = JSON.stringify(product);

        console.log(`Color changed to: ${selectedColor}. New image path: ${newImagePath}`);
    }
    
    function handleModalAddToCart(modal){
        const product = JSON.parse(modal.dataset.product);
        product.quantity = parseInt(modal.querySelector(".quantity-selector input").value);
        addItemToCart(product);
        hideModal(modal);
    }
    
    function handleModalBuyNow(modal){
        const product = JSON.parse(modal.dataset.product);
        product.quantity = parseInt(modal.querySelector(".quantity-selector input").value);
        cart = [product];
        saveCart();
        window.location.href = "checkout.php";
    }
    
    function handleModalToggleWishlist(modal){
        const product = JSON.parse(modal.dataset.product);
        toggleWishlistItem(product, modal.querySelector(".wishlist-btn"));
    }
    
    function handleModalQuantityChange(button){
        const input = button.parentElement.querySelector("input");
        let val = parseInt(input.value);
        if(button.classList.contains("plus") && val < 10) input.value = val + 1;
        else if(button.classList.contains("minus") && val > 1) input.value = val - 1;
    }
    
    function getProductDescription(name){
        const lowerName = name.toLowerCase();
        const descs = {
            "iphone 16 pro max": `Experience the next level of smartphone technology. Featuring a stunning Super Retina XDR display, advanced 48MP camera system, and the powerful A17 Pro chip for lightning-fast performance.`,
            "samsung galaxy s24 ultra": `The revolutionary ${name} pushes the boundaries of mobile technology with its pro-grade 200MP camera, intelligent S Pen, and stunning Dynamic AMOLED 2X display.`,
            "airpods pro": `Immerse yourself in exceptional audio with Active Noise Cancellation and Spatial Audio. The ${name} deliver a comfortable fit and seamless integration with your Apple devices.`,
            "sony wh-1000xm5 headphones": "Industry-leading noise canceling headphones with a new design and exceptional sound quality for a truly immersive listening experience. Enjoy up to 30 hours of battery life.",
            "macbook pro": `Supercharged by the M3 Pro chip, the ${name} delivers game-changing performance for pro workflows. It features a brilliant Liquid Retina XDR display and all-day battery life.`,
            "dell xps 13 plus": "A sleek, minimalist laptop with a stunning 4K OLED display and powerful performance for creators on the go. Precision-crafted with premium materials.",
            "ipad pro 12.9-inch m2": "The ultimate iPad experience with the powerful M2 chip, a stunning Liquid Retina XDR display, and pro apps. Perfect for work, creativity, and entertainment.",
            "apple watch ultra 2": "The most rugged and capable Apple Watch ever. Designed for endurance athletes and outdoor adventurers, it features a bright display, long battery life, and advanced health features."
        };
        
        for(const key in descs){
            if(lowerName.includes(key)) return descs[key];
        }
        
        return `The ${name} offers premium quality, exceptional performance, and innovative features. Experience the perfect blend of technology and design with this premium product from TechNest.`;
    }
    
    function getProductSpecificationsHTML(name){
        const lowerName = name.toLowerCase();
        let specs = {};
        
        if(lowerName.includes("iphone")) 
            specs = {processor: "A17 Pro", storage: "256GB", display: '6.7" Super Retina XDR', camera: "48MP Triple"};
        else if(lowerName.includes("samsung")) 
            specs = {processor: "Snapdragon 8 Gen 3", storage: "256GB", display: '6.8" Dynamic AMOLED', camera: "200MP Quad"};
        else if(lowerName.includes("airpods")) 
            specs = {chip: "H2 Chip", connectivity: "Bluetooth 5.3", feature: "Active Noise Cancellation", battery: "6 Hours"};
        else if(lowerName.includes("sony")) 
            specs = {driver: "30mm Dynamic", connectivity: "Bluetooth 5.2", feature: "Industry-Leading ANC", battery: "30 Hours"};
        else if(lowerName.includes("macbook")) 
            specs = {processor: "M3 Pro Chip", memory: "16GB Unified RAM", display: '16" Liquid Retina XDR', storage: "512GB SSD"};
        else if(lowerName.includes("dell")) 
            specs = {processor: "Intel Core i7", memory: "16GB DDR5", display: '15.6" 4K OLED', storage: "512GB SSD"};
        else if(lowerName.includes("ipad")) 
            specs = {processor: "Apple M2", storage: "128GB", display: '12.9" Retina XDR', feature: "Pencil Hover"};
        else if(lowerName.includes("watch")) 
            specs = {display: "Always-On Retina", feature: "Double Tap Gesture", water_resistance: "100m", battery: "36 Hours"};
        else 
            specs = {quality: "Premium Build", warranty: "2-Year Warranty"};
        
        let html = "";
        for(const[key,value] of Object.entries(specs)){
            const icon = getSpecIconClass(key);
            html += `<div class="spec-item">
                        <div class="spec-icon"><i class="fas ${icon}"></i></div>
                        <div class="spec-details">
                            <span class="spec-title">${key.replace("_"," ")}</span>
                            <span class="spec-value">${value}</span>
                        </div>
                    </div>`;
        }
        
        return html;
    }
    
    function getSpecIconClass(key){
        const map = {
            processor: "fa-microchip",
            storage: "fa-hdd",
            display: "fa-mobile-alt",
            camera: "fa-camera",
            battery: "fa-battery-full",
            quality: "fa-medal",
            warranty: "fa-shield-alt",
            chip: "fa-microchip",
            connectivity: "fa-wifi",
            feature: "fa-star",
            memory: "fa-memory",
            water_resistance: "fa-tint",
            driver: "fa-headphones"
        };
        
        return map[key] || "fa-info-circle";
    }

    // --- THEME MANAGEMENT ---
    function initTheme() {
        const themeToggle = getElement("#themeToggle");
        if (themeToggle) {
            const savedTheme = localStorage.getItem("technest-theme") || 
                                (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
            
            setTheme(savedTheme);
            
            themeToggle.addEventListener("click", () => {
                const newTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
                setTheme(newTheme);
                localStorage.setItem("technest-theme", newTheme);
            });
        }
    }
    
    function setTheme(theme) {
        const icon = getElement("#themeToggle i");
        const tooltip = getElement("#themeToggle .toggle-tooltip");
        
        if (theme === "dark") {
            document.body.classList.add("dark-mode");
            if (icon) icon.className = "fas fa-sun";
            if (tooltip) tooltip.textContent = "Switch to Light Mode";
        } else {
            document.body.classList.remove("dark-mode");
            if (icon) icon.className = "fas fa-moon";
            if (tooltip) tooltip.textContent = "Switch to Dark Mode";
        }
    }

    // --- CART FUNCTIONS ---
    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        getElements(".cart-count").forEach(el => {
            el.textContent = count;
            el.classList.add("pulse");
            setTimeout(() => el.classList.remove("pulse"), 500);
        });
    }
    
    function addItemToCart(product) {
        const item = cart.find(i => i.id === product.id);
        if (item) {
            item.quantity += product.quantity || 1;
        } else {
            cart.push({...product, quantity: product.quantity || 1});
        }
        showNotification(`${product.name} was added to your cart.`, "success");
        saveCart();
        
        // CRITICAL FIX: Show cart sidebar immediately after adding item
        toggleSidebar(getElement('#cartSidebar'), true);
    }
    
    function updateCartUI() {
        const container = getElement(".cart-items");
        if (!container) return;
        
        if (cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon"><i class="fas fa-shopping-cart"></i></div>
                    <p>Your cart is empty</p>
                    <a href="products.php" class="btn secondary-btn">Start Shopping</a>
                </div>`;
        } else {
            container.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">৳${(item.price * item.quantity).toLocaleString()}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}"><i class="fas fa-minus"></i></button>
                            <input type="number" value="${item.quantity}" min="1" readonly>
                            <button class="quantity-btn plus" data-id="${item.id}"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>`).join("");
        }
        
        updateCartTotal();
    }
    
    function updateCartTotal() {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 150;
        const total = subtotal + shipping;
        
        getElement(".cart-subtotal").textContent = `৳${subtotal.toLocaleString()}`;
        getElement(".cart-shipping").textContent = shipping === 0 ? "Free" : `৳${shipping}`;
        getElement(".cart-total").textContent = `৳${total.toLocaleString()}`;
    }
    
    function handleCartQuantityChange(button) {
        const cartItemDiv = button.closest('.cart-item');
        if (!cartItemDiv) return;
        
        const id = cartItemDiv.dataset.id;
        const isPlus = button.classList.contains('plus');
        const itemIndex = cart.findIndex(item => item.id === id);

        if (itemIndex > -1) {
            if (isPlus && cart[itemIndex].quantity < 10) {
                cart[itemIndex].quantity++;
            } else if (!isPlus && cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity--;
            }
            saveCart();
        }
    }

    function handleCartRemoveItem(button) {
        const cartItemDiv = button.closest('.cart-item');
        if (!cartItemDiv) return;
        
        const id = cartItemDiv.dataset.id;
        cart = cart.filter(item => item.id !== id);
        saveCart();
    }
    
    function saveCart() {
        localStorage.setItem(cartKey, JSON.stringify(cart));
        // Update the global window.cart reference
        window.cart = cart;
        updateCartCount();
        updateCartUI();
    }

    // --- WISHLIST FUNCTIONS ---
    function updateWishlistCount() {
        getElements(".wishlist-count").forEach(el => el.textContent = wishlist.length);
    }
    
    function toggleWishlistItem(product, buttonElement) {
        const index = wishlist.findIndex(item => item.id === product.id);
        
        if (index > -1) {
            wishlist.splice(index, 1);
            showNotification(`${product.name} removed from wishlist.`, "info");
        } else {
            wishlist.push(product);
            showNotification(`${product.name} added to wishlist!`, "success");
            
            // CRITICAL FIX: Show wishlist sidebar ONLY when adding items (not removing)
            toggleSidebar(getElement('#wishlistSidebar'), true);
        }
        
        if (buttonElement && buttonElement.querySelector("i")) {
            buttonElement.querySelector("i").className = index > -1 ? "far fa-heart" : "fas fa-heart";
        }
        
        saveWishlist();
    }
    
    function updateWishlistUI() {
        const container = getElement(".wishlist-items");
        if (!container) return;
        
        if (wishlist.length === 0) {
            container.innerHTML = `
                <div class="empty-wishlist">
                    <div class="empty-wishlist-icon"><i class="fas fa-heart"></i></div>
                    <p>Your wishlist is empty</p>
                    <a href="products.php" class="btn secondary-btn">Discover Products</a>
                </div>`;
        } else {
            container.innerHTML = wishlist.map(item => `
                <div class="wishlist-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="wishlist-item-info">
                        <h4>${item.name}</h4>
                        <p class="wishlist-item-price">৳${item.price.toLocaleString()}</p>
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="move-to-cart" data-id="${item.id}" title="Add to Cart">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="remove-from-wishlist" data-id="${item.id}" title="Remove">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>`).join("");
        }
    }
    
    function handleWishlistMoveToCart(button) {
        const wishlistItemDiv = button.closest('.wishlist-item');
        if (!wishlistItemDiv) return;
        
        const id = wishlistItemDiv.dataset.id;
        const itemToMove = wishlist.find(item => item.id === id);
        
        if (itemToMove) {
            addItemToCart({ ...itemToMove, quantity: 1 });
            wishlist = wishlist.filter(item => item.id !== id);
            saveWishlist();
        }
    }

    function handleWishlistRemove(button) {
        const wishlistItemDiv = button.closest('.wishlist-item');
        if (!wishlistItemDiv) return;
        
        const id = wishlistItemDiv.dataset.id;
        wishlist = wishlist.filter(item => item.id !== id);
        saveWishlist();
    }
    
    function saveWishlist() {
        localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
        // Update the global window.wishlist reference
        window.wishlist = wishlist;
        updateWishlistCount();
        updateWishlistUI();
        updateWishlistIcons();
    }
    
    function updateWishlistIcons() {
        const ids = wishlist.map(item => item.id);
        getElements(".add-to-wishlist").forEach(button => {
            const productCard = button.closest('.product-card, .deal-card');
            const icon = button.querySelector("i");
            
            if (productCard && icon) {
                icon.className = ids.includes(productCard.dataset.id) ? "fas fa-heart" : "far fa-heart";
            }
        });
    }

    // --- UI HELPERS ---
    function toggleSidebar(sidebar, show) {
        if (!sidebar) return;
        
        const overlay = getElement("#overlay");
        const position = sidebar.id === "navLinks" ? "-300px" : "-400px";
        
        sidebar.style.right = show ? "0" : position;
        if (overlay) overlay.style.display = show ? "block" : "none";
    }
    
    // Make toggleSidebar function available globally
    window.toggleSidebar = toggleSidebar;
    
    function showModal(modal) {
        if (!modal) return;
        
        const overlay = getElement("#overlay");
        modal.style.display = "block";
        if (overlay) overlay.style.display = "block";
        document.body.classList.add("modal-is-open");
        
        setTimeout(() => modal.classList.add("modal-open"), 10);
    }
    
    function hideModal(modal) {
        if (!modal) return;
        
        const overlay = getElement("#overlay");
        modal.classList.remove("modal-open");
        document.body.classList.remove("modal-is-open");
        
        setTimeout(() => {
            modal.style.display = "none";
            if (!getElement(".modal.modal-open") && overlay) {
                overlay.style.display = "none";
            }
        }, 300);
    }
    
    function showNotification(message, type = "info") {
        const container = getElement("#notificationContainer");
        if (!container) return;
        
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        
        const iconClass = type === "success" ? "fa-check-circle" : 
                          type === "error" ? "fa-exclamation-circle" : "fa-info-circle";
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${iconClass}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        container.appendChild(notification);
        
        notification.querySelector(".notification-close").addEventListener("click", () => notification.remove());
        
        setTimeout(() => notification.remove(), 4000);
    }
    
    // Make notification function available globally
    window.showNotification = showNotification;

    // --- SPECIAL FEATURES ---
    function initCountdown() {
        const countdownEl = getElement("#countdown");
        if (!countdownEl) return;
        
        const daysEl = getElement("#days");
        const hoursEl = getElement("#hours");
        const minutesEl = getElement("#minutes");
        const secondsEl = getElement("#seconds");
        
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
        
        const deadline = new Date().getTime() + 6048e5; // 7 days in milliseconds
        
        const interval = setInterval(() => {
            const remaining = deadline - new Date().getTime();
            
            if (remaining < 0) {
                clearInterval(interval);
                countdownEl.innerHTML = "<h4>Deal Expired</h4>";
                return;
            }
            
            daysEl.textContent = Math.floor(remaining / 864e5).toString().padStart(2, "0");
            hoursEl.textContent = Math.floor(remaining % 864e5 / 36e5).toString().padStart(2, "0");
            minutesEl.textContent = Math.floor(remaining % 36e5 / 6e4).toString().padStart(2, "0");
            secondsEl.textContent = Math.floor(remaining % 6e4 / 1e3).toString().padStart(2, "0");
        }, 1000);
    }
    
    function initTestimonialCarousel() {
        const carousel = getElement("#testimonialCarousel");
        const dots = getElements(".testimonial-dots .dot");
        
        if (!carousel || dots.length === 0) return;
        
        let currentSlide = 0;
        const slideCount = dots.length;
        
        function goToSlide(index) {
            currentSlide = index;
            const offset = index * (-100 / slideCount);
            carousel.style.transform = `translateX(${offset}%)`;
            
            getElements(".testimonial-dots .dot").forEach((dot, i) => {
                dot.classList.toggle("active", i === index);
            });
        }
        
        dots.forEach(dot => {
            dot.addEventListener("click", e => {
                goToSlide(parseInt(e.currentTarget.dataset.slide));
            });
        });
        
        // Auto-advance every 5 seconds
        setInterval(() => {
            goToSlide((currentSlide + 1) % slideCount);
        }, 5000);
    }

    // --- START THE APPLICATION ---
    init();

    // --- EXPOSE KEY FUNCTIONS GLOBALLY ---
    window.updateCartUI = updateCartUI;
    window.updateWishlistUI = updateWishlistUI;
    window.addItemToCart = addItemToCart;
    window.toggleWishlistItem = toggleWishlistItem;
});