
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Product {
  sku: string;
  name: string;
  category: string;
  price_per_kg: number;
  gst_percent: number;
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
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock products data
  const products: Product[] = [
    {
      sku: "GJK-REG-250",
      name: "Regular Gajak",
      category: "Traditional",
      price_per_kg: 450,
      gst_percent: 5
    },
    {
      sku: "GJK-SPL-250", 
      name: "Special Gajak",
      category: "Premium",
      price_per_kg: 520,
      gst_percent: 5
    },
    {
      sku: "GJK-DRY-500",
      name: "Dry Fruit Gajak", 
      category: "Premium",
      price_per_kg: 680,
      gst_percent: 5
    },
    {
      sku: "GJK-TIL-250",
      name: "Til Gajak",
      category: "Traditional", 
      price_per_kg: 420,
      gst_percent: 5
    }
  ];

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('narayanji_cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      setCart(cartData);

      // Merge cart with product data
      const itemsWithProducts = cartData.map((item: CartItem) => {
        const product = products.find(p => p.sku === item.sku);
        if (product) {
          return {
            ...item,
            product,
            total: product.price_per_kg * item.quantity_kg
          };
        }
        return null;
      }).filter(Boolean);

      setCartItems(itemsWithProducts);
    }
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
        total: item.product.price_per_kg * quantity 
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
      const itemGST = (item.total * item.product.gst_percent) / 100;
      return total + itemGST;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  const handleProceedToPayment = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before proceeding",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate order creation
    setTimeout(() => {
      const orderId = `ORD-${Date.now()}`;
      
      // Clear cart
      setCart([]);
      setCartItems([]);
      localStorage.removeItem('narayanji_cart');
      
      setIsLoading(false);
      
      toast({
        title: "Order Placed Successfully",
        description: `Order ${orderId} has been created`,
      });
      
      navigate('/orders');
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Header cartItemCount={0} />
        <div className="px-4 py-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-3xl">🛒</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious gajak to get started!</p>
            <Button 
              onClick={() => navigate('/catalog')}
              className="btn-primary"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
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
                  <p className="text-sm text-gray-700">₹{item.product.price_per_kg}/kg</p>
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
            onClick={handleProceedToPayment}
            disabled={isLoading}
            className="w-full btn-primary"
          >
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
