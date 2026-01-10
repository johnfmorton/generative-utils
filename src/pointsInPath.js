/**
 * Extract evenly-spaced points along an SVG path element.
 *
 * @param {SVGPathElement} path - An SVG path DOM element
 * @param {number} [numPoints=10] - Number of points to extract
 * @returns {Array<{x: number, y: number}>} Array of points along the path
 * @example
 * const pathEl = document.querySelector('path')
 * const points = pointsInPath(pathEl, 20)
 */
function pointsInPath(path, numPoints = 10) {
  if (numPoints < 1) {
    return []
  }

  const pathLength = path.getTotalLength()

  if (numPoints === 1) {
    return [path.getPointAtLength(0)]
  }

  const step = pathLength / (numPoints - 1)
  const points = []

  for (let i = 0; i < numPoints - 1; i++) {
    points.push(path.getPointAtLength(i * step))
  }

  // Ensure the last point is the end of the path
  points.push(path.getPointAtLength(pathLength))

  return points
}

export { pointsInPath };
