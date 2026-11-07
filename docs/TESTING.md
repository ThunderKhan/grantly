# GRANTLY — Testing & Release Checklist

**Status:** Test specification; no tests reported as run.  
**Related:** [MVP](MVP.md) · [PRD](PRD.md) · [Implementation](IMPLEMENTATION_PLAN.md)

## Quality gates

A submission must be a **working frontend**, not a set of polished static screenshots. Prefer a short, automated unit-test suite for pure logic plus real browser smoke tests for the primary journey.

## 1. Feature acceptance matrix

| Test ID | Action | Expected result |
| --- | --- | --- |
| T01 | Open app on a fresh browser session | Helpful landing state and clear discovery entry point; no crash |
| T02 | Search a known scholarship name | Matching results shown; no unrelated items |
| T03 | Filter by study level, field or region | Results change accordingly; filter state visible |
| T04 | Reset filters | Full catalog and default state restored |
| T05 | Search a nonexistent term | Helpful empty result with reset action |
| T06 | Open a scholarship detail from catalog | Correct ID, provider, deadline, criteria, steps and documents |
| T07 | Change relevant profile field | Matching breakdown updates with specific reasons |
| T08 | Leave optional criterion unanswered | “Needs verification” shown, not fabricated eligibility |
| T09 | Save and unsave an opportunity | Card/detail/tracker/dashboard stay consistent |
| T10 | Change status Saved → Preparing → Applied | User-reported status updates across screens |
| T11 | Refresh after profile, save and status changes | State remains in same browser session/profile |
| T12 | Mark a required document complete (if implemented) | Checklist updates and persists after refresh |
| T13 | Load unknown scholarship ID | Graceful not-found view, with route back to discovery |
| T14 | View an expired or missing deadline | Correct status; no false “due soon” label |
| T15 | Click dashboard next action | Opens the appropriate scholarship/task |
| T16 | Use keyboard-only on form and navigation | Operable controls, sensible focus order, visible focus |
| T17 | View at 375, 768, 1280 and 1440px | Readable UI, no critical clipping/overlap/horizontal overflow |
| T18 | Examine sample data disclaimers | Users are not misled into believing fake opportunities are open |
| T19 | Open direct deep link after deployment / refresh | App loads, with no hosting 404 |
| T20 | Production build + browser console | Build succeeds; no blocking runtime errors |

## 2. Unit tests (small, high-value set)

Write tests for pure functions such as:

- Match when known profile field equals a supported criterion.
- Unknown profile criterion is `unknown`, not `match`.
- Genuine nonmatch is `possible_mismatch` with a readable reason.
- Mixed criteria retain individual explanations.
- Filters compose; reset removes all active constraints.
- Deadline ordering handles missing and expired dates consistently.
- Stage transition and summary counters derive from one source of truth.
- Corrupted or old-version localStorage payload does not crash the UI.

Use a lightweight test runner (e.g. Vitest if appropriate) and avoid expensive infrastructure.

## 3. Browser smoke path

1. Load application.
2. Fill in/edit sample profile.
3. Discover, search, filter and inspect two scholarships.
4. Save one, update its stage and optional checklist.
5. Return to dashboard and applications.
6. Refresh; verify persisted state.
7. Inspect mobile menu and responsive layouts.
8. Navigate via keyboard; check accessible labels and focus.
9. Verify outbound links and data disclaimers.
10. Review browser console and deployed URL.

Where browser automation exists, automate steps 1–6 first; do not mark them passed without running tests.

## 4. Status reporting

For each gate record **Pass / Fail / Not run** with an actual test command, commit and timestamp where possible. Do not conflate “written test”, “CI green”, “deployed” and “browser-verified” as equivalent.

| Gate | Status at documentation creation |
| --- | --- |
| Typecheck / lint / build | Not run |
| Unit tests | Not run |
| Browser functional smoke | Not run |
| Mobile / responsive audit | Not run |
| Accessibility audit | Not run |
| Public deployment | Not verified |
| Evaluator submission | Not performed |

## 5. Submission release rules

Before any scored submission: build must pass, the site must load, top-to-bottom core journey must work and sample data must be labeled. After a scoring change, record the previous and new commit IDs and validate that new polish did not break a previously passing flow.

Confirm the organizers' actual submission limits and ranking rule (best vs latest score), rather than relying on older competitions.
