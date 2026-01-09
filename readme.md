# Generative Utils

A collection of utility functions for generative art, designed to work with SVG.JS and other SVG-based drawing libraries.

## Installation

```bash
npm install @georgedoescode/generative-utils
```

## Quick Example

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, spline } from '@georgedoescode/generative-utils'

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

| Function | Description |
|----------|-------------|
| `seedPRNG` | Seed the random number generator for reproducibility |
| `random` | Generate random values or select from arrays |
| `randomBias` | Generate values biased toward a target |
| `randomSnap` | Generate values snapped to intervals |
| `spline` | Create smooth Catmull-Rom spline paths |
| `createVoronoiDiagram` | Generate Voronoi tessellations |
| `createQtGrid` | Create quadtree-based adaptive grids |
| `createNoiseGrid` | Create simplex noise grids for flow fields |
| `pointsInPath` | Extract points along SVG paths |
| `map` | Linear interpolation between ranges |
| `createCoordsTransformer` | Transform screen to SVG coordinates |
| `distToSegment` | Calculate point-to-segment distance |

## Documentation

Full documentation with examples is available in the [docs](./docs) folder.

## Acknowledgments

This project is based on [generative-utils](https://github.com/georgedoescode/generative-utils) by [George Francis](https://github.com/georgedoescode). The original library provided the foundation for these utilities. This fork includes bug fixes, documentation, and continued development.

## License

MIT
