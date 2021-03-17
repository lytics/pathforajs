/**
 * Censor an object by its keys, by comparing against an array of strings and/or regexps. In the case of strings,
 * only exact matches are censored. For non-strings, if the object's test method returns true, the key will be censored.
 *
 * @param {object} data the data to censor
 * @param {obejct} keysToReject an array of strings or regexps to censor the data by preparatory to sending
 */
export default function censorTrackingKeys (data, keysToReject) {
  return Object.keys(data)
    .filter(function (key) {
      return !keysToReject.some(function (keyToReject) {
        return typeof keyToReject === 'string'
          ? key === keyToReject
          : keyToReject.test(key);
      });
    })
    .reduce(function (memo, key) {
      memo[key] = data[key];
      return memo;
    }, {});
}
