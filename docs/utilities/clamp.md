# clamp

Constrain a value within a range.

## Description

`clamp` restricts a value to lie within a specified minimum and maximum range. If the value is below the minimum, it returns the minimum; if above the maximum, it returns the maximum; otherwise, it returns the value unchanged. This is essential for keeping values within valid bounds, preventing overflow, and ensuring visual elements stay within their intended constraints.

## Syntax

```javascript
clamp(value, min, max)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `number` | - | The value to constrain |
| `min` | `number` | - | The minimum allowed value |
| `max` | `number` | - | The maximum allowed value |

## Return Value

| Type | Description |
|------|-------------|
| `number` | The value constrained to the range [min, max] |

## Examples

### Keeping Elements in Bounds

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, clamp } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('bounds-check')

// Generate circles that stay within the canvas
for (let i = 0; i < 50; i++) {
  // Random position with potential overflow
  let x = random(-50, 450)
  let y = random(-50, 450)

  // Clamp to ensure circles stay visible
  x = clamp(x, 20, 380)
  y = clamp(y, 20, 380)

  svg.circle(15)
    .center(x, y)
    .fill('#264653')
    .opacity(0.7)
}
```

### Clamped Color Values

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, clamp } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('clamped-colors')

for (let i = 0; i < 100; i++) {
  const x = random(0, 400)
  const y = random(0, 400)

  // Generate potentially out-of-range color values
  let lightness = random(-20, 120)

  // Clamp to valid percentage range
  lightness = clamp(lightness, 10, 90)

  svg.circle(20)
    .center(x, y)
    .fill(`hsl(200, 60%, ${lightness}%)`)
}
```

### Safe Division with Clamp

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, clamp, map } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('safe-division')

for (let row = 0; row < 10; row++) {
  for (let col = 0; col < 10; col++) {
    const x = col * 40 + 20
    const y = row * 40 + 20

    // Calculate some ratio that might produce extreme values
    const noise = random(-2, 2)
    const ratio = 1 / (0.5 + noise)

    // Clamp to reasonable range before using
    const safeRatio = clamp(ratio, 0.2, 5)

    const size = 15 * safeRatio

    svg.circle(clamp(size, 3, 35))
      .center(x, y)
      .fill('#2a9d8f')
  }
}
```

### Clamping with Map

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { createNoiseGrid, map, clamp } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const noiseGrid = createNoiseGrid({
  width: 400,
  height: 400,
  resolution: 20,
  seed: 42
})

noiseGrid.cells.forEach(cell => {
  // Map noise to a size value
  let size = map(cell.noiseValue, -1, 1, -5, 25)

  // Clamp to ensure minimum visibility
  size = clamp(size, 3, 20)

  svg.circle(size)
    .center(cell.x + cell.width / 2, cell.y + cell.height / 2)
    .fill('#457b9d')
})
```

### Movement Constraints

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { clamp } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

// Draw boundary
svg.rect(360, 360)
  .move(20, 20)
  .fill('none')
  .stroke({ color: '#ccc', width: 2 })

// Draggable circle that stays within bounds
const circle = svg.circle(30)
  .center(200, 200)
  .fill('#e63946')

let dragging = false
let offset = { x: 0, y: 0 }

circle.on('mousedown', (e) => {
  dragging = true
  offset.x = e.clientX - circle.cx()
  offset.y = e.clientY - circle.cy()
})

svg.on('mousemove', (e) => {
  if (!dragging) return

  let newX = e.clientX - offset.x
  let newY = e.clientY - offset.y

  // Clamp position to keep circle within bounds
  newX = clamp(newX, 35, 365)
  newY = clamp(newY, 35, 365)

  circle.center(newX, newY)
})

svg.on('mouseup', () => {
  dragging = false
})
```

### Normalized Value Clamping

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { lerp, clamp } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 100)

// Sometimes interpolation factors can drift outside 0-1
const tValues = [-0.2, 0, 0.3, 0.5, 0.7, 1, 1.3]

tValues.forEach((t, i) => {
  // Clamp t to valid range
  const safet = clamp(t, 0, 1)

  const x = 30 + i * 50
  const size = lerp(5, 25, safet)

  svg.circle(size)
    .center(x, 50)
    .fill(t === safet ? '#2a9d8f' : '#e63946')

  svg.text(`t=${t}`)
    .move(x - 15, 75)
    .font({ size: 9, family: 'monospace' })
})
```

## Notes

- Equivalent to `Math.min(Math.max(value, min), max)`
- If `min > max`, behavior may be unexpected; ensure `min <= max`
- Commonly paired with `map` to clamp output values
- Useful for: boundary checking, safe color values, constraining positions, normalizing ratios
- Does not modify the original value; returns a new clamped value

## See Also

- [map](map.md) - Convert values between ranges (no clamping by default)
- [lerp](lerp.md) - Linear interpolation between values
