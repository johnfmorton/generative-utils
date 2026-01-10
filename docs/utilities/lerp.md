# lerp

Linear interpolation between two values.

## Description

`lerp` performs linear interpolation between two values based on a factor `t`. When `t` is 0, it returns the start value; when `t` is 1, it returns the end value; values in between produce proportional blends. This is a fundamental building block for smooth transitions, gradients, and blending in generative art.

## Syntax

```javascript
lerp(a, b, t)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `a` | `number` | - | Start value |
| `b` | `number` | - | End value |
| `t` | `number` | - | Interpolation factor (typically 0-1, but can extrapolate outside this range) |

## Return Value

| Type | Description |
|------|-------------|
| `number` | The interpolated value between `a` and `b` |

## Examples

### Basic Interpolation

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { lerp } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 100)

// Draw circles interpolating from left to right
const numCircles = 10

for (let i = 0; i < numCircles; i++) {
  const t = i / (numCircles - 1)

  // Interpolate x position
  const x = lerp(30, 370, t)

  // Interpolate size
  const size = lerp(10, 30, t)

  svg.circle(size)
    .center(x, 50)
    .fill('#264653')
}
```

### Color Component Blending

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { lerp } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 100)

// Blend between two colors
const colorA = { r: 230, g: 57, b: 70 }   // #e63946
const colorB = { r: 42, g: 157, b: 143 }  // #2a9d8f

const steps = 20

for (let i = 0; i < steps; i++) {
  const t = i / (steps - 1)

  const r = Math.round(lerp(colorA.r, colorB.r, t))
  const g = Math.round(lerp(colorA.g, colorB.g, t))
  const b = Math.round(lerp(colorA.b, colorB.b, t))

  svg.rect(400 / steps, 100)
    .move(i * (400 / steps), 0)
    .fill(`rgb(${r}, ${g}, ${b})`)
}
```

### Position Blending

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, lerp } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('position-blend')

// Define two anchor points
const pointA = { x: 100, y: 100 }
const pointB = { x: 300, y: 300 }

// Draw points along the line between them with random offsets
for (let i = 0; i <= 20; i++) {
  const t = i / 20

  const x = lerp(pointA.x, pointB.x, t) + random(-20, 20)
  const y = lerp(pointA.y, pointB.y, t) + random(-20, 20)

  svg.circle(8)
    .center(x, y)
    .fill('#457b9d')
    .opacity(lerp(0.3, 1, t))
}

// Show anchor points
svg.circle(12).center(pointA.x, pointA.y).fill('#e63946')
svg.circle(12).center(pointB.x, pointB.y).fill('#2a9d8f')
```

### Gradient Distribution

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { seedPRNG, random, lerp } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 400)
seedPRNG('gradient-dist')

// Create circles with size and opacity based on distance from center
const centerX = 200
const centerY = 200

for (let i = 0; i < 100; i++) {
  const x = random(0, 400)
  const y = random(0, 400)

  // Calculate normalized distance from center (0-1)
  const maxDist = Math.sqrt(200 * 200 + 200 * 200)
  const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
  const t = Math.min(dist / maxDist, 1)

  // Interpolate properties based on distance
  const size = lerp(20, 5, t)
  const opacity = lerp(1, 0.2, t)
  const hue = lerp(200, 280, t)

  svg.circle(size)
    .center(x, y)
    .fill(`hsl(${hue}, 60%, 50%)`)
    .opacity(opacity)
}
```

### Extrapolation (t outside 0-1)

```javascript
import { SVG } from '@svgdotjs/svg.js'
import { lerp } from '@johnfmorton/generative-utils'

const svg = SVG().addTo('#container').viewbox(0, 0, 400, 100)

// lerp can extrapolate beyond the original range
const values = [-0.5, 0, 0.25, 0.5, 0.75, 1, 1.5]

values.forEach((t, i) => {
  const x = 30 + i * 50
  const y = lerp(70, 30, t)  // Will go outside 30-70 range

  svg.circle(10)
    .center(x, y)
    .fill(t >= 0 && t <= 1 ? '#2a9d8f' : '#e63946')

  svg.text(t.toString())
    .move(x - 10, 80)
    .font({ size: 10, family: 'monospace' })
})
```

## Notes

- Unlike `map`, which converts between ranges, `lerp` always starts from value `a` and ends at value `b`
- Values of `t` outside 0-1 will extrapolate beyond the given range
- Formula: `a + (b - a) * t`
- To convert a value to a `t` factor, use inverse lerp: `t = (value - a) / (b - a)`
- Commonly used for: position blending, color interpolation, smooth transitions, gradient effects

## See Also

- [map](map.md) - Convert values between different ranges
- [clamp](clamp.md) - Constrain values within a range
