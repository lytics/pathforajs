import globalReset from '../utils/global-reset';
import {
  createSiteGateWidget,
  expectWidgetVisible,
  expectWidgetClosed,
  confirmWidget,
  fillAndSubmitForm,
} from '../utils/test-helpers';

describe('the gate component', function () {
  beforeEach(function () {
    globalReset();
  });

  it('should open gate when the record is not set', function (done) {
    var gate = createSiteGateWidget({
      headline: 'Blocking Widget',
      id: 'sitegate-widget-1',
      msg: 'Submit this widget to access the website.',
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
      okMessage: 'I Agree',
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
      msg: 'Submit this widget to access the website.',
    });

    pathfora.utils.write('PathforaUnlocked_' + gate.id, true);

    pathfora.initializeWidgets([gate]);

    setTimeout(function () {
      expectWidgetClosed(gate.id);
      done();
    }, 200);
  });
  it('should unlock and close when the confirm button is clicked', function (done) {
    var gate = createSiteGateWidget({
      id: 'sitegate-confirm-unlock',
      showForm: false,
      okMessage: 'I Agree',
    });

    pathfora.initializeWidgets([gate]);

    setTimeout(function () {
      expectWidgetVisible(gate.id);
      confirmWidget(gate.id);

      expect(pathfora.utils.read('PathforaUnlocked_' + gate.id)).toBe('true');

      setTimeout(function () {
        expectWidgetClosed(gate.id);
        done();
      }, 600);
    }, 200);
  });

  it('should unlock once its required fields are filled in', function (done) {
    var gate = createSiteGateWidget({
      id: 'sitegate-form-unlock',
    });

    pathfora.initializeWidgets([gate]);

    setTimeout(function () {
      confirmWidget(gate.id);
      expect(pathfora.utils.read('PathforaUnlocked_' + gate.id)).toBeFalsy();

      fillAndSubmitForm(gate.id, {
        username: 'Ada Lovelace',
        email: 'ada@example.com',
      });
      expect(pathfora.utils.read('PathforaUnlocked_' + gate.id)).toBe('true');
      done();
    }, 200);
  });

  it('should not throw when a position is set on a gate layout', function () {
    var gate = createSiteGateWidget({
      id: 'sitegate-position',
      position: 'middle-center',
    });

    expect(function () {
      pathfora.initializeWidgets([gate]);
    }).not.toThrow();
  });
});
