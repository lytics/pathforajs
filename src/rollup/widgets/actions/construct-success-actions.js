/** @module pathfora/widgets/actions/construct-widget-actions */

// widgets
import buttonAction from './button-action';

/**
 * Add callbacks and tracking for confirm and cancel
 * buttons on the success state of a form widget
 *
 * @exports constructSuccessActions
 * @params {object} widget
 * @params {object} config
 */
export default function constructSuccessActions (widget, config) {
  var successOk = widget.querySelector('.success-state .pf-widget-ok'),
      successCancel = widget.querySelector('.success-state .pf-widget-cancel');


  if (successCancel) {
    buttonAction(successCancel, 'success.cancel', config, widget);
  }

  if (successOk) {
    buttonAction(successOk, 'success.confirm', config, widget);
  }
}
