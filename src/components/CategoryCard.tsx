import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  itemCount: string;
}

const CategoryCard = ({ icon: Icon, title, itemCount }: CategoryCardProps) => {
  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group border-2 hover:border-primary">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{itemCount}</p>
      </div>
    </Card>
  );
};

export default CategoryCard;
