import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';

interface OrderItem {
  sku: string;
  product_name: string;
  quantity_kg: number;
  approved_quantity_kg: number;
  price_per_kg: number;
  gst: number;
  product_category: string;
  pricing_tier: string;
}

const OrderDetails = () => {
  const { id } = useParams();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch(`/api/orders/${id}/items`);
        if (!response.ok) throw new Error('Failed to fetch order items');
        const data = await response.json();
        setOrderItems(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setOrderItems([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrderItems();
  }, [id]);

  // Calculate summary
  const subtotal = orderItems.reduce((sum, item) => sum + item.price_per_kg * item.quantity_kg, 0);
  const gstAmount = orderItems.reduce((sum, item) => sum + (item.price_per_kg * item.quantity_kg * (item.gst || 0) / 100), 0);
  const total = subtotal + gstAmount;

  const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
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
              <h1 className="text-2xl font-bold">Order {id}</h1>
            </div>
            {/* Status could be fetched from another API if needed */}
            {/* <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderDetails.status)}`}>{orderDetails.status}</span> */}
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-3xl">⏳</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Loading Order Items...</h3>
            <p className="text-gray-600 mb-6">Please wait while we fetch your order details.</p>
          </div>
        )}
        {error && (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-3xl">❌</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} className="btn-primary">Retry</Button>
          </div>
        )}

        {/* Order Items */}
        {!loading && !error && (
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            {orderItems.length === 0 ? (
              <div className="text-gray-500">No items found for this order.</div>
            ) : (
              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{item.product_name}</h3>
                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity_kg} kg × ₹{item.price_per_kg}/kg
                        </p>
                        <p className="text-xs text-gray-400">Category: {item.product_category} | Tier: {item.pricing_tier}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{(item.price_per_kg * item.quantity_kg).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">GST: {item.gst}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Order Summary */}
        {!loading && !error && orderItems.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items ({orderItems.length})</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default OrderDetails;
