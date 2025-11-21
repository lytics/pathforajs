import createAndDispatchKeydown from '../utils/create-and-dispatch-keydown.js';
import globalReset from '../utils/global-reset';
import {
  createMessageWidget,
  createFormWidget,
  createSubscriptionWidget,
  expectWidgetVisible,
  expectWidgetHidden,
  expectWidgetClosed,
  expectWidgetTheme
} from '../utils/test-helpers';

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
    var w1 = createMessageWidget({
      msg: 'Duplicate id test1',
      layout: 'modal',
      id: 'asd',
    });

    var w2 = createFormWidget({
      msg: 'Duplcate id test2',
      layout: 'slideout',
      id: 'asd',
    });

    expect(function () {
      pathfora.initializeWidgets([w1, w2]);
    }).toThrow(new Error('Cannot add two widgets with the same id'));
  });

  it('should use specified global config for all widgets', function () {
    var messageBar = createMessageWidget({
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

    expectWidgetTheme(messageBar.id, 'light');
    var bar = $('#' + messageBar.id);
    expect(bar.hasClass('pf-theme-default')).toBe(false);
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

    var form = createSubscriptionWidget({
      msg: 'test',
      id: 'clear-widget',
      layout: 'modal',
    });

    pathfora.initializeWidgets([form]);

    setTimeout(function () {
      expectWidgetVisible(form.id);
      expect(pathfora.getDataObject()).not.toEqual(clearDataObject);

      pathfora.clearAll();
      expectWidgetClosed(form.id);
      expect(pathfora.getDataObject()).toEqual(clearDataObject);
      done();
    }, 200);
  });

  it('should be able to clear specific widgets by their IDs', function (done) {
    var widget1 = createMessageWidget({
      msg: 'Widget 1',
      id: 'clear-by-id-1',
      layout: 'modal',
    });

    var widget2 = createMessageWidget({
      msg: 'Widget 2',
      id: 'clear-by-id-2',
      layout: 'slideout',
    });

    var widget3 = createMessageWidget({
      msg: 'Widget 3',
      id: 'clear-by-id-3',
      layout: 'bar',
    });

    pathfora.initializeWidgets([widget1, widget2, widget3]);

    setTimeout(function () {
      // All widgets should be opened initially
      expectWidgetVisible(widget1.id);
      expectWidgetVisible(widget2.id);
      expectWidgetVisible(widget3.id);

      // Clear only widget1 and widget3
      pathfora.clearById(['clear-by-id-1', 'clear-by-id-3']);

      setTimeout(function () {
        // Widget1 and widget3 should be closed and removed from DOM
        expectWidgetHidden(widget1.id);
        expectWidgetHidden(widget3.id);

        // Widget2 should still be opened
        expectWidgetVisible(widget2.id);

        // Clear widget2 as well
        pathfora.clearById(['clear-by-id-2']);

        setTimeout(function () {
          // All widgets should now be closed and removed
          expectWidgetHidden(widget1.id);
          expectWidgetHidden(widget2.id);
          expectWidgetHidden(widget3.id);
          done();
        }, 200);
      }, 200);
    }, 200);
  });

  it('should handle clearById with invalid input gracefully', function (done) {
    var widget = createMessageWidget({
      msg: 'Test widget',
      id: 'invalid-input-test',
      layout: 'modal',
    });

    pathfora.initializeWidgets([widget]);

    // Test with non-array input
    spyOn(console, 'warn');
    pathfora.clearById('not-an-array');

    expect(console.warn).toHaveBeenCalledWith(
      'clearById: widgetIds must be an array'
    );

    // Widget should still be opened
    setTimeout(function () {
      expect($('#' + widget.id).hasClass('opened')).toBeTruthy();
      done();
    }, 200);
  });

  it('should handle clearById with non-existent widget IDs', function (done) {
    var widget = createMessageWidget({
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
    var promoWidget = createMessageWidget({
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
    var w1 = createMessageWidget({
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
    var openedWidget = createMessageWidget({
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
    var testWidget = createMessageWidget({
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
    var modal = createMessageWidget({
      id: 'modal-esc-test',
      layout: 'modal',
      headline: 'Message Title',
      msg: 'test',
    });

    var gate = createSiteGateWidget({
      id: 'modal-esc-test2',
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
    var message = createMessageWidget({
      id: 'message-test-widget',
      layout: 'slideout',
      headline: 'Message Title',
      theme: 'custom',
    });

    var form = createFormWidget({
      id: 'form-test-widget',
      layout: 'modal',
      headline: 'Headline Title',
      theme: 'custom',
    });

    var subscription = createSubscriptionWidget({
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
    var w1 = createMessageWidget({
      msg: 'test',
      id: 'branding1',
      layout: 'slideout',
      branding: true,
    });

    var w2 = createMessageWidget({
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
    var modalFooter = createMessageWidget({
      id: 'footer1',
      msg: 'test',
      layout: 'modal',
      footerText: 'Footer text',
    });

    var modalNoFooter = createMessageWidget({
      id: 'footer2',
      msg: 'test',
      layout: 'modal',
    });

    var slideoutFooter = createMessageWidget({
      id: 'slidout1',
      msg: 'test',
      layout: 'slideout',
      footerText: 'Footer text',
    });

    var slideoutNoFooter = createMessageWidget({
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
    var modal = createMessageWidget({
      id: 'modal',
      msg: 'testmodal',
      layout: 'modal',
    });
    var div = document.createElement('div');
    div.className = 'some-dom-element';
    document.body.appendChild(div);
    var inline = createMessageWidget({
      id: 'inline',
      layout: 'inline',
      position: '.some-dom-element',
      msg: 'testing',
    });
    var slideout = createMessageWidget({
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
    var modal = createMessageWidget({
      id: 'modal',
      msg: 'testmodal',
      layout: 'modal',
      image: 'https://lytics.github.io/pathforadocs/assets/lion.jpg',
    });
    var div = document.createElement('div');
    div.className = 'some-dom-element';
    document.body.appendChild(div);
    var inline = createMessageWidget({
      id: 'inline',
      layout: 'inline',
      position: '.some-dom-element',
      msg: 'testing',
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

});
