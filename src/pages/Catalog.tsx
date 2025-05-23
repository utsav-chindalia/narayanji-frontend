
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import CartToast from '@/components/CartToast';

interface Product {
  sku: string;
  name: string;
  category: string;
  image_url?: string;
  price_per_kg: number;
  gst_percent: number;
  is_popular?: boolean;
}

interface CartItem {
  sku: string;
  quantity_kg: number;
}

const Catalog = () => {
  const [products] = useState<Product[]>([
    {
      sku: "GJK-REG-250",
      name: "Regular Gajak",
      category: "Traditional",
      price_per_kg: 450,
      gst_percent: 5,
      is_popular: true
    },
    {
      sku: "GJK-SPL-250", 
      name: "Special Gajak",
      category: "Premium",
      price_per_kg: 520,
      gst_percent: 5,
      is_popular: false
    },
    {
      sku: "GJK-DRY-500",
      name: "Dry Fruit Gajak", 
      category: "Premium",
      price_per_kg: 680,
      gst_percent: 5,
      is_popular: true
    },
    {
      sku: "GJK-TIL-250",
      name: "Til Gajak",
      category: "Traditional", 
      price_per_kg: 420,
      gst_percent: 5,
      is_popular: false
    }
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [showCartToast, setShowCartToast] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [distributorName, setDistributorName] = useState("Raj Distributors");

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('narayanji_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    // Load distributor name - in a real app, this would come from auth data
    const savedName = localStorage.getItem('narayanji_distributor_name');
    if (savedName) {
      setDistributorName(savedName);
    } else {
      // For demo purposes, save a default name
      localStorage.setItem('narayanji_distributor_name', distributorName);
    }
  }, []);

  useEffect(() => {
    // Calculate cart total
    let total = 0;
    cart.forEach(item => {
      const product = products.find(p => p.sku === item.sku);
      if (product) {
        total += product.price_per_kg * item.quantity_kg;
      }
    });
    setCartTotal(total);
  }, [cart, products]);

  useEffect(() => {
    // Filter products based on search and category
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const handleAddToCart = (sku: string, quantity: number) => {
    const existingItemIndex = cart.findIndex(item => item.sku === sku);
    let newCart: CartItem[];

    if (existingItemIndex >= 0) {
      newCart = [...cart];
      newCart[existingItemIndex].quantity_kg += quantity;
    } else {
      newCart = [...cart, { sku, quantity_kg: quantity }];
    }

    setCart(newCart);
    localStorage.setItem('narayanji_cart', JSON.stringify(newCart));
    setShowCartToast(true);
  };

  const cartItemCount = cart.reduce((total, item) => total + 1, 0);

  return (
    <div className="min-h-screen bg-cream-50 pb-16">
      <Header cartItemCount={cartItemCount} />
      
      <div className="px-4 py-6">
        {/* Welcome Message */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {distributorName}</h1>
          <p className="text-gray-600">Browse our latest products</p>
        </div>
      
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`whitespace-nowrap ${
                selectedCategory === category 
                  ? 'bg-brand-red text-white' 
                  : 'bg-white text-gray-700 hover:bg-cream-100'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Deal of the Day */}
        <div className="bg-gradient-to-r from-brand-red to-brand-red-light text-white rounded-lg p-4 mb-6">
          <h2 className="text-xl font-bold">Deal of the Day - 35% OFF</h2>
          <p className="text-sm mt-1 opacity-90">View coupon details</p>
        </div>

        {/* Products Grid */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h3>
          
          {/* Single column in mobile view */}
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.sku}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      <BottomNav cartItemCount={cartItemCount} />
      
      <CartToast 
        visible={showCartToast} 
        itemCount={cartItemCount} 
        totalPrice={cartTotal}
        onClose={() => setShowCartToast(false)}
      />
    </div>
  );
};

export default Catalog;
