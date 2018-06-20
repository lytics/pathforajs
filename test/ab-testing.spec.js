// -------------------------
// A/B TESTING
// -------------------------
describe('when performing AB testing', function() {
  beforeEach(function() {
    pathfora.clearAll();
  });

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
      },
      account: {
        id: '0'
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
});
