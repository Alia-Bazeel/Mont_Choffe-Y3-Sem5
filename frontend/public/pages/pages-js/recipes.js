/* ==============================
   RECIPES PAGE JS - MONT CHOFFE
============================== */

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    
    // --- ELEMENTS ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const recipeCards = document.querySelectorAll('.recipe-card');
    const modal = document.getElementById('recipeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDescription');
    const viewBtns = document.querySelectorAll('.view-recipe');
    const closeBtn = document.querySelector('.close-modal');
    
    // --- FILTERING RECIPE CARDS ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get category
            const category = btn.dataset.category;
            
            // Show/hide recipe cards
            recipeCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // --- RECIPE MODAL FUNCTIONALITY ---
    // Recipe data for modal
    const recipeDetails = {
        "Chocolate Truffle Mousse": `
            <h4>Ingredients:</h4>
            <ul>
                <li>200g Mont Choffe Truffle Collection</li>
                <li>100ml heavy cream</li>
                <li>2 egg whites</li>
                <li>2 tbsp sugar</li>
                <li>1 tsp vanilla extract</li>
            </ul>
            
            <h4>Instructions:</h4>
            <ol>
                <li>Melt chocolate in a double boiler</li>
                <li>Whip cream until soft peaks form</li>
                <li>Beat egg whites with sugar until stiff</li>
                <li>Fold all ingredients together gently</li>
                <li>Chill for 4 hours before serving</li>
            </ol>
            
            <p><strong>Prep Time:</strong> 20 minutes<br>
            <strong>Chill Time:</strong> 4 hours<br>
            <strong>Serves:</strong> 4</p>
        `,
        
        "Caramel Latte": `
            <h4>Ingredients:</h4>
            <ul>
                <li>2 shots Mont Choffe Arabica Gold Roast espresso</li>
                <li>200ml steamed milk</li>
                <li>2 tbsp caramel sauce</li>
                <li>Whipped cream (optional)</li>
                <li>Caramel drizzle for garnish</li>
            </ul>
            
            <h4>Instructions:</h4>
            <ol>
                <li>Brew 2 shots of espresso</li>
                <li>Steam milk until frothy</li>
                <li>Add caramel sauce to mug</li>
                <li>Pour espresso over caramel, stir</li>
                <li>Add steamed milk and top with whipped cream</li>
                <li>Drizzle with extra caramel</li>
            </ol>
            
            <p><strong>Prep Time:</strong> 5 minutes<br>
            <strong>Serves:</strong> 1</p>
        `,
        
        "Espresso Mocha": `
            <h4>Ingredients:</h4>
            <ul>
                <li>1 shot Mont Choffe Signature Espresso</li>
                <li>1 tbsp cocoa powder</li>
                <li>1 tbsp sugar</li>
                <li>200ml milk</li>
                <li>Whipped cream</li>
                <li>Chocolate shavings</li>
            </ul>
            
            <h4>Instructions:</h4>
            <ol>
                <li>Mix cocoa powder and sugar in mug</li>
                <li>Brew espresso directly into mug</li>
                <li>Stir until cocoa dissolves</li>
                <li>Steam milk and pour into mug</li>
                <li>Top with whipped cream and chocolate shavings</li>
            </ol>
            
            <p><strong>Prep Time:</strong> 5 minutes<br>
            <strong>Serves:</strong> 1</p>
        `,
        
        "Chocolate Gift Box Ideas": `
            <h4>What You'll Need:</h4>
            <ul>
                <li>Mont Choffe Bespoke Artisan Collection</li>
                <li>Elegant gift box or basket</li>
                <li>Tissue paper or shredded filler</li>
                <li>Ribbon or bow</li>
                <li>Gift tag</li>
            </ul>
            
            <h4>Assembly Instructions:</h4>
            <ol>
                <li>Line box with tissue paper</li>
                <li>Arrange chocolates in decorative pattern</li>
                <li>Add filler around chocolates</li>
                <li>Tie with ribbon and attach gift tag</li>
                <li>Add personal note if desired</li>
            </ol>
            
            <p><strong>Perfect for:</strong> Birthdays, Anniversaries, Thank You gifts</p>
        `
    };
    
    // Add click event to view recipe buttons
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.recipe-card');
            const title = card.querySelector('h3').textContent;
            
            // Set modal content
            modalTitle.textContent = title;
            
            if (recipeDetails[title]) {
                modalDesc.innerHTML = recipeDetails[title];
            } else {
                modalDesc.innerHTML = `
                    <p>${card.querySelector('p').textContent}</p>
                    <p><strong>Full recipe details coming soon!</strong></p>
                    <p>Check back later for complete instructions.</p>
                `;
            }
            
            // Show modal
            modal.style.display = 'flex';
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // --- ADD TO CART FROM RECIPE PAGE ---
    // Find products used and make them clickable
    const productsUsed = document.querySelectorAll('.products-used a');
    
    productsUsed.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get product name from link text
            const productName = link.textContent;
            
            // Find the recipe card
            const recipeCard = link.closest('.recipe-card');
            const recipeTitle = recipeCard.querySelector('h3').textContent;
            
            // Show message
            alert(`Added ${productName} to cart from "${recipeTitle}" recipe`);
            
            // In a real app, you would add to cart here
            // addToCart(productName, price);
        });
    });
    
    // --- PRINT RECIPE FUNCTIONALITY ---
    // Add print buttons to modal dynamically
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('print-recipe')) {
            printRecipe();
        }
    });
    
    function printRecipe() {
        const printContent = `
            <html>
                <head>
                    <title>${modalTitle.textContent} - Mont Choffe Recipe</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #4B2E2E; }
                        ul, ol { margin-left: 20px; }
                        .footer { margin-top: 50px; text-align: center; color: #666; }
                    </style>
                </head>
                <body>
                    <h1>${modalTitle.textContent}</h1>
                    ${modalDesc.innerHTML}
                    <div class="footer">
                        <p>Recipe from Mont Choffe Recipe Collection</p>
                        <p>www.montchoffe.com/recipes</p>
                    </div>
                </body>
            </html>
        `;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }
    
    // Add print button to modal
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        const printBtn = document.createElement('button');
        printBtn.className = 'print-recipe';
        printBtn.textContent = 'Print Recipe';
        printBtn.style.marginTop = '20px';
        printBtn.style.padding = '10px 20px';
        printBtn.style.backgroundColor = '#4B2E2E';
        printBtn.style.color = 'white';
        printBtn.style.border = 'none';
        printBtn.style.borderRadius = '5px';
        printBtn.style.cursor = 'pointer';
        
        modalContent.appendChild(printBtn);
    }
});