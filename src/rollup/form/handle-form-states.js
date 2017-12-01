/** @module pathfora/form/handle-form-states */

// utils
import addClass from '../utils/class/add-class';

// widgets
import closeWidget from '../widgets/close-widget';

/**
 * Handles showing the success or error state of a form.
 *
 * @exports handleFormStates
 * @params {boolean} successful
 * @params {object} widget
 * @params {object} config
 */
export default function handleFormStates (successful, widget, config) {
  if (config.formStates) {
    var delay = 0;

    if (successful) {
      addClass(widget, 'success');
      delay = config.formStates.success && typeof config.formStates.success.delay !== 'undefined' ? config.formStates.success.delay * 1000 : 3000;
    } else {
      addClass(widget, 'error');
      delay = config.formStates.error && typeof config.formStates.error.delay !== 'undefined' ? config.formStates.error.delay * 1000 : 3000;
    }

    if (delay > 0) {
      setTimeout(function () {
        closeWidget(widget.id, true);
      }, delay);
    }
  }
}
