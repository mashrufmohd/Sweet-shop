import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Candy, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SweetCard } from '@/components/sweets/SweetCard';
import { api, Sweet } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/sweets-hero.jpg';

export default function ShopPage() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const data = await api.getSweets();
        setSweets(data);
      } catch (error) {
        toast({
          title: 'Failed to load sweets',
          description: error instanceof Error ? error.message : 'Please try again',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSweets();
  }, [toast]);

  const categories = useMemo(() => {
    const cats = [...new Set(sweets.map((s) => s.category))];
    return cats.sort();
  }, [sweets]);

  const filteredSweets = useMemo(() => {
    return sweets.filter((sweet) => {
      const matchesSearch =
        sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sweet.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || sweet.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [sweets, searchQuery, selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading sweet treats...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">
            Our Sweet Collection
          </h1>
          <p className="text-lg text-gray-600">
            Browse our delicious selection of handcrafted sweets
          </p>
        </div>
      </motion.section>

      {/* Search and Filter */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search sweets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus-visible:ring-orange-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Button
              variant={selectedCategory === null ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? 'bg-gray-900 text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900'}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-gray-900 text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900'}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Sweets Grid */}
      {filteredSweets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-[40vh] flex-col items-center justify-center text-center"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Candy className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">No sweets found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter</p>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSweets.map((sweet, index) => (
            <SweetCard key={sweet._id} sweet={sweet} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
