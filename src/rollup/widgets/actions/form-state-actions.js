/** @module pathfora/widgets/actions/form-state-actions */

// widgets
import buttonAction from './button-action';

/**
 * Add callbacks and tracking for confirm and cancel
 * buttons on the success or error state of a form widget
 *
 * @exports formStateActions
 * @params {object} widget
 * @params {object} config
 * @params {name} string
 */
export default function formStateActions (config, widget, name) {
  var ok = widget.querySelector('.' + name + '-state .pf-widget-ok'),
      cancel = widget.querySelector('.' + name + '-state .pf-widget-cancel');

  if (cancel) {
    buttonAction(cancel, name + '.cancel', config, widget);
  }

  if (ok) {
    buttonAction(ok, name + '.confirm', config, widget);
  }
}
