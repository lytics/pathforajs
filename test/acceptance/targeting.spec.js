import globalReset from '../utils/global-reset';

// -------------------------
// SEGMENTS
// -------------------------
describe('when targeting users by segment', function () {
  beforeEach(function () {
    globalReset();
  });

  it('should distinguish newcomers, subscribers and common users', function (done) {
    window.lio = {
      data: {
        segments: ['all', 'b'],
      },
      account: {
        id: '0',
      },
    };

    window.lio.loaded = true;

    var messageA = new pathfora.Message({
      id: 'test-bar-01',
      msg: 'A',
      layout: 'modal',
    });

    var messageB = new pathfora.Message({
      id: 'test-bar-02',
      msg: 'B',
      layout: 'modal',
    });

    var messageC = new pathfora.Message({
      id: 'test-bar-03',
      msg: 'C',
      layout: 'modal',
    });

    var messageD = new pathfora.Message({
      id: 'test-bar-04',
      msg: 'D',
      layout: 'modal',
    });

    var widgets = {
      target: [
        {
          segment: 'a',
          widgets: [messageA],
        },
        {
          segment: 'b',
          widgets: [messageB],
        },
        {
          segment: 'c',
          widgets: [messageC],
        },
        {
          segment: '*',
          widgets: [messageD],
        },
      ],
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
      done();
    }, 200);
  });

  it('should properly exclude users when their segment membership matches that of the exclude settings', function (done) {
    window.lio = {
      data: {
        segments: ['a', 'b'],
      },
      account: {
        id: '0',
      },
    };

    window.lio.loaded = true;

    var messageA = new pathfora.Message({
      id: 'test-bar-01',
      msg: 'A',
      layout: 'modal',
    });

    var messageB = new pathfora.Message({
      id: 'test-bar-02',
      msg: 'B',
      layout: 'modal',
    });

    var widgets = {
      target: [
        {
          segment: 'a',
          widgets: [messageA, messageB],
        },
      ],
      exclude: [
        {
          segment: 'b',
          widgets: [messageA],
        },
      ],
    };

    pathfora.initializeWidgets(widgets);

    var widgetA = $('#' + messageA.id),
      widgetB = $('#' + messageB.id);

    expect(widgetB).toBeDefined();

    setTimeout(function () {
      expect(widgetB.hasClass('opened')).toBeTruthy();
      expect(widgetA.length).toBe(0);
      done();
    }, 200);
  });

  it('should properly allow for multiple widgets with different segment targets', function (done) {
    window.lio = {
      data: {
        segments: ['a', 'b'],
      },
      account: {
        id: '0',
      },
    };

    window.lio.loaded = true;

    var messageA = new pathfora.Message({
      id: 'test-slideout-01',
      msg: 'A',
      layout: 'slideout',
    });

    var messageB = new pathfora.Message({
      id: 'test-bar-02',
      msg: 'B',
      layout: 'modal',
    });

    var widgets = {
      target: [
        {
          segment: 'a',
          widgets: [messageA],
        },
        {
          segment: 'b',
          widgets: [messageB],
        },
      ],
    };

    pathfora.initializeWidgets(widgets);

    var widgetA = $('#' + messageA.id),
      widgetB = $('#' + messageB.id);

    expect(widgetA).toBeDefined();
    expect(widgetB).toBeDefined();

    setTimeout(function () {
      expect(widgetA.hasClass('opened')).toBeTruthy();
      expect(widgetB.hasClass('opened')).toBeTruthy();
      done();
    }, 200);
  });
});

// -------------------------
// ATTRIBUTES
// -------------------------
describe('when targeting users by attributes', function () {
  beforeEach(function () {
    globalReset();
  });

  it('should show modal if rule is true, and hide if rule is false', function (done) {
    window.jstag.getEntity = function () {
      return {
        data: {
          user: {
            isTrue: true,
            isFalse: false,
          },
        },
      };
    };
    window.jstag.config.cid = '123';

    var messageA = new pathfora.Message({
      id: 'test-bar-01',
      msg: 'A',
      layout: 'modal',
    });

    var messageB = new pathfora.Message({
      id: 'test-bar-02',
      msg: 'B',
      layout: 'modal',
    });

    var messageC = new pathfora.Message({
      id: 'test-bar-03',
      msg: 'C',
      layout: 'modal',
    });

    var messageD = new pathfora.Message({
      id: 'test-bar-04',
      msg: 'D',
      layout: 'modal',
    });

    var widgets = {
      target: [
        {
          rule: function () {
            return true;
          },
          widgets: [messageA],
        },
        {
          rule: function () {
            return false;
          },
          widgets: [messageB],
        },
        {
          rule: function (data) {
            return data.isTrue;
          },
          widgets: [messageC],
        },
        {
          rule: function (data) {
            return data.isFalse;
          },
          widgets: [messageD],
        },
      ],
    };

    pathfora.initializeWidgets(widgets);

    var a = $('#' + messageA.id);
    var b = $('#' + messageB.id);
    var c = $('#' + messageC.id);
    var d = $('#' + messageD.id);

    setTimeout(function () {
      expect(a.hasClass('opened')).toBeTruthy();
      expect(b.length).toBe(0);
      expect(d.length).toBe(0);
      expect(c.hasClass('opened')).toBeTruthy();
      done();
    }, 200);
  });
});

describe('pathfora helper rule functions', function () {
  beforeEach(function () {
    globalReset();
  });

  describe('inFlowStep', function () {
    it('should return true if the user is in the step', function () {
      var rule = pathfora.rules.inFlowStep('test', 0, 230);
      var data = {
        _flow: {
          'test-0': {
            step: 230,
          },
        },
      };
      expect(rule(data)).toBeTruthy();
    });

    it('should return false otherwise', function () {
      var rule = pathfora.rules.inFlowStep('test', 26, 230);
      var data = {
        _flow: {
          'test-1': {
            step: 230,
          },
        },
      };
      expect(rule(data)).toBeFalsy();
    });
  });

  describe('includes', function () {
    it('should return true value in array', function () {
      var rule = pathfora.rules.includes('channels', 'ads');
      var data = {
        channels: ['ads', 'email', 'social'],
      };
      expect(rule(data)).toBeTruthy();
    });

    it('should return false otherwise', function () {
      var rule = pathfora.rules.includes('channels', 'web');
      var data = {
        channels: ['ads', 'email', 'social'],
      };
      expect(rule(data)).toBeFalsy();
    });
  });

  describe('excludes', function () {
    it('should return false value in array', function () {
      var rule = pathfora.rules.excludes('channels', 'ads');
      var data = {
        channels: ['ads', 'email', 'social'],
      };
      expect(rule(data)).toBeFalsy();
    });

    it('should return false otherwise', function () {
      var rule = pathfora.rules.excludes('channels', 'web');
      var data = {
        channels: ['ads', 'email', 'social'],
      };
      expect(rule(data)).toBeTruthy();
    });
  });

  describe('eq', function () {
    it('should return true if values are equal', function () {
      var rule = pathfora.rules.eq('val', 'one');
      var data = {
        val: 'one',
      };
      expect(rule(data)).toBeTruthy();
    });

    it('should return false otherwise', function () {
      var rule = pathfora.rules.eq('val', 'no');
      var data = {
        val: 'one',
      };
      expect(rule(data)).toBeFalsy();
    });
  });

  describe('notEq', function () {
    it('should return false if values are equal', function () {
      var rule = pathfora.rules.notEq('val', 'one');
      var data = {
        val: 'one',
      };
      expect(rule(data)).toBeFalsy();
    });

    it('should return false otherwise', function () {
      var rule = pathfora.rules.notEq('val', 'no');
      var data = {
        val: 'one',
      };
      expect(rule(data)).toBeTruthy();
    });
  });

  describe('gt', function () {
    it('should return true if value is greater than passed value', function () {
      var rule = pathfora.rules.gt('visitct', 2);
      var data = {
        visitct: '5',
      };
      expect(rule(data)).toBeTruthy();
    });

    it('should return false otherwise', function () {
      var rule = pathfora.rules.gt('visitct', 2);
      var data = {
        visitct: 1,
      };
      expect(rule(data)).toBeFalsy();
    });
  });

  describe('gte', function () {
    it('should return true if value is greater than passed value', function () {
      var rule = pathfora.rules.gte('visitct', 2);
      var data = {
        visitct: '5',
      };
      expect(rule(data)).toBeTruthy();
    });

    it('should return true if value is equal to the passed value', function () {
      var rule = pathfora.rules.gte('visitct', 5);
      var data = {
        visitct: '5',
      };
      expect(rule(data)).toBeTruthy();
    });

    it('should return false otherwise', function () {
      var rule = pathfora.rules.gte('visitct', 2);
      var data = {
        visitct: 1,
      };
      expect(rule(data)).toBeFalsy();
    });
  });

  describe('lt', function () {
    it('should return true if value is less than passed value', function () {
      var rule = pathfora.rules.lt('visitct', 5);
      var data = {
        visitct: '2',
      };
      expect(rule(data)).toBeTruthy();
    });

    it('should return false otherwise', function () {
      var rule = pathfora.rules.lt('visitct', 2);
      var data = {
        visitct: 5,
      };
      expect(rule(data)).toBeFalsy();
    });
  });

  describe('lte', function () {
    it('should return true if value is less than passed value', function () {
      var rule = pathfora.rules.lte('visitct', 5);
      var data = {
        visitct: '2',
      };
      expect(rule(data)).toBeTruthy();
    });

    it('should return true if value is equal to the passed value', function () {
      var rule = pathfora.rules.lte('visitct', 5);
      var data = {
        visitct: '5',
      };
      expect(rule(data)).toBeTruthy();
    });

    it('should return false otherwise', function () {
      var rule = pathfora.rules.lte('visitct', 1);
      var data = {
        visitct: 2,
      };
      expect(rule(data)).toBeFalsy();
    });
  });
});
