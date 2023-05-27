/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

type ResultError = string | Error

export class Result<Type> {
  private constructor(
    private readonly success: boolean,
    private readonly value: Type,
    private readonly error: ResultError,
  ) {}

  public isOk(): boolean {
    return this.success
  }

  public isError(): boolean {
    return !this.isOk()
  }

  public matchWith<OkReturnType, ErrorReturnType>(pattern: {
    Ok: (value: Type) => OkReturnType
    Error: (error: ResultError) => ErrorReturnType
  }): OkReturnType | ErrorReturnType {
    if (this.isOk()) return pattern.Ok(this.value)
    else return pattern.Error(this.error)
  }

  public getOrElse(defaultValue: Type): Type {
    return this.matchWith({
      Ok: (value) => value,
      Error: () => defaultValue,
    })
  }

  public orElse<HandlerType>(
    handler: (value: Result<Type>) => Result<HandlerType>,
  ): Result<Type> | Result<HandlerType> {
    return this.matchWith({
      Ok: (value) => Result.Ok(value),
      Error: (error) => handler(Result.Error(error)),
    })
  }

  public merge(): Type | ResultError {
    return this.matchWith({
      Ok: (value) => value,
      Error: (error) => error,
    })
  }

  public mapError(error: ResultError): Result<Type> {
    return this.matchWith({
      Ok: (value) => Result.Ok(value),
      Error: () => Result.Error(error),
    })
  }

  public map<HandlerType>(handler: (value: Type) => HandlerType): Result<HandlerType> {
    return this.matchWith({
      Ok: (value) => Result.Ok(handler(value)),
      Error: (error) => Result.Error(error),
    })
  }

  public chain<HandlerType>(handler: (value: Type) => Result<HandlerType>): Result<HandlerType> {
    return this.matchWith({
      Ok: (value) => handler(value),
      Error: (error) => Result.Error(error),
    })
  }

  public static HasInstance<Type>(value: Type): boolean {
    return value instanceof Result
  }

  public static Try<Type>(method: () => Type): Result<Type> {
    try {
      return Result.Ok(method())
    } catch (error) {
      return Result.Error(error)
    }
  }

  public static async FromPromise<Type>(promise: Promise<Type>): Promise<Result<Type>> {
    try {
      return Result.Ok(await promise)
    } catch (error) {
      return Result.Error(error)
    }
  }

  public static Ok<Type>(value: Type): Result<Type> {
    return new Result<Type>(true, value, undefined as never)
  }

  public static Error<Type>(error: ResultError): Result<Type> {
    return new Result<Type>(false, undefined as never, error)
  }
}
