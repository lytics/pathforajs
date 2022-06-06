import globalReset from '../utils/global-reset';

// Prioritized Widget Tests
describe('Prioritized widgets', function () {
  beforeEach(function () {
    globalReset();
  });

  describe('of type "ordered"', function () {
    it('should only show the first valid widget', function (done) {
      var messageBar = new pathfora.Message({
        id: 'messageBar1',
        layout: 'bar',
        msg: 'Welcome to our website'
      });
      var modal = new pathfora.Message({
        id: 'modal2',
        layout: 'modal'
      });

      pathfora.initializeWidgets([messageBar, modal], null, {
        priority: 'ordered'
      });

      var widget1 = $('#' + messageBar.id);
      var widget2 = $('#' + modal.id);

      setTimeout(function () {
        expect(widget1).toBeDefined();
        expect(widget1.hasClass('opened')).toBeTruthy();
        expect(widget2.length).toBe(0);
        done();
      }, 200);
    });

    it('should account for display conditions when determining priority', function (done) {
      pathfora.utils.saveCookie('PathforaPageView', 2);

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

      var anotherMessageBar = new pathfora.Message({
        id: 'anotherMessageBar',
        layout: 'bar',
        msg: 'Welcome to our website',
        displayConditions: {
          pageVisits: 1
        }
      });

      var anotherModal = new pathfora.Message({
        id: 'anotherModal',
        layout: 'modal'
      });

      pathfora.initializeWidgets([messageBar, modal], null, {
        priority: 'ordered'
      });

      pathfora.initializeWidgets([anotherMessageBar, anotherModal], null, {
        priority: 'ordered'
      });

      var widget1 = $('#' + messageBar.id),
          widget2 = $('#' + modal.id),
          widget3 = $('#' + anotherMessageBar.id),
          widget4 = $('#' + anotherModal.id);

      setTimeout(function () {
        expect(widget1.length).toBe(0);
        expect(widget2).toBeDefined();
        expect(widget2.hasClass('opened')).toBeTruthy();
        expect(widget3).toBeDefined();
        expect(widget3.hasClass('opened')).toBeTruthy();
        expect(widget4.length).toBe(0);
        done();
      }, 200);
    });

    it('should work with entity field templates regardless of load time', function (done) {
      window.lio = {};
      var messageBar = new pathfora.Message({
        id: 'messageBar1',
        layout: 'bar',
        msg: 'Welcome to our website {{name}}'
      });
      var modal = new pathfora.Message({
        id: 'modal2',
        layout: 'modal',
        msg: 'Welcome to our website'
      });

      pathfora.initializeWidgets([messageBar, modal], null, {
        priority: 'ordered'
      });

      var widget1 = $('#' + messageBar.id),
          widget2 = $('#' + modal.id);

      setTimeout(function () {
        expect(widget1.length).toBe(0);
        expect(widget2.length).toBe(0);

        window.lio = {
          data: {
            name: 'Sarah'
          },
          account: {
            id: '321'
          },
          loaded: true
        };
        expect(pathfora.callbacks.length).toBe(1);
        pathfora.callbacks[0]();

        setTimeout(function () {
          widget1 = $('#' + messageBar.id);
          widget2 = $('#' + modal.id);
          expect(widget1).toBeDefined();
          expect(widget1.hasClass('opened')).toBeTruthy();
          expect(widget2.length).toBe(0);
          done();
        }, 200);
      }, 200);
    });

    it('should work with content recommendations regardless of load time', function (done) {
      jasmine.Ajax.install();

      window.lio = {
        account: {
          id: '321'
        },
        loaded: true
      };

      var messageBar = new pathfora.Message({
        id: 'messageBar1',
        layout: 'bar',
        msg: 'Welcome to our website'
      });
      var modal = new pathfora.Message({
        id: 'recommendation-modal',
        msg: 'A',
        variant: 3,
        layout: 'modal',
        recommend: {
          collection: 'bb5ecbeadb9e572d66cd83d62d3dcd09'
        }
      });

      pathfora.initializeWidgets([modal, messageBar], null, {
        priority: 'ordered'
      });

      var widget1 = $('#' + messageBar.id),
          widget2 = $('#' + modal.id);

      setTimeout(function () {
        expect(widget1.length).toBe(0);
        expect(widget2.length).toBe(0);

        expect(jasmine.Ajax.requests.mostRecent().url).toBe(
          '//api.lytics.io/api/content/recommend/321/user/_uids/123?contentsegment=bb5ecbeadb9e572d66cd83d62d3dcd09'
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'application/json',
          responseText:
            '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
        });

        setTimeout(function () {
          widget1 = $('#' + messageBar.id);
          widget2 = $('#' + modal.id);
          expect(widget1.length).toBe(0);
          expect(widget2).toBeDefined();
          expect(widget2.hasClass('opened')).toBeTruthy();
          jasmine.Ajax.uninstall();
          done();
        }, 200);
      }, 200);
    });
  });

  describe('with no priority defined', function () {
    it('should attempt to initialize widgets asyncronously', function (done) {
      var messageBar = new pathfora.Message({
        id: 'messageBar1noPriority',
        layout: 'bar',
        msg: 'Welcome to our website {{name}}'
      });
      var modal = new pathfora.Message({
        id: 'modal2noPriority',
        layout: 'modal',
        msg: 'Welcome to our website'
      });

      pathfora.initializeWidgets([messageBar, modal]);

      var widget1 = $('#' + messageBar.id),
          widget2 = $('#' + modal.id);

      setTimeout(function () {
        expect(widget1.length).toBe(0);
        expect(widget2).toBeDefined();
        expect(widget2.hasClass('opened')).toBeTruthy();
        done();
      }, 200);
    });
  });

  describe('with unordered priority defined', function () {
    it('should attempt to initialize widgets asyncronously', function (done) {
      var messageBar = new pathfora.Message({
        id: 'messageBar1noPriority',
        layout: 'bar',
        msg: 'Welcome to our website {{name}}'
      });
      var modal = new pathfora.Message({
        id: 'modal2noPriority',
        layout: 'modal',
        msg: 'Welcome to our website'
      });

      pathfora.initializeWidgets([messageBar, modal], null, {
        priority: 'unordered'
      });

      var widget1 = $('#' + messageBar.id),
          widget2 = $('#' + modal.id);

      setTimeout(function () {
        expect(widget1.length).toBe(0);
        expect(widget2).toBeDefined();
        expect(widget2.hasClass('opened')).toBeTruthy();
        done();
      }, 200);
    });
  });
});
