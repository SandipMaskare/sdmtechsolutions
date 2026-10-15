import logo from "@/assets/offer/logo.png";
import stamp from "@/assets/offer/stamp.png";
import msme from "@/assets/offer/msme.png";
import insta from "@/assets/offer/instagram.png";

export interface OfferItem {
  name: string;
  email: string;
  role: string;
  start: string;
  end: string;
  ldate: string;
  days: string;
  signer: string;
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
.ol-dec{left:0;top:0;width:744px;height:1052px}
.ol-brand{left:176px;top:96px;font:800 38px/1 Montserrat,Arial,sans-serif;color:#3fd4aa;letter-spacing:.5px;white-space:nowrap}
.ol-tag{left:176px;top:149px;font:700 19px/1 Montserrat,Arial,sans-serif;color:#0d46b0;letter-spacing:5px;white-space:nowrap}
.ol-logo{left:74px;top:88px;width:84px;height:104px;object-fit:contain}
.ol-date{right:88px;top:182px;font:400 15px 'Open Sans',Arial,sans-serif;white-space:nowrap}
.ol-title{left:0;width:744px;top:198px;text-align:center;font-weight:700;font-size:27px}
.ol-body{left:67px;width:618px;top:238px;font-size:19.3px;line-height:25.2px;text-align:justify}
.ol-body p{margin:0 0 22px}
.ol-sig{left:66px;top:792px;font:400 33px/1 'Mrs Saint Delafield',cursive;color:#222;white-space:nowrap}
.ol-sgn{left:67px;top:842px;font:400 17px/21px 'Open Sans',Arial,sans-serif;width:260px}
.ol-stamp{left:308px;top:786px;width:116px;height:116px}
.ol-msme{left:496px;top:790px;width:144px;height:114px;object-fit:contain}
.ol-contact{left:0;width:744px;top:947px;text-align:center;font:400 12px 'Open Sans',Arial,sans-serif;white-space:nowrap}
.ol-hr1{left:132px;top:72px;width:538px;height:2px;background:#111}
.ol-hr2{left:75px;top:971px;width:538px;height:2px;background:#111}
.ol-soc{font:400 9.5px 'Open Sans',Arial,sans-serif;white-space:nowrap;left:24px;top:2px}
.ol-ico{left:0;top:0;width:16px;height:16px}
.ol-line{width:330px;height:16px}
`;

const FB = '<svg class="ol-ico" viewBox="0 0 24 24"><path fill="#1877f2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z"/></svg>';
const LI = '<svg class="ol-ico" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#0a66c2"/><path fill="#fff" d="M6.9 9.5H4.2V19h2.7zM5.5 5.2a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zM19.8 13.7c0-2.6-1.4-4.4-3.7-4.4-1.2 0-2 .6-2.4 1.2V9.5h-2.7V19h2.7v-5.2c0-1.4.7-2.2 1.8-2.2s1.6.8 1.6 2.2V19h2.7z"/></svg>';
const WEB = '<svg class="ol-ico" viewBox="0 0 24 24" fill="none" stroke="#0b7a8f" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>';

const DEC = `<svg class="ol-dec" viewBox="0 0 744 1052"><defs>
<linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a9aae"/><stop offset=".55" stop-color="#0b5fc0"/><stop offset="1" stop-color="#0a45a8"/></linearGradient>
<linearGradient id="g2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2fb4cf"/><stop offset="1" stop-color="#6ee0e8"/></linearGradient>
<linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6dd36f"/><stop offset="1" stop-color="#3fc0a0"/></linearGradient></defs>
<polygon points="24,8 414,8 442,30 56,30" fill="url(#g2)"/>
<polygon points="8,30 56,30 56,270 8,292" fill="url(#g1)"/><polygon points="8,0 24,8 56,30 8,30" fill="#17a2b7"/>
<polygon points="24,258 56,230 56,300 24,330" fill="#79d95a"/>
<polygon points="718,748 744,728 744,1052 718,1052" fill="url(#g1)"/><polygon points="696,748 718,780 718,860 696,830" fill="#79d95a"/>
<polygon points="318,1024 744,1024 744,1052 290,1052" fill="url(#g2)"/><polygon points="110,1034 330,1034 360,1052 130,1052" fill="url(#g3)" opacity=".7"/>
</svg>`;

export function letterHtml(it: OfferItem): string {
  const role = esc(it.role), name = esc(it.name), s = esc(fmtDate(it.start)), e = esc(fmtDate(it.end));
  const d = esc(fmtDate(it.ldate)), days = esc(it.days), signer = esc(it.signer);
  return `<div class="ol-page">${DEC}
<div class="ol-hr1"></div><img class="ol-logo" src="${logo}"><div class="ol-brand">SDM TECHNOLOGY</div><div class="ol-tag">FOllow Your Passion</div>
<div class="ol-date">Date: ${d}</div><div class="ol-title">Internship Offer Letter</div>
<div class="ol-body"><p>Dear <b>${name}</b>,</p>
<p>We are pleased to offer you an internship with SDM Technology Pvt. Ltd. as <b>${role}</b>. This is an educational internship. Our goal is for you to learn more about Software Development. As we discussed, your internship is expected to last from <b>${s}</b> to <b>${e}</b>. However, at the sole discretion of the Company, the duration of the internship may be extended or shortened with or without advance notice. As an intern, you will not be a Company employee. Therefore, you will not receive a salary, wages, or other compensation. In addition, you will not be eligible for any benefits that the company offers its employees. You understand that participation in the internship program is not an offer of employment, and successful completion of the internship does not entitle you to employment with the company. The detailed terms and conditions of your internship are incorporated under Schedule A, which can be amended with due notice. Kindly login and accept this letter along with the accepting terms of conditions given in Schedule A, to indicate your acceptance, within ${days} days from the receipt of this letter.</p>
<p>We look forward to welcoming you and wish you a successful and rewarding career with us.</p></div>
<div class="ol-sig">${signer}</div>
<div class="ol-sgn">Sincerely,<br>Founder &amp; CEO<br>SDM Technology<br>Pvt. Ltd.</div>
<img class="ol-stamp" src="${stamp}"><img class="ol-msme" src="${msme}">
<div class="ol-contact">For Any Query Contact :- sdmtechnology.pvtltd@gmail.com</div><div class="ol-hr2"></div>
<div class="ol-line" style="left:12px;top:1000px">${FB}<span class="ol-soc">https://www.facebook.com/profile.php?id=61554595474154</span></div>
<div class="ol-line" style="left:12px;top:1024px"><img class="ol-ico" src="${insta}"><span class="ol-soc">https://www.instagram.com/s_d_m_technology/</span></div>
<div class="ol-line" style="left:372px;top:1000px">${LI}<span class="ol-soc">https://www.linkedin.com/company/sdm-technology-1/</span></div>
<div class="ol-line" style="left:372px;top:1024px">${WEB}<span class="ol-soc">https://sdmtechsolution.com</span></div>
</div>`;
}

/** Renders one letter to an A4 PDF (loaded lazily so the admin page stays light). */
export async function letterToPdf(it: OfferItem): Promise<Blob> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
  await (document as any).fonts?.ready;
  const holder = document.createElement("div");
  holder.style.cssText = "position:fixed;left:-5000px;top:0";
  holder.innerHTML = `<style>${OFFER_CSS}</style>${letterHtml(it)}`;
  document.body.appendChild(holder);
  try {
    const imgs = Array.from(holder.querySelectorAll("img"));
    await Promise.all(imgs.map((m) => (m.complete ? 1 : new Promise((r) => { m.onload = r; m.onerror = r; }))));
    const node = holder.querySelector(".ol-page") as HTMLElement;
    const cv = await html2canvas(node, { scale: 2.5, backgroundColor: "#ffffff", useCORS: true });
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    pdf.addImage(cv.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 210, 297);
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
