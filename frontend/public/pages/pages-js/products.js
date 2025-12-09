// Wait until DOM loads
document.addEventListener("DOMContentLoaded", () => {

    // --- ELEMENTS
    const productsGrid = document.getElementById("productsGrid"); // static grid in your HTML
    const filterBtns = document.querySelectorAll(".filter-btn");
    const headerSearch = document.getElementById("headerSearch");
    const headerSearchBtn = document.getElementById("headerSearchBtn");

    // Cart elements (in sidebar)
    const cartPanel = document.getElementById("cartPanel");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const closeCartBtn = document.getElementById("closeCart");
    const checkoutBtn = document.getElementById("checkoutBtn");

    // Header cart button (will be added to header — see HTML snippet below)
    const headerCartBtn = document.getElementById("headerCartBtn");
    const headerCartCount = document.getElementById("headerCartCount");

    // Cart stored in localStorage under "montCart"
    let cart = JSON.parse(localStorage.getItem("montCart")) || [];

    /* =========================================
        1) CATEGORY FILTER - works with your .filter-btn
    ========================================== */
    function initCategoryFilter() {
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const category = btn.dataset.filter; // matches data-filter="..."
                filterProductsByCategory(category);
                // scroll to products
                window.scrollTo({ top: document.querySelector(".products-hero").offsetTop + 10, behavior: "smooth" });
            });
        });
    }

    function filterProductsByCategory(category) {
        const cards = document.querySelectorAll(".product-card");
        cards.forEach(card => {
            const cardCat = (card.dataset.category || "").toLowerCase();
            if (category === "all" || category === cardCat || (category === "special" && cardCat === "special")) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }

    /* =========================================
        2) SEARCH (headerSearch)
        - simple client-side filter on product name/desc
    ========================================== */
    function initSearch() {
        if (!headerSearch) return;

        function runSearch() {
            const q = headerSearch.value.trim().toLowerCase();
            const cards = document.querySelectorAll(".product-card");
            cards.forEach(card => {
                const name = (card.querySelector("h3")?.textContent || "").toLowerCase();
                const desc = (card.querySelector(".product-desc")?.textContent || "").toLowerCase();
                if (!q || name.includes(q) || desc.includes(q)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        }

        headerSearch.addEventListener("input", runSearch);
        if (headerSearchBtn) headerSearchBtn.addEventListener("click", runSearch);
    }

    /* =========================================
        3) CART: hooks up all .add-cart buttons
    ========================================== */
    function initAddToCartButtons() {
        // Works both with static HTML cards and dynamically rendered ones (if you later load from JSON)
        const addBtns = document.querySelectorAll(".add-cart");

        addBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // read dataset attributes
                const name = btn.dataset.name || btn.closest(".product-card")?.querySelector("h3")?.textContent?.trim();
                const priceRaw = btn.dataset.price ?? btn.closest(".product-card")?.querySelector(".product-price")?.textContent;
                // Normalize price: dataset already numeric in many buttons; if not parse from text
                let price = 0;
                if (priceRaw === undefined || priceRaw === null) price = 0;
                else price = parseFloat(String(priceRaw).replace(/[^\d\.\-]/g, "")) || 0;

                addToCart(name, price);
                openCart();
            });
        });
    }

    // Add item to cart array (or increase qty)
    function addToCart(name, price) {
        if (!name) return;
        const existing = cart.find(i => i.name === name);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ name: name, price: price, qty: 1 });
        }
        saveCart();
        renderCart();
        updateHeaderBadge();
    }

    // Save to localStorage
    function saveCart() {
        localStorage.setItem("montCart", JSON.stringify(cart));
    }

    // Render cart to sidebar
    function renderCart() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        if (!cart.length) {
            cartItemsContainer.innerHTML = `<li style="text-align:center; color:#6b4a36;">Your cart is empty.</li>`;
            cartTotal.innerText = (0).toFixed(2);
            updateHeaderBadge();
            return;
        }

        cart.forEach(item => {
            total += (item.price * item.qty);

            const li = document.createElement("li");
            li.classList.add("cart-item");
            li.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
                    <div style="flex:1; min-width:0;">
                        <div style="font-weight:700; color:#4B2E2E;">${item.name}</div>
                        <div style="font-size:0.9rem; color:#6b4a36;">${item.qty} × ${(item.price).toFixed(2)} د.إ</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-weight:700; color:#4B2E2E;">${(item.price * item.qty).toFixed(2)} د.إ</div>
                        <div style="margin-top:6px; display:flex; gap:6px; justify-content:flex-end;">
                            <button class="qty-btn decrease" data-name="${item.name}">−</button>
                            <button class="qty-btn increase" data-name="${item.name}">+</button>
                        </div>
                    </div>
                </div>
            `;

            // Attach listeners for inc/dec
            li.querySelector(".increase").addEventListener("click", () => {
                item.qty++;
                saveCart();
                renderCart();
                updateHeaderBadge();
            });

            li.querySelector(".decrease").addEventListener("click", () => {
                item.qty--;
                if (item.qty <= 0) {
                    cart = cart.filter(i => i.name !== item.name);
                }
                saveCart();
                renderCart();
                updateHeaderBadge();
            });

            cartItemsContainer.appendChild(li);
        });

        cartTotal.innerText = total.toFixed(2);
    }

    // Update header badge number
    function updateHeaderBadge() {
        if (!headerCartCount) return;
        const count = cart.reduce((s, i) => s + i.qty, 0);
        headerCartCount.innerText = count;
        if (count > 0) headerCartCount.style.display = "inline-block";
        else headerCartCount.style.display = "none";
    }

    /* =========================================
        4) OPEN / CLOSE CART PANEL
    ========================================== */
    function openCart() {
        cartPanel.classList.add("open");
        cartOverlay.classList.add("active"); // matches your CSS: .cart-overlay.active { display:block; }
        renderCart();
    }

    function closeCart() {
        cartPanel.classList.remove("open");
        cartOverlay.classList.remove("active");
    }

    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
    if (cartOverlay) cartOverlay.addEventListener("click", closeCart);
    if (headerCartBtn) headerCartBtn.addEventListener("click", () => {
        // If cart is open, close it. Otherwise open.
        if (cartPanel.classList.contains("open")) closeCart();
        else openCart();
    });

    /* =========================================
        5) CHECKOUT BUTTON → go to checkout.html
           (checkout page will read localStorage and show bill)
    ========================================== */
    if (checkoutBtn) checkoutBtn.addEventListener("click", () => {
        // If cart empty, notify
        if (!cart.length) {
            alert("Your cart is empty!");
            return;
        }
        // Go to checkout page
        window.location.href = "purchase_bill.html";
    });

    /* =========================================
        6) INIT — wire everything up
    ========================================== */
    function init() {
        initCategoryFilter();
        initSearch();
        initAddToCartButtons();
        renderCart();
        updateHeaderBadge();
    }

    init();

});
