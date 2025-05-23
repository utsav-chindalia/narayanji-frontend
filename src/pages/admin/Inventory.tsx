
import { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

interface Product {
  sku: string;
  name: string;
  category: string;
  pricePerKg: number;
  gstPercent: number;
  stockKg: number;
  isAvailable: boolean;
}

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data for demonstration
  const products: Product[] = [
    {
      sku: "GJK-REG-250",
      name: "Regular Gajak",
      category: "Traditional",
      pricePerKg: 450,
      gstPercent: 5,
      stockKg: 120,
      isAvailable: true
    },
    {
      sku: "GJK-SPL-250", 
      name: "Special Gajak",
      category: "Premium",
      pricePerKg: 520,
      gstPercent: 5,
      stockKg: 85,
      isAvailable: true
    },
    {
      sku: "GJK-DRY-500",
      name: "Dry Fruit Gajak", 
      category: "Premium",
      pricePerKg: 680,
      gstPercent: 5,
      stockKg: 42,
      isAvailable: true
    },
    {
      sku: "GJK-TIL-250",
      name: "Til Gajak",
      category: "Traditional", 
      pricePerKg: 420,
      gstPercent: 5,
      stockKg: 150,
      isAvailable: true
    },
    {
      sku: "GJK-PISTA-500",
      name: "Pista Gajak", 
      category: "Premium",
      pricePerKg: 780,
      gstPercent: 5,
      stockKg: 18,
      isAvailable: true
    },
    {
      sku: "GJK-KAJU-500",
      name: "Kaju Gajak", 
      category: "Premium",
      pricePerKg: 720,
      gstPercent: 5,
      stockKg: 0,
      isAvailable: false
    }
  ];
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search products by name, SKU, or category..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price (per kg)</TableHead>
              <TableHead>GST %</TableHead>
              <TableHead>Stock (kg)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.sku}>
                <TableCell className="font-medium">{product.sku}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>₹{product.pricePerKg}</TableCell>
                <TableCell>{product.gstPercent}%</TableCell>
                <TableCell>
                  {product.stockKg === 0 ? (
                    <span className="text-red-500 font-medium">Out of Stock</span>
                  ) : product.stockKg < 50 ? (
                    <span className="text-amber-500 font-medium">{product.stockKg} kg (Low)</span>
                  ) : (
                    <span>{product.stockKg} kg</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={product.isAvailable ? "default" : "destructive"}
                    className={product.isAvailable ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                  >
                    {product.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredProducts.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No products found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
