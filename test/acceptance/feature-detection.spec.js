describe('feature detection', function () {
  function specify (api) {
    var Pathfora = pathfora.constructor;
    var capability;

    describe(`when \`${api}\` API is not present`, function () {
      beforeEach(function () {
        capability = window[api];
        delete window[api];
      });

      afterEach(function () {
        Object.defineProperty(window, api, {
          value: capability,
          configurable: true
        });
      });

      it('should throw an error', function () {
        expect(() => new Pathfora()).toThrowError(
          /The Pathfora SDK requires the Web Storage API!/
        );
      });
    });
  }

  specify('localStorage');

  specify('sessionStorage');
});
