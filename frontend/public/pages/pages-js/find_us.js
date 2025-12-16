document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // STORE DATA
    // =========================
    const stores = [
        {
            name: "Mont Choffe Downtown",
            address: "123 Cocoa Street, Melbourne, Australia",
            phone: "+61 3 1234 5678",
            region: "Asia"
        },
        {
            name: "Mont Choffe Luxury Mall",
            address: "45 Coffee Ave, Dubai, UAE",
            phone: "+971 4 123 4567",
            region: "Middle East"
        },
        {
            name: "Mont Choffe Boutique",
            address: "78 Chocolate Blvd, New York, USA",
            phone: "+1 212 456 7890",
            region: "Americas"
        },
        {
            name: "Mont Choffe Paris",
            address: "12 Rue du Chocolat, Paris, France",
            phone: "+33 1 23 45 67 89",
            region: "Europe"
        }
    ];

    const storeList = document.getElementById("storeList");
    const regionSelect = document.getElementById("regionSelect");

    // =========================
    // DISPLAY STORES
    // =========================
    function displayStores(filteredStores) {
        storeList.innerHTML = "";
        filteredStores.forEach(store => {
            const card = document.createElement("div");
            card.className = "store-card";
            card.innerHTML = `
                <h3>${store.name}</h3>
                <p><strong>Address:</strong> ${store.address}</p>
                <p><strong>Phone:</strong> ${store.phone}</p>
                <p><strong>Region:</strong> ${store.region}</p>
            `;
            storeList.appendChild(card);
        });
    }

    // Initial display (all stores)
    displayStores(stores);

    // =========================
    // FILTER FUNCTIONALITY
    // =========================
    regionSelect.addEventListener("change", () => {
        const selectedRegion = regionSelect.value;
        if(selectedRegion === "all") {
            displayStores(stores);
        } else {
            const filtered = stores.filter(store => store.region === selectedRegion);
            displayStores(filtered);
        }
    });

});
