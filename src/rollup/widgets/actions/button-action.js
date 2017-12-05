/** @module pathfora/widgets/actions/buton-action */

import { callbackTypes, PREFIX_CONFIRM, PREFIX_CLOSE, PREFIX_CANCEL } from '../../globals/config';

// data
import trackWidgetAction from '../../data/tracking/track-widget-action';

// widgets
import closeWidget from '../close-widget';
import widgetOnModalClose from './widget-on-modal-close';
import updateActionCookie from './update-action-cookie';

/**
 * Execute any callbacks that were assigned
 * to a button, and perform tracking
 *
 * @exports widgetOnModalClose
 * @params {object} btn
 * @params {string} type
 * @params {object} config
 * @params {object} widget
 */

export default function buttonAction (btn, type, config, widget) {
  var prefix, callbackType, action, shouldClose;

  switch (type) {
  case 'close':
    prefix = PREFIX_CLOSE;
    callbackType = callbackTypes.MODAL_CLOSE;
    action = config.closeAction;
    shouldClose = true;
    break;
  case 'cancel':
  case 'success.cancel':
  case 'error.cancel':
    prefix = PREFIX_CANCEL;
    callbackTypes.MODAL_CANCEL;
    action = config.cancelAction;
    shouldClose = config.layout !== 'inline';

    if (type === 'success.cancel') {
      action = config.formStates.success.cancelAction;
    }

    if (type === 'error.cancel') {
      action = config.formStates.error.cancelAction;
    }

    break;
  case 'confirm':
  case 'success.confirm':
  case 'error.confirm':
    prefix = PREFIX_CONFIRM;
    callbackTypes.MODAL_CONFIRM;
    shouldClose = config.layout !== 'inline';

    if (type === 'success.confirm') {
      action = config.formStates.success.confirmAction;
    }
    if (type === 'error.confirm') {
      action = config.formStates.error.confirmAction;
    }

    break;
  }

  btn.onmouseenter = function (event) {
    trackWidgetAction('hover', config, event.target);
  };

  btn.onclick = function (event) {
    trackWidgetAction(type, config);
    updateActionCookie(prefix + widget.id, config.expiration);

    if (typeof action === 'object') {
      if (action.close === false) {
        shouldClose = false;
      }

      if (typeof action.callback === 'function') {
        action.callback(callbackType, {
          widget: widget,
          config: config,
          event: event
        });
      }
    }

    if (shouldClose) {
      closeWidget(widget.id, true);
      widgetOnModalClose(widget, config, event);
    }
  };
}
