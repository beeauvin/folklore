/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export type Just<Type> = Type extends Nothing ? never : Type
export type Nothing = null | undefined

export class Maybe<Type> {
  private constructor(private readonly value: Just<Type> | Nothing = undefined) {}

  public isJust(): boolean {
    return !this.isNothing()
  }
  public isNothing(): boolean {
    return this.value == null
  }

  public matchWith<JustReturnType, NothingReturnType>(pattern: {
    Just: (value: Just<Type>) => JustReturnType
    Nothing: () => NothingReturnType
  }): JustReturnType | NothingReturnType {
    if (this.isJust()) return pattern.Just(this.value!)
    else return pattern.Nothing()
  }

  /**
   * Gets the value of a maybe or throws an error if it's nothing.
   *
   * @experimental may change or be removed in patch releases
   * @see https://github.com/cassiecascade/folklore/issues/23
   */
  public getOrThrow(): Type {
    return this.matchWith({
      Just: (value) => value,
      Nothing: () => {
        throw new Error('tried to get a maybe value that was nothing')
      },
    })
  }

  public getOrElse(defaultValue: Just<Type>): Just<Type> {
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

  public map<HandlerType>(handler: (value: Type) => Just<HandlerType>): Maybe<HandlerType> {
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

  public static HasInstance<Type>(value: Type): boolean {
    return value instanceof Maybe
  }

  public static FromNullable<Type>(value: Type | Nothing): Maybe<Type> {
    if (value == null) return Maybe.Nothing()
    return Maybe.Just(value)
  }

  public static Just<Type>(value: Just<Type>): Maybe<Type> {
    return new Maybe(value)
  }

  public static Nothing<Type>(): Maybe<Type> {
    return new Maybe()
  }
}
