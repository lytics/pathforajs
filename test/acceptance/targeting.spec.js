import resetLegacyTag from '../utils/reset-legacy-tag';

// -------------------------
// TARGETING
// -------------------------
describe('when targeting users', function () {
  beforeEach(function () {
    resetLegacyTag();
    pathfora.clearAll();
  });

  it('should distinguish newcomers, subscribers and common users', function (done) {
    window.lio = {
      data: {
        segments: ['all', 'b']
      },
      account: {
        id: '0'
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
      target: [
        {
          segment: 'a',
          widgets: [messageA]
        },
        {
          segment: 'b',
          widgets: [messageB]
        },
        {
          segment: 'c',
          widgets: [messageC]
        },
        {
          segment: '*',
          widgets: [messageD]
        }
      ]
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
      },
      account: {
        id: '0'
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
      target: [
        {
          segment: 'a',
          widgets: [messageA, messageB]
        }
      ],
      exclude: [
        {
          segment: 'b',
          widgets: [messageA]
        }
      ]
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
      },
      account: {
        id: '0'
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
});
