/** @module pathfora/widgets/message */

import prepareWidget from './prepare-widget';

/**
 * Public method to create a widget of type message
 *
 * @exports Message
 * @params {object} config
 * @returns {object}
 */
export default function Message (config) {
  return prepareWidget('message', config);
}
