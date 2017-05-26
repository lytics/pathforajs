/** @module pathfora/widgets/subscription */

import prepareWidget from './prepare-widget';

/**
 * Public method to create a widget of type subscription
 *
 * @exports Subscription
 * @params {object} config
 * @returns {object}
 */
export default function Subscription (config) {
  return prepareWidget('subscription', config);
}
