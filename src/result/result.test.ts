/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { describe, it } from 'std/testing/bdd.ts'

import { Result } from './result.ts'
import { assertEquals } from 'std/testing/asserts.ts'

describe('Result', () => {
  it('should be generic', () => {
    const value = Result.Ok(1)
    assertEquals(value.getOrElse(0), 1)

    const value2 = Result.Ok('1')
    assertEquals(value2.getOrElse('0'), '1')

    const value3 = Result.Ok({ a: 1 })
    assertEquals(value3.getOrElse({ a: 0 }), { a: 1 })

    const value4 = Result.Error(1)
    assertEquals(value4.getOrElse(0), 0)

    const value5 = Result.Error('1')
    assertEquals(value5.getOrElse('0'), '0')

    const value6 = Result.Error({ a: 1 })
    assertEquals(value6.getOrElse({ a: 0 }), { a: 0 })
  })

  describe('isOk', () => {
    it('should return true if the value is not null', () => {
      const value = Result.Ok(1)
      assertEquals(value.isOk(), true)
    })

    it('should return false if the value is null', () => {
      const value = Result.Error(1)
      assertEquals(value.isOk(), false)
    })
  })

  describe('isError', () => {
    it('should return false if the value is not null', () => {
      const value = Result.Ok(1)
      assertEquals(value.isError(), false)
    })

    it('should return true if the value is null', () => {
      const value = Result.Error(1)
      assertEquals(value.isError(), true)
    })
  })

  describe('match', () => {
    it('should return the result of the ok function if it is not null', () => {
      const value = Result.Ok(1)
      assertEquals(
        value.match(
          (value) => value,
          () => 0,
        ),
        1,
      )
    })

    it('should return the result of the error function if it is null', () => {
      const value = Result.Error(1)
      assertEquals(
        value.match(
          (value) => value,
          () => 0,
        ),
        0,
      )
    })
  })

  describe('matchWith', () => {
    it('should return the result of the ok function if it is not null', () => {
      const value = Result.Ok(1)
      assertEquals(value.matchWith({ ok: (value) => value, error: () => 0 }), 1)
    })

    it('should return the result of the error function if it is null', () => {
      const value = Result.Error(1)
      assertEquals(value.matchWith({ ok: (value) => value, error: () => 0 }), 0)
    })
  })

  describe('getOrElse', () => {
    it('should return the value if it is not null', () => {
      const value = Result.Ok(1)
      assertEquals(value.getOrElse(0), 1)
    })

    it('should return the default value if it is null', () => {
      const value = Result.Error(1)
      assertEquals(value.getOrElse(0), 0)
    })
  })

  describe('getOrDo', () => {
    it('should return the value if it is not null', () => {
      const value = Result.Ok(1)
      assertEquals(value.getOrDo(() => 0), 1)
    })

    it('should return the default value if it is null', () => {
      const value = Result.Error(1)
      assertEquals(value.getOrDo(() => 0), 0)
    })
  })

  describe('Ok', () => {
    it('should return a result with the value', () => {
      const value = Result.Ok(1)
      assertEquals(value.isOk(), true)
      assertEquals(value.getOrElse(0), 1)
    })
  })

  describe('Error', () => {
    it('should return a result with the error', () => {
      const value = Result.Error(1)
      assertEquals(value.isError(), true)
      assertEquals(value.getOrElse(0), 0)
    })
  })
})
