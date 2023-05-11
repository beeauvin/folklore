/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Result } from './result'

describe('Result', () => {
  it('should be generic', () => {
    const value = Result.Ok(1)
    expect(value.getOrElse(0)).toBe(1)

    const value2 = Result.Ok('1')
    expect(value2.getOrElse('0')).toBe('1')

    const value3 = Result.Ok({ a: 1 })
    expect(value3.getOrElse({ a: 0 })).toEqual({ a: 1 })

    const value4 = Result.Error(1)
    expect(value4.getOrElse(0)).toBe(0)

    const value5 = Result.Error('1')
    expect(value5.getOrElse('0')).toBe('0')

    const value6 = Result.Error({ a: 1 })
    expect(value6.getOrElse({ a: 0 })).toEqual({ a: 0 })
  })

  describe('isOk', () => {
    it('should return true if the value is not null', () => {
      const value = Result.Ok(1)
      expect(value.isOk()).toBe(true)
    })

    it('should return false if the value is null', () => {
      const value = Result.Error(1)
      expect(value.isOk()).toBe(false)
    })
  })

  describe('isError', () => {
    it('should return false if the value is not null', () => {
      const value = Result.Ok(1)
      expect(value.isError()).toBe(false)
    })

    it('should return true if the value is null', () => {
      const value = Result.Error(1)
      expect(value.isError()).toBe(true)
    })
  })

  describe('match', () => {
    it('should return the result of the ok function if it is not null', () => {
      const value = Result.Ok(1)
      expect(
        value.match(
          (value) => value,
          () => 0
        )
      ).toBe(1)
    })

    it('should return the result of the error function if it is null', () => {
      const value = Result.Error(1)
      expect(
        value.match(
          (value) => value,
          () => 0
        )
      ).toBe(0)
    })
  })

  describe('matchWith', () => {
    it('should return the result of the ok function if it is not null', () => {
      const value = Result.Ok(1)
      expect(value.matchWith({ ok: (value) => value, error: () => 0 })).toBe(1)
    })

    it('should return the result of the error function if it is null', () => {
      const value = Result.Error(1)
      expect(value.matchWith({ ok: (value) => value, error: () => 0 })).toBe(0)
    })
  })

  describe('getOrElse', () => {
    it('should return the value if it is not null', () => {
      const value = Result.Ok(1)
      expect(value.getOrElse(0)).toBe(1)
    })

    it('should return the default value if it is null', () => {
      const value = Result.Error(1)
      expect(value.getOrElse(0)).toBe(0)
    })
  })

  describe('getOrDo', () => {
    it('should return the value if it is not null', () => {
      const value = Result.Ok(1)
      expect(value.getOrDo(() => 0)).toBe(1)
    })

    it('should return the default value if it is null', () => {
      const value = Result.Error(1)
      expect(value.getOrDo(() => 0)).toBe(0)
    })
  })

  describe('Ok', () => {
    it('should return a result with the value', () => {
      const value = Result.Ok(1)
      expect(value.isOk()).toBe(true)
      expect(value.getOrElse(0)).toBe(1)
    })
  })

  describe('Error', () => {
    it('should return a result with the error', () => {
      const value = Result.Error(1)
      expect(value.isError()).toBe(true)
      expect(value.getOrElse(0)).toBe(0)
    })
  })
})
