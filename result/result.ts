/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Base } from '../abstract/base.ts'
import { get_or_else } from '../operators/get-or-else.ts'
import { map_monad } from '../operators/map-monad.ts'
import { chain_monad } from '../operators/chain-monad.ts'
import { match_with } from '../operators/match-with.ts'

type ResultError = string | Error

export class Result<Type> extends Base {
  private constructor(
    private readonly success: boolean,
    private readonly value: Type,
    private readonly error: ResultError,
  ) {
    super()
  }

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
    return match_with(
      this.isOk(),
      this.value,
      this.error,
      pattern.Ok,
      pattern.Error,
    )
  }

  public getOrElse(defaultValue: Type): Type {
    return get_or_else(this.isOk(), this.value, defaultValue)
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
    return map_monad(
      this.isOk(),
      this.value,
      this.error,
      handler,
      (value: HandlerType) => Result.Ok(value),
      (error: ResultError) => Result.Error<HandlerType>(error),
    ) as Result<HandlerType>
  }

  public chain<HandlerType>(handler: (value: Type) => Result<HandlerType>): Result<HandlerType> {
    return chain_monad(
      this.isOk(),
      this.value,
      this.error,
      handler,
      (error: ResultError) => Result.Error<HandlerType>(error),
    ) as Result<HandlerType>
  }

  public static Try<Type>(method: () => Type): Result<Type> {
    try {
      return Result.Ok(method())
    } catch (error) {
      return Result.Error(error instanceof Error ? error : String(error))
    }
  }

  public static async FromPromise<Type>(promise: Promise<Type>): Promise<Result<Type>> {
    try {
      return Result.Ok(await promise)
    } catch (error) {
      return Result.Error(error instanceof Error ? error : String(error))
    }
  }

  public static Ok<Type>(value: Type): Result<Type> {
    return new Result<Type>(true, value, undefined as never)
  }

  public static Error<Type>(error: ResultError): Result<Type> {
    return new Result<Type>(false, undefined as never, error)
  }
}
