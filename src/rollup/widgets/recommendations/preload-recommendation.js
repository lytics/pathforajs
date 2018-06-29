/** @module pathfora/widgets/recommendation/preload-recommendation */

// widgets
import hasRecommend from '../has/has-recommend';
import setWidgetContent from './set-widget-content';

// validations
import validateRecommendationWidget from '../../validation/validate-recommendation-widget.js';

/**
 * Check if the widget needs recommendations to be loaded, if so
 * wait for the callback, otherwise continue execution.
 *
 * @exports preloadRecommendation
 * @params {object} widget
 * @params {object} pf
 * @params {function} cb
 */
export default function preloadRecommendation (widget, pf, cb) {
  if (hasRecommend(widget)) {
    validateRecommendationWidget(widget);
    setWidgetContent(pf.acctid, widget, cb);
  } else {
    cb();
  }
}
