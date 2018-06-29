/** @module pathfora/utils/class/remove-class */

import escapeRegex from '../escape-regex';

/**
 * Remove a class from an HTML element
 *
 * @exports removeClass
 * @params {object} DOMNode
 * @params {string} className
 */
export default function removeClass (DOMNode, className) {
  var findClassRegexp = new RegExp([
    '(^|\\b)',
    escapeRegex(className.split(' ').join('|')),
    '(\\b|$)'
  ].join(''), 'gi');
  DOMNode.className = DOMNode.className.replace(findClassRegexp, ' ');
}
