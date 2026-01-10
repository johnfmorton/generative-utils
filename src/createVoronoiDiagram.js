import { Delaunay } from "d3-delaunay";
import { polygonCentroid } from "d3";
import { distToSegment } from "./distToSegment";

const defaultOpts = {
  width: 1024,
  height: 1024,
  points: [],
  relaxIterations: 8,
  relaxationFactor: 0.5,
};

function createVoronoiDiagram(opts) {
  opts = Object.assign({}, defaultOpts, opts);

  opts.points = opts.points.map((point) => [point.x, point.y]);

  const delaunay = Delaunay.from(opts.points);
  const voronoi = delaunay.voronoi([0, 0, opts.width, opts.height]);

  const diagramPoints = [];

  for (let k = 0; k < opts.relaxIterations; k++) {
    for (let i = 0; i < delaunay.points.length; i += 2) {
      const cell = voronoi.cellPolygon(i >> 1);

      if (cell === null) continue;

      const x0 = delaunay.points[i];
      const y0 = delaunay.points[i + 1];

      const [x1, y1] = polygonCentroid(cell);

      delaunay.points[i] = x0 + (x1 - x0) * opts.relaxationFactor;
      delaunay.points[i + 1] = y0 + (y1 - y0) * opts.relaxationFactor;
    }

    voronoi.update();
  }

  for (let i = 0; i < delaunay.points.length; i += 2) {
    const x = delaunay.points[i];
    const y = delaunay.points[i + 1];

    diagramPoints.push({
      x,
      y,
    });
  }

  const cells = [];
  const pointIndexToCell = new Map();

  for (let i = 0; i < delaunay.points.length; i += 2) {
    const pointIndex = i >> 1;
    const cell = voronoi.cellPolygon(pointIndex);

    if (cell === null) continue;

    const cellObj = {
      ...formatCell(cell),
      _pointIndex: pointIndex,
      neighbors: [],
    };
    cells.push(cellObj);
    pointIndexToCell.set(pointIndex, cellObj);
  }

  for (const cell of cells) {
    const neighborIndices = [...voronoi.neighbors(cell._pointIndex)];
    cell.neighbors = neighborIndices
      .map((idx) => pointIndexToCell.get(idx))
      .filter((neighbor) => neighbor !== undefined);
    delete cell._pointIndex;
  }

  return {
    cells,
    points: diagramPoints,
  };
}

function formatCell(points) {
  return {
    points,
    innerCircleRadius: getClosestEdgeToCentroid(points),
    centroid: {
      x: polygonCentroid(points)[0],
      y: polygonCentroid(points)[1],
    },
  };
}

function getClosestEdgeToCentroid(points) {
  const centroid = polygonCentroid(points);
  const pointsSorted = sortPointsByAngle(centroid, points);
  const numPoints = pointsSorted.length;

  if (numPoints < 2) {
    return 0;
  }

  let closest = Infinity;

  for (let i = 0; i < numPoints; i++) {
    const p1 = pointsSorted[i];
    const p2 = pointsSorted[(i + 1) % numPoints];
    const dist = distToSegment(centroid, p1, p2);

    if (dist < closest) {
      closest = dist;
    }
  }

  return closest;
}

function sortPointsByAngle(centroid, points) {
  const sorted = points.slice(0);

  const sortByAngle = (p1, p2) => {
    return (
      Math.atan2(p1[1] - centroid[1], p1[0] - centroid[0]) -
      Math.atan2(p2[1] - centroid[1], p2[0] - centroid[0])
    );
  };

  sorted.sort(sortByAngle);

  return sorted;
}

export { createVoronoiDiagram };
