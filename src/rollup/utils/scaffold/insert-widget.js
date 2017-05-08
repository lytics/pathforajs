/** @module utils/insert-widget */

export default function insertWidget (method, segment, widget, config) {
  // assume that we need to add a new widget until proved otherwise
  var subject,
      makeNew = true;

  // make sure our scaffold is valid
  if (!config.target) {
    throw new Error('Invalid scaffold. No target array.');
  }
  if (!config.exclude) {
    throw new Error('Invalid scaffold. No exclude array.');
  }
  if (!config.inverse) {
    throw new Error('Invalid scaffold. No inverse array.');
  }

  if (method === 'target') {
    subject = config.target;
  } else if (method === 'exclude') {
    subject = config.exclude;
  } else {
    throw new Error('Invalid method (' + method + ').');
  }

  for (var i = 0; i < subject.length; i++) {
    var wgt = subject[i];

    if (wgt.segment === segment) {
      wgt.widgets.push(widget);
      makeNew = false;
    }
  }

  if (makeNew) {
    subject.push({
      'segment': segment,
      'widgets': [widget]
    });
  }
};