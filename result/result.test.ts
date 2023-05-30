/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Result } from './result.ts'
import { Base } from '../abstract/base.ts'
import { assertEquals } from 'std/testing/asserts.ts'

Deno.test('Result', async (test) => {
  await test.step('extends base', () => {
    assertEquals(Result.prototype instanceof Base, true)
    assertEquals(Base.HasInstance(Result.Ok(1)), true)
    assertEquals(Base.HasInstance(Result.Error('')), true)
  })
})

