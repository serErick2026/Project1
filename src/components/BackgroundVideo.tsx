export function BackgroundVideo() {
  return (
    <video
      className="background-video pointer-events-none fixed inset-x-0 top-[-15%] -z-10 h-[115%] w-full object-cover"
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
