/** @module pathfora/widgets/set-dependent-data */

// globals
import { DEPENDENT_DATA_SEGMENT, DEPENDENT_DATA_ENTITY_FIELD, widgetTracker } from '../globals/config';


/**
 * Set the dependent data fields on a widget.
 *
 * @exports setDependentData
 * @params {object} widgets
 */
export default function setDependentData(widgets) {

  var i, j;

  var setSegmentData = function(widgetList, segments) {
    var dataWidgets = widgetTracker.dependentDataWidgets;
    var k = 0;

    for (k = 0; k < widgetList.length; k++) {
      var widget = widgetList[k];
      if (!dataWidgets[widget.id]) {
        dataWidgets[widget.id] = {};
      }

      if (segments.length > 0) {
        if (!dataWidgets[widget.id][DEPENDENT_DATA_SEGMENT]) {
          dataWidgets[widget.id][DEPENDENT_DATA_SEGMENT] = segments;
        } else {
          dataWidgets[widget.id][DEPENDENT_DATA_SEGMENT].concat(segments);
        }
      }
    }

    widgetTracker.dependentDataWidgets = dataWidgets;
  };

  var setRuleData = function(widgetList, rule) {
    var dataWidgets = widgetTracker.dependentDataWidgets;
    var k = 0;

    for (k = 0; k < widgetList.length; k++) {
      var widget = widgetList[k];
      if (!dataWidgets[widget.id]) {
        dataWidgets[widget.id] = {};
      }

      if (rule && typeof rule === 'function') {
        // currently we consider all fields to be dependent if a rule function is provided
        // since there isn't a way to know which fields are actually used in a custom function
        dataWidgets[widget.id][DEPENDENT_DATA_ENTITY_FIELD] = ["*"];
      }
    }

    widgetTracker.dependentDataWidgets =dataWidgets;
  };

  // set dependent data for target widgets
  if (widgets.target) {
  for (i = 0; i < widgets.target.length; i++) {
    var target = widgets.target[i];
    setSegmentData(target.widgets, [target.segment]);
    setRuleData(target.widgets, target.rule);
  }
}

  // set dependent data for exclude widgets
  if (widgets.exclude) {
  for (i = 0; i < widgets.exclude.length; i++) {
    var exclude = widgets.exclude[i];
    setSegmentData(exclude.widgets, [exclude.segment]);
  }
}

  // set dependent data for inverse widgets
  if (widgets.inverse) {
  for (i = 0; i < widgets.inverse.length; i++) {
    var segments = [];
    if (widgets.target) {
    for (j = 0; j < widgets.target.length; j++) {
      var targetInverse = widgets.target[j];
      if (targetInverse.segment) {
        segments.push(targetInverse.segment);
      }
    }
  }
  

  if (widgets.exclude) {
    for (j = 0; j < widgets.exclude.length; j++) {
      var excludeInverse = widgets.exclude[j];
      if (excludeInverse.segment) {
        segments.push(excludeInverse.segment);
      }
    }
  }

  setSegmentData(widgets.inverse[i], segments);
}}
}