import { supabase } from "@/integrations/supabase/client";
import { missingFields } from "@/lib/internProfile";
import { OFFER_FONTS, OfferItem } from "@/components/admin/offerLetterTemplate";
import { CompletionItem, registerCertificates } from "@/components/admin/completionLetterTemplate";

export interface LetterAccess {
  user_id: string;
  offer_unlocked: boolean;
  completion_unlocked: boolean;
  gender: "he" | "she" | "they";
  accept_days: number;
  offer_fee: string;
}

export const defaultAccess = (user_id: string): LetterAccess => ({ user_id, offer_unlocked: false, completion_unlocked: false, gender: "they", accept_days: 2, offer_fee: "149" });

const db = () => supabase as any;

export async function loadAccess(userId: string): Promise<LetterAccess> {
  const { data } = await db().from("letter_access").select("*").eq("user_id", userId).maybeSingle();
  return { ...defaultAccess(userId), ...(data || {}) };
}

export async function saveAccess(a: LetterAccess) {
  const { error } = await db().from("letter_access").upsert({ ...a, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) throw new Error(error.message);
}

/** Letters are only produced once every required profile field is filled in. */
export const letterBlockers = (profile: any) => missingFields(profile, "intern").map((m) => m.label);

const day = (v?: string | null) => String(v || "").slice(0, 10);
const roleOf = (p: any) => String(p.offer_role || "").trim() || (p.internship_domain ? `${p.internship_domain}${/intern$/i.test(p.internship_domain) ? "" : " Intern"}` : "Intern");

export const offerItemFor = (p: any, a: LetterAccess): OfferItem => ({
  id: p.intern_id, fee: a.offer_fee, name: p.full_name, email: p.email || "", role: roleOf(p),
  start: day(p.internship_start), end: day(p.internship_end), ldate: day(p.offer_date) || day(p.created_at), days: String(a.accept_days),
});

export const completionItemFor = (p: any, a: LetterAccess): CompletionItem => ({
  id: p.intern_id, name: p.full_name, email: p.email || "", college: p.college || "", course: "", role: roleOf(p),
  start: day(p.internship_start), end: day(p.internship_end), ldate: day(p.internship_end), gender: a.gender,
});

/** Saves the letter in the verification register when the completion letter is unlocked, so its QR code works. */
export const registerCompletion = (p: any, a: LetterAccess) => registerCertificates([completionItemFor(p, a)]);

export function ensureLetterFonts() {
  if (typeof document === "undefined" || document.getElementById("offer-fonts")) return;
  const l = document.createElement("link");
  l.id = "offer-fonts"; l.rel = "stylesheet"; l.href = OFFER_FONTS;
  document.head.appendChild(l);
}

export function saveBlob(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
