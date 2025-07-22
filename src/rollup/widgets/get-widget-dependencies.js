/** @module pathfora/widgets/get-widget-dependencies */

import { widgetTracker } from '../globals/config';

/**
 * Return a list of all widgets that have dependent data
 *
 * @exports getWidgetDependencies
 * @returns {array}
 */
export default function getWidgetDependencies () {
  return widgetTracker.dependentDataWidgets;
}
