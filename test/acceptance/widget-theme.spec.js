import globalReset from '../utils/global-reset';
import {
  createMessageWidget,
  createFormWidget,
  createSubscriptionWidget,
  expectWidgetTheme
} from '../utils/test-helpers';

// -------------------------
//  WIDGET THEME/COLOR TESTS
// -------------------------
describe('Widgets', function () {
  beforeEach(function () {
    globalReset();
  });

  // -------------------------
  //  COLORS/THEME
  // -------------------------

  it('should have correct theme configuration', function () {
    var w1 = createMessageWidget({
      layout: 'button',
      position: 'left',
      msg: 'light button',
      id: 'light-widget',
      theme: 'light',
    });

    var w2 = createMessageWidget({
      layout: 'button',
      position: 'right',
      msg: 'dark button',
      id: 'dark-widget',
      theme: 'dark',
    });

    var w3 = createMessageWidget({
      layout: 'button',
      position: 'top-left',
      msg: 'custom color button',
      id: 'custom-widget',
      theme: 'custom',
    });

    var config = {
      generic: {
        colors: {
          background: '#fff',
        },
      },
    };

    pathfora.initializeWidgets([w1, w2, w3], config);

    var light = $('#' + w1.id),
      dark = $('#' + w2.id),
      custom = $('#' + w3.id);

    expect(light.hasClass('pf-theme-light')).toBeTruthy();
    expect(dark.hasClass('pf-theme-dark')).toBeTruthy();
    expect(custom.hasClass('pf-theme-custom')).toBeTruthy();
    expect(custom.css('background-color')).toBe('rgb(255, 255, 255)');
  });

  it('should fallback to CSS if theme value is "none"', function () {
    var css = document.createElement('style');
    css.type = 'text/css';
    css.innerHTML = '.widget-no-theme-class { background-color: #59f442 }';
    document.body.appendChild(css);

    var w1 = createMessageWidget({
      layout: 'button',
      position: 'left',
      msg: 'light button',
      id: 'widget-no-theme',
      className: 'widget-no-theme-class',
      theme: 'none',
    });

    pathfora.initializeWidgets([w1]);

    var w = $('#' + w1.id);

    expect(w.hasClass('pf-theme-none')).toBeTruthy();
    expect(w.css('background-color')).toBe('rgb(89, 244, 66)');
  });

  it('can be hidden on initialization', function () {
    var openedWidget = createMessageWidget({
      layout: 'modal',
      msg: 'Displayed on init',
      id: 'displayed-on-init',
    });

    var closedWidget = createMessageWidget({
      layout: 'modal',
      msg: 'Hidden on init',
      id: 'hidden-on-init',
      displayConditions: {
        showOnInit: false,
      },
    });

    pathfora.initializeWidgets([openedWidget, closedWidget]);

    expect($('#' + openedWidget.id)[0]).toBeDefined();
    expect($('#' + closedWidget.id)[0]).toBeUndefined();
  });

  it('should be able to adapt colors', function () {
    var modal = createMessageWidget({
      id: 'custom-style-test',
      layout: 'modal',
      msg: 'Custom style test',
      headline: 'Hello',
      theme: 'custom',
    });

    var config = {
      generic: {
        colors: {
          background: '#eee',
          headline: '#333',
          text: '#333',
          close: '#888',
          actionText: '#ddd',
          actionBackground: '#111',
          cancelText: '#333',
          cancelBackground: '#eee',
        },
      },
    };

    pathfora.initializeWidgets([modal], config);

    var widget = $('#' + modal.id);
    var background = widget.find('.pf-widget-content');
    var headline = widget.find('.pf-widget-headline');
    var text = widget.find('.pf-widget-message');
    var closeBtn = widget.find('.pf-widget-close');
    var actionBtn = widget.find('.pf-widget-ok');
    var cancelBtn = widget.find('.pf-widget-cancel');

    expect(background.css('background-color')).toBe('rgb(238, 238, 238)');
    expect(headline.css('color')).toBe('rgb(51, 51, 51)');
    expect(text.css('color')).toBe('rgb(51, 51, 51)');
    expect(closeBtn.css('color')).toBe('rgb(136, 136, 136)');
    expect(actionBtn.css('color')).toBe('rgb(221, 221, 221)');
    expect(actionBtn.css('background-color')).toBe('rgb(17, 17, 17)');
    expect(cancelBtn.css('color')).toBe('rgb(51, 51, 51)');
    expect(cancelBtn.css('background-color')).toBe('rgb(238, 238, 238)');
  });

  it('should account for required colors on validation', function () {
    var modal = createFormWidget({
      id: 'required-color-modal',
      layout: 'modal',
      msg: 'Custom style test',
      headline: 'Hello',
      theme: 'custom',
      colors: {
        required: '#ba00a6',
        requiredText: '#ebcee8',
      },
      formElements: [
        {
          type: 'radio-group',
          label: "What's your favorite color?",
          name: 'favorite_color',
          required: true,
          values: [
            {
              label: 'Red',
              value: 'red',
            },
            {
              label: 'Blue',
              value: 'blue',
            },
            {
              label: 'Green',
              value: 'green',
            },
          ],
        },
        {
          type: 'input',
          name: 'name',
          placeholder: 'Your Name',
          required: true,
        },
      ],
    });

    pathfora.initializeWidgets([modal]);

    var widget = $('#' + modal.id);
    var asterisk = widget.find('.pf-form-label span.required');
    var flag = widget.find('.pf-required-flag');

    expect(asterisk.css('color')).toBe('rgb(186, 0, 166)');
    expect(flag.css('background-color')).toBe('rgb(186, 0, 166)');
    expect(flag.find('span').css('border-right-color')).toBe(
      'rgb(186, 0, 166)'
    );
    expect(flag.css('color')).toBe('rgb(235, 206, 232)');

    var input = widget.find('input[data-required=true]:not(.pf-has-label)');
    expect(input.css('border-color')).toBe('rgb(186, 0, 166)');
  });

});
