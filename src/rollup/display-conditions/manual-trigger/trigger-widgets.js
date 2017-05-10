/** @module pathfora/trigger-widgets */

import { widgetTracker } from '../../globals/config'
import triggerWidget from './trigger-widget'

export default function triggerWidgets (widgetIds) {
  var i, valid;

  // no widget ids provided, trigger all ready widgets
  if (typeof widgetIds === 'undefined') {
    widgetTracker.triggeredWidgets['*'] = true;

    for (i = 0; i < widgetTracker.readyWidgets.length; i++) {
      valid = triggerWidget(widgetTracker.readyWidgets[i]);
      if (valid) {
        i--;
      }
    }

  // trigger all widget ids provided
  } else {
    widgetIds.forEach(function (id) {
      if (widgetTracker.triggeredWidgets[id] !== false) {
        widgetTracker.triggeredWidgets[id] = true;
      }

      for (i = 0; i < widgetTracker.readyWidgets.length; i++) {
        valid = triggerWidget(widgetTracker.readyWidgets[i]);
        if (valid) {
          i--;
        }
      }
    });
  }
};