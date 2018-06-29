import validateRecommendationWidget from '../../../src/rollup/validation/validate-recommendation-widget';

describe('validateRecommendationWidget', function () {
  it('should throw an error it has the wrong layout type', function () {
    var widget = { type: 'form' };
    expect(function () {
      validateRecommendationWidget(widget);
    }).toThrow(new Error('Unsupported widget type for content recommendation'));
  });

  it('should throw an error it has the wrong layout type', function () {
    var widget = {
      type: 'message',
      layout: 'bar'
    };
    expect(function () {
      validateRecommendationWidget(widget);
    }).toThrow(new Error('Unsupported layout for content recommendation'));
  });

  it('should throw an error if content was defined that is not default', function () {
    var widget = {
      type: 'message',
      layout: 'slideout',
      content: [
        {
          url: 'https://www.lytics.com/blog/look-at-lytics-predictive',
          title: 'A Look at Lytics Predictive Scoring'
        }
      ]
    };
    expect(function () {
      validateRecommendationWidget(widget);
    }).toThrow(
      new Error('Cannot define recommended content unless it is a default')
    );
  });

  it('should not throw an error if widget has valid config for recommendation', function () {
    var widget = {
      type: 'message',
      layout: 'slideout',
      content: [
        {
          url: 'https://www.lytics.com/blog/look-at-lytics-predictive',
          title: 'A Look at Lytics Predictive Scoring',
          default: true
        }
      ]
    };
    expect(function () {
      validateRecommendationWidget(widget);
    }).not.toThrow();
  });
});
