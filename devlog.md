## Dev Log

### 2024-04-07
- **Baseline**: Ran `deno test` to confirm the pre-existing Maybe/Result suites pass.
- **Gleam Adoption**: Created `gleam/` project with Option/Result wrappers and compiled JS artifacts. TypeScript classes now delegate to the generated helpers while maintaining API shape and `instanceof` behaviour.
- **Build Integration**: Added Deno task helpers (`.tasks/gleam.ts`, `.tasks/gleam_build.ts`) and updated `deno.jsonc` so Gleam build + copy runs before packaging.
- **Packaging**: `deno task package` now bundles Gleam output into `.dist`, ensuring npm consumers receive the new internals.
- **Refinement**: Relocated compiled artifacts into `core/` for a stable import path. Updated wrappers to import from `core/folklore_gleam/folklore`, added `.d.mts` typings, and made `core/` part of the repo (while ignoring `gleam/build/`).
- **Validation**: Confirmed `deno task gleam:build`, `deno test`, and `deno task package` all succeed with the new layout.

### Outstanding / Next
- Automate `deno task gleam:build` in CI or a git hook so `core/` cannot drift from `gleam/src`.
- Begin exploring the future Task type/API redesign once the Gleam-backed foundation proves stable.

### 2024-04-08
- **Source Layout**: Moved TypeScript wrappers to `src/ts/` and updated tests/mod exports to reference the new location.
- **Runtime Staging**: Replaced the committed `core/` directory with an ignored `runtime/` folder produced by `deno task gleam:build`; wrappers now import from this staged path.
- **Packaging**: Reworked `.tasks/package.ts` to emit separate `.dist/npm` (DNT) and `.dist/jsr` bundles, each seeded with the staged runtime and necessary sources/docs.
- **Build Scripts**: Updated helper tasks (`gleam:build`, `package`) and ignore rules to match the new workflow.
