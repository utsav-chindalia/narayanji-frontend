
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Product {
  sku: string;
  name: string;
  category: string;
  image_url?: string;
  price_per_kg: number;
  gst_percent: number;
  is_popular?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (sku: string, quantity: number) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(0.5);
  const { toast } = useToast();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value >= 0.5) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (quantity < 0.5) {
      toast({
        title: "Invalid Quantity",
        description: "Minimum order quantity is 0.5 kg",
        variant: "destructive"
      });
      return;
    }

    onAddToCart(product.sku, quantity);
    toast({
      title: "Added to Cart",
      description: `${quantity} kg of ${product.name} added to cart`,
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="h-40 bg-gray-100 flex items-center justify-center relative">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-gray-400 text-sm">No image</div>
        )}
        
        {product.is_popular && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
            Popular
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          <span className="bg-cream-100 text-gray-800 text-xs px-2 py-1 rounded shrink-0 ml-2">
            {product.category}
          </span>
        </div>
        
        {product.is_popular && (
          <div className="text-xs text-green-700 font-medium mb-2">
            Highly reordered
          </div>
        )}
        
        <div className="font-bold text-lg text-gray-900 mb-3">
          ₹{product.price_per_kg}/kg
        </div>
        
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0.5"
            step="0.5"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-20 text-right"
            placeholder="0.5"
          />
          <span className="text-gray-600 text-sm">kg</span>
          
          <Button 
            onClick={handleAddToCart}
            className="ml-auto btn-primary text-sm px-3 py-2 h-auto"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
