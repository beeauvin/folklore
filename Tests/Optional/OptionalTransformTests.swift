// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import Testing

@testable import Folklore

@Suite("Folklore/Optional: Transform")
struct OptionalTransformTests {
  private func sync_transformer(_ value: String) -> Int { value.count }
  private func sync_transformer_optional(_ value: String) -> Int? {
    value.isEmpty ? nil : value.count
  }
  private func async_transformer(_ value: Int) async -> String { String(value * 2) }
  private func async_transformer_optional(_ value: Int) async -> String? {
    value > 0 ? String(value * 2) : nil
  }

  // MARK: - Transform Value Tests

  @Test("transform(_:) returns transformed value when non-nil")
  func transform_returns_transformed_value_when_non_nil() throws {
    // Given
    let optional: String? = "Hello"

    // When
    let result = optional.transform(sync_transformer)

    // Then
    #expect(result == 5)
  }

  @Test("transform(_:) returns nil when optional is nil")
  func transform_returns_nil_when_optional_is_nil() throws {
    // Given
    let optional: String? = .none

    // When
    let result = optional.transform(sync_transformer)

    // Then
    #expect(result == nil)
  }

  // MARK: - Optional-Returning Transform Tests

  @Test(
    "transform(_:) with optional returning transformer returns transformed value when non-nil and transformation succeeds"
  )
  func transform_optional_returns_transformed_value_when_non_nil_and_transformation_succeeds()
    throws
  {
    // Given
    let optional: String? = "Hello"

    // When
    let result = optional.transform(sync_transformer_optional)

    // Then
    #expect(result == 5)
  }

  @Test("transform(_:) with optional returning transformer returns nil when transformation fails")
  func transform_optional_returns_nil_when_transformation_fails() throws {
    // Given
    let optional: String? = ""

    // When
    let result = optional.transform(sync_transformer_optional)

    // Then
    #expect(result == nil)
  }

  @Test("transform(_:) with optional returning transformer returns nil when optional is nil")
  func transform_optional_returns_nil_when_optional_is_nil() throws {
    // Given
    let optional: String? = .none

    // When
    let result = optional.transform(sync_transformer_optional)

    // Then
    #expect(result == nil)
  }

  // MARK: - Async Transform Tests

  @Test("transform(_:) with async transformer returns transformed value when non-nil")
  func transform_async_returns_transformed_value_when_non_nil() async throws {
    // Given
    let optional: Int? = 21

    // When
    let result = await optional.transform(async_transformer)

    // Then
    #expect(result == "42")
  }

  @Test("transform(_:) with async transformer returns nil when optional is nil")
  func transform_async_returns_nil_when_optional_is_nil() async throws {
    // Given
    let optional: Int? = .none

    // When
    let result = await optional.transform(async_transformer)

    // Then
    #expect(result == nil)
  }

  // MARK: - Async Optional-Returning Transform Tests

  @Test(
    "transform(_:) with async optional returning transformer returns transformed value when non-nil and transformation succeeds"
  )
  func transform_async_optional_returns_transformed_value_when_non_nil_and_transformation_succeeds()
    async throws
  {
    // Given
    let optional: Int? = 21

    // When
    let result = await optional.transform(async_transformer_optional)

    // Then
    #expect(result == "42")
  }

  @Test(
    "transform(_:) with async optional returning transformer returns nil when transformation fails")
  func transform_async_optional_returns_nil_when_transformation_fails() async throws {
    // Given
    let optional: Int? = 0

    // When
    let result = await optional.transform(async_transformer_optional)

    // Then
    #expect(result == nil)
  }

  @Test("transform(_:) with async optional returning transformer returns nil when optional is nil")
  func transform_async_optional_returns_nil_when_optional_is_nil() async throws {
    // Given
    let optional: Int? = .none

    // When
    let result = await optional.transform(async_transformer_optional)

    // Then
    #expect(result == nil)
  }
}
