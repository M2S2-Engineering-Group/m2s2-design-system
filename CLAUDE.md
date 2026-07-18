# m2s2-design-system

Shared UI component library for M²S² Engineering Group, published to npm as
`@m2s2/{models,ng-lib,react-lib,vue-lib,tokens,utils}`. Consumed by
`m2s2-platform` (a sibling repo — currently only uses `@m2s2/models` +
`@m2s2/ng-lib`) and potentially other frontends in the future, which is why
this repo exists separately rather than living inside the platform repo.

## Layout

npm workspaces + Turborepo monorepo, `packages/`:
- `models` — shared TypeScript interfaces only, zero runtime deps.
- `utils` — framework-agnostic pure functions (formatting, slug generation,
  Chart.js config builders, etc.) — depends on `models` for types.
- `tokens` — SCSS design tokens (colors, spacing, typography, mixins),
  dark-theme-first (`_colors.scss` is the default/dark palette; light theme
  overrides live separately).
- `ng-lib` / `react-lib` / `vue-lib` — the same component **API**
  reimplemented natively per framework (e.g. `BlogCard`, `Footer`, `Chart`
  components all exist in all three, same props/inputs, framework-idiomatic
  internals).

## The cross-framework component pattern

For any new shared component: **types go in `@m2s2/models`, pure logic
(data transforms, formatting, config-building) goes in `@m2s2/utils`**, and
each framework package implements its own markup/rendering/lifecycle calling
into that shared logic. This is the one place real sharing happens — CSS is
**not** currently shared via a common partial; each framework has its own
copy of the same rules, sourced only from the shared design tokens. These
copies can and do drift — when touching a component's styles, always update
all three frameworks' copies.

**CSS duplication inventory (tech debt):** The following components have
inner class rules that are byte-for-byte (or near-byte-for-byte) identical
between `ng-lib` and `react-lib`. Vue either matches or has intentional minor
divergences (`StatRow` gap/color, for example). These are the highest-priority
candidates for a future `packages/tokens/src/components/` shared-partials
layer:

| Component | Duplicate classes | Note |
|---|---|---|
| `StatRow` | `.sr-row/item/value/label/divider` | 100% identical Angular↔React |
| `RankedBarChart` + `TimeSeriesChart` | `.m2s2-chart` | 100% identical |
| `SectionHeader` | `.sh-label`, `.sh-subtitle` | 100% identical |
| `PageHeader` | `.page-title`, `.page-subtitle` | 100% identical |
| `CtaSection` | `.cta-card/text/title/body/btn` | 100% identical |
| `SubscribeForm` | `.sub-form/input/btn/feedback/success-*/auth/subscribed-label` | Functionally identical, minor whitespace diffs |
| `BlogCard` | `.bc-cover/inner/title/summary/tags/tag` | ~identical; `.bc-series*`/`.bc-reading-time` only in Angular |
| `Dialog` | `.dialog-header/title/close/body/message/footer/btn` | Identical chrome; React adds overlay/animation wrapper |
| `Panel` | `.panel-header/title/close/body/message/footer/btn` | Same as Dialog |
| `BlogEditor` | all `.be-*` | All three libs; Vue inline `<style>` |

Already well-factored — thin wrappers over tokens mixins, nothing to
extract: `StatusBadge`, `LoadingButton`, `BaseCard`, `FeatureCard`.

Proposed fix (not yet implemented): add `packages/tokens/src/components/_<name>.scss`
partials; each framework lib `@use`s the partial and only defines its root
selector (`:host` for Angular, `.m2s2-*` for React, `<style>` for Vue).

File layout per framework for a component named `Thing`:
- `ng-lib`: `packages/ng-lib/src/lib/components/thing/thing.component.{ts,html,scss}`
  + `.spec.ts` + `.stories.ts` + `index.ts` barrel. Models consumed via a
  local re-export mirror at `packages/ng-lib/src/lib/models/` (some as flat
  files like `blog.ts`, some as `thing/thing.model.ts` — either is fine,
  follow whichever an adjacent component already uses).
- `react-lib`: `packages/react-lib/src/components/Thing/Thing.{tsx,scss}` +
  `.test.tsx` + `.stories.tsx`, exported by name from `src/index.ts` (no
  per-component barrel).
- `vue-lib`: `packages/vue-lib/src/components/Thing/Thing.vue` (template +
  `<style>` + script all in one SFC) + `.test.ts` + `.stories.ts`.

Adding a genuinely new runtime dependency (not just a peer dep) to `ng-lib`
requires listing it in `packages/ng-lib/ng-package.json`'s
`allowedNonPeerDependencies` — ng-packagr refuses to bundle an
unacknowledged non-peer dependency.

## Publishing

`semantic-release` / `multi-semantic-release`, driven by Conventional
Commits (`feat:` → minor, `fix:` → patch, etc.) — each package versions and
publishes independently. A release here fires a `repository_dispatch` to
`m2s2-platform`'s `deps-sync.yml`, which bumps and auto-commits the
consumed `@m2s2/*` versions there.

## Known gotchas (hard-won this session, don't re-discover them)

- **Never pipe `nvm use`** — see m2s2-platform's CLAUDE.md, same issue, same
  fix (never pipe it; confirm with a bare `node --version` after).
- **This repo's tests need Node 24**, matching what `ci.yml` uses. Under an
  older Node (20.x, or even a stale 22.x), Vitest hits a real
  `ERR_REQUIRE_ESM` crash on `std-env` — looks exactly like the whole test
  suite is broken repo-wide. It isn't; it's the Node version. If you see
  this, the fix is switching to Node 24, not debugging the dependency tree.
- **Turborepo's parallel `test` execution can produce false-positive
  flakiness** — running `turbo run test` fans out ng-lib/react-lib/vue-lib's
  suites concurrently, and under real resource contention this can push
  axe-core-based accessibility tests over their timeout (seen: unrelated
  `BaseCard`/`SectionHeader` tests failing only when run alongside everything
  else). Before treating a turbo-run failure as real, rerun that one
  package's tests in isolation (`cd packages/x && npx vitest run` /
  `npx ng test`) — if it passes clean alone, it was contention, not a
  regression. The actual pre-commit hook (`.husky/pre-commit`) runs each
  package's tests sequentially, not via turbo, so it doesn't hit this.
- A handful of old `ng-lib-v*`/`m2s2-ng-lib-v*` git tags exist from before
  this repo's current structure was established — leftover history, not
  meaningful to current releases.
- `npm audit fix` here can fail with an ERESOLVE peer-dependency conflict
  (seen: colliding with `@storybook/angular`'s Angular version range) even
  when the advisory itself claims a non-breaking fix is available — always
  dry-run and read the actual error before assuming the "non-breaking" label
  holds for this specific workspace's full peer-dependency graph.
- Dependabot (`.github/dependabot.yml`) is configured weekly, grouped by
  related package families (Angular, Storybook, Vite), patch/minor only —
  major bumps are intentionally excluded and need deliberate manual upgrades.

## Workflow conventions

- Non-trivial features go through plan mode before implementation.
- The user does actual `git commit`/`push`/publish — implement and verify
  (build + lint + test for all three frameworks, not just one), then report
  status; don't commit unless explicitly asked.
- A bug reported from `m2s2-platform` that traces back to a shared component
  gets fixed **here**, across all three frameworks it affects — not patched
  around in the consuming app.
