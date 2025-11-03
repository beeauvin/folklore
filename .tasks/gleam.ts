/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { join } from '@std/path'

/**
 * Runs the Gleam compiler with the specified target.
 */
async function runGleam(args: string[]) {
  const command = new Deno.Command('gleam', { args, cwd: '.' })
  const { success, stdout, stderr } = await command.output()

  if (!success) {
    const decoder = new TextDecoder()
    const message = decoder.decode(stderr) || decoder.decode(stdout)
    throw new Error(message.trim() || `gleam ${args.join(' ')} failed`)
  }
}

/**
 * Builds the Gleam project with the JavaScript target.
 * This generates .mjs files and TypeScript declarations in build/dev/javascript.
 */
export async function buildGleam() {
  await runGleam(['build', '--target', 'javascript'])
}

/**
 * Removes a directory if it exists.
 */
async function removeDir(path: string) {
  try {
    await Deno.remove(path, { recursive: true })
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error
    }
  }
}

/**
 * Recursively copies a directory.
 */
async function copyDir(source: string, destination: string) {
  await Deno.mkdir(destination, { recursive: true })

  for await (const entry of Deno.readDir(source)) {
    const from = join(source, entry.name)
    const to = join(destination, entry.name)

    if (entry.isDirectory) {
      await copyDir(from, to)
    } else if (entry.isFile) {
      await Deno.copyFile(from, to)
    }
  }
}

/**
 * Prepares the Gleam runtime by building and copying output to runtime/.
 * The runtime/ directory contains all compiled JavaScript and TypeScript declarations
 * that the TypeScript wrappers import.
 */
export async function prepareGleamRuntime() {
  const BUILD_OUTPUT = join('build', 'dev', 'javascript')
  const RUNTIME_DIR = 'runtime'

  // Build the Gleam project
  await buildGleam()

  // Clean and recreate runtime directory
  await removeDir(RUNTIME_DIR)

  // Copy the entire build output to runtime/
  // This includes:
  // - prelude.mjs and prelude.d.mts (Gleam's core types)
  // - gleam_stdlib/ (standard library)
  // - folklore/ (our compiled Gleam code)
  await copyDir(BUILD_OUTPUT, RUNTIME_DIR)
}

/**
 * Copies runtime artifacts to a distribution directory.
 * Used during packaging to include Gleam runtime in npm/JSR distributions.
 */
export async function copyRuntimeArtifacts(outDir: string) {
  const RUNTIME_DIR = 'runtime'
  const destination = join(outDir, 'runtime')

  await removeDir(destination)
  await copyDir(RUNTIME_DIR, destination)
}

// Run prepareGleamRuntime when this file is executed directly
if (import.meta.main) {
  await prepareGleamRuntime()
}
