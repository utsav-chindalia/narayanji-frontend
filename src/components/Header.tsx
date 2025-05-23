
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, MenuIcon } from 'lucide-react';
import { useState } from 'react';
import narayanjiLogo from '@/assets/narayanji-logo.png';

interface HeaderProps {
  cartItemCount?: number;
}

const Header = ({ cartItemCount = 0 }: HeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('narayanji_auth');
    localStorage.removeItem('narayanji_phone');
    localStorage.removeItem('narayanji_cart');
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex justify-between items-center">
          <Link to="/catalog" className="flex items-center">
            <img 
              src={narayanjiLogo} 
              alt="Narayanji Gajak" 
              className="h-10 mr-2" 
            />
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-700 relative"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowMenu(false)}>
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg">Menu</h3>
            </div>
            <nav className="p-4 space-y-4">
              <Link 
                to="/catalog" 
                className="block py-2 text-gray-700 hover:text-brand-red"
                onClick={() => setShowMenu(false)}
              >
                Catalog
              </Link>
              <Link 
                to="/cart" 
                className="block py-2 text-gray-700 hover:text-brand-red"
                onClick={() => setShowMenu(false)}
              >
                Cart ({cartItemCount})
              </Link>
              <Link 
                to="/orders" 
                className="block py-2 text-gray-700 hover:text-brand-red"
                onClick={() => setShowMenu(false)}
              >
                My Orders
              </Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left py-2 text-brand-red hover:text-brand-red-dark"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
