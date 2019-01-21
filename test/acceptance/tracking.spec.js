// -------------------------
// TRACKING
// -------------------------
describe('the tracking component', function () {
  beforeEach(function () {
    var gaInstances = [
      { 
        get: function(field) {
          if (field === 'name') {
            return 'gtm1';
          }
        } 
      },
      {
        get: function(field) {
          if (field === 'name') {
            return 'gtm2';
          }
        } 
      }
    ];

    localStorage.clear();
    sessionStorage.clear();
    pathfora.clearAll();
    spyOn(window, 'ga');
    spyOn(ga, 'getAll').and.returnValue(gaInstances);
    pathfora.enableGA = true;
  });

  afterEach(function() {
    pathfora.enableGA = false;
  });

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

    var completedActions = pathfora.getDataObject().completedActions.length;
    var closedWidgets = pathfora.getDataObject().closedWidgets.length;
    expect(completedActions).toBe(0);
    expect(closedWidgets).toBe(0);

    $('#' + messageBar.id)
      .find('.pf-widget-ok')
      .click();
    $('#' + messageModal.id)
      .find('.pf-widget-close')
      .click();

    completedActions = pathfora.getDataObject().completedActions.length;
    closedWidgets = pathfora.getDataObject().closedWidgets.length;
    expect(completedActions).toBe(1);
    expect(closedWidgets).toBe(1);
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

  it("should report displaying widgets and it's variants", function () {
    jasmine.Ajax.install();

    var messageBar = new pathfora.Message({
      layout: 'modal',
      msg: 'Message bar - reporting test',
      id: 'modal-display-report'
    });

    spyOn(jstag, 'send');

    pathfora.initializeWidgets([messageBar]);

    expect(jstag.send).toHaveBeenCalledWith(
      jasmine.objectContaining({
        'pf-widget-id': messageBar.id,
        'pf-widget-type': 'message',
        'pf-widget-layout': 'modal',
        'pf-widget-variant': '1',
        'pf-widget-event': 'show'
      })
    );

    expect(ga).toHaveBeenCalledWith(
      'gtm1.send',
      'event',
      'Lytics',
      messageBar.id + ' : show',
      jasmine.any(String),
      jasmine.any(Object)
    );

    expect(ga).toHaveBeenCalledWith(
      'gtm2.send',
      'event',
      'Lytics',
      messageBar.id + ' : show',
      jasmine.any(String),
      jasmine.any(Object)
    );

    pathfora.clearAll();
    jasmine.Ajax.uninstall();
  });

  it("should report closing widgets and it's variants", function () {
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

    expect(jstag.send).toHaveBeenCalledWith(
      jasmine.objectContaining({
        'pf-widget-id': messageBar.id,
        'pf-widget-type': 'message',
        'pf-widget-layout': 'modal',
        'pf-widget-variant': '1',
        'pf-widget-event': 'close'
      })
    );

    expect(ga).toHaveBeenCalledWith(
      'gtm1.send',
      'event',
      'Lytics',
      messageBar.id + ' : close',
      jasmine.any(String),
      jasmine.any(Object)
    );

    expect(ga).toHaveBeenCalledWith(
      'gtm2.send',
      'event',
      'Lytics',
      messageBar.id + ' : close',
      jasmine.any(String),
      jasmine.any(Object)
    );

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

      expect(jstag.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          'pf-widget-action': 'action test'
        })
      );
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

      expect(jstag.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          'pf-widget-action': 'cancel reporting test',
          'pf-widget-event': 'cancel'
        })
      );
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

    expect(jstag.send).toHaveBeenCalledWith(
      jasmine.objectContaining({
        'pf-widget-id': messageBar.id,
        'pf-widget-type': 'message',
        'pf-widget-layout': 'modal',
        'pf-widget-variant': '1',
        'pf-widget-event': 'close'
      })
    );
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
      expect(ga).toHaveBeenCalledWith(
        'gtm1.send',
        'event',
        'Lytics',
        messageBar.id + ' : ' + messageBar.confirmAction.name,
        jasmine.any(String),
        jasmine.any(Object)
      );
      expect(ga).toHaveBeenCalledWith(
        'gtm2.send',
        'event',
        'Lytics',
        messageBar.id + ' : ' + messageBar.confirmAction.name,
        jasmine.any(String),
        jasmine.any(Object)
      );
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

      widget
        .find('.pf-widget-ok')
        .mouseenter()
        .mouseleave();
      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          'pf-widget-action': 'confirm',
          'pf-widget-event': 'hover'
        })
      );

      widget
        .find('.pf-widget-cancel')
        .mouseenter()
        .mouseleave();
      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          'pf-widget-action': 'cancel',
          'pf-widget-event': 'hover'
        })
      );

      widget
        .find('.pf-widget-close')
        .mouseenter()
        .mouseleave();
      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          'pf-widget-action': 'close',
          'pf-widget-event': 'hover'
        })
      );

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

      expect(jstag.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          'pf-widget-action': 'username',
          'pf-widget-event': 'focus'
        })
      );

      form.find('[name="email"]').focus();
      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          'pf-widget-action': 'email',
          'pf-widget-event': 'focus'
        })
      );

      form.find('[name="message"]').focus();
      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          'pf-widget-action': 'message',
          'pf-widget-event': 'focus'
        })
      );

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

      form
        .find('[name="username"]')
        .val('a')
        .change();

      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          'pf-widget-action': 'username',
          'pf-widget-event': 'form_start'
        })
      );

      form
        .find('[name="email"]')
        .val('a')
        .change();

      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          'pf-widget-action': 'email',
          'pf-widget-event': 'form_start'
        })
      );

      form
        .find('[name="message"]')
        .val('a')
        .change();

      expect(jstag.send).toHaveBeenCalled();

      expect(jstag.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          'pf-widget-action': 'message',
          'pf-widget-event': 'form_start'
        })
      );

      done();
    }, 200);

    jasmine.Ajax.uninstall();
  });
});
