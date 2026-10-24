import { supabase } from "@/integrations/supabase/client";

export const fileName = (path: string) => decodeURIComponent(path.split("/").pop() || "file");
export const fileExt = (path: string) => (path.split(".").pop() || "").toLowerCase();
export const isImage = (path: string) => ["png", "jpg", "jpeg", "webp", "gif", "bmp", "svg", "avif"].includes(fileExt(path));
const TEXT_EXTS = ["txt","md","csv","tsv","json","js","jsx","ts","tsx","mjs","py","ipynb","html","htm","css","scss","java","c","cpp","h","cs","php","rb","go","rs","kt","swift","sql","sh","xml","yml","yaml","ini","log","rtf"];
export type FileKind = "image" | "pdf" | "video" | "audio" | "text" | "docx" | "pptx" | "xlsx" | "zip" | "other";
export const fileKind = (path: string): FileKind => {
  const e = fileExt(path);
  if (isImage(path)) return "image";
  if (e === "pdf") return "pdf";
  if (["mp4", "webm", "mov", "m4v", "ogv"].includes(e)) return "video";
  if (["mp3", "wav", "ogg", "m4a", "aac"].includes(e)) return "audio";
  if (TEXT_EXTS.includes(e)) return "text";
  if (e === "docx") return "docx";
  if (e === "pptx") return "pptx";
  if (e === "xlsx") return "xlsx";
  if (e === "zip") return "zip";
  return "other";
};
export const canPreview = (path: string) => fileKind(path) !== "other";

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
