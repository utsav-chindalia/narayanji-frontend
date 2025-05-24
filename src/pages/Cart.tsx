import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { apiFetch } from '@/lib/api';

// Define missing types
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

interface CartItemWithProduct extends CartItem {
  product: Product;
  total: number;
}

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load cart from localStorage and fetch product details
  useEffect(() => {
    const fetchCartProducts = async () => {
      setLoadingProducts(true);
      setError(null);
      const savedCart = localStorage.getItem('narayanji_cart');
      if (savedCart) {
        const cartData: CartItem[] = JSON.parse(savedCart);
        setCart(cartData);
        try {
          // Fetch product details for each SKU in the cart
          const productPromises = cartData.map(async (item) => {
            const res = await apiFetch(`/api/catalog?search=${encodeURIComponent(item.sku)}`);
            if (!res.ok) throw new Error('Failed to fetch product');
            const data = await res.json();
            // data could be an array or { products: [] }
            let product: Product | undefined;
            if (Array.isArray(data)) {
              product = data.find((p: Product) => p.sku === item.sku);
            } else if (data.products && Array.isArray(data.products)) {
              product = data.products.find((p: Product) => p.sku === item.sku);
            }
            if (product) {
              return {
                ...item,
                product,
                total: product.pricePerKg * item.quantity_kg
              };
            }
            return null;
          });
          const itemsWithProducts = (await Promise.all(productPromises)).filter(Boolean) as CartItemWithProduct[];
          setCartItems(itemsWithProducts);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch product details');
          setCartItems([]);
        } finally {
          setLoadingProducts(false);
        }
      } else {
        setCart([]);
        setCartItems([]);
      }
    };
    fetchCartProducts();
  }, []);

  const updateQuantity = (sku: string, quantity: number) => {
    if (quantity < 0.5) {
      removeItem(sku);
      return;
    }
    const updatedCart = cart.map(item => 
      item.sku === sku ? { ...item, quantity_kg: quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('narayanji_cart', JSON.stringify(updatedCart));
    // Update cart items with new totals
    const updatedCartItems = cartItems.map(item => 
      item.sku === sku ? { 
        ...item, 
        quantity_kg: quantity,
        total: item.product.pricePerKg * quantity 
      } : item
    );
    setCartItems(updatedCartItems);
  };

  const removeItem = (sku: string) => {
    const updatedCart = cart.filter(item => item.sku !== sku);
    const updatedCartItems = cartItems.filter(item => item.sku !== sku);
    setCart(updatedCart);
    setCartItems(updatedCartItems);
    localStorage.setItem('narayanji_cart', JSON.stringify(updatedCart));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart",
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.total, 0);
  };

  const calculateGST = () => {
    return cartItems.reduce((total, item) => {
      const itemGST = (item.total * item.product.gstPercent) / 100;
      return total + itemGST;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  const handleSendForReview = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before sending for review",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiFetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({ sku: item.sku, quantity_kg: item.quantity_kg }))
        })
      });
      if (!response.ok) throw new Error('Failed to send order for review');
      // Clear cart
      setCart([]);
      setCartItems([]);
      localStorage.removeItem('narayanji_cart');
      toast({
        title: "Order Sent for Review",
        description: `Your order has been sent for admin review.`,
      });
      navigate('/orders');
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to send order for review',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingProducts) {
    return (
      <div className="min-h-screen bg-cream-50 pb-16">
        <Header cartItemCount={0} />
        <div className="px-4 py-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-3xl">🛒</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Loading your cart...</h2>
            <p className="text-gray-600 mb-6">Fetching product details.</p>
          </div>
        </div>
        <BottomNav cartItemCount={0} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream-50 pb-16">
        <Header cartItemCount={0} />
        <div className="px-4 py-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-3xl">🛒</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Error loading cart</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} className="btn-primary">Retry</Button>
          </div>
        </div>
        <BottomNav cartItemCount={0} />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 pb-16">
        <Header cartItemCount={0} />
        <div className="px-4 py-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-3xl">🛒</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">No products in your cart.</h2>
            <p className="text-gray-600 mb-6">Add some delicious gajak to get started!</p>
            <Button 
              onClick={() => navigate('/catalog')}
              className="btn-primary"
            >
              Browse Products
            </Button>
          </div>
        </div>
        <BottomNav cartItemCount={0} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pb-16">
      <Header cartItemCount={cartItems.length} />
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Your Cart ({cartItems.length} items)</h1>
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.sku} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  <p className="text-sm text-gray-700">₹{item.product.pricePerKg} / {item.product.unitType}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{item.total.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={item.quantity_kg}
                    onChange={(e) => updateQuantity(item.sku, parseFloat(e.target.value) || 0)}
                    className="w-20 text-right"
                  />
                  <span className="text-gray-600">kg</span>
                </div>
                <Button
                  onClick={() => removeItem(item.sku)}
                  variant="outline"
                  className="text-brand-red border-brand-red hover:bg-brand-red hover:text-white"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        {/* Order Summary */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Items ({cartItems.length})</span>
              <span>₹{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹{calculateGST().toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleSendForReview}
            disabled={isLoading}
            className="w-full btn-primary"
          >
            {isLoading ? "Processing..." : "Send for Review"}
          </Button>
        </div>
      </div>
      <BottomNav cartItemCount={cartItems.length} />
    </div>
  );
};

export default Cart;
