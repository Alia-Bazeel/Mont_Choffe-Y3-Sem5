// Wait until DOM loads
document.addEventListener("DOMContentLoaded", () => {
    
    // --- ELEMENTS ---
    const productsGrid = document.getElementById("productsGrid");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const headerSearch = document.getElementById("headerSearch");
    const headerSearchBtn = document.getElementById("headerSearchBtn");
    
    // Cart elements
    const cartPanel = document.getElementById("cartPanel");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const closeCartBtn = document.getElementById("closeCart");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const headerCartBtn = document.getElementById("headerCartBtn");
    const headerCartCount = document.getElementById("headerCartCount");
    
    // Cart stored in localStorage
    let cart = JSON.parse(localStorage.getItem("montCart")) || [];
    
    /* =========================================
        1) CATEGORY FILTER
    ========================================== */
    function initCategoryFilter() {
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                
                const category = btn.dataset.filter;
                filterProductsByCategory(category);
            });
        });
    }
    
    function filterProductsByCategory(category) {
        const cards = document.querySelectorAll(".product-card");
        cards.forEach(card => {
            const cardCat = (card.dataset.category || "").toLowerCase();
            
            if (category === "all" || category === cardCat) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }
    
    /* =========================================
        2) SEARCH FUNCTIONALITY
    ========================================== */
    function initSearch() {
        if (!headerSearch) return;
        
        function runSearch() {
            const query = headerSearch.value.trim().toLowerCase();
            const cards = document.querySelectorAll(".product-card");
            let found = false;
            
            cards.forEach(card => {
                const name = (card.querySelector("h3")?.textContent || "").toLowerCase();
                const desc = (card.querySelector(".product-desc")?.textContent || "").toLowerCase();
                
                if (!query || name.includes(query) || desc.includes(query)) {
                    card.style.display = "flex";
                    found = true;
                } else {
                    card.style.display = "none";
                }
            });
            
            // Show "no results" message
            showNoResults(found, query);
        }
        
        headerSearch.addEventListener("input", runSearch);
        if (headerSearchBtn) headerSearchBtn.addEventListener("click", runSearch);
    }
    
    function showNoResults(found, query) {
        const existingMsg = document.querySelector(".no-results-message");
        if (existingMsg) existingMsg.remove();
        
        if (!found && query) {
            const message = document.createElement("div");
            message.className = "no-results-message";
            message.style.gridColumn = "1 / -1";
            message.style.textAlign = "center";
            message.style.padding = "40px";
            message.style.color = "#6b4a36";
            message.innerHTML = `
                <h3>No products found for "${query}"</h3>
                <p>Try a different search term.</p>
            `;
            
            if (productsGrid) {
                productsGrid.appendChild(message);
            }
        }
    }
    
    /* =========================================
        3) CART FUNCTIONALITY
    ========================================== */
    function initAddToCartButtons() {
        const addBtns = document.querySelectorAll(".add-cart");
        
        addBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const card = btn.closest(".product-card");
                const name = card.querySelector("h3").textContent.trim();
                const priceText = card.querySelector(".product-price").textContent;
                const price = parseFloat(priceText.replace(/[^\d.]/g, ""));
                
                addToCart(name, price);
                updateHeaderBadge();
                
                // Animation
                btn.textContent = "Added!";
                btn.style.backgroundColor = "#4CAF50";
                
                setTimeout(() => {
                    btn.textContent = "Add to Cart";
                    btn.style.backgroundColor = "";
                }, 1500);
            });
        });
    }
    
    function addToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({
                name: name,
                price: price,
                qty: 1,
                id: Date.now()
            });
        }
        
        saveCart();
        renderCart();
    }
    
    function saveCart() {
        localStorage.setItem("montCart", JSON.stringify(cart));
    }
    
    function renderCart() {
        cartItemsContainer.innerHTML = "";
        let total = 0;
        
        if (!cart.length) {
            cartItemsContainer.innerHTML = `
                <li style="text-align:center; color:#6b4a36; padding:20px;">
                    Your cart is empty.
                </li>
            `;
            cartTotal.innerText = "0.00";
            return;
        }
        
        cart.forEach(item => {
            total += (item.price * item.qty);
            
            const li = document.createElement("li");
            li.className = "cart-item";
            li.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>${item.qty} × ${item.price.toFixed(2)} د.إ</small>
                    </div>
                    <div>
                        <span>${(item.price * item.qty).toFixed(2)} د.إ</span>
                        <div style="margin-top:5px;">
                            <button class="qty-btn" data-action="decrease" data-name="${item.name}">-</button>
                            <button class="qty-btn" data-action="increase" data-name="${item.name}">+</button>
                        </div>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(li);
        });
        
        cartTotal.innerText = total.toFixed(2);
        
        // Add event listeners to quantity buttons
        document.querySelectorAll(".qty-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const action = e.target.dataset.action;
                const name = e.target.dataset.name;
                updateQuantity(name, action);
            });
        });
    }
    
    function updateQuantity(name, action) {
        const item = cart.find(i => i.name === name);
        
        if (!item) return;
        
        if (action === "increase") {
            item.qty += 1;
        } else if (action === "decrease") {
            item.qty -= 1;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.name !== name);
            }
        }
        
        saveCart();
        renderCart();
        updateHeaderBadge();
    }
    
    function updateHeaderBadge() {
        if (!headerCartCount) return;
        
        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        headerCartCount.textContent = count;
        
        if (count > 0) {
            headerCartCount.style.display = "inline-block";
        } else {
            headerCartCount.style.display = "none";
        }
    }
    
    /* =========================================
        4) CART PANEL CONTROL
    ========================================== */
    function openCart() {
        cartPanel.classList.add("open");
        cartOverlay.classList.add("active");
        renderCart();
    }
    
    function closeCart() {
        cartPanel.classList.remove("open");
        cartOverlay.classList.remove("active");
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener("click", closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener("click", closeCart);
    }
    
    if (headerCartBtn) {
        headerCartBtn.addEventListener("click", () => {
            if (cartPanel.classList.contains("open")) {
                closeCart();
            } else {
                openCart();
            }
        });
    }
    
    /* =========================================
        5) CHECKOUT FUNCTIONALITY
    ========================================== */
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (!cart.length) {
                alert("Your cart is empty!");
                return;
            }
            
            // Check if user is logged in
            const user = localStorage.getItem("user");
            if (!user) {
                if (confirm("You need to login to checkout. Go to login page?")) {
                    window.location.href = "login.html?redirect=purchase_bill.html";
                }
                return;
            }
            
            // Go to checkout page
            window.location.href = "purchase_bill.html";
        });
    }
    
    /* =========================================
        6) INITIALIZE EVERYTHING
    ========================================== */
    function init() {
        initCategoryFilter();
        initSearch();
        initAddToCartButtons();
        updateHeaderBadge();
        
        // Check URL for search query
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get("q");
        if (searchQuery && headerSearch) {
            headerSearch.value = searchQuery;
            initSearch();
            const runSearch = () => {
                const query = headerSearch.value.trim().toLowerCase();
                const cards = document.querySelectorAll(".product-card");
                cards.forEach(card => {
                    const name = (card.querySelector("h3")?.textContent || "").toLowerCase();
                    const desc = (card.querySelector(".product-desc")?.textContent || "").toLowerCase();
                    if (!query || name.includes(query) || desc.includes(query)) {
                        card.style.display = "flex";
                    } else {
                        card.style.display = "none";
                    }
                });
            };
            runSearch();
        }
    }
    
    init();
});