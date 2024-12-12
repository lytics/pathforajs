/** @module pathfora/validation/validate-widgets-object */

/**
 * Validate that object provided to initializeWidgets
 * is either an array of widgets or a targeting object
 * targetting object containing widgets.
 *
 * @exports validateWidgetsObject
 * @params {object} widgets
 */
export default function validateWidgetsObject(widgets) {
  if (widgets.target) {
    widgets.common = widgets.common || [];

    for (var i = 0; i < widgets.target.length; i++) {
      if (!widgets.target[i].segment && !widgets.target[i].rule) {
        throw new Error(
          'All targeted widgets should have segment or rule function specified'
        );
      } else if (widgets.target[i].segment && widgets.target[i].rule) {
        throw new Error(
          'Widget cannot have both segment and rule function specified'
        );
      } else if (widgets.target[i].segment === '*') {
        widgets.common = widgets.common.concat(widgets.target[i].widgets);
        widgets.target.splice(i, 1);
      }
    }
  }

  if (widgets.exclude) {
    for (var j = 0; j < widgets.exclude.length; j++) {
      if (!widgets.exclude[j].segment) {
        throw new Error('All excluded widgets should have segment specified');
      }
    }
  }
}
