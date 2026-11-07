# GRANTLY — UI/UX Specification

**Status:** Interaction and layout contract. Visual styling will be finalized when the user supplies `design.md`.  
**Related:** [Idea](ideas.md) · [PRD](PRD.md) · [MVP](MVP.md)

## Product experience goals

GRANTLY should feel **clear, friendly, trustworthy and useful**, especially for students who are unfamiliar with scholarship criteria. Focus on fast comprehension, actionable information and an uninterrupted path from discovery to preparation.

**UX principle:** Every prominent screen should answer *What do I see? Why does it matter? What should I do next?*

## Navigation / information architecture

The public introduction lives at `/`, with the student workspace at `/dashboard`. The logo returns to the introduction; do not add Home to the main navigation. The introduction uses the same scholarship data, fit assessment and save state as the workspace, with direct discovery and subject-filter entry points.

Core destinations:

1. **Dashboard:** Summary of deadlines, saved items and next actions.
2. **Discover:** Search/filter catalog and inspect opportunities.
3. **My Applications:** Track saved/preparing/applied/decision stages.
4. **Profile:** Add or edit matching details.

A scholarship details view is reachable from cards, dashboard tasks, tracker entries and deep links. Do not expose four isolated page mockups; state must be shared.

If no profile exists, permit exploration and gently invite personalization. Do not gate all discovery behind onboarding.

## Screen requirements

### Dashboard

- Clear contextual header and personal next action.
- Small set of truthful, clickable summary figures: saved, preparing, applied, upcoming deadlines.
- Upcoming deadlines sorted chronologically, including overdue warnings.
- Recommended opportunities only if powered by actual matching logic.
- If nothing is saved, present one clear CTA to discovery — no fake graph or fabricated metrics.

### Discover

- Search is prominent and keyboard accessible; Enter / typing should produce predictable results.
- Filters show labels, selected state and a Reset action.
- Cards show title, provider, award, deadline and why the opportunity may fit.
- Card click/view action opens a details page; save is a separate accessible control.
- No-results state explains filters and offers reset, not an empty grid.

### Details

Content hierarchy: **title and provider → benefit and deadline → fit breakdown → eligibility → required documents → application steps → save/track/external application link**.

- Match states are accompanied by explicit text, not color alone.
- Do not imply eligibility is confirmed.
- Unknown or missing criteria are clearly shown.
- The primary action changes meaningfully after saving (e.g., Saved / Continue preparing).
- External actions say that the student leaves GRANTLY to apply through a provider.

### My Applications

- Clear stage groupings or filtered list; status change must be obvious and reversible.
- Each item shows stage, due date, and next step.
- If documents are tracked, use labeled checkboxes; their state persists.
- Stage “Applied” is self-reported and should not imply GRANTLY transmitted an application.
- Empty tracker has a link to discover, not an error message.

### Profile

- Group only necessary questions; explain why optional criteria affect matching.
- Support unknown / prefer not to say where appropriate.
- Provide Save and edit/clear paths, validation, and confirmation.
- Never ask for ID scans, official documents, passwords or bank details in a frontend-only demo.

## Visual contract and design.md

The forthcoming **user-supplied** `design.md` is the primary source for typography, colors, surface treatment, radii, shadows, spacing, motion and component styling. This document remains authoritative for **behavior, IA, content clarity and accessibility** if a visual reference conflicts.

Avoid copying a job-search site's brand, marketing headlines or content merely because its system is the visual reference. Maintain GRANTLY-specific language.

## Interaction states to implement

| Surface | Required states |
| --- | --- |
| Search | Empty query, matching results, no results |
| Filters | Default, active, combinations, reset |
| Profile | Blank, partially filled, saved, edited |
| Fit assessment | Matched, needs verification, potential mismatch |
| Scholarship | Available detail, saved, unsaved, unknown/overdue deadline |
| Tracker | Empty, all relevant stages, status updated |
| Persistence | Fresh browser, refreshed browser, cleared/corrupt stored data |
| Navigation | Active destination, focus and mobile menu states |

## Responsive behavior

- **Mobile first:** Cards stack, filters become usable without horizontal overflow, top navigation adapts to accessible menu/tab treatment.
- **Tablet:** Balanced density, avoid tiny text and excessive blank columns.
- **Desktop:** Clear hierarchy, optional sidebar/filter rail only if it improves scanning.
- Test at representative widths near 375px, 768px, 1280px and 1440px; ensure content adapts rather than merely shrinking.

## Accessibility requirements

- Keyboard access for all interactive elements and visible focus outlines.
- Semantic landmarks, heading order, labels and descriptive accessible names.
- Touch targets comfortably sized and no reliance solely on hue, icon or animation to communicate status.
- Respect reduced motion, avoid disruptive transitions and maintain readable contrast.
- Form errors and save confirmations are understandable; do not depend on toast messages alone.
- Avoid putting large blocks of essential content behind hover-only interactions.

## Content and microcopy

Good: “Possible match — household income needs verification.”  
Bad: “You are 97% eligible!”  
Good: “Mark as applied (I submitted on the provider website).”  
Bad: “Application submitted successfully” after only changing local state.  
Good: “Sample opportunity — illustrative data.”  
Bad: “Open now” without verified official data.

Use human, plain-language labels over jargon. Every metric, badge and CTA must correspond to real in-app behavior or transparently labeled sample data.

## First impression and demonstration

Within 10 seconds, a judge should identify what GRANTLY does and which action starts the journey. Within 60 seconds, they should be able to search, inspect a fit explanation and save an opportunity. The core journey should remain equally understandable on mobile.

See [DEMO.md](DEMO.md) for the complete scripted path.
