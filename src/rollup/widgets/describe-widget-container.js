/** @module pathfora/widgets/describe-widget-container */

/**
 * Point a widget container's aria-labelledby/aria-describedby at the headline
 * and message elements it should be named and described by, giving each one an
 * id to be referenced by.
 *
 * Ids are namespaced under the widget id, which pathfora already guarantees to
 * be unique, so several widgets open at once cannot collide. A widget holding
 * more than one headline and message - a form and the success or error state
 * that replaces it - passes a distinct namespace per set.
 *
 * Callers pass null for an element that holds no text: a reference to an empty
 * or absent element leaves the container unnamed just as surely as no reference
 * at all, so the reference is cleared instead.
 *
 * @exports describeWidgetContainer
 * @params {object} container
 * @params {object} headline
 * @params {object} message
 * @params {string} namespace
 */
export default function describeWidgetContainer(
  container,
  headline,
  message,
  namespace,
) {
  if (headline) {
    headline.id = namespace + '-pf-widget-headline';
  }

  if (message) {
    message.id = namespace + '-pf-widget-message';
  }

  // NOTE bar layouts have no headline element at all, so the message is the
  // only text available to name the container with
  var name = headline || message,
    description = headline ? message : null;

  if (name) {
    container.setAttribute('aria-labelledby', name.id);
  } else {
    container.removeAttribute('aria-labelledby');
  }

  if (description) {
    container.setAttribute('aria-describedby', description.id);
  } else {
    container.removeAttribute('aria-describedby');
  }
}
