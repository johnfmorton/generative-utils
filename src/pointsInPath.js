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
