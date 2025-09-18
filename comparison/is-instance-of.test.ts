/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { assertEquals } from '@std/assert'
import { is_instance_of } from './is-instance-of.ts'

Deno.test('is_instance_of', async (test) => {
  class Foo {}

  await test.step('returns true if the object given is valid and the value is an instance of that object', () => {
    assertEquals(is_instance_of(Object, {}), true)
    assertEquals(is_instance_of(Function, new Function()), true)
    assertEquals(is_instance_of(Foo, new Foo()), true)
  })

  await test.step('returns false if the object given is valid but the value is not an instance of it', () => {
    assertEquals(is_instance_of(Object, '123'), false)
    assertEquals(is_instance_of(Function, {}), false)
    assertEquals(is_instance_of(Foo, new class Bar {}()), false)
    assertEquals(is_instance_of(Foo, 12), false)
  })

  await test.step('returns false if the object given is invalid', () => {
    assertEquals(is_instance_of(new Foo(), new Foo()), false)
    assertEquals(is_instance_of(12, {}), false)
    assertEquals(is_instance_of({}, 12), false)
    assertEquals(is_instance_of(12, 12), false)
    assertEquals(is_instance_of(null, null), false)
    assertEquals(is_instance_of(undefined, undefined), false)
  })
})
