// Wait until the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {

    // Get references to each pairings section by their IDs
    const sections = {
        coffee: document.getElementById("pairingsCoffee"),
        gift: document.getElementById("pairingsGift"),
        special: document.getElementById("pairingsSpecial")
    };

    // Get all the category buttons
    const buttons = document.querySelectorAll(".pairing-categories button");

    // ----------------------------------------
    // SECTION SWITCHING LOGIC
    // When a user clicks a category button, show the corresponding section
    // ----------------------------------------
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const context = btn.dataset.context; // Get the data-context attribute of the clicked button

            // Loop through all sections
            Object.keys(sections).forEach(sec => {
                // Show the selected section, hide the others
                sections[sec].style.display = (sec === context) ? "flex" : "none";
            });
        });
    });

    // ----------------------------------------
    // PRODUCT PAIRINGS DATA
    // Define the pairs for each category
    // Each pair has two products with name, image, price, and product page URL
    // ----------------------------------------
    const pairingsData = {
        coffee: [
            {
                name1: "Truffle Collection",
                img1: "pages-images/products/truffle_collection.png",
                price1: "35.00",
                url1: "products.html#truffle-collection",
                name2: "Classic Roast Coffee",
                img2: "pages-images/products/classic_roast.png",
                price2: "75.00",
                url2: "products.html#classic-roast-coffee"
            },
            {
                name1: "72% Dark Velvet Bar",
                img1: "pages-images/products/dark_velvet_bar.png",
                price1: "32.99",
                url1: "products.html#dark-velvet-bar",
                name2: "Arabica Gold Roast",
                img2: "pages-images/products/arabica_gold_roast.png",
                price2: "49.99",
                url2: "products.html#arabica-gold-roast"
            }
        ],
        gift: [
            {
                name1: "Luxury Gift Hamper",
                img1: "pages-images/products/gift_hamper.png",
                price1: "140.00",
                url1: "products.html#luxury-gift-hamper",
                name2: "Mini Chocolate Gift Set",
                img2: "pages-images/products/mini_gift_set.png",
                price2: "59.00",
                url2: "products.html#mini-chocolate-gift-set"
            }
        ],
        special: [
            {
                name1: "Mont Choffe Reserve",
                img1: "pages-images/products/mont_choffe_reserve.png",
                price1: "25.50",
                url1: "products.html#mont-choffe-reserve",
                name2: "Saffron Delight Box",
                img2: "pages-images/products/saffron_delight.png",
                price2: "89.00",
                url2: "products.html#saffron-delight-box"
            }
        ]
    };

    // ----------------------------------------
    // GENERATE PAIR CARDS
    // Loop through each category and inject product pair cards into the corresponding section
    // ----------------------------------------
    Object.keys(pairingsData).forEach(context => {
        pairingsData[context].forEach(pair => {
            // Create a container div for the pair card
            const card = document.createElement("div");
            card.className = "pair-card";

            // Insert HTML for the two products in the pair
            // Replace "Add to Cart" with "View Product" buttons linking to the product page
            card.innerHTML = `
                <div class="product">
                    <img src="${pair.img1}" alt="${pair.name1}">
                    <h3>${pair.name1}</h3>
                    <p>${pair.price1} د.إ</p>
                    <a href="${pair.url1}" class="view-product-btn">View Product</a>
                </div>
                <div class="product">
                    <img src="${pair.img2}" alt="${pair.name2}">
                    <h3>${pair.name2}</h3>
                    <p>${pair.price2} د.إ</p>
                    <a href="${pair.url2}" class="view-product-btn">View Product</a>
                </div>
            `;

            // Append the pair card to the correct section
            sections[context].appendChild(card);
        });
    });

});
