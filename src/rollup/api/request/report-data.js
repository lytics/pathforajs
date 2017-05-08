/** @module api/request/report-data */

import jstag from '../../globals/jstag'
import ga from '../../globals/ga'

export default function reportData (data) {
  var gaLabel;

  if (typeof jstag === 'object') {
    jstag.send(data);
  } else {
    // NOTE Cannot find Lytics tag, reporting disabled
  }

  if (typeof ga === 'function') {
    gaLabel = data['pf-widget-action'] || data['pf-widget-event'];

    ga(
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
};