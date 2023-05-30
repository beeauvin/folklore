/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { assertEquals } from 'std/testing/asserts.ts'
import { Base } from './base.ts'

Deno.test('Base', async (test) => {
  class Foo extends Base {}
  class Bar extends Base {}
  class Baz extends Foo {}
  class Hmm {}

  await test.step('isInstanceOf', () => {
    const foo = new Foo()
    const bar = new Bar()
    const baz = new Baz()

    assertEquals(foo.isInstanceOf(Foo), true)
    assertEquals(foo.isInstanceOf(Base), true)
    assertEquals(foo.isInstanceOf(Bar), false)
    assertEquals(foo.isInstanceOf(Baz), false)
    assertEquals(foo.isInstanceOf(Hmm), false)

    assertEquals(bar.isInstanceOf(Foo), false)
    assertEquals(bar.isInstanceOf(Base), true)
    assertEquals(bar.isInstanceOf(Bar), true)
    assertEquals(bar.isInstanceOf(Baz), false)
    assertEquals(bar.isInstanceOf(Hmm), false)

    assertEquals(baz.isInstanceOf(Foo), true)
    assertEquals(baz.isInstanceOf(Base), true)
    assertEquals(baz.isInstanceOf(Bar), false)
    assertEquals(baz.isInstanceOf(Baz), true)
    assertEquals(baz.isInstanceOf(Hmm), false)
  })

  await test.step('HasInstance', () => {
    const foo = new Foo()
    const bar = new Bar()
    const baz = new Baz()

    assertEquals(Foo.HasInstance(foo), true)
    assertEquals(Foo.HasInstance(bar), false)
    assertEquals(Foo.HasInstance(baz), true)
    assertEquals(Foo.HasInstance(Hmm), false)

    assertEquals(Bar.HasInstance(foo), false)
    assertEquals(Bar.HasInstance(bar), true)
    assertEquals(Bar.HasInstance(baz), false)
    assertEquals(Bar.HasInstance(Hmm), false)

    assertEquals(Baz.HasInstance(foo), false)
    assertEquals(Baz.HasInstance(bar), false)
    assertEquals(Baz.HasInstance(baz), true)
    assertEquals(Baz.HasInstance(Hmm), false)
  })
})
