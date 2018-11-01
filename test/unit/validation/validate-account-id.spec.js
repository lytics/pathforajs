import validateAccountId from '../../../src/rollup/validation/validate-account-id';

describe('validateAccountId', function () {
  beforeEach(function () {
    resetLegacyTag();
    pathfora.acctid = '';
  });

  describe('when no tag is installed', function () {
    beforeEach(function () {
      window.lio = undefined;
      window.jstag = undefined;
    });

    it('should throw an error when trying to get account id', function () {
      expect(function () {
        validateAccountId(pathfora);
      }).toThrow(
        new Error('Could not get account id from Lytics Javascript tag.')
      );
    });

    it('should throw an error when jstag exists but no config', function () {
      window.jstag = {};

      expect(function () {
        validateAccountId(pathfora);
      }).toThrow(
        new Error('Could not get account id from Lytics Javascript tag.')
      );
    });

    it('should throw an error when jstag.config exists but no cid', function () {
      window.jstag = {
        config: {}
      };

      expect(function () {
        validateAccountId(pathfora);
      }).toThrow(
        new Error('Could not get account id from Lytics Javascript tag.')
      );
    });

    it('should throw an error when jstag.config.cid exists but length is zero', function () {
      window.jstag = {
        config: {
          cid: []
        }
      };

      expect(function () {
        validateAccountId(pathfora);
      }).toThrow(
        new Error('Could not get account id from Lytics Javascript tag.')
      );
    });

    it('should not throw an error when jstag.config.cid[0] exists', function () {
      window.jstag = {
        config: {
          cid: ['123']
        }
      };

      validateAccountId(pathfora);
      expect(pathfora.acctid).toEqual('123');
    });
  });

  describe('when tag installed is legacy tag', function () {
    beforeEach(function () {
      window.lio = {};
      window.jstag = undefined;
    });

    it('should throw an error if lio has no account id', function () {
      expect(function () {
        validateAccountId(pathfora);
      }).toThrow(
        new Error('Could not get account id from Lytics Javascript tag.')
      );
    });

    it('should throw an error if account id is empty', function () {
      window.lio.account = {
        id: ''
      };

      expect(function () {
        validateAccountId(pathfora);
      }).toThrow(
        new Error('Lytics Javascript tag returned an empty account id.')
      );
    });

    it('should set the account id if defined', function () {
      window.lio.account = {
        id: 'bananas'
      };
      validateAccountId(pathfora);
      expect(pathfora.acctid).toBe('bananas');
    });

    it('should not reset the account id if already defined', function () {
      pathfora.acctid = 'oranges';
      window.lio.account = {
        id: 'bananas'
      };
      validateAccountId(pathfora);
      expect(pathfora.acctid).toBe('oranges');
    });
  });

  describe('when tag installed is current gen', function () {
    beforeEach(function () {
      window.lio = undefined;
      window.jstag = {
        config: {
          cid: []
        }
      };
    });

    it('should throw an error if jstag.config.cid.length is zero', function () {
      expect(function () {
        validateAccountId(pathfora);
      }).toThrow(
        new Error('Could not get account id from Lytics Javascript tag.')
      );
    });

    it('should throw an error if jstag.config.cid[0] is empty string', function () {
      window.jstag.config.cid = [''];

      expect(function () {
        validateAccountId(pathfora);
      }).toThrow(
        new Error('Lytics Javascript tag returned an empty account id.')
      );
    });

    it('should set the account id if defined', function () {
      window.jstag.config.cid = ['123'];

      validateAccountId(pathfora);
      expect(pathfora.acctid).toBe('123');
    });

    it('should not reset the account id if already defined', function () {
      pathfora.acctid = 'oranges';
      window.jstag.config.cid = ['123'];

      validateAccountId(pathfora);
      expect(pathfora.acctid).toBe('oranges');
    });
  });
});
