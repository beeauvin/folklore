/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { Nullable } from '../utility/types.ts'

/**
 * Handler for when an Optional contains a value (Some case).
 * Used with the `when` method to execute side effects.
 */
export interface WhenSome<Type> {
  some: (value: Type) => void
  none?: never
}

/**
 * Handler for when an Optional is empty (None case).
 * Used with the `when` method to execute side effects.
 */
export interface WhenNone {
  some?: never
  none: () => void
}

/**
 * Handlers for both Some and None cases.
 * Used with the `when` method to execute side effects based on the Optional's state.
 */
export interface WhenBoth<Type> {
  some: (value: Type) => void
  none: () => void
}

/**
 * Async handler for when an Optional contains a value (Some case).
 * Used with the `when` method to execute async side effects.
 */
export interface WhenSomeAsync<Type> {
  some: (value: Type) => Promise<void>
  none?: never
}

/**
 * Async handler for when an Optional is empty (None case).
 * Used with the `when` method to execute async side effects.
 */
export interface WhenNoneAsync {
  some?: never
  none: () => Promise<void>
}

/**
 * Async handlers for both Some and None cases.
 * Used with the `when` method to execute async side effects based on the Optional's state.
 */
export interface WhenBothAsync<Type> {
  some: (value: Type) => Promise<void>
  none: () => Promise<void>
}

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
   * Returns the wrapped value if the optional is non-null, otherwise returns the provided optional.
   *
   * This method provides optional chaining with fallbacks, allowing multiple optionals to be tried
   * before ultimately providing a guaranteed value with `otherwise(_:)`.
   *
   * @param optional - The optional to use when this optional is None
   * @returns This optional if Some, otherwise the provided optional
   *
   * @example
   * ```ts
   * // Try multiple optionals in sequence before falling back to a guaranteed value
   * const primaryValue = cache.retrieve(key)
   * const backupValue = fallbackCache.retrieve(key)
   * const result = primaryValue.optionally(backupValue).otherwise('Default')
   * // Equivalent to: const result = primaryValue ?? backupValue ?? 'Default'
   * ```
   */
  public optionally(optional: Optional<Type>): Optional<Type>

  /**
   * Returns the wrapped value if the optional is non-null, otherwise evaluates and returns
   * the result of the provided closure which returns another optional.
   *
   * This method provides lazy evaluation of the fallback optional, which is useful when
   * the fallback is expensive to compute or has side effects that should only occur when needed.
   *
   * @param provider - A closure that provides a fallback optional when evaluated
   * @returns This optional if Some, otherwise the result of evaluating the provider
   *
   * @example
   * ```ts
   * // Only compute fallback optional if needed
   * const cachedResult = cache.retrieve(key)
   * const result = cachedResult.optionally(() => {
   *   return computeExpensiveFallback()  // Returns another optional
   * }).otherwise('Default')  // Finally provide a guaranteed value
   * ```
   */
  public optionally(provider: () => Optional<Type>): Optional<Type>

  /**
   * Returns the wrapped value if the optional is non-null, otherwise awaits and returns
   * the result of the provided async closure which returns another optional.
   *
   * Useful for async operations where the fallback needs to be performed asynchronously.
   *
   * @param provider - An async closure that provides a fallback optional when evaluated
   * @returns This optional if Some, otherwise the result of awaiting the provider
   *
   * @example
   * ```ts
   * // With async fallback computation
   * const localValue = await localCache.retrieveValue(key)
   * const value = await localValue.optionally(async () => {
   *   return await remoteService.fetchOptionalValue()
   * }).otherwise('Default')
   * ```
   */
  public optionally(provider: () => Promise<Optional<Type>>): Promise<Optional<Type>>

  // Implementation
  public optionally(
    optionalOrProvider: Optional<Type> | (() => Optional<Type>) | (() => Promise<Optional<Type>>),
  ): Optional<Type> | Promise<Optional<Type>> {
    if (this.value != null) {
      return this
    }

    // If it's a function, call it
    if (typeof optionalOrProvider === 'function') {
      const result = (optionalOrProvider as () => Optional<Type> | Promise<Optional<Type>>)()
      return result
    }

    // Otherwise it's a direct Optional
    return optionalOrProvider as Optional<Type>
  }

  /**
   * Transforms the wrapped value if the optional is non-null, otherwise returns None.
   *
   * This method provides a natural language alternative to map/flatMap operations,
   * making code that deals with optional transformations more readable and intention-revealing.
   * The method automatically handles both direct transformations (map) and transformations that
   * return optionals (flatMap), preventing nested optionals.
   *
   * @typeParam Transformed - The type of the transformed value
   * @param transformer - A closure that transforms the wrapped value
   * @returns An Optional containing the transformed value if Some, otherwise None
   *
   * @example
   * ```ts
   * // Direct transformation (map case)
   * const username: Optional<string> = getUsernameFromDatabase()
   * const nameLength = username
   *   .transform(name => name.length)
   *   .otherwise(0)
   * ```
   *
   * @example
   * ```ts
   * // Transformation that returns Optional (flatMap case)
   * const numericString: Optional<string> = Optional.Some('42')
   * const number = numericString
   *   .transform(str => {
   *     const parsed = parseInt(str)
   *     return isNaN(parsed) ? Optional.None<number>() : Optional.Some(parsed)
   *   })
   *   .otherwise(0)
   * ```
   *
   * @example
   * ```ts
   * // Chaining transformations
   * const result = await userId
   *   .transform(async id => await userService.fetchProfile(id))
   *   .transform(profile => profile.displayName)
   *   .otherwise('Guest')
   * ```
   */

  /**
   * Transforms the wrapped value using an async closure that returns an Optional.
   *
   * This overload handles async flatMap transformations, automatically flattening the result
   * to prevent nested optionals.
   *
   * @typeParam Transformed - The type of the transformed value
   * @param transformer - An async closure that transforms the wrapped value and returns an Optional
   * @returns Promise resolving to an Optional containing the transformed value, or None if transformation returned None
   */
  public transform<Transformed>(
    transformer: (value: Type) => Promise<Optional<Transformed>>,
  ): Promise<Optional<Transformed>>

  /**
   * Transforms the wrapped value using an async closure if the optional is non-null.
   *
   * This overload provides async transformation support for use with Promise-based operations.
   *
   * @typeParam Transformed - The type of the transformed value
   * @param transformer - An async closure that transforms the wrapped value
   * @returns Promise resolving to an Optional containing the transformed value if Some, otherwise None
   */
  public transform<Transformed>(
    transformer: (value: Type) => Promise<Transformed>,
  ): Promise<Optional<Transformed>>

  /**
   * Transforms the wrapped value using a closure that returns an Optional.
   *
   * This overload handles flatMap transformations where the transformer itself returns an Optional,
   * automatically flattening the result to prevent nested optionals.
   *
   * @typeParam Transformed - The type of the transformed value
   * @param transformer - A closure that transforms the wrapped value and returns an Optional
   * @returns An Optional containing the transformed value, or None if original was None or transformation returned None
   */
  public transform<Transformed>(
    transformer: (value: Type) => Optional<Transformed>,
  ): Optional<Transformed>

  public transform<Transformed>(transformer: (value: Type) => Transformed): Optional<Transformed>

  // Implementation
  public transform<Transformed>(
    transformer:
      | ((value: Type) => Transformed)
      | ((value: Type) => Optional<Transformed>)
      | ((value: Type) => Promise<Transformed>)
      | ((value: Type) => Promise<Optional<Transformed>>),
  ): Optional<Transformed> | Promise<Optional<Transformed>> {
    if (this.value == null) {
      return Optional.None<Transformed>()
    }

    const result = transformer(this.value)

    // If the result is a Promise, we need to await it
    if (result instanceof Promise) {
      return result.then((awaited) => {
        // If awaited is an Optional, return it (flatMap case)
        if (Optional.HasInstance<Transformed>(awaited)) {
          return awaited
        }
        // Otherwise wrap in Optional (map case)
        return Optional.FromNullable(awaited as Transformed)
      })
    }

    // If result is an Optional, return it (flatMap case)
    if (Optional.HasInstance<Transformed>(result)) {
      return result
    }

    // Otherwise wrap in Optional (map case)
    return Optional.FromNullable(result as Transformed)
  }

  /**
   * Executes side-effect closures based on whether the optional contains a value.
   *
   * This method provides a functional alternative to if-let statements for performing
   * side effects. It accepts handlers for the Some case, None case, or both, making
   * code more intention-revealing and expressive.
   *
   * @param handlers - An object containing handler(s) for some, none, or both cases
   *
   * @example
   * ```ts
   * // Execute code only when optional contains a value
   * const user: Optional<User> = getCurrentUser()
   * user.when({ some: person => analytics.log(person.id) })
   * ```
   *
   * @example
   * ```ts
   * // Execute code only when optional is empty
   * const user: Optional<User> = getCurrentUser()
   * user.when({ none: () => analytics.logAnonymous() })
   * ```
   *
   * @example
   * ```ts
   * // Handle both presence and absence
   * const user: Optional<User> = getCurrentUser()
   * user.when({
   *   some: person => analytics.log(person.id),
   *   none: () => analytics.logAnonymous()
   * })
   * ```
   *
   * @example
   * ```ts
   * // Async side effects
   * await user.when({
   *   some: async person => await analytics.logAsync(person.id)
   * })
   * ```
   */
  public when(handlers: WhenSome<Type> | WhenNone | WhenBoth<Type>): void

  /**
   * Executes async side-effect closures based on whether the optional contains a value.
   *
   * @param handlers - An object containing async handler(s) for some, none, or both cases
   * @returns Promise that resolves when the handler completes
   */
  public when(handlers: WhenSomeAsync<Type> | WhenNoneAsync | WhenBothAsync<Type>): Promise<void>

  // Implementation
  public when(
    handlers:
      | WhenSome<Type>
      | WhenNone
      | WhenBoth<Type>
      | WhenSomeAsync<Type>
      | WhenNoneAsync
      | WhenBothAsync<Type>,
  ): void | Promise<void> {
    // Check if we have a value
    if (this.value != null) {
      // Some case - call the some handler if it exists
      if ('some' in handlers && handlers.some) {
        const result = handlers.some(this.value)
        // If result is a Promise, return it
        if (result instanceof Promise) {
          return result
        }
      }
    } else {
      // None case - call the none handler if it exists
      if ('none' in handlers && handlers.none) {
        const result = handlers.none()
        // If result is a Promise, return it
        if (result instanceof Promise) {
          return result
        }
      }
    }
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
