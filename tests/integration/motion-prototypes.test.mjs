// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import {
  MotionPrototype,
  motionPrototypeVariants,
} from "../../components/motion-prototype.tsx";

beforeEach(() => {
  vi.stubGlobal("matchMedia", (query) => ({
    matches: query === "(pointer: fine)",
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

describe("motion lab prototypes", () => {
  it("keeps the exact homepage statement in every direction", () => {
    for (const variant of motionPrototypeVariants) {
      const { unmount } = render(createElement(MotionPrototype, { variant }));

      expect(
        screen.getByText(
          "I build software and write about technology, artificial intelligence, entrepreneurship, philosophy and consciousness.",
        ),
      ).toBeTruthy();
      expect(
        screen.getByRole("heading", { name: "Divyum Bhumra" }),
      ).toBeTruthy();
      unmount();
    }
  });

  it("renders one distinct visual idea for each direction", () => {
    const expectedVisual = {
      "paper-depth": "paper-depth-visual",
      "point-line": "point-line-visual",
      instrument: "instrument-visual",
    };

    for (const variant of motionPrototypeVariants) {
      const { unmount } = render(createElement(MotionPrototype, { variant }));
      expect(screen.getByTestId(expectedVisual[variant])).toBeTruthy();
      expect(screen.getAllByTestId(/-visual$/)).toHaveLength(1);
      unmount();
    }
  });

  it("makes the point-and-line direction carry a real Currently section", () => {
    render(createElement(MotionPrototype, { variant: "point-line" }));

    expect(screen.getByRole("heading", { name: "Currently" })).toBeTruthy();
    expect(
      screen.getByText("Software systems and AI-native product experiences."),
    ).toBeTruthy();
  });
});
