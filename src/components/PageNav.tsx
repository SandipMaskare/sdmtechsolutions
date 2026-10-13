import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  /** Pin to the top-left corner (for pages that have no header). */
  floating?: boolean;
  className?: string;
}

/** Back / forward arrows, like a browser. Lives in each page header. */
const PageNav = ({ floating = false, className = "" }: Props) => {
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

  const btn = (enabled: boolean) =>
    `flex h-9 w-9 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
      enabled ? "text-foreground hover:bg-accent" : "text-muted-foreground/40 cursor-not-allowed"
    }`;

  return (
    <nav
      aria-label="Page navigation"
      className={`${floating ? "fixed left-3 top-3 z-40 rounded-full border border-border bg-background/95 shadow backdrop-blur" : ""} flex items-center gap-0.5 ${className}`}
    >
      <button type="button" onClick={() => navigate(-1)} disabled={!canBack} aria-label="Go back" title="Back" className={btn(canBack)}>
        <ArrowLeft className="h-5 w-5" />
      </button>
      <button type="button" onClick={() => navigate(1)} disabled={!canForward} aria-label="Go forward" title="Forward" className={btn(canForward)}>
        <ArrowRight className="h-5 w-5" />
      </button>
    </nav>
  );
};

export default PageNav;
