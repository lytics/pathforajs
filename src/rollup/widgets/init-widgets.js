/** @module pathfora/widgets/init-widgets */

// globals
import { defaultProps } from '../globals/config';

// utils
import updateObject from '../utils/objects/update-object';

// data
import trackTimeOnPage from '../data/tracking/track-time-on-page';
/**
 * Public method used to initialize widgets once
 * the individual configs have been created
 *
 * @exports initializeWidgets
 * @params {object} widgets
 * @params {object} config
 * @params {object} options
 */
export default function initializeWidgets (widgets, config, options) {
  var pf = this;
  trackTimeOnPage();
  // support legacy initialize function where we passed account id as
  // a second parameter and config as third
  if (typeof config === 'string') {
    if (options) {
      config = options;
      options = null;
    } else {
      config = null;
    }
  }

  if (!widgets) {
    throw new Error('Initialize called with no widgets');
  }

  if (config) {
    updateObject(defaultProps, config);
  }

  if (Array.isArray(widgets)) {
    pf.initializeWidgetArray(widgets, options);
  } else {
    pf.initializeTargetedWidgets(widgets, options);
  }
}
