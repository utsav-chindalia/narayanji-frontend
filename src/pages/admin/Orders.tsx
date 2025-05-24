import { useEffect, useState } from 'react';
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
import { apiFetch } from '@/lib/api';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { toast } from '@/components/ui/use-toast';

interface Order {
  id: string;
  vendor_id?: string;
  vendorId?: string;
  date?: string;
  status: string;
  items?: number;
  created_at?: string;
}

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [orderItemsLoading, setOrderItemsLoading] = useState(false);
  const [orderItemsError, setOrderItemsError] = useState<string | null>(null);
  const [approvedQuantities, setApprovedQuantities] = useState<{ [sku: string]: number | '' }>({});
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch('/api/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        // Sort by created_at desc
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          : [];
        setOrders(sorted);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.vendor_id || order.vendorId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
      case 'cart':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const openDrawer = async (orderId: string) => {
    setSelectedOrderId(orderId);
    setDrawerOpen(true);
    setOrderItemsLoading(true);
    setOrderItemsError(null);
    setOrderItems([]);
    setApprovedQuantities({});
    try {
      const res = await apiFetch(`/api/orders/${orderId}/items`);
      if (!res.ok) throw new Error('Failed to fetch order items');
      const data = await res.json();
      setOrderItems(data);
      // Initialize approved quantities with current approved or requested quantity
      const initial: { [sku: string]: number | '' } = {};
      data.forEach((item: any) => {
        initial[item.sku] = item.approved_quantity_kg ?? item.quantity_kg ?? '';
      });
      setApprovedQuantities(initial);
    } catch (err: any) {
      setOrderItemsError(err.message || 'Failed to fetch order items');
    } finally {
      setOrderItemsLoading(false);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedOrderId(null);
    setOrderItems([]);
    setApprovedQuantities({});
    setOrderItemsError(null);
  };

  const handleApprove = async () => {
    if (!selectedOrderId) return;
    setApproving(true);
    try {
      const items = orderItems.map((item) => ({
        sku: item.sku,
        approvedQuantityKg: Number(approvedQuantities[item.sku]) || 0,
      }));
      // First, PUT review
      const res = await apiFetch(`/api/orders/${selectedOrderId}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error('Failed to approve order');
      // Then, POST confirm
      const confirmRes = await apiFetch(`/api/orders/${selectedOrderId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!confirmRes.ok) throw new Error('Failed to confirm order');
      toast({ title: 'Order Approved', description: 'Order has been approved and confirmed successfully.' });
      closeDrawer();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to approve/confirm order' });
    } finally {
      setApproving(false);
    }
  };

  const handleApprovedQtyChange = (sku: string, value: string) => {
    setApprovedQuantities((prev) => ({ ...prev, [sku]: value === '' ? '' : Number(value) }));
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
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading orders...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Distributor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  {/* TODO: Replace vendor_id with distributor name when available */}
                  <TableCell>{order.vendor_id || order.vendorId || <span className="italic text-gray-400">Unknown</span>}</TableCell>
                  <TableCell>{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs ${getStatusBadgeClass(order.status)}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openDrawer(order.id)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No orders found matching your search criteria.</p>
          </div>
        )}
      </div>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-w-lg mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle>Order Items</DrawerTitle>
          </DrawerHeader>
          {orderItemsLoading ? (
            <div className="p-4 text-center text-gray-500">Loading items...</div>
          ) : orderItemsError ? (
            <div className="p-4 text-center text-red-500">{orderItemsError}</div>
          ) : (
            <div className="p-4 space-y-4">
              {orderItems.length === 0 ? (
                <div className="text-gray-500">No items found for this order.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="py-1">Product</th>
                      <th className="py-1">Qty (kg)</th>
                      <th className="py-1">Approve Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item.sku} className="border-b last:border-b-0">
                        <td className="py-2 font-medium">{item.product_name}</td>
                        <td className="py-2">{item.quantity_kg}</td>
                        <td className="py-2">
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            value={approvedQuantities[item.sku] ?? ''}
                            onChange={(e) => handleApprovedQtyChange(item.sku, e.target.value)}
                            className="w-20"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          <DrawerFooter>
            <Button onClick={handleApprove} disabled={approving || orderItemsLoading || orderItems.length === 0}>
              {approving ? 'Approving...' : 'Approve Order'}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Orders;
