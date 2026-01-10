import { random } from "./random.js";

/**
 * Generate a biased random number within a range.
 * The result is weighted toward the bias value based on the influence.
 *
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @param {number} bias - The value to bias toward
 * @param {number} [influence=0.5] - How strongly to bias toward the bias value (0-1)
 * @returns {number} A random number biased toward the bias value
 * @example
 * randomBias(0, 100, 80, 0.8) // Tends to return values closer to 80
 */
function randomBias(min, max, bias, influence = 0.5) {
  const base = random(min, max);
  const mix = random(0, 1) * influence;

  return base * (1 - mix) + bias * mix;
}

export { randomBias };
