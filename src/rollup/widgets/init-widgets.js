/** @module pathfora/widgets/init-widgets */

// globals
import { defaultProps } from '../globals/config';

// utils
import updateObject from '../utils/objects/update-object';

// validation
import validateWidgetsObject from '../validation/validate-widgets-object';
import validateAccountId from '../validation/validate-account-id';
import requiresLio from '../validation/requires-lio';

// widgets
// import initializeWidgetArray from './init-widget-array';
// import initializeTargetedWidgets from

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

  validateWidgetsObject(widgets);

  if (config) {
    updateObject(defaultProps, config);
  }

  var init = function () {
    if (Array.isArray(widgets)) {
      // NOTE Simple initialization
      pf.initializeWidgetArray(widgets, options);
    } else {
      pf.initializeTargetedWidgets(widgets, options);
    }
  };

  // determine if we need to wait for lio to
  // load the user entity
  if (requiresLio(widgets)) {
    pf.addCallback(function () {
      validateAccountId(pf);
      init();
    });
  } else {
    init();
  }
}
