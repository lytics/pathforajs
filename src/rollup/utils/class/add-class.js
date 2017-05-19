/** @module pathfora/utils/class/add-class */

import removeClass from './remove-class';

/**
 * Add a class to an HTML element
 *
 * @exports addClass
 * @params {object} DOMNode
 * @params {string} className
 */
export default function addClass (DOMNode, className) {
  removeClass(DOMNode, className);

  DOMNode.className = [
    DOMNode.className,
    className
  ].join(' ');
}
