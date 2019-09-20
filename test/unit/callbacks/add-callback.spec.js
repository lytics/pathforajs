import globalReset from '../../utils/global-reset';

describe('addCallback', function () {
  describe('when no tag found', function () {
    beforeEach(function () {
      globalReset();
    });

    it('should fall back and add a callback to the callbacks array', function () {
      pathfora.addCallback(function () {
        return;
      });
      expect(pathfora.callbacks.length).toEqual(1);
    });
  });

  describe('when is legacy', function () {
    beforeEach(function (done) {
      window.jstag = null;
      window.lio = {
        loaded: true,
        data: {
          segments: ['one', 'fish', 'two', 'fish'],
          fieldOne: 'f1',
          fieldTwo: 'f2'
        }
      };

      var cb = function (data) {
        window.theData = data;
        done();
      };

      pathfora.addCallback(cb);
    });

    it('should fire the callback immediately', function () {
      expect(window.theData.fieldOne).toEqual('f1');
      expect(window.theData.fieldTwo).toEqual('f2');
      expect(window.theData.segments.length).toEqual(4);
    });
  });

  describe('when is current gen', function () {
    beforeEach(function (done) {
      window.lio = null;
      window.jstag = {
        getEntity: function () {
          return {
            data: {
              user: {
                segments: ['one', 'fish', 'two', 'fish'],
                fieldOne: 'f1',
                fieldTwo: 'f2'
              }
            }
          };
        }
      };

      var cb = function (data) {
        window.theData = data;
        done();
      };

      pathfora.addCallback(cb);
    });

    it('should fire the callback immediately', function () {
      expect(window.theData.fieldOne).toEqual('f1');
      expect(window.theData.fieldTwo).toEqual('f2');
      expect(window.theData.segments.length).toEqual(4);
    });
  });
});
