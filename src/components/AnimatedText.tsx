import { useEffect, useState } from "react";

const reduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Types a phrase, pauses, deletes it and moves to the next one. */
export const Typewriter = ({ phrases, className = "" }: { phrases: string[]; className?: string }) => {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState(reduced() ? phrases[0] : "");
  const [del, setDel] = useState(false);
  useEffect(() => {
    if (reduced()) return;
    const full = phrases[i % phrases.length];
    let t: number;
    if (!del && txt === full) t = window.setTimeout(() => setDel(true), 1600);
    else if (del && txt === "") { setDel(false); setI((v) => v + 1); return; }
    else t = window.setTimeout(() => setTxt(del ? full.slice(0, txt.length - 1) : full.slice(0, txt.length + 1)), del ? 35 : 80);
    return () => window.clearTimeout(t);
  }, [txt, del, i, phrases]);
  return <span className={className} aria-label={phrases[i % phrases.length]}>{txt}<span className="sdm-caret" aria-hidden="true">|</span></span>;
};

/** Reveals text one character at a time with a soft stagger (words never break in the middle). */
export const CharReveal = ({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) => {
  let n = 0;
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((w, wi, arr) => (
        <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
          {Array.from(w).map((c, k) => (
            <span key={k} className="sdm-char" style={{ animationDelay: `${delay + n++ * 28}ms` }}>{c}</span>
          ))}
          {wi < arr.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
};
