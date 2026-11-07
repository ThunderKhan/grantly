import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const key = "grantly:demo:v1";
test("complete profile → discovery → eligibility → save → documents → stage → dashboard → persistence journey", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Big dreams deserve a clear next step.",
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
    page.getByRole("link", { name: "In preparation 01", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(".deadline-list").getByText("Next Gen Tech Scholarship"),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Your next chapter, Demo Learner." }),
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
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText(
    "Saved data could not be read",
  );
  await expect(
    page.getByRole("heading", {
      name: "Big dreams deserve a clear next step.",
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

for (const width of [375, 768, 1280, 1440]) {
  test(`responsive layouts and WCAG checks at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
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
