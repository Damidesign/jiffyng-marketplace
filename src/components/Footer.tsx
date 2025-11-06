import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">Jiffy NG</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Nigeria's trusted online marketplace. Shop smart, shop fast with Jiffy NG.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="font-semibold mb-4">About Jiffy NG</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Vendor Hub</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold mb-4">We Accept</h4>
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-2 bg-muted rounded text-xs font-medium">Paystack</div>
              <div className="px-3 py-2 bg-muted rounded text-xs font-medium">Flutterwave</div>
              <div className="px-3 py-2 bg-muted rounded text-xs font-medium">Visa</div>
              <div className="px-3 py-2 bg-muted rounded text-xs font-medium">Mastercard</div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Jiffy NG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
