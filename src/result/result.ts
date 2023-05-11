/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export class Result<T, E = string | Error> {
  private constructor(private readonly value: T, private readonly error: E) {}

  public isOk(): boolean {
    return this.value != null
  }

  public isError(): boolean {
    return this.error != null
  }

  public match<U>(ok: (value: T) => U, error: (error: E) => U): U {
    if (this.isOk()) return ok(this.value)
    else return error(this.error)
  }

  public matchWith<U>(pattern: { ok: (value: T) => U; error: (error: E) => U }): U {
    return this.match(pattern.ok, pattern.error)
  }

  public getOrElse(defaultValue: T): T {
    return this.match(
      (value) => value,
      () => defaultValue
    )
  }

  public getOrDo(action: () => T): T {
    return this.match(
      (value) => value,
      () => action()
    )
  }

  public static Ok<T>(value: T): Result<T, never> {
    return new Result<T, never>(value, undefined as never)
  }

  public static Error<T, E>(error: E): Result<T, typeof error> {
    return new Result<T, E>(undefined as never, error)
  }
}
