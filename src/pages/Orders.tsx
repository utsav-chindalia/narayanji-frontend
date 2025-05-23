
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  date: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

const Orders = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Mock orders data
  const orders: Order[] = [
    {
      id: 'ORD-12345',
      date: 'May 22, 2023',
      items: 3,
      total: 2677.50,
      status: 'processing'
    },
    {
      id: 'ORD-12344',
      date: 'May 20, 2023',
      items: 2,
      total: 1850.00,
      status: 'shipped'
    },
    {
      id: 'ORD-12343',
      date: 'May 18, 2023',
      items: 4,
      total: 3200.00,
      status: 'delivered'
    }
  ];

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

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-cream-50">
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

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">Order {order.id}</h3>
                  <p className="text-gray-600 text-sm">{order.date} • {order.items} items</p>
                  <p className="font-semibold text-lg mt-1">₹{order.total.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {formatStatus(order.status)}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link to={`/orders/${order.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                {(order.status === 'shipped' || order.status === 'processing') && (
                  <Link to={`/tracking/${order.id}`}>
                    <Button variant="outline" size="sm">
                      Track Order
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
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
    </div>
  );
};

export default Orders;
