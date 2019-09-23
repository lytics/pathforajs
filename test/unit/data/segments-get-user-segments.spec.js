import getUserSegments from '../../../src/rollup/data/segments/get-user-segments';
import globalReset from '../../utils/global-reset';

describe('getUserSegments', function () {
  beforeEach(function () {
    globalReset();
  });


  describe('when no tag is installed', function () {
    it('should return default segments if nothing is installed', function () {
      var segments = getUserSegments();
      expect(segments).toEqual(['all']);
    });
  });

  describe('when legacy tag is installed', function () {
    it('should return default segments when no lio.data object', function () {
      window.lio = {};

      var segments = getUserSegments();
      expect(segments).toEqual(['all']);
    });

    it('should return default segments when no lio.data.segments', function () {
      window.lio = {
        data: {}
      };

      var segments = getUserSegments();
      expect(segments).toEqual(['all']);
    });

    it('should return correct segments when lio.data.segments exists', function () {
      window.lio = {
        data: {
          segments: ['found', 'legacy']
        }
      };

      var segments = getUserSegments();
      expect(segments).toEqual(['found', 'legacy']);
    });

    it('should return correct segments when both lio.data.segments and jstag.getSegments() exists', function () {
      window.lio = {
        data: {
          segments: ['found', 'legacy']
        }
      };
      window.jstag = {
        getSegments: function () {
          return ['found', 'current'];
        }
      };

      var segments = getUserSegments();
      expect(segments).toEqual(['found', 'legacy']);
    });
  });

  describe('when current gen tag is installed', function () {
    it('should return default segments when no jstag.getSegments() function', function () {
      window.jstag = {};

      var segments = getUserSegments();
      expect(segments).toEqual(['all']);
    });

    it('should return default segments when jstag.getSegments is not a function', function () {
      window.jstag = {
        getSegments: {}
      };

      var segments = getUserSegments();
      expect(segments).toEqual(['all']);
    });

    it('should return correct segments when jstag.getSegments is function', function () {
      window.jstag = {
        getSegments: function () {
          return ['found', 'current'];
        }
      };

      var segments = getUserSegments();
      expect(segments).toEqual(['found', 'current']);
    });
  });
});
