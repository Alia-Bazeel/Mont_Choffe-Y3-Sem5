// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    
    // Store data - you can move this to a JSON file later
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
        },
        {
            name: "Mont Choffe London",
            address: "22 Coffee Lane, London, UK",
            phone: "+44 20 1234 5678",
            region: "Europe"
        },
        {
            name: "Mont Choffe Tokyo",
            address: "8-1 Chocolate Avenue, Tokyo, Japan",
            phone: "+81 3 1234 5678",
            region: "Asia"
        }
    ];
    
    // Select elements
    const storeList = document.getElementById('storeList');
    const regionSelect = document.getElementById('regionSelect');
    const storeMap = document.getElementById('storeMap');
    
    // Function to display stores
    function displayStores(storesToShow) {
        storeList.innerHTML = '';
        
        storesToShow.forEach(store => {
            const storeCard = document.createElement('div');
            storeCard.className = 'store-card';
            storeCard.innerHTML = `
                <h3>${store.name}</h3>
                <p><strong>Address:</strong> ${store.address}</p>
                <p><strong>Phone:</strong> ${store.phone}</p>
                <p><strong>Region:</strong> ${store.region}</p>
                <button class="view-on-map" data-address="${store.address}">
                    View on Map
                </button>
            `;
            storeList.appendChild(storeCard);
        });
        
        // Add event listeners to map buttons
        document.querySelectorAll('.view-on-map').forEach(button => {
            button.addEventListener('click', (e) => {
                const address = e.target.dataset.address;
                updateMap(address);
            });
        });
    }
    
    // Function to update map with address
    function updateMap(address) {
        // Encode address for Google Maps URL
        const encodedAddress = encodeURIComponent(address);
        const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedAddress}&zoom=14`;
        
        // Update iframe source
        storeMap.src = mapSrc;
        
        // Scroll to map section
        document.querySelector('.map-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
    
    // Handle region filter
    regionSelect.addEventListener('change', (e) => {
        const selectedRegion = e.target.value;
        
        if (selectedRegion === 'all') {
            displayStores(stores);
        } else {
            const filteredStores = stores.filter(store => 
                store.region === selectedRegion
            );
            displayStores(filteredStores);
        }
    });
    
    // Initial display of all stores
    displayStores(stores);
    
    // Add keyboard navigation for store cards
    storeList.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const button = e.target.querySelector('.view-on-map');
            if (button) {
                button.click();
            }
        }
    });
});