import { svgPathProperties } from "svg-path-properties";
import SimplexNoise from "simplex-noise";
import seedrandom from "seedrandom";

/**
 * @typedef {Object} NoisyPathOptions
 * @property {number} [amplitude=2] - Maximum displacement perpendicular to path (in SVG units)
 * @property {number} [frequency=0.1] - How often displacement occurs (higher = more waves per unit length)
 * @property {number|string} [seed] - Seed for deterministic randomness. Same seed = same output
 * @property {'sine'|'random'|'perlin'} [noiseType='perlin'] - Type of noise pattern
 * @property {number} [resolution=1] - Distance between sampled points (in SVG units). Lower = smoother output
 */

const defaultOptions = {
  amplitude: 2,
  frequency: 0.1,
  seed: null,
  noiseType: "perlin",
  resolution: 1,
};

/**
 * Transform an SVG path into a "noisy" or "squiggly" path.
 * Creates the visual effect of hand-drawn lines by adding controlled
 * perpendicular displacement along the path.
 *
 * @param {string} pathData - SVG path data string (d attribute value)
 * @param {NoisyPathOptions} [options] - Configuration options
 * @returns {string} New SVG path data string with noise applied
 * @example
 * // Basic usage with default perlin noise
 * const noisyPath = createNoisyPath("M0,0 L100,100 L200,50", {
 *   amplitude: 3,
 *   frequency: 0.15,
 *   seed: 12345
 * });
 *
 * @example
 * // Smooth sine waves
 * const wavyPath = createNoisyPath(originalPath, {
 *   amplitude: 5,
 *   frequency: 0.2,
 *   noiseType: 'sine',
 *   seed: 42
 * });
 *
 * @example
 * // Jagged random displacement
 * const jaggedPath = createNoisyPath(originalPath, {
 *   amplitude: 2,
 *   frequency: 0.3,
 *   noiseType: 'random',
 *   seed: 'my-seed'
 * });
 */
function createNoisyPath(pathData, options = {}) {
  const opts = Object.assign({}, defaultOptions, options);

  // Validate input
  if (!pathData || typeof pathData !== "string") {
    return "";
  }

  // Parse the path
  let pathProps;
  try {
    pathProps = new svgPathProperties(pathData);
  } catch (e) {
    console.warn("createNoisyPath: Invalid path data", e);
    return pathData;
  }

  const totalLength = pathProps.getTotalLength();
  if (totalLength === 0) {
    return pathData;
  }

  // Initialize random/noise generators based on seed
  const seedValue = opts.seed !== null ? opts.seed : Math.random() * 10000;
  const rng = seedrandom(seedValue);
  const simplex = new SimplexNoise(seedValue);

  // Pre-generate random values for 'random' noise type to ensure determinism
  const numSamples = Math.ceil(totalLength / opts.resolution) + 1;
  const randomValues = [];
  if (opts.noiseType === "random") {
    for (let i = 0; i < numSamples; i++) {
      randomValues.push((rng() * 2 - 1)); // Range: -1 to 1
    }
  }

  // Sample points along the path and apply noise
  const noisyPoints = [];
  let sampleIndex = 0;

  for (let dist = 0; dist <= totalLength; dist += opts.resolution) {
    // Get point and tangent at current distance
    const point = pathProps.getPointAtLength(dist);
    const tangent = pathProps.getTangentAtLength(dist);

    // Calculate perpendicular direction (rotate tangent 90 degrees)
    const perpX = -tangent.y;
    const perpY = tangent.x;

    // Calculate noise value based on noise type
    let noiseValue;
    switch (opts.noiseType) {
      case "sine":
        // Smooth sinusoidal wave
        noiseValue = Math.sin(dist * opts.frequency * Math.PI * 2);
        break;

      case "random":
        // Pre-generated random values
        noiseValue = randomValues[sampleIndex];
        break;

      case "perlin":
      default:
        // Simplex/Perlin noise - use distance along path as input
        // Multiply by frequency to control how fast the noise changes
        noiseValue = simplex.noise2D(dist * opts.frequency, seedValue % 1000);
        break;
    }

    // Apply displacement perpendicular to the path
    const displacement = noiseValue * opts.amplitude;
    noisyPoints.push({
      x: point.x + perpX * displacement,
      y: point.y + perpY * displacement,
    });

    sampleIndex++;
  }

  // Ensure we include the exact endpoint
  if (noisyPoints.length > 0) {
    const lastDist = (noisyPoints.length - 1) * opts.resolution;
    if (lastDist < totalLength) {
      const endPoint = pathProps.getPointAtLength(totalLength);
      const endTangent = pathProps.getTangentAtLength(totalLength);
      const perpX = -endTangent.y;
      const perpY = endTangent.x;

      let noiseValue;
      switch (opts.noiseType) {
        case "sine":
          noiseValue = Math.sin(totalLength * opts.frequency * Math.PI * 2);
          break;
        case "random":
          noiseValue = randomValues[randomValues.length - 1] || 0;
          break;
        case "perlin":
        default:
          noiseValue = simplex.noise2D(
            totalLength * opts.frequency,
            seedValue % 1000
          );
          break;
      }

      const displacement = noiseValue * opts.amplitude;
      noisyPoints.push({
        x: endPoint.x + perpX * displacement,
        y: endPoint.y + perpY * displacement,
      });
    }
  }

  // Construct new path string
  if (noisyPoints.length === 0) {
    return "";
  }

  let newPath = `M${noisyPoints[0].x},${noisyPoints[0].y}`;
  for (let i = 1; i < noisyPoints.length; i++) {
    newPath += `L${noisyPoints[i].x},${noisyPoints[i].y}`;
  }

  return newPath;
}

export { createNoisyPath };
