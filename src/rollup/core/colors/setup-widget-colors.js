/** @module core/setup-widget-colors */

import setCustomColors from './set-custom-colors'
import { defaultProps } from '../../config/default-props'

export default function setupWidgetColors (widget, config) {
  switch (config.theme) {
  case 'custom':
    if (config.colors) {
      csetCustomColors(widget, config.colors);
    }
    break;
  case 'none':
    // Do nothing, we will rely on CSS for the colors
    break;
  default:
    if (config.theme) {
      setCustomColors(widget, defaultProps.generic.themes[config.theme]);
    }
    break;
  }
};