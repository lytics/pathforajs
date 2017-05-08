/** @module core/build-form-element */

export default function buildFormElement (elem, form) {
  var content, i, val, label,
      wrapper = document.createElement('div'),
      isGroup = elem.hasOwnProperty('groupType');

  // group elements include: checkbox groups
  if (isGroup) {
    wrapper.className = 'pf-widget-' + elem.type;
    content = document.createElement('div');
  } else {
    content = document.createElement(elem.type);
    content.setAttribute('name', elem.name);
    content.setAttribute('id', elem.name);

    // add row count for textarea
    if (elem.type === 'textarea') {
      content.setAttribute('rows', 5);

    // add text type for input
    } else if (elem.type === 'input') {
      content.setAttribute('type', 'text');
    }
  }

  if (elem.label) {
    if (isGroup) {
      label = document.createElement('span');
    } else {
      label = document.createElement('label');
      label.setAttribute('for', elem.name);
    }

    label.innerHTML = elem.label;
    label.className = 'pf-form-label';
    utils.addClass(content, 'pf-has-label');

    if (elem.required === true) {
      label.innerHTML += ' <span class="required">*</span>';
    }

    wrapper.appendChild(label);
  }

  if (elem.required === true) {
    utils.addClass(wrapper, 'pf-form-required');
    content.setAttribute('data-required', 'true');

    if (elem.label) {
      var reqFlag = document.createElement('div');
      reqFlag.className = 'pf-required-flag';
      reqFlag.innerHTML = 'required';

      var reqTriange = document.createElement('span');
      reqFlag.appendChild(reqTriange);

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
          throw new Error(elem.groupType + 'form group values must contain labels');
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
};
