-- Fix all admin policies to be restricted to authenticated users only

-- Jobs table admin policies
DROP POLICY IF EXISTS "Admins can delete jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins can update jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins can view all jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins can insert jobs" ON public.jobs;

CREATE POLICY "Admins can view all jobs"
ON public.jobs
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can insert jobs"
ON public.jobs
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins can update jobs"
ON public.jobs
FOR UPDATE
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete jobs"
ON public.jobs
FOR DELETE
TO authenticated
USING (is_admin());

-- Services table admin policies
DROP POLICY IF EXISTS "Admins can delete services" ON public.services;
DROP POLICY IF EXISTS "Admins can update services" ON public.services;
DROP POLICY IF EXISTS "Admins can view all services" ON public.services;
DROP POLICY IF EXISTS "Admins can insert services" ON public.services;

CREATE POLICY "Admins can view all services"
ON public.services
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can insert services"
ON public.services
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins can update services"
ON public.services
FOR UPDATE
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete services"
ON public.services
FOR DELETE
TO authenticated
USING (is_admin());

-- Testimonials table admin policies
DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can view all testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;

CREATE POLICY "Admins can view all testimonials"
ON public.testimonials
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can insert testimonials"
ON public.testimonials
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins can update testimonials"
ON public.testimonials
FOR UPDATE
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete testimonials"
ON public.testimonials
FOR DELETE
TO authenticated
USING (is_admin());