/** @module pathfora/form/announce-form-state */

// widgets
import describeWidgetContainer from '../widgets/describe-widget-container';

/**
 * Make a revealed form success or error state perceivable to assistive
 * technology.
 *
 * The state is revealed by CSS alone, which is silent, and the same rules hide
 * the button the user just activated - so a dialog is renamed after its new
 * contents and handed focus, which is what gets it read out and keeps a
 * keyboard user from being dropped back to the top of the page. An inline
 * widget sits in the page's own flow and should not steal focus, so its state
 * is announced politely as a live region instead.
 *
 * @exports announceFormState
 * @params {object} widget
 * @params {string} name
 */
export default function announceFormState(widget, name) {
  var state = widget.querySelector('.' + name + '-state'),
    container = widget.querySelector('.pf-widget-container');

  if (!state || !container) {
    return;
  }

  if (container.getAttribute('role') !== 'dialog') {
    // NOTE role=status carries an implicit aria-atomic, so the headline and
    // message are read as a single message
    state.setAttribute('role', 'status');
    return;
  }

  describeWidgetContainer(
    container,
    state.querySelector('.pf-widget-headline'),
    state.querySelector('.pf-widget-message'),
    widget.id + '-' + name,
  );

  container.setAttribute('tabindex', '-1');
  container.focus();
}
