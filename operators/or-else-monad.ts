/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Returns the monad if successful, otherwise calls handler.
 *
 * @private internal operator function, not part of public API
 */
export function or_else_monad<SuccessType, ErrorType>(
  isSuccess: boolean,
  successValue: SuccessType,
  handler: () => unknown,
  createSuccess: (value: SuccessType) => unknown,
): unknown {
  if (isSuccess) {
    return createSuccess(successValue)
  } else {
    return handler()
  }
}
