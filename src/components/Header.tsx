import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <p>Shop Smart. Shop Fast. Shop Jiffy NG.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Help</a>
            <a href="#" className="hover:underline">Track Order</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
              Jiffy NG
            </h1>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for products, brands and categories..."
                className="w-full pl-4 pr-12 h-11"
              />
              <Button size="icon" className="absolute right-0 top-0 h-11 rounded-l-none">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/auth">
              <Button variant="ghost" className="hidden lg:flex gap-2">
                <User className="h-5 w-5" />
                <span>Account</span>
              </Button>
            </Link>
            <Button variant="ghost" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="border-t hidden lg:block">
        <div className="container mx-auto px-4">
          <nav className="flex gap-6 py-3 text-sm">
            <a href="#" className="hover:text-primary transition-colors">Electronics</a>
            <a href="#" className="hover:text-primary transition-colors">Fashion</a>
            <a href="#" className="hover:text-primary transition-colors">Beauty</a>
            <a href="#" className="hover:text-primary transition-colors">Groceries</a>
            <a href="#" className="hover:text-primary transition-colors">Home & Living</a>
            <a href="#" className="hover:text-primary transition-colors">Sports</a>
            <a href="#" className="hover:text-primary transition-colors">Phones & Tablets</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
