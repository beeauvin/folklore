/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { build, emptyDir } from 'dnt/mod.ts'

import { pkg } from '../package.ts'

await emptyDir('./.dist')

await build({
  entryPoints: ['./mod.ts'],
  outDir: './.dist',
  test: false,
  esModule: true,
  scriptModule: 'cjs',
  skipSourceOutput: true,
  declaration: 'inline',
  shims: {
    deno: 'dev',
  },
  package: pkg,
  postBuild() {
    Deno.copyFileSync('license.md', '.dist/license.md')
    Deno.copyFileSync('readme.md', '.dist/readme.md')
    Deno.removeSync('.dist/.npmignore')
  },
})
