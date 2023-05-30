/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { assertEquals } from 'std/testing/asserts.ts'
import { is_something } from './is-something.ts'

Deno.test('is_something', () => {
  assertEquals(is_something(null), false)
  assertEquals(is_something(undefined), false)
  assertEquals(is_something(''), true)
  assertEquals(is_something(0), true)
  assertEquals(is_something(false), true)
  assertEquals(is_something([]), true)
  assertEquals(is_something({}), true)
})
