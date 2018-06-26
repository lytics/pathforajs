import preloadLio from '../../../src/rollup/widgets/preload-lio';

describe('preloadLio', function() {
  beforeEach(function () {
    window.lio = {};
    pathfora.clearAll();
  });


  it('should execute the callback immediately if lio is not needed', function(done) {
    var widget = {},
        cb = jasmine.createSpy();

    preloadLio(widget, pathfora, cb);
    expect(cb).toHaveBeenCalled();
    done();
  });

  it('should add the callback to pathfora.callbacks if lio is needed', function(done) {
    var widget = { msg: 'Test {{name}}'},
        cb = jasmine.createSpy();

    preloadLio(widget, pathfora, cb);
    expect(cb).not.toHaveBeenCalled();
    expect(pathfora.callbacks.length).toBe(1);

    widget = { recommend: {collection: 'abcd'} };
    preloadLio(widget, pathfora, cb);
    expect(cb).not.toHaveBeenCalled();
    expect(pathfora.callbacks.length).toBe(2);
    done();
  });

  it('should call the callback if lio has been loaded', function(done) {
    var widget = { msg: 'Test {{name}}'},
        cb = jasmine.createSpy();

    window.lio = {
      loaded: true,
      account: {
        id: 123,
      },
      data: {
        name: 'sarah'
      }
    };

    preloadLio(widget, pathfora, cb);
    expect(cb).toHaveBeenCalled();
    expect(pathfora.acctid).toBe(123);

    cb = jasmine.createSpy();
    widget = { recommend: {collection: 'abcd'} };
    preloadLio(widget, pathfora, cb);
    expect(cb).toHaveBeenCalled();
    expect(pathfora.acctid).toBe(123);
    done();
  });
});
