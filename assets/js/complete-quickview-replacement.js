(function() {
    // Global references
    const cartKey = typeof currentUserId !== 'undefined' && currentUserId ? 
        `cart_${currentUserId}` : 'cart_guest';
    const wishlistKey = typeof currentUserId !== 'undefined' && currentUserId ? 
        `wishlist_${currentUserId}` : 'wishlist_guest';
    
    // Expose addToCart globally
    window.addToCart = function(product, quantity) {
        addToCartImpl(product, quantity);
    };
    
    // Track notifications globally
    window.activeNotifications = window.activeNotifications || [];

    // Execute when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
    
    function init() {
        console.log("QuickView Replacement: Initializing");
        
        // Step 1: Create our own quick view modal from scratch
        createNewQuickViewModal();
        
        // Step 2: Replace all quick view buttons with our implementation
        setupQuickViewButtons();
        
        // Step 3: Watch for dynamically added content
        observeDynamicContent();
        
        console.log("QuickView Replacement: Setup complete");
    }
    
    function createNewQuickViewModal() {
        // Remove any existing modal with the same ID to avoid conflicts
        const existingModal = document.getElementById("newQuickViewModal");
        if (existingModal) {
            existingModal.parentNode.removeChild(existingModal);
        }
        
        // Create a new modal with a different ID
        const modal = document.createElement("div");
        modal.id = "newQuickViewModal";
        modal.className = "new-quick-view-modal";
        modal.style.cssText = `
            display: none;
            position: fixed !important;
            z-index: 999999 !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: auto !important;
            background-color: rgba(0,0,0,0.7) !important;
            opacity: 1 !important;
            visibility: visible !important;
        `;
        
        // Create modal content
        const modalContent = document.createElement("div");
        modalContent.className = "new-modal-content";
        modalContent.style.cssText = `
            background-color: #fff !important;
            margin: 5% auto !important;
            padding: 20px !important;
            width: 90% !important;
            max-width: 1000px !important;
            border-radius: 10px !important;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
            position: relative !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
        `;
        
        // Add close button
        const closeBtn = document.createElement("span");
        closeBtn.innerHTML = "&times;";
        closeBtn.className = "new-close-modal";
        closeBtn.style.cssText = `
            position: absolute !important;
            right: 20px !important;
            top: 15px !important;
            font-size: 28px !important;
            font-weight: bold !important;
            color: #333 !important;
            cursor: pointer !important;
            z-index: 10 !important;
            width: 30px !important;
            height: 30px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 50% !important;
            background-color: rgba(0,0,0,0.05) !important;
        `;
        
        // Create product container
        const productContainer = document.createElement("div");
        productContainer.className = "product-quick-view";
        productContainer.style.cssText = `
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 30px !important;
            width: 100% !important;
        `;
        
        // Create left column (image)
        const leftColumn = document.createElement("div");
        leftColumn.className = "product-image-column";
        leftColumn.style.cssText = `
            flex: 1 1 400px !important;
            min-width: 300px !important;
        `;
        
        // Add image container
        const imageContainer = document.createElement("div");
        imageContainer.style.cssText = `
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 300px !important;
            margin-bottom: 20px !important;
            border-radius: 8px !important;
            background-color: #f9f9f9 !important;
        `;
        
        const productImage = document.createElement("img");
        productImage.id = "newModalProductImage";
        productImage.alt = "Product Image";
        productImage.style.cssText = `
            max-height: 280px !important;
            max-width: 100% !important;
            object-fit: contain !important;
        `;
        imageContainer.appendChild(productImage);
        leftColumn.appendChild(imageContainer);
        
        // Create colors section
        const colorsSection = document.createElement("div");
        colorsSection.className = "product-colors";
        colorsSection.style.cssText = `
            margin-top: 20px !important;
        `;
        
        const colorsTitle = document.createElement("h4");
        colorsTitle.textContent = "Select Color:";
        colorsTitle.style.cssText = `
            font-size: 16px !important;
            margin-bottom: 10px !important;
            font-weight: 600 !important;
        `;
        
        const colorOptions = document.createElement("div");
        colorOptions.className = "color-options";
        colorOptions.id = "newModalColorOptions";
        colorOptions.style.cssText = `
            display: flex !important;
            gap: 10px !important;
        `;
        
        colorsSection.appendChild(colorsTitle);
        colorsSection.appendChild(colorOptions);
        leftColumn.appendChild(colorsSection);
        
        // Create right column (info)
        const rightColumn = document.createElement("div");
        rightColumn.className = "product-info-column";
        rightColumn.style.cssText = `
            flex: 1 1 400px !important;
            min-width: 300px !important;
            max-height: 600px !important;
            overflow-y: auto !important;
        `;
        
        // Add product details
        const categoryEl = document.createElement("div");
        categoryEl.id = "newModalCategory";
        categoryEl.style.cssText = `
            font-size: 14px !important;
            color: #0052cc !important;
            text-transform: uppercase !important;
            margin-bottom: 5px !important;
            font-weight: 500 !important;
        `;
        
        const nameEl = document.createElement("h2");
        nameEl.id = "newModalName";
        nameEl.style.cssText = `
            font-size: 24px !important;
            margin-bottom: 15px !important;
            font-weight: 600 !important;
        `;
        
        const priceContainer = document.createElement("div");
        priceContainer.style.cssText = `
            display: flex !important;
            align-items: center !important;
            margin-bottom: 20px !important;
        `;
        
        const priceEl = document.createElement("span");
        priceEl.id = "newModalPrice";
        priceEl.style.cssText = `
            font-size: 24px !important;
            font-weight: 700 !important;
            color: #0052cc !important;
        `;
        
        priceContainer.appendChild(priceEl);
        
        const descEl = document.createElement("div");
        descEl.style.cssText = `
            margin-bottom: 25px !important;
            line-height: 1.6 !important;
            border-bottom: 1px solid #eaeaea !important;
            padding-bottom: 20px !important;
        `;
        
        const descText = document.createElement("p");
        descText.id = "newModalDescription";
        descText.style.cssText = `
            color: #666 !important;
        `;
        descEl.appendChild(descText);
        
        // Add Tech Specifications Section with improved styling
        const techSpecsContainer = document.createElement("div");
        techSpecsContainer.className = "tech-specifications";
        techSpecsContainer.style.cssText = `
            margin-bottom: 25px !important;
            padding-top: 5px !important;
        `;
        
        const techSpecsTitle = document.createElement("h3");
        techSpecsTitle.textContent = "Tech Specifications";
        techSpecsTitle.style.cssText = `
            font-size: 18px !important;
            margin-bottom: 15px !important;
            font-weight: 600 !important;
            color: #333 !important;
            position: relative !important;
            padding-left: 15px !important;
            border-left: 4px solid #0052cc !important;
        `;
        
        const techSpecsGrid = document.createElement("div");
        techSpecsGrid.className = "specs-grid";
        techSpecsGrid.id = "newModalSpecsGrid";
        techSpecsGrid.style.cssText = `
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 15px !important;
        `;
        
        techSpecsContainer.appendChild(techSpecsTitle);
        techSpecsContainer.appendChild(techSpecsGrid);
        
        // Add quantity selector
        const quantityContainer = document.createElement("div");
        quantityContainer.style.cssText = `
            margin-bottom: 25px !important;
            border-top: 1px solid #eaeaea !important;
            padding-top: 20px !important;
        `;
        
        const quantityLabel = document.createElement("h4");
        quantityLabel.textContent = "Quantity:";
        quantityLabel.style.cssText = `
            font-size: 16px !important;
            margin-bottom: 10px !important;
            font-weight: 600 !important;
        `;
        
        const quantitySelector = document.createElement("div");
        quantitySelector.className = "quantity-selector";
        quantitySelector.style.cssText = `
            display: flex !important;
            align-items: center !important;
            max-width: 150px !important;
        `;
        
        const minusBtn = document.createElement("button");
        minusBtn.className = "quantity-btn minus";
        minusBtn.innerHTML = "-";
        minusBtn.style.cssText = `
            width: 35px !important;
            height: 35px !important;
            background-color: #f0f0f0 !important;
            border: 1px solid #ddd !important;
            cursor: pointer !important;
            font-size: 18px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 4px !important;
        `;
        
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = "1";
        quantityInput.min = "1";
        quantityInput.max = "10";
        quantityInput.id = "newModalQuantity";
        quantityInput.style.cssText = `
            width: 50px !important;
            height: 35px !important;
            text-align: center !important;
            border: 1px solid #ddd !important;
            margin: 0 5px !important;
            font-size: 14px !important;
        `;
        
        const plusBtn = document.createElement("button");
        plusBtn.className = "quantity-btn plus";
        plusBtn.innerHTML = "+";
        plusBtn.style.cssText = `
            width: 35px !important;
            height: 35px !important;
            background-color: #f0f0f0 !important;
            border: 1px solid #ddd !important;
            cursor: pointer !important;
            font-size: 18px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 4px !important;
        `;
        
        quantitySelector.appendChild(minusBtn);
        quantitySelector.appendChild(quantityInput);
        quantitySelector.appendChild(plusBtn);
        quantityContainer.appendChild(quantityLabel);
        quantityContainer.appendChild(quantitySelector);
        
        // Add action buttons
        const actionsContainer = document.createElement("div");
        actionsContainer.style.cssText = `
            display: flex !important;
            gap: 10px !important;
            margin-top: 20px !important;
        `;
        
        const addToCartBtn = document.createElement("button");
        addToCartBtn.id = "newModalAddToCart";
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        addToCartBtn.style.cssText = `
            padding: 12px 24px !important;
            background-color: #0052cc !important;
            color: white !important;
            border: none !important;
            border-radius: 5px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            flex-grow: 2 !important;
            font-size: 15px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
        `;
        
        const buyNowBtn = document.createElement("button");
        buyNowBtn.id = "newModalBuyNow";
        buyNowBtn.innerHTML = 'Buy Now';
        buyNowBtn.style.cssText = `
            padding: 12px 24px !important;
            background-color: transparent !important;
            color: #0052cc !important;
            border: 2px solid #0052cc !important;
            border-radius: 5px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            flex-grow: 1 !important;
            font-size: 15px !important;
        `;
        
        actionsContainer.appendChild(addToCartBtn);
        actionsContainer.appendChild(buyNowBtn);
        
        // Assemble right column
        rightColumn.appendChild(categoryEl);
        rightColumn.appendChild(nameEl);
        rightColumn.appendChild(priceContainer);
        rightColumn.appendChild(descEl);
        rightColumn.appendChild(techSpecsContainer); 
        rightColumn.appendChild(quantityContainer);
        rightColumn.appendChild(actionsContainer);
        
        // Assemble the modal
        productContainer.appendChild(leftColumn);
        productContainer.appendChild(rightColumn);
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(productContainer);
        modal.appendChild(modalContent);
        
        // Add the modal to the document
        document.body.appendChild(modal);
        
        // Add event listeners
        closeBtn.addEventListener("click", function() {
            modal.style.display = "none";
        });
        
        window.addEventListener("click", function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
        
        minusBtn.addEventListener("click", function() {
            const currentVal = parseInt(quantityInput.value);
            if (currentVal > 1) {
                quantityInput.value = currentVal - 1;
            }
        });
        
        plusBtn.addEventListener("click", function() {
            const currentVal = parseInt(quantityInput.value);
            if (currentVal < 10) {
                quantityInput.value = currentVal + 1;
            }
        });
        
        // CRITICAL FIX: Add to cart button now integrates with script.js
        addToCartBtn.addEventListener("click", function() {
            const product = JSON.parse(modal.dataset.productData || "{}");
            const quantity = parseInt(quantityInput.value) || 1;
            
            console.log("Add to cart button clicked in quick view modal");
            addToCartImpl(product, quantity);
            
            // Hide modal after adding to cart
            modal.style.display = "none";
        });
        
        buyNowBtn.addEventListener("click", function() {
            const product = JSON.parse(modal.dataset.productData || "{}");
            const quantity = parseInt(quantityInput.value) || 1;
            
            buyNow(product, quantity);
        });
        
        console.log("QuickView Replacement: New modal created");
        return modal;
    }
    
    function setupQuickViewButtons() {
        // Find all quick view buttons
        const quickViewButtons = document.querySelectorAll('.quick-view, .quick-view-btn');
        console.log(`QuickView Replacement: Found ${quickViewButtons.length} quick view buttons`);
        
        quickViewButtons.forEach(button => {
            // Clone the button to remove any existing event listeners
            const newButton = button.cloneNode(true);
            
            // Replace the original button with our clone
            if (button.parentNode) {
                button.parentNode.replaceChild(newButton, button);
                
                // Add our own click handler
                newButton.addEventListener("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Find the product card
                    const productCard = this.closest('.product-card, .deal-card');
                    
                    if (productCard) {
                        openQuickViewModal(productCard);
                    } else {
                        console.error("QuickView Replacement: Could not find product card");
                    }
                });
            }
        });
    }
    
    function openQuickViewModal(productCard) {
        // Get our modal
        const modal = document.getElementById("newQuickViewModal");
        if (!modal) {
            console.error("QuickView Replacement: Modal not found");
            return;
        }
        
        // Extract product data
        const product = {
            id: productCard.dataset.id || "",
            name: productCard.dataset.name || "Product Name",
            price: parseFloat(productCard.dataset.price || "0"),
            image: productCard.dataset.image || "",
            category: productCard.dataset.category || "Product",
            brand: productCard.dataset.brand || "Brand",
            colors: productCard.dataset.colors || "",
            features: productCard.dataset.features || ""
        };
        
        // Check for description
        if (productCard.dataset.description) {
            product.description = productCard.dataset.description;
        } else {
            // Try to find a description inside the product card
            const descEl = productCard.querySelector('.product-description');
            if (descEl) {
                product.description = descEl.textContent.trim();
            }
            
            // If still no description, try to fetch it from the database if available
            if (!product.description) {
                fetch(`get_product_description.php?id=${product.id}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.description) {
                            product.description = data.description;
                            document.getElementById("newModalDescription").textContent = product.description;
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching product description:", error);
                    });
            }
        }
        
        console.log("QuickView Replacement: Opening modal for product", product);
        
        // Store product data in modal
        modal.dataset.productData = JSON.stringify(product);
        
        // Update modal content
        document.getElementById("newModalName").textContent = product.name;
        document.getElementById("newModalCategory").textContent = product.category;
        document.getElementById("newModalPrice").textContent = "৳" + formatNumber(product.price);
        document.getElementById("newModalProductImage").src = product.image;
        document.getElementById("newModalProductImage").alt = product.name;
        
        // Use the actual description from database or generate one if not available
        document.getElementById("newModalDescription").textContent = product.description || generateDescription(product);
        
        // Update tech specifications
        updateTechSpecs(product);
        
        // Reset quantity
        document.getElementById("newModalQuantity").value = 1;
        
        // Update color options
        updateColorOptions(product.colors);
        
        // Show the modal
        modal.style.display = "block";
    }
    
    function updateTechSpecs(product) {
        const specsGrid = document.getElementById("newModalSpecsGrid");
        specsGrid.innerHTML = "";
        
        console.log("Updating tech specs with features:", product.features);
        
        if (!product.features || product.features.trim() === "") {
            // If no features, add some placeholder specs based on product category
            addDefaultSpecs(specsGrid, product);
            return;
        }
        
        try {
            // Parse features from comma-separated string
            const features = product.features.split(',').map(feature => feature.trim());
            
            // Create spec items with proper icons
            features.forEach(feature => {
                // Try to split feature into key:value if it contains a colon
                if (feature.includes(':')) {
                    const [key, value] = feature.split(':').map(part => part.trim());
                    addSpecItemWithIcon(specsGrid, key, value);
                } else {
                    // For features without colon, try to determine what type of spec it is
                    categorizeAndAddSpec(specsGrid, feature);
                }
            });
        } catch (error) {
            console.error("Error parsing features:", error);
            addDefaultSpecs(specsGrid, product);
        }
    }
    
    function categorizeAndAddSpec(container, feature) {
        // Determine the type of spec based on content
        if (/ram|memory|GB RAM|DDR/i.test(feature)) {
            addSpecItemWithIcon(container, "Memory", feature, "microchip");
        } else if (/processor|cpu|chip|core|snapdragon|intel|amd/i.test(feature)) {
            addSpecItemWithIcon(container, "Processor", feature, "microchip");
        } else if (/display|screen|retina|amoled|oled|lcd|\"|\'/i.test(feature)) {
            addSpecItemWithIcon(container, "Display", feature, "tv");
        } else if (/battery|mAh|hour/i.test(feature)) {
            addSpecItemWithIcon(container, "Battery", feature, "battery-full");
        } else if (/camera|MP|ultra/i.test(feature)) {
            addSpecItemWithIcon(container, "Camera", feature, "camera");
        } else if (/storage|SSD|GB$|TB/i.test(feature)) {
            addSpecItemWithIcon(container, "Storage", feature, "hdd");
        } else if (/bluetooth|wifi|wireless|connectivity/i.test(feature)) {
            addSpecItemWithIcon(container, "Connectivity", feature, "wifi");
        } else if (/OS|android|ios|windows|mac/i.test(feature)) {
            addSpecItemWithIcon(container, "OS", feature, "mobile");
        } else if (/weight|g$|kg/i.test(feature)) {
            addSpecItemWithIcon(container, "Weight", feature, "weight");
        } else if (/resolution|px|MP$|K$/i.test(feature)) {
            addSpecItemWithIcon(container, "Resolution", feature, "expand");
        } else if (/water|IP\d|resist/i.test(feature)) {
            addSpecItemWithIcon(container, "Water Resistance", feature, "tint");
        } else if (/sensor/i.test(feature)) {
            addSpecItemWithIcon(container, "Sensors", feature, "fingerprint");
        } else if (/audio|sound|speaker/i.test(feature)) {
            addSpecItemWithIcon(container, "Audio", feature, "volume-up");
        } else if (/port|usb|type-c|lightning/i.test(feature)) {
            addSpecItemWithIcon(container, "Ports", feature, "plug");
        } else {
            // Generic feature
            addSpecItemWithIcon(container, "Feature", feature, "star");
        }
    }
    
    function addSpecItemWithIcon(container, label, value, iconName = "") {
        if (!iconName) {
            // Determine icon based on label
            iconName = getIconForLabel(label);
        }
        
        const specItem = document.createElement("div");
        specItem.className = "spec-item";
        specItem.style.cssText = `
            padding: 10px !important;
            background-color: #f8f9fa !important;
            border-radius: 8px !important;
            display: flex !important;
            align-items: center !important;
        `;
        
        // Create icon container with light blue background
        const iconContainer = document.createElement("div");
        iconContainer.className = "spec-icon";
        iconContainer.style.cssText = `
            width: 36px !important;
            height: 36px !important;
            border-radius: 50% !important;
            background-color: #e6f0ff !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin-right: 12px !important;
        `;
        
        // Add icon
        const icon = document.createElement("i");
        icon.className = `fas fa-${iconName}`;
        icon.style.cssText = `
            color: #0052cc !important;
            font-size: 16px !important;
        `;
        iconContainer.appendChild(icon);
        
        // Create content area
        const contentArea = document.createElement("div");
        contentArea.className = "spec-content";
        contentArea.style.cssText = `
            flex-grow: 1 !important;
        `;
        
        const labelElement = document.createElement("div");
        labelElement.className = "spec-label";
        labelElement.textContent = label.toUpperCase();
        labelElement.style.cssText = `
            font-size: 12px !important;
            color: #6c757d !important;
            margin-bottom: 2px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
        `;
        
        const valueElement = document.createElement("div");
        valueElement.className = "spec-value";
        valueElement.textContent = value;
        valueElement.style.cssText = `
            font-weight: 500 !important;
            color: #212529 !important;
            font-size: 14px !important;
        `;
        
        contentArea.appendChild(labelElement);
        contentArea.appendChild(valueElement);
        
        specItem.appendChild(iconContainer);
        specItem.appendChild(contentArea);
        
        container.appendChild(specItem);
    }
    
    function getIconForLabel(label) {
        // Map common spec labels to Font Awesome icons
        const labelLower = label.toLowerCase();
        
        if (/processor|cpu|chip/i.test(labelLower)) return "microchip";
        if (/memory|ram/i.test(labelLower)) return "memory";
        if (/storage|ssd|hdd/i.test(labelLower)) return "hdd";
        if (/display|screen/i.test(labelLower)) return "tv";
        if (/battery/i.test(labelLower)) return "battery-full";
        if (/camera/i.test(labelLower)) return "camera";
        if (/resolution/i.test(labelLower)) return "expand";
        if (/connectivity|bluetooth|wifi/i.test(labelLower)) return "wifi";
        if (/os|system/i.test(labelLower)) return "mobile-alt";
        if (/weight/i.test(labelLower)) return "weight";
        if (/water/i.test(labelLower)) return "tint";
        if (/audio|sound|speaker/i.test(labelLower)) return "headphones";
        if (/controls/i.test(labelLower)) return "sliders-h";
        if (/port|usb|type-c|lightning/i.test(labelLower)) return "plug";
        if (/sensor/i.test(labelLower)) return "fingerprint";
        if (/compatibility/i.test(labelLower)) return "bluetooth";
        if (/feature/i.test(labelLower)) return "star";
        if (/brand/i.test(labelLower)) return "tag";
        if (/model/i.test(labelLower)) return "info-circle";
        if (/warranty/i.test(labelLower)) return "shield-alt";
        if (/condition/i.test(labelLower)) return "check-circle";
        if (/driver/i.test(labelLower)) return "headphones";
        
        // Default icon
        return "circle";
    }
    
    function addDefaultSpecs(specsGrid, product) {
        console.log("Adding default specs for category:", product.category);
        
        if (product.category === "phones") {
            addSpecItemWithIcon(specsGrid, "Processor", "High Performance", "microchip");
            addSpecItemWithIcon(specsGrid, "Display", "Full HD+ Display", "tv");
            addSpecItemWithIcon(specsGrid, "Battery", "All-day Battery", "battery-full");
            addSpecItemWithIcon(specsGrid, "Camera", "High Resolution", "camera");
        } 
        else if (product.category === "laptops") {
            addSpecItemWithIcon(specsGrid, "Processor", "High Performance", "microchip");
            addSpecItemWithIcon(specsGrid, "Memory", "8GB RAM", "memory");
            addSpecItemWithIcon(specsGrid, "Storage", "256GB SSD", "hdd");
            addSpecItemWithIcon(specsGrid, "Display", "Full HD Display", "tv");
        }
                else if (product.category === "headphones" || product.category === "earbuds") {
            addSpecItemWithIcon(specsGrid, "Driver", "Custom Drivers", "headphones");
            addSpecItemWithIcon(specsGrid, "Battery", "Up to 20 hours", "battery-full");
            addSpecItemWithIcon(specsGrid, "Connectivity", "Bluetooth 5.0", "wifi");
            addSpecItemWithIcon(specsGrid, "Features", "Active Noise Cancellation", "star");
        }
        else if (product.category === "smartwatches") {
            addSpecItemWithIcon(specsGrid, "Display", "AMOLED Display", "tv");
            addSpecItemWithIcon(specsGrid, "Battery", "Up to 18 hours", "battery-full");
            addSpecItemWithIcon(specsGrid, "Connectivity", "Bluetooth & WiFi", "wifi");
            addSpecItemWithIcon(specsGrid, "Features", "Health Sensors", "heartbeat");
        }
        else {
            // Generic specs for all other categories
            addSpecItemWithIcon(specsGrid, "Brand", capitalizeFirstLetter(product.brand), "tag");
            addSpecItemWithIcon(specsGrid, "Model", "Latest Model", "info-circle");
            addSpecItemWithIcon(specsGrid, "Warranty", "1 Year", "shield-alt");
            addSpecItemWithIcon(specsGrid, "Condition", "New", "check-circle");
        }
    }
    
    function updateColorOptions(colorsString) {
        const colorOptions = document.getElementById("newModalColorOptions");
        colorOptions.innerHTML = "";
        
        if (!colorsString) {
            document.querySelector(".product-colors").style.display = "none";
            return;
        }
        
        // Parse colors
        const colors = colorsString.split(",").map(color => color.trim());
        
        if (colors.length === 0) {
            document.querySelector(".product-colors").style.display = "none";
            return;
        }
        
        document.querySelector(".product-colors").style.display = "block";
        
        // Create color options
        colors.forEach((color, index) => {
            const colorOption = document.createElement("span");
            colorOption.className = `color-option ${color.toLowerCase()}${index === 0 ? ' active' : ''}`;
            colorOption.dataset.color = color;
            colorOption.title = color;
            colorOption.style.cssText = `
                width: 30px !important;
                height: 30px !important;
                border-radius: 50% !important;
                background-color: ${color.toLowerCase()} !important;
                cursor: pointer !important;
                border: 2px solid ${index === 0 ? '#0052cc' : 'transparent'} !important;
                box-shadow: ${index === 0 ? '0 0 0 2px rgba(0,82,204,0.3)' : 'none'} !important;
            `;
            
            colorOption.addEventListener("click", function() {
                // Remove active class from all colors
                document.querySelectorAll(".color-option").forEach(el => {
                    el.style.border = "2px solid transparent !important";
                    el.style.boxShadow = "none !important";
                });
                
                // Add active class to clicked color
                this.style.border = "2px solid #0052cc !important";
                this.style.boxShadow = "0 0 0 2px rgba(0,82,204,0.3) !important";
                
                // Update product image based on color
                updateProductImageForColor(this.dataset.color);
            });
            
            colorOptions.appendChild(colorOption);
        });
    }
    
    function updateProductImageForColor(color) {
        const modal = document.getElementById("newQuickViewModal");
        if (!modal) return;
        
        const productData = JSON.parse(modal.dataset.productData || "{}");
        const imageElement = document.getElementById("newModalProductImage");
        if (!imageElement || !productData.image) return;
        
        // Get current image path
        const currentSrc = productData.image;
        
        // Map colors to suffixes
        const suffixMap = {
            "black": "B",
            "white": "W",
            "blue": "BL",
            "red": "R",
            "green": "G",
            "gold": "GD"
        };
        
        // Get color suffix
        const colorLower = color.toLowerCase();
        const suffix = suffixMap[colorLower] || "";
        
        if (suffix) {
            // Parse image path
            const pathParts = currentSrc.split('/');
            let filename = pathParts.pop();
            const basePath = pathParts.join('/') + '/';
            
            // Remove existing suffix
            filename = filename.replace(/[WBRLGD]{1,2}\.(png|jpg|jpeg|webp)$/i, '.$1');
            
            // Add new suffix
            const newFilename = filename.replace(/\.(png|jpg|jpeg|webp)$/i, `${suffix}.$1`);
            const newImagePath = basePath + newFilename;
            
            // Update image
            imageElement.src = newImagePath;
        }
    }
    
    // Generates a description if one is not provided from the database
    function generateDescription(product) {
        return `Experience the premium quality and exceptional performance of the ${product.name}. This ${product.category.toLowerCase()} offers cutting-edge technology and sleek design for the ultimate user experience. Enjoy TechNest's signature quality and reliability with this outstanding product.`;
    }
    
    // CRITICAL FIX: Complete redesign of addToCartImpl to ensure it instantly shows in cart
    function addToCartImpl(product, quantity) {
        console.log("[QUICKVIEW] Adding to cart:", product, quantity);
        
        try {
            // CRITICAL FIX #1: Directly access the main cart from the window object if available
            if (typeof window.cart !== 'undefined') {
                // Use the site's main cart object for consistency
                console.log("[QUICKVIEW] Using global cart from window object");
                
                // Find if product already exists in cart
                const existingItemIndex = window.cart.findIndex(item => item.id === product.id);
                
                if (existingItemIndex !== -1) {
                    // Update quantity if already in cart
                    window.cart[existingItemIndex].quantity += quantity;
                } else {
                    // Add new item to cart
                    window.cart.push({
                        ...product,
                        quantity: quantity
                    });
                }
                
                // Save to localStorage
                localStorage.setItem(cartKey, JSON.stringify(window.cart));
                
                // Call the site's original function to update UI
                if (typeof window.saveCart === 'function') {
                    console.log("[QUICKVIEW] Calling window.saveCart()");
                    window.saveCart();
                    
                    // Show notification
                    showNotification(`${product.name} added to your cart!`, 'success');
                    
                    // CRITICAL FIX: Show cart sidebar immediately using main toggle function
                    if (typeof window.toggleSidebar === 'function') {
                        const cartSidebar = document.querySelector('.cart-sidebar');
                        if (cartSidebar) {
                            console.log("[QUICKVIEW] Showing cart sidebar using toggleSidebar()");
                            window.toggleSidebar(cartSidebar, true);
                        }
                    }
                    
                    return true;
                }
            }
            
            // CRITICAL FIX #2: If window.cart isn't available, use localStorage directly
            console.log("[QUICKVIEW] Using localStorage directly");
            let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
            
            // Check if product exists in cart
            const existingItemIndex = cart.findIndex(item => item.id === product.id);
            
            if (existingItemIndex !== -1) {
                // Update quantity if already in cart
                cart[existingItemIndex].quantity += quantity;
            } else {
                // Add new item to cart
                cart.push({
                    ...product,
                    quantity: quantity
                });
            }
            
            // Save to localStorage
            localStorage.setItem(cartKey, JSON.stringify(cart));
            
            // CRITICAL FIX #3: Directly update the cart UI using DOM manipulation
            console.log("[QUICKVIEW] Directly updating cart UI");
            updateCartUIDirectly(cart);
            
            // CRITICAL FIX #4: Force show cart sidebar
            forceShowCartSidebar();
            
            // CRITICAL FIX #5: Update cart count badges
            updateCartCount(cart);
            
            // Show notification
            showNotification(`${product.name} added to your cart!`, 'success');
            
            // CRITICAL FIX #6: Dispatch a real event to sync with other scripts
            document.dispatchEvent(new CustomEvent('cartUpdated', {
                bubbles: true,
                detail: { cart: cart, source: 'quickview' }
            }));
            
            return true;
        } catch (error) {
            console.error("[QUICKVIEW] Error adding to cart:", error);
            showNotification("Error adding item to cart. Please try again.", "error");
            return false;
        }
    }
    
    // CRITICAL FIX: Force show cart sidebar by directly manipulating DOM
    function forceShowCartSidebar() {
        console.log("[QUICKVIEW] Force showing cart sidebar");
        const cartSidebar = document.querySelector('.cart-sidebar');
        const overlay = document.getElementById('overlay');
        
        if (!cartSidebar) {
            console.error("[QUICKVIEW] Cart sidebar not found");
            return;
        }
        
        // Directly set styles to show the sidebar
        cartSidebar.style.right = '0';
        
        // Show overlay
        if (overlay) {
            overlay.style.display = 'block';
        } else {
            // Create overlay if needed
            const newOverlay = document.createElement('div');
            newOverlay.id = 'overlay';
            newOverlay.style.cssText = `
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 999;
            `;
            document.body.appendChild(newOverlay);
        }
    }
    
    // CRITICAL FIX: Directly update cart UI by manipulating DOM
    function updateCartUIDirectly(cart) {
        console.log("[QUICKVIEW] Directly updating cart UI");
        const cartSidebar = document.querySelector('.cart-sidebar');
        if (!cartSidebar) {
            console.error("[QUICKVIEW] Cart sidebar not found");
            return;
        }
        
        const cartItems = cartSidebar.querySelector('.cart-items');
        const emptyCart = cartSidebar.querySelector('.empty-cart');
        const cartSummary = cartSidebar.querySelector('.cart-summary');
        
        if (!cartItems) {
            console.error("[QUICKVIEW] Cart items container not found");
            return;
        }
        
        // Clear current items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            // Show empty cart message
            if (emptyCart) emptyCart.style.display = 'flex';
            if (cartSummary) cartSummary.style.display = 'none';
        } else {
            // Hide empty cart message
            if (emptyCart) emptyCart.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'block';
            
            // Calculate subtotal
            let subtotal = 0;
            
            // Add items to cart
            cart.forEach(item => {
                const itemPrice = parseFloat(item.price || 0);
                const itemQuantity = parseInt(item.quantity || 1);
                const itemTotal = itemPrice * itemQuantity;
                subtotal += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.dataset.id = item.id;
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">৳${formatNumber(itemTotal)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" value="${itemQuantity}" min="1" max="10" readonly>
                            <button class="quantity-btn plus" data-id="${item.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItems.appendChild(cartItem);
            });
            
            // Add event listeners to cart controls
            const minusButtons = cartItems.querySelectorAll('.minus');
            const plusButtons = cartItems.querySelectorAll('.plus');
            const removeButtons = cartItems.querySelectorAll('.remove-item');
            
            minusButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    handleCartQuantityChange(id, -1);
                });
            });
            
            plusButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    handleCartQuantityChange(id, 1);
                });
            });
            
            removeButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    handleRemoveCartItem(id);
                });
            });
            
            // Update cart summary
            if (cartSummary) {
                const shipping = subtotal > 50000 ? 0 : 150;
                const total = subtotal + shipping;
                
                // Format with Bengali numerals and Taka symbol
                const subtotalEl = cartSummary.querySelector('.cart-subtotal');
                const shippingEl = cartSummary.querySelector('.cart-shipping');
                const totalEl = cartSummary.querySelector('.cart-total');
                
                if (subtotalEl) subtotalEl.textContent = `৳${formatNumber(subtotal)}`;
                if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : `৳${shipping}`;
                if (totalEl) totalEl.textContent = `৳${formatNumber(total)}`;
            }
        }
    }
    
    // Handle quantity change in cart
    function handleCartQuantityChange(id, change) {
        try {
            let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
            const itemIndex = cart.findIndex(item => item.id === id);
            
            if (itemIndex !== -1) {
                const newQuantity = parseInt(cart[itemIndex].quantity) + change;
                
                if (newQuantity <= 0) {
                    handleRemoveCartItem(id);
                    return;
                }
                
                if (newQuantity > 10) {
                    showNotification("Maximum quantity is 10 per item", "info");
                    return;
                }
                
                cart[itemIndex].quantity = newQuantity;
                localStorage.setItem(cartKey, JSON.stringify(cart));
                
                // Update UI
                updateCartUIDirectly(cart);
                updateCartCount(cart);
            }
        } catch (error) {
            console.error("[QUICKVIEW] Error handling quantity change:", error);
        }
    }
    
    // Handle remove item from cart
    function handleRemoveCartItem(id) {
        try {
            let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
            const itemIndex = cart.findIndex(item => item.id === id);
            
            if (itemIndex !== -1) {
                const removedItem = cart[itemIndex];
                cart.splice(itemIndex, 1);
                localStorage.setItem(cartKey, JSON.stringify(cart));
                
                // Update UI
                updateCartUIDirectly(cart);
                updateCartCount(cart);
                
                showNotification(`${removedItem.name} removed from cart`, "info");
            }
        } catch (error) {
            console.error("[QUICKVIEW] Error removing cart item:", error);
        }
    }
    
    // Update cart count badges
    function updateCartCount(cart) {
        try {
            const countElements = document.querySelectorAll('.cart-count');
            if (countElements.length === 0) return;
            
            const count = cart.reduce((sum, item) => sum + parseInt(item.quantity || 1), 0);
            
            countElements.forEach(el => {
                el.textContent = count;
                // Add animation
                el.classList.add('pulse');
                setTimeout(() => el.classList.remove('pulse'), 500);
            });
        } catch (error) {
            console.error("[QUICKVIEW] Error updating cart count:", error);
        }
    }
    
    function buyNow(product, quantity) {
        try {
            // Create a cart with just this item
            const cartItem = {
                ...product,
                quantity: quantity
            };
            
            localStorage.setItem(cartKey, JSON.stringify([cartItem]));
            
            // Redirect to checkout
            window.location.href = "checkout.php";
        } catch (error) {
            console.error("QuickView Replacement: Error with buy now", error);
            showNotification("Could not process your request. Please try again.", "error");
        }
    }
    
    // Show notification
    function showNotification(message, type = "success") {
        // Use global notification function if available
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
            return;
        }
        
        // Use the site's native notification system
        const container = document.getElementById('notificationContainer');
        if (container) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            
            const iconClass = type === 'success' ? 'fa-check-circle' : 
                            type === 'error' ? 'fa-exclamation-circle' : 
                            'fa-info-circle';
            
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas ${iconClass}"></i>
                    <span>${message}</span>
                </div>
                <button class="notification-close">&times;</button>
            `;
            
            container.appendChild(notification);
            
            notification.querySelector('.notification-close').addEventListener('click', function() {
                notification.remove();
            });
            
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 4000);
        }
    }
    
    function observeDynamicContent() {
        // Create MutationObserver
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        // Check if the added node is an element
                        if (node.nodeType === 1) {
                            // Look for quick view buttons in the added node
                            const quickViewButtons = node.querySelectorAll('.quick-view, .quick-view-btn');
                            
                            if (quickViewButtons.length) {
                                console.log(`QuickView Replacement: Found ${quickViewButtons.length} new quick view buttons`);
                                
                                quickViewButtons.forEach(button => {
                                    button.addEventListener('click', function(e) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        
                                        // Find the product card
                                        const productCard = this.closest('.product-card, .deal-card');
                                        
                                        if (productCard) {
                                            openQuickViewModal(productCard);
                                        }
                                    });
                                });
                            }
                        }
                    });
                }
            });
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Format number with Bengali numerals
    function formatNumber(num) {
        return new Intl.NumberFormat('bn-BD').format(parseFloat(num) || 0);
    }
    
    // Helper function to capitalize first letter of each word
    function capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
})();