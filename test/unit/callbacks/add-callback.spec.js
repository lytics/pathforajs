import addCallback from '../../../src/rollup/callbacks/add-callback';

describe('addCallback', function () {
  describe('when no tag found', function () {
    beforeEach(function () {
      window.jstag = undefined;
      window.lio = undefined;
      pathfora.callbacks = [];
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
      window.jstag = undefined;
      window.lio = {
        loaded: true,
        data: {
          segments: ['one', 'fish', 'two', 'fish'],
          field_one: 'f1',
          field_two: 'f2'
        }
      };

      var theData;
      var cb = function (data) {
        window.theData = data;
        done();
      };

      pathfora.addCallback(cb);
    });

    it('should fire the callback immediately', function () {
      expect(window.theData.field_one).toEqual('f1');
      expect(window.theData.field_two).toEqual('f2');
      expect(window.theData.segments.length).toEqual(4);
    });
  });

  describe('when is current gen', function () {
    beforeEach(function (done) {
      window.lio = undefined;
      window.jstag = {
        getEntity: function () {
          return {
            data: {
              user: {
                segments: ['one', 'fish', 'two', 'fish'],
                field_one: 'f1',
                field_two: 'f2'
              }
            }
          };
        }
      };

      var theData;
      var cb = function (data) {
        window.theData = data;
        done();
      };

      pathfora.addCallback(cb);
    });

    it('should fire the callback immediately', function () {
      expect(window.theData.field_one).toEqual('f1');
      expect(window.theData.field_two).toEqual('f2');
      expect(window.theData.segments.length).toEqual(4);
    });
  });
});
