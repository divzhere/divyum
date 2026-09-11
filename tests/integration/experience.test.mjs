// @vitest-environment jsdom
import { createElement } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ExperiencePage, { metadata } from "../../app/experience/page.tsx";
import { absoluteUrl } from "../../lib/site.ts";

vi.mock("../../components/point-rule.tsx", () => ({ PointRule: () => null }));
afterEach(cleanup);

describe("professional overview", () => {
  it("keeps the public overview concise with grounded role progression", () => {
    const { container } = render(createElement(ExperiencePage));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Professional overview",
    );
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(7);
    const text = container.textContent.replace(/\s+/g, " ");
    expect(text).toContain("senior software engineer");
    expect(text).toContain("lead frontend and UX role in 2025");
    const words = text.split(/\s+/).filter(Boolean).length;
    expect(words).toBeGreaterThanOrEqual(400);
    expect(words).toBeLessThanOrEqual(600);
  });

  it("has no document download, photo placeholders or data collection", () => {
    const { container } = render(createElement(ExperiencePage));
    expect(
      container.querySelectorAll(
        "form, img, iframe, object, table, [download]",
      ),
    ).toHaveLength(0);
    expect(
      screen
        .getByRole("link", { name: "Follow the technology journey" })
        .getAttribute("href"),
    ).toBe("/journey?thread=technology#technology");
  });

  it("uses its own canonical and social metadata", () => {
    expect(metadata.alternates.canonical).toBe(absoluteUrl("/experience"));
    expect(metadata.openGraph.url).toBe(absoluteUrl("/experience"));
    expect(metadata.title).toBe("Professional overview");
  });
});
