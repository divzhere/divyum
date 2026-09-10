export const publicRoutes = [
  { path: "/", heading: "Divyum Bhumra", snapshot: "home" },
  { path: "/essays", heading: "Essays", snapshot: "essays" },
  { path: "/notes", heading: "Notes", snapshot: "notes" },
  { path: "/frameworks", heading: "Frameworks", snapshot: "frameworks" },
  { path: "/library", heading: "Library", snapshot: "library" },
  {
    path: "/frameworks/eisenhower-matrix",
    heading: "The Eisenhower Matrix",
    snapshot: "framework-eisenhower",
  },
  { path: "/journey", heading: "Journey", snapshot: "journey" },
  { path: "/about", heading: "About", snapshot: "about" },
  {
    path: "/frameworks/signal-vs-noise",
    heading: "Signal vs Noise",
    snapshot: "framework-signal",
  },
  {
    path: "/frameworks/knowledge-tree",
    heading: "The Knowledge Tree",
    snapshot: "framework-tree",
  },
  {
    path: "/frameworks/tat-tvam-asi",
    heading: "Tat Tvam Asi",
    snapshot: "framework-advaita",
  },
  {
    path: "/frameworks/vision-to-leverage",
    heading: "Vision to Leverage",
    snapshot: "framework-leverage",
  },
  {
    path: "/frameworks/eight-limbs",
    heading: "The Eight Limbs of Yoga",
    snapshot: "framework-yoga",
  },
] as const;

export const hiddenRoutes = [
  "/projects",
  "/projects/example-project",
  "/essays/example-essay",
  "/notes/example-note",
  "/library/example-book",
  "/frameworks/future-framework-01",
  "/frameworks/future-framework-02",
  "/motion/paper-depth",
  "/motion/point-line",
  "/motion/instrument",
] as const;
