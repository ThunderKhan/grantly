# GRANTLY — Frontend Security & Privacy Boundaries

**Status:** Frontend-only hackathon threat model, not a production security certification.  
**Related:** [Architecture](ARCHITECTURE.md) · [PRD](PRD.md)

## Why this file exists

“No backend” does **not** mean “no security concerns.” A browser application can still expose secrets, mislead users, open unsafe destinations, retain sensitive data, or render untrusted content unsafely.

## Hard boundaries

1. **No authentication in the MVP.** A local student profile is not a user account. Never display a fake secure login or imply identity verification.
2. **No secrets in frontend code.** No private API keys, service-role keys, privileged tokens, credentials or confidential endpoints in bundled assets or committed files.
3. **No highly sensitive collection.** Do not request passwords, ID scans, bank information, identity numbers or real documents. Optional eligibility attributes should remain minimal and skippable.
4. **Browser storage is not a secure vault.** Store only low-sensitivity demo preferences and tracking state; say clearly that the data remains in this browser and is not synced or backed up.
5. **Sample scholarships must be labeled.** Do not fabricate verified open/official opportunities, actual external application states or eligibility guarantees.
6. **No HTML injection.** Render scholarship descriptions as text or sanitized trusted content. Avoid raw HTML rendering of user-supplied strings.
7. **External links need care.** Use legitimate official URLs only when known/verified; validate URL schemes; for `target="_blank"`, set `rel="noopener noreferrer"`.
8. **Respect boundaries.** A local stage update never means an external application was submitted.
9. **Dependency hygiene.** Prefer established libraries, avoid unrelated dependencies and run available checks during final review.
10. **Graceful handling.** Corrupted localStorage, invalid dates, missing records and broken links must not crash the user journey.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Private data left on a shared device | Clear “stored on this device” explanation and reset/clear action |
| Student trusts demo award/deadline as real | Visible “Illustrative sample opportunity” label and source disclosure |
| Unsafe or misleading outbound application links | Only verified HTTPS official destinations or no outbound action |
| Untrusted scholarship text rendered as markup | Escape text by default; do not use `dangerouslySetInnerHTML` for untrusted content |
| Inconsistent app state after storage corruption | Validate persisted payload with version checks and safe fallback |
| Secrets accidentally included in code | No sensitive env vars or service credentials; review build artifacts and repository |
| UI suggests false security | Explicitly state there is no account and no synced storage |

## Future production requirements (not implemented)

If authentication, real scholarship ingestion, multi-device tracking or document uploads are introduced later, perform a dedicated backend/security design covering server-side authorization, data validation, storage encryption, data minimization, privacy notice, consent, deletion and incident response. No frontend-only check can substitute for server authorization.

## Pre-submit audit

- [ ] No API secrets or real student personal data in fixtures, history or build output.
- [ ] No misleading auth/account or real-application-submission claims.
- [ ] Sample data labeled; eligibility caveats visible.
- [ ] External URL destinations are trustworthy, or link is omitted.
- [ ] Persistence scope and reset action explained.
- [ ] User-provided strings never inserted as executable HTML.
- [ ] Application remains usable with invalid/missing stored data.
