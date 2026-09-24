type SocialCardProps = {
  label: string;
  title: string;
  description: string;
  accent: string;
  meta?: string;
  tags?: string[];
};

export function SocialCard({
  label,
  title,
  description,
  accent,
  meta,
  tags = [],
}: SocialCardProps) {
  const titleSize = title.length > 60 ? 48 : title.length > 34 ? 54 : 68;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f3f1ea",
        color: "#1f211e",
        padding: "64px 76px 58px",
        fontFamily: "Georgia, serif",
        borderTop: `14px solid ${accent}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 21,
            fontWeight: 700,
            letterSpacing: "2.4px",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          <div
            style={{
              width: 11,
              height: 11,
              borderRadius: 999,
              background: accent,
              marginRight: 14,
            }}
          />
          {label}
        </div>
        <div style={{ display: "flex", fontSize: 21, color: "#64675f" }}>
          divyumbhumra.com
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 1010,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            letterSpacing: "-2.1px",
            lineHeight: 1.06,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Arial, sans-serif",
            fontSize: 25,
            lineHeight: 1.35,
            color: "#555851",
            marginTop: 22,
            maxWidth: 980,
          }}
        >
          {description}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "Arial, sans-serif",
          color: "#64675f",
          fontSize: 21,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ display: "flex", fontWeight: 700, color: "#1f211e" }}>
            Divyum Bhumra
          </div>
          {meta ? (
            <div style={{ display: "flex", marginLeft: 14 }}>· {meta}</div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {tags.slice(0, 3).map((tag, index) => (
            <div
              key={tag}
              style={{
                display: "flex",
                marginLeft: index === 0 ? 0 : 9,
                padding: "7px 12px",
                border: "1px solid #c9c5ba",
                borderRadius: 999,
                fontSize: 17,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
