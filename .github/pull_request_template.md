## Changes

Describe the workstream, user-visible changes, and anything deliberately omitted.

## Verification

- [ ] Lint, typecheck, and production build pass.
- [ ] Applicable unit, content, E2E, and accessibility checks pass.
- [ ] Internal link check passes against the production build.
- [ ] Reduced-motion and server-rendered reading are verified.
- [ ] Projects remain hidden and return 404 with noindex.

### Performance evidence

Include before/after gzip JavaScript sizes from `pnpm bundle:report` and Lighthouse
reports for every affected route. Explain any growth and confirm the budget.

### Visual evidence

Attach screenshots of affected routes at 375, 768, and 1440 pixels in both light
and dark themes. Confirm no horizontal overflow at those sizes and at 1280 pixels.

### Decisions and omissions

List pending approvals, `TODO(divyum)` items, known limitations, and checks not run.
Do not mark an unchecked requirement complete.
