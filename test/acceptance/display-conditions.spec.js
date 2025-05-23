import globalReset from '../utils/global-reset';

// -------------------------
//  DISPLAY CONDITIONS
// -------------------------
function makeMouseEvent(type, params) {
  var evt;
  try {
    evt = new MouseEvent(type, params);
  } catch (e) {
    evt = document.createEvent('MouseEvents');
    params = params || {};
    evt.initMouseEvent(
      type,
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

describe('when setting display conditions', function () {
  beforeEach(function () {
    globalReset();
  });

  it('should consider scrollPercentagetoDisplay', function (done) {
    $(document.body).css('height', '4000px');
    $(document.body).append(
      "<div id='height-element' style='height:800px; display:block;'>Test</div>"
    );
    var height = $(document.body).height();
    window.scroll(0, height);

    var subscription = new pathfora.Message({
      layout: 'modal',
      id: 'scrollModal',
      headline: 'Heyyyy!',
      msg: 'You have scrolled far, nice work.',
      okMessage: 'Sure, whatever',
      okShow: true,
      displayConditions: {
        scrollPercentageToDisplay: 50,
      },
    });
    pathfora.initializeWidgets([subscription]);

    var widget = $('#' + subscription.id);
    expect(widget.length).toBe(0);

    setTimeout(function () {
      widget = $('#' + subscription.id);
      expect(widget.length).toBe(1);

      $('#height-element').remove();
      done();
    }, 200);
  });

  it('should correctly calculate scroll percentage when scroll offset cannot be greater than scroll position', function (done) {
    $(document.body).css('height', '4000px');
    $(document.body).append(
      "<div id='height-element' style='height:800px; display:block;'>Test</div>"
    );

    var subscription = new pathfora.Message({
      layout: 'modal',
      id: 'scrollModal',
      headline: 'Heyyyy!',
      msg: 'You have scrolled far, nice work.',
      okMessage: 'Sure, whatever',
      okShow: true,
      displayConditions: {
        scrollPercentageToDisplay: 30,
      },
    });
    pathfora.initializeWidgets([subscription]);

    var widget = $('#' + subscription.id);
    expect(widget.length).toBe(0);

    var height = $(document.body).height();
    window.scroll(0, height / 2);

    setTimeout(function () {
      widget = $('#' + subscription.id);
      expect(widget.length).toBe(1);

      $('#height-element').remove();
      done();
    }, 100);
  });

  it('should show when all manualTrigger widgets are triggered', function () {
    var customWidget = new pathfora.Message({
      msg: 'custom trigger test',
      id: 'custom-widget',
      layout: 'modal',
      displayConditions: {
        manualTrigger: true,
      },
    });

    var customWidget2 = new pathfora.Message({
      msg: 'custom trigger test2',
      id: 'custom-widget2',
      layout: 'modal',
      displayConditions: {
        manualTrigger: true,
      },
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

    pathfora.clearAll();
  });

  it('should show all manualTrigger widgets on initialization if they have already been triggered', function () {
    var customWidget3 = new pathfora.Message({
      msg: 'custom trigger test3',
      id: 'custom-widget3',
      layout: 'modal',
      displayConditions: {
        manualTrigger: true,
      },
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
        manualTrigger: true,
      },
    });

    pathfora.initializeWidgets([customWidget4]);
    widget = $('#' + customWidget4.id);
    expect(widget.length).toBe(1);

    pathfora.clearAll();
  });

  it('should be able to show after specified time', function () {
    jasmine.clock().install();
    var delayedWidget = new pathfora.Message({
      msg: 'Delayed widget test',
      id: 'delayed-widget',
      layout: 'modal',
      displayConditions: {
        showDelay: 2,
      },
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
    pathfora.utils.saveCookie('PathforaPageView', 0);
    var form = new pathfora.Form({
      msg: 'subscription',
      id: 'page-view-widget-1',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        pageVisits: 1,
      },
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
        pageVisits: 0,
      },
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
          start_at: limitDate.toISOString(),
        },
      },
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
          end_at: limitDate.toISOString(),
        },
      },
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
            duration: 60,
          },
        },
      },
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
            duration: 2,
          },
        },
      },
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
            hideCount: 2,
          },
        },
      },
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
            hideCount: 5,
          },
        },
      },
    });

    pathfora.initializeWidgets([form]);

    var widget = $('#' + form.id);
    expect(widget.length).toBe(1);
  });

  describe('impressions displayCondition', function () {
    describe('widget level impressions', function () {
      describe('with the session count set', function () {
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
                widget: {
                  session: 1,
                  total: 5,
                },
              },
            },
          });

          pathfora.initializeWidgets([form]);

          var widget = $('#' + form.id);
          expect(widget.length).toBe(1);
        });

        it('should show if impression buffer met', function () {
          var widgetId = 'impressionWidget3';
          pathfora.utils.saveCookie(
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
                widget: {
                  session: 3,
                  buffer: 2,
                },
              },
            },
          });

          setTimeout(function () {
            pathfora.initializeWidgets([form]);

            var widget = $('#' + form.id);
            expect(widget.length).toBe(1);
          }, 3000);
        });

        it('should not show if impression buffer not met', function () {
          var widgetId = 'impressionWidget3';
          pathfora.utils.saveCookie(
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
                widget: {
                  session: 3,
                  buffer: 60,
                },
              },
            },
          });

          pathfora.initializeWidgets([form]);

          var widget = $('#' + form.id);
          expect(widget.length).toBe(0);
        });
      });

      describe('with the total and session count set', function () {
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
                widget: {
                  session: 1,
                  total: 5,
                },
              },
            },
          });

          pathfora.initializeWidgets([form]);

          var widget = $('#' + form.id);
          expect(widget.length).toBe(0);
        });
      });
    });

    describe('global level impressions', function () {
      describe('with the session count set', function () {
        it('should show if before limited amount of global impressions', function () {
          var widgetId = 'impressionWidget1';
          sessionStorage.setItem('PathforaImpressions_AnotherWidget', 0);
          sessionStorage.setItem('PathforaImpressions_' + widgetId, 0);

          var form = new pathfora.Form({
            id: widgetId,
            msg: 'subscription',
            headline: 'Header',
            layout: 'slideout',
            position: 'bottom-right',
            displayConditions: {
              impressions: {
                global: {
                  session: 1,
                },
              },
            },
          });

          pathfora.initializeWidgets([form]);

          var widget = $('#' + form.id);
          expect(widget.length).toBe(1);
        });

        it('should not show if after limited amount of global impressions', function () {
          var widgetId = 'impressionWidget2';
          sessionStorage.setItem('PathforaImpressions_a' + widgetId, 2);
          sessionStorage.setItem('PathforaImpressions_b' + widgetId, 2);
          sessionStorage.setItem('PathforaImpressions_c' + widgetId, 2);

          var form = new pathfora.Form({
            id: widgetId,
            msg: 'subscription',
            headline: 'Header',
            layout: 'slideout',
            position: 'bottom-right',
            displayConditions: {
              impressions: {
                global: {
                  session: 4,
                },
              },
            },
          });

          pathfora.initializeWidgets([form]);

          var widget = $('#' + form.id);
          expect(widget.length).toBe(0);
        });
      });

      describe('with the total count set', function () {
        var m1id = 'm1-id',
          m2id = 'm2-id',
          m1,
          m2;

        beforeEach(function () {
          m1 = new pathfora.Form({
            id: m1id,
            msg: 'modal 1',
            layout: 'slideout',
            position: 'bottom-right',
            displayConditions: {
              impressions: {
                global: {
                  total: 3,
                },
              },
            },
          });

          m2 = new pathfora.Form({
            id: m2id,
            msg: 'modal 2',
            layout: 'slideout',
            position: 'bottom-left',
          });
        });

        afterEach(function () {
          globalReset();
        });

        it('should show if before limited amount of global impressions', function () {
          var now = Date.now();
          pathfora.utils.write(
            'PathforaImpressions_' + m2id,
            '1|' + (now - 3000),
            m2.expiration
          );

          pathfora.initializeWidgets([m1, m2]);
          expect($('#' + m1.id).length).toBe(1);
          expect($('#' + m2.id).length).toBe(1);
        });

        it('should not show if after limited amount of global impressions', function () {
          var now = Date.now();
          pathfora.utils.write(
            'PathforaImpressions_' + m2id,
            '1|' + (now - 3000),
            m2.expiration
          );
          pathfora.utils.write(
            'PathforaImpressions_' + m1id,
            '3|' + (now - 3000),
            m1.expiration
          );

          pathfora.initializeWidgets([m1, m2]);
          expect($('#' + m1.id).length).toBe(0);
          expect($('#' + m2.id).length).toBe(1);
        });
      });

      describe('with the total count set and duration set', function () {
        var m1id = 'm1-id',
          m2id = 'm2-id',
          m1,
          m2;

        beforeEach(function () {
          m1 = new pathfora.Form({
            id: m1id,
            msg: 'modal 1',
            layout: 'slideout',
            position: 'bottom-right',
            displayConditions: {
              impressions: {
                global: {
                  total: 3,
                  duration: 60,
                },
              },
            },
          });

          m2 = new pathfora.Form({
            id: m2id,
            msg: 'modal 2',
            layout: 'slideout',
            position: 'bottom-left',
          });
        });

        afterEach(function () {
          globalReset();
        });

        it('should set and update the since cookie value if duration is set', function () {
          pathfora.initializeWidgets([m1, m2]);

          expect($('#' + m1.id).length).toBe(1);
          expect($('#' + m2.id).length).toBe(1);

          expect(
            pathfora.utils.read('PathforaTotalImpressionsSince_' + m1.id)
          ).toContain('2|');
        });

        it('should increment the cookie value if duration is set', function () {
          var now = Date.now();
          pathfora.utils.write(
            'PathforaTotalImpressionsSince_' + m1.id,
            '2|' + (now - 30 * 1000),
            m1.expiration
          );

          pathfora.initializeWidgets([m1, m2]);

          expect($('#' + m1.id).length).toBe(1);
          expect($('#' + m2.id).length).toBe(1);

          expect(
            pathfora.utils.read('PathforaTotalImpressionsSince_' + m1.id)
          ).toContain('4|');
        });

        it('should show if before the duration and total is not met', function () {
          var now = Date.now();
          pathfora.utils.write(
            'PathforaTotalImpressionsSince_' + m1.id,
            '1|' + (now - 30 * 1000),
            m1.expiration
          );

          pathfora.initializeWidgets([m1, m2]);
          expect($('#' + m1.id).length).toBe(1);
          expect($('#' + m2.id).length).toBe(1);
        });

        it('should not show if before the duration and total met', function () {
          var now = Date.now();
          pathfora.utils.write(
            'PathforaTotalImpressionsSince_' + m1.id,
            '5|' + (now - 30 * 1000),
            m1.expiration
          );

          pathfora.initializeWidgets([m1, m2]);
          expect($('#' + m1.id).length).toBe(0);
          expect($('#' + m2.id).length).toBe(1);
        });

        it('should show if past the duration and reset the since cookie value', function () {
          var now = Date.now();
          pathfora.utils.write(
            'PathforaTotalImpressionsSince_' + m1.id,
            '5|' + (now - 65 * 1000),
            m1.expiration
          );

          pathfora.initializeWidgets([m1, m2]);
          expect($('#' + m1.id).length).toBe(1);
          expect($('#' + m2.id).length).toBe(1);

          expect(
            pathfora.utils.read('PathforaTotalImpressionsSince_' + m1.id)
          ).toContain('2|');
        });
      });
    });
  });

  it('should show when the url matches the display conditions', function () {
    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      id: 'url-widget-1',
      position: 'bottom-right',
      displayConditions: {
        urlContains: ['localhost'],
      },
    });

    var form2 = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      id: 'url-widget-2',
      position: 'bottom-right',
      displayConditions: {
        urlContains: ['*'],
      },
    });

    pathfora.initializeWidgets([form, form2]);

    var widget = $('#' + form.id),
      widget2 = $('#' + form2.id);
    expect(widget.length).toBe(1);
    expect(widget2.length).toBe(1);
  });

  it("should not show when the url doesn't match the display conditions", function () {
    var form = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      id: 'url-widget-3',
      position: 'bottom-right',
      displayConditions: {
        urlContains: ['notlocalhost'],
      },
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
            value: 'http://localhost:9876/context.html',
          },
          {
            match: 'exact',
            value: 'bad',
          },
          {
            match: 'exact',
            value: 'http://localhost:9876/context.html',
            exclude: true,
          },
          {
            match: 'exact',
            value: 'bad',
            exclude: true,
          },
        ],
      },
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
            value: 'localhost/context.html',
          },
        ],
      },
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
            value: 'localhost/context',
          },
        ],
      },
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
            value: 'http://localhost:9876/context.html',
          },
        ],
      },
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
            value: 'http://localhost/context.html',
          },
        ],
      },
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
            value: '/context',
          },
        ],
      },
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
            value: '/bonktext',
          },
        ],
      },
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
            value: '/context',
          },
        ],
      },
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
            value: 'context',
          },
        ],
      },
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
            value: '^http://',
          },
        ],
      },
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
            value: '^(http|https)+://+[a-z:]{10}\\d{4}/con[txe]{4}.html$',
          },
        ],
      },
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
            value: '^(http|https)+://+[a-z:]{10}d{3}/con[txe]{4}.html$',
          },
        ],
      },
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
            value: 'http://localhost:9876/test',
          },
        ],
      },
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
            value: 'http://localhost:9876/test/',
          },
        ],
      },
    });
    pathfora.initializeWidgets([form1, form2]);

    var widget = $('#' + form1.id);
    expect(widget.length).toBe(1);

    widget = $('#' + form2.id);
    expect(widget.length).toBe(1);

    window.history.pushState({}, '', '/context.html');
  });

  it('should ignore trailing slashes in the simple match rule', function () {
    window.history.pushState({}, '', '/test/');

    var form1 = new pathfora.Form({
      id: 'simple-match1',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'simple',
            value: 'localhost/test',
          },
        ],
      },
    });

    var form2 = new pathfora.Form({
      id: 'simple-match2',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: [
          {
            match: 'simple',
            value: 'localhost/test/',
          },
        ],
      },
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
            value: 'http://localhost:9876/context.html?foo=1&bar=2',
          },
        ],
      },
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
            value: 'http://localhost:9876/context.html?foo=1',
          },
        ],
      },
    });

    pathfora.initializeWidgets([form1, form2]);

    var widget = $('#' + form1.id);
    expect(widget.length).toBe(1);

    widget = $('#' + form2.id);
    expect(widget.length).toBe(0);

    window.history.pushState({}, '', window.location.pathname);
  });

  it('should not ignore "?" if there are no queries', function () {
    window.history.pushState({}, '', '/context.html');

    var queryTest1 = new pathfora.Form({
      id: 'query-test1',
      headline: 'Header',
      layout: 'slideout',
      displayConditions: {
        urlContains: [
          {
            match: 'exact',
            value: 'http://localhost:9876/context.html?',
          },
          {
            match: 'exact',
            value: 'http://localhost:9876/context.html/?',
          },
        ],
      },
    });

    var queryTest2 = new pathfora.Form({
      id: 'query-test2',
      headline: 'Header',
      layout: 'slideout',
      displayConditions: {
        urlContains: [
          {
            match: 'substring',
            value: 'context.html?',
          },
          {
            match: 'exact',
            value: 'context.html/?',
          },
        ],
      },
    });

    pathfora.initializeWidgets([queryTest1, queryTest2]);

    var widget = $('#' + queryTest1.id);
    expect(widget.length).toBe(0);

    widget = $('#' + queryTest2.id);
    expect(widget.length).toBe(0);
  });

  it('should ignore "lytics_variation_preview_id" query in comparison', function () {
    window.history.pushState(
      {},
      '',
      '/context.html?bar=2&foo=1&lytics_variation_preview_id=7b26ca56afb84669bba0bf0810ec459f'
    );

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
            value: 'http://localhost:9876/context.html?foo=1&bar=2',
          },
        ],
      },
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
            value: '/context?foo=1&bar=2',
          },
        ],
      },
    });

    var form2 = new pathfora.Form({
      id: 'f8cc3cdf8a1c4532a1ebbc1e7af453b1',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: ['/context?foo=1&baz=3'],
      },
    });

    var form3 = new pathfora.Form({
      id: '6372bf4e1acc45d695b45a8656dd19ec',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      position: 'bottom-right',
      displayConditions: {
        urlContains: ['/context?foo=1&bar=4'],
      },
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
            value: '/context?Foo=1',
          },
        ],
      },
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
        urlContains: ['google.com'],
      },
    });

    var form2 = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      id: 'display-widget-2',
      layout: 'slideout',
      displayConditions: {
        pageVisits: 5,
        urlContains: ['*'],
      },
    });

    var form3 = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      id: 'display-widget-3',
      layout: 'slideout',
      displayConditions: {
        pageVisits: 0,
        urlContains: ['*'],
      },
    });

    pathfora.initializeWidgets([form, form2, form3]);

    expect($('#' + form.id).length).toBe(0);
    expect($('#' + form2.id).length).toBe(0);
    expect($('#' + form3.id).length).toBe(1);
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
          widget: {
            session: 3,
          },
        },
        manualTrigger: true,
      },
    });

    var form2 = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      id: id2,
      displayConditions: {
        impressions: {
          widget: {
            session: 1,
          },
        },
        manualTrigger: true,
      },
    });

    var form3 = new pathfora.Form({
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      id: id3,
      displayConditions: {
        impressions: {
          widget: {
            session: 3,
          },
        },
        manualTrigger: true,
      },
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

  describe('when showOnExitIntent is set', function () {
    var id = 'exit-intent-test';
    var subscription;

    function moveTo(x, y) {
      var evt = makeMouseEvent('mousemove', {
        clientX: x,
        clientY: y,
      });
      document.dispatchEvent(evt);
    }

    function exit() {
      var evt = makeMouseEvent('mouseout', {
        relatedTarget: document.body.parentElement,
      });
      document.dispatchEvent(evt);
    }

    describe('by itself', function () {
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
            showOnExitIntent: true,
          },
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

    describe('with scrollPercentageToDisplay', function () {
      beforeEach(function () {
        $(document.body).css('height', '4000px');
        $(document.body).append(
          "<div id='height-element' style='height:800px; display:block;'>Test</div>"
        );

        window.scroll(0, 0);

        subscription = new pathfora.Message({
          layout: 'modal',
          id: id,
          headline: "Don't leave yet!",
          msg: 'Please, anything but that.',
          theme: 'dark',
          okMessage: 'Sure, whatever',
          okShow: true,
          displayConditions: {
            scrollPercentageToDisplay: 50,
            showOnExitIntent: true,
          },
        });
        pathfora.initializeWidgets([subscription]);
      });

      afterEach(function () {
        $('#height-element').remove();
      });

      it('should not be triggered until all display conditions are met (exitIntent)', function () {
        moveTo(500, 200);
        moveTo(500, 150);
        moveTo(500, 100);
        moveTo(500, 0);
        exit();

        expect($('#' + id).length).toBe(0);
      });

      it('should not be triggered until all display conditions are met (scroll)', function () {
        var height = $(document.body).height();
        window.scroll(0, height);
        expect($('#' + id).length).toBe(0);
      });

      it('should show once all watcher conditions are met', function () {
        var height = $(document.body).height();
        window.scroll(0, height);

        moveTo(500, 200);
        moveTo(500, 150);
        moveTo(500, 100);
        moveTo(500, 0);
        exit();

        expect($('#' + id).length).toBe(1);
      });
    });
  });

  describe('when metaContains is set', function () {
    var id = 'meta-contains-test';
    var modal;

    beforeEach(function () {
      modal = new pathfora.Message({
        layout: 'modal',
        id: id,
        headline: 'This will show...',
        msg: '... if your meta tags match the conditions',
        displayConditions: {
          metaContains: [
            {
              property: 'og:type',
              content: 'product',
            },
            {
              property: 'og:locale',
              content: 'en_US',
            },
          ],
        },
      });
    });

    it('should not show if the meta rules are not met', function () {
      pathfora.initializeWidgets([modal]);
      expect($('#' + id).length).toBe(0);
    });

    it('should show if a single meta rule is met', function () {
      $('head').append('<meta property="og:type" content="product">');
      $('head').append(
        '<meta name="description" content="cool description here">'
      );
      pathfora.initializeWidgets([modal]);
      expect($('#' + id).length).toBe(1);
      $('meta').remove();
    });

    it('should show if both rules are met', function () {
      $('head').append('<meta property="og:type" content="product">');
      $('head').append('<meta property="og:locale" content="en_US">');
      pathfora.initializeWidgets([modal]);
      expect($('#' + id).length).toBe(1);
      $('meta').remove();
    });
  });
});
