-- Add INSERT policy to prevent unauthorized admin creation
CREATE POLICY "Only admins can insert admin_users"
ON public.admin_users
FOR INSERT
WITH CHECK (is_admin());