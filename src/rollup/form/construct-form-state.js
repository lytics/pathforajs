/** @module pathfora/form/construct-form-state */

// dom
import document from '../dom/document';

/**
 * Setup html for success or error state of a form module
 *
 * @exports constructFormState
 * @params {object} widget
 * @params {object} config
 * @params {string} name
 */
export default function constructFormState (config, widget, name) {
  var obj, defaultHeadline, defaultMsg;

  switch (name) {
  case 'success':
    obj = config.formStates.success;
    defaultMsg = 'We have received your submission.';
    defaultHeadline = 'Thank You';
    break;
  case 'error':
    obj = config.formStates.error;
    defaultMsg = 'There was an error receiving with your submission.';
    defaultHeadline = 'Error';
    break;
  default:
    throw new Error('Unrecognized formState: ' + name);
  }

  var elem = document.createElement('div');
  elem.className = name + '-state';

  var title = document.createElement('h2');
  title.className = 'pf-widget-headline';
  title.innerHTML = obj.headline || defaultHeadline;
  elem.appendChild(title);

  var msg = document.createElement('div');
  msg.className = 'pf-widget-message';
  msg.innerHTML = obj.msg || defaultMsg;
  elem.appendChild(msg);

  if (obj.okShow) {
    var ok = document.createElement('button');
    ok.type = 'button';
    ok.className = 'pf-widget-btn pf-widget-ok';
    ok.innerHTML = obj.okMessage || 'Confirm';
    elem.appendChild(ok);
  }

  if (obj.cancelShow) {
    var cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'pf-widget-btn pf-widget-cancel';
    cancel.innerHTML = obj.cancelMessage || 'Cancel';
    elem.appendChild(cancel);
  }

  return elem;
}
