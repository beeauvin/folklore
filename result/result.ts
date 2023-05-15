/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export type Ok<Type> = Type extends Error ? never : Type
export type Err = string | Error

export class Result<Type> {
  private constructor(private readonly value: Ok<Type>, private readonly error: Err) {}

  public isOk(): boolean {
    return this.value != null
  }

  public isError(): boolean {
    return this.error != null
  }

  public matchWith<OkReturnType, ErrorReturnType>(pattern: {
    Ok: (value: Ok<Type>) => OkReturnType
    Error: (error: Err) => ErrorReturnType
  }): OkReturnType | ErrorReturnType {
    if (this.isOk()) return pattern.Ok(this.value!)
    else return pattern.Error(this.error)
  }

  public getOrElse(defaultValue: Ok<Type>): Ok<Type> {
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

  public merge(): Type | Err {
    return this.matchWith({
      Ok: (value) => value,
      Error: (error) => error,
    })
  }

  public mapError(error: Err): Result<Type> {
    return this.matchWith({
      Ok: (value) => Result.Ok(value),
      Error: () => Result.Error(error),
    })
  }

  public map<HandlerType>(handler: (value: Type) => Ok<HandlerType>): Result<HandlerType> {
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

  public static Try<Type>(method: () => Ok<Type>): Result<Type> {
    try {
      return Result.Ok(method())
    } catch (error) {
      return Result.Error(error)
    }
  }

  public static async FromPromise<Type>(promise: () => Promise<Ok<Type>>): Promise<Result<Type>> {
    try {
      return Result.Ok(await promise())
    } catch (error) {
      return Result.Error(error)
    }
  }

  public static Ok<Type>(value: Ok<Type>): Result<Type> {
    return new Result<Type>(value, undefined as never)
  }

  public static Error<Type>(error: Err): Result<Type> {
    return new Result<Type>(undefined as never, error)
  }
}
