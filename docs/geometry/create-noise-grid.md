# createNoiseGrid

Create simplex noise grids for flow fields and procedural patterns.

## Description

`createNoiseGrid` generates a grid of cells, each containing a simplex noise value. The grid includes a `lookup` function for efficiently querying noise at any position, making it ideal for flow fields, procedural textures, and organic movement patterns. Noise values range from -1 to 1.

## Syntax

```javascript
createNoiseGrid(options)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options.width` | `number` | `200` | Width of the grid area |
| `options.height` | `number` | `200` | Height of the grid area |
| `options.resolution` | `number` | `8` | Number of cells in each dimension |
| `options.xInc` | `number` | `0.01` | X-axis noise increment (affects pattern scale) |
| `options.yInc` | `number` | `0.01` | Y-axis noise increment (affects pattern scale) |
| `options.seed` | `number` | `Math.random() * 1000` | Seed for reproducible noise |

## Return Value

| Type | Description |
|------|-------------|
| `object` | Object containing `cells` array and `lookup` function |

### Return Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `cells` | `Array` | Array of cell objects |
| `lookup` | `function` | Function to query noise at any position: `lookup({x, y})` → cell |

### Cell Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `x` | `number` | X position of cell |
| `y` | `number` | Y position of cell |
| `width` | `number` | Cell width |
| `height` | `number` | Cell height |
| `noiseValue` | `number` | Simplex noise value (-1 to 1) |

## Examples

### Basic Noise Visualization

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { createNoiseGrid, map } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const noiseGrid = createNoiseGrid({
  width: 400,
  height: 400,
  resolution: 20,
  xInc: 0.05,
  yInc: 0.05,
  seed: 42
})

noiseGrid.cells.forEach(cell => {
  // Map noise (-1 to 1) to lightness (20% to 80%)
  const lightness = map(cell.noiseValue, -1, 1, 20, 80)

  svg.rect(cell.width, cell.height)
    .move(cell.x, cell.y)
    .fill(`hsl(200, 50%, ${lightness}%)`)
})
```

### Flow Field

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { createNoiseGrid, map } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const noiseGrid = createNoiseGrid({
  width: 400,
  height: 400,
  resolution: 16,
  xInc: 0.08,
  yInc: 0.08,
  seed: 123
})

noiseGrid.cells.forEach(cell => {
  const centerX = cell.x + cell.width / 2
  const centerY = cell.y + cell.height / 2

  // Convert noise to angle
  const angle = map(cell.noiseValue, -1, 1, 0, Math.PI * 2)
  const length = 12

  // Calculate line endpoint
  const endX = centerX + Math.cos(angle) * length
  const endY = centerY + Math.sin(angle) * length

  svg.line(centerX, centerY, endX, endY)
    .stroke({ color: '#264653', width: 1.5 })

  // Add arrow head
  svg.circle(3).center(endX, endY).fill('#264653')
})
```

### Using the Lookup Function

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, createNoiseGrid, map } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('lookup-example')

const noiseGrid = createNoiseGrid({
  width: 400,
  height: 400,
  resolution: 20,
  xInc: 0.06,
  yInc: 0.06,
  seed: 456
})

// Generate random particles
for (let i = 0; i < 100; i++) {
  const x = random(0, 400)
  const y = random(0, 400)

  // Look up noise at this position
  const cell = noiseGrid.lookup({ x, y })
  const noise = cell.noiseValue

  // Size and opacity based on noise
  const size = map(noise, -1, 1, 3, 15)
  const opacity = map(noise, -1, 1, 0.3, 1)

  svg.circle(size)
    .center(x, y)
    .fill('#e63946')
    .opacity(opacity)
}
```

### Particle Trails with Flow

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, createNoiseGrid, map, spline } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('particle-trails')

const noiseGrid = createNoiseGrid({
  width: 400,
  height: 400,
  resolution: 30,
  xInc: 0.04,
  yInc: 0.04,
  seed: 789
})

// Create flowing particle trails
for (let i = 0; i < 50; i++) {
  let x = random(0, 400)
  let y = random(0, 400)
  const points = [{ x, y }]

  // Follow the flow field
  for (let step = 0; step < 30; step++) {
    const cell = noiseGrid.lookup({ x, y })
    const angle = map(cell.noiseValue, -1, 1, 0, Math.PI * 2)

    x += Math.cos(angle) * 5
    y += Math.sin(angle) * 5

    // Stay in bounds
    if (x < 0 || x > 400 || y < 0 || y > 400) break

    points.push({ x, y })
  }

  if (points.length > 2) {
    const pathData = spline(points, 0.5)
    svg.path(pathData)
      .fill('none')
      .stroke({
        color: '#2a9d8f',
        width: 1,
        opacity: 0.6
      })
  }
}
```

### Noise Scale Comparison

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { createNoiseGrid, map } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 600, 200)

const increments = [0.02, 0.06, 0.15]

increments.forEach((inc, col) => {
  const xOffset = col * 200

  const noiseGrid = createNoiseGrid({
    width: 200,
    height: 200,
    resolution: 25,
    xInc: inc,
    yInc: inc,
    seed: 100  // Same seed for comparison
  })

  noiseGrid.cells.forEach(cell => {
    const lightness = map(cell.noiseValue, -1, 1, 15, 85)

    svg.rect(cell.width, cell.height)
      .move(cell.x + xOffset, cell.y)
      .fill(`hsl(40, 60%, ${lightness}%)`)
  })

  svg.text(`inc: ${inc}`)
    .move(xOffset + 5, 185)
    .font({ size: 10, family: 'monospace' })
    .fill('#333')
})
```

### Color Field

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { createNoiseGrid, map } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const noiseGrid = createNoiseGrid({
  width: 400,
  height: 400,
  resolution: 40,
  xInc: 0.03,
  yInc: 0.03,
  seed: 2024
})

noiseGrid.cells.forEach(cell => {
  // Map noise to hue for a color gradient
  const hue = map(cell.noiseValue, -1, 1, 180, 300)
  const saturation = map(cell.noiseValue, -1, 1, 40, 80)

  svg.rect(cell.width, cell.height)
    .move(cell.x, cell.y)
    .fill(`hsl(${hue}, ${saturation}%, 50%)`)
})
```

## Notes

- Noise values range from -1 to 1; use `map()` to convert to useful ranges
- Lower `xInc`/`yInc` values create smoother, larger patterns
- Higher `xInc`/`yInc` values create more detailed, turbulent patterns
- The `lookup` function clamps positions to grid bounds
- Use the same `seed` value to reproduce identical noise patterns
- Resolution affects both visual detail and performance (higher = more cells)

## See Also

- [map](../utilities/map.md) - Remap noise values to useful ranges
- [spline](spline.md) - Create smooth curves from flow field paths
- [seedPRNG](../random/seed-prng.md) - For reproducible random starting positions
