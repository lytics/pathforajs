// var requiresLio = require('../validation/requires-lio');

// Prioritized Widget Tests

describe('PrioritizedWidgets', function () {
  beforeEach(function () {
    localStorage.clear();
    sessionStorage.clear();
    pathfora.clearAll();
  });

  it('should only show the first valid widget if priority is ordered', function (done) {
    var messageBar = new pathfora.Message({
      id: 'messageBar1',
      layout: 'bar',
      msg: 'Welcome to our website'
    });
    var modal = new pathfora.Message({
      id: 'modal2',
      layout: 'modal'
    });

    pathfora.initializeWidgets([messageBar, modal], null, {priority: 'ordered'});

    var widget1 = $('#' + messageBar.id);
    var widget2 = $('#' + modal.id);

    setTimeout(function () {
      expect(widget1).toBeDefined();
      expect(widget1.hasClass('opened')).toBeTruthy();
      expect(widget2.length).toBe(0);
      done();
    }, 200);
  });

  it('should account for display conditions when determining valid ordered priority', function (done) {
    var messageBar = new pathfora.Message({
      id: 'messageBar1',
      layout: 'bar',
      msg: 'Welcome to our website',
      displayConditions: {
        pageVisits: 3
      }
    });
    var modal = new pathfora.Message({
      id: 'modal2',
      layout: 'modal'
    });

    pathfora.initializeWidgets([messageBar, modal], null, {priority: 'ordered'});

    var widget1 = $('#' + messageBar.id);
    var widget2 = $('#' + modal.id);

    setTimeout(function () {
      expect(widget1.length).toBe(0);
      expect(widget2).toBeDefined();
      expect(widget2.hasClass('opened')).toBeTruthy();
      done();
    }, 200);

  });
});

// describe('RequiresLio', function () {
//   it('should return true for a targeted widget', function () {
//     var module = new Pathfora.Message ({
//       id: 'testing requires lio',
//       layout: 'modal'
//     });

//     var modules = {
//       target: [{
//         segment: 'smt_name',
//         widgets: [module]
//       }]
//     };
//   });

//   expect(requiresLio(modules)).toBeTruthy();
// });
