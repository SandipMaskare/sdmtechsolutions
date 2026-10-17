import { callFunction } from "@/lib/functions";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export interface NotifyRef { label: string; url: string }

/**
 * Sends a notification email. The send-email function wraps it in the branded layout
 * (logo, mentor, follow-us links, community, submission and LinkedIn instructions).
 */
export const notifyUser = async (opts: {
  email: string;
  name?: string;
  subject: string;
  lines: string[];
  refs?: NotifyRef[];
  link?: { label: string; url: string };
  template?: "intern" | "tasks" | "general";
}) => {
  const hi = `Hello${opts.name ? " " + opts.name.split(" ")[0] : ""},`;
  const refsHtml = opts.refs?.length
    ? `<p style="margin:14px 0 4px"><b>Reference material to help you</b></p><ul style="margin:0 0 8px;padding-left:20px">${opts.refs.map((r) => `<li><a href="${r.url}" style="color:#0f766e">${esc(r.label)}</a></li>`).join("")}</ul>`
    : "";
  const html =
    `<p style="margin:0 0 10px">${esc(hi)}</p>${opts.lines.map((l) => `<p style="margin:6px 0">${esc(l)}</p>`).join("")}${refsHtml}` +
    (opts.link ? `<p style="margin:18px 0 6px"><a href="${opts.link.url}" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;font-weight:600;padding:10px 20px;border-radius:6px">${esc(opts.link.label)}</a></p>` : "");
  const text = [
    hi, "", ...opts.lines,
    ...(opts.refs?.length ? ["", "Reference material:", ...opts.refs.map((r) => `- ${r.label}: ${r.url}`)] : []),
    ...(opts.link ? ["", `${opts.link.label}: ${opts.link.url}`] : []),
  ].join("\n");
  return callFunction("send-email", { to: [opts.email], subject: opts.subject, text, html, template: opts.template || "intern" });
};

export const PORTAL_URL = "https://www.sdmtechsolution.com/intern";
