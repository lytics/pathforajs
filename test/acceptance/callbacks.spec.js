import globalReset from '../utils/global-reset';
import { createMessageWidget, createFormWidget } from '../utils/test-helpers';

describe('callbacks', function () {
  beforeEach(function () {
    globalReset();
  });

  it('should trigger after pressing action button', function () {
    var modal = createMessageWidget({
      id: 'confirm-action-test',
      layout: 'modal',
      msg: 'Confirm action test modal',
      confirmAction: {
        name: 'Test confirm action',
        callback: function () {
          alert('test confirmation');
        },
      },
    });

    pathfora.initializeWidgets([modal]);

    var widget = $('#confirm-action-test');
    spyOn(modal.confirmAction, 'callback');
    expect(modal.confirmAction.callback).not.toHaveBeenCalled();
    widget.find('.pf-widget-ok').click();
    expect(modal.confirmAction.callback).toHaveBeenCalled();
  });

  it('should trigger after pressing action with form data.', function () {
    var modal = createFormWidget({
      id: 'confirm-action-form-test',
      layout: 'modal',
      msg: 'Confirm action test modal',
      confirmAction: {
        callback: function () {
          alert('test confirmation');
        },
      },
    });

    pathfora.initializeWidgets([modal]);

    var widget = $('#' + modal.id);
    widget.find('input[name="username"]').val('test name');
    widget.find('input[name="email"]').val('test@example.com');
    spyOn(modal.confirmAction, 'callback');
    expect(modal.confirmAction.callback).not.toHaveBeenCalled();
    widget.find('.pf-widget-ok').click();
    expect(modal.confirmAction.callback).toHaveBeenCalledWith(
      'modalConfirm',
      jasmine.objectContaining({
        data: [
          { name: 'username', value: 'test name' },
          { name: 'email', value: 'test@example.com' },
          { name: 'title', value: '' },
          { name: 'message', value: '' },
        ],
      })
    );
  });

  it('should trigger after pressing action with custom form data.', function () {
    var modal = createFormWidget({
      id: 'custom-confirm-action-test',
      layout: 'modal',
      msg: 'Confirm action test modal',
      formElements: [
        {
          type: 'text',
          required: true,
          label: 'Email Address',
          name: 'email',
        },
        {
          type: 'checkbox-group',
          required: true,
          label: 'Which feeds would you like to subscribe to?',
          name: 'subscription_feeds',
          values: [
            {
              label: 'Beauty & Perfumes',
              value: 'beauty',
            },
            {
              label: 'Electronics',
              value: 'electronics',
            },
            {
              label: 'Fashion',
              value: 'fashion',
            },
          ],
        },
      ],
      confirmAction: {
        callback: function () {
          alert('test confirmation');
        },
      },
    });

    pathfora.initializeWidgets([modal]);

    var widget = $('#' + modal.id);
    widget.find('input[name="email"]').val('test@example.com');
    widget.find('input[name="subscription_feeds"]')[2].checked = true;
    spyOn(modal.confirmAction, 'callback');
    expect(modal.confirmAction.callback).not.toHaveBeenCalled();
    widget.find('.pf-widget-ok').click();
    expect(modal.confirmAction.callback).toHaveBeenCalledWith(
      'modalConfirm',
      jasmine.objectContaining({
        data: [
          { name: 'email', value: 'test@example.com' },
          { name: 'subscription_feeds', value: 'fashion' },
        ],
      })
    );
  });

  it('should not close the modal on a button action if specified', function (done) {
    var modal = createMessageWidget({
      id: 'confirm-close-action-test',
      layout: 'modal',
      msg: 'Confirm action test modal',
      confirmAction: {
        name: 'Test confirm action',
        close: false,
        callback: function () {
          // do something
        },
      },
      cancelAction: {
        close: false,
      },
    });

    pathfora.initializeWidgets([modal]);

    setTimeout(function () {
      var widget = $('#' + modal.id);
      expect(widget).toBeDefined();
      expect(widget.hasClass('opened')).toBeTruthy();

      setTimeout(function () {
        widget.find('.pf-widget-ok').click();
        widget.find('.pf-widget-cancel').click();
        expect(widget).toBeDefined();
        expect(widget.hasClass('opened')).toBeTruthy();
        done();
      }, 300);
    }, 300);
  });

  it('should be able to trigger action on cancel', function () {
    var modal = createMessageWidget({
      id: 'cancel-action-test',
      layout: 'modal',
      msg: 'Welcome to our website',
      cancelAction: {
        name: 'Test cancel action',
        callback: function () {
          alert('test cancel');
        },
      },
    });

    pathfora.initializeWidgets([modal]);

    var widget = $('#cancel-action-test');
    spyOn(modal.cancelAction, 'callback');
    widget.find('.pf-widget-cancel').click();
    expect(modal.cancelAction.callback).toHaveBeenCalled();
  });

  it("shouldn't fire submit function on cancel, and cancel functions on submit", function () {
    var w1 = createMessageWidget({
      id: 'widget-with-action-callback',
      msg: 'Cancel action negative test',
      confirmAction: {
        name: 'Test confirm action',
        callback: function () {
          alert('test confirmation');
        },
      },
    });

    var w2 = createMessageWidget({
      id: 'widget-with-cancel-callback',
      msg: 'Cancel action negative test',
      cancelAction: {
        name: 'Test cancel action',
        callback: function () {
          alert('test cancel');
        },
      },
    });

    pathfora.initializeWidgets([w1, w2]);

    var widgetA = $('#widget-with-action-callback'),
      widgetB = $('#widget-with-cancel-callback');

    spyOn(w1.confirmAction, 'callback');
    spyOn(w2.cancelAction, 'callback');

    widgetA.find('.pf-widget-cancel').click();
    expect(w1.confirmAction.callback).not.toHaveBeenCalled();

    widgetB.find('.pf-widget-ok').click();
    expect(w2.cancelAction.callback).not.toHaveBeenCalled();
  });
});
