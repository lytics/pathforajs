// -------------------------
//  GATE
// -------------------------
describe("the gate component", function() {
  it('should open gate when the cookie is not set', function (done) {
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

  it('should not gate when the cookie is already set', function (done) {
    var gate = new pathfora.SiteGate({
      headline: 'Blocking Widget',
      id: 'sitegate-widget-2',
      msg: 'Submit this widget to access the website.'
    });

    pathfora.utils.saveCookie('PathforaUnlocked_' + gate.id, true);

    pathfora.initializeWidgets([gate]);

    var widget = $('#' + gate.id);

    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeFalsy();
      done();
    }, 200);
  });
});