/** @module pathfora/validation/validate-widgets-object */

/**
 * Validate that object provided to initializeWidgets
 * is either an array of widgets or a targeting object
 * targetting object containing widgets.
 *
 * @exports validateWidgetsObject
 * @params {object} widgets
 */
export default function validateWidgetsObject (widgets) {
  if (widgets.target) {
    widgets.common = widgets.common || [];

    for (var i = 0; i < widgets.target.length; i++) {
      if (!widgets.target[i].segment) {
        throw new Error('All targeted widgets should have segment specified');
      } else if (widgets.target[i].segment === '*') {
        widgets.common = widgets.common.concat(widgets.target[i].widgets);
        widgets.target.splice(i, 1);
      }
    }
  }
}
