// @vitest-environment jsdom
import { createElement } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ResumePage, { metadata } from "../../app/resume/page.tsx";
import { absoluteUrl } from "../../lib/site.ts";

vi.mock("../../components/point-rule.tsx", () => ({ PointRule: () => null }));
afterEach(cleanup);

describe("resume page", () => {
  it("offers preview, view, download and fallback paths", () => {
    const { container } = render(createElement(ResumePage));

    const pdfPath = "/resume/divyum-bhumra-resume.pdf";
    const previews = [...container.querySelectorAll("img")];
    expect(previews).toHaveLength(2);
    expect(previews[0]?.getAttribute("src")).toContain(
      "divyum-bhumra-resume-page-1.webp",
    );
    expect(previews[1]?.getAttribute("src")).toContain(
      "divyum-bhumra-resume-page-2.webp",
    );
    expect(previews.every((image) => image.getAttribute("alt") === "")).toBe(
      true,
    );
    expect(
      screen.getByRole("link", { name: /View PDF/ }).getAttribute("href"),
    ).toBe(pdfPath);
    expect(
      screen
        .getByRole("link", { name: /Download PDF/ })
        .getAttribute("download"),
    ).toBe("Divyum-Bhumra-Resume.pdf");
    expect(
      screen
        .getByRole("link", { name: "open the PDF directly" })
        .getAttribute("href"),
    ).toBe(pdfPath);
    expect(container.querySelector("details")?.textContent).toContain(
      "Founding Engineer / Lead Engineer · Denim Health",
    );
    expect(
      screen
        .getByRole("link", { name: "+91 98767 67356" })
        .getAttribute("href"),
    ).toBe("tel:+919876767356");
    expect(container.querySelector("address")?.textContent).not.toContain(
      "Remote, India",
    );
  });

  it("uses its own canonical and social metadata", () => {
    expect(metadata.alternates.canonical).toBe(absoluteUrl("/resume"));
    expect(metadata.openGraph.url).toBe(absoluteUrl("/resume"));
    expect(metadata.title).toBe("Resume");
  });
});
