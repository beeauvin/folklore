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
type ResultError = string | Error

/**
 * Represents the result of a computation that may fail.
 *
 * Result is a functional approach to error handling that makes success and failure
 * explicit in the type system. Instead of throwing exceptions, operations return
 * a Result that is either Ok (success) or Error (failure).
 *
 * This pattern forces callers to handle both success and error cases, making
 * error handling more predictable and easier to reason about.
 *
 * @typeParam Type - The type of the success value
 *
 * @example
 * ```ts
 * // Basic usage
 * function divide(a: number, b: number): Result<number> {
 *   if (b === 0) {
 *     return Result.Error('Cannot divide by zero')
 *   }
 *   return Result.Ok(a / b)
 * }
 *
 * const result = divide(10, 2)
 * result.matchWith({
 *   Ok: (value) => console.log(`Result: ${value}`),
 *   Error: (error) => console.error(`Error: ${error}`)
 * })
 * ```
 *
 * @example
 * ```ts
 * // Wrapping throwing code
 * const result = Result.Try(() => JSON.parse(input))
 * ```
 *
 * @example
 * ```ts
 * // Wrapping promises
 * const result = await Result.FromPromise(fetch('/api/data'))
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
   *   console.log(value.isOk())
   * }
   * ```
   */
  public static HasInstance<Type>(value: unknown): value is Result<Type> {
    return value instanceof Result
  }

  /**
   * Checks if this Result represents a successful value.
   *
   * @returns True if this is an Ok result, false if it's an Error
   *
   * @example
   * ```ts
   * const result = Result.Ok(42)
   * if (result.isOk()) {
   *   console.log('Success!')
   * }
   * ```
   *
   * @see {@link isError} to check for errors
   * @see {@link matchWith} for handling both cases
   */
  public isOk(): boolean {
    return this.success
  }

  /**
   * Checks if this Result represents an error.
   *
   * @returns True if this is an Error result, false if it's Ok
   *
   * @example
   * ```ts
   * const result = Result.Error('Failed')
   * if (result.isError()) {
   *   console.log('Something went wrong')
   * }
   * ```
   *
   * @see {@link isOk} to check for success
   * @see {@link matchWith} for handling both cases
   */
  public isError(): boolean {
    return !this.isOk()
  }

  /**
   * Pattern matches on the Result, executing different handlers for Ok and Error cases.
   *
   * This is the primary way to extract values from a Result. Both cases must be handled,
   * ensuring exhaustive error handling at compile time.
   *
   * @typeParam OkReturnType - The return type of the Ok handler
   * @typeParam ErrorReturnType - The return type of the Error handler
   * @param pattern - An object with Ok and Error handler functions
   * @returns The result of whichever handler was executed
   *
   * @example
   * ```ts
   * const result = divide(10, 2)
   * const message = result.matchWith({
   *   Ok: (value) => `Result: ${value}`,
   *   Error: (error) => `Error: ${error}`
   * })
   * console.log(message) // "Result: 5"
   * ```
   *
   * @example
   * ```ts
   * // Different return types from each branch
   * const value = result.matchWith({
   *   Ok: (val) => val * 2,
   *   Error: () => 0
   * })
   * ```
   *
   * @see {@link map} for transforming only Ok values
   * @see {@link getOrElse} for a simpler way to provide defaults
   */
  public matchWith<OkReturnType, ErrorReturnType>(pattern: {
    Ok: (value: Type) => OkReturnType
    Error: (error: ResultError) => ErrorReturnType
  }): OkReturnType | ErrorReturnType {
    if (this.isOk()) {
      return pattern.Ok(this.value)
    } else {
      return pattern.Error(this.error)
    }
  }

  /**
   * Gets the Ok value or returns a default value if this is an Error.
   *
   * This provides a simple way to extract a value from a Result with a fallback,
   * without needing to use pattern matching.
   *
   * @param defaultValue - The value to return if this is an Error
   * @returns The Ok value or the default value
   *
   * @example
   * ```ts
   * const result = Result.Ok(42)
   * const value = result.getOrElse(0)  // 42
   * ```
   *
   * @example
   * ```ts
   * const result = Result.Error<number>('Failed')
   * const value = result.getOrElse(0)  // 0
   * ```
   *
   * @see {@link orElse} for providing an alternative Result
   * @see {@link matchWith} to handle errors differently
   * @see {@link merge} to get either the value or the error
   */
  public getOrElse(defaultValue: Type): Type {
    return this.isOk() ? this.value : defaultValue
  }

  /**
   * Returns this Result if it's Ok, otherwise calls the handler with the Error.
   *
   * This allows you to provide an alternative Result when an error occurs,
   * potentially recovering from specific errors or trying alternative approaches.
   *
   * @typeParam HandlerType - The type of value in the alternative Result
   * @param handler - Function that receives the Error Result and returns an alternative
   * @returns This Result if Ok, otherwise the Result from the handler
   *
   * @example
   * ```ts
   * const result = fetchFromCache()
   *   .orElse(() => fetchFromDatabase())
   *   .orElse(() => Result.Ok(defaultValue))
   * ```
   *
   * @example
   * ```ts
   * // Recover from specific errors
   * const result = divide(10, 0)
   *   .orElse((error) => {
   *     console.log('Division failed, using default')
   *     return Result.Ok(0)
   *   })
   * ```
   *
   * @see {@link getOrElse} for simple default values
   * @see {@link chain} for chaining successful operations
   */
  public orElse<HandlerType>(
    handler: (value: Result<Type>) => Result<HandlerType>,
  ): Result<Type> | Result<HandlerType> {
    return this.matchWith({
      Ok: (value) => Result.Ok(value),
      Error: (error) => handler(Result.Error(error)),
    })
  }

  /**
   * Extracts the value or error from the Result.
   *
   * This collapses the Result into a single type that could be either the success
   * value or the error. Use this when you need to handle both cases the same way,
   * or when the value and error types are compatible.
   *
   * @returns Either the Ok value or the Error value
   *
   * @example
   * ```ts
   * const result = Result.Try(() => readFile('config.json'))
   * const output = result.merge()
   * // output is either the file contents (string) or an Error object
   * console.log(output)
   * ```
   *
   * @example
   * ```ts
   * // When you want to log either value or error
   * const message = apiCall()
   *   .map(data => `Success: ${data}`)
   *   .mapError(`Failed: ${error}`)
   *   .merge()
   * console.log(message)  // Always a string
   * ```
   *
   * @see {@link getOrElse} for extracting with a default value
   * @see {@link matchWith} for handling value and error differently
   */
  public merge(): Type | ResultError {
    return this.matchWith({
      Ok: (value) => value,
      Error: (error) => error,
    })
  }

  /**
   * Replaces the error with a new error message if this Result is an Error.
   *
   * This is useful for providing more context to errors, normalizing error messages,
   * or hiding implementation details from callers.
   *
   * @param error - The new error message or Error object
   * @returns A new Result with the replaced error, or the original Ok Result
   *
   * @example
   * ```ts
   * const result = parseJSON(input)
   *   .mapError('Invalid configuration format')
   * ```
   *
   * @example
   * ```ts
   * // Adding context to errors
   * const result = readFile(path)
   *   .mapError(new Error(`Failed to read config from ${path}`))
   * ```
   *
   * @example
   * ```ts
   * // Ok results are unchanged
   * Result.Ok(42).mapError('This is ignored')  // Still Result.Ok(42)
   * ```
   *
   * @see {@link map} for transforming Ok values
   * @see {@link chain} for error recovery with alternative Results
   */
  public mapError(error: ResultError): Result<Type> {
    return this.matchWith({
      Ok: (value) => Result.Ok(value),
      Error: () => Result.Error(error),
    })
  }

  /**
   * Transforms the Ok value using the provided function.
   *
   * If the Result is Ok, applies the handler to the value and returns a new Ok Result.
   * If the Result is Error, returns the Error unchanged without calling the handler.
   *
   * This allows you to chain transformations on successful values while automatically
   * propagating errors.
   *
   * @typeParam HandlerType - The type returned by the transformation function
   * @param handler - Function to transform the Ok value
   * @returns A new Result with the transformed value or the original error
   *
   * @example
   * ```ts
   * const result = Result.Ok(5)
   *   .map(x => x * 2)
   *   .map(x => x.toString())
   * // Result.Ok("10")
   * ```
   *
   * @example
   * ```ts
   * const error = Result.Error<number>('Failed')
   *   .map(x => x * 2)
   * // Result.Error("Failed") - handler never called
   * ```
   *
   * @see {@link chain} for transformations that return Results
   * @see {@link matchWith} to handle both Ok and Error cases
   */
  public map<HandlerType>(handler: (value: Type) => HandlerType): Result<HandlerType> {
    if (this.isOk()) {
      return Result.Ok(handler(this.value))
    } else {
      return Result.Error<HandlerType>(this.error)
    }
  }

  /**
   * Transforms the Ok value using a function that returns a Result (also known as flatMap).
   *
   * Similar to {@link map}, but the handler function returns a Result instead of a plain value.
   * This is useful for chaining operations that may themselves fail, avoiding nested Results.
   *
   * @typeParam HandlerType - The type of the value in the Result returned by the handler
   * @param handler - Function that takes the Ok value and returns a new Result
   * @returns The Result returned by the handler, or the original Error
   *
   * @example
   * ```ts
   * // Chaining operations that may fail
   * const result = parseJSON(input)
   *   .chain(data => validateUser(data))
   *   .chain(user => saveToDatabase(user))
   * ```
   *
   * @example
   * ```ts
   * // Without chain, you'd get Result<Result<T>>
   * const nested = Result.Ok(5).map(x => divide(x, 2))
   * // Result<Result<number>>
   *
   * // With chain, the Result is flattened
   * const flat = Result.Ok(5).chain(x => divide(x, 2))
   * // Result<number>
   * ```
   *
   * @see {@link map} for simple value transformations
   */
  public chain<HandlerType>(handler: (value: Type) => Result<HandlerType>): Result<HandlerType> {
    if (this.isOk()) {
      return handler(this.value)
    } else {
      return Result.Error<HandlerType>(this.error)
    }
  }

  /**
   * Wraps a function that may throw into a Result.
   *
   * Any exceptions thrown by the function are caught and converted to Error results.
   * This is useful for safely calling code that uses exceptions for error handling.
   *
   * @typeParam Type - The return type of the function
   * @param method - A function that may throw an exception
   * @returns A Result containing the function's return value or error
   *
   * @example
   * ```ts
   * const result = Result.Try(() => JSON.parse(jsonString))
   * result.matchWith({
   *   Ok: (data) => console.log('Parsed:', data),
   *   Error: (error) => console.error('Parse failed:', error)
   * })
   * ```
   *
   * @see {@link FromPromise} for wrapping async operations
   */
  public static Try<Type>(method: () => Type): Result<Type> {
    try {
      return Result.Ok(method())
    } catch (error) {
      return Result.Error(error instanceof Error ? error : String(error))
    }
  }

  /**
   * Wraps a Promise into a Result, converting rejections to Error results.
   *
   * This allows you to work with async operations using the Result pattern,
   * avoiding the need for try/catch blocks.
   *
   * @typeParam Type - The type of the Promise's resolved value
   * @param promise - The Promise to wrap
   * @returns A Promise that resolves to a Result (never rejects)
   *
   * @example
   * ```ts
   * const result = await Result.FromPromise(fetch('/api/users'))
   * result.matchWith({
   *   Ok: (response) => console.log('Success:', response),
   *   Error: (error) => console.error('Request failed:', error)
   * })
   * ```
   *
   * @example
   * ```ts
   * // Chaining with map
   * const userData = await Result.FromPromise(fetch('/api/user'))
   *   .then(result => result.map(res => res.json()))
   * ```
   *
   * @see {@link Try} for wrapping synchronous operations
   */
  public static async FromPromise<Type>(promise: Promise<Type>): Promise<Result<Type>> {
    try {
      return Result.Ok(await promise)
    } catch (error) {
      return Result.Error(error instanceof Error ? error : String(error))
    }
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
