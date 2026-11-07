# GRANTLY — Product Idea & Concept

> **One-line pitch:** GRANTLY is a student-first scholarship discovery and management workspace that helps learners find relevant funding, understand whether they may qualify, prepare an application, and stay on top of the next step — without juggling scattered websites, documents, and deadlines.

**Project:** GRANTLY  
**Event:** THE OUTPOST 2026 — Frontend Arena  
**Track:** Track 1 — Unified Scholarship Discovery & Management Platform  
**Repository:** https://github.com/ThunderKhan/grantly  
**Document status:** Product concept and proposed hackathon scope; not a record of completed implementation.

---

## 1. The Official Challenge

**Track 1: GRANTLY — Unified Scholarship Discovery & Management Platform**

The brief asks participants to rethink how students interact with educational financial assistance. It identifies four recurring difficulties:

1. **Finding relevant opportunities:** Scholarships are scattered, and students struggle to discover the ones that matter to them.
2. **Understanding available options:** Award benefits and eligibility requirements are difficult to compare and interpret.
3. **Navigating application processes:** Students are uncertain what to prepare, where to apply, and what to do next.
4. **Keeping track of important information:** Deadlines, saved opportunities, document requirements, and application statuses are fragmented.

The challenge is intentionally open-ended: the implementation, design, and feature choices are up to the builder. Its stated objective is to turn a complex process into a **seamless digital journey**.

**Our interpretation:** A unified experience should cover the journey *from finding an opportunity to managing an application*, not just display attractive scholarship cards. The organizers also emphasized alignment with the problem statement during a participant meeting. That guidance informs our priorities, but does not imply any unannounced technical requirements or scoring weights.

## 2. The Problem We're Solving

A student searching for financial aid might discover a scholarship through a search engine, open several official sites, read lengthy eligibility pages, save a few links, collect document requirements in notes, and remember deadlines using a separate calendar. Even after all that, the student may still not know:

- Is this scholarship relevant to my education, location, and circumstances?
- Which eligibility conditions do I meet, and which need checking?
- How does this option compare with others?
- What documents and actions are required?
- Which application deserves my attention today?
- What have I already applied for?

**The real problem is not merely the absence of a search box. It is the lack of a single, trustworthy decision-and-action workflow.**

## 3. The Solution in Plain Language

**GRANTLY is a personal scholarship command center for students.**

A student fills in a short profile, explores a searchable catalog of scholarships, sees an understandable breakdown of eligibility, saves promising opportunities, and manages application steps and deadlines from one dashboard.

The journey:

**Set up profile → Discover → Understand eligibility → Compare and save → Prepare documents → Track application → See the next action**

We want the product to answer three questions at any moment:

1. **What opportunities are relevant to me?**
2. **Why are they relevant, and what is uncertain?**
3. **What should I do next to avoid missing out?**

### 30-second explanation for a judge

“Students often lose scholarship opportunities because finding them is only the first challenge. They also have to determine eligibility, gather documents, apply on different portals, and track deadlines. GRANTLY brings all of that into one student-friendly interface. Its standout feature is explainable scholarship matching: it shows why an opportunity fits, what needs verification, and the next action to take. Students can then save and organize applications in the same place.”

## 4. Intended User

**Primary persona:** A secondary-school, undergraduate, or postgraduate student looking for education funding.

**Example scenario:** An undergraduate student enters education level, field, and location. GRANTLY displays a shortlist of possible scholarships. Opening one reveals criteria that match and a household-income condition still needing verification. The student saves the opportunity, checks the required documents, marks the application as “Preparing,” and sees the submission deadline on the dashboard.

Design for first-time users who may not know scholarship terminology. Use plain language and explain unfamiliar fields. Avoid requiring unnecessary personal data just to explore opportunities.

## 5. Our Differentiating Idea: Explainable Opportunity-to-Action Matching

Many scholarship directories stop at *Here is a list of scholarships*. GRANTLY connects **discovery, understanding, and execution**.

### A. Explainable eligibility, not an opaque “AI match score”

Each scholarship has structured criteria, such as education level, field of study, region, academic performance, and income threshold where applicable.

A transparent rule-based matching engine compares only relevant known profile fields:

- **Matches:** A stated criterion appears satisfied.
- **Needs verification:** Information is missing, unclear, or requires checking with the provider.
- **Potential mismatch:** A stated criterion appears not to be satisfied.

The user sees **why** the recommendation was made. For example:

- ✓ Undergraduate level matches
- ✓ Computer science is an accepted field
- ? Household-income evidence not yet provided
- → Next action: verify the income criterion and prepare the required certificate

**Guardrail:** Do not label a student “definitely eligible,” fabricate precise eligibility percentages, or imply that a local rules engine can replace an official scholarship provider's decision. “Likely match” or “Potential match” with explicit reasons is more honest.

### B. A “What should I do next?” action layer

Instead of leaving users with saved bookmarks, GRANTLY suggests concrete next steps based on their stored applications:

- Complete missing profile information
- Verify an unresolved criterion
- Gather or mark a required document
- Continue a draft/preparing application
- Check a deadline approaching soon
- Update an application status after applying on the official portal

This is the main innovation: **turning scholarship information into an actionable workflow**.

### C. Connected application progress

The same opportunity moves seamlessly from discovery to saved items to an application tracker. Students should not need to re-enter scholarship details when they decide to pursue it.

## 6. The Product Experience

### Screen 1 — Welcome / Quick Profile

**Purpose:** Give students a personalized starting point without making onboarding a barrier.

Capture only fields useful for matching: education level, discipline, location, and optional eligibility details. Let students skip unknown or sensitive answers and update them later.

**Working behavior:** Saving a profile refreshes opportunity matching and persists preferences in the browser for the hackathon MVP.

### Screen 2 — Discover Scholarships

**Purpose:** Make relevant funding easy to find and compare.

- Search by scholarship title, provider, and subject
- Filter by education level, field, region, award category/amount, and deadline where data supports them
- Sort by relevance, deadline, or award amount
- Show useful cards: title, provider, award, due date, brief eligibility summary, match state, and save action
- Show appropriate loading, empty-result, and no-match states when applicable

**Working behavior:** Filters and sorting operate on real structured in-app data; controls are not decorative.

### Screen 3 — Scholarship Detail & Fit Explanation

**Purpose:** Make each opportunity understandable and actionable.

Include an overview, award/benefits, eligibility criteria, document checklist, application steps, due date, and source/application link when there is a legitimate one.

An **“Why this might fit you”** section presents matching, unresolved, and mismatching criteria in readable language.

**Working behavior:** Users can save the opportunity, open the source link, begin tracking preparation, and mark checklist progress.

### Screen 4 — My Applications / Tracker

**Purpose:** Replace scattered notes and bookmarks with a clear progress view.

Possible stages:

**Saved → Preparing → Applied → Decision received**

Include a deadline, next action, document checklist, and editable status for each item. The student controls status changes; the application does not claim to know outcomes from providers.

**Working behavior:** Moving a scholarship between stages updates its details everywhere and persists locally.

### Screen 5 — Personal Dashboard

**Purpose:** Surface what matters today.

Show a concise overview: saved opportunities, applications in progress, approaching deadlines, missing requirements, and suggested next actions. Link directly to the scholarship or task behind each summary.

This can be the landing view after onboarding, but it should not replace a highly usable discovery interface.

## 7. The Signature Demo

Demonstrate one complete scenario instead of navigating disconnected mock screens:

1. Open GRANTLY and enter a sample student profile.
2. Browse the catalog and search for an undergraduate scholarship.
3. Narrow results with filters.
4. Open an opportunity and explain each eligibility match or uncertainty.
5. Save it and inspect required documents.
6. Mark one document ready and move the application to Preparing.
7. Return to the dashboard and show the new application and its next action.
8. Refresh the page and demonstrate that progress is still there.
9. Show the same flow on a mobile viewport.

**Demo promise:** A student can go from *“I need funding”* to *“I know which opportunity to pursue and what to do next”* in a few clear steps.

## 8. Feature Priorities for a Six-Hour Individual Hackathon

### P0 — Non-negotiable end-to-end experience

- Functional responsive navigation and consistent design
- Discover page with populated cards, working search, and useful filters
- Detailed scholarship views with clear eligibility and application information
- Editable student profile
- Explainable, deterministic criteria matching
- Save/bookmark and application status tracking
- Basic deadline visibility and next-action guidance
- Browser persistence and a reliable production build

### P1 — If the core experience is complete

- Document readiness checklist
- Stronger sorting/comparison views
- A focused dashboard with deadline urgency and application progress
- Empty, unknown, mismatch, and confirmation states
- Additional keyboard, accessibility, and mobile refinements

### P2 — Stretch only; do not compromise P0

- Side-by-side comparison
- Import/export of tracked opportunities
- Rich timeline/calendar view
- Optional animation and refined illustrations

**Explicitly out of scope for the initial frontend hackathon:** Live scraping of providers, promising a nationwide complete scholarship database, direct submission of official applications, automatic verification of documents or awards, payment processing, real email reminders, and an AI assistant without a reliable information source. These add risk without solving the brief's central journey better than a polished P0.

## 9. Information Architecture & Conceptual Data

Core concepts:

- **StudentProfile:** education level, study field, location, optional eligibility attributes, explicitly unknown fields
- **Scholarship:** id, title, provider, award, currency, description, deadline, eligibility rules, documents, application steps, source URL, demo/source label
- **EligibilityAssessment:** matched criteria, missing/unknown criteria, potential mismatches, reasoned summary
- **TrackedApplication:** scholarship id, stage, document completion, notes, next action, last updated date

Use one shared data source for discovery, details, matching, and tracking so that the UI stays consistent.

A sensible initial frontend implementation is **React + TypeScript + Vite + Tailwind CSS + accessible component primitives**, with typed local example data and browser persistence. Architecture and stack may be refined during implementation; the product concept should not depend on a backend.

## 10. Data Integrity, Trust & Accessibility

Scholarship information affects real financial decisions. Even in a demo:

- Clearly label invented or illustrative scholarship entries as **sample data**, not open or verified financial-aid opportunities.
- Do not invent official provider links, awards, deadlines, or eligibility decisions.
- If actual opportunities are introduced, identify their sources and do not assert they are currently open without checking.
- Make unknown eligibility information visible rather than silently treating it as a match.
- Keep sensitive optional profile information to a minimum and explain local-only storage in the prototype.
- If using localStorage, never claim the information syncs across devices or accounts.
- Prefer plain-language instructions, readable contrast, keyboard-operable controls, visible focus states, semantic form labels, and responsive layouts.
- Never present a simulated status change as evidence that an external application was actually submitted.

## 11. Visual & Interaction Direction

**Positioning:** Approachable, trustworthy, modern, clear, and student-first — a funding-navigation product, not a trading dashboard.

Use a cohesive light theme, expressive but restrained accent color, strong typography, legible opportunity cards, simple progress indicators, and clear primary actions. Small microinteractions should reinforce actions rather than compete with usability.

**Design reference under consideration:** Jobright's discovery-oriented DESIGN.md from GetDesign.md. Use it as a visual reference, not a template for unrelated job-search features or a copy of Jobright branding. Any design.md chosen for the repository must ultimately support GRANTLY's own workflows and accessibility.

## 12. How This Answers the Official Brief

| Brief's identified challenge | GRANTLY response | Demonstrable interaction |
| --- | --- | --- |
| Finding relevant opportunities | Search, filters, personalized discovery | Student searches and filters catalog |
| Understanding available options | Rich detail pages and explainable matching | Student opens a scholarship and inspects eligibility |
| Navigating application processes | Application steps, required documents, next-action guidance | Student marks a document or preparation task |
| Keeping track of important information | Saved opportunities, status tracking, deadlines | Student moves an application and returns to dashboard |
| Seamless, intuitive, accessible journey | Connected views, persistent state, responsive/semantic UI | Student completes the journey without fragmented tools |

**Alignment rule:** Do not add features simply because they are impressive. Each prominent feature should help solve a problem directly described in the brief.

## 13. Acceptance: What “Working GRANTLY” Means

The product is ready for a serious first submission when:

1. A new student can understand what the application does without explanation.
2. Search, filters, links, navigation, save actions, profile edits, checklist controls, and status changes actually work.
3. Eligibility explanations change when relevant profile data changes and do not invent certainty.
4. Saved scholarships, preparation progress, and application stages survive a refresh in the demo.
5. A scholarship's important details are consistent in catalog, detail, tracker, and dashboard.
6. Empty, incomplete, and mismatching cases have useful user-facing responses.
7. Core flows are operable with a keyboard and readable on mobile and desktop.
8. The production build succeeds, the deployed link opens, and the complete demo flow has been checked in the browser.
9. Sample data and limitations are labeled honestly.
10. At least one evaluator submission is made with enough time to investigate feedback, subject to official attempt rules.

## 14. Why GRANTLY Is Different

GRANTLY is **not another scholarship search landing page**.

Its differentiation is the connected sequence:

**Discover an opportunity → Understand *why* it may fit → Know *what is missing* → Take the next step → Track progress.**

The explainable matching and action-focused dashboard make the product easier to trust and more useful than a static directory. This innovation is feasible within six hours because it relies on coherent information architecture, explicit rules, functional UI state, and thoughtful interaction design — not speculative AI capabilities.

**Final product thesis:** *Scholarship discovery should end in clarity and action, not another open browser tab.*
