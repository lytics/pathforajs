/** @module pathfora/display-conditions/hide-after-action-checker */

// globals
import { PREFIX_CONFIRM, PREFIX_CANCEL, PREFIX_CLOSE } from '../globals/config';

// utils
import read from '../utils/persist/read';

/**
 * Check if a widget should be hidden because it meets
 * a hideAfterAction display condition
 *
 * @exports hideAfterActionChecker
 * @params {object} hideAfterActionConstraints
 * @params {string} widget
 * @returns {boolean}
 */
export default function hideAfterActionChecker (hideAfterActionConstraints, widget) {
  var parts,
      valid = true,
      now = Date.now(),
      confirm = read(PREFIX_CONFIRM + widget.id),
      cancel = read(PREFIX_CANCEL + widget.id),
      closed = read(PREFIX_CLOSE + widget.id);

  if (hideAfterActionConstraints.confirm && confirm) {
    parts = confirm.split('|');

    if (parseInt(parts[0], 10) >= hideAfterActionConstraints.confirm.hideCount) {
      valid = false;
    }

    if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.confirm.duration) {
      valid = false;
    }
  }

  if (hideAfterActionConstraints.cancel && cancel) {
    parts = cancel.split('|');

    if (parseInt(parts[0], 10) >= hideAfterActionConstraints.cancel.hideCount) {
      valid = false;
    }

    if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.cancel.duration) {
      valid = false;
    }
  }

  if (hideAfterActionConstraints.closed && closed) {
    parts = closed.split('|');

    if (parseInt(parts[0], 10) >= hideAfterActionConstraints.closed.hideCount) {
      valid = false;
    }

    if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.closed.duration) {
      valid = false;
    }
  }

  return valid;
}
