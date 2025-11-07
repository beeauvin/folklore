// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import Testing

@testable import Folklore

@Suite("Folklore/Result: Reframe")
struct ResultReframeTests {
  // Custom error types for testing
  enum TestError: Error, Equatable {
    case expected
    case other
  }

  enum OtherError: Error, Equatable {
    case transformed
    case different
  }

  // Test helpers and values
  private func error_transformer(_ error: TestError) -> OtherError {
    return error == .expected ? .transformed : .different
  }

  private func error_result_transformer(_ error: TestError) -> Result<String, OtherError> {
    return error == .expected ? .success("Recovered") : .failure(.different)
  }

  private func async_error_transformer(_ error: TestError) async -> OtherError {
    return error == .expected ? .transformed : .different
  }

  private func async_error_result_transformer(_ error: TestError) async -> Result<
    String, OtherError
  > {
    return error == .expected ? .success("Recovered") : .failure(.different)
  }

  // MARK: - Reframe Tests

  @Test("reframe(_:) returns success unchanged when success")
  func reframe_returns_success_unchanged_when_success() throws {
    // Given
    let result: Result<String, TestError> = .success("Value")

    // When
    let reframed = result.reframe(error_transformer)

    // Then
    if case .success(let value) = reframed {
      #expect(value == "Value")
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("reframe(_:) transforms error when failure")
  func reframe_transforms_error_when_failure() throws {
    // Given
    let result: Result<String, TestError> = .failure(.expected)

    // When
    let reframed = result.reframe(error_transformer)

    // Then
    if case .failure(let error) = reframed {
      #expect(error == .transformed)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }

  @Test("reframe(_:) passes the correct error to the transformer")
  func reframe_passes_correct_error_to_transformer() throws {
    // Given
    let result: Result<String, TestError> = .failure(.other)

    // When
    let reframed = result.reframe(error_transformer)

    // Then
    if case .failure(let error) = reframed {
      #expect(error == .different)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }

  // MARK: - Reframe with Result Tests

  @Test("reframe(_:) with result returning transformer returns success unchanged when success")
  func reframe_with_result_returns_success_unchanged_when_success() throws {
    // Given
    let result: Result<String, TestError> = .success("Original")

    // When
    let reframed = result.reframe(error_result_transformer)

    // Then
    if case .success(let value) = reframed {
      #expect(value == "Original")
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("reframe(_:) with result returning transformer can convert failure to success")
  func reframe_with_result_can_convert_failure_to_success() throws {
    // Given
    let result: Result<String, TestError> = .failure(.expected)

    // When
    let reframed = result.reframe(error_result_transformer)

    // Then
    if case .success(let value) = reframed {
      #expect(value == "Recovered")
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("reframe(_:) with result returning transformer can convert to different failure")
  func reframe_with_result_can_convert_to_different_failure() throws {
    // Given
    let result: Result<String, TestError> = .failure(.other)

    // When
    let reframed = result.reframe(error_result_transformer)

    // Then
    if case .failure(let error) = reframed {
      #expect(error == .different)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }

  // MARK: - Async Reframe Tests

  @Test("reframe(_:) with async transformer returns success unchanged when success")
  func reframe_async_returns_success_unchanged_when_success() async throws {
    // Given
    let result: Result<String, TestError> = .success("Value")

    // When
    let reframed = await result.reframe(async_error_transformer)

    // Then
    if case .success(let value) = reframed {
      #expect(value == "Value")
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("reframe(_:) with async transformer transforms error when failure")
  func reframe_async_transforms_error_when_failure() async throws {
    // Given
    let result: Result<String, TestError> = .failure(.expected)

    // When
    let reframed = await result.reframe(async_error_transformer)

    // Then
    if case .failure(let error) = reframed {
      #expect(error == .transformed)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }

  @Test("reframe(_:) with async transformer passes the correct error to the transformer")
  func reframe_async_passes_correct_error_to_transformer() async throws {
    // Given
    let result: Result<String, TestError> = .failure(.other)

    // When
    let reframed = await result.reframe(async_error_transformer)

    // Then
    if case .failure(let error) = reframed {
      #expect(error == .different)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }

  // MARK: - Async Reframe with Result Tests

  @Test(
    "reframe(_:) with async result returning transformer returns success unchanged when success")
  func reframe_async_with_result_returns_success_unchanged_when_success() async throws {
    // Given
    let result: Result<String, TestError> = .success("Original")

    // When
    let reframed = await result.reframe(async_error_result_transformer)

    // Then
    if case .success(let value) = reframed {
      #expect(value == "Original")
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("reframe(_:) with async result returning transformer can convert failure to success")
  func reframe_async_with_result_can_convert_failure_to_success() async throws {
    // Given
    let result: Result<String, TestError> = .failure(.expected)

    // When
    let reframed = await result.reframe(async_error_result_transformer)

    // Then
    if case .success(let value) = reframed {
      #expect(value == "Recovered")
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("reframe(_:) with async result returning transformer can convert to different failure")
  func reframe_async_with_result_can_convert_to_different_failure() async throws {
    // Given
    let result: Result<String, TestError> = .failure(.other)

    // When
    let reframed = await result.reframe(async_error_result_transformer)

    // Then
    if case .failure(let error) = reframed {
      #expect(error == .different)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }
}
