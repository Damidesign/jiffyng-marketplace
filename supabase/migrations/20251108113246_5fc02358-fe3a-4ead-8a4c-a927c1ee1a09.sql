-- Fix 1: Remove user role self-assignment policy
DROP POLICY IF EXISTS "Users can insert their own role during signup" ON public.user_roles;

-- Create a trigger to automatically assign 'customer' role on user creation
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_default_role();

-- Fix 2: Create function to get masked pending orders for riders
CREATE OR REPLACE FUNCTION public.get_pending_orders_for_rider()
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  customer_id uuid,
  vendor_id uuid,
  rider_id uuid,
  product_id uuid,
  product_name text,
  product_price numeric,
  quantity integer,
  total_amount numeric,
  status order_status,
  customer_phone text,
  delivery_address text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    o.id,
    o.created_at,
    o.updated_at,
    o.customer_id,
    o.vendor_id,
    o.rider_id,
    o.product_id,
    o.product_name,
    o.product_price,
    o.quantity,
    o.total_amount,
    o.status,
    CASE 
      WHEN o.rider_id IS NULL THEN '***-***-' || RIGHT(o.customer_phone, 4)
      ELSE o.customer_phone 
    END as customer_phone,
    CASE 
      WHEN o.rider_id IS NULL THEN SUBSTRING(o.delivery_address, 1, 20) || '...'
      ELSE o.delivery_address 
    END as delivery_address
  FROM public.orders o
  WHERE o.status = 'pending' AND has_role(auth.uid(), 'rider')
$$;

-- Update the original orders policy for riders to only see assigned orders
DROP POLICY IF EXISTS "Riders can view pending orders" ON public.orders;

CREATE POLICY "Riders can view their assigned orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'rider') AND rider_id = auth.uid()
);