## Project Snapshot
- **Goal**: Keep the public `Maybe`/`Result` API stable while moving all implementation logic into Gleam and shipping clean bundles for Deno (JSR) and npm.
- **Current State**: Gleam code lives under `src/folklore/`; a build task stages the compiled JS + typings into `runtime/` (git-ignored). TypeScript wrappers inside `src/ts/` delegate to that runtime and are copied into `.dist/jsr` and `.dist/npm` during packaging.
- **Key Guarantees**: Backwards-compatible TypeScript surface (JSDoc + behaviour), no runtime rebuilds required for consumers, and consistent outputs across package managers.

## Build & Verification
1. `deno task gleam:build` – compiles Gleam and refreshes `runtime/` with the staged artifacts.
2. `deno test` – exercises Maybe/Result behaviour against the staged runtime.
3. `deno task package` – creates `.dist/npm` via DNT and `.dist/jsr` via direct copies, injecting the staged runtime into each.

## File Map & Responsibilities
- `src/folklore/*.gleam` – canonical Maybe/Result Gleam modules.
- `runtime/` – generated Gleam JS + `.d.mts` declarations (rebuilt, not committed).
- `src/ts/*.ts` & `src/ts/*.test.ts` – checked-in TypeScript wrappers and tests that import from `../../runtime/...`.
- `maybe/*.test.ts`, `result/*.test.ts` – Deno tests importing wrappers from `src/ts`.
- `.tasks/gleam.ts` – helper utilities to build Gleam and stage runtime artifacts.
- `.tasks/package.ts` – orchestrates npm/JSR bundles (`.dist/npm`, `.dist/jsr`).

## Guidelines for Future Agents
- Always run `deno task gleam:build` after changing Gleam sources; wrappers and tests expect `runtime/` to be present.
- When editing wrappers, keep relative imports aligned with the staged runtime (`../../runtime/...`) and the shared `utility/` types.
- Packaging assumes the staged runtime, `src/`, `utility/`, `mod.ts`, `readme.md`, `license.md`, and `jsr.json` – update the copy list in `.tasks/package.ts` if new public files appear.
- Record notable structural or release-process changes in `devlog.md` so we can resume confidently in future sessions.
