# GRANTLY — Judge Demo & Submission Story

**Status:** Planned demonstration, not proof of a running app.  
**Related:** [Idea](ideas.md) · [MVP](MVP.md) · [Testing](TESTING.md)

## Message in the first 15 seconds

“Finding a scholarship is only the beginning. Students also need to understand eligibility, prepare documents, meet deadlines and track where they stand. GRANTLY combines that entire journey in one clear workspace.”

## Problem-to-solution demonstration (approx. 2–3 minutes)

| Step | Show | Judge should see |
| --- | --- | --- |
| 1 | Welcome/dashboard | Instantly understand that GRANTLY is for scholarship discovery and management |
| 2 | Set/edit student profile | Few relevant fields, optional unknown answers, no unnecessary login |
| 3 | Discover scholarships | Functional search, filters, informative cards |
| 4 | Open one detail | Award, deadline, provider, requirements, application steps |
| 5 | Inspect “Why this may fit” | Transparent match/unknown/mismatch explanations, not invented percentages |
| 6 | Save and prepare | Saved state, documents or next step, user-controlled application stage |
| 7 | Dashboard/applications | The same opportunity and updated progress appear everywhere |
| 8 | Refresh and inspect mobile | Persistence and responsive usability |
| 9 | Note limits | Demo data is illustrative; the product does not apply on student's behalf |

## Signature moment

The best “aha” is not a decorative animation: open a scholarship, show a criterion that needs verification, update the profile, and demonstrate that the explanation changes. Then save it, move it to Preparing and show the next action on the dashboard.

**Why it matters:** GRANTLY transforms a vague search into a *reasoned decision and actionable plan*.

## Narrative for evaluators

- **Problem:** Scattered sources and fragmented tracking cause confusion and missed opportunities.
- **Solution:** One student-first portal connects discovery, eligibility explanation and personal progress tracking.
- **Innovation:** Explainable opportunity-to-action matching; transparent criteria plus next steps instead of opaque scores.
- **Technical implementation:** Typed data, deterministic client-side matching, shared React state and persistence (after actually implemented).
- **Integrity:** Sample scholarships labeled; official eligibility and external applications never falsely claimed.

## Submission checklist (adapt to official platform instructions)

- [ ] Confirm official Outpost submission URL and attempt limit.
- [ ] Verify whether ranking uses highest or latest valid score.
- [ ] Confirm accepted artifact type (GitHub, deployment, uploaded files, video/screenshots).
- [ ] Save current working commit ID and deployed URL.
- [ ] Pass key acceptance tests from [TESTING.md](TESTING.md).
- [ ] Submit a valid working iteration early if allowed.
- [ ] Record submission number, commit, score, feedback and whether that score is eligible for ranking.
- [ ] Preserve a known-good build and reserve time for final submission.

## 30-second spoken pitch

“GRANTLY makes educational funding easier to discover and manage. Instead of sending students through disconnected scholarship websites and personal spreadsheets, it lets them enter a simple profile, find and compare opportunities, understand which eligibility criteria match or need checking, and track the steps required before each deadline. Our unique feature is explainable matching connected to next-action guidance, so students don't just discover funding — they know what to do next.”

## Honest limitations

GRANTLY's initial hackathon build is a frontend demonstration. It may use illustrative records and local browser storage. It does not independently verify provider criteria, guarantee eligibility, perform official applications, synchronize accounts, or send external reminders. State these clearly rather than conceal them.
