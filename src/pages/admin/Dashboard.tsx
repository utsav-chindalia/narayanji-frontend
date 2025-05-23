
import { Activity, DollarSign, Package, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  const recentOrders = [
    { id: "ORD-7352", distributor: "Raj Distributors", date: "2023-05-22", amount: "₹12,430", status: "Delivered" },
    { id: "ORD-7351", distributor: "Shyam Traders", date: "2023-05-22", amount: "₹8,790", status: "Processing" },
    { id: "ORD-7350", distributor: "Ganesh Store", date: "2023-05-21", amount: "₹6,200", status: "Pending" },
    { id: "ORD-7349", distributor: "Krishna Sweets", date: "2023-05-20", amount: "₹15,400", status: "Delivered" },
    { id: "ORD-7348", distributor: "Laxmi Foods", date: "2023-05-20", amount: "₹7,250", status: "Delivered" },
  ];

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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left">Order ID</th>
                    <th className="py-3 text-left">Distributor</th>
                    <th className="py-3 text-left">Amount</th>
                    <th className="py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3">{order.id}</td>
                      <td className="py-3">{order.distributor}</td>
                      <td className="py-3">{order.amount}</td>
                      <td className="py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Processing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex h-[300px] items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <TrendingUp className="h-16 w-16 text-gray-300 mb-2" />
              <h3 className="text-lg font-medium">Sales Chart Placeholder</h3>
              <p className="text-sm text-gray-500">
                In a real application, a chart would be displayed here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
