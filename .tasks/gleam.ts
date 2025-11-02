/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { dirname, join } from "@std/path";

async function runCommand(executable: string, args: string[], cwd: string) {
  const command = new Deno.Command(executable, { args, cwd });
  const { success, stdout, stderr } = await command.output();

  if (!success) {
    const decoder = new TextDecoder();
    const message = decoder.decode(stderr) || decoder.decode(stdout);
    throw new Error(message.trim() || `${executable} ${args.join(" ")}`);
  }
}

export async function buildGleam(
  target: "javascript" | "erlang" = "javascript",
) {
  await runCommand("gleam", ["build", "--target", target], "gleam");
}

const RUNTIME_DIR = "runtime";
const BUILD_OUTPUT = join("gleam", "build", "dev", "javascript");
const FOLKLORE_DIR = "folklore_gleam";
const FOLKLORE_SOURCE = join(BUILD_OUTPUT, FOLKLORE_DIR);
const STD_SOURCE = join(BUILD_OUTPUT, "gleam_stdlib");
const PRELUDE_SOURCE = join(BUILD_OUTPUT, "prelude.mjs");
const VERSION_SOURCE = join(BUILD_OUTPUT, "gleam_version");

const maybeDeclaration = `export type Maybe<T> = Some<T> | None

export declare class Some<T> {
  readonly 0: T
}

export declare class None {
  readonly 0: undefined
}

export declare function just<T>(value: T): Maybe<T>
export declare function nothing<T>(): Maybe<T>
export declare function is_just<T>(maybe: Maybe<T>): boolean
export declare function is_nothing<T>(maybe: Maybe<T>): boolean
export declare function map<A, B>(maybe: Maybe<A>, mapper: (value: A) => B): Maybe<B>
export declare function chain<A, B>(maybe: Maybe<A>, mapper: (value: A) => Maybe<B>): Maybe<B>
export declare function get_or_else<T>(maybe: Maybe<T>, defaultValue: T): T
export declare function or_else<T>(maybe: Maybe<T>, handler: () => Maybe<T>): Maybe<T>
export declare function unwrap_with<T>(maybe: Maybe<T>, fallback: () => T): T
`;

const resultDeclaration = `export type Result<T, E> = Ok<T> | Error<E>

export declare class Ok<T> {
  readonly 0: T
}

export declare class Error<E> {
  readonly 0: E
}

export declare function ok<T, E = never>(value: T): Result<T, E>
export declare function error<T = never, E = unknown>(err: E): Result<T, E>
export declare function is_ok<T, E>(result: Result<T, E>): boolean
export declare function is_error<T, E>(result: Result<T, E>): boolean
export declare function map<A, B, E>(result: Result<A, E>, mapper: (value: A) => B): Result<B, E>
export declare function map_error<T, A, B>(result: Result<T, A>, mapper: (error: A) => B): Result<T, B>
export declare function chain<A, B, E>(result: Result<A, E>, mapper: (value: A) => Result<B, E>): Result<B, E>
export declare function get_or_else<T, E>(result: Result<T, E>, defaultValue: T): T
export declare function or_else<T, E>(result: Result<T, E>, handler: (error: E) => Result<T, E>): Result<T, E>
export declare function unwrap_ok_with<T, E>(result: Result<T, E>, fallback: (error: E) => T): T
export declare function unwrap_error_with<T, E>(result: Result<T, E>, fallback: (value: T) => E): E
`;

async function resetDirectory(path: string) {
  try {
    await Deno.remove(path, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }
}

async function copyDir(source: string, destination: string) {
  await Deno.mkdir(destination, { recursive: true });

  for await (const entry of Deno.readDir(source)) {
    const from = join(source, entry.name);
    const to = join(destination, entry.name);

    if (entry.isDirectory) {
      await copyDir(from, to);
    } else if (entry.isFile) {
      await Deno.mkdir(dirname(to), { recursive: true });
      await Deno.copyFile(from, to);
    }
  }
}

async function writeDeclarations(targetRoot: string) {
  const folkloreDir = join(targetRoot, FOLKLORE_DIR, "folklore");
  await Deno.mkdir(folkloreDir, { recursive: true });

  const maybePath = join(folkloreDir, "maybe.d.mts");
  const resultPath = join(folkloreDir, "result.d.mts");

  await Deno.writeTextFile(maybePath, maybeDeclaration);
  await Deno.writeTextFile(resultPath, resultDeclaration);
}

export async function prepareGleamRuntime() {
  await buildGleam("javascript");
  await resetDirectory(RUNTIME_DIR);
  await Deno.mkdir(RUNTIME_DIR, { recursive: true });
  await copyDir(FOLKLORE_SOURCE, join(RUNTIME_DIR, FOLKLORE_DIR));
  await copyDir(STD_SOURCE, join(RUNTIME_DIR, "gleam_stdlib"));
  await Deno.copyFile(PRELUDE_SOURCE, join(RUNTIME_DIR, "prelude.mjs"));
  await Deno.copyFile(VERSION_SOURCE, join(RUNTIME_DIR, "gleam_version"));
  await writeDeclarations(RUNTIME_DIR);
}

export async function copyRuntimeArtifacts(outDir: string) {
  const destination = join(outDir, "runtime");
  await resetDirectory(destination);
  await copyDir(RUNTIME_DIR, destination);
}
