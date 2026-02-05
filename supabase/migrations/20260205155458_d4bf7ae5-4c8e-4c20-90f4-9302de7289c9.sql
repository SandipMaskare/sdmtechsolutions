-- Create website_content table for editable text content
CREATE TABLE public.website_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key text NOT NULL UNIQUE,
  title text,
  content text,
  metadata jsonb DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view website content"
ON public.website_content
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can insert website content"
ON public.website_content
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins can update website content"
ON public.website_content
FOR UPDATE
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete website content"
ON public.website_content
FOR DELETE
TO authenticated
USING (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_website_content_updated_at
BEFORE UPDATE ON public.website_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content
INSERT INTO public.website_content (section_key, title, content, metadata) VALUES
('about_title', 'About Us', 'Innovate or Stagnate, Technology Waits for None!', '{}'),
('about_description', 'About Description', 'SDM Technology leads the tech sector in Gondia, Maharashtra, delivering refined software solutions with advanced development practices. We specialize in creating innovative digital experiences that transform how businesses operate and connect with their customers.', '{}'),
('company_phone', 'Phone', '+91 7038523408', '{}'),
('company_email', 'Email', 'sdmtechnologies.pvtltd@gmail.com', '{}'),
('company_address', 'Address', 'Gondia, Maharashtra 441911', '{}');