'use strict';

var credentials = 123,
    ga = jasmine.createSpy('ga');

var jstag = {
  send: function () {}
};

pathfora.utils.saveCookie('seerid', 123);

function makeMouseEvent (type, params) {
  var evt;
  try {
    evt = new MouseEvent(type, params);
  } catch (e) {
    evt = document.createEvent('MouseEvents');
    params = params || {};
    evt.initMouseEvent(type,
      params.canBubble,
      params.cancelable,
      params.view || window,
      params.detail || 0,
      params.screenX || 0,
      params.screenY || 0,
      params.clientX || 0,
      params.clientY || 0,
      params.ctrlKey || false,
      params.altKey || false,
      params.shiftKey || false,
      params.metaKey || false,
      params.button || 0,
      params.relatedTarget
    );
  }

  return evt;
}

// -------------------------
// PATHFORA TESTS
// -------------------------

describe('Pathfora', function () {
  beforeEach(function () {
    localStorage.clear();
    pathfora.clearAll();
  });

  // -------------------------
  // GENERAL
  // -------------------------

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

    expect(function () {
      pathfora.initializeWidgets([w1, w2]);
    }).toThrow(new Error('Cannot add two widgets with the same id'));
  });

  it('should track current time spent on page with 1 second accuracy', function () {
    jasmine.clock().install();

    pathfora.initializeWidgets([]);

    var initialTime = pathfora.getData().timeSpentOnPage;
    jasmine.clock().tick(10000);

    var afterDelay = pathfora.getData().timeSpentOnPage;
    expect(afterDelay).toBeGreaterThan(initialTime + 8);
    expect(afterDelay).toBeLessThan(initialTime + 12);
    jasmine.clock().uninstall();
  });

  it('should use specified global config for all widgets', function () {
    var messageBar = new pathfora.Message({
      layout: 'bar',
      id: 'global-config-1',
      msg: 'test'
    });

    var config = {
      generic: {
        theme: 'light'
      }
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
      socialNetworks: {}
    };

    var form = new pathfora.Subscription({
      msg: 'test',
      id: 'clear-widget',
      layout: 'modal'
    });

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      expect(pathfora.getData()).not.toEqual(clearDataObject);

      pathfora.clearAll();
      expect(widget.hasClass('opened')).toBeFalsy();
      expect(pathfora.getData()).toEqual(clearDataObject);
      done();
    }, 200);
  });

  it('should be able to set random layout for each widget element', function () {
    spyOn(Math, 'floor').and.returnValue(1);

    var random = new pathfora.Message({
      id: 'custom-random-test',
      layout: 'random',
      msg: 'Custom random layout test',
      headline: 'Hello'
    });

    pathfora.initializeWidgets([random]);

    var widget = $('#' + random.id);
    expect(widget.find('.pf-widget-slideout')).toBeTruthy();
    expect(widget.find('.pf-position-right')).toBeTruthy();
    expect(widget.find('.pf-widget-variant-2')).toBeTruthy();
  });

  // -------------------------
  // TRACKING
  // -------------------------

  it('should know if users have interacted in the past', function () {
    localStorage.clear();

    var messageBar = new pathfora.Message({
      layout: 'bar',
      id: 'interest-widget1',
      msg: 'Message bar  - interest test',
      confirmAction: {
        name: 'Test confirm action',
        callback: function () {
          // cb here
        }
      }
    });

    var messageModal = new pathfora.Message({
      layout: 'modal',
      id: 'interest-widget2',
      msg: 'Message modal - interest test'
    });
    pathfora.initializeWidgets([messageBar, messageModal]);

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

    var messageBar = new pathfora.Message({
      layout: 'modal',
      msg: 'Message bar - reporting test',
      id: 'modal-display-report'
    });

    spyOn(jstag, 'send');

    pathfora.initializeWidgets([messageBar]);

    expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
      'pf-widget-id': messageBar.id,
      'pf-widget-type': 'message',
      'pf-widget-layout': 'modal',
      'pf-widget-variant': '1',
      'pf-widget-event': 'show'
    }));

    expect(ga).toHaveBeenCalledWith('send', 'event', 'Lytics', messageBar.id + ' : show', jasmine.any(String), jasmine.any(Object));
    pathfora.clearAll();
    jasmine.Ajax.uninstall();
  });

  it('should report closing widgets and it\'s variants', function () {
    jasmine.Ajax.install();
    jasmine.clock().install();

    var messageBar = new pathfora.Message({
      layout: 'modal',
      msg: 'Message bar - close reporting',
      id: 'bar-close-report'
    });

    pathfora.initializeWidgets([messageBar]);

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

    var messageBar = new pathfora.Message({
      layout: 'modal',
      id: 'tracking-widget1',
      msg: 'Message modal - action report test',
      confirmAction: {
        name: 'action test',
        callback: function () {
          // cb here
        }
      }
    });

    pathfora.initializeWidgets([messageBar]);

    var widget = $('#' + messageBar.id);

    setTimeout(function () {
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

    var messageBar = new pathfora.Message({
      layout: 'modal',
      id: 'tracking-widget2',
      msg: 'Message modal - cancel report test',
      cancelAction: {
        name: 'cancel reporting test',
        callback: function () {
          // cb here
        }
      }
    });

    pathfora.initializeWidgets([messageBar]);

    var widget = $('#' + messageBar.id);

    setTimeout(function () {
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
    var messageBar = new pathfora.Message({
      layout: 'modal',
      msg: 'Message modal - form submit reports',
      id: 'ABCa'
    });

    pathfora.initializeWidgets([messageBar]);


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

  it('should report to Google Analytics API, when available', function (done) {
    var messageBar = new pathfora.Message({
      layout: 'modal',
      id: 'ga-widget',
      msg: 'Message modal - ga test',
      confirmAction: {
        name: 'action test',
        callback: function () {
          // cb here
        }
      }
    });

    pathfora.initializeWidgets([messageBar]);

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

  it('should report hover actions to Lytics API', function (done) {
    jasmine.Ajax.install();

    var messageModal = new pathfora.Message({
      layout: 'modal',
      id: 'tracking-widget3',
      msg: 'Message modal - report test'
    });

    pathfora.initializeWidgets([messageModal]);

    var widget = $('#' + messageModal.id);

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();

      spyOn(jstag, 'send');
      expect(jstag.send).not.toHaveBeenCalled();

      widget.find('.pf-widget-ok').mouseenter().mouseleave();
      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
        'pf-widget-action': 'confirm',
        'pf-widget-event': 'hover'
      }));

      widget.find('.pf-widget-cancel').mouseenter().mouseleave();
      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
        'pf-widget-action': 'cancel',
        'pf-widget-event': 'hover'
      }));

      widget.find('.pf-widget-close').mouseenter().mouseleave();
      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
        'pf-widget-action': 'close',
        'pf-widget-event': 'hover'
      }));

      done();
    }, 200);

    jasmine.Ajax.uninstall();
  });

  it('should report form focus actions to Lytics API', function (done) {
    jasmine.Ajax.install();

    var formModal = new pathfora.Form({
      layout: 'modal',
      id: 'tracking-widget4',
      msg: 'Form modal - report test'
    });

    pathfora.initializeWidgets([formModal]);

    var widget = $('#' + formModal.id);

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      var form = widget.find('form');

      spyOn(jstag, 'send');
      expect(jstag.send).not.toHaveBeenCalled();

      form.find('[name="username"]').focus();
      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
        'pf-widget-action': 'username',
        'pf-widget-event': 'focus'
      }));

      form.find('[name="email"]').focus();
      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
        'pf-widget-action': 'email',
        'pf-widget-event': 'focus'
      }));

      form.find('[name="message"]').focus();
      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
        'pf-widget-action': 'message',
        'pf-widget-event': 'focus'
      }));

      done();
    }, 200);

    jasmine.Ajax.uninstall();
  });

  it('should report form started actions to Lytics API', function (done) {
    jasmine.Ajax.install();

    var formModal = new pathfora.Form({
      layout: 'modal',
      id: 'tracking-widget5',
      msg: 'Form modal - report test'
    });

    pathfora.initializeWidgets([formModal]);

    var widget = $('#' + formModal.id);

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      var form = widget.find('form');

      spyOn(jstag, 'send');
      expect(jstag.send).not.toHaveBeenCalled();

      form.find('[name="username"]').val('a').change();

      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
        'pf-widget-action': 'username',
        'pf-widget-event': 'form_start'
      }));

      form.find('[name="email"]').val('a').change();

      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
        'pf-widget-action': 'email',
        'pf-widget-event': 'form_start'
      }));

      form.find('[name="message"]').val('a').change();

      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(jasmine.objectContaining({
        'pf-widget-action': 'message',
        'pf-widget-event': 'form_start'
      }));

      done();
    }, 200);

    jasmine.Ajax.uninstall();
  });


  // -------------------------
  // TARGETING
  // -------------------------

  it('should distinguish newcomers, subscribers and common users', function (done) {
    window.lio = {
      data: {
        segments: ['all', 'b']
      }
    };

    window.lio.loaded = true;

    var messageA = new pathfora.Message({
      id: 'test-bar-01',
      msg: 'A',
      layout: 'modal'
    });

    var messageB = new pathfora.Message({
      id: 'test-bar-02',
      msg: 'B',
      layout: 'modal'
    });

    var messageC = new pathfora.Message({
      id: 'test-bar-03',
      msg: 'C',
      layout: 'modal'
    });

    var messageD = new pathfora.Message({
      id: 'test-bar-04',
      msg: 'D',
      layout: 'modal'
    });

    var widgets = {
      target: [{
        segment: 'a',
        widgets: [messageA]
      }, {
        segment: 'b',
        widgets: [messageB]
      }, {
        segment: 'c',
        widgets: [messageC]
      }, {
        segment: '*',
        widgets: [messageD]
      }]
    };

    pathfora.initializeWidgets(widgets);

    var widget = $('#' + messageB.id);
    expect(widget).toBeDefined();

    var notOpenedA = $('#' + messageA.id);
    var notOpenedC = $('#' + messageC.id);
    var widgetB = $('#' + messageB.id);
    var universalWidget = $('#' + messageD.id);

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      expect(notOpenedA.length).toBe(0);
      expect(notOpenedC.length).toBe(0);
      expect(universalWidget.hasClass('opened')).toBeTruthy();
      expect(widgetB.hasClass('opened')).toBeTruthy();

      pathfora.clearAll();
      done();
    }, 200);
  });

  it('should properly exclude users when their segment membership matches that of the exclude settings', function (done) {
    window.lio = {
      data: {
        segments: ['a', 'b']
      }
    };

    window.lio.loaded = true;

    var messageA = new pathfora.Message({
      id: 'test-bar-01',
      msg: 'A',
      layout: 'modal'
    });

    var messageB = new pathfora.Message({
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

    pathfora.initializeWidgets(widgets);

    var widgetA = $('#' + messageA.id),
        widgetB = $('#' + messageB.id);

    expect(widgetB).toBeDefined();

    setTimeout(function () {
      expect(widgetB.hasClass('opened')).toBeTruthy();
      expect(widgetA.length).toBe(0);
      pathfora.clearAll();
      done();
    }, 200);
  });

  it('should properly allow for multiple widgets with different segment targets', function (done) {
    window.lio = {
      data: {
        segments: ['a', 'b']
      }
    };

    window.lio.loaded = true;

    var messageA = new pathfora.Message({
      id: 'test-slideout-01',
      msg: 'A',
      layout: 'slideout'
    });

    var messageB = new pathfora.Message({
      id: 'test-bar-02',
      msg: 'B',
      layout: 'modal'
    });

    var widgets = {
      target: [
        {
          segment: 'a',
          widgets: [messageA]
        },
        {
          segment: 'b',
          widgets: [messageB]
        }
      ]
    };

    pathfora.initializeWidgets(widgets);

    var widgetA = $('#' + messageA.id),
        widgetB = $('#' + messageB.id);

    expect(widgetA).toBeDefined();
    expect(widgetB).toBeDefined();

    setTimeout(function () {
      expect(widgetA.hasClass('opened')).toBeTruthy();
      expect(widgetB.hasClass('opened')).toBeTruthy();
      pathfora.clearAll();
      done();
    }, 200);
  });

  // -------------------------
  // SCAFFOLDING
  // -------------------------

  it('should create an empty widget config with empty target and inverse arrays ready for construction', function () {
    var scaffold = pathfora.utils.initWidgetScaffold();
    expect(scaffold.target.length).toBe(0);
    expect(scaffold.exclude.length).toBe(0);
    expect(scaffold.inverse.length).toBe(0);
  });

  it('should insert widget into config after building and inserting into scaffold', function () {
    var scaffold = pathfora.utils.initWidgetScaffold();

    var tester = new pathfora.Message({
      'id': 'tester123',
      'headline': 'Sample Insert',
      'msg': 'Sample insert message.',
      'layout': 'slideout',
      'position': 'bottom-right',
      'variant': '1',
      'okShow': true,
      'cancelShow': true,
      'theme': 'dark',
      'titleField': false,
      'nameField': false,
      'emailField': false,
      'msgField': false
    });
    pathfora.utils.insertWidget('target', 'smt_new', tester, scaffold);

    expect(scaffold.target.length).toBe(1);
    expect(scaffold.target[0].segment).toBe('smt_new');
    expect(scaffold.target[0].widgets.length).toBe(1);
    expect(scaffold.target[0].widgets[0].type).toBe('message');
    expect(scaffold.target[0].widgets[0].config.headline).toBe('Sample Insert');
    expect(scaffold.inverse.length).toBe(0);
  });

  it('should insert multiple widgets into config binding to the same segment', function () {
    var scaffold = pathfora.utils.initWidgetScaffold();

    var tester1 = new pathfora.Message({
      'id': 'tester123',
      'headline': 'Sample Insert',
      'msg': 'Sample insert message.',
      'layout': 'slideout',
      'position': 'bottom-right',
      'variant': '1',
      'okShow': true,
      'theme': 'dark'
    });
    pathfora.utils.insertWidget('target', 'smt_new', tester1, scaffold);

    var tester2 = new pathfora.Form({
      'id': 'tester456',
      'headline': 'Sample Insert Two',
      'msg': 'Sample insert message two.',
      'layout': 'slideout',
      'position': 'bottom-right',
      'variant': '1',
      'theme': 'dark',
      'titleField': true,
      'nameField': true,
      'emailField': true
    });
    pathfora.utils.insertWidget('target', 'smt_new', tester2, scaffold);

    expect(scaffold.target.length).toBe(1);
    expect(scaffold.target[0].segment).toBe('smt_new');
    expect(scaffold.target[0].widgets.length).toBe(2);
    expect(scaffold.target[0].widgets[0].type).toBe('message');
    expect(scaffold.target[0].widgets[0].config.headline).toBe('Sample Insert');
    expect(scaffold.target[0].widgets[1].type).toBe('form');
    expect(scaffold.target[0].widgets[1].config.headline).toBe('Sample Insert Two');
    expect(scaffold.target[0].widgets[1].config.titleField).toBe(true);
    expect(scaffold.inverse.length).toBe(0);
  });

  it('should insert multiple widgets into config binding to the same segment but excluding', function () {
    var scaffold = pathfora.utils.initWidgetScaffold();

    var tester1 = new pathfora.Message({
      'id': 'tester123',
      'headline': 'Sample Insert',
      'msg': 'Sample insert message.',
      'layout': 'slideout',
      'position': 'bottom-right',
      'variant': 1,
      'okShow': true,
      'theme': 'dark'
    });

    pathfora.utils.insertWidget('exclude', 'smt_new', tester1, scaffold);

    var tester2 = new pathfora.Form({
      'id': 'tester456',
      'headline': 'Sample Insert Two',
      'msg': 'Sample insert message two.',
      'layout': 'slideout',
      'position': 'bottom-right',
      'variant': 1,
      'theme': 'dark',
      'titleField': true,
      'nameField': true,
      'emailField': true
    });

    pathfora.utils.insertWidget('exclude', 'smt_new', tester2, scaffold);

    expect(scaffold.exclude.length).toBe(1);
    expect(scaffold.exclude[0].segment).toBe('smt_new');
    expect(scaffold.exclude[0].widgets.length).toBe(2);
    expect(scaffold.exclude[0].widgets[0].type).toBe('message');
    expect(scaffold.exclude[0].widgets[0].config.headline).toBe('Sample Insert');
    expect(scaffold.exclude[0].widgets[1].type).toBe('form');
    expect(scaffold.exclude[0].widgets[1].config.headline).toBe('Sample Insert Two');
    expect(scaffold.exclude[0].widgets[1].config.titleField).toBe(true);
    expect(scaffold.target.length).toBe(0);
    expect(scaffold.inverse.length).toBe(0);
  });

  // -------------------------
  // A/B TESTING
  // -------------------------

  it('should select only one A/B Test group to show', function () {
    var widgetA = new pathfora.Message({
      id: 'ab-widget1-a',
      msg: 'A',
      layout: 'slideout'
    });

    var widgetB = new pathfora.Message({
      id: 'ab-widget1-b',
      msg: 'B',
      layout: 'slideout'
    });

    var ab = new pathfora.ABTest({
      id: 'ab-1',
      type: '50/50',
      groups: [
        [widgetA],
        [widgetB]
      ]
    });

    pathfora.initializeABTesting([ab]);
    pathfora.initializeWidgets([widgetA, widgetB]);

    var w = $('[id*="ab-widget1"]');
    expect(w.length).toBe(1);
  });

  it('should show all widgets in an A/B test group', function () {
    var widget1A = new pathfora.Message({
      id: 'ab-widget2-1a',
      msg: 'A',
      layout: 'slideout'
    });

    var widget2A = new pathfora.Message({
      id: 'ab-widget2-2a',
      msg: 'A',
      layout: 'slideout'
    });

    var widget1B = new pathfora.Message({
      id: 'ab-widget2-1b',
      msg: 'B',
      layout: 'slideout'
    });

    var widget2B = new pathfora.Message({
      id: 'ab-widget2-2b',
      msg: 'B',
      layout: 'slideout'
    });

    var ab = new pathfora.ABTest({
      id: 'ab-2',
      type: '50/50',
      groups: [
        [widget1A, widget2A],
        [widget1B, widget2B]
      ]
    });

    pathfora.initializeABTesting([ab]);
    pathfora.initializeWidgets([widget1A, widget2A, widget1B, widget2B]);

    var w = $('[id*="ab-widget2"]');
    expect(w.length).toBe(2);

    var first = w.first();
    expect(first.find('.pf-widget-message').text()).toEqual(first.next().find('.pf-widget-message').text());
  });

  it('should show the second group if the cookie value is < 0.5', function () {
    var id = 'ab-3';
    pathfora.utils.saveCookie('PathforaTest_' + id, 0.2164252290967852);

    var widgetA = new pathfora.Message({
      id: 'ab-widget3-a',
      msg: 'A',
      layout: 'modal'
    });

    var widgetB = new pathfora.Message({
      id: 'ab-widget3-b',
      msg: 'B',
      layout: 'modal'
    });

    var ab = new pathfora.ABTest({
      id: id,
      type: '50/50',
      groups: [
        [widgetA],
        [widgetB]
      ]
    });

    pathfora.initializeABTesting([ab]);
    pathfora.initializeWidgets([widgetA, widgetB]);

    var wB = $('#' + widgetB.id),
        wA = $('#' + widgetA.id);
    expect(wB.length).toBe(1);
    expect(wA.length).toBe(0);
  });

  it('should show the first group if the cookie value is > 0.5', function () {
    var id = 'ab-4';
    pathfora.utils.saveCookie('PathforaTest_' + id, 0.7077720651868731);

    var widgetA = new pathfora.Message({
      id: 'ab-widget4-a',
      msg: 'A',
      layout: 'modal'
    });

    var widgetB = new pathfora.Message({
      id: 'ab-widget4-b',
      msg: 'B',
      layout: 'modal'
    });

    var ab = new pathfora.ABTest({
      id: id,
      type: '50/50',
      groups: [
        [widgetA],
        [widgetB]
      ]
    });

    pathfora.initializeABTesting([ab]);
    pathfora.initializeWidgets([widgetA, widgetB]);

    var wB = $('#' + widgetB.id),
        wA = $('#' + widgetA.id);

    expect(wA.length).toBe(1);
    expect(wB.length).toBe(0);
  });

  it('should allow multiple A/B tests per page', function () {
    var widgetA = new pathfora.Message({
      id: 'ab-widget5-a',
      msg: 'A',
      layout: 'modal'
    });

    var widgetB = new pathfora.Message({
      id: 'ab-widget5-b',
      msg: 'B',
      layout: 'modal'
    });

    var ab = new pathfora.ABTest({
      id: 'ab-5',
      type: '50/50',
      groups: [
        [widgetA],
        [widgetB]
      ]
    });

    var widgetC = new pathfora.Message({
      id: 'ab-widget6-c',
      msg: 'C',
      layout: 'modal'
    });

    var widgetD = new pathfora.Message({
      id: 'ab-widget6-d',
      msg: 'D',
      layout: 'modal'
    });

    var ab2 = new pathfora.ABTest({
      id: 'ab-6',
      type: '50/50',
      groups: [
        [widgetC],
        [widgetD]
      ]
    });

    pathfora.initializeABTesting([ab, ab2]);
    pathfora.initializeWidgets([widgetA, widgetB, widgetC, widgetD]);

    var w = $('[id*="ab-widget"]'),
        w5 = $('[id*="ab-widget5"]'),
        w6 = $('[id*="ab-widget6"]');

    expect(w.length).toBe(2);
    expect(w5.length).toBe(1);
    expect(w6.length).toBe(1);
  });

  it('should handle A/B Tests in conjunction with audience targeting', function () {
    window.lio = {
      data: {
        segments: ['all', 'smt_new']
      }
    };

    window.lio.loaded = true;

    var widgetA = new pathfora.Message({
      id: 'ab-widget10-a',
      layout: 'slideout',
      msg: 'A'
    });

    var widgetB = new pathfora.Message({
      id: 'ab-widget10-b',
      layout: 'slideout',
      msg: 'B'
    });

    var ab = new pathfora.ABTest({
      id: 'ab-10',
      type: '50/50',
      groups: [
        [widgetA],
        [widgetB]
      ]
    });

    var widgets = {
      target: [{
        segment: 'smt_new',
        widgets: [widgetA, widgetB]
      }]
    };

    pathfora.initializeABTesting([ab]);
    pathfora.initializeWidgets(widgets);

    var w = $('[id*="ab-widget10"]');
    expect(w.length).toBe(1);
  });

  it('should support the old cookie naming convention for A/B tests', function () {
    var id = 'ab-7';
    pathfora.utils.saveCookie('187ef4436122d1cc2f40dc2b92f0eba0' + id, 0.8982240918558091);

    var widgetA = new pathfora.Message({
      id: 'ab-widget7-a',
      msg: 'A',
      layout: 'slideout'
    });

    var widgetB = new pathfora.Message({
      id: 'ab-widget7-b',
      msg: 'B',
      layout: 'slideout'
    });

    var ab = new pathfora.ABTest({
      id: 'ab-7',
      type: '50/50',
      groups: [
        [widgetA],
        [widgetB]
      ]
    });

    pathfora.initializeABTesting([ab]);
    pathfora.initializeWidgets([widgetA, widgetB]);

    var wA = $('#' + widgetA.id),
        wB = $('#' + widgetB.id);

    expect(wA.length).toBe(1);
    expect(wB.length).toBe(0);
  });

  it('should support "80/20" A/B test type', function () {
    var id = 'ab-11';
    pathfora.utils.saveCookie('PathforaTest_' + id, 0.7077720651868731);

    var widget = new pathfora.Message({
      id: 'ab-widget11-a',
      msg: 'A',
      layout: 'slideout'
    });

    var ab = new pathfora.ABTest({
      id: 'ab-11',
      type: '80/20',
      groups: [
        [],
        [widget]
      ]
    });

    pathfora.initializeABTesting([ab]);
    pathfora.initializeWidgets([widget]);

    var w = $('#' + widget.id);
    expect(w.length).toBe(1);
  });

  it('should not allow a widget to be used in more than one A/B test', function () {
    var widgetA = new pathfora.Message({
      id: 'ab-widget8-a',
      msg: 'A',
      layout: 'slideout'
    });

    var ab = new pathfora.ABTest({
      id: 'ab-7',
      type: '50/50',
      groups: [
        [widgetA],
        []
      ]
    });

    var ab2 = new pathfora.ABTest({
      id: 'ab-8',
      type: '50/50',
      groups: [
        [widgetA],
        []
      ]
    });

    expect(function () {
      pathfora.initializeABTesting([ab, ab2]);
    }).toThrow(new Error('Widget #' + widgetA.id + ' is defined in more than one AB test.'));
  });

  it('should not allow a widget to be used in more than one A/B test', function () {
    var widgetA = new pathfora.Message({
      id: 'ab-widget9-a',
      msg: 'A',
      layout: 'slideout'
    });

    var widgetB = new pathfora.Message({
      id: 'ab-widget9-b',
      msg: 'B',
      layout: 'slideout'
    });

    var ab = new pathfora.ABTest({
      id: 'ab-9',
      type: '50/50',
      groups: [
        [widgetA],
        []
      ]
    });

    var ab2 = new pathfora.ABTest({
      id: 'ab-9',
      type: '50/50',
      groups: [
        [widgetB],
        []
      ]
    });

    expect(function () {
      pathfora.initializeABTesting([ab, ab2]);
    }).toThrow(new Error('AB test with ID=' + ab.id + ' has been already defined.'));
  });

  // -------------------------
  // IGNORED
  // -------------------------

  xit('should throw error when trying to initialize widget with wrong layout value', function () {
    var brokenLayoutVal = new pathfora.Message({
      msg: 'Broken layout value test',
      layout: 'broken'
    });

    expect(function () {
      pathfora.initializeWidgets([brokenLayoutVal]);
    }).toThrow(new Error('Invalid widget layout value'));
  });

  xit('should be able to display widget only on specific page scrolling value', function (done) {
    $(document.body).append('<div id=\'height-element\' style=\'height:10000px; display:block;\'>Test</div>');

    var form = new pathfora.Subscription({
      msg: 'test',
      id: 'scroll-test',
      layout: 'slideout',
      displayConditions: {
        scrollPercentageToDisplay: 20
      }
    });

    pathfora.initializeWidgets([form]);

    setTimeout(function () {
      expect($('#' + form.id).length).toBe(0);

      var height = $(document).height();
      $('body').scrollTop(height / 2);

      setTimeout(function () {
        expect($('#' + form.id).length).toBe(1);
        done();
      }, 200);
    }, 200);

    $('#height-element').remove();
  });

  xit('should be able to display widget only if user can see specific DOM element', function () {
    throw 'pass';
  });

  // future functionalities
  xit('should keep number of page visits for later use', function () {
    var messageBar = new pathfora.Message({
      position: 'bottom-fixed',
      msg: 'hello new user'
    });

    // new user
    localStorage.clear();
    pathfora.initializeWidgets([messageBar]);

    var visitedPage = pathfora.getData().pageViews;
    pathfora.clearAll();

    expect(visitedPage).toBe(1);

    pathfora.initializeWidgets([messageBar]);

    visitedPage = pathfora.getData().pageViews;
    pathfora.clearAll();
    expect(visitedPage).toBe(2);
  });
});

// -------------------------
//  WIDGET TESTS
// -------------------------

describe('Widgets', function () {
  beforeEach(function () {
    localStorage.clear();
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
  //  CONTENT RECOMMENDATIONS
  // -------------------------

  it('should show recommendations returned from the api and default content if there is an error', function (done) {
    jasmine.Ajax.install();

    window.lio = {
      account: {
        id: 0
      },
      loaded: true
    };

    var modal = new pathfora.Message({
      id: 'recommendation-modal',
      msg: 'A',
      variant: 3,
      layout: 'modal',
      recommend: {
        ql: {
          raw: 'FILTER AND(url LIKE \"www.example.com/*\") FROM content'
        }
      }
    });

    var defaultModal = new pathfora.Message({
      id: 'recommendation-modal2',
      msg: 'A',
      variant: 3,
      layout: 'modal',
      content: [
        {
          default: true,
          url: 'http://www.example.com/2',
          title: 'Default Title',
          description: 'Default description',
          image: 'http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg'
        }
      ],
      recommend: {
        ql: {
          raw: '*'
        }
      }
    });

    // Should show default
    pathfora.initializeWidgets([defaultModal]);
    expect(jasmine.Ajax.requests.mostRecent().url).toBe('//api.lytics.io/api/content/recommend/0/user/_uids/123?ql=*');

    jasmine.Ajax.requests.mostRecent().respondWith({
      'status': 400,
      'contentType': 'application/json',
      'responseText': '{"data": null,"message": "No such account id","status": 400}'
    });

    pathfora.acctid = credentials;

    // Should get and show api response
    pathfora.initializeWidgets([modal]);
    expect(jasmine.Ajax.requests.mostRecent().url).toBe('//api.lytics.io/api/content/recommend/123/user/_uids/123?ql=FILTER AND(url LIKE "www.example.com/*") FROM content');

    jasmine.Ajax.requests.mostRecent().respondWith({
      'status': 200,
      'contentType': 'application/json',
      'responseText': '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
    });

    var widget = $('#' + modal.id);
    var widget2 = $('#' + defaultModal.id);
    expect(widget).toBeDefined();
    expect(widget2).toBeDefined();

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      expect(widget2.hasClass('opened')).toBeTruthy();

      var href = widget.find('.pf-content-unit').attr('href'),
          desc = widget.find('.pf-content-unit p').text(),
          img = widget.find('.pf-content-unit-img').css('background-image'),
          title = widget.find('.pf-content-unit h4').text();

      expect(title).toBe('Example Title');
      expect(href).toBe('http://www.example.com/1');
      expect(desc).toBe('An example description');
      expect(img).toBe('url(http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg)');

      href = widget2.find('.pf-content-unit').attr('href');
      desc = widget2.find('.pf-content-unit p').text();
      img = widget2.find('.pf-content-unit-img').css('background-image');
      title = widget2.find('.pf-content-unit h4').text();

      expect(title).toBe('Default Title');
      expect(href).toBe('http://www.example.com/2');
      expect(desc).toBe('Default description');
      expect(img).toBe('url(http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg)');

      pathfora.clearAll();
      pathfora.acctid = '';
      done();
    }, 200);

    jasmine.Ajax.uninstall();
  });

  it('should throw errors if default content is improperly defined', function (done) {
    jasmine.Ajax.install();

    window.lio = {
      account: {
        id: 0
      },
      loaded: true
    };

    var errorModal = new pathfora.Message({
      id: 'recommendation-modal4',
      msg: 'A',
      variant: 3,
      layout: 'modal',
      recommend: {
        ql: {
          raw: '*'
        }
      }
    });

    var errorModal2 = new pathfora.Message({
      id: 'recommendation-modal5',
      msg: 'A',
      variant: 3,
      layout: 'button',
      recommend: {
        ql: {
          raw: '*'
        }
      }
    });

    var errorModal3 = new pathfora.Message({
      id: 'recommendation-modal6',
      msg: 'A',
      variant: 3,
      layout: 'slideout',
      recommend: {
        ql: {
          raw: '*'
        }
      },
      content: [
        {
          url: 'http://www.example.com/2',
          title: 'Default Title',
          description: 'Default description',
          image: 'http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg'
        }
      ]
    });

    // Should error since there is no default defined
    expect(function () {
      pathfora.initializeWidgets([errorModal]);
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('//api.lytics.io/api/content/recommend/0/user/_uids/123?ql=*');

      jasmine.Ajax.requests.mostRecent().respondWith({
        'status': 400,
        'contentType': 'application/json',
        'responseText': '{"data": null,"message": "No such account id","status": 400}'
      });
    }).toThrow(new Error('Could not get recommendation and no default defined'));

    pathfora.acctid = credentials;

    expect(function () {
      pathfora.initializeWidgets([errorModal2]);
    }).toThrow(new Error('Unsupported layout for content recommendation'));

    expect(function () {
      pathfora.initializeWidgets([errorModal3]);
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('//api.lytics.io/api/content/recommend/123/user/_uids/123?ql=*');

      jasmine.Ajax.requests.mostRecent().respondWith({
        'status': 200,
        'contentType': 'application/json',
        'responseText': '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
      });
    }).toThrow(new Error('Cannot define recommended content unless it is a default'));

    setTimeout(function () {
      done();
    }, 200);

    pathfora.acctid = '';
    jasmine.Ajax.uninstall();
  });

  it('should accept segment AST definition', function (done) {
    jasmine.Ajax.install();
    window.lio = {
      account: {
        id: 0
      },
      loaded: true
    };

    var astModal = new pathfora.Message({
      id: 'ast-modal',
      msg: 'A',
      variant: 3,
      layout: 'modal',
      recommend: {
        ast: {
          args: [
            {
              ident: 'author'
            }
          ],
          op: 'exists'
        }
      }
    });

    pathfora.initializeWidgets([astModal]);
    expect(jasmine.Ajax.requests.mostRecent().url).toBe('//api.lytics.io/api/content/recommend/0/user/_uids/123?contentsegments=[%7B%22table%22%3A%22content%22%2C%22ast%22%3A%7B%22args%22%3A%5B%7B%22ident%22%3A%22author%22%7D%5D%2C%22op%22%3A%22exists%22%7D%7D]');

    jasmine.Ajax.requests.mostRecent().respondWith({
      'status': 200,
      'contentType': 'application/json',
      'responseText': '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
    });

    var widget = $('#' + astModal.id);
    expect(widget).toBeDefined();
    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      done();
    }, 200);

    pathfora.acctid = '';
    jasmine.Ajax.uninstall();
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

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      expect(widget.hasClass('success')).toBeTruthy();

      done();
    }, 3000);

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
  //  CUSTOM FIELDS
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
  //  GATE
  // -------------------------

  it('should open gate when the cookie is not set', function (done) {
    var gate = new pathfora.SiteGate({
      headline: 'Blocking Widget',
      id: 'sitegate-widget-1',
      msg: 'Submit this widget to access the website.'
    });

    pathfora.initializeWidgets([gate]);

    var widget = $('#' + gate.id);

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      done();
    }, 200);
  });

  it('should not gate when the cookie is already set', function (done) {
    var gate = new pathfora.SiteGate({
      headline: 'Blocking Widget',
      id: 'sitegate-widget-2',
      msg: 'Submit this widget to access the website.'
    });

    pathfora.utils.saveCookie('PathforaUnlocked_' + gate.id, true);

    pathfora.initializeWidgets([gate]);

    var widget = $('#' + gate.id);

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeFalsy();
      done();
    }, 200);
  });

  // -------------------------
  //  DISPLAY CONDITIONS
  // -------------------------

  it('should show when all manualTrigger widgets are triggered', function () {
    var customWidget = new pathfora.Message({
      msg: 'custom trigger test',
      id: 'custom-widget',
      layout: 'modal',
      displayConditions: {
        manualTrigger: true
      }
    });

    var customWidget2 = new pathfora.Message({
      msg: 'custom trigger test2',
      id: 'custom-widget2',
      layout: 'modal',
      displayConditions: {
        manualTrigger: true
      }
    });

    pathfora.initializeWidgets([customWidget, customWidget2]);
    var widget1 = $('#' + customWidget.id);
    var widget2 = $('#' + customWidget2.id);
    expect(widget1.length).toBe(0);
    expect(widget2.length).toBe(0);

    pathfora.triggerWidgets();

    widget1 = $('#' + customWidget.id);
    widget2 = $('#' + customWidget2.id);
    expect(widget1.length).toBe(1);
    expect(widget2.length).toBe(1);
  });

  it('should show all manualTrigger widgets on initialization if they have already been triggered', function () {
    var customWidget3 = new pathfora.Message({
      msg: 'custom trigger test3',
      id: 'custom-widget3',
      layout: 'modal',
      displayConditions: {
        manualTrigger: true
      }
    });

    pathfora.triggerWidgets();
    pathfora.initializeWidgets([customWidget3]);
    var widget = $('#' + customWidget3.id);
    expect(widget.length).toBe(1);


    var customWidget4 = new pathfora.Message({
      msg: 'custom trigger test4',
      id: 'custom-widget4',
      layout: 'modal',
      displayConditions: {
        manualTrigger: true
      }
    });

    pathfora.initializeWidgets([customWidget4]);
    widget = $('#' + customWidget4.id);
    expect(widget.length).toBe(1);
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

    pathfora.initializeWidgets([delayedWidget]);
    var widget = $('#' + delayedWidget.id);

    jasmine.clock().tick(1000);
    expect(widget[0]).toBeUndefined();

    jasmine.clock().tick(2000);
    expect($('#' + delayedWidget.id)[0]).toBeDefined();

    jasmine.clock().uninstall();
  });

  it('should not show when page views requirement has not been reached', function () {
    var form = new pathfora.Form({
      msg: 'subscription',
      id: 'page-view-widget-1',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        pageVisits: 1
      }
    });

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  it('should show when page views requirement has been reached', function () {
    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      id: 'page-view-widget-2',
      layout: 'slideout',
      position: 'right',
      displayConditions: {
        pageVisits: 0
      }
    });

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(1);
  });

  it('should if after start_date', function () {
    var limitDate = new Date();
    limitDate.setDate(14);
    limitDate.setMonth(1);
    limitDate.setFullYear(2016);

    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      id: 'date-widget-1',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        date: {
          'start_at': limitDate.toISOString()
        }
      }
    });

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(1);
  });

  it('should not show if after end_date', function () {
    var limitDate = new Date();
    limitDate.setDate(14);
    limitDate.setMonth(1);
    limitDate.setFullYear(2016);

    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      id: 'date-widget-2',
      position: 'bottom-right',
      displayConditions: {
        date: {
          'end_at': limitDate.toISOString()
        }
      }
    });

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  it('should not show if hideAfterAction duration not met', function () {
    var widgetId = 'hideAfterActionWidget1';
    pathfora.utils.saveCookie('PathforaClosed_' + widgetId, '1|' + Date.now());

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

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  it('should show if hideAfterAction duration met', function () {
    var widgetId = 'hideAfterActionWidget2';
    pathfora.utils.saveCookie('PathforaConfirm_' + widgetId, '1|' + Date.now());

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

    setTimeout(function () {
      pathfora.initializeWidgets([form]);

      var widget = $('#' + form.id);
      expect(widget.length).toBe(1);
    }, 3000);
  });

  it('should not show if hideAfterAction count not met', function () {
    var widgetId = 'hideAfterActionWidget3';
    pathfora.utils.saveCookie('PathforaCancel_' + widgetId, '2|' + Date.now());

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
    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  it('should show if hideAfterAction count not met', function () {
    var widgetId = 'hideAfterActionWidget4';
    pathfora.utils.saveCookie('PathforaConfirm_' + widgetId, '2|' + Date.now());

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

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(1);
  });

  // NOTE Retain support for cookies with comma - can remove on 5/2/2016
  it('should accept and parse hideAfterAction cookies with comma values', function () {
    var widgetId = 'hideAfterActionComma';
    pathfora.utils.saveCookie('PathforaConfirm_' + widgetId, '2,' + Date.now());
    pathfora.utils.saveCookie('PathforaCancel_' + widgetId, '1,' + Date.now());
    pathfora.utils.saveCookie('PathforaClosed_' + widgetId, '1,' + Date.now());

    var form = new pathfora.Form({
      id: widgetId,
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        hideAfterAction: {
          confirm: {
            hideCount: 3,
            duration: 1440
          },
          cancel: {
            hideCount: 1
          },
          closed: {
            duration: 30
          }
        }
      }
    });

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  it('should show if before limited amount of impressions', function () {
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

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(1);
  });

  it('should not show if after limited amount of impressions', function () {
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

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  it('should show if impression buffer met', function () {
    var widgetId = 'impressionWidget3';
    pathfora.utils.saveCookie('PathforaImpressions_' + widgetId, '2|' + Date.now());

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

    setTimeout(function () {
      pathfora.initializeWidgets([form]);

      var widget = $('#' + form.id);
      expect(widget.length).toBe(1);
    }, 3000);
  });

  it('should not show if impression buffer not met', function () {
    var widgetId = 'impressionWidget3';
    pathfora.utils.saveCookie('PathforaImpressions_' + widgetId, '2|' + Date.now());

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

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  // NOTE Retain support for cookies with comma - can remove on 5/2/2016
  it('should accept and parse impression cookies with comma values', function () {
    var widgetId = 'impressionComma';
    pathfora.utils.saveCookie('PathforaImpressions_' + widgetId, '2,' + Date.now());

    var form = new pathfora.Form({
      id: widgetId,
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        impressions: {
          total: 2
        }
      }
    });

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  it('should show when the url matches the display conditions', function () {
    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      id: 'url-widget-1',
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
      id: 'url-widget-2',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          '*'
        ]
      }
    });

    pathfora.initializeWidgets([form, form2]);

    var widget = $('#' + form.id),
        widget2 = $('#' + form2.id);
    expect(widget.length).toBe(1);
    expect(widget2.length).toBe(1);
  });

  it('should not show when the url doesn\'t match the display conditions', function () {
    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      id: 'url-widget-3',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          'notlocalhost'
        ]
      }
    });

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  it('should show respect excluded matching rule', function () {
    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      id: 'exclude-widget',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'exact',
            value: 'http://localhost:9876/context.html'
          },
          {
            match: 'exact',
            value: 'bad'
          },
          {
            match: 'exact',
            value: 'http://localhost:9876/context.html',
            exclude: true
          },
          {
            match: 'exact',
            value: 'bad',
            exclude: true
          }
        ]
      }
    });

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });

  it('should show using simple match', function () {
    var form1 = new pathfora.Form({
      id: '88ee86cf72b44e67bf758cc743ac1a5d',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'simple',
            value: 'localhost/context.html'
          }
        ]
      }
    });

    var form2 = new pathfora.Form({
      id: 'a793b7352c3346e493573a6827be7815',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'simple',
            value: 'localhost/context'
          }
        ]
      }
    });

    pathfora.initializeWidgets([form1, form2]);

    var widget = $('#' + form1.id);
    expect(widget.length).toBe(1);

    widget = $('#' + form2.id);
    expect(widget.length).toBe(0);
  });

  it('should show using exact match', function () {
    var form1 = new pathfora.Form({
      id: 'e71c5416ac7345bcba8c5330d14c4a2e',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'exact',
            value: 'http://localhost:9876/context.html'
          }
        ]
      }
    });

    var form2 = new pathfora.Form({
      id: '3ef7653e7f5f4889a0f2f860a679639a',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'exact',
            value: 'http://localhost/context.html'
          }
        ]
      }
    });
    pathfora.initializeWidgets([form1, form2]);

    var widget = $('#' + form1.id);
    expect(widget.length).toBe(1);

    widget = $('#' + form2.id);
    expect(widget.length).toBe(0);
  });

  it('should show using string match', function () {
    var form1 = new pathfora.Form({
      id: '3044aae3e5ad463fbd868a626a7998ca',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'string',
            value: '/context'
          }
        ]
      }
    });

    var form2 = new pathfora.Form({
      id: 'd66ec2855d284cb2b6ce3edd3c756a1b',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'string',
            value: '/bonktext'
          }
        ]
      }
    });

    var form3 = new pathfora.Form({
      id: 'f3ededaa19fd4301b066b4da5758e16a',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'imfakeandshouldefault',
            value: '/context'
          }
        ]
      }
    });

    pathfora.initializeWidgets([form1, form2, form3]);

    var widget = $('#' + form1.id);
    expect(widget.length).toBe(1);

    widget = $('#' + form2.id);
    expect(widget.length).toBe(0);

    widget = $('#' + form3.id);
    expect(widget.length).toBe(1);
  });

  it('should show using regex match', function () {
    var form1 = new pathfora.Form({
      id: '87a84e6f0d5d480595eebaf5de76693f',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'regex',
            value: 'context'
          }
        ]
      }
    });
    var form2 = new pathfora.Form({
      id: '3ecbf9717fef4f7c80b2bbc70193ab64',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'regex',
            value: '^http://'
          }
        ]
      }
    });
    var form3 = new pathfora.Form({
      id: 'e9890969538c49d4ba9c7f516215fa61',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'regex',
            value: '^(http|https)+:\/\/+[a-z:]{10}\\d{4}\/con[txe]{4}.html$'
          }
        ]
      }
    });
    var form4 = new pathfora.Form({
      id: 'ad547747786249ae8ba9e1cc3f5b86cf',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'regex',
            value: '^(http|https)+:\/\/+[a-z:]{10}\d{3}\/con[txe]{4}.html$'
          }
        ]
      }
    });
    pathfora.initializeWidgets([form1, form2, form3, form4]);

    var widget = $('#' + form1.id);
    expect(widget.length).toBe(1);

    widget = $('#' + form2.id);
    expect(widget.length).toBe(1);

    widget = $('#' + form3.id);
    expect(widget.length).toBe(1);

    widget = $('#' + form4.id);
    expect(widget.length).toBe(0);
  });

  it('should ignore trailing slashes for the exact match rule', function () {
    window.history.pushState({}, '', '/test/');

    var form1 = new pathfora.Form({
      id: 'e71c5416ac7345bcba8c5330d14c4a2e',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'exact',
            value: 'http://localhost:9876/test'
          }
        ]
      }
    });
    var form2 = new pathfora.Form({
      id: '3ef7653e7f5f4889a0f2f860a679639a',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'exact',
            value: 'http://localhost:9876/test/'
          }
        ]
      }
    });
    pathfora.initializeWidgets([form1, form2]);

    var widget = $('#' + form1.id);
    expect(widget.length).toBe(1);

    widget = $('#' + form2.id);
    expect(widget.length).toBe(1);

    window.history.pushState({}, '', '/context.html');
  });

  it('should ignore order of query params for exact rule', function () {
    window.history.pushState({}, '', '/context.html?bar=2&foo=1');

    var form1 = new pathfora.Form({
      id: 'f41a595548c54321a4e12b613c466159',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'exact',
            value: 'http://localhost:9876/context.html?foo=1&bar=2'
          }
        ]
      }
    });

    var form2 = new pathfora.Form({
      id: 'ef2848a4949d4474b3a5d12ba1017eb7',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'exact',
            value: 'http://localhost:9876/context.html?foo=1'
          }
        ]
      }
    });

    pathfora.initializeWidgets([form1, form2]);

    var widget = $('#' + form1.id);
    expect(widget.length).toBe(1);

    widget = $('#' + form2.id);
    expect(widget.length).toBe(0);

    window.history.pushState({}, '', window.location.pathname);
  });

  it('should ignore "lytics_variation_preview_id" query in comparison', function () {
    window.history.pushState({}, '', '/context.html?bar=2&foo=1&lytics_variation_preview_id=7b26ca56afb84669bba0bf0810ec459f');

    var form1 = new pathfora.Form({
      id: '7b26ca56afb84669bba0bf0810ec459f',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'exact',
            value: 'http://localhost:9876/context.html?foo=1&bar=2'
          }
        ]
      }
    });

    pathfora.initializeWidgets([form1]);

    var widget = $('#' + form1.id);
    expect(widget.length).toBe(1);

    window.history.pushState({}, '', window.location.pathname);
  });

  it('should ignore order of query params and extra params for string rule', function () {
    window.history.pushState({}, '', '/context.html?bar=2&foo=1&baz=3');

    var form1 = new pathfora.Form({
      id: '339f97d11af84630add78cfd39da1105',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'string',
            value: '/context?foo=1&bar=2'
          }
        ]
      }
    });

    var form2 = new pathfora.Form({
      id: 'f8cc3cdf8a1c4532a1ebbc1e7af453b1',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          '/context?foo=1&baz=3'
        ]
      }
    });

    var form3 = new pathfora.Form({
      id: '6372bf4e1acc45d695b45a8656dd19ec',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          '/context?foo=1&bar=4'
        ]
      }
    });

    var form4 = new pathfora.Form({
      id: '9c353546a52843f9868ca1b3a1012f6e',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'string',
            value: '/context?Foo=1'
          }
        ]
      }
    });

    pathfora.initializeWidgets([form1, form2, form3, form4]);

    var widget = $('#' + form1.id);
    expect(widget.length).toBe(1);

    widget = $('#' + form2.id);
    expect(widget.length).toBe(1);

    widget = $('#' + form3.id);
    expect(widget.length).toBe(0);

    widget = $('#' + form4.id);
    expect(widget.length).toBe(0);

    window.history.pushState({}, '', window.location.pathname);
  });

  it('should consider multiple display conditions', function () {
    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      id: 'display-widget-1',
      layout: 'slideout',
      displayConditions: {
        pageVisits: 0,
        urlContains: [
          'google.com'
        ]
      }
    });

    var form2 = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      id: 'display-widget-2',
      layout: 'slideout',
      displayConditions: {
        pageVisits: 5,
        urlContains: [
          '*'
        ]
      }
    });

    var form3 = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      id: 'display-widget-3',
      layout: 'slideout',
      displayConditions: {
        pageVisits: 0,
        urlContains: [
          '*'
        ]
      }
    });

    pathfora.initializeWidgets([form, form2, form3]);

    expect($('#' + form.id).length).toBe(0);
    expect($('#' + form2.id).length).toBe(0);
    expect($('#' + form3.id).length).toBe(1);
  });

  it('should consider multiple display conditions and watchers', function () {
    $(document.body).append('<div id=\'height-element\' style=\'height:10000px; display:block;\'>Test</div>');

    var id = 'multiple-conditions',
        id2 = 'multiple-conditions-2',
        id3 = 'multiple-conditions-3';

    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      id: id,
      displayConditions: {
        impressions: {
          session: 3
        },
        scrollPercentageToDisplay: 20
      }
    });

    var form2 = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      id: id2,
      displayConditions: {
        impressions: {
          session: 1
        },
        scrollPercentageToDisplay: 20
      }
    });

    var form3 = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      id: id3,
      displayConditions: {
        impressions: {
          session: 3
        },
        scrollPercentageToDisplay: 75
      }
    });
    sessionStorage.setItem('PathforaImpressions_' + id, 2);
    sessionStorage.setItem('PathforaImpressions_' + id2, 2);
    sessionStorage.setItem('PathforaImpressions_' + id3, 2);

    pathfora.initializeWidgets([form, form2, form3]);

    setTimeout(function () {
      expect($('#' + id).length).toBe(0);
      expect($('#' + id2).length).toBe(0);
      expect($('#' + id3).length).toBe(0);

      var height = $(document).height();
      $('body').scrollTop(height / 2);

      setTimeout(function () {
        expect($('#' + id).length).toBe(1);
        expect($('#' + id2).length).toBe(0);
        expect($('#' + id3).length).toBe(0);
      }, 200);
    }, 200);

    $('#height-element').remove();
  });

  describe('when showOnExitIntent is set', function () {
    var id = 'exit-intent-test';
    var subscription;

    function moveTo (x, y) {
      var evt = makeMouseEvent('mousemove', {
        clientX: x,
        clientY: y
      });
      document.dispatchEvent(evt);
    }

    function exit () {
      var evt = makeMouseEvent('mouseout', {
        relatedTarget: document.body.parentElement
      });
      document.dispatchEvent(evt);
    }

    beforeEach(function () {
      subscription = new pathfora.Message({
        layout: 'modal',
        id: id,
        headline: "Don't leave yet!",
        msg: 'Please, anything but that.',
        theme: 'dark',
        okMessage: 'Sure, whatever',
        okShow: true,
        displayConditions: {
          showOnExitIntent: true
        }
      });
      pathfora.initializeWidgets([subscription]);
    });

    it('should not show immediately', function () {
      expect($('#' + id).length).toBe(0);
    });

    it('should not be triggered when the mouse exits from the left', function () {
      moveTo(500, 500);
      moveTo(300, 500);
      moveTo(100, 500);
      exit();

      expect($('#' + id).length).toBe(0);
    });

    it('should not be triggered when the mouse exits from the right', function () {
      moveTo(500, 500);
      moveTo(800, 500);
      moveTo(1000, 500);
      exit();

      expect($('#' + id).length).toBe(0);
    });

    it('should not be triggered when the mouse exits from the bottom', function () {
      moveTo(500, 500);
      moveTo(500, 800);
      moveTo(500, 1000);
      exit();

      expect($('#' + id).length).toBe(0);
    });

    it('should not be triggered when the mouse is moving down before exiting, even if exiting near the top of the screen', function () {
      moveTo(500, 10);
      moveTo(800, 20);
      moveTo(1000, 30);
      exit();

      expect($('#' + id).length).toBe(0);
    });

    it('should be triggered when the mouse is moving up and exits from the top', function () {
      moveTo(500, 200);
      moveTo(500, 150);
      moveTo(500, 100);
      moveTo(500, 0);
      exit();

      expect($('#' + id).length).toBe(1);
    });
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


// -------------------------
// API TESTS (IGNORED)
// -------------------------

describe('API', function () {
  beforeEach(function () {
    jasmine.Ajax.install();
  });
  afterEach(function () {
    jasmine.Ajax.uninstall();
  });

  xit('should be able call API with credentials', function () {
    var callback = jasmine.createSpy('success');

    var subscribe = new pathfora.Subscription({
      type: 'bar',
      variant: 'floating',
      msg: 'Signup to get updates right into your inbox'
    });

    pathfora.initializeWidgets([subscribe]);
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

    var subscribe = new pathfora.Subscription({
      type: 'bar',
      variant: 'floating',
      msg: 'Signup to get updates right into your inbox'
    });

    pathfora.initializeWidgets([subscribe]);
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

    var subscribe = new pathfora.Subscription({
      type: 'bar',
      variant: 'floating',
      msg: 'Signup to get updates right into your inbox'
    });

    pathfora.initializeWidgets([subscribe]);

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
});

// -------------------------
// UTIL TESTS
// -------------------------

describe('Utils', function () {
  describe('the escapeURI util', function () {
    var escapeURI = pathfora.utils.escapeURI;

    it('should escape non-URI characters', function () {
      // Most of the character space we care about, un-escaped...
      var unescaped =
        '\x02\n\x1d !\"%\'()*-.0123456789' +
        '<>ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        '[\\]^_`abcdefghijklmnopqrstuvwxyz' +
        '{|}~\x7f\x80\xff';

      // ...and escaped
      var escaped =
        '%02%0A%1D+!%22%25%27()*-.0123456789' +
        '%3C%3EABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        '%5B%5C%5D%5E_%60abcdefghijklmnopqrstuvwxyz' +
        '%7B%7C%7D~%7F%80%FF';

      expect(escapeURI(unescaped, { usePlus: true })).toBe(escaped);
    });

    it('should not escape URI separators', function () {
      var unescaped = 'http://www.getlytics.com/?foo=1&bar=2';

      expect(escapeURI(unescaped)).toBe(unescaped);
    });

    it('should not double-encode URIs', function () {
      var unescaped = 'http://www.getlytics.com/?foo=a b c&bar=d e f',
          escapedOnce = escapeURI(unescaped, { keepEscaped: true }),
          escapedTwice = escapeURI(escapedOnce, { keepEscaped: true });

      expect(escapedTwice).toBe(escapedOnce);
    });
  });

  describe('constructQueries util', function () {
    var constructQueries = pathfora.utils.constructQueries;

    it('should handle single value params', function () {
      var params = {
        key: 'value',
        anotherkey: true,
        athirdkey: 1
      };

      var expected = '?key=value&anotherkey=true&athirdkey=1';

      expect(constructQueries(params)).toEqual(expected);
    });

    it('should handle multiple value params', function () {
      var params = {
        foo: 'value',
        bar: [1, 2, 3],
        baz: ['test']
      };

      var expected = '?foo=value&bar[]=1&bar[]=2&bar[]=3&baz[]=test';

      expect(constructQueries(params)).toEqual(expected);
    });
  });
});


// -------------------------
// INLINE PERSONALIZATION TEST
// -------------------------

describe('Inline Personalization', function () {
  // -------------------------
  // TRIGGER ELEMENTS
  // -------------------------
  describe('pftrigger elements', function () {
    beforeEach(function () {
      window.pathfora.inline.elements = [];
      window.pathfora.acctid = '';
    });

    it('should select to show the first matching element per group', function () {
      window.lio = {
        data: {
          segments: ['all', 'high_value', 'email', 'smt_new']
        },
        loaded: true
      };

      $(document.body).append('<div data-pfgroup="testgrp" data-pftrigger="high_value">High Value</div>' +
        '<div data-pfgroup="testgrp" data-pftrigger="portlanders">Portlander</div>' +
        '<div data-pfgroup="testgrp" data-pftrigger="smt_new">New</div>');

      $(document.body).append('<div data-pfgroup="testgrp2" data-pftrigger="high_momentum">High Momentum</div>' +
        '<div data-pfgroup="testgrp2" data-pftrigger="email">Has Email</div>' +
        '<div data-pfgroup="testgrp2" data-pftrigger="default">Default</div>');

      window.pathfora.inline.procElements();

      var grp1hide = $('[data-pfgroup="testgrp"][data-pftrigger]'),
          grp2hide = $('[data-pfgroup="testgrp2"][data-pftrigger]'),
          grp1show = $('[data-pfgroup="testgrp"][data-pfmodified="true"]'),
          grp2show = $('[data-pfgroup="testgrp2"][data-pfmodified="true"]');

      expect(grp1show.length).toBe(1);
      expect(grp2show.length).toBe(1);
      expect(grp1show.text()).toBe('High Value');
      expect(grp2show.text()).toBe('Has Email');
      expect(grp1show.css('display')).toBe('block');
      expect(grp2show.css('display')).toBe('block');

      expect(grp1hide.length).toBe(2);
      expect(grp2hide.length).toBe(2);
      expect(grp1hide.css('display')).toBe('none');
      expect(grp2hide.css('display')).toBe('none');

      $('[data-pfgroup="testgrp"], [data-pfgroup="testgrp2"]').remove();
    });


    it('should select to show the default if none of the triggers match', function () {
      window.lio = {
        data: {
          segments: ['all', 'email']
        },
        loaded: true
      };

      $(document.body).append('<div data-pfgroup="testgrp" data-pftrigger="high_value">High Value</div>' +
        '<div data-pfgroup="testgrp" data-pftrigger="portlanders">Portlander</div>' +
        '<div data-pfgroup="testgrp" data-pftrigger="default">Default</div>');

      window.pathfora.inline.procElements();

      var def = $('[data-pfmodified="true"]'),
          hidden = $('[data-pftrigger]');

      expect(def.length).toBe(1);
      expect(def.text()).toBe('Default');
      expect(def.css('display')).toBe('block');

      expect(hidden.length).toBe(2);
      expect(hidden.css('display')).toBe('none');

      $('[data-pfgroup="testgrp"]').remove();
    });

    it('should not interfere with pathfora targeting', function () {
      window.lio = {
        data: {
          segments: ['all', 'portlanders', 'email']
        },
        loaded: true
      };

      $(document.body).append('<div data-pfgroup="testgrp" data-pftrigger="high_value">High Value</div>' +
        '<div data-pfgroup="testgrp" data-pftrigger="portlanders">Portlander</div>' +
        '<div data-pfgroup="testgrp" data-pftrigger="email">Has Email</div>');

      var testModule = new pathfora.Message({
        id: '9ec53f71a1514339bb1552280ae76682',
        layout: 'slideout',
        msg: 'show this to people with an email'
      });

      var testModule2 = new pathfora.Message({
        id: 'ba6a6df43f774d769058950969b07a16',
        layout: 'slideout',
        msg: 'show this to people without an email'
      });

      var widgets = {
        target: [{
          segment: 'email',
          widgets: [testModule]
        }],
        inverse: [testModule2]
      };

      pathfora.initializeWidgets(widgets);
      window.pathfora.inline.procElements();

      setTimeout(function () {
        var shown = $('[data-pfmodified="true"]'),
            hidden = $('[data-pftrigger]'),
            w1 = $('#' + testModule.id),
            w2 = $('#' + testModule2.id);

        expect(shown.length).toBe(1);
        expect(shown.text()).toBe('Portlander');
        expect(shown.css('display')).toBe('block');

        expect(hidden.length).toBe(2);
        expect(hidden.css('display')).toBe('none');

        expect(w1.length).toBe(1);
        expect(w2.length).toBe(0);
      }, 200);

      $('[data-pfgroup="testgrp"]').remove();
      pathfora.clearAll();
    });
  });

  // -------------------------
  // RECOMMENDATION ELEMENTS
  // -------------------------
  describe('pfrecommend elements', function () {
    beforeEach(function () {
      pathfora.acctid = credentials;
      pathfora.inline.elements = [];
    });

    it('should fill pftype elements with content recommendation data', function () {
      jasmine.Ajax.install();

      $(document.body).append('<div data-pfblock="group1" data-pfrecommend="my_collection">' +
        '<img data-pftype="image" alt="My Image">' +
        '<a data-pftype="url"><h2 data-pftype="title"></h2></a>' +
        '<p data-pftype="published"></p>' +
        '<p data-pftype="author"></p>' +
        '<p data-pftype="description"></p>' +
        '</div><div data-pfblock="group1" data-pfrecommend="default"></div>');

      pathfora.inline.procElements();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('//api.lytics.io/api/content/recommend/123/user/_uids/123?contentsegment=my_collection');

      jasmine.Ajax.requests.mostRecent().respondWith({
        'status': 200,
        'contentType': 'application/json',
        'responseText': '{"data":[{"url": "www.example.com/1","created": "2013-03-13T06:21:00Z","author": "Test User","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
      });


      var rec = $('[data-pfmodified="true"]'),
          recImage = rec.find('[data-pftype="image"]'),
          recUrl = rec.find('[data-pftype="url"]'),
          recTitle = rec.find('[data-pftype="title"]'),
          recDesc = rec.find('[data-pftype="description"]'),
          recDate = rec.find('[data-pftype="published"]'),
          recAuthor = rec.find('[data-pftype="author"]'),
          def = $('[data-pfrecommend="default"]');

      expect(rec.length).toBe(1);
      expect(rec.css('display')).toBe('block');
      expect(recImage.attr('src')).toBe('http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg');
      expect(recUrl.attr('href')).toBe('http://www.example.com/1');
      expect(recTitle.text()).toBe('Example Title');
      expect(recDesc.text()).toBe('An example description');
      expect(recAuthor.text()).toBe('Test User');

      var date = recDate.text().split('/');
      expect(date.length).toBe(3);
      expect(date[0]).toBe('3');
      expect(date[2]).toBe('2013');

      expect(def.length).toBe(1);
      expect(def.css('display')).toBe('none');

      $('[data-pfblock="group1"]').remove();
      jasmine.Ajax.uninstall();
    });

    it('should show the default content if invalid response from API', function () {
      jasmine.Ajax.install();

      $(document.body).append('<div data-pfblock="group2" data-pfrecommend="bad_collection">' +
        '<img data-pftype="image" alt="My Image">' +
        '<a data-pftype="url"><h2 data-pftype="title"></h2></a>' +
        '<p data-pftype="description"></p>' +
        '</div><div data-pfblock="group2" data-pfrecommend="default"></div>');

      pathfora.inline.procElements();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('//api.lytics.io/api/content/recommend/123/user/_uids/123?contentsegment=bad_collection');

      jasmine.Ajax.requests.mostRecent().respondWith({
        'status': 400,
        'contentType': 'application/json',
        'responseText': '{"data": null,"message": "No such account id","status": 400}'
      });


      var def = $('[data-pfmodified="true"]'),
          bad = $('[data-pfrecommend="bad_collection"]');

      expect(def.length).toBe(1);
      expect(def.css('display')).toBe('block');

      expect(bad.length).toBe(1);
      expect(bad.css('display')).toBe('none');

      $('[data-pfblock="group2"]').remove();
      jasmine.Ajax.uninstall();
    });

    it('should set the background image of a div with pfdatatype image or the innerHtml of a div with pfdatatype url', function () {
      jasmine.Ajax.install();

      $(document.body).append('<div data-pfblock="group3" data-pfrecommend="my_collection">' +
        '<div data-pftype="image"></div>' +
        '<div data-pftype="url"></div></div>');

      pathfora.inline.procElements();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('//api.lytics.io/api/content/recommend/123/user/_uids/123?contentsegment=my_collection');

      jasmine.Ajax.requests.mostRecent().respondWith({
        'status': 200,
        'contentType': 'application/json',
        'responseText': '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
      });


      var rec = $('[data-pfmodified="true"]'),
          recImage = rec.find('[data-pftype="image"]'),
          recUrl = rec.find('[data-pftype="url"]');

      expect(rec.length).toBe(1);
      expect(rec.css('display')).toBe('block');
      expect(recImage.css('background-image')).toBe('url(http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg)');
      expect(recUrl.html()).toBe('http://www.example.com/1');

      $('[data-pfblock="group3"]').remove();
      jasmine.Ajax.uninstall();
    });

    it('should recognize date formatting set by the user', function () {
      jasmine.Ajax.install();

      pathfora.locale = 'en-GB';
      pathfora.dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

      $(document.body).append('<div data-pfblock="group3" data-pfrecommend="my_collection">' +
        '<div data-pftype="image"></div>' +
        '<div data-pftype="published"></div>' +
        '<div data-pftype="url"></div></div>');

      pathfora.inline.procElements();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('//api.lytics.io/api/content/recommend/123/user/_uids/123?contentsegment=my_collection');

      jasmine.Ajax.requests.mostRecent().respondWith({
        'status': 200,
        'contentType': 'application/json',
        'responseText': '{"data":[{"url": "www.example.com/1","title": "Example Title","created": "2016-10-08T01:24:04.23095283Z","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
      });


      var rec = $('[data-pfmodified="true"]'),
          recPublished = rec.find('[data-pftype="published"]');

      expect(rec.length).toBe(1);
      expect(rec.css('display')).toBe('block');

      var date = recPublished.html().split(' ');
      expect(date.length).toBe(4);
      expect(date[2]).toBe('October');
      expect(date[3]).toBe('2016');

      $('[data-pfblock="group3"]').remove();
      jasmine.Ajax.uninstall();
    });

    it('should return docs from the same response for multiple recommendations with the same filter (no repeat docs)', function () {
      jasmine.Ajax.install();

      $(document.body).append('<div data-pfblock="group4" data-pfrecommend="my_collection">' +
        '<a data-pftype="url"><h2 data-pftype="title"></h2></a>' +
        '</div><div data-pfblock="group5" data-pfrecommend="my_collection">' +
        '<h2 data-pftype="title"></h2>' +
        '<div data-pftype="url"></div></div>');

      pathfora.inline.procElements();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('//api.lytics.io/api/content/recommend/123/user/_uids/123?contentsegment=my_collection');

      jasmine.Ajax.requests.mostRecent().respondWith({
        'status': 200,
        'contentType': 'application/json',
        'responseText': '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false},' +
          '{"url": "www.example.com/2","title": "Another Example Title","description": "An second example description","primary_image": "image2.jpg","confidence": 0.23334,"visited": false}]}'
      });


      var recs = $('[data-pfmodified="true"]');
      expect(recs.length).toBe(2);

      var rec1 = $(recs[0]),
          rec1Title = rec1.find('[data-pftype="title"]'),
          rec1Url = rec1.find('[data-pftype="url"]');

      expect(rec1.css('display')).toBe('block');
      expect(rec1Title.text()).toBe('Example Title');
      expect(rec1Url.attr('href')).toBe('http://www.example.com/1');

      var rec2 = $(recs[1]),
          rec2Title = rec2.find('[data-pftype="title"]'),
          rec2Url = rec2.find('[data-pftype="url"]');

      expect(rec2.css('display')).toBe('block');
      expect(rec2Title.text()).toBe('Another Example Title');
      expect(rec2Url.html()).toBe('http://www.example.com/2');

      $('[data-pfblock="group4"], [data-pfblock="group5"]').remove();
      jasmine.Ajax.uninstall();
    });

    it('should not conflict with segment trigger groups', function () {
      jasmine.Ajax.install();

      window.lio = {
        data: {
          segments: ['all', 'high_value', 'email', 'smt_new']
        }
      };

      $(document.body).append('<div data-pfgroup="seg1" data-pftrigger="high_value" data-pfblock="block1" data-pfrecommend="my_collection">' +
        '<a data-pftype="url"><h2 data-pftype="title"></h2></a></div>' +
        '<div data-pfblock="block1" data-pfrecommend="default">default block1</div>' +
        '<div data-pfgroup="seg1" data-pftrigger="default">default seg1</div>');

      pathfora.inline.procElements();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('//api.lytics.io/api/content/recommend/123/user/_uids/123?contentsegment=my_collection');

      jasmine.Ajax.requests.mostRecent().respondWith({
        'status': 200,
        'contentType': 'application/json',
        'responseText': '{"data": null,"message": "No such account id","status": 400}'
      });


      var elems = $('[data-pfmodified="true"]');
      expect(elems.length).toBe(2);

      var elem1 = $(elems[0]);
      expect(elem1.css('display')).toBe('none');
      expect(elem1.attr('data-pfblock')).toBe('block1');
      expect(elem1.attr('data-pfrecommend')).toBe('my_collection');

      var elem2 = $(elems[1]);
      expect(elem2.css('display')).toBe('block');
      expect(elem2.html()).toBe('default block1');

      $('[data-pfgroup="seg1"], [data-pfblock="block1"]').remove();

      $(document.body).append('<div data-pfgroup="seg2" data-pftrigger="blah">in blah seg2</div>' +
        '<div data-pfgroup="seg2" data-pftrigger="high_value">in high_value seg2</div>' +
        '<div data-pfgroup="seg2" data-pftrigger="default" data-pfblock="block2" data-pfrecommend="my_collection">' +
        '<a data-pftype="url"><h2 data-pftype="title"></h2></a></div>');

      pathfora.inline.procElements();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('//api.lytics.io/api/content/recommend/123/user/_uids/123?contentsegment=my_collection');

      jasmine.Ajax.requests.mostRecent().respondWith({
        'status': 200,
        'contentType': 'application/json',
        'responseText': '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
      });


      elems = $('[data-pfmodified="true"]');
      expect(elems.length).toBe(2);

      elem1 = $(elems[0]);
      expect(elem1.css('display')).toBe('block');
      expect(elem1.html()).toBe('in high_value seg2');

      elem2 = $(elems[1]);
      expect(elem2.css('display')).toBe('none');
      expect(elem2.attr('data-pfblock')).toBe('block2');

      $('[data-pfgroup="seg2"], [data-pfblock="block2"]').remove();
      jasmine.Ajax.uninstall();
    });
  });
});
