/** @module utils/has-class */

export default function hasClass (DOMNode, className) {
  return new RegExp('(^| )' + className + '( |$)', 'gi').test(DOMNode.className);
}