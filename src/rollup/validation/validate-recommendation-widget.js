/** @module pathfora/validation/validate-recommendation-widget */

/**
 * Validate that a recommendation widget
 * is using the correct type and layout
 *
 * @exports validateRecommendationWidget
 * @params {object} widget
 */
export default function validateRecommendationWidget (widget) {
  // validate
  if (widget.type !== 'message') {
    throw new Error('Unsupported widget type for content recommendation');
  }

  if (
    widget.layout !== 'slideout' &&
    widget.layout !== 'modal' &&
    widget.layout !== 'inline'
  ) {
    throw new Error('Unsupported layout for content recommendation');
  }

  if (widget.content && widget.content[0] && !widget.content[0].default) {
    throw new Error('Cannot define recommended content unless it is a default');
  }
}
