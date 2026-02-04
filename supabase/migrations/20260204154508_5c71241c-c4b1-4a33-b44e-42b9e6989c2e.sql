-- Fix contact_submissions SELECT policy to be PERMISSIVE (admin-only)
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;

-- Create a proper PERMISSIVE policy that only allows admins to SELECT
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (is_admin());