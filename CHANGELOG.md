# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-01-10

### Fixed

- **createVoronoiDiagram**: Use correct point index (`i >> 1`) for neighbors lookup instead of flat array index
- **createVoronoiDiagram**: Correctly map neighbor references after filtering null cells using a Map
- **createVoronoiDiagram**: Check all polygon edges including closing edge for inner circle radius calculation
- **createNoiseGrid**: Use `Math.floor` instead of `Math.round` for array indexing to prevent off-by-one errors
- **createNoiseGrid**: Remove boundary check that caused sparse arrays with undefined elements
- **pointsInPath**: Handle edge cases when `numPoints` is less than or equal to 1
- **map**: Handle division by zero when input range has zero width (`start1 === end1`)
- **createCoordsTransformer**: Handle null return from `getScreenCTM()` when SVG is not rendered

### Added

- **lerp**: Linear interpolation between two values
- **clamp**: Constrain a value within a range (min/max bounds)
- **vec2**: Complete 2D vector operations library with 20+ functions:
  - `create`, `add`, `subtract`, `multiply`, `divide`
  - `magnitude`, `magnitudeSquared`, `normalize`
  - `distance`, `distanceSquared`
  - `dot`, `cross`
  - `rotate`, `rotateAround`
  - `lerp` (exported as `vecLerp`), `angle`, `angleBetween`, `fromAngle`
  - `perpendicular`, `reflect`, `limit`, `setMagnitude`
- **polygon**: Generate regular polygon vertices with configurable sides, radius, center, and rotation
- **star**: Generate star polygon vertices with configurable points, inner/outer radii, center, and rotation
- **pointsToPath**: Convert an array of points to an SVG path string
- **poissonDisc**: Poisson disc sampling using Bridson's algorithm for evenly-distributed point generation
- **createVoronoiDiagram**: New `relaxationFactor` option (default: 0.5) for controlling Lloyd's relaxation convergence speed
- **spline**: New `segmentCount` parameter (default: 20) for controlling curve smoothness

### Documentation

- Added JSDoc type annotations to all utility functions for better IDE support and type hints

### Changed

- **random**: Refactored to use explicit function parameters instead of `arguments` object for better performance and IDE support
- **random**: Renamed third parameter from `clamp` to `toInteger` for clarity (behavior unchanged)
- **createVoronoiDiagram**: Removed unnecessary radian-to-degree conversion in angle sorting for better performance

## [1.0.39] and earlier

- Initial releases with core generative art utilities
