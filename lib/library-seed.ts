import type { BookStatus } from "./library.ts";

/*
  TODO(divyum): replace these placeholder spines with real books — this one
  file is the whole seed. Each entry becomes a spine on /library. When a book
  earns reading notes, promote it to content/library/<slug>.mdx instead and
  delete its row here.
*/

type SeedEntry = {
  slug: string;
  title: string;
  author: string;
  year?: number;
  status: BookStatus;
  themes: string[];
  coverColor: string;
};

export const placeholderShelf: SeedEntry[] = [
  {
    slug: "placeholder-vedanta",
    title: "A real book goes here",
    author: "TODO(divyum)",
    status: "read",
    themes: ["vedanta"],
    coverColor: "#4c4668",
  },
  {
    slug: "placeholder-psychology",
    title: "A real book goes here",
    author: "TODO(divyum)",
    status: "read",
    themes: ["psychology"],
    coverColor: "#46603f",
  },
  {
    slug: "placeholder-technology",
    title: "A real book goes here",
    author: "TODO(divyum)",
    status: "reading",
    themes: ["technology"],
    coverColor: "#4a5a6a",
  },
  {
    slug: "placeholder-yoga",
    title: "A real book goes here",
    author: "TODO(divyum)",
    status: "rereading",
    themes: ["yoga"],
    coverColor: "#8a5a44",
  },
  {
    slug: "placeholder-founders",
    title: "A real book goes here",
    author: "TODO(divyum)",
    status: "shelved",
    themes: ["startups"],
    coverColor: "#96702e",
  },
];
