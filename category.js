document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const productGrid = document.getElementById('product-grid');
    const categoryTitle = document.getElementById('category-title');
    const categoryDescription = document.getElementById('category-description');
    const categoryNameBreadcrumb = document.getElementById('category-name');
    const categoryBanner = document.querySelector('.category-banner');
    const relatedCategoriesGrid = document.getElementById('related-categories-grid');
    const paginationContainer = document.getElementById('pagination');
    
    // Quick View Modal Elements
    const quickViewModal = document.getElementById('quickViewModal');
    const closeModal = document.querySelector('.close-modal');
    
    // Cart Sidebar Elements
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total span:last-child');
    const continueShopping = document.querySelector('.continue-shopping');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Wishlist Sidebar Elements
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const closeWishlist = document.querySelector('.close-wishlist');
    const wishlistItems = document.querySelector('.wishlist-items');
    const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');
    
    // Overlay
    const overlay = document.getElementById('overlay');
    
    // Sorting and filtering controls
    const sortBySelect = document.getElementById('sort-by');
    const priceRangeSelect = document.getElementById('price-range');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    // Items per page
    const itemsPerPage = 8;
    let currentPage = 1;
    
    // Get category from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // Initialize cart and wishlist from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // SVG banners for categories
    const svgBanners = {
        phones: `<svg viewBox="0 0 1400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="phones-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0052cc;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#00b8d4;stop-opacity:0.8" />
    </linearGradient>
    <pattern id="phones-pattern" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <circle cx="30" cy="30" r="3" fill="white" fill-opacity="0.1" />
    </pattern>
  </defs>
  
  <!-- Main background -->
  <rect width="100%" height="100%" fill="url(#phones-bg)" />
  
  <!-- Pattern overlay -->
  <rect width="100%" height="100%" fill="url(#phones-pattern)" />
  
  <!-- Phone illustrations -->
  <g transform="translate(1050, 150) scale(0.8)">
    <!-- Phone 1 -->
    <rect x="-120" y="-140" width="90" height="180" rx="12" fill="#222" stroke="white" stroke-width="2" />
    <rect x="-110" y="-130" width="70" height="160" rx="2" fill="#0052cc" />
    <rect x="-90" y="-120" width="30" height="60" rx="2" fill="white" fill-opacity="0.3" />
    <circle cx="-75" cy="110" r="8" fill="white" fill-opacity="0.5" />
    
    <!-- Phone 2 -->
    <rect x="0" y="-150" width="100" height="200" rx="15" fill="#333" stroke="white" stroke-width="2" />
    <rect x="10" y="-140" width="80" height="180" rx="2" fill="#00b8d4" />
    <rect x="30" y="-130" width="40" height="70" rx="2" fill="white" fill-opacity="0.3" />
    <circle cx="50" cy="120" r="10" fill="white" fill-opacity="0.5" />
    
    <!-- Phone 3 -->
    <rect x="130" y="-130" width="80" height="170" rx="10" fill="#444" stroke="white" stroke-width="2" />
    <rect x="140" y="-120" width="60" height="150" rx="2" fill="#0066cc" />
    <rect x="150" y="-110" width="40" height="50" rx="2" fill="white" fill-opacity="0.3" />
    <circle cx="170" cy="100" r="8" fill="white" fill-opacity="0.5" />
  </g>
  
  <!-- Text elements -->
  
</svg>`,

        laptops: `<svg viewBox="0 0 1400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="laptops-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4b0082;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#8a2be2;stop-opacity:0.8" />
    </linearGradient>
    <pattern id="laptops-pattern" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <circle cx="30" cy="30" r="3" fill="white" fill-opacity="0.1" />
    </pattern>
  </defs>
  
  <!-- Main background -->
  <rect width="100%" height="100%" fill="url(#laptops-bg)" />
  
  <!-- Pattern overlay -->
  <rect width="100%" height="100%" fill="url(#laptops-pattern)" />
  
  <!-- Laptop illustrations -->
  <g transform="translate(1050, 150) scale(0.6)">
    <!-- Laptop 1 -->
    <g transform="translate(-250, 0)">
      <rect x="-100" y="-70" width="200" height="140" rx="10" fill="#333" />
      <rect x="-90" y="-60" width="180" height="120" fill="#4b0082" />
      <rect x="-80" y="-50" width="160" height="100" fill="#8a2be2" opacity="0.7" />
      <rect x="-130" y="70" width="260" height="15" rx="5" fill="#222" />
    </g>
    
    <!-- Laptop 2 -->
    <g transform="translate(50, -20)">
      <rect x="-120" y="-80" width="240" height="160" rx="10" fill="#444" />
      <rect x="-110" y="-70" width="220" height="140" fill="#6a0dad" />
      <rect x="-100" y="-60" width="200" height="120" fill="#9932cc" opacity="0.8" />
      <rect x="-150" y="80" width="300" height="15" rx="5" fill="#333" />
    </g>
    
    <!-- Laptop 3 -->
    <g transform="translate(280, 20) rotate(-10)">
      <rect x="-90" y="-60" width="180" height="120" rx="10" fill="#555" />
      <rect x="-80" y="-50" width="160" height="100" fill="#483d8b" />
      <rect x="-70" y="-40" width="140" height="80" fill="#7b68ee" opacity="0.7" />
      <rect x="-110" y="60" width="220" height="12" rx="5" fill="#444" />
    </g>
  </g>
</svg>`,

        headphones: `<svg viewBox="0 0 1400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="headphones-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#dc143c;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#ff4500;stop-opacity:0.8" />
    </linearGradient>
    <pattern id="headphones-pattern" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <circle cx="30" cy="30" r="3" fill="white" fill-opacity="0.1" />
    </pattern>
    <linearGradient id="headphones-metal" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ddd" />
      <stop offset="50%" style="stop-color:#aaa" />
      <stop offset="100%" style="stop-color:#ddd" />
    </linearGradient>
  </defs>
  
  <!-- Main background -->
  <rect width="100%" height="100%" fill="url(#headphones-bg)" />
  
  <!-- Pattern overlay -->
  <rect width="100%" height="100%" fill="url(#headphones-pattern)" />
  
  <!-- Headphones illustrations -->
  <g transform="translate(1050, 150) scale(0.9)">
    <!-- Headphone 1 -->
    <g transform="translate(-200, 0)">
      <!-- Headband -->
      <path d="M-70,-60 A140,140 0 0,1 70,-60" stroke="url(#headphones-metal)" stroke-width="15" fill="none" />
      
      <!-- Ear cups -->
      <g transform="translate(-85, 0)">
        <ellipse cx="0" cy="0" rx="40" ry="50" fill="#222" />
        <ellipse cx="0" cy="0" rx="30" ry="40" fill="#dc143c" />
        <ellipse cx="0" cy="0" rx="20" ry="30" fill="#ff4500" opacity="0.7" />
      </g>
      
      <g transform="translate(85, 0)">
        <ellipse cx="0" cy="0" rx="40" ry="50" fill="#222" />
        <ellipse cx="0" cy="0" rx="30" ry="40" fill="#dc143c" />
        <ellipse cx="0" cy="0" rx="20" ry="30" fill="#ff4500" opacity="0.7" />
      </g>
      
      <!-- Headband support -->
      <path d="M-70,-60 L-85,0" stroke="#333" stroke-width="8" fill="none" />
      <path d="M70,-60 L85,0" stroke="#333" stroke-width="8" fill="none" />
    </g>
    
    <!-- Headphone 2 -->
    <g transform="translate(80, 0) rotate(15)">
      <!-- Headband -->
      <path d="M-60,-50 A120,120 0 0,1 60,-50" stroke="url(#headphones-metal)" stroke-width="12" fill="none" />
      
      <!-- Ear cups -->
      <g transform="translate(-75, 0)">
        <ellipse cx="0" cy="0" rx="35" ry="45" fill="#333" />
        <ellipse cx="0" cy="0" rx="25" ry="35" fill="#ff6347" />
        <ellipse cx="0" cy="0" rx="15" ry="25" fill="#ff7f50" opacity="0.7" />
      </g>
      
      <g transform="translate(75, 0)">
        <ellipse cx="0" cy="0" rx="35" ry="45" fill="#333" />
        <ellipse cx="0" cy="0" rx="25" ry="35" fill="#ff6347" />
        <ellipse cx="0" cy="0" rx="15" ry="25" fill="#ff7f50" opacity="0.7" />
      </g>
      
      <!-- Headband support -->
      <path d="M-60,-50 L-75,0" stroke="#444" stroke-width="6" fill="none" />
      <path d="M60,-50 L75,0" stroke="#444" stroke-width="6" fill="none" />
    </g>
  </g>
  
  <!-- Sound waves -->
  <g transform="translate(950, 150)" opacity="0.3">
    <circle cx="0" cy="0" r="30" fill="none" stroke="white" stroke-width="2" />
    <circle cx="0" cy="0" r="60" fill="none" stroke="white" stroke-width="2" />
    <circle cx="0" cy="0" r="90" fill="none" stroke="white" stroke-width="2" />
    <circle cx="0" cy="0" r="120" fill="none" stroke="white" stroke-width="2" />
  </g>
</svg>`,

        earbuds: `<svg viewBox="0 0 1400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="earbuds-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#50C878;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#90EE90;stop-opacity:0.8" />
    </linearGradient>
    <pattern id="earbuds-pattern" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <circle cx="30" cy="30" r="3" fill="white" fill-opacity="0.1" />
    </pattern>
  </defs>
  
  <!-- Main background -->
  <rect width="100%" height="100%" fill="url(#earbuds-bg)" />
  
  <!-- Pattern overlay -->
  <rect width="100%" height="100%" fill="url(#earbuds-pattern)" />
  
  <!-- Earbuds illustrations -->
  <g transform="translate(1050, 150) scale(0.9)">
    <!-- Earbud case -->
    <ellipse cx="0" cy="0" rx="90" ry="50" fill="#333" />
    <ellipse cx="0" cy="-10" rx="85" ry="45" fill="#50C878" opacity="0.9" />
    <ellipse cx="0" cy="-10" rx="75" ry="35" fill="#90EE90" opacity="0.7" />
    
    <!-- Left earbud -->
    <g transform="translate(-120, -50)">
      <circle cx="0" cy="0" r="25" fill="#333" />
      <circle cx="0" cy="0" r="20" fill="#50C878" />
      <circle cx="0" cy="0" r="10" fill="#90EE90" opacity="0.8" />
    </g>
    
    <!-- Right earbud -->
    <g transform="translate(120, -50)">
      <circle cx="0" cy="0" r="25" fill="#333" />
      <circle cx="0" cy="0" r="20" fill="#50C878" />
      <circle cx="0" cy="0" r="10" fill="#90EE90" opacity="0.8" />
    </g>
  </g>
  
  <!-- Sound waves -->
  <g transform="translate(950, 150)" opacity="0.3">
    <circle cx="0" cy="0" r="30" fill="none" stroke="white" stroke-width="2" />
    <circle cx="0" cy="0" r="60" fill="none" stroke="white" stroke-width="2" />
    <circle cx="0" cy="0" r="90" fill="none" stroke="white" stroke-width="2" />
  </g>
</svg>`,

        tablets: `<svg viewBox="0 0 1400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="tablets-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF8C00;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#FFD700;stop-opacity:0.8" />
    </linearGradient>
    <pattern id="tablets-pattern" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <circle cx="30" cy="30" r="3" fill="white" fill-opacity="0.1" />
    </pattern>
  </defs>
  
  <!-- Main background -->
  <rect width="100%" height="100%" fill="url(#tablets-bg)" />
  
  <!-- Pattern overlay -->
  <rect width="100%" height="100%" fill="url(#tablets-pattern)" />
  
  <!-- Tablet illustrations -->
  <g transform="translate(1050, 150) scale(0.8)">
    <!-- Tablet 1 -->
    <rect x="-140" y="-100" width="180" height="240" rx="10" fill="#333" stroke="white" stroke-width="2" />
    <rect x="-130" y="-90" width="160" height="220" rx="5" fill="#FF8C00" />
    <rect x="-120" y="-80" width="140" height="200" rx="2" fill="#FFD700" opacity="0.7" />
    <circle cx="-50" cy="100" r="10" fill="white" fill-opacity="0.5" />
    
    <!-- Tablet 2 -->
    <g transform="translate(100, 0) rotate(15)">
      <rect x="-100" y="-80" width="150" height="200" rx="10" fill="#444" stroke="white" stroke-width="2" />
      <rect x="-90" y="-70" width="130" height="180" rx="5" fill="#FFA500" />
      <rect x="-80" y="-60" width="110" height="160" rx="2" fill="#FFCC00" opacity="0.7" />
      <circle cx="-25" cy="80" r="8" fill="white" fill-opacity="0.5" />
    </g>
  </g>
  
</svg>`,

        smartwatches: `<svg viewBox="0 0 1400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="smartwatches-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4169E1;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#1E90FF;stop-opacity:0.8" />
    </linearGradient>
    <pattern id="smartwatches-pattern" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <circle cx="30" cy="30" r="3" fill="white" fill-opacity="0.1" />
    </pattern>
  </defs>
  
  <!-- Main background -->
  <rect width="100%" height="100%" fill="url(#smartwatches-bg)" />
  
  <!-- Pattern overlay -->
  <rect width="100%" height="100%" fill="url(#smartwatches-pattern)" />
  
  <!-- Smartwatch illustrations -->
  <g transform="translate(1050, 150) scale(0.9)">
    <!-- Smartwatch 1 -->
    <g transform="translate(-100, 0)">
      <!-- Watch band -->
      <path d="M-40,-80 L-40,-40 L-40,40 L-40,80 C-40,90 -20,90 -20,80 L-20,40 L-20,-40 L-20,-80 C-20,-90 -40,-90 -40,-80 Z" fill="#333" />
      
      <!-- Watch face -->
      <rect x="-60" y="-60" width="80" height="120" rx="10" fill="#4169E1" />
      <rect x="-50" y="-50" width="60" height="100" rx="5" fill="#1E90FF" />
      
      <!-- Watch screen -->
      <rect x="-40" y="-40" width="40" height="80" rx="5" fill="#fff" opacity="0.9" />
      
      <!-- Watch elements -->
      <rect x="-35" y="-30" width="30" height="5" rx="2" fill="#4169E1" opacity="0.5" />
      <rect x="-35" y="-20" width="20" height="5" rx="2" fill="#4169E1" opacity="0.5" />
      <circle cx="-20" cy="20" r="15" fill="#4169E1" opacity="0.3" />
    </g>
    
    <!-- Smartwatch 2 -->
    <g transform="translate(100, 0) rotate(15)">
      <!-- Watch band -->
      <path d="M-30,-70 L-30,-40 L-30,40 L-30,70 C-30,80 -10,80 -10,70 L-10,40 L-10,-40 L-10,-70 C-10,-80 -30,-80 -30,-70 Z" fill="#444" />
      
      <!-- Watch face -->
      <rect x="-50" y="-50" width="70" height="100" rx="15" fill="#1E90FF" />
      <rect x="-40" y="-40" width="50" height="80" rx="10" fill="#4169E1" />
      
      <!-- Watch screen -->
      <rect x="-30" y="-30" width="30" height="60" rx="5" fill="#fff" opacity="0.9" />
      
      <!-- Watch elements -->
      <rect x="-25" y="-20" width="20" height="4" rx="2" fill="#1E90FF" opacity="0.5" />
      <rect x="-25" y="-10" width="15" height="4" rx="2" fill="#1E90FF" opacity="0.5" />
      <circle cx="-15" cy="15" r="10" fill="#1E90FF" opacity="0.3" />
    </g>
  </g>
</svg>`,

        gaming: `<svg viewBox="0 0 1400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="gaming-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#800080;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#BA55D3;stop-opacity:0.8" />
    </linearGradient>
    <pattern id="gaming-pattern" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <circle cx="30" cy="30" r="3" fill="white" fill-opacity="0.1" />
    </pattern>
  </defs>
  
  <!-- Main background -->
  <rect width="100%" height="100%" fill="url(#gaming-bg)" />
  
  <!-- Pattern overlay -->
  <rect width="100%" height="100%" fill="url(#gaming-pattern)" />
  
  <!-- Gaming console illustrations -->
  <g transform="translate(1050, 150) scale(0.9)">
    <!-- Game console -->
    <rect x="-120" y="-40" width="240" height="80" rx="10" fill="#333" />
    <rect x="-110" y="-30" width="220" height="60" rx="5" fill="#800080" />
    <rect x="-100" y="-20" width="200" height="40" rx="5" fill="#BA55D3" opacity="0.7" />
    
    <!-- Controller 1 -->
    <g transform="translate(-150, 60)">
      <rect x="-30" y="-20" width="60" height="40" rx="20" fill="#444" />
      <circle cx="-15" cy="0" r="10" fill="#800080" />
      <circle cx="15" cy="0" r="10" fill="#BA55D3" />
      <rect x="-25" y="-15" width="50" height="30" rx="5" fill="#333" opacity="0.5" />
    </g>
    
    <!-- Controller 2 -->
    <g transform="translate(150, 60)">
      <rect x="-30" y="-20" width="60" height="40" rx="20" fill="#444" />
      <circle cx="-15" cy="0" r="10" fill="#800080" />
      <circle cx="15" cy="0" r="10" fill="#BA55D3" />
      <rect x="-25" y="-15" width="50" height="30" rx="5" fill="#333" opacity="0.5" />
    </g>
  </g>
  
</svg>`,

        accessories: `<svg viewBox="0 0 1400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="accessories-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#008080;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#20B2AA;stop-opacity:0.8" />
    </linearGradient>
    <pattern id="accessories-pattern" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <circle cx="30" cy="30" r="3" fill="white" fill-opacity="0.1" />
    </pattern>
  </defs>
  
  <!-- Main background -->
  <rect width="100%" height="100%" fill="url(#accessories-bg)" />
  
  <!-- Pattern overlay -->
  <rect width="100%" height="100%" fill="url(#accessories-pattern)" />
  
  <!-- Accessories illustrations -->
  <g transform="translate(1050, 150) scale(0.8)">
    <!-- Mouse -->
    <g transform="translate(-150, 0)">
      <path d="M-30,-40 C-40,-40 -50,-20 -50,0 C-50,30 -40,50 -20,50 C0,50 20,40 20,0 C20,-20 10,-40 -30,-40 Z" fill="#333" />
      <path d="M-25,-35 C-35,-35 -45,-20 -45,0 C-45,25 -35,45 -20,45 C0,45 15,35 15,0 C15,-20 5,-35 -25,-35 Z" fill="#008080" />
      <rect x="-30" y="-30" width="30" height="2" rx="1" fill="#fff" opacity="0.5" />
    </g>
    
    <!-- Keyboard -->
    <g transform="translate(50, 20)">
      <rect x="-100" y="-30" width="200" height="60" rx="5" fill="#333" />
      <rect x="-95" y="-25" width="190" height="50" rx="3" fill="#008080" />
      
      <!-- Keys -->
      <g>
        <rect x="-85" y="-20" width="170" height="40" rx="2" fill="#20B2AA" opacity="0.7" />
        <rect x="-80" y="-15" width="10" height="10" rx="2" fill="#fff" opacity="0.5" />
        <rect x="-65" y="-15" width="10" height="10" rx="2" fill="#fff" opacity="0.5" />
        <rect x="-50" y="-15" width="10" height="10" rx="2" fill="#fff" opacity="0.5" />
        <rect x="-35" y="-15" width="10" height="10" rx="2" fill="#fff" opacity="0.5" />
      </g>
    </g>
    
    <!-- Charger -->
    <g transform="translate(-50, -60)">
      <rect x="-20" y="-10" width="40" height="20" rx="2" fill="#444" />
      <rect x="-5" y="-10" width="10" height="20" fill="#20B2AA" opacity="0.8" />
      <path d="M0,10 L0,30" stroke="#333" stroke-width="3" />
    </g>
  </g>
  
 
</svg>`
    };
    
    // Category data - descriptions and banners
    const categoryData = {
        phones: {
            title: "Mobile Phones",
            description: "Discover our wide range of premium smartphones with cutting-edge technology.",
            class: "phones"
        },
        laptops: {
            title: "Laptops",
            description: "Powerful laptops for work, gaming, and creative projects.",
            class: "laptops"
        },
        headphones: {
            title: "Headphones",
            description: "Premium headphones with superior sound quality and comfort.",
            class: "headphones"
        },
        earbuds: {
            title: "Earbuds",
            description: "Wireless earbuds for an immersive audio experience on the go.",
            class: "earbuds"
        },
        tablets: {
            title: "Tablets",
            description: "Versatile tablets perfect for work, creativity, and entertainment.",
            class: "tablets"
        },
        smartwatches: {
            title: "Smartwatches",
            description: "Stay connected and track your fitness with our smartwatch collection.",
            class: "smartwatches"
        },
        gaming: {
            title: "Gaming",
            description: "Level up your gaming experience with our premium gaming products.",
            class: "gaming"
        },
        accessories: {
            title: "Accessories",
            description: "Essential accessories to enhance your tech experience.",
            class: "accessories"
        }
    };
    
    // Products database - this would normally come from a backend API
    const allProducts = [
        // Phones category
        {
            id: "p1",
            name: "TechNest iPhone 16 Pro Max",
            price: 219999,
            oldPrice: 225999,
            image: "images/iphone16W.png",
            category: "phones",
            rating: 4.5,
            reviews: 120,
            description: "The latest iPhone with A17 Pro chip, 48MP camera system, and stunning Super Retina XDR display.",
            features: ["6.7-inch display", "A17 Pro chip", "48MP camera", "Up to 29 hours video playback"],
            variations: ["Titanium Black", "Titanium White", "Titanium Blue"],
            hasColors: true,
            isNew: true,
            isBestseller: false,
            quantity: 15
        },
        {
            id: "p2",
            name: "TechNest Galaxy S25 Ultra",
            price: 199999,
            oldPrice: 209999,
            image: "images/s25.png",
            category: "phones",
            rating: 4.7,
            reviews: 98,
            description: "Flagship Android smartphone with 200MP camera, 8K video recording, and powerful Snapdragon processor.",
            features: ["6.8-inch Dynamic AMOLED", "Snapdragon 8 Gen 3", "200MP camera", "5000mAh battery"],
            variations: ["Cosmic Black", "Phantom Silver", "Emerald Green"],
            hasColors: true,
            isNew: true,
            isBestseller: false,
            quantity: 12
        },
        {
            id: "p3",
            name: "TechNest Pixel 9 Pro",
            price: 129999,
            oldPrice: 139999,
            image: "images/pixel9.png",
            category: "phones",
            rating: 4.6,
            reviews: 75,
            description: "Google's flagship phone with exceptional camera capabilities and pure Android experience.",
            features: ["6.5-inch OLED display", "Google Tensor G4", "50MP main camera", "24-hour battery life"],
            variations: ["Obsidian", "Snow", "Hazel"],
            hasColors: true,
            isNew: false,
            isBestseller: true,
            quantity: 8
        },
        {
            id: "p4",
            name: "TechNest Nothing Phone 3",
            price: 89999,
            oldPrice: 95999,
            image: "images/nothing3.png",
            category: "phones",
            rating: 4.3,
            reviews: 62,
            description: "Innovative design with transparent back, Glyph interface, and clean Android experience.",
            features: ["6.5-inch AMOLED display", "Snapdragon 8 Gen 2", "50MP Sony sensor", "Glyph Interface 2.0"],
            variations: ["Clear White", "Matte Black"],
            hasColors: true,
            isNew: true,
            isBestseller: false,
            quantity: 20
        },
        {
            id: "p5",
            name: "TechNest iPhone 16",
            price: 159999,
            oldPrice: 169999,
            image: "images/iphone16.png",
            category: "phones",
            rating: 4.4,
            reviews: 89,
            description: "Apple's newest iPhone with powerful performance, excellent camera, and iOS ecosystem.",
            features: ["6.1-inch display", "A17 chip", "Dual 12MP camera", "All-day battery life"],
            variations: ["White", "Black", "Blue", "Product Red"],
            hasColors: true,
            isNew: true,
            isBestseller: false,
            quantity: 25
        },
        
        // Headphones category
        {
            id: "h1",
            name: "TechNest Bass Boost 2.0",
            price: 68000,
            oldPrice: 70000,
            image: "images/headphone1.png",
            category: "headphones",
            rating: 5.0,
            reviews: 245,
            description: "Premium over-ear headphones with active noise cancellation and exceptional sound quality.",
            features: ["Active Noise Cancellation", "40mm drivers", "50-hour battery life", "Premium leather cushions"],
            variations: ["Matte Black", "Silver", "Midnight Blue"],
            hasColors: true,
            isNew: false,
            isBestseller: true,
            quantity: 18
        },
        {
            id: "h2",
            name: "TechNest SoundMax Pro",
            price: 54999,
            oldPrice: 59999,
            image: "images/headphone2.png",
            category: "headphones",
            rating: 4.7,
            reviews: 178,
            description: "Over-ear headphones with premium audio clarity and spatial sound technology.",
            features: ["Spatial Audio", "45mm titanium drivers", "40-hour battery life", "Memory foam ear cups"],
            variations: [], // No color variations
            hasColors: false,
            isNew: false,
            isBestseller: true,
            quantity: 15
        },
        {
            id: "h3",
            name: "TechNest Studio Pro",
            price: 75999,
            oldPrice: 82999,
            image: "images/headphone3.png",
            category: "headphones",
            rating: 4.8,
            reviews: 112,
            description: "Professional studio headphones with high-resolution audio and premium build quality.",
            features: ["Hi-Res Audio certified", "50mm beryllium drivers", "Wired connection", "Precision sound"],
            variations: [], // No color variations
            hasColors: false,
            isNew: true,
            isBestseller: false,
            quantity: 10
        },
        {
            id: "h4",
            name: "TechNest Active Sport",
            price: 42999,
            oldPrice: 47999,
            image: "images/headphone4.png",
            category: "headphones",
            rating: 4.5,
            reviews: 98,
            description: "Sweat-resistant headphones designed for active lifestyles and intense workouts.",
            features: ["IPX5 water resistance", "Secure fit", "30-hour battery life", "Quick charge"],
            variations: ["Black", "Neon Yellow"],
            hasColors: true,
            isNew: false,
            isBestseller: false,
            quantity: 22
        },
        
        // Earbuds category
        {
            id: "e1",
            name: "TechNest AirDots Pro",
            price: 24999,
            oldPrice: 27999,
            image: "images/earbud1.png",
            category: "earbuds",
            rating: 4.6,
            reviews: 210,
            description: "Premium wireless earbuds with active noise cancellation and crystal-clear sound.",
            features: ["ANC technology", "24-hour battery", "Wireless charging", "Touch controls"],
            variations: ["White", "Black", "Blue"],
            hasColors: true,
            isNew: true,
            isBestseller: false,
            quantity: 30
        },
        {
            id: "e2",
            name: "TechNest BassBuds",
            price: 16999,
            oldPrice: 19999,
            image: "images/earbud2.png",
            category: "earbuds",
            rating: 4.4,
            reviews: 165,
            description: "Wireless earbuds with enhanced bass and long battery life for music enthusiasts.",
            features: ["Deep bass", "20-hour battery", "IPX4 water resistance", "Bluetooth 5.2"],
            variations: [], // No color variations
            hasColors: false,
            isNew: false,
            isBestseller: true,
            quantity: 25
        },
        {
            id: "e3",
            name: "TechNest Sport Wireless",
            price: 12999,
            oldPrice: 14999,
            image: "images/earbud3.png",
            category: "earbuds",
            rating: 4.3,
            reviews: 142,
            description: "Sport-focused wireless earbuds with secure fit and sweat resistance for workouts.",
            features: ["Secure ear hooks", "IPX6 water resistance", "15-hour battery", "Quick charge"],
            variations: ["Black/Red", "White/Blue"],
            hasColors: true,
            isNew: false,
            isBestseller: false,
            quantity: 40
        },
        
        // Laptops category
        {
            id: "l1",
            name: "TechNest MacBook Pro 16",
            price: 349999,
            oldPrice: 369999,
            image: "images/laptop1.png",
            category: "laptops",
            rating: 4.9,
            reviews: 132,
            description: "Powerful MacBook Pro with M3 chip, stunning Retina display, and all-day battery life.",
            features: ["16-inch Retina display", "M3 Pro/Max chip", "Up to 32GB RAM", "Up to 8TB storage"],
            variations: ["Space Gray", "Silver"],
            hasColors: true,
            isNew: true,
            isBestseller: false,
            quantity: 12
        },
        {
            id: "l2",
            name: "TechNest UltraBook X1",
            price: 219999,
            oldPrice: 229999,
            image: "images/laptop2.png",
            category: "laptops",
            rating: 4.7,
            reviews: 98,
            description: "Ultra-thin and lightweight laptop with premium performance for professionals.",
            features: ["14-inch 4K display", "Intel Core i7", "16GB RAM", "1TB SSD"],
            variations: [], // No color variations
            hasColors: false,
            isNew: false,
            isBestseller: true,
            quantity: 15
        },
        {
            id: "l3",
            name: "TechNest Gaming Beast",
            price: 289999,
            oldPrice: 309999,
            image: "images/laptop3.png",
            category: "laptops",
            rating: 4.8,
            reviews: 118,
            description: "High-performance gaming laptop with RTX graphics and high refresh rate display.",
            features: ["17.3-inch 165Hz display", "AMD Ryzen 9", "RTX 4080", "32GB RAM"],
            variations: [], // No color variations
            hasColors: false,
            isNew: true,
            isBestseller: false,
            quantity: 10
        },
        {
            id: "l4",
            name: "TechNest Chromebook Plus",
            price: 79999,
            oldPrice: 84999,
            image: "images/laptop4.png",
            category: "laptops",
            rating: 4.5,
            reviews: 87,
            description: "Affordable Chromebook with excellent battery life and premium build quality.",
            features: ["13.3-inch FHD display", "Intel Core i3", "8GB RAM", "128GB storage"],
            variations: ["Silver", "Midnight Blue"],
            hasColors: true,
            isNew: false,
            isBestseller: false,
            quantity: 20
        },
        
        // Tablets category
        {
            id: "t1",
            name: "TechNest iPad Pro 12.9",
            price: 189999,
            oldPrice: 199999,
            image: "images/tablet1.png",
            category: "tablets",
            rating: 4.9,
            reviews: 156,
            description: "Powerful iPad Pro with M2 chip, stunning Liquid Retina XDR display, and Apple Pencil support.",
            features: ["12.9-inch Liquid Retina XDR", "M2 chip", "Face ID", "All-day battery"],
            variations: ["Space Gray", "Silver"],
            hasColors: true,
            isNew: true,
            isBestseller: false,
            quantity: 15
        },
        {
            id: "t2",
            name: "TechNest Galaxy Tab Ultra",
            price: 119999,
            oldPrice: 129999,
            image: "images/tablet2.png",
            category: "tablets",
            rating: 4.7,
            reviews: 124,
            description: "Premium Android tablet with S Pen support, vibrant AMOLED display, and powerful performance.",
            features: ["11-inch AMOLED", "Snapdragon 8 Gen 2", "8GB RAM", "256GB storage"],
            variations: [], // No color variations
            hasColors: false,
            isNew: false,
            isBestseller: true,
            quantity: 18
        },
        {
            id: "t3",
            name: "TechNest Budget Tab",
            price: 39999,
            oldPrice: 44999,
            image: "images/tablet3.png",
            category: "tablets",
            rating: 4.4,
            reviews: 98,
            description: "Affordable tablet with solid performance for everyday tasks and entertainment.",
            features: ["10.1-inch display", "MediaTek processor", "4GB RAM", "64GB storage"],
            variations: [], // No color variations
            hasColors: false,
            isNew: false,
            isBestseller: false,
            quantity: 25
        },
        
        // Smartwatches category
        {
            id: "sw1",
            name: "TechNest Watch Series 9",
            price: 79999,
            oldPrice: 84999,
            image: "images/smartwatch1.png",
            category: "smartwatches",
            rating: 4.8,
            reviews: 145,
            description: "Advanced smartwatch with health monitoring, GPS, and stunning always-on display.",
            features: ["ECG monitoring", "Blood oxygen sensor", "Always-on display", "18-hour battery"],
            variations: ["Silver", "Black", "Gold"],
            hasColors: true,
            isNew: true,
            isBestseller: false,
            quantity: 20
        },
        {
            id: "sw2",
            name: "TechNest Fitness Pro",
            price: 44999,
            oldPrice: 49999,
            image: "images/smartwatch2.png",
            category: "smartwatches",
            rating: 4.6,
            reviews: 128,
            description: "Fitness-focused smartwatch with advanced workout tracking and durable design.",
            features: ["Heart rate monitoring", "GPS tracking", "50+ workout modes", "7-day battery"],
            variations: [], // No color variations
            hasColors: false,
            isNew: false,
            isBestseller: true,
            quantity: 25
        },
        {
            id: "sw3",
            name: "TechNest Smart Band",
            price: 12999,
            oldPrice: 14999,
            image: "images/smartwatch3.png",
            category: "smartwatches",
            rating: 4.5,
            reviews: 185,
            description: "Affordable smart band with essential health and fitness tracking features.",
            features: ["Heart rate monitor", "Step tracking", "Sleep analysis", "14-day battery"],
            variations: ["Black", "Blue", "Red"],
            hasColors: true,
            isNew: false,
            isBestseller: false,
            quantity: 35
        },
        
        // Gaming category
        {
            id: "g1",
            name: "TechNest Edge PS5",
            price: 75000,
            oldPrice: 79999,
            image: "images/ps5.png",
            category: "gaming",
            rating: 4.9,
            reviews: 215,
            description: "Next-generation gaming console with ultra-fast SSD, ray tracing, and immersive controller.",
            features: ["Custom AMD Ryzen CPU", "10.28 TFLOPs GPU", "825GB SSD", "4K gaming at up to 120fps"],
            variations: [], // No color variations
            hasColors: false,
            isNew: false,
            isBestseller: true,
            quantity: 10
        },
        {
            id: "g2",
            name: "TechNest Xbox Series X",
            price: 69999,
            oldPrice: 74999,
            image: "images/xbox.png",
            category: "gaming",
            rating: 4.8,
            reviews: 198,
            description: "Powerful gaming console with fast load times, high frame rates, and Game Pass.",
            features: ["12 TFLOPs GPU", "1TB SSD", "4K gaming", "Quick Resume"],
            variations: [], // No color variations
            hasColors: false,
            isNew: false,
            isBestseller: false,
            quantity: 12
        },
        {
            id: "g3",
            name: "TechNest Gaming Controller Pro",
            price: 12999,
            oldPrice: 14999,
            image: "images/controller.png",
            category: "gaming",
            rating: 4.7,
            reviews: 156,
            description: "Premium gaming controller with customizable buttons and excellent ergonomics.",
            features: ["Programmable buttons", "Wireless", "Adjustable triggers", "20-hour battery"],
            variations: ["Black", "White", "Red"],
            hasColors: true,
            isNew: true,
            isBestseller: false,
            quantity: 30
        },
        {
            id: "g4",
            name: "TechNest VR Headset",
            price: 59999,
            oldPrice: 64999,
            image: "images/vr.png",
            category: "gaming",
            rating: 4.6,
            reviews: 124,
            description: "Immersive VR headset with high-resolution display and motion tracking.",
            features: ["4K resolution per eye", "120Hz refresh rate", "6DOF tracking", "Wi-Fi 6"],
            variations: [], // No color variations
            hasColors: false,
            isNew: true,
            isBestseller: false,
            quantity: 15
        },
        
        // Accessories category
        {
            id: "a1",
            name: "TechNest Gaming Mouse",
            price: 4500,
            oldPrice: 5200,
            image: "images/mouse.png",
            category: "accessories",
            rating: 4.7,
            reviews: 175,
            description: "High-precision gaming mouse with customizable RGB lighting and programmable buttons.",
            features: ["25,000 DPI sensor", "8 programmable buttons", "RGB lighting", "Lightweight design"],
            variations: ["Black", "White"],
            hasColors: true,
            isNew: false,
            isBestseller: false,
            quantity: 35
        },
        {
            id: "a2",
            name: "TechNest Mechanical Keyboard",
            price: 9999,
            oldPrice: 11999,
            image: "images/keyboard.png",
            category: "accessories",
            rating: 4.8,
            reviews: 145,
            description: "Premium mechanical keyboard with RGB lighting and customizable switches.",
            features: ["Cherry MX switches", "Per-key RGB", "Aluminum frame", "Programmable macros"],
            variations: [], // No color variations
            hasColors: false,
            isNew: true,
            isBestseller: false,
            quantity: 25
        },
        {
            id: "a3",
            name: "TechNest Ultra Dock",
            price: 8499,
            oldPrice: 9999,
            image: "images/dock.png",
            category: "accessories",
            rating: 4.6,
            reviews: 112,
            description: "Versatile USB-C dock with multiple ports for expanded connectivity.",
            features: ["HDMI output", "Ethernet port", "SD card reader", "USB-A and USB-C ports"],
            variations: [], // No color variations
            hasColors: false,
            isNew: false,
            isBestseller: true,
            quantity: 20
        },
        {
            id: "a4",
            name: "TechNest Fast Charge Pro",
            price: 2999,
            oldPrice: 3499,
            image: "images/charger.png",
            category: "accessories",
            rating: 4.5,
            reviews: 135,
            description: "65W GaN charger with multiple ports for fast charging multiple devices.",
            features: ["65W output", "3 USB ports", "Compact size", "Universal compatibility"],
            variations: ["White", "Black"],
            hasColors: true,
            isNew: false,
            isBestseller: false,
            quantity: 40
        },
        {
            id: "a5",
            name: "TechNest Premium Laptop Bag",
            price: 3999,
            oldPrice: 4599,
            image: "images/bag.png",
            category: "accessories",
            rating: 4.4,
            reviews: 89,
            description: "Stylish and protective laptop bag with multiple compartments and water resistance.",
            features: ["Fits up to 16-inch laptops", "Water-resistant", "RFID protection", "Padded straps"],
            variations: [], // No color variations
            hasColors: false,
            isNew: false,
            isBestseller: false,
            quantity: 30
        }
    ];
    
    // Update cart and wishlist counts
    updateCartCount();
    updateWishlistCount();
    
    // Initialize the page
    init();
    
    function init() {
        if (!categoryParam || !categoryData[categoryParam]) {
            // Show "Category not found" message or redirect to categories page
            showCategoryNotFound();
            return;
        }
        
        // Set up page for the selected category
        setupCategoryPage(categoryParam);
        
        // Set up event listeners
        setupEventListeners();
        
        // Load products for the selected category
        loadCategoryProducts(categoryParam);
        
        // Load related categories
        loadRelatedCategories(categoryParam);
    }
    
    function setupCategoryPage(category) {
        const data = categoryData[category];
        
        // Update page title and description
        document.title = `TechNest - ${data.title}`;
        categoryTitle.textContent = data.title;
        categoryDescription.textContent = data.description;
        categoryNameBreadcrumb.textContent = data.title;
        
        // Add category-specific class to banner for custom styling
        categoryBanner.classList.add(data.class);
        
        // Add SVG banner if available
        if (svgBanners[category]) {
            // First clear any existing SVG
            const existingSvg = categoryBanner.querySelector('.svg-background');
            if (existingSvg) {
                existingSvg.remove();
            }
            
            // Create SVG container and add to banner
            const svgContainer = document.createElement('div');
            svgContainer.className = 'svg-background';
            svgContainer.innerHTML = svgBanners[category];
            categoryBanner.insertBefore(svgContainer, categoryBanner.firstChild);
        }
        
        // Add product count to the banner
        const categoryProducts = allProducts.filter(product => product.category === category);
        const productCountBadge = document.createElement('div');
        productCountBadge.className = 'product-count-badge';
        productCountBadge.textContent = `${categoryProducts.length} Products`;
        
        // Check if productCountBadge already exists
        const existingBadge = categoryBanner.querySelector('.product-count-badge');
        if (existingBadge) {
            existingBadge.textContent = `${categoryProducts.length} Products`;
        } else {
            categoryDescription.insertAdjacentElement('afterend', productCountBadge);
        }
    }
    
    function setupEventListeners() {
        // Sort by dropdown
        if (sortBySelect) {
            sortBySelect.addEventListener('change', function() {
                currentPage = 1;
                loadCategoryProducts(categoryParam);
            });
        }
        
        // Price range filter
        if (priceRangeSelect) {
            priceRangeSelect.addEventListener('change', function() {
                currentPage = 1;
                loadCategoryProducts(categoryParam);
            });
        }
        
        // Reset filters button
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', function() {
                resetFilters();
            });
        }
        
        // Close modal button
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                quickViewModal.style.display = 'none';
                overlay.style.display = 'none';
            });
        }
        
        // Cart sidebar close button
        if (closeCart) {
            closeCart.addEventListener('click', function() {
                cartSidebar.style.right = '-400px';
                overlay.style.display = 'none';
            });
        }
        
        // Continue shopping button
        if (continueShopping) {
            continueShopping.addEventListener('click', function() {
                cartSidebar.style.right = '-400px';
                overlay.style.display = 'none';
            });
        }
        
        // Wishlist sidebar close button
        if (closeWishlist) {
            closeWishlist.addEventListener('click', function() {
                wishlistSidebar.style.right = '-400px';
                overlay.style.display = 'none';
            });
        }
        
        // Clear wishlist button
        if (clearWishlistBtn) {
            clearWishlistBtn.addEventListener('click', function() {
                clearWishlist();
            });
        }
        
        // Overlay click to close modals/sidebars
        if (overlay) {
            overlay.addEventListener('click', function() {
                if (quickViewModal) quickViewModal.style.display = 'none';
                if (cartSidebar) cartSidebar.style.right = '-400px';
                if (wishlistSidebar) wishlistSidebar.style.right = '-400px';
                overlay.style.display = 'none';
            });
        }
    }
    
    function resetFilters() {
        // Reset filter dropdowns
        if (sortBySelect) sortBySelect.value = 'popularity';
        if (priceRangeSelect) priceRangeSelect.value = 'all';
        
        // Reset to first page and reload products
        currentPage = 1;
        loadCategoryProducts(categoryParam);
        
        // Show notification
        showNotification('Filters have been reset', 'info');
    }
    
    function loadCategoryProducts(category) {
        // Filter products by category
        let filteredProducts = allProducts.filter(product => product.category === category);
        
        // Apply price range filter
        if (priceRangeSelect && priceRangeSelect.value !== 'all') {
            const priceRange = priceRangeSelect.value;
            
            filteredProducts = filteredProducts.filter(product => {
                const price = product.price;
                
                switch (priceRange) {
                    case '0-20000':
                        return price < 20000;
                    case '20000-50000':
                        return price >= 20000 && price <= 50000;
                    case '50000-100000':
                        return price > 50000 && price <= 100000;
                    case '100000+':
                        return price > 100000;
                    default:
                        return true;
                }
            });
        }
        
        // Apply sorting
        if (sortBySelect) {
            const sortValue = sortBySelect.value;
            
            switch (sortValue) {
                case 'popularity':
                    // Sort by reviews count (as a proxy for popularity)
                    filteredProducts.sort((a, b) => b.reviews - a.reviews);
                    break;
                    
                case 'price-asc':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                    
                case 'price-desc':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                    
                case 'newest':
                    // Sort by isNew flag
                    filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                    break;
                    
                default:
                    // Default to popularity
                    filteredProducts.sort((a, b) => b.reviews - a.reviews);
                    break;
            }
        }
        
        // Calculate pagination
        const totalProducts = filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / itemsPerPage);
        
        // Get products for current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalProducts);
        const currentPageProducts = filteredProducts.slice(startIndex, endIndex);
        
        // Display products
        displayProducts(currentPageProducts, totalProducts);
        
        // Update pagination
        updatePagination(totalPages);
    }
    
    function displayProducts(products, totalCount) {
        // Clear the product grid
        productGrid.innerHTML = '';
        
        if (products.length === 0) {
            // Show no products message
            productGrid.innerHTML = `
                <div class="no-products-message">
                    <div class="no-products-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>No Products Found</h3>
                    <p>We couldn't find any products matching your filters. Try adjusting your criteria or browse our other categories.</p>
                    <button id="reset-search-btn" class="btn secondary-btn">Reset Filters</button>
                </div>
            `;
            
            // Add event listener to reset button
            const resetSearchBtn = document.getElementById('reset-search-btn');
            if (resetSearchBtn) {
                resetSearchBtn.addEventListener('click', resetFilters);
            }
            
            return;
        }
        
        // Loop through products and create product cards
        products.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });
        
        // Initialize wishlist icons
        initializeWishlistIcons();
        
        // Setup event listeners for product cards
        setupProductCardEventListeners();
    }
    
    function createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        productCard.dataset.name = product.name;
        productCard.dataset.price = product.price;
        productCard.dataset.image = product.image;
        productCard.dataset.category = product.category;
        productCard.dataset.hasColors = product.hasColors; // Adding hasColors to data attributes
        
        // Create badge if product is new or bestseller
        let badgeHTML = '';
        if (product.isNew) {
            badgeHTML = '<div class="product-badge">New</div>';
        } else if (product.isBestseller) {
            badgeHTML = '<div class="product-badge bestseller">Bestseller</div>';
        }
        
        // Calculate discount percentage if old price exists
        if (product.oldPrice) {
            const discountPercent = Math.round((product.oldPrice - product.price) / product.oldPrice * 100);
            if (discountPercent >= 10) {
                badgeHTML = `<div class="product-badge sale">-${discountPercent}%</div>`;
            }
        }
        
        // Create rating stars
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 >= 0.5;
        
        let ratingHTML = '';
        for (let i = 0; i < fullStars; i++) {
            ratingHTML += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            ratingHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            ratingHTML += '<i class="far fa-star"></i>';
        }
        
        // Format price with commas
        const formattedPrice = product.price.toLocaleString('en-IN');
        const formattedOldPrice = product.oldPrice ? product.oldPrice.toLocaleString('en-IN') : '';
        
        // Create HTML for old price if it exists
        const oldPriceHTML = product.oldPrice ? `<span class="old-price">৳${formattedOldPrice}</span>` : '';
        
        // Check if product is in wishlist
        const isInWishlist = wishlist.some(item => item.id === product.id);
        const wishlistIconClass = isInWishlist ? 'fas' : 'far';
        
        productCard.innerHTML = `
            ${badgeHTML}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <a href="#" class="quick-view"><i class="fas fa-eye"></i></a>
                    <a href="#" class="add-to-wishlist"><i class="${wishlistIconClass} fa-heart"></i></a>
                    <a href="#" class="add-to-cart"><i class="fas fa-shopping-cart"></i></a>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">
                    ${ratingHTML}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">৳${formattedPrice}</span>
                    ${oldPriceHTML}
                </div>
            </div>
        `;
        
        return productCard;
    }
    
    function setupProductCardEventListeners() {
        // Quick View buttons
        document.querySelectorAll('.product-card .quick-view').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productCard = this.closest('.product-card');
                if (productCard) {
                    openQuickView(productCard);
                }
            });
        });
        
        // Add to Cart buttons
        document.querySelectorAll('.product-card .add-to-cart').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productCard = this.closest('.product-card');
                if (productCard) {
                    addToCart(productCard);
                }
            });
        });
        
        // Add to Wishlist buttons
        document.querySelectorAll('.product-card .add-to-wishlist').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productCard = this.closest('.product-card');
                if (productCard) {
                    toggleWishlist(productCard);
                }
            });
        });
    }
    
    function updatePagination(totalPages) {
        // Clear pagination container
        paginationContainer.innerHTML = '';
        
        // Don't show pagination if there's only one page
        if (totalPages <= 1) {
            return;
        }
        
        // Add prev button
        const prevBtn = document.createElement('button');
        prevBtn.className = `page-btn prev ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = '<i class="fas fa-angle-left"></i>';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                loadCategoryProducts(categoryParam);
                
                // Scroll to top of product grid
                productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        paginationContainer.appendChild(prevBtn);
        
        // Determine page buttons to show
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4 && startPage > 1) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Add page buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                loadCategoryProducts(categoryParam);
                
                // Scroll to top of product grid
                productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            paginationContainer.appendChild(pageBtn);
        }
        
        // Add next button
        const nextBtn = document.createElement('button');
        nextBtn.className = `page-btn next ${currentPage === totalPages ? 'disabled' : ''}`;
        nextBtn.innerHTML = '<i class="fas fa-angle-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                loadCategoryProducts(categoryParam);
                
                // Scroll to top of product grid
                productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        paginationContainer.appendChild(nextBtn);
    }
    
    function loadRelatedCategories(currentCategory) {
        // Get categories except the current one
        const categories = Object.keys(categoryData).filter(cat => cat !== currentCategory);
        
        // Shuffle array to get random categories
        const shuffledCategories = categories.sort(() => 0.5 - Math.random());
        
        // Take first 3 categories
        const relatedCategories = shuffledCategories.slice(0, 3);
        
        // Clear the grid
        relatedCategoriesGrid.innerHTML = '';
        
        // Add related category cards
        relatedCategories.forEach(category => {
            const categoryInfo = categoryData[category];
            const categoryCard = document.createElement('div');
            categoryCard.className = 'related-category-card';
            
            categoryCard.innerHTML = `
                <div class="related-category-image">
                    <img src="images/${category}.png" onerror="this.src='images/placeholder.png'" alt="${categoryInfo.title}">
                </div>
                <div class="related-category-content">
                    <h3>${categoryInfo.title}</h3>
                    <p>${getCategoryProductCount(category)} Products</p>
                    <a href="category.html?category=${category}" class="view-category-btn">View Category</a>
                </div>
            `;
            
            relatedCategoriesGrid.appendChild(categoryCard);
        });
    }
    
    function getCategoryProductCount(category) {
        return allProducts.filter(product => product.category === category).length;
    }
    
    function showCategoryNotFound() {
        // Update page title
        document.title = 'TechNest - Category Not Found';
        
        // Update banner content
        categoryTitle.textContent = 'Category Not Found';
        categoryDescription.textContent = 'The requested category does not exist.';
        
        // Hide product grid and show error message
        productGrid.innerHTML = `
            <div class="no-products-message">
                <div class="no-products-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h3>Category Not Found</h3>
                <p>The category you're looking for doesn't exist or has been removed.</p>
                <a href="categories.html" class="btn primary-btn">View All Categories</a>
            </div>
        `;
        
        // Hide filters and pagination
        document.querySelector('.products-header').style.display = 'none';
        paginationContainer.style.display = 'none';
        
        // Hide related categories section
        document.querySelector('.related-categories').style.display = 'none';
    }
    
    // Modal functions
    function openQuickView(productCard) {
        const modal = document.getElementById('quickViewModal');
        if (!modal || !productCard) return;
        
        // Get product data
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        const hasColors = productCard.dataset.hasColors === 'true'; // Convert string to boolean
        
        // Get full product data
        const product = allProducts.find(p => p.id === productId);
        
        if (!product) return;
        
        // Populate modal
        const modalImage = modal.querySelector('.product-quick-view-image img');
        const modalTitle = modal.querySelector('h2');
        const modalRating = modal.querySelector('.product-rating');
        const modalPrice = modal.querySelector('.current-price');
        const modalOldPrice = modal.querySelector('.old-price');
        const modalDiscount = modal.querySelector('.discount');
        const modalDescription = modal.querySelector('.product-description p');
        const colorsContainer = modal.querySelector('.product-colors');
        
        if (modalImage) modalImage.src = productImage;
        if (modalTitle) modalTitle.textContent = productName;
        if (modalDescription) modalDescription.textContent = product.description;
        
        // Update price and old price
        if (modalPrice) modalPrice.textContent = `৳${product.price.toLocaleString('en-IN')}`;
        
        if (product.oldPrice) {
            if (modalOldPrice) {
                modalOldPrice.textContent = `৳${product.oldPrice.toLocaleString('en-IN')}`;
                modalOldPrice.style.display = 'inline';
            }
            
            // Calculate discount
            const discountPercent = Math.round((product.oldPrice - product.price) / product.oldPrice * 100);
            if (modalDiscount) {
                modalDiscount.textContent = `-${discountPercent}%`;
                modalDiscount.style.display = 'inline';
            }
        } else {
            if (modalOldPrice) modalOldPrice.style.display = 'none';
            if (modalDiscount) modalDiscount.style.display = 'none';
        }
        
        // Update rating stars
        if (modalRating) {
            const fullStars = Math.floor(product.rating);
            const hasHalfStar = product.rating % 1 >= 0.5;
            
            let ratingHTML = '';
            for (let i = 0; i < fullStars; i++) {
                ratingHTML += '<i class="fas fa-star"></i>';
            }
            
            if (hasHalfStar) {
                ratingHTML += '<i class="fas fa-star-half-alt"></i>';
            }
            
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            for (let i = 0; i < emptyStars; i++) {
                ratingHTML += '<i class="far fa-star"></i>';
            }
            
            ratingHTML += `<span>(${product.reviews} reviews)</span>`;
            modalRating.innerHTML = ratingHTML;
        }
        
        // Hide/show color options based on product configuration
        if (colorsContainer) {
            if (product.hasColors && product.variations && product.variations.length > 0) {
                colorsContainer.style.display = 'block';
            } else {
                colorsContainer.style.display = 'none';
            }
        }
        
        // Store product data in modal for add to cart functionality
        modal.dataset.id = productId;
        modal.dataset.name = productName;
        modal.dataset.price = productPrice;
        modal.dataset.image = productImage;
        modal.dataset.hasColors = product.hasColors; // Store hasColors in the modal
        
        // Setup buttons and color options
        setupModalButtons(modal, product);
        
        // Show modal
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }
    
    function setupModalButtons(modal, product) {
        const addToCartBtn = modal.querySelector('.add-to-cart-btn');
        const buyNowBtn = modal.querySelector('.buy-now-btn');
        const quantityInput = modal.querySelector('.quantity-selector input');
        const colorsContainer = modal.querySelector('.product-colors');
        const colorOptions = modal.querySelectorAll('.color-option');
        
        // Reset quantity input
        if (quantityInput) quantityInput.value = 1;
        
        // Setup quantity buttons
        const minusBtn = modal.querySelector('.quantity-btn.minus');
        const plusBtn = modal.querySelector('.quantity-btn.plus');
        
        if (minusBtn) {
            minusBtn.onclick = () => {
                const currentValue = parseInt(quantityInput.value);
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            };
        }
        
        if (plusBtn) {
            plusBtn.onclick = () => {
                const currentValue = parseInt(quantityInput.value);
                if (currentValue < 10) {
                    quantityInput.value = currentValue + 1;
                }
            };
        }
        
        // Show/hide color options based on product configuration
        if (colorsContainer) {
            if (product.hasColors && product.variations && product.variations.length > 0) {
                colorsContainer.style.display = 'block';
                
                // Reset and setup color options
                colorOptions.forEach(option => {
                    // Reset active state
                    option.classList.remove('active');
                    
                    // Set white as default for products with colors
                    if (option.classList.contains('white')) {
                        option.classList.add('active');
                    }
                    
                    // Add click event for color change
                    option.onclick = () => {
                        colorOptions.forEach(opt => opt.classList.remove('active'));
                        option.classList.add('active');
                        
                        // Change product image based on color selection
                        changeProductImageColor(option, modal);
                    };
                });
            } else {
                // Hide color options for products without colors
                colorsContainer.style.display = 'none';
            }
        }
        
        // Add to cart button
        if (addToCartBtn) {
            addToCartBtn.onclick = () => {
                addToCartFromModal();
                modal.style.display = 'none';
                overlay.style.display = 'none';
                
                // Show cart sidebar
                if (cartSidebar) {
                    cartSidebar.style.right = '0';
                    overlay.style.display = 'block';
                }
            };
        }
        
        // Buy now button
        if (buyNowBtn) {
            buyNowBtn.onclick = () => {
                // First add to cart
                addToCartFromModal();
                
                // Then redirect to checkout
                window.location.href = 'checkout.html';
            };
        }
    }
    
    // Function to change product image based on color selection
    function changeProductImageColor(colorOption, modal) {
        const productImage = modal.querySelector('.product-quick-view-image img');
        if (!productImage) return;
        
        // Get current image URL
        const currentImageUrl = productImage.src;
        
        // Extract base filename without extension
        const urlParts = currentImageUrl.split('.');
        const extension = urlParts.pop(); // Get extension (png, jpg, etc)
        let baseUrl = urlParts.join('.');
        
        // Remove any existing color suffixes (W, B, BL)
        baseUrl = baseUrl.replace(/W$|B$|BL$/i, '');
        
        // Determine color suffix based on selected color
        let colorSuffix = '';
        if (colorOption.classList.contains('white')) colorSuffix = 'W';
        else if (colorOption.classList.contains('black')) colorSuffix = 'B';
        else if (colorOption.classList.contains('blue')) colorSuffix = 'BL';
        else if (colorOption.classList.contains('red')) colorSuffix = 'R';
        
        // Create new image URL with color suffix
        const newImageUrl = `${baseUrl}${colorSuffix}.${extension}`;
        
        // Apply fade effect for smooth transition
        productImage.style.opacity = '0';
        
        // Set timeout for smooth transition
        setTimeout(() => {
            productImage.src = newImageUrl;
            productImage.style.opacity = '1';
            
            // Update modal data for cart
            modal.dataset.image = newImageUrl;
        }, 200);
    }
    
    // Cart and Wishlist Functions
    function addToCartFromModal() {
        const modal = quickViewModal;
        if (!modal) return;
        
        const productId = modal.dataset.id;
        const productName = modal.dataset.name;
        const productPrice = parseFloat(modal.dataset.price);
        const productImage = modal.dataset.image;
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
        addItemToCart(product);
    }
    
    // Initialize wishlist icons on page load
    function initializeWishlistIcons() {
        wishlist.forEach(item => {
            const productCard = document.querySelector(`.product-card[data-id="${item.id}"]`);
            if (productCard) {
                const heartIcon = productCard.querySelector('.add-to-wishlist i');
                if (heartIcon) {
                    heartIcon.classList.remove('far');
                    heartIcon.classList.add('fas');
                }
            }
        });
    }
    
    function addToCart(productCard) {
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        
        // Create product object
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        };
        
        // Add to cart
        addItemToCart(product);
    }
    
    function addItemToCart(product) {
        // Check if product is already in cart
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // Update quantity if product already exists in cart
            cart[existingItemIndex].quantity += product.quantity;
        } else {
            // Add new product to cart
            cart.push(product);
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        updateCartUI();
        
        // Show notification
        showNotification(`Added ${product.name} to cart!`, 'success');
    }
    
    function toggleWishlist(productCard) {
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        
        // Check if product is already in wishlist
        const existingItemIndex = wishlist.findIndex(item => item.id === productId);
        
        // Get heart icon
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
            showNotification(`Removed ${productName} from wishlist`, 'info');
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
    
    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        if (!cartCountElements.length) return;
        
        // Calculate total items in cart
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update all cart count badges
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            
            // Add animation
            element.style.animation = 'none';
            void element.offsetWidth; // Force reflow
            element.style.animation = 'cartCountPulse 0.5s ease';
        });
    }
    
    function updateWishlistCount() {
        const wishlistCountElements = document.querySelectorAll('.wishlist-count');
        if (!wishlistCountElements.length) return;
        
        // Update all wishlist count badges
        wishlistCountElements.forEach(element => {
            element.textContent = wishlist.length;
            
            // Add animation
            element.style.animation = 'none';
            void element.offsetWidth; // Force reflow
            element.style.animation = 'cartCountPulse 0.5s ease';
        });
    }
    
    function updateCartUI() {
        if (!cartItems || !cartTotal) return;
        
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
                    <a href="products.html" class="btn secondary-btn">Start Shopping</a>
                </div>
            `;
            
            // Update cart total
            cartTotal.textContent = '৳0.00';
            
            // Hide checkout button
            if (checkoutBtn) {
                checkoutBtn.style.display = 'none';
            }
        } else {
            // Add items to cart
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
                const minusBtn = cartItem.querySelector('.minus');
                const plusBtn = cartItem.querySelector('.plus');
                const quantityInput = cartItem.querySelector('input');
                const removeBtn = cartItem.querySelector('.remove-item');
                
                if (minusBtn) {
                    minusBtn.addEventListener('click', () => {
                        let currentValue = parseInt(quantityInput.value);
                        if (currentValue > 1) {
                            quantityInput.value = currentValue - 1;
                            updateCartItemQuantity(item.id, currentValue - 1);
                        }
                    });
                }
                
                if (plusBtn) {
                    plusBtn.addEventListener('click', () => {
                        let currentValue = parseInt(quantityInput.value);
                        if (currentValue < 10) {
                            quantityInput.value = currentValue + 1;
                            updateCartItemQuantity(item.id, currentValue + 1);
                        }
                    });
                }
                
                if (quantityInput) {
                    quantityInput.addEventListener('change', () => {
                        let value = parseInt(quantityInput.value);
                        // Ensure value is between 1 and 10
                        if (isNaN(value) || value < 1) value = 1;
                        if (value > 10) value = 10;
                        
                        quantityInput.value = value;
                        updateCartItemQuantity(item.id, value);
                    });
                }
                
                if (removeBtn) {
                    removeBtn.addEventListener('click', () => {
                        removeFromCart(item.id);
                    });
                }
            });
            
            // Update cart total
            updateCartTotal();
            
            // Show checkout button
            if (checkoutBtn) {
                checkoutBtn.style.display = 'block';
            }
        }
    }
    
    function updateWishlistUI() {
        if (!wishlistItems) return;
        
        // Clear wishlist items
        wishlistItems.innerHTML = '';
        
        if (wishlist.length === 0) {
            // Show empty wishlist message
            wishlistItems.innerHTML = `
                <div class="empty-wishlist">
                    <div class="empty-wishlist-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <p>Your wishlist is empty</p>
                    <a href="products.html" class="btn secondary-btn">Discover Products</a>
                </div>
            `;
            
            // Hide clear wishlist button
            if (clearWishlistBtn) {
                clearWishlistBtn.style.display = 'none';
            }
        } else {
            // Add wishlist items
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
                
                // Add event listeners
                const moveToCartBtn = wishlistItem.querySelector('.move-to-cart');
                const removeBtn = wishlistItem.querySelector('.remove-from-wishlist');
                
                if (moveToCartBtn) {
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
                        
                        // Show cart sidebar
                        if (wishlistSidebar) wishlistSidebar.style.right = '-400px';
                        if (cartSidebar) cartSidebar.style.right = '0';
                    });
                }
                
                if (removeBtn) {
                    removeBtn.addEventListener('click', () => {
                        removeFromWishlist(item.id);
                    });
                }
            });
            
            // Show clear wishlist button
            if (clearWishlistBtn) {
                clearWishlistBtn.style.display = 'block';
            }
        }
    }
    
    function updateCartItemQuantity(productId, quantity) {
        // Find item in cart
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            // Update quantity
            cart[itemIndex].quantity = quantity;
            
            // Update UI
            const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);
            if (cartItem) {
                const priceElement = cartItem.querySelector('.cart-item-price');
                if (priceElement) {
                    const itemPrice = cart[itemIndex].price * quantity;
                    priceElement.textContent = `৳${itemPrice.toLocaleString('en-IN')}`;
                }
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count and total
            updateCartCount();
            updateCartTotal();
        }
    }
    
    function updateCartTotal() {
        if (!cartTotal) return;
        
        // Calculate total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Update display with animation
        cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
        cartTotal.style.animation = 'none';
        void cartTotal.offsetWidth; // Force reflow
        cartTotal.style.animation = 'totalUpdate 0.5s ease';
    }
    
    function removeFromCart(productId) {
        // Find item index
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            // Get item for notification
            const itemName = cart[itemIndex].name;
            
            // Remove from cart
            cart.splice(itemIndex, 1);
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            updateCartUI();
            
            // Show notification
            showNotification(`Removed ${itemName} from cart`, 'info');
        }
    }
    
    function removeFromWishlist(productId) {
        // Find item index
        const itemIndex = wishlist.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            // Get item for notification
            const itemName = wishlist[itemIndex].name;
            
            // Remove from wishlist
            wishlist.splice(itemIndex, 1);
            
            // Save to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Update UI
            updateWishlistCount();
            updateWishlistUI();
            
            // Update wishlist icons on product cards
            const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
            if (productCard) {
                const heartIcon = productCard.querySelector('.add-to-wishlist i');
                if (heartIcon) {
                    heartIcon.classList.remove('fas');
                    heartIcon.classList.add('far');
                }
            }
            
            // Show notification
            showNotification(`Removed ${itemName} from wishlist`, 'info');
        }
    }
    
    function clearWishlist() {
        // Confirm before clearing
        if (wishlist.length === 0) return;
        
        // Clear wishlist array
        wishlist = [];
        
        // Save to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update UI
        updateWishlistCount();
        updateWishlistUI();
        
        // Update all wishlist icons on product cards
        document.querySelectorAll('.product-card .add-to-wishlist i.fas').forEach(icon => {
            icon.classList.remove('fas');
            icon.classList.add('far');
        });
        
        // Show notification
        showNotification('Your wishlist has been cleared', 'info');
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Set icon based on notification type
        let icon = '';
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'info':
            default:
                icon = '<i class="fas fa-info-circle"></i>';
                break;
        }
        
        // Set notification content
        notification.innerHTML = `
            <div class="notification-content">
                ${icon}
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Add close event
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.style.animation = 'notificationSlideOut 0.3s forwards';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });
        }
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'notificationSlideOut 0.3s forwards';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }
    
    // Handle Cart button in header
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (cartSidebar) {
                cartSidebar.style.right = '0';
                overlay.style.display = 'block';
            }
        });
    }
    
    // Handle Wishlist button in header
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (wishlistSidebar) {
                wishlistSidebar.style.right = '0';
                overlay.style.display = 'block';
            }
        });
    }
});