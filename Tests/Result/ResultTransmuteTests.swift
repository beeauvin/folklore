// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import Testing

@testable import Folklore

@Suite("Folklore/Result: Transmute")
struct ResultTransmuteTests {
  // Custom error type for testing
  enum TestError: Error, Equatable {
    case expected
  }

  // MARK: - Transmute to Optional (Success) Tests

  @Test("transmute() returns success value when success")
  func transmute_returns_success_value_when_success() throws {
    // Given
    let result: Result<String, TestError> = .success("Test")

    // When
    let optional = result.transmute()

    // Then
    #expect(optional == "Test")
  }

  @Test("transmute() returns nil when failure")
  func transmute_returns_nil_when_failure() throws {
    // Given
    let result: Result<String, TestError> = .failure(.expected)

    // When
    let optional = result.transmute()

    // Then
    #expect(optional == nil)
  }

  // MARK: - Transmute to Optional (Error) Tests

  @Test("transmute(.error) returns error value when failure")
  func transmute_error_returns_error_value_when_failure() throws {
    // Given
    let result: Result<String, TestError> = .failure(.expected)

    // When
    let optional = result.transmute(.error)

    // Then
    #expect(optional == .expected)
  }

  @Test("transmute(.error) returns nil when success")
  func transmute_error_returns_nil_when_success() throws {
    // Given
    let result: Result<String, TestError> = .success("Test")

    // When
    let optional = result.transmute(.error)

    // Then
    #expect(optional == nil)
  }
}
