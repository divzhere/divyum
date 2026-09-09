export const siteConfig = {
  name: "Divyum Bhumra",
  shortDescription: "Technologist, software engineer and independent thinker.",
  description:
    "Divyum Bhumra builds software and writes about technology, artificial intelligence, entrepreneurship, philosophy and consciousness.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://divyumbhumra.com",
  locale: "en_IN",
  location: "India / elsewhere",
  projectsVisible: false,
  social: {
    x: "",
    linkedin: "",
    github: "",
    email: "",
  },
  newsletterUrl: "",
} as const;

export const essayTopics = [
  "Technology",
  "AI",
  "Startups",
  "Entrepreneurship",
  "Philosophy",
  "Consciousness",
  "Vedanta",
  "Yoga",
  "Psychology",
  "Travel",
  "Life",
  "India",
  "Civilization",
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
