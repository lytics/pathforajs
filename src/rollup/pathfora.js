/** @module pathfora */

// global
import { PF_VERSION, PF_LOCALE, PF_DATE_OPTIONS, CSS_URL } from './globals/config';

// dom
import window from './dom/window';
import document from './dom/document';
import onDOMready from './dom/on-dom-ready';

// utils
import { utils } from './utils/utils';

// data
import getDataObject from './data/tracking/get-data-object';

// callbacks
import addCallback from './callbacks/add-callback';

// display conditions
import initializePageViews from './display-conditions/pageviews/init-pageviews';
import triggerWidgets from './display-conditions/manual-trigger/trigger-widgets';
import registerDelayedWidget from './display-conditions/delay/register-delayed-widget';
import entityFieldChecker from './display-conditions/entity-fields/entity-field-checker';
import replaceEntityField from './display-conditions/entity-fields/replace-entity-field';

// widgets
import initializeWidgets from './widgets/init-widgets';
import initializeWidgetArray from './widgets/init-widget-array';
import initializeWidget from './widgets/init-widget';
import previewWidget from './widgets/preview-widget';
import showWidget from './widgets/show-widget';
import closeWidget from './widgets/close-widget';
import clearAll from './widgets/clear-all';
import reinitializePrioritizedWidgets from './widgets/reinit-prioritized-widgets';
import Message from './widgets/message';
import Subscription from './widgets/subscription';
import Form from './widgets/form';
import SiteGate from './widgets/site-gate';

// ab tests
import initializeABTesting from './ab-test/init-ab-test';
import ABTest from './ab-test/ab-test';

// integrations
import integrateWithFacebook from './integrations/facebook';
import integrateWithGoogle from './integrations/google';

// inline
import Inline from './inline/inline';
import initializeInline from './inline/init-inline';

/**
 * Creates a new Pathfora instance
 *
 * @exports Pathfora
 * @class {function} Pathfora
 */
var Pathfora = function () {
  // globals
  this.version = PF_VERSION;
  this.callbacks = [];
  this.acctid = '';
  this.locale = PF_LOCALE;
  this.dateOptions = PF_DATE_OPTIONS;
  this.DOMLoaded = false;
  this.enableGA = false;
  this.customData = {};

  // dom
  this.onDOMready = onDOMready;

  // utils
  this.utils = utils;

  // data
  this.getDataObject = getDataObject;

  // callbacks
  this.addCallback = addCallback;

  // display conditions
  this.initializePageViews = initializePageViews;
  this.triggerWidgets = triggerWidgets;
  this.registerDelayedWidget = registerDelayedWidget;
  this.entityFieldChecker = entityFieldChecker;
  this.replaceEntityField = replaceEntityField;

  // widgets
  this.initializeWidgets = initializeWidgets;
  this.initializeWidgetArray = initializeWidgetArray;
  this.initializeWidget = initializeWidget;
  this.previewWidget = previewWidget;
  this.showWidget = showWidget;
  this.closeWidget = closeWidget;
  this.clearAll = clearAll;
  this.reinitializePrioritizedWidgets = reinitializePrioritizedWidgets;
  this.Message = Message;
  this.Subscription = Subscription;
  this.Form = Form;
  this.SiteGate = SiteGate;

  // ab tests
  this.initializeABTesting = initializeABTesting;
  this.ABTest = ABTest;

  // integations
  this.integrateWithFacebook = integrateWithFacebook;
  this.integrateWithGoogle = integrateWithGoogle;

  // inline
  this.initializeInline = initializeInline;
  this.inline = new Inline(this);
  this.initializeInline();
  this.initializePageViews();

  // add pathfora css
  var head = document.getElementsByTagName('head')[0],
      link = document.createElement('link');

  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', CSS_URL);

  head.appendChild(link);

  // wait until everything else is loaded to prioritize widgets
  var pf = this;
  window.addEventListener('load', function () {
    pf.reinitializePrioritizedWidgets();
  });
};

window.pathfora = window.pathfora || new Pathfora();
