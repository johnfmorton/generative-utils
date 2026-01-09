# map

Linear interpolation between ranges.

## Description

`map` remaps a number from one range to another. Given a value in an input range, it returns the corresponding value in an output range. This is equivalent to the `map()` function in Processing and p5.js, and is essential for converting values between different scales (e.g., noise values to colors, positions to sizes).

## Syntax

```javascript
map(n, start1, end1, start2, end2)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `n` | `number` | - | The value to remap |
| `start1` | `number` | - | Lower bound of the input range |
| `end1` | `number` | - | Upper bound of the input range |
| `start2` | `number` | - | Lower bound of the output range |
| `end2` | `number` | - | Upper bound of the output range |

## Return Value

| Type | Description |
|------|-------------|
| `number` | The remapped value in the output range |

## Examples

### Noise to Color

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { createNoiseGrid, map } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const noiseGrid = createNoiseGrid({
  width: 400,
  height: 400,
  resolution: 20,
  seed: 42
})

noiseGrid.cells.forEach(cell => {
  // Map noise value (-1 to 1) to lightness (20% to 80%)
  const lightness = map(cell.noiseValue, -1, 1, 20, 80)

  svg.rect(cell.width, cell.height)
    .move(cell.x, cell.y)
    .fill(`hsl(200, 60%, ${lightness}%)`)
})
```

### Position to Size

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, map } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('position-to-size')

for (let i = 0; i < 50; i++) {
  const x = random(20, 380)
  const y = random(20, 380)

  // Circles get larger toward the right
  const size = map(x, 0, 400, 5, 30)

  svg.circle(size)
    .center(x, y)
    .fill('#264653')
    .opacity(0.7)
}
```

### Distance to Opacity

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, map } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('distance-opacity')

const centerX = 200
const centerY = 200
const maxDistance = Math.sqrt(200 * 200 + 200 * 200)

for (let i = 0; i < 100; i++) {
  const x = random(0, 400)
  const y = random(0, 400)

  // Calculate distance from center
  const distance = Math.sqrt(
    Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
  )

  // Map distance to opacity (closer = more opaque)
  const opacity = map(distance, 0, maxDistance, 1, 0.1)

  svg.circle(15)
    .center(x, y)
    .fill('#e63946')
    .opacity(opacity)
}
```

### Index to Hue

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { map } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const numCircles = 20

for (let i = 0; i < numCircles; i++) {
  // Map index to position
  const x = map(i, 0, numCircles - 1, 30, 370)

  // Map index to hue (full color spectrum)
  const hue = map(i, 0, numCircles - 1, 0, 360)

  svg.circle(30)
    .center(x, 200)
    .fill(`hsl(${hue}, 70%, 50%)`)
}
```

### Angle to Position

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { map } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

const numPoints = 36
const centerX = 200
const centerY = 200

for (let i = 0; i < numPoints; i++) {
  // Map index to angle
  const angle = map(i, 0, numPoints, 0, Math.PI * 2)

  // Map index to radius (spiral effect)
  const radius = map(i, 0, numPoints - 1, 30, 150)

  const x = centerX + Math.cos(angle) * radius
  const y = centerY + Math.sin(angle) * radius

  svg.circle(8)
    .center(x, y)
    .fill('#2a9d8f')
}
```

### Inverting Values

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, map } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('inverted')

for (let i = 0; i < 30; i++) {
  const x = random(30, 370)
  const y = random(30, 370)

  // Invert: higher Y position = smaller circle (by swapping output range)
  const size = map(y, 0, 400, 30, 5)

  svg.circle(size)
    .center(x, y)
    .fill('#457b9d')
}
```

### Eased Animation Values

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { map } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 100)

// Visualize different progress values
const steps = 20

for (let i = 0; i <= steps; i++) {
  const progress = i / steps  // 0 to 1

  // Map progress to x position
  const x = map(progress, 0, 1, 30, 370)

  // Map progress to size
  const size = map(progress, 0, 1, 5, 25)

  // Map progress to color
  const hue = map(progress, 0, 1, 200, 340)

  svg.circle(size)
    .center(x, 50)
    .fill(`hsl(${hue}, 70%, 50%)`)
}
```

## Notes

- No clamping is applied: values outside the input range will extrapolate beyond the output range
- To clamp values, use `Math.min(Math.max(result, start2), end2)` on the output
- Works with inverted ranges: `map(n, 0, 100, 100, 0)` inverts the value
- Equivalent to the linear interpolation formula: `((n - start1) / (end1 - start1)) * (end2 - start2) + start2`
- Common use cases: noise → visual properties, position → attributes, index → coordinates

## See Also

- [createNoiseGrid](../geometry/create-noise-grid.md) - Often used with map for noise visualization
- [random](../random/random.md) - Generate values to remap
