/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Base } from '../abstract/base.ts'
import type { Nullable } from '../utility/types.ts'
import { is_nothing } from '../comparison/is-nothing.ts'
import { is_something } from '../comparison/is-something.ts'

export class Maybe<Type> extends Base {
  private constructor(private readonly value: Nullable<Type> = undefined) {
    super()
  }

  public isJust(): boolean {
    return is_something(this.value)
  }

  public isNothing(): boolean {
    return is_nothing(this.value)
  }

  public matchWith<JustReturnType, NothingReturnType>(pattern: {
    Just: (value: NonNullable<Type>) => JustReturnType
    Nothing: () => NothingReturnType
  }): JustReturnType | NothingReturnType {
    if (this.isJust()) return pattern.Just(this.value!)
    else return pattern.Nothing()
  }

  /**
   * Gets the value of a maybe or throws an error if it's nothing.
   *
   * @experimental may change or be removed in patch releases
   * @see https://github.com/beeauvin/folklore/issues/23
   */
  public getOrThrow(error = 'tried to get a maybe value that was nothing'): Type {
    return this.matchWith({
      Just: (value) => value,
      Nothing: () => {
        throw new Error(error)
      },
    })
  }

  public getOrElse(defaultValue: NonNullable<Type>): NonNullable<Type> {
    return this.matchWith({
      Just: (value) => value,
      Nothing: () => defaultValue,
    })
  }

  public orElse<HandlerType>(handler: () => Maybe<HandlerType>): Maybe<Type> | Maybe<HandlerType> {
    return this.matchWith({
      Just: (value) => Maybe.Just(value),
      Nothing: () => handler(),
    })
  }

  public map<HandlerType>(handler: (value: Type) => NonNullable<HandlerType>): Maybe<HandlerType> {
    return this.matchWith({
      Just: (value) => Maybe.Just(handler(value)),
      Nothing: () => Maybe.Nothing(),
    })
  }

  public chain<HandlerType>(handler: (value: Type) => Maybe<HandlerType>): Maybe<HandlerType> {
    return this.matchWith({
      Just: (value) => handler(value),
      Nothing: () => Maybe.Nothing(),
    })
  }

  public static FromNullable<Type>(value: Nullable<Type>): Maybe<Type> {
    if (is_nothing(value)) return Maybe.Nothing()
    else return Maybe.Just(value!)
  }

  public static Just<Type>(value: NonNullable<Type>): Maybe<Type> {
    return new Maybe(value)
  }

  public static Nothing<Type>(): Maybe<Type> {
    return new Maybe()
  }
}
