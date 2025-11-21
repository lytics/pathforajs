import globalReset from '../utils/global-reset';
import {
  createSiteGateWidget,
  expectWidgetVisible,
  expectWidgetClosed
} from '../utils/test-helpers';

// -------------------------
//  GATE
// -------------------------
describe('the gate component', function () {
  beforeEach(function () {
    globalReset();
  });

  it('should open gate when the record is not set', function (done) {
    var gate = createSiteGateWidget({
      headline: 'Blocking Widget',
      id: 'sitegate-widget-1',
      msg: 'Submit this widget to access the website.'
    });

    pathfora.initializeWidgets([gate]);

    setTimeout(function () {
      expectWidgetVisible(gate.id);
      done();
    }, 200);
  });

  it('should should work with showForm: false', function (done) {
    var gate = createSiteGateWidget({
      id: 'gate-hide-form',
      headline: 'Gated Site Feature',
      msg: 'Please agree to the terms to proceed.',
      showForm: false,
      okMessage: 'I Agree'
    });

    expect(() => {
      pathfora.initializeWidgets([gate]);
    }).not.toThrow();

    setTimeout(function () {
      expectWidgetVisible(gate.id);
      done();
    }, 200);
  });

  it('should not gate when the record is already set', function (done) {
    var gate = createSiteGateWidget({
      headline: 'Blocking Widget',
      id: 'sitegate-widget-2',
      msg: 'Submit this widget to access the website.'
    });

    pathfora.utils.write('PathforaUnlocked_' + gate.id, true);

    pathfora.initializeWidgets([gate]);

    setTimeout(function () {
      expectWidgetClosed(gate.id);
      done();
    }, 200);
  });
});
