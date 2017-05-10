/** @module pathfora/inline/proc-trigger-elements */

import inSegment from '../data/segments/in-segment';

export default function procTriggerElements (elems, group) {
  var matched = false,
      defaultEl = {};

  for (var i = 0; i < elems.length; i++) {
    var elem = elems[i];

    // if we find a match show that and prevent others from showing in same group
    if (inSegment(elem.trigger) && !matched) {
      elem.elem.removeAttribute('data-pftrigger');
      elem.elem.setAttribute('data-pfmodified', 'true');
      this.preppedElements[group] = elem;

      if (group !== 'default') {
        matched = true;
        continue;
      }
    }

    // if this is the default save it
    if (elem.trigger === 'default') {
      defaultEl = elem;
    }
  }

  // if nothing matched show default
  if (!matched && group !== 'default' && defaultEl.elem) {
    defaultEl.elem.removeAttribute('data-pftrigger');
    defaultEl.elem.setAttribute('data-pfmodified', 'true');
    this.preppedElements[group] = defaultEl;
  }
}
