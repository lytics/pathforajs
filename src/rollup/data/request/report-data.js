/** @module pathfora/data/request/report-data */

import window from '../../dom/window';

export default function reportData (data) {
  var gaLabel;

  if (typeof jstag === 'object') {
    window.jstag.send(data);
  } else {
    // NOTE Cannot find Lytics tag, reporting disabled
  }

  if (typeof ga === 'function') {
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
