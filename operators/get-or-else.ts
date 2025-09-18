/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Gets the success value or returns a default value.
 *
 * @private internal operator function, not part of public API
 */
export function get_or_else<T>(
  isSuccess: boolean,
  successValue: T,
  defaultValue: T,
): T {
  return isSuccess ? successValue : defaultValue
}
