import SimplexNoise from "simplex-noise";

/**
 * @typedef {Object} NoiseCell
 * @property {number} x - Cell x position
 * @property {number} y - Cell y position
 * @property {number} width - Cell width
 * @property {number} height - Cell height
 * @property {number} noiseValue - Simplex noise value (-1 to 1)
 */

/**
 * @typedef {Object} NoiseGridResult
 * @property {NoiseCell[]} cells - Array of noise cells
 * @property {function({x: number, y: number}): NoiseCell} lookup - Get cell at a position
 */

const defaultOpts = {
  width: 200,
  height: 200,
  resolution: 8,
  xInc: 0.01,
  yInc: 0.01,
  seed: Math.random() * 1000,
};

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

function lookup(cells, width, height, cols, resolution) {
  return function (pos) {
    const x = Math.floor(clamp(pos.x, 0, width - 1) / resolution);
    const y = Math.floor(clamp(pos.y, 0, height - 1) / resolution);

    return cells[x + y * cols];
  };
}

/**
 * Create a grid of simplex noise values, useful for flow fields and textures.
 *
 * @param {Object} [opts] - Configuration options
 * @param {number} [opts.width=200] - Grid width in pixels
 * @param {number} [opts.height=200] - Grid height in pixels
 * @param {number} [opts.resolution=8] - Number of cells in each dimension
 * @param {number} [opts.xInc=0.01] - Noise x increment (lower = smoother)
 * @param {number} [opts.yInc=0.01] - Noise y increment (lower = smoother)
 * @param {number} [opts.seed] - Random seed for reproducible noise
 * @returns {NoiseGridResult} Grid with cells and lookup function
 * @example
 * const grid = createNoiseGrid({ width: 400, height: 400, resolution: 20 })
 * // Get noise at any position
 * const cell = grid.lookup({ x: 150, y: 200 })
 * const angle = cell.noiseValue * Math.PI * 2 // Use for flow field
 */
function createNoiseGrid(opts) {
  opts = Object.assign({}, defaultOpts, opts);

  const simplex = new SimplexNoise(opts.seed);

  const numCols = opts.resolution;
  const numRows = opts.resolution;
  const colSize = opts.width / numCols;
  const rowSize = opts.height / numRows;

  const cells = new Array(numCols * numRows);

  let yOff = 0;

  for (let y = 0; y < opts.height; y += rowSize) {
    let xOff = 0;

    for (let x = 0; x < opts.width; x += colSize) {
      const col = Math.floor(x / colSize);
      const row = Math.floor(y / rowSize);
      cells[col + row * numCols] = {
        x,
        y,
        width: colSize,
        height: rowSize,
        noiseValue: simplex.noise2D(xOff, yOff),
      };

      xOff += opts.xInc;
    }

    yOff += opts.yInc;
  }

  return {
    cells,
    lookup: lookup(
      cells,
      opts.width,
      opts.height,
      numCols,
      Math.max(colSize, rowSize)
    ),
  };
}

export { createNoiseGrid };
