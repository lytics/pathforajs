/** @module pathfora/form/announce-form-state */

// dom
import document from '../dom/document';

// widgets
import describeWidgetContainer from '../widgets/describe-widget-container';

/**
 * Read the text out of a state element's headline or message.
 *
 * @params {object} state
 * @params {string} selector
 * @returns {string}
 */
function stateText(state, selector) {
  var el = state.querySelector(selector);

  return el ? el.textContent || el.innerText || '' : '';
}

/**
 * Make a revealed form success or error state perceivable to assistive
 * technology.
 *
 * The state is revealed by CSS alone, which is silent, and the same rules hide
 * the button the user just activated - so a dialog is renamed after its new
 * contents and handed focus, which is what gets it read out and keeps a
 * keyboard user from being dropped back to the top of the page. An inline
 * widget sits in the page's own flow and should not steal focus, so its text
 * is copied into the live region built alongside the states instead.
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
    var region = widget.querySelector('.pf-widget-announcement');

    if (!region) {
      return;
    }

    // NOTE the headline and message only, never the state's own buttons: the
    // implicit aria-atomic on role=status means everything in here is read as
    // one message, and "Thank You. We have received your submission." should
    // not end in "Confirm Cancel"
    var announcement = [
      stateText(state, '.pf-widget-headline'),
      stateText(state, '.pf-widget-message'),
    ]
      .filter(function (text) {
        return text.length > 0;
      })
      .join('. ');

    if (!announcement.length) {
      return;
    }

    // NOTE written a tick late, after the class that reveals the state has
    // been applied and styles have settled: Safari and VoiceOver are the
    // least forgiving about text that arrives in the same tick as the change
    // around it
    setTimeout(function () {
      while (region.firstChild) {
        region.removeChild(region.firstChild);
      }

      region.appendChild(document.createTextNode(announcement));
    }, 0);

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
