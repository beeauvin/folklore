// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import Testing

@testable import Folklore

@Suite("Folklore/Result: Recover")
struct ResultRecoverTests {
  // Custom error types for testing
  enum TestError: Error, Equatable {
    case expected
    case other
  }

  enum OtherError: Error, Equatable {
    case different
    case another
  }

  // Test helpers and values
  private func recovery_succeed(_ error: TestError) -> String? {
    return "Recovered"
  }

  private func recovery_fail(_ error: TestError) -> String? {
    return nil
  }

  private func recovery_with_result(_ error: TestError) -> Result<Int, OtherError> {
    return error == .expected ? .success(42) : .failure(.different)
  }

  private func async_recovery_succeed(_ error: TestError) async -> Double? {
    return 3.14
  }

  private func async_recovery_fail(_ error: TestError) async -> Double? {
    return nil
  }

  private func async_recovery_with_result(_ error: TestError) async -> Result<String, OtherError> {
    return error == .expected ? .success("Recovered") : .failure(.another)
  }

  // MARK: - Recover Tests

  @Test("recover(_:) returns original result when success")
  func recover_returns_original_result_when_success() throws {
    // Given
    let original = Result<String, TestError>.success("Original")

    // When
    let recovered = original.recover(recovery_succeed)

    // Then
    if case .success(let value) = recovered {
      #expect(value == "Original")
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("recover(_:) returns recovered success when failure and recovery succeeds")
  func recover_returns_recovered_success_when_failure_and_recovery_succeeds() throws {
    // Given
    let original = Result<String, TestError>.failure(.expected)

    // When
    let recovered = original.recover(recovery_succeed)

    // Then
    if case .success(let value) = recovered {
      #expect(value == "Recovered")
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("recover(_:) returns original failure when recovery fails")
  func recover_returns_original_failure_when_recovery_fails() throws {
    // Given
    let original = Result<String, TestError>.failure(.expected)

    // When
    let recovered = original.recover(recovery_fail)

    // Then
    if case .failure(let error) = recovered {
      #expect(error == .expected)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }

  // MARK: - Recover with Result Tests

  @Test("recover(_:) with result returns original result when success")
  func recover_with_result_returns_original_result_when_success() throws {
    // Given
    let original = Result<Int, TestError>.success(123)

    // When
    let recovered = original.recover(recovery_with_result)

    // Then
    if case .success(let value) = recovered {
      #expect(value == 123)
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("recover(_:) with result returns recovered success when failure and recovery succeeds")
  func recover_with_result_returns_recovered_success_when_failure_and_recovery_succeeds() throws {
    // Given
    let original = Result<Int, TestError>.failure(.expected)

    // When
    let recovered = original.recover(recovery_with_result)

    // Then
    if case .success(let value) = recovered {
      #expect(value == 42)
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("recover(_:) with result returns new failure when recovery fails")
  func recover_with_result_returns_new_failure_when_recovery_fails() throws {
    // Given
    let original = Result<Int, TestError>.failure(.other)

    // When
    let recovered = original.recover(recovery_with_result)

    // Then
    if case .failure(let error) = recovered {
      #expect(error == .different)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }

  // MARK: - Async Recover Tests

  @Test("recover(_:) with async closure returns original result when success")
  func recover_async_returns_original_result_when_success() async throws {
    // Given
    let original = Result<Double, TestError>.success(2.71)

    // When
    let recovered = await original.recover(async_recovery_succeed)

    // Then
    if case .success(let value) = recovered {
      #expect(value == 2.71)
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test(
    "recover(_:) with async closure returns recovered success when failure and recovery succeeds")
  func recover_async_returns_recovered_success_when_failure_and_recovery_succeeds() async throws {
    // Given
    let original = Result<Double, TestError>.failure(.expected)

    // When
    let recovered = await original.recover(async_recovery_succeed)

    // Then
    if case .success(let value) = recovered {
      #expect(value == 3.14)
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("recover(_:) with async closure returns original failure when recovery fails")
  func recover_async_returns_original_failure_when_recovery_fails() async throws {
    // Given
    let original = Result<Double, TestError>.failure(.expected)

    // When
    let recovered = await original.recover(async_recovery_fail)

    // Then
    if case .failure(let error) = recovered {
      #expect(error == .expected)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }

  // MARK: - Async Recover with Result Tests

  @Test("recover(_:) with async result returns original result when success")
  func recover_async_with_result_returns_original_result_when_success() async throws {
    // Given
    let original = Result<String, TestError>.success("Original")

    // When
    let recovered = await original.recover(async_recovery_with_result)

    // Then
    if case .success(let value) = recovered {
      #expect(value == "Original")
    } else {
      #expect(Bool(false), "Expected success, got success")
    }
  }

  @Test(
    "recover(_:) with async result returns recovered success when failure and recovery succeeds")
  func recover_async_with_result_returns_recovered_success_when_failure_and_recovery_succeeds()
    async throws
  {
    // Given
    let original = Result<String, TestError>.failure(.expected)

    // When
    let recovered = await original.recover(async_recovery_with_result)

    // Then
    if case .success(let value) = recovered {
      #expect(value == "Recovered")
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("recover(_:) with async result returns new failure when recovery fails")
  func recover_async_with_result_returns_new_failure_when_recovery_fails() async throws {
    // Given
    let original = Result<String, TestError>.failure(.other)

    // When
    let recovered = await original.recover(async_recovery_with_result)

    // Then
    if case .failure(let error) = recovered {
      #expect(error == .another)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }
}
