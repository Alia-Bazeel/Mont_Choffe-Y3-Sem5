const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, '../data/products.json');

const readProducts = () => JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
const saveProducts = (products) => fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));

exports.getAllProducts = (req, res) => {
    const products = readProducts();
    res.json({ success: true, products });
};

exports.getProductById = (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
};

exports.createProduct = (req, res) => {
    const { name, price, category, description, image } = req.body;
    if (!name || !price) return res.status(400).json({ success: false, message: 'Name and price required' });

    const products = readProducts();
    const newProduct = {
        id: Date.now(),
        name,
        price,
        category: category || 'misc',
        description: description || '',
        image: image || ''
    };

    products.push(newProduct);
    saveProducts(products);
    res.json({ success: true, product: newProduct });
};

exports.updateProduct = (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    Object.assign(product, req.body);
    saveProducts(products);
    res.json({ success: true, product });
};

exports.deleteProduct = (req, res) => {
    let products = readProducts();
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    products = products.filter(p => p.id != req.params.id);
    saveProducts(products);
    res.json({ success: true, message: 'Product deleted' });
};
