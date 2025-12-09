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
    MONT CHOFFE — PRODUCTS JAVASCRIPT (FINAL VERSION)
    Loads products from JSON • Filters • Search • Hover
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const productsContainer = document.querySelector(".products-container");
    let allProducts = []; // stores JSON data
    let productCards = []; // store created DOM elements

    /* -----------------------------------------
        1. LOAD PRODUCTS FROM JSON
    ----------------------------------------- */
    fetch("products.json")
        .then(res => res.json())
        .then(data => {
            allProducts = data;
            renderProducts(allProducts);
            initFiltering();
            initSearch();
            initHover();
        })
        .catch(err => console.error("Failed to load products.json 😭", err));


    /* -----------------------------------------
        2. RENDER PRODUCTS TO PAGE
    ----------------------------------------- */
    function renderProducts(list) {
        productsContainer.innerHTML = ""; // clear before adding new items
        productCards = [];

        list.forEach(product => {
            const card = document.createElement("div");
            card.classList.add("product-card");
            card.dataset.category = product.category;

            card.innerHTML = `
                <div class="product-img">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <p class="product-price">${product.price.toFixed(2)} د.إ</p>
                <button class="add-cart" 
                        data-name="${product.name}" 
                        data-price="${product.price}">
                    Add to Cart
                </button>
            `;

            productsContainer.appendChild(card);
            productCards.push(card);
        });
    }


    /* -----------------------------------------
        3. CATEGORY FILTER
    ----------------------------------------- */
    function initFiltering() {
        const categoryButtons = document.querySelectorAll(".category-btn");

        categoryButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                categoryButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const category = btn.dataset.category;
                filterByCategory(category);

                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        });
    }

    function filterByCategory(category) {
        productCards.forEach(card => {
            const cardCat = card.dataset.category;

            if (category === "all" || cardCat === category) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }


    /* -----------------------------------------
        4. SEARCH (From URL + On Page)
    ----------------------------------------- */
    function initSearch() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get("q") ? urlParams.get("q").toLowerCase() : "";

        const input = document.getElementById("productSearchInput");

        if (searchQuery) {
            filterBySearch(searchQuery);
            if (input) input.value = searchQuery;
        }

        if (input) {
            input.addEventListener("input", () => {
                filterBySearch(input.value.toLowerCase());
            });
        }
    }

    function filterBySearch(text) {
        productCards.forEach(card => {
            const name = card.querySelector(".product-name").textContent.toLowerCase();
            const desc = card.querySelector(".product-desc").textContent.toLowerCase();

            if (name.includes(text) || desc.includes(text)) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }


    /* -----------------------------------------
        5. HOVER ZOOM EFFECT
    ----------------------------------------- */
    function initHover() {
        const imgs = document.querySelectorAll(".product-card img");

        imgs.forEach(img => {
            img.addEventListener("mouseover", () => {
                img.style.transform = "scale(1.08)";
                img.style.transition = "0.3s ease";
            });

            img.addEventListener("mouseout", () => {
                img.style.transform = "scale(1)";
            });
        });
    }

});
