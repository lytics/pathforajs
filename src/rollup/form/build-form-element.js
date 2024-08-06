/** @module pathfora/form/build-form-element */

// dom
import document from '../dom/document';

// utils
import addClass from '../utils/class/add-class';

/**
 * Build and insert a custom form element into
 * the widget's form
 *
 * @exports buildFormElement
 * @params {object} elem
 * @params {object} form
 */
export default function buildFormElement(elem, form) {
  var content,
    i,
    val,
    label,
    wrapper = document.createElement('div'),
    isGroup = elem.hasOwnProperty('groupType'),
    reqFlag,
    reqTriangle;

  // group elements include: checkbox groups
  if (isGroup) {
    wrapper.className = 'pf-widget-' + elem.type;
    content = document.createElement('div');
  } else {
    switch (elem.type) {
      case 'email':
        content = document.createElement('input');
        content.setAttribute('type', 'email');
        break;
      case 'text':
      case 'input':
        content = document.createElement('input');
        content.setAttribute('type', 'text');
        break;
      case 'date':
        content = document.createElement('input');
        content.setAttribute('type', 'date');
        break;
      default:
        content = document.createElement(elem.type);
        break;
    }

    content.setAttribute('name', elem.name);
    content.setAttribute('id', elem.name);

    // add row count for textarea
    if (elem.type === 'textarea') {
      content.setAttribute('rows', 5);
    }

    // add max and min date for date input
    if (elem.type === 'date') {
      var today = new Date(),
        offset = today.getTimezoneOffset(),
        todayTimezone = new Date(today.getTime() - offset * 60 * 1000),
        max = elem.maxDate
          ? elem.maxDate === 'today'
            ? todayTimezone
            : new Date(elem.maxDate)
          : null,
        min = elem.minDate
          ? elem.minDate === 'today'
            ? todayTimezone
            : new Date(elem.minDate)
          : null;

      if (max != null) {
        content.setAttribute('max', max.toISOString().split('T')[0]);
      }
      if (min != null) {
        content.setAttribute('min', min.toISOString().split('T')[0]);
      }
    }
  }

  if (elem.label) {
    if (isGroup) {
      label = document.createElement('span');
      label.id = elem.name;
      content.setAttribute('aria-labelledby', elem.name);
    } else {
      label = document.createElement('label');
      label.setAttribute('for', elem.name);
    }

    label.innerHTML = elem.label;
    label.className = 'pf-form-label';
    addClass(content, 'pf-has-label');

    if (elem.required === true) {
      label.innerHTML += ' <span class="required">*</span>';
    }

    wrapper.appendChild(label);
  }

  if (elem.required === true) {
    addClass(wrapper, 'pf-form-required');
    content.setAttribute('data-required', 'true');

    if (elem.label) {
      reqFlag = document.createElement('div');
      reqFlag.className = 'pf-required-flag';
      reqFlag.innerHTML = 'required';

      reqTriangle = document.createElement('span');
      reqFlag.appendChild(reqTriangle);
      wrapper.appendChild(reqFlag);
    }
  }

  if (elem.type === 'date' || elem.type === 'email') {
    addClass(wrapper, 'pf-form-required');
    content.setAttribute('data-validate', 'true');

    if (elem.label) {
      reqFlag = document.createElement('div');
      reqFlag.className = 'pf-invalid-flag';
      reqFlag.innerHTML = 'invalid';

      reqTriangle = document.createElement('span');
      reqFlag.appendChild(reqTriangle);
      wrapper.appendChild(reqFlag);
    }
  }

  if (elem.placeholder) {
    // select element has first option as placeholder
    if (elem.type === 'select') {
      var placeholder = document.createElement('option');
      placeholder.setAttribute('value', '');
      placeholder.innerHTML = elem.placeholder;
      content.appendChild(placeholder);
    } else {
      content.placeholder = elem.placeholder;
    }

    if (!elem.label) {
      content.setAttribute('aria-label', elem.placeholder);
    }
  }

  if (elem.values) {
    for (i = 0; i < elem.values.length; i++) {
      val = elem.values[i];

      if (isGroup) {
        var input = document.createElement('input');
        input.setAttribute('type', elem.groupType);
        input.setAttribute('value', val.value);
        input.setAttribute('name', elem.name);

        if (val.label) {
          label = document.createElement('label');
          label.className = 'pf-widget-' + elem.groupType;
          label.appendChild(input);
          label.appendChild(document.createTextNode(val.label));
          content.appendChild(label);
        } else {
          throw new Error(
            elem.groupType + 'form group values must contain labels'
          );
        }
      } else if (elem.type === 'select') {
        var option = document.createElement('option');
        option.setAttribute('value', val.value);
        option.innerHTML = val.label;

        content.appendChild(option);
      }
    }
  }

  wrapper.appendChild(content);

  // make sure we're inserting the new element before the confirm button
  var btn = form.querySelector('.pf-widget-ok');
  if (btn) {
    form.insertBefore(wrapper, btn);
  } else {
    form.appendChild(wrapper);
  }
}
