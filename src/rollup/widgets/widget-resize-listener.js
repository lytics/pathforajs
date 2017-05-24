/** @module pathfora/widgets/widget-resize-listener */

// globals
import { WIDTH_BREAKPOINT } from '../globals/config';

// utils
import addClass from '../utils/class/add-class';
import removeClass from '../utils/class/remove-class';
import hasClass from '../utils/class/has-class';

/**
 * Adjust widget look and feel on window resize bounds
 *
 * @exports widgetResizeListener
 * @params {object} widget
 * @params {object} node
 */
export default function widgetResizeListener (widget, node) {
  if (widget.layout === 'inline' || widget.layout === 'modal' && widget.recommend) {
    var rec = node.querySelector('.pf-content-unit');
    if (rec) {
      if (node.offsetWidth < WIDTH_BREAKPOINT && !hasClass(rec, 'stack')) {
        addClass(rec, 'stack');
      } else if (node.offsetWidth >= WIDTH_BREAKPOINT) {
        removeClass(rec, 'stack');
      }
    }
  }
}
