# Purposeful product motion

The existing mint/black design, navigation, routes, data model, persistence and workflows are preserved. Motion is limited to feedback and changes in content. All timings use the existing decelerating easing curve; ordinary transitions take 200–250 ms, with card staggering capped so the final entrance finishes within 300 ms.

## Source review and decisions

| Reference | Applied or intentionally skipped |
| --- | --- |
| [Motion Primitives AnimatedGroup](https://motion-primitives.com/docs/animated-group) | Adapted into `AnimatedGroup` with stable scholarship keys, short slide/fade entrances, bounded staggering and FLIP transforms when retained results move. Offscreen cards are not animated; removed results leave immediately so obsolete actions cannot remain focusable. |
| [Motion Primitives Morphing Dialog](https://motion-primitives.com/docs/morphing-dialog) | Source reviewed. Not introduced: eligibility is already available inline, and moving it into an overlay would change the workflow. Native confirmation dialogs retain browser focus trapping, Escape handling and focus restoration, with only a short opening fade/translation. Closing remains immediate. |
| [Animate UI Base UI Tabs](https://animate-ui.com/docs/primitives/base-ui/tabs), [UI Layouts Tabs](https://www.ui-layouts.com/components/tabs) | Reviewed both. Adapted UI Layouts' moving active indicator pattern to the existing native stage filter buttons; a short underline transition handles wrapped mobile rows. Stage content uses the same keyed result transition. Did not add Base UI, shadcn, hover activation or spring distortion. Native filter button semantics and pressed state remain. |
| [Magic UI Number Ticker](https://magicui.design/docs/components/number-ticker) | Adapted the motion-value/spring implementation for real dashboard counts. Initial render uses the true count; only subsequent state changes interpolate, with no scroll replay or made-up starting metrics. Assistive technology receives the final integer immediately. |
| [Magic UI Animated Circular Progress Bar](https://magicui.design/docs/components/animated-circular-progress-bar) | Adapted the fixed SVG circumference calculation to a small document-readiness ring with actual `done / total` counts, explicit progress semantics and a 240 ms stroke transition. Existing tracker/profile linear progress uses transform-based fills. No eligibility percentage is invented. |
| [Magic UI Blur Fade](https://magicui.design/docs/components/blur-fade) | Reviewed source. Kept the short entrance pattern for the dashboard's lower section and inline eligibility content, without blur or scroll gates. Main headings and the landing hero stay immediately readable. |
| [React Bits](https://reactbits.dev/), [CountUp source](https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/TextAnimations/CountUp/CountUp.tsx) | Reviewed source/install patterns; skipped a second counter implementation, digit-roll effects, per-digit SVG filters and decorative backgrounds. |
| [Aceternity UI](https://ui.aceternity.com/components) | Reviewed the catalog/install guidance. Skipped tilt, glow, parallax, shaders, floating controls and additional modal/tab stacks because they add visual effects or dependencies without improving scholarship tasks. |

Additional feedback: saved bookmark icons settle once; completed checklist icons respond once; field validation, profile-save feedback, mobile filter opening and empty states have a brief entrance. Existing button hover/press and toast transitions are reused. Native dropdown menus remain native; no accordion or fake loading delay was added.

## Runtime and accessibility

One declared animation dependency, `motion`, is used. Scoped list/indicator animations use `motion/react-mini`; the ticker's motion-value/spring hooks live with the lazy dashboard route. No full component kit is installed. Adaptation links, copyrights and MIT permissions are preserved in [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md).

`prefers-reduced-motion` is read synchronously and subscribed to through `useSyncExternalStore`. Reduced motion disables CSS movement and group/indicator animations, settles counters immediately, and cancels active motion if the preference changes while a transition is running. Controls stay operable throughout animations. Counts and progress values stay semantically current throughout interpolation. Animation controls and ResizeObservers are cleaned up on updates/unmount.

Lists animate opacity/transforms, the active indicator uses transforms, and linear fills use scaleX. The tiny fixed SVG ring animates its stroke only; it does not resize layout. Geometry is read before animation writes. No view-transition snapshots, global smooth scrolling, or whole-page blur is introduced.

The existing bundle budgets are unchanged. Run `npm run build && npm run check:bundle` to verify entry JS, total JS and CSS caps. Browser coverage includes the persisted core journey, responsive/axe checks, progress and stage transitions at 375/1280px, and reduced-motion behavior including an interrupted transition. Production lab paint/layout measurements continue to run on home and discovery; these are not field Core Web Vitals or a real-device frame-rate certification.

## Local verification

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run check:bundle
npx playwright install chromium
npm run test:e2e
```

Vercel deployments remain paused. Review the changes on localhost.
