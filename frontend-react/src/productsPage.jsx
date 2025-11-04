// React & Hooks
import { useState, useEffect } from 'react';
// Animations
import { motion } from 'motion/react';
// Icons
import { ArrowLeft, Filter, SlidersHorizontal, Search, ShoppingCart } from 'lucide-react';
// UI Components
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// Product Images
import truffleImage from 'figma:asset/dd6037810fa80e34bcc6ebe5d16e5d594e291e6f.png';
import coffeeImage from 'figma:asset/83a62f177f25df20e845aea519b03c3788256e6a.png';
import hamperImage from 'figma:asset/11f90ee55c1ecf56df7ced486d27bd1f3b034f39.png';

// ------------------------------
// Product Interface
// ------------------------------
interface Product {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  category: 'chocolate' | 'coffee' | 'gift-sets' | 'bestsellers';
  image: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
  new?: boolean;
  bestseller?: boolean;
}

// ------------------------------
// Mock API Data
// ------------------------------
const mockProductsAPI: Product[] = [
  { id: 1, name: 'Truffle Collection', price: '35 د.إ', priceValue: 35, category: 'chocolate', image: truffleImage, description: 'Handcrafted artisan chocolates with premium cocoa', inStock: true, featured: true },
  { id: 2, name: 'Classic Roast Coffee', price: '75 د.إ', priceValue: 75, category: 'coffee', image: coffeeImage, description: 'Medium-dark blend with rich, full-bodied flavor', inStock: true, bestseller: true },
  { id: 3, name: 'Luxury Gift Hamper', price: '140 د.إ', priceValue: 140, category: 'gift-sets', image: hamperImage, description: 'Curated selection of our finest products', inStock: true, featured: true },
  // Add remaining products as needed...
];

// ------------------------------
// Products Page Component
// ------------------------------
interface ProductsPageProps {
  onBack: () => void;
}

export function ProductsPage({ onBack }: ProductsPageProps) {

  // **State**
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);


  // **Fetch Products (Simulated API Call)**
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      setProducts(mockProductsAPI);
      setFilteredProducts(mockProductsAPI);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // **Filter and Sort Products**
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting logic
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (a.featured ? -1 : 1));
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy, searchQuery]);

  
  // **Category Buttons**
  const categories = [
    { value: 'all', label: 'All Products', count: products.length },
    { value: 'chocolate', label: 'Chocolates', count: products.filter(p => p.category === 'chocolate').length },
    { value: 'coffee', label: 'Coffee', count: products.filter(p => p.category === 'coffee').length },
    { value: 'gift-sets', label: 'Gift Sets', count: products.filter(p => p.category === 'gift-sets').length },
  ];

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div className="min-h-screen bg-[#F5F0E1]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#4B2E2E] to-[#3A2323] text-white py-20 px-4">
        <div className="container mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 mb-6 hover:text-[#FF6F61] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl mb-4">Our Products</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Discover our complete collection of premium chocolates, artisan coffee, and luxury gift sets.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-md py-4 px-4">
        <div className="container mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FF6F61] focus:outline-none transition-colors"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Categories */}
        <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#4B2E2E]" />
              <h3 className="text-xl text-[#4B2E2E]">Categories</h3>
            </div>
            <div className="space-y-2">
              {categories.map(c => (
                <button
                  key={c.value}
                  onClick={() => setSelectedCategory(c.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedCategory === c.value
                      ? 'bg-gradient-to-r from-[#D2691E] to-[#FF6F61] text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{c.label}</span>
                    <Badge variant="secondary">{c.count}</Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse h-96" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <h3 className="text-2xl text-[#4B2E2E] mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p, idx) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="group bg-white rounded
