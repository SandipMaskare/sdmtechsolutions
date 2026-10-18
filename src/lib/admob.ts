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

const get = (): Plugin | null => {
  if (!isNativeApp()) return null;
  if (plugin) return plugin;
  try {
    // The native runtime injects window.Capacitor; the AdMob plugin is compiled into the Android app.
    plugin = (window as any).Capacitor.registerPlugin("AdMob") as Plugin;
  } catch { plugin = null; }
  return plugin;
};

const init = () => {
  const p = get();
  if (!p) return Promise.reject(new Error("no plugin"));
  if (!ready) {
    ready = p.initialize({ initializeForTesting: USE_TEST_ADS }).then(() => {
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
  } catch { /* ads are optional: never break the app */ }
};

export const hideBanner = async () => {
  if (!visible) return;
  try {
    await get()?.removeBanner();
  } catch { /* ignore */ }
  visible = false;
  document.documentElement.style.setProperty("--sdm-ad-h", "0px");
};
