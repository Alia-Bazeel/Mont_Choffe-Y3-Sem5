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
    if (window.scrollY > 50) {
        header.classList.add("shrink"); // Apply shrink class
    } else {
        header.classList.remove("shrink"); // Remove shrink class
    }
});

/* ------------------------------
    5. HEADER SEARCH FUNCTIONALITY
------------------------------ */

// Select search input and button
const searchInput = document.getElementById('headerSearch');
const searchBtn = document.getElementById('headerSearchBtn');

if (searchInput && searchBtn) {
    // Handle search button click
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (!query) {
            searchInput.focus();
            return;
        }
        // Redirect to products page with query param (ready for API integration)
        window.location.href = `pages/products.html?q=${encodeURIComponent(query)}`;
    });

    // Allow pressing Enter to trigger search
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchBtn.click();
        }
    });
}
