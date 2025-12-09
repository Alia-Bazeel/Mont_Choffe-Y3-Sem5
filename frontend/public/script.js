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
        { keywords: ['about', 'about us', 'who we are'], page: 'pages/about_us.html' },
        { keywords: ['products', 'shop', 'catalog'], page: 'pages/products.html' },
        { keywords: ['contact', 'contact us', 'support'], page: 'pages/contact_us.html' },
        { keywords: ['career', 'jobs', 'vacancy'], page: 'pages/career.html' },
        { keywords: ['recipes'], page: 'pages/recipes.html' },
        { keywords: ['pairings', 'pair our products'], page: 'pages/pairings.html' },
        { keywords: ['find us', 'locations', 'store'], page: 'pages/findUs.html' }
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
