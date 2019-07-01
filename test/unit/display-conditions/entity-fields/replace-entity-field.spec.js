import replaceEntityField from '../../../../src/rollup/display-conditions/entity-fields/replace-entity-field';

describe('replaceEntityField', function () {
  beforeEach(function () {
    window.jstag = null;
    window.lio = null;
  });

  describe('when using legacy tag', function () {
    beforeEach(function () {
      window.lio = {
        data: {
          promoCode: '8675309'
        }
      };
    });

    it('should replace the promo code value in the template', function () {
      var widget = {
        valid: true,
        type: 'message',
        config: {
          id: 'field-widget-1',
          headline: 'Free shipping on your next purchase',
          msg: 'Enter this promo code: {{promoCode}}',
          layout: 'slideout'
        },
        id: 'field-widget-1',
        headline: 'Free shipping on your next purchase',
        msg: 'Enter this promo code: {{promoCode}}',
        layout: 'slideout',
        variant: '1',
        displayConditions: {
          showOnMissingFields: false
        }
      };

      var result = replaceEntityField(widget, 'msg', ['{{promoCode}}'], {});

      expect(result).toBe(true);
      expect(widget.msg).toEqual('Enter this promo code: 8675309');
    });
  });

  describe('when using current gen tag', function () {
    beforeEach(function () {
      window.jstag = {
        getEntity: function () {
          return {
            data: {
              user: {
                promoCode: '90210'
              }
            }
          };
        }
      };
    });

    it('should replace the promo code value in the template', function () {
      var widget = {
        valid: true,
        type: 'message',
        config: {
          id: 'field-widget-1',
          headline: 'Free shipping on your next purchase',
          msg: 'Enter this promo code: {{promoCode}}',
          layout: 'slideout'
        },
        id: 'field-widget-1',
        headline: 'Free shipping on your next purchase',
        msg: 'Enter this promo code: {{promoCode}}',
        layout: 'slideout',
        variant: '1',
        displayConditions: {
          showOnMissingFields: false
        }
      };

      var result = replaceEntityField(widget, 'msg', ['{{promoCode}}'], {});

      expect(result).toBe(true);
      expect(widget.msg).toEqual('Enter this promo code: 90210');
    });
  });
});
