
'use strict';

var credentials = 123,
    ga = jasmine.createSpy('ga');

var jstag = {
  send: function () {}
};

pathfora.utils.saveCookie('seerid', 123);
pathfora.enableGA = true;

// -------------------------
// PATHFORA TESTS
// -------------------------

describe('Pathfora', function () {
  beforeEach(function () {
    localStorage.clear();
    sessionStorage.clear();
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

    var initialTime = pathfora.getDataObject().timeSpentOnPage;
    jasmine.clock().tick(10000);

    var afterDelay = pathfora.getDataObject().timeSpentOnPage;
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
      expect(pathfora.getDataObject()).not.toEqual(clearDataObject);

      pathfora.clearAll();
      expect(widget.hasClass('opened')).toBeFalsy();
      expect(pathfora.getDataObject()).toEqual(clearDataObject);
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

    var visitedPage = pathfora.getDataObject().pageViews;
    pathfora.clearAll();

    expect(visitedPage).toBe(1);

    pathfora.initializeWidgets([messageBar]);

    visitedPage = pathfora.getDataObject().pageViews;
    pathfora.clearAll();
    expect(visitedPage).toBe(2);
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
    pathfora.api.getWidgetDataObject(subscribe, callback);

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
    pathfora.api.getWidgetDataObject(subscribe, callback);

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

    pathfora.api.getWidgetDataObject(subscribe, function () {
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
