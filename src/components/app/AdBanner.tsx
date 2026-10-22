import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AD_ROUTES } from "@/lib/adConfig";
import { hideBanner, showBanner } from "@/lib/admob";

/** Invisible controller: shows the AdMob banner only on allowed public screens of the native app. */
const AdBanner = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    try { console.warn("[SDM-Ads] route", pathname); } catch { /* ignore */ }
    const allowed = AD_ROUTES.some((p) => (p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(p + "/")));
    if (allowed) void showBanner();
    else void hideBanner();
  }, [pathname]);
  return null;
};

export default AdBanner;
