import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Bike, LogOut, Package, MapPin, Phone, Clock } from "lucide-react";
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

const RiderDashboard = () => {
  const navigate = useNavigate();
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkRiderAndLoadOrders();
    
    // Set up realtime subscription for new orders
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkRiderAndLoadOrders = async () => {
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

    if (roleData?.role !== "rider") {
      toast.error("Access denied. Rider account required.");
      navigate("/");
      return;
    }

    loadOrders();
  };

  const loadOrders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get pending orders with masked data using the security function
      const { data: pendingData, error: pendingError } = await supabase
        .rpc("get_pending_orders_for_rider");

      if (pendingError) throw pendingError;

      // Get rider's accepted orders with full details
      const { data: myOrdersData, error: myOrdersError } = await supabase
        .from("orders")
        .select("*")
        .eq("rider_id", session.user.id)
        .in("status", ["accepted", "in_transit"])
        .order("created_at", { ascending: false });

      if (myOrdersError) throw myOrdersError;

      setAvailableOrders(pendingData || []);
      setMyOrders(myOrdersData || []);
    } catch (error: any) {
      toast.error("Failed to load orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("orders")
        .update({ 
          rider_id: session.user.id,
          status: "accepted"
        })
        .eq("id", orderId)
        .is("rider_id", null);

      if (error) throw error;

      toast.success("Order accepted successfully!");
      loadOrders();
    } catch (error: any) {
      toast.error(error.message || "Failed to accept order");
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: "in_transit" | "delivered") => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast.success(`Order status updated to ${newStatus.replace("_", " ")}`);
      loadOrders();
    } catch (error: any) {
      toast.error("Failed to update order status");
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
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const OrderCard = ({ order, showActions = false }: { order: Order; showActions?: boolean }) => (
    <Card key={order.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.product_name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              {new Date(order.created_at).toLocaleString()}
            </CardDescription>
          </div>
          <Badge variant={getStatusBadgeVariant(order.status)}>
            {order.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
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
              <p className="text-sm font-medium">Customer Phone</p>
              <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
            </div>
          </div>
        </div>

        {showActions && (
          <div className="space-y-2 pt-3">
            {order.status === "pending" && !order.rider_id && (
              <Button 
                className="w-full" 
                onClick={() => handleAcceptOrder(order.id)}
              >
                Accept Delivery
              </Button>
            )}
            {order.status === "accepted" && (
              <Button 
                className="w-full" 
                onClick={() => handleUpdateStatus(order.id, "in_transit")}
              >
                Start Delivery
              </Button>
            )}
            {order.status === "in_transit" && (
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => handleUpdateStatus(order.id, "delivered")}
              >
                Mark as Delivered
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bike className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Rider Dashboard</h1>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="available">
              Available Orders ({availableOrders.length})
            </TabsTrigger>
            <TabsTrigger value="my-orders">
              My Deliveries ({myOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Available Orders</h2>
              <p className="text-muted-foreground">Accept orders to start delivering</p>
            </div>

            {availableOrders.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No available orders</h3>
                  <p className="text-muted-foreground">
                    Check back soon for new delivery opportunities
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableOrders.map((order) => (
                  <OrderCard key={order.id} order={order} showActions={true} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-orders">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">My Deliveries</h2>
              <p className="text-muted-foreground">Orders you're currently delivering</p>
            </div>

            {myOrders.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Bike className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No active deliveries</h3>
                  <p className="text-muted-foreground">
                    Accept an order from available orders to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myOrders.map((order) => (
                  <OrderCard key={order.id} order={order} showActions={true} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default RiderDashboard;
