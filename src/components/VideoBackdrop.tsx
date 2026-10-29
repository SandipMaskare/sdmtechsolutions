const lowMotion = () => {
  try {
    const c = (navigator as any).connection;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches || !!c?.saveData;
  } catch { return false; }
};

/** Decorative looping video behind a public-page hero. Falls back to a still image. */
export default function VideoBackdrop({ name }: { name: "learn" | "waves" }) {
  const poster = `/media/poster-${name}.jpg`;
  return (
    <>
      {!lowMotion() ? (
        <video data-bd className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={poster} aria-hidden="true">
          <source src={`/media/${name}-loop.mp4`} type="video/mp4" />
        </video>
      ) : <img data-bd className="absolute inset-0 w-full h-full object-cover" src={poster} alt="" aria-hidden="true" />}
      <div data-bd className="absolute inset-0 bg-[hsl(210_60%_10%/.55)]" />
    </>
  );
}
