/** @module pathfora/globals/config */

// globals
import resetDefaultProps from './reset-default-props';
import resetWidgetTracker from './reset-widget-tracker';
import resetDataObject from './reset-data-object';

// ab tests
import createABTestingModePreset from '../ab-test/create-preset';

export var PF_VERSION = '1.0.0',
    PF_LOCALE = 'en-US',
    PF_DATE_OPTIONS = {},
    PREFIX_REC = 'PathforaRecommend_',
    PREFIX_UNLOCK = 'PathforaUnlocked_',
    PREFIX_IMPRESSION = 'PathforaImpressions_',
    PREFIX_CONFIRM = 'PathforaConfirm_',
    PREFIX_CANCEL = 'PathforaCancel_',
    PREFIX_CLOSE = 'PathforaClosed_',
    PREFIX_AB_TEST = 'PathforaTest_',
    PF_PAGEVIEWS = 'PathforaPageView',
    DEFAULT_CHAR_LIMIT = 220,
    DEFAULT_CHAR_LIMIT_STACK = 160,
    WIDTH_BREAKPOINT = 650,
    API_URL = '`{{apiurl}}`',
    CSS_URL = '`{{cssurl}}`',
    ENTITY_FIELD_TEMPLATE_REGEX = '\\{{2}.*?\\}{2}',
    ENTITY_FIELDS = ['msg', 'headline', 'image', 'confirmAction.callback'];

export var defaultPositions = {
  modal: '',
  slideout: 'bottom-left',
  button: 'top-left',
  bar: 'top-absolute'
};

export var callbackTypes = {
  INIT: 'widgetInitialized',
  LOAD: 'widgetLoaded',
  CLICK: 'buttonClicked',
  FORM_SUBMIT: 'formSubmitted',
  MODAL_OPEN: 'modalOpened',
  MODAL_CLOSE: 'modalClosed',
  MODAL_CONFIRM: 'modalConfirm',
  MODAL_CANCEL: 'modalCancel'
};

export var widgetTracker = resetWidgetTracker({});
export var defaultProps = resetDefaultProps({});
export var pathforaDataObject = resetDataObject({});

export var abTestingTypes = {
  '100': createABTestingModePreset(100),
  '50/50': createABTestingModePreset(50, 50),
  '80/20': createABTestingModePreset(80, 20)
};

/* eslint-disable quotes */
export var templates = `{{templates}}`;
/* eslint-enable quotes */
