import hasEntityTemplates from '../../../../src/rollup/widgets/has/has-entity-templates';

describe('hasEntityTemplates', function () {
  beforeEach(function () {
    resetLegacyTag();
  });

  it('should return true if widget has entity templates', function () {
    var widget = {
      msg: 'Hello there, {{name}}'
    };
    expect(hasEntityTemplates(widget)).toBeTruthy();
  });

  it('should return false if widget does not have entity templates', function () {
    var widget = {
      headline: 'Hello there',
      msg: 'Welcome'
    };
    expect(hasEntityTemplates(widget)).toBeFalsy();
  });

  it('should account for functions', function () {
    var widget = {
      confirmAction: {
        callback: function () {
          window.open('{{url}}');
        }
      }
    };
    expect(hasEntityTemplates(widget)).toBeTruthy();

    widget = {
      confirmAction: {
        callback: function () {
          window.open('https://www.google.com/');
        }
      }
    };
    expect(hasEntityTemplates(widget)).toBeFalsy();
  });
});
