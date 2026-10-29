/** Friendly animated robot face used for the Kabir chat assistant. */
const KabirAvatar = ({ size = 40, pulse = false }: { size?: number; pulse?: boolean }) => (
  <span className={`relative inline-flex shrink-0 ${pulse ? "sdm-kabir-bob" : ""}`} style={{ width: size, height: size }} aria-hidden="true">
    <svg viewBox="0 0 48 48" width={size} height={size}>
      <defs><linearGradient id="kb-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#14b8a6" /><stop offset="1" stopColor="#6366f1" /></linearGradient></defs>
      <circle cx="24" cy="24" r="23" fill="url(#kb-g)" />
      <line x1="24" y1="6" x2="24" y2="11" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="5" r="2.4" fill="#fde047" className="sdm-kabir-ant" />
      <rect x="10" y="12" width="28" height="22" rx="9" fill="#fff" />
      <g className="sdm-kabir-eyes"><ellipse cx="18.5" cy="22" rx="3" ry="3.6" fill="#0f172a" /><ellipse cx="29.5" cy="22" rx="3" ry="3.6" fill="#0f172a" /></g>
      <path d="M18 28.5c2 2.4 10 2.4 12 0" stroke="#0f766e" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="13.5" cy="27" r="2" fill="#fda4af" opacity=".7" /><circle cx="34.5" cy="27" r="2" fill="#fda4af" opacity=".7" />
    </svg>
  </span>
);
export default KabirAvatar;
