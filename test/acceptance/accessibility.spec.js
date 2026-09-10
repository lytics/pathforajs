import globalReset from '../utils/global-reset';
import {
  createMessageWidget,
  createFormWidget,
  createSubscriptionWidget,
  createSiteGateWidget,
} from '../utils/test-helpers';

var HEADLINE = 'Accessible Headline',
  MESSAGE = 'Accessible message';

// every type/layout combination that renders as a dialog. bar layouts have no
// headline element, so the message is what names them
var DIALOGS = [
  { type: 'message', layout: 'modal', create: createMessageWidget },
  { type: 'message', layout: 'slideout', create: createMessageWidget },
  { type: 'message', layout: 'bar', create: createMessageWidget },
  { type: 'message', layout: 'gate', create: createMessageWidget },
  { type: 'form', layout: 'modal', create: createFormWidget },
  { type: 'form', layout: 'slideout', create: createFormWidget },
  { type: 'form', layout: 'gate', create: createFormWidget },
  { type: 'subscription', layout: 'modal', create: createSubscriptionWidget },
  {
    type: 'subscription',
    layout: 'slideout',
    create: createSubscriptionWidget,
  },
  { type: 'subscription', layout: 'bar', create: createSubscriptionWidget },
  { type: 'subscription', layout: 'gate', create: createSubscriptionWidget },
  { type: 'sitegate', layout: 'gate', create: createSiteGateWidget },
];

// resolve an aria reference the way assistive technology does: look the id up
// in the document, not within the widget, so a dangling or duplicated
// reference cannot pass
function resolveAriaRef(container, attr) {
  var id = container.attr(attr);

  if (!id) {
    return null;
  }

  var matches = $('[id="' + id + '"]');
  expect(matches.length).toBe(1);

  return matches;
}

describe('widget accessibility', function () {
  beforeEach(function () {
    globalReset();
  });

  DIALOGS.forEach(function (spec) {
    var label = spec.type + ' ' + spec.layout;
    var hasHeadline = spec.layout !== 'bar';

    it('should expose the ' + label + ' as a named dialog', function () {
      var widget = spec.create({
        id: 'a11y-' + spec.type + '-' + spec.layout,
        layout: spec.layout,
        headline: HEADLINE,
        msg: MESSAGE,
      });

      pathfora.initializeWidgets([widget]);

      var container = $('#' + widget.id + ' .pf-widget-container');
      expect(container.length).toBe(1);
      expect(container.attr('role')).toBe('dialog');

      var name = resolveAriaRef(container, 'aria-labelledby');
      expect(name).not.toBeNull();
      expect(name.text()).toBe(hasHeadline ? HEADLINE : MESSAGE);

      var description = resolveAriaRef(container, 'aria-describedby');

      if (hasHeadline) {
        expect(description).not.toBeNull();
        expect(description.text()).toBe(MESSAGE);
      } else {
        expect(description).toBeNull();
      }
    });
  });

  it('should not reference a headline the widget does not have', function () {
    var widget = createMessageWidget({
      id: 'a11y-no-headline',
      layout: 'slideout',
      headline: '',
      msg: MESSAGE,
    });

    pathfora.initializeWidgets([widget]);

    var container = $('#' + widget.id + ' .pf-widget-container');
    var name = resolveAriaRef(container, 'aria-labelledby');

    expect(name).not.toBeNull();
    expect(name.text()).toBe(MESSAGE);
    expect(container.attr('aria-describedby')).toBeUndefined();
  });

  it('should not reference a message the widget does not have', function () {
    var widget = createMessageWidget({
      id: 'a11y-no-message',
      layout: 'slideout',
      headline: HEADLINE,
      msg: '',
    });

    pathfora.initializeWidgets([widget]);

    var container = $('#' + widget.id + ' .pf-widget-container');
    var name = resolveAriaRef(container, 'aria-labelledby');

    expect(name).not.toBeNull();
    expect(name.text()).toBe(HEADLINE);
    expect(container.attr('aria-describedby')).toBeUndefined();
  });

  it('should give each open widget its own aria reference ids', function () {
    var first = createMessageWidget({
      id: 'a11y-unique-1',
      layout: 'slideout',
      headline: 'First headline',
      msg: 'First message',
    });

    var second = createMessageWidget({
      id: 'a11y-unique-2',
      layout: 'slideout',
      headline: 'Second headline',
      msg: 'Second message',
    });

    pathfora.initializeWidgets([first, second]);

    var firstContainer = $('#' + first.id + ' .pf-widget-container'),
      secondContainer = $('#' + second.id + ' .pf-widget-container');

    // resolveAriaRef asserts that each id matches exactly one element
    expect(resolveAriaRef(firstContainer, 'aria-labelledby').text()).toBe(
      'First headline',
    );
    expect(resolveAriaRef(firstContainer, 'aria-describedby').text()).toBe(
      'First message',
    );
    expect(resolveAriaRef(secondContainer, 'aria-labelledby').text()).toBe(
      'Second headline',
    );
    expect(resolveAriaRef(secondContainer, 'aria-describedby').text()).toBe(
      'Second message',
    );
  });

  it('should not leak aria reference ids into widget id lookups', function () {
    var widget = createMessageWidget({
      id: 'a11y-id-scope',
      layout: 'slideout',
      headline: HEADLINE,
      msg: MESSAGE,
    });

    pathfora.initializeWidgets([widget]);

    expect($('[id*="a11y-id-scope"]').length).toBe(1);
  });
});
