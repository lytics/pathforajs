/** @module pathfora/form/construct-state-live-region */

// dom
import document from '../dom/document';

/**
 * Build the empty live region an inline widget announces its form state
 * through.
 *
 * A live region is only reliably announced when it is already rendered and
 * empty at the moment its text arrives - a region that enters the
 * accessibility tree with its text already inside is the classic case screen
 * readers skip. So the region is built with the state elements, well before
 * either state is revealed, and announceFormState writes into it.
 *
 * It is visually hidden rather than display: none, which would take it out of
 * the accessibility tree along with its announcement, and it holds only the
 * state's headline and message - role=status carries an implicit aria-atomic,
 * so anything else in here would be read out with them.
 *
 * @exports constructStateLiveRegion
 */
export default function constructStateLiveRegion() {
  var region = document.createElement('div');

  region.className = 'pf-widget-announcement';
  region.setAttribute('role', 'status');

  return region;
}
