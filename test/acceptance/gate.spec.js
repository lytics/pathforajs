import globalReset from '../utils/global-reset';

// -------------------------
//  GATE
// -------------------------
describe('the gate component', function () {
  beforeEach(function () {
    globalReset();
  });

  it('should open gate when the record is not set', function (done) {
    var gate = new pathfora.SiteGate({
      headline: 'Blocking Widget',
      id: 'sitegate-widget-1',
      msg: 'Submit this widget to access the website.'
    });

    pathfora.initializeWidgets([gate]);

    var widget = $('#' + gate.id);

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      done();
    }, 200);
  });

  it('should not gate when the record is already set', function (done) {
    var gate = new pathfora.SiteGate({
      headline: 'Blocking Widget',
      id: 'sitegate-widget-2',
      msg: 'Submit this widget to access the website.'
    });

    pathfora.utils.write('PathforaUnlocked_' + gate.id, true);

    pathfora.initializeWidgets([gate]);

    var widget = $('#' + gate.id);

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeFalsy();
      done();
    }, 200);
  });
});
