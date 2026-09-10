/** @module pathfora/widgets/setup-widget-aria */

// NOTE ids are handed out from a counter rather than derived from the widget id
// so that several widgets open at once cannot collide, and so that nothing
// matching a widget id is introduced anywhere else in the document
var ariaIdCounter = 0;

/**
 * Give the widget container an accessible name and description by pointing
 * aria-labelledby/aria-describedby at the widget's own headline and message.
 *
 * References are only set when the element they point at will actually hold
 * text - a reference to an empty or absent element leaves the dialog unnamed
 * just as surely as no reference at all.
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

  var headline = config.headline
      ? widget.querySelector('.pf-widget-headline')
      : null,
    message = config.msg ? widget.querySelector('.pf-widget-message') : null,
    suffix = '-' + ++ariaIdCounter;

  if (headline) {
    headline.id = 'pf-widget-headline' + suffix;
    container.setAttribute('aria-labelledby', headline.id);

    if (message) {
      message.id = 'pf-widget-message' + suffix;
      container.setAttribute('aria-describedby', message.id);
    }
  } else if (message) {
    // NOTE bar layouts have no headline element at all, so the message is the
    // only text available to name the dialog with
    message.id = 'pf-widget-message' + suffix;
    container.setAttribute('aria-labelledby', message.id);
  }
}
