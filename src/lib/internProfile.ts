import { domainLabels } from "@/data/internshipPlan";

export const INTERN_REQUIRED: { key: string; label: string }[] = [
  { key: "full_name", label: "Full name" },
  { key: "phone", label: "Phone number" },
  { key: "college", label: "College / University" },
  { key: "intern_id", label: "Intern ID (from your offer letter)" },
  { key: "internship_domain", label: "Internship domain" },
  { key: "internship_start", label: "Internship start date" },
  { key: "internship_end", label: "Internship end date" },
  { key: "linkedin_url", label: "LinkedIn profile link" },
  { key: "follows_company", label: "Confirm you follow the SDM Technology LinkedIn page" },
];

export const EMPLOYEE_REQUIRED: { key: string; label: string }[] = [
  { key: "full_name", label: "Full name" },
  { key: "phone", label: "Phone number" },
  { key: "position", label: "Position" },
  { key: "employee_id", label: "Employee ID" },
  { key: "linkedin_url", label: "LinkedIn profile link" },
  { key: "follows_company", label: "Confirm you follow the SDM Technology LinkedIn page" },
];

export const missingFields = (profile: any, role?: string | null) => {
  if (!profile) return [];
  const list = role === "intern" ? INTERN_REQUIRED : role === "employee" ? EMPLOYEE_REQUIRED : [];
  return list.filter((f) => (f.key === "follows_company" ? profile[f.key] !== true : !String(profile[f.key] ?? "").trim()));
};

export const isProfileComplete = (profile: any, role?: string | null) => missingFields(profile, role).length === 0;

export const COMPANY_LINKEDIN = "https://www.linkedin.com/company/sdm-technology-1/";
export const MODES = ["Virtual (Online)", "On-site", "Hybrid"];
export const DOMAIN_OPTIONS = domainLabels;

export const weeksBetween = (start?: string | null, end?: string | null) => {
  if (!start || !end) return null;
  const d = (new Date(end).getTime() - new Date(start).getTime()) / 86400000;
  return d >= 0 ? Math.max(1, Math.round((d + 1) / 7)) : null;
};

export const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export const durationText = (p: any) => {
  if (!p?.internship_start || !p?.internship_end) return "Not set";
  const w = weeksBetween(p.internship_start, p.internship_end);
  return `${fmtDate(p.internship_start)} – ${fmtDate(p.internship_end)}${w ? ` (${w} weeks)` : ""}`;
};

/** Which week (1-based) of the internship we are in today, or null. */
export const currentWeek = (p: any) => {
  if (!p?.internship_start) return null;
  const d = Math.floor((Date.now() - new Date(p.internship_start).getTime()) / 86400000);
  if (d < 0) return 0;
  return Math.floor(d / 7) + 1;
};
