import { expect, test } from "@playwright/test";

test.skip(
  ({ browserName, viewport }) =>
    browserName !== "chromium" || viewport?.width !== 375,
);

for (const theme of ["light", "dark"] as const) {
  test(`unbuilt tree controls remain distinguishable in ${theme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await page.goto("/frameworks/knowledge-tree");
    const contrasts = await page.evaluate(() => {
      const rgb = (value: string) =>
        value
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number);
      const luminance = (values: number[]) =>
        values
          .map((value) => {
            const channel = value / 255;
            return channel <= 0.04045
              ? channel / 12.92
              : ((channel + 0.055) / 1.055) ** 2.4;
          })
          .reduce(
            (sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i],
            0,
          );
      const background = rgb(getComputedStyle(document.body).backgroundColor);
      const base = luminance(background);
      return [
        ...document.querySelectorAll(
          ".fw-tree-trunk, .fw-tree-branch, .fw-tree-leaf",
        ),
      ].map((node) => {
        const style = getComputedStyle(node);
        const colour = rgb(
          node.tagName.toLowerCase() === "circle" ? style.fill : style.stroke,
        );
        const opacity = Number(style.opacity);
        const foreground = luminance(
          colour.map(
            (channel, i) => channel * opacity + background[i] * (1 - opacity),
          ),
        );
        return (
          (Math.max(base, foreground) + 0.05) /
          (Math.min(base, foreground) + 0.05)
        );
      });
    });
    expect(contrasts).toHaveLength(11);
    for (const contrast of contrasts)
      expect(contrast).toBeGreaterThanOrEqual(3);
  });
}
