import globalReset from '../../utils/global-reset';

describe('`expiringLocalStorage` util', function () {
  var expiringLocalStorage = pathfora.utils.store;

  beforeEach(globalReset);

  describe('the `setItem` method', function () {
    describe('when an expiration date is not passed', function () {
      it('should default to one year', function () {
        expiringLocalStorage.setItem('foo', 'plop');

        var date = new Date();
        date.setDate(date.getDate() + 365);
        var dateStr = date.toISOString();

        expect(JSON.parse(localStorage.getItem('foo'))['@']).toMatch(
          new RegExp('^' + dateStr.substr(0, 10))
        );
      });
    });

    describe('when an expiration date is passed', function () {
      it('should wrap the value in a { payload, expiresOn } tuple and serialize it to localStorage', function () {
        var expiresOn = new Date('December 17, 1995 03:24:00');

        expiringLocalStorage.setItem('foo', 'wow', expiresOn);
        var tuple = JSON.parse(localStorage.getItem('foo'));

        expect(tuple).toEqual({
          $: 'wow',
          '@': expiresOn.toISOString()
        });
      });
    });
  });

  describe('the `ttl` method', function () {
    describe('when milliseconds is not provided', function () {
      it('should throw an error', function () {
        expect(function () {
          expiringLocalStorage.ttl('foo', 'pop');
        }).toThrowError(/milliseconds must be a number!/);
      });
    });

    describe('when milliseconds is not a number', function () {
      it('should throw an error', function () {
        expect(function () {
          expiringLocalStorage.ttl('foo', 'bloop', {});
        }).toThrowError(/milliseconds must be a number!/);
      });
    });

    describe('when milliseconds is provided', function () {
      it('should store an item to localStorage with an `expiresOn` date offset by the number of milliseconds', function () {
        expiringLocalStorage.ttl('foo', 'bump', 5000);
        expect(JSON.parse(localStorage.getItem('foo')));
      });
    });
  });

  describe('the `getItem` method', function () {
    it('should be possible to retrieve items from localStorage', function () {
      localStorage.foo = 'bonk';
      expect(expiringLocalStorage.getItem('foo')).toBe('bonk');
    });

    describe('before the `expiresOn` date', function () {
      beforeEach(function () {
        expiringLocalStorage.ttl('foo', 'bonk', 1000);
      });

      it('should return the unwrapped payload', function () {
        expect(expiringLocalStorage.getItem('foo')).toBe('bonk');
      });
    });

    describe('after the expires on date', function () {
      beforeEach(function () {
        expiringLocalStorage.ttl('foo', 'bonk', -1000);
      });

      it('should return null', function () {
        expect(expiringLocalStorage.getItem('foo')).toBe(null);
      });
    });

    it('should extend the expiration date upon read', function (done) {
      function getExpiration () {
        return Date.parse(JSON.parse(localStorage.getItem('foo'))['@']);
      }

      expiringLocalStorage.setItem('foo', 'womp');

      var exp1 = getExpiration();

      setTimeout(function () {
        try {
          expiringLocalStorage.getItem('foo');
          expect(getExpiration()).toBeGreaterThan(exp1);
          done();
        } catch (err) {
          done(err);
        }
      }, 200);
    });
  });

  describe('the `getItem` method', function () {
    it('should delegate to the localStorage.removeItem method', function () {
      localStorage.foo = 'tada';
      expect(localStorage.foo).toBe('tada');
      expiringLocalStorage.removeItem('foo');
      expect(localStorage.getItem('foo')).toBe(null);
    });
  });

  describe('the `removeExpiredItems` method', function () {
    it('should cull any expired records from localStorage', function () {
      expiringLocalStorage.ttl('current', 'test', 10000);
      expiringLocalStorage.ttl('expired', 'test', -10000);

      expect(localStorage.getItem('current')).not.toBe(null);
      expect(localStorage.getItem('expired')).not.toBe(null);

      pathfora.utils.store.removeExpiredItems();

      expect(localStorage.getItem('current')).not.toBe(null);
      expect(localStorage.getItem('expired')).toBe(null);
    });
  });
});
