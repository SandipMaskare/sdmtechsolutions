/** Original animated SVG scenes used on the public pages. */
export const DevScene = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 520 400" className={className} role="img" aria-label="Animated illustration of a developer window with code and floating icons">
    <defs>
      <linearGradient id="ds-a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#14b8a6" /><stop offset="1" stopColor="#6366f1" /></linearGradient>
      <linearGradient id="ds-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0f172a" /><stop offset="1" stopColor="#1e293b" /></linearGradient>
    </defs>
    <ellipse cx="260" cy="360" rx="190" ry="16" fill="#000" opacity=".18" />
    <g className="sdm-float-slow">
      <rect x="70" y="60" width="380" height="260" rx="18" fill="url(#ds-b)" stroke="url(#ds-a)" strokeWidth="2" />
      <rect x="70" y="60" width="380" height="34" rx="18" fill="#0b1220" />
      <circle cx="94" cy="77" r="6" fill="#f87171" /><circle cx="114" cy="77" r="6" fill="#fbbf24" /><circle cx="134" cy="77" r="6" fill="#34d399" />
      {[0, 1, 2, 3, 4, 5, 6].map((r) => (
        <rect key={r} x={96 + (r % 3) * 18} y={116 + r * 28} height="9" rx="4.5" fill={["#5eead4", "#a5b4fc", "#fcd34d", "#f9a8d4", "#7dd3fc", "#86efac", "#c4b5fd"][r]} className="sdm-type-line" style={{ animationDelay: `${r * 0.55}s`, ["--w" as any]: `${150 + ((r * 53) % 150)}px` }} />
      ))}
      <rect x="360" y="116" width="72" height="9" rx="4.5" fill="#fff" opacity=".12" />
      <rect x="360" y="144" width="52" height="9" rx="4.5" fill="#fff" opacity=".12" />
      <rect x="346" y="196" width="86" height="96" rx="12" fill="#fff" opacity=".07" />
      <circle cx="389" cy="232" r="20" fill="none" stroke="#5eead4" strokeWidth="5" strokeDasharray="90 40" className="sdm-spin" style={{ transformOrigin: "389px 232px" }} />
    </g>
    <g className="sdm-float-a"><rect x="14" y="120" width="64" height="64" rx="16" fill="#fff" /><path d="M32 152l-8 8 8 8M60 152l8 8-8 8M50 146l-6 28" stroke="#0f766e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
    <g className="sdm-float-b"><rect x="440" y="70" width="62" height="62" rx="16" fill="#fff" /><rect x="456" y="84" width="30" height="34" rx="6" fill="none" stroke="#6366f1" strokeWidth="4" /><circle cx="471" cy="110" r="2.5" fill="#6366f1" /></g>
    <g className="sdm-float-c"><rect x="410" y="270" width="70" height="56" rx="16" fill="#fff" /><path d="M428 304a10 10 0 0 1 2-19 14 14 0 0 1 27 2 9 9 0 0 1-1 17z" fill="#38bdf8" /></g>
    <g className="sdm-float-b"><circle cx="60" cy="290" r="28" fill="#fff" /><path d="M46 292l9 9 17-20" stroke="#14b8a6" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
  </svg>
);

export const TeamScene = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 520 360" className={className} role="img" aria-label="Animated illustration of a team collaborating">
    <defs><linearGradient id="ts-a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#14b8a6" /><stop offset="1" stopColor="#6366f1" /></linearGradient></defs>
    <circle cx="260" cy="190" r="150" fill="url(#ts-a)" opacity=".12" className="sdm-pulse" />
    {[{ x: 150, y: 170, c: "#14b8a6" }, { x: 260, y: 130, c: "#6366f1" }, { x: 370, y: 170, c: "#f59e0b" }, { x: 205, y: 260, c: "#ec4899" }, { x: 315, y: 260, c: "#38bdf8" }].map((p, i) => (
      <g key={i} className={i % 2 ? "sdm-float-a" : "sdm-float-b"} style={{ animationDelay: `${i * 0.3}s` }}>
        <circle cx={p.x} cy={p.y - 26} r="22" fill={p.c} /><path d={`M${p.x - 34} ${p.y + 40}a34 34 0 0 1 68 0z`} fill={p.c} opacity=".85" />
        <circle cx={p.x - 7} cy={p.y - 28} r="2.6" fill="#fff" /><circle cx={p.x + 7} cy={p.y - 28} r="2.6" fill="#fff" />
      </g>
    ))}
    <path d="M150 170L260 130 370 170 315 260 205 260z" fill="none" stroke="url(#ts-a)" strokeWidth="2" strokeDasharray="6 8" className="sdm-dash" />
  </svg>
);

export const CloudScene = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Animated illustration of cloud and devices">
    <defs><linearGradient id="cs-a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#38bdf8" /><stop offset="1" stopColor="#6366f1" /></linearGradient></defs>
    <g className="sdm-float-slow"><path d="M110 170a46 46 0 0 1 8-91 62 62 0 0 1 118-6 52 52 0 0 1 36 97z" fill="url(#cs-a)" /></g>
    <g className="sdm-float-a"><rect x="40" y="200" width="84" height="56" rx="8" fill="#fff" stroke="#14b8a6" strokeWidth="3" /><rect x="52" y="212" width="40" height="6" rx="3" fill="#14b8a6" /><rect x="52" y="226" width="58" height="6" rx="3" fill="#94a3b8" /></g>
    <g className="sdm-float-b"><rect x="290" y="190" width="46" height="80" rx="9" fill="#fff" stroke="#6366f1" strokeWidth="3" /><circle cx="313" cy="260" r="3" fill="#6366f1" /></g>
    <path d="M110 200V150M313 190V140" stroke="#14b8a6" strokeWidth="2.5" strokeDasharray="5 6" className="sdm-dash" />
  </svg>
);

export const MobileScene = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Animated illustration of a mobile app">
    <defs><linearGradient id="ms-a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f59e0b" /><stop offset="1" stopColor="#ec4899" /></linearGradient></defs>
    <g className="sdm-float-slow"><rect x="140" y="30" width="120" height="240" rx="22" fill="#0f172a" stroke="url(#ms-a)" strokeWidth="3" />
      <rect x="152" y="54" width="96" height="46" rx="10" fill="url(#ms-a)" opacity=".9" />
      {[0, 1, 2].map((r) => <rect key={r} x="152" y={114 + r * 34} width={96 - r * 14} height="22" rx="8" fill="#fff" opacity={0.16 + r * 0.05} />)}
      <circle cx="200" cy="248" r="8" fill="#fff" opacity=".25" /></g>
    <g className="sdm-float-a"><circle cx="80" cy="90" r="28" fill="#fff" /><path d="M68 90l8 8 14-16" stroke="#14b8a6" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
    <g className="sdm-float-b"><rect x="296" y="150" width="62" height="46" rx="14" fill="#fff" /><circle cx="313" cy="173" r="5" fill="#ec4899" /><rect x="324" y="168" width="22" height="5" rx="2.5" fill="#94a3b8" /><rect x="324" y="177" width="14" height="5" rx="2.5" fill="#cbd5e1" /></g>
  </svg>
);
