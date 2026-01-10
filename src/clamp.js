/**
 * Constrain a value within a range.
 *
 * @param {number} value - The value to constrain
 * @param {number} min - Minimum bound
 * @param {number} max - Maximum bound
 * @returns {number} The constrained value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
