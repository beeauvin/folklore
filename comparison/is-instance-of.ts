/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Checks if some value is an instance of some object. Safer and more convenient
 * to use than `instanceof` because it can be used with any set of values.
 *
 * This is awkward to use on it's own, prefer to use static class methods that
 * call this.
 *
 * @param {Type} object some value to check against
 * @param {unknown} value any value
 * @returns {boolean}
 */
export function is_instance_of<Type>(object: Type, value: unknown): boolean {
  if (typeof object !== 'function') return false
  else return value instanceof object
}
