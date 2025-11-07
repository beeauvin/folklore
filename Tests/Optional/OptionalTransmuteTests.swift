// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import Testing

@testable import Folklore

@Suite("Folklore/Optional: Transmute")
struct OptionalTransmuteTests {
  // Custom error type for testing
  enum TestError: Error, Equatable {
    case expected
  }

  // MARK: - Transmute to Result Tests

  @Test("transmute(as:) returns success with value when non-nil")
  func transmute_returns_success_with_value_when_non_nil() throws {
    // Given
    let optional: String? = "Test"

    // When
    let result = optional.transmute(as: TestError.expected)

    // Then
    if case .success(let value) = result {
      #expect(value == "Test")
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }

  @Test("transmute(as:) returns failure with error when nil")
  func transmute_returns_failure_with_error_when_nil() throws {
    // Given
    let optional: String? = nil

    // When
    let result = optional.transmute(as: TestError.expected)

    // Then
    if case .failure(let error) = result {
      #expect(error == TestError.expected)
    } else {
      #expect(Bool(false), "Expected failure, got success")
    }
  }
}
