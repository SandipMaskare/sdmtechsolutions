import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

/** Floating back / forward buttons shown on every page. */
const PageNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const maxIdx = useRef(0);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const i = typeof window.history.state?.idx === "number" ? window.history.state.idx : 0;
    maxIdx.current = Math.max(maxIdx.current, i);
    setIdx(i);
  }, [location]);

  const canBack = idx > 0;
  const canForward = idx < maxIdx.current;

  const base =
    "flex h-10 w-10 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";
  return (
    <nav
      aria-label="Page navigation"
      className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-background/95 p-1 shadow-lg backdrop-blur"
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        disabled={!canBack}
        aria-label="Go back"
        title="Back"
        className={`${base} ${canBack ? "text-foreground hover:bg-accent" : "text-muted-foreground/40 cursor-not-allowed"}`}
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => navigate(1)}
        disabled={!canForward}
        aria-label="Go forward"
        title="Forward"
        className={`${base} ${canForward ? "text-foreground hover:bg-accent" : "text-muted-foreground/40 cursor-not-allowed"}`}
      >
        <ArrowRight className="h-5 w-5" />
      </button>
    </nav>
  );
};

export default PageNav;
