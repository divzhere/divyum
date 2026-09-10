export const publicRoutes = [
  { path: "/", heading: "Divyum Bhumra", snapshot: "home" },
  { path: "/essays", heading: "Essays", snapshot: "essays" },
  { path: "/notes", heading: "Notes", snapshot: "notes" },
  { path: "/journey", heading: "Journey", snapshot: "journey" },
  { path: "/about", heading: "About", snapshot: "about" },
] as const;

export const hiddenRoutes = [
  "/projects",
  "/projects/example-project",
  "/essays/example-essay",
  "/notes/example-note",
] as const;
