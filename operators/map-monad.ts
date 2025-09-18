/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Maps over a monad, transforming the success value and preserving error state.
 *
 * @private internal operator function, not part of public API
 */
export function map_monad<InputType, OutputType, ErrorType>(
  isSuccess: boolean,
  successValue: InputType,
  errorValue: ErrorType,
  handler: (value: InputType) => OutputType,
  createSuccess: (value: OutputType) => unknown,
  createError: (error: ErrorType) => unknown,
): unknown {
  if (isSuccess) {
    return createSuccess(handler(successValue))
  } else {
    return createError(errorValue)
  }
}
