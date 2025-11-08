import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Package, Bike } from "lucide-react";
import { z } from "zod";
import { CustomerSignupForm } from "@/components/auth/CustomerSignupForm";
import { VendorSignupForm, type VendorSignupData } from "@/components/auth/VendorSignupForm";
import { RiderSignupForm, type RiderSignupData } from "@/components/auth/RiderSignupForm";

type UserRole = "customer" | "vendor" | "rider";

const signInSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("customer");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (roleData?.role === "vendor") {
          navigate("/vendor/dashboard");
        } else if (roleData?.role === "rider") {
          navigate("/rider/dashboard");
        } else {
          navigate("/");
        }
      }
    };
    checkUser();
  }, [navigate]);

  const handleCustomerSignup = async (data: { email: string; password: string; fullName: string; phone: string }) => {
    setLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            role: "customer",
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleVendorSignup = async (data: VendorSignupData) => {
    setLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            role: "vendor",
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create vendor profile
        const { error: profileError } = await supabase
          .from("vendor_profiles")
          .insert({
            user_id: authData.user.id,
            business_name: data.businessName,
            business_address: data.businessAddress,
            business_phone: data.businessPhone,
            business_description: data.businessDescription || null,
          });

        if (profileError) throw profileError;

        toast.success("Vendor account created successfully!");
        navigate("/vendor/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleRiderSignup = async (data: RiderSignupData) => {
    setLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            role: "rider",
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create rider profile
        const { error: profileError } = await supabase
          .from("rider_profiles")
          .insert({
            user_id: authData.user.id,
            vehicle_type: data.vehicleType,
            vehicle_plate_number: data.vehiclePlateNumber,
            license_number: data.licenseNumber || null,
            emergency_contact: data.emergencyContact || null,
          });

        if (profileError) throw profileError;

        toast.success("Rider account created successfully!");
        navigate("/rider/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs
      const validationResult = signInSchema.safeParse({
        email,
        password,
      });

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast.error(firstError.message);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: validationResult.data.email,
        password: validationResult.data.password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .maybeSingle();

        toast.success("Signed in successfully!");
        
        if (roleData?.role === "vendor") {
          navigate("/vendor/dashboard");
        } else if (roleData?.role === "rider") {
          navigate("/rider/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "customer", label: "Customer", icon: User, description: "Shop and order products" },
    { value: "vendor", label: "Vendor", icon: Package, description: "Sell your products" },
    { value: "rider", label: "Rider", icon: Bike, description: "Deliver orders" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Jiffy NG</CardTitle>
          <CardDescription>Sign in or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>I want to sign up as</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {roleOptions.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setSelectedRole(role.value as UserRole)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                          selectedRole === role.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <role.icon className="h-5 w-5" />
                        <span className="text-xs font-medium">{role.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  {selectedRole === "customer" && (
                    <CustomerSignupForm onSubmit={handleCustomerSignup} loading={loading} />
                  )}
                  {selectedRole === "vendor" && (
                    <VendorSignupForm onSubmit={handleVendorSignup} loading={loading} />
                  )}
                  {selectedRole === "rider" && (
                    <RiderSignupForm onSubmit={handleRiderSignup} loading={loading} />
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
