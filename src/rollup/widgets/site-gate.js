/** @module pathfora/widgets/site-gate */

import prepareWidget from './prepare-widget';

/**
 * Public method to create a widget of type site gate
 *
 * @exports SiteGate
 * @params {object} config
 * @returns {object}
 */
export default function SiteGate (config) {
  return prepareWidget('sitegate', config);
}
