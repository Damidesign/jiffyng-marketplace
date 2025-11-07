-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'accepted', 'in_transit', 'delivered', 'cancelled');

-- Create orders table
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid NOT NULL,
  vendor_id uuid NOT NULL,
  rider_id uuid,
  product_id uuid NOT NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Customers can view their own orders
CREATE POLICY "Customers can view their own orders" 
ON public.orders 
FOR SELECT 
USING (
  customer_id = auth.uid() AND 
  public.has_role(auth.uid(), 'customer')
);

-- Customers can create their own orders
CREATE POLICY "Customers can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  customer_id = auth.uid() AND 
  public.has_role(auth.uid(), 'customer')
);

-- Vendors can view orders for their products
CREATE POLICY "Vendors can view their orders" 
ON public.orders 
FOR SELECT 
USING (
  vendor_id = auth.uid() AND 
  public.has_role(auth.uid(), 'vendor')
);

-- Riders can view all pending orders
CREATE POLICY "Riders can view pending orders" 
ON public.orders 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'rider') AND
  (status = 'pending' OR rider_id = auth.uid())
);

-- Riders can update orders they've accepted
CREATE POLICY "Riders can update their orders" 
ON public.orders 
FOR UPDATE 
USING (
  rider_id = auth.uid() AND 
  public.has_role(auth.uid(), 'rider')
);

-- Riders can accept pending orders (update rider_id)
CREATE POLICY "Riders can accept orders" 
ON public.orders 
FOR UPDATE 
USING (
  public.has_role(auth.uid(), 'rider') AND
  status = 'pending' AND
  rider_id IS NULL
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();