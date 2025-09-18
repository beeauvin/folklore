/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { assertEquals } from '@std/assert'
import { is_nothing } from './is-nothing.ts'

Deno.test('is_nothing', () => {
  assertEquals(is_nothing(null), true)
  assertEquals(is_nothing(undefined), true)
  assertEquals(is_nothing(''), false)
  assertEquals(is_nothing(0), false)
  assertEquals(is_nothing(false), false)
  assertEquals(is_nothing([]), false)
  assertEquals(is_nothing({}), false)
})
