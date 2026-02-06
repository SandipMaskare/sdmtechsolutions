-- Create storage bucket for task submissions
INSERT INTO storage.buckets (id, name, public) 
VALUES ('task-submissions', 'task-submissions', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload task files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'task-submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own files
CREATE POLICY "Users can view own task files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'task-submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow admins to view all task files
CREATE POLICY "Admins can view all task files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'task-submissions' AND public.has_role(auth.uid(), 'admin'));