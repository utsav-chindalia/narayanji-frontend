import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';

interface OrderItem {
  sku: string;
  name: string;
  quantity_kg: number;
  price_per_kg: number;
  total: number;
}

interface OrderDetails {
  id: string;
  date: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  total: number;
}

const OrderDetails = () => {
  const { id } = useParams();
  
  // Mock order details
  const orderDetails: OrderDetails = {
    id: id || 'ORD-12345',
    date: 'May 22, 2023',
    status: 'Processing',
    items: [
      {
        sku: 'GJK-REG-250',
        name: 'Regular Gajak',
        quantity_kg: 2.5,
        price_per_kg: 450,
        total: 1125.00
      },
      {
        sku: 'GJK-SPL-250',
        name: 'Special Gajak',
        quantity_kg: 1.5,
        price_per_kg: 520,
        total: 780.00
      },
      {
        sku: 'GJK-DRY-500',
        name: 'Dry Fruit Gajak',
        quantity_kg: 1.0,
        price_per_kg: 680,
        total: 680.00
      }
    ],
    subtotal: 2585.00,
    gst: 129.25,
    total: 2714.25
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-amber-600 bg-amber-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 pb-16">
      <Header />
      
      <div className="px-4 py-6">
        {/* Back Button */}
        <Link to="/orders" className="flex items-center text-brand-red mb-6 hover:text-brand-red-dark">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">Order {orderDetails.id}</h1>
              <p className="text-gray-600">{orderDetails.date}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderDetails.status)}`}>
              {orderDetails.status}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          
          <div className="space-y-4">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity_kg} kg × ₹{item.price_per_kg}/kg
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{item.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items ({orderDetails.items.length})</span>
              <span>₹{orderDetails.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹{orderDetails.gst.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Track Order Button */}
        {(orderDetails.status.toLowerCase() === 'processing' || orderDetails.status.toLowerCase() === 'shipped') && (
          <Link to={`/tracking/${orderDetails.id}`}>
            <Button className="w-full btn-primary">
              Track Order
            </Button>
          </Link>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default OrderDetails;
