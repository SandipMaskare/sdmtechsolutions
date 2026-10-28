import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SiteExtras from "@/components/SiteExtras";

const PRIVATE = ["/admin", "/crm", "/intern", "/employee", "/app", "/auth", "/enter", "/reset-password", "/forgot", "/profile", "/account"];

/** Fades each page in and reveals sections as they scroll into view (public pages only). */
const MotionLayer = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const isPublic = !PRIVATE.some((p) => pathname === p || pathname.startsWith(p + "/"));

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("sdm-public", isPublic);
    if (!isPublic || typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("sdm-reveal-ready");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("sdm-in"); io.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll("#root section, #root [data-reveal]").forEach((el, i) => {
        if (seen.has(el)) return;
        seen.add(el);
        (el as HTMLElement).style.setProperty("--sdm-d", `${Math.min(i, 3) * 60}ms`);
        el.classList.add("sdm-reveal");
        io.observe(el);
      });
    };
    root.classList.add("sdm-reveal-ready");
    scan();
    const timers = [250, 800, 2000].map((t) => window.setTimeout(scan, t));
    // safety net: never leave content hidden
    const failsafe = window.setTimeout(() => document.querySelectorAll(".sdm-reveal").forEach((el) => el.classList.add("sdm-in")), 6000);
    return () => { io.disconnect(); timers.forEach(clearTimeout); clearTimeout(failsafe); };
  }, [pathname, isPublic]);

  return <>{isPublic && <SiteExtras />}<div key={pathname} className="sdm-page">{children}</div></>;
};

export default MotionLayer;
