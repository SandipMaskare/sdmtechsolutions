import { useState } from "react";
import { BookOpen, ChevronDown, ExternalLink, Lightbulb, ListChecks } from "lucide-react";
import { guideFor } from "@/data/taskGuide";
import { parseRefs } from "@/data/internshipResources";

/** Learning help for one task: how to finish it, tips by topic, and reference links (admin-added first). */
const TaskGuide = ({ title, description, referenceLinks }: { title: string; description?: string | null; referenceLinks?: string | null }) => {
  const [open, setOpen] = useState(false);
  const guide = guideFor(title, description);
  const own = parseRefs(referenceLinks);
  const seen = new Set(own.map((r) => r.url));
  const extra = guide.refs.filter((r) => !seen.has(r.url));

  return (
    <div className="rounded-lg border text-sm">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-2 p-3 text-left font-medium text-foreground" aria-expanded={open}>
        <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Learn &amp; complete this task</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="space-y-4 border-t p-3">
          <div>
            <p className="mb-1.5 flex items-center gap-2 font-medium text-foreground"><ListChecks className="w-4 h-4" /> How to complete it</p>
            <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
              {guide.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>

          {(own.length > 0 || extra.length > 0) && (
            <div>
              <p className="mb-1.5 flex items-center gap-2 font-medium text-foreground"><ExternalLink className="w-4 h-4" /> Reference material</p>
              <ul className="list-disc space-y-0.5 pl-5">
                {[...own, ...extra].map((r, i) => (
                  <li key={i}><a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{r.label}</a></li>
                ))}
              </ul>
            </div>
          )}

          {guide.topics.length > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-2 font-medium text-foreground"><Lightbulb className="w-4 h-4" /> Tips</p>
              <ul className="list-disc space-y-0.5 pl-5 text-muted-foreground">
                {guide.topics.flatMap((t) => t.tips.map((tip, i) => <li key={`${t.name}-${i}`}><span className="font-medium text-foreground">{t.name}:</span> {tip}</li>))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskGuide;
