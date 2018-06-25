// -------------------------
// UTIL TESTS
// -------------------------
describe('Utils', function () {
  describe('the escapeURI util', function () {
    var escapeURI = pathfora.utils.escapeURI;

    it('should escape non-URI characters', function () {
      // Most of the character space we care about, un-escaped...
      var unescaped =
        '\x02\n\x1d !\"%\'()*-.0123456789' +
        '<>ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        '[\\]^_`abcdefghijklmnopqrstuvwxyz' +
        '{|}~\x7f\x80\xff';

      // ...and escaped
      var escaped =
        '%02%0A%1D+!%22%25%27()*-.0123456789' +
        '%3C%3EABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        '%5B%5C%5D%5E_%60abcdefghijklmnopqrstuvwxyz' +
        '%7B%7C%7D~%7F%80%FF';

      expect(escapeURI(unescaped, { usePlus: true })).toBe(escaped);
    });

    it('should not escape URI separators', function () {
      var unescaped = 'http://www.getlytics.com/?foo=1&bar=2';

      expect(escapeURI(unescaped)).toBe(unescaped);
    });

    it('should not double-encode URIs', function () {
      var unescaped = 'http://www.getlytics.com/?foo=a b c&bar=d e f',
          escapedOnce = escapeURI(unescaped, { keepEscaped: true }),
          escapedTwice = escapeURI(escapedOnce, { keepEscaped: true });

      expect(escapedTwice).toBe(escapedOnce);
    });
  });

  describe('constructQueries util', function () {
    var constructQueries = pathfora.utils.constructQueries;

    it('should handle single value params', function () {
      var params = {
        key: 'value',
        anotherkey: true,
        athirdkey: 1
      };

      var expected = '?key=value&anotherkey=true&athirdkey=1';

      expect(constructQueries(params)).toEqual(expected);
    });

    it('should handle multiple value params', function () {
      var params = {
        foo: 'value',
        bar: [1, 2, 3],
        baz: ['test']
      };

      var expected = '?foo=value&bar[]=1&bar[]=2&bar[]=3&baz[]=test';

      expect(constructQueries(params)).toEqual(expected);
    });
  });

  describe('generateUniqueId util', function() {
    var generateUniqueId = pathfora.utils.generateUniqueId;

    it('should return a random unique id', function() {
      expect(generateUniqueId().length).toEqual(36);
    });
  });

  describe('updateLegacyCookies', function () {
    it('should encode legacy Pathfora cookies', function () {
      var setCookie = function (cname, cvalue) {
        var expires = 'expires=0';
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
      };

      var getCookie = function (cname) {
        var name = cname + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) === ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
        return '';
      };

      setCookie('PathforaClosed_1', '1%257C1502732355490'); // double encoded
      setCookie('PathforaImpressions_2', '1|293847239874932871');
      sessionStorage.setItem('PathforaRecommend_2', '{"somejson": "here"}');
      setCookie('PathforaImpressions_3', '%badval%');

      pathfora.utils.updateLegacyCookies();

      expect(getCookie('PathforaClosed_1')).toEqual('1%7C1502732355490');
      expect(getCookie('PathforaImpressions_2')).toEqual('1%7C293847239874932871');
      expect(sessionStorage.getItem('PathforaRecommend_2')).toEqual('%7B%22somejson%22%3A%20%22here%22%7D');
      expect(getCookie('PathforaImpressions_3')).toEqual('%badval%');

      expect(pathfora.utils.readCookie('PathforaClosed_1')).toEqual('1|1502732355490');
      expect(pathfora.utils.readCookie('PathforaImpressions_2')).toEqual('1|293847239874932871');
      expect(pathfora.utils.readCookie('PathforaImpressions_3')).toEqual('%badval%');
    });
  });
});
