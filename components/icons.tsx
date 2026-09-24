/*
  Hand-drawn icon set, kept local on purpose.

  An icon library would add a dependency and bundle weight for two glyphs, and
  the bundle budget fails the build at +40KiB. These are inline SVG: no runtime,
  no package, and `currentColor` means they inherit the accent colour the
  surrounding link already sets.

  Sized in `em` so they scale with their label. Both are decorative: every call
  site already sits inside a span marked `aria-hidden`, and the link text
  carries the meaning.
*/
type IconProps = {
  className?: string;
};

export function ArrowUpRight({ className = "icon" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.5 11.5 11.5 4.5" />
      <path d="M6 4.5h5.5V10" />
    </svg>
  );
}

export function ArrowDown({ className = "icon" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 3.5v9" />
      <path d="M4.25 8.75 8 12.5l3.75-3.75" />
    </svg>
  );
}
