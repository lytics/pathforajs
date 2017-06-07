/** @module pathfora/widgets/init-widgets */

// globals
import { defaultProps } from '../globals/config';

// dom
import document from '../dom/document';

// utils
import updateObject from '../utils/objects/update-object';

// data
import trackTimeOnPage from '../data/tracking/track-time-on-page';
import getUserSegments from '../data/segments/get-user-segments';

// widgets
import validateWidgetsObject from './validate-widgets-object';

/**
 * Public method used to initialize widgets once
 * the individual configs have been created
 *
 * @exports initializeWidgets
 * @params {object} widgets
 * @params {object} config
 */
export default function initializeWidgets (widgets, config) {
  // NOTE IE < 10 not supported
  // FIXME Why? 'atob' can be polyfilled, 'all' is not necessary anymore?
  var pf = this;
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
    updateObject(defaultProps, config);
  }

  if (widgets instanceof Array) {

    // NOTE Simple initialization
    pf.initializeWidgetArray(widgets);
  } else {

    // NOTE Target sensitive widgets
    if (widgets.common) {
      pf.initializeWidgetArray(widgets.common);
      updateObject(defaultProps, widgets.common.config);
    }

    if (widgets.target || widgets.exclude) {
      // Add callback to initialize once we know segments are loaded
      pf.addCallback(function () {
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
          pf.initializeWidgetArray(targetedwidgets);
        }

        if (!targetedwidgets.length && !excludematched && widgets.inverse) {
          pf.initializeWidgetArray(widgets.inverse);
        }
      });
    }
  }
}
