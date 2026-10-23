import { supabase } from "@/integrations/supabase/client";

const CONSENT_KEY = "sdm_cookie_consent";
let gaId: string | null = null;
let loaded = false;

export const getConsent = (): "yes" | "no" | null => {
  try { const v = localStorage.getItem(CONSENT_KEY); return v === "yes" || v === "no" ? v : null; } catch { return null; }
};
export const setConsent = (v: "yes" | "no") => {
  try { localStorage.setItem(CONSENT_KEY, v); } catch { /* ignore */ }
  if (v === "yes") void startAnalytics();
};

const loadId = async () => {
  if (gaId !== null) return gaId;
  const { data } = await supabase.from("website_content").select("content").eq("section_key", "ga_measurement_id").maybeSingle();
  const id = (data?.content || "").trim();
  gaId = /^G-[A-Z0-9]{6,}$/i.test(id) ? id : "";
  return gaId;
};

/** Loads Google Analytics only after the visitor accepts cookies and an ID is saved in Admin > Analytics. */
export const startAnalytics = async () => {
  if (loaded || getConsent() !== "yes") return;
  const id = await loadId();
  if (!id) return;
  loaded = true;
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () { w.dataLayer.push(arguments); };
  w.gtag("js", new Date());
  w.gtag("config", id, { send_page_view: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
  trackPage();
};

export const trackPage = () => {
  const w = window as any;
  if (!loaded || !w.gtag) return;
  w.gtag("event", "page_view", { page_path: location.pathname + location.search, page_title: document.title });
};
