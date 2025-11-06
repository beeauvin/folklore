// Copyright © 2025 Cassidy Spring (Bee).
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Result, type ResultError } from './result.ts'
import { assertEquals } from '@std/assert'

// Custom error type for testing
class TestError extends Error {
  constructor(
    public readonly kind: 'expected' | 'other',
    message?: string,
  ) {
    super(message)
  }
}

Deno.test('Result', async (t) => {
  await t.step('otherwise()', async (t) => {
    await t.step('with direct value', async (t) => {
      await t.step('should return success value when Ok', () => {
        const result = Result.Ok('Success')
        assertEquals(result.otherwise('Default'), 'Success')
      })

      await t.step('should return default value when Error', () => {
        const result = Result.Error<string>('Failed')
        assertEquals(result.otherwise('Default'), 'Default')
      })
    })

    await t.step('with sync provider (no error)', async (t) => {
      await t.step('should return success value when Ok', () => {
        const result = Result.Ok(42)
        assertEquals(result.otherwise(() => 99), 42)
      })

      await t.step('should evaluate provider when Error', () => {
        const result = Result.Error<number>('Failed')
        assertEquals(result.otherwise(() => 99), 99)
      })
    })

    await t.step('with sync provider (with error)', async (t) => {
      await t.step('should return success value when Ok', () => {
        const result = Result.Ok(42)
        assertEquals(
          result.otherwise((error: ResultError) => (error === 'expected' ? 100 : 200)),
          42,
        )
      })

      await t.step('should pass error to provider when Error', () => {
        const result = Result.Error<number>('expected')
        const value = result.otherwise((error: ResultError) => error === 'expected' ? 100 : 200)
        assertEquals(value, 100)
      })

      await t.step('should pass correct error to provider', () => {
        const result = Result.Error<number>('other')
        const value = result.otherwise((error: ResultError) => error === 'expected' ? 100 : 200)
        assertEquals(value, 200)
      })

      await t.step('should work with Error objects', () => {
        const testError = new TestError('expected', 'test error')
        const result = Result.Error<number>(testError)
        const value = result.otherwise((error: ResultError) => {
          if (error instanceof TestError && error.kind === 'expected') {
            return 100
          }
          return 200
        })
        assertEquals(value, 100)
      })
    })

    await t.step('with async provider (no error)', async (t) => {
      await t.step('should return success value when Ok', async () => {
        const result = Result.Ok(1.23)
        assertEquals(await result.otherwise(async () => 2.71), 1.23)
      })

      await t.step('should await provider when Error', async () => {
        const result = Result.Error<number>('Failed')
        assertEquals(await result.otherwise(async () => 2.71), 2.71)
      })
    })

    await t.step('with async provider (with error)', async (t) => {
      await t.step('should return success value when Ok', async () => {
        const result = Result.Ok(1.23)
        assertEquals(
          await result.otherwise(async (error: ResultError) => error === 'expected' ? 3.14 : 1.618),
          1.23,
        )
      })

      await t.step('should pass error to async provider when Error', async () => {
        const result = Result.Error<number>('expected')
        const value = await result.otherwise(async (error: ResultError) =>
          error === 'expected' ? 3.14 : 1.618
        )
        assertEquals(value, 3.14)
      })

      await t.step('should pass correct error to async provider', async () => {
        const result = Result.Error<number>('other')
        const value = await result.otherwise(async (error: ResultError) =>
          error === 'expected' ? 3.14 : 1.618
        )
        assertEquals(value, 1.618)
      })

      await t.step('should work with Error objects in async provider', async () => {
        const testError = new TestError('other', 'test error')
        const result = Result.Error<number>(testError)
        const value = await result.otherwise(async (error: ResultError) => {
          if (error instanceof TestError && error.kind === 'expected') {
            return 3.14
          }
          return 1.618
        })
        assertEquals(value, 1.618)
      })
    })
  })
})
