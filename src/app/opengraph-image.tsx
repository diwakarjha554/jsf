import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

const logoData = await readFile(join(process.cwd(), "src/app/icon.svg"), "base64");
const logoSrc = `data:image/svg+xml;base64,${logoData}`;

export const alt = `${site.name}: education, healthcare and social welfare across India`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0f3a39 0%, #155753 55%, #186c66 100%)",
          color: "#fffbf5",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            border: "2px solid rgba(166,218,213,0.35)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -40,
            width: 360,
            height: 360,
            borderRadius: 9999,
            border: "2px solid rgba(166,218,213,0.35)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* ImageResponse renders the shared SVG directly, without Next image optimisation. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" width={72} height={72} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 700 }}>Jeevansphere</div>
            <div style={{ fontSize: 20, letterSpacing: 8, color: "#ffd15c" }}>FOUNDATION</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>
            Every life deserves a fair start.
          </div>
          <div style={{ fontSize: 30, color: "#d2edea", maxWidth: 900 }}>
            Education · Healthcare · Social welfare · Culture · Community
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, color: "#a6dad5" }}>Section 8 non-profit · Delhi, India</div>
          <div
            style={{
              display: "flex",
              background: "#c2410c",
              color: "#ffffff",
              fontSize: 26,
              fontWeight: 700,
              padding: "14px 30px",
              borderRadius: 9999,
            }}
          >
            Donate by UPI
          </div>
        </div>
      </div>
    ),
    size,
  );
}
