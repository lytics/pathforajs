/** @module pathfora/widgets/setup-widget-aria */

// widgets
import describeWidgetContainer from './describe-widget-container';

/**
 * Give the widget container an accessible name and description by pointing
 * aria-labelledby/aria-describedby at the widget's own headline and message.
 *
 * @exports setupWidgetAria
 * @params {object} widget
 * @params {object} config
 */
export default function setupWidgetAria(widget, config) {
  var container = widget.querySelector('.pf-widget-container');

  if (!container) {
    return;
  }

  describeWidgetContainer(
    container,
    config.headline ? widget.querySelector('.pf-widget-headline') : null,
    config.msg ? widget.querySelector('.pf-widget-message') : null,
    config.id,
  );
}
