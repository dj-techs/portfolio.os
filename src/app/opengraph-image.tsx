import { ImageResponse } from "next/og";

export const alt = "D. James Fusilier — AI Product Leader & Founder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "white",
          background:
            "radial-gradient(120% 120% at 0% 0%, #ff5e3a 0%, transparent 40%), radial-gradient(100% 100% at 100% 0%, #c644fc 0%, transparent 40%), radial-gradient(120% 100% at 50% 100%, #1d4ed8 0%, #0a0a2a 60%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.8 }}>djames.dev</div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 20,
          }}
        >
          D. James Fusilier
        </div>
        <div style={{ fontSize: 40, marginTop: 16, opacity: 0.9 }}>
          AI Product Leader &amp; Founder · Responsible AI
        </div>
        <div
          style={{
            fontSize: 28,
            marginTop: 40,
            display: "flex",
            gap: 24,
            opacity: 0.85,
          }}
        >
          <span>macOS</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>Arch Linux</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>Pick your OS</span>
        </div>
      </div>
    ),
    size
  );
}
