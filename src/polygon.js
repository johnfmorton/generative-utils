/**
 * Generate regular polygon vertices.
 *
 * @param {Object} options - Configuration options
 * @param {number} options.sides - Number of sides (3 = triangle, 4 = square, etc.)
 * @param {number} options.radius - Distance from center to vertices
 * @param {number} [options.cx=0] - Center x coordinate
 * @param {number} [options.cy=0] - Center y coordinate
 * @param {number} [options.rotation=0] - Rotation angle in radians
 * @returns {Array<{x: number, y: number}>} Array of vertex points
 */
export function polygon(options) {
  const opts = Object.assign(
    {
      sides: 6,
      radius: 50,
      cx: 0,
      cy: 0,
      rotation: 0
    },
    options
  );

  const { sides, radius, cx, cy, rotation } = opts;
  const points = [];

  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + rotation;
    points.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius
    });
  }

  return points;
}

/**
 * Generate star polygon vertices.
 *
 * @param {Object} options - Configuration options
 * @param {number} options.points - Number of points on the star
 * @param {number} options.outerRadius - Distance from center to outer points
 * @param {number} options.innerRadius - Distance from center to inner points
 * @param {number} [options.cx=0] - Center x coordinate
 * @param {number} [options.cy=0] - Center y coordinate
 * @param {number} [options.rotation=0] - Rotation angle in radians
 * @returns {Array<{x: number, y: number}>} Array of vertex points (alternating outer/inner)
 */
export function star(options) {
  const opts = Object.assign(
    {
      points: 5,
      outerRadius: 50,
      innerRadius: 25,
      cx: 0,
      cy: 0,
      rotation: 0
    },
    options
  );

  const { points: numPoints, outerRadius, innerRadius, cx, cy, rotation } = opts;
  const vertices = [];
  const totalVertices = numPoints * 2;

  for (let i = 0; i < totalVertices; i++) {
    const angle = (i / totalVertices) * Math.PI * 2 + rotation;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    vertices.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius
    });
  }

  return vertices;
}

/**
 * Convert an array of points to an SVG path string.
 *
 * @param {Array<{x: number, y: number}>} points - Array of points
 * @param {boolean} [close=true] - Whether to close the path
 * @returns {string} SVG path string
 */
export function pointsToPath(points, close = true) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;

  let path = `M${points[0].x},${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    path += `L${points[i].x},${points[i].y}`;
  }

  if (close) {
    path += 'Z';
  }

  return path;
}
