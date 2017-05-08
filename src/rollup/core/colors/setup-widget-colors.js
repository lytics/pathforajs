/** @module core/setup-widget-colors */

export default function setupWidgetColors (widget, config) {
  switch (config.theme) {
  case 'custom':
    if (config.colors) {
      core.setCustomColors(widget, config.colors);
    }
    break;
  case 'none':
    // Do nothing, we will rely on CSS for the colors
    break;
  default:
    if (config.theme) {
      core.setCustomColors(widget, defaultProps.generic.themes[config.theme]);
    }
    break;
  }
};