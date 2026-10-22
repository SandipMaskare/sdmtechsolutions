import { isNativeApp } from "@/lib/appMode";
import { PRODUCTION_BANNER_ID, TEST_BANNER_ID, USE_TEST_ADS } from "@/lib/adConfig";

type Plugin = {
  initialize: (o?: any) => Promise<void>;
  showBanner: (o: any) => Promise<void>;
  removeBanner: () => Promise<void>;
  addListener: (name: string, cb: (i: any) => void) => Promise<any>;
};

let plugin: Plugin | null = null;
let ready: Promise<void> | null = null;
let visible = false;
const log = (...a: unknown[]) => { try { console.warn("[SDM-Ads]", ...a); } catch { /* ignore */ } };

const get = (): Plugin | null => {
  if (!isNativeApp()) return null;
  if (plugin) return plugin;
  try {
    // The native runtime injects window.Capacitor with every native plugin under .Plugins.
    const cap = (window as any).Capacitor;
    const p = cap?.Plugins?.AdMob ?? (typeof cap?.registerPlugin === "function" ? cap.registerPlugin("AdMob") : null);
    if (p) plugin = p as Plugin;
    else log("AdMob not found. Plugins:", Object.keys(cap?.Plugins ?? {}).join(","));
  } catch (e) { log("get plugin failed", String(e)); plugin = null; }
  return plugin;
};

const init = () => {
  const p = get();
  if (!p) { log("AdMob plugin not available (isNative=" + String(isNativeApp()) + ")"); return Promise.reject(new Error("no plugin")); }
  if (!ready) {
    log("initialize...");
    ready = p.initialize({ initializeForTesting: USE_TEST_ADS }).then(() => {
      log("initialized");
      p.addListener("bannerAdSizeChanged", (s: { height: number }) => {
        document.documentElement.style.setProperty("--sdm-ad-h", `${Math.round(s?.height ?? 0)}px`);
      });
    });
  }
  return ready;
};

/** Show a bottom banner above the tab bar (64dp). Safe to call repeatedly. */
export const showBanner = async () => {
  if (visible) return;
  try {
    await init();
    const id = USE_TEST_ADS || !PRODUCTION_BANNER_ID ? TEST_BANNER_ID : PRODUCTION_BANNER_ID;
    await get()!.showBanner({ adId: id, adSize: "ADAPTIVE_BANNER", position: "BOTTOM_CENTER", margin: 64, isTesting: USE_TEST_ADS });
    visible = true;
    log("banner requested", id);
  } catch (e) { log("showBanner failed", JSON.stringify(e), String(e)); }
};

export const hideBanner = async () => {
  if (!visible) return;
  try {
    await get()?.removeBanner();
  } catch (e) { log("removeBanner failed", String(e)); }
  visible = false;
  document.documentElement.style.setProperty("--sdm-ad-h", "0px");
};
