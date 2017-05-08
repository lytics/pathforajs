/** @module core */

import setCustomColors from './colors/set-custom-colors'
import setupWidgetColors from './colors/setup-widget-colors'

import cancelDelayedWidget from './displayConditions/cancel-delayed-widget'
import compareQueries from './displayConditions/compare-queries'
import incrementImpressions from './displayConditions/increment-impressions'
import initExitIntent from './displayConditions/init-exit-intent'
import initScrollWatchers from './displayConditions/init-scroll-watchers'
import registerDelayedWidget from './displayConditions/register-delayed-widget'
import registerElementWatcher from './displayConditions/register-element-watcher'
import registerManualTriggerWatcher from './displayConditions/register-manual-trigger-watcher'
import registerPositionWatcher from './displayConditions/register-position-watcher'
import removeWatcher from './displayConditions/remove-watcher'
import validateWatchers from './displayConditions/validate-watchers'

export var core = {
  setCustomColors: setCustomColors,
  setupWidgetColors: setupWidgetColors,
  cancelDelayedWidget: cancelDelayedWidget,
  compareQueries: compareQueries,
  incrementImpressions: incrementImpressions,
  initExitIntent: initExitIntent,
  initScrollWatchers: initScrollWatchers,
  registerDelayedWidget: registerDelayedWidget,
  registerElementWatcher: registerElementWatcher,
  registerManualTriggerWatcher: registerManualTriggerWatcher,
  registerPositionWatcher: registerPositionWatcher,
  removeWatcher: removeWatcher,
  validateWatchers: validateWatchers
};