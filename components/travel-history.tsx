import { travelHistory } from "@/lib/travel-history";

export function TravelHistory() {
  return (
    <details className="journey-travel-history">
      <summary>
        <span>
          <strong>Travel in my 20s</strong>
          <small>2016–2026</small>
        </span>
        <span className="journey-travel-history-mark" aria-hidden="true" />
      </summary>

      <div className="journey-travel-history-body">
        <p>
          The places, moves and journeys I remember—not a scorecard, just a
          record of a decade spent in motion.
        </p>
        <ol>
          {travelHistory.map(({ year, entries }) => (
            <li key={year}>
              <time dateTime={String(year)}>{year}</time>
              <ul>
                {entries.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}
