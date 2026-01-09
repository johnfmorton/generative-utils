# pointsInPath

Extract evenly-spaced points along an SVG path.

## Description

`pointsInPath` samples a specified number of points along an SVG path element, distributing them evenly based on path length. This is useful for placing elements along curves, creating dotted effects, or animating objects along paths. The function returns points from the path's start to its end, ensuring the last point is exactly at the path's endpoint.

## Syntax

```javascript
pointsInPath(pathElement, numPoints)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `pathElement` | `SVGPathElement` | - | A native SVG path DOM element |
| `numPoints` | `number` | `10` | Number of points to extract |

## Return Value

| Type | Description |
|------|-------------|
| `Array<SVGPoint>` | Array of point objects with `x` and `y` properties |

## Examples

### Basic Point Extraction

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { pointsInPath } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

// Create a curved path
const path = svg.path('M 50,200 Q 200,50 350,200')
  .fill('none')
  .stroke({ color: '#ddd', width: 2 })

// Get the native SVG element from SVG.JS
const pathElement = path.node

// Extract points along the path
const points = pointsInPath(pathElement, 20)

// Draw circles at each point
points.forEach(point => {
  svg.circle(8)
    .center(point.x, point.y)
    .fill('#264653')
})
```

### Dotted Line Effect

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, spline, pointsInPath } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('dotted-line')

// Create a spline path
const controlPoints = []
for (let i = 0; i < 6; i++) {
  controlPoints.push({
    x: 50 + i * 60,
    y: random(100, 300)
  })
}
const pathData = spline(controlPoints, 0.5)

// Create invisible path for point extraction
const path = svg.path(pathData)
  .fill('none')
  .stroke('none')

// Extract points and draw dots
const points = pointsInPath(path.node, 40)

points.forEach((point, i) => {
  svg.circle(6)
    .center(point.x, point.y)
    .fill('#2a9d8f')
    .opacity(0.8)
})
```

### Gradient Along Path

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { pointsInPath, map } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

// Create a wavy path
const path = svg.path('M 50,200 C 100,100 150,300 200,200 C 250,100 300,300 350,200')
  .fill('none')
  .stroke('none')

const points = pointsInPath(path.node, 50)

points.forEach((point, i) => {
  // Create gradient effect along path
  const hue = map(i, 0, points.length - 1, 0, 120)  // Red to green
  const size = map(i, 0, points.length - 1, 4, 12)  // Small to large

  svg.circle(size)
    .center(point.x, point.y)
    .fill(`hsl(${hue}, 70%, 50%)`)
})
```

### Text Along Path

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { pointsInPath } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 200)

// Create an arc path
const path = svg.path('M 50,150 Q 200,20 350,150')
  .fill('none')
  .stroke({ color: '#eee', width: 1 })

const text = 'HELLO WORLD'
const points = pointsInPath(path.node, text.length)

points.forEach((point, i) => {
  if (i < text.length) {
    svg.text(text[i])
      .center(point.x, point.y)
      .font({ size: 20, family: 'sans-serif', weight: 'bold' })
      .fill('#264653')
  }
})
```

### Shape Along Path

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, spline, pointsInPath } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('shapes-along-path')

// Create a circular path
const circlePoints = []
for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2
  circlePoints.push({
    x: 200 + Math.cos(angle) * 120,
    y: 200 + Math.sin(angle) * 120
  })
}
const pathData = spline(circlePoints, 0.5, true)

const path = svg.path(pathData)
  .fill('none')
  .stroke({ color: '#ddd', width: 1 })

// Place shapes along the path
const points = pointsInPath(path.node, 24)
const colors = ['#e63946', '#457b9d', '#2a9d8f', '#f4a261']

points.forEach((point, i) => {
  const size = random(10, 25)
  const color = random(colors)

  svg.rect(size, size)
    .center(point.x, point.y)
    .fill(color)
    .rotate(random(0, 360))
    .opacity(0.8)
})
```

### Connecting Two Paths

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { pointsInPath } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

// Create two parallel wavy paths
const path1 = svg.path('M 50,100 Q 125,50 200,100 Q 275,150 350,100')
  .fill('none')
  .stroke({ color: '#264653', width: 2 })

const path2 = svg.path('M 50,300 Q 125,250 200,300 Q 275,350 350,300')
  .fill('none')
  .stroke({ color: '#264653', width: 2 })

// Extract points from both paths
const points1 = pointsInPath(path1.node, 20)
const points2 = pointsInPath(path2.node, 20)

// Connect corresponding points
points1.forEach((p1, i) => {
  const p2 = points2[i]

  svg.line(p1.x, p1.y, p2.x, p2.y)
    .stroke({ color: '#2a9d8f', width: 1, opacity: 0.5 })
})
```

### Animated Path Following (Setup)

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { pointsInPath, spline, seedPRNG, random } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('animation-path')

// Create motion path
const controlPoints = []
for (let i = 0; i < 5; i++) {
  controlPoints.push({
    x: random(50, 350),
    y: random(50, 350)
  })
}
const pathData = spline(controlPoints, 0.4, true)

const path = svg.path(pathData)
  .fill('none')
  .stroke({ color: '#ddd', width: 1, dasharray: '5,5' })

// Get points for animation keyframes
const animationPoints = pointsInPath(path.node, 60)

// Create element that will follow the path
const follower = svg.circle(20)
  .center(animationPoints[0].x, animationPoints[0].y)
  .fill('#e63946')

// Animation would use these points as keyframes
// animationPoints array contains positions for each frame
console.log('Animation keyframes:', animationPoints.length)
```

## Notes

- Requires a native SVG path DOM element, not a path string or SVG.JS object
- With SVG.JS, access the native element via `.node` property
- Uses native SVG methods `getTotalLength()` and `getPointAtLength()`
- Points are spaced evenly by path length, not by visual distance
- The last point is guaranteed to be at the exact end of the path
- Works with any valid SVG path data (lines, curves, arcs, etc.)

## See Also

- [spline](spline.md) - Generate smooth path strings for extraction
- [map](../utilities/map.md) - Map point indices to other values
