# generative-utils Documentation

A collection of utility functions for generative art, designed to work seamlessly with SVG.JS and other SVG-based drawing libraries.

## Function Categories

### Random Number Generation

Functions for generating seeded, controlled random values. Call `seedPRNG` first to ensure reproducible results.

- [seedPRNG](random/seed-prng.md) - Seed the pseudo-random number generator for reproducibility
- [random](random/random.md) - Generate random values or select random elements from arrays
- [randomBias](random/random-bias.md) - Generate random values biased toward a target
- [randomSnap](random/random-snap.md) - Generate random values snapped to intervals

### Generative Geometry

Functions for creating geometric structures, paths, and spatial partitions.

- [spline](geometry/spline.md) - Generate smooth Catmull-Rom spline paths
- [createVoronoiDiagram](geometry/create-voronoi-diagram.md) - Create Voronoi tessellations with Lloyd relaxation
- [createQtGrid](geometry/create-qt-grid.md) - Create quadtree-based adaptive grids
- [createNoiseGrid](geometry/create-noise-grid.md) - Create simplex noise grids for flow fields
- [pointsInPath](geometry/points-in-path.md) - Extract evenly-spaced points from SVG paths

### Utilities

Helper functions for common generative art tasks.

- [map](utilities/map.md) - Linear interpolation between ranges
- [createCoordsTransformer](utilities/create-coords-transformer.md) - Transform screen coordinates to SVG space
- [distToSegment](utilities/dist-to-segment.md) - Calculate distance from a point to a line segment

## Quick Reference

| Function | Signature |
|----------|-----------|
| `seedPRNG` | `seedPRNG(seed)` |
| `random` | `random(min, max, clamp)` or `random(array)` |
| `randomBias` | `randomBias(min, max, bias, influence)` |
| `randomSnap` | `randomSnap(min, max, snapInc)` |
| `spline` | `spline(points, tension, close, callback)` |
| `createVoronoiDiagram` | `createVoronoiDiagram({ width, height, points, relaxIterations })` |
| `createQtGrid` | `createQtGrid({ width, height, points, gap, maxQtObjects, maxQtLevels })` |
| `createNoiseGrid` | `createNoiseGrid({ width, height, resolution, xInc, yInc, seed })` |
| `pointsInPath` | `pointsInPath(pathElement, numPoints)` |
| `map` | `map(n, start1, end1, start2, end2)` |
| `createCoordsTransformer` | `createCoordsTransformer(svgElement)` |
| `distToSegment` | `distToSegment(point, segmentStart, segmentEnd)` |

## Import Patterns

### ESM (recommended)

```javascript
import {
  seedPRNG,
  random,
  spline,
  createVoronoiDiagram
} from '@georgedoescode/generative-utils'
```

### CommonJS

```javascript
const {
  seedPRNG,
  random,
  spline,
  createVoronoiDiagram
} = require('@georgedoescode/generative-utils')
```
