/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { Nullable } from '../utility/types.ts'
import { is_nothing } from '../comparison/is-nothing.ts'
import { is_something } from '../comparison/is-something.ts'
import { is_instance_of } from '../comparison/is-instance-of.ts'
import { get_or_else } from '../operators/get-or-else.ts'
import { map_monad } from '../operators/map-monad.ts'
import { chain_monad } from '../operators/chain-monad.ts'
import { or_else_monad } from '../operators/or-else-monad.ts'
import { match_with } from '../operators/match-with.ts'

export class Maybe<Type> {
  private constructor(private readonly value: Nullable<Type> = undefined) {}

  public static HasInstance<Type>(value: unknown): value is Maybe<Type> {
    return is_instance_of(Maybe, value)
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
    return match_with(
      this.isJust(),
      this.value!,
      undefined,
      pattern.Just,
      pattern.Nothing,
    )
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
    return get_or_else(this.isJust(), this.value!, defaultValue)
  }

  public orElse<HandlerType>(handler: () => Maybe<HandlerType>): Maybe<Type> | Maybe<HandlerType> {
    return or_else_monad(
      this.isJust(),
      this.value!,
      handler,
      (value: NonNullable<Type>) => Maybe.Just(value),
    ) as Maybe<Type> | Maybe<HandlerType>
  }

  public map<HandlerType>(handler: (value: Type) => NonNullable<HandlerType>): Maybe<HandlerType> {
    return map_monad(
      this.isJust(),
      this.value!,
      undefined,
      handler,
      (value: NonNullable<HandlerType>) => Maybe.Just(value),
      () => Maybe.Nothing<HandlerType>(),
    ) as Maybe<HandlerType>
  }

  public chain<HandlerType>(handler: (value: Type) => Maybe<HandlerType>): Maybe<HandlerType> {
    return chain_monad(
      this.isJust(),
      this.value!,
      undefined,
      handler,
      () => Maybe.Nothing<HandlerType>(),
    ) as Maybe<HandlerType>
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
