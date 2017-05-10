/** @module core/build-widget-form */

import buildFormElement from './build-form-element'

export default function buildWidgetForm (formElements, form) {
  for (var i = 0; i < formElements.length; i++) {
    var elem = formElements[i];

    switch (elem.type) {
    // Radio & Checkbox Button Group
    case 'radio-group':
    case 'checkbox-group':
      elem.groupType = elem.type.split('-')[0];
      buildFormElement(elem, form);
      delete elem.groupType;
      break;

    // Textarea, Input, & Select
    case 'textarea':
    case 'input':
    case 'select':
      buildFormElement(elem, form);
      break;

    default:
      throw new Error('unrecognized form element type: ' + elem.type);
    }
  }
};
