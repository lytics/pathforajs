/** @module pathfora/inline/set-default-recommend */

/**
 * Show the default "recommendation" if we received
 * a bad response from the API
 *
 * @exports setDefaultRecommend
 */
export default function setDefaultRecommend () {
  // check the default elements
  for (var block in this.defaultElements) {
    // If we already have an element prepped for this block, don't show the default
    if (this.defaultElements.hasOwnProperty(block) && !this.preppedElements.hasOwnProperty(block) && block !== 'shuffle') {
      var def = this.defaultElements[block];
      def.elem.removeAttribute('data-pfrecommend');
      def.elem.setAttribute('data-pfmodified', 'true');
      this.preppedElements[block] = def;
    }
  }
}
