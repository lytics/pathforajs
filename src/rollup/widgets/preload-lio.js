/** @module pathfora/validation/requires-lio */

// widgets
import hasRecommend from './has/has-recommend';
import hasEntityTemplates from './has/has-entity-templates';

// validation
import validateAccountId from '../validation/validate-account-id';

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
