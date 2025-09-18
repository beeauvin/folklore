/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { assertEquals } from '@std/assert'
import { or_else_monad } from './or-else-monad.ts'

// Mock factory functions for testing
const createSuccess = (value: unknown) => ({ type: 'success', value })

Deno.test('or_else_monad', async (test) => {
  await test.step('should return success monad when isSuccess is true', () => {
    const result = or_else_monad(
      true,
      'original',
      () => ({ type: 'fallback', value: 'backup' }),
      createSuccess,
    )
    assertEquals(result, { type: 'success', value: 'original' })
  })

  await test.step('should call handler when isSuccess is false', () => {
    const result = or_else_monad(
      false,
      'original',
      () => ({ type: 'fallback', value: 'backup' }),
      createSuccess,
    )
    assertEquals(result, { type: 'fallback', value: 'backup' })
  })

  await test.step('should work with different types', () => {
    const result = or_else_monad(
      false,
      42,
      () => ({ alternative: 'none' }),
      createSuccess,
    )
    assertEquals(result, { alternative: 'none' })
  })
})
