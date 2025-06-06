import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';

interface Order {
  id: string;
  date: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  originalStatus: string;
}

const mapApiStatusToOrderStatus = (status: string): Order['status'] => {
  switch (status) {
    case 'cart':
    case 'payment_pending':
      return 'pending';
    case 'approved':
    case 'production':
      return 'processing';
    case 'paid':
      return 'delivered';
    case 'processing':
      return 'processing';
    case 'shipped':
      return 'shipped';
    default:
      return 'pending';
  }
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const Orders = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<{ [orderId: string]: { payment_url: string; payment_total: number } | null }>({});
  const [approvedQtyChanged, setApprovedQtyChanged] = useState<{ [orderId: string]: boolean }>({});
  const [orderItemsMap, setOrderItemsMap] = useState<{ [orderId: string]: any[] }>({});
  const [detailsOpen, setDetailsOpen] = useState<string | null>(null);

  const fetchPaymentInfo = async (orderId: string) => {
    try {
      const response = await apiFetch(`/api/orders/${orderId}/payment`);
      if (!response.ok) throw new Error('Failed to fetch payment info');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setPaymentInfo((prev) => ({ ...prev, [orderId]: data[0] }));
      } else {
        setPaymentInfo((prev) => ({ ...prev, [orderId]: null }));
      }
    } catch (err) {
      setPaymentInfo((prev) => ({ ...prev, [orderId]: null }));
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    try {
      const response = await apiFetch(`/api/orders/${orderId}/items`);
      if (!response.ok) throw new Error('Failed to fetch order items');
      const data = await response.json();
      setOrderItemsMap((prev) => ({ ...prev, [orderId]: data }));
      // Check if any approved_quantity_kg differs from quantity_kg
      const changed = data.some((item: any) => item.approved_quantity_kg !== undefined && item.approved_quantity_kg !== item.quantity_kg);
      setApprovedQtyChanged((prev) => ({ ...prev, [orderId]: changed }));
    } catch (err) {
      setOrderItemsMap((prev) => ({ ...prev, [orderId]: [] }));
      setApprovedQtyChanged((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch('/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        // Map API response to Order[]
        const mapped = Array.isArray(data)
          ? data.map((order: any) => ({
              id: order.id,
              date: order.created_at ? formatDate(order.created_at) : '',
              items: order.items_count || 1, // fallback to 1 if not present
              total: order.total || 0, // fallback to 0 if not present
              status: mapApiStatusToOrderStatus(order.status),
              originalStatus: order.status,
            }))
          : [];
        setOrders(mapped);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    // Fetch payment info for all payment_pending orders
    orders.forEach(order => {
      if (order.originalStatus === 'payment_pending' && !paymentInfo[order.id]) {
        fetchPaymentInfo(order.id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  useEffect(() => {
    // Fetch order items for all orders to check approved qty
    orders.forEach(order => {
      if (approvedQtyChanged[order.id] === undefined) {
        fetchOrderItems(order.id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const filteredOrders = selectedTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-600 bg-amber-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatStatus = (status: string, originalStatus?: string) => {
    if (status === 'pending') {
      if (originalStatus === 'payment_pending') {
        return 'Payment Pending';
      }
      if (originalStatus === 'cart') {
        return 'Review Pending';
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-cream-50 pb-16">
      <Header />
      
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <Button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              variant={selectedTab === tab.key ? "default" : "outline"}
              className={`whitespace-nowrap ${
                selectedTab === tab.key 
                  ? 'bg-brand-red text-white' 
                  : 'bg-white text-gray-700 hover:bg-cream-100'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-3xl">⏳</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Loading Orders...</h3>
            <p className="text-gray-600 mb-6">Please wait while we fetch your orders.</p>
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

        {/* Orders List */}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      Order {order.id}
                      {approvedQtyChanged[order.id] && (
                        <span title="Approved quantity updated" className="inline-block align-middle text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium ml-2">Qty Updated</span>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm">{order.date} • {order.items} items</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {formatStatus(order.status, order.originalStatus)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap items-center">
                  <Button variant="outline" size="sm" onClick={() => setDetailsOpen(detailsOpen === order.id ? null : order.id)}>
                    {detailsOpen === order.id ? 'Hide Details' : 'View Details'}
                  </Button>
                  {(order.status === 'shipped' || order.status === 'processing') && (
                    <Link to={`/tracking/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                    </Link>
                  )}
                  {/* Show Pay Now button if payment_pending */}
                  {order.originalStatus === 'payment_pending' && paymentInfo[order.id] && (
                    <a href={paymentInfo[order.id]?.payment_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        Pay Now (₹{paymentInfo[order.id]?.payment_total})
                      </Button>
                    </a>
                  )}
                </div>
                {/* Item breakdown details */}
                {detailsOpen === order.id && orderItemsMap[order.id] && orderItemsMap[order.id].length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2 text-sm">Item Details</h4>
                    <table className="w-full text-xs border">
                      <thead>
                        <tr className="bg-cream-100">
                          <th className="py-1 px-2 text-left">Product</th>
                          <th className="py-1 px-2 text-right">Requested Qty</th>
                          <th className="py-1 px-2 text-right">Approved Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItemsMap[order.id].map((item: any) => (
                          <tr key={item.sku} className="border-b last:border-b-0">
                            <td className="py-1 px-2">{item.product_name}</td>
                            <td className="py-1 px-2 text-right">{item.quantity_kg} kg</td>
                            <td className="py-1 px-2 text-right">{item.approved_quantity_kg !== undefined ? item.approved_quantity_kg + ' kg' : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No Orders State */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-3xl">📦</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
            <p className="text-gray-600 mb-6">
              {selectedTab === 'all' 
                ? "You haven't placed any orders yet." 
                : `No ${selectedTab} orders found.`}
            </p>
            <Link to="/catalog">
              <Button className="btn-primary">
                Start Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Orders;
