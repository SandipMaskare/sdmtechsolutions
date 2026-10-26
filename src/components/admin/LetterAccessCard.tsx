import { useEffect, useState } from "react";
import { Download, Eye, FileSignature, Loader2, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { letterHtml, letterToPdf, pdfName } from "./offerLetterTemplate";
import { completionHtml, completionPdfName, completionToPdf } from "./completionLetterTemplate";
import LetterPreview from "./LetterPreview";
import { LetterAccess, completionItemFor, defaultAccess, ensureLetterFonts, letterBlockers, loadAccess, offerItemFor, registerCompletion, saveAccess, saveBlob } from "@/lib/internLetters";
import { fmtDate } from "@/lib/internProfile";

type Kind = "offer" | "completion";

/** Admin control on an intern's profile: letters are generated from the profile and stay locked until unlocked here. */
const LetterAccessCard = ({ profile }: { profile: any }) => {
  const { toast } = useToast();
  const [a, setA] = useState<LetterAccess>(defaultAccess(profile.user_id));
  const [busy, setBusy] = useState<string | null>(null);
  const [view, setView] = useState<Kind | null>(null);
  const blockers = letterBlockers(profile);
  const ready = blockers.length === 0;

  useEffect(() => { ensureLetterFonts(); void loadAccess(profile.user_id).then(setA); }, [profile.user_id]);

  const update = async (next: LetterAccess, registerNow = false) => {
    setBusy("save");
    try {
      if (registerNow) await registerCompletion(profile, next);
      await saveAccess(next);
      setA(next);
    } catch (e: any) { toast({ title: "Could not save", description: e?.message, variant: "destructive" }); }
    setBusy(null);
  };
  const toggle = (k: Kind, v: boolean) => update({ ...a, [k === "offer" ? "offer_unlocked" : "completion_unlocked"]: v }, k === "completion" && v);
  const download = async (k: Kind) => {
    setBusy(k);
    try {
      if (k === "offer") { const it = offerItemFor(profile, a); saveBlob(await letterToPdf(it), pdfName(it)); }
      else { const it = completionItemFor(profile, a); saveBlob(await completionToPdf(it), completionPdfName(it)); }
    } catch (e: any) { toast({ title: "Could not create the PDF", description: e?.message, variant: "destructive" }); }
    setBusy(null);
  };
  const ended = profile.internship_end && new Date(profile.internship_end) < new Date();

  const row = (k: Kind, title: string, note: string, on: boolean) => (
    <div className="flex flex-wrap items-center gap-3 py-3">
      <div className="flex-1 min-w-[200px]">
        <p className="font-medium text-sm flex items-center gap-1.5">{on ? <Unlock className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-muted-foreground" />}{title}</p>
        <p className="text-xs text-muted-foreground">{note}</p>
      </div>
      <Button size="sm" variant="outline" disabled={!ready} onClick={() => setView(k)}><Eye className="w-4 h-4 mr-1" />Preview</Button>
      <Button size="sm" variant="outline" disabled={!ready || busy === k} onClick={() => download(k)}>{busy === k ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Download className="w-4 h-4 mr-1" />}PDF</Button>
      <label className="flex items-center gap-2 text-sm"><Switch checked={on} disabled={!ready || busy === "save"} onCheckedChange={(v) => toggle(k, v)} />{on ? "Visible to intern" : "Locked"}</label>
    </div>
  );

  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileSignature className="w-4 h-4" />Offer and completion letters</CardTitle></CardHeader>
      <CardContent>
        {!ready && (
          <p className="text-sm rounded-md border border-orange-400 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 p-3 mb-2">
            Letters are not generated until the profile is complete. Missing: {blockers.join(", ")}.
          </p>
        )}
        <div className="divide-y divide-border">
          {row("offer", "Offer letter", ready ? `Generated from the profile: ${profile.intern_id}, ${fmtDate(profile.internship_start)} to ${fmtDate(profile.internship_end)}.` : "Waiting for the profile.", a.offer_unlocked)}
          {row("completion", "Completion letter", ready ? `Dated ${fmtDate(profile.internship_end)}. Has a QR code and is added to the verification register when unlocked.${ended ? "" : " The internship has not ended yet."}` : "Waiting for the profile.", a.completion_unlocked)}
        </div>
        <div className="grid sm:grid-cols-3 gap-3 pt-3 border-t border-border mt-1">
          <div><Label className="text-xs">Pronouns in completion letter</Label>
            <Select value={a.gender} onValueChange={(v) => update({ ...a, gender: v as LetterAccess["gender"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="she">she / her</SelectItem><SelectItem value="he">he / his</SelectItem><SelectItem value="they">they / their</SelectItem></SelectContent>
            </Select>
          </div>
          <div><Label className="text-xs">Offer: accept within (days)</Label><Input type="number" min={1} defaultValue={a.accept_days} key={`d${a.accept_days}`} onBlur={(e) => { const n = Math.max(1, parseInt(e.target.value, 10) || 2); if (n !== a.accept_days) void update({ ...a, accept_days: n }); }} /></div>
          <div><Label className="text-xs">Offer: processing fee (₹)</Label><Input defaultValue={a.offer_fee} key={`f${a.offer_fee}`} onBlur={(e) => { const v = e.target.value.trim() || "149"; if (v !== a.offer_fee) void update({ ...a, offer_fee: v }); }} /></div>
        </div>
      </CardContent>
      <LetterPreview open={view === "offer"} onClose={() => setView(null)} title="Offer letter (page 1)" html={ready ? letterHtml(offerItemFor(profile, a)) : ""} />
      <LetterPreview open={view === "completion"} onClose={() => setView(null)} title="Completion letter" html={ready ? completionHtml(completionItemFor(profile, a)) : ""} />
    </Card>
  );
};
export default LetterAccessCard;
