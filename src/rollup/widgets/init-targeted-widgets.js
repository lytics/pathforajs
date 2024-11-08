/** @module pathfora/widgets/init-targeted-widgets */

// data
import getUserSegments from '../data/segments/get-user-segments';

// validation
import validateWidgetsObject from '../validation/validate-widgets-object';
import validateAccountId from '../validation/validate-account-id';

/**
 * Initialize widgets which are targeted by segments.
 *
 * @exports initializeWidgets
 * @params {object} widgets
 * @params {object} options
 */
export default function initializeTargetedWidgets (widgets, options) {
  var pf = this,
      i;

  validateWidgetsObject(widgets);

  if (widgets.common) {
    pf.initializeWidgetArray(widgets.common, options);
  }

  // NOTE Target sensitive widgets
  if (widgets.target || widgets.exclude) {
    pf.addCallback(function () {
      validateAccountId(pf);
      var targetedWidgets = [],
          segments = getUserSegments();

      // handle inclusions
      if (widgets.target) {
        for (i = 0; i < widgets.target.length; i++) {

          var target = widgets.target[i];
          var pass = true;

          // check to see if the segment based targeting is valid
          if (segments && segments.indexOf(target.segment) === -1) {
            pass = false;
          }

          // check to see if the custom rules are all valid and passing
          if (widgets.target.rules) {
            var expressions = {
              '==': function (a, b) {
                return a === b;
              },
              '!=': function (a, b) {
                return a !== b;
              },
              '>': function (a, b) {
                return a > b;
              },
              '<': function (a, b) {
                return a < b;
              },
              '>=': function (a, b) {
                return a >= b;
              },
              '<=': function (a, b) {
                return a <= b;
              },
              'contains': function (a, b) {
                return a.indexOf(b) !== -1;
              },
              'empty': function (a) {
                return a === '';
              },
              'not empty': function (a) {
                return a !== '';
              }
            };

            for (var key in target.rules) {
              if (target.rules.hasOwnProperty(key)) {
                var rule = target.rules[key];
                if (expressions[rule.expression]) {
                  if (!expressions[rule.expression](rule.value, options[key])) {
                    pass = false;
                  }
                }
              }
            }
          }

          // add the widgets that pass to the master list
          if (pass) {
            console.log('passed, adding widget', target.widgets);
            targetedWidgets = targetedWidgets.concat(target.widgets);
          } else {
            console.log('passed, adding widget', target.widgets);
          }
        }
      }

      // handle exclusions
      if (widgets.exclude) {
        for (i = 0; i < widgets.exclude.length; i++) {
          var exclude = widgets.exclude[i];
          if (segments && segments.indexOf(exclude.segment) !== -1) {
            // we found a match, ensure the corresponding segment(s) are not in the
            // targetted widgets array
            for (var x = 0; x < targetedWidgets.length; x++) {
              for (var y = 0; y < exclude.widgets.length; y++) {
                if (targetedWidgets[x] === exclude.widgets[y]) {
                  targetedWidgets.splice(x, 1);
                }
              }
            }
          }
        }
      }

      if (targetedWidgets.length) {
        pf.initializeWidgetArray(targetedWidgets, options);
      } else if (widgets.inverse) {
        pf.initializeWidgetArray(widgets.inverse, options);
      }
    });
  }
}
