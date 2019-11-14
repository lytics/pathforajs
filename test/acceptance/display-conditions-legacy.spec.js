import globalReset from '../utils/global-reset';

// -------------------------
//  DISPLAY CONDITIONS LEGACY
// -------------------------
describe('when setting display conditions', function () {
  beforeEach(function () {
    globalReset();
  });

  it('should show if before limited amount of impressions', function () {
    var widgetId = 'legacyImpressionWidget1';
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
    var widgetId = 'legacyImpressionWidget2';
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
    var widgetId = 'legacyImpressionWidget3';
    pathfora.utils.write(
      'PathforaImpressions_' + widgetId,
      '2|' + Date.now()
    );

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
    var widgetId = 'legacyImpressionWidget3';
    pathfora.utils.write(
      'PathforaImpressions_' + widgetId,
      '2|' + Date.now()
    );

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
    pathfora.utils.write(
      'PathforaImpressions_' + widgetId,
      '2,' + Date.now()
    );

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

  it('should consider multiple display conditions and watchers', function (done) {
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
        manualTrigger: true
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
        manualTrigger: true
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
        manualTrigger: true
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

      pathfora.triggerWidgets([id, id2]);

      setTimeout(function () {
        expect($('#' + id).length).toBe(1);
        expect($('#' + id2).length).toBe(0);
        expect($('#' + id3).length).toBe(0);
        done();
      }, 200);
    }, 200);
  });

  // NOTE Retain support for cookies with comma - can remove on 5/2/2016
  it('should accept and parse hideAfterAction records with comma values', function () {
    var widgetId = 'hideAfterActionComma';
    pathfora.utils.write('PathforaConfirm_' + widgetId, '2,' + Date.now());
    pathfora.utils.write('PathforaCancel_' + widgetId, '1,' + Date.now());
    pathfora.utils.write('PathforaClosed_' + widgetId, '1,' + Date.now());

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

  // NOTE Retain support for cookies with comma - can remove on 5/2/2016
  it('should accept and parse impression cookies with comma values', function () {
    var widgetId = 'impressionComma';
    pathfora.utils.write(
      'PathforaImpressions_' + widgetId,
      '2,' + Date.now()
    );

    var form = new pathfora.Form({
      id: widgetId,
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        impressions: {
          widget: {
            total: 2
          }
        }
      }
    });

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(0);
  });
});
