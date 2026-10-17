import { useRef, useState } from "react";
import { CheckCircle2, Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { fmtDate } from "@/lib/internProfile";
import sdmLogo from "@/assets/sdm-logo.webp";

export const receiptNo = (p: any) => `SDM-RCPT-${String(p.id).replace(/-/g, "").slice(0, 8).toUpperCase()}`;

const inr = (n: any) => `Rs. ${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Success screen + downloadable receipt (PDF or image) for a verified payment. */
const PaymentReceipt = ({ payment, profile, open, onClose }: { payment: any; profile: any; open: boolean; onClose: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  if (!payment) return null;

  const rows: [string, string][] = [
    ["Receipt No.", receiptNo(payment)],
    ["Paid by", profile?.full_name || "—"],
    ["Intern ID", profile?.intern_id || "—"],
    ["Domain", profile?.internship_domain || "—"],
    ["Payment for", payment.title],
    ["Transaction / UTR", payment.reference || "—"],
    ["Payment submitted", fmtDate(payment.submitted_at)],
    ["Verified on", fmtDate(payment.verified_at)],
  ];

  const png = async () => {
    const html2canvas = (await import("html2canvas")).default;
    return html2canvas(ref.current!, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
  };

  const downloadImage = async () => {
    setBusy(true);
    try {
      const canvas = await png();
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${receiptNo(payment)}.png`;
      a.click();
    } catch (e: any) {
      toast({ title: "Could not create image", description: e.message, variant: "destructive" });
    }
    setBusy(false);
  };

  const downloadPdf = async () => {
    setBusy(true);
    try {
      const [{ jsPDF }, canvas] = await Promise.all([import("jspdf"), png()]);
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const w = 150;
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", (210 - w) / 2, 20, w, h);
      pdf.save(`${receiptNo(payment)}.pdf`);
    } catch (e: any) {
      toast({ title: "Could not create PDF", description: e.message, variant: "destructive" });
    }
    setBusy(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[92vh] overflow-auto">
        <DialogHeader><DialogTitle className="sr-only">Payment receipt</DialogTitle></DialogHeader>
        <div ref={ref} style={{ background: "#fff", color: "#111", padding: 24, borderRadius: 12, border: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <img src={sdmLogo} alt="" style={{ height: 36 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>SDM Technology</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>www.sdmtechsolution.com</div>
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "10px 0 16px" }}>
            <CheckCircle2 style={{ width: 48, height: 48, color: "#16a34a", margin: "0 auto" }} />
            <div style={{ fontSize: 18, fontWeight: 700, color: "#16a34a", marginTop: 6 }}>Payment Successful</div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 4 }}>{inr(payment.amount)}</div>
          </div>
          <div style={{ borderTop: "1px dashed #d1d5db", paddingTop: 12 }}>
            {rows.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, padding: "5px 0" }}>
                <span style={{ color: "#6b7280" }}>{k}</span>
                <span style={{ fontWeight: 600, textAlign: "right", wordBreak: "break-word" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 10.5, color: "#9ca3af", textAlign: "center" }}>
            This is a computer-generated receipt and does not require a signature.
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={downloadPdf} disabled={busy}><Download className="w-4 h-4 mr-2" />Download PDF</Button>
          <Button variant="outline" onClick={downloadImage} disabled={busy}><ImageIcon className="w-4 h-4 mr-2" />Save as image</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentReceipt;
