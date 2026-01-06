// backend/seed.js
const mongoose = require('mongoose');
const Product = require('./models/product_models');
require('dotenv').config();

const sampleProducts = [
    {
        name: "Truffle Collection",
        description: "A luxurious assortment of handcrafted gourmet truffles.",
        price: 35.00,
        category: "chocolate",
        image: "truffle_collection.png",
        stock: 50,
        featured: true
    },
    {
        name: "Classic Roast Coffee",
        description: "A smooth, full-bodied roast with rich aroma and balanced flavor.",
        price: 75.00,
        category: "coffee",
        image: "classic_roast.png",
        stock: 100,
        featured: true
    },
    {
        name: "Luxury Gift Hamper",
        description: "A premium selection of chocolates and coffee, perfect for gifting.",
        price: 140.00,
        category: "gift",
        image: "gift_hamper.png",
        stock: 30,
        featured: true
    },
    {
        name: "72% Dark Velvet Bar",
        description: "Smooth, intense, and ethically sourced cocoa.",
        price: 32.99,
        category: "chocolate",
        image: "dark_velvet_bar.png",
        stock: 80
    },
    {
        name: "Arabica Gold Roast",
        description: "Rich aroma with caramel and toasted notes.",
        price: 49.99,
        category: "coffee",
        image: "arabica_gold_roast.png",
        stock: 60
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mont_choffe');
        console.log('Connected to MongoDB for seeding');
        
        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');
        
        // Insert sample products
        await Product.insertMany(sampleProducts);
        console.log(`Added ${sampleProducts.length} sample products`);
        
        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();