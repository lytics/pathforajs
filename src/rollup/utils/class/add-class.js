/** @module utils/add-class */

export default function addClass (DOMNode, className) {
  this.removeClass(DOMNode, className);

  DOMNode.className = [
    DOMNode.className,
    className
  ].join(' ');
};