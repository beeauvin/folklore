// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

// swift-tools-version: 6.0

import PackageDescription

let package = Package(
  name: "Folklore",
  platforms: [
    .macOS(.v10_15),
    .iOS(.v13),
    .tvOS(.v13),
    .visionOS(.v1),
    .watchOS(.v6),
  ],
  products: [
    .library(name: "Folklore", targets: ["Folklore"])
  ],
  targets: [
    .target(name: "Folklore", path: "Source"),
    .testTarget(name: "FolkloreTests", dependencies: ["Folklore"], path: "Tests"),
  ]
)
