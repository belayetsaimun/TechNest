// TechNest Advanced Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize search functionality
    initializeSearch();
    
    // Initialize dashboard-specific search if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboardSearch();
    }
    
    // Initialize search results page functionality if on search results page
    if (window.location.pathname.includes('search.html') || window.location.search.includes('search=')) {
        loadSearchResults();
    }
});

// Global search initialization
function initializeSearch() {
    // Get main search form
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.querySelector('.search-input');
    const mobileSearchToggle = document.getElementById('mobileSearchToggle');
    
    // Set up autocomplete container
    setupAutocompleteContainer();
    
    // Handle search input for autocomplete
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length >= 2) {
                // Perform autocomplete search
                performAutocompleteSearch(query);
            } else {
                // Hide autocomplete container if query is too short
                hideAutocompleteContainer();
            }
        });
        
        // Hide autocomplete when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container') && !e.target.closest('.autocomplete-container')) {
                hideAutocompleteContainer();
            }
        });
        
        // Show recent searches on focus (if no query)
        searchInput.addEventListener('focus', function() {
            if (this.value.trim().length === 0) {
                showRecentSearches();
            }
        });
    }
    
    // Handle form submission
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query.length > 0) {
                // Save to recent searches
                saveRecentSearch(query);
                
                // Redirect to search results page
                window.location.href = `search.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
    
    // Mobile search toggle
    if (mobileSearchToggle) {
        mobileSearchToggle.addEventListener('click', function() {
            if (searchForm) {
                searchForm.classList.toggle('mobile-visible');
                
                if (searchForm.classList.contains('mobile-visible')) {
                    setTimeout(() => {
                        searchInput.focus();
                    }, 100);
                } else {
                    hideAutocompleteContainer();
                }
            }
        });
    }
}

// Setup autocomplete container
function setupAutocompleteContainer() {
    // Remove existing container if it exists
    const existingContainer = document.querySelector('.autocomplete-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // Create autocomplete container
    const autocompleteContainer = document.createElement('div');
    autocompleteContainer.className = 'autocomplete-container';
    
    // Add container to DOM
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.appendChild(autocompleteContainer);
        
        // Add styles for autocomplete
        addAutocompleteStyles();
    }
}

// Add autocomplete styles
function addAutocompleteStyles() {
    if (!document.getElementById('autocomplete-styles')) {
        const styles = document.createElement('style');
        styles.id = 'autocomplete-styles';
        styles.textContent = `
            .search-container {
                position: relative;
            }
            
            .autocomplete-container {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                max-height: 400px;
                overflow-y: auto;
                display: none;
                margin-top: 5px;
            }
            
            .autocomplete-container.active {
                display: block;
            }
            
            .autocomplete-section {
                padding: 10px 15px;
            }
            
            .autocomplete-section-header {
                font-size: 14px;
                font-weight: 600;
                color: #777;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .autocomplete-section-header a {
                font-size: 12px;
                color: var(--primary-color);
            }
            
            .autocomplete-item {
                display: flex;
                align-items: center;
                padding: 8px 10px;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            
            .autocomplete-item:hover {
                background-color: #f5f5f5;
            }
            
            .autocomplete-item img {
                width: 40px;
                height: 40px;
                object-fit: cover;
                border-radius: 5px;
                margin-right: 10px;
            }
            
            .autocomplete-item-info {
                flex: 1;
            }
            
            .autocomplete-item-name {
                font-size: 14px;
                font-weight: 500;
                color: var(--dark-color);
                margin-bottom: 3px;
            }
            
            .autocomplete-item-category {
                font-size: 12px;
                color: #777;
            }
            
            .autocomplete-item-price {
                font-weight: 600;
                color: var(--primary-color);
                font-size: 14px;
            }
            
            .recent-search-item {
                display: flex;
                align-items: center;
                padding: 8px 10px;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            
            .recent-search-item:hover {
                background-color: #f5f5f5;
            }
            
            .recent-search-item i {
                color: #aaa;
                margin-right: 10px;
            }
            
            .recent-search-item span {
                flex: 1;
                font-size: 14px;
                color: var(--dark-color);
            }
            
            .recent-search-item .remove-search {
                color: #aaa;
                cursor: pointer;
                padding: 5px;
            }
            
            .recent-search-item .remove-search:hover {
                color: var(--danger-color);
            }
            
            .search-footer {
                display: flex;
                justify-content: center;
                padding: 10px;
                border-top: 1px solid #eee;
            }
            
            .search-footer a {
                font-size: 14px;
                color: var(--primary-color);
                font-weight: 500;
            }
            
            .no-results {
                padding: 15px;
                text-align: center;
                color: #777;
                font-size: 14px;
            }
            
            @media (max-width: 576px) {
                .search-container.mobile-visible .autocomplete-container {
                    position: fixed;
                    top: 70px;
                    left: 20px;
                    right: 20px;
                    max-height: 60vh;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Show autocomplete container
function showAutocompleteContainer() {
    const container = document.querySelector('.autocomplete-container');
    if (container) {
        container.classList.add('active');
    }
}

// Hide autocomplete container
function hideAutocompleteContainer() {
    const container = document.querySelector('.autocomplete-container');
    if (container) {
        container.classList.remove('active');
    }
}

// Perform autocomplete search
function performAutocompleteSearch(query) {
    // In a real app, this would be an API call to get search results
    // For demo purposes, we'll use a mock function that returns products based on the query
    const products = searchMockProducts(query);
    
    displayAutocompleteResults(products, query);
}

// Display autocomplete results
function displayAutocompleteResults(products, query) {
    const container = document.querySelector('.autocomplete-container');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    if (products.length > 0) {
        // Products section
        const productsSection = document.createElement('div');
        productsSection.className = 'autocomplete-section';
        
        // Section header
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'autocomplete-section-header';
        sectionHeader.innerHTML = `
            <span>Products</span>
            <a href="search.html?search=${encodeURIComponent(query)}">View all results</a>
        `;
        productsSection.appendChild(sectionHeader);
        
        // Add products (limit to 5)
        const displayProducts = products.slice(0, 5);
        displayProducts.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'autocomplete-item';
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="autocomplete-item-info">
                    <div class="autocomplete-item-name">${highlightMatch(product.name, query)}</div>
                    <div class="autocomplete-item-category">${product.category}</div>
                </div>
                <div class="autocomplete-item-price">৳${product.price.toLocaleString('en-IN')}</div>
            `;
            
            // Add click event to go to product
            productItem.addEventListener('click', () => {
                window.location.href = `product.html?id=${product.id}`;
            });
            
            productsSection.appendChild(productItem);
        });
        
        container.appendChild(productsSection);
        
        // Add search footer
        const searchFooter = document.createElement('div');
        searchFooter.className = 'search-footer';
        searchFooter.innerHTML = `
            <a href="search.html?search=${encodeURIComponent(query)}">See all results for "${query}"</a>
        `;
        container.appendChild(searchFooter);
    } else {
        // No results
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = `No results found for "${query}"`;
        container.appendChild(noResults);
    }
    
    // Show container
    showAutocompleteContainer();
}

// Show recent searches
function showRecentSearches() {
    const recentSearches = getRecentSearches();
    const container = document.querySelector('.autocomplete-container');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    if (recentSearches.length > 0) {
        // Recent searches section
        const recentSection = document.createElement('div');
        recentSection.className = 'autocomplete-section';
        
        // Section header
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'autocomplete-section-header';
        sectionHeader.innerHTML = `
            <span>Recent Searches</span>
            <a href="#" class="clear-recent">Clear all</a>
        `;
        recentSection.appendChild(sectionHeader);
        
        // Add clear all functionality
        sectionHeader.querySelector('.clear-recent').addEventListener('click', (e) => {
            e.preventDefault();
            clearRecentSearches();
            hideAutocompleteContainer();
        });
        
        // Add recent searches
        recentSearches.forEach(search => {
            const searchItem = document.createElement('div');
            searchItem.className = 'recent-search-item';
            searchItem.innerHTML = `
                <i class="fas fa-history"></i>
                <span>${search}</span>
                <div class="remove-search"><i class="fas fa-times"></i></div>
            `;
            
            // Add click event to use this search
            searchItem.addEventListener('click', (e) => {
                if (!e.target.closest('.remove-search')) {
                    const searchInput = document.querySelector('.search-input');
                    if (searchInput) {
                        searchInput.value = search;
                        
                        // Trigger form submission
                        const searchForm = document.getElementById('searchForm');
                        if (searchForm) {
                            searchForm.dispatchEvent(new Event('submit'));
                        }
                    }
                }
            });
            
            // Add remove functionality
            searchItem.querySelector('.remove-search').addEventListener('click', (e) => {
                e.stopPropagation();
                removeRecentSearch(search);
                searchItem.remove();
                
                // Hide container if no more searches
                if (recentSection.querySelectorAll('.recent-search-item').length === 0) {
                    hideAutocompleteContainer();
                }
            });
            
            recentSection.appendChild(searchItem);
        });
        
        container.appendChild(recentSection);
        
        // Show container
        showAutocompleteContainer();
    }
}

// Get recent searches from local storage
function getRecentSearches() {
    const searches = localStorage.getItem('recentSearches');
    return searches ? JSON.parse(searches) : [];
}

// Save recent search to local storage
function saveRecentSearch(query) {
    query = query.trim();
    let searches = getRecentSearches();
    
    // Remove if already exists
    searches = searches.filter(search => search.toLowerCase() !== query.toLowerCase());
    
    // Add to beginning
    searches.unshift(query);
    
    // Limit to 5 recent searches
    searches = searches.slice(0, 5);
    
    // Save to local storage
    localStorage.setItem('recentSearches', JSON.stringify(searches));
}

// Remove a recent search
function removeRecentSearch(query) {
    let searches = getRecentSearches();
    searches = searches.filter(search => search !== query);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
}

// Clear all recent searches
function clearRecentSearches() {
    localStorage.removeItem('recentSearches');
}

// Highlight matching text in search results
function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}

// Mock search function (replace with actual API call in production)
function searchMockProducts(query) {
    query = query.toLowerCase();
    
    // Mock product database
    const allProducts = [
        { id: 1, name: 'iPhone 16 Pro', category: 'Mobile Phones', price: 219999, image: 'images/iphone16W.png' },
        { id: 2, name: 'TechNest AirPods Pro', category: 'Earbuds', price: 21499, image: 'images/airpods proW.png' },
        { id: 3, name: 'TechNest Bass Boost 2.0', category: 'Headphones', price: 68000, image: 'images/headphone1.png' },
        { id: 4, name: 'TechNest iPad', category: 'Tablets', price: 39000, image: 'images/ipad1.png' },
        { id: 5, name: 'TechNest MacBook Pro', category: 'Laptops', price: 230000, image: 'images/macbook.png' },
        { id: 6, name: 'TechNest SmartFit Pro', category: 'Smartwatches', price: 43499, image: 'images/appwatch.png' },
        { id: 7, name: 'Apple Watch Series 9', category: 'Smartwatches', price: 53999, image: 'images/apple-watch.png' },
        { id: 8, name: 'Samsung Galaxy S24 Ultra', category: 'Mobile Phones', price: 198000, image: 'images/iphone.png' },
        { id: 9, name: 'Noise Cancelling Headphones', category: 'Headphones', price: 45000, image: 'images/headphones.png' },
        { id: 10, name: 'TechNest Wireless Charger', category: 'Accessories', price: 4500, image: 'images/iphone.png' },
        { id: 11, name: 'TechNest USB-C Hub', category: 'Accessories', price: 9999, image: 'images/appwatch.png' },
        { id: 12, name: 'TechNest Smart Speaker', category: 'Smart Home', price: 29999, image: 'images/headphone1.png' }
    ];
    
    // Filter products based on query
    return allProducts.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query)
    );
}

// Initialize dashboard-specific search functionality
function initializeDashboardSearch() {
    // Order search
    const orderSearchInput = document.getElementById('search-orders');
    if (orderSearchInput) {
        orderSearchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            filterOrders(query);
        });
    }
    
    // Wishlist search
    const wishlistSearchInput = document.getElementById('search-wishlist');
    if (wishlistSearchInput) {
        wishlistSearchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            filterWishlist(query);
        });
    }
    
    // Add search to other dashboard sections
    setupReviewsSearch();
    setupAddressSearch();
}

// Filter orders based on search query
function filterOrders(query) {
    const orderCards = document.querySelectorAll('.order-card');
    
    orderCards.forEach(card => {
        const orderNumber = card.querySelector('.order-id h4').textContent.toLowerCase();
        const productName = card.querySelector('.item-details h5').textContent.toLowerCase();
        const orderStatus = card.querySelector('.order-status .status').textContent.toLowerCase();
        
        if (orderNumber.includes(query) || 
            productName.includes(query) || 
            orderStatus.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no results
    updateNoResultsMessage('.orders-list', orderCards);
}

// Filter wishlist based on search query
function filterWishlist(query) {
    const wishlistCards = document.querySelectorAll('.wishlist-product-card');
    
    wishlistCards.forEach(card => {
        const productName = card.querySelector('h4').textContent.toLowerCase();
        
        if (productName.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no results
    updateNoResultsMessage('.wishlist-grid', wishlistCards);
}

// Setup reviews search
function setupReviewsSearch() {
    // Create search input for reviews
    const reviewsHeader = document.querySelector('#reviews .dashboard-header');
    if (reviewsHeader) {
        const reviewsFilter = document.createElement('div');
        reviewsFilter.className = 'filter-group search-reviews';
        reviewsFilter.innerHTML = `
            <input type="text" placeholder="Search reviews..." id="search-reviews">
            <button class="search-btn"><i class="fas fa-search"></i></button>
        `;
        
        // Add to the header
        reviewsHeader.appendChild(reviewsFilter);
        
        // Add event listener
        const reviewsSearchInput = document.getElementById('search-reviews');
        if (reviewsSearchInput) {
            reviewsSearchInput.addEventListener('input', function() {
                const query = this.value.trim().toLowerCase();
                filterReviews(query);
            });
        }
    }
}

// Filter reviews based on search query
function filterReviews(query) {
    const reviewCards = document.querySelectorAll('.review-card');
    
    reviewCards.forEach(card => {
        const productName = card.querySelector('.product-info h4').textContent.toLowerCase();
        const reviewTitle = card.querySelector('.review-title').textContent.toLowerCase();
        const reviewText = card.querySelector('.review-text').textContent.toLowerCase();
        
        if (productName.includes(query) || 
            reviewTitle.includes(query) || 
            reviewText.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no results
    updateNoResultsMessage('.reviews-list', reviewCards);
}

// Setup address search
function setupAddressSearch() {
    // Create search input for addresses
    const addressesHeader = document.querySelector('#addresses .dashboard-header');
    if (addressesHeader) {
        const addressSearch = document.createElement('div');
        addressSearch.className = 'filter-group search-addresses';
        addressSearch.innerHTML = `
            <input type="text" placeholder="Search addresses..." id="search-addresses">
            <button class="search-btn"><i class="fas fa-search"></i></button>
        `;
        
        // Insert before the add address button
        const addAddressBtn = addressesHeader.querySelector('#addAddressBtn');
        if (addAddressBtn) {
            addressesHeader.insertBefore(addressSearch, addAddressBtn);
        } else {
            addressesHeader.appendChild(addressSearch);
        }
        
        // Add event listener
        const addressesSearchInput = document.getElementById('search-addresses');
        if (addressesSearchInput) {
            addressesSearchInput.addEventListener('input', function() {
                const query = this.value.trim().toLowerCase();
                filterAddresses(query);
            });
        }
        
        // Add styles for search addresses
        if (!document.getElementById('address-search-styles')) {
            const styles = document.createElement('style');
            styles.id = 'address-search-styles';
            styles.textContent = `
                .search-addresses {
                    position: relative;
                    min-width: 250px;
                    margin-right: 15px;
                }
                
                .search-addresses input {
                    width: 100%;
                    padding: 10px 40px 10px 15px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 14px;
                }
                
                .search-addresses .search-btn {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #777;
                }
                
                @media (max-width: 768px) {
                    .search-addresses {
                        margin-bottom: 15px;
                        width: 100%;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }
}

// Filter addresses based on search query
function filterAddresses(query) {
    const addressCards = document.querySelectorAll('.address-card:not(.add-address-card)');
    
    addressCards.forEach(card => {
        const addressText = card.textContent.toLowerCase();
        
        if (addressText.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no results
    updateNoResultsMessage('.addresses-grid', addressCards);
}

// Update no results message
function updateNoResultsMessage(containerSelector, items) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    // Remove existing message
    const existingMessage = container.querySelector('.no-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Check if any items are visible
    let visibleItems = 0;
    items.forEach(item => {
        if (item.style.display !== 'none') {
            visibleItems++;
        }
    });
    
    // If no visible items, show message
    if (visibleItems === 0) {
        const message = document.createElement('div');
        message.className = 'no-results-message';
        message.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #777;">
                <i class="fas fa-search" style="font-size: 30px; margin-bottom: 10px; opacity: 0.3;"></i>
                <p>No results found</p>
            </div>
        `;
        container.appendChild(message);
    }
}

// Load search results on search page
function loadSearchResults() {
    // Check if we're on the search page
    const isSearchPage = window.location.pathname.includes('search.html');
    const hasSearchParam = window.location.search.includes('search=');
    
    if (!isSearchPage && !hasSearchParam) return;
    
    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('search');
    
    if (!query) return;
    
    // If not on search page, redirect to search page
    if (!isSearchPage) {
        window.location.href = `search.html?search=${encodeURIComponent(query)}`;
        return;
    }
    
    // Get category and filter parameters if they exist
    const category = urlParams.get('category');
    const minPrice = urlParams.get('min_price');
    const maxPrice = urlParams.get('max_price');
    const sort = urlParams.get('sort');
    
    // Update search input with query
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.value = query;
    }
    
    // Update search title
    const searchTitle = document.querySelector('.search-title');
    if (searchTitle) {
        if (category) {
            searchTitle.textContent = `Search results for "${query}" in ${category}`;
        } else {
            searchTitle.textContent = `Search results for "${query}"`;
        }
    }
    
    // Search for results
    let results = searchMockProducts(query);
    
    // Apply filters
    if (category) {
        results = results.filter(product => product.category.toLowerCase() === category.toLowerCase());
    }
    
    if (minPrice) {
        results = results.filter(product => product.price >= parseInt(minPrice));
    }
    
    if (maxPrice) {
        results = results.filter(product => product.price <= parseInt(maxPrice));
    }
    
    // Apply sorting
    if (sort) {
        switch (sort) {
            case 'price_asc':
                results.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                results.sort((a, b) => b.price - a.price);
                break;
            case 'name_asc':
                results.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name_desc':
                results.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                // Default is relevance (no sorting)
                break;
        }
    }
    
    // Update result count
    const resultCount = document.querySelector('.result-count');
    if (resultCount) {
        resultCount.textContent = `${results.length} results found`;
    }
    
    // Display results
    displaySearchResults(results);
    
    // Update filters UI
    updateFiltersUI(category, minPrice, maxPrice, sort);
    
    // Save search to recent searches
    saveRecentSearch(query);
}

// Display search results
function displaySearchResults(products) {
    const resultsContainer = document.querySelector('.search-results-grid');
    if (!resultsContainer) return;
    
    // Clear container
    resultsContainer.innerHTML = '';
    
    if (products.length === 0) {
        // No results
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No results found</h3>
                <p>Try adjusting your search or filter to find what you're looking for.</p>
            </div>
        `;
        return;
    }
    
    // Display products
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);
        productCard.setAttribute('data-name', product.name);
        productCard.setAttribute('data-price', product.price);
        productCard.setAttribute('data-image', product.image);
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <a href="#" class="quick-view"><i class="fas fa-eye"></i></a>
                    <a href="#" class="add-to-wishlist"><i class="far fa-heart"></i></a>
                    <a href="#" class="add-to-cart"><i class="fas fa-shopping-cart"></i></a>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-category">${product.category}</div>
                <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                    <span>(${Math.floor(Math.random() * 200) + 10})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">৳${product.price.toLocaleString('en-IN')}</span>
                </div>
            </div>
        `;
        
        resultsContainer.appendChild(productCard);
    });
    
    // Add event listeners to product cards
    attachProductCardEventListeners();
}

// Attach event listeners to product cards
function attachProductCardEventListeners() {
    // Quick view buttons
    const quickViewBtns = document.querySelectorAll('.product-card .quick-view');
    if (quickViewBtns.length > 0) {
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = btn.closest('.product-card');
                if (productCard && typeof openQuickView === 'function') {
                    openQuickView(productCard);
                }
            });
        });
    }
    
    // Add to wishlist buttons
    const addToWishlistBtns = document.querySelectorAll('.product-card .add-to-wishlist');
    if (addToWishlistBtns.length > 0) {
        addToWishlistBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = btn.closest('.product-card');
                if (productCard && typeof toggleWishlist === 'function') {
                    toggleWishlist(productCard);
                }
            });
        });
    }
    
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.product-card .add-to-cart');
    if (addToCartBtns.length > 0) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = btn.closest('.product-card');
                if (productCard && typeof addToCart === 'function') {
                    addToCart(productCard);
                }
            });
        });
    }
}

// Update filters UI
function updateFiltersUI(category, minPrice, maxPrice, sort) {
    // Category filter
    const categorySelect = document.getElementById('category-filter');
    if (categorySelect && category) {
        // Try to find and select the option
        const categoryOption = Array.from(categorySelect.options).find(
            option => option.value.toLowerCase() === category.toLowerCase()
        );
        
        if (categoryOption) {
            categoryOption.selected = true;
        }
    }
    
    // Price filter
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    
    if (minPriceInput && minPrice) {
        minPriceInput.value = minPrice;
    }
    
    if (maxPriceInput && maxPrice) {
        maxPriceInput.value = maxPrice;
    }
    
    // Sort filter
    const sortSelect = document.getElementById('sort-filter');
    if (sortSelect && sort) {
        // Try to find and select the option
        const sortOption = Array.from(sortSelect.options).find(
            option => option.value === sort
        );
        
        if (sortOption) {
            sortOption.selected = true;
        }
    }
    
    // Set up filter form submission
    const filterForm = document.getElementById('search-filters-form');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get current search query
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('search') || '';
            
            // Get filter values
            const categoryValue = categorySelect ? categorySelect.value : '';
            const minPriceValue = minPriceInput ? minPriceInput.value : '';
            const maxPriceValue = maxPriceInput ? maxPriceInput.value : '';
            const sortValue = sortSelect ? sortSelect.value : '';
            
            // Build URL
            let url = `search.html?search=${encodeURIComponent(query)}`;
            
            if (categoryValue) {
                url += `&category=${encodeURIComponent(categoryValue)}`;
            }
            
            if (minPriceValue) {
                url += `&min_price=${encodeURIComponent(minPriceValue)}`;
            }
            
            if (maxPriceValue) {
                url += `&max_price=${encodeURIComponent(maxPriceValue)}`;
            }
            
            if (sortValue) {
                url += `&sort=${encodeURIComponent(sortValue)}`;
            }
            
            // Navigate to filtered search
            window.location.href = url;
        });
    }
    
    // Filter options buttons (mobile)
    const filterOptionsBtn = document.getElementById('filter-options-btn');
    const searchFilters = document.querySelector('.search-filters');
    
    if (filterOptionsBtn && searchFilters) {
        filterOptionsBtn.addEventListener('click', function() {
            searchFilters.classList.toggle('mobile-visible');
            
            // Update button text
            this.innerHTML = searchFilters.classList.contains('mobile-visible')
                ? `<i class="fas fa-times"></i> Hide Filters`
                : `<i class="fas fa-filter"></i> Show Filters`;
        });
    }
}

// Create a dedicated search page if it doesn't exist
document.addEventListener('DOMContentLoaded', function() {
    // Check if we need to create a search page
    if (window.location.pathname.includes('search.html') && !document.querySelector('.search-results-container')) {
        createSearchPage();
    }
});

// Create search page dynamically if it doesn't exist
function createSearchPage() {
    document.body.innerHTML = `
        <header>
            <nav class="navbar">
                <div class="logo">
                    <a href="index.html">
                        <div class="logo-text">
                            <div class="bolt-icon"><i class="fas fa-bolt"></i></div>
                            <span class="tech">Tech</span><span class="nest">Nest</span>
                        </div>
                    </a>
                </div>
                <div class="nav-links" id="navLinks">
                    <i class="fas fa-times" id="closeMenu"></i>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="index.html#featured">Products</a></li>
                        <li><a href="index.html#categories">Categories</a></li>
                        <li><a href="index.html#new-arrivals">New Arrivals</a></li>
                        <li><a href="index.html#deals">Deals</a></li>
                    </ul>
                </div>
                <div class="nav-actions">
                    <form class="search-container" id="searchForm">
                        <input type="text" placeholder="Search products..." class="search-input">
                        <button type="submit" class="search-btn"><i class="fas fa-search"></i></button>
                    </form>
                   
                    <a href="auth.html" class="account"><i class="fas fa-user"></i></a>
                    <a href="#" class="wishlist" id="wishlistBtn">
                        <i class="fas fa-heart"></i>
                        <span class="wishlist-count">0</span>
                    </a>
                    <a href="#" class="cart" id="cartBtn">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="cart-count">0</span>
                    </a>
                </div>
                <i class="fas fa-bars" id="menuIcon"></i>
            </nav>
        </header>

        <section class="search-results-container">
            <div class="breadcrumb">
                <a href="index.html">Home</a>
                <i class="fas fa-angle-right"></i>
                <span>Search Results</span>
            </div>
            
            <div class="search-header">
                <h1 class="search-title">Search Results</h1>
                <p class="result-count">0 results found</p>
            </div>
            
            <div class="search-content">
                <div class="search-filters">
                    <h3>Filter Results</h3>
                    <form id="search-filters-form">
                        <div class="filter-group">
                            <label for="category-filter">Category</label>
                            <select id="category-filter">
                                <option value="">All Categories</option>
                                <option value="Mobile Phones">Mobile Phones</option>
                                <option value="Headphones">Headphones</option>
                                <option value="Earbuds">Earbuds</option>
                                <option value="Laptops">Laptops</option>
                                <option value="Smartwatches">Smartwatches</option>
                                <option value="Tablets">Tablets</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Smart Home">Smart Home</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>Price Range</label>
                            <div class="price-inputs">
                                <input type="number" id="min-price" placeholder="Min">
                                <span class="price-separator">to</span>
                                <input type="number" id="max-price" placeholder="Max">
                            </div>
                        </div>
                        
                        <div class="filter-group">
                            <label for="sort-filter">Sort By</label>
                            <select id="sort-filter">
                                <option value="">Relevance</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="name_asc">Name: A to Z</option>
                                <option value="name_desc">Name: Z to A</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn primary-btn">Apply Filters</button>
                    </form>
                </div>
                
                <div class="search-results">
                    <div class="search-controls">
                        <button id="filter-options-btn" class="btn outline-btn">
                            <i class="fas fa-filter"></i> Show Filters
                        </button>
                    </div>
                    
                    <div class="search-results-grid"></div>
                </div>
            </div>
        </section>

        <footer>
            <div class="footer-content">
                <div class="footer-column">
                    <div class="footer-logo">
                        <a href="index.html">
                            <div class="logo-text footer-logo-text">
                                <div class="bolt-icon"><i class="fas fa-bolt"></i></div>
                                <span class="tech">Tech</span><span class="nest">Nest</span>
                            </div>
                        </a>
                    </div>
                    <p>Premium tech gadgets at affordable prices. Experience innovation without breaking the bank.</p>
                    <div class="social-icons">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
                <div class="footer-column">
                    <h3>Shop</h3>
                    <ul>
                        <li><a href="#">Mobile Phones</a></li>
                        <li><a href="#">Headphones</a></li>
                        <li><a href="#">Earbuds</a></li>
                        <li><a href="#">Laptops</a></li>
                        <li><a href="#">Smartwatches</a></li>
                        <li><a href="#">Tablets</a></li>
                        <li><a href="#">Accessories</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Support</h3>
                    <ul>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">FAQs</a></li>
                        <li><a href="#">Shipping & Returns</a></li>
                        <li><a href="#">Warranty</a></li>
                        <li><a href="#">Repair Service</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Company</h3>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Contact</h3>
                    <ul class="contact-info">
                        <li><i class="fas fa-map-marker-alt"></i> SASH, CUET, Raozan-4349, Chattogram</li>
                        <li><i class="fas fa-phone"></i> +8801581448561</li>
                        <li><i class="fas fa-envelope"></i> support@technest.com</li>
                    </ul>
                    <div class="payment-methods">
                        <span class="payment-icon bkash">bKash</span>
                        <span class="payment-icon nagad">Nagad</span>
                        <span class="payment-icon rocket">Rocket</span>
                        <i class="fab fa-cc-visa"></i>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 TechNest. All Rights Reserved.</p>
            </div>
        </footer>
        
        <div class="cart-sidebar" id="cartSidebar">
            <div class="cart-header">
                <h3>Your Cart</h3>
                <span class="close-cart">&times;</span>
            </div>
            <div class="cart-items">
                <!-- Cart items will be added dynamically -->
            </div>
            <div class="cart-summary">
                <div class="cart-total">
                    <span>Total:</span>
                    <span>৳0.00</span>
                </div>
                <button class="btn primary-btn checkout-btn">Checkout</button>
                <button class="btn secondary-btn continue-shopping">Continue Shopping</button>
            </div>
        </div>
        
        <div class="wishlist-sidebar" id="wishlistSidebar">
            <div class="wishlist-header">
                <h3>Your Wishlist</h3>
                <span class="close-wishlist">&times;</span>
            </div>
            <div class="wishlist-items">
                <!-- Wishlist items will be added dynamically -->
            </div>
            <div class="wishlist-actions">
                <button class="btn primary-btn clear-wishlist-btn">Clear Wishlist</button>
            </div>
        </div>
        
        <div class="overlay" id="overlay"></div>
    `;
    
    // Add search page styles
    addSearchPageStyles();
    
    // Initialize search functionality
    setTimeout(() => {
        loadSearchResults();
        
        // Initialize navigation and cart functionality
        if (typeof initializeCart === 'function') {
            initializeCart();
        }
        
        // Initialize mobile menu
        const menuIcon = document.getElementById('menuIcon');
        const closeMenu = document.getElementById('closeMenu');
        const navLinks = document.getElementById('navLinks');
        const overlay = document.getElementById('overlay');
        
        if (menuIcon && closeMenu && navLinks && overlay) {
            menuIcon.addEventListener('click', () => {
                navLinks.style.right = '0';
                overlay.style.display = 'block';
            });
            
            closeMenu.addEventListener('click', () => {
                navLinks.style.right = '-300px';
                overlay.style.display = 'none';
            });
        }
        
        // Initialize cart and wishlist sidebar
        const cartBtn = document.getElementById('cartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const closeCart = document.querySelector('.close-cart');
        
        if (cartBtn && cartSidebar && closeCart && overlay) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                cartSidebar.style.right = '0';
                overlay.style.display = 'block';
            });
            
            closeCart.addEventListener('click', () => {
                cartSidebar.style.right = '-400px';
                overlay.style.display = 'none';
            });
        }
        
        const wishlistBtn = document.getElementById('wishlistBtn');
        const wishlistSidebar = document.getElementById('wishlistSidebar');
        const closeWishlist = document.querySelector('.close-wishlist');
        
        if (wishlistBtn && wishlistSidebar && closeWishlist && overlay) {
            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                wishlistSidebar.style.right = '0';
                overlay.style.display = 'block';
            });
            
            closeWishlist.addEventListener('click', () => {
                wishlistSidebar.style.right = '-400px';
                overlay.style.display = 'none';
            });
        }
    }, 100);
}

// Add search page styles
function addSearchPageStyles() {
    if (!document.getElementById('search-page-styles')) {
        const styles = document.createElement('style');
        styles.id = 'search-page-styles';
        styles.textContent = `
            .search-results-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 40px 5%;
            }
            
            .breadcrumb {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 20px;
                font-size: 14px;
                color: #777;
            }
            
            .breadcrumb a {
                color: var(--primary-color);
            }
            
            .search-header {
                margin-bottom: 30px;
            }
            
            .search-title {
                font-size: 28px;
                color: var(--dark-color);
                margin-bottom: 10px;
            }
            
            .result-count {
                color: #777;
                font-size: 16px;
            }
            
            .search-content {
                display: flex;
                gap: 30px;
            }
            
            .search-filters {
                width: 280px;
                background-color: white;
                border-radius: 10px;
                padding: 25px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                align-self: flex-start;
                position: sticky;
                top: 100px;
            }
            
            .search-filters h3 {
                font-size: 18px;
                color: var(--dark-color);
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            
            .filter-group {
                margin-bottom: 20px;
            }
            
            .filter-group label {
                display: block;
                margin-bottom: 10px;
                font-size: 14px;
                font-weight: 600;
                color: var(--dark-color);
            }
            
            .filter-group select, .filter-group input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 14px;
            }
            
            .price-inputs {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .price-separator {
                color: #777;
            }
            
            .search-results {
                flex: 1;
            }
            
            .search-controls {
                display: none;
                margin-bottom: 20px;
            }
            
            .search-results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
            }
            
            .no-results {
                text-align: center;
                padding: 50px 0;
                color: #777;
            }
            
            .no-results i {
                font-size: 40px;
                color: #ddd;
                margin-bottom: 20px;
            }
            
            .no-results h3 {
                font-size: 20px;
                color: var(--dark-color);
                margin-bottom: 10px;
            }
            
            .product-category {
                font-size: 14px;
                color: #777;
                margin-bottom: 10px;
            }
            
            @media (max-width: 992px) {
                .search-content {
                    flex-direction: column;
                }
                
                .search-filters {
                    width: 100%;
                    position: static;
                    margin-bottom: 20px;
                    display: none;
                }
                
                .search-filters.mobile-visible {
                    display: block;
                }
                
                .search-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
            }
            
            @media (max-width: 576px) {
                .search-results-grid {
                    grid-template-columns: 1fr;
                }
                
                .search-title {
                    font-size: 22px;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}