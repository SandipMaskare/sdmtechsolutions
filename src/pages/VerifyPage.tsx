import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BadgeCheck, ShieldAlert, SearchX, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (v?: string | null) => { const m = String(v || "").match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}` : v || "-"; };

const VerifyPage = () => {
  usePageMeta("Verify a Letter | SDM Technology", "Check that an SDM Technology internship letter is genuine by entering its Intern ID or scanning the QR code on it.");
  const [params, setParams] = useSearchParams();
  const [id, setId] = useState(params.get("id") || "");
  const [res, setRes] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const check = async (value: string) => {
    const v = value.trim();
    if (!v) return;
    setBusy(true); setRes(null);
    const { data, error } = await (supabase as any).rpc("verify_certificate", { _id: v });
    setRes(error ? { status: "error" } : data);
    setBusy(false);
  };
  useEffect(() => { const q = params.get("id"); if (q) { setId(q); void check(q); } /* eslint-disable-next-line */ }, []);
  const submit = (e: React.FormEvent) => { e.preventDefault(); setParams(id.trim() ? { id: id.trim() } : {}); void check(id); };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-28 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Verify a letter</h1>
        <p className="text-muted-foreground mb-6">Enter the Intern ID printed on an SDM Technology internship letter, or scan the QR code on it, to confirm that it is genuine.</p>
        <form onSubmit={submit} className="flex gap-2 mb-6">
          <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. SDM/C3-250631" aria-label="Intern ID" />
          <Button type="submit" disabled={busy || !id.trim()}>{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}</Button>
        </form>

        {res?.status === "valid" && (
          <div className="rounded-xl border border-green-300 bg-green-50 dark:bg-green-950/30 p-5">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold text-lg mb-3"><BadgeCheck className="w-6 h-6" />Genuine letter. Verified by SDM Technology Pvt. Ltd.</div>
            <dl className="grid grid-cols-[130px_1fr] gap-y-2 text-sm">
              <dt className="text-muted-foreground">Name</dt><dd className="font-medium">{res.name}</dd>
              <dt className="text-muted-foreground">Intern ID</dt><dd>{res.cert_id}</dd>
              <dt className="text-muted-foreground">Role</dt><dd>{res.role}</dd>
              {res.college && <><dt className="text-muted-foreground">College</dt><dd>{res.college}</dd></>}
              <dt className="text-muted-foreground">Internship period</dt><dd>{fmt(res.start)} to {fmt(res.end)}</dd>
              <dt className="text-muted-foreground">Letter issued on</dt><dd>{fmt(res.issued_on)}</dd>
            </dl>
            <p className="text-xs text-muted-foreground mt-3">Compare these details with the letter you were given. If anything differs, the letter may have been altered.</p>
          </div>
        )}
        {res?.status === "revoked" && (
          <div className="rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/30 p-5 text-sm">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-semibold text-lg mb-1"><ShieldAlert className="w-6 h-6" />This letter is no longer valid</div>
            SDM Technology has withdrawn the letter with ID {res.cert_id}. Please contact us at sdmtechnologies.pvtltd@gmail.com.
          </div>
        )}
        {res?.status === "not_found" && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-5 text-sm">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-lg mb-1"><SearchX className="w-6 h-6" />No record found</div>
            We have no letter with this ID. Check the ID for typing mistakes. Letters issued before online verification started may not be listed; email sdmtechnologies.pvtltd@gmail.com with the letter and we will confirm it.
          </div>
        )}
        {res?.status === "error" && <p className="text-sm text-destructive">Could not check right now. Please try again in a moment.</p>}
      </main>
      <Footer />
    </div>
  );
};
export default VerifyPage;
