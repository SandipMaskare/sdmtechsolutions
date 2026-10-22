/**
 * AdMob settings for the Android app (not used on the website, which keeps AdSense).
 *
 * While USE_TEST_ADS is true, Google's official test banner is shown, so nothing here can get your
 * account flagged. Before publishing: create the app + a banner unit in admob.google.com,
 * paste the banner unit id below and set USE_TEST_ADS to false.
 * (The AdMob *app* id goes in android/app/src/main/AndroidManifest.xml, see the build guide.)
 */
export const USE_TEST_ADS = false;
export const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";
export const PRODUCTION_BANNER_ID = "ca-app-pub-2186344941263340/8968657436";

/** Screens that may show a banner. Never on login, payments, profile or the work screens. */
export const AD_ROUTES = ["/", "/services", "/internships", "/careers", "/blog", "/about"];
