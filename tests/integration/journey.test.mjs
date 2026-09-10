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
  it("keeps the current story visible while choices are staged, then applies them on submit", async () => {
    const { user, result, submit } = setup();
    const technology = screen.getByRole("checkbox", { name: /^Technology/ });

    await user.click(technology);

    expect(technology.checked).toBe(true);
    expect(
      within(result).getByRole("heading", { name: title("rotary") }),
    ).toBeTruthy();
    await user.click(submit);

    await waitFor(() => {
      expect(
        within(result).queryByRole("heading", { name: title("rotary") }),
      ).toBeNull();
    });
    expect(
      within(result).getByRole("heading", { name: title("technology") }),
    ).toBeTruthy();
    expect(
      within(result).getByRole("heading", { name: title("punjab") }),
    ).toBeTruthy();
    expect(
      within(result).getByRole("heading", { name: title("now") }),
    ).toBeTruthy();
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
        within(result).queryByRole("heading", { name: title("rotary") }),
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

  it("restores URL state on load and renders the professional layer", async () => {
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
    const details = screen.getByRole("group", {
      name: "Professional chapter details",
    });
    expect(within(details).getByText("Software engineer")).toBeTruthy();
    expect(within(details).getByText("Not named here")).toBeTruthy();
    expect(within(details).getByText("7+ years")).toBeTruthy();
  });
});
