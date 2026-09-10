import globalReset from '../utils/global-reset';
import createAndDispatchKeydown from '../utils/create-and-dispatch-keydown';
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

  it('should namespace aria reference ids under the widget id', function () {
    var widget = createMessageWidget({
      id: 'a11y-id-scope',
      layout: 'slideout',
      headline: HEADLINE,
      msg: MESSAGE,
    });

    pathfora.initializeWidgets([widget]);

    var container = $('#' + widget.id + ' .pf-widget-container');

    expect(container.attr('aria-labelledby')).toBe(
      'a11y-id-scope-pf-widget-headline',
    );
    expect(container.attr('aria-describedby')).toBe(
      'a11y-id-scope-pf-widget-message',
    );
  });
});

// a widget is visibility: hidden until the `opened` class lands ~50ms after it
// is appended, and nothing inside a hidden subtree can take focus - so these
// specs submit only once the widget is really on screen, the way a user would
function whenOpened(widget, fn) {
  setTimeout(function () {
    expect($('#' + widget.id).hasClass('opened')).toBe(true);
    fn($('#' + widget.id));
  }, 100);
}

function submit(widget) {
  var form = widget.find('form');

  form.find('input[name="username"]').val('test');
  form.find('input[name="email"]').val('test@example.com');
  form.find('.pf-widget-ok').click();
}

describe('form state accessibility', function () {
  beforeEach(function () {
    globalReset();
  });

  it('should describe the dialog by its form, not its success state, before submit', function (done) {
    var form = createFormWidget({
      id: 'a11y-state-before-submit',
      layout: 'slideout',
      headline: HEADLINE,
      msg: MESSAGE,
      formStates: {
        success: { headline: 'Thanks!', msg: 'We got it.', delay: 0 },
      },
    });

    pathfora.initializeWidgets([form]);

    whenOpened(form, function (widget) {
      var container = widget.find('.pf-widget-container');

      expect(resolveAriaRef(container, 'aria-labelledby').text()).toBe(
        HEADLINE,
      );
      expect(resolveAriaRef(container, 'aria-describedby').text()).toBe(
        MESSAGE,
      );
      done();
    });
  });

  it('should rename the dialog after the success state it reveals', function (done) {
    var form = createFormWidget({
      id: 'a11y-success-state',
      layout: 'slideout',
      headline: HEADLINE,
      msg: MESSAGE,
      formStates: {
        success: { headline: 'Thanks!', msg: 'We got it.', delay: 0 },
      },
    });

    pathfora.initializeWidgets([form]);

    whenOpened(form, function (widget) {
      submit(widget);

      expect(widget.hasClass('success')).toBe(true);

      var container = widget.find('.pf-widget-container');

      expect(resolveAriaRef(container, 'aria-labelledby').text()).toBe(
        'Thanks!',
      );
      expect(resolveAriaRef(container, 'aria-describedby').text()).toBe(
        'We got it.',
      );
      done();
    });
  });

  it('should rename the dialog after the error state it reveals', function (done) {
    var form = createFormWidget({
      id: 'a11y-error-state',
      layout: 'modal',
      headline: HEADLINE,
      msg: MESSAGE,
      confirmAction: {
        waitForAsyncResponse: true,
        callback: function (name, payload, cb) {
          cb(false);
        },
      },
      formStates: {
        error: { headline: 'Oops', msg: 'That did not work.', delay: 0 },
      },
    });

    pathfora.initializeWidgets([form]);

    whenOpened(form, function (widget) {
      submit(widget);

      expect(widget.hasClass('error')).toBe(true);

      var container = widget.find('.pf-widget-container');

      expect(resolveAriaRef(container, 'aria-labelledby').text()).toBe('Oops');
      expect(resolveAriaRef(container, 'aria-describedby').text()).toBe(
        'That did not work.',
      );
      done();
    });
  });

  it('should move focus to the dialog when a state is revealed', function (done) {
    var form = createFormWidget({
      id: 'a11y-state-focus',
      layout: 'slideout',
      headline: HEADLINE,
      msg: MESSAGE,
      formStates: {
        success: { headline: 'Thanks!', msg: 'We got it.', delay: 0 },
      },
    });

    pathfora.initializeWidgets([form]);

    whenOpened(form, function (widget) {
      submit(widget);

      var container = widget.find('.pf-widget-container');

      expect(document.activeElement).toBe(container[0]);
      done();
    });
  });

  it('should announce an inline state as a live region without taking focus', function (done) {
    var host = document.createElement('div');
    host.id = 'a11y-inline-host';
    document.body.appendChild(host);

    var form = createFormWidget({
      id: 'a11y-inline-state',
      layout: 'inline',
      positionSelector: '#a11y-inline-host',
      headline: HEADLINE,
      msg: MESSAGE,
      formStates: {
        success: { headline: 'Thanks!', msg: 'We got it.', delay: 0 },
      },
    });

    pathfora.initializeWidgets([form]);

    whenOpened(form, function (widget) {
      submit(widget);

      var state = widget.find('.success-state');

      expect(widget.find('.pf-widget-container').attr('role')).toBeUndefined();
      expect(state.attr('role')).toBe('status');
      expect(widget[0].contains(document.activeElement)).toBe(false);

      host.parentNode.removeChild(host);
      done();
    });
  });

  it('should not tab into elements a revealed state has hidden', function (done) {
    // a gate has no close button, so the first focusable element in the widget
    // is a form field - which the success state hides
    var gate = createFormWidget({
      id: 'a11y-state-tab',
      layout: 'gate',
      headline: HEADLINE,
      msg: MESSAGE,
      formStates: {
        success: {
          headline: 'Thanks!',
          msg: 'We got it.',
          delay: 0,
          okShow: true,
          okMessage: 'Done',
        },
      },
    });

    pathfora.initializeWidgets([gate]);

    whenOpened(gate, function (widget) {
      submit(widget);

      createAndDispatchKeydown(9, document);

      var focused = document.activeElement;

      expect(widget[0].contains(focused)).toBe(true);
      expect(focused.getClientRects().length).toBeGreaterThan(0);
      expect(focused).toBe(widget.find('.success-state .pf-widget-ok')[0]);
      done();
    });
  });
});
