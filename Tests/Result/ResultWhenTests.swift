// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import Testing

@testable import Folklore

@Suite("Folklore/Result: When")
struct ResultWhenTests {
  // Custom error type for testing
  enum TestError: Error, Equatable {
    case expected
    case other
  }

  // Test closures
  private func something_success<T>(_ value: T) { #expect(Bool(true)) }
  private func something_failure<T>(_ value: T) { #expect(Bool(false)) }
  private func nothing_success(_ error: TestError) { #expect(Bool(true)) }
  private func nothing_failure(_ error: TestError) { #expect(Bool(false)) }

  // Async test closures
  private func async_something_success<T>(_ value: T) async { #expect(Bool(true)) }
  private func async_something_failure<T>(_ value: T) async { #expect(Bool(false)) }
  private func async_nothing_success(_ error: TestError) async { #expect(Bool(true)) }
  private func async_nothing_failure(_ error: TestError) async { #expect(Bool(false)) }

  // MARK: - When Success Tests

  @Test("when(success:) executes action when success")
  func when_success_executes_action_when_success() throws {
    // Given
    let result: Result<String, TestError> = .success("Value")

    // When
    result.when(success: something_success)
  }

  @Test("when(success:) does not execute action when failure")
  func when_success_does_not_execute_action_when_failure() throws {
    // Given
    let result: Result<String, TestError> = .failure(.expected)

    // When
    result.when(success: something_failure)
  }

  @Test("when(success:) returns original result")
  func when_success_returns_original_result() throws {
    // Given
    let original: Result<String, TestError> = .success("Value")

    // When
    let returned = original.when(success: something_success)

    // Then
    #expect(returned == original)
  }

  // MARK: - When Failure Tests

  @Test("when(failure:) executes action when failure")
  func when_failure_executes_action_when_failure() throws {
    // Given
    let result: Result<String, TestError> = .failure(.expected)

    // When
    result.when(failure: nothing_success)
  }

  @Test("when(failure:) does not execute action when success")
  func when_failure_does_not_execute_action_when_success() throws {
    // Given
    let result: Result<String, TestError> = .success("Value")

    // When
    result.when(failure: nothing_failure)
  }

  @Test("when(failure:) returns original result")
  func when_failure_returns_original_result() throws {
    // Given
    let original: Result<String, TestError> = .failure(.expected)

    // When
    let returned = original.when(failure: nothing_success)

    // Then
    #expect(returned == original)
  }

  // MARK: - When Success or Failure Tests

  @Test("when(success:failure:) executes success action when success")
  func when_success_or_failure_executes_success_when_success() throws {
    // Given
    let result: Result<String, TestError> = .success("Value")

    // When
    result.when(success: something_success, failure: nothing_failure)
  }

  @Test("when(success:failure:) executes failure action when failure")
  func when_success_or_failure_executes_failure_when_failure() throws {
    // Given
    let result: Result<String, TestError> = .failure(.expected)

    // When
    result.when(success: something_failure, failure: nothing_success)
  }

  @Test("when(success:failure:) returns original result")
  func when_success_or_failure_returns_original_result() throws {
    // Given
    let original: Result<String, TestError> = .success("Value")

    // When
    let returned = original.when(
      success: something_success,
      failure: nothing_failure
    )

    // Then
    #expect(returned == original)
  }

  // MARK: - Async When Success Tests

  @Test("when(success:) with async action executes action when success")
  func when_success_async_executes_action_when_success() async throws {
    // Given
    let result: Result<Int, TestError> = .success(42)

    // When
    await result.when(success: async_something_success)
  }

  @Test("when(success:) with async action does not execute action when failure")
  func when_success_async_does_not_execute_action_when_failure() async throws {
    // Given
    let result: Result<Int, TestError> = .failure(.expected)

    // When
    await result.when(success: async_something_failure)
  }

  @Test("when(success:) with async action returns original result")
  func when_success_async_returns_original_result() async throws {
    // Given
    let original: Result<Int, TestError> = .success(42)

    // When
    let returned = await original.when(success: async_something_success)

    // Then
    #expect(returned == original)
  }

  // MARK: - Async When Failure Tests

  @Test("when(failure:) with async action executes action when failure")
  func when_failure_async_executes_action_when_failure() async throws {
    // Given
    let result: Result<Int, TestError> = .failure(.expected)

    // When
    await result.when(failure: async_nothing_success)
  }

  @Test("when(failure:) with async action does not execute action when success")
  func when_failure_async_does_not_execute_action_when_success() async throws {
    // Given
    let result: Result<Int, TestError> = .success(42)

    // When
    await result.when(failure: async_nothing_failure)
  }

  @Test("when(failure:) with async action returns original result")
  func when_failure_async_returns_original_result() async throws {
    // Given
    let original: Result<Int, TestError> = .failure(.expected)

    // When
    let returned = await original.when(failure: async_nothing_success)

    // Then
    #expect(returned == original)
  }

  // MARK: - Async When Success or Failure Tests

  @Test("when(success:failure:) with async actions executes success action when success")
  func when_success_or_failure_async_executes_success_when_success() async throws {
    // Given
    let result: Result<Int, TestError> = .success(42)

    // When
    await result.when(
      success: async_something_success,
      failure: async_nothing_failure
    )
  }

  @Test("when(success:failure:) with async actions executes failure action when failure")
  func when_success_or_failure_async_executes_failure_when_failure() async throws {
    // Given
    let result: Result<Int, TestError> = .failure(.expected)

    // When
    await result.when(
      success: async_something_failure,
      failure: async_nothing_success
    )
  }

  @Test("when(success:failure:) with async actions returns original result")
  func when_success_or_failure_async_returns_original_result() async throws {
    // Given
    let original: Result<Int, TestError> = .success(42)

    // When
    let returned = await original.when(
      success: async_something_success,
      failure: async_nothing_success
    )

    // Then
    #expect(returned == original)
  }
}
