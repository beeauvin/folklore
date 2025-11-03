/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { parse } from '@std/toml'

const gleamToml = parse(await Deno.readTextFile('./gleam.toml')) as {
  name: string
  version: string
}

const version = gleamToml.version
const description =
  'A small, focused TypeScript library for safer code through functional patterns. Inspired by folktale.'
const author = 'Cassidy Spring (Bee) <79487947+beeauvin@users.noreply.github.com>'
const license = 'MPL-2.0'
const homepage = 'https://github.com/beeauvin/folklore#readme'
const repository = {
  type: 'git',
  url: 'git+https://github.com/beeauvin/folklore.git',
}
const bugs = {
  url: 'https://github.com/beeauvin/folklore/issues',
}

export const pkg = {
  name: 'folklore',
  version,
  description,
  author,
  license,
  homepage,
  repository,
  bugs,
}

export const jsrManifest = {
  name: '@folklore/folklore',
  version,
  exports: './lib/mod.ts',
}
