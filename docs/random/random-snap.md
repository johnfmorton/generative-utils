# randomSnap

Generate random values snapped to regular intervals.

## Description

`randomSnap` generates random numbers within a range that are snapped to multiples of a specified increment. This is useful for creating grid-aligned positions, quantized values, or stepped variations in generative artwork.

## Syntax

```javascript
randomSnap(min, max, snapInc)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `min` | `number` | - | Minimum value |
| `max` | `number` | - | Maximum value |
| `snapInc` | `number` | - | The interval to snap values to |

## Return Value

| Type | Description |
|------|-------------|
| `number` | A random number between min and max, snapped to the nearest multiple of snapInc |

## Examples

### Grid-Aligned Positions

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, randomSnap } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('grid-snap')

const gridSize = 40

// Place circles on grid intersections
for (let i = 0; i < 20; i++) {
  const x = randomSnap(0, 400, gridSize)
  const y = randomSnap(0, 400, gridSize)

  svg.circle(30)
    .center(x, y)
    .fill('#264653')
}
```

### Quantized Sizes

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, randomSnap } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('quantized-sizes')

// Shapes with sizes in increments of 25
for (let i = 0; i < 15; i++) {
  const x = random(50, 350)
  const y = random(50, 350)
  const size = randomSnap(25, 100, 25)  // Results: 25, 50, 75, or 100

  svg.rect(size, size)
    .center(x, y)
    .fill('#e63946')
    .opacity(0.6)
}
```

### Stepped Rotation

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, randomSnap } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('stepped-rotation')

// Rectangles rotated in 45-degree increments
for (let i = 0; i < 12; i++) {
  const x = random(50, 350)
  const y = random(50, 350)
  const rotation = randomSnap(0, 360, 45)  // 0, 45, 90, 135, 180, 225, 270, or 315

  svg.rect(60, 20)
    .center(x, y)
    .fill('#2a9d8f')
    .rotate(rotation)
}
```

### Musical/Rhythmic Spacing

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, randomSnap } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 100)
seedPRNG('rhythm-pattern')

const beatWidth = 50  // Base unit

let x = 25
while (x < 400) {
  const width = randomSnap(25, 100, 25)  // 25, 50, 75, or 100
  const height = randomSnap(20, 80, 20)

  svg.rect(width - 5, height)
    .move(x, (100 - height) / 2)
    .fill('#457b9d')
    .radius(3)

  x += width
}
```

### Color Value Stepping

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, randomSnap } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('color-steps')

// Generate shapes with stepped hue values
for (let i = 0; i < 30; i++) {
  const x = random(20, 380)
  const y = random(20, 380)
  const hue = randomSnap(0, 360, 30)  // 12 possible hues
  const lightness = randomSnap(40, 70, 10)

  svg.circle(random(15, 40))
    .center(x, y)
    .fill(`hsl(${hue}, 70%, ${lightness}%)`)
}
```

## Notes

- The snap is applied using `Math.round()`, so values snap to the nearest increment
- Results will include values at both ends of the range if they align with the snap increment
- Useful for creating cohesive, systematic designs where random elements still feel ordered
- Combine with `random` for hybrid approaches (some values snapped, others continuous)

## See Also

- [random](random.md) - Generate continuous random values
- [randomBias](random-bias.md) - Generate biased random values
- [seedPRNG](seed-prng.md) - Seed the random number generator
