import validateAccountId from '../../../src/rollup/validation/validate-account-id';

describe('validateAccountId', function () {
  beforeEach(function () {
    window.lio = {};
    pathfora.acctid = '';
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
