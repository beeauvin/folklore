// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import Testing

@testable import Folklore

@Suite("Folklore/Result: Otherwise")
struct ResultOtherwiseTests {
  // Custom error type for testing
  enum TestError: Error, Equatable {
    case expected
    case other
  }

  // Test helpers and values
  private let default_value: String = "Default"
  private func sync_provider() -> Int { 99 }
  private func sync_error_provider(_ error: TestError) -> Int {
    return error == .expected ? 42 : 24
  }
  private func async_provider() async -> Double { 2.71 }
  private func async_error_provider(_ error: TestError) async -> Double {
    return error == .expected ? 3.14 : 1.618
  }

  // MARK: - Otherwise Value Tests

  @Test("otherwise(_:) returns success value when success")
  func otherwise_returns_success_value_when_success() throws {
    // Given
    let result: Result<String, TestError> = .success("Success")

    // When
    let value = result.otherwise(default_value)

    // Then
    #expect(value == "Success")
  }

  @Test("otherwise(_:) returns default value when failure")
  func otherwise_returns_default_value_when_failure() throws {
    // Given
    let result: Result<String, TestError> = .failure(.expected)

    // When
    let value = result.otherwise(default_value)

    // Then
    #expect(value == "Default")
  }

  // MARK: - Otherwise Provider Tests

  @Test("otherwise(provider:) returns success value when success")
  func otherwise_provider_returns_success_value_when_success() throws {
    // Given
    let result: Result<Int, TestError> = .success(42)

    // When
    let value = result.otherwise(sync_provider)

    // Then
    #expect(value == 42)
  }

  @Test("otherwise(provider:) evaluates and returns provider result when failure")
  func otherwise_provider_evaluates_and_returns_provider_result_when_failure() throws {
    // Given
    let result: Result<Int, TestError> = .failure(.expected)

    // When
    let value = result.otherwise(sync_provider)

    // Then
    #expect(value == 99)
  }

  // MARK: - Otherwise Provider with Error Tests

  @Test("otherwise(error_provider:) returns success value when success")
  func otherwise_error_provider_returns_success_value_when_success() throws {
    // Given
    let result: Result<Int, TestError> = .success(42)

    // When
    let value = result.otherwise(sync_error_provider)

    // Then
    #expect(value == 42)
  }

  @Test("otherwise(error_provider:) evaluates with error and returns provider result when failure")
  func otherwise_error_provider_evaluates_with_error_and_returns_provider_result_when_failure()
    throws
  {
    // Given
    let result: Result<Int, TestError> = .failure(.expected)

    // When
    let value = result.otherwise(sync_error_provider)

    // Then
    #expect(value == 42)
  }

  @Test("otherwise(error_provider:) passes the correct error to the provider")
  func otherwise_error_provider_passes_correct_error_to_provider() throws {
    // Given
    let result: Result<Int, TestError> = .failure(.other)

    // When
    let value = result.otherwise(sync_error_provider)

    // Then
    #expect(value == 24)  // Value specific to the .other error case
  }

  // MARK: - Async Otherwise Provider Tests

  @Test("otherwise(async_provider:) returns success value when success")
  func otherwise_async_provider_returns_success_value_when_success() async throws {
    // Given
    let result: Result<Double, TestError> = .success(1.23)

    // When
    let value = await result.otherwise(async_provider)

    // Then
    #expect(value == 1.23)
  }

  @Test("otherwise(async_provider:) awaits and returns provider result when failure")
  func otherwise_async_provider_awaits_and_returns_provider_result_when_failure() async throws {
    // Given
    let result: Result<Double, TestError> = .failure(.expected)

    // When
    let value = await result.otherwise(async_provider)

    // Then
    #expect(value == 2.71)
  }

  // MARK: - Async Otherwise Provider with Error Tests

  @Test("otherwise(async_error_provider:) returns success value when success")
  func otherwise_async_error_provider_returns_success_value_when_success() async throws {
    // Given
    let result: Result<Double, TestError> = .success(1.23)

    // When
    let value = await result.otherwise(async_error_provider)

    // Then
    #expect(value == 1.23)
  }

  @Test(
    "otherwise(async_error_provider:) awaits with error and returns provider result when failure")
  func otherwise_async_error_provider_awaits_with_error_and_returns_provider_result_when_failure()
    async throws
  {
    // Given
    let result: Result<Double, TestError> = .failure(.expected)

    // When
    let value = await result.otherwise(async_error_provider)

    // Then
    #expect(value == 3.14)
  }

  @Test("otherwise(async_error_provider:) passes the correct error to the provider")
  func otherwise_async_error_provider_passes_correct_error_to_provider() async throws {
    // Given
    let result: Result<Double, TestError> = .failure(.other)

    // When
    let value = await result.otherwise(async_error_provider)

    // Then
    #expect(value == 1.618)  // Value specific to the .other error case
  }
}
