/**
 * 2D Vector operations.
 * All functions work with objects of the form { x, y }.
 */

/**
 * Create a new 2D vector.
 * @param {number} [x=0] - X component
 * @param {number} [y=0] - Y component
 * @returns {{x: number, y: number}} A new vector
 */
export function create(x = 0, y = 0) {
  return { x, y };
}

/**
 * Add two vectors.
 * @param {{x: number, y: number}} a - First vector
 * @param {{x: number, y: number}} b - Second vector
 * @returns {{x: number, y: number}} Sum of a and b
 */
export function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y };
}

/**
 * Subtract vector b from vector a.
 * @param {{x: number, y: number}} a - First vector
 * @param {{x: number, y: number}} b - Second vector
 * @returns {{x: number, y: number}} Difference (a - b)
 */
export function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}

/**
 * Multiply a vector by a scalar.
 * @param {{x: number, y: number}} v - Vector
 * @param {number} s - Scalar
 * @returns {{x: number, y: number}} Scaled vector
 */
export function multiply(v, s) {
  return { x: v.x * s, y: v.y * s };
}

/**
 * Divide a vector by a scalar.
 * @param {{x: number, y: number}} v - Vector
 * @param {number} s - Scalar
 * @returns {{x: number, y: number}} Divided vector
 */
export function divide(v, s) {
  return { x: v.x / s, y: v.y / s };
}

/**
 * Calculate the magnitude (length) of a vector.
 * @param {{x: number, y: number}} v - Vector
 * @returns {number} Length of the vector
 */
export function magnitude(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

/**
 * Calculate the squared magnitude of a vector (avoids sqrt for performance).
 * @param {{x: number, y: number}} v - Vector
 * @returns {number} Squared length of the vector
 */
export function magnitudeSquared(v) {
  return v.x * v.x + v.y * v.y;
}

/**
 * Normalize a vector to unit length.
 * @param {{x: number, y: number}} v - Vector
 * @returns {{x: number, y: number}} Unit vector in the same direction
 */
export function normalize(v) {
  const mag = magnitude(v);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
}

/**
 * Calculate the distance between two points.
 * @param {{x: number, y: number}} a - First point
 * @param {{x: number, y: number}} b - Second point
 * @returns {number} Distance between a and b
 */
export function distance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the squared distance between two points (avoids sqrt for performance).
 * @param {{x: number, y: number}} a - First point
 * @param {{x: number, y: number}} b - Second point
 * @returns {number} Squared distance between a and b
 */
export function distanceSquared(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return dx * dx + dy * dy;
}

/**
 * Calculate the dot product of two vectors.
 * @param {{x: number, y: number}} a - First vector
 * @param {{x: number, y: number}} b - Second vector
 * @returns {number} Dot product
 */
export function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}

/**
 * Calculate the cross product (z-component) of two 2D vectors.
 * @param {{x: number, y: number}} a - First vector
 * @param {{x: number, y: number}} b - Second vector
 * @returns {number} Z-component of the cross product
 */
export function cross(a, b) {
  return a.x * b.y - a.y * b.x;
}

/**
 * Rotate a vector by an angle (in radians).
 * @param {{x: number, y: number}} v - Vector to rotate
 * @param {number} angle - Angle in radians
 * @returns {{x: number, y: number}} Rotated vector
 */
export function rotate(v, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x * cos - v.y * sin,
    y: v.x * sin + v.y * cos
  };
}

/**
 * Rotate a vector around a pivot point.
 * @param {{x: number, y: number}} v - Vector to rotate
 * @param {{x: number, y: number}} pivot - Center of rotation
 * @param {number} angle - Angle in radians
 * @returns {{x: number, y: number}} Rotated vector
 */
export function rotateAround(v, pivot, angle) {
  const translated = subtract(v, pivot);
  const rotated = rotate(translated, angle);
  return add(rotated, pivot);
}

/**
 * Linear interpolation between two vectors.
 * @param {{x: number, y: number}} a - Start vector
 * @param {{x: number, y: number}} b - End vector
 * @param {number} t - Interpolation factor (0-1)
 * @returns {{x: number, y: number}} Interpolated vector
 */
export function lerp(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t
  };
}

/**
 * Calculate the angle of a vector (in radians, from positive x-axis).
 * @param {{x: number, y: number}} v - Vector
 * @returns {number} Angle in radians (-π to π)
 */
export function angle(v) {
  return Math.atan2(v.y, v.x);
}

/**
 * Calculate the angle between two vectors (in radians).
 * @param {{x: number, y: number}} a - First vector
 * @param {{x: number, y: number}} b - Second vector
 * @returns {number} Angle in radians (0 to π)
 */
export function angleBetween(a, b) {
  const dotProduct = dot(a, b);
  const mags = magnitude(a) * magnitude(b);
  if (mags === 0) return 0;
  return Math.acos(Math.min(1, Math.max(-1, dotProduct / mags)));
}

/**
 * Create a vector from an angle and magnitude.
 * @param {number} angle - Angle in radians
 * @param {number} [mag=1] - Magnitude
 * @returns {{x: number, y: number}} Vector
 */
export function fromAngle(angle, mag = 1) {
  return {
    x: Math.cos(angle) * mag,
    y: Math.sin(angle) * mag
  };
}

/**
 * Get the perpendicular vector (rotated 90 degrees counter-clockwise).
 * @param {{x: number, y: number}} v - Vector
 * @returns {{x: number, y: number}} Perpendicular vector
 */
export function perpendicular(v) {
  return { x: -v.y, y: v.x };
}

/**
 * Reflect a vector off a surface with a given normal.
 * @param {{x: number, y: number}} v - Incident vector
 * @param {{x: number, y: number}} normal - Surface normal (should be normalized)
 * @returns {{x: number, y: number}} Reflected vector
 */
export function reflect(v, normal) {
  const d = 2 * dot(v, normal);
  return {
    x: v.x - d * normal.x,
    y: v.y - d * normal.y
  };
}

/**
 * Limit a vector's magnitude to a maximum value.
 * @param {{x: number, y: number}} v - Vector
 * @param {number} max - Maximum magnitude
 * @returns {{x: number, y: number}} Vector with magnitude clamped to max
 */
export function limit(v, max) {
  const magSq = magnitudeSquared(v);
  if (magSq > max * max) {
    return multiply(normalize(v), max);
  }
  return { x: v.x, y: v.y };
}

/**
 * Set a vector's magnitude to a specific value.
 * @param {{x: number, y: number}} v - Vector
 * @param {number} mag - Desired magnitude
 * @returns {{x: number, y: number}} Vector with the specified magnitude
 */
export function setMagnitude(v, mag) {
  return multiply(normalize(v), mag);
}

// Export all functions as a namespace object for convenient access
export const vec2 = {
  create,
  add,
  subtract,
  multiply,
  divide,
  magnitude,
  magnitudeSquared,
  normalize,
  distance,
  distanceSquared,
  dot,
  cross,
  rotate,
  rotateAround,
  lerp,
  angle,
  angleBetween,
  fromAngle,
  perpendicular,
  reflect,
  limit,
  setMagnitude
};
