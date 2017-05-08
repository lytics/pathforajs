/** @module core/auto-complete-form-fields */

export default function autoCompleteFormFields (data) {
  var widgets = Array.prototype.slice.call(document.querySelectorAll('.pf-widget-content'));

  widgets.forEach(function (widget) {
    if (widget.querySelector('.' + data.type + '-login-btn')) {
      Object.keys(data).forEach(function (inputField) {
        var field = widget.querySelector('input[name="' + inputField + '"]');

        if (field && !field.value) {
          field.value = data[inputField];
        }
      });
    }
  });
};