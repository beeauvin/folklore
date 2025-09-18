/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { assertEquals } from '@std/assert'
import { get_or_else } from './get-or-else.ts'

Deno.test('get_or_else', async (test) => {
  await test.step('should return success value when isSuccess is true', () => {
    const result = get_or_else(true, 'success', 'default')
    assertEquals(result, 'success')
  })

  await test.step('should return default value when isSuccess is false', () => {
    const result = get_or_else(false, 'success', 'default')
    assertEquals(result, 'default')
  })

  await test.step('should work with different types', () => {
    const numberResult = get_or_else(true, 42, 0)
    assertEquals(numberResult, 42)

    const arrayResult = get_or_else(false, [1, 2, 3], [])
    assertEquals(arrayResult, [])
  })
})
