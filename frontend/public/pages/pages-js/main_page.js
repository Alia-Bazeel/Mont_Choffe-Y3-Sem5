/* ------------------------------
    1. HAMBURGER MENU TOGGLE
------------------------------ */

// Select key elements
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

// Toggle mobile menu
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('toggle');
        }
    });
}

/* ------------------------------
    2. SMOOTH SCROLL FOR NAV LINKS
------------------------------ */

// Select all nav links
const allLinks = document.querySelectorAll(
    '.main-nav-links a, .more-links a, .mobile-menu a'
);

// Add click event for smooth scrolling
allLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Allow normal behavior for external links or pages
        if (href.startsWith('pages/') || href.includes('.html')) {
            return;
        }

        // Prevent default only for same-page section links
        e.preventDefault();
        const targetID = href.substring(1);
        const targetSection = document.getElementById(targetID);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80, // Adjust for fixed header
                behavior: 'smooth'
            });
        }

        // Close mobile menu after clicking a link
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('toggle');
        }
    });
});

/* ------------------------------
    3. SHRINK HEADER WHILE SCROLLING
------------------------------ */

window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    const hamburger = document.querySelector(".hamburger");

    if (window.scrollY > 50) {
        header.classList.add("shrink");
        if (hamburger) {
            hamburger.style.display = "flex";
        }
    } else {
        header.classList.remove("shrink");
        if (hamburger) {
            hamburger.style.display = "none";
        }
    }
});

/* ------------------------------
    4. HEADER SEARCH FUNCTIONALITY
------------------------------ */

const searchInput = document.getElementById('headerSearch');
const searchBtn = document.getElementById('headerSearchBtn');

if (searchInput && searchBtn) {
    // Keyword mapping
    const pageMap = [
        { keywords: ['about', 'about us', 'who we are'], page: 'pages/about_us.html' },
        { keywords: ['products', 'shop', 'catalog'], page: 'pages/products.html' },
        { keywords: ['contact', 'contact us', 'support'], page: 'pages/contact_us.html' },
        { keywords: ['career', 'jobs', 'vacancy'], page: 'pages/career.html' },
        { keywords: ['recipes'], page: 'pages/recipes.html' },
        { keywords: ['pairings', 'pair our products'], page: 'pages/pairings.html' },
        { keywords: ['find us', 'locations', 'store'], page: 'pages/findUs.html' },
        { keywords: ['login', 'sign in', 'sign up'], page: 'pages/login.html' }
    ];

    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            searchInput.focus();
            return;
        }

        // Check current page
        const currentPath = window.location.pathname;
        const isProductsPage = currentPath.includes('products.html');

        if (isProductsPage) {
            // Filter products on products page
            filterProducts(query);
            return;
        }

        // Redirect based on keywords
        let redirected = false;
        for (let entry of pageMap) {
            if (entry.keywords.some(kw => query.includes(kw))) {
                window.location.href = entry.page;
                redirected = true;
                break;
            }
        }

        // Fallback: go to products page with query
        if (!redirected) {
            window.location.href = `pages/products.html?q=${encodeURIComponent(query)}`;
        }
    }

    // Filter products function
    function filterProducts(query) {
        const cards = document.querySelectorAll('.product-card');
        let found = false;
        
        cards.forEach(card => {
            const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.product-desc')?.textContent.toLowerCase() || '';
            
            if (name.includes(query) || desc.includes(query)) {
                card.style.display = 'flex';
                found = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show message if no results
        if (!found) {
            showNoResultsMessage(query);
        }
    }
    
    // Show no results message
    function showNoResultsMessage(query) {
        const grid = document.querySelector('.products-grid');
        if (!grid) return;
        
        // Remove existing message
        const existingMsg = grid.querySelector('.no-results');
        if (existingMsg) existingMsg.remove();
        
        // Add new message
        const message = document.createElement('div');
        message.className = 'no-results';
        message.style.gridColumn = '1 / -1';
        message.style.textAlign = 'center';
        message.style.padding = '40px';
        message.style.color = '#6b4a36';
        message.innerHTML = `
            <h3>No products found for "${query}"</h3>
            <p>Try a different search term or browse all products.</p>
        `;
        
        grid.appendChild(message);
    }

    // Trigger search on button click
    searchBtn.addEventListener('click', handleSearch);

    // Trigger search on Enter key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });
}

/* ------------------------------
    5. USER ICON DROPDOWN + AUTH STATE
------------------------------ */

// Update user dropdown based on login state
function updateUserMenu() {
    const userIcon = document.querySelector('.user-icon');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const signInLink = document.getElementById('signIn');
    const logoutBtn = document.getElementById('logoutBtn');
    const deleteAccBtn = document.getElementById('deleteAccBtn');
    
    if (!userIcon) return;
    
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    
    if (user) {
        // User is logged in
        if (usernameDisplay) usernameDisplay.textContent = `Hello, ${user.name}`;
        if (signInLink) signInLink.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (deleteAccBtn) deleteAccBtn.style.display = 'block';
    } else {
        // User is guest
        if (usernameDisplay) usernameDisplay.textContent = 'Hello, Guest';
        if (signInLink) signInLink.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (deleteAccBtn) deleteAccBtn.style.display = 'none';
    }
}

// Toggle dropdown menu
const userToggle = document.getElementById('userToggle');
const userMenu = document.getElementById('userMenu');
const userIcon = document.querySelector('.user-icon');

if (userToggle && userMenu) {
    userToggle.addEventListener('click', (e) => {
        e.preventDefault();
        userIcon.classList.toggle('show-menu');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userIcon.contains(e.target)) {
            userIcon.classList.remove('show-menu');
        }
    });
}

// Handle logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            updateUserMenu();
            if (userIcon) userIcon.classList.remove('show-menu');
            
            // Redirect to home page
            if (!window.location.pathname.includes('index.html')) {
                window.location.href = '../index.html';
            }
        }
    });
}

// Handle delete account
const deleteAccBtn = document.getElementById('deleteAccBtn');
if (deleteAccBtn) {
    deleteAccBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            // In a real app, you would call an API endpoint here
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            updateUserMenu();
            if (userIcon) userIcon.classList.remove('show-menu');
            alert('Account deleted successfully!');
            
            // Redirect to home page
            if (!window.location.pathname.includes('index.html')) {
                window.location.href = '../index.html';
            }
        }
    });
}

/* ------------------------------
    6. INITIALIZE PAGE
------------------------------ */

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Update user menu
    updateUserMenu();
    
    // Check for search query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    if (searchQuery && searchInput) {
        searchInput.value = searchQuery;
        if (window.location.pathname.includes('products.html')) {
            filterProducts(searchQuery.toLowerCase());
        }
    }
    
    // Add fade-in animation to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.opacity = '0';
        heroSection.style.transition = 'opacity 1s ease-in-out';
        
        setTimeout(() => {
            heroSection.style.opacity = '1';
        }, 300);
    }
});

/* ------------------------------
    7. ADD TO CART ANIMATION (for index page)
------------------------------ */

// Select all product card buttons on index page
const cartButtons = document.querySelectorAll('.product-card button');

// Loop through each button and add click event
cartButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Get product info
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('p').textContent;
        
        // Animation effect
        button.textContent = 'Added!';
        button.style.backgroundColor = '#FF6F61';
        button.style.color = '#fff';
        
        // Get existing cart or create new one
        let cart = JSON.parse(localStorage.getItem('montCart')) || [];
        
        // Add item to cart
        cart.push({
            name: productName,
            price: parseFloat(productPrice),
            qty: 1,
            timestamp: Date.now()
        });
        
        // Save to localStorage
        localStorage.setItem('montCart', JSON.stringify(cart));
        
        // Revert button after 1.5 seconds
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '#D2691E';
        }, 1500);
    });
});