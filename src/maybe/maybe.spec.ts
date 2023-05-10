import { Maybe } from './maybe'

describe('Maybe', () => {
  it('should be generic', () => {
    const value = Maybe.Just(1)
    expect(value.getOrElse(0)).toBe(1)

    const value2 = Maybe.Just('1')
    expect(value2.getOrElse('0')).toBe('1')

    const value3 = Maybe.Just({ a: 1 })
    expect(value3.getOrElse({ a: 0 })).toEqual({ a: 1 })
  })

  describe('isJust', () => {
    it('should return true if the value is not null', () => {
      const value = Maybe.Just(1)
      expect(value.isJust()).toBe(true)
    })

    it('should return false if the value is null', () => {
      const value = Maybe.Nothing()
      expect(value.isJust()).toBe(false)
    })
  })

  describe('isNothing', () => {
    it('should return false if the value is not null', () => {
      const value = Maybe.Just(1)
      expect(value.isNothing()).toBe(false)
    })

    it('should return true if the value is null', () => {
      const value = Maybe.Nothing()
      expect(value.isNothing()).toBe(true)
    })
  })

  describe('match', () => {
    it('should return the result of the just function if it is not null', () => {
      const value = Maybe.Just(1)
      expect(
        value.match(
          (value) => value,
          () => 0
        )
      ).toBe(1)
    })

    it('should return the result of the nothing function if it is null', () => {
      const value = Maybe.Nothing()
      expect(
        value.match(
          (value) => value,
          () => 0
        )
      ).toBe(0)
    })
  })

  describe('matchWith', () => {
    it('should return the result of the just function if it is not null', () => {
      const value = Maybe.Just(1)
      expect(value.matchWith({ just: (value) => value, nothing: () => 0 })).toBe(1)
    })

    it('should return the result of the nothing function if it is null', () => {
      const value = Maybe.Nothing()
      expect(value.matchWith({ just: (value) => value, nothing: () => 0 })).toBe(0)
    })
  })

  describe('getOrElse', () => {
    it('should return the value if it is not null', () => {
      const value = Maybe.Just(1)
      expect(value.getOrElse(0)).toBe(1)
    })

    it('should return the default value if it is null', () => {
      const value = Maybe.Nothing()
      expect(value.getOrElse(0)).toBe(0)
    })
  })

  describe('getOrDo', () => {
    it('should return the value if it is not null', () => {
      const value = Maybe.Just(1)
      expect(value.getOrDo(() => 0)).toBe(1)
    })

    it('should return the result of the action if it is null', () => {
      const value = Maybe.Nothing()
      expect(value.getOrDo(() => 0)).toBe(0)
    })
  })

  describe('getOrThrow', () => {
    it('should return the value if it is not null', () => {
      const value = Maybe.Just(1)
      expect(value.getOrThrow()).toBe(1)
    })

    it('should throw an error if it is null', () => {
      const value = Maybe.Nothing()
      expect(() => value.getOrThrow()).toThrow()
    })
  })

  describe('FromNullable', () => {
    it('should return a Just if the value is not null', () => {
      const value = Maybe.FromNullable(1)
      expect(value.getOrElse(0)).toBe(1)
    })

    it('should return a Nothing if the value is null', () => {
      function testNullable(): number | null {
        return null
      }
      const value = Maybe.FromNullable(testNullable())
      expect(value.getOrElse(0)).toBe(0)
    })

    it('should return a Nothing if the value is undefined', () => {
      function testNullable(): number | undefined {
        return undefined
      }
      const value = Maybe.FromNullable(testNullable())
      expect(value.getOrElse(0)).toBe(0)
    })
  })

  describe('Just', () => {
    it('should return a Just', () => {
      const value = Maybe.Just(1)
      expect(value.getOrElse(0)).toBe(1)
    })
  })

  describe('Nothing', () => {
    it('should return a Nothing', () => {
      const value = Maybe.Nothing()
      expect(value.getOrElse(0)).toBe(0)
    })
  })
})
