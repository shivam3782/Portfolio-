import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import { launch } from "chrome-launcher";
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const label = process.argv[2] || "final";
const url = process.env.LIGHTHOUSE_URL || "http://localhost:5173/";
await mkdir("artifacts", { recursive: true });
for (const formFactor of ["mobile", "desktop"]) {
  const chrome = await launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ["--headless", "--no-sandbox"],
  });
  try {
    const result = await lighthouse(
      url,
      {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
      },
      formFactor === "desktop" ? desktopConfig : undefined,
    );
    await writeFile(
      `artifacts/lighthouse-${label}-${formFactor}.json`,
      result.report,
    );
    console.log(
      JSON.stringify({
        label,
        formFactor,
        scores: Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, value]) => [
            key,
            Math.round(value.score * 100),
          ]),
        ),
        lcp: result.lhr.audits["largest-contentful-paint"].numericValue,
        cls: result.lhr.audits["cumulative-layout-shift"].numericValue,
        failures: Object.values(result.lhr.audits)
          .filter((a) => a.score !== null && a.score < 0.9)
          .map((a) => ({ id: a.id, title: a.title, value: a.displayValue })),
      }),
    );
  } finally {
    await Promise.resolve(chrome.kill()).catch(() => {});
  }
}
