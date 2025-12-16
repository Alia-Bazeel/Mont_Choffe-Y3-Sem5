/* ==============================
   RECIPES PAGE JS - MONT CHOFFE
============================== */

document.addEventListener("DOMContentLoaded", () => {

    // FILTERING RECIPE CARDS
    const filterBtns = document.querySelectorAll('.filter-btn');
    const recipeCards = document.querySelectorAll('.recipe-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;

            // Toggle active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

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

    // RECIPE MODAL FUNCTIONALITY
    const modal = document.getElementById('recipeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDescription');
    const viewBtns = document.querySelectorAll('.view-recipe');
    const closeBtn = document.querySelector('.close-modal');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.recipe-card');
            modalTitle.textContent = card.querySelector('h3').textContent;
            modalDesc.textContent = card.querySelector('p').textContent + "\n\nFull recipe instructions coming soon!";
            modal.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

});
