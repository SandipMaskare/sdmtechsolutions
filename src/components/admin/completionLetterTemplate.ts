import bg3 from "@/assets/offerletter/bg3.jpg";
import signature from "@/assets/offerletter/signature.png";
import stamp from "@/assets/offerletter/stamp.png";
import iso from "@/assets/offerletter/iso.png";
import msme from "@/assets/offerletter/msme.png";
import { OFFER_CSS, fmtDate, CONTACT_EMAIL } from "./offerLetterTemplate";

export { OFFER_CSS as COMPLETION_CSS };

export interface CompletionItem {
  id: string;
  name: string;
  email: string;
  college: string;
  course: string;
  role: string;
  start: string;
  end: string;
  ldate: string;
  gender: "he" | "she" | "they";
}

const esc = (s: string) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

const PRON = {
  he: { sub: "he", Sub: "He", obj: "him", pos: "his", Pos: "His", has: "has" },
  she: { sub: "she", Sub: "She", obj: "her", pos: "her", Pos: "Her", has: "has" },
  they: { sub: "they", Sub: "They", obj: "them", pos: "their", Pos: "Their", has: "have" },
} as const;

export const domainOf = (role: string) => role.replace(/\s+intern$/i, "").trim() || role;

const FB = '<svg class="ol-ico" viewBox="0 0 24 24"><path fill="#1877f2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z"/></svg>';
const LI = '<svg class="ol-ico" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#0a66c2"/><path fill="#fff" d="M6.9 9.5H4.2V19h2.7zM5.5 5.2a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zM19.8 13.7c0-2.6-1.4-4.4-3.7-4.4-1.2 0-2 .6-2.4 1.2V9.5h-2.7V19h2.7v-5.2c0-1.4.7-2.2 1.8-2.2s1.6.8 1.6 2.2V19h2.7z"/></svg>';
const IG = '<svg class="ol-ico" viewBox="0 0 24 24" fill="none" stroke="#c13584" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#c13584"/></svg>';
const WEB = '<svg class="ol-ico" viewBox="0 0 24 24" fill="none" stroke="#0b7a8f" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>';

export function completionHtml(it: CompletionItem): string {
  const p = PRON[it.gender] || PRON.they;
  const name = esc(it.name), id = esc(it.id), role = esc(it.role), dom = esc(domainOf(it.role));
  const s = esc(fmtDate(it.start)), e = esc(fmtDate(it.end)), d = esc(fmtDate(it.ldate));
  const study = it.course && it.college ? `currently pursuing a <b>${esc(it.course)}</b> from <b>${esc(it.college)}</b>, ` : it.college ? `a student of <b>${esc(it.college)}</b>, ` : "";
  const line = (top: number, icon: string, text: string) => `<div class="ol-line" style="left:12px;top:${top}px">${icon}<span class="ol-soc">${text}</span></div>`;
  return `<div class="ol-page"><img class="ol-bg" src="${bg3}">
<div class="ol-date">Date: ${d}</div>
<div style="left:0;width:744px;top:212px;text-align:center;font:700 23px Tinos,'Times New Roman',serif">Internship Completion Letter</div>
<div class="ol-body" style="top:262px;font-size:18.6px;line-height:24.4px">
<p>This is to certify that <b>${name}</b>, (Intern ID: ${id}) ${study}was working as a <b>${role}</b> with SDM Technology Pvt. Ltd. from <b>${s} to ${e}</b>.</p>
<p>During this period, ${p.sub} ${p.has} served as a <b>${role}</b> and ${p.has} displayed remarkable dedication, sincerity, and a strong desire to learn. ${p.Sub} ${p.has} exhibited exceptional coordination skills and effective communication abilities. Moreover, ${p.pos} attention to detail has been truly impressive.</p>
<p>${p.Sub} ${p.has} consistently approached new assignments and challenges with enthusiasm, showcasing ${p.pos} passion for <b>${dom}</b>. ${p.Pos} commitment and willingness to acquire new knowledge and skills have been evident throughout ${p.pos} internship.</p>
<p>We extend our best wishes to <b>${name}</b> for a successful future, and we have no doubt that ${p.sub} will continue to excel in the field of <b>${dom}</b>.</p></div>
<img class="ol-sig" src="${signature}" style="top:796px">
<div class="ol-sgn" style="top:846px">Sincerely,<br>Authorized Signatory<br>Founder &amp; CEO<br>SDM Technology<br>Pvt. Ltd.</div>
<img src="${stamp}" style="left:232px;top:822px;width:104px;height:104px">
<img src="${iso}" style="left:392px;top:822px;width:106px;height:106px">
<img src="${msme}" style="left:526px;top:792px;width:142px">
<div class="ol-contact">For Any Query Contact :- ${CONTACT_EMAIL}</div>
${line(985, FB, "https://www.facebook.com/profile.php?id=61554595474154")}
${line(1000, IG, "https://www.instagram.com/s_d_m_technology/")}
${line(1015, LI, "https://www.linkedin.com/company/sdm-technology-1/")}
${line(1030, WEB, "https://sdmtechsolution.com")}
</div>`;
}

export async function completionToPdf(it: CompletionItem): Promise<Blob> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
  await (document as any).fonts?.ready;
  const holder = document.createElement("div");
  holder.style.cssText = "position:fixed;left:-5000px;top:0";
  holder.innerHTML = `<style>${OFFER_CSS}</style>${completionHtml(it)}`;
  document.body.appendChild(holder);
  try {
    const imgs = Array.from(holder.querySelectorAll("img"));
    await Promise.all(imgs.map((m) => (m.complete ? 1 : new Promise((r) => { m.onload = r; m.onerror = r; }))));
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const cv = await html2canvas(holder.querySelector(".ol-page") as HTMLElement, { scale: 2.5, backgroundColor: "#ffffff", useCORS: true });
    pdf.addImage(cv.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 210, 297);
    pdf.setProperties({ title: `Internship Completion Letter - ${it.name}`, author: "SDM Technology" });
    return pdf.output("blob");
  } finally {
    holder.remove();
  }
}

export const completionPdfName = (it: CompletionItem) => `Completion Letter - ${it.name.replace(/[\\/:*?"<>|]/g, "").trim()}.pdf`;
