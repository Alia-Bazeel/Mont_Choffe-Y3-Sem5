/* ------------------------------
    1. HAMBURGER MENU TOGGLE
------------------------------ */

// Select hamburger icon, nav links, and mobile menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const mobileMenu = document.querySelector('.mobile-menu');

// Toggle menus when hamburger is clicked
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');   // For desktop nav
    mobileMenu.classList.toggle('active');     // For mobile menu
    hamburger.classList.toggle('toggle');      // Animate hamburger icon
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

// Select all nav links
const links = document.querySelectorAll('.nav-links a');

// Add click event for smooth scrolling
links.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetID = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetID);
        
        if(targetSection){
            window.scrollTo({
                top: targetSection.offsetTop - 50, // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    });
});

/* ------------------------------
    4. SHRINK HEADER WHILE SCROLLING
------------------------------ */

// Shrink header on scroll
window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
        header.classList.add("shrink"); // Apply shrink class
    } else {
        header.classList.remove("shrink"); // Remove shrink class
    }
});
