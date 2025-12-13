import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Package,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Loader2,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api, Sweet, Order, DashboardAnalytics } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { Navigate } from 'react-router-dom';

interface SweetFormData {
  name: string;
  category: string;
  price: string;
  quantity: string;
  image_url: string;
}

const initialFormData: SweetFormData = {
  name: '',
  category: '',
  price: '',
  quantity: '',
  image_url: '',
};

export default function AdminPage() {
  const { user } = useAuthStore();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<SweetFormData>(initialFormData);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restockId, setRestockId] = useState<string | null>(null);
  const [restockAmount, setRestockAmount] = useState('');
  const { toast } = useToast();

  // Redirect non-admin users
  if (!user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sweetsData, ordersData, analyticsData] = await Promise.all([
        api.getSweets(),
        api.getAllOrders(),
        api.getDashboardAnalytics(),
      ]);
      setSweets(sweetsData);
      setOrders(ordersData);
      setAnalytics(analyticsData);
    } catch (error) {
      toast({
        title: 'Failed to load data',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const sweetData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        image_url: formData.image_url || undefined,
      };

      if (editingSweet) {
        await api.updateSweet(editingSweet._id, sweetData);
        toast({ title: 'Sweet updated successfully' });
      } else {
        await api.createSweet(sweetData);
        toast({ title: 'Sweet created successfully' });
      }

      setIsDialogOpen(false);
      setFormData(initialFormData);
      setEditingSweet(null);
      fetchData();
    } catch (error) {
      toast({
        title: editingSweet ? 'Failed to update sweet' : 'Failed to create sweet',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteSweet(id);
      toast({ title: 'Sweet deleted successfully' });
      fetchData();
    } catch (error) {
      toast({
        title: 'Failed to delete sweet',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleRestock = async (id: string) => {
    if (!restockAmount || parseInt(restockAmount) <= 0) {
      toast({ title: 'Please enter a valid quantity', variant: 'destructive' });
      return;
    }

    try {
      await api.restockSweet(id, parseInt(restockAmount));
      toast({ title: 'Sweet restocked successfully' });
      setRestockId(null);
      setRestockAmount('');
      fetchData();
    } catch (error) {
      toast({
        title: 'Failed to restock',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      image_url: sweet.image_url || '',
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingSweet(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your sweet shop inventory</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md transition-all hover:shadow-lg" onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Sweet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSweet ? 'Edit Sweet' : 'Add New Sweet'}</DialogTitle>
                <DialogDescription>
                  {editingSweet ? 'Update the sweet details below' : 'Fill in the details for your new sweet'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL (optional)</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md transition-all hover:shadow-lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingSweet ? 'Updating...' : 'Creating...'}
                      </>
                    ) : editingSweet ? (
                      'Update Sweet'
                    ) : (
                      'Create Sweet'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">${analytics.totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Active Customers</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{analytics.activeCustomers}</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Top Seller</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.topSellingProducts[0]?._id || 'N/A'}
                </div>
                {analytics.topSellingProducts[0] && (
                  <p className="text-xs text-gray-600">
                    {analytics.topSellingProducts[0].totalSold} sold
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            {/* Sweets Table */}
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Inventory</CardTitle>
                <CardDescription className="text-gray-600">Manage your sweet shop products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-700">
                        <th className="pb-3">Product</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Price</th>
                        <th className="pb-3">Stock</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sweets.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">No sweets yet</h3>
                                <p className="text-sm text-gray-600">Get started by adding your first sweet product</p>
                              </div>
                              <Button
                                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md transition-all hover:shadow-lg"
                                onClick={openCreateDialog}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Your First Sweet
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        sweets.map((sweet) => (
                        <tr key={sweet._id} className="text-sm">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-50">
                                {sweet.image_url ? (
                                  <img
                                    src={sweet.image_url}
                                    alt={sweet.name}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                    style={{ imageRendering: 'high-quality' }}
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Package className="h-4 w-4 text-gray-300" />
                                  </div>
                                )}
                              </div>
                              <span className="font-medium text-gray-900">{sweet.name}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge className="bg-orange-50 text-orange-700 border border-orange-200">{sweet.category}</Badge>
                          </td>
                          <td className="py-4 text-gray-900">${sweet.price.toFixed(2)}</td>
                          <td className="py-4">
                            <Badge className={sweet.quantity > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}>
                              {sweet.quantity}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-end gap-2">
                              {restockId === sweet._id ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min="1"
                                    value={restockAmount}
                                    onChange={(e) => setRestockAmount(e.target.value)}
                                    placeholder="Qty"
                                    className="h-8 w-20"
                                  />
                                  <Button
                                    size="sm"
                                    className="bg-green-600 text-white hover:bg-green-700"
                                    onClick={() => handleRestock(sweet._id)}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-600"
                                    onClick={() => {
                                      setRestockId(null);
                                      setRestockAmount('');
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => setRestockId(sweet._id)}
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    onClick={() => openEditDialog(sweet)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDelete(sweet._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Orders</CardTitle>
                <CardDescription className="text-gray-600">View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-700">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Items</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
                                <p className="text-sm text-gray-600">Orders will appear here once customers make purchases</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                        <tr key={order._id} className="text-sm">
                          <td className="py-4 font-mono text-xs text-gray-600">{order._id}</td>
                          <td className="py-4 text-gray-900">{order.user_email}</td>
                          <td className="py-4">
                            <div className="flex flex-col gap-1">
                              {order.items.map((item, index) => (
                                <span key={index} className="text-xs text-gray-600">
                                  {item.quantity}x {item.sweet_name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 font-medium text-gray-900">${order.total.toFixed(2)}</td>
                          <td className="py-4 text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
