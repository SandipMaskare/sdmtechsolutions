import { useEffect, useState } from "react";
import { Download, Eye, FileSignature, Loader2, Lock, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PortalLayout, { PortalKind } from "@/components/portal/PortalLayout";
import LetterPreview from "@/components/admin/LetterPreview";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { letterHtml, letterToPdf, pdfName } from "@/components/admin/offerLetterTemplate";
import { completionHtml, completionPdfName, completionToPdf } from "@/components/admin/completionLetterTemplate";
import { LetterAccess, completionItemFor, defaultAccess, ensureLetterFonts, letterBlockers, loadAccess, offerItemFor, saveBlob } from "@/lib/internLetters";

type Kind = "offer" | "completion";

/** The intern's own offer and completion letters. Each one is locked until SDM Technology unlocks it. */
const PortalLetters = ({ kind }: { kind: PortalKind }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [p, setP] = useState<any>(null);
  const [a, setA] = useState<LetterAccess | null>(null);
  const [busy, setBusy] = useState<Kind | null>(null);
  const [view, setView] = useState<Kind | null>(null);

  useEffect(() => {
    if (!user) return;
    ensureLetterFonts();
    void supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => setP(data));
    void loadAccess(user.id).then(setA);
  }, [user]);

  const download = async (k: Kind) => {
    if (!p || !a) return;
    setBusy(k);
    try {
      if (k === "offer") { const it = offerItemFor(p, a); saveBlob(await letterToPdf(it), pdfName(it)); }
      else { const it = completionItemFor(p, a); saveBlob(await completionToPdf(it), completionPdfName(it)); }
    } catch (e: any) { toast({ title: "Could not create the PDF", description: e?.message, variant: "destructive" }); }
    setBusy(null);
  };

  const ready = p ? letterBlockers(p).length === 0 : false;
  const card = (k: Kind, title: string, unlocked: boolean, lockedText: string) => (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{unlocked ? <FileSignature className="w-5 h-5" /> : <Lock className="w-5 h-5" />}</div>
          <div className="flex-1">
            <h3 className="font-semibold">{title}</h3>
            {unlocked && ready ? <p className="text-sm text-muted-foreground flex items-center gap-1"><BadgeCheck className="w-4 h-4 text-green-600" />Ready. Download it any time.</p> : <p className="text-sm text-muted-foreground">{!ready ? "Complete your profile first. Your letters are created from it." : lockedText}</p>}
          </div>
        </div>
        {unlocked && ready && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setView(k)}><Eye className="w-4 h-4 mr-1" />Preview</Button>
            <Button size="sm" disabled={busy === k} onClick={() => download(k)}>{busy === k ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Download className="w-4 h-4 mr-1" />}Download PDF</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
  const acc = a || defaultAccess(user?.id || "");

  return (
    <PortalLayout kind={kind}>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold font-display">My Letters</h1>
          <p className="text-muted-foreground mt-1">Your internship letters from SDM Technology. They are created from your profile, so keep your profile details correct. A locked letter opens as soon as the team unlocks it.</p>
        </div>
        {!p || !a ? <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Loading…</p> : (
          <div className="grid gap-4 md:grid-cols-2">
            {card("offer", "Offer letter", acc.offer_unlocked, "Locked. It will open here once SDM Technology unlocks it.")}
            {card("completion", "Completion letter", acc.completion_unlocked, "Locked. It opens after you complete your internship and the team approves it.")}
          </div>
        )}
        <p className="text-xs text-muted-foreground">Anyone can confirm your completion letter at sdmtechsolution.com/verify using your Intern ID or the QR code on it.</p>
      </div>
      {p && a && ready && <>
        <LetterPreview open={view === "offer"} onClose={() => setView(null)} title="Offer letter (page 1)" html={letterHtml(offerItemFor(p, a))} />
        <LetterPreview open={view === "completion"} onClose={() => setView(null)} title="Completion letter" html={completionHtml(completionItemFor(p, a))} />
      </>}
    </PortalLayout>
  );
};
export default PortalLetters;
