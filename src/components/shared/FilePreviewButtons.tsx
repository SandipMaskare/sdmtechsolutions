import { useState } from "react";
import { Download, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { canPreview, downloadPrivateFile, fileName, isImage, signedFileUrl } from "@/lib/files";

interface Props {
  bucket: string;
  path: string;
  label?: string;
  size?: "sm" | "default";
}

/** "Resume" downloads straight away; the eye button previews PDFs and images in a popup. */
const FilePreviewButtons = ({ bucket, path, label = "Download", size = "sm" }: Props) => {
  const { toast } = useToast();
  const [busy, setBusy] = useState<"dl" | "pv" | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const download = async () => {
    setBusy("dl");
    const ok = await downloadPrivateFile(bucket, path);
    setBusy(null);
    if (!ok) toast({ title: "Could not download the file", variant: "destructive" });
  };

  const preview = async () => {
    setBusy("pv");
    const url = await signedFileUrl(bucket, path);
    setBusy(null);
    if (!url) {
      toast({ title: "Could not open the file", variant: "destructive" });
      return;
    }
    setPreviewUrl(url);
    setOpen(true);
  };

  return (
    <>
      <Button size={size} variant="outline" onClick={download} disabled={busy !== null}>
        {busy === "dl" ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Download className="w-4 h-4 mr-1" />}
        {label}
      </Button>
      {canPreview(path) && (
        <Button size={size} variant="outline" onClick={preview} disabled={busy !== null} title="Preview">
          {busy === "pv" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
          <span className="ml-1">Preview</span>
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="truncate pr-8">{fileName(path)}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 rounded-md border border-border overflow-hidden bg-muted">
            {previewUrl && (isImage(path) ? (
              <img src={previewUrl} alt={fileName(path)} className="w-full h-full object-contain" />
            ) : (
              <iframe src={previewUrl} title={fileName(path)} className="w-full h-full" />
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={download} disabled={busy !== null}>
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FilePreviewButtons;
