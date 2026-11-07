# GRANTLY — Development & Submission Runbook

**Status:** Procedural guide; command examples assume the intended stack, not an existing scaffold.  
**Read with:** [Implementation Plan](IMPLEMENTATION_PLAN.md) · [Testing](TESTING.md) · [Demo](DEMO.md)

## Before writing challenge code

- Verify the organizer-confirmed start and deadline; respect the rule to develop competition work during the permitted window.
- Confirm the final problem statement, platform submission format, attempt limit and ranking mechanics.
- Check Node, npm, Git, editor, browser and deployment access.
- Obtain the chosen `design.md`; do not create a conflicting visual language.
- Reconfirm that `docs/ideas.md`, `MVP.md` and `PRD.md` reflect the problem statement.

## Suggested first scaffold (run only when permitted)

```bash
npm create vite@latest . -- --template react-ts
npm install
npm run dev
```

Adapt the command to the actual directory and existing files; never overwrite documentation or the repository by blindly scaffolding. Add routing, Tailwind, UI primitives and tests only as needed. Keep one package manager and commit its lockfile.

## Local checks (after scripts exist)

```bash
npm run build
npm run lint
# npm run test        # only after the test script is defined
```

Inspect available scripts before running; do not assume all commands already exist. Confirm the running app in a real browser. Verify SPA deep-link refresh on the chosen host.

## Suggested progress commits

1. `feat: add app shell and typed sample scholarship catalog`
2. `feat: implement discovery and scholarship details`
3. `feat: implement profile and explainable matching`
4. `feat: add saved opportunities and application tracker`
5. `test: validate end-to-end experience and responsive layouts`
6. `fix: address evaluation feedback and final polish`

Never report that a commit, deployment or test succeeded without observing its result.

## Evaluator experiment log template

| Attempt | Time | Commit | What changed | Score | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | — | — | Initial complete journey | — | — |
| 2 | — | — | Corrected weakness | — | — |

Do not make repeated evaluator submissions merely for noise. Submit verifiable improvements and track whether the official competition uses latest or best score.

## Blockers and fallbacks

- **No real scholarship API:** Use clearly labeled, structured sample data — never invent claims of live data.
- **Unable to deploy:** Check build output, hosting configuration and SPA rewrites; preserve local working commit.
- **Broken localStorage:** Fall back to empty demo state, alert user and provide reset.
- **Too little time:** Drop P2 then P1; preserve the complete P0 journey.
- **Evaluator feedback is opaque:** Fix explicit requirement gaps and user-facing functional failures before guesswork about hidden scoring.

## Final preflight

- [ ] Core user journey tested in real browser.
- [ ] Production build succeeds.
- [ ] Desktop and mobile layouts verified.
- [ ] Sample data and local-only state are correctly explained.
- [ ] Deployment public link and deep links verified.
- [ ] Submission artifact is correct for this event.
- [ ] Current code committed and known-good baseline identified.
- [ ] Final valid submission recorded before deadline.
