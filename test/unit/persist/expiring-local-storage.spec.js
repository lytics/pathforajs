describe('`expiringLocalStorage` util', function () {
  const expiringLocalStorage = pathfora.utils.store;

  afterEach(function () {
    localStorage.removeItem('foo');
  });

  describe('the `setItem` method', function () {
    describe('when an expiration date is not passed', function () {
      it('should throw default to one year', function () {
        expiringLocalStorage.setItem('foo', 'plop');

        const date = new Date();
        date.setDate(date.getDate() + 365);

        expect(JSON.parse(localStorage.getItem('foo')).expiresOn).toMatch(
          new RegExp(
            '^' +
              date.getFullYear() +
              '-' +
              (date.getMonth() + 1) +
              '-' +
              date.getDate()
          )
        );
      });
    });

    describe('when an expiration date is passed', function () {
      it('should wrap the value in a { payload, expiresOn } tuple and serialize it to localStorage', function () {
        const expiresOn = new Date('December 17, 1995 03:24:00');

        expiringLocalStorage.setItem('foo', 'wow', expiresOn);
        const tuple = JSON.parse(localStorage.getItem('foo'));

        expect(tuple).toEqual({
          payload: 'wow',
          expiresOn: expiresOn.toISOString()
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
  });

  describe('the `getItem` method', function () {
    it('should delegate to the localStorage.removeItem method', function () {
      localStorage.foo = 'tada';
      expect(localStorage.foo).toBe('tada');
      expiringLocalStorage.removeItem('foo');
      expect(localStorage.getItem('foo')).toBe(null);
    });
  });
});
