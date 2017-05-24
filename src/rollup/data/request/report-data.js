/** @module pathfora/data/request/report-data */

import window from '../../dom/window';

/**
 * Send data object to Lytics and GA
 *
 * @exports reportData
 * @params {object} data
 */
export default function reportData (data) {
  var gaLabel;

  if (typeof jstag === 'object') {
    window.jstag.send(data);
  } else {
    // NOTE Cannot find Lytics tag, reporting disabled
  }

  if (window.pathfora.enableGA === true && typeof ga === 'function') {
    gaLabel = data['pf-widget-action'] || data['pf-widget-event'];

    window.ga(
      'send',
      'event',
      'Lytics',
      data['pf-widget-id'] + ' : ' + gaLabel,
      '',
      {
        nonInteraction: true
      }
    );
  }
}
