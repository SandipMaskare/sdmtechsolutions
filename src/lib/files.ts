import { supabase } from "@/integrations/supabase/client";

export const fileName = (path: string) => decodeURIComponent(path.split("/").pop() || "file");
export const fileExt = (path: string) => (path.split(".").pop() || "").toLowerCase();
export const canPreview = (path: string) => ["pdf", "png", "jpg", "jpeg", "webp", "gif", "txt"].includes(fileExt(path));
export const isImage = (path: string) => ["png", "jpg", "jpeg", "webp", "gif"].includes(fileExt(path));

/** Signed link for a private file. With download=true the browser saves the file instead of opening it. */
export async function signedFileUrl(bucket: string, path: string, download = false): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600, download ? { download: fileName(path) } : undefined);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/** Starts a direct download of a private file. Returns false if the link could not be created. */
export async function downloadPrivateFile(bucket: string, path: string): Promise<boolean> {
  const url = await signedFileUrl(bucket, path, true);
  if (!url) return false;
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName(path);
  document.body.appendChild(a);
  a.click();
  a.remove();
  return true;
}
