import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShoppingBag, LogOut, Package, MapPin, Phone, Clock, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Order {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  total_amount: number;
  delivery_address: string;
  customer_phone: string;
  status: "pending" | "accepted" | "in_transit" | "delivered" | "cancelled";
  created_at: string;
  rider_id: string | null;
}

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkCustomerAndLoadOrders();
    
    // Set up realtime subscription for order status updates
    const channel = supabase
      .channel('customer-orders-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order updated:', payload);
          loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkCustomerAndLoadOrders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (roleData?.role !== "customer") {
      toast.error("Access denied. Customer account required.");
      navigate("/");
      return;
    }

    loadOrders();
  };

  const loadOrders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get all orders for the customer
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Split into active and completed orders
      const active = ordersData?.filter(
        order => ['pending', 'accepted', 'in_transit'].includes(order.status)
      ) || [];
      
      const history = ordersData?.filter(
        order => ['delivered', 'cancelled'].includes(order.status)
      ) || [];

      setActiveOrders(active);
      setOrderHistory(history);
    } catch (error: any) {
      toast.error("Failed to load orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "accepted":
        return "default";
      case "in_transit":
        return "default";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
        return <Package className="h-4 w-4" />;
      case "in_transit":
        return <TrendingUp className="h-4 w-4" />;
      case "delivered":
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Waiting for a rider to accept your order";
      case "accepted":
        return "A rider has accepted your order and will pick it up soon";
      case "in_transit":
        return "Your order is on the way!";
      case "delivered":
        return "Order delivered successfully";
      case "cancelled":
        return "This order was cancelled";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const OrderCard = ({ order, showTracking = false }: { order: Order; showTracking?: boolean }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{order.product_name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              {new Date(order.created_at).toLocaleString()}
            </CardDescription>
          </div>
          <Badge variant={getStatusBadgeVariant(order.status)} className="flex items-center gap-1">
            {getStatusIcon(order.status)}
            {order.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {showTracking && (
          <div className="bg-muted/50 p-3 rounded-lg border">
            <p className="text-sm font-medium mb-1">Delivery Status</p>
            <p className="text-sm text-muted-foreground">{getStatusDescription(order.status)}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Quantity:</span>
            <p className="font-semibold">{order.quantity}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Total:</span>
            <p className="font-semibold text-primary">₦{order.total_amount.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Delivery Address</p>
              <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Contact Phone</p>
              <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">My Orders</h1>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active">
              Active Orders ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              Order History ({orderHistory.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Active Deliveries</h2>
              <p className="text-muted-foreground">Track your orders in real-time</p>
            </div>

            {activeOrders.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No active orders</h3>
                  <p className="text-muted-foreground mb-4">
                    Browse products and place your first order
                  </p>
                  <Button onClick={() => navigate("/")}>
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeOrders.map((order) => (
                  <OrderCard key={order.id} order={order} showTracking={true} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Order History</h2>
              <p className="text-muted-foreground">View your past orders</p>
            </div>

            {orderHistory.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No order history</h3>
                  <p className="text-muted-foreground">
                    Your completed and cancelled orders will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orderHistory.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CustomerDashboard;
