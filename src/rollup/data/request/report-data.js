/** @module pathfora/data/request/report-data */

import window from '../../dom/window';
import censorTrackingKeys from '../../utils/censor-tracking-keys';

/**
 * Send data object to Lytics and GA
 *
 * @exports reportData
 * @params {object} data
 * @widget {object}
 */
export default function reportData (data, widget) {
  var gaLabel, trackers;

  if (typeof jstag === 'object') {
    window.jstag.send(
      widget.censorTrackingKeys
        ? censorTrackingKeys(data, widget.censorTrackingKeys)
        : data
    );
  } else {
    // NOTE Cannot find Lytics tag, reporting disabled
  }

  if (window.pathfora.enableGA === true && typeof window.ga === 'function' && typeof window.ga.getAll === 'function') {
    gaLabel = data['pf-widget-action'] || data['pf-widget-event'];
    trackers = window.ga.getAll();

    for (var i = 0; i < trackers.length; i++) {
      var name = trackers[i].get('name');

      window.ga(
        name + '.send',
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
}
