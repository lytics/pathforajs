/** @module pathfora/utils/class/remove-class */

export default function removeClass (DOMNode, className) {
  var findClassRegexp = new RegExp([
    '(^|\\b)',
    className.split(' ').join('|'),
    '(\\b|$)'
  ].join(''), 'gi');

  DOMNode.className = DOMNode.className.replace(findClassRegexp, ' ');
}
