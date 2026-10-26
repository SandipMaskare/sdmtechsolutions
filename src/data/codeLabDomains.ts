import type { Lang } from "@/lib/codeRunner";

export interface LabDomain {
  key: string;            // same key as the task library (data/internshipPlan.ts)
  langs: Lang[];          // languages the practice area can run; empty = no code in this domain
  checklist: string[];    // what the admin checks before approving
  focus: string;          // extra instruction passed to the AI reviewer
  sample?: string;
}

export const LAB_DOMAINS: LabDomain[] = [
  { key: "fullstack", langs: ["javascript", "html"], focus: "Full-stack web work: check frontend, backend/API logic, data handling, authentication, error handling, security (no secrets in code) and whether a README explains how to run it.",
    checklist: ["Runs without errors", "Frontend and backend are connected", "Data is validated and errors are handled", "No passwords or API keys in the code", "README explains setup"] },
  { key: "frontend", langs: ["html", "javascript"], focus: "Front-end work: check semantic HTML, responsive layout, accessibility (alt text, labels, contrast), clean JavaScript/CSS and no console errors.",
    checklist: ["Page renders correctly", "Works on a phone-width screen", "Semantic HTML and alt text", "No console errors", "Matches the task or design"] },
  { key: "python", langs: ["python"], focus: "Python work: check correctness, readable functions, naming (PEP 8), input validation, error handling and whether it uses real logic instead of placeholders.",
    checklist: ["Runs and prints the expected result", "Functions are small and named well", "Handles wrong input", "No hard-coded file paths", "Some tests or sample runs included"] },
  { key: "aiml", langs: ["python"], focus: "AI/ML work: check data loading and cleaning, train/test split, data leakage, the metrics used, reproducibility and whether conclusions match the numbers.",
    checklist: ["Data loading and cleaning shown", "Train/test split is correct", "Metrics are reported and explained", "Results can be reproduced", "No copied notebook without changes"] },
  { key: "datascience", langs: ["python"], focus: "Data work: check cleaning steps, exploratory analysis, chart quality, whether insights are stated clearly and whether the notebook or script runs top to bottom.",
    checklist: ["Data is cleaned", "Charts have titles and labels", "Insights are written in plain words", "Runs top to bottom", "Source of data is named"] },
  { key: "qa", langs: ["javascript", "python"], focus: "QA work: check that test cases are clear (steps, expected result), bug reports are reproducible, and any automation script actually asserts something.",
    checklist: ["Test cases have steps and expected results", "Bug reports are reproducible", "Edge cases are covered", "Automation includes assertions", "Summary of findings is given"] },
  { key: "uiux", langs: [], focus: "UI/UX design work (no code): judge from the description and links. Check user flow, consistency, spacing, colour contrast, readable text and whether a prototype link is given.",
    checklist: ["Link or file opens", "Clear user flow", "Consistent colours and fonts", "Readable contrast and spacing", "Prototype or screens for all steps"] },
  { key: "graphic", langs: [], focus: "Graphic design work (no code): judge from the description and links. Check originality, layout, typography, colour, correct sizes and whether source files or exports are provided.",
    checklist: ["File or link opens", "Original work (not a template copy)", "Good typography and layout", "Correct size and format", "Source file or export included"] },
  { key: "content", langs: [], focus: "Content writing (no code): check originality, grammar, structure with headings, tone, use of sources and keywords, and whether it answers the task brief.",
    checklist: ["Original, not copied", "Grammar and spelling are clean", "Clear headings and structure", "Matches the brief and word count", "Sources named where needed"] },
  { key: "marketing", langs: [], focus: "Digital marketing (no code): check the target audience, channels, content plan, budget or metrics and whether results or next steps are stated.",
    checklist: ["Target audience defined", "Channels and schedule given", "Metrics or goals stated", "Creative or content samples included", "Next steps are clear"] },
  { key: "seo", langs: [], focus: "SEO work (no code): check keyword research, on-page recommendations, technical issues found, competitor notes and whether the report is actionable.",
    checklist: ["Keyword list with intent", "On-page fixes listed", "Technical issues found", "Competitor notes", "Report is actionable"] },
  { key: "itsupport", langs: [], focus: "IT support work (no code): check that troubleshooting steps are clear and in order, commands are correct, screenshots or logs are included and the final fix is explained.",
    checklist: ["Problem clearly described", "Steps are in a sensible order", "Commands or settings are correct", "Screenshots or logs included", "Final fix and prevention explained"] },
];
