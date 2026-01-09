# random

Generate random values within a range or select random elements from an array.

## Description

`random` is the core random function that powers all randomization in generative-utils. It has two modes: range mode for generating numeric values between min and max, and array mode for selecting random elements. All values are generated using the seeded PRNG, so results are reproducible when `seedPRNG` is called first.

## Syntax

```javascript
// Range mode
random(min, max)
random(min, max, clamp)

// Array mode
random(array)
```

## Parameters

### Range Mode

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `min` | `number` | - | Minimum value (inclusive) |
| `max` | `number` | - | Maximum value (inclusive when clamped) |
| `clamp` | `boolean` | `false` | If `true`, rounds result to nearest integer |

### Array Mode

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `array` | `Array` | - | Array to select a random element from |

## Return Value

| Type | Description |
|------|-------------|
| `number` | Range mode: A random number between min and max |
| `any` | Array mode: A random element from the array |

## Examples

### Random Positions

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('random-positions')

// Generate circles at random positions
for (let i = 0; i < 20; i++) {
  const x = random(50, 350)
  const y = random(50, 350)

  svg.circle(10).center(x, y).fill('#333')
}
```

### Integer Values with Clamp

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('grid-example')

// Create a grid with random integer column spans
const gridSize = 50

for (let y = 0; y < 400; y += gridSize) {
  let x = 0
  while (x < 400) {
    // Random span of 1-3 grid units (integers only)
    const span = random(1, 3, true)
    const width = span * gridSize

    svg.rect(width - 4, gridSize - 4)
      .move(x + 2, y + 2)
      .fill('#457b9d')

    x += width
  }
}
```

### Random Selection from Array

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('color-palette')

const colors = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']
const shapes = ['circle', 'rect', 'polygon']

for (let i = 0; i < 15; i++) {
  const x = random(50, 350)
  const y = random(50, 350)
  const color = random(colors)
  const shape = random(shapes)

  if (shape === 'circle') {
    svg.circle(40).center(x, y).fill(color)
  } else if (shape === 'rect') {
    svg.rect(40, 40).center(x, y).fill(color)
  } else {
    svg.polygon('0,20 20,0 40,20 20,40').center(x, y).fill(color)
  }
}
```

### Combining Range and Array Modes

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('combined-example')

const palette = ['#003049', '#d62828', '#f77f00', '#fcbf49', '#eae2b7']

for (let i = 0; i < 30; i++) {
  svg.circle(random(10, 50))
    .center(random(0, 400), random(0, 400))
    .fill(random(palette))
    .opacity(random(0.3, 1))
}
```

## Notes

- When `clamp` is `true`, values are rounded using `Math.round()`, so both min and max are achievable
- Array mode uses integer indexing internally, so it works with any array type
- The function uses the shared PRNG instance, so all random functions stay in sync

## See Also

- [seedPRNG](seed-prng.md) - Seed the random number generator
- [randomBias](random-bias.md) - Generate values biased toward a target
- [randomSnap](random-snap.md) - Generate values snapped to intervals
