// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JourneyExplorer } from "../../components/journey-explorer.tsx";
import { journeyChapters } from "../../lib/journey.ts";

beforeEach(() => {
  window.history.replaceState({}, "", "/journey");
  vi.stubGlobal("matchMedia", (query) => ({
    matches: [
      "(prefers-reduced-motion)",
      "(prefers-reduced-motion: reduce)",
    ].includes(query),
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return true;
    },
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function title(id) {
  return journeyChapters.find((chapter) => chapter.id === id).title;
}

function setup() {
  const user = userEvent.setup();
  render(createElement(JourneyExplorer));
  const result = screen.getByRole("region");
  return {
    user,
    result,
    submit: screen.getByRole("button", { name: "Show this journey" }),
  };
}

describe("journey selection", () => {
  it("shows the travel globe with a truthful regional caption in the whole story", () => {
    const { result } = setup();
    const globe = within(result).getByRole("figure", {
      name: /India → Southeast Asia/,
    });

    expect(globe).toBeTruthy();
    expect(
      within(globe).getByText(/many roads across India, then farther/),
    ).toBeTruthy();
  });

  it("keeps the decade-long travel history in a collapsed editorial archive", () => {
    const { result } = setup();
    const disclosure = within(result)
      .getByText("Travel in my 20s")
      .closest("details");

    expect(disclosure).toBeTruthy();
    expect(disclosure.open).toBe(false);
    expect(within(disclosure).getByText("2016–2026")).toBeTruthy();
    expect(within(disclosure).getByText(/Kuala Lumpur/)).toBeTruthy();
    expect(within(disclosure).getByText(/motorcycle racing camp/)).toBeTruthy();
  });

  it("shows both supplied photo-map views inside the travel chapter", () => {
    const { result } = setup();
    const maps = within(result).getAllByRole("img", {
      name: /Google Photos travel map/,
    });

    expect(maps).toHaveLength(2);
    expect(maps.every((map) => map.getAttribute("loading") === "lazy")).toBe(
      true,
    );
    expect(within(result).getByText("Closer view")).toBeTruthy();
    expect(within(result).getByText("Wider view")).toBeTruthy();
  });

  it("keeps the current story visible while choices are staged, then applies them on submit", async () => {
    const { user, result, submit } = setup();
    const technology = screen.getByRole("checkbox", { name: /^Technology/ });

    await user.click(technology);

    expect(technology.checked).toBe(true);
    expect(
      within(result).getByRole("heading", { name: title("rotaract") }),
    ).toBeTruthy();
    await user.click(submit);

    await waitFor(() => {
      expect(
        within(result).queryByRole("heading", { name: title("rotaract") }),
      ).toBeNull();
    });
    expect(
      within(result).getByRole("heading", { name: title("technology") }),
    ).toBeTruthy();
    expect(within(result).queryByRole("figure")).toBeNull();
    expect(
      within(result).queryByRole("heading", { name: title("punjab") }),
    ).toBeNull();
    expect(
      within(result).queryByRole("heading", { name: title("now") }),
    ).toBeNull();
    expect(within(result).getAllByRole("heading", { level: 3 })).toHaveLength(
      6,
    );
  });

  it("combines selected threads as a union rather than requiring every theme on each chapter", async () => {
    const { user, result, submit } = setup();

    await user.click(screen.getByRole("checkbox", { name: /^Technology/ }));
    await user.click(
      screen.getByRole("checkbox", { name: /^Travel and place/ }),
    );
    await user.click(submit);

    await waitFor(() => {
      expect(
        within(result).queryByRole("heading", { name: title("rotaract") }),
      ).toBeNull();
    });
    expect(
      within(result).getByRole("heading", { name: title("technology") }),
    ).toBeTruthy();
    expect(
      within(result).getByRole("heading", { name: title("travel") }),
    ).toBeTruthy();
    expect(
      within(result).getByRole("heading", { name: title("remote-life") }),
    ).toBeTruthy();
  });

  it.each(["Whole story", "deselecting the final thread"])(
    "restores every chapter after choosing %s and submitting",
    async (resetMethod) => {
      const { user, result, submit } = setup();
      const initialHeadings = within(result)
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent);
      const technology = screen.getByRole("checkbox", { name: /^Technology/ });

      await user.click(technology);
      await user.click(submit);
      await waitFor(() => {
        expect(
          within(result).queryByRole("heading", { name: title("pu") }),
        ).toBeNull();
      });

      if (resetMethod === "Whole story") {
        await user.click(screen.getByRole("button", { name: /^Whole story/ }));
      } else {
        await user.click(technology);
      }
      expect(technology.checked).toBe(false);
      expect(
        within(result).queryByRole("heading", { name: title("pu") }),
      ).toBeNull();
      await user.click(submit);

      await waitFor(() => {
        expect(
          within(result)
            .getAllByRole("heading", { level: 3 })
            .map((heading) => heading.textContent),
        ).toEqual(initialHeadings);
      });
    },
  );

  it("writes applied filters and chapter order into the URL", async () => {
    const { user, submit } = setup();

    await user.click(screen.getByRole("checkbox", { name: /^Technology/ }));
    await user.click(submit);
    expect(window.location.search).toBe("?thread=technology");

    await user.click(screen.getByRole("button", { name: "Thematic" }));
    expect(window.location.search).toBe("?thread=technology&order=thematic");
  });

  it("restores URL state and presents six ideas without resume tables or competing metadata", async () => {
    window.history.replaceState(
      {},
      "",
      "/journey?thread=technology&order=thematic",
    );
    setup();

    await waitFor(() => {
      expect(screen.getByRole("region", { name: "Technology" })).toBeTruthy();
      expect(
        screen
          .getByRole("button", { name: "Thematic" })
          .getAttribute("aria-pressed"),
      ).toBe("true");
    });
    const result = screen.getByRole("region", { name: "Technology" });
    expect(within(result).getAllByRole("heading", { level: 3 })).toHaveLength(
      6,
    );
    const current = within(result).getByRole("listitem", {
      name: "Denim Health",
    });
    expect(within(current).getByText("Nov 2023–Sep 2026")).toBeTruthy();
    expect(
      within(current).getByText(/initial commit to production/),
    ).toBeTruthy();
    expect(
      within(current).getByText(
        "Founding Engineer / Lead Engineer · Healthcare",
      ),
    ).toBeTruthy();
    expect(
      result.querySelectorAll("dl, details, .journey-chapter ul"),
    ).toHaveLength(0);
    expect(result.querySelectorAll(".journey-chapter-meta span")).toHaveLength(
      6,
    );
    expect(within(result).queryByText("Not named here")).toBeNull();
  });

  it.each([0, 1, 3])(
    "supports %i optional photos without placeholders or changing chapter order",
    (count) => {
      const chapters = journeyChapters.filter(
        ({ type }) => type === "professional",
      );
      // Test-only image fixtures: no media is added to the public content module.
      const originals = chapters.map(({ media }) => media);
      try {
        chapters.slice(0, count).forEach((chapter, index) => {
          chapter.media = {
            src: `/journey-test-${index}.webp`,
            alt: `Test editorial photograph ${index + 1}`,
            width: 1200,
            height: 800,
            ...(index === 0 ? { caption: "An approved visual footnote." } : {}),
          };
        });
        window.history.replaceState({}, "", "/journey?thread=technology");
        const { result } = setup();
        expect(
          within(result)
            .getAllByRole("heading", { level: 3 })
            .map((heading) => heading.textContent),
        ).toEqual([
          "XenonStack",
          "Independent / Remote",
          "Topica Edtech Group",
          "CAW Studios",
          "Denim Health",
          "AI-native engineering",
        ]);
        const images = within(result).queryAllByRole("img");
        expect(images).toHaveLength(count);
        expect(result.querySelectorAll("figure")).toHaveLength(count);
        for (const image of images) {
          expect(image.getAttribute("loading")).toBe("lazy");
          expect(image.getAttribute("width")).toBe("1200");
          expect(image.getAttribute("height")).toBe("800");
          expect(image.getAttribute("sizes")).toContain("608px");
          expect(image.getAttribute("srcset")).toContain("w");
          expect(image.getAttribute("src")).toContain("/_next/image?");
        }
        expect(result.querySelectorAll("figcaption")).toHaveLength(
          count > 0 ? 1 : 0,
        );
      } finally {
        chapters.forEach((chapter, index) => {
          if (originals[index]) chapter.media = originals[index];
          else delete chapter.media;
        });
      }
    },
  );
});
