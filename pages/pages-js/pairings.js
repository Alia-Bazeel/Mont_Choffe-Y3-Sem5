// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    
    // Pairings data
    const pairingsData = {
        coffee: [
            {
                left: { 
                    name: "Truffle Collection", 
                    img: "pages-images/products/truffle_collection.png", 
                    price: "35.00", 
                    url: "products.html#truffle" 
                },
                right: { 
                    name: "Classic Roast Coffee", 
                    img: "pages-images/products/classic_roast.png", 
                    price: "75.00", 
                    url: "products.html#classic" 
                },
                description: "Rich chocolate truffles complement the smooth and bold flavors of classic coffee."
            },
            {
                left: { 
                    name: "72% Dark Velvet Bar", 
                    img: "pages-images/products/dark_velvet_bar.png", 
                    price: "32.99", 
                    url: "products.html#dark" 
                },
                right: { 
                    name: "Arabica Gold Roast", 
                    img: "pages-images/products/arabica_gold_roast.png", 
                    price: "49.99", 
                    url: "products.html#arabica" 
                },
                description: "Intense dark chocolate pairs with aromatic Arabica coffee."
            }
        ],
        gift: [
            {
                left: { 
                    name: "Luxury Gift Hamper", 
                    img: "pages-images/products/gift_hamper.png", 
                    price: "140.00", 
                    url: "products.html#hamper" 
                },
                right: { 
                    name: "Mini Chocolate Gift Set", 
                    img: "pages-images/products/mini_gift_set.png", 
                    price: "59.00", 
                    url: "products.html#mini" 
                },
                description: "A curated gift set combining chocolates and goodies."
            }
        ],
        special: [
            {
                left: { 
                    name: "Mont Choffe Reserve", 
                    img: "pages-images/products/mont_choffe_reserve.png", 
                    price: "25.50", 
                    url: "products.html#reserve" 
                },
                right: { 
                    name: "Saffron Delight Box", 
                    img: "pages-images/products/saffron_delight.png", 
                    price: "89.00", 
                    url: "products.html#saffron" 
                },
                description: "Exclusive reserve coffee paired with saffron chocolates."
            }
        ]
    };
    
    // Select elements
    const categoryButtons = document.querySelectorAll('.pairing-categories button');
    const allGrid = document.getElementById('pairingsAll');
    const coffeeGrid = document.getElementById('pairingsCoffee');
    const giftGrid = document.getElementById('pairingsGift');
    const specialGrid = document.getElementById('pairingsSpecial');
    
    // Function to create pairing card
    function createPairingCard(pair) {
        return `
            <div class="pairing-item">
                <div class="pairing-products">
                    <div class="pairing-product">
                        <img src="${pair.left.img}" alt="${pair.left.name}">
                        <h3>${pair.left.name}</h3>
                        <p>${pair.left.price} د.إ</p>
                        <a href="${pair.left.url}" class="view-product-btn">View Product</a>
                    </div>
                    
                    <div class="pairing-plus">+</div>
                    
                    <div class="pairing-product">
                        <img src="${pair.right.img}" alt="${pair.right.name}">
                        <h3>${pair.right.name}</h3>
                        <p>${pair.right.price} د.إ</p>
                        <a href="${pair.right.url}" class="view-product-btn">View Product</a>
                    </div>
                </div>
                
                <div class="pairing-description">
                    <p>${pair.description}</p>
                </div>
                
                <button class="add-both-btn" data-left='${JSON.stringify(pair.left)}' data-right='${JSON.stringify(pair.right)}'>
                    Add Both to Cart
                </button>
            </div>
        `;
    }
    
    // Function to populate grid
    function populateGrid(gridElement, pairs) {
        gridElement.innerHTML = '';
        pairs.forEach(pair => {
            gridElement.innerHTML += createPairingCard(pair);
        });
        
        // Add event listeners to "Add Both" buttons
        gridElement.querySelectorAll('.add-both-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const left = JSON.parse(e.target.dataset.left);
                const right = JSON.parse(e.target.dataset.right);
                addPairToCart(left, right);
            });
        });
    }
    
    // Function to add both products to cart
    function addPairToCart(left, right) {
        // Get existing cart or create new
        let cart = JSON.parse(localStorage.getItem('montCart')) || [];
        
        // Add left product
        cart.push({
            name: left.name,
            price: parseFloat(left.price),
            qty: 1,
            timestamp: Date.now()
        });
        
        // Add right product
        cart.push({
            name: right.name,
            price: parseFloat(right.price),
            qty: 1,
            timestamp: Date.now()
        });
        
        // Save to localStorage
        localStorage.setItem('montCart', JSON.stringify(cart));
        
        // Show success message
        alert(`${left.name} and ${right.name} added to cart!`);
        
        // Button animation
        const button = event.target;
        button.textContent = 'Added!';
        button.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            button.textContent = 'Add Both to Cart';
            button.style.backgroundColor = '';
        }, 1500);
    }
    
    // Populate all grids
    populateGrid(allGrid, [
        ...pairingsData.coffee,
        ...pairingsData.gift,
        ...pairingsData.special
    ]);
    
    populateGrid(coffeeGrid, pairingsData.coffee);
    populateGrid(giftGrid, pairingsData.gift);
    populateGrid(specialGrid, pairingsData.special);
    
    // Handle category switching
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get category
            const category = button.dataset.context;
            
            // Hide all grids
            [allGrid, coffeeGrid, giftGrid, specialGrid].forEach(grid => {
                grid.style.display = 'none';
            });
            
            // Show selected grid
            switch(category) {
                case 'all':
                    allGrid.style.display = 'grid';
                    break;
                case 'coffee':
                    coffeeGrid.style.display = 'grid';
                    break;
                case 'gift':
                    giftGrid.style.display = 'grid';
                    break;
                case 'special':
                    specialGrid.style.display = 'grid';
                    break;
            }
        });
    });
    
    // Set initial active state
    categoryButtons[0].classList.add('active');
    allGrid.style.display = 'grid';
});