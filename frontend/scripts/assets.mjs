import sharp from "sharp";
import { writeFile } from "node:fs/promises";
const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="28" fill="#0c1017"/><path d="M34 49h64v18H52v20h46v56H34v-18h46v-20H34zm103-10h20l-36 114h-20z" fill="#ff985f"/></svg>`;
await writeFile("public/favicon.svg", logo);
for (const [name, size] of [
  ["favicon-32.png", 32],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
])
  await sharp(Buffer.from(logo))
    .resize(size)
    .png()
    .toFile("public/" + name);
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#263544"/></pattern></defs><rect width="1200" height="630" fill="#0c1017"/><rect x="740" width="460" height="630" fill="url(#g)"/><rect x="40" y="40" width="1120" height="550" rx="4" fill="none" stroke="#415063"/><path d="M40 100h1120" stroke="#415063"/><g font-family="Arial, sans-serif"><text x="75" y="80" font-size="24" fill="#ff985f">s/ Shivam.</text><text x="860" y="80" font-size="17" fill="#7bdbca">DEVELOPER MODE</text><text x="80" y="170" font-size="20" letter-spacing="3" fill="#7bdbca">BUILD. LEARN. LEVEL UP.</text><text x="75" y="292" font-size="100" font-weight="bold" fill="#f1f3f5">Shivam</text><text x="75" y="395" font-size="100" font-weight="bold" fill="#ff985f">Sharma.</text><text x="80" y="460" font-size="26" fill="#bdc7d4">Software engineer · Full-stack · AI &amp; ML</text><text x="80" y="550" font-size="19" fill="#a1afc0">shivam-sharma.me</text></g><g transform="translate(805 180) rotate(-8)"><rect x="12" y="12" width="230" height="270" fill="#05080d"/><rect width="230" height="270" rx="8" fill="#34434a" stroke="#778b92" stroke-width="3"/><path d="M20 20h190m-190 8h190m-190 8h190" stroke="#7b8c91"/><rect x="22" y="55" width="186" height="160" fill="#17262f" stroke="#7bdbca"/><text x="52" y="167" font-family="monospace" font-weight="bold" font-size="80" fill="#ff985f">s/</text><path d="M55 239h120" stroke="#d8bb76" stroke-width="16"/><path d="M62 231v16m15-16v16m15-16v16m15-16v16m15-16v16m15-16v16m15-16v16m15-16v16" stroke="#514b37" stroke-width="3"/></g></svg>`;
await sharp(Buffer.from(og)).png().toFile("public/og-image.png");
await writeFile(
  "public/site.webmanifest",
  JSON.stringify(
    {
      name: "Shivam Sharma — Portfolio",
      short_name: "Shivam",
      start_url: "/",
      display: "standalone",
      background_color: "#0c1017",
      theme_color: "#0c1017",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    null,
    2,
  ),
);
console.log("Generated OG image and favicon set.");
