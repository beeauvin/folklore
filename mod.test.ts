// Copyright © 2025 Cassidy Spring (Bee).
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Optional, Result } from './mod.ts'

import { assertExists } from '@std/assert'

Deno.test('module', () => {
  assertExists(Optional)
  assertExists(Result)
})
