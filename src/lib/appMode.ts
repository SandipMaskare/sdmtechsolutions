/** True only inside the native Android app (Capacitor), where AdMob works. */
export const isNativeApp = (): boolean => {
  try {
    return typeof window !== "undefined" && !!(window as any).Capacitor?.isNativePlatform?.();
  } catch { return false; }
};

/** True when the site runs as an installed app (PWA / Play Store TWA) instead of in a browser tab. */
export const isAppMode = (): boolean => {
  if (typeof window === "undefined") return false;
  if (isNativeApp()) return true;
  try {
    if (new URLSearchParams(window.location.search).get("source") === "pwa") sessionStorage.setItem("sdm_app", "1");
    if (sessionStorage.getItem("sdm_app") === "1") return true;
  } catch { /* storage blocked */ }
  const standalone =
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.matchMedia?.("(display-mode: fullscreen)").matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.startsWith("android-app://");
  if (standalone) {
    try { sessionStorage.setItem("sdm_app", "1"); } catch { /* ignore */ }
  }
  return standalone;
};
