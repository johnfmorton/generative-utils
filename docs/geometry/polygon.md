# polygon, star, pointsToPath

Generate regular polygons and star shapes.

## Description

These functions create vertices for regular polygons and star shapes, returning arrays of `{ x, y }` points that can be used directly with SVG or converted to path strings. Regular polygons have equal side lengths and angles, while star shapes alternate between outer and inner radii.

## Syntax

```javascript
polygon({ sides, radius, cx?, cy?, rotation? })
star({ points, outerRadius, innerRadius, cx?, cy?, rotation? })
pointsToPath(points, close?)
```

## Parameters

### polygon

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sides` | `number` | `6` | Number of sides (3 = triangle, 4 = square, 5 = pentagon, etc.) |
| `radius` | `number` | `50` | Distance from center to vertices |
| `cx` | `number` | `0` | Center x coordinate |
| `cy` | `number` | `0` | Center y coordinate |
| `rotation` | `number` | `0` | Rotation angle in radians |

### star

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `points` | `number` | `5` | Number of points on the star |
| `outerRadius` | `number` | `50` | Distance from center to outer points |
| `innerRadius` | `number` | `25` | Distance from center to inner points |
| `cx` | `number` | `0` | Center x coordinate |
| `cy` | `number` | `0` | Center y coordinate |
| `rotation` | `number` | `0` | Rotation angle in radians |

### pointsToPath

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `points` | `Array<{x, y}>` | - | Array of vertex points |
| `close` | `boolean` | `true` | Whether to close the path with 'Z' |

## Return Values

| Function | Type | Description |
|----------|------|-------------|
| `polygon` | `Array<{x, y}>` | Array of vertex points |
| `star` | `Array<{x, y}>` | Array of vertex points (alternating outer/inner) |
| `pointsToPath` | `string` | SVG path string (e.g., `"M0,50L43.3,-25L-43.3,-25Z"`) |

## Examples

### Basic Shapes

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { polygon, pointsToPath } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

// Triangle
const triangle = polygon({ sides: 3, radius: 50, cx: 80, cy: 100 })
svg.path(pointsToPath(triangle)).fill('#e63946')

// Square
const square = polygon({ sides: 4, radius: 50, cx: 200, cy: 100 })
svg.path(pointsToPath(square)).fill('#457b9d')

// Pentagon
const pentagon = polygon({ sides: 5, radius: 50, cx: 320, cy: 100 })
svg.path(pointsToPath(pentagon)).fill('#2a9d8f')

// Hexagon
const hexagon = polygon({ sides: 6, radius: 50, cx: 80, cy: 250 })
svg.path(pointsToPath(hexagon)).fill('#f4a261')

// Octagon
const octagon = polygon({ sides: 8, radius: 50, cx: 200, cy: 250 })
svg.path(pointsToPath(octagon)).fill('#264653')

// Dodecagon (12 sides)
const dodecagon = polygon({ sides: 12, radius: 50, cx: 320, cy: 250 })
svg.path(pointsToPath(dodecagon)).fill('#9c89b8')
```

### Rotated Polygons

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { polygon, pointsToPath } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const cx = 200
const cy = 200

// Draw same hexagon at different rotations
for (let i = 0; i < 6; i++) {
  const rotation = (i / 6) * (Math.PI / 3)  // Rotate by 10 degrees each
  const opacity = 0.3 + (i / 6) * 0.7

  const hex = polygon({
    sides: 6,
    radius: 80 + i * 15,
    cx,
    cy,
    rotation
  })

  svg.path(pointsToPath(hex))
    .fill('none')
    .stroke({ color: '#264653', width: 2 })
    .opacity(opacity)
}
```

### Star Shapes

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { star, pointsToPath } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

// 5-pointed star
const star5 = star({
  points: 5,
  outerRadius: 60,
  innerRadius: 25,
  cx: 100,
  cy: 100
})
svg.path(pointsToPath(star5)).fill('#e63946')

// 6-pointed star (Star of David shape)
const star6 = star({
  points: 6,
  outerRadius: 60,
  innerRadius: 30,
  cx: 250,
  cy: 100
})
svg.path(pointsToPath(star6)).fill('#457b9d')

// 8-pointed star
const star8 = star({
  points: 8,
  outerRadius: 60,
  innerRadius: 35,
  cx: 100,
  cy: 250
})
svg.path(pointsToPath(star8)).fill('#2a9d8f')

// Spiky star (small inner radius)
const starSpiky = star({
  points: 12,
  outerRadius: 60,
  innerRadius: 20,
  cx: 250,
  cy: 250
})
svg.path(pointsToPath(starSpiky)).fill('#f4a261')
```

### Polygon Grid

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, polygon, pointsToPath } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('polygon-grid')

const cols = 5
const rows = 5
const cellSize = 80

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const cx = col * cellSize + cellSize / 2
    const cy = row * cellSize + cellSize / 2

    const sides = Math.floor(random(3, 9))
    const rotation = random(0, Math.PI * 2)

    const shape = polygon({
      sides,
      radius: 30,
      cx,
      cy,
      rotation
    })

    const hue = random(180, 280)

    svg.path(pointsToPath(shape))
      .fill(`hsl(${hue}, 60%, 50%)`)
      .opacity(0.8)
  }
}
```

### Concentric Polygons

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { polygon, pointsToPath } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const cx = 200
const cy = 200
const sides = 6
const layers = 8

for (let i = layers; i > 0; i--) {
  const radius = i * 20
  const rotation = (i % 2) * (Math.PI / sides)  // Alternate rotation

  const shape = polygon({ sides, radius, cx, cy, rotation })

  const lightness = 30 + (i / layers) * 40

  svg.path(pointsToPath(shape))
    .fill(`hsl(200, 60%, ${lightness}%)`)
}
```

### Using Points Directly

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { polygon } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

// Get hexagon vertices
const hex = polygon({ sides: 6, radius: 100, cx: 200, cy: 200 })

// Draw circles at each vertex
hex.forEach((point, i) => {
  svg.circle(20)
    .center(point.x, point.y)
    .fill(`hsl(${(i / 6) * 360}, 70%, 50%)`)
})

// Connect vertices to center
hex.forEach(point => {
  svg.line(200, 200, point.x, point.y)
    .stroke({ color: '#ccc', width: 1 })
})

// Draw center
svg.circle(15).center(200, 200).fill('#333')
```

### Flat-Top vs Point-Top Polygons

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { polygon, pointsToPath } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 200)

// Point-top hexagon (default, vertex at top)
const pointTop = polygon({
  sides: 6,
  radius: 60,
  cx: 120,
  cy: 100,
  rotation: 0
})

svg.path(pointsToPath(pointTop))
  .fill('#457b9d')

svg.text('Point-top')
  .move(85, 170)
  .font({ size: 12, family: 'sans-serif' })

// Flat-top hexagon (rotated 30 degrees)
const flatTop = polygon({
  sides: 6,
  radius: 60,
  cx: 280,
  cy: 100,
  rotation: Math.PI / 6  // 30 degrees
})

svg.path(pointsToPath(flatTop))
  .fill('#2a9d8f')

svg.text('Flat-top')
  .move(250, 170)
  .font({ size: 12, family: 'sans-serif' })
```

### Star Burst Pattern

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { star, pointsToPath, map } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const cx = 200
const cy = 200
const numStars = 6

for (let i = 0; i < numStars; i++) {
  const rotation = (i / numStars) * Math.PI * 2
  const outerRadius = 180 - i * 20
  const innerRadius = outerRadius * 0.4

  const shape = star({
    points: 8,
    outerRadius,
    innerRadius,
    cx,
    cy,
    rotation
  })

  const hue = map(i, 0, numStars - 1, 0, 60)

  svg.path(pointsToPath(shape))
    .fill('none')
    .stroke({ color: `hsl(${hue}, 80%, 50%)`, width: 2 })
}
```

## Notes

- Rotation is in radians. Use `degrees * Math.PI / 180` to convert from degrees
- By default, polygons have a vertex pointing to the right (angle 0). Use `rotation: -Math.PI / 2` for a vertex pointing up
- For flat-top hexagons (common in hex grids), use `rotation: Math.PI / 6` (30 degrees)
- The `pointsToPath` function creates simple `M...L...Z` paths; use `spline` for smooth curves through the points
- Star inner radius should be smaller than outer radius for typical star shapes
- Points are generated counter-clockwise starting from the rotation angle

## See Also

- [spline](spline.md) - Create smooth curves through points
- [vec2](../utilities/vec2.md) - Vector operations for manipulating points
