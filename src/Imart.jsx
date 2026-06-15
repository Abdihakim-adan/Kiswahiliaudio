import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';

// Context
const StoreContext = createContext();
const useStore = () => useContext(StoreContext);

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
};

// Toast Context
const ToastContext = createContext();
const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className={`px-6 py-3 rounded-lg shadow-lg text-white animate-slide-in ${toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-red-500' : 'bg-amber-500'}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Product Data
const productsData = [
  { id: 1, name: "Madinah Luxury Prayer Mat", category: "Islamic Products", subcategory: "Prayer Mats", price: 89.99, originalPrice: 120, rating: 4.9, stock: 25, image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400", description: "Premium velvet prayer mat with intricate Islamic geometric patterns. Extra thick padding for comfort. Made with high-quality materials.", featured: true, salePercentage: 25, reviews: 128 },
  { id: 2, name: "Gold Illuminated Quran", category: "Islamic Products", subcategory: "Quran", price: 149.99, originalPrice: 199, rating: 5.0, stock: 15, image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=400", description: "Beautiful illuminated Quran with gold-edged pages. Large print with English translation. Comes with a velvet box.", featured: true, salePercentage: 25, reviews: 256 },
  { id: 3, name: "Crystal Tasbih Beads Set", category: "Islamic Products", subcategory: "Tasbih Beads", price: 34.99, originalPrice: 45, rating: 4.7, stock: 50, image: "https://images.unsplash.com/photo-1616776610524-2d0a1ad24ff2?w=400", description: "Handcrafted crystal tasbih beads with 99 beads. Smooth finish with a beautiful tassel. Available in multiple colors.", featured: true, salePercentage: 22, reviews: 89 },
  { id: 4, name: "Premium Hijab Collection", category: "Islamic Products", subcategory: "Hijabs", price: 24.99, originalPrice: 35, rating: 4.6, stock: 60, image: "https://images.unsplash.com/photo-1590734117948-55c64ec23932?w=400", description: "Soft chiffon hijab with beautiful drape. Breathable fabric perfect for all seasons. Includes matching undercap.", featured: false, salePercentage: 29, reviews: 345 },
  { id: 5, name: "Elegant Abaya - Black", category: "Islamic Products", subcategory: "Abayas", price: 79.99, originalPrice: 99, rating: 4.8, stock: 20, image: "https://images.unsplash.com/photo-1590502160462-58b41354f588?w=400", description: "Flowing black abaya with subtle embroidery. Premium Nidha fabric. Comfortable and elegant design.", featured: true, salePercentage: 19, reviews: 167 },
  { id: 6, name: "Royal Oud Attar Perfume", category: "Islamic Products", subcategory: "Attar Perfumes", price: 59.99, originalPrice: 75, rating: 4.9, stock: 30, image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400", description: "Long-lasting Arabian oud attar. Alcohol-free perfume oil. Rich woody fragrance with floral notes.", featured: false, salePercentage: 20, reviews: 432 },
  { id: 7, name: "Islamic Calligraphy Wall Art", category: "Islamic Products", subcategory: "Islamic Wall Art", price: 69.99, originalPrice: 89, rating: 4.8, stock: 18, image: "https://images.unsplash.com/photo-1604186838347-9fa03fd7ed1a?w=400", description: "Modern Islamic calligraphy canvas. Ayatul Kursi in elegant Arabic script. Ready to hang with frame.", featured: true, salePercentage: 21, reviews: 93 },
  { id: 8, name: "Digital Quran Speaker", category: "Islamic Products", subcategory: "Digital Quran Speakers", price: 129.99, originalPrice: 169, rating: 4.7, stock: 22, image: "https://images.unsplash.com/photo-1612619152861-14a3d90edb9e?w=400", description: "Crystal clear Quran recitation speaker. Multiple Qaris, translations, and Tafseer. Portable and rechargeable.", featured: false, salePercentage: 23, reviews: 278 },
  { id: 9, name: "Men's Classic Thobe - White", category: "Islamic Products", subcategory: "Thobes", price: 54.99, originalPrice: 69, rating: 4.5, stock: 40, image: "https://images.unsplash.com/photo-1617038220319-276d0cfab638?w=400", description: "Classic white thobe for men. Premium cotton blend. Comfortable fit with chest pocket.", featured: false, salePercentage: 20, reviews: 156 },
  { id: 10, name: "Islamic Studies Book Set", category: "Islamic Products", subcategory: "Islamic Books", price: 44.99, originalPrice: 60, rating: 4.8, stock: 35, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", description: "Complete set of 5 Islamic studies books. Includes Fiqh, Seerah, Hadith, Tafseer, and Aqeedah basics.", featured: false, salePercentage: 25, reviews: 189 },
  { id: 11, name: "SuperFast 65W USB-C Charger", category: "Electrical Accessories", subcategory: "Phone Chargers", price: 29.99, originalPrice: 45, rating: 4.6, stock: 100, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400", description: "GaN technology 65W fast charger. Compatible with all USB-C devices. Compact and travel-friendly.", featured: true, salePercentage: 33, reviews: 567 },
  { id: 12, name: "Ultra Durable USB-C Cable 2m", category: "Electrical Accessories", subcategory: "USB Cables", price: 14.99, originalPrice: 22, rating: 4.5, stock: 200, image: "https://images.unsplash.com/photo-1621284391958-5b75f49bb2b8?w=400", description: "Braided nylon USB-C cable. 2 meters long with reinforced connectors. Supports 100W charging and data transfer.", featured: false, salePercentage: 32, reviews: 890 },
  { id: 13, name: "MegaCharge 20000mAh Power Bank", category: "Electrical Accessories", subcategory: "Power Banks", price: 39.99, originalPrice: 55, rating: 4.7, stock: 45, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400", description: "High capacity 20000mAh power bank. Fast charging with dual USB outputs. LED battery indicator.", featured: true, salePercentage: 27, reviews: 723 },
  { id: 14, name: "ProSound Wireless Earbuds", category: "Electrical Accessories", subcategory: "Earbuds", price: 49.99, originalPrice: 79, rating: 4.4, stock: 55, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f6c?w=400", description: "True wireless earbuds with active noise cancellation. 30-hour battery life. IPX5 water resistant.", featured: false, salePercentage: 37, reviews: 1234 },
  { id: 15, name: "BoomBox Bluetooth Speaker", category: "Electrical Accessories", subcategory: "Bluetooth Speakers", price: 59.99, originalPrice: 89, rating: 4.6, stock: 30, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", description: "Portable bluetooth speaker with deep bass. 360° sound. Waterproof IPX7. 20-hour playtime.", featured: true, salePercentage: 33, reviews: 456 },
  { id: 16, name: "SmartFit Pro Watch", category: "Electrical Accessories", subcategory: "Smart Watches", price: 89.99, originalPrice: 129, rating: 4.5, stock: 20, image: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400", description: "Advanced smartwatch with heart rate monitor, SpO2, GPS. 7-day battery. 1.4 inch AMOLED display.", featured: false, salePercentage: 30, reviews: 678 },
  { id: 17, name: "Heavy Duty Extension Cable 5m", category: "Electrical Accessories", subcategory: "Extension Cables", price: 19.99, originalPrice: 28, rating: 4.4, stock: 75, image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400", description: "5-meter heavy duty extension cord. Surge protection with 4 outlets. Fire resistant material.", featured: false, salePercentage: 29, reviews: 345 },
  { id: 18, name: "Smart RGB LED Strip 5m", category: "Electrical Accessories", subcategory: "LED Lights", price: 24.99, originalPrice: 35, rating: 4.7, stock: 65, image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400", description: "App-controlled RGB LED strip lights. 16 million colors. Music sync. Works with Alexa and Google Home.", featured: false, salePercentage: 29, reviews: 1567 },
  { id: 19, name: "AirCharge Wireless Pad", category: "Electrical Accessories", subcategory: "Wireless Chargers", price: 22.99, originalPrice: 35, rating: 4.3, stock: 55, image: "https://images.unsplash.com/photo-1622957040878-3de0e7a1e6b5?w=400", description: "15W fast wireless charger. Compatible with all Qi devices. Slim design with LED indicator.", featured: false, salePercentage: 34, reviews: 234 },
  { id: 20, name: "Ultra 256GB Memory Card", category: "Electrical Accessories", subcategory: "Memory Cards", price: 34.99, originalPrice: 49, rating: 4.6, stock: 80, image: "https://images.unsplash.com/photo-1606122017369-d782bbb78f32?w=400", description: "256GB microSD card with adapter. U3 V30 speed class. Perfect for 4K video recording.", featured: false, salePercentage: 29, reviews: 567 },
  { id: 21, name: "Luxury Velvet Hijab Set", category: "Islamic Products", subcategory: "Hijabs", price: 29.99, originalPrice: 42, rating: 4.8, stock: 45, image: "https://images.unsplash.com/photo-1589810635657-232948472d98?w=400", description: "Set of 3 premium velvet hijabs in neutral tones. Perfect for special occasions.", featured: true, salePercentage: 29, reviews: 234 },
  { id: 22, name: "Compact Travel Prayer Mat", category: "Islamic Products", subcategory: "Prayer Mats", price: 39.99, originalPrice: 55, rating: 4.7, stock: 55, image: "https://images.unsplash.com/photo-1601297583561-9b5c42a21f55?w=400", description: "Lightweight foldable prayer mat with compass. Water-resistant and machine washable.", featured: false, salePercentage: 27, reviews: 178 },
  { id: 23, name: "FastCharge 120W Cable Kit", category: "Electrical Accessories", subcategory: "USB Cables", price: 19.99, originalPrice: 30, rating: 4.5, stock: 120, image: "https://images.unsplash.com/photo-1612810806563-4cb8265ee6f6?w=400", description: "Complete cable kit with USB-C, Lightning, and Micro USB. 120W fast charging support.", featured: true, salePercentage: 33, reviews: 456 },
  { id: 24, name: "Mini Power Bank 5000mAh", category: "Electrical Accessories", subcategory: "Power Banks", price: 19.99, originalPrice: 28, rating: 4.4, stock: 90, image: "https://images.unsplash.com/photo-1624797432677-6f803a98acb3?w=400", description: "Ultra-compact 5000mAh power bank. Fits in pocket. Fast charging with USB-C.", featured: false, salePercentage: 29, reviews: 345 },
  { id: 25, name: "Premium Wooden Tasbih", category: "Islamic Products", subcategory: "Tasbih Beads", price: 24.99, originalPrice: 35, rating: 4.6, stock: 40, image: "https://images.unsplash.com/photo-1616776610524-2d0a1ad24ff2?w=400", description: "Hand-carved sandalwood tasbih. 33 beads with beautiful natural aroma. Gift box included.", featured: false, salePercentage: 29, reviews: 123 },
  { id: 26, name: "Noise Cancelling Earbuds Pro", category: "Electrical Accessories", subcategory: "Earbuds", price: 69.99, originalPrice: 99, rating: 4.7, stock: 35, image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400", description: "Premium ANC earbuds with transparency mode. 40-hour total battery. Wireless charging case.", featured: true, salePercentage: 29, reviews: 890 },
  { id: 27, name: "Jumbo Digital Quran", category: "Islamic Products", subcategory: "Quran", price: 199.99, originalPrice: 259, rating: 4.9, stock: 10, image: "https://images.unsplash.com/photo-1604186838347-9fa03fd7ed1a?w=400", description: "Large print digital Quran with 17 language translations. Full color Tafseer. Gift edition.", featured: false, salePercentage: 23, reviews: 67 },
  { id: 28, name: "Smart Band Fitness Tracker", category: "Electrical Accessories", subcategory: "Smart Watches", price: 34.99, originalPrice: 49, rating: 4.3, stock: 60, image: "https://images.unsplash.com/photo-1575311373937-040b8e3fd6ce?w=400", description: "Fitness tracker with 14 sports modes. Heart rate, SpO2, sleep tracking. 14-day battery life.", featured: false, salePercentage: 29, reviews: 1567 },
  { id: 29, name: "Arabian Nights Attar Set", category: "Islamic Products", subcategory: "Attar Perfumes", price: 44.99, originalPrice: 65, rating: 4.8, stock: 25, image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400", description: "Set of 6 premium attar oils. Includes Oud, Rose, Musk, Amber, Jasmine, and Sandalwood.", featured: true, salePercentage: 31, reviews: 234 },
  { id: 30, name: "RGB Gaming LED Strip 2m", category: "Electrical Accessories", subcategory: "LED Lights", price: 16.99, originalPrice: 25, rating: 4.5, stock: 95, image: "https://images.unsplash.com/photo-1563206814-b53b02b1ab0b?w=400", description: "USB-powered RGB LED strip for desk setup. Remote controlled. Multiple lighting modes.", featured: false, salePercentage: 32, reviews: 678 },
  { id: 31, name: "Kids Quran Learning Tablet", category: "Islamic Products", subcategory: "Digital Quran Speakers", price: 49.99, originalPrice: 69, rating: 4.7, stock: 30, image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400", description: "Interactive Islamic learning tablet for kids. Quran recitation, Duas, and Islamic songs.", featured: false, salePercentage: 28, reviews: 345 },
  { id: 32, name: "Wireless Charging Stand", category: "Electrical Accessories", subcategory: "Wireless Chargers", price: 27.99, originalPrice: 40, rating: 4.4, stock: 70, image: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=400", description: "3-in-1 wireless charging stand for phone, watch, and earbuds. Fast charging. Anti-slip base.", featured: false, salePercentage: 30, reviews: 456 },
  { id: 33, name: "Embroidered Abaya - Navy", category: "Islamic Products", subcategory: "Abayas", price: 89.99, originalPrice: 119, rating: 4.9, stock: 15, image: "https://images.unsplash.com/photo-1614849286521-4c58b8c984e0?w=400", description: "Stunning navy blue embroidered abaya. Premium crepe fabric. Front-open design with belt.", featured: true, salePercentage: 24, reviews: 89 },
  { id: 34, name: "Premium Leather Thobe", category: "Islamic Products", subcategory: "Thobes", price: 69.99, originalPrice: 95, rating: 4.6, stock: 25, image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400", description: "Premium quality thobe with subtle stripe pattern. Breathable cotton blend. Perfect for formal occasions.", featured: false, salePercentage: 26, reviews: 112 },
  { id: 35, name: "Sadaqah Jar - Automatic", category: "Islamic Products", subcategory: "Islamic Wall Art", price: 34.99, originalPrice: 48, rating: 4.8, stock: 40, image: "https://images.unsplash.com/photo-1607944024060-0450380ddd33?w=400", description: "Beautiful automatic coin sadaqah jar. LED display shows total saved. Islamic design with dua for barakah.", featured: false, salePercentage: 27, reviews: 234 }
];

// Testimonials
const testimonials = [
  { id: 1, name: "Aisha Rahman", role: "Verified Buyer", text: "Beautiful products with excellent quality. The prayer mat exceeded my expectations. Fast delivery too!", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
  { id: 2, name: "Omar Farooq", role: "Regular Customer", text: "Imart has become my go-to for Islamic products. Their electronics section is also amazing!", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
  { id: 3, name: "Fatima Hassan", role: "Verified Buyer", text: "The attar collection is authentic and long-lasting. Customer service is excellent. Highly recommended!", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" }
];

// FAQ Data
const faqData = [
  { question: "What is your shipping policy?", answer: "We offer free shipping on orders over $75. Standard delivery takes 3-5 business days. Express shipping available." },
  { question: "How can I return an item?", answer: "Returns accepted within 30 days of purchase. Items must be unused and in original packaging. Free returns on defective products." },
  { question: "Are the Islamic products authentic?", answer: "Yes, all our Islamic products are sourced from certified suppliers and scholars. Quran copies are verified for accuracy." },
  { question: "Do you ship internationally?", answer: "Yes, we ship to over 50 countries worldwide. International shipping rates vary based on location." },
  { question: "What payment methods do you accept?", answer: "We accept all major credit cards, PayPal, Apple Pay, and Google Pay. All transactions are secure and encrypted." }
];

const formatPrice = (price) => `$${price.toFixed(2)}`;

const generateStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= Math.floor(rating) ? '★' : i - 0.5 <= rating ? '★' : '☆');
  }
  return stars.join('');
};

// Navbar Component
const Navbar = ({ darkMode, setDarkMode, cartCount, wishlistCount, setShowCart, setShowWishlist, setShowCheckout }) => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { setSearchQuery, setShowSearch } = useStore();

  return (
    <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-lg shadow-lg border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-amber-500 flex items-center justify-center text-white text-xl font-bold">iM</div>
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Imart<span className="text-emerald-600"> Online Shop</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="#home" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Home</a>
            <a href="#products" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Shop</a>
            <a href="#deals" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Deals</a>
            <a href="#testimonials" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Reviews</a>
            <a href="#faq" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>FAQ</a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search products..."
                className={`w-64 px-4 py-2 rounded-full ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setSearchQuery(searchTerm);
                    setShowSearch(true);
                  }
                }}
              />
              <button onClick={() => { setSearchQuery(searchTerm); setShowSearch(true); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</button>
            </div>

            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'} hover:scale-110 transition-transform`}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setShowWishlist(true)} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <span className="text-xl">♡</span>
              {wishlistCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{wishlistCount}</span>}
            </button>
            <button onClick={() => setShowCart(true)} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <span className="text-xl">🛒</span>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <span className="text-xl">👤</span>
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors">
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className={`md:hidden py-4 space-y-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <a href="#home" className={`block px-4 py-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>Home</a>
            <a href="#products" className={`block px-4 py-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>Shop</a>
            <a href="#deals" className={`block px-4 py-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>Deals</a>
            <a href="#testimonials" className={`block px-4 py-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>Reviews</a>
            <a href="#faq" className={`block px-4 py-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>FAQ</a>
            <input
              type="text"
              placeholder="Search products..."
              className={`w-full px-4 py-2 rounded-full ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} border`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setSearchQuery(searchTerm);
                  setShowSearch(true);
                  setMobileMenu(false);
                }
              }}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

// Countdown Timer
const CountdownTimer = () => {
  const [time, setTime] = useState({ hours: 8, minutes: 45, seconds: 30 });
  const { darkMode } = useStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 45, seconds: 30 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg px-3 sm:px-4 py-2 text-center shadow-lg`}>
        <div className="text-xl sm:text-2xl font-bold text-emerald-600">{String(time.hours).padStart(2, '0')}</div>
        <div className="text-xs text-gray-500">Hours</div>
      </div>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg px-3 sm:px-4 py-2 text-center shadow-lg`}>
        <div className="text-xl sm:text-2xl font-bold text-emerald-600">{String(time.minutes).padStart(2, '0')}</div>
        <div className="text-xs text-gray-500">Minutes</div>
      </div>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg px-3 sm:px-4 py-2 text-center shadow-lg`}>
        <div className="text-xl sm:text-2xl font-bold text-emerald-600">{String(time.seconds).padStart(2, '0')}</div>
        <div className="text-xs text-gray-500">Seconds</div>
      </div>
    </div>
  );
};

// Product Card
const ProductCard = ({ product, onAddToCart, onAddToWishlist, onProductClick, wishlistItems }) => {
  const { darkMode } = useStore();
  const isInWishlist = wishlistItems.some(item => item.id === product.id);

  return (
    <div
      className={`group relative ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
      onClick={() => onProductClick(product)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {product.salePercentage > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{product.salePercentage}%
          </div>
        )}
        {product.featured && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            HOT
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onAddToWishlist(product); }}
          className={`absolute top-3 ${product.featured ? 'right-20' : 'right-3'} p-2 rounded-full ${isInWishlist ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600'} hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg`}
        >
          {isInWishlist ? '❤️' : '♡'}
        </button>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      <div className="p-4">
        <span className={`text-xs font-semibold text-emerald-600 uppercase tracking-wider`}>{product.subcategory}</span>
        <h3 className={`font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'} line-clamp-1`}>{product.name}</h3>
        <div className="flex items-center mt-2">
          <span className="text-amber-500 text-sm">{generateStars(product.rating)}</span>
          <span className={`text-xs ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-xl font-bold text-emerald-600">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className={`text-sm line-through ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className={`text-xs ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {product.stock > 10 ? '✓ In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          disabled={product.stock === 0}
          className={`mt-3 w-full py-2.5 rounded-xl font-semibold transition-all duration-300 ${product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'} text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

// Product Modal
const ProductModal = ({ product, onClose, onAddToCart, onAddToWishlist, wishlistItems }) => {
  const { darkMode } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const isInWishlist = wishlistItems.some(item => item.id === product.id);
  const images = [product.image, product.image.replace('w=400', 'w=600'), product.image.replace('w=400', 'w=800')];

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in`}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white text-xl transition-colors">✕</button>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-6 md:p-8">
            <div className="relative overflow-hidden rounded-2xl">
              <img src={images[selectedImage]} alt={product.name} className="w-full h-80 object-cover" />
            </div>
            <div className="flex space-x-2 mt-4">
              {images.map((img, i) => (
                <img key={i} src={img} alt="" className={`w-20 h-20 object-cover rounded-lg cursor-pointer ${selectedImage === i ? 'ring-2 ring-emerald-600' : ''}`} onClick={() => setSelectedImage(i)} />
              ))}
            </div>
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            <span className="text-sm text-emerald-600 font-semibold">{product.subcategory}</span>
            <h2 className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{product.name}</h2>
            <div className="flex items-center mt-2">
              <span className="text-amber-500 text-lg">{generateStars(product.rating)}</span>
              <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>({product.reviews} reviews)</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-emerald-600">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && <span className={`text-lg line-through ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{formatPrice(product.originalPrice)}</span>}
              {product.salePercentage > 0 && <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">Save {product.salePercentage}%</span>}
            </div>
            <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{product.description}</p>
            <div className={`mt-4 p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <span className={`text-sm ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'} font-semibold`}>
                {product.stock > 10 ? '✓ In Stock' : product.stock > 0 ? `⚠ Only ${product.stock} left` : '✕ Out of Stock'}
              </span>
            </div>
            {product.stock > 0 && (
              <div className="flex items-center space-x-4 mt-6">
                <label className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Qty:</label>
                <div className="flex items-center border rounded-xl">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">−</button>
                  <span className={`px-4 py-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">+</button>
                </div>
              </div>
            )}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => { onAddToCart(product, quantity); }}
                disabled={product.stock === 0}
                className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 ${product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.01]'}`}
              >
                Add to Cart
              </button>
              <button
                onClick={() => onAddToWishlist(product)}
                className={`w-full py-3 rounded-xl font-bold text-lg border-2 transition-all duration-300 ${isInWishlist ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20' : `${darkMode ? 'border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-500' : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'}`}`}
              >
                {isInWishlist ? '❤️ In Wishlist' : '♡ Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cart Drawer
const CartDrawer = ({ showCart, setShowCart, cartItems, setCartItems, setShowCheckout }) => {
  const { darkMode } = useStore();
  const { addToast } = useToast();

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty < 1) return item;
        if (newQty > item.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id, name) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    addToast(`${name} removed from cart`, 'info');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 75 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <>
      {showCart && <div className="fixed inset-0 z-[90] bg-black/50" onClick={() => setShowCart(false)} />}
      <div className={`fixed top-0 right-0 z-[100] h-full w-full max-w-md transform transition-transform duration-300 ${showCart ? 'translate-x-0' : 'translate-x-full'} ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl flex flex-col`}>
        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Shopping Cart ({cartItems.length})</h2>
          <button onClick={() => setShowCart(false)} className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-6xl mb-4">🛒</span>
              <p className="text-lg">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className={`flex space-x-4 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} line-clamp-1`}>{item.name}</h4>
                  <p className="text-emerald-600 font-bold">{formatPrice(item.price * item.quantity)}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300">−</button>
                    <span className={darkMode ? 'text-white' : 'text-gray-800'}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300">+</button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id, item.name)} className="text-red-500 hover:text-red-700">🗑️</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="space-y-2">
              <div className="flex justify-between"><span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span><span className={darkMode ? 'text-white' : 'text-gray-800'}>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Tax (8%)</span><span className={darkMode ? 'text-white' : 'text-gray-800'}>{formatPrice(tax)}</span></div>
              <div className="flex justify-between"><span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Shipping</span><span className={darkMode ? 'text-white' : 'text-gray-800'}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span className={darkMode ? 'text-white' : 'text-gray-800'}>Total</span>
                <span className="text-emerald-600">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              onClick={() => { setShowCart(false); setShowCheckout(true); }}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg hover:from-emerald-700 hover:to-teal-700 shadow-lg transition-all duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Wishlist Drawer
const WishlistDrawer = ({ showWishlist, setShowWishlist, wishlistItems, setWishlistItems, onAddToCart, onProductClick }) => {
  const { darkMode } = useStore();
  const { addToast } = useToast();

  const removeFromWishlist = (id, name) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    addToast(`${name} removed from wishlist`, 'info');
  };

  return (
    <>
      {showWishlist && <div className="fixed inset-0 z-[90] bg-black/50" onClick={() => setShowWishlist(false)} />}
      <div className={`fixed top-0 right-0 z-[100] h-full w-full max-w-md transform transition-transform duration-300 ${showWishlist ? 'translate-x-0' : 'translate-x-full'} ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl flex flex-col`}>
        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>❤️ Wishlist ({wishlistItems.length})</h2>
          <button onClick={() => setShowWishlist(false)} className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-xl">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-6xl mb-4">♡</span>
              <p className="text-lg">Your wishlist is empty</p>
            </div>
          ) : (
            wishlistItems.map(item => (
              <div key={item.id} className={`flex space-x-4 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} cursor-pointer`} onClick={() => onProductClick(item)}>
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.name}</h4>
                  <p className="text-emerald-600 font-bold">{formatPrice(item.price)}</p>
                  <p className="text-amber-500 text-sm">{generateStars(item.rating)}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">🛒</button>
                  <button onClick={(e) => { e.stopPropagation(); removeFromWishlist(item.id, item.name); }} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200">🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

// Checkout Page
const CheckoutPage = ({ showCheckout, setShowCheckout, cartItems, setCartItems }) => {
  const { darkMode } = useStore();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: 'US', payment: 'card' });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 75 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    addToast('Order placed successfully! Thank you for shopping at Imart.', 'success');
    setTimeout(() => {
      setShowCheckout(false);
      setOrderPlaced(false);
      setCartItems([]);
    }, 3000);
  };

  if (!showCheckout) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={() => setShowCheckout(false)} />
      <div className={`relative ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8`}>
        <button onClick={() => setShowCheckout(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl">✕</button>

        {orderPlaced ? (
          <div className="text-center py-12">
            <span className="text-6xl">🎉</span>
            <h2 className={`text-3xl font-bold mt-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Order Placed!</h2>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Thank you for shopping at Imart. Check your email for confirmation.</p>
          </div>
        ) : (
          <>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Checkout - Imart</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="name" required placeholder="Full Name" onChange={handleChange} className={`px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-emerald-500 focus:outline-none`} />
                  <input name="email" type="email" required placeholder="Email" onChange={handleChange} className={`px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-emerald-500 focus:outline-none`} />
                  <input name="phone" type="tel" required placeholder="Phone" onChange={handleChange} className={`px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-emerald-500 focus:outline-none`} />
                </div>
              </div>
              <div>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Shipping Address</h3>
                <div className="space-y-4">
                  <input name="address" required placeholder="Address" onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-emerald-500 focus:outline-none`} />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="city" required placeholder="City" onChange={handleChange} className={`px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-emerald-500 focus:outline-none`} />
                    <input name="state" required placeholder="State" onChange={handleChange} className={`px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-emerald-500 focus:outline-none`} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input name="zip" required placeholder="ZIP Code" onChange={handleChange} className={`px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-emerald-500 focus:outline-none`} />
                    <select name="country" onChange={handleChange} className={`px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-emerald-500 focus:outline-none`}>
                      <option value="US">United States</option><option value="UK">United Kingdom</option><option value="CA">Canada</option><option value="AE">UAE</option><option value="SA">Saudi Arabia</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Payment Method</h3>
                <div className="space-y-2">
                  {['card', 'paypal', 'apple'].map(method => (
                    <label key={method} className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer ${form.payment === method ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500' : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border`}>
                      <input type="radio" name="payment" value={method} checked={form.payment === method} onChange={handleChange} className="accent-emerald-600" />
                      <span className={darkMode ? 'text-white' : 'text-gray-800'}>{method === 'card' ? '💳 Credit/Debit Card' : method === 'paypal' ? '🅿️ PayPal' : '🍎 Apple Pay'}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Order Summary</h3>
                <div className="space-y-2">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{item.name} x{item.quantity}</span>
                      <span className={darkMode ? 'text-white' : 'text-gray-800'}>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <hr className={darkMode ? 'border-gray-700' : 'border-gray-200'} />
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>{formatPrice(tax)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-emerald-600">{formatPrice(total)}</span></div>
                </div>
              </div>
              <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg hover:from-emerald-700 hover:to-teal-700 shadow-xl transition-all duration-300">
                Place Order
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// WhatsApp Button
const WhatsAppButton = () => (
  <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300 animate-bounce">
    💬
  </a>
);

// Back to Top Button
const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return visible ? (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xl shadow-2xl hover:bg-emerald-700 hover:scale-110 transition-all duration-300">
      ↑
    </button>
  ) : null;
};

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
  </div>
);

// Main App
const AppContent = () => {
  const { darkMode, setDarkMode, searchQuery, setSearchQuery, showSearch, setShowSearch } = useStore();
  const { addToast } = useToast();
  const [cartItems, setCartItems] = useLocalStorage('imart_cartItems', []);
  const [wishlistItems, setWishlistItems] = useLocalStorage('imart_wishlistItems', []);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: Math.min(item.stock, item.quantity + quantity) } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    addToast(`${product.name} added to cart!`, 'success');
  }, [setCartItems, addToast]);

  const addToWishlist = useCallback((product) => {
    setWishlistItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        addToast(`${product.name} removed from wishlist`, 'info');
        return prev.filter(item => item.id !== product.id);
      }
      addToast(`${product.name} added to wishlist!`, 'success');
      return [...prev, product];
    });
  }, [setWishlistItems, addToast]);

  const handleNewsletter = (e) => {
    e.preventDefault();
    addToast('Thank you for subscribing to Imart!', 'success');
    setNewsletterEmail('');
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...productsData];
    if (searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (filterCategory !== 'All') {
      filtered = filtered.filter(p => p.category === filterCategory || p.subcategory === filterCategory);
    }
    if (priceRange[0] > 0 || priceRange[1] < 500) {
      filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    }
    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating);
    }
    if (inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0);
    }
    if (featuredOnly) {
      filtered = filtered.filter(p => p.featured);
    }

    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'newest': filtered.sort((a, b) => b.id - a.id); break;
      default: filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
    }
    return filtered;
  }, [searchQuery, filterCategory, sortBy, priceRange, minRating, inStockOnly, featuredOnly]);

  const categories = ['All', 'Islamic Products', 'Electrical Accessories', 'Prayer Mats', 'Quran', 'Hijabs', 'Abayas', 'Thobes', 'Attar Perfumes', 'Earbuds', 'Smart Watches', 'Phone Chargers'];
  const featuredProducts = productsData.filter(p => p.featured);
  const bestSellers = productsData.filter(p => p.reviews > 300).slice(0, 8);
  const newArrivals = productsData.filter(p => p.id > 25).slice(0, 8);

  if (loading) return <LoadingSpinner />;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950 text-white' : 'bg-[#F8FAFC] text-[#1F2937]'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} wishlistCount={wishlistItems.length} setShowCart={setShowCart} setShowWishlist={setShowWishlist} setShowCheckout={setShowCheckout} />

      <main>
        {/* Hero Section */}
        <section id="home" className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-teal-900/80 to-gray-900/90" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Welcome to <span className="text-amber-400">Imart</span> Online Shop
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Discover premium Islamic products and cutting-edge electronics. Your one-stop destination for quality shopping with barakah.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#products" className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Shop Now
              </a>
              <a href="#deals" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300">
                View Deals
              </a>
            </div>
          </div>
        </section>

        {/* Flash Sale Banner */}
        <section id="deals" className={`py-8 sm:py-12 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className={`bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 rounded-3xl p-6 sm:p-10 text-white text-center shadow-2xl`}>
              <h2 className="text-2xl sm:text-4xl font-bold mb-2">⚡ Flash Sale at Imart!</h2>
              <p className="text-lg mb-6">Up to 40% off on selected items. Don't miss out!</p>
              <CountdownTimer />
              <div className="mt-6">
                <a href="#products" className="inline-block px-8 py-3 bg-white text-red-600 rounded-full font-bold hover:bg-gray-100 transition-colors">Shop Flash Sale</a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Collections */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Featured Collections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} onAddToWishlist={addToWishlist} onProductClick={setSelectedProduct} wishlistItems={wishlistItems} />
              ))}
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className={`py-12 sm:py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Best Sellers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} onAddToWishlist={addToWishlist} onProductClick={setSelectedProduct} wishlistItems={wishlistItems} />
              ))}
            </div>
          </div>
        </section>

        {/* All Products with Filters */}
        <section id="products" className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>All Products</h2>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search products at Imart..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-emerald-500 focus:outline-none`}
                />
              </div>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={`px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-emerald-500 focus:outline-none`}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-emerald-500 focus:outline-none`}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center space-x-2">
                <input type="checkbox" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} className="accent-emerald-600" />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>In Stock</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" checked={featuredOnly} onChange={() => setFeaturedOnly(!featuredOnly)} className="accent-emerald-600" />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Featured</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Min Rating:</span>
                <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className={`px-3 py-1 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}>
                  <option value={0}>Any</option>
                  <option value={4}>4★ & up</option>
                  <option value={4.5}>4.5★ & up</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} onAddToWishlist={addToWishlist} onProductClick={setSelectedProduct} wishlistItems={wishlistItems} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <p className="text-center py-12 text-gray-500">No products found at Imart matching your criteria.</p>
            )}
          </div>
        </section>

        {/* New Arrivals */}
        <section className={`py-12 sm:py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>New Arrivals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} onAddToWishlist={addToWishlist} onProductClick={setSelectedProduct} wishlistItems={wishlistItems} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>What Imart Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map(t => (
                <div key={t.id} className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.name}</h4>
                      <p className="text-emerald-600 text-sm">{t.role}</p>
                    </div>
                  </div>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>"{t.text}"</p>
                  <span className="text-amber-500">{generateStars(t.rating)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className={`py-12 sm:py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-3xl mx-auto px-4">
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqData.map((faq, i) => (
                <details key={i} className={`group rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-4 cursor-pointer`}>
                  <summary className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{faq.question}</summary>
                  <p className={`mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="max-w-3xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Imart Newsletter</h2>
            <p className="text-lg mb-6">Get exclusive deals, new arrivals, and updates delivered to your inbox.</p>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-amber-400 focus:outline-none" />
              <button type="submit" className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors">Subscribe</button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-12 ${darkMode ? 'bg-gray-950 border-t border-gray-800' : 'bg-gray-900 text-white'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-amber-500 flex items-center justify-center text-white text-xl font-bold">iM</div>
                  <span className="text-xl font-bold text-white">Imart<span className="text-emerald-400"> Online Shop</span></span>
                </div>
                <p className="text-gray-400">Your trusted source for premium Islamic products and electronics. Quality you can trust at Imart.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                  <li><a href="#products" className="hover:text-white transition-colors">Shop</a></li>
                  <li><a href="#deals" className="hover:text-white transition-colors">Deals</a></li>
                  <li><a href="#testimonials" className="hover:text-white transition-colors">Reviews</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Categories</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Islamic Products</li>
                  <li>Electrical Accessories</li>
                  <li>Prayer Essentials</li>
                  <li>Islamic Wear</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Contact Imart</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>📧 support@imartshop.com</li>
                  <li>📞 +1 (555) 123-4567</li>
                  <li>📍 123 Imart Street, NY</li>
                </ul>
              </div>
            </div>
            <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-700'} text-center text-gray-500`}>
              <p>&copy; 2024 Imart Online Shop. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>

      {/* Modals & Drawers */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} onAddToWishlist={addToWishlist} wishlistItems={wishlistItems} />}
      <CartDrawer showCart={showCart} setShowCart={setShowCart} cartItems={cartItems} setCartItems={setCartItems} setShowCheckout={setShowCheckout} />
      <WishlistDrawer showWishlist={showWishlist} setShowWishlist={setShowWishlist} wishlistItems={wishlistItems} setWishlistItems={setWishlistItems} onAddToCart={addToCart} onProductClick={setSelectedProduct} />
      <CheckoutPage showCheckout={showCheckout} setShowCheckout={setShowCheckout} cartItems={cartItems} setCartItems={setCartItems} />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

// Root App Component - Imart
const Imart = () => {
  const [darkMode, setDarkMode] = useLocalStorage('imart_darkMode', false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  return (
    <StoreContext.Provider value={{ darkMode, setDarkMode, searchQuery, setSearchQuery, showSearch, setShowSearch }}>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </StoreContext.Provider>
  );
};

export default Imart;