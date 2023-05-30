/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Checks if some value is nothing (null | undefined).
 *
 * @param {Type} value any value
 * @returns {boolean}
 */
export function is_nothing<Type>(value: Type): boolean {
  return value == null
}
