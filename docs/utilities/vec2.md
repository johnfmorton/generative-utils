# vec2

2D vector operations for geometric calculations.

## Description

`vec2` provides a comprehensive set of 2D vector operations essential for generative art. All functions work with simple `{ x, y }` objects, making them easy to use with SVG coordinates and other libraries. Functions are pure and return new objects rather than mutating inputs.

## Syntax

```javascript
// Import the namespace object
import { vec2 } from '@johnfmorton/generative-utils'
vec2.add(a, b)

// Or import individual functions
import { add, subtract, normalize } from '@johnfmorton/generative-utils'
```

## Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `create` | `create(x?, y?)` | Create a new vector |
| `add` | `add(a, b)` | Add two vectors |
| `subtract` | `subtract(a, b)` | Subtract b from a |
| `multiply` | `multiply(v, scalar)` | Scale a vector |
| `divide` | `divide(v, scalar)` | Divide a vector |
| `magnitude` | `magnitude(v)` | Get vector length |
| `magnitudeSquared` | `magnitudeSquared(v)` | Get squared length (faster) |
| `normalize` | `normalize(v)` | Get unit vector |
| `distance` | `distance(a, b)` | Distance between points |
| `distanceSquared` | `distanceSquared(a, b)` | Squared distance (faster) |
| `dot` | `dot(a, b)` | Dot product |
| `cross` | `cross(a, b)` | Cross product (z-component) |
| `rotate` | `rotate(v, angle)` | Rotate around origin |
| `rotateAround` | `rotateAround(v, pivot, angle)` | Rotate around a point |
| `lerp` | `lerp(a, b, t)` | Interpolate between vectors |
| `angle` | `angle(v)` | Get angle from x-axis |
| `angleBetween` | `angleBetween(a, b)` | Angle between two vectors |
| `fromAngle` | `fromAngle(angle, mag?)` | Create vector from angle |
| `perpendicular` | `perpendicular(v)` | Get perpendicular vector |
| `reflect` | `reflect(v, normal)` | Reflect off a surface |
| `limit` | `limit(v, max)` | Clamp magnitude |
| `setMagnitude` | `setMagnitude(v, mag)` | Set specific magnitude |

## Examples

### Basic Vector Operations

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { vec2 } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const a = { x: 100, y: 200 }
const b = { x: 250, y: 150 }

// Draw original vectors from origin
svg.line(0, 0, a.x, a.y).stroke({ color: '#e63946', width: 2 })
svg.line(0, 0, b.x, b.y).stroke({ color: '#457b9d', width: 2 })

// Add vectors
const sum = vec2.add(a, b)
svg.line(0, 0, sum.x, sum.y).stroke({ color: '#2a9d8f', width: 2 })

// Draw labels
svg.circle(6).center(a.x, a.y).fill('#e63946')
svg.circle(6).center(b.x, b.y).fill('#457b9d')
svg.circle(6).center(sum.x, sum.y).fill('#2a9d8f')
```

### Rotation Around a Point

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { vec2 } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const center = { x: 200, y: 200 }
const point = { x: 300, y: 200 }

// Draw rotated positions
const numRotations = 12

for (let i = 0; i < numRotations; i++) {
  const angle = (i / numRotations) * Math.PI * 2
  const rotated = vec2.rotateAround(point, center, angle)

  svg.circle(15)
    .center(rotated.x, rotated.y)
    .fill(`hsl(${(i / numRotations) * 360}, 70%, 50%)`)
}

// Draw center
svg.circle(10).center(center.x, center.y).fill('#333')
```

### Normalized Direction Vectors

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, vec2 } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('directions')

// Draw random lines with consistent length
for (let i = 0; i < 30; i++) {
  const start = { x: random(50, 350), y: random(50, 350) }

  // Random direction, normalized to unit length
  const direction = vec2.normalize({
    x: random(-1, 1),
    y: random(-1, 1)
  })

  // Scale to desired length
  const length = 40
  const end = vec2.add(start, vec2.multiply(direction, length))

  svg.line(start.x, start.y, end.x, end.y)
    .stroke({ color: '#264653', width: 2 })

  svg.circle(4).center(start.x, start.y).fill('#e63946')
}
```

### Flow Field with Vectors

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { createNoiseGrid, vec2 } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const noiseGrid = createNoiseGrid({
  width: 400,
  height: 400,
  resolution: 20,
  seed: 42
})

noiseGrid.cells.forEach(cell => {
  const center = {
    x: cell.x + cell.width / 2,
    y: cell.y + cell.height / 2
  }

  // Convert noise to angle
  const angle = cell.noiseValue * Math.PI

  // Create direction vector from angle
  const direction = vec2.fromAngle(angle, 15)
  const end = vec2.add(center, direction)

  svg.line(center.x, center.y, end.x, end.y)
    .stroke({ color: '#457b9d', width: 1.5 })
})
```

### Distance-Based Sizing

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, vec2, map } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('distance-sizing')

const center = { x: 200, y: 200 }
const maxDist = 200

for (let i = 0; i < 100; i++) {
  const point = { x: random(0, 400), y: random(0, 400) }

  // Use vec2.distance instead of manual calculation
  const dist = vec2.distance(point, center)

  const size = map(Math.min(dist, maxDist), 0, maxDist, 25, 5)
  const opacity = map(Math.min(dist, maxDist), 0, maxDist, 1, 0.3)

  svg.circle(size)
    .center(point.x, point.y)
    .fill('#2a9d8f')
    .opacity(opacity)
}
```

### Vector Interpolation Path

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { vec2 } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const start = { x: 50, y: 350 }
const end = { x: 350, y: 50 }

// Draw interpolated points
const steps = 20

for (let i = 0; i <= steps; i++) {
  const t = i / steps
  const point = vec2.lerp(start, end, t)

  svg.circle(8)
    .center(point.x, point.y)
    .fill(`hsl(${t * 200}, 70%, 50%)`)
}

// Show start and end
svg.circle(15).center(start.x, start.y).fill('#e63946')
svg.circle(15).center(end.x, end.y).fill('#2a9d8f')
```

### Perpendicular Lines

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { vec2 } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

// Main line
const lineStart = { x: 50, y: 300 }
const lineEnd = { x: 350, y: 100 }

svg.line(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y)
  .stroke({ color: '#264653', width: 3 })

// Get direction and perpendicular
const direction = vec2.normalize(vec2.subtract(lineEnd, lineStart))
const perp = vec2.perpendicular(direction)

// Draw perpendicular lines along the main line
const steps = 10
const perpLength = 30

for (let i = 0; i <= steps; i++) {
  const t = i / steps
  const point = vec2.lerp(lineStart, lineEnd, t)

  const perpEnd = vec2.add(point, vec2.multiply(perp, perpLength))

  svg.line(point.x, point.y, perpEnd.x, perpEnd.y)
    .stroke({ color: '#e63946', width: 2 })
}
```

### Reflection

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { vec2 } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

// Mirror line (vertical)
svg.line(200, 0, 200, 400)
  .stroke({ color: '#ccc', width: 2, dasharray: '5,5' })

// Incident ray
const rayStart = { x: 50, y: 100 }
const rayEnd = { x: 200, y: 200 }

svg.line(rayStart.x, rayStart.y, rayEnd.x, rayEnd.y)
  .stroke({ color: '#457b9d', width: 2 })

// Calculate reflection
const incident = vec2.subtract(rayEnd, rayStart)
const normal = { x: -1, y: 0 }  // Normal pointing left

const reflected = vec2.reflect(incident, normal)
const reflectedEnd = vec2.add(rayEnd, reflected)

svg.line(rayEnd.x, rayEnd.y, reflectedEnd.x, reflectedEnd.y)
  .stroke({ color: '#e63946', width: 2 })

// Markers
svg.circle(8).center(rayStart.x, rayStart.y).fill('#457b9d')
svg.circle(8).center(rayEnd.x, rayEnd.y).fill('#333')
svg.circle(8).center(reflectedEnd.x, reflectedEnd.y).fill('#e63946')
```

### Limiting Magnitude

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, vec2 } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('limit-magnitude')

const center = { x: 200, y: 200 }
const maxLength = 100

// Draw boundary circle
svg.circle(maxLength * 2)
  .center(center.x, center.y)
  .fill('none')
  .stroke({ color: '#ccc', width: 1 })

for (let i = 0; i < 30; i++) {
  // Random vector with potentially large magnitude
  const v = {
    x: random(-200, 200),
    y: random(-200, 200)
  }

  // Limit to maxLength
  const limited = vec2.limit(v, maxLength)
  const end = vec2.add(center, limited)

  const wasLimited = vec2.magnitude(v) > maxLength

  svg.line(center.x, center.y, end.x, end.y)
    .stroke({
      color: wasLimited ? '#e63946' : '#2a9d8f',
      width: 2
    })
}
```

## Notes

- All functions return new objects; inputs are never mutated
- Angles are in radians throughout (use `angle * Math.PI / 180` to convert from degrees)
- Use `magnitudeSquared` and `distanceSquared` for performance when comparing (avoids `Math.sqrt`)
- Zero vectors are handled gracefully (e.g., `normalize({ x: 0, y: 0 })` returns `{ x: 0, y: 0 }`)
- Compatible with any object that has `x` and `y` properties

## See Also

- [lerp](lerp.md) - Scalar linear interpolation
- [map](map.md) - Range mapping
- [distToSegment](dist-to-segment.md) - Distance from point to line segment
