export function TravelGlobe() {
  return (
    <figure
      className="journey-travel-globe"
      aria-labelledby="travel-globe-title travel-globe-description"
    >
      <div className="journey-travel-globe-illustration" aria-hidden="true">
        <svg viewBox="0 0 360 360" focusable="false">
          <defs>
            <clipPath id="travel-globe-clip">
              <circle cx="180" cy="180" r="153" />
            </clipPath>
          </defs>

          <circle className="travel-globe-sphere" cx="180" cy="180" r="153" />

          <g className="travel-globe-grid" clipPath="url(#travel-globe-clip)">
            <ellipse cx="180" cy="180" rx="79" ry="153" />
            <ellipse cx="180" cy="180" rx="128" ry="153" />
            <path d="M27 132c43 18 94 27 153 27s110-9 153-27" />
            <path d="M27 228c43-18 94-27 153-27s110 9 153 27" />
            <path d="M30 180h300" />
          </g>

          <g className="travel-globe-land" clipPath="url(#travel-globe-clip)">
            <path d="M62 86c20-24 49-38 86-43 26-4 53 1 76 9 26 10 52 10 76 26 12 9 21 22 25 39l-27 9-16 19-24 1-14 16-24 2-15 13-24-5-18 10-20-8-23 4-13-16-24-3-9-19-19-12 7-19-14-12Z" />
            <path d="m173 169 20 5 14 19-8 23-15 27-11-18-9-20 4-17Z" />
            <path d="m221 180 16 12-1 23 13 17-8 12-12-19-8-21-12-12Z" />
            <path d="m240 249 21 5 16 11-10 8-25-8-16-9Z" />
            <path d="m278 270 26 5 14 11-17 6-28-7-13-8Z" />
            <path d="m101 201 18 2 9 17-6 18-19 6-12-13-3-17Z" />
          </g>

          <g className="travel-globe-route" clipPath="url(#travel-globe-clip)">
            <path d="M179 182c-4 20 4 37 18 49 15 13 28 22 41 36 14 15 26 24 47 27" />
            <circle cx="179" cy="182" r="10" />
            <circle cx="180" cy="202" r="5" />
            <circle cx="190" cy="226" r="6" />
            <circle cx="218" cy="248" r="5" />
            <circle cx="241" cy="267" r="7" />
            <circle cx="285" cy="294" r="8" />
          </g>

          <circle className="travel-globe-outline" cx="180" cy="180" r="153" />
        </svg>
      </div>

      <figcaption>
        <strong id="travel-globe-title">India → Southeast Asia</strong>
        <span id="travel-globe-description">
          The map so far: many roads across India, then farther into Southeast
          Asia.
        </span>
      </figcaption>
    </figure>
  );
}
