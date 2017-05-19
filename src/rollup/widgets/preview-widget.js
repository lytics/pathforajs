/** @module pathfora/widgets/preview-widget */

import generateUniqueId from '../utils/generate-unique-id';

import createWidgetHtml from './create-widget-html';

/**
 * Create a minimal widget for a preview
 *
 * @exports previewWidget
 * @params {object} widget
 * @returns {object}
 */
export default function previewWidget (widget) {
  widget.id = generateUniqueId();
  return createWidgetHtml(widget);
}
