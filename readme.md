<p align="center">
  <img src="./.media/folklore.png" width="100" alt="folklore logo" />
</p>

<p align="center">
  A small, focused TypeScript library for safer code through functional patterns. Inspired by <a href="https://folktale.origamitower.com">folktale</a>,
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/folklore"><img src="https://img.shields.io/npm/l/folklore.svg" alt="Package License" /></a>
  <a href="https://jsr.io/@folklore/folklore"><img src="https://jsr.io/badges/@folklore/folklore" alt="JSR Version" /></a>
  <a href="https://www.npmjs.com/package/folklore"><img src="https://img.shields.io/npm/dm/folklore.svg" alt="NPM Downloads" /></a>
  <a href="https://github.com/beeauvin/folklore/actions/workflows/continuous-integration.yml"><img src="https://github.com/beeauvin/folklore/actions/workflows/continuous-integration.yml/badge.svg" alt="continuous integration" /></a>
  <a href="https://codecov.io/gh/beeauvin/folklore"><img src="https://codecov.io/gh/beeauvin/folklore/graph/badge.svg?token=19O67TDUG0"/></a>
</p>

# folklore

Folklore provides two essential types for writing more reliable TypeScript: `Maybe` for handling
optional values and `Result` for managing errors without exceptions.

## Installation

**JSR (recommended for Deno/modern setups):**

```bash
# Deno
deno add jsr:@folklore/folklore

# npm (via JSR)
npx jsr add @folklore/folklore
```

**npm:**

```bash
npm install folklore
```

## Quick Start

### Maybe - Safe Optional Values

Handle nullable values without null checks:

```typescript
import { Maybe } from 'folklore'

function findUser(id: string): Maybe<User> {
  const user = database.get(id)
  return Maybe.FromNullable(user)
}

const greeting = findUser('123')
  .map((user) => user.name)
  .map((name) => `Hello, ${name}!`)
  .getOrElse('Hello, stranger!')
```

### Result - Error Handling Without Exceptions

Manage errors explicitly in your type system:

```typescript
import { Result } from 'folklore'

function parseConfig(json: string): Result<Config> {
  return Result.Try(() => JSON.parse(json))
    .chain((data) => validateConfig(data))
}

const config = parseConfig(input)
  .matchWith({
    Ok: (cfg) => console.log('Loaded config:', cfg),
    Error: (err) => console.error('Failed to load config:', err),
  })

// Or with async operations
const response = await Result.FromPromise(fetch('/api/data'))
  .then((result) => result.map((res) => res.json()))
```

## API

The library includes comprehensive JSDoc documentation - your editor's IntelliSense will show you
examples and usage guidance for every method. See
[#13: A Retelling, not a reimplementation](https://github.com/beeauvin/folklore/issues/13) for more
details on API decisions.

## Status & Contributing

Folklore is used in production on several large/critical TypeScript projects and is well-tested.

If you're interested in contributing, please open an issue to discuss your idea first. I am very
open to anything docs/stability/project related.

## License

folklore is provided under the [Mozilla Public License 2.0](https://mozilla.org/MPL/2.0/).

A copy of the MPLv2 is included [license.md](/license.md) file for convenience.
