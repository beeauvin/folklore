/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { build, emptyDir } from '@deno/dnt'
import { dirname, join } from '@std/path'

import { jsrManifest, pkg } from '../package.ts'
import { copyRuntimeArtifacts, prepareGleamRuntime } from './gleam.ts'

const DIST_ROOT = '.dist'
const NPM_OUT = join(DIST_ROOT, 'npm')
const JSR_OUT = join(DIST_ROOT, 'jsr')

await prepareGleamRuntime()
await emptyDir(DIST_ROOT)

await build({
  entryPoints: ['./lib/mod.ts'],
  outDir: NPM_OUT,
  test: false,
  esModule: true,
  scriptModule: 'cjs',
  skipSourceOutput: true,
  declaration: 'inline',
  shims: {
    deno: 'dev',
  },
  package: pkg,
  async postBuild() {
    await copyRuntimeArtifacts(NPM_OUT)
    await copyStaticAssets(NPM_OUT)
  },
})

await buildJsrBundle()

async function buildJsrBundle() {
  await copyRuntimeArtifacts(JSR_OUT)
  await copyTree('lib', join(JSR_OUT, 'lib'))
  await copyTree('readme.md', join(JSR_OUT, 'readme.md'))
  await copyTree('license.md', join(JSR_OUT, 'license.md'))
  await writeJsonFile(join(JSR_OUT, 'jsr.json'), jsrManifest)
}

async function copyStaticAssets(dest: string) {
  await copyTree('license.md', join(dest, 'license.md'))
  await copyTree('readme.md', join(dest, 'readme.md'))
  // DNT creates .npmignore we do not need
  const npmIgnore = join(dest, '.npmignore')
  try {
    await Deno.remove(npmIgnore)
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error
    }
  }
}

async function writeJsonFile(destination: string, data: unknown) {
  await Deno.mkdir(dirname(destination), { recursive: true })
  const contents = `${JSON.stringify(data, null, 2)}\n`
  await Deno.writeTextFile(destination, contents)
}

async function copyTree(source: string, destination: string) {
  const info = await Deno.lstat(source)
  if (info.isDirectory) {
    await Deno.mkdir(destination, { recursive: true })
    for await (const entry of Deno.readDir(source)) {
      await copyTree(join(source, entry.name), join(destination, entry.name))
    }
  } else if (info.isFile) {
    await Deno.mkdir(dirname(destination), { recursive: true })
    await Deno.copyFile(source, destination)
  }
}
