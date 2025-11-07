-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create products table for vendors
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id uuid NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for vendors to manage their own products
CREATE POLICY "Vendors can view their own products" 
ON public.products 
FOR SELECT 
USING (
  vendor_id = auth.uid() AND 
  public.has_role(auth.uid(), 'vendor')
);

CREATE POLICY "Vendors can create their own products" 
ON public.products 
FOR INSERT 
WITH CHECK (
  vendor_id = auth.uid() AND 
  public.has_role(auth.uid(), 'vendor')
);

CREATE POLICY "Vendors can update their own products" 
ON public.products 
FOR UPDATE 
USING (
  vendor_id = auth.uid() AND 
  public.has_role(auth.uid(), 'vendor')
);

CREATE POLICY "Vendors can delete their own products" 
ON public.products 
FOR DELETE 
USING (
  vendor_id = auth.uid() AND 
  public.has_role(auth.uid(), 'vendor')
);

-- Allow customers to view all products
CREATE POLICY "Customers can view all products" 
ON public.products 
FOR SELECT 
USING (public.has_role(auth.uid(), 'customer'));

-- Allow riders to view all products (for delivery purposes)
CREATE POLICY "Riders can view all products" 
ON public.products 
FOR SELECT 
USING (public.has_role(auth.uid(), 'rider'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();