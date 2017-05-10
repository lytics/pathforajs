/** @module pathfora/inline */

import document from '../dom/document'
import prepElements from './prep-elements'
import procElements from './proc-elements'
import procRecommendElements from './proc-recommend-elements'
import procTriggerElements from './proc-trigger-elements'
import setDefaultRecommend from'./set-default-recommend'


export default function Inline (pf) {
  this.elements = [];
  this.preppedElements = [];
  this.defaultElements = [];
  this.parent = pf;

  this.prepElements = prepElements;
  this.procElements = procElements;
  this.procRecommendElements = procRecommendElements;
  this.procTriggerElements = procTriggerElements;
  this.setDefaultRecommend = setDefaultRecommend;

  // for our automatic element handling we need to ensure they are all hidden by default
  var css = '[data-pftrigger], [data-pfrecommend]{ display: none; }',
      style = document.createElement('style');

  style.type = 'text/css';

  if (style.styleSheet) { // handle ie
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  document.getElementsByTagName('head')[0].appendChild(style);
};