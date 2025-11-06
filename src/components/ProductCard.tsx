import { Star, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  discount?: string;
}

const ProductCard = ({ image, title, price, originalPrice, rating, reviews, discount }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {discount && (
          <Badge className="absolute top-2 left-2 bg-destructive">
            -{discount}
          </Badge>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-medium line-clamp-2 h-12">{title}</h3>
        
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-1">({reviews})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">{price}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>
          )}
        </div>

        <Button className="w-full bg-gradient-to-r from-primary to-amber-500 hover:opacity-90">
          Add to Cart
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
