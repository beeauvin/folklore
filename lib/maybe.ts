/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { Nullable } from './utility/types.ts'
import * as gleamOption from '../runtime/folklore/folklore/option.mjs'

/**
 * Represents an optional value that may or may not exist.
 *
 * Maybe is a type-safe way to handle nullable values without using null or undefined
 * directly. A Maybe is either Just (contains a value) or Nothing (empty).
 *
 * This pattern eliminates null errors by forcing you to explicitly handle the
 * absence of a value at compile time.
 *
 * @typeParam Type - The type of the value when it exists (Just case)
 *
 * @example
 * ```ts
 * // Basic usage
 * function findUser(id: string): Maybe<User> {
 *   const user = users.get(id)
 *   return Maybe.FromNullable(user)
 * }
 *
 * const result = findUser('123')
 * result.matchWith({
 *   Just: (user) => console.log(`Found: ${user.name}`),
 *   Nothing: () => console.log('User not found')
 * })
 * ```
 *
 * @example
 * ```ts
 * // Chaining operations
 * const userName = findUser(id)
 *   .map(user => user.profile)
 *   .map(profile => profile.name)
 *   .getOrElse('Anonymous')
 * ```
 *
 * @example
 * ```ts
 * // Creating Maybe values
 * const just = Maybe.Just(42)
 * const nothing = Maybe.Nothing<number>()
 * const fromNullable = Maybe.FromNullable(possiblyNull)
 * ```
 */
export class Maybe<Type> {
  private constructor(private readonly inner: unknown) {}

  private unwrapOrThrow(message: string): NonNullable<Type> {
    return gleamOption.unwrap_with(this.inner as never, (): never => {
      throw new Error(message)
    }) as NonNullable<Type>
  }

  /**
   * Type guard to check if a value is a Maybe instance.
   *
   * @typeParam Type - The expected type of the Maybe's value
   * @param value - The value to check
   * @returns True if the value is a Maybe instance
   *
   * @example
   * ```ts
   * const value: unknown = Maybe.Just(42)
   * if (Maybe.HasInstance(value)) {
   *   // TypeScript now knows value is Maybe<unknown>
   *   console.log(value.isJust())
   * }
   * ```
   */
  public static HasInstance<Type>(value: unknown): value is Maybe<Type> {
    return value instanceof Maybe
  }

  /**
   * Checks if this Maybe contains a value.
   *
   * @returns True if this is a Just (has a value), false if it's Nothing
   *
   * @example
   * ```ts
   * const maybe = Maybe.Just(42)
   * if (maybe.isJust()) {
   *   console.log('Has a value!')
   * }
   * ```
   *
   * @see {@link isNothing} to check if empty
   * @see {@link matchWith} for handling both cases
   */
  public isJust(): boolean {
    return Boolean(gleamOption.is_just(this.inner as never))
  }

  /**
   * Checks if this Maybe is empty (has no value).
   *
   * @returns True if this is Nothing (empty), false if it's Just
   *
   * @example
   * ```ts
   * const maybe = Maybe.Nothing<number>()
   * if (maybe.isNothing()) {
   *   console.log('No value present')
   * }
   * ```
   *
   * @see {@link isJust} to check if has a value
   * @see {@link matchWith} for handling both cases
   */
  public isNothing(): boolean {
    return Boolean(gleamOption.is_nothing(this.inner as never))
  }

  /**
   * Pattern matches on the Maybe, executing different handlers for Just and Nothing cases.
   *
   * This is the primary way to extract values from a Maybe. Both cases must be handled,
   * ensuring you never forget to handle the absence of a value.
   *
   * @typeParam JustReturnType - The return type of the Just handler
   * @typeParam NothingReturnType - The return type of the Nothing handler
   * @param pattern - An object with Just and Nothing handler functions
   * @returns The result of whichever handler was executed
   *
   * @example
   * ```ts
   * const maybe = findUser('123')
   * const message = maybe.matchWith({
   *   Just: (user) => `Hello, ${user.name}!`,
   *   Nothing: () => 'User not found'
   * })
   * ```
   *
   * @example
   * ```ts
   * // Different return types from each branch
   * const value = maybe.matchWith({
   *   Just: (val) => val.length,
   *   Nothing: () => 0
   * })
   * ```
   *
   * @see {@link map} for transforming only Just values
   * @see {@link getOrElse} for a simpler way to provide defaults
   */
  public matchWith<JustReturnType, NothingReturnType>(pattern: {
    Just: (value: NonNullable<Type>) => JustReturnType
    Nothing: () => NothingReturnType
  }): JustReturnType | NothingReturnType {
    if (this.isJust()) {
      const value = this.unwrapOrThrow(
        'Attempted to match Nothing without a fallback',
      )
      return pattern.Just(value)
    } else {
      return pattern.Nothing()
    }
  }

  /**
   * Extracts the value from a Just or throws an error if it's Nothing.
   *
   * **Warning:** This method throws exceptions and should be used sparingly.
   * Prefer {@link getOrElse} or {@link matchWith} for safer error handling.
   *
   * @param error - The error message to throw if this is Nothing
   * @returns The value if Just
   * @throws {Error} If this is Nothing
   *
   * @experimental May change or be removed in patch releases
   * @see https://github.com/beeauvin/folklore/issues/23
   *
   * @example
   * ```ts
   * const maybe = Maybe.Just(42)
   * const value = maybe.getOrThrow()  // 42
   * ```
   *
   * @example
   * ```ts
   * const maybe = Maybe.Nothing<number>()
   * const value = maybe.getOrThrow('Value required!')
   * // throws Error: Value required!
   * ```
   *
   * @see {@link getOrElse} for a safer alternative with default values
   * @see {@link matchWith} for handling both cases without exceptions
   */
  public getOrThrow(
    error = 'tried to get a maybe value that was nothing',
  ): Type {
    return this.unwrapOrThrow(error) as Type
  }

  /**
   * Gets the Just value or returns a default value if this is Nothing.
   *
   * This provides a simple way to extract a value from a Maybe with a fallback,
   * without needing to use pattern matching.
   *
   * @param defaultValue - The value to return if this is Nothing
   * @returns The Just value or the default value
   *
   * @example
   * ```ts
   * const maybe = Maybe.Just(42)
   * const value = maybe.getOrElse(0)  // 42
   * ```
   *
   * @example
   * ```ts
   * const maybe = Maybe.Nothing<number>()
   * const value = maybe.getOrElse(0)  // 0
   * ```
   *
   * @example
   * ```ts
   * const userName = findUser(id)
   *   .map(user => user.name)
   *   .getOrElse('Anonymous')
   * ```
   *
   * @see {@link orElse} for providing an alternative Maybe
   * @see {@link matchWith} to handle Nothing differently
   * @see {@link getOrThrow} to throw instead of using a default
   */
  public getOrElse(defaultValue: NonNullable<Type>): NonNullable<Type> {
    return gleamOption.get_or_else(
      this.inner as never,
      defaultValue,
    ) as NonNullable<Type>
  }

  /**
   * Returns this Maybe if it's Just, otherwise calls the handler to provide an alternative.
   *
   * This allows you to provide an alternative Maybe when this one is Nothing,
   * useful for trying fallback operations or providing computed defaults.
   *
   * @typeParam HandlerType - The type of value in the alternative Maybe
   * @param handler - Function that returns an alternative Maybe
   * @returns This Maybe if Just, otherwise the Maybe from the handler
   *
   * @example
   * ```ts
   * const result = findInCache(key)
   *   .orElse(() => findInDatabase(key))
   *   .orElse(() => Maybe.Just(defaultValue))
   * ```
   *
   * @example
   * ```ts
   * const config = getLocalConfig()
   *   .orElse(() => fetchRemoteConfig())
   *   .orElse(() => Maybe.Just(DEFAULT_CONFIG))
   * ```
   *
   * @see {@link getOrElse} for simple default values
   * @see {@link chain} for chaining operations on Just values
   */
  public orElse<HandlerType>(
    handler: () => Maybe<HandlerType>,
  ): Maybe<Type> | Maybe<HandlerType> {
    if (this.isJust()) {
      return this
    } else {
      return handler()
    }
  }

  /**
   * Transforms the Just value using the provided function.
   *
   * If the Maybe is Just, applies the handler to the value and returns a new Just Maybe.
   * If the Maybe is Nothing, returns Nothing without calling the handler.
   *
   * This allows you to chain transformations on present values while automatically
   * propagating Nothing.
   *
   * @typeParam HandlerType - The type returned by the transformation function
   * @param handler - Function to transform the Just value
   * @returns A new Maybe with the transformed value or Nothing
   *
   * @example
   * ```ts
   * const maybe = Maybe.Just('hello')
   *   .map(s => s.toUpperCase())
   *   .map(s => s.length)
   * // Maybe.Just(5)
   * ```
   *
   * @example
   * ```ts
   * const nothing = Maybe.Nothing<string>()
   *   .map(s => s.toUpperCase())
   * // Maybe.Nothing() - handler never called
   * ```
   *
   * @example
   * ```ts
   * // Chaining property access safely
   * const email = findUser(id)
   *   .map(user => user.profile)
   *   .map(profile => profile.email)
   * ```
   *
   * @see {@link chain} for transformations that return Maybe
   * @see {@link matchWith} to handle both Just and Nothing cases
   */
  public map<HandlerType>(
    handler: (value: Type) => NonNullable<HandlerType>,
  ): Maybe<HandlerType> {
    if (this.isJust()) {
      const value = this.unwrapOrThrow('Attempted to map a Nothing value')
      return Maybe.Just(handler(value))
    } else {
      return Maybe.Nothing<HandlerType>()
    }
  }

  /**
   * Transforms the Just value using a function that returns a Maybe (also known as flatMap).
   *
   * Similar to {@link map}, but the handler function returns a Maybe instead of a plain value.
   * This is useful for chaining operations that may themselves return Nothing, avoiding nested Maybes.
   *
   * @typeParam HandlerType - The type of the value in the Maybe returned by the handler
   * @param handler - Function that takes the Just value and returns a new Maybe
   * @returns The Maybe returned by the handler, or Nothing
   *
   * @example
   * ```ts
   * // Chaining operations that may return Nothing
   * const result = findUser(userId)
   *   .chain(user => findDepartment(user.deptId))
   *   .chain(dept => findManager(dept.managerId))
   * ```
   *
   * @example
   * ```ts
   * // Without chain, you'd get Maybe<Maybe<T>>
   * const nested = Maybe.Just(5).map(x => findValue(x))
   * // Maybe<Maybe<number>>
   *
   * // With chain, the Maybe is flattened
   * const flat = Maybe.Just(5).chain(x => findValue(x))
   * // Maybe<number>
   * ```
   *
   * @see {@link map} for simple value transformations
   */
  public chain<HandlerType>(
    handler: (value: Type) => Maybe<HandlerType>,
  ): Maybe<HandlerType> {
    if (this.isJust()) {
      const value = this.unwrapOrThrow('Attempted to chain on a Nothing value')
      return handler(value)
    } else {
      return Maybe.Nothing<HandlerType>()
    }
  }

  /**
   * Converts a nullable value into a Maybe.
   *
   * This is the primary way to create Maybe values from existing code that uses
   * null or undefined. If the value is null or undefined, returns Nothing.
   * Otherwise, returns Just with the value.
   *
   * @typeParam Type - The type of the value
   * @param value - A value that may be null or undefined
   * @returns Just if the value exists, Nothing if it's null or undefined
   *
   * @example
   * ```ts
   * const map = new Map([['key', 'value']])
   * const maybe = Maybe.FromNullable(map.get('key'))
   * // Maybe.Just('value')
   * ```
   *
   * @example
   * ```ts
   * const maybe = Maybe.FromNullable(null)
   * // Maybe.Nothing()
   * ```
   *
   * @example
   * ```ts
   * // Wrapping optional object properties
   * function getEmail(user: { email?: string }): Maybe<string> {
   *   return Maybe.FromNullable(user.email)
   * }
   * ```
   *
   * @see {@link Just} for creating a Maybe with a guaranteed value
   * @see {@link Nothing} for creating an empty Maybe
   */
  public static FromNullable<Type>(value: Nullable<Type>): Maybe<Type> {
    if (value == null) return Maybe.Nothing<Type>()
    else return Maybe.Just<Type>(value!)
  }

  /**
   * Creates a Maybe containing a value.
   *
   * Use this when you have a value that definitely exists and want to wrap it
   * in a Maybe for use with other Maybe-returning functions.
   *
   * @typeParam Type - The type of the value
   * @param value - A non-null, non-undefined value
   * @returns A Maybe containing the value
   *
   * @example
   * ```ts
   * const maybe = Maybe.Just(42)
   * ```
   *
   * @example
   * ```ts
   * // Useful for creating a known value in a Maybe chain
   * const result = Maybe.Just(user)
   *   .map(u => u.settings)
   *   .chain(s => findPreference(s))
   * ```
   *
   * @see {@link Nothing} for creating an empty Maybe
   * @see {@link FromNullable} for converting nullable values
   */
  public static Just<Type>(value: NonNullable<Type>): Maybe<Type> {
    return new Maybe<Type>(gleamOption.just(value))
  }

  /**
   * Creates an empty Maybe representing the absence of a value.
   *
   * @typeParam Type - The type the Maybe would contain if it had a value
   * @returns An empty Maybe
   *
   * @example
   * ```ts
   * function findUser(id: string): Maybe<User> {
   *   if (!isValid(id)) {
   *     return Maybe.Nothing()
   *   }
   *   // ... search logic
   * }
   * ```
   *
   * @example
   * ```ts
   * const nothing = Maybe.Nothing<number>()
   * nothing.isNothing()  // true
   * ```
   *
   * @see {@link Just} for creating a Maybe with a value
   * @see {@link FromNullable} for converting nullable values
   */
  public static Nothing<Type>(): Maybe<Type> {
    return new Maybe<Type>(gleamOption.nothing())
  }
}
