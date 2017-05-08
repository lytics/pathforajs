/** @module pathfora/trigger-widgets */

export default function triggerWidgets (widgetIds) {
  var pf = this;
  var i, valid;

  // no widget ids provided, trigger all ready widgets
  if (typeof widgetIds === 'undefined') {
    pf.triggeredWidgets['*'] = true;

    for (i = 0; i < core.readyWidgets.length; i++) {
      valid = core.triggerWidget(core.readyWidgets[i]);
      if (valid) {
        i--;
      }
    }

  // trigger all widget ids provided
  } else {
    widgetIds.forEach(function (id) {
      if (pf.triggeredWidgets[id] !== false) {
        pf.triggeredWidgets[id] = true;
      }

      for (i = 0; i < core.readyWidgets.length; i++) {
        valid = core.triggerWidget(core.readyWidgets[i]);
        if (valid) {
          i--;
        }
      }
    });
  }
};