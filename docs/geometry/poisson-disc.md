# poissonDisc

Generate evenly-distributed points using Poisson disc sampling.

## Description

`poissonDisc` creates a set of points where no two points are closer than a specified minimum distance, producing natural-looking, organic distributions. Unlike purely random placement, Poisson disc sampling avoids both clustering and regular grid patterns, making it ideal for natural scatter effects, stippling, object placement, and texture generation.

The implementation uses Bridson's algorithm for efficient O(n) performance.

## Syntax

```javascript
poissonDisc({ width, height, radius, maxAttempts? })
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | `number` | `100` | Width of the sampling area |
| `height` | `number` | `100` | Height of the sampling area |
| `radius` | `number` | `10` | Minimum distance between any two points |
| `maxAttempts` | `number` | `30` | Number of attempts to place each new point before giving up |

## Return Value

| Type | Description |
|------|-------------|
| `Array<{x, y}>` | Array of sample points within the specified area |

## Examples

### Basic Distribution

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, poissonDisc } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('poisson-basic')

const points = poissonDisc({
  width: 400,
  height: 400,
  radius: 20
})

points.forEach(point => {
  svg.circle(6)
    .center(point.x, point.y)
    .fill('#264653')
})
```

### Comparison: Random vs Poisson

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, poissonDisc } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 800, 400)

// Left side: pure random
seedPRNG('comparison')

for (let i = 0; i < 200; i++) {
  svg.circle(4)
    .center(random(0, 400), random(0, 400))
    .fill('#e63946')
}

// Divider
svg.line(400, 0, 400, 400).stroke({ color: '#ccc', width: 2 })

// Right side: Poisson disc
seedPRNG('comparison')  // Reset seed for fair comparison

const poissonPoints = poissonDisc({
  width: 400,
  height: 400,
  radius: 25
})

poissonPoints.forEach(point => {
  svg.circle(4)
    .center(point.x + 400, point.y)  // Offset to right side
    .fill('#2a9d8f')
})

// Labels
svg.text('Random').move(180, 380).font({ size: 14 })
svg.text('Poisson Disc').move(560, 380).font({ size: 14 })
```

### Variable Circle Sizes

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, poissonDisc, map } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('variable-sizes')

// Use larger radius to leave room for varying sizes
const points = poissonDisc({
  width: 400,
  height: 400,
  radius: 35
})

points.forEach(point => {
  // Size based on distance from center
  const dx = point.x - 200
  const dy = point.y - 200
  const dist = Math.sqrt(dx * dx + dy * dy)

  const size = map(dist, 0, 280, 25, 8)
  const hue = map(dist, 0, 280, 200, 280)

  svg.circle(size)
    .center(point.x, point.y)
    .fill(`hsl(${hue}, 60%, 50%)`)
})
```

### Stippling Effect

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, poissonDisc, createNoiseGrid, map } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('stippling')

// Generate dense point distribution
const points = poissonDisc({
  width: 400,
  height: 400,
  radius: 8
})

// Use noise to vary dot visibility (stippling effect)
const noiseGrid = createNoiseGrid({
  width: 400,
  height: 400,
  resolution: 40,
  seed: 'stipple-noise'
})

points.forEach(point => {
  const cell = noiseGrid.lookup({ x: point.x, y: point.y })
  if (!cell) return

  // Only draw dots where noise is above threshold
  if (cell.noiseValue > -0.2) {
    const size = map(cell.noiseValue, -0.2, 1, 1, 4)
    svg.circle(size)
      .center(point.x, point.y)
      .fill('#264653')
  }
})
```

### Tree/Forest Placement

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, poissonDisc } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('forest')

// Background
svg.rect(400, 400).fill('#90b77d')

// Generate tree positions
const trees = poissonDisc({
  width: 400,
  height: 400,
  radius: 30
})

// Sort by y for depth (draw back to front)
trees.sort((a, b) => a.y - b.y)

trees.forEach(point => {
  const size = random(15, 25)
  const shade = random(25, 45)

  // Simple tree: circle on a line
  svg.line(point.x, point.y, point.x, point.y + size * 0.6)
    .stroke({ color: '#5c4033', width: 3 })

  svg.circle(size)
    .center(point.x, point.y)
    .fill(`hsl(120, 40%, ${shade}%)`)
})
```

### Dot Pattern with Exclusion Zone

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, poissonDisc } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('exclusion')

const points = poissonDisc({
  width: 400,
  height: 400,
  radius: 15
})

// Define exclusion circle
const excludeX = 200
const excludeY = 200
const excludeRadius = 80

// Draw exclusion zone
svg.circle(excludeRadius * 2)
  .center(excludeX, excludeY)
  .fill('none')
  .stroke({ color: '#ccc', width: 2, dasharray: '5,5' })

// Draw points, filtering out those in exclusion zone
points.forEach(point => {
  const dx = point.x - excludeX
  const dy = point.y - excludeY
  const dist = Math.sqrt(dx * dx + dy * dy)

  if (dist > excludeRadius) {
    svg.circle(5)
      .center(point.x, point.y)
      .fill('#457b9d')
  }
})
```

### Different Densities

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, poissonDisc } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 600, 200)

const radii = [10, 20, 40]
const colors = ['#e63946', '#457b9d', '#2a9d8f']

radii.forEach((radius, i) => {
  seedPRNG(`density-${i}`)

  const points = poissonDisc({
    width: 200,
    height: 200,
    radius
  })

  const offsetX = i * 200

  points.forEach(point => {
    svg.circle(radius * 0.3)
      .center(point.x + offsetX, point.y)
      .fill(colors[i])
  })

  svg.text(`radius: ${radius}`)
    .move(offsetX + 70, 185)
    .font({ size: 12, family: 'monospace' })
})
```

### Organic Shape Fill

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, poissonDisc, spline } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('shape-fill')

// Create an organic blob shape
const blobPoints = []
const numPoints = 8
const centerX = 200
const centerY = 200

for (let i = 0; i < numPoints; i++) {
  const angle = (i / numPoints) * Math.PI * 2
  const radius = 120 + Math.sin(angle * 3) * 30
  blobPoints.push({
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius
  })
}

const blobPath = spline(blobPoints, 0.5, true)

// Draw blob outline
svg.path(blobPath)
  .fill('none')
  .stroke({ color: '#264653', width: 2 })

// Generate points and filter to those inside blob
const allPoints = poissonDisc({
  width: 400,
  height: 400,
  radius: 12
})

// Simple point-in-polygon check using SVG
const pathElement = svg.path(blobPath).fill('#fff').opacity(0)
const pathNode = pathElement.node

allPoints.forEach(point => {
  // Check if point is inside blob (approximate with distance from center)
  const dx = point.x - centerX
  const dy = point.y - centerY
  const angle = Math.atan2(dy, dx)
  const distFromCenter = Math.sqrt(dx * dx + dy * dy)
  const blobRadius = 120 + Math.sin(angle * 3) * 30

  if (distFromCenter < blobRadius * 0.9) {
    svg.circle(4)
      .center(point.x, point.y)
      .fill('#2a9d8f')
  }
})

pathElement.remove()
```

### Hexagonal-ish Pattern

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, poissonDisc, polygon, pointsToPath } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('hex-pattern')

const points = poissonDisc({
  width: 400,
  height: 400,
  radius: 40
})

points.forEach((point, i) => {
  const hex = polygon({
    sides: 6,
    radius: 18,
    cx: point.x,
    cy: point.y,
    rotation: Math.PI / 6
  })

  const hue = (i * 15) % 360

  svg.path(pointsToPath(hex))
    .fill(`hsl(${hue}, 50%, 60%)`)
    .stroke({ color: '#fff', width: 1 })
})
```

## Notes

- Uses the shared PRNG from `seedPRNG`, so results are reproducible
- The algorithm guarantees minimum distance but not maximum; points may be farther apart in some areas
- Smaller radius values produce more points but take longer to compute
- Typical radius values range from 5-50 depending on canvas size
- The `maxAttempts` parameter rarely needs adjustment; increase only if seeing gaps
- Memory usage is proportional to the number of points generated
- Point order is based on generation order, not spatial position

## See Also

- [seedPRNG](../random/seed-prng.md) - Seed the random number generator for reproducibility
- [random](../random/random.md) - Simple random point generation
- [createVoronoiDiagram](create-voronoi-diagram.md) - Create Voronoi cells from points
