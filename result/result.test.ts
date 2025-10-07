/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Result } from './result.ts'
import { assertEquals } from '@std/assert'

Deno.test('Result', async (test) => {
  await test.step('HasInstance()', async (t) => {
    await t.step('should return true for Result instances', () => {
      assertEquals(Result.HasInstance(Result.Ok(5)), true)
      assertEquals(Result.HasInstance(Result.Error('oops')), true)
    })

    await t.step('should return false for non-Result values', () => {
      assertEquals(Result.HasInstance(5), false)
      assertEquals(Result.HasInstance(null), false)
      assertEquals(Result.HasInstance(undefined), false)
      assertEquals(Result.HasInstance({}), false)
      assertEquals(Result.HasInstance('string'), false)
    })
  })
})
