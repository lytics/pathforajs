// -------------------------
//  ENTITY FIELD TEMPLATES
// -------------------------
describe("the entity templates", function() {
	beforeEach(function() {
		pathfora.clearAll();
	});

  it('should replace dynamic templates with entity fields', function (done) {
    window.lio = {
      data: {
        promoCode: '123FREE',
        email: 'fake@gmail.com'
      }
    };

    window.lio.loaded = true;

    pathfora.customData = {
      customField: 'test'
    };

    var fieldWidget1 = new pathfora.Message({
      id: 'field-widget-1',
      layout: 'slideout',
      headline: 'Free shipping on your next purchase',
      msg: 'Enter this promo code: {{promoCode}}'
    });

    var fieldWidget2 = new pathfora.Form({
      id: 'field-widget-2',
      layout: 'slideout',
      headline: '{{email | no email provided}}',
      msg: 'Sign up with your email.'
    });

    var fieldWidget3 = new pathfora.Form({
      id: 'field-widget-3',
      layout: 'slideout',
      headline: 'Hi {{name}}',
      msg: 'Sign up with your email.'
    });

    var fieldWidget4 = new pathfora.Form({
      id: 'field-widget-4',
      layout: 'slideout',
      headline: 'Hi {{name}}',
      msg: 'Sign up with your email.',
      displayConditions: {
        showOnMissingFields: true
      }
    });

    var fieldWidget5 = new pathfora.Form({
      id: 'field-widget-5',
      layout: 'slideout',
      headline: 'Welcome',
      msg: 'Welcome {{name | No Name}}!'
    });

    var fieldWidget6 = new pathfora.Form({
      id: 'field-widget-6',
      layout: 'slideout',
      headline: 'Welcome',
      msg: 'Welcome {{myUrl | https://www.google.com/}}!'
    });

    var fieldWidget7 = new pathfora.Form({
      id: 'field-widget-7',
      layout: 'slideout',
      headline: 'Welcome',
      msg: 'Welcome {{customField | fail}}!'
    });

    var fieldWidget8 = new pathfora.Form({
      id: 'fieldWidget8',
      layout: 'slideout',
      headline: 'Welcome',
      msg: 'my {{data | string}} will get {{data2}} defaulted wrong',
      displayConditions: {
        showOnMissingFields: true
      }
    });

    var fieldWidget9 = new pathfora.Message({
      id: 'fieldWidget9',
      layout: 'slideout',
      headline: 'Welcome',
      msg: 'custom url',
      confirmAction: {
        name: 'confirm',
        callback: function () {
          window.customvar = 'https://www.google.com/?promo={{promoCode}}&email={{email}}';
        }
      }
    });

    pathfora.initializeWidgets([fieldWidget1, fieldWidget2, fieldWidget3, fieldWidget4, fieldWidget5, fieldWidget6, fieldWidget7, fieldWidget8, fieldWidget9]);

    var w1 = $('#' + fieldWidget1.id);
    expect(w1.length).toBe(1);
    expect(fieldWidget1.msg).toBe('Enter this promo code: 123FREE');

    var w2 = $('#' + fieldWidget2.id);
    expect(w2.length).toBe(1);
    expect(fieldWidget2.headline).toBe('fake@gmail.com');

    var w3 = $('#' + fieldWidget3.id);
    expect(w3.length).toBe(0);

    var w4 = $('#' + fieldWidget4.id);
    expect(w4.length).toBe(1);
    expect(fieldWidget4.headline).toBe('Hi ');

    var w5 = $('#' + fieldWidget5.id);
    expect(w5.length).toBe(1);
    expect(fieldWidget5.msg).toBe('Welcome No Name!');

    var w6 = $('#' + fieldWidget6.id);
    expect(w6.length).toBe(1);
    expect(fieldWidget6.msg).toBe('Welcome https://www.google.com/!');

    var w7 = $('#' + fieldWidget7.id);
    expect(w7.length).toBe(1);
    expect(fieldWidget7.msg).toBe('Welcome test!');

    var w8 = $('#' + fieldWidget8.id);
    expect(w8.length).toBe(1);
    expect(fieldWidget8.msg).toBe('my string will get  defaulted wrong');

    var w9 = $('#' + fieldWidget9.id);
    expect(w9.length).toBe(1);
    w9.find('.pf-widget-ok').click();

    setTimeout(function () {
      expect(w1.hasClass('opened')).toBeTruthy();
      expect(w2.hasClass('opened')).toBeTruthy();
      expect(w3.hasClass('opened')).toBeFalsy();
      expect(w4.hasClass('opened')).toBeTruthy();
      expect(w5.hasClass('opened')).toBeTruthy();
      expect(w6.hasClass('opened')).toBeTruthy();
      expect(w7.hasClass('opened')).toBeTruthy();
      expect(w8.hasClass('opened')).toBeTruthy();
      expect(window.customvar === 'https://www.google.com/?promo=123FREE&email=fake@gmail.com').toBeTruthy();
      done();
    }, 200);
  });
});
