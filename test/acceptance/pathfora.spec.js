'use strict';

//Globals
var credentials = 123,
    ga = {
      getAll: function () {}
    };


var jstag = {
  send: function () {}
};

pathfora.utils.saveCookie('seerid', 123);
pathfora.enableGA = false;

function createAndDispatchKeydown (key, target) {
  var eventObj = document.createEvent('Event');
  eventObj.initEvent('keydown', false, false);
  eventObj.which = key;
  eventObj.keyCode = key;
  target.dispatchEvent(eventObj);
}

// -------------------------
// PATHFORA TESTS
// -------------------------

describe('Pathfora', function () {
  beforeEach(function () {
    localStorage.clear();
    sessionStorage.clear();
    pathfora.clearAll();
  });

  it('should keep focus during a tab cycle in a modal or site gate', function (done) {
    var modal = new pathfora.Message({
      msg: 'msg',
      id: 'tab-cycle-test',
      layout: 'modal',
      okMessage: 'woot'
    });

    pathfora.initializeWidgets([modal]);

    setTimeout(function () {
      var widget = $('#' + modal.id),
          ok = widget.find('.pf-widget-ok');

      widget.appendTo(document.body);
      expect(widget.hasClass('opened')).toBe(true);
      ok.focus();

      createAndDispatchKeydown(9, document.activeElement);
      expect(widget.get(0).contains(document.activeElement)).toBe(true);
      createAndDispatchKeydown(9, document.activeElement);
      expect(widget.get(0).contains(document.activeElement)).toBe(true);
      createAndDispatchKeydown(9, document.activeElement);
      expect(widget.get(0).contains(document.activeElement)).toBe(true);
      createAndDispatchKeydown(9, document.activeElement);
      expect(widget.get(0).contains(document.activeElement)).toBe(true);
      done();
    }, 200);
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
    $(document.body).append(
      "<div id='height-element' style='height:10000px; display:block;'>Test</div>"
    );

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
      status: 200,
      contentType: 'text/plain',
      responseText: '{"response":"ok"}'
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
      status: 200,
      contentType: 'text/plain',
      responseText: '{"response":"ok"}'
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

    pathfora.api.getWidgetDataObject(subscribe, function () {}, callback);

    expect(callback).not.toHaveBeenCalled();
    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 401,
      contentType: 'text/plain',
      responseText: '{"response":"error"}'
    });

    expect(callback).toHaveBeenCalledWith('{"response":"error"}');
  });
});
