/** @module pathfora/form/auto-complete-form-fields */

import document from '../dom/document';

/**
 * Clear all current values from a widget form
 *
 * @exports clearFormFields
 * @params {string} type
 * @params {array} fields
 */
export default function clearFormFields (type, fields) {
  var widgets = Array.prototype.slice.call(document.querySelectorAll('.pf-widget-content'));

  widgets.forEach(function (widget) {
    if (widget.querySelector('.' + type + '-login-btn')) {
      fields.forEach(function (inputField) {
        var field = widget.querySelector('input[name="' + inputField + '"]');

        if (field) {
          field.value = '';
        }
      });
    }
  });
}
