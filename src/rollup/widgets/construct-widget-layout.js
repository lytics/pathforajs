/** @module pathfora/widgets/construct-widget-layout */

import buildWidgetForm from '../form/build-widget-form';

import addClass from '../utils/class/add-class';
import removeClass from '../utils/class/remove-class';

import { templates } from '../globals/config';

import document from '../dom/document';

export default function constructWidgetLayout (widget, config) {
  var node, child, i,
      widgetContent = widget.querySelector('.pf-widget-content'),
      widgetCancel = widget.querySelector('.pf-widget-cancel'),
      widgetOk = widget.querySelector('.pf-widget-ok'),
      widgetHeadline = widget.querySelectorAll('.pf-widget-headline'),
      widgetBody = widget.querySelector('.pf-widget-body'),
      widgetMessage = widget.querySelector('.pf-widget-message');

  if (widgetCancel !== null && !config.cancelShow) {
    node = widgetCancel;

    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }

  if (widgetOk !== null && !config.okShow) {
    node = widgetOk;

    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }

  if (widgetCancel !== null) {
    widgetCancel.innerHTML = config.cancelMessage;
  }

  if (widgetOk !== null) {
    widgetOk.innerHTML = config.okMessage;
  }

  if (widgetOk && widgetOk.value !== null) {
    widgetOk.value = config.okMessage;
  }

  if (widgetCancel && widgetCancel.value !== null) {
    widgetCancel.value = config.cancelMessage;
  }

  // Form layouts should have a default success message
  switch (config.type) {
  case 'form':
  case 'subscription':
  case 'sitegate':
    switch (config.layout) {
    case 'modal':
    case 'slideout':
    case 'sitegate':
    case 'inline':

      var successTitle = document.createElement('div');
      successTitle.className = 'pf-widget-headline success-state';
      successTitle.innerHTML = config.success && config.success.headline ? config.success.headline : 'Thank you';
      widgetContent.appendChild(successTitle);

      var successMsg = document.createElement('div');
      successMsg.className = 'pf-widget-message success-state';
      successMsg.innerHTML = config.success && config.success.msg ? config.success.msg : 'We have received your submission.';
      widgetContent.appendChild(successMsg);

      break;
    }
    break;
  }

  switch (config.layout) {
  case 'modal':
  case 'slideout':
  case 'sitegate':
  case 'inline':
    if (widgetContent && config.branding) {
      var branding = document.createElement('div');
      branding.className = 'branding';
      branding.innerHTML = templates.assets.lytics;
      widgetContent.appendChild(branding);
    }

    break;
  }

  switch (config.type) {
  case 'form':
    switch (config.layout) {
    case 'folding':
    case 'modal':
    case 'slideout':
    case 'random':
    case 'inline':
      break;
    default:
      throw new Error('Invalid widget layout value');
    }
    break;
  case 'subscription':
    switch (config.layout) {
    case 'folding':
    case 'modal':
    case 'bar':
    case 'slideout':
    case 'random':
    case 'inline':
      break;
    default:
      throw new Error('Invalid widget layout value');
    }
    break;
  case 'message':
    switch (config.layout) {
    case 'modal':
    case 'slideout':
      break;
    case 'random':
    case 'bar':
    case 'button':
    case 'inline':
      break;
    default:
      throw new Error('Invalid widget layout value');
    }
    break;
  case 'sitegate':
    switch (config.layout) {
    case 'modal':
      if (config.showForm === false) {
        node = widget.querySelector('form');
        child = node.querySelectorAll('input, select, textarea');

        if (node) {
          for (i = 0; i < child.length; i++) {
            node.removeChild(child[i]);
          }

          child = node.querySelector('.pf-sitegate-clear');

          if (child) {
            node.removeChild(child);
          }
        }
      }
      break;
    default:
      throw new Error('Invalid widget layout value');
    }
    break;
  }

  // NOTE Set The headline
  for (i = widgetHeadline.length - 1; i >= 0; i--) {
    widgetHeadline[i].innerHTML = config.headline;
  }

  // NOTE Set the image
  if (config.image) {
    if (config.layout === 'button') {
      // NOTE Images are not compatible with the button layout
    } else {
      var widgetImage = document.createElement('img');
      widgetImage.src = config.image;
      widgetImage.className = 'pf-widget-img';
      widgetBody.appendChild(widgetImage);
    }
  }

  switch (config.type) {
  case 'sitegate':
  case 'form':
    if (config.showSocialLogin === false) {
      node = widget.querySelector('.pf-social-login');

      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }

    // Check if custom form is defined
    if (config.formElements && config.formElements.length) {
      // remove the existing form fields
      var form = widget.querySelector('form');
      addClass(form, 'pf-custom-form');
      var childName;
      var arr = form.children;

      for (var k = 0; k < arr.length; k++) {
        child = arr[k];

        if (typeof child.getAttribute !== 'undefined') {
          childName = child.getAttribute('name');

          if (childName != null) {
            form.removeChild(child);
            k--;
          }
        }
      }

      buildWidgetForm(config.formElements, form);

    } else {
      // suport old form functions
      var getFormElement = function (field) {
        if (field === 'name') {
          return widget.querySelector('input[name="username"]');
        }

        return widget.querySelector('form [name="' + field + '"]');
      };

      // Set placeholders
      Object.keys(config.placeholders).forEach(function (field) {
        var element = getFormElement(field);

        if (element && typeof element.placeholder !== 'undefined') {
          element.placeholder = config.placeholders[field];
        } else if (element && typeof element.options !== 'undefined') {
          element.options[0].innerHTML = config.placeholders[field];
        }
      });

      // Set required Fields
      Object.keys(config.required).forEach(function (field) {
        var element = getFormElement(field);

        if (element && config.required[field]) {
          element.setAttribute('data-required', 'true');
        }
      });

      // Hide fields
      Object.keys(config.fields).forEach(function (field) {
        var element = getFormElement(field);

        if (element && !config.fields[field] && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });

      // NOTE: collapse half-width inputs
      Array.prototype.slice.call(widget.querySelectorAll('form .pf-field-half-width')).forEach(function (element, halfcount) {
        var parent = element.parentNode,
            prev = element.previousElementSibling,
            next = element.nextElementSibling;

        if (parent) {
          if (element.className.indexOf('pf-field-half-width') !== -1) {

            if (halfcount % 2) { // odd
              addClass(element, 'right');

              if (!(prev && prev.className.indexOf('pf-field-half-width') !== -1)) {
                removeClass(element, 'pf-field-half-width');
              }

            } else if (!(next && next.className.indexOf('pf-field-half-width') !== -1)) { // even
              removeClass(element, 'pf-field-half-width');
            }
          }
        }
      });
    }

    // For select boxes we need to control the color of
    // the placeholder text
    var selects = widget.querySelectorAll('select');

    for (i = 0; i < selects.length; i++) {
      // default class indicates the placeholder text color
      if (selects[i].value === '') {
        addClass(selects[i], 'default');
      }

      selects[i].onchange = function () {
        if (this.value !== '') {
          removeClass(this, 'default');
        } else {
          addClass(this, 'default');
        }
      };
    }

    break;
  case 'subscription':
    widget.querySelector('input').placeholder = config.placeholders.email;
    break;
  }

  if (config.msg) {
    widgetMessage.innerHTML = config.msg;
  }
}
