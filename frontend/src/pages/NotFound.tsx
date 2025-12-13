import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Candy } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-6 flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-sweet-peach">
          <Candy className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mb-2 text-6xl font-bold text-gradient">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Oops! This page seems to have melted away
        </p>
        <Link to="/">
          <Button variant="sweet" size="lg">
            <Home className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
