# GRANTLY

A student-first scholarship workspace for Frontend Arena’s THE OUTPOST 2026. Find opportunities, understand each eligibility requirement, prepare documents, and manage the next step in one connected frontend.

## Run locally

Node.js 24 recommended (22.12+ supported).

```sh
npm ci
npm run dev
```

## Check the implementation

```sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

For browser tests outside CI, start the dev server at port 4173 (`npm run dev -- --port 4173`), or set `BASE_URL` to a running deployment. Set `CHROMIUM_PATH` only to use an existing system Chromium. In CI the test configuration starts Vite automatically. The GitHub workflow runs unit, build, and Playwright acceptance checks, including axe WCAG scans at 375, 768, 1280, and 1440px.

## Working experience

- **Dashboard `/`**: derived application counts, actionable reminders, saved deadlines, and profile-based recommendations.
- **Discover `/discover`**: search, composed filters, relevance/deadline/award ordering, and shareable filter URLs.
- **Details `/scholarships/:id`**: benefit, criteria, matched/unknown/mismatch explanations, preparation steps, persistent document readiness and personal notes.
- **Applications `/applications`**: stage filters and reversible Saved → Preparing → Applied → Decision received updates.
- **Profile `/profile`**: optional matching fields, validation, clear-form and confirmed workspace reset.

React 19 + TypeScript + Vite, React Router, Tailwind CSS 4, Lucide icons, self-hosted Titillium Web and Inter. The design follows `docs/design.md`; all original product contracts remain in `docs/`.

## Data and privacy

All 12 scholarship records, providers, benefits, rules, and deadlines are **illustrative samples**, prominently labeled throughout the interface. They are not verified funding opportunities. Sample records have no invented official application links. The catalog includes expired and unspecified deadlines and non-cash benefits to exercise real edge cases.

Matching is deterministic: each known answer is compared with a stated requirement, while missing answers remain unknown. There are no arbitrary percentages or official eligibility guarantees. Relevance ordering prioritizes known matches and penalizes known mismatches; the full explanation stays inspectable.

One shared React workspace persists versioned, validated data under `grantly:demo:v1`. No backend, accounts, cloud sync, uploads, or applications are sent. Storage failure is announced and the app remains usable. Removing an opportunity clears its checklist and notes after confirmation. Resetting the workspace clears all local progress after confirmation.

## Deploy

Vercel detects the Vite build; `vercel.json` supplies SPA deep-link fallback. No environment secrets are required. Deploy the implementation branch or merge it into the production branch after review.

## Judge walkthrough

1. Edit your profile: Undergraduate, Computer science, Uttar Pradesh, 80%; leave income unknown.
2. Search for **Next Gen Tech Scholarship** and open it.
3. Inspect three matched requirements and one unknown income requirement.
4. Save it, check a document, and change the stage to Preparing.
5. Return to the dashboard: the preparation count, deadline, and next action update.
6. Refresh and verify that the profile, checklist, stage, and notes persist.
7. Add an income band to the profile and reopen the scholarship to see its explanation change.

Competition submission rules, available attempts, ranking mechanics, and organizer extensions must be confirmed on the official platform before submission. The repository alone is not evidence of an evaluator score.
