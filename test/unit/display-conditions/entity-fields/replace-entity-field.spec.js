import replaceEntityField from '../../../../src/rollup/display-conditions/entity-fields/replace-entity-field';
import globalReset from '../../../utils/global-reset';
import escapeEntityValue, {
  escapeJS,
  hasScriptScheme,
} from '../../../../src/rollup/display-conditions/entity-fields/escape-entity-value';

describe('replaceEntityField', function () {
  beforeEach(function () {
    globalReset();
  });

  describe('when using legacy tag', function () {
    beforeEach(function () {
      window.lio = {
        data: {
          promoCode: '8675309',
        },
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
          layout: 'slideout',
        },
        id: 'field-widget-1',
        headline: 'Free shipping on your next purchase',
        msg: 'Enter this promo code: {{promoCode}}',
        layout: 'slideout',
        displayConditions: {
          showOnMissingFields: false,
        },
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
                promoCode: '90210',
              },
            },
          };
        },
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
          layout: 'slideout',
        },
        id: 'field-widget-1',
        headline: 'Free shipping on your next purchase',
        msg: 'Enter this promo code: {{promoCode}}',
        layout: 'slideout',
        displayConditions: {
          showOnMissingFields: false,
        },
      };

      var result = replaceEntityField(widget, 'msg', ['{{promoCode}}'], {});

      expect(result).toBe(true);
      expect(widget.msg).toEqual('Enter this promo code: 90210');
    });
  });
  describe('when profile values contain markup or script', function () {
    var user;

    function messageWidget (overrides) {
      return Object.assign(
        {
          valid: true,
          type: 'message',
          id: 'field-widget-escape',
          layout: 'slideout',
          displayConditions: {
            showOnMissingFields: false,
          },
        },
        overrides
      );
    }

    beforeEach(function () {
      user = {};
      window.jstag = {
        getEntity: function () {
          return { data: { user: user } };
        },
      };
    });

    it('should HTML-escape the value in msg', function () {
      user.name = '<img src=x onerror="window.pfxss=1">';
      var widget = messageWidget({ msg: 'Hi {{name}}' });

      expect(replaceEntityField(widget, 'msg', ['{{name}}'], {})).toBe(true);
      expect(widget.msg).toEqual(
        'Hi &lt;img src=x onerror=&quot;window.pfxss=1&quot;&gt;'
      );
    });

    it('should HTML-escape the value in headline', function () {
      user.name = 'Tom & "Jerry"';
      var widget = messageWidget({ headline: 'Hi {{name}}' });

      expect(replaceEntityField(widget, 'headline', ['{{name}}'], {})).toBe(true);
      expect(widget.headline).toEqual('Hi Tom &amp; &quot;Jerry&quot;');
    });

    it('should not let a quoted value leave an attribute', function () {
      user.promo = 'x" onmouseover="window.pfxss=1';
      var widget = messageWidget({ msg: '<a href="/p?c={{promo}}">go</a>' });

      replaceEntityField(widget, 'msg', ['{{promo}}'], {});

      var div = document.createElement('div');
      div.innerHTML = widget.msg;
      var a = div.querySelector('a');
      expect(a.getAttribute('onmouseover')).toBeNull();
      expect(a.getAttribute('href')).toEqual(
        '/p?c=x" onmouseover="window.pfxss=1'
      );
    });

    it('should treat a script-scheme value in an html field as missing', function () {
      user.url = ' java\tscript:window.pfxss=1';
      var widget = messageWidget({ msg: '<a href="{{url}}">go</a>' });

      expect(replaceEntityField(widget, 'msg', ['{{url}}'], {})).toBe(false);
    });

    it('should fall back to the default for a script-scheme value', function () {
      user.url = 'javascript:window.pfxss=1'; // eslint-disable-line no-script-url
      var widget = messageWidget({
        msg: '<a href="{{url | https://example.com/}}">go</a>',
      });

      expect(
        replaceEntityField(widget, 'msg', ['{{url | https://example.com/}}'], {})
      ).toBe(true);
      expect(widget.msg).toEqual('<a href="https://example.com/">go</a>');
    });

    it('should not expand $ replacement patterns in the value', function () {
      user.name = '$& $` $\'';
      var widget = messageWidget({ msg: 'Hi {{name}}' });

      replaceEntityField(widget, 'msg', ['{{name}}'], {});
      expect(widget.msg).toEqual('Hi $&amp; $&#96; $&#39;');
    });

    it('should keep a callback working while the value cannot close its string', function () {
      user.email = "a@b.com'; window.pfxss = 1; '";
      window.pfxss = undefined;
      window.pfurl = undefined;

      var widget = messageWidget({
        confirmAction: {
          name: 'confirm',
          callback: function () {
            window.pfurl = 'https://example.com/?e={{email}}';
          },
        },
      });

      expect(
        replaceEntityField(widget, 'confirmAction.callback', ['{{email}}'], {})
      ).toBe(true);

      widget.confirmAction.callback();
      expect(window.pfxss).toBeUndefined();
      expect(window.pfurl).toEqual(
        "https://example.com/?e=a@b.com'; window.pfxss = 1; '"
      );
    });

    it('should keep template literal values from interpolating', function () {
      user.name = '${window.pfxss = 1}';
      window.pfxss = undefined;
      window.pfout = undefined;

      var widget = messageWidget({
        confirmAction: {
          name: 'confirm',
          callback: function () {
            window.pfout = `hi {{name}}`; // eslint-disable-line quotes
          },
        },
      });

      replaceEntityField(widget, 'confirmAction.callback', ['{{name}}'], {});
      widget.confirmAction.callback();
      expect(window.pfxss).toBeUndefined();
      expect(window.pfout).toEqual('hi ${window.pfxss = 1}');
    });

    it('should escape custom data values the same way', function () {
      var widget = messageWidget({ msg: 'Hi {{nick}}' });

      replaceEntityField(widget, 'msg', ['{{nick}}'], { nick: '<b>x</b>' });
      expect(widget.msg).toEqual('Hi &lt;b&gt;x&lt;/b&gt;');
    });

    it('should leave defaults written by the widget author as authored', function () {
      var widget = messageWidget({ msg: 'Hi {{missing | <b>friend</b>}}' });

      replaceEntityField(widget, 'msg', ['{{missing | <b>friend</b>}}'], {});
      expect(widget.msg).toEqual('Hi <b>friend</b>');
    });

    it('should leave plain values unchanged', function () {
      user.promoCode = '90210';
      var widget = messageWidget({ msg: 'Code: {{promoCode}}' });

      replaceEntityField(widget, 'msg', ['{{promoCode}}'], {});
      expect(widget.msg).toEqual('Code: 90210');
    });
  });

  describe('escapeEntityValue', function () {
    it('should pass image values through for img.src', function () {
      expect(escapeEntityValue('image', 'https://x.test/a.png?a=1&b=2')).toEqual(
        'https://x.test/a.png?a=1&b=2'
      );
    });

    it('should escape every non-word character for JS', function () {
      expect(escapeJS('a.b"' + String.fromCharCode(0x2028))).toEqual('a\\x2eb\\x22\\u2028');
    });

    it('should detect script schemes through whitespace and control characters', function () {
      expect(hasScriptScheme('\u0001 JaVa\nScRiPt:alert(1)')).toBe(true);
      expect(hasScriptScheme('data:text/html,x')).toBe(true);
      expect(hasScriptScheme('https://example.com/')).toBe(false);
      expect(hasScriptScheme('Note: hello')).toBe(false);
    });
  });
});
