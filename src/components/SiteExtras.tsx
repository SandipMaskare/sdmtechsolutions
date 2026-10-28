import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Thin colour progress bar at the top and a back-to-top button (public pages only). */
const SiteExtras = () => {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-1 z-[70] pointer-events-none" aria-hidden="true">
        <div className="h-full sdm-progress" style={{ width: `${p * 100}%` }} />
      </div>
      <button
        type="button" aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed left-4 bottom-5 z-40 h-11 w-11 rounded-full text-white shadow-lg flex items-center justify-center sdm-btt ${p > 0.12 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </>
  );
};
export default SiteExtras;
