# Generative Utils

A collection of utility functions for generative art, designed to work with SVG.JS and other SVG-based drawing libraries.

## Installation

```bash
npm install @johnfmorton/generative-utils
```

## Quick Example

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, spline } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

// Seed for reproducible results
seedPRNG('my-artwork')

// Generate random control points
const points = []
for (let i = 0; i < 6; i++) {
  points.push({
    x: 50 + i * 60,
    y: random(100, 300)
  })
}

// Draw smooth curve through points
svg.path(spline(points, 0.5))
  .fill('none')
  .stroke({ color: '#264653', width: 3 })
```

## Available Functions

### Random Number Generation

| Function | Description |
|----------|-------------|
| `seedPRNG` | Seed the random number generator for reproducibility |
| `random` | Generate random values or select from arrays |
| `randomBias` | Generate values biased toward a target |
| `randomSnap` | Generate values snapped to intervals |

### Geometry & Shapes

| Function | Description |
|----------|-------------|
| `spline` | Create smooth Catmull-Rom spline paths |
| `polygon` | Generate regular polygon vertices (triangle, hexagon, etc.) |
| `star` | Generate star polygon vertices |
| `pointsToPath` | Convert point array to SVG path string |
| `createVoronoiDiagram` | Generate Voronoi tessellations with Lloyd relaxation |
| `createQtGrid` | Create quadtree-based adaptive grids |
| `poissonDisc` | Generate evenly-distributed points via Poisson disc sampling |

### Noise & Flow Fields

| Function | Description |
|----------|-------------|
| `createNoiseGrid` | Create simplex noise grids for flow fields |

### Math Utilities

| Function | Description |
|----------|-------------|
| `map` | Re-map a number from one range to another |
| `lerp` | Linear interpolation between two values |
| `clamp` | Constrain a value within a range |
| `distToSegment` | Calculate point-to-line-segment distance |

### 2D Vector Operations (`vec2`)

| Function | Description |
|----------|-------------|
| `vec2.create` | Create a new 2D vector |
| `vec2.add` / `subtract` | Vector addition and subtraction |
| `vec2.multiply` / `divide` | Scalar multiplication and division |
| `vec2.magnitude` | Calculate vector length |
| `vec2.normalize` | Normalize to unit length |
| `vec2.distance` | Distance between two points |
| `vec2.dot` / `cross` | Dot and cross products |
| `vec2.rotate` / `rotateAround` | Rotate vectors |
| `vec2.lerp` | Linear interpolation between vectors |
| `vec2.angle` / `angleBetween` | Calculate angles |
| `vec2.fromAngle` | Create vector from angle |
| `vec2.reflect` | Reflect vector off a surface |
| `vec2.limit` / `setMagnitude` | Constrain or set vector length |

### SVG Utilities

| Function | Description |
|----------|-------------|
| `pointsInPath` | Extract evenly-spaced points along SVG paths |
| `createCoordsTransformer` | Transform mouse coordinates to SVG space |

## Documentation

Full documentation with examples is available in the [docs](./docs) folder.

## Acknowledgments

This project is based on [generative-utils](https://github.com/georgedoescode/generative-utils) by [George Francis](https://github.com/georgedoescode). The original library provided the foundation for these utilities. This fork includes bug fixes, documentation, and continued development.

## License

MIT
