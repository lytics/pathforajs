import validateWidgetPosition from '../../../src/rollup/validation/validate-widget-position';
import globalReset from '../../utils/global-reset';

describe('validateWidgetPosition', function () {
  beforeEach(function () {
    globalReset();
    spyOn(console, 'warn');
  });

  it('should warn about a position that does not fit the layout', function () {
    validateWidgetPosition({}, { layout: 'modal', position: 'top-left' });
    expect(console.warn).toHaveBeenCalledWith(
      'top-left is not a valid position for modal'
    );
  });

  it('should not throw for a position on a gate layout', function () {
    expect(function () {
      validateWidgetPosition({}, { layout: 'gate', position: 'middle-center' });
    }).not.toThrow();
  });

  it('should not throw for a layout it does not recognise', function () {
    expect(function () {
      validateWidgetPosition({}, { layout: 'unknown', position: 'left' });
    }).not.toThrow();
  });
});
