import { currentlyItems } from "@/lib/currently";

export function Currently() {
  return (
    <dl className="currently-list">
      {currentlyItems.map((item) => (
        <div className="currently-row" key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
