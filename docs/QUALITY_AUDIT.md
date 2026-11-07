# Evaluation criteria audit — 7 November 2026

This audit uses the six parameters shown in the organizer's evaluation interface. The interface supplies category names, not scoring weights or an algorithm; the assessments below are engineering evidence, not predicted leaderboard scores.

## Criteria and evidence

| Evaluation parameter | Assessment | Evidence and limits |
| --- | --- | --- |
| Code Quality & Clean Architecture | Implemented; automated checks pass | Strict TypeScript, shared typed catalog/model, one workspace state, route modules, reusable controls, pure matching/discovery functions. Removed 21 obsolete CSS rules; moved the stage control out of the tracker route to avoid coupling lazy page modules. |
| Security & Data Sanitization | Hardened; one development-tool advisory remains | React escapes student text; no raw HTML, backend secrets, uploads, or unverified outbound URLs. Stored payload size, percentages, enum values, checklist counts/string lengths, notes, and version are validated. URL filters use allowlists and a bounded query. Production dependency audit: zero reported vulnerabilities. See the development advisory below. |
| Runtime Efficiency & Core Web Vitals | Production budgets verified; field CWV not established | Pages load on demand. Entry JS: 90.4 KiB gzip; all JS: 100.2 KiB; CSS: 10.3 KiB. CI enforces 100/115/12 KiB respective limits. Production Chromium records lab LCP and layout movement. Field LCP/INP/CLS and slow-device/network measurements remain unverified. |
| Component Testing & Reliability | Logic and integrated component behavior tested | 25 unit tests plus 17 passing browser scenarios exercise profile validation, cards, saving/removing, native dialogs, stage controls, documents, notes, storage failures, invalid routes, and the complete persisted journey. Route asset failures now have a reload recovery screen. Browser tests target the production build. There is no separate isolated React component test runner. |
| Accessibility (ARIA & Keyboard Navigation) | Automated and workflow coverage; manual assistive-technology review remains | Native controls and dialog, skip link, route focus management, labeled fields, inline error association, active-stage pressed state, dialog descriptions, focus-visible styles, reduced-motion handling. Browser checks cover keyboard interactions and axe WCAG A/AA rules on five screens at six widths. Automated checks do not certify complete WCAG compliance or screen-reader usability. |
| Technical Specification Alignment | Core MVP implemented and exercised | DISC: search/composed filters/sorts; FIT: editable optional profile and deterministic matched/unknown/mismatch reasons; INFO: details, dates, documents, provider steps; TRACK: save/prepare/apply/decision records, dashboard and persistence; UX: responsive and keyboard workflows. All 12 records remain labeled samples. No invented eligibility scores or provider-side submission claims. |

## Findings and fixes

- **P2 — Unsupported URL filters:** arbitrary URL values could leave controls without a valid selected option and confusing results. `readFilters` now normalizes supported values and caps search input to 200 characters.
- **P2 — Persistence boundary:** coercible numeric strings, oversized checklists, duplicate readiness entries, and large stored payloads needed stricter handling. Validation now rejects ambiguous percentages and bounds parsing/storage work; duplicate document names are normalized.
- **P2 — Production verification gap:** browser tests previously targeted Vite's development server and required manual startup outside CI. The same production preview now starts automatically in local and CI runs unless `BASE_URL` is supplied. The missing `preview` script is included.
- **P2 — Initial loading and recovery:** every page was imported up front and a missing page asset had no recovery UI. Routes now load on demand with a stable loading area and a route error boundary.
- **P2 — Accessibility state:** stage filters now expose pressed state and group context; confirmation dialogs associate their descriptive text.
- **P1 — Measured initial layout movement:** the first production performance run measured 0.11043 cumulative layout movement. Critical body/display fonts now preload and the route loading area keeps the footer below the viewport until content arrives. The rerun measured 0.00017154, with a 512 ms lab LCP on unthrottled CI Chromium. These are single-run lab observations, not field Core Web Vitals.
- **P3 — Obsolete styles:** removed 21 rules referencing deleted disclaimer components and ignored Vite's local cache.

No blocking task-completion defect was found in the audited core journey. This is not a security certification or a claim that an unknown evaluator will award full marks.

## Residual findings

- **P2 — Development dependency advisory:** `npm audit` reports seven moderate package findings arising from one minimatch glob amplification advisory, GHSA-g3hv-75wg-m249, through the current `typescript-eslint` 8.72.1 toolchain. `npm audit --omit=dev` reports zero vulnerabilities. No forced major override or toolchain downgrade was applied; linting processes repository source, not student input. Recheck for a compatible upstream fix before release.
- **Unverified performance:** no field traffic sample or INP measurement, no simulated slow-device Lighthouse run, and no claim of production Core Web Vitals compliance. The current Vercel deployment remains an earlier release because deployments are paused.
- **Unverified accessibility:** manual screen-reader review, browser zoom/text resizing, and non-Chromium browser coverage remain outside the executed checks.
- **Unverified competition outcome:** no evaluator submission, score, or inferred ranking rule is reported.

## Verification

Verified implementation commit: `260eecc23ce14a37986f8c067bc797c0bbdce1d0` (hardening began at `f6aa56c`).

Local checks passed: `npm run typecheck`, `npm run lint`, `npm test` (25 tests), `npm run build`, `npm run check:bundle`, and `git diff --check`.

Production browser verification: **17/17 passed** in [GitHub Actions run 42363623513](https://github.com/ThunderKhan/grantly/actions/runs/42363623513). This includes responsive/axe checks at 320, 375, 640, 768, 1280, and 1440px. Typecheck, lint, all 25 unit tests, production build, and bundle budgets also passed in that run.

The initial run caught the layout movement and an overly strict test locator; the underlying journey and all responsive/axe scenarios passed there. Both failures were resolved and the complete suite rerun. Manual visual browser preview remains unavailable in the agent environment; browser execution evidence comes from CI.

Reproduce locally:

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run check:bundle
npx playwright install chromium
npm run test:e2e
npm audit --omit=dev
```

Deployments remain paused. This audit added no backend, authentication, analytics service, or new package dependency.
