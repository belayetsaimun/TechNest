document.addEventListener('DOMContentLoaded', function () {
    if (typeof allProducts === 'undefined') {
        return; // Exit if no product data is available on the page
    }

    console.log('Products.js Initialized with', allProducts.length, 'products.');

    // --- STATE ---
    let products = allProducts; // The full list of products from PHP
    let filteredAndSortedProducts = [...products]; // The list after filters/sorts are applied
    let currentPage = 1;
    const itemsPerPage = 9;

    // --- DOM ELEMENTS ---
    const grid = document.getElementById('product-grid');
    const paginationContainer = document.getElementById('pagination-container');
    const resultsCountEl = document.getElementById('results-count');
    const filters = {
        sortBy: document.getElementById('sort-by'),
        category: document.getElementById('category-filter'),
        price: document.getElementById('price-range'),
        brand: document.getElementById('brand-filter'),
        reset: document.getElementById('reset-filters')
    };

    // --- MAIN LOGIC ---
    function updateProductView() {
        let filtered = [...products];
        
        // Apply filters
        const categoryValue = filters.category.value;
        if (categoryValue !== 'all') filtered = filtered.filter(p => p.category === categoryValue);
        
        const priceValue = filters.price.value;
        if (priceValue !== 'all') {
            const [min, max] = priceValue.split('-').map(Number);
            filtered = filtered.filter(p => {
                const price = parseFloat(p.price);
                if (max) return price >= min && price <= max;
                return price >= min;
            });
        }

        const brandValue = filters.brand.value;
        if (brandValue !== 'all') filtered = filtered.filter(p => p.brand === brandValue);
        
        // Apply sorting
        const sortValue = filters.sortBy.value;
        filtered.sort((a, b) => {
            switch (sortValue) {
                case 'price-asc': return parseFloat(a.price) - parseFloat(b.price);
                case 'price-desc': return parseFloat(b.price) - parseFloat(a.price);
                case 'rating': return parseFloat(b.rating) - parseFloat(a.rating);
                case 'newest': return new Date(b.created_at) - new Date(a.created_at);
                default: return 0;
            }
        });
        
        filteredAndSortedProducts = filtered;
        render();
    }

    function render() {
        renderProductGrid();
        renderPagination();
        if (resultsCountEl) {
            resultsCountEl.textContent = `${filteredAndSortedProducts.length} Product${filteredAndSortedProducts.length !== 1 ? 's' : ''} Found`;
        }
    }

    function renderProductGrid() {
        if (!grid) return;
        grid.innerHTML = '';
        if (filteredAndSortedProducts.length === 0) {
            grid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">No products match your filters.</p>';
            return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = filteredAndSortedProducts.slice(startIndex, endIndex);

        pageItems.forEach(product => {
            // This is the template for a single product card
            const oldPriceHTML = product.old_price > 0 ? `<span class="old-price">৳${Number(product.old_price).toLocaleString()}</span>` : '';
            const cardHTML = `
                <div class="product-card" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="assets/images/${product.image_url}" data-category="${product.category}" data-brand="${product.brand}" data-rating="${product.rating}" data-colors="${product.available_colors}">
                    <div class="product-image">
                        <img src="assets/images/${product.image_url}" alt="${product.name}">
                        <div class="product-actions">
                            <a href="#" class="quick-view tooltip-container"><i class="fas fa-eye"></i><span class="tooltip">Quick View</span></a>
                            <a href="#" class="add-to-wishlist tooltip-container"><i class="far fa-heart"></i><span class="tooltip">Add to Wishlist</span></a>
                            <a href="#" class="add-to-cart tooltip-container"><i class="fas fa-shopping-cart"></i><span class="tooltip">Add to Cart</span></a>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3>${product.name}</h3>
                        <div class="product-rating"><span>(${product.review_count} reviews)</span></div>
                        <div class="product-price">
                            <span class="current-price">৳${Number(product.price).toLocaleString()}</span>
                            ${oldPriceHTML}
                        </div>
                    </div>
                </div>`;
            grid.innerHTML += cardHTML;
        });
    }

    function renderPagination() {
        if (!paginationContainer) return;
        const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        // Previous Button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = currentPage === 1;
        paginationContainer.appendChild(prevBtn);

        // Page Number Buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.dataset.page = i;
            paginationContainer.appendChild(pageBtn);
        }

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        paginationContainer.appendChild(nextBtn);
    }
    
    // --- EVENT LISTENERS ---
    Object.values(filters).forEach(filter => {
        if (filter) filter.addEventListener('change', () => {
            currentPage = 1; // [FIX] Reset page to 1 ONLY when a filter is changed
            updateProductView();
        });
    });
    
    if (filters.reset) {
        filters.reset.addEventListener('click', () => {
            Object.values(filters).forEach(f => { if(f.tagName === 'SELECT') f.selectedIndex = 0; });
            currentPage = 1;
            updateProductView();
        });
    }
    
    if (paginationContainer) {
        paginationContainer.addEventListener('click', (e) => {
            const clickedBtn = e.target.closest('.page-btn');
            if (!clickedBtn) return;

            // [FIX] This now ONLY updates the page number and re-renders
            if(clickedBtn.matches('.prev')) {
                if(currentPage > 1) currentPage--;
            } else if (clickedBtn.matches('.next')) {
                const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
                if(currentPage < totalPages) currentPage++;
            } else {
                currentPage = Number(clickedBtn.dataset.page);
            }
            render(); // Re-render with the new page number
        });
    }

    // Initial render on page load
    updateProductView();
});