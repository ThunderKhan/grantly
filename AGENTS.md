# GRANTLY — Coding Agent Instructions

## Mission

Build **GRANTLY**, a student-first scholarship discovery and management platform for Frontend Arena's THE OUTPOST 2026, Track 1. Above all, solve the official problem: **find relevant opportunities, understand them, navigate application steps and track important information in a seamless student journey.**

## Mandatory reading order

1. `docs/ideas.md` — problem, concept and differentiator.
2. `docs/MVP.md` — minimum shippable scope and release gate.
3. `docs/PRD.md` — functional acceptance criteria.
4. `docs/IMPLEMENTATION_PLAN.md` — timeboxed execution order.
5. `docs/UI_UX.md` — interaction, information architecture and accessibility.
6. `docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/SECURITY.md`, `docs/DEMO.md`, `docs/RUNBOOK.md`.
7. **User-supplied design.md when added** — authoritative visual style; do not invent or overwrite it.

## Execution rules

- **Implement, don't just document.** A requirement is not done until working code is verified.
- **No real authentication or backend** unless the user or official rules explicitly change scope. Student profiles are local demo state, not accounts.
- **No fake functionality.** Every button, tab, filter, save action, badge and dashboard metric must correspond to actual behavior/data.
- **No fabricated financial information.** Label illustrative scholarships prominently; do not assert they are open or verified.
- **Explain eligibility.** Rule-based match / unknown / possible mismatch with specific reasons, not opaque or arbitrary percentages or eligibility guarantees.
- **One shared state.** Changes to profile, saved items and application stage must propagate to relevant screens and persist safely.
- **Protect privacy.** No secrets, sensitive real documents or misleading secure-account claims in frontend code/localStorage.
- **Accessible by default.** Semantic controls, proper labels, visible focus, responsive layout, reduced motion.
- **Problem alignment first.** Avoid unnecessary pages, animations, API integrations or unrelated features until MVP is complete.
- **Keep tests and claims honest.** Run production build and core browser flow; distinguish pass/fail/not run and don't invent proof.
- **Do not assume leaderboard rules.** Check the current event's attempt limit and latest-vs-best-score policy.
- **Respect the event window.** Any competition code must be produced in accordance with the organizer's timing and reuse rules.
- **Preserve existing repo work and docs.** Inspect before modifying; keep changes focused and reversible.

## Finish criteria

The end-to-end student journey must work: **profile → discover → detail and fit explanation → save → prepare/track → dashboard → refresh/persistence**, including responsive and accessible behavior. A polished homepage without that workflow is insufficient.
