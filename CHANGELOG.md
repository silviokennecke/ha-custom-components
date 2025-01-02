# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2025-01-02

### Added

- Public transport card: Added configuration schema to allow card configuration via UI (#14)

### Fixed

- Public transport card: Fixed display issues for the delay and times when using [akloeckner/hacs-hafas](https://github.com/akloeckner/hacs-hafas) (#11)

## [1.1.1]

### Fixed

- Public transport card: Fixed styling issues for connections, causing that the description was not centered if the departure and arrival time did not have the same length (e.g. due to a displayed delay)

## [1.1.0] - 2024-01-20

### Added

- Public transport card: Allow displaying more than the next two connections (#9)

## [1.0.1] - 2023-12-09

### Fixed

- Public transport card: Add spacer if multiple products are used (#6)

## [1.0.0] - 2023-10-19

### Added

- Added public transport card

[unreleased]: https://github.com/silviokennecke/ha-custom-components/compare/1.0.1...HEAD
[1.0.1]: https://github.com/silviokennecke/ha-custom-components/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/silviokennecke/ha-custom-components/releases/tag/1.0.0
