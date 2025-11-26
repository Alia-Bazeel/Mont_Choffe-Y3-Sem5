/*
// Wait until the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  
  // Select all "Add to Cart" buttons inside product cards
  const buttons = document.querySelectorAll(".product-card button");

  // Loop through each button
  buttons.forEach(button => {
    
    // Adding a click event listener to each button
    button.addEventListener("click", () => {
      
      // Show an alert (placeholder for future cart functionality)
      alert("Added to cart!");
    });
  });
});
*/

/* ==========================================================
    PRODUCTS PAGE — JAVASCRIPT FILE
    (Filters • Search • Hover Effects)
========================================================== */

/* -----------------------------------------
    1. READ SEARCH QUERY FROM URL
----------------------------------------- */

// Get "?q=..." from the URL if present
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('q') ? urlParams.get('q').toLowerCase() : "";

// Select product cards
const productCards = document.querySelectorAll('.product-card');

// If there is a search query, filter products automatically
if (searchQuery) {
    filterProductsBySearch(searchQuery);
}

/* Function: filters cards using search text */
function filterProductsBySearch(query) {
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        const productDesc = card.querySelector('.product-desc').textContent.toLowerCase();

        if (productName.includes(query) || productDesc.includes(query)) {
            card.style.display = "flex";  // show matching products
        } else {
            card.style.display = "none";  // hide non-matching
        }
    });
}

/* -----------------------------------------
    2. CATEGORY FILTER (Chocolate / Honey / Cakes etc.)
----------------------------------------- */

// Select all category buttons
const categoryButtons = document.querySelectorAll('.category-btn');

// Add click event to each category
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active highlight from all
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active'); // highlight selected category

        const category = btn.dataset.category; // read the category name
        filterProductsByCategory(category);
    });
});

/* Function: filters cards using category attribute */
function filterProductsByCategory(category) {
    productCards.forEach(card => {
        const cardCategory = card.dataset.category;

        if (category === "all" || category === cardCategory) {
            card.style.display = "flex";  // show correct category
        } else {
            card.style.display = "none";
        }
    });
}

/* -----------------------------------------
    3. ON-PAGE SEARCH INPUT (top search bar)
----------------------------------------- */

const internalSearchInput = document.getElementById("productSearchInput");

if (internalSearchInput) {
    internalSearchInput.addEventListener("input", () => {
        const text = internalSearchInput.value.toLowerCase().trim();
        filterProductsBySearch(text);
    });
}

/* -----------------------------------------
    4. PRODUCT IMAGE HOVER ZOOM EFFECT
----------------------------------------- */

const productImages = document.querySelectorAll('.product-card img');

productImages.forEach(img => {
    img.addEventListener('mouseover', () => {
        img.style.transform = "scale(1.08)";
        img.style.transition = "0.3s ease";
    });

    img.addEventListener('mouseout', () => {
        img.style.transform = "scale(1)";
    });
});

/* -----------------------------------------
    5. OPTIONAL: SCROLL TO TOP WHEN CATEGORY CHANGES
----------------------------------------- */

categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});

