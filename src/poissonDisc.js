import { prng } from './prng.js';

/**
 * Generate evenly-distributed points using Poisson disc sampling.
 * Uses Bridson's algorithm for O(n) performance.
 *
 * @param {Object} options - Configuration options
 * @param {number} options.width - Width of the sampling area
 * @param {number} options.height - Height of the sampling area
 * @param {number} options.radius - Minimum distance between points
 * @param {number} [options.maxAttempts=30] - Attempts to place each new point
 * @returns {Array<{x: number, y: number}>} Array of sample points
 */
export function poissonDisc(options) {
  const opts = Object.assign(
    {
      width: 100,
      height: 100,
      radius: 10,
      maxAttempts: 30
    },
    options
  );

  const { width, height, radius, maxAttempts } = opts;

  // Cell size for the spatial grid (radius / sqrt(2) ensures at most one point per cell)
  const cellSize = radius / Math.SQRT2;
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);

  // Grid stores indices into the points array (-1 = empty)
  const grid = new Array(gridWidth * gridHeight).fill(-1);

  // All accepted points
  const points = [];

  // Active list of points to try spawning from
  const active = [];

  // Helper to get grid cell index
  const gridIndex = (x, y) => {
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    return row * gridWidth + col;
  };

  // Check if a point is valid (within bounds and far enough from neighbors)
  const isValid = (x, y) => {
    // Check bounds
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return false;
    }

    // Get grid cell
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    // Check neighboring cells (5x5 grid centered on point's cell)
    const minCol = Math.max(0, col - 2);
    const maxCol = Math.min(gridWidth - 1, col + 2);
    const minRow = Math.max(0, row - 2);
    const maxRow = Math.min(gridHeight - 1, row + 2);

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const idx = r * gridWidth + c;
        const pointIdx = grid[idx];

        if (pointIdx !== -1) {
          const other = points[pointIdx];
          const dx = other.x - x;
          const dy = other.y - y;
          const distSq = dx * dx + dy * dy;

          if (distSq < radius * radius) {
            return false;
          }
        }
      }
    }

    return true;
  };

  // Add a point to the grid and active list
  const addPoint = (x, y) => {
    const point = { x, y };
    const idx = points.length;
    points.push(point);
    active.push(idx);
    grid[gridIndex(x, y)] = idx;
    return point;
  };

  // Generate random point in annulus between radius and 2*radius
  const randomPointAround = (point) => {
    const angle = prng() * Math.PI * 2;
    const r = radius + prng() * radius; // Between radius and 2*radius
    return {
      x: point.x + Math.cos(angle) * r,
      y: point.y + Math.sin(angle) * r
    };
  };

  // Start with a random point
  const startX = prng() * width;
  const startY = prng() * height;
  addPoint(startX, startY);

  // Process active list
  while (active.length > 0) {
    // Pick a random active point
    const activeIdx = Math.floor(prng() * active.length);
    const pointIdx = active[activeIdx];
    const point = points[pointIdx];

    let found = false;

    // Try to find a valid point around it
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const candidate = randomPointAround(point);

      if (isValid(candidate.x, candidate.y)) {
        addPoint(candidate.x, candidate.y);
        found = true;
        break;
      }
    }

    // If no valid point found, remove from active list
    if (!found) {
      active.splice(activeIdx, 1);
    }
  }

  return points;
}
