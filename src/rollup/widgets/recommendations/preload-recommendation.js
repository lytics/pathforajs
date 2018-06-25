/** @module pathfora/validation/requires-lio */

// widgets
import hasRecommend from '../has/has-recommend';
import setWidgetContent from './set-widget-content';

// validations
import validateRecommendationWidget from '../../validation/validate-recommendation-widget.js';

export default function preloadRecommendations (widget, pf, cb) {
  if (hasRecommend(widget)) {
    validateRecommendationWidget(widget);
    setWidgetContent(pf.acctid, widget, cb);
  } else {
    cb();
  }
}
