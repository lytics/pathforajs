/** @module pathfora/data/helpers/helper-rules */

/**
 * Generic helper rules for widget targeting
 *
 * @exports helperRules
 */
var helperRules = {
  includes: function (key, value) {
    return function (data) {
      return data[key].includes(value);
    };
  },

  excludes: function (key, value) {
    return function (data) {
      return !data[key].includes(value);
    };
  },

  eq: function (key, value) {
    return function (data) {
      return data[key] === value;
    };
  },

  notEq: function (key, value) {
    return function (data) {
      return data[key] !== value;
    };
  },

  gt: function (key, value) {
    return function (data) {
      return parseInt(data[key], 10) > value;
    };
  },

  gte: function (key, value) {
    return function (data) {
      return parseInt(data[key], 10) >= value;
    };
  },

  lt: function (key, value) {
    return function (data) {
      return parseInt(data[key], 10) < value;
    };
  },

  lte: function (key, value) {
    return function (data) {
      return parseInt(data[key], 10) <= value;
    };
  },

  inFlowStep: function (id, version, step) {
    return function (data) {
      var flows = data._flows;
      var flowKey = id + '-' + version;
      return !!(flows && flows[flowKey] && flows[flowKey].step === step);
    };
  },

  inSegment: function (segment) {
    return function (data) {
      return data.segments.indexOf(segment) !== -1;
    };
  },
};

export default helperRules;
