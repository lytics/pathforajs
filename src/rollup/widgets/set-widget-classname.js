/** @module core/set-widget-classname */

/**
 * Setup the className for a widget
 *
 * @exports setWidgetClassname
 * @params {object} widget
 * @params {object} config
 */
export default function setWidgetClassname (widget, config) {
  widget.className = [
    'pf-widget ',
    'pf-' + config.type,
    ' pf-widget-' + config.layout,
    config.position ? ' pf-position-' + config.position : '',
    config.pushDown ? ' pf-has-push-down' : '',
    config.origin ? ' pf-origin-' + config.origin : '',
    ' pf-widget-variant-' + config.variant,
    config.theme ? ' pf-theme-' + config.theme : '',
    config.className ? ' ' + config.className : '',
    config.branding ? ' pf-widget-has-branding' : '',
    !config.responsive ? ' pf-mobile-hide' : ''
  ].join('');
}
