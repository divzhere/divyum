/*
  An edition in waiting. One row, set like a colophon: the point, the edition
  label, a hairline leader and the word "Forthcoming". Exactly one row per
  archive; a longer list would claim a pipeline that does not exist.
*/

export function EditionRow({ label }: { label: string }) {
  return (
    <p className="edition-row">
      <span className="edition-point" aria-hidden="true" />
      <span className="edition-label">{label}</span>
      <span className="edition-leader" aria-hidden="true" />
      <span className="edition-status">Forthcoming</span>
    </p>
  );
}
