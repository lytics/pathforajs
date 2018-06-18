/** @module pathfora/widgets/init-targeted-widgets */

import { defaultProps } from '../globals/config';

// utils
import updateObject from '../utils/objects/update-object';

// data
import getUserSegments from '../data/segments/get-user-segments';

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

  // NOTE Target sensitive widgets
  if (widgets.common) {
    pf.initializeWidgetArray(widgets.common, options);
    updateObject(defaultProps, widgets.common.config);
  }

  if (widgets.target || widgets.exclude) {
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
  }
}
