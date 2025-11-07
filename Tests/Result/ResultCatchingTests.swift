// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import Testing

@testable import Folklore

@Suite("Folklore/Result: Catching")
struct ResultCatchingTests {
  // Custom error type for testing
  enum TestError: Error, Equatable {
    case expected
    case other
  }

  // Test helpers
  private func success_function() throws -> String {
    return "Success"
  }

  private func failure_function() throws -> String {
    throw TestError.expected
  }

  private func async_success_function() async throws -> Int {
    return 42
  }

  private func async_failure_function() async throws -> Int {
    throw TestError.expected
  }

  // MARK: - Catching Tests

  @Test("catching(_:) returns success when no error thrown")
  func catching_returns_success_when_no_error_thrown() throws {
    // When
    let result = Result<String, Error>.Catching {
      try success_function()
    }

    // Then
    if case .success(let value) = result {
      #expect(value == "Success")
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("catching(_:) returns failure when error thrown")
  func catching_returns_failure_when_error_thrown() throws {
    // When
    let result = Result<String, Error>.Catching {
      try failure_function()
    }

    // Then
    if case .failure(let error) = result {
      #expect(error as? TestError == .expected)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }

  // MARK: - Async Catching Tests

  @Test("catching(_:) with async returns success when no error thrown")
  func catching_async_returns_success_when_no_error_thrown() async throws {
    // When
    let result = await Result<Int, Error>.Catching {
      try await async_success_function()
    }

    // Then
    if case .success(let value) = result {
      #expect(value == 42)
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("catching(_:) with async returns failure when error thrown")
  func catching_async_returns_failure_when_error_thrown() async throws {
    // When
    let result = await Result<Int, Error>.Catching {
      try await async_failure_function()
    }

    // Then
    if case .failure(let error) = result {
      #expect(error as? TestError == .expected)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }
}
