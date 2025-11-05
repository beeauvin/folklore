/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { Nullable } from '../utility/types.ts'

/**
 * Represents an optional value that may or may not exist.
 *
 * Optional provides a type-safe way to handle nullable values with an API
 * inspired by Swift's Optional type. An Optional is either Some (contains a value)
 * or None (empty).
 *
 * The primary feature is the `otherwise` method family, which provides a natural
 * language alternative to the null-coalescing operator, making code more readable
 * and intention-revealing.
 *
 * @typeParam Type - The type of the value when it exists (Some case)
 *
 * @example
 * ```ts
 * // Basic usage with direct value
 * const username: Optional<string> = getUsernameFromDatabase()
 * const displayName = username.otherwise('Guest')
 * ```
 *
 * @example
 * ```ts
 * // Using a provider for lazy evaluation
 * const cachedResult = cache.retrieve(key)
 * const result = cachedResult.otherwise(() => {
 *   const computed = performExpensiveComputation()
 *   cache.store(computed, key)
 *   return computed
 * })
 * ```
 *
 * @example
 * ```ts
 * // Using async provider
 * const cachedValue = await cache.retrieveValue(key)
 * const value = await cachedValue.otherwise(async () => {
 *   return await performAsyncOperation()
 * })
 * ```
 */
export class Optional<Type> {
  private constructor(private readonly value: Nullable<Type> = undefined) {}

  /**
   * Type guard to check if a value is an Optional instance.
   *
   * @typeParam Type - The expected type of the Optional's value
   * @param value - The value to check
   * @returns True if the value is an Optional instance
   *
   * @example
   * ```ts
   * const value: unknown = Optional.Some(42)
   * if (Optional.HasInstance(value)) {
   *   // TypeScript now knows value is Optional<unknown>
   *   const result = value.otherwise('default')
   * }
   * ```
   */
  public static HasInstance<Type>(value: unknown): value is Optional<Type> {
    return value instanceof Optional
  }

  /**
   * Returns the wrapped value if the optional is non-null, otherwise returns the provided default value.
   *
   * This method provides a natural language alternative to the null-coalescing operator,
   * making code that deals with optionals more readable and intention-revealing.
   *
   * @param defaultValue - The value to use when the optional is None
   * @returns The wrapped value if Some, otherwise the provided default value
   *
   * @example
   * ```ts
   * const username: Optional<string> = getUsernameFromDatabase()
   * const displayName = username.otherwise('Guest')
   * // Equivalent to: const displayName = username ?? 'Guest'
   * ```
   */
  public otherwise(defaultValue: Type): Type

  /**
   * Returns the wrapped value if the optional is non-null, otherwise evaluates and returns
   * the result of the provided closure.
   *
   * This method is similar to `otherwise(value)` but allows for lazy evaluation of the default value,
   * which is useful when the default is expensive to compute or has side effects that should only
   * occur when needed.
   *
   * @param provider - A closure that provides a default value when evaluated
   * @returns The wrapped value if Some, otherwise the result of evaluating the provider
   *
   * @example
   * ```ts
   * const cachedResult = cache.retrieve(key)
   * const result = cachedResult.otherwise(() => {
   *   const computed = performExpensiveComputation()
   *   cache.store(computed, key)
   *   return computed
   * })
   * ```
   */
  public otherwise(provider: () => Type): Type

  /**
   * Returns the wrapped value if the optional is non-null, otherwise awaits and returns
   * the result of the provided async closure.
   *
   * Useful for async operations where the fallback needs to be performed asynchronously.
   *
   * @param provider - An async closure that provides a default value when evaluated
   * @returns The wrapped value if Some, otherwise the result of awaiting the provider
   *
   * @example
   * ```ts
   * const cachedValue = await cache.retrieveValue(key)
   * const value = await cachedValue.otherwise(async () => {
   *   return await performAsyncOperation()
   * })
   * ```
   */
  public otherwise(provider: () => Promise<Type>): Promise<Type>

  // Implementation
  public otherwise(
    valueOrProvider: Type | (() => Type) | (() => Promise<Type>),
  ): Type | Promise<Type> {
    if (this.value != null) {
      return this.value
    }

    // If it's a function, call it
    if (typeof valueOrProvider === 'function') {
      const result = (valueOrProvider as () => Type | Promise<Type>)()
      return result
    }

    // Otherwise it's a direct value
    return valueOrProvider as Type
  }

  /**
   * Converts a nullable value into an Optional.
   *
   * This is the primary way to create Optional values from existing code that uses
   * null or undefined. If the value is null or undefined, returns None.
   * Otherwise, returns Some with the value.
   *
   * @typeParam Type - The type of the value
   * @param value - A value that may be null or undefined
   * @returns Some if the value exists, None if it's null or undefined
   *
   * @example
   * ```ts
   * const map = new Map([['key', 'value']])
   * const optional = Optional.FromNullable(map.get('key'))
   * // Optional.Some('value')
   * ```
   *
   * @example
   * ```ts
   * const optional = Optional.FromNullable(null)
   * // Optional.None()
   * ```
   *
   * @see {@link Some} for creating an Optional with a guaranteed value
   * @see {@link None} for creating an empty Optional
   */
  public static FromNullable<Type>(value: Nullable<Type>): Optional<Type> {
    if (value == null) return Optional.None()
    else return Optional.Some(value)
  }

  /**
   * Creates an Optional containing a value.
   *
   * Use this when you have a value that definitely exists and want to wrap it
   * in an Optional.
   *
   * @typeParam Type - The type of the value
   * @param value - A non-null, non-undefined value
   * @returns An Optional containing the value
   *
   * @example
   * ```ts
   * const optional = Optional.Some(42)
   * ```
   *
   * @see {@link None} for creating an empty Optional
   * @see {@link FromNullable} for converting nullable values
   */
  public static Some<Type>(value: NonNullable<Type>): Optional<Type> {
    return new Optional(value)
  }

  /**
   * Creates an empty Optional representing the absence of a value.
   *
   * @typeParam Type - The type the Optional would contain if it had a value
   * @returns An empty Optional
   *
   * @example
   * ```ts
   * function findUser(id: string): Optional<User> {
   *   if (!isValid(id)) {
   *     return Optional.None()
   *   }
   *   // ... search logic
   * }
   * ```
   *
   * @see {@link Some} for creating an Optional with a value
   * @see {@link FromNullable} for converting nullable values
   */
  public static None<Type>(): Optional<Type> {
    return new Optional()
  }
}
