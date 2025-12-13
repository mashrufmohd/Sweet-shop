import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to checkout',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setIsCheckingOut(true);
    try {
      // First, process each purchase
      for (const item of items) {
        await api.purchaseSweet(item.sweet._id, item.quantity);
      }

      // Then create the order
      await api.createOrder({
        items: items.map((item) => ({
          sweet_id: item.sweet._id,
          sweet_name: item.sweet.name,
          quantity: item.quantity,
          price: item.sweet.price,
        })),
        total: getTotal(),
      });

      clearCart();
      toast({
        title: 'Order placed successfully!',
        description: 'Your delicious sweets are on their way.',
      });
      navigate('/orders');
    } catch (error) {
      toast({
        title: 'Checkout failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-[60vh] flex-col items-center justify-center text-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold">Your cart is empty</h2>
        <p className="mb-6 text-muted-foreground">Add some delicious sweets to get started!</p>
        <Link to="/">
          <Button variant="sweet" size="lg">
            Browse Sweets
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.sweet._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border border-gray-200 bg-white shadow-sm">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                    {item.sweet.image_url ? (
                      <img
                        src={item.sweet.image_url}
                        alt={item.sweet.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        style={{ imageRendering: 'high-quality' }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.sweet.name}</h3>
                    <p className="text-sm text-gray-600">{item.sweet.category}</p>
                    <p className="mt-1 font-medium text-gray-900">
                      ${item.sweet.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.sweet._id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(
                          item.sweet._id,
                          Math.min(item.quantity + 1, item.sweet.quantity)
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.sweet._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="mt-8 border border-gray-200 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">${getTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md transition-all hover:shadow-lg"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Checkout'
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
