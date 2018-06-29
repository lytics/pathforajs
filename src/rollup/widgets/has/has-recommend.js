/** @module pathfora/widgets/has/has-recommend */

/**
 * Check if the widget has recommendations.
 *
 * @exports hasRecommend
 * @params {object} widget
 * @returns {bool} hasRecommend
 */
export default function hasRecommend (widget) {
  return widget.recommend && Object.keys(widget.recommend).length !== 0;
}
