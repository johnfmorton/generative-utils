import Quadtree from "@timohausmann/quadtree-js";

/**
 * @typedef {Object} QtGridArea
 * @property {number} x - X position (with gap applied)
 * @property {number} y - Y position (with gap applied)
 * @property {number} width - Width (with gap applied)
 * @property {number} height - Height (with gap applied)
 * @property {{start: number, end: number}} col - Column range in grid units
 * @property {{start: number, end: number}} row - Row range in grid units
 */

/**
 * @typedef {Object} QtGridResult
 * @property {number} width - Total grid width
 * @property {number} height - Total grid height
 * @property {number} cols - Number of columns at maximum subdivision
 * @property {number} rows - Number of rows at maximum subdivision
 * @property {QtGridArea[]} areas - Array of subdivided areas
 */

const defaultQtOpts = {
  width: 1024,
  height: 1024,
  points: [],
  gap: 0,
  maxQtObjects: 10,
  maxQtLevels: 4,
};

function getGridArea(bounds, colSize, rowSize) {
  return {
    col: {
      start: bounds.x / colSize,
      end: (bounds.x + bounds.width) / colSize,
    },
    row: {
      start: bounds.y / rowSize,
      end: (bounds.y + bounds.height) / rowSize,
    },
  };
}

function getIndividualQtNodes(node) {
  const individualNodes = [];

  (function r(node) {
    if (node.nodes.length === 0) {
      individualNodes.push(node);
    } else {
      node.nodes.forEach((n) => r(n));
    }
  })(node);

  return individualNodes;
}

/**
 * Create an adaptive grid using quadtree subdivision based on point density.
 * Areas with more points subdivide further, creating varied cell sizes.
 *
 * @param {Object} [opts] - Configuration options
 * @param {number} [opts.width=1024] - Grid width
 * @param {number} [opts.height=1024] - Grid height
 * @param {Array<{x: number, y: number}>} [opts.points=[]] - Points that drive subdivision
 * @param {number} [opts.gap=0] - Gap between cells
 * @param {number} [opts.maxQtObjects=10] - Max points per cell before subdividing
 * @param {number} [opts.maxQtLevels=4] - Maximum subdivision depth
 * @returns {QtGridResult} Grid with subdivided areas
 * @example
 * const grid = createQtGrid({
 *   width: 800,
 *   height: 600,
 *   points: [{x: 100, y: 100}, {x: 105, y: 105}],
 *   maxQtLevels: 3
 * })
 * grid.areas.forEach(area => drawRect(area.x, area.y, area.width, area.height))
 */
function createQtGrid(opts) {
  opts = Object.assign({}, defaultQtOpts, opts);

  const quadTree = new Quadtree(
    {
      x: 0,
      y: 0,
      width: opts.width,
      height: opts.height,
    },
    opts.maxQtObjects,
    opts.maxQtLevels
  );

  opts.points.forEach((point) => {
    quadTree.insert(point);
  });

  const maxSubdivisions = Math.pow(2, opts.maxQtLevels);
  const colSize = opts.width / maxSubdivisions;
  const rowSize = opts.height / maxSubdivisions;

  return {
    width: opts.width,
    height: opts.height,
    cols: maxSubdivisions,
    rows: maxSubdivisions,
    areas: getIndividualQtNodes(quadTree).map(({ bounds }) => {
      return {
        x: bounds.x + opts.gap,
        y: bounds.y + opts.gap,
        width: bounds.width - opts.gap * 2,
        height: bounds.height - opts.gap * 2,
        ...getGridArea(bounds, colSize, rowSize),
      };
    }),
  };
}

export { createQtGrid };
