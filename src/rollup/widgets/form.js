/** @module pathfora/widgets/form */

import prepareWidget from './prepare-widget';

/**
 * Public method to create a widget of type form
 *
 * @exports Form
 * @params {object} config
 * @returns {object}
 */
export default function Form (config) {
  return prepareWidget('form', config);
}
