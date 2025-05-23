
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated (simplified check)
    const isAuthenticated = localStorage.getItem('narayanji_auth');
    
    if (isAuthenticated) {
      navigate('/catalog');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading Narayanji...</p>
      </div>
    </div>
  );
};

export default Index;
