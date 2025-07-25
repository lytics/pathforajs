import createAndDispatchKeydown from '../utils/create-and-dispatch-keydown.js';
import globalReset from '../utils/global-reset';

// -------------------------
//  WIDGET TESTS
// -------------------------
describe('Widgets', function () {
  beforeEach(function () {
    globalReset();
  });

  // -------------------------
  //  GENERAL
  // -------------------------

  it('should not allow to register 2 widgets with the same id', function () {
    var w1 = new pathfora.Message({
      msg: 'Duplicate id test1',
      layout: 'modal',
      id: 'asd',
    });

    var w2 = new pathfora.Form({
      msg: 'Duplcate id test2',
      layout: 'slideout',
      id: 'asd',
    });

    expect(function () {
      pathfora.initializeWidgets([w1, w2]);
    }).toThrow(new Error('Cannot add two widgets with the same id'));
  });

  it('should use specified global config for all widgets', function () {
    var messageBar = new pathfora.Message({
      layout: 'bar',
      id: 'global-config-1',
      msg: 'test',
    });

    var config = {
      generic: {
        theme: 'light',
      },
    };

    pathfora.initializeWidgets([messageBar], config);

    var bar = $('#' + messageBar.id);
    expect(bar.hasClass('pf-theme-default')).toBe(false);
    expect(bar.hasClass('pf-theme-light')).toBe(true);
  });

  it('should be able to clear all widgets and handlers', function (done) {
    var clearDataObject = {
      pageViews: 0,
      timeSpentOnPage: 0,
      closedWidgets: [],
      completedActions: [],
      cancelledActions: [],
      displayedWidgets: [],
      abTestingGroups: [],
    };

    var form = new pathfora.Subscription({
      msg: 'test',
      id: 'clear-widget',
      layout: 'modal',
    });

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      expect(pathfora.getDataObject()).not.toEqual(clearDataObject);

      pathfora.clearAll();
      expect(widget.hasClass('opened')).toBeFalsy();
      expect(pathfora.getDataObject()).toEqual(clearDataObject);
      done();
    }, 200);
  });

  it('should be able to clear specific widgets by their IDs', function (done) {
    var widget1 = new pathfora.Message({
      msg: 'Widget 1',
      id: 'clear-by-id-1',
      layout: 'modal',
    });

    var widget2 = new pathfora.Message({
      msg: 'Widget 2',
      id: 'clear-by-id-2',
      layout: 'slideout',
    });

    var widget3 = new pathfora.Message({
      msg: 'Widget 3',
      id: 'clear-by-id-3',
      layout: 'bar',
    });

    pathfora.initializeWidgets([widget1, widget2, widget3]);

    var element1 = $('#' + widget1.id);
    var element2 = $('#' + widget2.id);
    var element3 = $('#' + widget3.id);

    setTimeout(function () {
      // All widgets should be opened initially
      expect(element1.hasClass('opened')).toBeTruthy();
      expect(element2.hasClass('opened')).toBeTruthy();
      expect(element3.hasClass('opened')).toBeTruthy();

      // Clear only widget1 and widget3
      pathfora.clearById(['clear-by-id-1', 'clear-by-id-3']);

      setTimeout(function () {
        // Widget1 and widget3 should be closed and removed from DOM
        expect(element1.hasClass('opened')).toBeFalsy();
        expect($('#' + widget1.id).length).toBe(0);
        expect(element3.hasClass('opened')).toBeFalsy();
        expect($('#' + widget3.id).length).toBe(0);

        // Widget2 should still be opened
        expect(element2.hasClass('opened')).toBeTruthy();
        expect($('#' + widget2.id).length).toBe(1);

        // Clear widget2 as well
        pathfora.clearById(['clear-by-id-2']);

        setTimeout(function () {
          // All widgets should now be closed and removed
          expect($('#' + widget1.id).length).toBe(0);
          expect($('#' + widget2.id).length).toBe(0);
          expect($('#' + widget3.id).length).toBe(0);
          done();
        }, 200);
      }, 200);
    }, 200);
  });

  it('should handle clearById with invalid input gracefully', function (done) {
    var widget = new pathfora.Message({
      msg: 'Test widget',
      id: 'invalid-input-test',
      layout: 'modal',
    });

    pathfora.initializeWidgets([widget]);

    // Test with non-array input
    spyOn(console, 'warn');
    pathfora.clearById('not-an-array');
    
    expect(console.warn).toHaveBeenCalledWith('clearById: widgetIds must be an array');

    // Widget should still be opened
    setTimeout(function () {
      expect($('#' + widget.id).hasClass('opened')).toBeTruthy();
      done();
    }, 200);
  });

  it('should handle clearById with non-existent widget IDs', function (done) {
    var widget = new pathfora.Message({
      msg: 'Test widget',
      id: 'existing-widget',
      layout: 'modal',
    });

    pathfora.initializeWidgets([widget]);

    var element = $('#' + widget.id);

    setTimeout(function () {
      expect(element.hasClass('opened')).toBeTruthy();

      // Try to clear non-existent widget IDs
      pathfora.clearById(['non-existent-1', 'non-existent-2']);

      // Existing widget should still be opened
      expect(element.hasClass('opened')).toBeTruthy();
      expect($('#' + widget.id).length).toBe(1);

      // Clear the existing widget
      pathfora.clearById(['existing-widget']);

      setTimeout(function () {
        expect(element.hasClass('opened')).toBeFalsy();
        expect($('#' + widget.id).length).toBe(0);
        done();
      }, 200);
    }, 200);
  });

  it('should be able to be displayed on document', function (done) {
    var promoWidget = new pathfora.Message({
      layout: 'bar',
      msg: 'Opening widget',
      id: 'widget-1',
    });

    pathfora.initializeWidgets([promoWidget]);

    // should append element to DOM
    var widget = $('#' + promoWidget.id);
    expect(widget).toBeDefined();

    // should have class 'opened' after while
    pathfora.showWidget(promoWidget);

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      done();
    }, 200);
  });

  it('should have proper id specified', function (done) {
    var w1 = new pathfora.Message({
      layout: 'slideout',
      position: 'right',
      msg: 'Welcome to our test website',
      id: 'test-id-widget',
    });

    expect(function () {
      return new pathfora.Message({
        layout: 'slideout',
        position: 'left',
        msg: 'Welcome to our test website',
      });
    }).toThrow(new Error('All widgets must have an id value'));

    pathfora.initializeWidgets([w1]);

    setTimeout(function () {
      var right = $('.pf-widget.pf-position-right');
      expect(right).toBeDefined();
      expect(right.attr('id')).toBe('test-id-widget');
      done();
    }, 200);
  });

  it("should not append widget second time if it's already opened", function (done) {
    var openedWidget = new pathfora.Message({
      layout: 'modal',
      id: 'append-widget',
      msg: 'test widget',
    });

    pathfora.initializeWidgets([openedWidget]);

    var widget = $('#' + openedWidget.id);

    // timeouts gives some time for appending to DOM
    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      pathfora.showWidget(openedWidget);

      setTimeout(function () {
        expect($('#' + openedWidget.id).length).toEqual(1);
        done();
      }, 200);
    }, 500);
  });

  it('should close when the x button is clicked', function (done) {
    var testWidget = new pathfora.Message({
      layout: 'modal',
      msg: 'Close widget test',
      id: 'close-clear-widget',
    });

    pathfora.initializeWidgets([testWidget]);

    var widget = $('#' + testWidget.id);
    expect(widget).toBeDefined();

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();

      widget.find('.pf-widget-close').click();
      expect(widget.hasClass('opened')).toBeFalsy();

      setTimeout(function () {
        expect($('#' + testWidget.id).length).toBe(0);
        done();
      }, 600);
    }, 200);
  });

  it('should close if the escape key is pressed and it is a modal', function (done) {
    var modal = new pathfora.Message({
      id: 'modal-esc-test',
      layout: 'modal',
      headline: 'Message Title',
      msg: 'test',
    });

    var gate = new pathfora.SiteGate({
      id: 'modal-esc-test2',
      layout: 'modal',
      headline: 'Message Title',
      msg: 'test',
    });

    pathfora.initializeWidgets([modal, gate]);

    var widget = $('#' + modal.id);
    var widgetGate = $('#' + gate.id);
    expect(widget).toBeDefined();
    expect(widgetGate).toBeDefined();

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      expect(widgetGate.hasClass('opened')).toBeTruthy();

      createAndDispatchKeydown(27, document);

      expect(widget.hasClass('opened')).toBeFalsy();
      expect(widgetGate.hasClass('opened')).toBeTruthy();

      setTimeout(function () {
        expect($('#' + modal.id).length).toBe(0);
        expect($('#' + gate.id).length).toBe(1);
        done();
      }, 600);
    }, 200);
  });

  it('should handle missing values properly and never surface undefined', function () {
    var message = new pathfora.Message({
      id: 'message-test-widget',
      layout: 'slideout',
      headline: 'Message Title',
      theme: 'custom',
    });

    var form = new pathfora.Form({
      id: 'form-test-widget',
      layout: 'modal',
      headline: 'Headline Title',
      theme: 'custom',
    });

    var subscription = new pathfora.Subscription({
      id: 'subscription-test-widget',
      layout: 'bar',
      theme: 'custom',
    });

    pathfora.initializeWidgets([message, form, subscription]);

    // test message
    var mwidget = $('#' + message.id),
      mheadline = mwidget.find('.pf-widget-headline'),
      mtext = mwidget.find('.pf-widget-message');

    expect(mheadline.html()).not.toEqual('undefined');
    expect(mtext.html()).not.toEqual('undefined');

    // test form
    var fwidget = $('#' + form.id),
      fheadline = fwidget.find('.pf-widget-headline'),
      ftext = fwidget.find('.pf-widget-message');

    expect(fheadline.html()).not.toEqual('undefined');
    expect(ftext.html()).not.toEqual('undefined');

    // test subscription
    var swidget = $('#' + subscription.id);
    var stext = swidget.find('.pf-widget-message');
    expect(stext.html()).not.toEqual('undefined');
  });

  it('should not allow to be initialized without default properties', function () {
    var missingParams = function () {
      var promoWidget = new pathfora.Message();
      pathfora.initializeWidgets([promoWidget]);
    };

    expect(missingParams).toThrow(new Error('Config object is missing'));
  });

  it('should not show branding assets unless set otherwise', function () {
    var w1 = new pathfora.Message({
      msg: 'test',
      id: 'branding1',
      layout: 'slideout',
      branding: true,
    });

    var w2 = new pathfora.Message({
      msg: 'test',
      id: 'branding2',
      layout: 'modal',
    });

    pathfora.initializeWidgets([w1, w2]);

    var widget1 = $('#' + w1.id),
      widget2 = $('#' + w2.id);

    expect(widget1.find('.branding svg').length).toBe(1);
    expect(widget2.find('.branding svg').length).toBe(0);
  });

  it('should display footer when footerText setting is used', function () {
    var modalFooter = new pathfora.Message({
      id: 'footer1',
      msg: 'test',
      layout: 'modal',
      footerText: 'Footer text',
    });

    var modalNoFooter = new pathfora.Message({
      id: 'footer2',
      msg: 'test',
      layout: 'modal',
    });

    var slideoutFooter = new pathfora.Message({
      id: 'slidout1',
      msg: 'test',
      layout: 'slideout',
      footerText: 'Footer text',
    });

    var slideoutNoFooter = new pathfora.Message({
      id: 'slideout2',
      msg: 'test',
      layout: 'slideout',
    });

    pathfora.initializeWidgets([
      modalFooter,
      modalNoFooter,
      slideoutFooter,
      slideoutNoFooter,
    ]);

    var modal1 = $('#' + modalFooter.id),
      modal2 = $('#' + modalNoFooter.id),
      slideout1 = $('#' + slideoutFooter.id),
      slideout2 = $('#' + slideoutNoFooter.id);
    expect(modal1.find('.pf-widget-footer').html()).toEqual('Footer text');
    expect(modal2.find('.pf-widget-footer').html()).toEqual('');
    expect(slideout1.find('.pf-widget-footer').html()).toEqual('Footer text');
    expect(slideout2.find('.pf-widget-footer').html()).toEqual('');
  });

  it('should contain pf-widget-text div for inline and modal layouts', function () {
    var modal = new pathfora.Message({
      id: 'modal',
      msg: 'testmodal',
      layout: 'modal',
    });
    var div = document.createElement('div');
    div.className = 'some-dom-element';
    document.body.appendChild(div);
    var inline = new pathfora.Message({
      id: 'inline',
      layout: 'inline',
      position: '.some-dom-element',
      msg: 'testing',
    });
    var slideout = new pathfora.Message({
      id: 'slideout',
      msg: 'test',
      layout: 'slideout',
    });
    pathfora.initializeWidgets([modal, inline, slideout]);
    var modalWidget = $('#' + modal.id),
      inlineWidget = $('#' + inline.id),
      slideoutWidget = $('#' + slideout.id);
    expect(modalWidget.find('.pf-widget-text').html()).toBeDefined();
    expect(inlineWidget.find('.pf-widget-text').html()).toBeDefined();
    expect(slideoutWidget.find('.pf-widget-text').html()).toBeUndefined();
  });

  it('should append pf-widget-img to pf-widget-content for modal and inline layouts', function () {
    var modal = new pathfora.Message({
      id: 'modal',
      msg: 'testmodal',
      layout: 'modal',
      variant: 2,
      image: 'https://lytics.github.io/pathforadocs/assets/lion.jpg',
    });
    var div = document.createElement('div');
    div.className = 'some-dom-element';
    document.body.appendChild(div);
    var inline = new pathfora.Message({
      id: 'inline',
      layout: 'inline',
      position: '.some-dom-element',
      msg: 'testing',
      variant: 2,
      image: 'https://lytics.github.io/pathforadocs/assets/lion.jpg',
    });
    pathfora.initializeWidgets([modal, inline]);
    var modalWidget = $('#' + modal.id),
      inlineWidget = $('#' + inline.id);
    expect(
      modalWidget.find('.pf-widget-content').find('img').html()
    ).toBeDefined();
    expect(
      inlineWidget.find('.pf-widget-content').find('img').html()
    ).toBeDefined();
    expect(
      modalWidget.find('.pf-widget-text').find('img').html()
    ).toBeUndefined();
  });

  // -------------------------
  //  COLORS/THEME
  // -------------------------

  it('should have correct theme configuration', function () {
    var w1 = new pathfora.Message({
      layout: 'button',
      position: 'left',
      msg: 'light button',
      id: 'light-widget',
      theme: 'light',
    });

    var w2 = new pathfora.Message({
      layout: 'button',
      position: 'right',
      msg: 'dark button',
      id: 'dark-widget',
      theme: 'dark',
    });

    var w3 = new pathfora.Message({
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

    var w1 = new pathfora.Message({
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
    var openedWidget = new pathfora.Message({
      layout: 'modal',
      msg: 'Displayed on init',
      id: 'displayed-on-init',
    });

    var closedWidget = new pathfora.Message({
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
    var modal = new pathfora.Message({
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
    var modal = new pathfora.Form({
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

  // -------------------------
  //  CALLBACKS
  // -------------------------

  it('should trigger callback function after pressing action button', function () {
    var modal = new pathfora.Message({
      id: 'confirm-action-test',
      layout: 'modal',
      msg: 'Confirm action test modal',
      confirmAction: {
        name: 'Test confirm action',
        callback: function () {
          alert('test confirmation');
        },
      },
    });

    pathfora.initializeWidgets([modal]);

    var widget = $('#confirm-action-test');
    spyOn(modal.confirmAction, 'callback');
    expect(modal.confirmAction.callback).not.toHaveBeenCalled();
    widget.find('.pf-widget-ok').click();
    expect(modal.confirmAction.callback).toHaveBeenCalled();
  });

  it('should trigger callback function after pressing action with form data.', function () {
    var modal = new pathfora.Form({
      id: 'confirm-action-form-test',
      layout: 'modal',
      msg: 'Confirm action test modal',
      confirmAction: {
        callback: function () {
          alert('test confirmation');
        },
      },
    });

    pathfora.initializeWidgets([modal]);

    var widget = $('#' + modal.id);
    widget.find('input[name="username"]').val('test name');
    widget.find('input[name="email"]').val('test@example.com');
    spyOn(modal.confirmAction, 'callback');
    expect(modal.confirmAction.callback).not.toHaveBeenCalled();
    widget.find('.pf-widget-ok').click();
    expect(modal.confirmAction.callback).toHaveBeenCalledWith(
      'modalConfirm',
      jasmine.objectContaining({
        data: [
          { name: 'username', value: 'test name' },
          { name: 'email', value: 'test@example.com' },
          { name: 'title', value: '' },
          { name: 'message', value: '' },
        ],
      })
    );
  });

  it('should trigger callback function after pressing action with custom form data.', function () {
    var modal = new pathfora.Form({
      id: 'custom-confirm-action-test',
      layout: 'modal',
      msg: 'Confirm action test modal',
      formElements: [
        {
          type: 'text',
          required: true,
          label: 'Email Address',
          name: 'email',
        },
        {
          type: 'checkbox-group',
          required: true,
          label: 'Which feeds would you like to subscribe to?',
          name: 'subscription_feeds',
          values: [
            {
              label: 'Beauty & Perfumes',
              value: 'beauty',
            },
            {
              label: 'Electronics',
              value: 'electronics',
            },
            {
              label: 'Fashion',
              value: 'fashion',
            },
          ],
        },
      ],
      confirmAction: {
        callback: function () {
          alert('test confirmation');
        },
      },
    });

    pathfora.initializeWidgets([modal]);

    var widget = $('#' + modal.id);
    widget.find('input[name="email"]').val('test@example.com');
    widget.find('input[name="subscription_feeds"]')[2].checked = true;
    spyOn(modal.confirmAction, 'callback');
    expect(modal.confirmAction.callback).not.toHaveBeenCalled();
    widget.find('.pf-widget-ok').click();
    expect(modal.confirmAction.callback).toHaveBeenCalledWith(
      'modalConfirm',
      jasmine.objectContaining({
        data: [
          { name: 'email', value: 'test@example.com' },
          { name: 'subscription_feeds', value: 'fashion' },
        ],
      })
    );
  });

  it('should not close the modal on a button action if specified', function (done) {
    var modal = new pathfora.Message({
      id: 'confirm-close-action-test',
      layout: 'modal',
      msg: 'Confirm action test modal',
      confirmAction: {
        name: 'Test confirm action',
        close: false,
        callback: function () {
          // do something
        },
      },
      cancelAction: {
        close: false,
      },
    });

    pathfora.initializeWidgets([modal]);

    setTimeout(function () {
      var widget = $('#' + modal.id);
      expect(widget).toBeDefined();
      expect(widget.hasClass('opened')).toBeTruthy();

      setTimeout(function () {
        widget.find('.pf-widget-ok').click();
        widget.find('.pf-widget-cancel').click();
        expect(widget).toBeDefined();
        expect(widget.hasClass('opened')).toBeTruthy();
        done();
      }, 300);
    }, 300);
  });

  it('should be able to trigger action on cancel', function () {
    var modal = new pathfora.Message({
      id: 'cancel-action-test',
      layout: 'modal',
      msg: 'Welcome to our website',
      cancelAction: {
        name: 'Test cancel action',
        callback: function () {
          alert('test cancel');
        },
      },
    });

    pathfora.initializeWidgets([modal]);

    var widget = $('#cancel-action-test');
    spyOn(modal.cancelAction, 'callback');
    widget.find('.pf-widget-cancel').click();
    expect(modal.cancelAction.callback).toHaveBeenCalled();
  });

  it("shouldn't fire submit callbacks on cancel, and cancel callbacks on submit", function () {
    var w1 = new pathfora.Message({
      id: 'widget-with-action-callback',
      msg: 'Cancel action negative test',
      confirmAction: {
        name: 'Test confirm action',
        callback: function () {
          alert('test confirmation');
        },
      },
    });

    var w2 = new pathfora.Message({
      id: 'widget-with-cancel-callback',
      msg: 'Cancel action negative test',
      cancelAction: {
        name: 'Test cancel action',
        callback: function () {
          alert('test cancel');
        },
      },
    });

    pathfora.initializeWidgets([w1, w2]);

    var widgetA = $('#widget-with-action-callback'),
      widgetB = $('#widget-with-cancel-callback');

    spyOn(w1.confirmAction, 'callback');
    spyOn(w2.cancelAction, 'callback');

    widgetA.find('.pf-widget-cancel').click();
    expect(w1.confirmAction.callback).not.toHaveBeenCalled();

    widgetB.find('.pf-widget-ok').click();
    expect(w2.cancelAction.callback).not.toHaveBeenCalled();
  });

  // -------------------------
  //  POSITION
  // -------------------------

  it('should use default position if no position is specified', function () {
    var w1 = new pathfora.Message({
      msg: 'button - default pos test',
      id: 'position-widget-1',
      layout: 'button',
    });

    var w2 = new pathfora.Message({
      msg: 'bar - default pos test',
      id: 'position-widget-2',
      layout: 'bar',
    });

    var w3 = new pathfora.Message({
      msg: 'slideout - default pos test',
      id: 'position-widget-3',
      layout: 'slideout',
    });

    pathfora.initializeWidgets([w1, w2, w3]);

    var widget1 = $('#' + w1.id),
      widget2 = $('#' + w2.id),
      widget3 = $('#' + w3.id);

    expect(widget1.hasClass('pf-position-top-left')).toBeTruthy();
    expect(widget2.hasClass('pf-position-top-absolute')).toBeTruthy();
    expect(widget3.hasClass('pf-position-bottom-left')).toBeTruthy();
  });

  it('should warn when invalid position', function () {
    var w1 = new pathfora.Message({
      msg: 'Widget positioning test',
      layout: 'modal',
      id: 'region-widget',
      position: 'customPos',
    });

    spyOn(console, 'warn');
    pathfora.initializeWidgets([w1]);

    expect(console.warn).toHaveBeenCalledWith(
      'customPos is not a valid position for modal'
    );
  });

  it('should error when custom positionSelector does not exist in dom', function () {
    var w1 = new pathfora.Message({
      msg: 'Widget positioning test',
      layout: 'modal',
      id: 'custom-position-widget',
      positionSelector: '.does-not-exist',
    });

    expect(function () {
      pathfora.initializeWidgets([w1]);
    }).toThrowError(/Widget could not be initialized in .does-not-exist/);
  });

  it('should append the widget to the positionSelector element if it does exist', function (done) {
    var div = document.createElement('div');
    div.id = 'overlay';
    document.body.appendChild(div);

    var inline = new pathfora.Message({
      headline: 'Position Custom',
      layout: 'modal',
      positionSelector: '#overlay',
      id: 'custom-position-modal',
      msg: 'yay',
    });

    pathfora.initializeWidgets([inline]);

    var parent = $(inline.positionSelector);

    setTimeout(function () {
      var widget = parent.find('#' + inline.id);
      expect(widget.length).toBe(1);
      done();
    }, 200);
  });

  // -------------------------
  //  INLINE MODULES
  // -------------------------
  it('should throw error if inline positionSelector not found', function () {
    // legacy position support
    var inline = new pathfora.Message({
      headline: 'Inline Widget',
      layout: 'inline',
      position: '.a-non-existent-div',
      id: 'inline-1',
      msg: 'inline',
    });

    var inlineCustom = new pathfora.Message({
      headline: 'Inline Widget',
      layout: 'inline',
      positionSelector: '.a-non-existent-div',
      id: 'inline-2',
      msg: 'inline',
    });

    expect(function () {
      pathfora.initializeWidgets([inline, inlineCustom]);
    }).toThrow(
      new Error('Widget could not be initialized in .a-non-existent-div')
    );
  });

  it('should append the inline widget to the positionSelector element', function (done) {
    var div = document.createElement('div');
    div.id = 'a-real-div';
    document.body.appendChild(div);

    // legacy position support
    var inline = new pathfora.Message({
      headline: 'Inline Widget',
      layout: 'inline',
      position: '#a-real-div',
      id: 'inline-1',
      msg: 'inline',
    });

    var inlineCustom = new pathfora.Message({
      headline: 'Inline Widget',
      layout: 'inline',
      positionSelector: '#a-real-div',
      id: 'inline-2',
      msg: 'inline',
    });

    pathfora.initializeWidgets([inline, inlineCustom]);

    var parent = $(inline.position);

    setTimeout(function () {
      var widget = parent.find('#' + inline.id);
      expect(widget.length).toBe(1);
      var widget2 = parent.find('#' + inlineCustom.id);
      expect(widget2.length).toBe(1);
      done();
    }, 200);
  });

  // -------------------------
  //  FORM STATES
  // -------------------------

  it('should show success or error state if waitForAsyncResponse is set', function (done) {
    var formStatesWidget = new pathfora.Form({
      id: 'form-states',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      confirmAction: {
        waitForAsyncResponse: true,
        callback: function (name, payload, cb) {
          if (payload.data[0].value === 'test') {
            cb(true);
            return;
          }
          cb(false);
        },
      },
      formStates: {
        success: {
          headline: 'test',
          msg: 'a custom success message',
          delay: 0,
          okShow: true,
          okMessage: 'confirm success',
          confirmAction: {
            name: 'confirm success',
            callback: function () {
              alert('confirm success');
            },
          },
          cancelShow: true,
          cancelMessage: 'cancel success',
          cancelAction: {
            name: 'cancel success',
            callback: function () {
              alert('cancel success');
            },
          },
        },
        error: {
          headline: 'test',
          msg: 'a custom error message',
          delay: 0,
          okShow: true,
          okMessage: 'confirm error',
          confirmAction: {
            name: 'confirm error',
            callback: function () {
              alert('confirm error');
            },
          },
          cancelShow: true,
          cancelMessage: 'cancel error',
          cancelAction: {
            name: 'cancel error',
            callback: function () {
              alert('cancel error');
            },
          },
        },
      },
    });
    window.pathfora.initializeWidgets([formStatesWidget]);

    var widget = $('#' + formStatesWidget.id),
      form = widget.find('form');
    expect(form.length).toBe(1);

    var name = form.find('input[name="username"]');
    expect(name.length).toBe(1);
    name.val('test');

    var email = form.find('input[name="email"]');
    expect(email.length).toBe(1);
    email.val('test@example.com');

    spyOn(formStatesWidget.confirmAction, 'callback').and.callThrough();
    expect(formStatesWidget.confirmAction.callback).not.toHaveBeenCalled();

    form.find('.pf-widget-ok').click();

    expect(formStatesWidget.confirmAction.callback).toHaveBeenCalledWith(
      'modalConfirm',
      jasmine.any(Object),
      jasmine.any(Function)
    );

    var success = widget.find('.success-state'),
      error = widget.find('.error-state');

    expect(form.css('display')).toBe('none');
    expect(success.css('display')).toBe('block');
    expect(widget.hasClass('success')).toBeTruthy();
    expect(success.find('.pf-widget-headline').html()).toBe(
      formStatesWidget.formStates.success.headline
    );
    expect(success.find('.pf-widget-message').html()).toBe(
      formStatesWidget.formStates.success.msg
    );

    expect(success.find('.pf-widget-ok').html()).toBe(
      formStatesWidget.formStates.success.okMessage
    );
    expect(success.find('.pf-widget-cancel').html()).toBe(
      formStatesWidget.formStates.success.cancelMessage
    );

    spyOn(jstag, 'send');
    spyOn(formStatesWidget.formStates.success.confirmAction, 'callback');
    expect(
      formStatesWidget.formStates.success.confirmAction.callback
    ).not.toHaveBeenCalled();
    success.find('.pf-widget-ok').click();

    expect(
      formStatesWidget.formStates.success.confirmAction.callback
    ).toHaveBeenCalled();
    expect(jstag.send).toHaveBeenCalledWith(
      jasmine.objectContaining({
        'pf-widget-id': formStatesWidget.id,
        'pf-widget-type': 'form',
        'pf-widget-layout': 'slideout',
        'pf-widget-variant': '1',
        'pf-widget-event': 'success.confirm',
        'pf-widget-action':
          formStatesWidget.formStates.success.confirmAction.name,
      })
    );
    pathfora.clearAll();
    pathfora.closeWidget(formStatesWidget.id, true);

    setTimeout(function () {
      window.pathfora.initializeWidgets([formStatesWidget]);

      widget = $('#' + formStatesWidget.id);
      form = widget.find('form');
      expect(form.length).toBe(1);

      name = form.find('input[name="username"]');
      expect(name.length).toBe(1);
      name.val('bad');

      email = form.find('input[name="email"]');
      expect(email.length).toBe(1);
      email.val('bad@example.com');
      form.find('.pf-widget-ok').click();

      success = widget.find('.success-state');
      expect(success.length).toBe(1);
      error = widget.find('.error-state');
      expect(error.length).toBe(1);
      expect(form.css('display')).toBe('none');
      expect(success.css('display')).toBe('none');
      expect(error.css('display')).toBe('block');
      expect(widget.hasClass('error')).toBeTruthy();
      expect(error.find('.pf-widget-headline').html()).toBe(
        formStatesWidget.formStates.error.headline
      );
      expect(error.find('.pf-widget-message').html()).toBe(
        formStatesWidget.formStates.error.msg
      );
      expect(error.find('.pf-widget-ok').html()).toBe(
        formStatesWidget.formStates.error.okMessage
      );
      expect(error.find('.pf-widget-cancel').html()).toBe(
        formStatesWidget.formStates.error.cancelMessage
      );

      spyOn(formStatesWidget.formStates.error.cancelAction, 'callback');
      expect(
        formStatesWidget.formStates.error.cancelAction.callback
      ).not.toHaveBeenCalled();
      error.find('.pf-widget-cancel').click();

      expect(
        formStatesWidget.formStates.error.cancelAction.callback
      ).toHaveBeenCalled();
      expect(jstag.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          'pf-widget-id': formStatesWidget.id,
          'pf-widget-type': 'form',
          'pf-widget-layout': 'slideout',
          'pf-widget-variant': '1',
          'pf-widget-event': 'error.cancel',
          'pf-widget-action':
            formStatesWidget.formStates.error.cancelAction.name,
        })
      );
      done();
    }, 600);
  });

  // -------------------------
  //  LEGACY SUCCESS STATES
  // -------------------------

  it('should show success state if one is set by the user', function (done) {
    var successForm = new pathfora.Subscription({
      id: 'success-form',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      success: {
        msg: 'a custom success message',
        delay: 2,
      },
    });

    pathfora.initializeWidgets([successForm]);

    var widget = $('#' + successForm.id);
    var form = widget.find('form');
    expect(form.length).toBe(1);

    var email = form.find('input[name="email"]');
    expect(email.length).toBe(1);
    email.val('test@example.com');
    form.find('.pf-widget-ok').click();

    var success = widget.find('.success-state');

    expect(form.css('display')).toBe('none');
    expect(success.css('display')).toBe('block');
    expect(widget.hasClass('success')).toBeTruthy();
    expect(success.find('.pf-widget-message').html()).toBe(
      successForm.success.msg
    );
    expect(success.find('.pf-widget-ok')).toBeUndefined;
    expect(success.find('.pf-widget-cancel')).toBeUndefined;

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeFalsy();
      done();
    }, 2000);
  });

  it('should not hide the module if the success state delay is 0', function (done) {
    var successForm2 = new pathfora.Subscription({
      id: 'success-form-no-delay',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      success: {
        msg: 'a custom success message',
        delay: 0,
      },
    });

    pathfora.initializeWidgets([successForm2]);

    var widget = $('#' + successForm2.id);
    var form = widget.find('form');
    expect(form.length).toBe(1);

    var email = form.find('input[name="email"]');
    expect(email.length).toBe(1);
    email.val('test@example.com');
    form.find('.pf-widget-ok').click();

    var success = widget.find('.success-state');

    expect(form.css('display')).toBe('none');
    expect(success.css('display')).toBe('block');
    expect(widget.hasClass('success')).toBeTruthy();
    expect(success.find('.pf-widget-message').html()).toBe(
      successForm2.success.msg
    );
    expect(success.find('.pf-widget-ok')).toBeUndefined;
    expect(success.find('.pf-widget-cancel')).toBeUndefined;

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      expect(widget.hasClass('success')).toBeTruthy();

      done();
    }, 3000);
  });

  it('should recognize success state buttons and callbacks', function (done) {
    var successForm3 = new pathfora.Subscription({
      id: 'success-form-cbs',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      success: {
        headline: 'test',
        msg: 'a custom success message',
        okShow: true,
        cancelShow: true,
        cancelMessage: 'Custom Cancel',
        confirmAction: {
          name: 'test success confirmation',
          callback: function () {
            window.alert('confirmed');
          },
        },
        cancelAction: {
          name: 'test success cancelation',
          callback: function () {
            window.alert('canceled');
          },
        },
        delay: 0,
      },
    });

    pathfora.initializeWidgets([successForm3]);
    var widget = $('#' + successForm3.id);
    var form = widget.find('form');
    form.find('input[name="email"]').val('test@example.com');
    form.find('.pf-widget-ok').click();

    var success = widget.find('.success-state');
    expect(form.css('display')).toBe('none');
    expect(success.css('display')).toBe('block');
    expect(widget.hasClass('success')).toBeTruthy();
    expect(success.find('.pf-widget-headline').html()).toBe(
      successForm3.success.headline
    );
    expect(success.find('.pf-widget-message').html()).toBe(
      successForm3.success.msg
    );

    expect(success.find('.pf-widget-ok').html()).toBe('Confirm');
    expect(success.find('.pf-widget-cancel').html()).toBe('Custom Cancel');

    spyOn(jstag, 'send');
    spyOn(window, 'alert');
    success.find('.pf-widget-ok').click();

    expect(jstag.send).toHaveBeenCalledWith(
      jasmine.objectContaining({
        'pf-widget-id': successForm3.id,
        'pf-widget-type': 'subscription',
        'pf-widget-layout': 'slideout',
        'pf-widget-variant': '1',
        'pf-widget-event': 'success.confirm',
        'pf-widget-action': successForm3.success.confirmAction.name,
      })
    );
    expect(window.alert).toHaveBeenCalledWith('confirmed');

    setTimeout(function () {
      pathfora.clearAll();
      pathfora.initializeWidgets([successForm3]);

      widget = $('#' + successForm3.id);
      form = widget.find('form');
      form.find('input[name="email"]').val('test@example.com');
      form.find('.pf-widget-ok').click();

      success = widget.find('.success-state');
      success.find('.pf-widget-cancel').click();

      expect(jstag.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          'pf-widget-id': successForm3.id,
          'pf-widget-type': 'subscription',
          'pf-widget-layout': 'slideout',
          'pf-widget-variant': '1',
          'pf-widget-event': 'success.cancel',
          'pf-widget-action': successForm3.success.cancelAction.name,
        })
      );
      expect(window.alert).toHaveBeenCalledWith('canceled');

      setTimeout(function () {
        done();
      }, 1000);
    }, 1000);
  });

  // -------------------------
  //  CUSTOM BUTTONS
  // -------------------------

  it('should be able to configure custom text', function () {
    var modal = new pathfora.Message({
      id: 'custom-button-text-test',
      layout: 'modal',
      msg: 'Custom button text test',
      headline: 'Hello',
      okMessage: 'Confirm Here',
      cancelMessage: 'Cancel Here',
    });

    pathfora.initializeWidgets([modal]);

    var widget = $('#' + modal.id),
      actionBtn = widget.find('.pf-widget-ok'),
      cancelBtn = widget.find('.pf-widget-cancel');

    expect(actionBtn.html()).toBe('Confirm Here');
    expect(cancelBtn.html()).toBe('Cancel Here');
  });

  // -------------------------
  //  OLD CUSTOM FIELDS
  // -------------------------

  it('should be able to hide and show fields based on config', function () {
    var formfields = new pathfora.Form({
      id: 'sample-form',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      fields: {
        title: false,
        username: false,
      },
      required: {
        message: true,
        email: false,
      },
    });

    pathfora.initializeWidgets([formfields]);

    var theform = $('#' + formfields.id).find('form');
    expect(theform.length).toBe(1);

    for (var elem in theform[0].children) {
      if (typeof theform[0].children[elem].getAttribute !== 'undefined') {
        var inputname = theform[0].children[elem].getAttribute('name'),
          inputrequired =
            theform[0].children[elem].getAttribute('data-required');

        if (inputname === 'message') {
          expect(inputrequired).toBe('true');
        } else if (inputname !== null) {
          expect(inputrequired).toBe(null);
        }

        expect(inputname).not.toBe('username');
        expect(inputname).not.toBe('title');
      }
    }
  });

  // -------------------------
  //  FORM BUILDER
  // -------------------------

  it('should track custom fields to lytics', function (done) {
    var customForm = new pathfora.Form({
      id: 'custom-form-1',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'input',
          name: 'name',
          placeholder: 'Your Name',
          required: true,
        },
        {
          type: 'checkbox-group',
          name: 'terms_agreement',
          required: true,
          values: [
            {
              label: 'I agree',
              value: 'agree',
            },
          ],
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    widget.find('[name=terms_agreement]').click();
    widget.find('[name=name]').val('my name here');
    spyOn(jstag, 'send');

    widget.find('form').find('.pf-widget-ok').click();

    expect(jstag.send).toHaveBeenCalledWith(
      jasmine.objectContaining({
        'pf-widget-id': customForm.id,
        'pf-widget-type': 'form',
        'pf-widget-layout': 'slideout',
        'pf-widget-variant': '1',
        'pf-widget-event': 'submit',
        'pf-custom-form': {
          terms_agreement: ['agree'],
          name: 'my name here',
        },
      })
    );
    done();
  });

  it('should add labels and placeholders for custom fields if defined', function () {
    var customForm = new pathfora.Form({
      id: 'custom-form-2',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'select',
          label: "What's your favorite animal?",
          placeholder: 'Select an animal...',
          name: 'favorite_animal',
          required: true,
          values: [
            {
              label: 'Cat',
              value: 'cat',
            },
            {
              label: 'Dog',
              value: 'dog',
            },
            {
              label: 'Horse',
              value: 'horse',
            },
          ],
        },
        {
          type: 'checkbox-group',
          label: 'Which ice cream flavors do you like the most?',
          name: 'ice_cream_flavors',
          required: true,
          values: [
            {
              label: 'Vanilla',
              value: 'vanilla',
            },
            {
              label: 'Chocolate',
              value: 'chocolate',
            },
            {
              label: 'Strawberry',
              value: 'strawberry',
            },
          ],
        },
        {
          type: 'textarea',
          label: 'Comments',
          name: 'comments',
          placeholder: 'Any more comments?',
          required: true,
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    var labels = widget.find('.pf-form-label');
    var divs = widget.find('.pf-has-label');

    expect(labels.length).toBe(customForm.formElements.length);
    expect(divs.length).toBe(customForm.formElements.length);

    var i;

    for (i = 0; i < labels.length; i++) {
      expect(
        labels[i].innerHTML.indexOf(customForm.formElements[i].label) !== -1
      ).toBeTruthy();
    }

    for (i = 0; i < divs.length; i++) {
      var field = divs[i];
      var configElem = customForm.formElements[i];
      if (field.placeholder && configElem.placeholder) {
        expect(field.placeholder).toBe(configElem.placeholder);
      }

      if (configElem.type === 'select') {
        expect(field.children[0].innerHTML).toBe(configElem.placeholder);
      }
    }
  });

  it('should not submit the form if required fields are not filled out', function (done) {
    var customForm = new pathfora.Form({
      id: 'custom-form-3',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'input',
          placeholder: "What's your favorite animal?",
          name: 'favorite_animal',
          required: true,
        },
        {
          type: 'radio-group',
          label: 'Which ice cream flavors do you like the most?',
          name: 'ice_cream_flavors',
          required: true,
          values: [
            {
              label: 'Vanilla',
              value: 'vanilla',
            },
            {
              label: 'Chocolate',
              value: 'chocolate',
            },
            {
              label: 'Strawberry',
              value: 'strawberry',
            },
          ],
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    spyOn(jstag, 'send');

    setTimeout(function () {
      widget.find('form').find('.pf-widget-ok').click();
      expect(jstag.send).not.toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeTruthy();

      var required = widget.find('[data-required=true]');
      expect(required.length).toBe(customForm.formElements.length);

      for (var i = 0; i < required.length; i++) {
        var req = required[i].parentNode;
        expect(req.className.indexOf('pf-form-required') !== -1).toBeTruthy();
        expect(req.className.indexOf('invalid') !== -1).toBeTruthy();
      }
      done();
    }, 200);
  });

  it('should not submit the form if fields are invalid', function (done) {
    var customForm = new pathfora.Form({
      id: 'custom-form-3',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'email',
          placeholder: 'Email',
          name: 'email',
          required: true,
        },
        {
          type: 'radio-group',
          label: 'Which ice cream flavors do you like the most?',
          name: 'ice_cream_flavors',
          values: [
            {
              label: 'Vanilla',
              value: 'vanilla',
            },
            {
              label: 'Chocolate',
              value: 'chocolate',
            },
            {
              label: 'Strawberry',
              value: 'strawberry',
            },
          ],
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    spyOn(jstag, 'send');

    setTimeout(function () {
      widget.find('input[name=email]').val('zkjhfkdjh');
      widget.find('form').find('.pf-widget-ok').click();
      expect(jstag.send).not.toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeTruthy();

      var invalid = widget.find('[data-validate=true]');
      expect(invalid.length).toBe(1);

      for (var i = 0; i < invalid.length; i++) {
        var req = invalid[i].parentNode;
        expect(req.className.indexOf('pf-form-required') !== -1).toBeTruthy();
        expect(req.className.indexOf('bad-validation') !== -1).toBeTruthy();
      }

      // also check required validation
      widget.find('input[name=email]').val('');
      widget.find('form').find('.pf-widget-ok').click();
      expect(jstag.send).not.toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeTruthy();

      invalid = widget.find('[data-required=true]');
      expect(invalid.length).toBe(1);

      for (var j = 0; j < invalid.length; j++) {
        var reqField = invalid[j].parentNode;
        expect(
          reqField.className.indexOf('pf-form-required') !== -1
        ).toBeTruthy();
        expect(reqField.className.indexOf('invalid') !== -1).toBeTruthy();
      }
      done();
    }, 200);
  });

  it('should not submit the form if a date field is invalid', function (done) {
    var customForm = new pathfora.Form({
      id: 'custom-form-3',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'date',
          name: 'birthday',
          maxDate: 'today',
          minDate: '01-01-2020',
        },
        {
          type: 'radio-group',
          label: 'Which ice cream flavors do you like the most?',
          name: 'ice_cream_flavors',
          values: [
            {
              label: 'Vanilla',
              value: 'vanilla',
            },
            {
              label: 'Chocolate',
              value: 'chocolate',
            },
            {
              label: 'Strawberry',
              value: 'strawberry',
            },
          ],
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    spyOn(jstag, 'send');

    setTimeout(function () {
      widget.find('input[name=birthday]').val('2010-10-10');
      widget.find('form').find('.pf-widget-ok').click();
      expect(jstag.send).not.toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeTruthy();

      var invalid = widget.find('[data-validate=true]');
      expect(invalid.length).toBe(1);

      for (var i = 0; i < invalid.length; i++) {
        var req = invalid[i].parentNode;
        expect(req.className.indexOf('pf-form-required') !== -1).toBeTruthy();
        expect(req.className.indexOf('bad-validation') !== -1).toBeTruthy();
      }
      done();
    }, 200);
  });

  // -------------------------
  //  CUSTOM FORM VALIDATION
  // -------------------------

  it('should not submit the form if custom validation fails', function (done) {
    var customForm = new pathfora.Form({
      id: 'custom-form-4',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'text',
          placeholder: 'Only 5 Digits Allowed',
          name: 'postal_code',
          pattern: '^[0-9]{5}$',
          required: true,
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    spyOn(jstag, 'send');

    setTimeout(function () {
      var form = widget.find('form');
      var field = form.find('input[name="postal_code"]');

      field.val('notvalid');
      form.find('.pf-widget-ok').trigger('click');
      expect(jstag.send).not.toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeTruthy();

      var required = widget.find('[data-required=true]');
      expect(required.length).toBe(customForm.formElements.length);

      for (var i = 0; i < required.length; i++) {
        var req = required[i].parentNode;
        expect(req.className.indexOf('invalid') !== -1).toBeFalsy();
      }

      done();
    }, 500);
  });

  it('should not submit the form if only 1 of 2 fields pass validation', function (done) {
    var customForm = new pathfora.Form({
      id: 'custom-form-4',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'text',
          placeholder: '6 Digits zbzbzb',
          name: 'custom_field_1',
          pattern: '^[zb]{6}$',
        },
        {
          type: 'text',
          placeholder: 'Only 5 Digits Allowed',
          name: 'custom_field_2',
          pattern: '^[0-9]{5}$',
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    spyOn(jstag, 'send');

    setTimeout(function () {
      var form = widget.find('form');

      var field1 = form.find('input[name="custom_field_1"]');
      field1.val('notvalid');

      var field2 = form.find('input[name="custom_field_2"]');
      field2.val('12345');

      form.find('.pf-widget-ok').trigger('click');

      expect(jstag.send).not.toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeTruthy();

      var validationRequirement = widget.find('[data-validate=true]');
      expect(validationRequirement.length).toBe(customForm.formElements.length);

      // expect field1 to be invalid
      var req = validationRequirement[0].parentNode;
      expect(req.className.indexOf('bad-validation') !== -1).toBeTruthy();

      // expect field2 to be valid
      req = validationRequirement[1].parentNode;
      expect(req.className.indexOf('bad-validation') !== -1).toBeFalsy();

      done();
    }, 500);
  });

  it('should submit the form if custom validation passes', function (done) {
    var customForm = new pathfora.Form({
      id: 'custom-form-5',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'text',
          placeholder: 'Only 5 Digits Allowed',
          name: 'postal_code',
          pattern: '^[0-9]{5}$',
          required: true,
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    spyOn(jstag, 'send');

    setTimeout(function () {
      var form = widget.find('form');
      var field = form.find('input[name="postal_code"]');

      field.val('12345');
      form.find('.pf-widget-ok').trigger('click');
      expect(jstag.send).toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeFalsy();

      var required = widget.find('[data-required=true]');
      expect(required.length).toBe(customForm.formElements.length);

      for (var i = 0; i < required.length; i++) {
        var req = required[i].parentNode;
        expect(req.className.indexOf('invalid') !== -1).toBeFalsy();
      }

      done();
    }, 200);
  });

  it('should add validation parameters if special case of us-postal-code', function (done) {
    var customForm = new pathfora.Form({
      id: 'custom-form-6',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'us-postal-code',
          placeholder: 'Only 5 Digits Allowed',
          name: 'postal_code',
          required: true,
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    spyOn(jstag, 'send');

    setTimeout(function () {
      var form = widget.find('form');
      var field = form.find('input[name="postal_code"]');

      var pattern = field.attr('enforcePattern');
      expect(pattern).toBe('^[0-9]{5}$');

      field.val('1234a');
      form.find('.pf-widget-ok').trigger('click');
      expect(jstag.send).not.toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeTruthy();

      var required = widget.find('[data-required=true]');
      expect(required.length).toBe(customForm.formElements.length);

      for (var i = 0; i < required.length; i++) {
        var req = required[i].parentNode;
        expect(req.className.indexOf('invalid') !== -1).toBeFalsy();
      }

      done();
    }, 500);
  });

  // -------------------------
  //  IGNORED
  // -------------------------

  // Future functionalities
  xit('should allow custom messages on action buttons', function () {
    throw 'pass';
  });

  xit('should be able to show after specific number of visits', function () {
    throw 'pass';
  });

  xit('should be able to randomly choose one of available variations', function () {
    throw 'pass';
  });

  xit('should show warning when user tries to use an invalid position', function () {
    spyOn(console, 'warn');

    var w1 = new pathfora.Message({
      msg: 'test warning display',
      id: 'position-widget',
      layout: 'bar',
    });

    var w2 = new pathfora.Message({
      msg: 'invalid position test',
      layout: 'bar',
      id: 'wrong-position-2',
      position: 'wrong-position',
    });

    pathfora.initializeWidgets([w1]);
    // NOTE Will always fail agaist production env
    //    expect(console.warn).not.toHaveBeenCalled();

    pathfora.clearAll();

    pathfora.initializeWidgets([w2]);
    // NOTE Will always fail agaist production env
    //    expect(console.warn).toHaveBeenCalledWith('wrong-position is not valid position for bar');
  });
});
