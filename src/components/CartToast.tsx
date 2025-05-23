
import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CartToastProps {
  visible: boolean;
  itemCount: number;
  totalPrice: number;
  onClose: () => void;
}

const CartToast = ({ visible, itemCount, totalPrice, onClose }: CartToastProps) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);
  
  const handleViewCart = () => {
    navigate('/cart');
    onClose();
  };
  
  return (
    <div 
      className={`fixed bottom-16 left-0 right-0 bg-brand-red text-white p-4 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          <div>
            <p className="font-semibold">{itemCount} {itemCount === 1 ? 'item' : 'items'} in cart</p>
            <p className="text-sm">₹{totalPrice.toFixed(2)}</p>
          </div>
        </div>
        
        <Button 
          onClick={handleViewCart}
          variant="outline" 
          className="bg-white text-brand-red hover:bg-cream-100 border-none"
        >
          View Cart
        </Button>
      </div>
    </div>
  );
};

export default CartToast;
