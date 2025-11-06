import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary/10 to-amber-500/10 overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Flash Sale
              <span className="block text-primary">Up to 50% Off</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Amazing deals on electronics, fashion, and more. Limited time only!
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-amber-500 hover:opacity-90">
                Shop Now
              </Button>
              <Button size="lg" variant="outline">
                View Deals
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-96 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80"
              alt="Shopping bags"
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg">
        <ChevronRight className="h-6 w-6" />
      </button>
    </section>
  );
};

export default Hero;
