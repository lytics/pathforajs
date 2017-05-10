/** @module utils/add-class */

import removeClass from './remove-class'

export default function addClass (DOMNode, className) {
  removeClass(DOMNode, className);

  DOMNode.className = [
    DOMNode.className,
    className
  ].join(' ');
};