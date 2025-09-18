/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Chains monads to prevent nesting (flat map).
 *
 * @private internal operator function, not part of public API
 */
export function chain_monad<InputType, OutputType, ErrorType>(
  isSuccess: boolean,
  successValue: InputType,
  errorValue: ErrorType,
  handler: (value: InputType) => unknown,
  createError: (error: ErrorType) => unknown,
): unknown {
  if (isSuccess) {
    return handler(successValue)
  } else {
    return createError(errorValue)
  }
}
