/** Animated gradient shapes behind login, sign-up and reset pages (no photos). */
const AuthBackdrop = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="sdm-orb" style={{ top: "-8%", left: "-6%", width: 380, height: 380, background: "#14b8a6", animationDuration: "14s" }} />
    <div className="sdm-orb" style={{ bottom: "-10%", right: "-6%", width: 440, height: 440, background: "#6366f1", animationDuration: "18s", animationDelay: "-4s" }} />
    <div className="sdm-orb" style={{ top: "40%", left: "55%", width: 260, height: 260, background: "#f59e0b", opacity: .22, animationDuration: "16s", animationDelay: "-8s" }} />
    <div className="absolute inset-0 opacity-[.07]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
  </div>
);
export default AuthBackdrop;
