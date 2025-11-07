// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

/// Target selection for transmuting from Result to Optional.
///
/// Used to specify that the error component of a Result should be preserved
/// when converting to an Optional instead of the default success value.
///
/// ```swift
/// // Convert a Result to an Optional with the success value (default)
/// let success_optional = result.transmute()
///
/// // Convert a Result to an Optional with the error value
/// let error_optional = result.transmute(.error)
/// ```
public enum TransmuteTarget {
  /// Keep the error value when transmuting a Result to an Optional
  case error
}
