import globalReset from '../utils/global-reset';
import {
  createMessageWidget
} from '../utils/test-helpers';

// -------------------------
//  WIDGET POSITION & INLINE TESTS
// -------------------------
describe('Widgets', function () {
  beforeEach(function () {
    globalReset();
  });

  // -------------------------
  //  POSITION
  // -------------------------

  it('should use default position if no position is specified', function () {
    var w1 = createMessageWidget({
      msg: 'button - default pos test',
      id: 'position-widget-1',
      layout: 'button',
    });

    var w2 = createMessageWidget({
      msg: 'bar - default pos test',
      id: 'position-widget-2',
      layout: 'bar',
    });

    var w3 = createMessageWidget({
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
    var w1 = createMessageWidget({
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
    var w1 = createMessageWidget({
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

    var inline = createMessageWidget({
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
    var inline = createMessageWidget({
      headline: 'Inline Widget',
      layout: 'inline',
      position: '.a-non-existent-div',
      id: 'inline-1',
      msg: 'inline',
    });

    var inlineCustom = createMessageWidget({
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
    var inline = createMessageWidget({
      headline: 'Inline Widget',
      layout: 'inline',
      position: '#a-real-div',
      id: 'inline-1',
      msg: 'inline',
    });

    var inlineCustom = createMessageWidget({
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

});
