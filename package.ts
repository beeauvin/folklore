// Copyright © 2025 Cassidy Spring (Bee).
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import * as jsr from './jsr.json' with { type: 'json' }

export const pkg = {
  name: 'folklore',
  version: jsr.default.version,
  description:
    'A small, focused TypeScript library for safer code through functional patterns. Inspired by folktale.',
  author: 'Cassidy Spring (Bee) <79487947+beeauvin@users.noreply.github.com>',
  license: 'MPL-2.0',
  homepage: 'https://github.com/beeauvin/folklore#readme',
  repository: {
    type: 'git',
    url: 'git+https://github.com/beeauvin/folklore.git',
  },
  bugs: {
    url: 'https://github.com/beeauvin/folklore/issues',
  },
}
