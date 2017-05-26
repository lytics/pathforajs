/** @module pathfora/widgets/setup-widget-position */

// globals
import { defaultPositions } from '../globals/config';

// widgets
import validateWidgetPosition from './validate-widget-position';

/**
 * Validate that the widget has correct position field,
 * and choose the default if it does not
 *
 * @exports setupWidgetPostion
 * @params {object} widget
 * @params {object} config
 */
export default function setupWidgetPosition (widget, config) {
  if (config.position) {
    validateWidgetPosition(widget, config);
  } else {
    config.position = defaultPositions[config.layout];
  }
}
