import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OFFER_CSS } from "./offerLetterTemplate";
import { ensureLetterFonts } from "@/lib/internLetters";

/** Shows a letter (744 px wide page) scaled to fit a popup. */
const LetterPreview = ({ open, onClose, title, html }: { open: boolean; onClose: () => void; title: string; html: string }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);
  useEffect(() => { ensureLetterFonts(); }, []);
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setScale(Math.min(1, ((wrap.current?.clientWidth ?? 744) - 8) / 744)), 60);
    return () => clearTimeout(t);
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-auto">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div ref={wrap}>
          <style>{OFFER_CSS}</style>
          <div style={{ width: 744 * scale, height: 1052 * scale }}>
            <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: 744 }} dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default LetterPreview;
