/** @module pathfora/widgets/preload-lio */

// widgets
import hasRecommend from './has/has-recommend';
import hasEntityTemplates from './has/has-entity-templates';

// validation
import validateAccountId from '../validation/validate-account-id';

/**
 * Check if the widget needs lio to be loaded, if so
 * wait for the callback, otherwise continue execution.
 *
 * @exports preloadLio
 * @params {object} widget
 * @params {object} pf
 * @params {function} cb
 */
export default function preloadLio (widget, pf, cb) {
  if (hasRecommend(widget) || hasEntityTemplates(widget)) {
    pf.addCallback(function () {
      validateAccountId(pf);
      cb();
    });
  } else {
    cb();
  }
}
