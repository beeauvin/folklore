/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Result } from '../result/result.ts'

export class Future<T, E = Error> {
  private constructor(private readonly promise: Promise<Result<T, E>>) {}

  public async result(): Promise<Result<T, E>> {
    return await this.promise
  }

  public static FromPromise<T, E = Error>(promise: Promise<T>): Future<T, E> {
    return new Future<T, E>(promise.then((value) => Result.Ok(value)).catch((error) => Result.Error(error)))
  }
}
