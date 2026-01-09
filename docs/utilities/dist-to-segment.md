# distToSegment

Calculate the distance from a point to a line segment.

## Description

`distToSegment` calculates the shortest distance from a point to a line segment. This is useful for hit detection, proximity checks, collision avoidance, and creating effects based on distance to paths or edges. The function properly handles the segment endpoints, returning the distance to the closest point on the segment (not the infinite line).

## Syntax

```javascript
distToSegment(point, segmentStart, segmentEnd)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `point` | `[x, y]` | - | The point to measure from (array format) |
| `segmentStart` | `[x, y]` | - | Start point of the line segment (array format) |
| `segmentEnd` | `[x, y]` | - | End point of the line segment (array format) |

## Return Value

| Type | Description |
|------|-------------|
| `number` | The shortest distance from the point to the line segment |

## Examples

### Basic Distance Check

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { distToSegment } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

// Define a line segment
const segmentStart = [100, 300]
const segmentEnd = [300, 100]

// Draw the segment
svg.line(segmentStart[0], segmentStart[1], segmentEnd[0], segmentEnd[1])
  .stroke({ color: '#264653', width: 3 })

// Check distances from several points
const testPoints = [
  [50, 200],
  [200, 200],
  [350, 200]
]

testPoints.forEach(point => {
  const distance = distToSegment(point, segmentStart, segmentEnd)

  // Draw point
  svg.circle(10)
    .center(point[0], point[1])
    .fill('#e63946')

  // Show distance
  svg.text(`${Math.round(distance)}px`)
    .move(point[0] + 10, point[1])
    .font({ size: 12, family: 'monospace' })
})
```

### Proximity-Based Coloring

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, distToSegment, map } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('proximity-color')

// Define a diagonal line
const segmentStart = [50, 350]
const segmentEnd = [350, 50]

svg.line(segmentStart[0], segmentStart[1], segmentEnd[0], segmentEnd[1])
  .stroke({ color: '#333', width: 2 })

// Generate circles with color based on distance to line
for (let i = 0; i < 100; i++) {
  const x = random(0, 400)
  const y = random(0, 400)

  const distance = distToSegment([x, y], segmentStart, segmentEnd)

  // Map distance to hue (close = warm, far = cool)
  const hue = map(Math.min(distance, 150), 0, 150, 0, 200)

  svg.circle(12)
    .center(x, y)
    .fill(`hsl(${hue}, 70%, 50%)`)
    .opacity(0.7)
}
```

### Hit Detection for Lines

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { createCoordsTransformer, distToSegment } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const transformCoords = createCoordsTransformer(svg.node)

// Create multiple line segments
const segments = [
  { start: [50, 100], end: [150, 200], element: null },
  { start: [200, 50], end: [350, 150], element: null },
  { start: [100, 300], end: [300, 350], element: null }
]

// Draw segments
segments.forEach(seg => {
  seg.element = svg.line(seg.start[0], seg.start[1], seg.end[0], seg.end[1])
    .stroke({ color: '#264653', width: 4 })
})

const hitThreshold = 20  // Pixels

// Highlight segment when mouse is near
svg.node.addEventListener('mousemove', (event) => {
  const coords = transformCoords(event)
  const point = [coords.x, coords.y]

  segments.forEach(seg => {
    const distance = distToSegment(point, seg.start, seg.end)

    if (distance < hitThreshold) {
      seg.element.stroke({ color: '#e63946', width: 6 })
    } else {
      seg.element.stroke({ color: '#264653', width: 4 })
    }
  })
})
```

### Collision Avoidance

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, distToSegment } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('collision-avoid')

// Define obstacle lines
const obstacles = [
  { start: [100, 0], end: [100, 250] },
  { start: [100, 250], end: [300, 250] },
  { start: [300, 150], end: [300, 400] }
]

// Draw obstacles
obstacles.forEach(obs => {
  svg.line(obs.start[0], obs.start[1], obs.end[0], obs.end[1])
    .stroke({ color: '#264653', width: 4 })
})

const minDistance = 30  // Minimum distance from obstacles

// Place circles that avoid obstacles
let placed = 0
let attempts = 0

while (placed < 50 && attempts < 500) {
  const x = random(20, 380)
  const y = random(20, 380)
  const point = [x, y]

  // Check distance to all obstacles
  const isSafe = obstacles.every(obs =>
    distToSegment(point, obs.start, obs.end) > minDistance
  )

  if (isSafe) {
    svg.circle(15)
      .center(x, y)
      .fill('#2a9d8f')
      .opacity(0.8)
    placed++
  }

  attempts++
}
```

### Distance Field Visualization

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { distToSegment, map } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

// Define line segment
const segmentStart = [100, 300]
const segmentEnd = [300, 100]

// Create distance field grid
const resolution = 20
const cellSize = 400 / resolution

for (let row = 0; row < resolution; row++) {
  for (let col = 0; col < resolution; col++) {
    const x = col * cellSize + cellSize / 2
    const y = row * cellSize + cellSize / 2

    const distance = distToSegment([x, y], segmentStart, segmentEnd)

    // Map distance to lightness
    const lightness = map(Math.min(distance, 150), 0, 150, 20, 90)

    svg.rect(cellSize, cellSize)
      .move(col * cellSize, row * cellSize)
      .fill(`hsl(200, 50%, ${lightness}%)`)
  }
}

// Draw the segment on top
svg.line(segmentStart[0], segmentStart[1], segmentEnd[0], segmentEnd[1])
  .stroke({ color: '#e63946', width: 3 })
```

### Perpendicular Lines to Segment

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, distToSegment } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('perpendicular')

const segmentStart = [50, 200]
const segmentEnd = [350, 200]

// Draw main segment
svg.line(segmentStart[0], segmentStart[1], segmentEnd[0], segmentEnd[1])
  .stroke({ color: '#264653', width: 3 })

// Generate points and draw lines to nearest point on segment
for (let i = 0; i < 20; i++) {
  const x = random(50, 350)
  const y = random(50, 350)
  const point = [x, y]

  const distance = distToSegment(point, segmentStart, segmentEnd)

  // Find closest point on segment (for a horizontal line, it's directly below/above)
  const closestX = Math.max(segmentStart[0], Math.min(segmentEnd[0], x))
  const closestY = segmentStart[1]  // Horizontal line

  // Draw point
  svg.circle(6).center(x, y).fill('#e63946')

  // Draw line to segment
  svg.line(x, y, closestX, closestY)
    .stroke({ color: '#2a9d8f', width: 1, dasharray: '4,4' })
}
```

## Notes

- Points must be in array format `[x, y]`, not object format `{x, y}`
- Returns the distance to the nearest point *on the segment*, not the infinite line
- Handles degenerate cases where segment start equals segment end
- There is also a `distToSegmentSquared` function available for performance-critical comparisons
- Based on algorithm by Matt DesLauriers

## See Also

- [createCoordsTransformer](create-coords-transformer.md) - Get mouse coordinates for interactive distance checks
- [map](map.md) - Map distances to visual properties
