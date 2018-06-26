/** @module pathfora/widgets/prepare-widget */

/**
 * Validate that a widget is correctly set up
 *
 * @exports prepareWidget
 * @params {string} type
 * @params {object} config
 * @returns {object}
 */
export default function prepareWidget (type, config) {
  var widget = {
    valid: true,
    type: type
  };

  if (!config) {
    throw new Error('Config object is missing');
  }

  widget.config = config;

  if (!config.id) {
    throw new Error('All widgets must have an id value');
  }

  widget.id = config.id;

  return widget;
}
