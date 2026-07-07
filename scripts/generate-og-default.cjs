/**
 * Generates public/og-default.png (exactly 1200x630) for SEO / Open Graph.
 *
 * Brand tokens used (from docs/design.md — DO NOT hardcode elsewhere):
 *   - Background  #0b1730  -> --color-surface-stat  (Hero deep-navy canvas)
 *   - Accent      #0057ff  -> --color-aircok-blue    (single brand accent / Air Spine)
 *   - Accent lite #3d7fff  -> --color-aircok-blue-light (eyebrow wordmark on dark)
 *   - Text        rgba(255,255,255,0.86) -> --color-body-light
 *   - Logo asset  public/images/logos/logo-white.png (white brand mark)
 *
 * Run from repo root:  node scripts/generate-og-default.cjs
 *
 * Requires: sharp (already present at node_modules/sharp v0.34.x).
 */
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ROOT = process.cwd();
const W = 1200;
const H = 630;

// Brand tokens
const BG = { r: 0x0b, g: 0x17, b: 0x30, alpha: 1 }; // surface-stat #0b1730
const BLUE = "#0057ff"; // aircok-blue
const BLUE_LIGHT = "#3d7fff"; // aircok-blue-light
const BODY_LIGHT = "rgba(255,255,255,0.86)"; // body-light

const LOGO = path.resolve(ROOT, "public/images/logos/logo-white.png");
const OUT = path.resolve(ROOT, "public/og-default.png");

const KOREAN_NAME = "스마트 에어콕";
const TAGLINE = "실내 공기질 관리 전문 기업";
const EYEBROW = "SMART AIRCOK";

async function main() {
  if (!fs.existsSync(LOGO)) throw new Error("Logo not found: " + LOGO);

  // Scale the white logo to a target width, keeping aspect ratio.
  const meta = await sharp(LOGO).metadata();
  const targetW = 460;
  const logoW = targetW;
  const logoH = Math.round((meta.height / meta.width) * targetW);
  const logoBuf = await sharp(LOGO).resize(logoW, logoH).png().toBuffer();

  const cx = W / 2;
  // Vertical block: eyebrow (spine + wordmark) -> logo -> accent rule -> tagline
  const eyebrowY = 210; // baseline area for eyebrow row
  const logoTop = 250;
  const logoLeft = Math.round(cx - logoW / 2);
  const logoBottom = logoTop + logoH;
  const ruleY = logoBottom + 40;
  const taglineY = ruleY + 58;

  // Overlay SVG: Air Spine eyebrow + accent rule + Korean tagline.
  // Fonts: Malgun Gothic is the standard Korean system font on Windows; Arial for Latin.
  const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- Air Spine signature: short vertical blue rule + English wordmark eyebrow -->
  <rect x="${cx - 96}" y="${eyebrowY - 22}" width="3" height="26" fill="${BLUE}"/>
  <text x="${cx - 84}" y="${eyebrowY}" text-anchor="start"
        font-family="Arial, 'Helvetica Neue', sans-serif" font-size="22"
        font-weight="600" letter-spacing="6" fill="${BLUE_LIGHT}">${EYEBROW}</text>

  <!-- Korean brand name -->
  <text x="${cx}" y="${taglineY - 4}" text-anchor="middle"
        font-family="'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif"
        font-size="40" font-weight="700" fill="#ffffff">${KOREAN_NAME}</text>

  <!-- Accent rule (brand divider) -->
  <rect x="${cx - 34}" y="${ruleY}" width="68" height="4" rx="2" fill="${BLUE}"/>

  <!-- Tagline -->
  <text x="${cx}" y="${taglineY + 52}" text-anchor="middle"
        font-family="'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif"
        font-size="26" font-weight="400" fill="${BODY_LIGHT}">${TAGLINE}</text>
</svg>`;

  await sharp({
    create: { width: W, height: H, channels: 4, background: BG },
  })
    .composite([
      { input: logoBuf, left: logoLeft, top: logoTop },
      { input: Buffer.from(svg), left: 0, top: 0 },
    ])
    .png()
    .toFile(OUT);

  const out = await sharp(OUT).metadata();
  const stat = fs.statSync(OUT);
  console.log(
    `WROTE ${OUT} -> ${out.width}x${out.height} (${stat.size} bytes)`
  );
  if (out.width !== W || out.height !== H) {
    throw new Error(`Dimension mismatch: expected ${W}x${H}`);
  }
}

main().catch((e) => {
  console.error("OG generation failed:", e);
  process.exit(1);
});
