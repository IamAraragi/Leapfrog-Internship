/**
 * function to get random value between certain range
 * @param {*} min : minimum value
 * @param {*} max : maximum value
 * @returns a random value between min and max
 */
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
