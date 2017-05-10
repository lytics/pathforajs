/* module pathfora/ab-test/create-preset */

export default function createABTestingModePreset () {
  var groups = [];

  for (var i = 0; i < arguments.length; i++) {
    groups.push(arguments[i]);
  }

  var groupsSum = groups.reduce(function (sum, element) {
    return sum + element;
  });

  // NOTE If groups collapse into a number greater than 1, normalize
  if (groupsSum > 1) {
    var groupsSumRatio = 1 / groupsSum;

    groups = groups.map(function (element) {
      return element * groupsSumRatio;
    });
  }

  return {
    groups: groups,
    groupsNumber: groups.length
  };
}
