/** @module pathfora/data/tracking/track-widget-action */

// global
import { PREFIX_UNLOCK, pathforaDataObject } from '../../globals/config';

// utils
import reportData from '../request/report-data';
import write from '../../utils/persist/write';
import hasClass from '../../utils/class/has-class';

/**
 * Format and track interaction events such as
 * CTA clicks, form status, etc.
 *
 * @exports trackWidgetAction
 * @params {string} action
 * @params {object} widget
 * @params {object} htmlElement
 */
export default function trackWidgetAction (action, widget, htmlElement) {
  var child, elem, i;

  var params = {
    'pf-widget-id': widget.id,
    'pf-widget-type': widget.type,
    'pf-widget-layout': widget.layout,
    'pf-widget-variant': widget.variant
  };

  if (widget.recommend && widget.content && widget.content.length > 0) {
    params['pf-widget-content'] = widget.content[0];
  }

  switch (action) {
  case 'show':
    pathforaDataObject.displayedWidgets.push(params);
    break;
  case 'close':
    params['pf-widget-action'] = !!widget.closeAction && widget.closeAction.name || 'close';
    pathforaDataObject.closedWidgets.push(params);
    break;
  case 'confirm':
    if (htmlElement && hasClass(htmlElement, 'pf-content-unit')) {
      params['pf-widget-action'] = 'content recommendation';
    } else {
      params['pf-widget-action'] = !!widget.confirmAction && widget.confirmAction.name || 'default confirm';
      pathforaDataObject.completedActions.push(params);
    }
    break;
  case 'cancel':
    params['pf-widget-action'] = !!widget.cancelAction && widget.cancelAction.name || 'default cancel';
    pathforaDataObject.cancelledActions.push(params);
    break;
  case 'success.confirm':
    params['pf-widget-action'] = !!widget.formStates && !!widget.formStates.success
      && !!widget.formStates.success.confirmAction && widget.formStates.success.confirmAction.name || 'success confirm';
    pathforaDataObject.completedActions.push(params);
    break;
  case 'success.cancel':
    params['pf-widget-action'] = !!widget.formStates && !!widget.formStates.success
      && !!widget.formStates.success.cancelAction && widget.formStates.success.cancelAction.name || 'success cancel';
    pathforaDataObject.cancelledActions.push(params);
    break;
  case 'error.confirm':
    params['pf-widget-action'] = !!widget.formStates && !!widget.formStates.error
      && !!widget.formStates.error.confirmAction && widget.formStates.error.confirmAction.name || 'error confirm';
    pathforaDataObject.completedActions.push(params);
    break;
  case 'error.cancel':
    params['pf-widget-action'] = !!widget.formStates && !!widget.formStates.error
      && !!widget.formStates.error.cancelAction && widget.formStates.error.cancelAction.name || 'error cancel';
    pathforaDataObject.cancelledActions.push(params);
    break;

  case 'submit':
  case 'unlock':
    if (hasClass(htmlElement, 'pf-custom-form')) {
      params['pf-custom-form'] = {};
    }

    for (elem in htmlElement.children) {
      if (htmlElement.children.hasOwnProperty(elem)) {
        child = htmlElement.children[elem];

        if (hasClass(child, 'pf-widget-radio-group') || hasClass(child, 'pf-widget-checkbox-group')) {
          var values = [],
              name = '',
              inputs = child.querySelectorAll('input');

          for (i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if (input.checked) {
              name = input.getAttribute('name');
              values.push(input.value);
            }
          }

          if (name !== '') {
            params['pf-custom-form'][name] = values;
          }
        } else if (child && typeof child.getAttribute !== 'undefined' && child.getAttribute('name') !== null) {
          params['pf-form-' + child.getAttribute('name')] = child.value;
        } else if (hasClass(htmlElement, 'pf-custom-form') && child && child.querySelector) {
          var val = child.querySelector('input, select, textarea');

          if (val && typeof val.getAttribute !== 'undefined' && val.getAttribute('name') !== null) {
            params['pf-custom-form'][val.getAttribute('name')] = val.value;
          }
        }
      }
    }

    if (action === 'unlock') {
      write(PREFIX_UNLOCK + widget.id, true, widget.expiration);
    }

    break;
  case 'subscribe':
    params['pf-form-email'] = htmlElement.elements.email.value;
    break;
  case 'hover':
    if (hasClass(htmlElement, 'pf-content-unit')) {
      params['pf-widget-action'] = 'content recommendation';
    } else if (hasClass(htmlElement, 'pf-widget-ok')) {
      if (htmlElement.parentElement && hasClass(htmlElement.parentElement, 'success-state')) {
        params['pf-widget-action'] = 'success.confirm';
      } else if (htmlElement.parentElement && hasClass(htmlElement.parentElement, 'error-state')) {
        params['pf-widget-action'] = 'error.confirm';
      } else {
        params['pf-widget-action'] = 'confirm';
      }
    } else if (hasClass(htmlElement, 'pf-widget-cancel')) {
      if (htmlElement.parentElement && hasClass(htmlElement.parentElement, 'success-state')) {
        params['pf-widget-action'] = 'success.cancel';
      } else if (htmlElement.parentElement && hasClass(htmlElement.parentElement, 'error-state')) {
        params['pf-widget-action'] = 'error.cancel';
      } else {
        params['pf-widget-action'] = 'cancel';
      }
    } else if (hasClass(htmlElement, 'pf-widget-close')) {
      params['pf-widget-action'] = 'close';
    }
    break;
  case 'focus':
    if (htmlElement && typeof htmlElement.getAttribute !== 'undefined' && htmlElement.getAttribute('name') !== null) {
      params['pf-widget-action'] = htmlElement.getAttribute('name');
    }
    break;
  case 'form_start':
    if (htmlElement && typeof htmlElement.getAttribute !== 'undefined' && htmlElement.getAttribute('name') !== null) {
      params['pf-widget-action'] = htmlElement.getAttribute('name');
    }
    break;
  }

  params['pf-widget-event'] = action;
  reportData(params, widget);
}
