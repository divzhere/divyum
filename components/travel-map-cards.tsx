import Image from "next/image";

const travelMaps = [
  {
    src: "/images/journey/travel-map-india-southeast-asia.webp",
    alt: "Google Photos travel map showing journeys across India and into Malaysia and Indonesia",
    title: "Closer view",
    caption: "India and Southeast Asia",
  },
  {
    src: "/images/journey/travel-map-wide-view.webp",
    alt: "Zoomed-out Google Photos travel map showing a dense travel footprint across India and Southeast Asia",
    title: "Wider view",
    caption: "The travel footprint so far",
  },
] as const;

export function TravelMapCards() {
  return (
    <div
      className="journey-travel-maps"
      aria-labelledby="journey-travel-maps-title"
    >
      <header>
        <h4 id="journey-travel-maps-title">The map behind the journey</h4>
        <p>Two views from Google Photos, February 2012–September 2026.</p>
      </header>

      <div className="journey-travel-map-grid">
        {travelMaps.map((map) => (
          <figure className="journey-travel-map-card" key={map.src}>
            <div className="journey-travel-map-frame">
              <Image
                src={map.src}
                alt={map.alt}
                fill
                sizes="(max-width: 700px) calc(100vw - 96px), (max-width: 1140px) calc(30vw - 48px), 296px"
                loading="lazy"
              />
            </div>
            <figcaption>
              <strong>{map.title}</strong>
              <span>{map.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
