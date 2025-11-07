// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import Testing

@testable import Folklore

@Suite("Folklore/Optional: Optionally")
struct OptionalOptionallyTests {
  private let default_value: String = "Default"
  private let default_nothing: String? = .none
  private func sync_provider() -> Int { 99 }
  private func sync_nothing() -> Int? { .none }
  private func async_provider() async -> Double { 2.71 }
  private func async_nothing() async -> Double? { .none }

  // MARK: - Optionally Value Tests

  @Test("optionally(_:) returns wrapped value when non-nil")
  func optionally_returns_wrapped_value_when_non_nil() throws {
    // Given
    let optional: String? = "Value"

    // When
    let result = optional.optionally(default_value)

    // Then
    #expect(result == "Value")
  }

  @Test("optionally(_:) returns fallback optional when nil")
  func optionally_returns_fallback_optional_when_nil() throws {
    // Given
    let optional: String? = .none

    // When
    let result = optional.optionally(default_value)

    // Then
    #expect(result == "Default")
  }

  @Test("optionally(_:) returns nil when both optionals are nil")
  func optionally_returns_nil_when_both_optionals_are_nil() throws {
    // Given
    let optional: String? = .none

    // When
    let result = optional.optionally(default_nothing)

    // Then
    #expect(result == nil)
  }

  // MARK: - Optionally Closure Tests

  @Test("optionally(closure:) returns wrapped value when non-nil")
  func optionally_closure_returns_wrapped_value_when_non_nil() throws {
    // Given
    let optional: Int? = 42

    // When
    let result = optional.optionally(sync_provider)

    // Then
    #expect(result == 42)
  }

  @Test("optionally(closure:) evaluates and returns closure result when nil")
  func optionally_closure_evaluates_closure_when_nil() throws {
    // Given
    let optional: Int? = .none

    // When
    let result = optional.optionally(sync_provider)

    // Then
    #expect(result == 99)
  }

  @Test("optionally(closure:) returns nil when closure returns nil")
  func optionally_closure_returns_nil_when_closure_returns_nil() throws {
    // Given
    let optional: Int? = .none

    // When
    let result = optional.optionally(sync_nothing)

    // Then
    #expect(result == nil)
  }

  // MARK: - Async Optionally Tests

  @Test("optionally(async_closure:) returns wrapped value when non-nil")
  func optionally_async_returns_wrapped_value_when_non_nil() async throws {
    // Given
    let optional: Double? = 3.14

    // When
    let result = await optional.optionally(async_provider)

    // Then
    #expect(result == 3.14)
  }

  @Test("optionally(async_closure:) awaits and returns closure result when nil")
  func optionally_async_evaluates_closure_when_nil() async throws {
    // Given
    let optional: Double? = .none

    // When
    let result = await optional.optionally(async_provider)

    // Then
    #expect(result == 2.71)
  }

  @Test("optionally(async_closure:) returns nil when closure returns nil")
  func optionally_async_returns_nil_when_closure_returns_nil() async throws {
    // Given
    let optional: Double? = .none

    // When
    let result = await optional.optionally(async_nothing)

    // Then
    #expect(result == nil)
  }
}
