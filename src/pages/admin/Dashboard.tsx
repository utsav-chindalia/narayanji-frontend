import { Activity, DollarSign, Package, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

const Dashboard = () => {
  // Sample data for demonstration
  const stats = [
    {
      title: "Total Revenue",
      value: "₹45,231.89",
      description: "+20.1% from last month",
      icon: <DollarSign className="h-8 w-8 text-brand-red" />,
    },
    {
      title: "New Orders",
      value: "54",
      description: "+12.5% from last month",
      icon: <Package className="h-8 w-8 text-brand-red" />,
    },
    {
      title: "Active Distributors",
      value: "24",
      description: "+5 new since last week",
      icon: <Users className="h-8 w-8 text-brand-red" />,
    },
    {
      title: "Product Inventory",
      value: "12,846 kg",
      description: "6 items low on stock",
      icon: <Activity className="h-8 w-8 text-brand-red" />,
    },
  ];

  // State for recent orders
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        const res = await apiFetch('/api/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        // Sort by created_at desc, take 5 most recent
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)
          : [];
        setRecentOrders(sorted);
      } catch (err: any) {
        setOrdersError(err.message || 'Failed to fetch orders');
        setRecentOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome back to your admin portal</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {ordersLoading ? (
                <div className="py-8 text-center text-gray-500">Loading recent orders...</div>
              ) : ordersError ? (
                <div className="py-8 text-center text-red-500">{ordersError}</div>
              ) : recentOrders.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No recent orders found.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left">Order ID</th>
                      <th className="py-3 text-left">Distributor</th>
                      <th className="py-3 text-left">Date</th>
                      <th className="py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0">
                        <td className="py-3">{order.id}</td>
                        {/* TODO: Replace vendor_id with distributor name when available */}
                        <td className="py-3">{order.vendor_id || order.vendorId || <span className="italic text-gray-400">Unknown</span>}</td>
                        <td className="py-3">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</td>
                        <td className="py-3">
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs ${
                              order.status === 'paid' || order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'cart' || order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
