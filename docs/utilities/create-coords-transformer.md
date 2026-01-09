# createCoordsTransformer

Transform screen coordinates to SVG coordinate space.

## Description

`createCoordsTransformer` creates a reusable function that converts mouse or touch event coordinates from screen space to SVG coordinate space. This accounts for SVG viewBox scaling, element transformations, and page positioning. Essential for interactive generative artwork where you need accurate pointer positions within your SVG canvas.

## Syntax

```javascript
createCoordsTransformer(svgElement)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `svgElement` | `SVGSVGElement` | - | The native SVG root element (not SVG.JS wrapper) |

## Return Value

| Type | Description |
|------|-------------|
| `function` | A function that takes a mouse/touch event and returns SVG coordinates |

### Returned Function Signature

```javascript
transformCoords(event) → { x: number, y: number }
```

## Examples

### Basic Mouse Tracking

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { createCoordsTransformer } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

// Get the native SVG element from SVG.JS
const svgElement = svg.node

// Create the coordinate transformer
const transformCoords = createCoordsTransformer(svgElement)

// Track mouse position
let marker = svg.circle(20).fill('#e63946')

document.addEventListener('mousemove', (event) => {
  const coords = transformCoords(event)
  marker.center(coords.x, coords.y)
})
```

### Drawing on Click

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { createCoordsTransformer, seedPRNG, random } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('click-drawing')

const transformCoords = createCoordsTransformer(svg.node)

// Add background
svg.rect(400, 400).fill('#f8f9fa')

// Draw circle on each click
svg.node.addEventListener('click', (event) => {
  const coords = transformCoords(event)

  svg.circle(random(20, 60))
    .center(coords.x, coords.y)
    .fill(random(['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']))
    .opacity(0.8)
})
```

### Interactive Flow Field

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { createCoordsTransformer, createNoiseGrid, map } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const noiseGrid = createNoiseGrid({
  width: 400,
  height: 400,
  resolution: 20,
  seed: 123
})

const transformCoords = createCoordsTransformer(svg.node)

// Show noise direction at mouse position
const indicator = svg.group()
const line = indicator.line(0, 0, 30, 0).stroke({ color: '#e63946', width: 3 })
const dot = indicator.circle(8).fill('#e63946')

svg.node.addEventListener('mousemove', (event) => {
  const coords = transformCoords(event)

  // Look up noise at cursor position
  const cell = noiseGrid.lookup(coords)
  const angle = map(cell.noiseValue, -1, 1, 0, Math.PI * 2)

  // Position and rotate indicator
  indicator.transform({ translateX: coords.x, translateY: coords.y })
  line.transform({ rotate: angle * (180 / Math.PI) })
})
```

### Drag to Create Shapes

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { createCoordsTransformer, spline } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const transformCoords = createCoordsTransformer(svg.node)

svg.rect(400, 400).fill('#f8f9fa')

let isDrawing = false
let points = []
let currentPath = null

svg.node.addEventListener('mousedown', (event) => {
  isDrawing = true
  points = []
  const coords = transformCoords(event)
  points.push({ x: coords.x, y: coords.y })
})

svg.node.addEventListener('mousemove', (event) => {
  if (!isDrawing) return

  const coords = transformCoords(event)
  points.push({ x: coords.x, y: coords.y })

  // Update path preview
  if (currentPath) currentPath.remove()

  if (points.length > 1) {
    const pathData = spline(points, 0.3)
    currentPath = svg.path(pathData)
      .fill('none')
      .stroke({ color: '#264653', width: 2 })
  }
})

svg.node.addEventListener('mouseup', () => {
  isDrawing = false
  currentPath = null
  points = []
})
```

### Proximity-Based Effects

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { createCoordsTransformer, seedPRNG, random, map } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('proximity')

const transformCoords = createCoordsTransformer(svg.node)

// Create grid of circles
const circles = []
const gridSize = 10
const spacing = 400 / gridSize

for (let row = 0; row < gridSize; row++) {
  for (let col = 0; col < gridSize; col++) {
    const x = spacing / 2 + col * spacing
    const y = spacing / 2 + row * spacing

    const circle = svg.circle(8)
      .center(x, y)
      .fill('#264653')

    circles.push({ element: circle, x, y })
  }
}

// Scale circles based on mouse proximity
svg.node.addEventListener('mousemove', (event) => {
  const coords = transformCoords(event)

  circles.forEach(({ element, x, y }) => {
    const distance = Math.sqrt(
      Math.pow(coords.x - x, 2) + Math.pow(coords.y - y, 2)
    )

    // Closer circles are larger
    const scale = map(
      Math.min(distance, 100),
      0, 100,
      3, 1
    )

    element.transform({ scale })
  })
})
```

### Touch Support

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { createCoordsTransformer, seedPRNG, random } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('touch-support')

const transformCoords = createCoordsTransformer(svg.node)

svg.rect(400, 400).fill('#f8f9fa')

function handlePointer(event) {
  // For touch events, use the first touch point
  const pointerEvent = event.touches ? event.touches[0] : event

  const coords = transformCoords(pointerEvent)

  svg.circle(random(10, 30))
    .center(coords.x, coords.y)
    .fill(random(['#e63946', '#2a9d8f', '#457b9d']))
}

// Support both mouse and touch
svg.node.addEventListener('mousemove', handlePointer)
svg.node.addEventListener('touchmove', (event) => {
  event.preventDefault()
  handlePointer(event)
})
```

## Notes

- Requires the native SVG element, not the SVG.JS wrapper object
- With SVG.JS, access the native element via the `.node` property
- Correctly handles viewBox scaling (e.g., viewBox="0 0 400 400" on a 800px wide element)
- Accounts for CSS transforms and SVG transforms applied to the root element
- The transformer reuses an internal SVGPoint for efficiency
- Works with mouse events (`clientX`/`clientY`) and touch events

## See Also

- [distToSegment](dist-to-segment.md) - Calculate distances for hit detection
- [createNoiseGrid](../geometry/create-noise-grid.md) - Use with lookup for interactive noise fields
