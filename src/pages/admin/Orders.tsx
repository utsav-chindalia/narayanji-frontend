
import { useState } from 'react';
import { Search, Filter, ChevronDown, Eye } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  distributor: string;
  date: string;
  amount: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: number;
}

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data for demonstration
  const orders: Order[] = [
    { 
      id: "ORD-7352", 
      distributor: "Raj Distributors", 
      date: "2023-05-22", 
      amount: "₹12,430", 
      status: "Delivered",
      items: 5 
    },
    { 
      id: "ORD-7351", 
      distributor: "Shyam Traders", 
      date: "2023-05-22", 
      amount: "₹8,790", 
      status: "Processing",
      items: 3 
    },
    { 
      id: "ORD-7350", 
      distributor: "Ganesh Store", 
      date: "2023-05-21", 
      amount: "₹6,200", 
      status: "Pending",
      items: 2 
    },
    { 
      id: "ORD-7349", 
      distributor: "Krishna Sweets", 
      date: "2023-05-20", 
      amount: "₹15,400", 
      status: "Delivered",
      items: 8 
    },
    { 
      id: "ORD-7348", 
      distributor: "Laxmi Foods", 
      date: "2023-05-20", 
      amount: "₹7,250", 
      status: "Shipped",
      items: 4 
    },
    { 
      id: "ORD-7347", 
      distributor: "Mohan Enterprises", 
      date: "2023-05-19", 
      amount: "₹9,120", 
      status: "Delivered",
      items: 3 
    },
    { 
      id: "ORD-7346", 
      distributor: "Singh Traders", 
      date: "2023-05-18", 
      amount: "₹11,540", 
      status: "Cancelled",
      items: 6 
    },
    { 
      id: "ORD-7345", 
      distributor: "Patel Store", 
      date: "2023-05-18", 
      amount: "₹5,890", 
      status: "Delivered",
      items: 2 
    },
  ];
  
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.distributor.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-500">Manage and process distributor orders</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button>Export</Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search orders by ID or distributor name..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Distributor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.distributor}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs ${getStatusBadgeClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/admin/orders/${order.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredOrders.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No orders found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
