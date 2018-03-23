/** @module pathfora/widgets/init-widget */

// display conditions
import dateChecker from '../display-conditions/date-checker';
import pageVisitsChecker from '../display-conditions/pageviews/page-visits-checker';
import hideAfterActionChecker from '../display-conditions/hide-after-action-checker';
import urlChecker from '../display-conditions/url-contains/url-checker';
import metaChecker from '../display-conditions/meta-checker';
import impressionsChecker from '../display-conditions/impressions/impressions-checker';
import initializeExitIntent from '../display-conditions/init-exit-intent';
import registerElementWatcher from '../display-conditions/scroll/register-element-watcher';
import initializeScrollWatchers from '../display-conditions/scroll/init-scroll-watchers';
import registerPositionWatcher from '../display-conditions/scroll/register-position-watcher';
import registerManualTriggerWatcher from '../display-conditions/manual-trigger/register-manual-trigger-watcher';
import triggerWidget from '../display-conditions/manual-trigger/trigger-widget';

// widgets
import showWidget from './show-widget';

// globals
import { widgetTracker } from '../globals/config';

// dom
import document from '../dom/document';

// utils
import addClass from '../utils/class/add-class';

/**
 * Determine if a widget should be shown based on display
 * conditions, and if so show the widget
 *
 * @exports initializeWidget
 * @params {object} widget
 */
export default function initializeWidget (widget) {
  var watcher,
      condition = widget.displayConditions,
      pf = this;

  widget.watchers = [];
  widget.listeners = [];

  // NOTE Default cookie expiration is one year from now
  widget.expiration = new Date();
  widget.expiration.setDate(widget.expiration.getDate() + 365);

  if (widget.pushDown) {
    if (
      widget.layout === 'bar' &&
      (widget.position === 'top-fixed' || widget.position === 'top-absolute')
    ) {
      addClass(document.querySelector(widget.pushDown), 'pf-push-down');
    } else {
      throw new Error(
        'Only top positioned bar widgets may have a pushDown property'
      );
    }
  }

  var fields = ['msg', 'headline', 'image', 'confirmAction.callback'];

  pf.entityFieldChecker(fields, widget, function () {
    // display conditions based on page load
    if (condition.date) {
      widget.valid = widget.valid && dateChecker(condition.date);
    }

    if (condition.pageVisits) {
      widget.valid = widget.valid && pageVisitsChecker(condition.pageVisits);
    }

    if (condition.hideAfterAction) {
      widget.valid =
        widget.valid &&
        hideAfterActionChecker(condition.hideAfterAction, widget);
    }

    if (condition.urlContains) {
      widget.valid = widget.valid && urlChecker(condition.urlContains);
    }

    if (condition.metaContains) {
      widget.valid = widget.valid && metaChecker(condition.metaContains);
    }

    widget.valid = widget.valid && condition.showOnInit;

    if (condition.impressions) {
      widget.valid =
        widget.valid && impressionsChecker(condition.impressions, widget);
    }

    if (
      typeof condition.priority !== 'undefined' &&
      widget.valid &&
      widgetTracker.prioritizedWidgets.indexOf(widget) === -1
    ) {
      widgetTracker.prioritizedWidgets.push(widget);
      return;
    }

    // display conditions based on page interaction
    if (condition.showOnExitIntent) {
      initializeExitIntent(widget);
    }

    if (condition.displayWhenElementVisible) {
      watcher = registerElementWatcher(
        condition.displayWhenElementVisible,
        widget
      );
      widget.watchers.push(watcher);
      initializeScrollWatchers(widget);
    }

    if (condition.scrollPercentageToDisplay) {
      watcher = registerPositionWatcher(
        condition.scrollPercentageToDisplay,
        widget
      );
      widget.watchers.push(watcher);
      initializeScrollWatchers(widget);
    }

    if (condition.manualTrigger) {
      watcher = registerManualTriggerWatcher(condition.manualTrigger, widget);
      widget.watchers.push(watcher);
      widgetTracker.readyWidgets.push(widget);

      // if we've already triggered the widget
      // before initializing lets initialize right away
      triggerWidget(widget);
    }

    if (widget.watchers.length === 0 && !condition.showOnExitIntent) {
      if (widget.valid) {
        showWidget(widget);
      }
    }
  });
}
