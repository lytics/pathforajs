/** @module pathfora/utils/generate-unique-id */

/**
 * Create a unique string identifier
 *
 * @exports generateUniqueId
 * @returns {string} id
 */
export default function generateUniqueId () {
  var s4 = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  return [
    s4(), s4(),
    '-',
    s4(),
    '-',
    s4(),
    '-',
    s4(),
    '-',
    s4(), s4(), s4()
  ].join('');
}
