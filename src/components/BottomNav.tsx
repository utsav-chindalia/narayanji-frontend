
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, ClipboardList } from 'lucide-react';

interface BottomNavProps {
  cartItemCount?: number;
}

const BottomNav = ({ cartItemCount = 0 }: BottomNavProps) => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
      <Link 
        to="/catalog" 
        className={`flex flex-col items-center justify-center w-1/3 py-1 ${
          location.pathname === '/catalog' ? 'text-brand-red' : 'text-gray-500'
        }`}
      >
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link 
        to="/orders" 
        className={`flex flex-col items-center justify-center w-1/3 py-1 ${
          location.pathname.includes('/orders') ? 'text-brand-red' : 'text-gray-500'
        }`}
      >
        <ClipboardList className="h-6 w-6" />
        <span className="text-xs mt-1">Orders</span>
      </Link>
      
      <Link 
        to="/cart" 
        className={`flex flex-col items-center justify-center w-1/3 py-1 ${
          location.pathname === '/cart' ? 'text-brand-red' : 'text-gray-500'
        } relative`}
      >
        <ShoppingCart className="h-6 w-6" />
        {cartItemCount > 0 && (
          <span className="absolute top-0 right-[calc(50%-10px)] bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {cartItemCount}
          </span>
        )}
        <span className="text-xs mt-1">Cart</span>
      </Link>
    </div>
  );
};

export default BottomNav;
