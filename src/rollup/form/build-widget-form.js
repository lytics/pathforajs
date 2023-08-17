/** @module pathfora/form/build-widget-form */

import buildFormElement from './build-form-element';

/**
 * Build a custom form on a widget according to the
 * formElements config provided
 *
 * @exports buildWidgetForm
 * @params {object} formElements
 * @params {object} form
 */
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
    case 'us-postal-code':
      buildFormElement(elem, form);
      break;

    case 'textarea':
    case 'input':
    case 'text':
    case 'email':
    case 'select':
      buildFormElement(elem, form);
      break;

    default:
      throw new Error('unrecognized form element type: ' + elem.type);
    }
  }
}
