"use strict";

var credentials = 123;
var jstag = {
  send: function (data) {}
};
var ga = jasmine.createSpy('ga');

pathfora.utils.saveCookie('seerid', 123);

describe('Pathfora', function () {
  beforeEach(function() {
    localStorage.clear();
    pathfora.clearAll();
  });

  it('should track current time spent on page with 1 second accuracy', function () {
    jasmine.clock().install();

    pathfora.initializeWidgets([], credentials);

    var initialTime = pathfora.getData().timeSpentOnPage;

    jasmine.clock().tick(10000);

    var afterDelay = pathfora.getData().timeSpentOnPage;

    expect(afterDelay).toBeGreaterThan(initialTime + 8);
    expect(afterDelay).toBeLessThan(initialTime + 12);

    jasmine.clock().uninstall();
  });

  it('should distinguish newcomers, subscribers and common users', function (done) {
    jasmine.Ajax.install();
    var messageA = pathfora.Message({
      id: 'test-bar-01',
      msg: 'A',
      layout: 'modal'
    });

    var messageB = pathfora.Message({
      id: 'test-bar-02',
      msg: 'B',
      layout: 'modal'
    });

    var messageC = pathfora.Message({
      id: 'test-bar-03',
      msg: 'C',
      layout: 'modal'
    });

    var messageD = pathfora.Message({
      id: 'test-bar-04',
      msg: 'D',
      layout: 'modal'
    });

    var widgets = {
      target: [{
        segment: 'a',
        widgets: [messageA]
      },{
        segment: 'b',
        widgets: [messageB]
      },{
        segment: 'c',
        widgets: [messageC]
      },{
        segment: '*',
        widgets: [messageD]
      }]
    };

    pathfora.initializeWidgets(widgets, credentials);
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('//api.lytics.io/api/me/123/123?segments=true');

    jasmine.Ajax.requests.mostRecent().respondWith({
      'status': 200,
      'contentType': 'application/json',
      'responseText': '{"data":{"segments":["all","b"]}}'
    });

    var widget = $('#' + messageB.id);
    expect(widget).toBeDefined();

    var notOpenedA = $('#' + messageA.id);
    var notOpenedC = $('#' + messageC.id);
    var universalWidget = $('#' + messageD.id);

    setTimeout(function() {
      expect(widget.hasClass('opened')).toBeTruthy();
      expect(notOpenedA.length).toBe(0);
      expect(notOpenedC.length).toBe(0);
      expect(universalWidget.hasClass('opened')).toBeTruthy();

      var msg = $('.pf-widget-message').text();
      expect(msg).toBe('DB');

      pathfora.clearAll();
      done();
    }, 200);

    jasmine.Ajax.uninstall();
  });

  it('should properly exclude users when their segment membership matches that of the exclude settings', function (done) {
    jasmine.Ajax.install();
    var messageA = pathfora.Message({
      id: 'test-bar-01',
      msg: 'A',
      layout: 'modal'
    });

    var messageB = pathfora.Message({
      id: 'test-bar-02',
      msg: 'B',
      layout: 'modal'
    });

    var widgets = {
      target: [{
        segment: 'a',
        widgets: [messageA, messageB]
      }],
      exclude: [{
        segment: 'b',
        widgets: [messageA]
      }]
    };

    pathfora.initializeWidgets(widgets, credentials);
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('//api.lytics.io/api/me/123/123?segments=true');

    jasmine.Ajax.requests.mostRecent().respondWith({
      'status': 200,
      'contentType': 'application/json',
      'responseText': '{"data":{"segments":["a","b"]}}'
    });

    var widgetA = $('#' + messageA.id);

    var widgetB = $('#' + messageB.id);
    expect(widgetB).toBeDefined();

    setTimeout(function() {
      expect(widgetB.hasClass('opened')).toBeTruthy();
      expect(widgetA.length).toBe(0);

      var msg = $('.pf-widget-message').text();
      expect(msg).toBe('B');

      pathfora.clearAll();
      done();
    }, 200);

    jasmine.Ajax.uninstall();
  });

  it('should know if users shown interest in past', function () {
    localStorage.clear();
    var messageBar = pathfora.Message({
      layout: 'bar',
      msg: 'Message bar  - interest test',
      confirmAction: {
        name: 'Test confirm action',
        callback: function() {}
      }
    });
    var messageModal = pathfora.Message({
      layout: 'modal',
      msg: 'Message modal - interest test'
    });
    pathfora.initializeWidgets([messageBar, messageModal], credentials);

    var completedActions = pathfora.getData().completedActions.length;
    var closedWidgets = pathfora.getData().closedWidgets.length;
    expect(completedActions).toBe(0);
    expect(closedWidgets).toBe(0);

    $('#' + messageBar.id).find('.pf-widget-ok').click();
    $('#' + messageModal.id).find('.pf-widget-close').click();

    completedActions = pathfora.getData().completedActions.length;
    closedWidgets = pathfora.getData().closedWidgets.length;
    expect(completedActions).toBe(1);
    expect(closedWidgets).toBe(1);
  });

  it('should report displaying widgets and it\'s variants', function () {
    jasmine.Ajax.install();

    var messageBar = pathfora.Message({
      layout: 'modal',
      msg: 'Message bar - reporting test',
      id: 'modal-display-report'
    });

    spyOn(jstag, 'send');

    pathfora.initializeWidgets([messageBar], credentials);

    expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
      'pf-widget-id': messageBar.id,
      'pf-widget-type': 'message',
      'pf-widget-layout': 'modal',
      'pf-widget-variant': '1',
      'pf-widget-event': 'show'
    }));

    expect(ga).toHaveBeenCalledWith('send', 'event', 'Lytics',  messageBar.id + ' : show', jasmine.any(String), jasmine.any(Object));

    pathfora.clearAll();

    jasmine.Ajax.uninstall();
  });

  it('should report closing widgets and it\'s variants', function () {
    jasmine.Ajax.install();
    jasmine.clock().install();

    var messageBar = pathfora.Message({
      layout: 'modal',
      msg: 'Message bar - close reporting',
      id: 'bar-close-report'
    });

    pathfora.initializeWidgets([messageBar], credentials);

    spyOn(jstag, 'send');
    $('.pf-widget-close').click();

    jasmine.clock().tick(1000);

    expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
      'pf-widget-id': messageBar.id,
      'pf-widget-type': 'message',
      'pf-widget-layout': 'modal',
      'pf-widget-variant': '1',
      'pf-widget-event': 'close'
    }));

    expect(ga).toHaveBeenCalledWith('send', 'event', 'Lytics', messageBar.id + ' : close', jasmine.any(String), jasmine.any(Object));

    pathfora.clearAll();
    jasmine.clock().uninstall();
    jasmine.Ajax.uninstall();
  });

  it('should report completed actions to Lytics API', function (done) {
    jasmine.Ajax.install();

    var messageBar = pathfora.Message({
      layout: 'modal',
      msg: 'Message modal - action report test',
      confirmAction: {
        name: 'action test',
        callback: function() {}
      }
    });

    pathfora.initializeWidgets([messageBar], credentials);

    var widget = $('#' + messageBar.id);

    setTimeout(function() {
      expect(widget.hasClass('opened')).toBeTruthy();

      spyOn(jstag, 'send');

      expect(jstag.send).not.toHaveBeenCalled();

      widget.find('.pf-widget-ok').click();
      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
        'pf-widget-action': 'action test'
      }));

      done();
    }, 200);

    jasmine.Ajax.uninstall();
  });

  it('should report cancelled actions to Lytics API', function (done) {
    jasmine.Ajax.install();

    var messageBar = pathfora.Message({
      layout: 'modal',
      msg: 'Message modal - cancel report test',
      cancelAction: {
        name: 'cancel reporting test',
        callback: function() {}
      }
    });

    pathfora.initializeWidgets([messageBar], credentials);

    var widget = $('#' + messageBar.id);

    setTimeout(function() {
      expect(widget.hasClass('opened')).toBeTruthy();

      spyOn(jstag, 'send');

      expect(jstag.send).not.toHaveBeenCalled();

      widget.find('.pf-widget-cancel').click();
      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
        'pf-widget-action': 'cancel reporting test',
        'pf-widget-event': 'cancel'
      }));

      done();
    }, 200);

    jasmine.Ajax.uninstall();
  });

  it('should report submitting forms, with form data', function () {
    var messageBar = pathfora.Message({
      layout: 'modal',
      msg: 'Message modal - form submit reports',
      id: 'ABCa'
    });

    pathfora.initializeWidgets([messageBar], credentials);


    spyOn(jstag, 'send');
    $('.pf-widget-close').click();

    expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
      'pf-widget-id': messageBar.id,
      'pf-widget-type': 'message',
      'pf-widget-layout': 'modal',
      'pf-widget-variant': '1',
      'pf-widget-event': 'close'
    }));
  });

  xit('should throw error when trying to initialize widget with wrong layout value', function () {
    var brokenLayoutVal = new pathfora.Message({
      msg: 'Broken layout value test',
      layout: 'broken'
    });

    expect(function() {
      pathfora.initializeWidgets([brokenLayoutVal], credentials)
    }).toThrow(new Error('Invalid widget layout value'));
  });

  it('should use specified global config for all widgets', function () {
    var messageBar = pathfora.Message({
      layout: 'bar',
      msg: 'test'
    });
    var config = {
      generic: {
        theme: 'light'
      }
    };

    pathfora.initializeWidgets([messageBar], credentials, config);

    var bar  = $('#' + messageBar.id);
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
      socialNetworks: {}
    };

    var form = new pathfora.Subscription({
      msg: 'test',
      layout: 'modal'
    });

    pathfora.initializeWidgets([form], credentials);
    var widget = $('#' + form.id);

    setTimeout(function() {
      expect(widget.hasClass('opened')).toBeTruthy();
      expect(pathfora.getData()).not.toEqual(clearDataObject);

      pathfora.clearAll();

      expect(widget.hasClass('opened')).toBeFalsy();
      expect(pathfora.getData()).toEqual(clearDataObject);

      done();
    }, 200);
  });

  it('should not allow to register 2 widgets with the same id', function () {
    var w1 = new pathfora.Message({
      msg: 'Duplicate id test1',
      layout: 'modal',
      id: 'asd'
    });

    var w2 = new pathfora.Form({
      msg: 'Duplcate id test2',
      layout: 'slideout',
      id: 'asd'
    });

    expect(function() {
      pathfora.initializeWidgets([w1, w2], credentials);
    }).toThrow(new Error('Cannot add two widgets with the same id'));
  });

  xit('should be able to display widget only on specific page scrolling value', function (done) {
    $(document.body).append('<div id=\'height-element\' style=\'height:10000px; display:block;\'>Test</div>');

    var form = new pathfora.Subscription({
      msg: 'test',
      id: "scroll-test",
      layout: 'slideout',
      displayConditions: {
        scrollPercentageToDisplay: 20
      }
    });

    pathfora.initializeWidgets([form], credentials);

    setTimeout(function() {
      expect($('#' + form.id).length).toBe(0);

      var height = $(document).height();
      $('body').scrollTop(height/2);

      setTimeout(function() {
        expect($('#' + form.id).length).toBe(1);
        done();
      }, 200);

    }, 200);

    $('.height-element').remove();
  });

  xit('should be able to display widget only if user can see specific DOM element', function () {
    throw 'pass'
  });


  // future functionalities
  xit('should keep number of page visits for later use', function () {
    var messageBar = pathfora.Message({
      position: 'bottom-fixed',
      msg: 'hello new user'
    });

    // new user
    localStorage.clear();
    pathfora.initializeWidgets([messageBar], credentials);

    var VisitedPage = pathfora.getData().pageViews;
    pathfora.clearAll();

    expect(VisitedPage).toBe(1);

    pathfora.initializeWidgets([messageBar], credentials);

    VisitedPage = pathfora.getData().pageViews;
    pathfora.clearAll();

    expect(VisitedPage).toBe(2);
  });
});


describe('Widgets', function () {
  beforeEach(function() {
    localStorage.clear();
    pathfora.clearAll();
  });

  it('should be able to be displayed on document', function (done) {
    var promoWidget = new pathfora.Message({
      layout: 'bar',
      msg: 'Opening widget',
      id: 'widget-1'
    });
    pathfora.initializeWidgets([promoWidget], credentials);

    // should append element to DOM
    var widget = $('#' + promoWidget.id);
    expect(widget).toBeDefined();

    // should have class 'opened' after while
    pathfora.showWidget(promoWidget);

    setTimeout(function() {
      expect(widget.hasClass('opened')).toBeTruthy();
      pathfora.clearAll();
      done();
    }, 200);
  });

  it('should have proper id when specified, and unique id otherwise', function (done) {
    var w1 = new pathfora.Message({
      layout: 'slideout',
      position: 'right',
      msg: 'Welcome to our test website',
      id: 'test-id-widget'
    });

    var w2 = new pathfora.Message({
      layout: 'slideout',
      position: 'left',
      msg: 'Welcome to our test website'
    });

    pathfora.initializeWidgets([w1, w2], credentials);

    setTimeout(function() {
      var right = $('.pf-widget.pf-position-right');
      var left = $('.pf-widget.pf-position-left');

      expect(right).toBeDefined();
      expect(left).toBeDefined();

      expect(left.attr('id')).toBeDefined();
      expect(left.attr('id').length).toBeGreaterThan(10);
      expect(right.attr('id')).toBe('test-id-widget');
      done();
    }, 200);
  });

  it('should be able to be displayed on document', function (done) {

    var promoWidget = new pathfora.Message({
      layout: 'bar',
      msg: 'Opening widget',
      id: 'widget-1'
    });
    pathfora.initializeWidgets([promoWidget], credentials);

    // should append element to DOM
    var widget = $('#' + promoWidget.id);
    expect(widget).toBeDefined();

    // should have class 'opened' after while
    pathfora.showWidget(promoWidget);

    setTimeout(function() {
      expect(widget.hasClass('opened')).toBeTruthy();
      pathfora.clearAll();
      done();
    }, 200);

  });

  it('should not append widget second time if it\'s already opened', function (done) {
    var openedWidget = new pathfora.Message({
      layout: 'modal',
      msg: 'test widget'
    });
    pathfora.initializeWidgets([openedWidget], credentials);

    var widget = $('#' + openedWidget.id);

    // timeouts gives some time for appending to DOM
    setTimeout(function() {
      expect(widget.hasClass('opened')).toBeTruthy();

      pathfora.showWidget(openedWidget);

      setTimeout(function() {
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
    pathfora.initializeWidgets([promoWidget], credentials);
    pathfora.showWidget(promoWidget);

    var widget = $('#' + promoWidget.id);
    expect(widget).toBeDefined();

    setTimeout(function() {
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

    pathfora.initializeWidgets([testWidget], credentials);
    pathfora.showWidget(testWidget);

    var widget = $('#' + testWidget.id);
    expect(widget).toBeDefined();

    setTimeout(function() {
      expect(widget.hasClass('opened')).toBeTruthy();
      expect( widget[0]).toBeDefined();

      widget.find('.pf-widget-close').click();

      setTimeout(function () {
        expect( $('#' + testWidget.id)[0]).toBeUndefined();
        done();
      }, 600)

    }, 200);
  });

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

    var config =  {
      generic: {
        colors: {
          background: '#fff'
        }
      }
    };

    var w4 = new pathfora.Message({
      layout: 'button',
      position: 'top-right',
      msg: 'default button',
      id: 'def-theme-widget'
    });

    pathfora.initializeWidgets([w1,w2,w3, w4], credentials,config);

    var light = $('#' + w1.id);
    var dark = $('#' + w2.id);
    var custom = $('#' + w3.id);
    var def = $('#' + w4.id);

    expect(light.hasClass('pf-theme-light')).toBeTruthy();
    expect(dark.hasClass('pf-theme-dark')).toBeTruthy();
    expect(custom.hasClass('pf-theme-custom')).toBeTruthy();
    expect(def.hasClass('pf-theme-default')).toBeTruthy();

    expect(custom.css('background-color')).toBe('rgb(255, 255, 255)');
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

    pathfora.initializeWidgets([openedWidget, closedWidget], credentials);

    expect( $('#' + openedWidget.id)[0]).toBeDefined();
    expect( $('#' + closedWidget.id)[0]).toBeUndefined();

  });

  it('should be able to configure style of each widget element', function () {
    var modal = pathfora.Message({
      id: 'custom-style-test',
      layout: 'modal',
      msg: 'Custom style test',
      headline: 'Hello',
      theme: 'custom',

    });

    var config =  {
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


    pathfora.initializeWidgets([modal], credentials,config);

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

  it('should handle missing values properly and never surface undefined', function () {
    var message = pathfora.Message({
      id: 'message-test-widget',
      layout: 'slideout',
      headline: 'Message Title',
      theme: 'custom',
    });

    var form = pathfora.Form({
      id: 'form-test-widget',
      layout: 'modal',
      headline: 'Headline Title',
      theme: 'custom',
    });

    var subscription = pathfora.Subscription({
      id: 'subscription-test-widget',
      layout: 'bar',
      theme: 'custom',
    });

    pathfora.initializeWidgets([message, form, subscription],credentials);

    // test message
    var mwidget = $('#' + message.id);
    var mheadline = mwidget.find('.pf-widget-headline');
    var mtext = mwidget.find('.pf-widget-message');
    expect(mheadline.html()).not.toEqual('undefined');
    expect(mtext.html()).not.toEqual('undefined');

    // test form
    var fwidget = $('#' + form.id);
    var fheadline = fwidget.find('.pf-widget-headline');
    var ftext = fwidget.find('.pf-widget-message');
    expect(fheadline.html()).not.toEqual('undefined');
    expect(ftext.html()).not.toEqual('undefined');

    // test subscription
    var swidget = $('#' + subscription.id);
    var stext = swidget.find('.pf-widget-message');
    expect(stext.html()).not.toEqual('undefined');
  });

  it('should be able to show after specified time', function () {
    jasmine.clock().install();
    var delayedWidget = new pathfora.Message({
      msg: 'Delayed widget test',
      id: 'delayed-widget',
      layout: 'modal',
      displayConditions: {
        showDelay: 2
      }
    });

    pathfora.initializeWidgets([delayedWidget], credentials);
    var widget = $('#' + delayedWidget.id);

    jasmine.clock().tick(1000);
    expect(widget[0]).toBeUndefined();

    jasmine.clock().tick(2000);
    expect($('#' + delayedWidget.id)[0]).toBeDefined();

    jasmine.clock().uninstall();
  });

  it('should trigger callback function after pressing action button', function () {
    var modal = pathfora.Message({
      id: 'confirm-action-test',
      layout: 'modal',
      msg: 'Confirm action test modal',
      confirmAction: {
        name: 'Test confirm action',
        callback: function () {alert('test confirmation')}
      }
    });
    pathfora.initializeWidgets([modal], credentials);

    var widget = $('#confirm-action-test');

    spyOn(modal.confirmAction, 'callback');
    expect(modal.confirmAction.callback).not.toHaveBeenCalled();

    widget.find('.pf-widget-ok').click();
    expect(modal.confirmAction.callback).toHaveBeenCalled();
  });


  it('should be able to trigger action on cancel', function () {
    var modal = pathfora.Message({
      id: 'cancel-action-test',
      layout: 'modal',
      msg: 'Welcome to our website',
      cancelAction: {
        name: 'Test cancel action',
        callback: function() {alert('test cancel')}
      }
    });

    pathfora.initializeWidgets([modal], credentials);

    var widget = $('#cancel-action-test');

    spyOn(modal.cancelAction, 'callback');

    widget.find('.pf-widget-cancel').click();
    expect(modal.cancelAction.callback).toHaveBeenCalled();
  });

  it ('shouldn\'t fire submit callbacks on cancel, and cancel callbacks on submit', function () {
    var w1 = pathfora.Message({
      id: 'widget-with-action-callback',
      msg: 'Cancel action negative test',
      confirmAction: {
        name: 'Test confirm action',
        callback: function() {alert('test confirmation')}
      }
    });

    var w2 = pathfora.Message({
      id: 'widget-with-cancel-callback',
      msg: 'Cancel action negative test',
      cancelAction: {
        name: 'Test cancel action',
        callback: function() {alert('test cancel')}
      }
    });

    pathfora.initializeWidgets([w1, w2], credentials);

    var widgetA = $('#widget-with-action-callback');
    var widgetB = $('#widget-with-cancel-callback');

    spyOn(w1.confirmAction, 'callback');
    spyOn(w2.cancelAction, 'callback');


    widgetA.find('.pf-widget-cancel').click();
    expect(w1.confirmAction.callback).not.toHaveBeenCalled();


    widgetB.find('.pf-widget-ok').click();
    expect(w2.cancelAction.callback).not.toHaveBeenCalled();
  });

  it('should display in proper website regions', function () {
    var w1 = new pathfora.Message({
      msg: 'Widget positioning test',
      layout: 'modal',
      position: 'customPos'
    });

    pathfora.initializeWidgets([w1], credentials);

    var widget = $('#' + w1.id);

    expect(widget.hasClass('pf-position-customPos')).toBeTruthy();
  });

  it('should use default position if no position is specified', function () {
    var w1 = new pathfora.Message({
      msg: 'button - default pos test',
      layout: 'button'
    });
    var w2 = new pathfora.Message({
      msg: 'bar - default pos test',
      layout: 'bar'
    });
    var w3 = new pathfora.Message({
      msg: 'slideout - default pos test',
      layout: 'slideout'
    });
    var w4 = new pathfora.Form({
      msg: 'folding - default pos test',
      layout: 'folding'
    });

    pathfora.initializeWidgets([w1, w2, w3, w4], credentials);
    var widget1 = $('#' + w1.id);
    var widget2 = $('#' + w2.id);
    var widget3 = $('#' + w3.id);
    var widget4 = $('#' + w4.id);

    expect(widget1.hasClass('pf-position-top-left')).toBeTruthy();
    expect(widget2.hasClass('pf-position-top-absolute')).toBeTruthy();
    expect(widget3.hasClass('pf-position-bottom-left')).toBeTruthy();
    expect(widget4.hasClass('pf-position-bottom-left')).toBeTruthy();
  });

  it('should show warning when user tries to use not available widget position', function () {
    spyOn(console, 'warn');

    var w1 = new pathfora.Message({
      msg: 'test warning display',
      layout: 'bar'
    });

    var w2 = new pathfora.Message({
      msg: 'invalid position test',
      layout: 'bar',
      position: 'wrong-position'
    });

    pathfora.initializeWidgets([w1], credentials);
    // NOTE Will always fail agaist production env
    //    expect(console.warn).not.toHaveBeenCalled();

    pathfora.clearAll();

    pathfora.initializeWidgets([w2], credentials);
    // NOTE Will always fail agaist production env
    //    expect(console.warn).toHaveBeenCalledWith('wrong-position is not valid position for bar');
  });

  it('should not allow to be initialized without default properties', function () {
    var missingParams = function () {
      var promoWidget = new pathfora.Message();
      pathfora.initializeWidgets([promoWidget], credentials);
    };

    expect(missingParams).toThrow(new Error('Config object is missing'));
    pathfora.clearAll();
  });


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
});


// Currently not used since all comunnication is made via jstag function
describe('API', function () {
  beforeEach(function () {
    jasmine.Ajax.install();
  });
  afterEach(function () {
    jasmine.Ajax.uninstall();
  });

  xit('should be able call API with credentials', function () {
    var callback = jasmine.createSpy('success');
    var credentials = {accountId: 'abc123', userId: '123'};
    var subscribe = new pathfora.Subscription({
      type: 'bar',
      variant: 'floating',
      msg: 'Signup to get updates right into your inbox'
    });
    pathfora.initializeWidgets([subscribe], credentials);
    pathfora.api.getWidgetData(subscribe, callback);

    expect(callback).not.toHaveBeenCalled();
    jasmine.Ajax.requests.mostRecent().respondWith({
      'status': 200,
      'contentType': 'text/plain',
      'responseText': '{"response":"ok"}'
    });

    expect(callback).toHaveBeenCalledWith('{"response":"ok"}');
  });

  xit('should get data from API and pass it to callback function', function () {
    var callback = jasmine.createSpy('success');
    var credentials = {accountId: 'abc123', userId: '123'};
    var subscribe = new pathfora.Subscription({
      type: 'bar',
      variant: 'floating',
      msg: 'Signup to get updates right into your inbox'
    });
    pathfora.initializeWidgets([subscribe], credentials);
    pathfora.api.getWidgetData(subscribe, callback);

    expect(callback).not.toHaveBeenCalled();
    jasmine.Ajax.requests.mostRecent().respondWith({
      'status': 200,
      'contentType': 'text/plain',
      'responseText': '{"response":"ok"}'
    });

    expect(callback).toHaveBeenCalledWith('{"response":"ok"}');
  });

  xit('should properly handle errors by running onError function', function () {
    var callback = jasmine.createSpy('success');

    var credentials = {accountId: 'abc123', userId: '123'};
    var subscribe = new pathfora.Subscription({
      type: 'bar',
      variant: 'floating',
      msg: 'Signup to get updates right into your inbox'
    });
    var widgets = pathfora.initializeWidgets([subscribe], credentials);
    pathfora.api.getWidgetData(subscribe, function () {
    }, callback);

    expect(callback).not.toHaveBeenCalled();
    jasmine.Ajax.requests.mostRecent().respondWith({
      'status': 401,
      'contentType': 'text/plain',
      'responseText': '{"response":"error"}'
    });

    expect(callback).toHaveBeenCalledWith('{"response":"error"}');
  });

  it('should be able to configure button text each widget element', function () {
    var modal = pathfora.Message({
      id: 'custom-button-text-test',
      layout: 'modal',
      msg: 'Custom button text test',
      headline: 'Hello',
      okMessage: 'Confirm',
      cancelMessage: 'Cancel'
    });

    pathfora.initializeWidgets([modal],credentials);

    var widget = $('#' + modal.id);
    var actionBtn = widget.find('.pf-widget-ok');
    var cancelBtn = widget.find('.pf-widget-cancel');

    expect(actionBtn.html()).toBe('Confirm');
    expect(cancelBtn.html()).toBe('Cancel');
  });

  it('should be able to set random layout for each widget element', function () {
    spyOn(Math, 'floor').and.returnValue(1);
    var random = pathfora.Message({
      id: 'custom-random-test',
      layout: 'random',
      msg: 'Custom random layout test',
      headline: 'Hello'
    });

    pathfora.initializeWidgets([random],credentials);

    var widget = $('#' + random.id);

    expect(widget.find('.pf-widget-slideout')).toBeTruthy();
    expect(widget.find('.pf-position-right')).toBeTruthy();
    expect(widget.find('.pf-widget-variant-2')).toBeTruthy();

  });

  it('should report to Google Analytics API, when available', function (done) {
    var messageBar = pathfora.Message({
      layout: 'modal',
      msg: 'Message modal - ga test',
      confirmAction: {
        name: 'action test',
        callback: function () {}
      }
    });

    pathfora.initializeWidgets([messageBar], credentials);

    var widget = $('#' + messageBar.id);

    setTimeout(function () {
      widget.find('.pf-widget-ok').click();

      expect(ga).toHaveBeenCalled();
      expect(ga.calls.mostRecent().args).toEqual([
        'send',
        'event',
        'Lytics',
        messageBar.id + ' : ' + messageBar.confirmAction.name,
        jasmine.any(String),
        jasmine.any(Object)
      ]);

      done();
    }, 200);
  });


  it('should not show page-views dependent widget when page views requirement has not been reached', function () {
    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        pageVisits: 1
      }
    });
    pathfora.initializeWidgets([ form ]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  it('should show page-views dependent widget when page views requirement has been reached', function () {
    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'right',
      displayConditions: {
        pageVisits: 0
      }
    });

    pathfora.initializeWidgets([ form ]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(1);
  });

  it('should open site gating widget when the cookie is not set', function (done) {
    var gate = new pathfora.SiteGate({
      headline: 'Blocking Widget',
      msg: 'Submit this widget to access the website.'
    });

    pathfora.initializeWidgets([gate], credentials);

    var widget = $('#' + gate.id);

    setTimeout(function() {
      expect(widget.hasClass('opened')).toBeTruthy();
      done();
    }, 200);
  });

  it('should not open site gating widget when the cookie is already set', function (done) {
    pathfora.utils.saveCookie('PathforaUnlocked', true);

    var gate = new pathfora.SiteGate({
      headline: 'Blocking Widget',
      msg: 'Submit this widget to access the website.'
    });

    pathfora.initializeWidgets([gate], credentials);

    var widget = $('#' + gate.id);

    setTimeout(function() {
      expect(widget.hasClass('opened')).toBeFalsy();
      done();
    }, 200);
  });

  it('should show the date widget for all dates after 15.02.2016', function () {
    var limitDate = new Date();
    limitDate.setDate(14);
    limitDate.setMonth(1);
    limitDate.setFullYear(2016);
    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        date: {
          'start_at': limitDate.toISOString()
        }
      }
    });
    pathfora.initializeWidgets([ form ]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(1);
  });

  it('should not show the date widget for all dates after 15.02.2016', function () {
    var limitDate = new Date();
    limitDate.setDate(14);
    limitDate.setMonth(1);
    limitDate.setFullYear(2016);

    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        date: {
          'end_at': limitDate.toISOString()
        }
      }
    });
    pathfora.initializeWidgets([ form ]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  it('should not show a widget with hideAfterAction without an id', function () {
    expect(function() {
      var form = new pathfora.Form({
        msg: 'subscription',
        headline: 'Header',
        layout: 'slideout',
        position: 'bottom-right',
        displayConditions: {
          hideAfterAction: {
            confirm: true
          }
        }
      });
    }).toThrow(new Error('Widgets with the hideAfterAction displayConditions need a preset id value. Display condition denied.'));
  });

  it('should not show widget if hideAfterAction duration not met', function () {
    var widgetId = 'hideAfterActionWidget1';
    pathfora.utils.saveCookie('PathforaClosed_' + widgetId, "1," + Date.now());
    var form = new pathfora.Form({
      id: widgetId,
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        hideAfterAction: {
          closed: {
            duration: 60
          }
        }
      }
    });
    pathfora.initializeWidgets([ form ]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  it('should show widget if hideAfterAction duration met', function () {
    var widgetId = 'hideAfterActionWidget2';
    pathfora.utils.saveCookie('PathforaConfirm_' + widgetId, "1," + Date.now());
    var form = new pathfora.Form({
      id: widgetId,
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        hideAfterAction: {
          confirm: {
            hideCount: 2,
            duration: 2
          }
        }
      }
    });

    setTimeout(function() {
      pathfora.initializeWidgets([ form ]);
      var widget = $('#' + form.id);
      expect(widget.length).toBe(1);
    }, 3000);
  });

  it('should not show widget if hideAfterAction count not met', function () {
    var widgetId = 'hideAfterActionWidget3';
    pathfora.utils.saveCookie('PathforaCancel_' + widgetId, "2," + Date.now());
    var form = new pathfora.Form({
      id: widgetId,
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        hideAfterAction: {
          cancel: {
            hideCount: 2
          }
        }
      }
    });
    pathfora.initializeWidgets([ form ]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  it('should show widget if hideAfterAction count not met', function () {
    var widgetId = 'hideAfterActionWidget4';
    pathfora.utils.saveCookie('PathforaConfirm_' + widgetId, "2," + Date.now());
    var form = new pathfora.Form({
      id: widgetId,
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        hideAfterAction: {
          confirm: {
            hideCount: 5
          }
        }
      }
    });
    pathfora.initializeWidgets([ form ]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(1);
  });

  it('should not show an impression counter widget without an id', function () {
    expect(function() {
      var form = new pathfora.Form({
        msg: 'subscription',
        headline: 'Header',
        layout: 'slideout',
        position: 'bottom-right',
        displayConditions: {
          impressions: {
            session: 1,
            total: 5
          }
        }
      });
    }).toThrow(new Error('Widgets with the impression displayConditions need a preset id value. Display condition denied.'));
  });

  it('should show impressions counter widget before limited amount of initializations', function () {
    var widgetId = 'impressionWidget1';
    sessionStorage.setItem('PathforaImpressions_' + widgetId, 0);

    var form = new pathfora.Form({
      id: widgetId,
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        impressions: {
          session: 1,
          total: 5
        }
      }
    });
    pathfora.initializeWidgets([ form ]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(1);
  });

  it('should show impressions counter widget after limited amount of initializations', function () {
    var widgetId = 'impressionWidget2';
    sessionStorage.setItem('PathforaImpressions_' + widgetId, 2);

    var form = new pathfora.Form({
      id: widgetId,
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        impressions: {
          session: 1,
          total: 5
        }
      }
    });
    pathfora.initializeWidgets([ form ]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  it('should show widget if impression buffer met', function () {
    var widgetId = 'impressionWidget3';
    pathfora.utils.saveCookie('PathforaImpressions_' + widgetId, "2," + Date.now());
    var form = new pathfora.Form({
      id: widgetId,
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        impressions: {
          session: 3,
          buffer: 2
        }
      }
    });

    setTimeout(function() {
      pathfora.initializeWidgets([ form ]);
      var widget = $('#' + form.id);
      expect(widget.length).toBe(1);
    }, 3000);
  });

  it('should not show widget if impression buffer not met', function () {
    var widgetId = 'impressionWidget3';
    pathfora.utils.saveCookie('PathforaImpressions_' + widgetId, "2," + Date.now());
    var form = new pathfora.Form({
      id: widgetId,
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        impressions: {
          session: 3,
          buffer: 60
        }
      }
    });

    pathfora.initializeWidgets([ form ]);
    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });


  it('should show constrained element when the url matches the display conditions', function () {
    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          'localhost'
        ]
      }
    });
    var form2 = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          '*'
        ]
      }
    });
    pathfora.initializeWidgets([ form, form2 ]);

    var widget = $('#' + form.id);
    var widget2 = $('#' + form2.id);
    expect(widget.length).toBe(1);
    expect(widget2.length).toBe(1);
  });

  it('should not show constrained element when the url doesn\'t match the display conditions', function () {
    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          'notlocalhost'
        ]
      }
    });
    pathfora.initializeWidgets([ form ]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  it('should consider multiple display conditions', function () {
    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      displayConditions: {
        pageVisits: 0,
        urlContains: [
          "google.com"
        ]
      }
    });

    var form2 = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      displayConditions: {
        pageVisits: 5,
        urlContains: [
          "*"
        ]
      }
    });

    var form3 = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      displayConditions: {
        pageVisits: 0,
        urlContains: [
          "*"
        ]
      }
    });

    pathfora.initializeWidgets([ form, form2, form3 ]);

    expect($('#' + form.id).length).toBe(0);
    expect($('#' + form2.id).length).toBe(0);
    expect($('#' + form3.id).length).toBe(1);
  });

   it('should hide and show fields based on fields config', function () {
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

    pathfora.initializeWidgets([ formfields ]);

    var theform = document.getElementsByTagName("form");
    expect(theform.length).toBe(1);

    for (var elem in theform[0].children) {
      if(typeof theform[0].children[elem].getAttribute !== "undefined"){
        var inputname = theform[0].children[elem].getAttribute("name");
        var inputrequired = theform[0].children[elem].getAttribute("required");

        if(inputname == "message"){
          expect(inputrequired).toBe('');
        }else if(inputname !== null){
          expect(inputrequired).toBe(null);
        }

        expect(inputname).not.toBe('username');
        expect(inputname).not.toBe('title');
      }
    }
  });


  it('should consider multiple display conditions and watchers', function () {
    $(document.body).append('<div id=\'height-element\' style=\'height:10000px; display:block;\'>Test</div>');
    var id = "multiple-conditions";
    var id2 = "multiple-conditions-2";
    var id3 = "multiple-conditions-3";

    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      id: id,
      displayConditions: {
        impressions: {
          session: 3,
        },
        scrollPercentageToDisplay: 20,
      }
    });

    var form2 = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      id: id2,
      displayConditions: {
        impressions: {
          session: 1,
        },
        scrollPercentageToDisplay: 20,
      }
    });

    var form3 = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      id: id3,
      displayConditions: {
        impressions: {
          session: 3,
        },
        scrollPercentageToDisplay: 75,
      }
    });
    sessionStorage.setItem('PathforaImpressions_' + id, 2);
    sessionStorage.setItem('PathforaImpressions_' + id2, 2);
    sessionStorage.setItem('PathforaImpressions_' + id3, 2);

    pathfora.initializeWidgets([ form, form2, form3 ]);

    setTimeout(function() {
      expect($('#' + id).length).toBe(0);
      expect($('#' + id2).length).toBe(0);
      expect($('#' + id3).length).toBe(0);

      var height = $(document).height();
      $('body').scrollTop(height/2);

      setTimeout(function() {
        expect($('#' + id).length).toBe(1);
        expect($('#' + id2).length).toBe(0);
        expect($('#' + id3).length).toBe(0);
        done();
      }, 200);
    }, 200);

    $('.height-element').remove();
  });

  it('should create an empty widget config with empty target and inverse arrays ready for construction', function () {
    var scaffold = pathfora.utils.initWidgetScaffold();
    expect(scaffold.target.length).toBe(0);
    expect(scaffold.exclude.length).toBe(0);
    expect(scaffold.inverse.length).toBe(0);
  });

  it('should insert widget into config after building and inserting into scaffold', function () {
    var scaffold = pathfora.utils.initWidgetScaffold();
    var tester = pathfora.Message({
      "id": "tester123",
      "headline": "Sample Insert",
      "msg": "Sample insert message.",
      "layout": "slideout",
      "position": "bottom-right",
      "variant": "1",
      "okShow": true,
      "cancelShow": true,
      "theme": "dark",
      "titleField": false,
      "nameField": false,
      "emailField": false,
      "msgField": false
    });
    pathfora.utils.insertWidget("target", "smt_new", tester, scaffold)

    expect(scaffold.target.length).toBe(1);
    expect(scaffold.target[0].segment).toBe("smt_new");
    expect(scaffold.target[0].widgets.length).toBe(1);
    expect(scaffold.target[0].widgets[0].type).toBe("message");
    expect(scaffold.target[0].widgets[0].config.headline).toBe("Sample Insert");
    expect(scaffold.inverse.length).toBe(0);
  });

  it('should insert multiple widgets into config binding to the same segment', function () {
    var scaffold = pathfora.utils.initWidgetScaffold();

    var tester1 = pathfora.Message({
      "id": "tester123",
      "headline": "Sample Insert",
      "msg": "Sample insert message.",
      "layout": "slideout",
      "position": "bottom-right",
      "variant": "1",
      "okShow": true,
      "theme": "dark"
    });
    pathfora.utils.insertWidget("target", "smt_new", tester1, scaffold)

    var tester2 = pathfora.Form({
      "id": "tester456",
      "headline": "Sample Insert Two",
      "msg": "Sample insert message two.",
      "layout": "slideout",
      "position": "bottom-right",
      "variant": "1",
      "theme": "dark",
      "titleField": true,
      "nameField": true,
      "emailField": true
    });
    pathfora.utils.insertWidget("target", "smt_new", tester2, scaffold)

    expect(scaffold.target.length).toBe(1);
    expect(scaffold.target[0].segment).toBe("smt_new");
    expect(scaffold.target[0].widgets.length).toBe(2);
    expect(scaffold.target[0].widgets[0].type).toBe("message");
    expect(scaffold.target[0].widgets[0].config.headline).toBe("Sample Insert");
    expect(scaffold.target[0].widgets[1].type).toBe("form");
    expect(scaffold.target[0].widgets[1].config.headline).toBe("Sample Insert Two");
    expect(scaffold.target[0].widgets[1].config.titleField).toBe(true);
    expect(scaffold.inverse.length).toBe(0);
  });

  it('should insert multiple widgets into config binding to the same segment but excluding', function () {
    var scaffold = pathfora.utils.initWidgetScaffold();

    var tester1 = pathfora.Message({
      "id": "tester123",
      "headline": "Sample Insert",
      "msg": "Sample insert message.",
      "layout": "slideout",
      "position": "bottom-right",
      "variant": "1",
      "okShow": true,
      "theme": "dark"
    });
    pathfora.utils.insertWidget("exclude", "smt_new", tester1, scaffold)

    var tester2 = pathfora.Form({
      "id": "tester456",
      "headline": "Sample Insert Two",
      "msg": "Sample insert message two.",
      "layout": "slideout",
      "position": "bottom-right",
      "variant": "1",
      "theme": "dark",
      "titleField": true,
      "nameField": true,
      "emailField": true
    });
    pathfora.utils.insertWidget("exclude", "smt_new", tester2, scaffold)

    expect(scaffold.exclude.length).toBe(1);
    expect(scaffold.exclude[0].segment).toBe("smt_new");
    expect(scaffold.exclude[0].widgets.length).toBe(2);
    expect(scaffold.exclude[0].widgets[0].type).toBe("message");
    expect(scaffold.exclude[0].widgets[0].config.headline).toBe("Sample Insert");
    expect(scaffold.exclude[0].widgets[1].type).toBe("form");
    expect(scaffold.exclude[0].widgets[1].config.headline).toBe("Sample Insert Two");
    expect(scaffold.exclude[0].widgets[1].config.titleField).toBe(true);
    expect(scaffold.target.length).toBe(0);
    expect(scaffold.inverse.length).toBe(0);
  });
});