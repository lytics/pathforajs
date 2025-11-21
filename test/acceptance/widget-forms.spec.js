import globalReset from '../utils/global-reset';
import {
  createMessageWidget,
  createFormWidget,
  createSubscriptionWidget
} from '../utils/test-helpers';

// -------------------------
//  WIDGET FORM TESTS
// -------------------------
describe('Widgets', function () {
  beforeEach(function () {
    globalReset();
  });

  // -------------------------
  //  FORM STATES
  // -------------------------

  it('should show success or error state if waitForAsyncResponse is set', function (done) {
    var formStatesWidget = createFormWidget({
      id: 'form-states',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      confirmAction: {
        waitForAsyncResponse: true,
        callback: function (name, payload, cb) {
          if (payload.data[0].value === 'test') {
            cb(true);
            return;
          }
          cb(false);
        },
      },
      formStates: {
        success: {
          headline: 'test',
          msg: 'a custom success message',
          delay: 0,
          okShow: true,
          okMessage: 'confirm success',
          confirmAction: {
            name: 'confirm success',
            callback: function () {
              alert('confirm success');
            },
          },
          cancelShow: true,
          cancelMessage: 'cancel success',
          cancelAction: {
            name: 'cancel success',
            callback: function () {
              alert('cancel success');
            },
          },
        },
        error: {
          headline: 'test',
          msg: 'a custom error message',
          delay: 0,
          okShow: true,
          okMessage: 'confirm error',
          confirmAction: {
            name: 'confirm error',
            callback: function () {
              alert('confirm error');
            },
          },
          cancelShow: true,
          cancelMessage: 'cancel error',
          cancelAction: {
            name: 'cancel error',
            callback: function () {
              alert('cancel error');
            },
          },
        },
      },
    });
    window.pathfora.initializeWidgets([formStatesWidget]);

    var widget = $('#' + formStatesWidget.id),
      form = widget.find('form');
    expect(form.length).toBe(1);

    var name = form.find('input[name="username"]');
    expect(name.length).toBe(1);
    name.val('test');

    var email = form.find('input[name="email"]');
    expect(email.length).toBe(1);
    email.val('test@example.com');

    spyOn(formStatesWidget.confirmAction, 'callback').and.callThrough();
    expect(formStatesWidget.confirmAction.callback).not.toHaveBeenCalled();

    form.find('.pf-widget-ok').click();

    expect(formStatesWidget.confirmAction.callback).toHaveBeenCalledWith(
      'modalConfirm',
      jasmine.any(Object),
      jasmine.any(Function)
    );

    var success = widget.find('.success-state'),
      error = widget.find('.error-state');

    expect(form.css('display')).toBe('none');
    expect(success.css('display')).toBe('block');
    expect(widget.hasClass('success')).toBeTruthy();
    expect(success.find('.pf-widget-headline').html()).toBe(
      formStatesWidget.formStates.success.headline
    );
    expect(success.find('.pf-widget-message').html()).toBe(
      formStatesWidget.formStates.success.msg
    );

    expect(success.find('.pf-widget-ok').html()).toBe(
      formStatesWidget.formStates.success.okMessage
    );
    expect(success.find('.pf-widget-cancel').html()).toBe(
      formStatesWidget.formStates.success.cancelMessage
    );

    spyOn(jstag, 'send');
    spyOn(formStatesWidget.formStates.success.confirmAction, 'callback');
    expect(
      formStatesWidget.formStates.success.confirmAction.callback
    ).not.toHaveBeenCalled();
    success.find('.pf-widget-ok').click();

    expect(
      formStatesWidget.formStates.success.confirmAction.callback
    ).toHaveBeenCalled();
    expect(jstag.send).toHaveBeenCalledWith(
      jasmine.objectContaining({
        'pf-widget-id': formStatesWidget.id,
        'pf-widget-type': 'form',
        'pf-widget-layout': 'slideout',
        'pf-widget-event': 'success.confirm',
        'pf-widget-action':
          formStatesWidget.formStates.success.confirmAction.name,
      })
    );
    pathfora.clearAll();
    pathfora.closeWidget(formStatesWidget.id, true);

    setTimeout(function () {
      window.pathfora.initializeWidgets([formStatesWidget]);

      widget = $('#' + formStatesWidget.id);
      form = widget.find('form');
      expect(form.length).toBe(1);

      name = form.find('input[name="username"]');
      expect(name.length).toBe(1);
      name.val('bad');

      email = form.find('input[name="email"]');
      expect(email.length).toBe(1);
      email.val('bad@example.com');
      form.find('.pf-widget-ok').click();

      success = widget.find('.success-state');
      expect(success.length).toBe(1);
      error = widget.find('.error-state');
      expect(error.length).toBe(1);
      expect(form.css('display')).toBe('none');
      expect(success.css('display')).toBe('none');
      expect(error.css('display')).toBe('block');
      expect(widget.hasClass('error')).toBeTruthy();
      expect(error.find('.pf-widget-headline').html()).toBe(
        formStatesWidget.formStates.error.headline
      );
      expect(error.find('.pf-widget-message').html()).toBe(
        formStatesWidget.formStates.error.msg
      );
      expect(error.find('.pf-widget-ok').html()).toBe(
        formStatesWidget.formStates.error.okMessage
      );
      expect(error.find('.pf-widget-cancel').html()).toBe(
        formStatesWidget.formStates.error.cancelMessage
      );

      spyOn(formStatesWidget.formStates.error.cancelAction, 'callback');
      expect(
        formStatesWidget.formStates.error.cancelAction.callback
      ).not.toHaveBeenCalled();
      error.find('.pf-widget-cancel').click();

      expect(
        formStatesWidget.formStates.error.cancelAction.callback
      ).toHaveBeenCalled();
      expect(jstag.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          'pf-widget-id': formStatesWidget.id,
          'pf-widget-type': 'form',
          'pf-widget-layout': 'slideout',
          'pf-widget-event': 'error.cancel',
          'pf-widget-action':
            formStatesWidget.formStates.error.cancelAction.name,
        })
      );
      done();
    }, 600);
  });

  // -------------------------
  //  LEGACY SUCCESS STATES
  // -------------------------

  it('should show success state if one is set by the user', function (done) {
    var successForm = createSubscriptionWidget({
      id: 'success-form',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      success: {
        msg: 'a custom success message',
        delay: 2,
      },
    });

    pathfora.initializeWidgets([successForm]);

    var widget = $('#' + successForm.id);
    var form = widget.find('form');
    expect(form.length).toBe(1);

    var email = form.find('input[name="email"]');
    expect(email.length).toBe(1);
    email.val('test@example.com');
    form.find('.pf-widget-ok').click();

    var success = widget.find('.success-state');

    expect(form.css('display')).toBe('none');
    expect(success.css('display')).toBe('block');
    expect(widget.hasClass('success')).toBeTruthy();
    expect(success.find('.pf-widget-message').html()).toBe(
      successForm.success.msg
    );
    expect(success.find('.pf-widget-ok')).toBeUndefined;
    expect(success.find('.pf-widget-cancel')).toBeUndefined;

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeFalsy();
      done();
    }, 2000);
  });

  it('should not hide the module if the success state delay is 0', function (done) {
    var successForm2 = createSubscriptionWidget({
      id: 'success-form-no-delay',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      success: {
        msg: 'a custom success message',
        delay: 0,
      },
    });

    pathfora.initializeWidgets([successForm2]);

    var widget = $('#' + successForm2.id);
    var form = widget.find('form');
    expect(form.length).toBe(1);

    var email = form.find('input[name="email"]');
    expect(email.length).toBe(1);
    email.val('test@example.com');
    form.find('.pf-widget-ok').click();

    var success = widget.find('.success-state');

    expect(form.css('display')).toBe('none');
    expect(success.css('display')).toBe('block');
    expect(widget.hasClass('success')).toBeTruthy();
    expect(success.find('.pf-widget-message').html()).toBe(
      successForm2.success.msg
    );
    expect(success.find('.pf-widget-ok')).toBeUndefined;
    expect(success.find('.pf-widget-cancel')).toBeUndefined;

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      expect(widget.hasClass('success')).toBeTruthy();

      done();
    }, 3000);
  });

  it('should recognize success state buttons and callbacks', function (done) {
    var successForm3 = createSubscriptionWidget({
      id: 'success-form-cbs',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      success: {
        headline: 'test',
        msg: 'a custom success message',
        okShow: true,
        cancelShow: true,
        cancelMessage: 'Custom Cancel',
        confirmAction: {
          name: 'test success confirmation',
          callback: function () {
            window.alert('confirmed');
          },
        },
        cancelAction: {
          name: 'test success cancelation',
          callback: function () {
            window.alert('canceled');
          },
        },
        delay: 0,
      },
    });

    pathfora.initializeWidgets([successForm3]);
    var widget = $('#' + successForm3.id);
    var form = widget.find('form');
    form.find('input[name="email"]').val('test@example.com');
    form.find('.pf-widget-ok').click();

    var success = widget.find('.success-state');
    expect(form.css('display')).toBe('none');
    expect(success.css('display')).toBe('block');
    expect(widget.hasClass('success')).toBeTruthy();
    expect(success.find('.pf-widget-headline').html()).toBe(
      successForm3.success.headline
    );
    expect(success.find('.pf-widget-message').html()).toBe(
      successForm3.success.msg
    );

    expect(success.find('.pf-widget-ok').html()).toBe('Confirm');
    expect(success.find('.pf-widget-cancel').html()).toBe('Custom Cancel');

    spyOn(jstag, 'send');
    spyOn(window, 'alert');
    success.find('.pf-widget-ok').click();

    expect(jstag.send).toHaveBeenCalledWith(
      jasmine.objectContaining({
        'pf-widget-id': successForm3.id,
        'pf-widget-type': 'subscription',
        'pf-widget-layout': 'slideout',
        'pf-widget-event': 'success.confirm',
        'pf-widget-action': successForm3.success.confirmAction.name,
      })
    );
    expect(window.alert).toHaveBeenCalledWith('confirmed');

    setTimeout(function () {
      pathfora.clearAll();
      pathfora.initializeWidgets([successForm3]);

      widget = $('#' + successForm3.id);
      form = widget.find('form');
      form.find('input[name="email"]').val('test@example.com');
      form.find('.pf-widget-ok').click();

      success = widget.find('.success-state');
      success.find('.pf-widget-cancel').click();

      expect(jstag.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          'pf-widget-id': successForm3.id,
          'pf-widget-type': 'subscription',
          'pf-widget-layout': 'slideout',
          'pf-widget-event': 'success.cancel',
          'pf-widget-action': successForm3.success.cancelAction.name,
        })
      );
      expect(window.alert).toHaveBeenCalledWith('canceled');

      setTimeout(function () {
        done();
      }, 1000);
    }, 1000);
  });

  // -------------------------
  //  CUSTOM BUTTONS
  // -------------------------

  it('should be able to configure custom text', function () {
    var modal = createMessageWidget({
      id: 'custom-button-text-test',
      layout: 'modal',
      msg: 'Custom button text test',
      headline: 'Hello',
      okMessage: 'Confirm Here',
      cancelMessage: 'Cancel Here',
    });

    pathfora.initializeWidgets([modal]);

    var widget = $('#' + modal.id),
      actionBtn = widget.find('.pf-widget-ok'),
      cancelBtn = widget.find('.pf-widget-cancel');

    expect(actionBtn.html()).toBe('Confirm Here');
    expect(cancelBtn.html()).toBe('Cancel Here');
  });

  // -------------------------
  //  OLD CUSTOM FIELDS
  // -------------------------

  it('should be able to hide and show fields based on config', function () {
    var formfields = createFormWidget({
      id: 'sample-form',
      msg: 'subscription',
      headline: 'Header',
      layout: 'slideout',
      fields: {
        title: false,
        username: false,
      },
      required: {
        message: true,
        email: false,
      },
    });

    pathfora.initializeWidgets([formfields]);

    var theform = $('#' + formfields.id).find('form');
    expect(theform.length).toBe(1);

    for (var elem in theform[0].children) {
      if (typeof theform[0].children[elem].getAttribute !== 'undefined') {
        var inputname = theform[0].children[elem].getAttribute('name'),
          inputrequired =
            theform[0].children[elem].getAttribute('data-required');

        if (inputname === 'message') {
          expect(inputrequired).toBe('true');
        } else if (inputname !== null) {
          expect(inputrequired).toBe(null);
        }

        expect(inputname).not.toBe('username');
        expect(inputname).not.toBe('title');
      }
    }
  });

  // -------------------------
  //  FORM BUILDER
  // -------------------------

  it('should track custom fields to lytics', function (done) {
    var customForm = createFormWidget({
      id: 'custom-form-1',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'input',
          name: 'name',
          placeholder: 'Your Name',
          required: true,
        },
        {
          type: 'checkbox-group',
          name: 'terms_agreement',
          required: true,
          values: [
            {
              label: 'I agree',
              value: 'agree',
            },
          ],
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    widget.find('[name=terms_agreement]').click();
    widget.find('[name=name]').val('my name here');
    spyOn(jstag, 'send');

    widget.find('form').find('.pf-widget-ok').click();

    expect(jstag.send).toHaveBeenCalledWith(
      jasmine.objectContaining({
        'pf-widget-id': customForm.id,
        'pf-widget-type': 'form',
        'pf-widget-layout': 'slideout',
        'pf-widget-event': 'submit',
        'pf-custom-form': {
          terms_agreement: ['agree'],
          name: 'my name here',
        },
      })
    );
    done();
  });

  it('should add labels and placeholders for custom fields if defined', function () {
    var customForm = createFormWidget({
      id: 'custom-form-2',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'select',
          label: "What's your favorite animal?",
          placeholder: 'Select an animal...',
          name: 'favorite_animal',
          required: true,
          values: [
            {
              label: 'Cat',
              value: 'cat',
            },
            {
              label: 'Dog',
              value: 'dog',
            },
            {
              label: 'Horse',
              value: 'horse',
            },
          ],
        },
        {
          type: 'checkbox-group',
          label: 'Which ice cream flavors do you like the most?',
          name: 'ice_cream_flavors',
          required: true,
          values: [
            {
              label: 'Vanilla',
              value: 'vanilla',
            },
            {
              label: 'Chocolate',
              value: 'chocolate',
            },
            {
              label: 'Strawberry',
              value: 'strawberry',
            },
          ],
        },
        {
          type: 'textarea',
          label: 'Comments',
          name: 'comments',
          placeholder: 'Any more comments?',
          required: true,
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    var labels = widget.find('.pf-form-label');
    var divs = widget.find('.pf-has-label');

    expect(labels.length).toBe(customForm.formElements.length);
    expect(divs.length).toBe(customForm.formElements.length);

    var i;

    for (i = 0; i < labels.length; i++) {
      expect(
        labels[i].innerHTML.indexOf(customForm.formElements[i].label) !== -1
      ).toBeTruthy();
    }

    for (i = 0; i < divs.length; i++) {
      var field = divs[i];
      var configElem = customForm.formElements[i];
      if (field.placeholder && configElem.placeholder) {
        expect(field.placeholder).toBe(configElem.placeholder);
      }

      if (configElem.type === 'select') {
        expect(field.children[0].innerHTML).toBe(configElem.placeholder);
      }
    }
  });

  it('should not submit the form if required fields are not filled out', function (done) {
    var customForm = new pathfora.Form({
      id: 'custom-form-3',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'input',
          placeholder: "What's your favorite animal?",
          name: 'favorite_animal',
          required: true,
        },
        {
          type: 'radio-group',
          label: 'Which ice cream flavors do you like the most?',
          name: 'ice_cream_flavors',
          required: true,
          values: [
            {
              label: 'Vanilla',
              value: 'vanilla',
            },
            {
              label: 'Chocolate',
              value: 'chocolate',
            },
            {
              label: 'Strawberry',
              value: 'strawberry',
            },
          ],
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    spyOn(jstag, 'send');

    setTimeout(function () {
      widget.find('form').find('.pf-widget-ok').click();
      expect(jstag.send).not.toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeTruthy();

      var required = widget.find('[data-required=true]');
      expect(required.length).toBe(customForm.formElements.length);

      for (var i = 0; i < required.length; i++) {
        var req = required[i].parentNode;
        expect(req.className.indexOf('pf-form-required') !== -1).toBeTruthy();
        expect(req.className.indexOf('invalid') !== -1).toBeTruthy();
      }
      done();
    }, 200);
  });

  it('should not submit the form if fields are invalid', function (done) {
    var customForm = createFormWidget({
      id: 'custom-form-3',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'email',
          placeholder: 'Email',
          name: 'email',
          required: true,
        },
        {
          type: 'radio-group',
          label: 'Which ice cream flavors do you like the most?',
          name: 'ice_cream_flavors',
          values: [
            {
              label: 'Vanilla',
              value: 'vanilla',
            },
            {
              label: 'Chocolate',
              value: 'chocolate',
            },
            {
              label: 'Strawberry',
              value: 'strawberry',
            },
          ],
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    spyOn(jstag, 'send');

    setTimeout(function () {
      widget.find('input[name=email]').val('zkjhfkdjh');
      widget.find('form').find('.pf-widget-ok').click();
      expect(jstag.send).not.toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeTruthy();

      var invalid = widget.find('[data-validate=true]');
      expect(invalid.length).toBe(1);

      for (var i = 0; i < invalid.length; i++) {
        var req = invalid[i].parentNode;
        expect(req.className.indexOf('pf-form-required') !== -1).toBeTruthy();
        expect(req.className.indexOf('bad-validation') !== -1).toBeTruthy();
      }

      // also check required validation
      widget.find('input[name=email]').val('');
      widget.find('form').find('.pf-widget-ok').click();
      expect(jstag.send).not.toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeTruthy();

      invalid = widget.find('[data-required=true]');
      expect(invalid.length).toBe(1);

      for (var j = 0; j < invalid.length; j++) {
        var reqField = invalid[j].parentNode;
        expect(
          reqField.className.indexOf('pf-form-required') !== -1
        ).toBeTruthy();
        expect(reqField.className.indexOf('invalid') !== -1).toBeTruthy();
      }
      done();
    }, 200);
  });

  it('should not submit the form if a date field is invalid', function (done) {
    var customForm = createFormWidget({
      id: 'custom-form-3',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'date',
          name: 'birthday',
          maxDate: 'today',
          minDate: '01-01-2020',
        },
        {
          type: 'radio-group',
          label: 'Which ice cream flavors do you like the most?',
          name: 'ice_cream_flavors',
          values: [
            {
              label: 'Vanilla',
              value: 'vanilla',
            },
            {
              label: 'Chocolate',
              value: 'chocolate',
            },
            {
              label: 'Strawberry',
              value: 'strawberry',
            },
          ],
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    spyOn(jstag, 'send');

    setTimeout(function () {
      widget.find('input[name=birthday]').val('2010-10-10');
      widget.find('form').find('.pf-widget-ok').click();
      expect(jstag.send).not.toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeTruthy();

      var invalid = widget.find('[data-validate=true]');
      expect(invalid.length).toBe(1);

      for (var i = 0; i < invalid.length; i++) {
        var req = invalid[i].parentNode;
        expect(req.className.indexOf('pf-form-required') !== -1).toBeTruthy();
        expect(req.className.indexOf('bad-validation') !== -1).toBeTruthy();
      }
      done();
    }, 200);
  });

  // -------------------------
  //  CUSTOM FORM VALIDATION
  // -------------------------

  it('should not submit the form if custom validation fails', function (done) {
    var customForm = createFormWidget({
      id: 'custom-form-4',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'text',
          placeholder: 'Only 5 Digits Allowed',
          name: 'postal_code',
          pattern: '^[0-9]{5}$',
          required: true,
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    spyOn(jstag, 'send');

    setTimeout(function () {
      var form = widget.find('form');
      var field = form.find('input[name="postal_code"]');

      field.val('notvalid');
      form.find('.pf-widget-ok').trigger('click');
      expect(jstag.send).not.toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeTruthy();

      var required = widget.find('[data-required=true]');
      expect(required.length).toBe(customForm.formElements.length);

      for (var i = 0; i < required.length; i++) {
        var req = required[i].parentNode;
        expect(req.className.indexOf('invalid') !== -1).toBeFalsy();
      }

      done();
    }, 500);
  });

  it('should not submit the form if only 1 of 2 fields pass validation', function (done) {
    var customForm = createFormWidget({
      id: 'custom-form-4',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'text',
          placeholder: '6 Digits zbzbzb',
          name: 'custom_field_1',
          pattern: '^[zb]{6}$',
        },
        {
          type: 'text',
          placeholder: 'Only 5 Digits Allowed',
          name: 'custom_field_2',
          pattern: '^[0-9]{5}$',
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    spyOn(jstag, 'send');

    setTimeout(function () {
      var form = widget.find('form');

      var field1 = form.find('input[name="custom_field_1"]');
      field1.val('notvalid');

      var field2 = form.find('input[name="custom_field_2"]');
      field2.val('12345');

      form.find('.pf-widget-ok').trigger('click');

      expect(jstag.send).not.toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeTruthy();

      var validationRequirement = widget.find('[data-validate=true]');
      expect(validationRequirement.length).toBe(customForm.formElements.length);

      // expect field1 to be invalid
      var req = validationRequirement[0].parentNode;
      expect(req.className.indexOf('bad-validation') !== -1).toBeTruthy();

      // expect field2 to be valid
      req = validationRequirement[1].parentNode;
      expect(req.className.indexOf('bad-validation') !== -1).toBeFalsy();

      done();
    }, 500);
  });

  it('should submit the form if custom validation passes', function (done) {
    var customForm = createFormWidget({
      id: 'custom-form-5',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'text',
          placeholder: 'Only 5 Digits Allowed',
          name: 'postal_code',
          pattern: '^[0-9]{5}$',
          required: true,
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    spyOn(jstag, 'send');

    setTimeout(function () {
      var form = widget.find('form');
      var field = form.find('input[name="postal_code"]');

      field.val('12345');
      form.find('.pf-widget-ok').trigger('click');
      expect(jstag.send).toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeFalsy();

      var required = widget.find('[data-required=true]');
      expect(required.length).toBe(customForm.formElements.length);

      for (var i = 0; i < required.length; i++) {
        var req = required[i].parentNode;
        expect(req.className.indexOf('invalid') !== -1).toBeFalsy();
      }

      done();
    }, 200);
  });

  it('should add validation parameters if special case of us-postal-code', function (done) {
    var customForm = createFormWidget({
      id: 'custom-form-6',
      msg: 'custom form',
      layout: 'slideout',
      formElements: [
        {
          type: 'us-postal-code',
          placeholder: 'Only 5 Digits Allowed',
          name: 'postal_code',
          required: true,
        },
      ],
    });

    pathfora.initializeWidgets([customForm]);

    var widget = $('#' + customForm.id);
    spyOn(jstag, 'send');

    setTimeout(function () {
      var form = widget.find('form');
      var field = form.find('input[name="postal_code"]');

      var pattern = field.attr('enforcePattern');
      expect(pattern).toBe('^[0-9]{5}$');

      field.val('1234a');
      form.find('.pf-widget-ok').trigger('click');
      expect(jstag.send).not.toHaveBeenCalled();
      expect(widget.hasClass('opened')).toBeTruthy();

      var required = widget.find('[data-required=true]');
      expect(required.length).toBe(customForm.formElements.length);

      for (var i = 0; i < required.length; i++) {
        var req = required[i].parentNode;
        expect(req.className.indexOf('invalid') !== -1).toBeFalsy();
      }

      done();
    }, 500);
  });

});
