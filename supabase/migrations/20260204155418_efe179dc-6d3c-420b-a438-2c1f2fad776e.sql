-- Fix security issues by ensuring admin tables only have authenticated admin access

-- 1. Drop and recreate admin_users policies to restrict to authenticated users only
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Only admins can insert admin_users" ON public.admin_users;

CREATE POLICY "Admins can view admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Only admins can insert admin_users"
ON public.admin_users
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- 2. Fix contact_submissions policies to restrict admin operations to authenticated users
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;

CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete contact submissions"
ON public.contact_submissions
FOR DELETE
TO authenticated
USING (is_admin());