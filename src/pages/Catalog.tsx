import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import CartToast from '@/components/CartToast';
import { apiFetch } from '@/lib/api';

interface Product {
  sku: string;
  name: string;
  category: string;
  unitType: string;
  imageUrl?: string | null;
  pricePerKg: number;
  gstPercent: number;
}

interface CartItem {
  sku: string;
  quantity_kg: number;
}

const PAGE_SIZE = 10;

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showCartToast, setShowCartToast] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [distributorName, setDistributorName] = useState("Raj Distributors");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch(`/api/catalog?page=${page}&pageSize=${PAGE_SIZE}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        // If backend returns { products: [], total: number }
        if (Array.isArray(data)) {
          setProducts(data);
          setTotalProducts(null); // No total info
        } else if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          setTotalProducts(data.total || null);
        } else {
          setProducts([]);
        }
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  // Load cart and distributor name from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('narayanji_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    const savedName = localStorage.getItem('narayanji_distributor_name');
    if (savedName) {
      setDistributorName(savedName);
    } else {
      localStorage.setItem('narayanji_distributor_name', distributorName);
    }
  }, []);

  // Calculate cart total
  useEffect(() => {
    let total = 0;
    cart.forEach(item => {
      const product = products.find(p => p.sku === item.sku);
      if (product) {
        total += product.pricePerKg * item.quantity_kg;
      }
    });
    setCartTotal(total);
  }, [cart, products]);

  // Filter products based on search and category
  useEffect(() => {
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

  // Get unique categories from products
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Pagination controls
  const handlePrevPage = () => setPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setPage(p => p + 1);

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
        {/* Products Grid */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h3>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading products...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.sku}
                    product={{
                      ...product,
                      price_per_kg: product.pricePerKg,
                      gst_percent: product.gstPercent
                    }}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No products found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center gap-4 mb-4">
          <Button onClick={handlePrevPage} disabled={page === 1 || loading}>
            Previous
          </Button>
          <span className="self-center">Page {page}</span>
          <Button onClick={handleNextPage} disabled={loading || (totalProducts !== null && products.length < PAGE_SIZE)}>
            Next
          </Button>
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
