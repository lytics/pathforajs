/** @module pathfora/widgets/create-widget-html */

// globals
import { templates } from '../globals/config';

// dom
import document from '../dom/document';

// widgets
import setupWidgetPosition from './setup-widget-position';
import constructWidgetActions from './actions/construct-widget-actions';
import setupWidgetContentUnit from './recommendations/setup-widget-content-unit';
import setWidgetClassname from './set-widget-classname';
import constructWidgetLayout from './construct-widget-layout';
import setupWidgetColors from './colors/setup-widget-colors';

/**
 * Call all the necessary functions to construct
 * the widget html
 *
 * @exports createWidgetHtml
 * @params {object} config
 * @returns {object} widget
 */
export default function createWidgetHtml (config) {
  var widget = document.createElement('div');

  widget.innerHTML = templates[config.type][config.layout] || '';
  widget.id = config.id;

  if (widget.innerHTML === '') {
    throw new Error('Could not get pathfora template based on type and layout.');
  }

  setupWidgetPosition(widget, config);
  constructWidgetActions(widget, config);
  setupWidgetContentUnit(widget, config);
  setWidgetClassname(widget, config);
  constructWidgetLayout(widget, config);
  setupWidgetColors(widget, config);

  // Slideout templates have no dialog container, so the root element carries the
  // dialog semantics. Intentionally no aria-modal: a slideout does not block the
  // page or trap focus, and claiming otherwise would mislead assistive technology.
  if (config.layout === 'slideout') {
    var headline = widget.querySelector('.pf-widget-headline');
    var message = widget.querySelector('.pf-widget-message');

    widget.setAttribute('role', 'dialog');

    if (headline && headline.innerHTML) {
      headline.id = config.id + '-headline';
      widget.setAttribute('aria-labelledby', headline.id);
    }

    if (message && message.innerHTML) {
      message.id = config.id + '-message';
      widget.setAttribute('aria-describedby', message.id);
    }
  }

  return widget;
}
