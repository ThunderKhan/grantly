# GRANTLY — Minimum Viable Product (MVP)

**Status:** Specification, not an implementation report.  
**Challenge:** Frontend Arena — THE OUTPOST 2026, Track 1.  
**Related:** [Idea](ideas.md) · [PRD](PRD.md) · [Implementation](IMPLEMENTATION_PLAN.md) · [Testing](TESTING.md)

## Objective

Build a usable **scholarship discovery-to-application-management journey** that students can understand and complete without external tools. This is a frontend-only MVP; it does not submit official applications, verify provider eligibility, or require an account.

> **One-line experience:** Build a lightweight student profile → find a relevant scholarship → see why it may fit → review requirements → save and track preparation → see the next action.

## Non-negotiable MVP (P0)

| ID | Capability | Functional acceptance |
| --- | --- | --- |
| MVP-01 | Student profile | Student can enter/edit education level, field, location and optional criteria, skip unknown values, and save locally. |
| MVP-02 | Discover | A usable scholarship catalog with real in-app search by title/provider/field, filters and sort. Results actually change. |
| MVP-03 | Detail | Each card opens a details screen with amount/benefits, provider, eligibility, documents, deadline and application steps. |
| MVP-04 | Explainable fit | Rules compare structured criteria to known profile fields and show **match / needs verification / possible mismatch** with reasons. |
| MVP-05 | Saved scholarships | Save/unsave is consistent across detail, discovery and tracker; persists after refresh. |
| MVP-06 | Application tracker | Move a saved scholarship through **Saved → Preparing → Applied → Decision received**; status is explicitly self-reported. |
| MVP-07 | Next actions & deadline | Show approaching due dates and an actionable next step; missing/expired deadlines are handled transparently. |
| MVP-08 | Unified dashboard | Show meaningful summary of saved items, preparing/applied states, deadlines and next tasks, linking to real details. |
| MVP-09 | Responsive & accessible | Core journey works at narrow/mobile and desktop widths with keyboard-operable controls and labeled forms. |
| MVP-10 | Robust demo | No dead buttons, broken routes, build errors or misleading claims about actual applications or real scholarships. |

## Priority P1: polish after P0

- Document preparation checklist persisted per scholarship.
- Filter reset, empty states, clear error/confirmation feedback.
- Better opportunity comparison (only if it directly helps choosing).
- Keyboard and screen-reader refinements; pleasant microinteractions.
- Clear onboarding completion and editable profile.

## Explicitly deferred (P2 / out of scope)

- Registration/login, password or OAuth, backend/database, cross-device sync.
- Real application submissions, actual provider-side status tracking.
- Automated scraping, comprehensive live scholarship feeds, unverified external links.
- AI chatbot, invented “match percentages,” payment processing or document uploads.
- Complex calendar integrations and email/SMS reminders.

## Application states

- **Saved:** interested, not preparing yet.
- **Preparing:** gathering requirements before applying through official channels.
- **Applied:** user says an application was submitted externally; GRANTLY does not validate it.
- **Decision received:** user logs an outcome; no provider synchronization.

Remove/unsave policies must be consistent and make destructive changes clear. Separate “saved scholarship” from an externally submitted application.

## Example end-to-end walkthrough

1. Open the application with a blank/new local profile; enter undergraduate, a study field and location.
2. Discover relevant scholarships, search, apply filters, clear them.
3. Open one detail; inspect matching and unknown criteria without unjustified certainty.
4. Save the scholarship; mark an optional required document as ready; set stage to Preparing.
5. Return to the dashboard and see a changed summary and next action.
6. Refresh; verify profile and application state persisted.
7. Repeat on mobile viewport using keyboard/tab navigation as feasible.

## Data and honesty contract

Use **clearly labeled illustrative sample scholarships**, or source-verified real entries. A mock deadline, benefit or provider must never be passed off as a verified open funding opportunity. Match status is an informational heuristic, not a final eligibility decision. Do not claim authentication, cloud backup or a real application submission.

## Release gate

Ready for the *first* competition evaluation only when each P0 item has a corresponding working UI flow, the production build succeeds, and a browser smoke test passes. Submit early enough to learn from the evaluator subject to the published attempt rules. See [TESTING.md](TESTING.md) and [DEMO.md](DEMO.md).
