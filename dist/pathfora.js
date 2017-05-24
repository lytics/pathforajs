(function () {
'use strict';

/** @module pathfora/globals/reset-default-props */

/**
 * Reset the values of the default widget configs
 *
 * @exports resetDefaultProps
 * @params {object} obj
 * @returns {object} obj
 */
function resetDefaultProps (obj) {
  obj.generic = {
    className: 'pathfora',
    branding: true,
    responsive: true,
    headline: '',
    themes: {
      dark: {
        background: '#333',
        headline: '#fefefe',
        text: '#aaa',
        close: '#888',
        actionText: '#fff',
        actionBackground: '#444',
        cancelText: '#888',
        cancelBackground: '#333'
      },
      light: {
        background: '#f1f1f1',
        headline: '#444',
        text: '#888',
        close: '#bbb',
        actionText: '#444',
        actionBackground: '#fff',
        cancelText: '#bbb',
        cancelBackground: '#f1f1f1'
      }
    },
    displayConditions: {
      showOnInit: true,
      showOnExitIntent: false,
      showDelay: 0,
      hideAfter: 0,
      displayWhenElementVisible: '',
      scrollPercentageToDisplay: 0
    }
  };

  obj.message = {
    layout: 'modal',
    position: '',
    variant: '1',
    okMessage: 'Confirm',
    cancelMessage: 'Cancel',
    okShow: true,
    cancelShow: true
  };

  obj.subscription = {
    layout: 'modal',
    position: '',
    variant: '1',
    placeholders: {
      email: 'Email'
    },
    okMessage: 'Confirm',
    cancelMessage: 'Cancel',
    okShow: true,
    cancelShow: true
  };

  obj.form = {
    layout: 'modal',
    position: '',
    variant: '1',
    placeholders: {
      name: 'Name',
      title: 'Title',
      email: 'Email',
      message: 'Message',
      company: 'Company',
      phone: 'Phone Number',
      country: 'Country',
      referralEmail: 'Referral Email'
    },
    required: {
      name: true,
      email: true
    },
    fields: {
      company: false,
      phone: false,
      country: false,
      referralEmail: false
    },
    okMessage: 'Send',
    okShow: true,
    cancelMessage: 'Cancel',
    cancelShow: true,
    showSocialLogin: false
  };


  obj.sitegate = {
    layout: 'modal',
    position: '',
    variant: '1',
    placeholders: {
      name: 'Name',
      title: 'Title',
      email: 'Email',
      message: 'Message',
      company: 'Company',
      phone: 'Phone Number',
      country: 'Country',
      referralEmail: 'Referral Email'
    },
    required: {
      name: true,
      email: true
    },
    fields: {
      message: false,
      phone: false,
      country: false,
      referralEmail: false
    },
    okMessage: 'Submit',
    okShow: true,
    cancelShow: false,
    showSocialLogin: false,
    showForm: true
  };

  return obj;
}

/** @module pathfora/globals/reset-widget-tracker */

/**
 * Reset the widgetTracker to an empty state
 *
 * @exports resetDefaultProps
 * @params {object} obj
 * @returns {object} obj
 */
function resetWidgetTracker (obj) {
  obj.delayedWidgets = {};
  obj.openedWidgets = [];
  obj.initializedWidgets = [];
  obj.prioritizedWidgets = [];
  obj.readyWidgets = [];
  obj.triggeredWidgets = {};

  return obj;
}

/** @module pathfora/globals/reset-data-object */

/**
 * Reset the pathforaDataObject to an empty state
 *
 * @exports resetDataObject
 * @params {object} obj
 * @returns {object} obj
 */
function resetDataObject (obj) {
  obj.pageViews = 0;
  obj.timeSpentOnPage = 0;
  obj.closedWidgets = [];
  obj.completedActions = [];
  obj.cancelledActions = [];
  obj.displayedWidgets = [];
  obj.abTestingGroups = [];
  obj.socialNetworks = {};

  return obj;
}

/* module pathfora/ab-test/create-preset */

/**
 * Creates A/B test group distrubutions
 *
 * @exports createABTestingModePreset
 * @params {int} a/b values
 * @returns {object}
 */
function createABTestingModePreset () {
  var groups = [];

  for (var i = 0; i < arguments.length; i++) {
    groups.push(arguments[i]);
  }

  var groupsSum = groups.reduce(function (sum, element) {
    return sum + element;
  });

  // NOTE If groups collapse into a number greater than 1, normalize
  if (groupsSum > 1) {
    var groupsSumRatio = 1 / groupsSum;

    groups = groups.map(function (element) {
      return element * groupsSumRatio;
    });
  }

  return {
    groups: groups,
    groupsNumber: groups.length
  };
}

/** @module pathfora/globals/config */

// globals
// ab tests
var PF_VERSION = '0.1.5';
var PF_LOCALE = 'en-US';
var PF_DATE_OPTIONS = {};
var PREFIX_REC = 'PathforaRecommend_';
var PREFIX_UNLOCK = 'PathforaUnlocked_';
var PREFIX_IMPRESSION = 'PathforaImpressions_';
var PREFIX_CONFIRM = 'PathforaConfirm_';
var PREFIX_CANCEL = 'PathforaCancel_';
var PREFIX_CLOSE = 'PathforaClosed_';
var PREFIX_AB_TEST = 'PathforaTest_';
var PF_PAGEVIEWS = 'PathforaPageView';
var DEFAULT_CHAR_LIMIT = 220;
var DEFAULT_CHAR_LIMIT_STACK = 160;
var WIDTH_BREAKPOINT = 650;
var API_URL = '//api.lytics.io';
var CSS_URL = '//c.lytics.io/static/pathfora.min.css';

var defaultPositions = {
  modal: '',
  slideout: 'bottom-left',
  button: 'top-left',
  bar: 'top-absolute',
  folding: 'bottom-left'
};

var callbackTypes = {
  INIT: 'widgetInitialized',
  LOAD: 'widgetLoaded',
  CLICK: 'buttonClicked',
  FORM_SUBMIT: 'formSubmitted',
  MODAL_OPEN: 'modalOpened',
  MODAL_CLOSE: 'modalClosed',
  MODAL_CONFIRM: 'modalConfirm',
  MODAL_CANCEL: 'modalCancel'
};

var widgetTracker = resetWidgetTracker({});
var defaultProps = resetDefaultProps({});
var pathforaDataObject = resetDataObject({});

var abTestingTypes = {
  '100': createABTestingModePreset(100),
  '50/50': createABTestingModePreset(50, 50),
  '80/20': createABTestingModePreset(80, 20)
};

/* eslint-disable quotes */
var templates = {
  'subscription': {
    'bar': '<div class=\'pf-widget-body\'></div><a class=\'pf-widget-close\'>&times;</a><div class=\'pf-bar-content\'><p class=\'pf-widget-message\'></p><form><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>X</button> <span><input name=\'email\' type=\'email\' placeholder=\'Email\' data-required=\'true\'></span></form></div>',
    'folding': '<a class=\'pf-widget-caption\'><p class=\'pf-widget-headline\'></p><span>&rsaquo;</span> </a><a class=\'pf-widget-caption-left\'><p class=\'pf-widget-headline\'></p><span>&rsaquo;</span></a><div class=\'pf-widget-body\'></div><div class=\'pf-widget-content\'><p class=\'pf-widget-message\'></p><form><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>X</button> <span><input name=\'email\' type=\'email\' data-required=\'true\'></span></form></div>',
    'inline': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><form><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>X</button> <span><input name=\'email\' type=\'email\' data-required=\'true\'></span></form></div></div></div></div></div>',
    'modal': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><a class=\'pf-widget-close\'>&times;</a><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><form><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>X</button> <span><input name=\'email\' type=\'email\' data-required=\'true\'></span></form></div></div></div></div></div>',
    'slideout': '<a class=\'pf-widget-close\'>&times;</a><div class=\'pf-widget-body\'></div><div class=\'pf-widget-content\'><h2 class=\'pf-widget-headline\'></h2><p class=\'pf-widget-message\'></p><form><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>X</button> <span><input name=\'email\' type=\'email\' data-required=\'true\'></span></form></div>'
  },
  'social': {
    'facebookBtn': '<div class=\'social-login-btn facebook-login-btn\'>{{facebook-icon}} <span>Log In</span></div>',
    'googleBtn': '<div class=\'social-login-btn google-login-btn\'>{{google-icon}} <span>Sign In</span></div>',
    'googleMeta': '<meta name=\'google-signin-client_id\' content=\'{{google-clientId}}\'>'
  },
  'sitegate': {
    'modal': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><div class=\'pf-sitegate-social-plugins pf-social-login\'><p name=\'fb-login\' hidden></p><p name=\'google-login\' hidden></p></div><form><input name=\'username\' type=\'text\'> <input name=\'email\' type=\'email\'> <input class=\'pf-field-half-width\' name=\'title\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'company\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'phone\' type=\'text\'> <select class=\'pf-field-half-width\' name=\'country\'><option value=\'\'>Country</option><option value=\'AF\'>Afghanistan</option><option value=\'AL\'>Albania</option><option value=\'DZ\'>Algeria</option><option value=\'AS\'>American Samoa</option><option value=\'AD\'>Andorra</option><option value=\'AG\'>Angola</option><option value=\'AI\'>Anguilla</option><option value=\'AG\'>Antigua &amp; Barbuda</option><option value=\'AR\'>Argentina</option><option value=\'AA\'>Armenia</option><option value=\'AW\'>Aruba</option><option value=\'AU\'>Australia</option><option value=\'AT\'>Austria</option><option value=\'AZ\'>Azerbaijan</option><option value=\'BS\'>Bahamas</option><option value=\'BH\'>Bahrain</option><option value=\'BD\'>Bangladesh</option><option value=\'BB\'>Barbados</option><option value=\'BY\'>Belarus</option><option value=\'BE\'>Belgium</option><option value=\'BZ\'>Belize</option><option value=\'BJ\'>Benin</option><option value=\'BM\'>Bermuda</option><option value=\'BT\'>Bhutan</option><option value=\'BO\'>Bolivia</option><option value=\'BL\'>Bonaire</option><option value=\'BA\'>Bosnia &amp; Herzegovina</option><option value=\'BW\'>Botswana</option><option value=\'BR\'>Brazil</option><option value=\'BC\'>British Indian Ocean Ter</option><option value=\'BN\'>Brunei</option><option value=\'BG\'>Bulgaria</option><option value=\'BF\'>Burkina Faso</option><option value=\'BI\'>Burundi</option><option value=\'KH\'>Cambodia</option><option value=\'CM\'>Cameroon</option><option value=\'CA\'>Canada</option><option value=\'IC\'>Canary Islands</option><option value=\'CV\'>Cape Verde</option><option value=\'KY\'>Cayman Islands</option><option value=\'CF\'>Central African Republic</option><option value=\'TD\'>Chad</option><option value=\'CD\'>Channel Islands</option><option value=\'CL\'>Chile</option><option value=\'CN\'>China</option><option value=\'CI\'>Christmas Island</option><option value=\'CS\'>Cocos Island</option><option value=\'CO\'>Colombia</option><option value=\'CC\'>Comoros</option><option value=\'CG\'>Congo</option><option value=\'CK\'>Cook Islands</option><option value=\'CR\'>Costa Rica</option><option value=\'CT\'>Cote D&#39;Ivoire</option><option value=\'HR\'>Croatia</option><option value=\'CU\'>Cuba</option><option value=\'CB\'>Curacao</option><option value=\'CY\'>Cyprus</option><option value=\'CZ\'>Czech Republic</option><option value=\'DK\'>Denmark</option><option value=\'DJ\'>Djibouti</option><option value=\'DM\'>Dominica</option><option value=\'DO\'>Dominican Republic</option><option value=\'TM\'>East Timor</option><option value=\'EC\'>Ecuador</option><option value=\'EG\'>Egypt</option><option value=\'SV\'>El Salvador</option><option value=\'GQ\'>Equatorial Guinea</option><option value=\'ER\'>Eritrea</option><option value=\'EE\'>Estonia</option><option value=\'ET\'>Ethiopia</option><option value=\'FA\'>Falkland Islands</option><option value=\'FO\'>Faroe Islands</option><option value=\'FJ\'>Fiji</option><option value=\'FI\'>Finland</option><option value=\'FR\'>France</option><option value=\'GF\'>French Guiana</option><option value=\'PF\'>French Polynesia</option><option value=\'FS\'>French Southern Ter</option><option value=\'GA\'>Gabon</option><option value=\'GM\'>Gambia</option><option value=\'GE\'>Georgia</option><option value=\'DE\'>Germany</option><option value=\'GH\'>Ghana</option><option value=\'GI\'>Gibraltar</option><option value=\'GB\'>Great Britain</option><option value=\'GR\'>Greece</option><option value=\'GL\'>Greenland</option><option value=\'GD\'>Grenada</option><option value=\'GP\'>Guadeloupe</option><option value=\'GU\'>Guam</option><option value=\'GT\'>Guatemala</option><option value=\'GN\'>Guinea</option><option value=\'GY\'>Guyana</option><option value=\'HT\'>Haiti</option><option value=\'HW\'>Hawaii</option><option value=\'HN\'>Honduras</option><option value=\'HK\'>Hong Kong</option><option value=\'HU\'>Hungary</option><option value=\'IS\'>Iceland</option><option value=\'IN\'>India</option><option value=\'ID\'>Indonesia</option><option value=\'IA\'>Iran</option><option value=\'IQ\'>Iraq</option><option value=\'IR\'>Ireland</option><option value=\'IM\'>Isle of Man</option><option value=\'IL\'>Israel</option><option value=\'IT\'>Italy</option><option value=\'JM\'>Jamaica</option><option value=\'JP\'>Japan</option><option value=\'JO\'>Jordan</option><option value=\'KZ\'>Kazakhstan</option><option value=\'KE\'>Kenya</option><option value=\'KI\'>Kiribati</option><option value=\'NK\'>Korea North</option><option value=\'KS\'>Korea South</option><option value=\'KW\'>Kuwait</option><option value=\'KG\'>Kyrgyzstan</option><option value=\'LA\'>Laos</option><option value=\'LV\'>Latvia</option><option value=\'LB\'>Lebanon</option><option value=\'LS\'>Lesotho</option><option value=\'LR\'>Liberia</option><option value=\'LY\'>Libya</option><option value=\'LI\'>Liechtenstein</option><option value=\'LT\'>Lithuania</option><option value=\'LU\'>Luxembourg</option><option value=\'MO\'>Macau</option><option value=\'MK\'>Macedonia</option><option value=\'MG\'>Madagascar</option><option value=\'MY\'>Malaysia</option><option value=\'MW\'>Malawi</option><option value=\'MV\'>Maldives</option><option value=\'ML\'>Mali</option><option value=\'MT\'>Malta</option><option value=\'MH\'>Marshall Islands</option><option value=\'MQ\'>Martinique</option><option value=\'MR\'>Mauritania</option><option value=\'MU\'>Mauritius</option><option value=\'ME\'>Mayotte</option><option value=\'MX\'>Mexico</option><option value=\'MI\'>Midway Islands</option><option value=\'MD\'>Moldova</option><option value=\'MC\'>Monaco</option><option value=\'MN\'>Mongolia</option><option value=\'MS\'>Montserrat</option><option value=\'MA\'>Morocco</option><option value=\'MZ\'>Mozambique</option><option value=\'MM\'>Myanmar</option><option value=\'NA\'>Nambia</option><option value=\'NU\'>Nauru</option><option value=\'NP\'>Nepal</option><option value=\'AN\'>Netherland Antilles</option><option value=\'NL\'>Netherlands (Holland, Europe)</option><option value=\'NV\'>Nevis</option><option value=\'NC\'>New Caledonia</option><option value=\'NZ\'>New Zealand</option><option value=\'NI\'>Nicaragua</option><option value=\'NE\'>Niger</option><option value=\'NG\'>Nigeria</option><option value=\'NW\'>Niue</option><option value=\'NF\'>Norfolk Island</option><option value=\'NO\'>Norway</option><option value=\'OM\'>Oman</option><option value=\'PK\'>Pakistan</option><option value=\'PW\'>Palau Island</option><option value=\'PS\'>Palestine</option><option value=\'PA\'>Panama</option><option value=\'PG\'>Papua New Guinea</option><option value=\'PY\'>Paraguay</option><option value=\'PE\'>Peru</option><option value=\'PH\'>Philippines</option><option value=\'PO\'>Pitcairn Island</option><option value=\'PL\'>Poland</option><option value=\'PT\'>Portugal</option><option value=\'PR\'>Puerto Rico</option><option value=\'QA\'>Qatar</option><option value=\'ME\'>Republic of Montenegro</option><option value=\'RS\'>Republic of Serbia</option><option value=\'RE\'>Reunion</option><option value=\'RO\'>Romania</option><option value=\'RU\'>Russia</option><option value=\'RW\'>Rwanda</option><option value=\'NT\'>St Barthelemy</option><option value=\'EU\'>St Eustatius</option><option value=\'HE\'>St Helena</option><option value=\'KN\'>St Kitts-Nevis</option><option value=\'LC\'>St Lucia</option><option value=\'MB\'>St Maarten</option><option value=\'PM\'>St Pierre &amp; Miquelon</option><option value=\'VC\'>St Vincent &amp; Grenadines</option><option value=\'SP\'>Saipan</option><option value=\'SO\'>Samoa</option><option value=\'AS\'>Samoa American</option><option value=\'SM\'>San Marino</option><option value=\'ST\'>Sao Tome &amp; Principe</option><option value=\'SA\'>Saudi Arabia</option><option value=\'SN\'>Senegal</option><option value=\'RS\'>Serbia</option><option value=\'SC\'>Seychelles</option><option value=\'SL\'>Sierra Leone</option><option value=\'SG\'>Singapore</option><option value=\'SK\'>Slovakia</option><option value=\'SI\'>Slovenia</option><option value=\'SB\'>Solomon Islands</option><option value=\'OI\'>Somalia</option><option value=\'ZA\'>South Africa</option><option value=\'ES\'>Spain</option><option value=\'LK\'>Sri Lanka</option><option value=\'SD\'>Sudan</option><option value=\'SR\'>Suriname</option><option value=\'SZ\'>Swaziland</option><option value=\'SE\'>Sweden</option><option value=\'CH\'>Switzerland</option><option value=\'SY\'>Syria</option><option value=\'TA\'>Tahiti</option><option value=\'TW\'>Taiwan</option><option value=\'TJ\'>Tajikistan</option><option value=\'TZ\'>Tanzania</option><option value=\'TH\'>Thailand</option><option value=\'TG\'>Togo</option><option value=\'TK\'>Tokelau</option><option value=\'TO\'>Tonga</option><option value=\'TT\'>Trinidad &amp; Tobago</option><option value=\'TN\'>Tunisia</option><option value=\'TR\'>Turkey</option><option value=\'TU\'>Turkmenistan</option><option value=\'TC\'>Turks &amp; Caicos Is</option><option value=\'TV\'>Tuvalu</option><option value=\'UG\'>Uganda</option><option value=\'UA\'>Ukraine</option><option value=\'AE\'>United Arab Emirates</option><option value=\'GB\'>United Kingdom</option><option value=\'US\'>United States of America</option><option value=\'UY\'>Uruguay</option><option value=\'UZ\'>Uzbekistan</option><option value=\'VU\'>Vanuatu</option><option value=\'VS\'>Vatican City State</option><option value=\'VE\'>Venezuela</option><option value=\'VN\'>Vietnam</option><option value=\'VB\'>Virgin Islands (Brit)</option><option value=\'VA\'>Virgin Islands (USA)</option><option value=\'WK\'>Wake Island</option><option value=\'WF\'>Wallis &amp; Futana Is</option><option value=\'YE\'>Yemen</option><option value=\'ZR\'>Zaire</option><option value=\'ZM\'>Zambia</option><option value=\'ZW\'>Zimbabwe</option></select> <input class=\'pf-field-half-width\' name=\'referralEmail\' type=\'text\'><textarea name=\'message\' rows=\'5\'></textarea><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Submit</button> <button type=\'button\' class=\'pf-widget-btn pf-widget-cancel\'>Cancel</button></form></div></div></div></div></div>'
  },
  'message': {
    'bar': '<a class=\'pf-widget-body\'></a> <a class=\'pf-widget-close\'>&times;</a><div class=\'pf-bar-content\'><p class=\'pf-widget-message\'></p><span><a class=\'pf-widget-btn pf-widget-ok\'>Confirm</a> <a class=\'pf-widget-btn pf-widget-cancel\'>Cancel</a></span></div>',
    'button': '<p class=\'pf-widget-message pf-widget-ok\'></p>',
    'inline': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><a class=\'pf-content-unit\'></a> <a class=\'pf-widget-btn pf-widget-ok\'>Confirm</a></div></div></div></div></div>',
    'modal': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><a class=\'pf-widget-close\'>&times;</a><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><a class=\'pf-content-unit\'></a> <a class=\'pf-widget-btn pf-widget-ok\'>Confirm</a> <a class=\'pf-widget-btn pf-widget-cancel\'>Cancel</a></div></div></div></div></div>',
    'slideout': '<a class=\'pf-widget-close\'>&times;</a><div class=\'pf-widget-body\'></div><div class=\'pf-widget-content\'><h2 class=\'pf-widget-headline\'></h2><p class=\'pf-widget-message\'></p><a class=\'pf-content-unit stack\'></a> <a class=\'pf-widget-btn pf-widget-ok\'>Confirm</a> <a class=\'pf-widget-btn pf-widget-cancel\'>Cancel</a></div>'
  },
  'includes': {},
  'form': {
    'folding': '<a class=\'pf-widget-caption\'><p class=\'pf-widget-headline\'></p><span>&rsaquo;</span> </a><a class=\'pf-widget-caption-left\'><p class=\'pf-widget-headline\'></p><span>&rsaquo;</span></a><div class=\'pf-widget-body\'></div><div class=\'pf-widget-content\'><p class=\'pf-widget-message\'></p><div class=\'pf-social-login\'><p name=\'fb-login\' hidden></p><p name=\'google-login\' hidden></p></div><form><input name=\'username\' type=\'text\'> <input name=\'email\' type=\'email\'> <input class=\'pf-field-half-width\' name=\'title\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'company\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'phone\' type=\'text\'> <select class=\'pf-field-half-width\' name=\'country\'><option value=\'\'>Country</option><option value=\'AF\'>Afghanistan</option><option value=\'AL\'>Albania</option><option value=\'DZ\'>Algeria</option><option value=\'AS\'>American Samoa</option><option value=\'AD\'>Andorra</option><option value=\'AG\'>Angola</option><option value=\'AI\'>Anguilla</option><option value=\'AG\'>Antigua &amp; Barbuda</option><option value=\'AR\'>Argentina</option><option value=\'AA\'>Armenia</option><option value=\'AW\'>Aruba</option><option value=\'AU\'>Australia</option><option value=\'AT\'>Austria</option><option value=\'AZ\'>Azerbaijan</option><option value=\'BS\'>Bahamas</option><option value=\'BH\'>Bahrain</option><option value=\'BD\'>Bangladesh</option><option value=\'BB\'>Barbados</option><option value=\'BY\'>Belarus</option><option value=\'BE\'>Belgium</option><option value=\'BZ\'>Belize</option><option value=\'BJ\'>Benin</option><option value=\'BM\'>Bermuda</option><option value=\'BT\'>Bhutan</option><option value=\'BO\'>Bolivia</option><option value=\'BL\'>Bonaire</option><option value=\'BA\'>Bosnia &amp; Herzegovina</option><option value=\'BW\'>Botswana</option><option value=\'BR\'>Brazil</option><option value=\'BC\'>British Indian Ocean Ter</option><option value=\'BN\'>Brunei</option><option value=\'BG\'>Bulgaria</option><option value=\'BF\'>Burkina Faso</option><option value=\'BI\'>Burundi</option><option value=\'KH\'>Cambodia</option><option value=\'CM\'>Cameroon</option><option value=\'CA\'>Canada</option><option value=\'IC\'>Canary Islands</option><option value=\'CV\'>Cape Verde</option><option value=\'KY\'>Cayman Islands</option><option value=\'CF\'>Central African Republic</option><option value=\'TD\'>Chad</option><option value=\'CD\'>Channel Islands</option><option value=\'CL\'>Chile</option><option value=\'CN\'>China</option><option value=\'CI\'>Christmas Island</option><option value=\'CS\'>Cocos Island</option><option value=\'CO\'>Colombia</option><option value=\'CC\'>Comoros</option><option value=\'CG\'>Congo</option><option value=\'CK\'>Cook Islands</option><option value=\'CR\'>Costa Rica</option><option value=\'CT\'>Cote D&#39;Ivoire</option><option value=\'HR\'>Croatia</option><option value=\'CU\'>Cuba</option><option value=\'CB\'>Curacao</option><option value=\'CY\'>Cyprus</option><option value=\'CZ\'>Czech Republic</option><option value=\'DK\'>Denmark</option><option value=\'DJ\'>Djibouti</option><option value=\'DM\'>Dominica</option><option value=\'DO\'>Dominican Republic</option><option value=\'TM\'>East Timor</option><option value=\'EC\'>Ecuador</option><option value=\'EG\'>Egypt</option><option value=\'SV\'>El Salvador</option><option value=\'GQ\'>Equatorial Guinea</option><option value=\'ER\'>Eritrea</option><option value=\'EE\'>Estonia</option><option value=\'ET\'>Ethiopia</option><option value=\'FA\'>Falkland Islands</option><option value=\'FO\'>Faroe Islands</option><option value=\'FJ\'>Fiji</option><option value=\'FI\'>Finland</option><option value=\'FR\'>France</option><option value=\'GF\'>French Guiana</option><option value=\'PF\'>French Polynesia</option><option value=\'FS\'>French Southern Ter</option><option value=\'GA\'>Gabon</option><option value=\'GM\'>Gambia</option><option value=\'GE\'>Georgia</option><option value=\'DE\'>Germany</option><option value=\'GH\'>Ghana</option><option value=\'GI\'>Gibraltar</option><option value=\'GB\'>Great Britain</option><option value=\'GR\'>Greece</option><option value=\'GL\'>Greenland</option><option value=\'GD\'>Grenada</option><option value=\'GP\'>Guadeloupe</option><option value=\'GU\'>Guam</option><option value=\'GT\'>Guatemala</option><option value=\'GN\'>Guinea</option><option value=\'GY\'>Guyana</option><option value=\'HT\'>Haiti</option><option value=\'HW\'>Hawaii</option><option value=\'HN\'>Honduras</option><option value=\'HK\'>Hong Kong</option><option value=\'HU\'>Hungary</option><option value=\'IS\'>Iceland</option><option value=\'IN\'>India</option><option value=\'ID\'>Indonesia</option><option value=\'IA\'>Iran</option><option value=\'IQ\'>Iraq</option><option value=\'IR\'>Ireland</option><option value=\'IM\'>Isle of Man</option><option value=\'IL\'>Israel</option><option value=\'IT\'>Italy</option><option value=\'JM\'>Jamaica</option><option value=\'JP\'>Japan</option><option value=\'JO\'>Jordan</option><option value=\'KZ\'>Kazakhstan</option><option value=\'KE\'>Kenya</option><option value=\'KI\'>Kiribati</option><option value=\'NK\'>Korea North</option><option value=\'KS\'>Korea South</option><option value=\'KW\'>Kuwait</option><option value=\'KG\'>Kyrgyzstan</option><option value=\'LA\'>Laos</option><option value=\'LV\'>Latvia</option><option value=\'LB\'>Lebanon</option><option value=\'LS\'>Lesotho</option><option value=\'LR\'>Liberia</option><option value=\'LY\'>Libya</option><option value=\'LI\'>Liechtenstein</option><option value=\'LT\'>Lithuania</option><option value=\'LU\'>Luxembourg</option><option value=\'MO\'>Macau</option><option value=\'MK\'>Macedonia</option><option value=\'MG\'>Madagascar</option><option value=\'MY\'>Malaysia</option><option value=\'MW\'>Malawi</option><option value=\'MV\'>Maldives</option><option value=\'ML\'>Mali</option><option value=\'MT\'>Malta</option><option value=\'MH\'>Marshall Islands</option><option value=\'MQ\'>Martinique</option><option value=\'MR\'>Mauritania</option><option value=\'MU\'>Mauritius</option><option value=\'ME\'>Mayotte</option><option value=\'MX\'>Mexico</option><option value=\'MI\'>Midway Islands</option><option value=\'MD\'>Moldova</option><option value=\'MC\'>Monaco</option><option value=\'MN\'>Mongolia</option><option value=\'MS\'>Montserrat</option><option value=\'MA\'>Morocco</option><option value=\'MZ\'>Mozambique</option><option value=\'MM\'>Myanmar</option><option value=\'NA\'>Nambia</option><option value=\'NU\'>Nauru</option><option value=\'NP\'>Nepal</option><option value=\'AN\'>Netherland Antilles</option><option value=\'NL\'>Netherlands (Holland, Europe)</option><option value=\'NV\'>Nevis</option><option value=\'NC\'>New Caledonia</option><option value=\'NZ\'>New Zealand</option><option value=\'NI\'>Nicaragua</option><option value=\'NE\'>Niger</option><option value=\'NG\'>Nigeria</option><option value=\'NW\'>Niue</option><option value=\'NF\'>Norfolk Island</option><option value=\'NO\'>Norway</option><option value=\'OM\'>Oman</option><option value=\'PK\'>Pakistan</option><option value=\'PW\'>Palau Island</option><option value=\'PS\'>Palestine</option><option value=\'PA\'>Panama</option><option value=\'PG\'>Papua New Guinea</option><option value=\'PY\'>Paraguay</option><option value=\'PE\'>Peru</option><option value=\'PH\'>Philippines</option><option value=\'PO\'>Pitcairn Island</option><option value=\'PL\'>Poland</option><option value=\'PT\'>Portugal</option><option value=\'PR\'>Puerto Rico</option><option value=\'QA\'>Qatar</option><option value=\'ME\'>Republic of Montenegro</option><option value=\'RS\'>Republic of Serbia</option><option value=\'RE\'>Reunion</option><option value=\'RO\'>Romania</option><option value=\'RU\'>Russia</option><option value=\'RW\'>Rwanda</option><option value=\'NT\'>St Barthelemy</option><option value=\'EU\'>St Eustatius</option><option value=\'HE\'>St Helena</option><option value=\'KN\'>St Kitts-Nevis</option><option value=\'LC\'>St Lucia</option><option value=\'MB\'>St Maarten</option><option value=\'PM\'>St Pierre &amp; Miquelon</option><option value=\'VC\'>St Vincent &amp; Grenadines</option><option value=\'SP\'>Saipan</option><option value=\'SO\'>Samoa</option><option value=\'AS\'>Samoa American</option><option value=\'SM\'>San Marino</option><option value=\'ST\'>Sao Tome &amp; Principe</option><option value=\'SA\'>Saudi Arabia</option><option value=\'SN\'>Senegal</option><option value=\'RS\'>Serbia</option><option value=\'SC\'>Seychelles</option><option value=\'SL\'>Sierra Leone</option><option value=\'SG\'>Singapore</option><option value=\'SK\'>Slovakia</option><option value=\'SI\'>Slovenia</option><option value=\'SB\'>Solomon Islands</option><option value=\'OI\'>Somalia</option><option value=\'ZA\'>South Africa</option><option value=\'ES\'>Spain</option><option value=\'LK\'>Sri Lanka</option><option value=\'SD\'>Sudan</option><option value=\'SR\'>Suriname</option><option value=\'SZ\'>Swaziland</option><option value=\'SE\'>Sweden</option><option value=\'CH\'>Switzerland</option><option value=\'SY\'>Syria</option><option value=\'TA\'>Tahiti</option><option value=\'TW\'>Taiwan</option><option value=\'TJ\'>Tajikistan</option><option value=\'TZ\'>Tanzania</option><option value=\'TH\'>Thailand</option><option value=\'TG\'>Togo</option><option value=\'TK\'>Tokelau</option><option value=\'TO\'>Tonga</option><option value=\'TT\'>Trinidad &amp; Tobago</option><option value=\'TN\'>Tunisia</option><option value=\'TR\'>Turkey</option><option value=\'TU\'>Turkmenistan</option><option value=\'TC\'>Turks &amp; Caicos Is</option><option value=\'TV\'>Tuvalu</option><option value=\'UG\'>Uganda</option><option value=\'UA\'>Ukraine</option><option value=\'AE\'>United Arab Emirates</option><option value=\'GB\'>United Kingdom</option><option value=\'US\'>United States of America</option><option value=\'UY\'>Uruguay</option><option value=\'UZ\'>Uzbekistan</option><option value=\'VU\'>Vanuatu</option><option value=\'VS\'>Vatican City State</option><option value=\'VE\'>Venezuela</option><option value=\'VN\'>Vietnam</option><option value=\'VB\'>Virgin Islands (Brit)</option><option value=\'VA\'>Virgin Islands (USA)</option><option value=\'WK\'>Wake Island</option><option value=\'WF\'>Wallis &amp; Futana Is</option><option value=\'YE\'>Yemen</option><option value=\'ZR\'>Zaire</option><option value=\'ZM\'>Zambia</option><option value=\'ZW\'>Zimbabwe</option></select> <input class=\'pf-field-half-width\' name=\'referralEmail\' type=\'text\'><textarea name=\'message\' rows=\'5\'></textarea><button type=\'button\' class=\'pf-widget-btn pf-widget-cancel\'>Cancel</button> <button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Send</button></form></div>',
    'inline': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><div class=\'pf-social-login\'><p name=\'fb-login\' hidden></p><p name=\'google-login\' hidden></p></div><form><input name=\'username\' type=\'text\'> <input name=\'email\' type=\'email\'> <input class=\'pf-field-half-width\' name=\'title\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'company\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'phone\' type=\'text\'> <select class=\'pf-field-half-width\' name=\'country\'><option value=\'\'>Country</option><option value=\'AF\'>Afghanistan</option><option value=\'AL\'>Albania</option><option value=\'DZ\'>Algeria</option><option value=\'AS\'>American Samoa</option><option value=\'AD\'>Andorra</option><option value=\'AG\'>Angola</option><option value=\'AI\'>Anguilla</option><option value=\'AG\'>Antigua &amp; Barbuda</option><option value=\'AR\'>Argentina</option><option value=\'AA\'>Armenia</option><option value=\'AW\'>Aruba</option><option value=\'AU\'>Australia</option><option value=\'AT\'>Austria</option><option value=\'AZ\'>Azerbaijan</option><option value=\'BS\'>Bahamas</option><option value=\'BH\'>Bahrain</option><option value=\'BD\'>Bangladesh</option><option value=\'BB\'>Barbados</option><option value=\'BY\'>Belarus</option><option value=\'BE\'>Belgium</option><option value=\'BZ\'>Belize</option><option value=\'BJ\'>Benin</option><option value=\'BM\'>Bermuda</option><option value=\'BT\'>Bhutan</option><option value=\'BO\'>Bolivia</option><option value=\'BL\'>Bonaire</option><option value=\'BA\'>Bosnia &amp; Herzegovina</option><option value=\'BW\'>Botswana</option><option value=\'BR\'>Brazil</option><option value=\'BC\'>British Indian Ocean Ter</option><option value=\'BN\'>Brunei</option><option value=\'BG\'>Bulgaria</option><option value=\'BF\'>Burkina Faso</option><option value=\'BI\'>Burundi</option><option value=\'KH\'>Cambodia</option><option value=\'CM\'>Cameroon</option><option value=\'CA\'>Canada</option><option value=\'IC\'>Canary Islands</option><option value=\'CV\'>Cape Verde</option><option value=\'KY\'>Cayman Islands</option><option value=\'CF\'>Central African Republic</option><option value=\'TD\'>Chad</option><option value=\'CD\'>Channel Islands</option><option value=\'CL\'>Chile</option><option value=\'CN\'>China</option><option value=\'CI\'>Christmas Island</option><option value=\'CS\'>Cocos Island</option><option value=\'CO\'>Colombia</option><option value=\'CC\'>Comoros</option><option value=\'CG\'>Congo</option><option value=\'CK\'>Cook Islands</option><option value=\'CR\'>Costa Rica</option><option value=\'CT\'>Cote D&#39;Ivoire</option><option value=\'HR\'>Croatia</option><option value=\'CU\'>Cuba</option><option value=\'CB\'>Curacao</option><option value=\'CY\'>Cyprus</option><option value=\'CZ\'>Czech Republic</option><option value=\'DK\'>Denmark</option><option value=\'DJ\'>Djibouti</option><option value=\'DM\'>Dominica</option><option value=\'DO\'>Dominican Republic</option><option value=\'TM\'>East Timor</option><option value=\'EC\'>Ecuador</option><option value=\'EG\'>Egypt</option><option value=\'SV\'>El Salvador</option><option value=\'GQ\'>Equatorial Guinea</option><option value=\'ER\'>Eritrea</option><option value=\'EE\'>Estonia</option><option value=\'ET\'>Ethiopia</option><option value=\'FA\'>Falkland Islands</option><option value=\'FO\'>Faroe Islands</option><option value=\'FJ\'>Fiji</option><option value=\'FI\'>Finland</option><option value=\'FR\'>France</option><option value=\'GF\'>French Guiana</option><option value=\'PF\'>French Polynesia</option><option value=\'FS\'>French Southern Ter</option><option value=\'GA\'>Gabon</option><option value=\'GM\'>Gambia</option><option value=\'GE\'>Georgia</option><option value=\'DE\'>Germany</option><option value=\'GH\'>Ghana</option><option value=\'GI\'>Gibraltar</option><option value=\'GB\'>Great Britain</option><option value=\'GR\'>Greece</option><option value=\'GL\'>Greenland</option><option value=\'GD\'>Grenada</option><option value=\'GP\'>Guadeloupe</option><option value=\'GU\'>Guam</option><option value=\'GT\'>Guatemala</option><option value=\'GN\'>Guinea</option><option value=\'GY\'>Guyana</option><option value=\'HT\'>Haiti</option><option value=\'HW\'>Hawaii</option><option value=\'HN\'>Honduras</option><option value=\'HK\'>Hong Kong</option><option value=\'HU\'>Hungary</option><option value=\'IS\'>Iceland</option><option value=\'IN\'>India</option><option value=\'ID\'>Indonesia</option><option value=\'IA\'>Iran</option><option value=\'IQ\'>Iraq</option><option value=\'IR\'>Ireland</option><option value=\'IM\'>Isle of Man</option><option value=\'IL\'>Israel</option><option value=\'IT\'>Italy</option><option value=\'JM\'>Jamaica</option><option value=\'JP\'>Japan</option><option value=\'JO\'>Jordan</option><option value=\'KZ\'>Kazakhstan</option><option value=\'KE\'>Kenya</option><option value=\'KI\'>Kiribati</option><option value=\'NK\'>Korea North</option><option value=\'KS\'>Korea South</option><option value=\'KW\'>Kuwait</option><option value=\'KG\'>Kyrgyzstan</option><option value=\'LA\'>Laos</option><option value=\'LV\'>Latvia</option><option value=\'LB\'>Lebanon</option><option value=\'LS\'>Lesotho</option><option value=\'LR\'>Liberia</option><option value=\'LY\'>Libya</option><option value=\'LI\'>Liechtenstein</option><option value=\'LT\'>Lithuania</option><option value=\'LU\'>Luxembourg</option><option value=\'MO\'>Macau</option><option value=\'MK\'>Macedonia</option><option value=\'MG\'>Madagascar</option><option value=\'MY\'>Malaysia</option><option value=\'MW\'>Malawi</option><option value=\'MV\'>Maldives</option><option value=\'ML\'>Mali</option><option value=\'MT\'>Malta</option><option value=\'MH\'>Marshall Islands</option><option value=\'MQ\'>Martinique</option><option value=\'MR\'>Mauritania</option><option value=\'MU\'>Mauritius</option><option value=\'ME\'>Mayotte</option><option value=\'MX\'>Mexico</option><option value=\'MI\'>Midway Islands</option><option value=\'MD\'>Moldova</option><option value=\'MC\'>Monaco</option><option value=\'MN\'>Mongolia</option><option value=\'MS\'>Montserrat</option><option value=\'MA\'>Morocco</option><option value=\'MZ\'>Mozambique</option><option value=\'MM\'>Myanmar</option><option value=\'NA\'>Nambia</option><option value=\'NU\'>Nauru</option><option value=\'NP\'>Nepal</option><option value=\'AN\'>Netherland Antilles</option><option value=\'NL\'>Netherlands (Holland, Europe)</option><option value=\'NV\'>Nevis</option><option value=\'NC\'>New Caledonia</option><option value=\'NZ\'>New Zealand</option><option value=\'NI\'>Nicaragua</option><option value=\'NE\'>Niger</option><option value=\'NG\'>Nigeria</option><option value=\'NW\'>Niue</option><option value=\'NF\'>Norfolk Island</option><option value=\'NO\'>Norway</option><option value=\'OM\'>Oman</option><option value=\'PK\'>Pakistan</option><option value=\'PW\'>Palau Island</option><option value=\'PS\'>Palestine</option><option value=\'PA\'>Panama</option><option value=\'PG\'>Papua New Guinea</option><option value=\'PY\'>Paraguay</option><option value=\'PE\'>Peru</option><option value=\'PH\'>Philippines</option><option value=\'PO\'>Pitcairn Island</option><option value=\'PL\'>Poland</option><option value=\'PT\'>Portugal</option><option value=\'PR\'>Puerto Rico</option><option value=\'QA\'>Qatar</option><option value=\'ME\'>Republic of Montenegro</option><option value=\'RS\'>Republic of Serbia</option><option value=\'RE\'>Reunion</option><option value=\'RO\'>Romania</option><option value=\'RU\'>Russia</option><option value=\'RW\'>Rwanda</option><option value=\'NT\'>St Barthelemy</option><option value=\'EU\'>St Eustatius</option><option value=\'HE\'>St Helena</option><option value=\'KN\'>St Kitts-Nevis</option><option value=\'LC\'>St Lucia</option><option value=\'MB\'>St Maarten</option><option value=\'PM\'>St Pierre &amp; Miquelon</option><option value=\'VC\'>St Vincent &amp; Grenadines</option><option value=\'SP\'>Saipan</option><option value=\'SO\'>Samoa</option><option value=\'AS\'>Samoa American</option><option value=\'SM\'>San Marino</option><option value=\'ST\'>Sao Tome &amp; Principe</option><option value=\'SA\'>Saudi Arabia</option><option value=\'SN\'>Senegal</option><option value=\'RS\'>Serbia</option><option value=\'SC\'>Seychelles</option><option value=\'SL\'>Sierra Leone</option><option value=\'SG\'>Singapore</option><option value=\'SK\'>Slovakia</option><option value=\'SI\'>Slovenia</option><option value=\'SB\'>Solomon Islands</option><option value=\'OI\'>Somalia</option><option value=\'ZA\'>South Africa</option><option value=\'ES\'>Spain</option><option value=\'LK\'>Sri Lanka</option><option value=\'SD\'>Sudan</option><option value=\'SR\'>Suriname</option><option value=\'SZ\'>Swaziland</option><option value=\'SE\'>Sweden</option><option value=\'CH\'>Switzerland</option><option value=\'SY\'>Syria</option><option value=\'TA\'>Tahiti</option><option value=\'TW\'>Taiwan</option><option value=\'TJ\'>Tajikistan</option><option value=\'TZ\'>Tanzania</option><option value=\'TH\'>Thailand</option><option value=\'TG\'>Togo</option><option value=\'TK\'>Tokelau</option><option value=\'TO\'>Tonga</option><option value=\'TT\'>Trinidad &amp; Tobago</option><option value=\'TN\'>Tunisia</option><option value=\'TR\'>Turkey</option><option value=\'TU\'>Turkmenistan</option><option value=\'TC\'>Turks &amp; Caicos Is</option><option value=\'TV\'>Tuvalu</option><option value=\'UG\'>Uganda</option><option value=\'UA\'>Ukraine</option><option value=\'AE\'>United Arab Emirates</option><option value=\'GB\'>United Kingdom</option><option value=\'US\'>United States of America</option><option value=\'UY\'>Uruguay</option><option value=\'UZ\'>Uzbekistan</option><option value=\'VU\'>Vanuatu</option><option value=\'VS\'>Vatican City State</option><option value=\'VE\'>Venezuela</option><option value=\'VN\'>Vietnam</option><option value=\'VB\'>Virgin Islands (Brit)</option><option value=\'VA\'>Virgin Islands (USA)</option><option value=\'WK\'>Wake Island</option><option value=\'WF\'>Wallis &amp; Futana Is</option><option value=\'YE\'>Yemen</option><option value=\'ZR\'>Zaire</option><option value=\'ZM\'>Zambia</option><option value=\'ZW\'>Zimbabwe</option></select> <input class=\'pf-field-half-width\' name=\'referralEmail\' type=\'text\'><textarea name=\'message\' rows=\'5\'></textarea><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Send</button></form></div></div></div></div></div>',
    'modal': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><a class=\'pf-widget-close\'>&times;</a><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><div class=\'pf-social-login\'><p name=\'fb-login\' hidden></p><p name=\'google-login\' hidden></p></div><form><input name=\'username\' type=\'text\'> <input name=\'email\' type=\'email\'> <input class=\'pf-field-half-width\' name=\'title\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'company\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'phone\' type=\'text\'> <select class=\'pf-field-half-width\' name=\'country\'><option value=\'\'>Country</option><option value=\'AF\'>Afghanistan</option><option value=\'AL\'>Albania</option><option value=\'DZ\'>Algeria</option><option value=\'AS\'>American Samoa</option><option value=\'AD\'>Andorra</option><option value=\'AG\'>Angola</option><option value=\'AI\'>Anguilla</option><option value=\'AG\'>Antigua &amp; Barbuda</option><option value=\'AR\'>Argentina</option><option value=\'AA\'>Armenia</option><option value=\'AW\'>Aruba</option><option value=\'AU\'>Australia</option><option value=\'AT\'>Austria</option><option value=\'AZ\'>Azerbaijan</option><option value=\'BS\'>Bahamas</option><option value=\'BH\'>Bahrain</option><option value=\'BD\'>Bangladesh</option><option value=\'BB\'>Barbados</option><option value=\'BY\'>Belarus</option><option value=\'BE\'>Belgium</option><option value=\'BZ\'>Belize</option><option value=\'BJ\'>Benin</option><option value=\'BM\'>Bermuda</option><option value=\'BT\'>Bhutan</option><option value=\'BO\'>Bolivia</option><option value=\'BL\'>Bonaire</option><option value=\'BA\'>Bosnia &amp; Herzegovina</option><option value=\'BW\'>Botswana</option><option value=\'BR\'>Brazil</option><option value=\'BC\'>British Indian Ocean Ter</option><option value=\'BN\'>Brunei</option><option value=\'BG\'>Bulgaria</option><option value=\'BF\'>Burkina Faso</option><option value=\'BI\'>Burundi</option><option value=\'KH\'>Cambodia</option><option value=\'CM\'>Cameroon</option><option value=\'CA\'>Canada</option><option value=\'IC\'>Canary Islands</option><option value=\'CV\'>Cape Verde</option><option value=\'KY\'>Cayman Islands</option><option value=\'CF\'>Central African Republic</option><option value=\'TD\'>Chad</option><option value=\'CD\'>Channel Islands</option><option value=\'CL\'>Chile</option><option value=\'CN\'>China</option><option value=\'CI\'>Christmas Island</option><option value=\'CS\'>Cocos Island</option><option value=\'CO\'>Colombia</option><option value=\'CC\'>Comoros</option><option value=\'CG\'>Congo</option><option value=\'CK\'>Cook Islands</option><option value=\'CR\'>Costa Rica</option><option value=\'CT\'>Cote D&#39;Ivoire</option><option value=\'HR\'>Croatia</option><option value=\'CU\'>Cuba</option><option value=\'CB\'>Curacao</option><option value=\'CY\'>Cyprus</option><option value=\'CZ\'>Czech Republic</option><option value=\'DK\'>Denmark</option><option value=\'DJ\'>Djibouti</option><option value=\'DM\'>Dominica</option><option value=\'DO\'>Dominican Republic</option><option value=\'TM\'>East Timor</option><option value=\'EC\'>Ecuador</option><option value=\'EG\'>Egypt</option><option value=\'SV\'>El Salvador</option><option value=\'GQ\'>Equatorial Guinea</option><option value=\'ER\'>Eritrea</option><option value=\'EE\'>Estonia</option><option value=\'ET\'>Ethiopia</option><option value=\'FA\'>Falkland Islands</option><option value=\'FO\'>Faroe Islands</option><option value=\'FJ\'>Fiji</option><option value=\'FI\'>Finland</option><option value=\'FR\'>France</option><option value=\'GF\'>French Guiana</option><option value=\'PF\'>French Polynesia</option><option value=\'FS\'>French Southern Ter</option><option value=\'GA\'>Gabon</option><option value=\'GM\'>Gambia</option><option value=\'GE\'>Georgia</option><option value=\'DE\'>Germany</option><option value=\'GH\'>Ghana</option><option value=\'GI\'>Gibraltar</option><option value=\'GB\'>Great Britain</option><option value=\'GR\'>Greece</option><option value=\'GL\'>Greenland</option><option value=\'GD\'>Grenada</option><option value=\'GP\'>Guadeloupe</option><option value=\'GU\'>Guam</option><option value=\'GT\'>Guatemala</option><option value=\'GN\'>Guinea</option><option value=\'GY\'>Guyana</option><option value=\'HT\'>Haiti</option><option value=\'HW\'>Hawaii</option><option value=\'HN\'>Honduras</option><option value=\'HK\'>Hong Kong</option><option value=\'HU\'>Hungary</option><option value=\'IS\'>Iceland</option><option value=\'IN\'>India</option><option value=\'ID\'>Indonesia</option><option value=\'IA\'>Iran</option><option value=\'IQ\'>Iraq</option><option value=\'IR\'>Ireland</option><option value=\'IM\'>Isle of Man</option><option value=\'IL\'>Israel</option><option value=\'IT\'>Italy</option><option value=\'JM\'>Jamaica</option><option value=\'JP\'>Japan</option><option value=\'JO\'>Jordan</option><option value=\'KZ\'>Kazakhstan</option><option value=\'KE\'>Kenya</option><option value=\'KI\'>Kiribati</option><option value=\'NK\'>Korea North</option><option value=\'KS\'>Korea South</option><option value=\'KW\'>Kuwait</option><option value=\'KG\'>Kyrgyzstan</option><option value=\'LA\'>Laos</option><option value=\'LV\'>Latvia</option><option value=\'LB\'>Lebanon</option><option value=\'LS\'>Lesotho</option><option value=\'LR\'>Liberia</option><option value=\'LY\'>Libya</option><option value=\'LI\'>Liechtenstein</option><option value=\'LT\'>Lithuania</option><option value=\'LU\'>Luxembourg</option><option value=\'MO\'>Macau</option><option value=\'MK\'>Macedonia</option><option value=\'MG\'>Madagascar</option><option value=\'MY\'>Malaysia</option><option value=\'MW\'>Malawi</option><option value=\'MV\'>Maldives</option><option value=\'ML\'>Mali</option><option value=\'MT\'>Malta</option><option value=\'MH\'>Marshall Islands</option><option value=\'MQ\'>Martinique</option><option value=\'MR\'>Mauritania</option><option value=\'MU\'>Mauritius</option><option value=\'ME\'>Mayotte</option><option value=\'MX\'>Mexico</option><option value=\'MI\'>Midway Islands</option><option value=\'MD\'>Moldova</option><option value=\'MC\'>Monaco</option><option value=\'MN\'>Mongolia</option><option value=\'MS\'>Montserrat</option><option value=\'MA\'>Morocco</option><option value=\'MZ\'>Mozambique</option><option value=\'MM\'>Myanmar</option><option value=\'NA\'>Nambia</option><option value=\'NU\'>Nauru</option><option value=\'NP\'>Nepal</option><option value=\'AN\'>Netherland Antilles</option><option value=\'NL\'>Netherlands (Holland, Europe)</option><option value=\'NV\'>Nevis</option><option value=\'NC\'>New Caledonia</option><option value=\'NZ\'>New Zealand</option><option value=\'NI\'>Nicaragua</option><option value=\'NE\'>Niger</option><option value=\'NG\'>Nigeria</option><option value=\'NW\'>Niue</option><option value=\'NF\'>Norfolk Island</option><option value=\'NO\'>Norway</option><option value=\'OM\'>Oman</option><option value=\'PK\'>Pakistan</option><option value=\'PW\'>Palau Island</option><option value=\'PS\'>Palestine</option><option value=\'PA\'>Panama</option><option value=\'PG\'>Papua New Guinea</option><option value=\'PY\'>Paraguay</option><option value=\'PE\'>Peru</option><option value=\'PH\'>Philippines</option><option value=\'PO\'>Pitcairn Island</option><option value=\'PL\'>Poland</option><option value=\'PT\'>Portugal</option><option value=\'PR\'>Puerto Rico</option><option value=\'QA\'>Qatar</option><option value=\'ME\'>Republic of Montenegro</option><option value=\'RS\'>Republic of Serbia</option><option value=\'RE\'>Reunion</option><option value=\'RO\'>Romania</option><option value=\'RU\'>Russia</option><option value=\'RW\'>Rwanda</option><option value=\'NT\'>St Barthelemy</option><option value=\'EU\'>St Eustatius</option><option value=\'HE\'>St Helena</option><option value=\'KN\'>St Kitts-Nevis</option><option value=\'LC\'>St Lucia</option><option value=\'MB\'>St Maarten</option><option value=\'PM\'>St Pierre &amp; Miquelon</option><option value=\'VC\'>St Vincent &amp; Grenadines</option><option value=\'SP\'>Saipan</option><option value=\'SO\'>Samoa</option><option value=\'AS\'>Samoa American</option><option value=\'SM\'>San Marino</option><option value=\'ST\'>Sao Tome &amp; Principe</option><option value=\'SA\'>Saudi Arabia</option><option value=\'SN\'>Senegal</option><option value=\'RS\'>Serbia</option><option value=\'SC\'>Seychelles</option><option value=\'SL\'>Sierra Leone</option><option value=\'SG\'>Singapore</option><option value=\'SK\'>Slovakia</option><option value=\'SI\'>Slovenia</option><option value=\'SB\'>Solomon Islands</option><option value=\'OI\'>Somalia</option><option value=\'ZA\'>South Africa</option><option value=\'ES\'>Spain</option><option value=\'LK\'>Sri Lanka</option><option value=\'SD\'>Sudan</option><option value=\'SR\'>Suriname</option><option value=\'SZ\'>Swaziland</option><option value=\'SE\'>Sweden</option><option value=\'CH\'>Switzerland</option><option value=\'SY\'>Syria</option><option value=\'TA\'>Tahiti</option><option value=\'TW\'>Taiwan</option><option value=\'TJ\'>Tajikistan</option><option value=\'TZ\'>Tanzania</option><option value=\'TH\'>Thailand</option><option value=\'TG\'>Togo</option><option value=\'TK\'>Tokelau</option><option value=\'TO\'>Tonga</option><option value=\'TT\'>Trinidad &amp; Tobago</option><option value=\'TN\'>Tunisia</option><option value=\'TR\'>Turkey</option><option value=\'TU\'>Turkmenistan</option><option value=\'TC\'>Turks &amp; Caicos Is</option><option value=\'TV\'>Tuvalu</option><option value=\'UG\'>Uganda</option><option value=\'UA\'>Ukraine</option><option value=\'AE\'>United Arab Emirates</option><option value=\'GB\'>United Kingdom</option><option value=\'US\'>United States of America</option><option value=\'UY\'>Uruguay</option><option value=\'UZ\'>Uzbekistan</option><option value=\'VU\'>Vanuatu</option><option value=\'VS\'>Vatican City State</option><option value=\'VE\'>Venezuela</option><option value=\'VN\'>Vietnam</option><option value=\'VB\'>Virgin Islands (Brit)</option><option value=\'VA\'>Virgin Islands (USA)</option><option value=\'WK\'>Wake Island</option><option value=\'WF\'>Wallis &amp; Futana Is</option><option value=\'YE\'>Yemen</option><option value=\'ZR\'>Zaire</option><option value=\'ZM\'>Zambia</option><option value=\'ZW\'>Zimbabwe</option></select> <input class=\'pf-field-half-width\' name=\'referralEmail\' type=\'text\'><textarea name=\'message\' rows=\'5\'></textarea><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Send</button> <button type=\'button\' class=\'pf-widget-btn pf-widget-cancel\'>Cancel</button></form></div></div></div></div></div>',
    'slideout': '<a class=\'pf-widget-close\'>&times;</a><div class=\'pf-widget-body\'></div><div class=\'pf-widget-content\'><h2 class=\'pf-widget-headline\'></h2><p class=\'pf-widget-message\'></p><div class=\'pf-social-login\'><p name=\'fb-login\' hidden></p><p name=\'google-login\' hidden></p></div><form><input name=\'username\' type=\'text\'> <input name=\'email\' type=\'email\'> <input class=\'pf-field-half-width\' name=\'title\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'company\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'phone\' type=\'text\'> <select class=\'pf-field-half-width\' name=\'country\'><option value=\'\'>Country</option><option value=\'AF\'>Afghanistan</option><option value=\'AL\'>Albania</option><option value=\'DZ\'>Algeria</option><option value=\'AS\'>American Samoa</option><option value=\'AD\'>Andorra</option><option value=\'AG\'>Angola</option><option value=\'AI\'>Anguilla</option><option value=\'AG\'>Antigua &amp; Barbuda</option><option value=\'AR\'>Argentina</option><option value=\'AA\'>Armenia</option><option value=\'AW\'>Aruba</option><option value=\'AU\'>Australia</option><option value=\'AT\'>Austria</option><option value=\'AZ\'>Azerbaijan</option><option value=\'BS\'>Bahamas</option><option value=\'BH\'>Bahrain</option><option value=\'BD\'>Bangladesh</option><option value=\'BB\'>Barbados</option><option value=\'BY\'>Belarus</option><option value=\'BE\'>Belgium</option><option value=\'BZ\'>Belize</option><option value=\'BJ\'>Benin</option><option value=\'BM\'>Bermuda</option><option value=\'BT\'>Bhutan</option><option value=\'BO\'>Bolivia</option><option value=\'BL\'>Bonaire</option><option value=\'BA\'>Bosnia &amp; Herzegovina</option><option value=\'BW\'>Botswana</option><option value=\'BR\'>Brazil</option><option value=\'BC\'>British Indian Ocean Ter</option><option value=\'BN\'>Brunei</option><option value=\'BG\'>Bulgaria</option><option value=\'BF\'>Burkina Faso</option><option value=\'BI\'>Burundi</option><option value=\'KH\'>Cambodia</option><option value=\'CM\'>Cameroon</option><option value=\'CA\'>Canada</option><option value=\'IC\'>Canary Islands</option><option value=\'CV\'>Cape Verde</option><option value=\'KY\'>Cayman Islands</option><option value=\'CF\'>Central African Republic</option><option value=\'TD\'>Chad</option><option value=\'CD\'>Channel Islands</option><option value=\'CL\'>Chile</option><option value=\'CN\'>China</option><option value=\'CI\'>Christmas Island</option><option value=\'CS\'>Cocos Island</option><option value=\'CO\'>Colombia</option><option value=\'CC\'>Comoros</option><option value=\'CG\'>Congo</option><option value=\'CK\'>Cook Islands</option><option value=\'CR\'>Costa Rica</option><option value=\'CT\'>Cote D&#39;Ivoire</option><option value=\'HR\'>Croatia</option><option value=\'CU\'>Cuba</option><option value=\'CB\'>Curacao</option><option value=\'CY\'>Cyprus</option><option value=\'CZ\'>Czech Republic</option><option value=\'DK\'>Denmark</option><option value=\'DJ\'>Djibouti</option><option value=\'DM\'>Dominica</option><option value=\'DO\'>Dominican Republic</option><option value=\'TM\'>East Timor</option><option value=\'EC\'>Ecuador</option><option value=\'EG\'>Egypt</option><option value=\'SV\'>El Salvador</option><option value=\'GQ\'>Equatorial Guinea</option><option value=\'ER\'>Eritrea</option><option value=\'EE\'>Estonia</option><option value=\'ET\'>Ethiopia</option><option value=\'FA\'>Falkland Islands</option><option value=\'FO\'>Faroe Islands</option><option value=\'FJ\'>Fiji</option><option value=\'FI\'>Finland</option><option value=\'FR\'>France</option><option value=\'GF\'>French Guiana</option><option value=\'PF\'>French Polynesia</option><option value=\'FS\'>French Southern Ter</option><option value=\'GA\'>Gabon</option><option value=\'GM\'>Gambia</option><option value=\'GE\'>Georgia</option><option value=\'DE\'>Germany</option><option value=\'GH\'>Ghana</option><option value=\'GI\'>Gibraltar</option><option value=\'GB\'>Great Britain</option><option value=\'GR\'>Greece</option><option value=\'GL\'>Greenland</option><option value=\'GD\'>Grenada</option><option value=\'GP\'>Guadeloupe</option><option value=\'GU\'>Guam</option><option value=\'GT\'>Guatemala</option><option value=\'GN\'>Guinea</option><option value=\'GY\'>Guyana</option><option value=\'HT\'>Haiti</option><option value=\'HW\'>Hawaii</option><option value=\'HN\'>Honduras</option><option value=\'HK\'>Hong Kong</option><option value=\'HU\'>Hungary</option><option value=\'IS\'>Iceland</option><option value=\'IN\'>India</option><option value=\'ID\'>Indonesia</option><option value=\'IA\'>Iran</option><option value=\'IQ\'>Iraq</option><option value=\'IR\'>Ireland</option><option value=\'IM\'>Isle of Man</option><option value=\'IL\'>Israel</option><option value=\'IT\'>Italy</option><option value=\'JM\'>Jamaica</option><option value=\'JP\'>Japan</option><option value=\'JO\'>Jordan</option><option value=\'KZ\'>Kazakhstan</option><option value=\'KE\'>Kenya</option><option value=\'KI\'>Kiribati</option><option value=\'NK\'>Korea North</option><option value=\'KS\'>Korea South</option><option value=\'KW\'>Kuwait</option><option value=\'KG\'>Kyrgyzstan</option><option value=\'LA\'>Laos</option><option value=\'LV\'>Latvia</option><option value=\'LB\'>Lebanon</option><option value=\'LS\'>Lesotho</option><option value=\'LR\'>Liberia</option><option value=\'LY\'>Libya</option><option value=\'LI\'>Liechtenstein</option><option value=\'LT\'>Lithuania</option><option value=\'LU\'>Luxembourg</option><option value=\'MO\'>Macau</option><option value=\'MK\'>Macedonia</option><option value=\'MG\'>Madagascar</option><option value=\'MY\'>Malaysia</option><option value=\'MW\'>Malawi</option><option value=\'MV\'>Maldives</option><option value=\'ML\'>Mali</option><option value=\'MT\'>Malta</option><option value=\'MH\'>Marshall Islands</option><option value=\'MQ\'>Martinique</option><option value=\'MR\'>Mauritania</option><option value=\'MU\'>Mauritius</option><option value=\'ME\'>Mayotte</option><option value=\'MX\'>Mexico</option><option value=\'MI\'>Midway Islands</option><option value=\'MD\'>Moldova</option><option value=\'MC\'>Monaco</option><option value=\'MN\'>Mongolia</option><option value=\'MS\'>Montserrat</option><option value=\'MA\'>Morocco</option><option value=\'MZ\'>Mozambique</option><option value=\'MM\'>Myanmar</option><option value=\'NA\'>Nambia</option><option value=\'NU\'>Nauru</option><option value=\'NP\'>Nepal</option><option value=\'AN\'>Netherland Antilles</option><option value=\'NL\'>Netherlands (Holland, Europe)</option><option value=\'NV\'>Nevis</option><option value=\'NC\'>New Caledonia</option><option value=\'NZ\'>New Zealand</option><option value=\'NI\'>Nicaragua</option><option value=\'NE\'>Niger</option><option value=\'NG\'>Nigeria</option><option value=\'NW\'>Niue</option><option value=\'NF\'>Norfolk Island</option><option value=\'NO\'>Norway</option><option value=\'OM\'>Oman</option><option value=\'PK\'>Pakistan</option><option value=\'PW\'>Palau Island</option><option value=\'PS\'>Palestine</option><option value=\'PA\'>Panama</option><option value=\'PG\'>Papua New Guinea</option><option value=\'PY\'>Paraguay</option><option value=\'PE\'>Peru</option><option value=\'PH\'>Philippines</option><option value=\'PO\'>Pitcairn Island</option><option value=\'PL\'>Poland</option><option value=\'PT\'>Portugal</option><option value=\'PR\'>Puerto Rico</option><option value=\'QA\'>Qatar</option><option value=\'ME\'>Republic of Montenegro</option><option value=\'RS\'>Republic of Serbia</option><option value=\'RE\'>Reunion</option><option value=\'RO\'>Romania</option><option value=\'RU\'>Russia</option><option value=\'RW\'>Rwanda</option><option value=\'NT\'>St Barthelemy</option><option value=\'EU\'>St Eustatius</option><option value=\'HE\'>St Helena</option><option value=\'KN\'>St Kitts-Nevis</option><option value=\'LC\'>St Lucia</option><option value=\'MB\'>St Maarten</option><option value=\'PM\'>St Pierre &amp; Miquelon</option><option value=\'VC\'>St Vincent &amp; Grenadines</option><option value=\'SP\'>Saipan</option><option value=\'SO\'>Samoa</option><option value=\'AS\'>Samoa American</option><option value=\'SM\'>San Marino</option><option value=\'ST\'>Sao Tome &amp; Principe</option><option value=\'SA\'>Saudi Arabia</option><option value=\'SN\'>Senegal</option><option value=\'RS\'>Serbia</option><option value=\'SC\'>Seychelles</option><option value=\'SL\'>Sierra Leone</option><option value=\'SG\'>Singapore</option><option value=\'SK\'>Slovakia</option><option value=\'SI\'>Slovenia</option><option value=\'SB\'>Solomon Islands</option><option value=\'OI\'>Somalia</option><option value=\'ZA\'>South Africa</option><option value=\'ES\'>Spain</option><option value=\'LK\'>Sri Lanka</option><option value=\'SD\'>Sudan</option><option value=\'SR\'>Suriname</option><option value=\'SZ\'>Swaziland</option><option value=\'SE\'>Sweden</option><option value=\'CH\'>Switzerland</option><option value=\'SY\'>Syria</option><option value=\'TA\'>Tahiti</option><option value=\'TW\'>Taiwan</option><option value=\'TJ\'>Tajikistan</option><option value=\'TZ\'>Tanzania</option><option value=\'TH\'>Thailand</option><option value=\'TG\'>Togo</option><option value=\'TK\'>Tokelau</option><option value=\'TO\'>Tonga</option><option value=\'TT\'>Trinidad &amp; Tobago</option><option value=\'TN\'>Tunisia</option><option value=\'TR\'>Turkey</option><option value=\'TU\'>Turkmenistan</option><option value=\'TC\'>Turks &amp; Caicos Is</option><option value=\'TV\'>Tuvalu</option><option value=\'UG\'>Uganda</option><option value=\'UA\'>Ukraine</option><option value=\'AE\'>United Arab Emirates</option><option value=\'GB\'>United Kingdom</option><option value=\'US\'>United States of America</option><option value=\'UY\'>Uruguay</option><option value=\'UZ\'>Uzbekistan</option><option value=\'VU\'>Vanuatu</option><option value=\'VS\'>Vatican City State</option><option value=\'VE\'>Venezuela</option><option value=\'VN\'>Vietnam</option><option value=\'VB\'>Virgin Islands (Brit)</option><option value=\'VA\'>Virgin Islands (USA)</option><option value=\'WK\'>Wake Island</option><option value=\'WF\'>Wallis &amp; Futana Is</option><option value=\'YE\'>Yemen</option><option value=\'ZR\'>Zaire</option><option value=\'ZM\'>Zambia</option><option value=\'ZW\'>Zimbabwe</option></select> <input class=\'pf-field-half-width\' name=\'referralEmail\' type=\'text\'><textarea name=\'message\' rows=\'5\'></textarea><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Send</button> <button type=\'button\' class=\'pf-widget-btn pf-widget-cancel\'>Cancel</button></form></div>'
  },
  'assets': {
    'facebookIcon': '<svg width=\'16\' height=\'16\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 266.89 266.89\'><title>facebookIcon</title><path d=\'M252.16 0h-237.43a14.73 14.73 0 0 0-14.73 14.73v237.43a14.73 14.73 0 0 0 14.73 14.73h127.83v-103.35h-34.79v-40.28h34.78v-29.71c0-34.47 21.05-53.24 51.81-53.24a285.41 285.41 0 0 1 31.08 1.59v36h-21.33c-16.72 0-20 7.95-20 19.61v25.72h39.89l-5.19 40.28h-34.66v103.38h68a14.73 14.73 0 0 0 14.73-14.73v-237.43a14.73 14.73 0 0 0-14.72-14.73z\' fill=\'#3c5a99\'/><path d=\'M218.84 163.54l5.16-40.28h-39.85v-25.72c0-11.66 3.24-19.61 20-19.61h21.33v-36a285.41 285.41 0 0 0-31.08-1.59c-30.75 0-51.81 18.77-51.81 53.24v29.71h-34.82v40.28h34.78v103.32h41.6v-103.35h34.69z\' fill=\'#fff\'/></svg>',
    'googleIcon': '<svg width=\'16\' height=\'16\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 18 18\'><title>googleIcon</title><g><path d=\'M17.64 9.2a10.34 10.34 0 0 0-.16-1.84h-8.48v3.48h4.84a4.14 4.14 0 0 1-1.84 2.72v2.26h3a8.78 8.78 0 0 0 2.64-6.62z\' fill=\'#4285f4\'/><path d=\'M9 18a8.59 8.59 0 0 0 6-2.18l-3-2.26a5.43 5.43 0 0 1-8-2.85h-3v2.29a9 9 0 0 0 8 5z\' fill=\'#34a853\'/><path d=\'M4 10.71a5.32 5.32 0 0 1 0-3.42v-2.29h-3a9 9 0 0 0 0 8l3-2.33z\' fill=\'#fbbc05\'/><path d=\'M9 3.58a4.86 4.86 0 0 1 3.44 1.35l2.56-2.59a8.65 8.65 0 0 0-6-2.34 9 9 0 0 0-8 5l3 2.29a5.36 5.36 0 0 1 5-3.71z\' fill=\'#ea4335\'/><path d=\'M0 0h18v18h-18v-18z\' fill=\'none\'/></g></svg>',
    'lytics': '<a href=\'https://www.getlytics.com?utm_source=pathfora&amp;utm_medium=web&amp;utm_campaign=personalization\' target=\'_blank\'><svg width=\'120\' height=\'30\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 143.97 36.85\'><title>lytics</title><path d=\'M122.26 11.36h.1c1.41-.39 2.33-1 2.2-2.94 0-.7-.28-1.06-.69-1.06-.7 0-1.3 1.38-1.37 1.53l-.09.21a3.22 3.22 0 0 0-.5 2 .38.38 0 0 0 .36.25\' transform=\'translate(-.85)\'/><path d=\'M88 5.27a.76.76 0 0 0-1.09.73v.18a1.57 1.57 0 0 0 .45.93 8.78 8.78 0 0 0 6 2.6h.21a.12.12 0 0 1 .13.14 32 32 0 0 1-2 8 1.76 1.76 0 0 1-1 1.17.6.6 0 0 1-.26-.07c-.32-.16-.74-.41-1.18-.67a13.8 13.8 0 0 0-1.72-.93 15.11 15.11 0 0 0-3.88-1.22c-1.81-.2-4.09.56-4.47 2.52a4.7 4.7 0 0 0 2 4.47 10 10 0 0 0 5.19 1.75 6.34 6.34 0 0 0 3.74-1.24l.47-.39c.27-.23.82-.69 1.13-.9a.12.12 0 0 1 .15 0l.5.41a7.84 7.84 0 0 0 .62.5 7.72 7.72 0 0 0 3.54 1.33h.58a5.21 5.21 0 0 0 2.62-.66.12.12 0 0 1 .15 0 2.19 2.19 0 0 0 1.6.68c1.75 0 3.76-1.83 5.06-3.29v.1a8.92 8.92 0 0 1-.83 2.69 7.53 7.53 0 0 1-1.06 1.33l-.47.52a35.84 35.84 0 0 0-3 4.07c-.9 1.43-1.67 2.95-1.31 4.35a3.2 3.2 0 0 0 1.65 2 3.39 3.39 0 0 0 1.67.49c2.09 0 3.25-2.42 3.75-3.86a16.38 16.38 0 0 0 .82-4c.07-.6.14-1.22.25-1.94l.08-.59a3.35 3.35 0 0 1 .8-2.22c.64-.57 1.28-1.17 1.89-1.74l.09-.09.72-.67.28-.25a.12.12 0 0 1 .2.06 4.52 4.52 0 0 0 .71 1.61 3.32 3.32 0 0 0 2.73 1.36 4 4 0 0 0 2.76-1.15 5.29 5.29 0 0 0 .53-.72.12.12 0 0 1 .2 0 2.1 2.1 0 0 0 .47.49 3.52 3.52 0 0 0 2.05.91c.87 0 1.54-.6 2.48-1.5a2.14 2.14 0 0 0 .29-.4.12.12 0 0 1 .21 0l.23.39a4.53 4.53 0 0 0 3.12 2 9.87 9.87 0 0 0 1.46.12 5.58 5.58 0 0 0 4.47-2.09.12.12 0 0 1 .19 0 5.41 5.41 0 0 0 .84.93 5.35 5.35 0 0 0 3.32 1.21 3 3 0 0 0 3.05-2.22 1.33 1.33 0 0 1 1.23-1.29c.67-.25 2.25-.95 2.45-2.16a.77.77 0 0 0-.14-.66.69.69 0 0 0-.55-.23 5.83 5.83 0 0 0-2.08.81 10.5 10.5 0 0 1-1 .46.12.12 0 0 1-.14 0 2.78 2.78 0 0 1-.24-.67 3.12 3.12 0 0 0-.12-.4 32.49 32.49 0 0 0-1.77-3.46 4.53 4.53 0 0 1-.25-.57 3 3 0 0 0-.61-1.1 2.89 2.89 0 0 0-1.53-.45.74.74 0 0 0-.8.42 1.23 1.23 0 0 0 .07.9l.08.26a2.77 2.77 0 0 1-.06.76 3.65 3.65 0 0 1-.69 1.44l-.14.18c-.3.37-.52.65-.67.87a.68.68 0 0 0-.28-.06.67.67 0 0 0-.52.25 3.21 3.21 0 0 0-.47 1.67v.06a13.23 13.23 0 0 0-.76 1.12c-.16.26-.31.5-.42.63a3.3 3.3 0 0 1-2.47 1 3.65 3.65 0 0 1-2.42-.95 1.76 1.76 0 0 1-.56-1.35 6.7 6.7 0 0 1 1.92-4.19 2.4 2.4 0 0 1 1.44-.77.66.66 0 0 1 .32-.02c.4.21.38.32.07.91a1.77 1.77 0 0 0-.3 1.26.48.48 0 0 0 .24.3l.72.4a.51.51 0 0 0 .63-.1 3.19 3.19 0 0 0 .83-3.35c-.48-1.07-1.71-1.59-3.25-1.34a6.61 6.61 0 0 0-4.9 5l-.09.44-.38.66c-.52.92-1.16 2.06-2 2.37a2.1 2.1 0 0 1-.68.17h-.06a3.3 3.3 0 0 1 .12-1.07l.08-.39a15.21 15.21 0 0 1 .78-2.53 12.54 12.54 0 0 0 .91-3.4 1.45 1.45 0 0 0-.4-1.11 1.2 1.2 0 0 0-.86-.41.94.94 0 0 0-.82.51 22.22 22.22 0 0 0-2.13 6.27v.06l-.28.37a7 7 0 0 1-2.37 2.32 1 1 0 0 1-1.22-.23 2 2 0 0 1-.21-1.7c.35-1.23.66-2.49 1-3.75a34.52 34.52 0 0 0 1.23-3.54l.1-.08c.85-.15 1.72-.3 2.56-.41.28 0 .56-.05.85-.07h.63a.5.5 0 0 0 .42-.31 1 1 0 0 0-.07-.88 1.79 1.79 0 0 0-1.4-.74h-.08c-.61 0-1.31 0-2 .08l-.13-.17a8.47 8.47 0 0 0 .46-2.67 2.68 2.68 0 0 0-.32-1.49 1.38 1.38 0 0 0-1.5-.67 2.07 2.07 0 0 0-1.13 1.48 14.92 14.92 0 0 0-.41 1.59c-.27.62-.56 1.33-.85 2.1l-.28.22h-.84a17.31 17.31 0 0 0-2.62.32 1.21 1.21 0 0 0-.91.76.81.81 0 0 0 .08.66 2.49 2.49 0 0 0 1.37 1 2 2 0 0 0 .49.06 8.68 8.68 0 0 0 1.61-.23h.14c-.12.41-.24.83-.35 1.26-.21.82-.37 1.58-.48 2.3-.29.51-.6 1-.94 1.49a12.48 12.48 0 0 1-1.83 1.9l-.23.38a39.76 39.76 0 0 1 .76-5.35.49.49 0 0 0-.16-.46l-.69-.59a.51.51 0 0 0-.33-.12h-.25a.38.38 0 0 0-.33.19c-.51.9-.9 1.7-1.27 2.47a23.51 23.51 0 0 1-2.07 3.66 2.8 2.8 0 0 1-2.05 1 1.06 1.06 0 0 1-.72-.23v-.08a1.38 1.38 0 0 0-.12-.41l-.15-.25v-.14a21.73 21.73 0 0 1 1.38-6.69 1.88 1.88 0 0 0 .15-1.67 1 1 0 0 0-.9-.39h-.25c-1.18.12-2.27 2.69-2.28 2.72a15.2 15.2 0 0 0-1 6.62.12.12 0 0 1-.06.12 3.83 3.83 0 0 1-2 .58c-.76-.06-1.72-.25-3.45-1.72a.12.12 0 0 1 0-.15 27 27 0 0 0 2.88-9.57 1.32 1.32 0 0 1 .28-.87 3.25 3.25 0 0 1 .87-.11h.14a17 17 0 0 0 2.8-.36 11.86 11.86 0 0 0 3.94-1.74 5.54 5.54 0 0 0 2.72-3.76 3.2 3.2 0 0 0-.85-2.5 3.83 3.83 0 0 0-3.09-1.2 8.54 8.54 0 0 0-5.3 2.31 21.6 21.6 0 0 0-2.48 3.16 6.87 6.87 0 0 0-.37.7 2 2 0 0 1-.92 1.19 6.38 6.38 0 0 1-4.63-1.36 5 5 0 0 0-.77-.52l-.43-.21zm14.3-2.93l.34-.11a2.16 2.16 0 0 1 2 .23.69.69 0 0 1 .1.6 4 4 0 0 1-1.64 2.3 11.44 11.44 0 0 1-5.63 1.88.12.12 0 0 1-.12-.18 9.82 9.82 0 0 1 5-4.73zm-17.3 19.95a4.36 4.36 0 0 1-3.39-2.16 1.22 1.22 0 0 1 .1-1.34 1.67 1.67 0 0 1 1.29-.44c2 0 5.08 1.71 6.41 2.47a.12.12 0 0 1 0 .18c-.74 1-2.16 1.42-4.44 1.29zm20.4 6.43c-.17 1-.35 1.94-.52 2.67-.33 1.4-.82 2.36-2.2 2.8h-.35a.39.39 0 0 1-.41-.14c-.09-.17-.25-1 1.71-3.86l.07-.1c.51-.76 1.1-1.54 1.65-2.23a.12.12 0 0 1 .22.1zm31.7-11.51h.2a9.64 9.64 0 0 1 1.55 2.64.12.12 0 0 1-.11.17 4.59 4.59 0 0 1-2.08-.47.72.72 0 0 1-.42-.43 3.23 3.23 0 0 1 .86-1.9zm1.85 5a.73.73 0 0 1-.88.61 3.3 3.3 0 0 1-1.65-.5 2.36 2.36 0 0 1-.65-1.05.12.12 0 0 1 .23-.17 6.66 6.66 0 0 0 2.42.9h.58v.18zM.85 21.74v-8h3.52a2.51 2.51 0 1 1 0 5h-2.12v3h-1.4zm4.69-5.49a1.26 1.26 0 0 0-1.37-1.25h-1.92v2.54h1.92a1.26 1.26 0 0 0 1.37-1.3zM7.79 17.74a4 4 0 0 1 4.09-4.14 4 4 0 0 1 4.12 4.14 4 4 0 0 1-4.09 4.14 4 4 0 0 1-4.12-4.14zm6.74 0a2.66 2.66 0 1 0-5.3 0 2.66 2.66 0 1 0 5.3 0z\' transform=\'translate(-.85)\'/><path d=\'M22.35 21.74l-1.56-5.9-1.55 5.9h-1.49l-2.29-8h1.57l1.56 6.16 1.66-6.16h1.12l1.66 6.16 1.55-6.16h1.57l-2.28 8h-1.52zM27.07 21.74v-8h5.48v1.26h-4.07v2h4v1.24h-4v2.26h4.07v1.24h-5.48z\'/><path d=\'M39.42 21.74l-1.77-3h-1.4v3h-1.4v-8h3.51a2.43 2.43 0 0 1 2.64 2.5 2.24 2.24 0 0 1-1.9 2.35l2 3.14h-1.68zm.12-5.49a1.26 1.26 0 0 0-1.37-1.25h-1.92v2.54h1.92a1.26 1.26 0 0 0 1.37-1.3z\' transform=\'translate(-.85)\'/><path d=\'M41.53 21.74v-8h5.48v1.26h-4.07v2h4v1.24h-4v2.26h4.08v1.24h-5.49z\'/><path d=\'M49.31 21.74v-8h3a3.91 3.91 0 0 1 4.19 4 3.9 3.9 0 0 1-4.19 4h-3zm5.72-4a2.59 2.59 0 0 0-2.75-2.74h-1.57v5.5h1.57a2.63 2.63 0 0 0 2.72-2.76zM60.91 21.74v-8h3.93a2 2 0 0 1 2.28 2 1.8 1.8 0 0 1-1.39 1.83 2 2 0 0 1 1.55 2 2.1 2.1 0 0 1-2.28 2.17h-4zm4.77-5.74a1 1 0 0 0-1.13-1h-2.24v2h2.24a1 1 0 0 0 1.13-1zm.16 3.37a1.1 1.1 0 0 0-1.22-1.1h-2.3v2.23h2.3a1.08 1.08 0 0 0 1.22-1.12z\' transform=\'translate(-.85)\'/><path d=\'M69.74 21.74v-3.33l-3.11-4.68h1.61l2.21 3.43 2.18-3.43h1.61l-3.09 4.68v3.32h-1.4z\'/></svg></a>'
  }
};
/* eslint-enable quotes */

/** @module pathfora/dom/window */

/** @module pathfora/dom/document */

var document = window.document;

/** @module pathfora/dom/on-dom-ready */

function onDOMready (fn) {
  var handler,
      pf = this,
      hack = document.documentElement.doScroll,
      domContentLoaded = 'DOMContentLoaded',
      loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(document.readyState);

  if (!loaded) {
    document.addEventListener(domContentLoaded, handler = function () {
      document.removeEventListener(domContentLoaded, handler);
      pf.DOMLoaded = true;
      fn();
    });
  } else {
    pf.DOMLoaded = true;
    fn();
  }
}

/** @module pathfora/utils/escape-regex */

/**
 * Ensure that a string does not contain regex
 *
 * @exports escapeURI
 * @params {string} text
 * @returns {object} options
 * @returns {string} uri
 */
function escapeRegex (s) {
  return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}

/** @module pathfora/utils/class/remove-class */

/**
 * Remove a class from an HTML element
 *
 * @exports removeClass
 * @params {object} DOMNode
 * @params {string} className
 */
function removeClass (DOMNode, className) {
  var findClassRegexp = new RegExp([
    '(^|\\b)',
    escapeRegex(className.split(' ').join('|')),
    '(\\b|$)'
  ].join(''), 'gi');

  DOMNode.className = DOMNode.className.replace(findClassRegexp, ' ');
}

/** @module pathfora/utils/class/add-class */

/**
 * Add a class to an HTML element
 *
 * @exports addClass
 * @params {object} DOMNode
 * @params {string} className
 */
function addClass (DOMNode, className) {
  removeClass(DOMNode, className);

  DOMNode.className = [
    DOMNode.className,
    className
  ].join(' ');
}

/** @module pathfora/utils/class/has-class */

/**
 * Check if an HTML element has a class
 *
 * @exports hasClass
 * @params {object} DOMNode
 * @params {string} className
 * @params {boolean}
 */
function hasClass (DOMNode, className) {
  return new RegExp('(^| )' + escapeRegex(className) + '( |$)', 'gi').test(DOMNode.className);
}

/** @module pathfora/utils/cookie/read-cookie */

// dom
// utils
/**
 * Get the value of a cookie
 *
 * @exports readCookie
 * @params {string} name
 * @returns {string}
 */
function readCookie (name) {
  var cookies = document.cookie,
      findCookieRegexp = cookies.match('(^|;)\\s*' + escapeRegex(name) + '\\s*=\\s*([^;]+)');

  return findCookieRegexp ? findCookieRegexp.pop() : null;
}

/** @module pathfora/utils/cookie/save-cookie */

/**
 * Set the value of a cookie
 *
 * @exports saveCookie
 * @params {string} name
 * @params {string} value
 * @params {object} expiration
 */
function saveCookie (name, value, expiration) {
  var expires;

  if (expiration) {
    expires = '; expires=' + expiration.toUTCString();
  } else {
    expires = '; expires=0';
  }

  document.cookie = [
    name,
    '=',
    value,
    expires,
    '; path = /'
  ].join('');
}

/** @module pathfora/utils/scaffold/init-scaffold */

/**
 * Initialize scaffold for Lytics controlled widgets
 *
 * @exports initWidgetScaffold
 * @returns {object} scaffold
 */
function initWidgetScaffold () {
  return {
    target: [],
    exclude: [],
    inverse: []
  };
}

/** @module pathfora/utils/scaffold/insert-widget */

/**
 * Insert a widget and targeting info into
 * the widget scaffold
 *
 * @exports insertWidget
 * @params {string} method
 * @params {string} segment
 * @params {object} widget
 * @params {object} config
 */
function insertWidget (method, segment, widget, config) {
  // assume that we need to add a new widget until proved otherwise
  var subject,
      makeNew = true;

  // make sure our scaffold is valid
  if (!config.target) {
    throw new Error('Invalid scaffold. No target array.');
  }
  if (!config.exclude) {
    throw new Error('Invalid scaffold. No exclude array.');
  }
  if (!config.inverse) {
    throw new Error('Invalid scaffold. No inverse array.');
  }

  if (method === 'target') {
    subject = config.target;
  } else if (method === 'exclude') {
    subject = config.exclude;
  } else {
    throw new Error('Invalid method (' + method + ').');
  }

  for (var i = 0; i < subject.length; i++) {
    var wgt = subject[i];

    if (wgt.segment === segment) {
      wgt.widgets.push(widget);
      makeNew = false;
    }
  }

  if (makeNew) {
    subject.push({
      'segment': segment,
      'widgets': [widget]
    });
  }
}

/** @module pafthroa/utils/url/construct-queries */

/**
 * Construct the params string for a url from an
 * object containing key/values
 *
 * @exports constructQueries
 * @params {object} params
 * @returns {string}
 */
function constructQueries (params) {
  var count = 0,
      queries = [];

  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      if (count !== 0) {
        queries.push('&');
      } else {
        queries.push('?');
      }

      if (params[key] instanceof Object) {
        // multiple params []string (topics or rollups)
        for (var i in params[key]) {
          if (i < Object.keys(params[key]).length && i > 0) {
            queries.push('&');
          }

          queries.push(key + '[]=' + params[key][i]);
        }

      // single param
      } else {
        queries.push(key + '=' + params[key]);
      }

      count++;
    }
  }

  return queries.join('');
}

/** @module pathfora/utils/url/escape-uri */

/**
 * Escape URIs optionally without double-encoding
 *
 * @exports escapeURI
 * @params {string} text
 * @returns {object} options
 * @returns {string} uri
 */
function escapeURI (text, options) {
  // NOTE This was ported from various bits of C++ code from Chromium
  options || (options = {});

  var length = text.length,
      escaped = [],
      usePlus = options.usePlus || false,
      keepEscaped = options.keepEscaped || false;

  function isHexDigit (c) {
    return /[0-9A-Fa-f]/.test(c);
  }

  function toHexDigit (i) {
    return '0123456789ABCDEF'[i];
  }

  function containsChar (charMap, charCode) {
    return (charMap[charCode >> 5] & (1 << (charCode & 31))) !== 0;
  }

  function isURISeparator (c) {
    return ['#', ':', ';', '/', '?', '$', '&', '+', ',', '@', '='].indexOf(c) !== -1;
  }

  function shouldEscape (charText) {
    return !isURISeparator(charText) && containsChar([
      0xffffffff, 0xf80008fd, 0x78000001, 0xb8000001,
      0xffffffff, 0xffffffff, 0xffffffff, 0xffffffff
    ], charText.charCodeAt(0));
  }

  for (var index = 0; index < length; index++) {
    var charText = text[index],
        charCode = text.charCodeAt(index);

    if (usePlus && charText === ' ') {
      escaped.push('+');
    } else if (keepEscaped && charText === '%' && length >= index + 2 &&
        isHexDigit(text[index + 1]) &&
        isHexDigit(text[index + 2])) {
      escaped.push('%');
    } else if (shouldEscape(charText)) {
      escaped.push('%',
        toHexDigit(charCode >> 4),
        toHexDigit(charCode & 0xf));
    } else {
      escaped.push(charText);
    }
  }

  return escaped.join('');
}

/** @module pathfora/utils/generate-unique-id */

/**
 * Create a unique string identifier
 *
 * @exports generateUniqueId
 * @returns {string} id
 */
function generateUniqueId () {
  var s4;

  if (typeof s4 === 'undefined') {
    s4 = function () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
  }

  return [
    s4(), s4(),
    '-',
    s4(),
    '-',
    s4(),
    '-',
    s4(),
    '-',
    s4(), s4(), s4()
  ].join('');
}

/** @module pathfora/utils/update-object */

/**
 * Merge two objects while preserving original fields
 *
 * @exports updateObject
 * @params {object} object
 * @params {object} config
 */
function updateObject (object, config) {
  for (var prop in config) {
    if (config.hasOwnProperty(prop) && typeof config[prop] === 'object' && config[prop] !== null && !Array.isArray(config[prop])) {
      if (config.hasOwnProperty(prop)) {
        if (typeof object[prop] === 'undefined') {
          object[prop] = {};
        }
        updateObject(object[prop], config[prop]);
      }
    } else if (config.hasOwnProperty(prop)) {
      object[prop] = config[prop];
    }
  }
}

/** @module pathfora/utils */

// class
// cookies
// scaffold
// url
/**
 * Object containing utility functions
 *
 * @exports utils
 */

var utils = {
  // class
  addClass: addClass,
  hasClass: hasClass,
  removeClass: removeClass,

  // cookies
  readCookie: readCookie,
  saveCookie: saveCookie,

  // scaffold
  initWidgetScaffold: initWidgetScaffold,
  insertWidget: insertWidget,

  // url
  constructQueries: constructQueries,
  escapeURI: escapeURI,

  generateUniqueId: generateUniqueId,
  updateObject: updateObject
};

/** @module pathfora/data/tracking/get-data-object */

/**
 * Get the pathfora data object
 *
 * @exports getDataObject
 * @returns {object} pathforaDataObject
 */
function getDataObject () {
  return pathforaDataObject;
}

/** @module pathfora/callbacks/add-callback */

/**
 * Add a function to be called once jstag is loaded
 *
 * @exports addCallack
 * @params {function} cb
 */
function addCallback (cb) {
  if (window.lio && window.lio.loaded) {
    cb(window.lio.data);
  } else {
    this.callbacks.push(cb);
  }
}

/** @module pathfora/display-conditions/pageviews/init-pageviews */

// globals
// utils
/**
 * Track and update the number of pageviews
 *
 * @exports initializePageViews
 */
function initializePageViews () {
  var cookie = readCookie(PF_PAGEVIEWS),
      date = new Date();
  date.setDate(date.getDate() + 365);
  readCookie(PF_PAGEVIEWS, Math.min(~~cookie, 9998) + 1, date);
}

/** @module pathfora/display-conditions/impressions/impressions-checker */

// globals
// utils
/**
 * Check if the widget has met the impressions
 * display condition.
 *
 * @exports impressionsChecker
 * @params {object} impressionConstraints
 * @params {object} widget
 * @params {boolean} valid
 */
function impressionsChecker (impressionConstraints, widget) {
  var parts, totalImpressions,
      valid = true,
      id = PREFIX_IMPRESSION + widget.id,
      sessionImpressions = ~~sessionStorage.getItem(id),
      total = readCookie(id),
      now = Date.now();

  if (!sessionImpressions) {
    sessionImpressions = 0;
  }

  if (!total) {
    totalImpressions = 0;
  } else {
    parts = total.split('|');
    totalImpressions = parseInt(parts[0], 10);

    if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < impressionConstraints.buffer) {
      valid = false;
    }
  }

  if (sessionImpressions >= impressionConstraints.session || totalImpressions >= impressionConstraints.total) {
    valid = false;
  }

  return valid;
}

/** @module pathfora/data/request/report-data */

/**
 * Send data object to Lytics and GA
 *
 * @exports reportData
 * @params {object} data
 */
function reportData (data) {
  var gaLabel;

  if (typeof jstag === 'object') {
    window.jstag.send(data);
  } else {
    // NOTE Cannot find Lytics tag, reporting disabled
  }

  if (window.pathfora.enableGA === true && typeof ga === 'function') {
    gaLabel = data['pf-widget-action'] || data['pf-widget-event'];

    window.ga(
      'send',
      'event',
      'Lytics',
      data['pf-widget-id'] + ' : ' + gaLabel,
      '',
      {
        nonInteraction: true
      }
    );
  }
}

/** @module pathfora/data/tracking/track-widget-action */

// global
// utils
/**
 * Format and track interaction events such as
 * CTA clicks, form status, etc.
 *
 * @exports trackWidgetAction
 * @params {string} action
 * @params {object} widget
 * @params {object} htmlElement
 */
function trackWidgetAction (action, widget, htmlElement) {
  var child, elem, i;

  var params = {
    'pf-widget-id': widget.id,
    'pf-widget-type': widget.type,
    'pf-widget-layout': widget.layout,
    'pf-widget-variant': widget.variant
  };

  if (widget.recommend && widget.content && widget.content.length > 0) {
    params['pf-widget-content'] = widget.content[0];
  }

  switch (action) {
  case 'show':
    pathforaDataObject.displayedWidgets.push(params);
    break;
  case 'close':
    params['pf-widget-action'] = !!widget.closeAction && widget.closeAction.name || 'close';
    pathforaDataObject.closedWidgets.push(params);
    break;
  case 'confirm':
    if (htmlElement && hasClass(htmlElement, 'pf-content-unit')) {
      params['pf-widget-action'] = 'content recommendation';
    } else {
      params['pf-widget-action'] = !!widget.confirmAction && widget.confirmAction.name || 'default confirm';
      pathforaDataObject.completedActions.push(params);
    }
    break;
  case 'cancel':
    params['pf-widget-action'] = !!widget.cancelAction && widget.cancelAction.name || 'default cancel';
    pathforaDataObject.cancelledActions.push(params);
    break;
  case 'submit':
  case 'unlock':
    if (hasClass(htmlElement, 'pf-custom-form')) {
      params['pf-custom-form'] = {};
    }

    for (elem in htmlElement.children) {
      if (htmlElement.children.hasOwnProperty(elem)) {
        child = htmlElement.children[elem];

        if (hasClass(child, 'pf-widget-radio-group') || hasClass(child, 'pf-widget-checkbox-group')) {
          var values = [],
              name = '',
              inputs = child.querySelectorAll('input');

          for (i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if (input.checked) {
              name = input.getAttribute('name');
              values.push(input.value);
            }
          }

          if (name !== '') {
            params['pf-custom-form'][name] = values;
          }
        } else if (child && typeof child.getAttribute !== 'undefined' && child.getAttribute('name') !== null) {
          params['pf-form-' + child.getAttribute('name')] = child.value;
        } else if (hasClass(htmlElement, 'pf-custom-form') && child && child.querySelector) {
          var val = child.querySelector('input, select, textarea');

          if (val && typeof val.getAttribute !== 'undefined' && val.getAttribute('name') !== null) {
            params['pf-custom-form'][val.getAttribute('name')] = val.value;
          }
        }
      }
    }

    if (action === 'unlock') {
      saveCookie(PREFIX_UNLOCK + widget.id, true, widget.expiration);
    }

    break;
  case 'subscribe':
    params['pf-form-email'] = htmlElement.elements.email.value;
    break;
  case 'hover':
    if (hasClass(htmlElement, 'pf-content-unit')) {
      params['pf-widget-action'] = 'content recommendation';
    } else if (hasClass(htmlElement, 'pf-widget-ok')) {
      params['pf-widget-action'] = 'confirm';
    } else if (hasClass(htmlElement, 'pf-widget-cancel')) {
      params['pf-widget-action'] = 'cancel';
    } else if (hasClass(htmlElement, 'pf-widget-close')) {
      params['pf-widget-action'] = 'close';
    }
    break;
  case 'focus':
    if (htmlElement && typeof htmlElement.getAttribute !== 'undefined' && htmlElement.getAttribute('name') !== null) {
      params['pf-widget-action'] = htmlElement.getAttribute('name');
    }
    break;
  case 'form_start':
    if (htmlElement && typeof htmlElement.getAttribute !== 'undefined' && htmlElement.getAttribute('name') !== null) {
      params['pf-widget-action'] = htmlElement.getAttribute('name');
    }
    break;
  }

  params['pf-widget-event'] = action;
  reportData(params);
}

/** @module pathfora/display-conditions/impressions/increment-impressions */

// globals
// utils
/**
 * Increment the impression count for a widget
 *
 * @exports incrementImpressions
 * @params {object} widget
 */
function incrementImpressions (widget) {
  var parts, totalImpressions,
      id = PREFIX_IMPRESSION + widget.id,
      sessionImpressions = ~~sessionStorage.getItem(id),
      total = readCookie(id),
      now = Date.now();

  if (!sessionImpressions) {
    sessionImpressions = 1;
  } else {
    sessionImpressions += 1;
  }

  if (!total) {
    totalImpressions = 1;
  } else {
    parts = total.split('|');
    totalImpressions = parseInt(parts[0], 10) + 1;
  }

  sessionStorage.setItem(id, sessionImpressions);
  saveCookie(id, Math.min(totalImpressions, 9998) + '|' + now, widget.expiration);
}

/** @module pathfora/widgets/validate-widget-position */

/**
 * Validate that the widget has correct position field
 * for its layout and type
 *
 * @exports validateWidgetPosition
 * @params {object} widget
 * @params {object} config
 */
function validateWidgetPosition (widget, config) {
  var choices;

  switch (config.layout) {
  case 'modal':
    choices = [''];
    break;
  case 'slideout':
    choices = ['bottom-left', 'bottom-right', 'left', 'right', 'top-left', 'top-right'];
    break;
  case 'bar':
    choices = ['top-absolute', 'top-fixed', 'bottom-fixed'];
    break;
  case 'button':
    choices = ['left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
    break;
  case 'folding':
    choices = ['left', 'bottom-left', 'bottom-right'];
    break;
  case 'inline':
    choices = [];
    break;
  }

  if (choices.indexOf(config.position) === -1) {
    // NOTE config.position + ' is not valid position for ' + config.layout
  }
}

/** @module pathfora/widgets/setup-widget-position */

// globals
// widgets
/**
 * Validate that the widget has correct position field,
 * and choose the default if it does not
 *
 * @exports setupWidgetPostion
 * @params {object} widget
 * @params {object} config
 */
function setupWidgetPosition (widget, config) {
  if (config.position) {
    validateWidgetPosition(widget, config);
  } else {
    config.position = defaultPositions[config.layout];
  }
}

/** @module pathfora/widgets/close-widget */

// globals
// dom
// utils
// data
/**
 * Close a widget and remove it from the dom
 *
 * @exports closeWidget
 * @params {string} id
 * @params {boolean} noTrack
 */
function closeWidget (id, noTrack) {
  var i,
      node = document.getElementById(id);

  // FIXME Change to Array#some or Array#filter
  for (i = 0; i < widgetTracker.openedWidgets.length; i++) {
    if (widgetTracker.openedWidgets[i].id === id) {
      if (!noTrack) {
        trackWidgetAction('close', widgetTracker.openedWidgets[i]);
      }
      widgetTracker.openedWidgets.splice(i, 1);
      break;
    }
  }

  removeClass(node, 'opened');

  if (hasClass(node, 'pf-has-push-down')) {
    var pushDown = document.querySelector('.pf-push-down');
    if (pushDown) {
      removeClass(pushDown, 'opened');
    }
  }

  // FIXME 500 - magical number
  setTimeout(function () {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);

      for (i = 0; i < widgetTracker.initializedWidgets.length; i++) {
        if (widgetTracker.initializedWidgets[i] === id) {
          widgetTracker.initializedWidgets.splice(i, 1);
        }
      }
    }
  }, 500);
}

/** @module pathfora/widgets/construct-widget-actions */

// globals
// utils
// data
// widgets
/**
 * Add callbacks and tracking for user interactions
 * with widgets
 *
 * @exports constructWidgetActions
 * @params {object} widget
 * @params {object} config
 */
function constructWidgetActions (widget, config) {
  var widgetOnButtonClick, widgetOnFormSubmit,
      widgetOk = widget.querySelector('.pf-widget-ok'),
      widgetReco = widget.querySelector('.pf-content-unit');

  var widgetOnModalClose = function (event) {
    if (typeof config.onModalClose === 'function') {
      config.onModalClose(callbackTypes.MODAL_CLOSE, {
        widget: widget,
        config: config,
        event: event
      });
    }
  };

  var updateActionCookie = function (name) {
    var ct,
        val = readCookie(name),
        duration = Date.now();

    if (val) {
      val = val.split('|');
      ct = Math.min(parseInt(val[0], 10), 9998) + 1;
    } else {
      ct = 1;
    }

    saveCookie(name, ct + '|' + duration, widget.expiration);
  };

  // Tracking for widgets with a form element
  switch (config.type) {
  case 'form':
  case 'sitegate':
  case 'subscription':
    var widgetForm = widget.querySelector('form');

    var onInputChange = function (event) {
      if (event.target.value && event.target.value.length > 0) {
        trackWidgetAction('form_start', config, event.target);
      }
    };

    var onInputFocus = function (event) {
      trackWidgetAction('focus', config, event.target);
    };

    // Additional tracking for input focus and entering text into the form
    for (var elem in widgetForm.childNodes) {
      if (widgetForm.children.hasOwnProperty(elem)) {
        var child = widgetForm.children[elem];
        if (typeof child.getAttribute !== 'undefined' && child.getAttribute('name') !== null) {
          // Track focus of form elements
          child.onfocus = onInputFocus;

          // Track input to indicate they've begun to interact with the form
          child.onchange = onInputChange;
        }
      }
    }

    // Form submit handler
    widgetOnFormSubmit = function (event) {
      var widgetAction;
      event.preventDefault();

      switch (config.type) {
      case 'form':
        widgetAction = 'submit';
        break;
      case 'subscription':
        widgetAction = 'subscribe';
        break;
      case 'sitegate':
        widgetAction = 'unlock';
        break;
      }

      // Validate that the form is filled out correctly
      var valid = true,
          requiredElements = Array.prototype.slice.call(widgetForm.querySelectorAll('[data-required=true]'));

      for (var i = 0; i < requiredElements.length; i++) {
        var field = requiredElements[i];

        if (hasClass(widgetForm, 'pf-custom-form')) {
          if (field.parentNode) {
            var parent = field.parentNode;
            removeClass(parent, 'invalid');

            if (hasClass(parent, 'pf-widget-radio-group') || hasClass(parent, 'pf-widget-checkbox-group')) {
              var inputs = field.querySelectorAll('input');
              var count = 0;

              for (var j = 0; j < inputs.length; j++) {
                var input = inputs[j];
                if (input.checked) {
                  count++;
                }
              }

              if (count === 0) {
                valid = false;
                addClass(parent, 'invalid');
              }
            } else if (!field.value) {
              valid = false;
              addClass(parent, 'invalid');

              if (i === 0) {
                field.focus();
              }
            }
          }
        // legacy support old, non-custom forms
        } else if (field.hasAttribute('data-required')) {
          removeClass(field, 'invalid');

          if (!field.value || (field.getAttribute('type') === 'email' && field.value.indexOf('@') === -1)) {
            valid = false;
            addClass(field, 'invalid');
            if (i === 0) {
              field.focus();
            }
          }
        }
      }

      if (valid && widgetAction) {
        trackWidgetAction(widgetAction, config, widgetForm);

        if (typeof config.onSubmit === 'function') {
          config.onSubmit(callbackTypes.FORM_SUBMIT, {
            widget: widget,
            config: config,
            event: event,
            data: Array.prototype.slice.call(
              widgetForm.querySelectorAll('input, textarea, select')
            ).map(function (element) {
              return {
                name: element.name || element.id,
                value: element.value
              };
            })
          });
        }
        return true;
      }
      return false;
    };

    break;
  }

  switch (config.layout) {
  case 'folding':
    var widgetAllCaptions = widget.querySelectorAll('.pf-widget-caption, .pf-widget-caption-left'),
        widgetFirstCaption = widget.querySelector('.pf-widget-caption');

    if (config.position !== 'left') {
      setTimeout(function () {
        var height = widget.offsetHeight - widgetFirstCaption.offsetHeight;
        widget.style.bottom = -height + 'px';
      }, 0);
    }

    for (var i = widgetAllCaptions.length - 1; i >= 0; i--) {
      widgetAllCaptions[i].onclick = function () {
        if (hasClass(widget, 'opened')) {
          removeClass(widget, 'opened');
        } else {
          addClass(widget, 'opened');
        }
      };
    }
    break;

  case 'button':
    if (typeof config.onClick === 'function') {
      widgetOnButtonClick = function (event) {
        config.onClick(callbackTypes.CLICK, {
          widget: widget,
          config: config,
          event: event
        });
      };
    }
    break;

  case 'modal':
  case 'slideout':
  case 'bar':
  case 'inline':
    var widgetCancel = widget.querySelector('.pf-widget-cancel'),
        widgetClose = widget.querySelector('.pf-widget-close');

    if (widgetClose) {
      widgetClose.onmouseenter = function (event) {
        trackWidgetAction('hover', config, event.target);
      };

      widgetClose.onclick = function (event) {
        closeWidget(widget.id);
        updateActionCookie(PREFIX_CLOSE + widget.id);

        if (typeof config.closeAction === 'object' && typeof config.closeAction.callback === 'function') {
          config.closeAction.callback(callbackTypes.MODAL_CLOSE, {
            widget: widget,
            config: config,
            event: event
          });
        }

        widgetOnModalClose(event);
      };
    }

    if (widgetCancel) {
      widgetCancel.onmouseenter = function (event) {
        trackWidgetAction('hover', config, event.target);
      };

      if (typeof config.cancelAction === 'object') {
        widgetCancel.onclick = function (event) {
          trackWidgetAction('cancel', config);
          if (typeof config.cancelAction.callback === 'function') {
            config.cancelAction.callback(callbackTypes.MODAL_CANCEL, {
              widget: widget,
              config: config,
              event: event
            });
          }
          updateActionCookie(PREFIX_CANCEL + widget.id);
          closeWidget(widget.id, true);
          widgetOnModalClose(event);
        };
      } else {
        widgetCancel.onclick = function (event) {
          trackWidgetAction('cancel', config);
          updateActionCookie(PREFIX_CANCEL + widget.id);
          closeWidget(widget.id, true);
          widgetOnModalClose(event);
        };
      }
    }
  default:
    break;
  }

  if (widgetOk) {
    widgetOk.onmouseenter = function (event) {
      trackWidgetAction('hover', config, event.target);
    };

    widgetOk.onclick = function (event) {
      if (typeof widgetOnFormSubmit === 'function' && !widgetOnFormSubmit(event)) {
        // invalid form, do not submit
      } else {
        trackWidgetAction('confirm', config);
        updateActionCookie(PREFIX_CONFIRM + widget.id);

        if (typeof config.confirmAction === 'object' && typeof config.confirmAction.callback === 'function') {
          config.confirmAction.callback(callbackTypes.MODAL_CONFIRM, {
            widget: widget,
            config: config,
            event: event
          });
        }
        if (typeof widgetOnButtonClick === 'function') {
          widgetOnButtonClick(event);
        }

        widgetOnModalClose(event);

        if (config.layout !== 'inline' && typeof config.success === 'undefined') {
          closeWidget(widget.id, true);

        // show success state
        } else {
          addClass(widget, 'success');

          // default to a three second delay if the user has not defined one
          var delay = typeof config.success.delay !== 'undefined' ? config.success.delay * 1000 : 3000;

          if (delay > 0) {
            setTimeout(function () {
              closeWidget(widget.id, true);
            }, delay);
          }
        }
      }
    };
  }


  if (widgetReco) {
    widgetReco.onmouseenter = function (event) {
      trackWidgetAction('hover', config, event.target);
    };

    widgetReco.onclick = function (event) {
      trackWidgetAction('confirm', config, event.target);
      updateActionCookie(PREFIX_CONFIRM + widget.id);
    };
  }
}

/** @module pathfora/widgets/setup-widget-content-unit */

// globals
// dom
/**
 * Setup HTML for a widget with content recommendations
 *
 * @exports setupWidgetContentUnit
 * @params {object} widget
 * @params {object} config
 */
function setupWidgetContentUnit (widget, config) {
  var widgetContentUnit = widget.querySelector('.pf-content-unit'),
      settings = config.recommend;

  if (config.recommend && config.content) {
    // Make sure we have content to get
    if (Object.keys(config.content).length > 0) {

      // The top recommendation should be default if we couldn't
      // get one from the api
      var rec = config.content[0],
          recImage = document.createElement('div'),
          recMeta = document.createElement('div'),
          recTitle = document.createElement('h4'),
          recDesc = document.createElement('p'),
          recInfo = document.createElement('span');

      widgetContentUnit.href = rec.url;

      // image div
      if (rec.image && (!settings.display || settings.display.image !== false)) {
        recImage.className = 'pf-content-unit-img';
        recImage.style.backgroundImage = "url('" + rec.image + "')";
        widgetContentUnit.appendChild(recImage);
      }

      recMeta.className = 'pf-content-unit-meta';

      // title h4
      if (rec.title && (!settings.display || settings.display.title !== false)) {
        recTitle.innerHTML = rec.title;
        recMeta.appendChild(recTitle);
      }

      if (rec.author && (settings.display && settings.display.author === true)) {
        recInfo.innerHTML = 'by ' + rec.author;
      }

      if (rec.date && (settings.display && settings.display.date === true)) {
        var published = new Date(rec.date),
            locale = settings.display.locale,
            dateOptions = settings.display.dateOptions;

        if (!locale && window.pathfora && window.pathfora.locale) {
          locale = window.pathfora.locale;
        } else if (!locale) {
          locale = PF_LOCALE;
        }

        if (!dateOptions && window.pathfora && window.pathfora.dateOptions) {
          dateOptions = window.pathfora.dateOptions;
        } else if (!dateOptions) {
          dateOptions = PF_DATE_OPTIONS;
        }

        published = published.toLocaleDateString(locale, dateOptions);

        if (!recInfo.innerHTML) {
          recInfo.innerHTML = published;
        } else {
          recInfo.innerHTML += ' | ' + published;
        }
      }

      if (recInfo.innerHTML) {
        recInfo.className = 'pf-content-unit-info';
        recMeta.appendChild(recInfo);
      }

      // description p
      if (rec.description && (!settings.display || settings.display.description !== false)) {
        var desc = rec.description,
            limit = config.layout === 'modal' ? DEFAULT_CHAR_LIMIT : DEFAULT_CHAR_LIMIT_STACK;


        // set the default character limit for descriptions
        if (!settings.display) {
          settings.display = {
            descriptionLimit: limit
          };
        } else if (!settings.display.descriptionLimit) {
          settings.display.descriptionLimit = limit;
        }

        if (desc.length > settings.display.descriptionLimit && settings.display.descriptionLimit !== -1) {
          desc = desc.substring(0, settings.display.descriptionLimit);
          desc = desc.substring(0, desc.lastIndexOf(' ')) + '...';
        }

        recDesc.innerHTML = desc;
        recMeta.appendChild(recDesc);
      }

      widgetContentUnit.appendChild(recMeta);
    }
  }
}

/** @module core/set-widget-classname */

/**
 * Setup the className for a widget
 *
 * @exports setWidgetClassname
 * @params {object} widget
 * @params {object} config
 */
function setWidgetClassname (widget, config) {
  widget.className = [
    'pf-widget ',
    'pf-' + config.type,
    ' pf-widget-' + config.layout,
    config.position ? ' pf-position-' + config.position : '',
    config.pushDown ? ' pf-has-push-down' : '',
    config.origin ? ' pf-origin-' + config.origin : '',
    ' pf-widget-variant-' + config.variant,
    config.theme ? ' pf-theme-' + config.theme : '',
    config.className ? ' ' + config.className : '',
    config.branding ? ' pf-widget-has-branding' : '',
    !config.responsive ? ' pf-mobile-hide' : ''
  ].join('');
}

/** @module pathfora/form/build-form-element */

// dom
// utils
/**
 * Build and insert a custom form element into
 * the widget's form
 *
 * @exports buildFormElement
 * @params {object} elem
 * @params {object} form
 */
function buildFormElement (elem, form) {
  var content, i, val, label,
      wrapper = document.createElement('div'),
      isGroup = elem.hasOwnProperty('groupType');

  // group elements include: checkbox groups
  if (isGroup) {
    wrapper.className = 'pf-widget-' + elem.type;
    content = document.createElement('div');
  } else {
    content = document.createElement(elem.type);
    content.setAttribute('name', elem.name);
    content.setAttribute('id', elem.name);

    // add row count for textarea
    if (elem.type === 'textarea') {
      content.setAttribute('rows', 5);

    // add text type for input
    } else if (elem.type === 'input') {
      content.setAttribute('type', 'text');
    }
  }

  if (elem.label) {
    if (isGroup) {
      label = document.createElement('span');
    } else {
      label = document.createElement('label');
      label.setAttribute('for', elem.name);
    }

    label.innerHTML = elem.label;
    label.className = 'pf-form-label';
    addClass(content, 'pf-has-label');

    if (elem.required === true) {
      label.innerHTML += ' <span class="required">*</span>';
    }

    wrapper.appendChild(label);
  }

  if (elem.required === true) {
    addClass(wrapper, 'pf-form-required');
    content.setAttribute('data-required', 'true');

    if (elem.label) {
      var reqFlag = document.createElement('div');
      reqFlag.className = 'pf-required-flag';
      reqFlag.innerHTML = 'required';

      var reqTriange = document.createElement('span');
      reqFlag.appendChild(reqTriange);

      wrapper.appendChild(reqFlag);
    }
  }

  if (elem.placeholder) {
    // select element has first option as placeholder
    if (elem.type === 'select') {
      var placeholder = document.createElement('option');
      placeholder.setAttribute('value', '');
      placeholder.innerHTML = elem.placeholder;
      content.appendChild(placeholder);
    } else {
      content.placeholder = elem.placeholder;
    }
  }

  if (elem.values) {
    for (i = 0; i < elem.values.length; i++) {
      val = elem.values[i];

      if (isGroup) {
        var input = document.createElement('input');
        input.setAttribute('type', elem.groupType);
        input.setAttribute('value', val.value);
        input.setAttribute('name', elem.name);

        if (val.label) {
          label = document.createElement('label');
          label.className = 'pf-widget-' + elem.groupType;
          label.appendChild(input);
          label.appendChild(document.createTextNode(val.label));
          content.appendChild(label);
        } else {
          throw new Error(elem.groupType + 'form group values must contain labels');
        }
      } else if (elem.type === 'select') {
        var option = document.createElement('option');
        option.setAttribute('value', val.value);
        option.innerHTML = val.label;

        content.appendChild(option);
      }
    }
  }

  wrapper.appendChild(content);

  // make sure we're inserting the new element before the confirm button
  var btn = form.querySelector('.pf-widget-ok');
  if (btn) {
    form.insertBefore(wrapper, btn);
  } else {
    form.appendChild(wrapper);
  }
}

/** @module pathfora/form/build-widget-form */

/**
 * Build a custom form on a widget according to the
 * formElements config provided
 *
 * @exports buildWidgetForm
 * @params {object} formElements
 * @params {object} form
 */
function buildWidgetForm (formElements, form) {
  for (var i = 0; i < formElements.length; i++) {
    var elem = formElements[i];

    switch (elem.type) {
    // Radio & Checkbox Button Group
    case 'radio-group':
    case 'checkbox-group':
      elem.groupType = elem.type.split('-')[0];
      buildFormElement(elem, form);
      delete elem.groupType;
      break;

    // Textarea, Input, & Select
    case 'textarea':
    case 'input':
    case 'select':
      buildFormElement(elem, form);
      break;

    default:
      throw new Error('unrecognized form element type: ' + elem.type);
    }
  }
}

/** @module pathfora/widgets/construct-widget-layout */

// globals
// dom
// utils
// widgets
/**
 * Setup inner html elements for a widget
 *
 * @exports constructWidgetLayout
 * @params {object} widget
 * @params {object} config
 */
function constructWidgetLayout (widget, config) {
  var node, child, i,
      widgetContent = widget.querySelector('.pf-widget-content'),
      widgetCancel = widget.querySelector('.pf-widget-cancel'),
      widgetOk = widget.querySelector('.pf-widget-ok'),
      widgetHeadline = widget.querySelectorAll('.pf-widget-headline'),
      widgetBody = widget.querySelector('.pf-widget-body'),
      widgetMessage = widget.querySelector('.pf-widget-message');

  if (widgetCancel !== null && !config.cancelShow) {
    node = widgetCancel;

    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }

  if (widgetOk !== null && !config.okShow) {
    node = widgetOk;

    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }

  if (widgetCancel !== null) {
    widgetCancel.innerHTML = config.cancelMessage;
  }

  if (widgetOk !== null) {
    widgetOk.innerHTML = config.okMessage;
  }

  if (widgetOk && widgetOk.value !== null) {
    widgetOk.value = config.okMessage;
  }

  if (widgetCancel && widgetCancel.value !== null) {
    widgetCancel.value = config.cancelMessage;
  }

  // Form layouts should have a default success message
  switch (config.type) {
  case 'form':
  case 'subscription':
  case 'sitegate':
    switch (config.layout) {
    case 'modal':
    case 'slideout':
    case 'sitegate':
    case 'inline':

      var successTitle = document.createElement('div');
      successTitle.className = 'pf-widget-headline success-state';
      successTitle.innerHTML = config.success && config.success.headline ? config.success.headline : 'Thank you';
      widgetContent.appendChild(successTitle);

      var successMsg = document.createElement('div');
      successMsg.className = 'pf-widget-message success-state';
      successMsg.innerHTML = config.success && config.success.msg ? config.success.msg : 'We have received your submission.';
      widgetContent.appendChild(successMsg);

      break;
    }
    break;
  }

  switch (config.layout) {
  case 'modal':
  case 'slideout':
  case 'sitegate':
  case 'inline':
    if (widgetContent && config.branding) {
      var branding = document.createElement('div');
      branding.className = 'branding';
      branding.innerHTML = templates.assets.lytics;
      widgetContent.appendChild(branding);
    }

    break;
  }

  switch (config.type) {
  case 'form':
    switch (config.layout) {
    case 'folding':
    case 'modal':
    case 'slideout':
    case 'random':
    case 'inline':
      break;
    default:
      throw new Error('Invalid widget layout value');
    }
    break;
  case 'subscription':
    switch (config.layout) {
    case 'folding':
    case 'modal':
    case 'bar':
    case 'slideout':
    case 'random':
    case 'inline':
      break;
    default:
      throw new Error('Invalid widget layout value');
    }
    break;
  case 'message':
    switch (config.layout) {
    case 'modal':
    case 'slideout':
      break;
    case 'random':
    case 'bar':
    case 'button':
    case 'inline':
      break;
    default:
      throw new Error('Invalid widget layout value');
    }
    break;
  case 'sitegate':
    switch (config.layout) {
    case 'modal':
      if (config.showForm === false) {
        node = widget.querySelector('form');
        child = node.querySelectorAll('input, select, textarea');

        if (node) {
          for (i = 0; i < child.length; i++) {
            node.removeChild(child[i]);
          }

          child = node.querySelector('.pf-sitegate-clear');

          if (child) {
            node.removeChild(child);
          }
        }
      }
      break;
    default:
      throw new Error('Invalid widget layout value');
    }
    break;
  }

  // NOTE Set The headline
  for (i = widgetHeadline.length - 1; i >= 0; i--) {
    widgetHeadline[i].innerHTML = config.headline;
  }

  // NOTE Set the image
  if (config.image) {
    if (config.layout === 'button') {
      // NOTE Images are not compatible with the button layout
    } else {
      var widgetImage = document.createElement('img');
      widgetImage.src = config.image;
      widgetImage.className = 'pf-widget-img';
      widgetBody.appendChild(widgetImage);
    }
  }

  switch (config.type) {
  case 'sitegate':
  case 'form':
    if (config.showSocialLogin === false) {
      node = widget.querySelector('.pf-social-login');

      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }

    // Check if custom form is defined
    if (config.formElements && config.formElements.length) {
      // remove the existing form fields
      var form = widget.querySelector('form');
      addClass(form, 'pf-custom-form');
      var childName;
      var arr = form.children;

      for (var k = 0; k < arr.length; k++) {
        child = arr[k];

        if (typeof child.getAttribute !== 'undefined') {
          childName = child.getAttribute('name');

          if (childName != null) {
            form.removeChild(child);
            k--;
          }
        }
      }

      buildWidgetForm(config.formElements, form);

    } else {
      // suport old form functions
      var getFormElement = function (field) {
        if (field === 'name') {
          return widget.querySelector('input[name="username"]');
        }

        return widget.querySelector('form [name="' + field + '"]');
      };

      // Set placeholders
      Object.keys(config.placeholders).forEach(function (field) {
        var element = getFormElement(field);

        if (element && typeof element.placeholder !== 'undefined') {
          element.placeholder = config.placeholders[field];
        } else if (element && typeof element.options !== 'undefined') {
          element.options[0].innerHTML = config.placeholders[field];
        }
      });

      // Set required Fields
      Object.keys(config.required).forEach(function (field) {
        var element = getFormElement(field);

        if (element && config.required[field]) {
          element.setAttribute('data-required', 'true');
        }
      });

      // Hide fields
      Object.keys(config.fields).forEach(function (field) {
        var element = getFormElement(field);

        if (element && !config.fields[field] && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });

      // NOTE: collapse half-width inputs
      Array.prototype.slice.call(widget.querySelectorAll('form .pf-field-half-width')).forEach(function (element, halfcount) {
        var parent = element.parentNode,
            prev = element.previousElementSibling,
            next = element.nextElementSibling;

        if (parent) {
          if (element.className.indexOf('pf-field-half-width') !== -1) {

            if (halfcount % 2) { // odd
              addClass(element, 'right');

              if (!(prev && prev.className.indexOf('pf-field-half-width') !== -1)) {
                removeClass(element, 'pf-field-half-width');
              }

            } else if (!(next && next.className.indexOf('pf-field-half-width') !== -1)) { // even
              removeClass(element, 'pf-field-half-width');
            }
          }
        }
      });
    }

    // For select boxes we need to control the color of
    // the placeholder text
    var selects = widget.querySelectorAll('select');

    for (i = 0; i < selects.length; i++) {
      // default class indicates the placeholder text color
      if (selects[i].value === '') {
        addClass(selects[i], 'default');
      }

      selects[i].onchange = function () {
        if (this.value !== '') {
          removeClass(this, 'default');
        } else {
          addClass(this, 'default');
        }
      };
    }

    break;
  case 'subscription':
    widget.querySelector('input').placeholder = config.placeholders.email;
    break;
  }

  if (config.msg) {
    widgetMessage.innerHTML = config.msg;
  }
}

/** @module pathfora/widgets/colors/set-custom-colors */

/**
 * Set colors for a widget with a custom theme
 * defined in the config
 *
 * @exports setCustomColors
 * @params {object} widget
 * @params {object} colors
 */
function setCustomColors (widget, colors) {
  var i = 0,
      close = widget.querySelector('.pf-widget-close'),
      msg = widget.querySelectorAll('.pf-widget-message'),
      headline = widget.querySelectorAll('.pf-widget-headline'),
      headlineLeft = widget.querySelector('.pf-widget-caption-left .pf-widget-headline'),
      cancelBtn = widget.querySelector('.pf-widget-btn.pf-widget-cancel'),
      okBtn = widget.querySelector('.pf-widget-btn.pf-widget-ok'),
      arrow = widget.querySelector('.pf-widget-caption span'),
      arrowLeft = widget.querySelector('.pf-widget-caption-left span'),
      contentUnit = widget.querySelector('.pf-content-unit'),
      contentUnitMeta = widget.querySelector('.pf-content-unit-meta'),
      fields = widget.querySelectorAll('input, textarea, select'),
      branding = widget.querySelector('.branding svg'),
      required = widget.querySelectorAll('.pf-required-flag'),
      requiredAsterisk = widget.querySelectorAll('span.required'),
      requiredInline = widget.querySelectorAll('[data-required=true]:not(.pf-has-label)'),
      socialBtns = Array.prototype.slice.call(widget.querySelectorAll('.social-login-btn'));

  if (colors.background) {
    if (hasClass(widget, 'pf-widget-modal')) {
      widget.querySelector('.pf-widget-content').style.setProperty('background-color', colors.background, 'important');
    } else {
      widget.style.setProperty('background-color', colors.background, 'important');
    }
  }

  if (colors.fieldBackground) {
    for (i = 0; i < fields.length; i++) {
      fields[i].style.setProperty('background-color', colors.fieldBackground, 'important');
    }
  }

  if (colors.required) {
    for (i = 0; i < required.length; i++) {
      required[i].style.setProperty('background-color', colors.required, 'important');
      required[i].querySelector('span').style.setProperty('border-right-color', colors.required, 'important');
    }

    for (i = 0; i < requiredInline.length; i++) {
      requiredInline[i].style.setProperty('border-color', colors.required, 'important');
    }

    for (i = 0; i < requiredAsterisk.length; i++) {
      requiredAsterisk[i].style.setProperty('color', colors.required, 'important');
    }
  }

  if (colors.requiredText) {
    for (i = 0; i < required.length; i++) {
      required[i].style.setProperty('color', colors.requiredText, 'important');
    }
  }

  if (contentUnit && contentUnitMeta) {
    if (colors.actionBackground) {
      contentUnit.style.setProperty('background-color', colors.actionBackground, 'important');
    }

    if (colors.actionText) {
      contentUnitMeta.querySelector('h4').style.setProperty('color', colors.actionText, 'important');
    }

    if (colors.text) {
      contentUnitMeta.querySelector('p').style.setProperty('color', colors.text, 'important');
    }
  }

  if (close && colors.close) {
    close.style.setProperty('color', colors.close, 'important');
  }

  if (headline && colors.headline) {
    for (i = 0; i < headline.length; i++) {
      headline[i].style.setProperty('color', colors.headline, 'important');
    }
  }

  if (headlineLeft && colors.headline) {
    headlineLeft.style.setProperty('color', colors.headline, 'important');
  }

  if (arrow && colors.close) {
    arrow.style.setProperty('color', colors.close, 'important');
  }

  if (arrowLeft && colors.close) {
    arrowLeft.style.setProperty('color', colors.close, 'important');
  }

  if (cancelBtn) {
    if (colors.cancelText) {
      cancelBtn.style.setProperty('color', colors.cancelText, 'important');
    }

    if (colors.cancelBackground) {
      cancelBtn.style.setProperty('background-color', colors.cancelBackground, 'important');
    }
  }

  if (okBtn) {
    if (colors.actionText) {
      okBtn.style.setProperty('color', colors.actionText, 'important');
    }

    if (colors.actionBackground) {
      okBtn.style.setProperty('background-color', colors.actionBackground, 'important');
    }
  }

  if (colors.text && branding) {
    branding.style.setProperty('fill', colors.text, 'important');
  }


  socialBtns.forEach(function (btn) {
    if (colors.actionText) {
      btn.style.setProperty('color', colors.actionText, 'important');
    }

    if (colors.actionBackground) {
      btn.style.setProperty('background-color', colors.actionBackground, 'important');
    }
  });

  if (msg && colors.text) {
    for (i = 0; i < msg.length; i++) {
      msg[i].style.setProperty('color', colors.text, 'important');
    }
  }
}

/** @module pathfora/wodgets/colors/setup-widget-colors */

// globals
// widgets
/**
 * Determine if the widget has a custom or predefined
 * theme and setup the colors accordingly
 *
 * @exports setupWidgetColors
 * @params {object} widget
 * @params {object} config
 */
function setupWidgetColors (widget, config) {
  switch (config.theme) {
  case 'custom':
    if (config.colors) {
      setCustomColors(widget, config.colors);
    }
    break;
  case 'none':
    // Do nothing, we will rely on CSS for the colors
    break;
  default:
    if (config.theme) {
      setCustomColors(widget, defaultProps.generic.themes[config.theme]);
    }
    break;
  }
}

/** @module pathfora/widgets/create-widget-html */

// globals
// dom
// widgets
/**
 * Call all the necessary functions to construct
 * the widget html
 *
 * @exports createWidgetHtml
 * @params {object} config
 * @returns {object} widget
 */
function createWidgetHtml (config) {
  var widget = document.createElement('div');

  widget.innerHTML = templates[config.type][config.layout] || '';
  widget.id = config.id;

  if (widget.innerHTML === '') {
    throw new Error('Could not get pathfora template based on type and layout.');
  }

  setupWidgetPosition(widget, config);
  constructWidgetActions(widget, config);
  setupWidgetContentUnit(widget, config);
  setWidgetClassname(widget, config);
  constructWidgetLayout(widget, config);
  setupWidgetColors(widget, config);

  return widget;
}

/** @module pathfora/widgets/widget-resize-listener */

// globals
// utils
/**
 * Adjust widget look and feel on window resize bounds
 *
 * @exports widgetResizeListener
 * @params {object} widget
 * @params {object} node
 */
function widgetResizeListener (widget, node) {
  if (widget.layout === 'inline' || widget.layout === 'modal' && widget.recommend) {
    var rec = node.querySelector('.pf-content-unit');
    if (rec) {
      if (node.offsetWidth < WIDTH_BREAKPOINT && !hasClass(rec, 'stack')) {
        addClass(rec, 'stack');
      } else if (node.offsetWidth >= WIDTH_BREAKPOINT) {
        removeClass(rec, 'stack');
      }
    }
  }
}

/** @module pathfora/widgets/show-widget */

// globals
// dom
// utils
// data
// display conditions
// widgets
/**
 * Make the widget visible to the user
 *
 * @exports showWidget
 * @params {object} widget
 */
function showWidget (widget) {
  // FIXME Change to Array#filter and Array#length
  for (var i = 0; i < widgetTracker.openedWidgets.length; i++) {
    if (widgetTracker.openedWidgets[i] === widget) {
      return;
    }
  }

  widgetTracker.openedWidgets.push(widget);
  trackWidgetAction('show', widget);

  if (widget.displayConditions.impressions) {
    incrementImpressions(widget);
  }

  var node = createWidgetHtml(widget);

  if (widget.showSocialLogin) {
    if (widget.showForm === false) {
      widgetTracker.openedWidgets.pop();
      throw new Error('Social login requires a form on the widget');
    }
  }

  if (widget.pushDown) {
    addClass(document.querySelector('.pf-push-down'), 'opened');
  }

  if (widget.config.layout !== 'inline') {
    document.body.appendChild(node);
  } else {
    var hostNode = document.querySelector(widget.config.position);

    if (hostNode) {
      hostNode.appendChild(node);
    } else {
      widgetTracker.openedWidgets.pop();
      throw new Error('Inline widget could not be initialized in ' + widget.config.position);
    }
  }

  // NOTE wait for appending to DOM to trigger the animation
  // FIXME 50 - magical number
  setTimeout(function () {
    var widgetLoadCallback = widget.config.onLoad;

    addClass(node, 'opened');

    if (typeof widgetLoadCallback === 'function') {
      widgetLoadCallback(callbackTypes.LOAD, {
        config: widget,
        widget: node
      });
    }
    if (widget.config.layout === 'modal' && typeof widget.config.onModalOpen === 'function') {
      widget.config.onModalOpen(callbackTypes.MODAL_OPEN, {
        config: widget,
        widget: node
      });
    }
  }, 50);


  if (widget.displayConditions.hideAfter) {
    setTimeout(function () {
      closeWidget(widget.id, true);
    }, widget.displayConditions.hideAfter * 1000);
  }

  widgetResizeListener(widget, node);

  if (typeof window.addEventListener === 'function') {
    window.addEventListener('resize', function () {
      widgetResizeListener(widget, node);
    });
  }
}

/** @module pathfora/display-conditions/watchers/core/validate-watchers */

// display conditions
// widgets
function validateWatchers (widget, cb) {
  var valid = true;

  for (var key in widget.watchers) {
    if (widget.watchers.hasOwnProperty(key) && widget.watchers[key] !== null) {
      valid = widget.valid && widget.watchers[key].check();
    }
  }

  if (widget.displayConditions.impressions && valid) {
    valid = impressionsChecker(widget.displayConditions.impressions, widget);
  }

  if (valid) {
    showWidget(widget);
    widget.valid = false;
    cb();

    return true;
  }

  return false;
}

/** @module pathfora/display-conditions/manual-trigger/trigger-widget */

// globals
// display conditions
/**
 * Trigger a single "manualTrigger" widget to be shown
 *
 * @exports triggerWidget
 * @params {object} widget
 * @returns {boolean}
 */
function triggerWidget (widget) {
  return validateWatchers(widget, function () {
    widgetTracker.triggeredWidgets[widget.id] = false;

    // remove from the ready widgets list
    widgetTracker.readyWidgets.some(function (w, i) {
      if (w.id === widget.id) {
        widgetTracker.readyWidgets.splice(i, 1);
        return true;
      }
    });
  });
}

/** @module pathfora/display-conditions/manual-trigger/trigger-widgets */

// globals
// display conditions
/**
 * Public method to trigger a widget that has already been
 * initialized and have the "manualTrigger" display condition
 *
 * @exports triggerWidgets
 * @params {array} widgetIds
 */
function triggerWidgets (widgetIds) {
  var i, valid;

  // no widget ids provided, trigger all ready widgets
  if (typeof widgetIds === 'undefined') {
    widgetTracker.triggeredWidgets['*'] = true;

    for (i = 0; i < widgetTracker.readyWidgets.length; i++) {
      valid = triggerWidget(widgetTracker.readyWidgets[i]);
      if (valid) {
        i--;
      }
    }

  // trigger all widget ids provided
  } else {
    widgetIds.forEach(function (id) {
      if (widgetTracker.triggeredWidgets[id] !== false) {
        widgetTracker.triggeredWidgets[id] = true;
      }

      for (i = 0; i < widgetTracker.readyWidgets.length; i++) {
        valid = triggerWidget(widgetTracker.readyWidgets[i]);
        if (valid) {
          i--;
        }
      }
    });
  }
}

/** @module pathfora/display-conditions/delay/register-delayed-widget */

/**
 * Begin waiting for a delayed widget
 *
 * @exports registerDelayedWidget
 * @params {object} widget
 */
function registerDelayedWidget (widget) {
  var pf = this;
  widgetTracker.delayedWidgets[widget.id] = setTimeout(function () {
    pf.initializeWidget(widget);
  }, widget.displayConditions.showDelay * 1000);
}

/** @module pathfora/display-conditions/entity-field-checker */

/**
 * Fill in the data for a entity field template in
 * a widgets text fields
 *
 * @exports entityFieldChecker
 * @params {object} widget
 * @params {string} fieldName
 * @params {array} found
 * @returns {boolean}
 */
function entityFieldChecker (widget, fieldName, found) {
  if (!found || !found.length) {
    return true;
  }

  // for each template found...
  for (var f = 0; f < found.length; f++) {
    // parse the field name
    var dataval = found[f].slice(2).slice(0, -2),
        parts = dataval.split('|'),
        def = '';

    // get the default (fallback) value
    if (parts.length > 1) {
      def = parts[1].trim();
    }

    // check for subfields if the value is an object
    var split = parts[0].trim().split('.');

    dataval = window.lio.data;
    var s;

    for (s = 0; s < split.length; s++) {
      if (typeof dataval !== 'undefined') {
        dataval = dataval[split[s]];
      }
    }

    // if we couldn't find the data in question on the lytics jstag, check pathfora.customData
    if (typeof dataval === 'undefined') {
      dataval = this.customData;

      for (s = 0; s < split.length; s++) {
        if (typeof dataval !== 'undefined') {
          dataval = dataval[split[s]];
        }
      }
    }

    // replace the template with the lytics data value
    if (typeof dataval !== 'undefined') {
      widget[fieldName] = widget[fieldName].replace(found[f], dataval);
    // if there's no default and we should error
    } else if ((!def || def.length === 0) && widget.displayConditions.showOnMissingFields !== true) {
      return false;
    // replace with the default option, or empty string if not found
    } else {
      widget[fieldName] = widget[fieldName].replace(found[f], def);
    }
  }

  return true;
}

/** @module pathfora/data/tracking/track-time-on-page */

/**
 * Record the amount of time the user has spent
 * on the current page
 *
 * @exports trackTimeOnPage
 */
function trackTimeOnPage () {
  setInterval(function () {
    pathforaDataObject.timeSpentOnPage += 1;
  }, 1000);
}

/** @module pathfora/data/segments/get-user-segments */

/**
 * Get a list of Lytics segments for the user
 *
 * @exports getUserSegments
 * @returns {array} segments
 */
function getUserSegments () {
  if (window.lio && window.lio.data && window.lio.data.segments) {
    return window.lio.data.segments;
  } else {
    return ['all'];
  }
}

/** @module pathfora/widgets/validate-widgets-object */

/**
 * Validate that the widget has correct position field
 * for its layout and type
 *
 * @exports validateWidgetPosition
 * @params {object} widget
 * @params {object} config
 */
function validateWidgetsObject (widgets) {
  if (!widgets) {
    throw new Error('Widgets not specified');
  }

  if (!(widgets instanceof Array) && widgets.target) {
    widgets.common = widgets.common || [];

    for (var i = 0; i < widgets.target.length; i++) {
      if (!widgets.target[i].segment) {
        throw new Error('All targeted widgets should have segment specified');
      } else if (widgets.target[i].segment === '*') {
        widgets.common = widgets.common.concat(widgets.target[i].widgets);
        widgets.target.splice(i, 1);
      }
    }
  }
}

/** @module pathfora/widgets/init-widgets */

// globals
// dom
// utils
// data
// widgets
/**
 * Public method used to initialize widgets once
 * the individual configs have been created
 *
 * @exports initializeWidgets
 * @params {object} widgets
 * @params {object} config
 */
function initializeWidgets (widgets, config) {
  // NOTE IE < 10 not supported
  // FIXME Why? 'atob' can be polyfilled, 'all' is not necessary anymore?
  var pf = this;
  if (document.all && !window.atob) {
    return;
  }

  // support legacy initialize function where we passed account id as
  // a second parameter and config as third
  if (arguments.length >= 3) {
    config = arguments[2];
  // if the second param is an account id, we need to throw it out
  } else if (typeof config === 'string') {
    config = null;
  }

  validateWidgetsObject(widgets);
  trackTimeOnPage();

  if (config) {
    updateObject(defaultProps, config);
  }

  if (widgets instanceof Array) {

    // NOTE Simple initialization
    pf.initializeWidgetArray(widgets);
  } else {

    // NOTE Target sensitive widgets
    if (widgets.common) {
      pf.initializeWidgetArray(widgets.common);
      updateObject(defaultProps, widgets.common.config);
    }

    if (widgets.target || widgets.exclude) {
      // Add callback to initialize once we know segments are loaded
      pf.addCallback(function () {
        var target, ti, tl, exclude, ei, ex, ey, el,
            targetedwidgets = [],
            excludematched = false,
            segments = getUserSegments();

        // handle inclusions
        if (widgets.target) {
          tl = widgets.target.length;
          for (ti = 0; ti < tl; ti++) {
            target = widgets.target[ti];
            if (segments && segments.indexOf(target.segment) !== -1) {
              // add the widgets with proper targeting to the master list
              // ensure we dont overwrite existing widgets in target
              targetedwidgets = targetedwidgets.concat(target.widgets);
            }
          }
        }

        // handle exclusions
        if (widgets.exclude) {
          el = widgets.exclude.length;
          for (ei = 0; ei < el; ei++) {
            exclude = widgets.exclude[ei];
            if (segments && segments.indexOf(exclude.segment) !== -1) {
              // we found a match, ensure the corresponding segment(s) are not in the
              // targetted widgets array
              for (ex = 0; ex < targetedwidgets.length; ex++) {
                for (ey = 0; ey < exclude.widgets.length; ey++) {
                  if (targetedwidgets[ex] === exclude.widgets[ey]) {
                    targetedwidgets.splice(ex, 1);
                  }
                }
              }
            }
          }
        }

        if (targetedwidgets.length) {
          pf.initializeWidgetArray(targetedwidgets);
        }

        if (!targetedwidgets.length && !excludematched && widgets.inverse) {
          pf.initializeWidgetArray(widgets.inverse);
        }
      });
    }
  }
}

/** @module pathfora/data/request/get-data */

/**
 * Make an http GET request
 *
 * @exports getData
 * @params {string} url
 * @params {function} onSuccess
 * @params {function} onError
 */
function getData (url, onSuccess, onError) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      onSuccess(xhr.responseText);
    } else if (xhr.readyState === 4) {
      onError(xhr.responseText);
    }
  };

  xhr.open('GET', url);
  xhr.send();
}

/** @module pathfora/recommendations/recommend-content */

// globals
// utils
// data
/**
 * Make the request to the Lytics content recommendation API
 * and return a list of recommended documents
 *
 * @exports recommendContent
 * @params {string} accountId
 * @params {object} params
 * @params {string} id
 * @params {function} callback
 */
function recommendContent (accountId, params, id, callback) {
  // Recommendation API:
  // https://www.getlytics.com/developers/rest-api#content-recommendation

  // if we have the recommendation response cached in session storage
  // use that instead of making a new API request
  var storedRec = sessionStorage.getItem(PREFIX_REC + id);

  if (typeof storedRec === 'string' && params.visited !== false) {
    var rec;

    try {
      rec = JSON.parse(storedRec);
    } catch (e) {
      console.warn('Could not parse json stored response:' + e);
    }

    if (rec && rec.data) {
      // special case: shuffle param
      if (params.shuffle === true) {
        rec.data.shift();
      }

      if (rec.data.length > 0) {
        sessionStorage.setItem(PREFIX_REC + id, JSON.stringify(rec.data));
        callback(rec.data);
      }
      return;
    }
  }

  var seerId = readCookie('seerid');

  if (!seerId) {
    throw new Error('Cannot find SEERID cookie');
  }

  var recommendParts = [
    API_URL + '/api/content/recommend/',
    accountId,
    '/user/_uids/',
    seerId
  ];


  var ql = params.ql,
      ast = params.ast,
      display = params.display;

  delete params.ql;
  delete params.ast;
  delete params.display;

  var queries = constructQueries(params);

  params.display = display;

  if (!params.contentsegment) {
    // Special case for Adhoc Segments
    if (ql && ql.raw || ast) {
      if (queries.length > 0) {
        queries += '&';
      } else {
        queries += '?';
      }

      // Filter QL
      if (ql && ql.raw) {
        queries += 'ql=' + ql.raw;

      // Segment JSON (usually segment AST)
      } else {
        var contentSegment = {table: 'content', ast: ast};
        queries += 'contentsegments=[' + encodeURIComponent(JSON.stringify(contentSegment)) + ']';
      }
    }
  }

  var recommendUrl = recommendParts.join('') + queries;

  getData(recommendUrl, function (json) {

    // set the session storage.
    sessionStorage.setItem(PREFIX_REC + id, json);
    var resp;

    try {
      resp = JSON.parse(json);
    } catch (e) {
      console.warn('Could not parse json response:' + e);
      callback([]);
      return;
    }

    if (resp.data && resp.data.length > 0) {
      // append a protocol for urls that are absolute
      for (var i = 0; i < resp.data.length; i++) {
        var url = resp.data[i].url;
        if (url) {
          var split = url.split('/')[0].split('.');
          if (split.length > 1) {
            resp.data[i].url = 'http://' + url;
          }
        }
      }

      callback(resp.data);
    } else {
      callback([]);
    }
  }, function () {
    callback([]);
  });
}

/** @module pathfora/widgets/initialize-widget-array */

// globals
// dom
// utils
// recommendations
/**
 * Given an array of widgets, begin off the initialization
 * process for each
 *
 * @exports initializeWidgetArray
 * @params {array} array
 */
function initializeWidgetArray (array) {
  var pf = this;

  var displayWidget = function (w) {
    if (w.displayConditions.showDelay) {
      pf.registerDelayedWidget(w);
    } else {
      pf.initializeWidget(w);
    }
  };

  var recContent = function (w, params) {
    pf.addCallback(function () {
      if (typeof pf.acctid !== 'undefined' && pf.acctid === '') {
        if (window.lio && window.lio.account) {
          pf.acctid = window.lio.account.id;
        } else {
          throw new Error('Could not get account id from Lytics Javascript tag.');
        }
      }

      recommendContent(pf.acctid, params, w.id, function (resp) {
        // if we get a response from the recommend api put it as the first
        // element in the content object this replaces any default content
        if (resp[0]) {
          var content = resp[0];
          w.content = [
            {
              title: content.title,
              description: content.description,
              url: content.url,
              image: content.primary_image,
              date: content.created,
              author: content.author
            }
          ];
        }

        // if we didn't get a valid response from the api, we check if a default
        // exists and use that as our content piece instead
        if (!w.content) {
          throw new Error('Could not get recommendation and no default defined');
        }

        displayWidget(w);
      });
    });
  };

  for (var i = 0; i < array.length; i++) {
    var widget = array[i];

    if (!widget || !widget.config) {
      continue;
    }

    var widgetOnInitCallback = widget.config.onInit,
        defaults = defaultProps[widget.type],
        globals = defaultProps.generic;

    if (widget.type === 'sitegate' && readCookie(PREFIX_UNLOCK + widget.id) === 'true' || widget.hiddenViaABTests === true) {
      continue;
    }

    if (widgetTracker.initializedWidgets.indexOf(widget.id) < 0) {
      widgetTracker.initializedWidgets.push(widget.id);
    } else {
      throw new Error('Cannot add two widgets with the same id');
    }

    updateObject(widget, globals);
    updateObject(widget, defaults);
    updateObject(widget, widget.config);

    if (widget.type === 'message' && (widget.recommend && Object.keys(widget.recommend).length !== 0) || (widget.content && widget.content.length !== 0)) {
      if (widget.layout !== 'slideout' && widget.layout !== 'modal' && widget.layout !== 'inline') {
        throw new Error('Unsupported layout for content recommendation');
      }

      if (widget.content && widget.content[0] && !widget.content[0].default) {
        throw new Error('Cannot define recommended content unless it is a default');
      }

      var params = widget.recommend;

      if (widget.recommend.collection) {
        params.contentsegment = widget.recommend.collection;
        delete params.collection;
      }

      recContent(widget, params);

    } else {
      displayWidget(widget);
    }

    // NOTE onInit feels better here
    if (typeof widgetOnInitCallback === 'function') {
      widgetOnInitCallback(callbackTypes.INIT, {
        config: widget
      });
    }
  }
}

/** @module pathfora/display-conditions/date-checker */

/**
 * Check if the current date fits within the
 * date displayConitions for the widget
 *
 * @exports dateChecker
 * @params {object} date
 * @returns {boolean}
 */
function dateChecker (date) {
  var valid = true,
      today = Date.now();

  if (date.start_at && today < new Date(date.start_at).getTime()) {
    valid = false;
  }

  if (date.end_at && today > new Date(date.end_at).getTime()) {
    valid = false;
  }

  return valid;
}

/** @module pathfora/display-conditions/pageviews/page-visits-checker */

// globals
// utils
/**
 * Check if the pagevist count meets the requirements
 *
 * @exports pageVisitsChecker
 * @returns {boolean}
 */
function pageVisitsChecker (pageVisitsRequired) {
  return (readCookie(PF_PAGEVIEWS) >= pageVisitsRequired);
}

/** @module pathfora/display-conditions/hide-after-action-checker */

// globals
// utils
/**
 * Check if a widget should be hidden because it meets
 * a hideAfterAction display condition
 *
 * @exports hideAfterActionChecker
 * @params {object} hideAfterActionConstraints
 * @params {string} widget
 * @returns {boolean}
 */
function hideAfterActionChecker (hideAfterActionConstraints, widget) {
  var parts,
      valid = true,
      now = Date.now(),
      confirm = readCookie(PREFIX_CONFIRM + widget.id),
      cancel = readCookie(PREFIX_CANCEL + widget.id),
      closed = readCookie(PREFIX_CLOSE + widget.id);

  if (hideAfterActionConstraints.confirm && confirm) {
    parts = confirm.split('|');

    if (parseInt(parts[0], 10) >= hideAfterActionConstraints.confirm.hideCount) {
      valid = false;
    }

    if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.confirm.duration) {
      valid = false;
    }
  }

  if (hideAfterActionConstraints.cancel && cancel) {
    parts = cancel.split('|');

    if (parseInt(parts[0], 10) >= hideAfterActionConstraints.cancel.hideCount) {
      valid = false;
    }

    if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.cancel.duration) {
      valid = false;
    }
  }

  if (hideAfterActionConstraints.closed && closed) {
    parts = closed.split('|');

    if (parseInt(parts[0], 10) >= hideAfterActionConstraints.closed.hideCount) {
      valid = false;
    }

    if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.closed.duration) {
      valid = false;
    }
  }

  return valid;
}

/** @module pathfora/display-conditions/url-contains/parse-query */

/**
 * Convert key/value queries from a URL into an object
 *
 * @exports parseQuery
 * @params {string} url
 * @returns {object} query
 */
function parseQuery (url) {
  var query = {},
      pieces = escapeURI(url, { keepEscaped: true }).split('?');

  if (pieces.length > 1) {
    pieces = pieces[1].split('&');

    for (var i = 0; i < pieces.length; i++) {
      var pair = pieces[i].split('=');

      if (pair.length > 1) {
        // NOTE We should not account for the preview id
        if (pair[0] !== 'lytics_variation_preview_id') {
          query[pair[0]] = pair[1];
        }
      }
    }
  }

  return query;
}

/** @module pathfora/display-conditions/url-contains/compare-queries */

/**
 * Check if urls contain matching query params
 *
 * @exports compareQueries
 * @params {object} query
 * @params {object} matchQuery
 * @params {string} rule
 * @returns {bool}
 */
function compareQueries (query, matchQuery, rule) {
  switch (rule) {
  case 'exact':
    if (Object.keys(matchQuery).length !== Object.keys(query).length) {
      return false;
    }
    break;

  default:
    break;
  }

  for (var key in matchQuery) {
    if (matchQuery.hasOwnProperty(key) && matchQuery[key] !== query[key]) {
      return false;
    }
  }

  return true;
}

/** @module pathfora/display-conditions/url-contains/phrase-checker */

// utils
// display conditions
/**
 * Evaluate if the current URL matches a single urlContains
 * rule provided
 *
 * @exports phraseChecker
 * @params {object} phrase
 * @params {string} url
 * @params {string} simpleurl
 * @params {object} queries
 * @returns {boolean}
 */
function phraseChecker (phrase, url, simpleurl, queries) {
  var valid = false;

  // legacy match allows for an array of strings, check if we are legacy or current object approach
  switch (typeof phrase) {
  case 'string':
    if (url.indexOf(escapeURI(phrase.split('?')[0], { keepEscaped: true })) !== -1) {
      valid = compareQueries(queries, parseQuery(phrase), 'substring');
    }
    break;

  case 'object':
    if (phrase.match && phrase.value) {
      var phraseValue = escapeURI(phrase.value, { keepEscaped: true });

      switch (phrase.match) {
      // simple match
      case 'simple':
        if (simpleurl.slice(-1) === '/') {
          simpleurl = simpleurl.slice(0, -1);
        }

        if (phrase.value.slice(-1) === '/') {
          phrase.value = phrase.value.slice(0, -1);
        }

        if (simpleurl === phrase.value) {
          valid = true;
        }
        break;

      // exact match
      case 'exact':
        if (url.split('?')[0].replace(/\/$/, '') === phraseValue.split('?')[0].replace(/\/$/, '')) {
          valid = compareQueries(queries, parseQuery(phraseValue), phrase.match);
        }
        break;

      // regex
      case 'regex':
        var re = new RegExp(phrase.value);

        if (re.test(url)) {
          valid = true;
        }
        break;

      // string match (default)
      default:
        if (url.indexOf(phraseValue.split('?')[0]) !== -1) {
          valid = compareQueries(queries, parseQuery(phraseValue), phrase.match);
        }
        break;
      }

    } else {
      console.log('invalid display conditions');
    }
    break;

  default:
    console.log('invalid display conditions');
    break;
  }

  return valid;
}

/** @module pathfora/display-conditions/url-contains/url-checker */

// utils
// display conditions
/**
 * Evaluate if the current URL matches the rules defined
 * by the urlContains display condition
 *
 * @exports urlChecker
 * @params {array} phrases
 * @returns {boolean}
 */
function urlChecker (phrases) {
  var url = escapeURI(window.location.href, { keepEscaped: true }),
      simpleurl = window.location.hostname + window.location.pathname,
      queries = parseQuery(url),
      valid, excludeValid = false,
      matchCt, excludeCt = 0;

  if (!(phrases instanceof Array)) {
    phrases = Object.keys(phrases).map(function (key) {
      return phrases[key];
    });
  }

  // array of urlContains params is an or list, so if any are true evaluate valid to true
  if (phrases.indexOf('*') === -1) {
    phrases.forEach(function (phrase) {
      if (phrase.exclude) {
        excludeValid = phraseChecker(phrase, url, simpleurl, queries) || excludeValid;
        excludeCt++;
      } else {
        valid = phraseChecker(phrase, url, simpleurl, queries) || valid;
        matchCt++;
      }
    });
  } else {
    valid = true;
  }

  if (matchCt === 0) {
    return !excludeValid;
  }

  if (excludeCt === 0) {
    return valid;
  }

  return valid && !excludeValid;
}

/** @module pathfora/display-conditions/init-exit-intent */

// dom
// display conditions
/**
 * Setup exitIntent for a widget
 *
 * @exports initExitIntent
 * @params {object} widget
 * @returns {boolean}
 */
function initializeExitIntent (widget) {
  var positions = [];
  if (!widget.exitIntentListener) {
    widget.exitIntentListener = function (e) {
      positions.push({
        x: e.clientX,
        y: e.clientY
      });
      if (positions.length > 30) {
        positions.shift();
      }
    };

    widget.exitIntentTrigger = function (e) {
      var from = e.relatedTarget || e.toElement;

      // When there is registered movement and leaving the root element
      if (positions.length > 1 && (!from || from.nodeName === 'HTML')) {
        var valid;

        var y = positions[positions.length - 1].y;
        var py = positions[positions.length - 2].y;
        var ySpeed = Math.abs(y - py);

        // Did the cursor move up?
        // Is it reasonable to believe that it left the top of the page, given the position and the speed?
        valid = widget.valid && y - ySpeed <= 50 && y < py;

        if (valid) {
          validateWatchers(widget, function () {
            if (typeof document.addEventListener === 'function') {
              document.removeEventListener('mousemove', widget.exitIntentListener);
              document.removeEventListener('mouseout', widget.exitIntentTrigger);
            } else {
              document.onmousemove = null;
              document.onmouseout = null;
            }
          });
        }

        positions = [];
      }
    };

    // FUTURE Discuss https://www.npmjs.com/package/ie8 polyfill
    if (typeof document.addEventListener === 'function') {
      document.addEventListener('mousemove', widget.exitIntentListener, false);
      document.addEventListener('mouseout', widget.exitIntentTrigger, false);
    } else {
      document.onmousemove = widget.exitIntentListener;
      document.onmouseout = widget.exitIntentTrigger;
    }
  }
  return true;
}

/** @module pathfora/display-conditions/watchers/remove-watcher */

function removeWatcher (watcher, widget) {
  for (var key in widget.watchers) {
    if (widget.watchers.hasOwnProperty(key) && watcher === widget.watchers[key]) {
      widget.watchers.splice(key, 1);
    }
  }
}

/** @module pathfora/display-conditions/scroll/register-element-watcher */

// dom
// display conditions
/**
 * Setup watcher for displayWhenElementVisible
 * display condition
 *
 * @exports registerElementWatcher
 * @params {string} selector
 * @params {object} widget
 * @returns {object} watcher
 */
function registerElementWatcher (selector, widget) {
  var watcher = {
    elem: document.querySelector(selector),

    check: function () {
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
          scrolledToBottom = window.innerHeight + scrollTop >= document.body.offsetHeight;

      if (watcher.elem.offsetTop - window.innerHeight / 2 <= scrollTop || scrolledToBottom) {
        removeWatcher(watcher, widget);
        return true;
      }
      return false;
    }
  };

  return watcher;
}

/** @module pathfora/display-conditions/scroll/init-scroll-watchers */

// dom
// display conditions
/**
 * Add event listener for scroll display conditions
 *
 * @exports initializeScrollWatchers
 * @params {object} widget
 * @returns {boolean}
 */
function initializeScrollWatchers (widget) {
  widget.scrollListener = function () {
    validateWatchers(widget, function () {
      if (typeof window.addEventListener === 'function') {
        window.removeEventListener('scroll', widget.scrollListener);
      } else {
        window.onscroll = null;
      }
    });
  };

  // FUTURE Discuss https://www.npmjs.com/package/ie8 polyfill
  if (typeof window.addEventListener === 'function') {
    window.addEventListener('scroll', widget.scrollListener, false);
  } else {
    window.onscroll = widget.scrollListener;
  }
  return true;
}

/** @module pathfora/display-conditions/scroll/register-position-watcher */

// dom
// display conditions
/**
 * Setup watcher for scrollPercentageToDisplay
 * display condition
 *
 * @exports registerPositionWatcher
 * @params {int} percent
 * @params {object} widget
 * @returns {object} watcher
 */
function registerPositionWatcher (percent, widget) {
  var watcher = {
    check: function () {
      var height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight),
          positionInPixels = height * (percent / 100),
          offset = document.documentElement.scrollTop || document.body.scrollTop;

      if (offset >= positionInPixels) {
        removeWatcher(watcher, widget);
        return true;
      }
      return false;
    }
  };

  return watcher;
}

/** @module pathfora/display-conditions/manual-trigger/register-manual-trigger-watcher */

// globals
// display conditions
/**
 * Begin watching for a custom javascript trigger
 *
 * @exports registerManualTriggerWatcher
 * @params {object} widget
 * @params {boolean} value
 * @returns {object} watcher
 */
function registerManualTriggerWatcher (value, widget) {
  var watcher = {
    check: function () {
      if (value && widgetTracker.triggeredWidgets[widget.id] || widgetTracker.triggeredWidgets['*']) {
        removeWatcher(watcher, widget);
        return true;
      }
      return false;
    }
  };

  return watcher;
}

/** @module pathfora/widgets/init-widget */

// display conditions
// widgets
// globals
// dom
// utils
/**
 * Determine if a widget should be shown based on display
 * conditions, and if so show the widget
 *
 * @exports initializeWidget
 * @params {object} widget
 */
function initializeWidget (widget) {
  var watcher,
      condition = widget.displayConditions,
      pf = this;

  widget.watchers = [];

  // NOTE Default cookie expiration is one year from now
  widget.expiration = new Date();
  widget.expiration.setDate(widget.expiration.getDate() + 365);

  if (widget.pushDown) {
    if (widget.layout === 'bar' && (widget.position === 'top-fixed' || widget.position === 'top-absolute')) {
      addClass(document.querySelector(widget.pushDown), 'pf-push-down');
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

    if (typeof condition.priority !== 'undefined' && widget.valid && widgetTracker.prioritizedWidgets.indexOf(widget) === -1) {
      widgetTracker.prioritizedWidgets.push(widget);
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
    pf.addCallback(function () {
      widget.valid = widget.valid && pf.entityFieldChecker(widget, 'msg', foundMsg);
      widget.valid = widget.valid && pf.entityFieldChecker(widget, 'headline', foundHeadline);
      widget.valid = widget.valid && pf.entityFieldChecker(widget, 'image', foundImage);
      evalDisplayConditions();
    });
  } else {
    evalDisplayConditions();
  }
}

/** @module pathfora/widgets/preview-widget */

// utils
// widgets
/**
 * Create a minimal widget for a preview
 *
 * @exports previewWidget
 * @params {object} widget
 * @returns {object}
 */
function previewWidget (widget) {
  widget.id = generateUniqueId();
  return createWidgetHtml(widget);
}

/** @module core/cancel-delayed-widget */

/**
 * Cancel waiting for a delayed widget
 *
 * @exports cancelDelayedWidget
 * @params {object} widget
 */
function cancelDelayedWidget (widget) {
  var delayObj = widgetTracker.delayedWidgets[widget.id];

  if (delayObj) {
    clearTimeout(delayObj);
    delete widgetTracker.delayedWidgets[widget.id];
  }
}

/** @module pathfora/widgets/clear-all */

// globals
// dom
// utils
// display conditions
/**
 * Close all widgets and reset all settings to default
 *
 * @exports clearAll
 */
function clearAll () {
  var opened = widgetTracker.openedWidgets,
      delayed = widgetTracker.delayedWidgets;

  opened.forEach(function (widget) {
    var element = document.getElementById(widget.id);
    removeClass(element, 'opened');
    element.parentNode.removeChild(element);
  });

  opened.slice(0);

  for (var i = delayed.length; i > -1; i--) {
    cancelDelayedWidget(delayed[i]);
  }

  resetWidgetTracker(widgetTracker);
  resetDataObject(pathforaDataObject);
  resetDefaultProps(defaultProps);
}

/** @module pathfora/widgets/reinit-prioritized-widgets */

/**
 * Widgets with priority are held from initialization
 * and reinitialized once we've loaded all
 *
 * @exports reinitializePrioritizedWidgets
 */
function reinitializePrioritizedWidgets () {
  if (widgetTracker.prioritizedWidgets.length > 0) {

    widgetTracker.prioritizedWidgets.sort(function (a, b) {
      return a.displayConditions.priority - b.displayConditions.priority;
    }).reverse();

    var highest = widgetTracker.prioritizedWidgets[0].displayConditions.priority;

    for (var j = 0; j < widgetTracker.prioritizedWidgets.length; j++) {
      if (widgetTracker.prioritizedWidgets[j].displayConditions.priority === highest) {
        this.initializeWidget(widgetTracker.prioritizedWidgets[j]);
      } else {
        break;
      }
    }
  }
}

/** @module pathfora/widgets/prepare-widget */

/**
 * Validate that a widget is correctly set up
 *
 * @exports prepareWidget
 * @params {string} type
 * @params {object} config
 * @returns {object}
 */
function prepareWidget (type, config) {
  var props, random,
      widget = {
        valid: true
      };

  if (!config) {
    throw new Error('Config object is missing');
  }

  if (config.layout === 'random') {
    props = {
      layout: ['modal', 'slideout', 'bar', 'folding'],
      variant: ['1', '2'],
      slideout: ['bottom-left', 'bottom-right'],
      bar: ['top-absolute', 'top-fixed', 'bottom-fixed'],
      folding: ['left', 'bottom-left', 'bottom-right']
    };

    // FIXME Hard coded magical numbers, hard coded magical numbers everywhere :))
    switch (type) {
    case 'message':
      random = Math.floor(Math.random() * 4);
      config.layout = props.layout[random];
      break;
    case 'subscription':
      random = Math.floor(Math.random() * 5);
      while (random === 3) {
        random = Math.floor(Math.random() * 5);
      }
      config.layout = props.layout[random];
      break;
    case 'form':
      random = Math.floor(Math.random() * 5);
      while (random === 2 || random === 3) {
        random = Math.floor(Math.random() * 5);
      }
      config.layout = props.layout[random];
    }
    switch (config.layout) {
    case 'folding':
      config.position = props.folding[Math.floor(Math.random() * 3)];
      config.variant = props.variant[Math.floor(Math.random() * 2)];
      break;
    case 'slideout':
      config.position = props.slideout[Math.floor(Math.random() * 2)];
      config.variant = props.variant[Math.floor(Math.random() * 2)];
      break;
    case 'modal':
      config.variant = props.variant[Math.floor(Math.random() * 2)];
      config.position = '';
      break;
    case 'bar':
      config.position = props.bar[Math.floor(Math.random() * 3)];
      break;
    case 'inline':
      config.position = 'body';
      break;
    }
  }
  widget.type = type;
  widget.config = config;

  if (!config.id) {
    throw new Error('All widgets must have an id value');
  }

  widget.id = config.id;

  return widget;
}

/** @module pathfora/widgets/message */

/**
 * Public method to create a widget of type message
 *
 * @exports Message
 * @params {object} config
 * @returns {object}
 */
function Message (config) {
  return prepareWidget('message', config);
}

/** @module pathfora/widgets/subscription */

/**
 * Public method to create a widget of type subscription
 *
 * @exports Subscription
 * @params {object} config
 * @returns {object}
 */
function Subscription (config) {
  return prepareWidget('subscription', config);
}

/** @module pathfora/widgets/form */

/**
 * Public method to create a widget of type form
 *
 * @exports Form
 * @params {object} config
 * @returns {object}
 */
function Form (config) {
  return prepareWidget('form', config);
}

/** @module pathfora/widgets/site-gate */

/**
 * Public method to create a widget of type site gate
 *
 * @exports SiteGate
 * @params {object} config
 * @returns {object}
 */
function SiteGate (config) {
  return prepareWidget('sitegate', config);
}

/** @module pathfora/ab-test/init-ab-test */

// globals
// utils
/**
 * Initialized A/B test from user config
 *
 * @exports initializeABTesting
 * @params {object} abTests
 */
function initializeABTesting (abTests) {
  abTests.forEach(function (abTest) {
    var abTestingType = abTest.type,
        userAbTestingValue = readCookie(abTest.cookieId),
        userAbTestingGroup = 0,
        date = new Date();

    if (!userAbTestingValue) {
      userAbTestingValue = Math.random();
    }

    // NOTE Always update the cookie to get the new exp date.
    date.setDate(date.getDate() + 365);
    saveCookie(abTest.cookieId, userAbTestingValue, date);

    // NOTE Determine visible group for the user
    var i = 0;
    while (i < 1) {
      i += abTestingType.groups[userAbTestingGroup];

      if (userAbTestingValue <= i) {
        break;
      }

      userAbTestingGroup++;
    }

    // NOTE Notify widgets about their proper AB groups
    abTest.groups.forEach(function (group, index) {
      group.forEach(function (widget) {
        if (typeof widget.abTestingGroup === 'undefined') {
          widget.abTestingGroup = index;
          widget.hiddenViaABTests = userAbTestingGroup === index;
        } else {
          throw new Error('Widget #' + widget.config.id + ' is defined in more than one AB test.');
        }
      });
    });

    if (typeof pathforaDataObject.abTestingGroups[abTest.id] !== 'undefined') {
      throw new Error('AB test with ID=' + abTest.id + ' has been already defined.');
    }

    pathforaDataObject.abTestingGroups[abTest.id] = userAbTestingGroup;
  });
}

/** @module pathfora/ab-test/prepare-ab-test */

/**
 * Prepares A/B test user config for use
 *
 * @exports initializeABTesting
 * @params {object} abTests
 */
function prepareABTest (config) {
  var test = {};

  if (!config) {
    throw new Error('Config object is missing');
  }

  test.id = config.id;
  test.cookieId = PREFIX_AB_TEST + config.id;
  test.groups = config.groups;

  if (!abTestingTypes[config.type]) {
    throw new Error('Unknown AB testing type: ' + config.type);
  }

  test.type = abTestingTypes[config.type];

  return test;
}

/** @module pathfora/ab-test/ab-test */

/**
 * Public wrapper method for prepareABTest
 *
 * @exports ABTest
 * @param {object} config
 * @returns {object}
 */
function ABTest (config) {
  return prepareABTest(config);
}

/** @module pathfora/form/auto-complete-form-fields */

/**
 * Fill in the form of the widget with
 * the data provided
 *
 * @exports autoCompleteFormFields
 * @params {object} data
 */
function autoCompleteFormFields (data) {
  var widgets = Array.prototype.slice.call(document.querySelectorAll('.pf-widget-content'));

  widgets.forEach(function (widget) {
    if (widget.querySelector('.' + data.type + '-login-btn')) {
      Object.keys(data).forEach(function (inputField) {
        var field = widget.querySelector('input[name="' + inputField + '"]');

        if (field && !field.value) {
          field.value = data[inputField];
        }
      });
    }
  });
}

/** @module pathfora/integrations/auto-complete-facebook-data */

// dom
// form
/**
 * Fill in widget form with data from facebook login
 *
 * @exports autoCompleteFacebookData
 * @params {array} elements
 */
function autoCompleteFacebookData (elements) {
  window.FB.api('/me', {
    fields: 'name,email,work'
  }, function (resp) {
    if (resp && !resp.error) {
      autoCompleteFormFields({
        type: 'facebook',
        username: resp.name || '',
        email: resp.email || ''
      });

      elements.forEach(function (item) {
        item.innerHTML = 'Log Out';
      });
    }
  });
}

/** @module pathfora/form/auto-complete-form-fields */

/**
 * Clear all current values from a widget form
 *
 * @exports clearFormFields
 * @params {string} type
 * @params {array} fields
 */
function clearFormFields (type, fields) {
  var widgets = Array.prototype.slice.call(document.querySelectorAll('.pf-widget-content'));

  widgets.forEach(function (widget) {
    if (widget.querySelector('.' + type + '-login-btn')) {
      fields.forEach(function (inputField) {
        var field = widget.querySelector('input[name="' + inputField + '"]');

        if (field) {
          field.value = '';
        }
      });
    }
  });
}

/** @module pathfora/integrations/on-facebook-click */

// dom
// form
// integrations
/**
 * Setup login when the user clicks the fb
 * social login button
 *
 * @exports onFacebookClick
 * @params {array} elements
 */
function onFacebookClick (elements) {
  window.FB.getLoginStatus(function (connection) {
    if (connection.status === 'connected') {
      window.FB.logout(function () {
        elements.forEach(function (elem) {
          elem.innerHTML = 'Log In';
        });
        clearFormFields('facebook', ['username', 'email']);
      });

    } else {
      window.FB.login(function (resp) {
        if (resp.authResponse) {
          autoCompleteFacebookData(elements);
        }
      });
    }
  });
}

/** @module pathfora/integrations/on-facebook-load */

// dom
// integrations
/**
 * Check if the user is already logged in once
 * the fb library is loaded and setup the click
 * listener for the social button
 *
 * @exports onFacebookLoad
 */
function onFacebookLoad () {
  var fbBtns = Array.prototype.slice.call(document.querySelectorAll('.social-login-btn.facebook-login-btn span'));

  window.FB.getLoginStatus(function (connection) {
    if (connection.status === 'connected') {
      autoCompleteFacebookData(fbBtns);
    }
  });

  fbBtns.forEach(function (element) {
    if (element.parentElement) {
      element.parentElement.onclick = function () {
        onFacebookClick(fbBtns);
      };
    }
  });
}

/** @module pathfora/integrations/facebook */

// globals
// dom
// integrations
/**
 * Initialize facebook tag and set up social login
 * button template
 *
 * @exports integrateWithFacebook
 * @params {string} appId
 */
function integrateWithFacebook (appId) {
  if (appId !== '') {
    var btn = templates.social.facebookBtn.replace(
      /(\{){2}facebook-icon(\}){2}/gm,
      templates.assets.facebookIcon
    );

    var parseFBLoginTemplate = function (parentTemplates) {
      Object.keys(parentTemplates).forEach(function (type) {
        parentTemplates[type] = parentTemplates[type].replace(
          /<p name='fb-login' hidden><\/p>/gm,
          btn
        );
      });
    };

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: appId,
        xfbml: true,
        version: 'v2.5',
        status: true,
        cookie: true
      });

      onFacebookLoad();
    };

    // NOTE API initialization
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    parseFBLoginTemplate(templates.form);
    parseFBLoginTemplate(templates.sitegate);

    pathforaDataObject.socialNetworks.facebookAppId = appId;
  }
}

/** @module pathfora/integrations/auto-complete-google-data */

/**
 * Fill in widget form with data from google login
 *
 * @exports autoCompleteGoogleData
 * @params {object} user
 * @params {array} elements
 */
function autoCompleteGoogleData (user, elements) {
  if (typeof user !== 'undefined') {
    var profile = user.getBasicProfile();

    if (typeof profile !== 'undefined') {
      autoCompleteFormFields({
        type: 'google',
        username: profile.getName() || '',
        email: profile.getEmail() || ''
      });

      elements.forEach(function (item) {
        item.innerHTML = 'Sign Out';
      });
    }
  }
}

/** @module pathfora/integrations/on-google-click */

// dom
// integrations
// form
/**
 * Setup login when the user clicks the google
 * social login button
 *
 * @exports onGoogleClick
 * @params {array} elements
 */
function onGoogleClick (elements) {
  var auth2 = window.gapi.auth2.getAuthInstance();

  if (auth2.isSignedIn.get()) {
    auth2.signOut().then(function () {
      elements.forEach(function (elem) {
        elem.innerHTML = 'Sign In';
      });
      clearFormFields('google', ['username', 'email']);
    });

  } else {
    auth2.signIn().then(function () {
      autoCompleteGoogleData(auth2.currentUser.get(), elements);
    });
  }
}

/** @module pathfora/integrations/on-google-load */

// globals
// dom
// integrations
/**
 * Check if the user is already logged in once
 * the google library is loaded and setup the click
 * listener for the social button
 *
 * @exports onGoogleLoad
 */
function onGoogleLoad () {
  window.gapi.load('auth2', function () {
    var auth2 = gapi.auth2.init({
      clientId: pathforaDataObject.socialNetworks.googleClientID,
      cookiepolicy: 'single_host_origin',
      scope: 'profile'
    });

    var googleBtns = Array.prototype.slice.call(document.querySelectorAll('.social-login-btn.google-login-btn span'));

    auth2.then(function () {
      var user = auth2.currentUser.get();
      autoCompleteGoogleData(user, googleBtns);

      googleBtns.forEach(function (element) {
        if (element.parentElement) {
          element.parentElement.onclick = function () {
            onGoogleClick(googleBtns);
          };
        }
      });
    });
  });
}

/** @module pathfora/integrations/google */

// globals
// dom
// integrations
/**
 * Initialize google tag and set up social login
 * button template
 *
 * @exports integrateWithGoogle
 * @params {string} clientId
 */
function integrateWithGoogle (clientId) {
  if (clientId !== '') {
    var head = document.querySelector('head');

    var appMetaTag = templates.social.googleMeta.replace(
      /(\{){2}google-clientId(\}){2}/gm,
      clientId
    );

    var btn = templates.social.googleBtn.replace(
      /(\{){2}google-icon(\}){2}/gm,
      templates.assets.googleIcon
    );

    var parseGoogleLoginTemplate = function (parentTemplates) {
      Object.keys(parentTemplates).forEach(function (type) {
        parentTemplates[type] = parentTemplates[type].replace(
          /<p name='google-login' hidden><\/p>/gm,
          btn
        );
      });
    };

    head.innerHTML += appMetaTag;

    window.___gcfg = {
      parsetags: 'onload'
    };

    window.pathforaGoogleOnLoad = onGoogleLoad;

    // NOTE Google API
    (function () {
      var s, po = document.createElement('script');
      po.type = 'text/javascript';
      po.async = true;
      po.src = 'https://apis.google.com/js/platform.js?onload=pathforaGoogleOnLoad';
      s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(po, s);
    }());

    pathforaDataObject.socialNetworks.googleClientID = clientId;
    parseGoogleLoginTemplate(templates.form);
    parseGoogleLoginTemplate(templates.sitegate);
  }
}

/** @module pathfora/inline/prep-elements */

/**
 * Build a list of all elements to be personalized
 *
 * @exports prepElements
 * @params {string} attr
 * @returns {object} dataElements
 */
function prepElements (attr) {
  var dataElements = {},
      elements = document.querySelectorAll('[' + attr + ']');

  this.elements = this.elements.concat(elements);

  for (var i = 0; i < elements.length; i++) {
    if (elements[i].getAttribute(attr) !== null) {
      var theElement = elements[i];

      switch (attr) {
      // CASE: Segment triggered elements
      case 'data-pftrigger':
        var group = theElement.getAttribute('data-pfgroup');

        if (!group) {
          group = 'default';
        }

        if (!dataElements[group]) {
          dataElements[group] = [];
        }

        dataElements[group].push({
          elem: theElement,
          displayType: theElement.style.display,
          group: group,
          trigger: theElement.getAttribute('data-pftrigger')
        });
        break;

      // CASE: Content recommendation elements
      case 'data-pfrecommend':
        var recommend = theElement.getAttribute('data-pfrecommend'),
            block = theElement.getAttribute('data-pfblock');

        if (!block) {
          block = 'default';
        }

        if (!recommend) {
          recommend = 'default';
        }

        if (!dataElements[recommend]) {
          dataElements[recommend] = [];
        }

        dataElements[recommend][block] = {
          elem: theElement,
          displayType: theElement.style.display,
          block: block,
          recommend: recommend,
          title: theElement.querySelector('[data-pftype="title"]'),
          image: theElement.querySelector('[data-pftype="image"]'),
          description: theElement.querySelector('[data-pftype="description"]'),
          url: theElement.querySelector('[data-pftype="url"]'),
          published: theElement.querySelector('[data-pftype="published"]'),
          author: theElement.querySelector('[data-pftype="author"]')
        };
        break;
      }
    }
  }
  return dataElements;
}

/** @module pathfora/inline/proc-elements */

/**
 * Kick off the personalization process for inline trigger fields
 * and inline content recommendations
 *
 * @exports procElements
 */
function procElements () {
  var attrs = ['data-pftrigger', 'data-pfrecommend'],
      inline = this,
      count = 0;

  var cb = function (elements) {
    count++;
    // After we have processed all elements, proc defaults
    if (count === Object.keys(elements).length) {
      inline.setDefaultRecommend(elements);
    }
  };

  attrs.forEach(function (attr) {
    var elements = inline.prepElements(attr);

    for (var key in elements) {
      if (elements.hasOwnProperty(key)) {

        switch (attr) {
        // CASE: Segment triggered elements
        case 'data-pftrigger':
          inline.procTriggerElements(elements[key], key);
          break;

        // CASE: Content recommendation elements
        case 'data-pfrecommend':
          if (typeof inline.parent.acctid !== 'undefined' && inline.parent.acctid === '') {
            throw new Error('Could not get account id from Lytics Javascript tag.');
          }

          inline.procRecommendElements(elements[key], key, function () {
            cb(elements);
          });
          break;
        }
      }
    }
  });
}

/** @module pathfora/inline/proc-recommend-elements */

/**
 * Make recommendation and fill in the appropriate inline
 * recommendation elements
 *
 * @exports procRecommendElements
 * @params {object} blocks
 * @params {string} rec
 * @params {function} cb
 */
function procRecommendElements (blocks, rec, cb) {
  var inline = this;

  if (rec !== 'default') {
    // call the recommendation API using the url pattern urlPattern as a filter
    var params = {
      contentsegment: rec
    };

    recommendContent(inline.parent.acctid, params, rec, function (resp) {
      var idx = 0;
      for (var block in blocks) {
        if (blocks.hasOwnProperty(block)) {
          var elems = blocks[block];

          // loop through the results as we loop
          // through each element with a common liorecommend value
          if (resp[idx]) {
            var content = resp[idx];

            if (elems.title) {
              elems.title.innerHTML = content.title;
            }

            // if attribute is on image element
            if (elems.image) {
              if (typeof elems.image.src !== 'undefined') {
                elems.image.src = content.primary_image;
              // if attribute is on container element, set the background
              } else {
                elems.image.style.backgroundImage = 'url("' + content.primary_image + '")';
              }
            }

            // set the description
            if (elems.description) {
              elems.description.innerHTML = content.description;
            }

            // if attribute is on an a (link) element
            if (elems.url) {
              if (typeof elems.url.href !== 'undefined') {
                elems.url.href = content.url;
              // if attribute is on container element
              } else {
                elems.url.innerHTML = content.url;
              }
            }

            // set the date published
            if (elems.published && content.created) {
              var published = new Date(content.created);
              elems.published.innerHTML = published.toLocaleDateString(inline.parent.locale, inline.parent.dateOptions);
            }

            // set the author
            if (elems.author) {
              elems.author.innerHTML = content.author;
            }

            elems.elem.removeAttribute('data-pfrecommend');
            elems.elem.setAttribute('data-pfmodified', 'true');
            inline.preppedElements[block] = elems;
          } else {
            break;
          }
          idx++;
        }
      }
      cb();
    });
  } else {
    for (var block in blocks) {
      if (blocks.hasOwnProperty(block)) {
        inline.defaultElements[block] = blocks[block];
      }
    }
    cb();
  }
}

/** @module pathfora/data/segments/in-segment */

/**
 * Check if the user is a member of a segment
 *
 * @exports inSegment
 * @params {string} match
 * @returns {boolean} membership
 */
function inSegment (match) {
  return (getUserSegments().indexOf(match) !== -1);
}

/** @module pathfora/inline/proc-trigger-elements */

/**
 * Show/hide trigger elements in a group based on
 * Lytics segment membership
 *
 * @exports procTriggerElements
 * @params {object} elems
 * @params {string} group
 */
function procTriggerElements (elems, group) {
  var matched = false,
      defaultEl = {};

  for (var i = 0; i < elems.length; i++) {
    var elem = elems[i];

    // if we find a match show that and prevent others from showing in same group
    if (inSegment(elem.trigger) && !matched) {
      elem.elem.removeAttribute('data-pftrigger');
      elem.elem.setAttribute('data-pfmodified', 'true');
      this.preppedElements[group] = elem;

      if (group !== 'default') {
        matched = true;
        continue;
      }
    }

    // if this is the default save it
    if (elem.trigger === 'default') {
      defaultEl = elem;
    }
  }

  // if nothing matched show default
  if (!matched && group !== 'default' && defaultEl.elem) {
    defaultEl.elem.removeAttribute('data-pftrigger');
    defaultEl.elem.setAttribute('data-pfmodified', 'true');
    this.preppedElements[group] = defaultEl;
  }
}

/** @module pathfora/inline/set-default-recommend */

/**
 * Show the default "recommendation" if we received
 * a bad response from the API
 *
 * @exports setDefaultRecommend
 */
function setDefaultRecommend () {
  // check the default elements
  for (var block in this.defaultElements) {
    // If we already have an element prepped for this block, don't show the default
    if (this.defaultElements.hasOwnProperty(block) && !this.preppedElements.hasOwnProperty(block)) {
      var def = this.defaultElements[block];
      def.elem.removeAttribute('data-pfrecommend');
      def.elem.setAttribute('data-pfmodified', 'true');
      this.preppedElements[block] = def;
    }
  }
}

/** @module pathfora/inline/inline */

// dom
// inline
/**
 * Creates a new instance of inline personalization
 *
 * @exports Inline
 * @class {function} Inline
 * @params {object} pf
 */
function Inline (pf) {
  this.elements = [];
  this.preppedElements = [];
  this.defaultElements = [];
  this.parent = pf;

  this.prepElements = prepElements;
  this.procElements = procElements;
  this.procRecommendElements = procRecommendElements;
  this.procTriggerElements = procTriggerElements;
  this.setDefaultRecommend = setDefaultRecommend;

  // for our automatic element handling we need to ensure they are all hidden by default
  var css = '[data-pftrigger], [data-pfrecommend]{ display: none; }',
      style = document.createElement('style');

  style.type = 'text/css';

  if (style.styleSheet) { // handle ie
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  document.getElementsByTagName('head')[0].appendChild(style);
}

/** @module pathfora/inline/init-inline */

/**
 * Once the dom is ready and Lytics jstag is
 * loaded initialize inline personalization
 *
 * @exports initializeInline
 */
function initializeInline () {
  var pf = this;

  this.onDOMready(function () {
    pf.addCallback(function () {
      if (pf.acctid === '') {
        if (window.lio && window.lio.account) {
          pf.acctid = window.lio.account.id;
        }
      }

      pf.inline.procElements();
    });
  });
}

/** @module pathfora */

// global
// dom
// utils
// data
// callbacks
// display conditions
// widgets
// ab tests
// integrations
// inline
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

}());
