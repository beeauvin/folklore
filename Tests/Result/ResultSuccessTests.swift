// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import Testing

@testable import Folklore

@Suite("Folklore/Result: Success")
struct ResultSuccessTests {
  // Custom error type for testing
  enum TestError: Error, Equatable {
    case expected
  }

  // MARK: - Static Success Tests

  @Test("success returns a success result with void value")
  func success_returns_success_result_with_void_value() throws {
    // Given
    let result: Result<Void, TestError> = .success

    // When
    // Nothing to do here, just test the value

    // Then
    if case .success = result {
      #expect(Bool(true))  // Success case confirmed
    } else {
      #expect(Bool(false), "Expected success, got failure")
    }
  }
}
