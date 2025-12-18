/* ------------------------------
    1. HAMBURGER MENU TOGGLE
------------------------------ */

// Select key elements
const hamburger = document.querySelector('.hamburger');    // hamburger button
const mobileMenu = document.querySelector('.mobile-menu'); // dropdown menu

// Toggle menus when hamburger is clicked
hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active'); // show/hide mobile menu
    hamburger.classList.toggle('toggle');  // animate hamburger
});

// close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('toggle');
    }
});

/* ------------------------------
    2. ADD TO CART BUTTON ANIMATION
------------------------------ */

// Select all product card buttons
const cartButtons = document.querySelectorAll('.product-card button');

// Loop through each button and add click event
cartButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Temporary animation effect on click
        button.textContent = 'Added!';
        button.style.backgroundColor = '#FF6F61'; // Accent color
        button.style.color = '#fff';
        
        // Revert back after 1.5 seconds
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '#D2691E'; // Original button color
        }, 1500);
    });
});

/* ------------------------------
    3. SMOOTH SCROLL FOR NAV LINKS
------------------------------ */

// Select all nav links from both desktop and mobile
const allLinks = document.querySelectorAll(
    '.main-nav-links a, .extra-links a, .mobile-menu a'
);

// Add click event for smooth scrolling
allLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Allow normal behavior for external links or pages
        if (href.startsWith('pages/') || href.includes('.html')) return;

        // Prevent default only for same-page section links
        e.preventDefault();
        const targetID = href.substring(1);
        const targetSection = document.getElementById(targetID);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 60, // Adjust for fixed header
                behavior: 'smooth'
            });
        }

        // Close mobile menu after clicking a link
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('toggle');
    });
});

/* ------------------------------
    4. SHRINK HEADER WHILE SCROLLING
    (and show brand-name on scroll)
------------------------------ */

window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    const hamburger = document.querySelector(".hamburger");

    if (window.scrollY > 50) {
        header.classList.add("shrink");   // Shrink header and show brand-name
        hamburger.style.display = "flex"; // Show hamburger when shrunk
    } else {
        header.classList.remove("shrink"); // Restore full header
        hamburger.style.display = "none";  // Hide hamburger in full view
    }
});

/* ------------------------------
    5. HEADER SEARCH FUNCTIONALITY (SMART + DYNAMIC FILTER)
------------------------------ */

const searchInput = document.getElementById('headerSearch');
const searchBtn = document.getElementById('headerSearchBtn');

if (searchInput && searchBtn) {
    // Keyword mapping: keywords → target page
    const pageMap = [
        { keywords: ['about', 'about us', 'who we are'], page: 'about_us.html' },
        { keywords: ['products', 'shop', 'catalog'], page: 'products.html' },
        { keywords: ['contact', 'contact us', 'support'], page: 'contact_us.html' },
        { keywords: ['career', 'jobs', 'vacancy'], page: 'career.html' },
        { keywords: ['recipes'], page: 'recipes.html' },
        { keywords: ['pairings', 'pair our products'], page: 'pairings.html' },
        { keywords: ['find us', 'locations', 'store'], page: 'findUs.html' }
    ];

    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            searchInput.focus();
            return;
        }

        // 1. Check if we are on products page
        const isProductsPage = window.location.pathname.includes('products.html');

        if (isProductsPage) {
            // Filter products dynamically
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const desc = card.querySelector('.product-desc')?.textContent.toLowerCase() || '';
                if (name.includes(query) || desc.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
            return; // don’t redirect when on products page
        }

        // 2. Redirect based on keywords
        let redirected = false;
        for (let entry of pageMap) {
            if (entry.keywords.some(kw => query.includes(kw))) {
                window.location.href = entry.page;
                redirected = true;
                break;
            }
        }

        // 3. Fallback: go to products page with query
        if (!redirected) {
            window.location.href = `products.html?q=${encodeURIComponent(query)}`;
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

// Select dropdown elements
const userIcon = document.querySelector('.user-icon');
const userToggle = document.getElementById('userToggle');
const userMenu = document.getElementById('userMenu');

const usernameDisplay = document.getElementById('usernameDisplay');
const signInLink = document.getElementById('signIn');
const logoutBtn = document.getElementById('logoutBtn');
const deleteAccBtn = document.getElementById('deleteAccBtn');

// Safety check (prevents errors on pages without user icon)
if (userIcon && userToggle && userMenu) {

    // Get username from localStorage (set during login/signup)
    let username = localStorage.getItem('username');

    // Update dropdown UI based on login state
    function updateUserMenu() {
        if (username) {
            usernameDisplay.textContent = `Hello, ${username}`;
            if(signInLink) signInLink.parentElement.style.display = 'none';
            if(logoutBtn) logoutBtn.parentElement.style.display = 'block';
            if(deleteAccBtn) deleteAccBtn.parentElement.style.display = 'block';
        } else {
            usernameDisplay.textContent = 'Hello, Guest';
            if(signInLink) signInLink.parentElement.style.display = 'block';
            if(logoutBtn) logoutBtn.parentElement.style.display = 'none';
            if(deleteAccBtn) deleteAccBtn.parentElement.style.display = 'none';
        }
    }

    // Initial UI update
    updateUserMenu();

    // Toggle dropdown on user icon click
    userToggle.addEventListener('click', (e) => {
        e.preventDefault();
        userIcon.classList.toggle('show-menu');
    });

    // Logout logic
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('username');
        username = null;
        updateUserMenu();
        userIcon.classList.remove('show-menu');
    });

    // Delete account logic (frontend simulation)
    deleteAccBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete your account?')) {
            localStorage.removeItem('username');
            username = null;
            updateUserMenu();
            userIcon.classList.remove('show-menu');
            alert('Account deleted successfully!');
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userIcon.contains(e.target)) {
            userIcon.classList.remove('show-menu');
        }
    });
}

