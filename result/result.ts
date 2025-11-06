// Copyright © 2025 Cassidy Spring (Bee).
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

/**
 * Valid error types for Result.
 *
 * Errors can be represented as either Error objects or string messages.
 * When catching exceptions, Error objects are preferred for stack traces.
 */
export type ResultError = string | Error

/**
 * Represents the result of a computation that may fail.
 *
 * Result provides a type-safe way to handle operations that can fail with an API
 * inspired by Swift's Result type. A Result is either Ok (contains a success value)
 * or Error (contains an error).
 *
 * The primary feature is the `otherwise` method family, which provides natural
 * language alternatives for extracting values with fallbacks.
 *
 * @typeParam Type - The type of the success value
 *
 * @example
 * ```ts
 * // Basic usage with direct value
 * const result: Result<number> = divide(10, 2)
 * const value = result.otherwise(0)
 * ```
 *
 * @example
 * ```ts
 * // Using error-aware fallback
 * const result = apiCall()
 * const value = result.otherwise((error) => {
 *   console.error('API failed:', error)
 *   return fallbackValue
 * })
 * ```
 */
export class Result<Type> {
  private constructor(
    private readonly success: boolean,
    private readonly value: Type,
    private readonly error: ResultError,
  ) {}

  /**
   * Type guard to check if a value is a Result instance.
   *
   * @typeParam Type - The expected type of the Result's value
   * @param value - The value to check
   * @returns True if the value is a Result instance
   *
   * @example
   * ```ts
   * const value: unknown = Result.Ok(42)
   * if (Result.HasInstance(value)) {
   *   // TypeScript now knows value is Result<unknown>
   *   const extracted = value.otherwise(0)
   * }
   * ```
   */
  public static HasInstance<Type>(value: unknown): value is Result<Type> {
    return value instanceof Result
  }

  /**
   * Returns the success value if the result is Ok, otherwise returns the provided default value.
   *
   * This method provides a natural language alternative to try/catch patterns,
   * making code that deals with results more readable and intention-revealing.
   *
   * @param defaultValue - The value to use when the result is Error
   * @returns The success value if Ok, otherwise the provided default value
   *
   * @example
   * ```ts
   * const result: Result<number> = divide(10, 2)
   * const value = result.otherwise(0)
   * ```
   */
  public otherwise(defaultValue: Type): Type

  /**
   * Returns the success value if the result is Ok, otherwise evaluates and returns
   * the result of the provided closure.
   *
   * This method allows for lazy evaluation of the default value, which is useful when
   * the default is expensive to compute or has side effects that should only occur when needed.
   *
   * @param provider - A closure that provides a default value when evaluated
   * @returns The success value if Ok, otherwise the result of evaluating the provider
   *
   * @example
   * ```ts
   * const result = tryExpensiveOperation()
   * const value = result.otherwise(() => {
   *   return computeFallback()
   * })
   * ```
   */
  public otherwise(provider: () => Type): Type

  /**
   * Returns the success value if the result is Ok, otherwise evaluates the provided
   * closure with the error and returns its result.
   *
   * This method allows for creating fallback values that can make use of the error information.
   *
   * @param provider - A closure that takes the error and provides a default value
   * @returns The success value if Ok, otherwise the result of evaluating the provider with the error
   *
   * @example
   * ```ts
   * const result = apiCall()
   * const value = result.otherwise((error) => {
   *   console.error('API failed:', error)
   *   return cachedValue
   * })
   * ```
   */
  public otherwise(provider: (error: ResultError) => Type): Type

  /**
   * Returns the success value if the result is Ok, otherwise awaits and returns
   * the result of the provided async closure.
   *
   * Useful when the fallback operation needs to be performed asynchronously.
   *
   * @param provider - An async closure that provides a default value when evaluated
   * @returns The success value if Ok, otherwise the result of awaiting the provider
   *
   * @example
   * ```ts
   * const result = tryLocalOperation()
   * const value = await result.otherwise(async () => {
   *   return await fetchFromNetwork()
   * })
   * ```
   */
  public otherwise(provider: () => Promise<Type>): Promise<Type>

  /**
   * Returns the success value if the result is Ok, otherwise awaits the provided
   * async closure with the error and returns its result.
   *
   * This method allows for creating fallback values asynchronously while making use of the error information.
   *
   * @param provider - An async closure that takes the error and provides a default value
   * @returns The success value if Ok, otherwise the result of awaiting the provider with the error
   *
   * @example
   * ```ts
   * const result = tryPrimaryService()
   * const value = await result.otherwise(async (error) => {
   *   await logError(error)
   *   return await tryBackupService()
   * })
   * ```
   */
  public otherwise(
    provider: (error: ResultError) => Promise<Type>,
  ): Promise<Type>

  // Implementation
  public otherwise(
    valueOrProvider:
      | Type
      | (() => Type)
      | ((error: ResultError) => Type)
      | (() => Promise<Type>)
      | ((error: ResultError) => Promise<Type>),
  ): Type | Promise<Type> {
    // If Ok, return the success value
    if (this.success) {
      return this.value
    }

    // If it's a function, call it
    if (typeof valueOrProvider === 'function') {
      // Check arity to distinguish between () => T and (error) => T
      const fn = valueOrProvider as Function

      if (fn.length === 0) {
        // No parameters - provider without error
        const result = (fn as (() => Type) | (() => Promise<Type>))()
        return result
      } else {
        // Has parameters - provider with error
        const result = (
          fn as
            | ((error: ResultError) => Type)
            | ((error: ResultError) => Promise<Type>)
        )(this.error)
        return result
      }
    }

    // Otherwise it's a direct value
    return valueOrProvider as Type
  }

  /**
   * Creates a successful Result containing a value.
   *
   * @typeParam Type - The type of the success value (defaults to void)
   * @param value - The success value (optional for void results)
   * @returns A Result representing success
   *
   * @example
   * ```ts
   * // With a value
   * const result = Result.Ok(42)
   * ```
   *
   * @example
   * ```ts
   * // Without a value (void)
   * const result = Result.Ok()
   * ```
   *
   * @see {@link Error} for creating error results
   */
  public static Ok<Type = void>(value?: Type): Result<Type> {
    return new Result<Type>(true, value as Type, undefined as never)
  }

  /**
   * Creates a failed Result containing an error.
   *
   * @typeParam Type - The type the Result would have contained on success
   * @param error - The error message (string) or Error object
   * @returns A Result representing failure
   *
   * @example
   * ```ts
   * // With string error
   * const result = Result.Error<number>('Invalid input')
   * ```
   *
   * @example
   * ```ts
   * // With Error object
   * const result = Result.Error<number>(new Error('Something went wrong'))
   * ```
   *
   * @see {@link Ok} for creating success results
   */
  public static Error<Type>(error: ResultError): Result<Type> {
    return new Result<Type>(false, undefined as never, error)
  }
}
