import { describe, expect, it } from "vitest";
import { metadata } from "../../app/(lab)/motion/layout.tsx";

describe("motion lab metadata", () => {
  it("keeps every prototype out of search indexes", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
