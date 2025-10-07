/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Result } from './result.ts'
import { assertEquals } from '@std/assert'

Deno.test('Result', async (t) => {
  await t.step('isOk()', async (t) => {
    await t.step('should return true for Ok', () => {
      assertEquals(Result.Ok(5).isOk(), true)
    })

    await t.step('should return false for Error', () => {
      assertEquals(Result.Error('oops').isOk(), false)
    })
  })

  await t.step('isError()', async (t) => {
    await t.step('should return false for Ok', () => {
      assertEquals(Result.Ok(5).isError(), false)
    })

    await t.step('should return true for Error', () => {
      assertEquals(Result.Error('oops').isError(), true)
    })
  })

  await t.step('matchWith()', async (t) => {
    await t.step('should call Ok handler when Ok', () => {
      const result = Result.Ok(5).matchWith({
        Ok: (v) => v * 2,
        Error: () => 0,
      })
      assertEquals(result, 10)
    })

    await t.step('should call Error handler when Error', () => {
      const result = Result.Error<number>('oops').matchWith({
        Ok: (v) => v * 2,
        Error: (err) => `error: ${err}`,
      })
      assertEquals(result, 'error: oops')
    })

    await t.step('should work with Error objects', () => {
      const error = new Error('test')
      const result = Result.Error<number>(error).matchWith({
        Ok: (v) => v,
        Error: (err) => err,
      })
      assertEquals(result, error)
    })
  })

  await t.step('getOrElse()', async (t) => {
    await t.step('should return value if Ok', () => {
      assertEquals(Result.Ok(5).getOrElse(0), 5)
    })

    await t.step('should return default if Error', () => {
      assertEquals(Result.Error<number>('oops').getOrElse(0), 0)
    })
  })

  await t.step('orElse()', async (t) => {
    await t.step('should return original if Ok', () => {
      const result = Result.Ok(5).orElse(() => Result.Ok(0))
      assertEquals(result.isOk(), true)
      assertEquals(result.getOrElse(99), 5)
    })

    await t.step('should call handler if Error', () => {
      const result = Result.Error<number>('oops').orElse(() => Result.Ok(0))
      assertEquals(result.isOk(), true)
      assertEquals(result.getOrElse(99), 0)
    })

    await t.step('should pass error to handler', () => {
      const result = Result.Error<number>('not found').orElse((r) => {
        const err = r.merge()
        return Result.Ok(err === 'not found' ? 404 : 500)
      })
      assertEquals(result.getOrElse(99), 404)
    })
  })

  await t.step('merge()', async (t) => {
    await t.step('should return value if Ok', () => {
      assertEquals(Result.Ok(5).merge(), 5)
    })

    await t.step('should return error if Error', () => {
      assertEquals(Result.Error<number>('oops').merge(), 'oops')
    })

    await t.step('should work with Error objects', () => {
      const error = new Error('test')
      assertEquals(Result.Error<number>(error).merge(), error)
    })
  })

  await t.step('mapError()', async (t) => {
    await t.step('should return original if Ok', () => {
      const result = Result.Ok(5).mapError('new error')
      assertEquals(result.isOk(), true)
      assertEquals(result.getOrElse(0), 5)
    })

    await t.step('should map error if Error', () => {
      const result = Result.Error<number>('old').mapError('new')
      assertEquals(result.isError(), true)
      assertEquals(result.merge(), 'new')
    })

    await t.step('should work with Error objects', () => {
      const newError = new Error('new')
      const result = Result.Error<number>('old').mapError(newError)
      assertEquals(result.merge(), newError)
    })
  })

  await t.step('map()', async (t) => {
    await t.step('should transform value if Ok', () => {
      const result = Result.Ok(5).map((x) => x * 2)
      assertEquals(result.isOk(), true)
      assertEquals(result.getOrElse(0), 10)
    })

    await t.step('should preserve error if Error', () => {
      const result = Result.Error<number>('oops').map((x) => x * 2)
      assertEquals(result.isError(), true)
      assertEquals(result.merge(), 'oops')
    })

    await t.step('should allow type transformation', () => {
      const result = Result.Ok(5).map((x) => String(x))
      assertEquals(result.getOrElse(''), '5')
    })
  })

  await t.step('chain()', async (t) => {
    await t.step('should chain if Ok', () => {
      const result = Result.Ok(5).chain((x) => Result.Ok(x * 2))
      assertEquals(result.isOk(), true)
      assertEquals(result.getOrElse(0), 10)
    })

    await t.step('should preserve error if Error', () => {
      const result = Result.Error<number>('oops').chain((x) => Result.Ok(x * 2))
      assertEquals(result.isError(), true)
      assertEquals(result.merge(), 'oops')
    })

    await t.step('should flatten nested Results', () => {
      const result = Result.Ok(5).chain((x) => Result.Ok(x * 2))
      // Should be Result<number>, not Result<Result<number>>
      assertEquals(result.getOrElse(0), 10)
    })

    await t.step('should propagate errors from handler', () => {
      const result = Result.Ok(5).chain((_x) => Result.Error<number>('handler error'))
      assertEquals(result.isError(), true)
      assertEquals(result.merge(), 'handler error')
    })
  })

  await t.step('Try()', async (t) => {
    await t.step('should return Ok if no error', () => {
      const result = Result.Try(() => 5)
      assertEquals(result.isOk(), true)
      assertEquals(result.getOrElse(0), 5)
    })

    await t.step('should catch thrown errors', () => {
      const result = Result.Try(() => {
        throw new Error('oops')
      })
      assertEquals(result.isError(), true)
      const error = result.merge() as Error
      assertEquals(error.message, 'oops')
    })

    await t.step('should handle thrown strings', () => {
      const result = Result.Try(() => {
        throw 'string error'
      })
      assertEquals(result.isError(), true)
      assertEquals(result.merge(), 'string error')
    })

    await t.step('should handle thrown non-Error objects', () => {
      const result = Result.Try(() => {
        throw { custom: 'error' }
      })
      assertEquals(result.isError(), true)
      assertEquals(result.merge(), '[object Object]')
    })
  })

  await t.step('FromPromise()', async (t) => {
    await t.step('should return Ok if promise resolves', async () => {
      const result = await Result.FromPromise(Promise.resolve(5))
      assertEquals(result.isOk(), true)
      assertEquals(result.getOrElse(0), 5)
    })

    await t.step('should catch rejected promises', async () => {
      const result = await Result.FromPromise(Promise.reject(new Error('oops')))
      assertEquals(result.isError(), true)
      const error = result.merge() as Error
      assertEquals(error.message, 'oops')
    })

    await t.step('should handle non-Error rejections', async () => {
      const result = await Result.FromPromise(Promise.reject('string error'))
      assertEquals(result.isError(), true)
      assertEquals(result.merge(), 'string error')
    })
  })

  await t.step('HasInstance()', async (t) => {
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
