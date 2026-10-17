import { planA, type DomainPlan } from "./internshipPlanA";
import { planB } from "./internshipPlanB";

export type { DomainPlan };
export const DOMAINS: DomainPlan[] = [...planA, ...planB];
export const WEEKS = 8;

/** Number of plan weeks an internship covers (from its dates), at most 8. */
export const planWeeks = (start?: string | null, end?: string | null) => {
  if (!start || !end) return WEEKS;
  const d = (new Date(end).getTime() - new Date(start).getTime()) / 86400000;
  if (!(d >= 0)) return WEEKS;
  return Math.min(WEEKS, Math.max(1, Math.round((d + 1) / 7)));
};
export const domainLabels = DOMAINS.map((d) => d.label);

/** Find the plan for a free-text domain/role (e.g. "Python Developer Intern"). */
export const findDomain = (text?: string | null): DomainPlan | undefined => {
  const t = (text || "").toLowerCase().trim();
  if (!t) return undefined;
  return (
    DOMAINS.find((d) => d.label.toLowerCase() === t) ||
    DOMAINS.find((d) => d.match.some((m) => t.includes(m))) 
  );
};

export const splitTask = (s: string) => {
  const [title, ...rest] = s.split(" :: ");
  return { title: title.trim(), description: rest.join(" :: ").trim() };
};
