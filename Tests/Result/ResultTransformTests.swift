// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import Testing

@testable import Folklore

@Suite("Folklore/Result: Transform")
struct ResultTransformTests {
  // Custom error type for testing
  enum TestError: Error, Equatable {
    case expected
    case other
  }

  // Test helpers and values
  private func sync_transformer(_ value: String) -> Int { value.count }
  private func sync_result_transformer(_ value: Int) -> Result<String, TestError> {
    value > 0 ? .success(String(value * 2)) : .failure(.expected)
  }
  private func async_transformer(_ value: Int) async -> String { String(value * 2) }
  private func async_result_transformer(_ value: Int) async -> Result<String, TestError> {
    value > 0 ? .success(String(value * 2)) : .failure(.expected)
  }

  // MARK: - Transform Tests

  @Test("transform(_:) returns transformed value when success")
  func transform_returns_transformed_value_when_success() throws {
    // Given
    let result: Result<String, TestError> = .success("Hello")

    // When
    let transformed_result = result.transform(sync_transformer)

    // Then
    if case .success(let value) = transformed_result {
      #expect(value == 5)
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("transform(_:) forwards error when failure")
  func transform_forwards_error_when_failure() throws {
    // Given
    let error = TestError.expected
    let result: Result<String, TestError> = .failure(error)

    // When
    let transformed_result = result.transform(sync_transformer)

    // Then
    if case .failure(let transformed_error) = transformed_result {
      #expect(transformed_error == error)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }

  // MARK: - Flatmap Transform Tests

  @Test(
    "transform(_:) with result returning transformer returns transformed result when success and transformation succeeds"
  )
  func transform_result_returns_transformed_result_when_success_and_transformation_succeeds() throws
  {
    // Given
    let result: Result<Int, TestError> = .success(42)

    // When
    let transformed_result = result.transform(sync_result_transformer)

    // Then
    if case .success(let value) = transformed_result {
      #expect(value == "84")
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test(
    "transform(_:) with result returning transformer returns failure when success but transformation fails"
  )
  func transform_result_returns_failure_when_success_but_transformation_fails() throws {
    // Given
    let result: Result<Int, TestError> = .success(0)  // Will cause transformer to return failure

    // When
    let transformed_result = result.transform(sync_result_transformer)

    // Then
    if case .failure(let error) = transformed_result {
      #expect(error == .expected)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }

  @Test("transform(_:) with result returning transformer forwards error when failure")
  func transform_result_forwards_error_when_failure() throws {
    // Given
    let error = TestError.other
    let result: Result<Int, TestError> = .failure(error)

    // When
    let transformed_result = result.transform(sync_result_transformer)

    // Then
    if case .failure(let transformed_error) = transformed_result {
      #expect(transformed_error == error)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }

  // MARK: - Async Transform Tests

  @Test("transform(_:) with async transformer returns transformed value when success")
  func transform_async_returns_transformed_value_when_success() async throws {
    // Given
    let result: Result<Int, TestError> = .success(21)

    // When
    let transformed_result = await result.transform(async_transformer)

    // Then
    if case .success(let value) = transformed_result {
      #expect(value == "42")
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("transform(_:) with async transformer forwards error when failure")
  func transform_async_forwards_error_when_failure() async throws {
    // Given
    let error = TestError.expected
    let result: Result<Int, TestError> = .failure(error)

    // When
    let transformed_result = await result.transform(async_transformer)

    // Then
    if case .failure(let transformed_error) = transformed_result {
      #expect(transformed_error == error)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }

  // MARK: - Async Flatmap Transform Tests

  @Test(
    "transform(_:) with async result returning transformer returns transformed result when success and transformation succeeds"
  )
  func transform_async_result_returns_transformed_result_when_success_and_transformation_succeeds()
    async throws
  {
    // Given
    let result: Result<Int, TestError> = .success(21)

    // When
    let transformed_result = await result.transform(async_result_transformer)

    // Then
    if case .success(let value) = transformed_result {
      #expect(value == "42")
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test(
    "transform(_:) with async result returning transformer returns failure when success but transformation fails"
  )
  func transform_async_result_returns_failure_when_success_but_transformation_fails() async throws {
    // Given
    let result: Result<Int, TestError> = .success(0)  // Will cause transformer to return failure

    // When
    let transformed_result = await result.transform(async_result_transformer)

    // Then
    if case .failure(let error) = transformed_result {
      #expect(error == .expected)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }

  @Test("transform(_:) with async result returning transformer forwards error when failure")
  func transform_async_result_forwards_error_when_failure() async throws {
    // Given
    let error = TestError.other
    let result: Result<Int, TestError> = .failure(error)

    // When
    let transformed_result = await result.transform(async_result_transformer)

    // Then
    if case .failure(let transformed_error) = transformed_result {
      #expect(transformed_error == error)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }
}
