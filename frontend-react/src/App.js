// Mont Choffe – Homepage (App.js)
// ------------------------------------
// Imports
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Search, Menu, X, Facebook, Instagram, Twitter, ChevronDown } from 'lucide-react';

// Components
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { ProductsPage } from './components/ProductsPage';

// Images
import logoImg from 'figma:asset/3c31bd096009ba4913f74df3a7be1ca5efb3e997.png';
import heroImg from 'figma:asset/a85c2b46551fa9c58202f771a3b400f5aba20294.png';
import truffleImg from 'figma:asset/dd6037810fa80e34bcc6ebe5d16e5d594e291e6f.png';
import coffeeImg from 'figma:asset/83a62f177f25df20e845aea519b03c3788256e6a.png';
import hamperImg from 'figma:asset/11f90ee55c1ecf56df7ced486d27bd1f3b034f39.png';

export default function App() {

  // ------------------------------
  // State variables
  // ------------------------------
  const [page, setPage] = useState('home');            // Track current page (home/products)
  const [menuOpen, setMenuOpen] = useState(false);     // Toggle for mobile menu
  const [headerSmall, setHeaderSmall] = useState(false); // Shrink header on scroll

  // Scroll animations
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroZoom = useTransform(scrollY, [0, 300], [1, 1.1]);

  // Shrink header when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setHeaderSmall(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ------------------------------
  // Product data
  // ------------------------------
  const productItems = [
    { id: 1, name: 'Truffle Collection', price: '35 د.إ', img: truffleImg, desc: 'Handcrafted artisan chocolates with premium cocoa' },
    { id: 2, name: 'Classic Roast Coffee', price: '75 د.إ', img: coffeeImg, desc: 'Medium-dark blend with rich, full-bodied flavor' },
    { id: 3, name: 'Luxury Gift Hamper', price: '140 د.إ', img: hamperImg, desc: 'Curated selection of our finest products' },
  ];

  // Show the products page
  if (page === 'products') {
    return <ProductsPage onBack={() => setPage('home')} />;
  }

  // ------------------------------
  // Return homepage layout
  // ------------------------------
  return (
    <div className="bg-[#F5F0E1] min-h-screen">

      {/* -------------------- HEADER -------------------- */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          headerSmall ? 'bg-[#3A2323]/95 backdrop-blur-md py-2 shadow-lg' : 'bg-[#4B2E2E] py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">

          {/* --- Logo --- */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <img
              src={logoImg}
              alt="Mont Choffe Logo"
              className={`transition-all duration-300 ${headerSmall ? 'h-12' : 'h-16'} w-auto object-contain`}
            />
          </motion.div>

          {/* --- Search bar (desktop) --- */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 pr-10 rounded-full bg-white/10 text-white border border-white/20 placeholder-white/60 focus:ring-2 focus:ring-[#FF6F61]"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#D2691E] to-[#FF6F61] p-2 rounded-full hover:scale-110 transition">
              <Search className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* --- Nav links (desktop) --- */}
          <nav className="hidden lg:flex items-center gap-8 text-white">
            <button onClick={() => setPage('products')} className="hover:text-[#FF6F61]">Our Products</button>
            <a href="#about" className="hover:text-[#FF6F61]">About</a>
            <a href="#contact" className="hover:text-[#FF6F61]">Contact</a>
          </nav>

          {/* --- Hamburger menu --- */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* --- Mobile menu --- */}
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="lg:hidden bg-[#333] mt-4 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4 text-white">
              <button onClick={() => { setPage('products'); setMenuOpen(false); }} className="hover:text-[#FF6F61]">Our Products</button>
              <a href="#about" className="hover:text-[#FF6F61]">About</a>
              <a href="#contact" className="hover:text-[#FF6F61]">Contact</a>
              <a href="#careers" className="hover:text-[#FF6F61]">Careers</a>
            </div>
          </motion.nav>
        )}
      </motion.header>

      {/* -------------------- HERO SECTION -------------------- */}
      <section className="relative min-h-screen flex items-center justify-end overflow-hidden pt-20">
        <motion.div style={{ scale: heroZoom }} className="absolute inset-0">
          <img src={heroImg} alt="Mont Choffe Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4B2E2E]/40 to-transparent"></div>
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative container mx-auto px-4 md:px-8 py-20 text-right">
          <motion.h1 className="text-5xl md:text-7xl text-white mb-6">
            Where Chocolate<br />
            <span className="bg-gradient-to-r from-[#D2691E] to-[#FF6F61] bg-clip-text text-transparent">
              Meets Coffee
            </span>
          </motion.h1>
          <p className="text-xl text-white/90 mb-8">
            Indulge in luxurious chocolate and aromatic coffee.
          </p>
          <motion.a
            href="#products"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#D2691E] to-[#FF6F61] text-white rounded-full"
          >
            <span>Shop Now</span>
            <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
          </motion.a>
        </motion.div>
      </section>

      {/* -------------------- PRODUCT SECTION -------------------- */}
      <section id="products" className="py-20 px-4 text-center">
        <h2 className="text-5xl text-[#4B2E2E] mb-6">Premium Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {productItems.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition">
              <div className="relative h-80 overflow-hidden">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl text-[#4B2E2E] mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-3">{item.desc}</p>
                <p className="text-3xl text-[#D2691E] mb-4">{item.price}</p>
                <button className="w-full py-3 bg-gradient-to-r from-[#D2691E] to-[#FF6F61] text-white rounded-lg">Add to Cart</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* -------------------- ABOUT SECTION -------------------- */}
      <section id="about" className="py-20 px-4 bg-white text-center">
        <h2 className="text-5xl text-[#4B2E2E] mb-6">About Mont Choffe</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Founded in 2005, Mont Choffe blends the finest cocoa and coffee beans to create a luxurious taste experience.
        </p>
      </section>

      {/* -------------------- CONTACT SECTION -------------------- */}
      <section id="contact" className="py-20 px-4 bg-[#F5F0E1] text-center">
        <h2 className="text-5xl text-[#4B2E2E] mb-6">Contact Us</h2>
        <form className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-3xl mx-auto space-y-6">
          <input type="text" placeholder="Your Name" className="w-full px-6 py-4 border-2 border-gray-200 rounded-lg" />
          <input type="email" placeholder="Your Email" className="w-full px-6 py-4 border-2 border-gray-200 rounded-lg" />
          <textarea placeholder="Your Message" rows={6} className="w-full px-6 py-4 border-2 border-gray-200 rounded-lg resize-none"></textarea>
          <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#D2691E] to-[#FF6F61] text-white rounded-lg">Send Message</button>
        </form>
      </section>

      {/* -------------------- FOOTER -------------------- */}
      <footer className="bg-[#4B2E2E] text-white py-8 px-4 text-center">
        <img src={logoImg} alt="Mont Choffe" className="h-16 w-auto mx-auto mb-4" />
        <p className="text-white/80">© 2025 Mont Choffe. All rights reserved.</p>
      </footer>

    </div>
  );
}
