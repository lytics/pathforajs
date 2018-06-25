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
      var targetedwidgets = [],
          segments = getUserSegments();

      // handle inclusions
      if (widgets.target) {
        for (i = 0; i < widgets.target.length; i++) {
          var target = widgets.target[i];
          if (segments && segments.indexOf(target.segment) !== -1) {
            // add the widgets with proper targeting to the master list
            // ensure we dont overwrite existing widgets in target
            targetedwidgets = targetedwidgets.concat(target.widgets);
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
            for (var x = 0; x < targetedwidgets.length; x++) {
              for (var y = 0; y < exclude.widgets.length; y++) {
                if (targetedwidgets[x] === exclude.widgets[y]) {
                  targetedwidgets.splice(x, 1);
                }
              }
            }
          }
        }
      }

      if (targetedwidgets.length) {
        pf.initializeWidgetArray(targetedwidgets, options);
      }

      if (!targetedwidgets.length && widgets.inverse) {
        pf.initializeWidgetArray(widgets.inverse, options);
      }
    });
  }
}
