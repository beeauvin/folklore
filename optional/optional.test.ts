/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { describe, it } from '@std/testing/bdd'
import { assertEquals } from '@std/assert'

import { Optional } from './optional.ts'

describe('Optional', () => {
  describe('FromNullable()', () => {
    it('should create Some when value is not null or undefined', () => {
      const optional = Optional.FromNullable('value')
      const result = optional.otherwise('default')
      assertEquals(result, 'value')
    })

    it('should create None when value is null', () => {
      const optional = Optional.FromNullable<string>(null)
      const result = optional.otherwise('default')
      assertEquals(result, 'default')
    })

    it('should create None when value is undefined', () => {
      const optional = Optional.FromNullable<string>(undefined)
      const result = optional.otherwise('default')
      assertEquals(result, 'default')
    })
  })

  describe('otherwise() - with value', () => {
    it('should return wrapped value when optional is Some', () => {
      const optional: Optional<string> = Optional.Some('Value')
      const result = optional.otherwise('Default')
      assertEquals(result, 'Value')
    })

    it('should return default value when optional is None', () => {
      const optional: Optional<string> = Optional.None<string>()
      const result = optional.otherwise('Default')
      assertEquals(result, 'Default')
    })
  })

  describe('otherwise() - with sync provider', () => {
    const syncProvider = () => 99

    it('should return wrapped value when optional is Some', () => {
      const optional: Optional<number> = Optional.Some(42)
      const result = optional.otherwise(syncProvider)
      assertEquals(result, 42)
    })

    it('should evaluate and return provider result when optional is None', () => {
      const optional: Optional<number> = Optional.None<number>()
      const result = optional.otherwise(syncProvider)
      assertEquals(result, 99)
    })

    it('should not call provider when optional is Some', () => {
      const optional: Optional<number> = Optional.Some(42)
      let called = false
      const provider = () => {
        called = true
        return 99
      }
      optional.otherwise(provider)
      assertEquals(called, false)
    })
  })

  describe('otherwise() - with async provider', () => {
    const asyncProvider = async () => await Promise.resolve(2.71)

    it('should return wrapped value when optional is Some', async () => {
      const optional: Optional<number> = Optional.Some(3.14)
      const result = await optional.otherwise(asyncProvider)
      assertEquals(result, 3.14)
    })

    it('should await and return provider result when optional is None', async () => {
      const optional: Optional<number> = Optional.None<number>()
      const result = await optional.otherwise(asyncProvider)
      assertEquals(result, 2.71)
    })

    it('should not call provider when optional is Some', async () => {
      const optional: Optional<number> = Optional.Some(3.14)
      let called = false
      const provider = async () => {
        called = true
        return await Promise.resolve(2.71)
      }
      await optional.otherwise(provider)
      assertEquals(called, false)
    })
  })

  describe('HasInstance()', () => {
    it('should return true if value is an instance of Optional', () => {
      const someCases = [
        Optional.Some(42),
        Optional.Some('value'),
        Optional.Some([1, 2, 3]),
        Optional.Some({ key: 'value' }),
      ]

      someCases.forEach((optional) => {
        assertEquals(Optional.HasInstance(optional), true)
      })

      const noneCases = [
        Optional.None<number>(),
        Optional.None<string>(),
        Optional.FromNullable(null),
        Optional.FromNullable(undefined),
      ]

      noneCases.forEach((optional) => {
        assertEquals(Optional.HasInstance(optional), true)
      })
    })

    it('should return false if value is not an instance of Optional', () => {
      assertEquals(Optional.HasInstance(5), false)
      assertEquals(Optional.HasInstance(null), false)
      assertEquals(Optional.HasInstance(undefined), false)
      assertEquals(Optional.HasInstance({}), false)
      assertEquals(Optional.HasInstance('string'), false)
    })
  })
})
