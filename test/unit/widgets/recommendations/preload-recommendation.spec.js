import preloadRecommendation from '../../../../src/rollup/widgets/recommendations/preload-recommendation';

describe('preloadRecommendation', function () {
  beforeEach(function () {
    window.lio = {};
    pathfora.clearAll();
  });

  it('should execute the callback immediately if recommendation is not needed', function () {
    var widget = {},
        cb = jasmine.createSpy();

    preloadRecommendation(widget, pathfora, cb);
    expect(cb).toHaveBeenCalled();
  });

  it('should validate the recommendation widget', function () {
    var widget = {
      type: 'form',
      recommend: {
        collection: 'blah'
      }
    };

    var cb = jasmine.createSpy();

    expect(function () {
      preloadRecommendation(widget, pathfora, cb);
    }).toThrow(new Error('Unsupported widget type for content recommendation'));

    expect(cb).not.toHaveBeenCalled();
    expect(pathfora.callbacks.length).toBe(0);
  });

  it('should request the recommendation and fill in the content before executing the callback', function () {
    jasmine.Ajax.install();

    window.lio = {
      account: {
        id: 0
      }
    };

    var widget = {
      type: 'message',
      variant: 3,
      layout: 'modal',
      recommend: {
        collection: 'blah',
        visited: false
      }
    };

    var cb = jasmine.createSpy();

    preloadRecommendation(widget, pathfora, cb);
    expect(cb).not.toHaveBeenCalled();

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText:
        '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
    });

    expect(cb).toHaveBeenCalled();
    expect(widget.content.length).toBe(1);

    jasmine.Ajax.uninstall();
  });
});
