import { ImageResponse } from "next/og";

export const alt =
  "Divyum Bhumra — Technologist, software engineer and independent thinker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3f1ea",
          color: "#1f211e",
          padding: "74px 82px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{ width: 12, height: 12, borderRadius: 999, background: "#7b3837" }}
          />
          <div style={{ width: 112, height: 2, background: "#1f211e", marginLeft: 14 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, letterSpacing: "-2.4px", lineHeight: 1.05 }}>
            Divyum Bhumra
          </div>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 28,
              color: "#555851",
              marginTop: 22,
            }}
          >
            Technologist, software engineer and independent thinker.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
