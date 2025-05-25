import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [distributorName, setDistributorName] = useState("HONEY MONEY TOP");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Fetch products from backend (infinite scroll version)
  useEffect(() => {
    const fetchProducts = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      try {
        // Build API URL with search if present
        let apiUrl = `/api/catalog?page=${page}&pageSize=${PAGE_SIZE}`;
        if (searchTerm) {
          apiUrl += `&search=${encodeURIComponent(searchTerm)}`;
        }
        const response = await apiFetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        if (data.products && Array.isArray(data.products)) {
          setProducts(prev => page === 1 ? data.products : [...prev, ...data.products]);
          setTotalProducts(typeof data.total === 'number' ? data.total : null);
        } else {
          if (page === 1) setProducts([]);
          setTotalProducts(0);
        }
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        if (page === 1) setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm]);

  // Reset pagination when searchTerm or selectedCategory changes
  useEffect(() => {
    setPage(1);
    setTotalProducts(null);
  }, [searchTerm, selectedCategory]);

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

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (
      target.isIntersecting &&
      !loadingMore &&
      !loading &&
      (totalProducts === null || products.length < totalProducts)
    ) {
      setPage(prev => prev + 1);
    }
  }, [loadingMore, loading, products.length, totalProducts]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(handleObserver);
    if (loadMoreRef.current) observer.current.observe(loadMoreRef.current);
    return () => observer.current && observer.current.disconnect();
  }, [handleObserver, filteredProducts]);

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
                      image_url: product.imageUrl,
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
              {/* Infinite Scroll Trigger */}
              <div ref={loadMoreRef} style={{ height: 1 }} />
              {loadingMore && (
                <div className="text-center py-4 text-gray-500">Loading more...</div>
              )}
              {/* End of List Message */}
              {totalProducts !== null && products.length >= totalProducts && !loadingMore && (
                <div className="text-center py-4 text-gray-400">No more products to load.</div>
              )}
            </>
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
