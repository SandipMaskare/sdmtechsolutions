import { supabase } from "@/integrations/supabase/client";

interface Applyable {
  kind?: string | null;
  apply_url?: string | null;
}

let cache: Record<string, string> | null = null;

const siteForms = async (): Promise<Record<string, string>> => {
  if (cache) return cache;
  const { data } = await supabase
    .from("website_content")
    .select("section_key, content")
    .in("section_key", ["internship_form_url", "job_form_url", "apply_mode"]);
  cache = {};
  (data || []).forEach((r: any) => {
    if (r.section_key === "apply_mode") cache!.apply_mode = (r.content || "").trim().toLowerCase();
    else if (r.content && /^https?:\/\//i.test(r.content.trim())) cache![r.section_key] = r.content.trim();
  });
  return cache;
};

/**
 * Opens the Google Form for a job/internship in a new tab.
 * Order: the listing's own link, then the site-wide link set in Admin -> Content.
 * Returns false when no link is configured (caller can fall back to the built-in form).
 */
export const openApply = async (item: Applyable): Promise<boolean> => {
  // Admin -> Applications can switch applying to the website's own form, so applications are saved and listed there.
  if ((await siteForms()).apply_mode === "site") return false;
  let url = item.apply_url?.trim() || "";
  if (!url) {
    const forms = await siteForms();
    url = forms[item.kind === "internship" ? "internship_form_url" : "job_form_url"] || "";
  }
  if (!/^https?:\/\//i.test(url)) return false;
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
};
