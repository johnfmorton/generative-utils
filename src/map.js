/**
 * Re-map a number from one range to another (like Processing's map function).
 *
 * @param {number} n - The value to map
 * @param {number} start1 - Lower bound of the input range
 * @param {number} end1 - Upper bound of the input range
 * @param {number} start2 - Lower bound of the output range
 * @param {number} end2 - Upper bound of the output range
 * @returns {number} The mapped value in the output range
 * @example
 * map(50, 0, 100, 0, 1)  // Returns 0.5
 * map(25, 0, 100, 0, 10) // Returns 2.5
 */
function map(n, start1, end1, start2, end2) {
  if (start1 === end1) {
    return start2;
  }
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

export { map };
