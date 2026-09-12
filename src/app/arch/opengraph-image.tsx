import { ImageResponse } from "next/og";

export const alt = "D. James Fusilier — Arch Linux terminal";
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
          padding: "64px 80px",
          color: "#d4d4d4",
          background: "#0c0d10",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        <div style={{ color: "#1793d1", fontSize: 24 }}>
          [guest@archlinux ~]$ neofetch
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 48, color: "#fff" }}>
          D. James Fusilier
        </div>
        <div style={{ fontSize: 36, marginTop: 12, color: "#8ec07c" }}>
          AI Product Leader · Founder · Multi-Agent AI
        </div>
        <div style={{ fontSize: 26, marginTop: 40, opacity: 0.6 }}>
          djames.dev/arch &nbsp;·&nbsp; try `os --help`
        </div>
      </div>
    ),
    size
  );
}
