/** @module pathfora/widgets/init-targeted-widgets */

// data
import getUserSegments from '../data/segments/get-user-segments';

// validation
import validateWidgetsObject from '../validation/validate-widgets-object';
import validateAccountId from '../validation/validate-account-id';
import setDependentData from './set-dependent-data';

/**
 * Initialize widgets which are targeted by segments.
 *
 * @exports initializeWidgets
 * @params {object} widgets
 * @params {object} options
 */
export default function initializeTargetedWidgets(widgets, options) {
  var pf = this,
    i;

  validateWidgetsObject(widgets);

  if (widgets.common) {
    pf.initializeWidgetArray(widgets.common, options);
  }

  // set dependent data on widgets
  setDependentData(widgets);

  // NOTE Target sensitive widgets
  if (widgets.target || widgets.exclude) {
    pf.addCallback(function (fields) {
      validateAccountId(pf);
      var targetedWidgets = [],
        segments = getUserSegments();

      // handle inclusions
      if (widgets.target) {
        for (i = 0; i < widgets.target.length; i++) {
          var target = widgets.target[i];

          if (
            target.segment &&
            segments &&
            segments.indexOf(target.segment) !== -1
          ) {
            // add the widgets with proper targeting to the master list
            // ensure we dont overwrite existing widgets in target
            targetedWidgets = targetedWidgets.concat(target.widgets);
          }
          // a rule function is allowed with targeting
          if (
            target.rule &&
            typeof target.rule === 'function' &&
            fields &&
            target.rule(fields)
          ) {
            targetedWidgets = targetedWidgets.concat(target.widgets);
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
