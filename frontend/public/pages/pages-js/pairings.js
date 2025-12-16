document.addEventListener("DOMContentLoaded", () => {

    /* ==============================
       SECTION REFERENCES
    ============================== */
    const sections = {
        all: document.getElementById("pairingsAll"),
        coffee: document.getElementById("pairingsCoffee"),
        gift: document.getElementById("pairingsGift"),
        special: document.getElementById("pairingsSpecial")
    };

    const buttons = document.querySelectorAll(".pairing-categories button");

    /* ==============================
       PAIRINGS DATA
       Add description for "Why this pairing works"
    ============================== */
    const pairingsData = {
        coffee: [
            {
                left: { name: "Truffle Collection", img: "pages-images/products/truffle_collection.png", price: "35.00", url: "products.html#truffle-collection" },
                right: { name: "Classic Roast Coffee", img: "pages-images/products/classic_roast.png", price: "75.00", url: "products.html#classic-roast-coffee" },
                description: "Rich chocolate truffles complement the smooth and bold flavors of classic coffee, creating a luxurious taste experience."
            },
            {
                left: { name: "72% Dark Velvet Bar", img: "pages-images/products/dark_velvet_bar.png", price: "32.99", url: "products.html#dark-velvet-bar" },
                right: { name: "Arabica Gold Roast", img: "pages-images/products/arabica_gold_roast.png", price: "49.99", url: "products.html#arabica-gold-roast" },
                description: "Intense dark chocolate pairs with aromatic Arabica coffee to enhance depth and richness in every sip and bite."
            }
        ],
        gift: [
            {
                left: { name: "Luxury Gift Hamper", img: "pages-images/products/gift_hamper.png", price: "140.00", url: "products.html#luxury-gift-hamper" },
                right: { name: "Mini Chocolate Gift Set", img: "pages-images/products/mini_gift_set.png", price: "59.00", url: "products.html#mini-chocolate-gift-set" },
                description: "A curated gift set combining chocolates and goodies that delight for any special occasion."
            }
        ],
        special: [
            {
                left: { name: "Mont Choffe Reserve", img: "pages-images/products/mont_choffe_reserve.png", price: "25.50", url: "products.html#mont-choffe-reserve" },
                right: { name: "Saffron Delight Box", img: "pages-images/products/saffron_delight.png", price: "89.00", url: "products.html#saffron-delight-box" },
                description: "Exquisite reserve coffee paired with saffron chocolates offers a unique indulgent experience."
            }
        ]
    };

    /* ==============================
       CREATE PAIRING ITEM
    ============================== */
    function createPairing(pair) {
        const item = document.createElement("div");
        item.className = "pairing-item";

        item.innerHTML = `
            <div class="pairing-products">
                <div class="pairing-product">
                    <img src="${pair.left.img}" alt="${pair.left.name}">
                    <h3>${pair.left.name}</h3>
                    <p>${pair.left.price} د.إ</p>
                    <a href="${pair.left.url}" class="view-product-btn">View Product</a>
                </div>

                <div class="pairing-product">
                    <img src="${pair.right.img}" alt="${pair.right.name}">
                    <h3>${pair.right.name}</h3>
                    <p>${pair.right.price} د.إ</p>
                    <a href="${pair.right.url}" class="view-product-btn">View Product</a>
                </div>
            </div>

            <div class="pairing-description">${pair.description}</div>
        `;

        return item;
    }

    /* ==============================
       INJECT PAIRS INTO ALL SECTIONS
    ============================== */
    Object.keys(pairingsData).forEach(category => {
        pairingsData[category].forEach(pair => {
            const item = createPairing(pair);

            // Append to category-specific section
            sections[category].appendChild(item);

            // Also append to 'all' section
            sections.all.appendChild(item.cloneNode(true));
        });
    });

    /* ==============================
       CATEGORY BUTTON SWITCHING
    ============================== */
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const context = button.dataset.context;

            // Highlight active button
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            // Show selected section, hide others
            Object.keys(sections).forEach(key => {
                sections[key].style.display = key === context ? "grid" : "none";
            });
        });
    });

});
