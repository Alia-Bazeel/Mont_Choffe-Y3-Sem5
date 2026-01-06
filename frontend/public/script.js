/* ------------------------------
    1. HAMBURGER MENU TOGGLE
------------------------------ */

// Select key elements
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

// Toggle menus when hamburger is clicked
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('toggle');
        }
    });
}

/* ------------------------------
    2. ADD TO CART BUTTON ANIMATION (Index page)
------------------------------ */

// Select all product card buttons on index page
const cartButtons = document.querySelectorAll('.product-card button');

// Loop through each button and add click event
cartButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Get product info from the card
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('p').textContent;
        
        // Animation effect
        button.textContent = 'Added!';
        button.style.backgroundColor = '#FF6F61';
        button.style.color = '#fff';
        
        // Add to cart (simple localStorage implementation)
        let cart = JSON.parse(localStorage.getItem('montCart')) || [];
        
        // Check if product already in cart
        const existingIndex = cart.findIndex(item => item.name === productName);
        
        if (existingIndex > -1) {
            cart[existingIndex].qty += 1;
        } else {
            cart.push({
                name: productName,
                price: parseFloat(productPrice.replace(/[^\d.]/g, '')),
                qty: 1,
                timestamp: Date.now()
            });
        }
        
        localStorage.setItem('montCart', JSON.stringify(cart));
        
        // Update cart count if exists
        updateCartCount();
        
        // Revert button after 1.5 seconds
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '#D2691E';
        }, 1500);
    });
});

// Function to update cart count in header
function updateCartCount() {
    const headerCartCount = document.getElementById('headerCartCount');
    if (!headerCartCount) return;
    
    const cart = JSON.parse(localStorage.getItem('montCart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.qty, 0);
    
    headerCartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        headerCartCount.style.display = 'inline-block';
    } else {
        headerCartCount.style.display = 'none';
    }
}

/* ------------------------------
    3. SMOOTH SCROLL FOR NAV LINKS
------------------------------ */

// Select all nav links from both desktop and mobile
const allLinks = document.querySelectorAll(
    '.main-nav-links a, .more-links a, .mobile-menu a'
);

// Add click event for smooth scrolling
allLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Allow normal behavior for external links or pages
        if (href.startsWith('pages/') || href.includes('.html')) {
            return; // Let browser handle page navigation
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
    4. SHRINK HEADER WHILE SCROLLING
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
    5. HEADER SEARCH FUNCTIONALITY
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
    6. USER ICON DROPDOWN + AUTH STATE
------------------------------ */

// Update user menu based on login state
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
        if (usernameDisplay) {
            usernameDisplay.textContent = `Hello, ${user.name}`;
        }
        if (signInLink) {
            signInLink.style.display = 'none';
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
        }
        if (deleteAccBtn) {
            deleteAccBtn.style.display = 'block';
        }
    } else {
        // User is guest
        if (usernameDisplay) {
            usernameDisplay.textContent = 'Hello, Guest';
        }
        if (signInLink) {
            signInLink.style.display = 'block';
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
        }
        if (deleteAccBtn) {
            deleteAccBtn.style.display = 'none';
        }
    }
}

// Toggle dropdown
const userToggle = document.getElementById('userToggle');
const userMenu = document.getElementById('userMenu');

if (userToggle && userMenu) {
    userToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const userIcon = document.querySelector('.user-icon');
        if (userIcon) {
            userIcon.classList.toggle('show-menu');
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const userIcon = document.querySelector('.user-icon');
        if (userIcon && !userIcon.contains(e.target)) {
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
            
            // Close dropdown
            const userIcon = document.querySelector('.user-icon');
            if (userIcon) {
                userIcon.classList.remove('show-menu');
            }
            
            // Refresh page to update UI
            window.location.reload();
        }
    });
}

// Handle delete account
const deleteAccBtn = document.getElementById('deleteAccBtn');
if (deleteAccBtn) {
    deleteAccBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            // In a real app, call API to delete account
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            updateUserMenu();
            
            // Close dropdown
            const userIcon = document.querySelector('.user-icon');
            if (userIcon) {
                userIcon.classList.remove('show-menu');
            }
            
            alert('Account deleted successfully!');
            window.location.reload();
        }
    });
}

/* ------------------------------
    7. INITIALIZE PAGE
------------------------------ */

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Update user menu
    updateUserMenu();
    
    // Update cart count
    updateCartCount();
    
    // Add hero section animation
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.opacity = '0';
        heroSection.style.transition = 'opacity 1s ease';
        
        setTimeout(() => {
            heroSection.style.opacity = '1';
        }, 300);
    }
    
    // Add scroll animations for sections
    const animatedSections = document.querySelectorAll('.premium-products, .about-section, .informal-footer');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeUp 0.8s ease forwards';
            }
        });
    }, observerOptions);
    
    animatedSections.forEach(section => {
        observer.observe(section);
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .premium-products, .about-section, .informal-footer {
            opacity: 0;
        }
    `;
    
    document.head.appendChild(style);
});