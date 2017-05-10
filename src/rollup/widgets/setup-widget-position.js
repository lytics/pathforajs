/** @module pathfora/widgets/setup-widget-position */

import { defaultPositions } from '../globals/config';

import validateWidgetPosition from './validate-widget-position';

export default function setupWidgetPosition (widget, config) {
  if (config.position) {
    validateWidgetPosition(widget, config);
  } else {
    config.position = defaultPositions[config.layout];
  }
}
