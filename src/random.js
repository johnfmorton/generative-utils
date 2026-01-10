import { prng } from "./prng";

function random(minOrArray, max, toInteger = false) {
  if (Array.isArray(minOrArray)) {
    return minOrArray[random(0, minOrArray.length - 1, true)];
  }

  const val = prng() * (max - minOrArray) + minOrArray;

  return toInteger ? Math.round(val) : val;
}

export { random };
