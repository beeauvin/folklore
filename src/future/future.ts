import { Result } from '../folklore'

export class Future<T, E = Error> {
  private constructor(private readonly promise: Promise<Result<T, E>>) {}

  public async result(): Promise<Result<T, E>> {
    return await this.promise
  }

  public static FromPromise<T, E = Error>(promise: Promise<T>): Future<T, E> {
    return new Future<T, E>(promise.then((value) => Result.Ok(value)).catch((error) => Result.Error(error)))
  }
}
