/** @module pathfora */
import addCallback from './add-callback'
import onDOMready from './on-dom-ready'
import initializePageViews from './init-pageviews'
import triggerWidgets from './trigger-widgets'

import initializeWidgets from './widgets/init-widgets'
import previewWidgets from './widgets/preview-widgets'
import showWidget from './widgets/show-widget'
import clearAll from './widgets/clear-all'
import reinitializePrioritizedWidgets from './widgets/reinit-prioritized-widgets'
import Message from './widgets/message'
import Subscription from './widgets/subscription'
import Form from './widgets/form'
import SiteGate from './widgets/gate'

import Inline from './inline/inline'
import initializeInline from './inline/init-inline'

import initializeABTesting from './ab-test/init-ab-test'
import ABTest from './ab-test/ab-test'

import integrateWithFacebook from './integrations/facebook'
import integrateWithGoogle from './integrations/google'


window.Pathfora = function () {
  this.version = '0.1.4';
  this.callbacks = [];
  this.acctid = '';
  this.locale = 'en-US';
  this.dateOptions = {};
  this.DOMLoaded = false;
  this.triggeredWidgets = {};
  this.customData = {};

  this.addCallback = addCallback;
  this.initializePageViews = initializePageViews;
  this.onDOMready = onDOMready;

  this.initializeInline = initializeInline;

  this.triggerWidgets = triggerWidgets;
  this.initializeWidgets = initializeWidgets;
  this.previewWidgets = previewWidgets;
  this.showWidget = showWidget;
  this.closeWidget = closeWidget;
  this.clearAll = clearAll;
  // this.prioritizedWidgets = prioritizedWidgets;
  this.reinitializePrioritizedWidgets = reinitializePrioritizedWidgets;
  this.Message = Message;
  this.Subscription = Subscription;
  this.Form = Form;
  this.SiteGate = SiteGate;

  this.initializeABTesting = initializeABTesting;
  this.ABTest = ABTest;

  this.integrateWithFacebook = integrateWithFacebook;
  this.integrateWithGoogle = integrateWithGoogle;

  this.initializePageViews();
  this.inline = new Inline(this);
  this.initializeInline();
};
