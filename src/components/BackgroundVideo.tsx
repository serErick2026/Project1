export function BackgroundVideo() {
  return (
    <video
      className="background-video pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster="/background.jpg"
      aria-hidden="true"
    >
      <source src="/background.mp4" type="video/mp4" />
    </video>
  );
}
