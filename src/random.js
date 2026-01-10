import { prng } from "./prng";

/**
 * Generate a random number within a range, or pick a random element from an array.
 *
 * @param {number|Array} minOrArray - Minimum value (inclusive), or an array to pick from
 * @param {number} [max] - Maximum value (inclusive) when minOrArray is a number
 * @param {boolean} [toInteger=false] - If true, returns an integer instead of float
 * @returns {number|*} Random number in range, or random array element
 * @example
 * random(0, 10)        // Returns float between 0 and 10
 * random(0, 10, true)  // Returns integer between 0 and 10
 * random(['a', 'b'])   // Returns 'a' or 'b'
 */
function random(minOrArray, max, toInteger = false) {
  if (Array.isArray(minOrArray)) {
    return minOrArray[random(0, minOrArray.length - 1, true)];
  }

  const val = prng() * (max - minOrArray) + minOrArray;

  return toInteger ? Math.round(val) : val;
}

export { random };
