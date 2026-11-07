# Frontend completeness — 7 November 2026

GRANTLY remains a **frontend-only** student scholarship workspace. No auth, backend, uploaded documents, automated external submissions, credential collection or external data service has been added. The original mint, ink, Titillium/Inter, spacing tokens and responsive page architecture stay authoritative.

## End-to-end extensions

- **Real source-linked schemes:** three additional programmes, separately labeled from the 12 illustrative records. Source URLs, application handoff and the date reviewed appear in the interface. Provider terms can change after review.
- **No fabricated eligibility:** official programmes carry an explicit additional-condition assessment. A matching school level cannot imply full eligibility. Other demographic or institutional criteria are not collected by GRANTLY.
- **Application handoff:** source and NSP student portal links open externally, with clear explanation that local stage updates are self-reported.
- **Action priority:** preparing items and future deadlines come before old expired examples. Missing deadlines rank last.
- **Decision outcome:** local awarded/waitlisted/not-selected with an optional date, validated and persisted in the existing version-one workspace. Reopening an earlier stage clears outdated decision detail.
- **Profile safeguard:** SPA route changes use an in-app leave confirmation; browser reload/close triggers the browser's native unsaved-data warning.
- **Application-stage URL:** unknown `stage` query values normalize to the All view rather than suggesting an empty tracker.
- **Local backup:** export a JSON copy; import requires schema validation and explicit destructive replacement confirmation. This is a sensitive, user-controlled download and is **not cloud storage**.
- **Comparison:** opt in to 2–3 opportunity cards and compare documented award, deadline, fit and source without creating a separate persistent state.
- **Calendar:** a local RFC 5545 `.ics` file with an all-day deadline and seven-day reminder; depends on import and notification settings in the student's calendar client.

## Official sources reviewed on 7 November 2026

1. **National Scholarship for Post Graduate Studies.** UGC scheme: https://www.ugc.gov.in/Scholarships/stu_Scholarship6 ; NSP 2026–27 listing: https://scholarships.gov.in/All-Scholarships . The UGC scheme describes a ₹1,50,000 annual award; other criteria include eligible programme/institution, age and course year. NSP listing showed student deadline 30 November 2026 when reviewed.
2. **Ishan Uday Special Scholarship Scheme for NER.** UGC lists this scheme at https://www.ugc.gov.in/Bureaus/bureaus_details?HTh8DxmdOv4wCVphfLaNizbBCW4vd1y%2FCAAlRY19DTL1MpdRIQTYCflmu5VUMUdP8WUiVKPwYNtZGqLgqiaKLw%3D ; current NSP source: https://scholarships.gov.in/All-Scholarships . NSP listing showed 30 November 2026. Verify domicile, programme, income and the current cycle directly with the provider.
3. **PM-YASASVI Top Class Education in College.** Ministry scheme and 2026–27 institution details: https://socialjustice.gov.in/schemes/110 ; NSP listing: https://scholarships.gov.in/All-Scholarships . NSP listing showed 30 November 2026. Official terms depend on category, income, approved institution and allocated slots.

**Application entry point:** https://scholarships.gov.in/Students . This is the government student portal, not a direct prefilled application URL. OTR and provider-side verification may be necessary. The source dates and deadlines are static snapshots, *not* real-time availability claims; always re-check the NSP live listing.

## Design anti-slop guardrails

Recovered from the earlier **Implement Grantly Platform** Work context and applied as constraints:

- Impeccable **Polish**: https://github.com/pbakaus/impeccable — refine existing components rather than redesign; fix flow, error states, focus and rhythm before cosmetic styling.
- **Avoid AI Design**: https://github.com/funboy322/avoid-ai-design — avoid template layout patterns, decorative gradients, floating cards, excessive iconography and generic SaaS prose.
- Existing `docs/design.md` remains the system of record. New controls reuse `.button.secondary`, `.reset-text`, `.panel`, native semantic `select`/`dialog`, existing motion and CSS tokens. No new UI/animation dependency.

## Verification and limits

Execute `npm ci && npm run typecheck && npm run lint && npm test && npm run build && npm run check:bundle && npm run test:e2e`. Browser coverage should include the official-source flow, URL normalization, comparison, calendar download, local backup recovery, unsaved-profile navigation, outcome persistence and 320–1440 px accessibility checks.

No automated check substitutes for manual Safari/Firefox, assistive technology, browser zoom, slow physical devices, or verification of current provider deadlines. Vercel deployment remains intentionally paused.
