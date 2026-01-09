# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a JavaScript library (`@johnfmorton/generative-utils`) providing utility functions for generative art. It's published as an npm package with both ESM and CommonJS builds.

## Build Commands

```bash
npm run build          # Build both ESM and CJS bundles
npm run build-module   # Build ESM bundle only (dist/esm/index.js)
npm run build-cjs      # Build CJS bundle only (dist/cjs/index.js)
```

The build uses esbuild to bundle and minify `src/index.js` into distribution formats.

## Architecture

All utility functions are in `src/` and exported through `src/index.js`:

**Random Number Generation**
- `prng.js` - Seedable pseudo-random number generator using seedrandom. The `prng` instance is shared across all random functions.
- `random.js` - Core random function: `random(min, max)` for numbers, `random(array)` for array elements
- `randomBias.js` - Biased random: generates values weighted toward a bias point
- `randomSnap.js` - Random values snapped to intervals

**Generative Geometry**
- `spline.js` - Catmull-Rom spline that generates SVG path strings from points. Supports tension control and closed paths. Optional callback provides path commands as they're generated.
- `createVoronoiDiagram.js` - Voronoi tessellation with Lloyd's relaxation. Uses d3-delaunay. Returns cells with centroids, inner circle radii, and neighbor references.
- `createQtGrid.js` - Quadtree-based grid subdivision using @timohausmann/quadtree-js. Creates adaptive grids that subdivide around point density.
- `createNoiseGrid.js` - Simplex noise grid with a `lookup(pos)` function for flow fields

**Utilities**
- `map.js` - Linear interpolation between ranges (like Processing's map function)
- `pointsInPath.js` - Extract evenly-spaced points along an SVG path element
- `createCoordsTransformer.js` - Convert mouse coordinates to SVG coordinate space
- `distToSegment.js` - Calculate distance from point to line segment

## Key Dependencies

- `seedrandom` - PRNG seeding
- `d3-delaunay` / `d3` - Voronoi diagrams and polygon operations
- `simplex-noise` - Noise generation
- `@timohausmann/quadtree-js` - Quadtree spatial indexing
