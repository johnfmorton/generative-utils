import seedrandom from "seedrandom";

/**
 * Pseudo-random number generator instance.
 * Use seedPRNG() to seed it for reproducible results.
 * @type {function(): number}
 */
let prng = seedrandom();

/**
 * Seed the pseudo-random number generator for reproducible randomness.
 * All random functions in this library use this shared PRNG.
 *
 * @param {string|number} seed - The seed value
 * @returns {void}
 * @example
 * seedPRNG('my-seed')
 * random(0, 100) // Always returns the same sequence for 'my-seed'
 */
function seedPRNG(seed) {
  prng = seedrandom(seed);
}

export { prng, seedPRNG };
