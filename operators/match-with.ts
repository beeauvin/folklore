/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Pattern matching for monads.
 *
 * @private internal operator function, not part of public API
 */
export function match_with<SuccessType, ErrorType, SuccessReturnType, ErrorReturnType>(
  isSuccess: boolean,
  successValue: SuccessType,
  errorValue: ErrorType,
  successHandler: (value: SuccessType) => SuccessReturnType,
  errorHandler: (error: ErrorType) => ErrorReturnType,
): SuccessReturnType | ErrorReturnType {
  if (isSuccess) {
    return successHandler(successValue)
  } else {
    return errorHandler(errorValue)
  }
}
