// -------------------------
//  WIDGET TESTS
// -------------------------
describe('Widgets', function () {
  beforeEach(function () {
    localStorage.clear();
    sessionStorage.clear();
    pathfora.clearAll();
  });

  // -------------------------
  //  GENERAL
  // -------------------------

  it('should be able to be displayed on document', function (done) {
    var promoWidget = new pathfora.Message({
      layout: 'bar',
      msg: 'Opening widget',
      id: 'widget-1'
    });

    pathfora.initializeWidgets([promoWidget]);

    // should append element to DOM
    var widget = $('#' + promoWidget.id);
    expect(widget).toBeDefined();

    // should have class 'opened' after while
    pathfora.showWidget(promoWidget);

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      pathfora.clearAll();
      done();
    }, 200);
  });

  it('should have proper id specified', function (done) {
    var w1 = new pathfora.Message({
      layout: 'slideout',
      position: 'right',
      msg: 'Welcome to our test website',
      id: 'test-id-widget'
    });

    expect(function () {
      return new pathfora.Message({
        layout: 'slideout',
        position: 'left',
        msg: 'Welcome to our test website'
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

  it('should not append widget second time if it\'s already opened', function (done) {
    var openedWidget = new pathfora.Message({
      layout: 'modal',
      id: 'append-widget',
      msg: 'test widget'
    });

    pathfora.initializeWidgets([openedWidget]);

    var widget = $('#' + openedWidget.id);

    // timeouts gives some time for appending to DOM
    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      pathfora.showWidget(openedWidget);

      setTimeout(function () {
        expect($('.pf-widget').length).toEqual(1);
        pathfora.clearAll();
        done();
      }, 200);
    }, 500);
  });

  it('should be able to close', function (done) {
    var promoWidget = new pathfora.Message({
      layout: 'modal',
      msg: 'Close widget test',
      id: 'close-widget'
    });

    pathfora.initializeWidgets([promoWidget]);
    pathfora.showWidget(promoWidget);

    var widget = $('#' + promoWidget.id);
    expect(widget).toBeDefined();

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      widget.find('.pf-widget-close').click();
      expect(widget.hasClass('opened')).toBeFalsy();
      done();
    }, 200);
  });

  it('should not be in DOM when closed', function (done) {
    var testWidget = new pathfora.Message({
      layout: 'modal',
      msg: 'Close widget test',
      id: 'close-clear-widget'
    });

    pathfora.initializeWidgets([testWidget]);
    pathfora.showWidget(testWidget);

    var widget = $('#' + testWidget.id);
    expect(widget).toBeDefined();

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      expect(widget[0]).toBeDefined();

      widget.find('.pf-widget-close').click();

      setTimeout(function () {
        expect($('#' + testWidget.id)[0]).toBeUndefined();
        done();
      }, 600);
    }, 200);
  });

  it('should handle missing values properly and never surface undefined', function () {
    var message = new pathfora.Message({
      id: 'message-test-widget',
      layout: 'slideout',
      headline: 'Message Title',
      theme: 'custom'
    });

    var form = new pathfora.Form({
      id: 'form-test-widget',
      layout: 'modal',
      headline: 'Headline Title',
      theme: 'custom'
    });

    var subscription = new pathfora.Subscription({
      id: 'subscription-test-widget',
      layout: 'bar',
      theme: 'custom'
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
    pathfora.clearAll();
  });

  it('should show branding assets unless set otherwise', function () {
    var w1 = new pathfora.Message({
      msg: 'test',
      id: 'branding1',
      layout: 'slideout'
    });

    var w2 = new pathfora.Message({
      msg: 'test',
      id: 'branding2',
      layout: 'modal',
      branding: false
    });

    pathfora.initializeWidgets([w1, w2]);

    var widget1 = $('#' + w1.id),
        widget2 = $('#' + w2.id);

    expect(widget1.find('.branding svg').length).toBe(1);
    expect(widget2.find('.branding svg').length).toBe(0);
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
      theme: 'light'
    });

    var w2 = new pathfora.Message({
      layout: 'button',
      position: 'right',
      msg: 'dark button',
      id: 'dark-widget',
      theme: 'dark'
    });

    var w3 = new pathfora.Message({
      layout: 'button',
      position: 'top-left',
      msg: 'custom color button',
      id: 'custom-widget',
      theme: 'custom'
    });

    var config = {
      generic: {
        colors: {
          background: '#fff'
        }
      }
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
      theme: 'none'
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
      id: 'displayed-on-init'
    });

    var closedWidget = new pathfora.Message({
      layout: 'modal',
      msg: 'Hidden on init',
      id: 'hidden-on-init',
      displayConditions: {
        showOnInit: false
      }
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
      theme: 'custom'
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
          cancelBackground: '#eee'
        }
      }
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
        requiredText: '#ebcee8'
      },
      formElements: [
        {
          'type': 'radio-group',
          'label': 'What\'s your favorite color?',
          'name': 'favorite_color',
          'required': true,
          'values': [
            {
              'label': 'Red',
              'value': 'red'
            },
            {
              'label': 'Blue',
              'value': 'blue'
            },
            {
              'label': 'Green',
              'value': 'green'
            }
          ]
        },
        {
          'type': 'input',
          'name': 'name',
          'placeholder': 'Your Name',
          'required': true
        }
      ]
    });

    pathfora.initializeWidgets([modal]);

    var widget = $('#' + modal.id);
    var asterisk = widget.find('.pf-form-label span.required');
    var flag = widget.find('.pf-required-flag');

    expect(asterisk.css('color')).toBe('rgb(186, 0, 166)');
    expect(flag.css('background-color')).toBe('rgb(186, 0, 166)');
    expect(flag.find('span').css('border-right-color')).toBe('rgb(186, 0, 166)');
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
        }
      }
    });

    pathfora.initializeWidgets([modal]);

    var widget = $('#confirm-action-test');
    spyOn(modal.confirmAction, 'callback');
    expect(modal.confirmAction.callback).not.toHaveBeenCalled();
    widget.find('.pf-widget-ok').click();
    expect(modal.confirmAction.callback).toHaveBeenCalled();
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
        }
      },
      cancelAction: {
        close: false
      }
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
        }
      }
    });

    pathfora.initializeWidgets([modal]);

    var widget = $('#cancel-action-test');
    spyOn(modal.cancelAction, 'callback');
    widget.find('.pf-widget-cancel').click();
    expect(modal.cancelAction.callback).toHaveBeenCalled();
  });

  it ('shouldn\'t fire submit callbacks on cancel, and cancel callbacks on submit', function () {
    var w1 = new pathfora.Message({
      id: 'widget-with-action-callback',
      msg: 'Cancel action negative test',
      confirmAction: {
        name: 'Test confirm action',
        callback: function () {
          alert('test confirmation');
        }
      }
    });

    var w2 = new pathfora.Message({
      id: 'widget-with-cancel-callback',
      msg: 'Cancel action negative test',
      cancelAction: {
        name: 'Test cancel action',
        callback: function () {
          alert('test cancel');
        }
      }
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

  it('should display in proper website regions', function () {
    var w1 = new pathfora.Message({
      msg: 'Widget positioning test',
      layout: 'modal',
      id: 'region-widget',
      position: 'customPos'
    });

    pathfora.initializeWidgets([w1]);

    var widget = $('#' + w1.id);
    expect(widget.hasClass('pf-position-customPos')).toBeTruthy();
  });

  it('should use default position if no position is specified', function () {
    var w1 = new pathfora.Message({
      msg: 'button - default pos test',
      id: 'position-widget-1',
      layout: 'button'
    });

    var w2 = new pathfora.Message({
      msg: 'bar - default pos test',
      id: 'position-widget-2',
      layout: 'bar'
    });

    var w3 = new pathfora.Message({
      msg: 'slideout - default pos test',
      id: 'position-widget-3',
      layout: 'slideout'
    });

    var w4 = new pathfora.Form({
      msg: 'folding - default pos test',
      id: 'position-widget-4',
      layout: 'folding'
    });

    pathfora.initializeWidgets([w1, w2, w3, w4]);

    var widget1 = $('#' + w1.id),
        widget2 = $('#' + w2.id),
        widget3 = $('#' + w3.id),
        widget4 = $('#' + w4.id);

    expect(widget1.hasClass('pf-position-top-left')).toBeTruthy();
    expect(widget2.hasClass('pf-position-top-absolute')).toBeTruthy();
    expect(widget3.hasClass('pf-position-bottom-left')).toBeTruthy();
    expect(widget4.hasClass('pf-position-bottom-left')).toBeTruthy();
  });

  

  // -------------------------
  //  INLINE MODULES
  // -------------------------
  it('should throw error if inline position not found', function () {
    var inline = new pathfora.Message({
      headline: 'Inline Widget',
      layout: 'inline',
      position: '.a-non-existant-div',
      id: 'inline-1',
      msg: 'inline'
    });

    expect(function () {
      pathfora.initializeWidgets([inline]);
    }).toThrow(new Error('Inline widget could not be initialized in .a-non-existant-div'));
  });

  it('should append the inline widget to the position element', function (done) {
    var div = document.createElement('div');
    div.id = 'a-real-div';
    document.body.appendChild(div);

    var inline = new pathfora.Message({
      headline: 'Inline Widget',
      layout: 'inline',
      position: '#a-real-div',
      id: 'inline-1',
      msg: 'inline'
    });

    pathfora.initializeWidgets([inline]);

    var parent = $(inline.position);

    setTimeout(function () {
      var widget = parent.find('#' + inline.id);
      expect(widget.length).toBe(1);
      done();
    }, 200);

  });

  // -------------------------
  //  SUCCESS STATE
  // -------------------------

  it('should show success state if one is set by the user', function (done) {

    var successForm = new pathfora.Subscription({
      id: 'success-form',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      success: {
        msg: 'a custom success message',
        delay: 2
      }
    });

    pathfora.initializeWidgets([successForm]);

    var widget = $('#' + successForm.id);
    var form = widget.find('form');
    expect(form.length).toBe(1);

    var email = form.find('input[name="email"]');
    expect(email.length).toBe(1);
    email.val('test@example.com');
    form.find('.pf-widget-ok').click();

    var success = $('.success-state');

    expect(form.css('display')).toBe('none');
    expect(success.css('display')).toBe('block');
    expect(widget.hasClass('success')).toBeTruthy();
    expect(success.find('.pf-widget-message').html()).toBe(successForm.success.msg);
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
        delay: 0
      }
    });

    pathfora.initializeWidgets([successForm2]);

    var widget = $('#' + successForm2.id);
    var form = widget.find('form');
    expect(form.length).toBe(1);

    var email = form.find('input[name="email"]');
    expect(email.length).toBe(1);
    email.val('test@example.com');
    form.find('.pf-widget-ok').click();

    var success = $('.success-state');

    expect(form.css('display')).toBe('none');
    expect(success.css('display')).toBe('block');
    expect(widget.hasClass('success')).toBeTruthy();
    expect(success.find('.pf-widget-message').html()).toBe(successForm2.success.msg);
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
          }
        },
        cancelAction: {
          name: 'test success cancelation',
          callback: function () {
            window.alert('canceled');
          }
        },
        delay: 0
      }
    });

    pathfora.initializeWidgets([successForm3]);
    var widget = $('#' + successForm3.id);
    var form = widget.find('form');
    form.find('input[name="email"]').val('test@example.com');
    form.find('.pf-widget-ok').click();

    var success = $('.success-state');
    expect(form.css('display')).toBe('none');
    expect(success.css('display')).toBe('block');
    expect(widget.hasClass('success')).toBeTruthy();
    expect(success.find('.pf-widget-headline').html()).toBe(successForm3.success.headline);
    expect(success.find('.pf-widget-message').html()).toBe(successForm3.success.msg);

    expect(success.find('.pf-widget-ok').html()).toBe('Confirm');
    expect(success.find('.pf-widget-cancel').html()).toBe('Custom Cancel');

    spyOn(jstag, 'send');
    spyOn(window, 'alert');
    success.find('.pf-widget-ok').click();

    expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
      'pf-widget-id': successForm3.id,
      'pf-widget-type': 'subscription',
      'pf-widget-layout': 'slideout',
      'pf-widget-variant': '1',
      'pf-widget-event': 'success.confirm',
      'pf-widget-action': successForm3.success.confirmAction.name
    }));
    expect(window.alert).toHaveBeenCalledWith('confirmed');

    setTimeout(function () {
      pathfora.clearAll();
      pathfora.initializeWidgets([successForm3]);

      widget = $('#' + successForm3.id);
      form = widget.find('form');
      form.find('input[name="email"]').val('test@example.com');
      form.find('.pf-widget-ok').click();

      success = $('.success-state');
      success.find('.pf-widget-cancel').click();

      expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
        'pf-widget-id': successForm3.id,
        'pf-widget-type': 'subscription',
        'pf-widget-layout': 'slideout',
        'pf-widget-variant': '1',
        'pf-widget-event': 'success.cancel',
        'pf-widget-action': successForm3.success.cancelAction.name
      }));
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
      cancelMessage: 'Cancel Here'
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
    pathfora.clearAll();

    var formfields = new pathfora.Form({
      id: 'sample-form',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      fields: {
        title: false,
        username: false
      },
      required: {
        message: true,
        email: false
      }
    });

    pathfora.initializeWidgets([formfields]);

    var theform = document.getElementsByTagName('form');
    expect(theform.length).toBe(1);

    for (var elem in theform[0].children) {
      if (typeof theform[0].children[elem].getAttribute !== 'undefined') {
        var inputname = theform[0].children[elem].getAttribute('name'),
            inputrequired = theform[0].children[elem].getAttribute('data-required');

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

  it('should track custom fields to lytics', function () {
    var customForm = new pathfora.Form({
      id: 'custom-form-1',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          'type': 'input',
          'name': 'name',
          'placeholder': 'Your Name',
          'required': true
        },
        {
          'type': 'checkbox-group',
          'name': 'terms_agreement',
          'required': true,
          'values': [
            {
              'label': 'I agree',
              'value': 'agree'
            }
          ]
        }
      ]
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    widget.find('[name=terms_agreement]').click();
    widget.find('[name=name]').val('my name here');
    spyOn(jstag, 'send');

    widget.find('form').find('.pf-widget-ok').click();

    expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
      'pf-widget-id': customForm.id,
      'pf-widget-type': 'form',
      'pf-widget-layout': 'slideout',
      'pf-widget-variant': '1',
      'pf-widget-event': 'submit',
      'pf-custom-form': {
        'terms_agreement': ['agree'],
        'name': 'my name here'
      }
    }));
  });

  it('should add labels and placeholders for custom fields if defined', function () {
    var customForm = new pathfora.Form({
      id: 'custom-form-2',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          'type': 'select',
          'label': 'What\'s your favorite animal?',
          'placeholder': 'Select an animal...',
          'name': 'favorite_animal',
          'required': true,
          'values': [
            {
              'label': 'Cat',
              'value': 'cat'
            },
            {
              'label': 'Dog',
              'value': 'dog'
            },
            {
              'label': 'Horse',
              'value': 'horse'
            }
          ]
        },
        {
          'type': 'checkbox-group',
          'label': 'Which ice cream flavors do you like the most?',
          'name': 'ice_cream_flavors',
          'required': true,
          'values': [
            {
              'label': 'Vanilla',
              'value': 'vanilla'
            },
            {
              'label': 'Chocolate',
              'value': 'chocolate'
            },
            {
              'label': 'Strawberry',
              'value': 'strawberry'
            }
          ]
        },
        {
          'type': 'textarea',
          'label': 'Comments',
          'name': 'comments',
          'placeholder': 'Any more comments?',
          'required': true
        }
      ]
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    var labels = widget.find('.pf-form-label');
    var divs = widget.find('.pf-has-label');

    expect(labels.length).toBe(customForm.formElements.length);
    expect(divs.length).toBe(customForm.formElements.length);

    var i;

    for (i = 0; i < labels.length; i++) {
      expect(labels[i].innerHTML.indexOf(customForm.formElements[i].label) !== -1).toBeTruthy();
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
          'type': 'input',
          'placeholder': 'What\'s your favorite animal?',
          'name': 'favorite_animal',
          'required': true
        },
        {
          'type': 'radio-group',
          'label': 'Which ice cream flavors do you like the most?',
          'name': 'ice_cream_flavors',
          'required': true,
          'values': [
            {
              'label': 'Vanilla',
              'value': 'vanilla'
            },
            {
              'label': 'Chocolate',
              'value': 'chocolate'
            },
            {
              'label': 'Strawberry',
              'value': 'strawberry'
            }
          ]
        }
      ]
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
      layout: 'bar'
    });

    var w2 = new pathfora.Message({
      msg: 'invalid position test',
      layout: 'bar',
      id: 'wrong-position-2',
      position: 'wrong-position'
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
