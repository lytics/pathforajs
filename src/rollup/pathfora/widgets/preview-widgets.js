/** @module pathfora/preview-widget */

import generateUniqueId from '../../utils/generate-unique-id'
import createWidgetHtml from '../../core/widgets/create-widget-html'

export default function previewWidget (widget) {
  widget.id = generateUniqueId();
  return core.createWidgetHtml(widget);
};