/*
  The reading thread: the point-and-horizon motif driven by scroll position, so
  the horizon extends as the reader moves through an essay or note.

  Pure CSS (scroll-driven animation) on purpose. No JavaScript means no bundle
  cost, no hydration, and nothing to render when the browser lacks
  `animation-timeline` or the reader prefers reduced motion. In those cases the
  thread stays at its origin and simply does not appear, which is the honest
  fallback: a full horizon would claim a progress the page cannot measure.
*/
export function ReadingThread() {
  return (
    <div className="reading-thread" aria-hidden="true">
      <span className="reading-thread-point" />
      <span className="reading-thread-line" />
    </div>
  );
}
