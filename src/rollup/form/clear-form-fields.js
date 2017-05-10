/** @module core/auto-complete-form-fields */

import document from '../dom/document'

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
};