import createAndDispatchKeydown from '../utils/create-and-dispatch-keydown.js';
import globalReset from '../utils/global-reset';

('use strict');

// -------------------------
// PATHFORA TESTS
// -------------------------

describe('Pathfora', function () {
  beforeEach(function () {
    globalReset();
  });

  it('should keep focus during a tab cycle in a modal or site gate', function (done) {
    var modal = new pathfora.Message({
      msg: 'msg',
      id: 'tab-cycle-test',
      layout: 'modal',
      okMessage: 'woot',
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

  describe('clearAll', function () {
    it('should clear delayed widgets', function () {
      jasmine.clock().install();
      var delayedWidget = new pathfora.Message({
        msg: 'Delayed clear test',
        id: 'delayed-widget-clear',
        layout: 'modal',
        displayConditions: {
          showDelay: 1,
        },
      });

      var delayedWidget2 = new pathfora.Message({
        msg: 'Delayed clear test',
        id: 'delayed-widget-clear2',
        layout: 'modal',
        displayConditions: {
          showDelay: 2,
        },
      });

      var delayedWidget3 = new pathfora.Message({
        msg: 'Delayed clear test',
        id: 'delayed-widget-clear3',
        layout: 'modal',
        displayConditions: {
          showDelay: 4,
        },
      });

      pathfora.initializeWidgets([
        delayedWidget,
        delayedWidget2,
        delayedWidget3,
      ]);
      pathfora.clearAll();

      jasmine.clock().tick(4000);
      var widget = $('#' + delayedWidget.id);
      var widget2 = $('#' + delayedWidget2.id);
      var widget3 = $('#' + delayedWidget3.id);

      expect(widget[0]).toBeUndefined();
      expect(widget2[0]).toBeUndefined();
      expect(widget3[0]).toBeUndefined();

      jasmine.clock().uninstall();
    });

    describe('event handlers', function () {
      it('should remove window-bound scroll event handlers', function () {
        var addEventListenerSpy = spyOn(window, 'addEventListener');
        var removeEventListenerSpy = spyOn(window, 'removeEventListener');

        var scrollWidget = new pathfora.Subscription({
          msg: 'Fake scroll widget',
          id: 'fake-scroll-widget',
          displayConditions: {
            scrollPercentageToDisplay: 20,
          },
        });

        pathfora.initializeWidgets([scrollWidget]);

        expect(addEventListenerSpy).toHaveBeenCalledWith(
          'scroll',
          jasmine.any(Function)
        );

        pathfora.clearAll();

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
          'scroll',
          jasmine.any(Function)
        );
      });

      it('should remove document-bound mouse(move|out) event handlers', function () {
        var addEventListenerSpy = spyOn(document, 'addEventListener');
        var removeEventListenerSpy = spyOn(document, 'removeEventListener');

        var exitIntentWidget = new pathfora.Subscription({
          msg: 'Fake exit-intent widget',
          id: 'fake-exit-intent-widget',
          displayConditions: {
            showOnExitIntent: true,
          },
        });

        pathfora.initializeWidgets([exitIntentWidget]);

        expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
        expect(document.addEventListener.calls.argsFor(0)).toEqual([
          'mousemove',
          jasmine.any(Function),
        ]);
        expect(document.addEventListener.calls.argsFor(1)).toEqual([
          'mouseout',
          jasmine.any(Function),
        ]);

        pathfora.clearAll();

        expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
        expect(document.removeEventListener.calls.argsFor(0)).toEqual([
          'mousemove',
          jasmine.any(Function),
        ]);
        expect(document.removeEventListener.calls.argsFor(1)).toEqual([
          'mouseout',
          jasmine.any(Function),
        ]);
      });
    });
  });
});
