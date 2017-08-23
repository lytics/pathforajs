/** @module pathfora/widgets/actions/construct-widget-actions */

// globals
import { callbackTypes, PREFIX_CONFIRM } from '../../globals/config';

// utils
import hasClass from '../../utils/class/has-class';
import addClass from '../../utils/class/add-class';
import removeClass from '../../utils/class/remove-class';
import emailValid from '../../utils/email-valid';

// data
import trackWidgetAction from '../../data/tracking/track-widget-action';

// widgets
import closeWidget from '../close-widget';
import widgetOnModalClose from './widget-on-modal-close';
import buttonAction from './button-action';
import updateActionCookie from './update-action-cookie';

/**
 * Add callbacks and tracking for user interactions
 * with widgets
 *
 * @exports constructWidgetActions
 * @params {object} widget
 * @params {object} config
 */
export default function constructWidgetActions (widget, config) {
  var widgetOnButtonClick, widgetOnFormSubmit,
      widgetOk = widget.querySelector('.pf-widget-ok'),
      widgetCancel = widget.querySelector('.pf-widget-cancel'),
      widgetClose = widget.querySelector('.pf-widget-close'),
      widgetReco = widget.querySelector('.pf-content-unit');

  // Tracking for widgets with a form element
  switch (config.type) {
  case 'form':
  case 'sitegate':
  case 'subscription':
    var widgetForm = widget.querySelector('form');

    var onInputChange = function (event) {
      if (event.target.value && event.target.value.length > 0) {
        trackWidgetAction('form_start', config, event.target);
      }
    };

    var onInputFocus = function (event) {
      trackWidgetAction('focus', config, event.target);
    };

    // Additional tracking for input focus and entering text into the form
    for (var elem in widgetForm.childNodes) {
      if (widgetForm.children.hasOwnProperty(elem)) {
        var child = widgetForm.children[elem];
        if (typeof child.getAttribute !== 'undefined' && child.getAttribute('name') !== null) {
          // Track focus of form elements
          child.onfocus = onInputFocus;

          // Track input to indicate they've begun to interact with the form
          child.onchange = onInputChange;
        }
      }
    }

    // Form submit handler
    widgetOnFormSubmit = function (event) {
      var widgetAction;
      event.preventDefault();

      switch (config.type) {
      case 'form':
        widgetAction = 'submit';
        break;
      case 'subscription':
        widgetAction = 'subscribe';
        break;
      case 'sitegate':
        widgetAction = 'unlock';
        break;
      }

      // Validate that the form is filled out correctly
      var valid = true,
          requiredElements = Array.prototype.slice.call(widgetForm.querySelectorAll('[data-required=true]'));

      for (var i = 0; i < requiredElements.length; i++) {
        var field = requiredElements[i];

        if (hasClass(widgetForm, 'pf-custom-form')) {
          if (field.parentNode) {
            var parent = field.parentNode;
            removeClass(parent, 'invalid');

            if (hasClass(parent, 'pf-widget-radio-group') || hasClass(parent, 'pf-widget-checkbox-group')) {
              var inputs = field.querySelectorAll('input');
              var count = 0;

              for (var j = 0; j < inputs.length; j++) {
                var input = inputs[j];
                if (input.checked) {
                  count++;
                }
              }

              if (count === 0) {
                valid = false;
                addClass(parent, 'invalid');
              }
            } else if (!field.value || (field.getAttribute('type') === 'email' && !emailValid(field.value))) {
              valid = false;
              addClass(parent, 'invalid');

              if (i === 0) {
                field.focus();
              }
            }
          }
        // legacy support old, non-custom forms
        } else if (field.hasAttribute('data-required')) {
          removeClass(field, 'invalid');

          if (!field.value || (field.getAttribute('type') === 'email' && !emailValid(field.value))) {
            valid = false;
            addClass(field, 'invalid');
            if (i === 0) {
              field.focus();
            }
          }
        }
      }

      if (valid && widgetAction) {
        trackWidgetAction(widgetAction, config, widgetForm);

        if (typeof config.onSubmit === 'function') {
          config.onSubmit(callbackTypes.FORM_SUBMIT, {
            widget: widget,
            config: config,
            event: event,
            data: Array.prototype.slice.call(
              widgetForm.querySelectorAll('input, textarea, select')
            ).map(function (element) {
              return {
                name: element.name || element.id,
                value: element.value
              };
            })
          });
        }
        return true;
      }
      return false;
    };

    break;
  }

  switch (config.layout) {
  case 'folding':
    var widgetAllCaptions = widget.querySelectorAll('.pf-widget-caption, .pf-widget-caption-left'),
        widgetFirstCaption = widget.querySelector('.pf-widget-caption');

    if (config.position !== 'left') {
      setTimeout(function () {
        var height = widget.offsetHeight - widgetFirstCaption.offsetHeight;
        widget.style.bottom = -height + 'px';
      }, 0);
    }

    for (var i = widgetAllCaptions.length - 1; i >= 0; i--) {
      widgetAllCaptions[i].onclick = function () {
        if (hasClass(widget, 'opened')) {
          removeClass(widget, 'opened');
        } else {
          addClass(widget, 'opened');
        }
      };
    }
    break;

  case 'button':
    if (typeof config.onClick === 'function') {
      widgetOnButtonClick = function (event) {
        config.onClick(callbackTypes.CLICK, {
          widget: widget,
          config: config,
          event: event
        });
      };
    }
    break;
  default:
    break;
  }

  if (widgetClose) {
    buttonAction(widgetClose, 'close', config, widget);
  }

  if (widgetCancel) {
    buttonAction(widgetCancel, 'cancel', config, widget);
  }

  if (widgetOk) {
    widgetOk.onmouseenter = function (event) {
      trackWidgetAction('hover', config, event.target);
    };

    widgetOk.onclick = function (event) {
      var shouldClose = true;
      if (typeof widgetOnFormSubmit === 'function' && !widgetOnFormSubmit(event)) {
        // invalid form, do not submit
      } else {
        trackWidgetAction('confirm', config);
        updateActionCookie(PREFIX_CONFIRM + widget.id, config.expiration);

        if (typeof config.confirmAction === 'object') {
          if (config.confirmAction.close === false) {
            shouldClose = false;
          }

          if (typeof config.confirmAction.callback === 'function') {
            config.confirmAction.callback(callbackTypes.MODAL_CONFIRM, {
              widget: widget,
              config: config,
              event: event
            });
          }
        }

        if (typeof widgetOnButtonClick === 'function') {
          widgetOnButtonClick(event);
        }

        if (shouldClose) {
          if (config.layout !== 'inline' && typeof config.success === 'undefined') {
            closeWidget(widget.id, true);
            widgetOnModalClose(widget, config, event);

          // show success state
          } else {
            addClass(widget, 'success');

            // default to a three second delay if the user has not defined one
            var delay = typeof config.success.delay !== 'undefined' ? config.success.delay * 1000 : 3000;

            if (delay > 0) {
              setTimeout(function () {
                closeWidget(widget.id, true);
              }, delay);
            }
          }
        }
      }
    };
  }

  if (widgetReco) {
    widgetReco.onmouseenter = function (event) {
      trackWidgetAction('hover', config, event.target);
    };

    widgetReco.onclick = function (event) {
      trackWidgetAction('confirm', config, event.target);
      updateActionCookie(PREFIX_CONFIRM + widget.id, config.expiration);
    };
  }
}
