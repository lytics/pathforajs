import censorTrackingKeys from '../../../src/rollup/utils/censor-tracking-keys';

describe('the censorTrackingKeys utility', function () {
  it('should censor by strings using exact match semantics', function () {
    expect(censorTrackingKeys({ foo: 1, foobar: 2, bar: 3 }, ['foo'])).toEqual({
      foobar: 2,
      bar: 3
    });
  });

  it('should censor by regular expression', function () {
    expect(censorTrackingKeys({ foo: 1, foobar: 2, bar: 3 }, [/foo/])).toEqual({
      bar: 3
    });
  });

  it("should censor by regular expression by delegating to that object's test method", function () {
    var regexp = /foo/;
    spyOn(regexp, 'test');
    censorTrackingKeys({ foo: 1, foobar: 2, bar: 3 }, [regexp]);
    expect(regexp.test).toHaveBeenCalledTimes(3);
    expect(regexp.test).toHaveBeenCalledWith('foo');
    expect(regexp.test).toHaveBeenCalledWith('foobar');
    expect(regexp.test).toHaveBeenCalledWith('bar');
  });

  it('should handle censor by multiple strings', function () {
    expect(
      censorTrackingKeys({ foo: 1, foobar: 2, bar: 3 }, ['foo', 'bar'])
    ).toEqual({
      foobar: 2
    });
  });

  it('should censor by multiple regular expressions', function () {
    expect(
      censorTrackingKeys({ foo: 1, foobar: 2, bar: 3 }, [/oob/, /ar/])
    ).toEqual({
      foo: 1
    });
  });

  it('should censor by a mix of strings and regexps', function () {
    expect(
      censorTrackingKeys({ foo: 1, foobar: 2, bar: 3 }, [/oob/, 'bar'])
    ).toEqual({
      foo: 1
    });
  });
});
