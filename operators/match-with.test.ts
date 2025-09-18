/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { assertEquals } from '@std/assert'
import { match_with } from './match-with.ts'

Deno.test('match_with', async (test) => {
  await test.step('should call success handler when isSuccess is true', () => {
    const result = match_with(
      true,
      'success value',
      'error value',
      (value) => `Success: ${value}`,
      (error) => `Error: ${error}`,
    )
    assertEquals(result, 'Success: success value')
  })

  await test.step('should call error handler when isSuccess is false', () => {
    const result = match_with(
      false,
      'success value',
      'error value',
      (value) => `Success: ${value}`,
      (error) => `Error: ${error}`,
    )
    assertEquals(result, 'Error: error value')
  })

  await test.step('should work with different return types', () => {
    const numberResult = match_with(
      true,
      42,
      null,
      (value) => value * 2,
      () => 0,
    )
    assertEquals(numberResult, 84)

    const booleanResult = match_with(
      false,
      'anything',
      'error',
      () => true,
      () => false,
    )
    assertEquals(booleanResult, false)
  })
})
