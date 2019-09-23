import inSegment from '../../../src/rollup/data/segments/in-segment';
import globalReset from '../../utils/global-reset';

describe('inSegment', function () {
  describe('when is legacy', function () {
    beforeEach(function () {
      globalReset();

      window.lio = {
        data: {
          segments: ['one', 'fish', 'two', 'fish']
        }
      };
    });

    it('should return true when at least one in array', function () {
      var result = inSegment('one');
      expect(result).toBe(true);
    });

    it('should return true when more than one in array', function () {
      var result = inSegment('fish');
      expect(result).toBe(true);
    });

    it('should return false when not in array', function () {
      var result = inSegment('snail');
      expect(result).toBe(false);
    });
  });

  describe('when is current gen', function () {
    beforeEach(function () {
      window.lio = null;
      window.jstag = {
        getSegments: function () {
          return ['red', 'fish', 'blue', 'fish'];
        }
      };
    });

    it('should return true when at least one in array', function () {
      var result = inSegment('red');
      expect(result).toBe(true);
    });

    it('should return true when more than one in array', function () {
      var result = inSegment('fish');
      expect(result).toBe(true);
    });

    it('should return false when not in array', function () {
      var result = inSegment('snail');
      expect(result).toBe(false);
    });
  });
});
