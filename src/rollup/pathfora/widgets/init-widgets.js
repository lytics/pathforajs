/** @module pathfora/widgets/init-widgets */

import validateWidgetsObject from '../../core/widgets/validate-widgets-object'
import trackTimeOnPage from '../../core/tracking/track-time-on-page'
import initializeWidgetArray from '../../core/widgets/init-widget-array'
import updateObject from '../../utils/update-object'
import getUserSegments from '../../api/segments/get-user-segments'
import { defaultProps } from '../../config/default-props'

export default function initializeWidgets (widgets, config) {
  // NOTE IE < 10 not supported
  // FIXME Why? 'atob' can be polyfilled, 'all' is not necessary anymore?
  if (document.all && !window.atob) {
    return;
  }

  // support legacy initialize function where we passed account id as
  // a second parameter and config as third
  if (arguments.length >= 3) {
    config = arguments[2];
  // if the second param is an account id, we need to throw it out
  } else if (typeof config === 'string') {
    config = null;
  }

  validateWidgetsObject(widgets);
  trackTimeOnPage();

  if (config) {
    originalConf = JSON.parse(JSON.stringify(defaultProps));
    updateObject(defaultProps, config);
  }

  if (widgets instanceof Array) {

    // NOTE Simple initialization
    initializeWidgetArray(widgets);
  } else {

    // NOTE Target sensitive widgets
    if (widgets.common) {
      initializeWidgetArray(widgets.common);
      updateObject(defaultProps, widgets.common.config);
    }

    if (widgets.target || widgets.exclude) {
      // Add callback to initialize once we know segments are loaded
      this.addCallback(function () {
        var target, ti, tl, exclude, ei, ex, ey, el,
            targetedwidgets = [],
            excludematched = false,
            segments = getUserSegments();

        // handle inclusions
        if (widgets.target) {
          tl = widgets.target.length;
          for (ti = 0; ti < tl; ti++) {
            target = widgets.target[ti];
            if (segments && segments.indexOf(target.segment) !== -1) {
              // add the widgets with proper targeting to the master list
              // ensure we dont overwrite existing widgets in target
              targetedwidgets = targetedwidgets.concat(target.widgets);
            }
          }
        }

        // handle exclusions
        if (widgets.exclude) {
          el = widgets.exclude.length;
          for (ei = 0; ei < el; ei++) {
            exclude = widgets.exclude[ei];
            if (segments && segments.indexOf(exclude.segment) !== -1) {
              // we found a match, ensure the corresponding segment(s) are not in the
              // targetted widgets array
              for (ex = 0; ex < targetedwidgets.length; ex++) {
                for (ey = 0; ey < exclude.widgets.length; ey++) {
                  if (targetedwidgets[ex] === exclude.widgets[ey]) {
                    targetedwidgets.splice(ex, 1);
                  }
                }
              }
            }
          }
        }

        if (targetedwidgets.length) {
          initializeWidgetArray(targetedwidgets);
        }

        if (!targetedwidgets.length && !excludematched && widgets.inverse) {
          initializeWidgetArray(widgets.inverse);
        }
      });
    }
  }
};