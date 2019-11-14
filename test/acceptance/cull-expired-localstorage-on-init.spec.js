import globalReset from '../utils/global-reset';

describe('Culling expired localStorage on init', function () {
  beforeEach(globalReset);

  it('should cull expired records from localStorage eagerly on init', function () {
    var Pathfora = pathfora.constructor;

    pathfora.utils.store.ttl('expired', 'bonk', -10000);
    pathfora.utils.store.ttl('current', 'bonk', 10000);

    expect(localStorage.getItem('expired')).not.toBe(null);
    expect(localStorage.getItem('current')).not.toBe(null);

    new Pathfora();

    expect(localStorage.getItem('expired')).toBe(null);
    expect(localStorage.getItem('current')).not.toBe(null);
  });
});
