import { motion } from 'framer-motion';
import { ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sweet } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface SweetCardProps {
  sweet: Sweet;
  index: number;
}

export function SweetCard({ sweet, index }: SweetCardProps) {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to cart',
      });
      navigate('/login');
      return;
    }

    addItem(sweet);
    toast({
      title: 'Added to cart',
      description: `${sweet.name} has been added to your cart`,
    });
  };

  const isOutOfStock = sweet.quantity === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card className="group overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {sweet.image_url ? (
            <img
              src={sweet.image_url}
              alt={sweet.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              style={{ imageRendering: 'high-quality' }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-16 w-16 text-gray-300" />
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge className="bg-white/90 text-gray-700 backdrop-blur-sm border border-gray-200">{sweet.category}</Badge>
          </div>
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <Badge className="bg-red-100 text-red-700 border border-red-200">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="mb-1 font-semibold text-gray-900">{sweet.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              ${sweet.price.toFixed(2)}
            </span>
            {!isOutOfStock && (
              <Badge className="bg-green-50 text-green-700 border border-green-200 text-xs">
                {sweet.quantity} in stock
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
