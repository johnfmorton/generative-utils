# seedPRNG

Seed the pseudo-random number generator for reproducible results.

## Description

`seedPRNG` initializes the internal random number generator with a specific seed value. When you use the same seed, all subsequent calls to `random`, `randomBias`, and `randomSnap` will produce identical sequences of values. This is essential for creating reproducible generative artwork.

## Syntax

```javascript
seedPRNG(seed)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `seed` | `string \| number` | - | The seed value to initialize the random number generator |

## Return Value

| Type | Description |
|------|-------------|
| `void` | This function does not return a value |

## Examples

### Basic Usage

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random } from '@georgedoescode/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)

// Seed the PRNG for reproducible results
seedPRNG('my-artwork-2024')

// These values will be identical every time with this seed
for (let i = 0; i < 10; i++) {
  const x = random(0, 400)
  const y = random(0, 400)
  const radius = random(5, 20)

  svg.circle(radius * 2)
    .center(x, y)
    .fill('#333')
}
```

### Using Seeds for Variations

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random } from '@georgedoescode/generative-utils'

function generateArtwork(seed) {
  const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
  svg.clear()

  seedPRNG(seed)

  const numShapes = random(5, 15, true)

  for (let i = 0; i < numShapes; i++) {
    svg.rect(random(20, 100), random(20, 100))
      .move(random(0, 300), random(0, 300))
      .fill(random(['#e63946', '#457b9d', '#1d3557']))
  }
}

// Generate different but reproducible variations
generateArtwork('variation-1')
generateArtwork('variation-2')
generateArtwork('variation-1') // Identical to first call
```

## Notes

- Call `seedPRNG` before any random functions to ensure full reproducibility
- The seed can be any string or number - use descriptive names for easy identification
- Without calling `seedPRNG`, the library uses a default unseeded random generator
- Re-calling `seedPRNG` resets the sequence, so you can regenerate the same artwork

## See Also

- [random](random.md) - Generate random values using the seeded PRNG
- [randomBias](random-bias.md) - Generate biased random values
- [randomSnap](random-snap.md) - Generate snapped random values
