import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const key = "grantly:demo:v1";
test("complete profile → discovery → eligibility → save → documents → stage → dashboard → persistence journey", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", {
      name: "Your scholarship workspace.",
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "My profile", exact: true }).click();
  await page.getByLabel("Preferred name").fill("Demo Learner");
  await page
    .getByRole("combobox", { name: "Education level", exact: true })
    .selectOption("Undergraduate");
  await page
    .getByRole("combobox", { name: "Field of study", exact: true })
    .selectOption("Computer science");
  await page
    .getByRole("combobox", { name: "State of residence", exact: true })
    .selectOption("Uttar Pradesh");
  await page.getByRole("spinbutton").fill("80");
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await expect(
    page.getByText("Profile saved. Matching has been updated."),
  ).toBeVisible();
  await page.getByRole("link", { name: "Discover", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search scholarships" })
    .fill("Next Gen Tech Scholarship");
  await expect(page.locator("article")).toHaveCount(1);
  await page
    .getByRole("combobox", { name: "Education level", exact: true })
    .selectOption("Undergraduate");
  await expect(page.locator("article")).toHaveCount(1);
  await page
    .getByRole("link", { name: "Next Gen Tech Scholarship", exact: true })
    .click();
  await expect(
    page.getByText("Your household income band is unknown.", { exact: false }),
  ).toBeVisible();
  await expect(page.locator(".criterion.match")).toHaveCount(3);
  await expect(page.locator(".criterion.unknown")).toHaveCount(1);
  await page
    .getByRole("button", {
      name: "Save Next Gen Tech Scholarship",
      exact: true,
    })
    .click();
  await page
    .getByRole("checkbox", { name: "Latest academic transcript", exact: true })
    .check();
  await page
    .getByRole("combobox", {
      name: "Application stage for Next Gen Tech Scholarship",
    })
    .selectOption("preparing");
  await page
    .getByRole("textbox", { name: "Personal notes" })
    .fill("Demo: confirm income criterion.");
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "In preparation 1", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(".deadline-list").getByText("Next Gen Tech Scholarship"),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Your scholarships, Demo Learner." }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "My Applications 1", exact: true })
    .click();
  await expect(
    page.getByRole("combobox", {
      name: "Application stage for Next Gen Tech Scholarship",
    }),
  ).toHaveValue("preparing");
  await expect(page.getByText("1 / 4 documents ready")).toBeVisible();
  await page.getByRole("link", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("checkbox", {
      name: "Latest academic transcript",
      exact: true,
    }),
  ).toBeChecked();
  await expect(
    page.getByRole("textbox", { name: "Personal notes" }),
  ).toHaveValue("Demo: confirm income criterion.");
  await page
    .getByRole("combobox", {
      name: "Application stage for Next Gen Tech Scholarship",
    })
    .selectOption("applied");
  await expect(
    page.getByRole("heading", {
      name: "Check the provider for a decision and update your stage.",
    }),
  ).toBeVisible();
  await page
    .getByRole("combobox", {
      name: "Application stage for Next Gen Tech Scholarship",
    })
    .selectOption("decision_received");
  await expect(
    page.getByRole("heading", {
      name: "Record your outcome in your personal notes.",
    }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Update your matching profile", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "Household income band", exact: true })
    .selectOption("Up to ₹2.5 lakh");
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await page.goto("/scholarships/next-gen-tech");
  await expect(page.locator(".criterion.match")).toHaveCount(4);
  await page
    .getByRole("button", {
      name: "Remove Next Gen Tech Scholarship",
      exact: true,
    })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Keep it", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(errors).toEqual([]);
});

test("search, composed filters, reset, sorting, expired and missing deadlines", async ({
  page,
}) => {
  await page.goto("/discover");
  await expect(page.locator("article")).toHaveCount(12);
  await page
    .getByRole("textbox", { name: "Search scholarships" })
    .fill("no-such-opportunity");
  await expect(
    page.getByRole("heading", { name: "Let’s widen the search." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset search & filters" }).click();
  await expect(page.locator("article")).toHaveCount(12);
  await page
    .getByRole("combobox", { name: "Education level", exact: true })
    .selectOption("Postgraduate");
  await expect(page.locator("article")).toHaveCount(4);
  await page
    .getByRole("combobox", { name: "Field of study", exact: true })
    .selectOption("Science");
  await expect(page.locator("article")).toHaveCount(2);
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.locator("article")).toHaveCount(12);
  await page
    .getByRole("combobox", { name: "Sort by", exact: true })
    .selectOption("award");
  await expect(page.locator("article").first()).toContainText(
    "Science Forward Fellowship",
  );
  await page
    .getByRole("combobox", { name: "Deadline", exact: true })
    .selectOption("expired");
  await expect(page.locator("article")).toHaveCount(1);
  await expect(page.locator("article")).toContainText("Deadline passed");
  await page
    .getByRole("combobox", { name: "Deadline", exact: true })
    .selectOption("unknown");
  await expect(page.locator("article")).toHaveCount(1);
  await expect(page.locator("article")).toContainText("Deadline not specified");
  await page.goto("/scholarships/does-not-exist");
  await expect(
    page.getByRole("heading", { name: "This opportunity isn’t here." }),
  ).toBeVisible();
  await page.goto("/not-a-route");
  await expect(
    page.getByRole("heading", { name: "A small detour." }),
  ).toBeVisible();
});

test("storage corruption and denied storage recover without a crash", async ({
  page,
  context,
}) => {
  await context.addInitScript(
    ({ key }) => localStorage.setItem(key, "{corrupted"),
    { key },
  );
  await page.goto("/dashboard");
  await expect(page.getByRole("alert")).toContainText(
    "Saved data could not be read",
  );
  await expect(
    page.getByRole("heading", {
      name: "Your scholarship workspace.",
    }),
  ).toBeVisible();
  await page.goto("/discover");
  await page
    .getByRole("button", {
      name: "Save Next Gen Tech Scholarship",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("link", { name: "My Applications 1", exact: true }),
  ).toBeVisible();
});

test("blocked storage remains usable and announces session-only persistence", async ({
  page,
  context,
}) => {
  await context.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    });
  });
  await page.goto("/discover");
  await page
    .getByRole("button", {
      name: "Save Next Gen Tech Scholarship",
      exact: true,
    })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "Browser storage is unavailable",
  );
  await expect(
    page.getByRole("link", { name: "My Applications 1", exact: true }),
  ).toBeVisible();
});

for (const width of [320, 375, 640, 768, 1280, 1440]) {
  test(`responsive layouts and WCAG checks at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/dashboard",
      "/discover",
      "/profile",
      "/scholarships/next-gen-tech",
      "/applications",
    ]) {
      await page.goto(path);
      await expect(
        page.locator("main h1, main .empty h2").first(),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${path} overflows at ${width}`,
      ).toBe(true);
      if (width <= 375) {
        const smallText = await page
          .locator("main p,main label,main small,main .text-link,nav a")
          .evaluateAll((elements) =>
            elements
              .filter(
                (e) =>
                  e.getClientRects().length &&
                  e.textContent?.trim() &&
                  parseFloat(getComputedStyle(e).fontSize) < 14,
              )
              .map((e) => e.textContent?.trim()),
          );
        expect(smallText, `${path} has unreadable mobile text`).toEqual([]);
        const smallControls = await page
          .locator("main button")
          .evaluateAll((elements) =>
            elements
              .filter(
                (e) =>
                  e.getClientRects().length &&
                  (e.getBoundingClientRect().width < 44 ||
                    e.getBoundingClientRect().height < 44),
              )
              .map(
                (e) => e.getAttribute("aria-label") || e.textContent?.trim(),
              ),
          );
        expect(smallControls, `${path} has undersized mobile buttons`).toEqual(
          [],
        );
      }
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          description: v.description,
          nodes: v.nodes.map((n) => n.target),
        })),
        `${path} at ${width}px`,
      ).toEqual([]);
    }
  });
}

test("keyboard navigation and removing a scholarship", async ({ page }) => {
  await page.goto("/discover");
  await page.getByRole("textbox", { name: "Search scholarships" }).focus();
  await page.keyboard.type("Next Gen Tech Scholarship");
  await expect(page.locator("article")).toHaveCount(1);
  await page
    .getByRole("button", {
      name: "Save Next Gen Tech Scholarship",
      exact: true,
    })
    .focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", {
      name: "Remove Next Gen Tech Scholarship",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page
    .getByRole("link", { name: "My Applications 1", exact: true })
    .click();
  await expect(page.locator(".tracker-card")).toHaveCount(1);
  await page
    .getByRole("button", {
      name: "Remove Next Gen Tech Scholarship",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Confirm removal" }).click();
  await expect(
    page.getByRole("heading", { name: "Your shortlist starts here." }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Your shortlist starts here." }),
  ).toBeVisible();
});

test("mobile search, expandable filters, saving and preparation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/discover");
  await page.getByRole("button", { name: "Show filters", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Education level", exact: true })
    .selectOption("Undergraduate");
  await expect(page.locator("article")).toHaveCount(10);
  await page.getByRole("button", { name: "Hide filters", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search scholarships" })
    .fill("Next Gen Tech Scholarship");
  await expect(page.locator("article")).toHaveCount(1);
  await page
    .getByRole("link", { name: "Next Gen Tech Scholarship", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Next Gen Tech Scholarship",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Start preparing", exact: true })
    .click();
  await expect(
    page.getByRole("combobox", {
      name: "Application stage for Next Gen Tech Scholarship",
    }),
  ).toHaveValue("preparing");
  await page
    .getByRole("checkbox", { name: "Proof of enrollment", exact: true })
    .check();
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: "Proof of enrollment", exact: true }),
  ).toBeChecked();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("profile validation explains invalid marks and workspace reset uses specific actions", async ({
  page,
}) => {
  await page.goto("/profile");
  await page.getByRole("spinbutton").fill("101");
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText(
    "Enter a percentage from 0 to 100, or leave this blank.",
  );
  await expect(page.getByRole("spinbutton")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.getByRole("spinbutton").fill("80");
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await expect(
    page.getByText("Profile saved. Matching has been updated."),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reset entire workspace", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Reset your local workspace?" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Keep workspace", exact: true })
    .click();
  await expect(page.getByRole("spinbutton")).toHaveValue("80");
});

test("long names, full catalog, and dialog names remain usable on mobile", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await context.addInitScript(
    ({ key }) =>
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          profile: {
            name: "A".repeat(60),
            level: "",
            field: "",
            region: "",
            marks: "",
            income: "",
          },
          tracked: Object.fromEntries(
            [
              "next-gen-tech",
              "open-doors",
              "science-forward",
              "homegrown-talent",
              "creative-futures",
              "first-step",
              "care-in-action",
              "business-builders",
              "western-horizons",
              "learning-without-limits",
              "capital-scholars",
              "southern-innovators",
            ].map((id) => [
              id,
              {
                stage: "saved",
                documents: [],
                notes: "",
                updated: "2026-11-07T12:00:00Z",
              },
            ]),
          ),
        }),
      ),
    { key },
  );
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Your shortlist is complete." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/discover");
  await page
    .getByRole("button", {
      name: "Remove Open Doors Education Grant",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Remove this opportunity?" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText(
    "This removes Open Doors Education Grant",
  );
  await page.keyboard.press("Escape");
});

test("untrusted strings remain text and invalid URL options recover", async ({
  page,
}) => {
  const payload = '<img src=x onerror="window.__injected=true">';
  await page.addInitScript((text) => {
    if (!localStorage.getItem("grantly:demo:v1"))
      localStorage.setItem(
        "grantly:demo:v1",
        JSON.stringify({
          version: 1,
          profile: {
            name: text,
            level: "",
            field: "",
            region: "",
            marks: "",
            income: "",
          },
          tracked: {
            "next-gen-tech": {
              stage: "saved",
              documents: [],
              notes: text,
              updated: "2026-11-07T00:00:00Z",
            },
          },
        }),
      );
  }, payload);
  await page.goto("/scholarships/next-gen-tech");
  await expect(
    page.getByRole("textbox", { name: "Personal notes" }),
  ).toHaveValue(payload);
  await expect(page.locator(".profile-link")).toContainText(payload);
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
  expect(await page.evaluate(() => Object.hasOwn(window, "__injected"))).toBe(
    false,
  );
  await page.goto(
    "/discover?level=invalid&sort=javascript%3Aalert(1)&deadline=never",
  );
  await expect(
    page.getByRole("combobox", { name: /^Education level/ }),
  ).toHaveValue("");
  await expect(page.getByLabel("Sort by")).toHaveValue("relevance");
  await expect(page.locator(".scholarship-card")).toHaveCount(12);
});

test("route navigation moves focus and failed route assets have recovery", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Your scholarship workspace." }),
  ).toBeVisible();
  await page.route("**/assets/Profile-*.js", (route) => route.abort());
  await page.getByRole("link", { name: "My profile", exact: true }).click();
  await expect(page.locator("#main-content")).toBeFocused();
  await expect(
    page.getByRole("heading", { name: "This page couldn’t load." }),
  ).toBeVisible();
  await page.unroute("**/assets/Profile-*.js");
  await page.getByRole("button", { name: "Reload page" }).click();
  await expect(
    page.getByRole("heading", { name: "Student profile", exact: true }),
  ).toBeVisible();
});

for (const path of ["/", "/discover"]) {
  test(`production ${path} records lab paint and layout stability`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript(() => {
      const metrics = {
        lcpMs: 0,
        cumulativeLayoutShift: 0,
        shifts: [] as { value: number; nodes: string[] }[],
      };
      Object.assign(window, { grantlyLabMetrics: metrics });
      new PerformanceObserver((list) => {
        metrics.lcpMs = list.getEntries().at(-1)?.startTime ?? 0;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            hadRecentInput: boolean;
            value: number;
            sources?: { node?: Element }[];
          };
          if (!shift.hadRecentInput) {
            metrics.cumulativeLayoutShift += shift.value;
            metrics.shifts.push({
              value: shift.value,
              nodes: (shift.sources ?? []).map(
                (source) => source.node?.tagName + "." + source.node?.className,
              ),
            });
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(path);
    await expect(page.locator("main h1")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    // Allow the browser to paint the settled font/layout before collecting observations.
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    const metrics = await page.evaluate(
      () =>
        (
          window as unknown as {
            grantlyLabMetrics: { lcpMs: number; cumulativeLayoutShift: number };
          }
        ).grantlyLabMetrics,
    );
    console.log(
      "Production lab metrics (unthrottled Chromium, not field Core Web Vitals):",
      JSON.stringify(metrics),
    );
    await testInfo.attach("production-lab-metrics", {
      body: JSON.stringify(metrics),
      contentType: "application/json",
    });
    expect(metrics.lcpMs).toBeGreaterThan(0);
    expect(metrics.cumulativeLayoutShift).toBeLessThan(0.1);
  });
}

test("landing page connects discovery, saving, subjects and the workspace without a Home navigation item", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Find a scholarship.",
  );
  await expect(page).toHaveTitle(
    "Scholarships, explained and organized — GRANTLY",
  );
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("link")).toHaveCount(3);
  await expect(nav.getByRole("link", { name: /Home|Landing/ })).toHaveCount(0);
  await page
    .locator(".landing-opportunity")
    .getByRole("button", { name: /^Save / })
    .click();
  await page
    .getByRole("link", { name: "Continue your workspace", exact: true })
    .click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("link", { name: "Saved opportunities 1", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Grantly home", exact: true }).click();
  await page
    .getByRole("link", { name: "Computer science", exact: true })
    .click();
  await expect(page).toHaveURL(/field=Computer/);
  await page.getByRole("button", { name: "Show filters", exact: true }).click();
  await expect(
    page.getByRole("combobox", { name: /^Field of study/ }),
  ).toHaveValue("Computer science");
  await page.getByRole("link", { name: "Grantly home", exact: true }).click();
  await page
    .getByRole("link", { name: "See requirements", exact: true })
    .click();
  await expect(page).toHaveURL(/\/scholarships\//);
  await expect(
    page.getByRole("heading", { name: "Why this may fit you", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Grantly home", exact: true }).click();
  await page
    .getByRole("link", { name: "Build your student profile", exact: true })
    .click();
  await expect(page).toHaveURL(/\/profile$/);
  expect(errors).toEqual([]);
});

for (const width of [375, 1280]) {
  test(`motion preserves stage filtering and document progress at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/discover");
    await expect(page.locator("article")).toHaveCount(12);
    const first = page
      .locator("article")
      .filter({
        has: page.getByRole("link", {
          name: "Next Gen Tech Scholarship",
          exact: true,
        }),
      });
    await first.getByRole("button", { name: /^Save / }).click();
    await page
      .getByRole("link", { name: "Next Gen Tech Scholarship", exact: true })
      .click();
    const progress = page.getByRole("progressbar", {
      name: "Document readiness",
      exact: true,
    });
    await expect(progress).toHaveAttribute("aria-valuenow", "0");
    await page
      .getByRole("checkbox", {
        name: "Latest academic transcript",
        exact: true,
      })
      .check();
    await expect(progress).toHaveAttribute("aria-valuenow", "1");
    await expect(progress).toHaveAttribute(
      "aria-valuetext",
      "1 of 4 documents ready",
    );
    await expect
      .poll(async () =>
        progress
          .locator("circle")
          .last()
          .evaluate((el) =>
            Math.round(parseFloat(getComputedStyle(el).strokeDashoffset)),
          ),
      )
      .toBe(212);
    await page
      .getByRole("link", { name: "My Applications 1", exact: true })
      .click();
    await page.getByRole("button", { name: /^Preparing/ }).click();
    await expect(
      page.getByRole("heading", {
        name: "Nothing at this stage.",
        exact: true,
      }),
    ).toBeVisible();
    await page.getByRole("button", { name: /^Saved/ }).click();
    await expect(page.locator(".tracker-card")).toHaveCount(1);
    await expect
      .poll(async () =>
        page.evaluate(() => {
          const tab = document
            .querySelector('.stage-tabs button[aria-pressed="true"]')!
            .getBoundingClientRect();
          const indicator = document
            .querySelector(".stage-indicator")!
            .getBoundingClientRect();
          return (
            Math.abs(tab.left - indicator.left) +
            Math.abs(tab.width - indicator.width) +
            Math.abs(tab.bottom + 3 - indicator.top)
          );
        }),
      )
      .toBeLessThan(2);
    await page.reload();
    await expect(
      page.getByRole("progressbar", {
        name: "Documents ready for Next Gen Tech Scholarship",
      }),
    ).toHaveAttribute("aria-valuenow", "1");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test("reduced motion removes animated movement and counters update immediately", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/discover");
  await expect(page.locator("article")).toHaveCount(12);
  const running = () =>
    page.evaluate(
      () =>
        document.getAnimations().filter((a) => a.playState === "running")
          .length,
    );
  expect(await running()).toBe(0);
  await page
    .getByRole("textbox", { name: "Search scholarships" })
    .fill("next gen");
  await expect(page.locator("article")).toHaveCount(1);
  await page
    .getByRole("button", {
      name: "Save Next Gen Tech Scholarship",
      exact: true,
    })
    .click();
  expect(await running()).toBe(0);
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Saved opportunities 1", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".number-ticker").first()).toHaveText("1");
  await page
    .locator(".cards-grid")
    .getByRole("button", { name: /^Save / })
    .first()
    .click();
  await expect(
    page.getByRole("link", { name: "Saved opportunities 2", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".number-ticker").first()).toHaveText("2");
  expect(await running()).toBe(0);
  await page.getByRole("link", { name: "Discover", exact: true }).click();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page
    .getByRole("textbox", { name: "Search scholarships" })
    .fill("next gen");
  await page.getByRole("textbox", { name: "Search scholarships" }).clear();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("article")).toHaveCount(12);
  await expect.poll(running).toBe(0);
  const transforms = await page
    .locator(".motion-item")
    .evaluateAll((els) => els.map((el) => getComputedStyle(el).transform));
  expect(transforms.every((t) => t === "none")).toBe(true);
});
