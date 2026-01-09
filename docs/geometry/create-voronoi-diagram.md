# createVoronoiDiagram

Create Voronoi tessellations with Lloyd relaxation.

## Description

`createVoronoiDiagram` generates a Voronoi tessellation from a set of seed points, dividing a rectangular area into cells where each cell contains all points closest to its seed. The function applies Lloyd relaxation to create more evenly distributed, organic-looking cells. Each cell includes its vertices, centroid, inner circle radius, and references to neighboring cells.

## Syntax

```javascript
createVoronoiDiagram(options)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options.width` | `number` | `1024` | Width of the diagram area |
| `options.height` | `number` | `1024` | Height of the diagram area |
| `options.points` | `Array<{x, y}>` | `[]` | Seed points with x and y properties |
| `options.relaxIterations` | `number` | `8` | Number of Lloyd relaxation iterations |

## Return Value

| Type | Description |
|------|-------------|
| `object` | Object containing `cells` array and `points` array |

### Return Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `cells` | `Array` | Array of cell objects |
| `points` | `Array<{x, y}>` | Relaxed seed points after iterations |

### Cell Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `points` | `Array<[x, y]>` | Vertices of the cell polygon |
| `centroid` | `{x, y}` | Center point of the cell |
| `innerCircleRadius` | `number` | Radius of largest circle fitting inside cell |
| `neighbors` | `Array` | References to adjacent cell objects |

## Examples

### Basic Voronoi Pattern

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, createVoronoiDiagram } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('basic-voronoi')

// Generate random seed points
const points = []
for (let i = 0; i < 20; i++) {
  points.push({
    x: random(0, 400),
    y: random(0, 400)
  })
}

const diagram = createVoronoiDiagram({
  width: 400,
  height: 400,
  points,
  relaxIterations: 4
})

// Draw each cell
diagram.cells.forEach(cell => {
  const pathData = cell.points.map((p, i) =>
    (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]
  ).join('') + 'Z'

  svg.path(pathData)
    .fill(random(['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']))
    .stroke({ color: '#fff', width: 2 })
})
```

### Using Centroids for Labels

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, createVoronoiDiagram } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('centroid-labels')

const points = []
for (let i = 0; i < 12; i++) {
  points.push({
    x: random(50, 350),
    y: random(50, 350)
  })
}

const diagram = createVoronoiDiagram({
  width: 400,
  height: 400,
  points,
  relaxIterations: 6
})

diagram.cells.forEach((cell, index) => {
  // Draw cell
  const pathData = cell.points.map((p, i) =>
    (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]
  ).join('') + 'Z'

  svg.path(pathData)
    .fill('#f8f9fa')
    .stroke({ color: '#264653', width: 1 })

  // Add label at centroid
  svg.text(String(index + 1))
    .center(cell.centroid.x, cell.centroid.y)
    .font({ size: 14, family: 'sans-serif', weight: 'bold' })
    .fill('#264653')
})
```

### Inner Circle Visualization

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, createVoronoiDiagram } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('inner-circles')

const points = []
for (let i = 0; i < 15; i++) {
  points.push({
    x: random(50, 350),
    y: random(50, 350)
  })
}

const diagram = createVoronoiDiagram({
  width: 400,
  height: 400,
  points,
  relaxIterations: 8
})

diagram.cells.forEach(cell => {
  // Draw cell outline
  const pathData = cell.points.map((p, i) =>
    (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]
  ).join('') + 'Z'

  svg.path(pathData)
    .fill('none')
    .stroke({ color: '#264653', width: 1 })

  // Draw inscribed circle using innerCircleRadius
  svg.circle(cell.innerCircleRadius * 2)
    .center(cell.centroid.x, cell.centroid.y)
    .fill('#2a9d8f')
    .opacity(0.6)
})
```

### Relaxation Comparison

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, createVoronoiDiagram } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 800, 400)

// Same seed points, different relaxation
const basePoints = []
seedPRNG('relaxation-comparison')
for (let i = 0; i < 20; i++) {
  basePoints.push({
    x: random(0, 400),
    y: random(0, 400)
  })
}

const iterations = [0, 8]

iterations.forEach((relaxIterations, col) => {
  const xOffset = col * 400

  const diagram = createVoronoiDiagram({
    width: 400,
    height: 400,
    points: basePoints.map(p => ({ ...p })),
    relaxIterations
  })

  diagram.cells.forEach(cell => {
    const pathData = cell.points.map((p, i) =>
      (i === 0 ? 'M' : 'L') + (p[0] + xOffset) + ',' + p[1]
    ).join('') + 'Z'

    svg.path(pathData)
      .fill('#e9c46a')
      .stroke({ color: '#264653', width: 1 })
  })

  svg.text(`relaxIterations: ${relaxIterations}`)
    .move(xOffset + 10, 380)
    .font({ size: 12, family: 'monospace' })
})
```

### Using Neighbors for Effects

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, createVoronoiDiagram } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('neighbor-effect')

const points = []
for (let i = 0; i < 25; i++) {
  points.push({
    x: random(20, 380),
    y: random(20, 380)
  })
}

const diagram = createVoronoiDiagram({
  width: 400,
  height: 400,
  points,
  relaxIterations: 5
})

// Color cells based on number of neighbors
diagram.cells.forEach(cell => {
  const pathData = cell.points.map((p, i) =>
    (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]
  ).join('') + 'Z'

  const neighborCount = cell.neighbors.length
  const lightness = 30 + neighborCount * 8  // More neighbors = lighter

  svg.path(pathData)
    .fill(`hsl(200, 50%, ${lightness}%)`)
    .stroke({ color: '#fff', width: 1 })
})
```

## Notes

- Lloyd relaxation moves each seed point toward its cell's centroid, creating more uniform cells
- Higher `relaxIterations` values produce more regular, hexagon-like cells
- Setting `relaxIterations` to 0 gives raw Voronoi cells without smoothing
- The `innerCircleRadius` is useful for placing elements that fit within cells
- Cell `points` are ordered for polygon rendering (can be used directly in SVG polygon/path)
- The returned `points` array contains the relaxed positions, not the original input

## See Also

- [createQtGrid](create-qt-grid.md) - Alternative spatial partitioning
- [spline](spline.md) - Create smooth curves through cell vertices
