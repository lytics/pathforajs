/** @module pathfora/preview-widget */

import generateUniqueId from '../utils/generate-unique-id'
import createWidgetHtml from './create-widget-html'

export default function previewWidget (widget) {
  widget.id = generateUniqueId();
  return createWidgetHtml(widget);
};