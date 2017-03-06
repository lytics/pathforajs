jQuery(function($) {
  var removeFields = function(fld, arr) {
    for (var i = 0; i < arr.length; i++) {
      $('.' + arr[i] + '-wrap', fld).remove();
    }
  }

  var options = {
    dataType: 'json',
    disableFields: ['autocomplete', 'button', 'checkbox', 'date', 'file', 'header', 'hidden', 'paragraph', 'number', 'radio'],
    editOnAdd: true,
    typeUserEvents: {
      text: {
        onadd: function(fld) {
          removeFields(fld, ['className', 'description', 'subtype', 'value', 'access', 'maxlength']);
        }
      },

      textarea: {
        onadd: function(fld) {
          removeFields(fld, ['className', 'description', 'rows', 'value', 'access', 'maxlength']);
        }
      },

      select: {
        onadd: function(fld) {
          removeFields(fld, ['className', 'description', 'access', 'multiple']);
          $('.option-selected', fld).remove();
        }
      },

      'radio-group': {
        onadd: function(fld) {
          removeFields(fld, ['className', 'description', 'access', 'other']);
          $('.option-selected', fld).remove();
        }
      },

      'checkbox-group': {
        onadd: function(fld) {
          removeFields(fld, ['className', 'description', 'access', 'other']);
          $('.option-selected', fld).remove();
        }
      }
    },
    messages: {
      radioGroup: 'Radio Buttons',
      checkboxGroup: 'Checkboxes',
      text: 'Text Input',
      allFieldsRemoved: 'cleared'
    },

    notify: {
      success: function(msg) {
        if (msg === 'cleared') {
          var pre = $('pre.form-builder-output');
          pre.addClass('hidden');
        }

        return console.log(msg);
      }
    }
  }

  var formBuilder = $(document.getElementById('custom-form-builder')).formBuilder(options).data('formBuilder');

  $('#custom-form-builder .btn.view-data').remove();

  $("#custom-form-builder .form-builder-save").click(function(e) {
    e.preventDefault();
    var pre = $('pre.form-builder-output');
    pre.removeClass('hidden');
    pre.find('code').html('formElements: ' + formBuilder.formData.replace(/\t/g, '  '));
    hljs.highlightBlock(pre.find('code').get(0));
  });



});