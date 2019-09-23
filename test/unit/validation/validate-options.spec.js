import validateOptions from '../../../src/rollup/validation/validate-options';
import globalReset from '../../utils/global-reset';

describe('validateOptions', function () {
  beforeEach(function () {
    globalReset();
  });

  it('should throw an error priority is invalid', function () {
    var options = { priority: 'bad' };
    expect(function () {
      validateOptions(options);
    }).toThrow(new Error('Invalid priority defined in options.'));
  });

  it('should not throw an error priority is empty not defined', function () {
    var options = {},
        options2;

    expect(function () {
      validateOptions(options);
    }).not.toThrow();

    expect(function () {
      validateOptions(options2);
    }).not.toThrow();
  });
});
