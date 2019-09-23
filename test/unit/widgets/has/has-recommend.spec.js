import hasRecommend from '../../../../src/rollup/widgets/has/has-recommend';
import globalReset from '../../../utils/global-reset';

describe('hasRecommend', function () {
  beforeEach(function () {
    globalReset();
  });

  it('should return true if widget has the recommend setting', function () {
    var widget = {
      recommend: {
        collection: 'bb5ecbeadb9e572d66cd83d62d3dcd09'
      }
    };
    expect(hasRecommend(widget)).toBeTruthy();
  });

  it('should return false if widget does not have the recommend setting', function () {
    var widget = {};
    expect(hasRecommend(widget)).toBeFalsy();

    widget.recommend = {};
    expect(hasRecommend(widget)).toBeFalsy();
  });
});
