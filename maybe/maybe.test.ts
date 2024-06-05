/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { assertSpyCall, assertSpyCalls, type Spy, spy } from 'std/testing/mock.ts'
import { beforeEach, describe, it } from 'std/testing/bdd.ts'

import { Maybe } from './maybe.ts'
import { Base } from '../abstract/base.ts'
import { assertEquals } from 'std/testing/asserts.ts'

describe('Maybe', () => {
  const maybeConditionals = [1, '1', [1, 2, 3], { a: 1 }, () => 1]
  const maybeJust = maybeConditionals.map(Maybe.Just)
  const maybeJustWithValue = maybeConditionals.map((value) => ({ value, maybe: Maybe.Just(value) }))
  const maybeNothing = [Maybe.FromNullable(null), Maybe.FromNullable(undefined), Maybe.Nothing()]

  let justHandlerSpy: Spy
  let nothingHandlerSpy: Spy

  beforeEach(() => {
    justHandlerSpy = spy(<T>(value: T) => {
      return value
    })
    nothingHandlerSpy = spy(() => {})
  })

  it('should extend base', () => {
    assertEquals(Maybe.prototype instanceof Base, true)
    assertEquals(Base.HasInstance(Maybe.Just(1)), true)
    assertEquals(Base.HasInstance(Maybe.Nothing()), true)
  })

  describe('isJust()', () => {
    it('should return true if maybe is just (x)', () => {
      maybeJust.forEach((maybe) => assertEquals(maybe.isJust(), true))
    })

    it('should return false if maybe is nothing', () => {
      maybeNothing.forEach((maybe) => assertEquals(maybe.isJust(), false))
    })
  })

  describe('isNothing()', () => {
    it('should return false if maybe is just (x)', () => {
      maybeJust.forEach((maybe) => assertEquals(maybe.isNothing(), false))
    })

    it('should return true if maybe is nothing', () => {
      maybeNothing.forEach((maybe) => assertEquals(maybe.isNothing(), true))
    })
  })

  describe('matchWith()', () => {
    it('should return the result of the Just handler when maybe is just (x)', () => {
      maybeJustWithValue.forEach((wrapped, index) => {
        const { maybe, value } = wrapped
        maybe.matchWith({ Just: justHandlerSpy, Nothing: nothingHandlerSpy })
        assertSpyCalls(justHandlerSpy, index + 1)
        assertSpyCalls(nothingHandlerSpy, 0)
        assertSpyCall(justHandlerSpy, index, {
          args: [value],
          returned: value,
        })
      })
    })

    it('should return the result of the Nothing handler when maybe is nothing', () => {
      maybeNothing.forEach((maybe, index) => {
        maybe.matchWith({ Just: justHandlerSpy, Nothing: nothingHandlerSpy })
        assertSpyCalls(justHandlerSpy, 0)
        assertSpyCalls(nothingHandlerSpy, index + 1)
        assertSpyCall(nothingHandlerSpy, index, {})
      })
    })
  })

  describe('getOrElse()', () => {
    it('should return the wrapped value if maybe is just (x)', () => {
      maybeJustWithValue.forEach((wrapped) => {
        const { maybe, value } = wrapped
        assertEquals(maybe.getOrElse(0), value)
      })
    })

    it('should return the default value if maybe is nothing', () => {
      maybeNothing.forEach((maybe) => {
        assertEquals(maybe.getOrElse(0), 0)
      })
    })
  })

  describe('orElse()', () => {
    it('should return the maybe if maybe is just (x)', () => {
      maybeJust.forEach((maybe) => {
        assertEquals(maybe.orElse(nothingHandlerSpy), maybe)
        assertSpyCalls(nothingHandlerSpy, 0)
      })
    })

    it('should return the call the handler if maybe is nothing', () => {
      maybeNothing.forEach((maybe, index) => {
        maybe.orElse(nothingHandlerSpy)
        assertSpyCalls(nothingHandlerSpy, index + 1)
      })
    })
  })

  describe('map()', () => {
    it('should return a new maybe with the result of the handler if maybe is just (x)', () => {
      maybeJustWithValue.forEach((wrapped, index) => {
        const { maybe, value } = wrapped
        const result = maybe.map(justHandlerSpy)
        assertEquals(result.isJust(), true)
        assertEquals(result.getOrElse(0), value)
        assertSpyCalls(justHandlerSpy, index + 1)
        assertSpyCall(justHandlerSpy, index, {
          args: [value],
          returned: value,
        })
      })
    })

    it('should return nothing if maybe is nothing', () => {
      maybeNothing.forEach((maybe) => {
        const result = maybe.map(justHandlerSpy)
        assertEquals(result.isNothing(), true)
        assertEquals(result.getOrElse(0), 0)
        assertSpyCalls(justHandlerSpy, 0)
      })
    })
  })

  describe('chain()', () => {
    it('should return the result of the handler if maybe is just (x)', () => {
      maybeJustWithValue.forEach((wrapped) => {
        justHandlerSpy = spy(<T>(value: NonNullable<T>) => {
          return Maybe.Just(value)
        })
        const { maybe, value } = wrapped
        const result = maybe.chain(justHandlerSpy)
        assertEquals(result.isJust(), true)
        assertEquals(result.getOrElse(0), value)
        assertSpyCalls(justHandlerSpy, 1)
        assertSpyCall(justHandlerSpy, 0, {
          args: [value],
          returned: Maybe.Just(value),
        })
      })
    })

    it('should return nothing if maybe is nothing', () => {
      maybeNothing.forEach((maybe) => {
        const result = maybe.chain(justHandlerSpy)
        assertEquals(result.isNothing(), true)
        assertEquals(result.getOrElse(0), 0)
        assertSpyCalls(justHandlerSpy, 0)
      })
    })
  })

  describe('HasInstance()', () => {
    it('should return true if value is an instance of Maybe and falso otherwise', () => {
      maybeJustWithValue.forEach((wrapped) => {
        const { maybe, value } = wrapped
        assertEquals(Maybe.HasInstance(maybe), true)
        assertEquals(Maybe.HasInstance(value), false)
      })

      maybeNothing.forEach((maybe) => {
        assertEquals(Maybe.HasInstance(maybe), true)
      })
    })
  })

  describe('FromNullable()', () => {
    it('should return a Just if value is not null or undefined and Nothing otherwise', () => {
      maybeConditionals.forEach((value) => {
        assertEquals(Maybe.FromNullable(value), Maybe.Just(value))
      })
      assertEquals(Maybe.FromNullable(null), Maybe.Nothing())
      assertEquals(Maybe.FromNullable(undefined), Maybe.Nothing())
    })
  })

  describe('Just()', () => {
    it('should return a new Maybe with the value wrapped', () => {
      maybeConditionals.forEach((value) => {
        assertEquals(Maybe.HasInstance(Maybe.Just(value)), true)
        assertEquals(Maybe.Just(value).getOrElse(0), value)
      })
    })
  })

  describe('Nothing()', () => {
    it('should return a new Maybe with nothing', () => {
      assertEquals(Maybe.HasInstance(Maybe.Nothing()), true)
      assertEquals(Maybe.Nothing().getOrElse(0), 0)
    })
  })
})
