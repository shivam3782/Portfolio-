import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("artifacts/responsive", { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const theme of ["dark", "light"])
    for (const width of [360, 390, 768, 1024, 1280, 1440, 1920]) {
      const page = await browser.newPage({
        viewport: { width, height: 1000 },
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      await page.goto("http://localhost:5173");
      await page.waitForSelector(".static-scene");
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `artifacts/responsive/${theme}-${width}.png`,
        fullPage: true,
      });
      const overflow = await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
        elements: [...document.querySelectorAll("body *")]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return (
              r.width &&
              (r.right > innerWidth + 1 || r.left < -1) &&
              getComputedStyle(el).position !== "fixed" &&
              !el.closest("dialog, .sr-only")
            );
          })
          .map((el) => el.className)
          .slice(0, 15),
      }));
      results.push({ theme, width, overflow });
      await page.close();
    }
  await writeFile(
    "artifacts/responsive/results.json",
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
}
