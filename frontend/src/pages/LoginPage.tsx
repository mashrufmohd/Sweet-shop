import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Candy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const fillDemoCredentials = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin@example.com');
      setPassword('admin123');
      setIsAdminMode(true);
    } else {
      setEmail('user@example.com');
      setPassword('user123');
      setIsAdminMode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.login({ email, password });
      login(response.result, response.token);
      toast({
        title: 'Welcome back!',
        description: `Signed in as ${response.result.name}`,
      });
      navigate('/shop');
    } catch (error) {
      toast({
        title: 'Sign in failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border border-gray-200 bg-white shadow-lg">
          <CardHeader className="space-y-4 text-center">
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${isAdminMode ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gradient-to-r from-orange-500 to-pink-500'}`}>
              <Candy className="h-7 w-7 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl text-gray-900">
                {isAdminMode ? 'Admin Login' : 'Welcome back'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isAdminMode ? 'Sign in to admin dashboard' : 'Sign in to your Sweet Shop account'}
              </CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={!isAdminMode ? 'default' : 'outline'}
                  size="sm"
                  className={!isAdminMode ? 'flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white' : 'flex-1'}
                  onClick={() => setIsAdminMode(false)}
                >
                  User Login
                </Button>
                <Button
                  type="button"
                  variant={isAdminMode ? 'default' : 'outline'}
                  size="sm"
                  className={isAdminMode ? 'flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white' : 'flex-1'}
                  onClick={() => setIsAdminMode(true)}
                >
                  Admin Login
                </Button>
              </div>

              {/* Demo Credentials */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="mb-2 text-xs font-medium text-gray-700">Demo Credentials:</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('user')}
                    className="w-full rounded-md border border-gray-200 bg-white p-2 text-left text-xs hover:bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">Regular User</div>
                    <div className="text-gray-600">user@example.com / user123</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('admin')}
                    className="w-full rounded-md border border-purple-200 bg-purple-50 p-2 text-left text-xs hover:bg-purple-100"
                  >
                    <div className="font-medium text-purple-900">Admin User</div>
                    <div className="text-purple-700">admin@example.com / admin123</div>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                size="lg"
                className={`w-full shadow-md transition-all hover:shadow-lg ${
                  isAdminMode
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  `Sign in ${isAdminMode ? 'as Admin' : ''}`
                )}
              </Button>
              {!isAdminMode && (
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-orange-500 hover:underline">
                    Create one
                  </Link>
                </p>
              )}
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
