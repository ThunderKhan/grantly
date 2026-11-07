# GRANTLY — Product Requirements Document (PRD)

**Status:** Proposed product requirements  
**Source of truth:** The official GRANTLY challenge as transcribed in [ideas.md](ideas.md). This document translates its four named problems into verifiable behaviors.  
**Other contracts:** [MVP](MVP.md) · [UI/UX](UI_UX.md) · [Architecture](ARCHITECTURE.md) · [Testing](TESTING.md)

## 1. Problem and outcome

Students face an interrupted experience across discovery, interpretation, preparation and tracking. GRANTLY creates one coherent interface to find scholarships, assess possible fit and manage the personal application workflow.

### Success statement

A first-time user can find a plausible opportunity, understand which criteria are satisfied or unknown, save it, see the application steps, move it to Preparing and find its next action on the dashboard — with no broken or fake interactions.

### Non-goals

Not an official scholarship registry, authoritative eligibility adjudicator, application portal, financial adviser, real-time deadline validator or identity service.

## 2. Users and needs

| Persona | Need | Key experience |
| --- | --- | --- |
| Exploring student | What funding could fit my studies? | Discover, filter, inspect opportunities |
| Ready-to-apply student | What do I need to prepare? | Detail, checklist, track next action |
| Student managing several applications | What is due or unfinished? | Dashboard, deadlines and status tracker |

A student may not know an answer (e.g. household-income band). Unknown must be a supported value, never a silent failure.

## 3. Functional requirements

Each requirement is independently testable.

### Discovery (DISC)

- **DISC-01:** Search scholarship title/provider/subject, case-insensitively, and provide empty-state feedback.
- **DISC-02:** Filter available data on education level, field, region and relevant attributes. Filters must have active state and clear/reset behavior.
- **DISC-03:** Sort by deadline, potential relevance or award where data is comparable. Missing values must not be silently coerced to zero.
- **DISC-04:** Each card exposes its title, provider, benefit/award, deadline or unknown label, brief purpose, and action to view/save.
- **DISC-05:** A user can inspect opportunities without submitting sensitive personal fields.

### Profile & fit (FIT)

- **FIT-01:** Offer a concise, editable profile: education level, field, region, plus optional criteria if present in dataset.
- **FIT-02:** Compare known profile values against structured scholarship criteria using deterministic rules.
- **FIT-03:** Show each assessed criterion's explanation and a state: matched, needs verification/unknown, or potential mismatch.
- **FIT-04:** Changes in profile update relevant results and fit details consistently.
- **FIT-05:** Never claim official eligibility or fabricate a confidence percentage. Show what information is missing.

### Details & application guidance (INFO)

- **INFO-01:** Detail page presents name, provider, purpose, award/benefits, deadline, eligibility, required documents and action sequence.
- **INFO-02:** Display external source/application link only when it points to an actual verified or clearly labeled demonstration destination.
- **INFO-03:** Explain what needs to happen on the scholarship provider's website. GRANTLY itself does not submit applications.
- **INFO-04:** Date formatting is understandable and treats past, future and missing deadlines explicitly.

### Save, prepare, track (TRACK)

- **TRACK-01:** Users can save and unsave scholarships; state is consistent on all screens.
- **TRACK-02:** Tracked items have one stage: Saved, Preparing, Applied or Decision received, with meaningful empty states.
- **TRACK-03:** Users explicitly change stage; “Applied” means self-reported action outside GRANTLY.
- **TRACK-04:** Checklist completion, if implemented, persists per scholarship.
- **TRACK-05:** Personal dashboard summarizes tracked applications, upcoming deadlines and useful next actions; each summary navigates somewhere meaningful.
- **TRACK-06:** Profile, saved items and stage progress persist across refresh in the same browser, with an accessible reset option.

### Usability & accessibility (UX)

- **UX-01:** Core navigation is consistent and responsive.
- **UX-02:** All actionable controls provide visual states (hover, focus, selected, disabled when necessary).
- **UX-03:** Buttons act, forms submit or validate, links navigate; no decorative pseudo-actions.
- **UX-04:** Use semantic headings, labels, focus indicators, descriptive button names and sufficient contrast.
- **UX-05:** Support reduced-motion preference when adding animation and keep the main workflow usable without animations.
- **UX-06:** Show a clear sample-data/demo disclaimer.

## 4. Requirement traceability to the challenge

| Official problem | Product requirements | Demo evidence |
| --- | --- | --- |
| Finding relevant opportunities | DISC-01–05; FIT-01–04 | Search, filter and personalized discovery |
| Understanding available options | INFO-01–04; FIT-02–05 | Detail page and transparent criteria |
| Navigating application processes | INFO-01–03; TRACK-02–04 | Steps, checklist and stage change |
| Keeping track of information | TRACK-01–06 | Saved, dashboard, persisted deadlines |
| Simpler, intuitive and accessible | UX-01–06 | Complete responsive journey |

## 5. Quality and technical constraints

- Implemented as a modern frontend application according to hackathon rules.
- Use typed shared data, modular components and explicit state transitions.
- Prioritize correct, complete core behavior over speculative integrations or decorative complexity.
- Use locally stored profile/application state **only** for this single-browser demo; no secrets or document uploads.
- Production build and browser navigation must be reliable, including refreshing a nested route on the deployed host.
- Real provider feeds must not be claimed without a verified source and updating policy.

## 6. Acceptance scenarios

**A — Discovery:** Given a populated demo catalog, searching for a known title returns matching results; combining filters reduces the results; Reset restores the full list.

**B — Unknown profile:** With an omitted income value, the eligibility breakdown shows “needs verification” rather than “not eligible” or “eligible.”

**C — Profile change:** Changing education level alters relevant match explanations, not just the profile form.

**D — Connected tracking:** Saving and moving an opportunity to Preparing updates the card, tracker and dashboard; after refresh the state remains.

**E — Deadline:** An overdue opportunity is visibly overdue, not misleadingly described as upcoming. Missing deadline says “Not specified.”

**F — Accessible workflow:** Users can navigate, filter, save and change stage using labeled controls on mobile and keyboard.

## 7. Open decisions to resolve during implementation

- How many sample scholarships and which realistic *but explicitly illustrative* fields to include; prioritize variation that exercises filters and matching.
- Exact desktop/mobile navigation according to supplied `design.md`.
- Whether the document checklist is P0 or P1 depending on available time.
- Actual evaluator feedback, attempt count and whether final ranking uses the best or latest submission; verify against current Outpost rules, not previous competitions.

## 8. Change control

When requirements change, update this PRD and [MVP.md](MVP.md); reflect scope in [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) and tests in [TESTING.md](TESTING.md). A requirement is “done” only with implementation and verification, not because it is documented.
