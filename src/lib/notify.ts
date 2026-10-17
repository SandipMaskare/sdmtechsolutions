import { callFunction } from "@/lib/functions";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Sends a short branded notification email through the send-email function. */
export const notifyUser = async (opts: { email: string; name?: string; subject: string; lines: string[]; link?: { label: string; url: string } }) => {
  const hi = `Hello${opts.name ? " " + opts.name.split(" ")[0] : ""},`;
  const text = [hi, "", ...opts.lines, "", opts.link ? `${opts.link.label}: ${opts.link.url}` : "", "", "Regards,", "SDM Technology"].join("\n");
  const html =
    `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#111">` +
    `<p>${esc(hi)}</p>${opts.lines.map((l) => `<p style="margin:6px 0">${esc(l)}</p>`).join("")}` +
    (opts.link ? `<p style="margin:16px 0"><a href="${opts.link.url}" style="background:#1d4ed8;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">${esc(opts.link.label)}</a></p>` : "") +
    `<p>Regards,<br>SDM Technology</p></div>`;
  return callFunction("send-email", { to: [opts.email], subject: opts.subject, text, html });
};

export const PORTAL_URL = "https://www.sdmtechsolution.com/intern";
