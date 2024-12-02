/** @module pathfora/widgets/actions/construct-widget-actions */

// globals
import {
  callbackTypes,
  PREFIX_CONFIRM,
  PREFIX_CLOSE,
} from '../../globals/config';

// dom
// import document from '../../dom/document';

// utils
import hasClass from '../../utils/class/has-class';
import addClass from '../../utils/class/add-class';
import removeClass from '../../utils/class/remove-class';
import emailValid from '../../utils/email-valid';
import dateValid from '../../utils/date-valid';

// form
import handleFormStates from '../../form/handle-form-states';

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
export default function constructWidgetActions(widget, config) {
  var widgetOnButtonClick,
    widgetFormValidate,
    widgetForm,
    widgetOk = widget.querySelector('.pf-widget-ok'),
    widgetCancel = widget.querySelector('.pf-widget-cancel'),
    widgetClose = widget.querySelector('.pf-widget-close'),
    widgetReco = widget.querySelector('.pf-content-unit');

  // Tracking for widgets with a form element
  switch (config.type) {
    case 'form':
    case 'sitegate':
    case 'subscription':
      widgetForm = widget.querySelector('form');

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
          if (
            typeof child.getAttribute !== 'undefined' &&
            child.getAttribute('name') !== null
          ) {
            // Track focus of form elements
            child.onfocus = onInputFocus;

            // Track input to indicate they've begun to interact with the form
            child.onchange = onInputChange;
          }
        }
      }

      // Form submit handler
      widgetFormValidate = function (event) {
        event.preventDefault();

        // Validate that the form is filled out correctly
        var valid = true,
          requiredElements = Array.prototype.slice.call(
            widgetForm.querySelectorAll('[data-required=true]')
          ),
          validatableElements = Array.prototype.slice.call(
            widgetForm.querySelectorAll('[data-validate=true]')
          ),
          i,
          field,
          parent;

        for (i = 0; i < requiredElements.length; i++) {
          field = requiredElements[i];

          if (hasClass(widgetForm, 'pf-custom-form')) {
            if (field.parentNode) {
              parent = field.parentNode;
              removeClass(parent, 'invalid');

              if (
                hasClass(parent, 'pf-widget-radio-group') ||
                hasClass(parent, 'pf-widget-checkbox-group')
              ) {
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
              } else if (!field.value) {
                valid = false;
                addClass(parent, 'invalid');
                if (field && i === 0) {
                  field.focus();
                }
              }
            }
            // legacy support old, non-custom forms
          } else if (field.hasAttribute('data-required')) {
            removeClass(field, 'invalid');

            if (!field.value) {
              valid = false;
              addClass(field, 'invalid');
              if (field && i === 0) {
                field.focus();
              }
            }

            // if a validation pattern exists we can assume its required
            var pattern = field.getAttribute('enforcePattern');
            if (pattern) {
              // validate the regex pattern against the input string
              var regex = new RegExp(pattern);
              if (!regex.test(field.value)) {
                valid = false;
                addClass(parent, 'invalid');
              }
            }
          }
        }

        for (i = 0; i < validatableElements.length; i++) {
          field = validatableElements[i];

          if (hasClass(widgetForm, 'pf-custom-form')) {
            if (field.parentNode) {
              parent = field.parentNode;
              removeClass(parent, 'bad-validation');

              if (
                (field.value !== '' &&
                  field.getAttribute('type') === 'email' &&
                  !emailValid(field.value)) ||
                (field.getAttribute('type') === 'date' &&
                  !dateValid(
                    field.value,
                    field.getAttribute('max'),
                    field.getAttribute('min')
                  ))
              ) {
                valid = false;
                addClass(parent, 'bad-validation');
                if (field && i === 0) {
                  field.focus();
                }
              }
            }
            // legacy support old, non-custom forms
          } else if (field.hasAttribute('data-validate')) {
            removeClass(field, 'bad-validation');

            if (
              field.getAttribute('type') === 'email' &&
              !emailValid(field.value) &&
              field.value !== ''
            ) {
              valid = false;
              addClass(field, 'bad-validation');
              if (field && i === 0) {
                field.focus();
              }
            }
          }
        }

        return valid;
      };

      break;
  }

  switch (config.layout) {
    case 'button':
      if (typeof config.onClick === 'function') {
        widgetOnButtonClick = function (event) {
          config.onClick(callbackTypes.CLICK, {
            widget: widget,
            config: config,
            event: event,
          });
        };
      }
      break;
    case 'modal':
      if (config.type !== 'sitegate') {
        config.listeners.escape = {
          type: 'keydown',
          target: document,
          fn: function (event) {
            event = event || window.event;
            if (event.keyCode === 27) {
              trackWidgetAction('close', config);
              updateActionCookie(PREFIX_CLOSE + widget.id, config.expiration);
              closeWidget(widget.id, true);
              widgetOnModalClose(widget, config, event);
            }
          },
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
      var data,
        widgetAction,
        shouldClose = true;

      // special case for form widgets
      if (typeof widgetFormValidate === 'function') {
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

        // validate form input
        if (!widgetAction || !widgetFormValidate(event)) {
          return;
        } else if (widgetForm) {
          trackWidgetAction(widgetAction, config, widgetForm);

          // get the data submitted to the form
          data = Array.prototype.slice
            .call(widgetForm.querySelectorAll('input, textarea, select'))
            .filter(function (element) {
              if (
                element.type &&
                (element.type === 'checkbox' || element.type === 'radio')
              ) {
                return element.checked;
              }
              return true;
            })
            .map(function (element) {
              return {
                name: element.name || element.id,
                value: element.value,
              };
            });

          // onSubmit callback should be deprecated,
          // we keep the cb for backwards compatibility.
          if (typeof config.onSubmit === 'function') {
            config.onSubmit(callbackTypes.FORM_SUBMIT, {
              widget: widget,
              config: config,
              event: event,
              data: data,
            });
          }
        }
      }

      // track confirm action
      trackWidgetAction('confirm', config);
      updateActionCookie(PREFIX_CONFIRM + widget.id, config.expiration);

      // support onClick callback for button modules
      if (typeof widgetOnButtonClick === 'function') {
        widgetOnButtonClick(event);
      }

      // confirmAction
      if (typeof config.confirmAction === 'object') {
        if (config.confirmAction.close === false) {
          shouldClose = false;
        }

        if (typeof config.confirmAction.callback === 'function') {
          var param = {
            widget: widget,
            config: config,
            event: event,
          };

          // include the data from the form if we have it.
          if (data) {
            param.data = data;
          }

          // if waitForAsyncResponse we will handle the states as part of the callback
          if (config.confirmAction.waitForAsyncResponse === true) {
            config.confirmAction.callback(
              callbackTypes.MODAL_CONFIRM,
              param,
              function (successful) {
                handleFormStates(successful, widget, config);
              }
            );
            return;
          } else {
            config.confirmAction.callback(callbackTypes.MODAL_CONFIRM, param);
          }
        }
      }

      if (shouldClose) {
        if (
          config.layout !== 'inline' &&
          (!config.formStates || !config.formStates.success)
        ) {
          closeWidget(widget.id, true);
          widgetOnModalClose(widget, config, event);
        } else {
          // show success state
          handleFormStates(true, widget, config);
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
