// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import Testing

@testable import Folklore

@Suite("Folklore/Optional: Otherwise")
struct OptionalOtherwiseTests {
  private let default_value: String = "Default"
  private func sync_provider() -> Int { 99 }
  private func async_provider() async -> Double { 2.71 }

  // MARK: - Otherwise Value Tests

  @Test("otherwise(_:) returns wrapped value when non-nil")
  func otherwise_returns_wrapped_value_when_non_nil() throws {
    // Given
    let optional: String? = "Value"

    // When
    let result = optional.otherwise(default_value)

    // Then
    #expect(result == "Value")
  }

  @Test("otherwise(_:) returns default value when nil")
  func otherwise_returns_default_value_when_nil() throws {
    // Given
    let optional: String? = .none

    // When
    let result = optional.otherwise(default_value)

    // Then
    #expect(result == "Default")
  }

  // MARK: - Otherwise Closure Tests

  @Test("otherwise(closure:) returns wrapped value when non-nil")
  func otherwise_closure_returns_wrapped_value_when_non_nil() throws {
    // Given
    let optional: Int? = 42

    // When
    let result = optional.otherwise(sync_provider)

    // Then
    #expect(result == 42)
  }

  @Test("otherwise(closure:) evaluates and returns closure result when nil")
  func otherwise_closure_evaluates_closure_when_nil() throws {
    // Given
    let optional: Int? = .none

    // When
    let result = optional.otherwise(sync_provider)

    // Then
    #expect(result == 99)
  }

  // MARK: - Async Otherwise Tests

  @Test("otherwise(async_closure:) returns wrapped value when non-nil")
  func otherwise_async_returns_wrapped_value_when_non_nil() async throws {
    // Given
    let optional: Double? = 3.14

    // When
    let result = await optional.otherwise(async_provider)

    // Then
    #expect(result == 3.14)
  }

  @Test("otherwise(async_closure:) awaits and returns closure result when nil")
  func otherwise_async_evaluates_closure_when_nil() async throws {
    // Given
    let optional: Double? = .none

    // When
    let result = await optional.otherwise(async_provider)

    // Then
    #expect(result == 2.71)
  }
}
