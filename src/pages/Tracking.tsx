import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

interface TrackingStatus {
  status: string;
  label: string;
  completed: boolean;
  current: boolean;
}

const Tracking = () => {
  const { id } = useParams();
  
  const trackingStatuses: TrackingStatus[] = [
    { status: 'received', label: 'Order Received', completed: true, current: false },
    { status: 'processing', label: 'Processing', completed: true, current: false },
    { status: 'shipped', label: 'Shipped', completed: false, current: true },
    { status: 'delivered', label: 'Delivered', completed: false, current: false }
  ];

  const currentStatus = trackingStatuses.find(s => s.current);

  return (
    <div className="min-h-screen bg-cream-50 pb-16">
      <Header />
      
      <div className="px-4 py-6">
        {/* Back Button */}
        <Link to={`/orders/${id}`} className="flex items-center text-brand-red mb-6 hover:text-brand-red-dark">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Order
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <h1 className="text-2xl font-bold mb-2">Order {id}</h1>
          <p className="text-gray-600">Estimated Delivery: May 24, 2023</p>
        </div>

        {/* Tracking Progress */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200">
              <div 
                className="h-full bg-brand-red transition-all duration-500"
                style={{ width: '50%' }}
              ></div>
            </div>
            
            {/* Status Points */}
            <div className="relative flex justify-between">
              {trackingStatuses.map((status, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all ${
                    status.completed || status.current
                      ? 'bg-brand-red border-brand-red'
                      : 'bg-white border-gray-300'
                  }`}>
                    {status.completed ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : status.current ? (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    ) : (
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${
                      status.completed || status.current ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {status.label}
                    </p>
                    {status.current && (
                      <p className="text-xs text-brand-red mt-1">Current</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Status Details */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="font-semibold text-lg mb-2">
            Current Status: {currentStatus?.label}
          </h2>
          <p className="text-gray-600">
            Your order has been dispatched and is on the way to your location. 
            You will receive tracking details shortly.
          </p>
          
          <div className="mt-4 p-3 bg-cream-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Tracking ID:</strong> TRK{id?.slice(-5)}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <strong>Estimated Delivery:</strong> Within 2-3 business days
            </p>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Tracking;
