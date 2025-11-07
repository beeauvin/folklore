// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import Testing

@testable import Folklore

@Suite("Folklore/Optional: When")
struct OptionalWhenTests {
  enum TestError: Error {
    case expected
  }

  // Test closures
  private func something_success<T>(_ value: T) { #expect(Bool(true)) }
  private func something_failure<T>(_ value: T) { #expect(Bool(false)) }
  private func nothing_success() { #expect(Bool(true)) }
  private func nothing_failure() { #expect(Bool(false)) }

  // Async test closures
  private func async_something_success<T>(_ value: T) async { #expect(Bool(true)) }
  private func async_something_failure<T>(_ value: T) async { #expect(Bool(false)) }
  private func async_nothing_success() async { #expect(Bool(true)) }
  private func async_nothing_failure() async { #expect(Bool(false)) }

  // MARK: - When Something Tests

  @Test("when(something:) executes action when non-nil")
  func when_something_executes_action_when_non_nil() throws {
    let optional: String? = "Value"
    optional.when(something: something_success)
  }

  @Test("when(something:) does not execute action when nil")
  func when_something_does_not_execute_action_when_nil() throws {
    let optional: String? = .none
    optional.when(something: something_failure)
  }

  // MARK: - When Nothing Tests

  @Test("when(nothing:) executes action when nil")
  func when_nothing_executes_action_when_nil() throws {
    let optional: String? = .none
    optional.when(nothing: nothing_success)
  }

  @Test("when(nothing:) does not execute action when non-nil")
  func when_nothing_does_not_execute_action_when_non_nil() throws {
    let optional: String? = "Value"
    optional.when(nothing: nothing_failure)
  }

  // MARK: - When Something or Nothing Tests

  @Test("when(something:nothing:) executes something action when non-nil")
  func when_something_or_nothing_executes_something_when_non_nil() throws {
    let optional: String? = "Value"
    optional.when(something: something_success, nothing: nothing_failure)
  }

  @Test("when(something:nothing:) executes nothing action when nil")
  func when_something_or_nothing_executes_nothing_when_nil() throws {
    let optional: String? = .none
    optional.when(something: something_failure, nothing: nothing_success)
  }

  // MARK: - Async When Something Tests

  @Test("when(something:) with async action executes action when non-nil")
  func when_something_async_executes_action_when_non_nil() async throws {
    let optional: Int? = 42
    await optional.when(something: async_something_success)
  }

  @Test("when(something:) with async action does not execute action when nil")
  func when_something_async_does_not_execute_action_when_nil() async throws {
    let optional: Int? = .none
    await optional.when(something: async_something_failure)
  }

  // MARK: - Async When Nothing Tests

  @Test("when(nothing:) with async action executes action when nil")
  func when_nothing_async_executes_action_when_nil() async throws {
    let optional: Int? = .none
    await optional.when(nothing: async_nothing_success)
  }

  @Test("when(nothing:) with async action does not execute action when non-nil")
  func when_nothing_async_does_not_execute_action_when_non_nil() async throws {
    let optional: Int? = 42
    await optional.when(nothing: async_nothing_failure)
  }

  // MARK: - Async When Something or Nothing Tests

  @Test("when(something:nothing:) with async actions executes something action when non-nil")
  func when_something_or_nothing_async_executes_something_when_non_nil() async throws {
    let optional: Int? = 42
    await optional.when(something: async_something_success, nothing: async_nothing_failure)
  }

  @Test("when(something:nothing:) with async actions executes nothing action when nil")
  func when_something_or_nothing_async_executes_nothing_when_nil() async throws {
    let optional: Int? = .none
    await optional.when(something: async_something_failure, nothing: async_nothing_success)
  }
}
