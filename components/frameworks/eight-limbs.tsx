/*
  The Eight Limbs, set typographically: a concentric progression from outer
  conduct to inner absorption. Deliberately still — a server component with
  no client JavaScript. The indentation and the thinning rule carry the idea:
  each limb sits one step further inside the last.
*/

const limbs = [
  { name: "Yama", gloss: "restraints — conduct toward others" },
  { name: "Niyama", gloss: "observances — conduct toward oneself" },
  { name: "Asana", gloss: "steady, comfortable posture" },
  { name: "Pranayama", gloss: "regulation of breath" },
  { name: "Pratyahara", gloss: "withdrawal of the senses" },
  { name: "Dharana", gloss: "concentration on a single point" },
  { name: "Dhyana", gloss: "sustained meditation" },
  { name: "Samadhi", gloss: "absorption" },
] as const;

export function EightLimbs() {
  return (
    <div className="fw-visual fw-limbs">
      <svg
        className="fw-limbs-rings"
        viewBox="0 0 120 120"
        role="img"
        aria-label="Eight concentric rings, one per limb, closing toward a centre point."
      >
        {limbs.map((limb, index) => (
          <circle
            className="fw-limbs-ring"
            key={limb.name}
            cx={60}
            cy={60}
            r={56 - index * 7}
          />
        ))}
        <circle className="fw-limbs-centre" cx={60} cy={60} r={2.4} />
      </svg>
      <ol className="fw-limbs-list">
        {limbs.map((limb, index) => (
          <li
            className="fw-limbs-item"
            key={limb.name}
            style={{ "--limb-depth": index } as React.CSSProperties}
          >
            <span className="fw-limbs-name">{limb.name}</span>
            <span className="fw-limbs-gloss">{limb.gloss}</span>
          </li>
        ))}
      </ol>
      <p className="fw-limbs-caption">
        Outer conduct first; interior absorption last. The order is the
        teaching.
      </p>
    </div>
  );
}
