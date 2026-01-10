import { random } from "./random.js";

/**
 * Generate a random number snapped to the nearest interval.
 *
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @param {number} snapInc - The interval to snap to
 * @returns {number} A random number snapped to the nearest increment
 * @example
 * randomSnap(0, 100, 10) // Returns 0, 10, 20, 30, ... 100
 */
function randomSnap(min, max, snapInc) {
  return Math.round(random(min, max) / snapInc) * snapInc;
}

export { randomSnap };
