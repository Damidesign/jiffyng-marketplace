import { Smartphone, Shirt, Sparkles, Home, Dumbbell, ShoppingBag, Package } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";

const Index = () => {
  const categories = [
    { icon: Smartphone, title: "Electronics", itemCount: "2,500+ items" },
    { icon: Shirt, title: "Fashion", itemCount: "5,000+ items" },
    { icon: Sparkles, title: "Beauty", itemCount: "1,200+ items" },
    { icon: Package, title: "Groceries", itemCount: "3,800+ items" },
    { icon: Home, title: "Home & Living", itemCount: "1,900+ items" },
    { icon: Dumbbell, title: "Sports", itemCount: "800+ items" },
  ];

  const featuredProducts = [
    {
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
      title: "Premium Wireless Headphones with Noise Cancellation",
      price: "₦45,000",
      originalPrice: "₦60,000",
      rating: 5,
      reviews: 234,
      discount: "25%",
    },
    {
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
      title: "Classic Analog Watch - Premium Collection",
      price: "₦28,500",
      rating: 4,
      reviews: 128,
    },
    {
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80",
      title: "Designer Sunglasses UV Protection",
      price: "₦12,000",
      originalPrice: "₦18,000",
      rating: 5,
      reviews: 89,
      discount: "33%",
    },
    {
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80",
      title: "Professional DSLR Camera Kit",
      price: "₦185,000",
      rating: 5,
      reviews: 412,
    },
    {
      image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=400&q=80",
      title: "Luxury Leather Sneakers",
      price: "₦32,000",
      originalPrice: "₦45,000",
      rating: 4,
      reviews: 156,
      discount: "29%",
    },
    {
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=400&q=80",
      title: "Wireless Running Earbuds",
      price: "₦15,500",
      rating: 4,
      reviews: 267,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </section>

      {/* Flash Deals Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Flash Deals</h2>
          <a href="#" className="text-primary hover:underline">View All →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold">100% Original</h3>
              <p className="text-sm text-muted-foreground">Authentic products</p>
            </div>
            <div>
              <Package className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">Nationwide shipping</p>
            </div>
            <div>
              <Home className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">7-day return policy</p>
            </div>
            <div>
              <Sparkles className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">Safe & encrypted</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
