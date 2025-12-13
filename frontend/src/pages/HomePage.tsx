import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Sparkles, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  // Redirect authenticated users to shop
  if (isAuthenticated) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-orange-500" />
              Fresh sweets, delivered daily
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
            >
              Discover Our{' '}
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Sweet
              </span>{' '}
              Collection
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-10 text-lg text-gray-600 sm:text-xl"
            >
              Handcrafted confections, premium ingredients, and irresistible flavors
              <br className="hidden sm:block" />
              that will make every moment sweeter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link to="/login">
                <Button
                  size="lg"
                  className="group h-12 bg-gradient-to-r from-orange-500 to-pink-500 px-8 text-base font-medium text-white shadow-lg transition-all hover:shadow-xl"
                >
                  Browse Collection
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -left-4 top-1/4 h-24 w-24 rounded-full bg-orange-100 opacity-20 blur-3xl" />
        <div className="absolute -right-4 bottom-1/4 h-32 w-32 rounded-full bg-pink-100 opacity-20 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-6xl"
          >
            <div className="grid gap-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-orange-200 hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Easy Ordering
                </h3>
                <p className="text-gray-600">
                  Browse our collection and order your favorite sweets with just a few clicks.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-pink-200 hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 text-pink-600">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Premium Quality
                </h3>
                <p className="text-gray-600">
                  Only the finest ingredients go into our handcrafted confections.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-orange-200 hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Fresh Daily
                </h3>
                <p className="text-gray-600">
                  Every sweet is made fresh daily to ensure the best taste and quality.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Ready to Indulge?
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Explore our sweet collection and find your perfect treat today.
            </p>
            <Link to="/login">
              <Button
                size="lg"
                className="h-12 bg-gradient-to-r from-orange-500 to-pink-500 px-8 text-base font-medium text-white shadow-lg transition-all hover:shadow-xl"
              >
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
