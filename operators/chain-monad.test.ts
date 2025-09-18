/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { assertEquals } from '@std/assert'
import { chain_monad } from './chain-monad.ts'

// Mock factory functions for testing
const createError = (error: unknown) => ({ type: 'error', error })

Deno.test('chain_monad', async (test) => {
  await test.step('should call handler with success value when isSuccess is true', () => {
    const result = chain_monad(
      true,
      5,
      'error',
      (x: number) => ({ type: 'chained', value: x * 3 }),
      createError,
    )
    assertEquals(result, { type: 'chained', value: 15 })
  })

  await test.step('should return error when isSuccess is false', () => {
    const result = chain_monad(
      false,
      5,
      'some error',
      (x: number) => ({ type: 'chained', value: x * 3 }),
      createError,
    )
    assertEquals(result, { type: 'error', error: 'some error' })
  })

  await test.step('should work with different return types', () => {
    const result = chain_monad(
      true,
      'hello',
      null,
      (s: string) => ({ result: s.toUpperCase() }),
      createError,
    )
    assertEquals(result, { result: 'HELLO' })
  })
})
