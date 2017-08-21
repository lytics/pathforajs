/** @module pathfora/widgets/actions/widgetOnModalClose */

import { callbackTypes } from '../../globals/config';

/**
 * Execute the onModalClose callback
 * if set by the user
 *
 * @exports widgetOnModalClose
 * @params {object} widget
 * @params {object} config
 * @params {object} event
 */

export default function widgetOnModalClose (widget, config, event) {
  if (typeof config.onModalClose === 'function') {
    config.onModalClose(callbackTypes.MODAL_CLOSE, {
      widget: widget,
      config: config,
      event: event
    });
  }
}
