/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { describe, it } from 'std/testing/bdd.ts'

import { Maybe } from './maybe.ts'
import { assertEquals } from 'std/testing/asserts.ts'

describe('Maybe', () => {
  it('should be generic', () => {
    const value = Maybe.Just(1)
    assertEquals(value.getOrElse(0), 1)

    const value2 = Maybe.Just('1')
    assertEquals(value2.getOrElse('0'), '1')

    const value3 = Maybe.Just({ a: 1 })
    assertEquals(value3.getOrElse({ a: 0 }), { a: 1 })
  })

  describe('isJust', () => {
    it('should return true if the value is not null', () => {
      const value = Maybe.Just(1)
      assertEquals(value.isJust(), true)
    })

    it('should return false if the value is null', () => {
      const value = Maybe.Nothing()
      assertEquals(value.isJust(), false)
    })
  })

  describe('isNothing', () => {
    it('should return false if the value is not null', () => {
      const value = Maybe.Just(1)
      assertEquals(value.isNothing(), false)
    })

    it('should return true if the value is null', () => {
      const value = Maybe.Nothing()
      assertEquals(value.isNothing(), true)
    })
  })

  describe('match', () => {
    it('should return the result of the just function if it is not null', () => {
      const value = Maybe.Just(1)
      assertEquals(
        value.match(
          (value) => value,
          () => 0,
        ),
        1,
      )
    })

    it('should return the result of the nothing function if it is null', () => {
      const value = Maybe.Nothing()
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
    it('should return the result of the just function if it is not null', () => {
      const value = Maybe.Just(1)
      assertEquals(value.matchWith({ just: (value) => value, nothing: () => 0 }), 1)
    })

    it('should return the result of the nothing function if it is null', () => {
      const value = Maybe.Nothing()
      assertEquals(value.matchWith({ just: (value) => value, nothing: () => 0 }), 0)
    })
  })

  describe('getOrElse', () => {
    it('should return the value if it is not null', () => {
      const value = Maybe.Just(1)
      assertEquals(value.getOrElse(0), 1)
    })

    it('should return the default value if it is null', () => {
      const value = Maybe.Nothing()
      assertEquals(value.getOrElse(0), 0)
    })
  })

  describe('getOrDo', () => {
    it('should return the value if it is not null', () => {
      const value = Maybe.Just(1)
      assertEquals(value.getOrDo(() => 0), 1)
    })

    it('should return the result of the action if it is null', () => {
      const value = Maybe.Nothing()
      assertEquals(value.getOrDo(() => 0), 0)
    })
  })

  describe('getOrThrow', () => {
    it('should return the value if it is not null', () => {
      const value = Maybe.Just(1)
      assertEquals(value.getOrThrow(), 1)
    })

    it('should throw an error if it is null', () => {
      const value = Maybe.Nothing()
      assertEquals(value.getOrElse(0), 0)
    })
  })

  describe('FromNullable', () => {
    it('should return a Just if the value is not null', () => {
      const value = Maybe.FromNullable(1)
      assertEquals(value.getOrElse(0), 1)
    })

    it('should return a Nothing if the value is null', () => {
      function testNullable(): number | null {
        return null
      }
      const value = Maybe.FromNullable(testNullable())
      assertEquals(value.getOrElse(0), 0)
    })

    it('should return a Nothing if the value is undefined', () => {
      function testNullable(): number | undefined {
        return undefined
      }
      const value = Maybe.FromNullable(testNullable())
      assertEquals(value.getOrElse(0), 0)
    })
  })

  describe('Just', () => {
    it('should return a Just', () => {
      const value = Maybe.Just(1)
      assertEquals(value.getOrElse(0), 1)
    })
  })

  describe('Nothing', () => {
    it('should return a Nothing', () => {
      const value = Maybe.Nothing()
      assertEquals(value.getOrElse(0), 0)
    })
  })
})
