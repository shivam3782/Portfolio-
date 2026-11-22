import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
const profile = JSON.parse(
  readFileSync(new URL("../src/data/profile.json", import.meta.url)),
);
const projects = JSON.parse(
  readFileSync(new URL("../src/data/projects.snapshot.json", import.meta.url)),
);
const slug = (project) =>
  project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
test.beforeEach(async ({ page }) => {
  await page.route("**/api/projects", (route) =>
    route.fulfill({ json: projects }),
  );
  await page.route("**/api/profile", (route) =>
    route.fulfill({ json: profile }),
  );
});
test("home, fixed project order, anchor navigation and console-free rendering", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type()))
      errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.locator(".project-card h3")).toHaveText(
    projects.map((p) => p.name),
  );
  for (const [id, label] of [
    ["about", "About"],
    ["projects", "Projects"],
    ["skills", "Skills"],
    ["education", "Education"],
    ["mentoring", "Leadership"],
    ["contact", "Contact"],
  ]) {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: label, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp("#" + id + "$"));
    await expect(page.locator("#" + id)).toBeFocused();
  }
  expect(errors).toEqual([]);
});
test("the scene badge stays fully visible when the desktop artwork changes on hover", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const artwork = page.locator(".static-scene:visible").first();
  const badge = page.locator(".scene-tag:visible").first();
  const badgeInsets = () =>
    badge.evaluate((element) => {
      const badgeBox = element.getBoundingClientRect();
      const sceneBox = element.closest(".scene-shell").getBoundingClientRect();
      return [
        badgeBox.left - sceneBox.left,
        badgeBox.top - sceneBox.top,
        sceneBox.right - badgeBox.right,
        sceneBox.bottom - badgeBox.bottom,
      ].map(Math.round);
    });
  await expect(artwork).toBeVisible();
  await expect(artwork).toHaveJSProperty("naturalWidth", 500);
  await expect(
    badge.getByText("Developer Mode", { exact: true }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(Math.min(...(await badgeInsets()))).toBeGreaterThanOrEqual(0);
  await expect(page.locator(".retro-scene:visible")).toHaveCount(0);
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(artwork).toHaveJSProperty("naturalWidth", 1000);
  const restingInsets = await badgeInsets();
  expect(Math.min(...restingInsets)).toBeGreaterThanOrEqual(0);
  await page.locator(".scene-shell:visible").hover();
  await expect(page.locator(".retro-scene:visible")).toBeVisible();
  expect(await badgeInsets()).toEqual(restingInsets);
});
for (const project of projects)
  test("project route: " + project.name, async ({ page }) => {
    await page.goto("/projects/" + slug(project));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      project.name,
    );
    await expect(
      page.getByRole("heading", { name: "Architecture" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open live demo" }),
    ).toHaveCount(0);
    await page.getByRole("link", { name: "All projects" }).click();
    await expect(page).toHaveURL(/#projects$/);
  });
test("theme respects system and persists across reloads", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
test("keyboard menu searches, traps focus, closes and navigates", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Open command palette/ }).focus();
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: "Game menu" });
  await expect(dialog).toBeVisible();
  await page.getByLabel("Search commands").fill("Krushi");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects\/krushipal$/);
  await expect(dialog).toHaveCount(0);
  await page.getByRole("button", { name: /Open command palette/ }).click();
  for (let i = 0; i < 22; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => !!document.activeElement.closest("dialog")),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /Open command palette/ }),
  ).toBeFocused();
});
test("contact validation, delivery failure and success with preserved draft", async ({
  page,
}) => {
  await page.goto("/#contact");
  const send = page.getByRole("button", { name: "Press start. Say hello." });
  await send.click();
  await expect(page.getByLabel("Your name")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.getByLabel("Your name").fill("QA sender");
  await page.getByLabel("Email address").fill("qa@example.com");
  await page
    .getByLabel("What’s on your mind?")
    .fill("An isolated browser test message.");
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 503,
      json: { error: "Delivery unavailable. Please retry." },
    }),
  );
  await send.click();
  await expect(page.getByRole("alert")).toContainText("Delivery unavailable");
  await expect(page.getByLabel("Your name")).toHaveValue("QA sender");
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 201,
      json: { message: "Message delivered to the test inbox." },
    }),
  );
  await send.click();
  await expect(
    page.getByText("Message delivered to the test inbox."),
  ).toBeVisible();
  await expect(page.getByLabel("Your name")).toHaveValue("");
});
test("resume points to an actual PDF and external links are safe", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const url = await page
    .getByRole("link", { name: "Download resume", exact: true })
    .getAttribute("href");
  const response = await request.get(url);
  expect(response.ok()).toBeTruthy();
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  for (const rel of await page
    .locator('a[target="_blank"]')
    .evaluateAll((links) => links.map((a) => a.rel))) {
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  }
});
test("404 and mobile navigation work", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/missing-level");
  await expect(
    page.getByRole("heading", { name: "Page not found." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Return to title screen" }).click();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Leadership" })
    .click();
  await expect(page).toHaveURL(/#mentoring$/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("API down, slow response, reduced motion and no WebGL retain content", async ({
  page,
}) => {
  await page.route("**/api/**", (route) => route.abort());
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.goto("/");
  await expect(page.locator(".project-card")).toHaveCount(5);
  await expect(
    page.getByText("Showing saved portfolio content."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Retro effects: on" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-effects", "off");
});
test("screenshots gallery opens and closes with keyboard", async ({ page }) => {
  await page.route("**/api/projects", (route) =>
    route.fulfill({
      json: projects.map((p, i) =>
        i === 0
          ? {
              ...p,
              screenshots: [
                {
                  url: "https://fixture.test/shot.png",
                  alt: "Isolated screenshot fixture",
                },
              ],
            }
          : p,
      ),
    }),
  );
  await page.route("https://fixture.test/shot.png", (route) =>
    route.fulfill({ path: "public/og-image.png" }),
  );
  await page.goto("/projects/" + slug(projects[0]));
  await page
    .getByRole("button", { name: "Enlarge: Isolated screenshot fixture" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("admin edits new case-study and profile fields and reads its private inbox", async ({
  page,
}) => {
  let savedProject, savedProfile;
  await page.route("**/api/projects/session", (route) =>
    route.fulfill({ json: { authenticated: true } }),
  );
  await page.route("**/api/projects/" + projects[0]._id, (route) => {
    savedProject = route.request().postDataJSON();
    return route.fulfill({ json: { ...projects[0], ...savedProject } });
  });
  await page.route("**/api/profile", (route) => {
    if (route.request().method() === "PUT")
      savedProfile = route.request().postDataJSON();
    return route.fulfill({ json: savedProfile || profile });
  });
  await page.route("**/api/messages", (route) =>
    route.fulfill({
      json: [
        {
          _id: "test-message",
          name: "QA sender",
          email: "qa@example.com",
          message: "Only an isolated browser fixture.",
          createdAt: "2026-11-21T12:00:00.000Z",
        },
      ],
    }),
  );
  await page.goto("/admin");
  await page
    .getByLabel("Admin key", { exact: true })
    .fill("isolated-browser-fixture");
  await page.getByRole("button", { name: "Open workspace" }).click();
  await page.goto("/admin/projects/" + projects[0]._id + "/edit");
  // Reload intentionally clears the in-memory key; authenticate again on the desired route.
  await page
    .getByLabel("Admin key", { exact: true })
    .fill("isolated-browser-fixture");
  await page.getByRole("button", { name: "Open workspace" }).click();
  await page.getByLabel("My role", { exact: true }).fill("QA role fixture");
  await page
    .getByLabel("Screenshot gallery")
    .fill("https://example.com/shot.webp | A real descriptive caption");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/projects$/);
  expect(savedProject.role).toBe("QA role fixture");
  expect(savedProject.screenshots[0].alt).toBe("A real descriptive caption");
  await page.getByRole("link", { name: "Profile & content" }).click();
  await page
    .getByLabel("Tagline", { exact: true })
    .fill("An isolated updated tagline");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByText(/Profile saved/)).toBeVisible();
  expect(savedProfile.tagline).toBe("An isolated updated tagline");
  await page.getByRole("link", { name: "Contact inbox" }).click();
  await expect(
    page.getByText("Only an isolated browser fixture."),
  ).toBeVisible();
  await page.getByRole("link", { name: "Lock console" }).click();
  await expect(page.getByLabel("Admin key", { exact: true })).toBeVisible();
});
test("static routes contain distinct metadata and content without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const project of projects) {
      await page.goto("http://localhost:5173/projects/" + slug(project));
      await expect(page).toHaveTitle(project.name + " | Shivam Sharma");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        project.name,
      );
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        "content",
        project.name + " | Shivam Sharma",
      );
    }
  } finally {
    await context.close();
  }
});
test("slow 3G renders the title and saved projects before API completion", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "CDP throttling is Chromium-specific.");
  const session = await page.context().newCDPSession(page);
  await session.send("Network.enable");
  await session.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 400,
    downloadThroughput: 50000,
    uploadThroughput: 25000,
  });
  await page.route("**/api/**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await route
      .fulfill({
        json: route.request().url().endsWith("profile") ? profile : projects,
      })
      .catch(() => {});
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Shivam");
  await expect(page.locator(".project-card")).toHaveCount(5);
});
for (const theme of ["dark", "light"])
  for (const route of [
    "/",
    ...projects.map((p) => "/projects/" + slug(p)),
    "/missing-level",
    "/admin",
  ])
    test(`axe ${theme} ${route}`, async ({ page, browserName }) => {
      test.skip(
        browserName !== "chromium",
        "Full route/theme axe matrix runs once on Chromium; interactions run on all engines.",
      );
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(route);
      await page.getByRole("heading", { level: 1 }).first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(result.violations).toEqual([]);
    });
