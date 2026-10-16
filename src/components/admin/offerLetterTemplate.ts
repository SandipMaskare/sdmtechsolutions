import bg from "@/assets/offerletter/bg.jpg";
import bg2 from "@/assets/offerletter/bg2.jpg";
import signature from "@/assets/offerletter/signature.png";

export interface OfferItem {
  id: string;
  fee: string;
  name: string;
  email: string;
  role: string;
  start: string;
  end: string;
  ldate: string;
  days: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const fmtDate = (v: string) => {
  v = String(v || "").trim();
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}` : v;
};
const esc = (s: string) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

export const OFFER_FONTS =
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Tinos:wght@400;700&family=Mrs+Saint+Delafield&family=Open+Sans:wght@400&display=swap";

export const OFFER_CSS = `
.ol-page{position:relative;width:744px;height:1052px;background:#fff;overflow:hidden;color:#000;font-family:Tinos,'Times New Roman',serif}
.ol-page *{position:absolute;margin:0}
.ol-page b,.ol-page .ol-body p{position:static}
.ol-bg{left:0;top:0;width:744px;height:1052px}
.ol-id{right:87px;top:204px;font:400 15px 'Open Sans',Arial,sans-serif;white-space:nowrap}
.ol-date{right:87px;top:183px;font:400 15px 'Open Sans',Arial,sans-serif;white-space:nowrap}
.ol-body{left:67px;width:618px;top:238px;font-size:19.3px;line-height:25.2px;text-align:justify}
.ol-body p{margin:0 0 22px}
.ol-sig{left:64px;top:796px;width:172px}
.ol-sgn{left:67px;top:846px;font:400 15.5px/20.5px 'Open Sans',Arial,sans-serif;width:230px}
.ol-contact{left:75px;width:538px;top:947px;text-align:center;font:400 12px 'Open Sans',Arial,sans-serif;white-space:nowrap}
.ol-sch{left:67px;width:618px;font-family:Tinos,'Times New Roman',serif;text-align:justify;font-size:12.3px;line-height:15.6px}
.ol-sch p{margin:0 0 5px;position:static}
.ol-sch-t{left:0;width:744px;top:200px;text-align:center;font-weight:700;font-size:23px}
.ol-sch-s{left:67px;width:618px;top:232px;text-align:center;font:400 11px 'Open Sans',Arial,sans-serif;color:#333}
.ol-acc{left:67px;width:618px;font:400 11.5px/15px 'Open Sans',Arial,sans-serif}
.ol-soc{font:400 9px 'Open Sans',Arial,sans-serif;white-space:nowrap;left:18px;top:1px}
.ol-ico{left:0;top:0;width:12px;height:12px}
.ol-line{width:280px;height:13px}
`;

const FB = '<svg class="ol-ico" viewBox="0 0 24 24"><path fill="#1877f2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z"/></svg>';
const LI = '<svg class="ol-ico" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#0a66c2"/><path fill="#fff" d="M6.9 9.5H4.2V19h2.7zM5.5 5.2a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zM19.8 13.7c0-2.6-1.4-4.4-3.7-4.4-1.2 0-2 .6-2.4 1.2V9.5h-2.7V19h2.7v-5.2c0-1.4.7-2.2 1.8-2.2s1.6.8 1.6 2.2V19h2.7z"/></svg>';
const IG = '<svg class="ol-ico" viewBox="0 0 24 24" fill="none" stroke="#c13584" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#c13584"/></svg>';
const WEB = '<svg class="ol-ico" viewBox="0 0 24 24" fill="none" stroke="#0b7a8f" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>';

export function letterHtml(it: OfferItem): string {
  const role = esc(it.role), name = esc(it.name), s = esc(fmtDate(it.start)), e = esc(fmtDate(it.end));
  const d = esc(fmtDate(it.ldate)), days = esc(it.days), id = esc(it.id);
  const line = (top: number, icon: string, text: string) =>
    `<div class="ol-line" style="left:12px;top:${top}px">${icon}<span class="ol-soc">${text}</span></div>`;
  return `<div class="ol-page"><img class="ol-bg" src="${bg}">
<div class="ol-id">Intern ID: <b>${id}</b></div><div class="ol-date">Date: ${d}</div>
<div class="ol-body"><p>Dear <b>${name}</b>,</p>
<p>We are pleased to offer you an internship with SDM Technology Pvt. Ltd. as <b>${role}</b>. This is an educational internship, and the mode of the internship is <b>Virtual (Online)</b>. Our goal is for you to learn more about Software Development. As we discussed, your internship is expected to last from <b>${s}</b> to <b>${e}</b>. However, at the sole discretion of the Company, the duration of the internship may be extended or shortened with or without advance notice. As an intern, you will not be a Company employee. Therefore, you will not receive a salary, wages, or other compensation. In addition, you will not be eligible for any benefits that the company offers its employees. You understand that participation in the internship program is not an offer of employment, and successful completion of the internship does not entitle you to employment with the company. The detailed terms and conditions of your internship are incorporated under Schedule A, which can be amended with due notice. Kindly login and accept this letter along with the accepting terms of conditions given in Schedule A, to indicate your acceptance, within ${days} days from the receipt of this letter.</p>
<p>We look forward to welcoming you and wish you a successful and rewarding career with us.</p></div>
<img class="ol-sig" src="${signature}">
<div class="ol-sgn">Sincerely,<br>Founder &amp; CEO<br>SDM Technology<br>Pvt. Ltd.</div>
<div class="ol-contact">For Any Query Contact :- sdmtechnologies.pvtltd@gmail.com</div>
${line(985, FB, "https://www.facebook.com/profile.php?id=61554595474154")}
${line(1000, IG, "https://www.instagram.com/s_d_m_technology/")}
${line(1015, LI, "https://www.linkedin.com/company/sdm-technology-1/")}
${line(1030, WEB, "https://sdmtechsolution.com")}
</div>`;
}

/** Renders the offer letter + Schedule A to a 2-page A4 PDF (libraries load lazily so the admin page stays light). */
export async function letterToPdf(it: OfferItem): Promise<Blob> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
  await (document as any).fonts?.ready;
  const holder = document.createElement("div");
  holder.style.cssText = "position:fixed;left:-5000px;top:0";
  holder.innerHTML = `<style>${OFFER_CSS}</style>${letterHtml(it)}${scheduleHtml(it)}`;
  document.body.appendChild(holder);
  try {
    const imgs = Array.from(holder.querySelectorAll("img"));
    await Promise.all(imgs.map((m) => (m.complete ? 1 : new Promise((r) => { m.onload = r; m.onerror = r; }))));
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const pages = Array.from(holder.querySelectorAll(".ol-page")) as HTMLElement[];
    for (let i = 0; i < pages.length; i++) {
      const cv = await html2canvas(pages[i], { scale: 2.5, backgroundColor: "#ffffff", useCORS: true });
      if (i > 0) pdf.addPage();
      pdf.addImage(cv.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 210, 297);
    }
    pdf.setProperties({ title: `Internship Offer Letter - ${it.name}`, author: "SDM Technology" });
    return pdf.output("blob");
  } finally {
    holder.remove();
  }
}

export const pdfName = (it: OfferItem) => `Offer Letter - ${it.name.replace(/[\\/:*?"<>|]/g, "").trim()}.pdf`;

export async function blobToBase64(b: Blob): Promise<string> {
  const buf = new Uint8Array(await b.arrayBuffer());
  let s = "";
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}

export const CONTACT_EMAIL = "sdmtechnologies.pvtltd@gmail.com";

const RUPEE_WORDS: Record<string, string> = { "149": "One Hundred Forty-Nine", "199": "One Hundred Ninety-Nine", "99": "Ninety-Nine", "249": "Two Hundred Forty-Nine", "299": "Two Hundred Ninety-Nine" };

/** Page 2 – Schedule A (terms and conditions). */
export function scheduleHtml(it: OfferItem): string {
  const name = esc(it.name), id = esc(it.id), role = esc(it.role), s = esc(fmtDate(it.start)), e = esc(fmtDate(it.end)), days = esc(it.days);
  const fee = esc(String(it.fee || "149").trim());
  const feeWords = RUPEE_WORDS[fee] ? ` (Rupees ${RUPEE_WORDS[fee]} only)` : "";
  const line = (top: number, icon: string, text: string) =>
    `<div class="ol-line" style="left:12px;top:${top}px">${icon}<span class="ol-soc">${text}</span></div>`;
  const clause = (n: number, t: string, x: string) => `<p><b>${n}. ${t}.</b> ${x}</p>`;
  return `<div class="ol-page"><img class="ol-bg" src="${bg2}">
<div class="ol-sch-t">Schedule A</div>
<div class="ol-sch-s">Terms and Conditions of Internship &nbsp;·&nbsp; ${name} &nbsp;·&nbsp; Intern ID ${id} &nbsp;·&nbsp; ${role}</div>
<div class="ol-sch" style="top:262px">
${clause(1, "Nature of Internship", "This is an educational and training-based internship with SDM Technology Pvt. Ltd. (&ldquo;the Company&rdquo;). The Intern is not an employee of the Company, and no salary, stipend, wages or employee benefits are payable. The internship does not guarantee any job offer. The mode of the internship is &ldquo;Virtual (Online)&rdquo;, so no physical attendance is required unless the Company informs otherwise.")}
${clause(2, "Duration", "The internship runs for the period stated in the Offer Letter. The Company may extend, shorten or end it at its sole discretion, with or without advance notice.")}
${clause(3, "Tasks and Responsibilities", "The Intern shall complete all assigned tasks and projects honestly, on their own, and within the given deadlines, and submit them through the channel shared by the Company. The Intern is expected to respond promptly to Company communication.")}
${clause(4, "Mandatory Completion", "Successfully completing the first month of the internship and all assigned tasks is mandatory. Incomplete, copied or plagiarised work will not be accepted.")}
${clause(5, "Internship Completion Certificate", "After successful submission and verification of all assigned tasks, the Intern becomes eligible for the Internship Completion Certificate, which confirms successful completion of the internship. The Company&rsquo;s decision on verification is final.")}
${clause(6, "Document Processing Fee", `A one-time administrative fee of <b>&#8377;${fee}${feeWords}</b> is payable towards documentation processing (preparation and issue of the certificate and related documents). It is not a salary deduction, security deposit or training fee, and is non-refundable once processing has begun. Please pay only through the payment details sent officially by the Company from ${CONTACT_EMAIL}; the Company is not responsible for payments made through any other channel.`)}
${clause(7, "Accuracy of Information", "The details given in the registration form are used exactly as provided in the Offer Letter and Certificate, so the Intern must give correct information. Changes after issue may not be possible. Multiple or duplicate applications for the same domain are treated as invalid.")}
${clause(8, "Confidentiality and Intellectual Property", "The Intern shall keep all Company and client information confidential and shall not share, publish or reuse project material, code or data without written permission. Work done for the Company during the internship belongs to the Company. The Intern may mention the internship in a r&eacute;sum&eacute; or profile without disclosing confidential material.")}
${clause(9, "Code of Conduct", "The Intern shall behave professionally and respectfully. Misconduct, dishonesty, plagiarism, or misuse of the Company&rsquo;s name, logo or documents may lead to immediate termination and withholding of the certificate.")}
${clause(10, "Termination", "The Intern may leave the internship by giving prior written notice by email. The Company may end the internship at any time for non-performance or misconduct.")}
${clause(11, "Data Privacy", "Personal details are used only for internship administration, issuing certificates and communication, and are not sold or shared with third parties for marketing.")}
${clause(12, "Governing Law", "These terms are governed by the laws of India.")}
</div>
<div class="ol-acc" style="top:826px"><b>Acceptance.</b> By logging in and accepting the Offer Letter within ${days} days of receiving it, the Intern confirms that they have read and agreed to this Schedule A.</div>
<div class="ol-contact">For Any Query Contact :- ${CONTACT_EMAIL}</div>
${line(985, FB, "https://www.facebook.com/profile.php?id=61554595474154")}
${line(1000, IG, "https://www.instagram.com/s_d_m_technology/")}
${line(1015, LI, "https://www.linkedin.com/company/sdm-technology-1/")}
${line(1030, WEB, "https://sdmtechsolution.com")}
</div>`;
}
