/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { is_instance_of } from '../comparison/is-instance-of.ts'

/**
 * Global base classes can be dangerous and encourage a style of polymorphism
 * that can get out of hand quickly. Use sparingly.
 */
export abstract class Base {
  constructor() {
    const trueProto = new.target.prototype
    Object.setPrototypeOf(this, trueProto)
  }

  /**
   * Checks if this object is an instance of some class.
   * @param {Type} check class to check against.
   * @returns {boolean}
   */
  public isInstanceOf<Type>(check: Type): boolean {
    return is_instance_of(check, this)
  }

  /**
   * Checks if some value is an instance of this class.
   * @param {unknown} value value to check.
   * @returns {boolean}
   */
  public static HasInstance<Type>(value: unknown): value is Type {
    return is_instance_of(this, value)
  }
}
