/** @module core/init-widget */

import dateChecker from '../displayConditions/date-checker'
import pageVisitsChecker from '../displayConditions/page-visits-checker'
import hideAfterActionChecker from '../displayConditions/hide-after-action-checker'
import urlChecker from '../displayConditions/urlContains/url-checker'
import impressionsChecker from '../displayConditions/impressions/impressions-checker'
import initializeExitIntent from '../displayConditions/init-exit-intent'
import registerElementWatcher from '../displayConditions/scroll/register-element-watcher'
import initializeScrollWatchers from '../displayConditions/scroll/init-scroll-watchers'
import registerPositionWatcher from '../displayConditions/scroll/register-position-watcher'
import registerManualTriggerWatcher from '../displayConditions/manualTrigger/register-manual-trigger-watcher'
import triggerWidget from '../displayConditions/manualTrigger/trigger-widget'
import addCallback from '../../pathfora/add-callback'
import showWidget from '../../pathfora/widgets/show-widget'



export default function initializeWidget (widget) {
  var watcher,
      condition = widget.displayConditions,
      core = this;

  widget.watchers = [];

  // NOTE Default cookie expiration is one year from now
  this.expiration = new Date();
  this.expiration.setDate(this.expiration.getDate() + 365);

  if (widget.pushDown) {
    if (widget.layout === 'bar' && (widget.position === 'top-fixed' || widget.position === 'top-absolute')) {
      utils.addClass(document.querySelector(widget.pushDown), 'pf-push-down');
    } else {
      throw new Error('Only top positioned bar widgets may have a pushDown property');
    }
  }

  var evalDisplayConditions = function () {
    // display conditions based on page load
    if (condition.date) {
      widget.valid = widget.valid && dateChecker(condition.date);
    }

    if (condition.pageVisits) {
      widget.valid = widget.valid && pageVisitsChecker(condition.pageVisits);
    }

    if (condition.hideAfterAction) {
      widget.valid = widget.valid && hideAfterActionChecker(condition.hideAfterAction, widget);
    }
    if (condition.urlContains) {
      widget.valid = widget.valid && urlChecker(condition.urlContains);
    }

    widget.valid = widget.valid && condition.showOnInit;

    if (condition.impressions) {
      widget.valid = widget.valid && impressionsChecker(condition.impressions, widget);
    }

    if (typeof condition.priority !== 'undefined' && widget.valid && core.prioritizedWidgets.indexOf(widget) === -1) {
      core.prioritizedWidgets.push(widget);
      return;
    }

    // display conditions based on page interaction
    if (condition.showOnExitIntent) {
      initializeExitIntent(widget);
    }

    if (condition.displayWhenElementVisible) {
      watcher = registerElementWatcher(condition.displayWhenElementVisible, widget);
      widget.watchers.push(watcher);
      initializeScrollWatchers(widget);
    }

    if (condition.scrollPercentageToDisplay) {
      watcher = registerPositionWatcher(condition.scrollPercentageToDisplay, widget);
      widget.watchers.push(watcher);
      initializeScrollWatchers(widget);
    }

    if (condition.manualTrigger) {
      watcher = core.registerManualTriggerWatcher(condition.manualTrigger, widget);
      widget.watchers.push(watcher);
      core.readyWidgets.push(widget);

      // if we've already triggered the widget
      // before initializing lets initialize right away
      core.triggerWidget(widget);
    }

    if (widget.watchers.length === 0 && !condition.showOnExitIntent) {
      if (widget.valid) {
        showWidget(widget);
      }
    }
  };

  var regex = /\{{2}.*?\}{2}/g;
  var foundMsg, foundHeadline, foundImage;

  if (typeof widget.msg === 'string') {
    foundMsg = widget.msg.match(regex);
  }

  if (typeof widget.headline === 'string') {
    foundHeadline = widget.headline.match(regex);
  }


  if (typeof widget.image === 'string') {
    foundImage = widget.image.match(regex);
  }

  if ((foundMsg && foundMsg.length > 0) || (foundHeadline && foundHeadline.length > 0) || (foundImage && foundImage.length > 0)) {
    addCallback(function () {
      widget.valid = widget.valid && core.entityFieldChecker(widget, 'msg', foundMsg);
      widget.valid = widget.valid && core.entityFieldChecker(widget, 'headline', foundHeadline);
      widget.valid = widget.valid && core.entityFieldChecker(widget, 'image', foundImage);
      evalDisplayConditions();
    });
  } else {
    evalDisplayConditions();
  }
};