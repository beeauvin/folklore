/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { assertEquals } from '@std/assert'
import { map_monad } from './map-monad.ts'

// Mock factory functions for testing
const createSuccess = (value: unknown) => ({ type: 'success', value })
const createError = (error: unknown) => ({ type: 'error', error })

Deno.test('map_monad', async (test) => {
  await test.step('should transform success value when isSuccess is true', () => {
    const result = map_monad(
      true,
      5,
      'error',
      (x: number) => x * 2,
      createSuccess,
      createError,
    )
    assertEquals(result, { type: 'success', value: 10 })
  })

  await test.step('should preserve error when isSuccess is false', () => {
    const result = map_monad(
      false,
      5,
      'some error',
      (x: number) => x * 2,
      createSuccess,
      createError,
    )
    assertEquals(result, { type: 'error', error: 'some error' })
  })

  await test.step('should work with different types', () => {
    const result = map_monad(
      true,
      'hello',
      null,
      (s: string) => s.length,
      createSuccess,
      createError,
    )
    assertEquals(result, { type: 'success', value: 5 })
  })
})
