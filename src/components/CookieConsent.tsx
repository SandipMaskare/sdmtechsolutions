import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getConsent, setConsent, startAnalytics, trackPage } from "@/lib/analytics";

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { if (getConsent() === null) setShow(true); else void startAnalytics(); }, []);
  useEffect(() => { trackPage(); }, [pathname]);
  if (!show) return null;
  const choose = (v: "yes" | "no") => { setConsent(v); setShow(false); };
  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-xl border border-border bg-background p-4 shadow-2xl">
      <p className="text-sm text-foreground">
        We use cookies to keep you signed in, understand how the site is used (Google Analytics) and show ads (Google AdSense). You can accept or decline non-essential cookies. See our <Link to="/privacy-policy" className="underline text-primary">Privacy Policy</Link>.
      </p>
      <div className="mt-3 flex gap-2 justify-end">
        <button onClick={() => choose("no")} className="rounded-md border border-border px-4 py-1.5 text-sm hover:bg-muted">Decline</button>
        <button onClick={() => choose("yes")} className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">Accept</button>
      </div>
    </div>
  );
};
export default CookieConsent;
