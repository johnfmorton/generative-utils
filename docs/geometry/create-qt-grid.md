# createQtGrid

Create quadtree-based adaptive grids.

## Description

`createQtGrid` generates a grid that adaptively subdivides based on point density. Areas with more points subdivide into smaller cells, while sparse areas remain larger. This creates organic, data-driven layouts useful for responsive compositions that react to content distribution.

## Syntax

```javascript
createQtGrid(options)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options.width` | `number` | `1024` | Width of the grid area |
| `options.height` | `number` | `1024` | Height of the grid area |
| `options.points` | `Array` | `[]` | Points that drive subdivision |
| `options.gap` | `number` | `0` | Inset applied to each cell on all sides |
| `options.maxQtObjects` | `number` | `10` | Max points per cell before subdivision |
| `options.maxQtLevels` | `number` | `4` | Maximum subdivision depth |

## Return Value

| Type | Description |
|------|-------------|
| `object` | Object containing grid dimensions and areas array |

### Return Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `width` | `number` | Grid width |
| `height` | `number` | Grid height |
| `cols` | `number` | Number of columns at max subdivision (2^maxQtLevels) |
| `rows` | `number` | Number of rows at max subdivision (2^maxQtLevels) |
| `areas` | `Array` | Array of cell area objects |

### Area Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `x` | `number` | X position (with gap applied) |
| `y` | `number` | Y position (with gap applied) |
| `width` | `number` | Width (with gap applied) |
| `height` | `number` | Height (with gap applied) |
| `col.start` | `number` | Starting column index |
| `col.end` | `number` | Ending column index |
| `row.start` | `number` | Starting row index |
| `row.end` | `number` | Ending row index |

## Examples

### Basic Quadtree Grid

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, createQtGrid } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('basic-qtgrid')

// Generate random points to drive subdivision
const points = []
for (let i = 0; i < 50; i++) {
  points.push({
    x: random(0, 400),
    y: random(0, 400)
  })
}

const grid = createQtGrid({
  width: 400,
  height: 400,
  points,
  gap: 2,
  maxQtObjects: 4,
  maxQtLevels: 4
})

// Draw each grid cell
grid.areas.forEach(area => {
  svg.rect(area.width, area.height)
    .move(area.x, area.y)
    .fill(random(['#264653', '#2a9d8f', '#e9c46a', '#f4a261']))
})
```

### Clustered Subdivision

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, randomBias, createQtGrid } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('clustered-grid')

// Generate points clustered in corners
const points = []
const clusters = [
  { x: 80, y: 80 },
  { x: 320, y: 320 }
]

clusters.forEach(cluster => {
  for (let i = 0; i < 30; i++) {
    points.push({
      x: randomBias(0, 400, cluster.x, 0.8),
      y: randomBias(0, 400, cluster.y, 0.8)
    })
  }
})

const grid = createQtGrid({
  width: 400,
  height: 400,
  points,
  gap: 3,
  maxQtObjects: 5,
  maxQtLevels: 5
})

grid.areas.forEach(area => {
  svg.rect(area.width, area.height)
    .move(area.x, area.y)
    .fill('#457b9d')
    .stroke({ color: '#fff', width: 1 })
})

// Show the driving points
points.forEach(p => {
  svg.circle(4).center(p.x, p.y).fill('#e63946')
})
```

### Controlling Subdivision Depth

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, createQtGrid } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 600, 400)
seedPRNG('depth-comparison')

// Same points, different max levels
const basePoints = []
for (let i = 0; i < 40; i++) {
  basePoints.push({
    x: random(0, 200),
    y: random(0, 400)
  })
}

const levels = [2, 3, 4]

levels.forEach((maxQtLevels, col) => {
  const xOffset = col * 200

  const grid = createQtGrid({
    width: 200,
    height: 400,
    points: basePoints,
    gap: 2,
    maxQtObjects: 3,
    maxQtLevels
  })

  grid.areas.forEach(area => {
    svg.rect(area.width, area.height)
      .move(area.x + xOffset, area.y)
      .fill('#2a9d8f')
      .stroke({ color: '#264653', width: 1 })
  })

  svg.text(`levels: ${maxQtLevels}`)
    .move(xOffset + 10, 380)
    .font({ size: 11, family: 'monospace' })
})
```

### Using Gap for Visual Spacing

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, createQtGrid } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('gap-example')

const points = []
for (let i = 0; i < 60; i++) {
  points.push({
    x: random(0, 400),
    y: random(0, 400)
  })
}

const grid = createQtGrid({
  width: 400,
  height: 400,
  points,
  gap: 8,  // Creates spacing between cells
  maxQtObjects: 5,
  maxQtLevels: 4
})

grid.areas.forEach(area => {
  svg.rect(area.width, area.height)
    .move(area.x, area.y)
    .fill('#e9c46a')
    .radius(4)  // Rounded corners work well with gaps
})
```

### Content-Based Grid

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, createQtGrid } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('content-grid')

// Simulate content areas (e.g., important elements)
const contentAreas = [
  { x: 100, y: 100 },  // Hero area
  { x: 100, y: 120 },
  { x: 120, y: 100 },
  { x: 300, y: 300 },  // Footer area
  { x: 320, y: 300 },
]

const grid = createQtGrid({
  width: 400,
  height: 400,
  points: contentAreas,
  gap: 4,
  maxQtObjects: 2,
  maxQtLevels: 4
})

const colors = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']

grid.areas.forEach((area, i) => {
  svg.rect(area.width, area.height)
    .move(area.x, area.y)
    .fill(colors[i % colors.length])
    .opacity(0.8)

  // Show grid span info
  const spanX = area.col.end - area.col.start
  const spanY = area.row.end - area.row.start

  if (area.width > 40 && area.height > 20) {
    svg.text(`${spanX}x${spanY}`)
      .center(area.x + area.width / 2, area.y + area.height / 2)
      .font({ size: 10, family: 'monospace' })
      .fill('#fff')
  }
})
```

## Notes

- The grid dimensions are always powers of 2 (2^maxQtLevels)
- `maxQtObjects` controls sensitivity: lower values create more subdivision around points
- `maxQtLevels` limits the smallest possible cell size (higher = finer detail)
- The `gap` parameter reduces each cell's dimensions on all sides (total gap between cells = 2 * gap)
- Empty areas (no points) will not subdivide, remaining as large cells
- Column/row indices in areas are useful for CSS Grid-like layouts

## See Also

- [createVoronoiDiagram](create-voronoi-diagram.md) - Organic spatial partitioning
- [createNoiseGrid](create-noise-grid.md) - Uniform grid with noise values
