/** @module pathfora/utils/class/has-class */

import escapeRegex from '../escape-regex';

/**
 * Check if an HTML element has a class
 *
 * @exports hasClass
 * @params {object} DOMNode
 * @params {string} className
 * @params {boolean}
 */
export default function hasClass (DOMNode, className) {
  return new RegExp('(^| )' + escapeRegex(className) + '( |$)', 'gi').test(DOMNode.className);
}
