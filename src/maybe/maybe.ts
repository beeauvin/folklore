/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export class Maybe<T> {
  private constructor(private readonly value: T | undefined = undefined) {}

  public isJust(): boolean {
    return this.value != null
  }

  public isNothing(): boolean {
    return this.value == null
  }

  public match<U>(just: (value: T) => U, nothing: () => U): U {
    if (this.isJust()) return just(this.value as T)
    else return nothing()
  }

  public matchWith<U>(pattern: { just: (value: T) => U; nothing: () => U }): U {
    return this.match(pattern.just, pattern.nothing)
  }

  public do(action: (value: T) => void): void {
    if (this.isJust()) action(this.value as T)
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

  public getOrThrow(): T {
    return this.match(
      (value) => value,
      () => {
        throw new Error('tried to get a maybe value that was null')
      }
    )
  }

  public static FromNullable<U>(value: U | null | undefined): Maybe<U> {
    if (value == null) return Maybe.Nothing()
    return Maybe.Just(value)
  }

  public static Just<T>(value: T): Maybe<typeof value> {
    return new Maybe(value)
  }

  public static Nothing<T>(): Maybe<T> {
    return new Maybe()
  }
}
