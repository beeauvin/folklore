# Contributing to folklore

## Development Setup

### Prerequisites
- [Deno](https://deno.land/) (latest version)
- [Gleam](https://gleam.run/) v1.13.0 or higher

### Project Structure

```
folklore/
├── src/folklore/          # Gleam source files (core logic)
├── lib/                   # TypeScript wrapper API and tests
│   ├── mod.ts            # Public entry point
│   ├── maybe.ts          # Maybe wrapper
│   ├── result.ts         # Result wrapper
│   └── utility/          # Shared types
├── runtime/               # Generated Gleam JavaScript (git-ignored)
├── gleam.toml             # Version source of truth
├── package.ts             # Package metadata (reads from gleam.toml)
├── .tasks/                # Build scripts
└── .dist/                 # Package outputs (git-ignored)
```

## Build Process

### 1. Build Gleam Runtime

Compile Gleam sources and stage the runtime:

```bash
deno task gleam:build
```

This compiles `src/folklore/*.gleam` files and generates:
- JavaScript modules in `runtime/folklore_gleam/`
- TypeScript declarations (`.d.mts` files)
- Gleam stdlib in `runtime/gleam_stdlib/`

### 2. Run Tests

```bash
deno test
```

Tests are located in `lib/ts/*.test.ts` and import from the staged runtime.

### 3. Package for Distribution

Build both npm and JSR packages:

```bash
deno task package
```

This creates:
- `.dist/npm/` - npm package (via Deno DNT)
- `.dist/jsr/` - JSR package (direct file copies)

Both include the Gleam runtime and TypeScript wrappers.

## Development Workflow

### Making Changes to TypeScript API

1. Edit files in `lib/`
2. Run tests: `deno test`
3. Package: `deno task package`

### Making Changes to Gleam Core

1. Edit files in `src/folklore/`
2. Rebuild runtime: `deno task gleam:build`
3. Run tests: `deno test`
4. Package: `deno task package`

### Adding New Functions

When adding new Gleam functions:

1. Add the function to `src/folklore/maybe.gleam` or `src/folklore/result.gleam`
2. Update the TypeScript declarations in `.tasks/gleam.ts` (search for `maybeDeclaration` or `resultDeclaration`)
3. Add the TypeScript wrapper method in `lib/maybe.ts` or `lib/result.ts`
4. Add tests in the corresponding `.test.ts` file
5. Rebuild and test

## Release Process

1. Update version in `gleam.toml` (single source of truth)
2. Run full build and test suite:
   ```bash
   deno task gleam:build
   deno test
   deno task package
   ```
3. Commit changes
4. Create and push git tag
5. Publish to npm: `deno task package:publish`
6. Publish to JSR: `cd .dist/jsr && deno publish`

## Important Notes

- **Never commit `runtime/` or `.dist/`** - these are generated
- **The `src/` directory is for Gleam only** - TypeScript lives in `lib/`
- **Always run `gleam:build` after changing Gleam sources** - TypeScript tests depend on the runtime
- **Keep TypeScript declarations in sync** - Update `.tasks/gleam.ts` when changing Gleam signatures

## Questions?

Feel free to open an issue for any questions or suggestions!
