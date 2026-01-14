const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'data', 'products.json');

// Helper to read/write JSON "Database"
const getData = () => JSON.parse(fs.readFileSync(DB_PATH));
const saveData = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// --- CRUD ENDPOINTS ---

// 1. READ: Get all products
app.get('/api/products', (req, res) => {
    res.json(getData());
});

// 2. CREATE: Add new product (Admin)
app.post('/api/products', (req, res) => {
    const products = getData();
    const newProduct = { id: Date.now(), ...req.body };
    products.push(newProduct);
    saveData(products);
    res.status(201).json(newProduct);
});

// 3. UPDATE: Edit product (Admin)
app.put('/api/products/:id', (req, res) => {
    let products = getData();
    const index = products.findIndex(p => p.id == req.params.id);
    if (index === -1) return res.status(404).send('Not found');
    
    products[index] = { ...products[index], ...req.body };
    saveData(products);
    res.json(products[index]);
});

// 4. DELETE: Remove product (Admin)
app.delete('/api/products/:id', (req, res) => {
    let products = getData();
    products = products.filter(p => p.id != req.params.id);
    saveData(products);
    res.status(204).send();
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: "running" }));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));