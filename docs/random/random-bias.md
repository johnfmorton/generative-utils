# randomBias

Generate random values biased toward a target value.

## Description

`randomBias` generates random numbers within a range that tend toward a specified bias value. This is useful for creating distributions that cluster around a point while still allowing variation. The `influence` parameter controls how strongly values are pulled toward the bias.

## Syntax

```javascript
randomBias(min, max, bias, influence)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `min` | `number` | - | Minimum value |
| `max` | `number` | - | Maximum value |
| `bias` | `number` | - | Target value to bias toward |
| `influence` | `number` | `0.5` | Strength of bias from 0 (no bias) to 1 (strong bias) |

## Return Value

| Type | Description |
|------|-------------|
| `number` | A random number between min and max, weighted toward the bias value |

## Examples

### Clustering Shapes at Center

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, randomBias } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('center-cluster')

// Generate circles clustered toward the center
for (let i = 0; i < 100; i++) {
  const x = randomBias(0, 400, 200, 0.7)  // Biased toward center (200)
  const y = randomBias(0, 400, 200, 0.7)

  svg.circle(6)
    .center(x, y)
    .fill('#264653')
    .opacity(0.6)
}
```

### Comparing Influence Levels

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, randomBias } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 300)
seedPRNG('influence-comparison')

const influences = [0, 0.3, 0.6, 0.9]
const colors = ['#e63946', '#f4a261', '#2a9d8f', '#264653']

influences.forEach((influence, row) => {
  const yBase = row * 75 + 37.5

  for (let i = 0; i < 50; i++) {
    const x = randomBias(20, 380, 200, influence)

    svg.circle(4)
      .center(x, yBase)
      .fill(colors[row])
      .opacity(0.7)
  }

  // Label
  svg.text(`influence: ${influence}`)
    .move(10, yBase + 20)
    .font({ size: 10, family: 'monospace' })
})
```

### Biased Size Distribution

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, randomBias } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('biased-sizes')

// Most shapes will be small (biased toward 10), but some will be larger
for (let i = 0; i < 40; i++) {
  const x = random(50, 350)
  const y = random(50, 350)
  const size = randomBias(10, 80, 15, 0.6)  // Bias toward smaller sizes

  svg.rect(size, size)
    .center(x, y)
    .fill('#457b9d')
    .opacity(0.5)
}
```

### Creating Focal Points

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, randomBias } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('focal-points')

// Define multiple focal points
const focalPoints = [
  { x: 100, y: 100 },
  { x: 300, y: 150 },
  { x: 200, y: 300 }
]

focalPoints.forEach((focal, index) => {
  const colors = ['#e63946', '#2a9d8f', '#f4a261']

  // Generate particles around each focal point
  for (let i = 0; i < 30; i++) {
    const x = randomBias(0, 400, focal.x, 0.8)
    const y = randomBias(0, 400, focal.y, 0.8)

    svg.circle(random(3, 8))
      .center(x, y)
      .fill(colors[index])
      .opacity(0.6)
  }
})
```

## Notes

- The `influence` parameter blends between pure random (0) and the bias value (1)
- Values can still fall anywhere in the min-max range, but cluster around the bias
- The bias value doesn't need to be within the min-max range, though it typically is
- Useful for creating natural-looking distributions and visual weight

## See Also

- [random](random.md) - Generate uniform random values
- [randomSnap](random-snap.md) - Generate values snapped to intervals
- [seedPRNG](seed-prng.md) - Seed the random number generator
