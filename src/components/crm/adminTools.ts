import { lazy, ComponentType, LazyExoticComponent } from "react";
import { Briefcase, ClipboardList, Users, Layers, Settings, Star, MessageSquare, Inbox, Mail, MessagesSquare, FileSignature, FileText, BarChart3, Code2, Award, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AdminTool { key: string; label: string; to: string; icon: LucideIcon; group: "People" | "Hiring" | "Communication" | "Letters" | "Website"; Comp: LazyExoticComponent<ComponentType<any>> }

/** Every tool of the old Admin Panel, available as its own page inside the dashboard. */
export const ADMIN_TOOLS: AdminTool[] = [
  { key: "applications", label: "Job Applications", to: "/crm/applications", icon: ClipboardList, group: "Hiring", Comp: lazy(() => import("@/components/admin/ApplicationsManager")) },
  { key: "jobs", label: "Jobs & Internships", to: "/crm/manage/jobs", icon: Briefcase, group: "Hiring", Comp: lazy(() => import("@/components/admin/JobsManager")) },
  { key: "people", label: "All People", to: "/crm/manage/people", icon: Users, group: "People", Comp: lazy(() => import("@/components/admin/PeopleManager")) },
  { key: "batches", label: "Batches & Interns", to: "/crm/batches", icon: Layers, group: "People", Comp: lazy(() => import("@/components/admin/BatchesManager")) },
  { key: "messages", label: "Contact Messages", to: "/crm/manage/messages", icon: MessageSquare, group: "Communication", Comp: lazy(() => import("@/components/admin/ContactSubmissions")) },
  { key: "inbox", label: "Mail Inbox", to: "/crm/manage/inbox", icon: Inbox, group: "Communication", Comp: lazy(() => import("@/components/admin/MailInbox")) },
  { key: "email", label: "Email Center", to: "/crm/manage/email", icon: Mail, group: "Communication", Comp: lazy(() => import("@/components/admin/EmailCenter")) },
  { key: "chat", label: "Chat Inbox (Kabir)", to: "/crm/manage/chat", icon: MessagesSquare, group: "Communication", Comp: lazy(() => import("@/components/admin/ChatInbox")) },
  { key: "offers", label: "Offer Letters", to: "/crm/manage/offers", icon: FileSignature, group: "Letters", Comp: lazy(() => import("@/components/admin/OfferLetters")) },
  { key: "letters", label: "Intern Letters", to: "/crm/manage/letters", icon: UserCheck, group: "Letters", Comp: lazy(() => import("@/components/admin/InternLettersManager")) },
  { key: "completion", label: "Completion Letters", to: "/crm/manage/completion", icon: Award, group: "Letters", Comp: lazy(() => import("@/components/admin/CompletionLetters")) },
  { key: "codelab", label: "Code Lab", to: "/crm/manage/codelab", icon: Code2, group: "Letters", Comp: lazy(() => import("@/components/admin/CodeLab")) },
  { key: "services", label: "Services", to: "/crm/manage/services", icon: Settings, group: "Website", Comp: lazy(() => import("@/components/admin/ServicesManager")) },
  { key: "testimonials", label: "Testimonials", to: "/crm/manage/testimonials", icon: Star, group: "Website", Comp: lazy(() => import("@/components/admin/TestimonialsManager")) },
  { key: "content", label: "Website Content", to: "/crm/manage/content", icon: FileText, group: "Website", Comp: lazy(() => import("@/components/admin/ContentManager")) },
  { key: "analytics", label: "Analytics Settings", to: "/crm/manage/analytics", icon: BarChart3, group: "Website", Comp: lazy(() => import("@/components/admin/AnalyticsSettings")) },
];
export const toolByKey = (k?: string) => ADMIN_TOOLS.find((t) => t.key === k);
