export const siteConfig = {
  name: "Divyum Bhumra",
  shortDescription: "Technologist, software engineer and independent thinker.",
  description:
    "Divyum Bhumra builds software and writes about technology, artificial intelligence, entrepreneurship, philosophy and consciousness.",
  url: "https://www.divyumbhumra.com",
  locale: "en_IN",
  location: "India / elsewhere",
  bookingUrl: "https://cal.com/divyum-bhumra-6zkfhd/30min",
  projectsVisible: false,
  social: {
    x: "",
    linkedin: "https://www.linkedin.com/in/divyum/",
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
