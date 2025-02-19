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
      branding: false,
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
      cancelShow: true
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

  var PF_VERSION = '1.2.17',
    PF_LOCALE = 'en-US',
    PF_DATE_OPTIONS = {},
    PREFIX_REC = 'PathforaRecommend_',
    PREFIX_UNLOCK = 'PathforaUnlocked_',
    PREFIX_IMPRESSION = 'PathforaImpressions_',
    PREFIX_TOTAL_IMPRESSIONS_SINCE = 'PathforaTotalImpressionsSince_',
    PREFIX_CONFIRM = 'PathforaConfirm_',
    PREFIX_CANCEL = 'PathforaCancel_',
    PREFIX_CLOSE = 'PathforaClosed_',
    PREFIX_AB_TEST = 'PathforaTest_',
    PF_PAGEVIEWS = 'PathforaPageView',
    DEFAULT_CHAR_LIMIT = 220,
    DEFAULT_CHAR_LIMIT_STACK = 160,
    WIDTH_BREAKPOINT = 650,
    API_URL = 'https://c.lytics.io',
    CSS_URL = 'https://c.lytics.io/static/pathfora.min.css',
    ENTITY_FIELD_TEMPLATE_REGEX = '\\{{2}.*?\\}{2}',
    ENTITY_FIELDS = ['msg', 'headline', 'image', 'confirmAction.callback'],
    OPTIONS_PRIORITY_ORDERED = 'ordered',
    OPTIONS_PRIORITY_UNORDERED = 'unordered';

  var defaultPositions = {
    modal: '',
    slideout: 'bottom-left',
    button: 'top-left',
    bar: 'top-absolute',
  };

  var callbackTypes = {
    INIT: 'widgetInitialized',
    LOAD: 'widgetLoaded',
    CLICK: 'buttonClicked',
    FORM_SUBMIT: 'formSubmitted',
    MODAL_OPEN: 'modalOpened',
    MODAL_CLOSE: 'modalClosed',
    MODAL_CONFIRM: 'modalConfirm',
    MODAL_CANCEL: 'modalCancel',
  };

  var widgetTracker = resetWidgetTracker({});
  var defaultProps = resetDefaultProps({});
  var pathforaDataObject = resetDataObject({});

  var abTestingTypes = {
    100: createABTestingModePreset(100),
    '50/50': createABTestingModePreset(50, 50),
    '80/20': createABTestingModePreset(80, 20),
  };

  /* eslint-disable quotes */
  var templates = {
  'subscription': {
    'bar': '<div class=\'pf-widget-body\'></div><button type=\'button\' class=\'pf-widget-close\' aria-label=\'Close\'>&times;</button><div class=\'pf-bar-content\'><p class=\'pf-widget-message\'></p><form><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Confirm</button> <span><input name=\'email\' type=\'email\' placeholder=\'Email\' data-required=\'true\' aria-label=\'Email\'></span></form></div>',
    'inline': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><div class=\'pf-widget-text\'><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><form><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Confirm</button> <span><input name=\'email\' type=\'email\' data-required=\'true\' aria-label=\'Email\'></span></form></div></div></div></div></div></div>',
    'modal': '<div class=\'pf-widget-container\' role=\'dialog\' aria-labeledby=\'pf-widget-headline\' aria-describedby=\'pf-widget-message\' aria-modal=\'true\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><button type=\'button\' class=\'pf-widget-close\' aria-label=\'Close\'>&times;</button><div class=\'pf-widget-text\'><h2 class=\'pf-widget-headline\' id=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\' id=\'pf-widget-message\'></p><form><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Confirm</button> <span><input name=\'email\' type=\'email\' data-required=\'true\' aria-label=\'Email\'></span></form><div class=\'pf-widget-footer\'></div></div></div></div></div></div></div>',
    'slideout': '<button type=\'button\' class=\'pf-widget-close\' aria-label=\'Close\'>&times;</button><div class=\'pf-widget-body\'></div><div class=\'pf-widget-content\'><h2 class=\'pf-widget-headline\'></h2><p class=\'pf-widget-message\'></p><form><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Confirm</button> <span><input name=\'email\' type=\'email\' data-required=\'true\' aria-label=\'Email\'></span></form><div class=\'pf-widget-footer\'></div></div>'
  },
  'sitegate': {
    'modal': '<div class=\'pf-widget-container\' role=\'dialog\' aria-labeledby=\'pf-widget-headline\' aria-describedby=\'pf-widget-message\' aria-modal=\'true\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><div class=\'pf-widget-text\'><h2 class=\'pf-widget-headline\' id=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\' id=\'pf-widget-message\'></p><form><input name=\'username\' type=\'text\' aria-label=\'Name\'> <input name=\'email\' type=\'email\' aria-label=\'Email\'> <input class=\'pf-field-half-width\' name=\'title\' type=\'text\' aria-label=\'Title\'> <input class=\'pf-field-half-width\' name=\'company\' type=\'text\' aria-label=\'Company\'> <input class=\'pf-field-half-width\' name=\'phone\' type=\'text\' aria-label=\'Phone\'> <select class=\'pf-field-half-width\' name=\'country\' aria-label=\'Country\'><option value=\'\'>Country</option><option value=\'AF\'>Afghanistan</option><option value=\'AL\'>Albania</option><option value=\'DZ\'>Algeria</option><option value=\'AS\'>American Samoa</option><option value=\'AD\'>Andorra</option><option value=\'AG\'>Angola</option><option value=\'AI\'>Anguilla</option><option value=\'AG\'>Antigua &amp; Barbuda</option><option value=\'AR\'>Argentina</option><option value=\'AA\'>Armenia</option><option value=\'AW\'>Aruba</option><option value=\'AU\'>Australia</option><option value=\'AT\'>Austria</option><option value=\'AZ\'>Azerbaijan</option><option value=\'BS\'>Bahamas</option><option value=\'BH\'>Bahrain</option><option value=\'BD\'>Bangladesh</option><option value=\'BB\'>Barbados</option><option value=\'BY\'>Belarus</option><option value=\'BE\'>Belgium</option><option value=\'BZ\'>Belize</option><option value=\'BJ\'>Benin</option><option value=\'BM\'>Bermuda</option><option value=\'BT\'>Bhutan</option><option value=\'BO\'>Bolivia</option><option value=\'BL\'>Bonaire</option><option value=\'BA\'>Bosnia &amp; Herzegovina</option><option value=\'BW\'>Botswana</option><option value=\'BR\'>Brazil</option><option value=\'BC\'>British Indian Ocean Ter</option><option value=\'BN\'>Brunei</option><option value=\'BG\'>Bulgaria</option><option value=\'BF\'>Burkina Faso</option><option value=\'BI\'>Burundi</option><option value=\'KH\'>Cambodia</option><option value=\'CM\'>Cameroon</option><option value=\'CA\'>Canada</option><option value=\'IC\'>Canary Islands</option><option value=\'CV\'>Cape Verde</option><option value=\'KY\'>Cayman Islands</option><option value=\'CF\'>Central African Republic</option><option value=\'TD\'>Chad</option><option value=\'CD\'>Channel Islands</option><option value=\'CL\'>Chile</option><option value=\'CN\'>China</option><option value=\'CI\'>Christmas Island</option><option value=\'CS\'>Cocos Island</option><option value=\'CO\'>Colombia</option><option value=\'CC\'>Comoros</option><option value=\'CG\'>Congo</option><option value=\'CK\'>Cook Islands</option><option value=\'CR\'>Costa Rica</option><option value=\'CT\'>Cote D&#39;Ivoire</option><option value=\'HR\'>Croatia</option><option value=\'CU\'>Cuba</option><option value=\'CB\'>Curacao</option><option value=\'CY\'>Cyprus</option><option value=\'CZ\'>Czech Republic</option><option value=\'DK\'>Denmark</option><option value=\'DJ\'>Djibouti</option><option value=\'DM\'>Dominica</option><option value=\'DO\'>Dominican Republic</option><option value=\'TM\'>East Timor</option><option value=\'EC\'>Ecuador</option><option value=\'EG\'>Egypt</option><option value=\'SV\'>El Salvador</option><option value=\'GQ\'>Equatorial Guinea</option><option value=\'ER\'>Eritrea</option><option value=\'EE\'>Estonia</option><option value=\'ET\'>Ethiopia</option><option value=\'FA\'>Falkland Islands</option><option value=\'FO\'>Faroe Islands</option><option value=\'FJ\'>Fiji</option><option value=\'FI\'>Finland</option><option value=\'FR\'>France</option><option value=\'GF\'>French Guiana</option><option value=\'PF\'>French Polynesia</option><option value=\'FS\'>French Southern Ter</option><option value=\'GA\'>Gabon</option><option value=\'GM\'>Gambia</option><option value=\'GE\'>Georgia</option><option value=\'DE\'>Germany</option><option value=\'GH\'>Ghana</option><option value=\'GI\'>Gibraltar</option><option value=\'GB\'>Great Britain</option><option value=\'GR\'>Greece</option><option value=\'GL\'>Greenland</option><option value=\'GD\'>Grenada</option><option value=\'GP\'>Guadeloupe</option><option value=\'GU\'>Guam</option><option value=\'GT\'>Guatemala</option><option value=\'GN\'>Guinea</option><option value=\'GY\'>Guyana</option><option value=\'HT\'>Haiti</option><option value=\'HW\'>Hawaii</option><option value=\'HN\'>Honduras</option><option value=\'HK\'>Hong Kong</option><option value=\'HU\'>Hungary</option><option value=\'IS\'>Iceland</option><option value=\'IN\'>India</option><option value=\'ID\'>Indonesia</option><option value=\'IA\'>Iran</option><option value=\'IQ\'>Iraq</option><option value=\'IR\'>Ireland</option><option value=\'IM\'>Isle of Man</option><option value=\'IL\'>Israel</option><option value=\'IT\'>Italy</option><option value=\'JM\'>Jamaica</option><option value=\'JP\'>Japan</option><option value=\'JO\'>Jordan</option><option value=\'KZ\'>Kazakhstan</option><option value=\'KE\'>Kenya</option><option value=\'KI\'>Kiribati</option><option value=\'NK\'>Korea North</option><option value=\'KS\'>Korea South</option><option value=\'KW\'>Kuwait</option><option value=\'KG\'>Kyrgyzstan</option><option value=\'LA\'>Laos</option><option value=\'LV\'>Latvia</option><option value=\'LB\'>Lebanon</option><option value=\'LS\'>Lesotho</option><option value=\'LR\'>Liberia</option><option value=\'LY\'>Libya</option><option value=\'LI\'>Liechtenstein</option><option value=\'LT\'>Lithuania</option><option value=\'LU\'>Luxembourg</option><option value=\'MO\'>Macau</option><option value=\'MK\'>Macedonia</option><option value=\'MG\'>Madagascar</option><option value=\'MY\'>Malaysia</option><option value=\'MW\'>Malawi</option><option value=\'MV\'>Maldives</option><option value=\'ML\'>Mali</option><option value=\'MT\'>Malta</option><option value=\'MH\'>Marshall Islands</option><option value=\'MQ\'>Martinique</option><option value=\'MR\'>Mauritania</option><option value=\'MU\'>Mauritius</option><option value=\'ME\'>Mayotte</option><option value=\'MX\'>Mexico</option><option value=\'MI\'>Midway Islands</option><option value=\'MD\'>Moldova</option><option value=\'MC\'>Monaco</option><option value=\'MN\'>Mongolia</option><option value=\'MS\'>Montserrat</option><option value=\'MA\'>Morocco</option><option value=\'MZ\'>Mozambique</option><option value=\'MM\'>Myanmar</option><option value=\'NA\'>Nambia</option><option value=\'NU\'>Nauru</option><option value=\'NP\'>Nepal</option><option value=\'AN\'>Netherland Antilles</option><option value=\'NL\'>Netherlands (Holland, Europe)</option><option value=\'NV\'>Nevis</option><option value=\'NC\'>New Caledonia</option><option value=\'NZ\'>New Zealand</option><option value=\'NI\'>Nicaragua</option><option value=\'NE\'>Niger</option><option value=\'NG\'>Nigeria</option><option value=\'NW\'>Niue</option><option value=\'NF\'>Norfolk Island</option><option value=\'NO\'>Norway</option><option value=\'OM\'>Oman</option><option value=\'PK\'>Pakistan</option><option value=\'PW\'>Palau Island</option><option value=\'PS\'>Palestine</option><option value=\'PA\'>Panama</option><option value=\'PG\'>Papua New Guinea</option><option value=\'PY\'>Paraguay</option><option value=\'PE\'>Peru</option><option value=\'PH\'>Philippines</option><option value=\'PO\'>Pitcairn Island</option><option value=\'PL\'>Poland</option><option value=\'PT\'>Portugal</option><option value=\'PR\'>Puerto Rico</option><option value=\'QA\'>Qatar</option><option value=\'ME\'>Republic of Montenegro</option><option value=\'RS\'>Republic of Serbia</option><option value=\'RE\'>Reunion</option><option value=\'RO\'>Romania</option><option value=\'RU\'>Russia</option><option value=\'RW\'>Rwanda</option><option value=\'NT\'>St Barthelemy</option><option value=\'EU\'>St Eustatius</option><option value=\'HE\'>St Helena</option><option value=\'KN\'>St Kitts-Nevis</option><option value=\'LC\'>St Lucia</option><option value=\'MB\'>St Maarten</option><option value=\'PM\'>St Pierre &amp; Miquelon</option><option value=\'VC\'>St Vincent &amp; Grenadines</option><option value=\'SP\'>Saipan</option><option value=\'SO\'>Samoa</option><option value=\'AS\'>Samoa American</option><option value=\'SM\'>San Marino</option><option value=\'ST\'>Sao Tome &amp; Principe</option><option value=\'SA\'>Saudi Arabia</option><option value=\'SN\'>Senegal</option><option value=\'RS\'>Serbia</option><option value=\'SC\'>Seychelles</option><option value=\'SL\'>Sierra Leone</option><option value=\'SG\'>Singapore</option><option value=\'SK\'>Slovakia</option><option value=\'SI\'>Slovenia</option><option value=\'SB\'>Solomon Islands</option><option value=\'OI\'>Somalia</option><option value=\'ZA\'>South Africa</option><option value=\'ES\'>Spain</option><option value=\'LK\'>Sri Lanka</option><option value=\'SD\'>Sudan</option><option value=\'SR\'>Suriname</option><option value=\'SZ\'>Swaziland</option><option value=\'SE\'>Sweden</option><option value=\'CH\'>Switzerland</option><option value=\'SY\'>Syria</option><option value=\'TA\'>Tahiti</option><option value=\'TW\'>Taiwan</option><option value=\'TJ\'>Tajikistan</option><option value=\'TZ\'>Tanzania</option><option value=\'TH\'>Thailand</option><option value=\'TG\'>Togo</option><option value=\'TK\'>Tokelau</option><option value=\'TO\'>Tonga</option><option value=\'TT\'>Trinidad &amp; Tobago</option><option value=\'TN\'>Tunisia</option><option value=\'TR\'>Turkey</option><option value=\'TU\'>Turkmenistan</option><option value=\'TC\'>Turks &amp; Caicos Is</option><option value=\'TV\'>Tuvalu</option><option value=\'UG\'>Uganda</option><option value=\'UA\'>Ukraine</option><option value=\'AE\'>United Arab Emirates</option><option value=\'GB\'>United Kingdom</option><option value=\'US\'>United States of America</option><option value=\'UY\'>Uruguay</option><option value=\'UZ\'>Uzbekistan</option><option value=\'VU\'>Vanuatu</option><option value=\'VS\'>Vatican City State</option><option value=\'VE\'>Venezuela</option><option value=\'VN\'>Vietnam</option><option value=\'VB\'>Virgin Islands (Brit)</option><option value=\'VA\'>Virgin Islands (USA)</option><option value=\'WK\'>Wake Island</option><option value=\'WF\'>Wallis &amp; Futana Is</option><option value=\'YE\'>Yemen</option><option value=\'ZR\'>Zaire</option><option value=\'ZM\'>Zambia</option><option value=\'ZW\'>Zimbabwe</option></select> <input class=\'pf-field-half-width\' name=\'referralEmail\' type=\'text\' aria-label=\'Referral Email\'> <textarea name=\'message\' rows=\'5\' aria-label=\'Message\'></textarea> <button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Confirm</button> <button type=\'button\' class=\'pf-widget-btn pf-widget-cancel\'>Cancel</button></form><div class=\'pf-widget-footer\'></div></div></div></div></div></div></div>'
  },
  'message': {
    'bar': '<div class=\'pf-widget-body\'></div><button type=\'button\' class=\'pf-widget-close\' aria-label=\'Close\'>&times;</button><div class=\'pf-bar-content\'><p class=\'pf-widget-message\'></p><span><button type=\'button\' class=\'pf-widget-btn pf-widget-ok\'>Confirm</button> <button type=\'button\' class=\'pf-widget-btn pf-widget-cancel\'>Cancel</button></span></div>',
    'button': '<button type=\'button\' class=\'pf-widget-message pf-widget-ok\'></button>',
    'inline': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><div class=\'pf-widget-text\'><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><a class=\'pf-content-unit\'></a> <button type=\'button\' class=\'pf-widget-btn pf-widget-ok\'>Confirm</button></div></div></div></div></div></div>',
    'modal': '<div class=\'pf-widget-container\' role=\'dialog\' aria-labeledby=\'pf-widget-headline\' aria-describedby=\'pf-widget-message\' aria-modal=\'true\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><button type=\'button\' class=\'pf-widget-close\' aria-label=\'Close\'>&times;</button><div class=\'pf-widget-text\'><h2 class=\'pf-widget-headline\' id=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\' id=\'pf-widget-message\'></p><a class=\'pf-content-unit\'></a> <button type=\'button\' class=\'pf-widget-btn pf-widget-ok\'>Confirm</button> <button type=\'button\' class=\'pf-widget-btn pf-widget-cancel\'>Cancel</button><div class=\'pf-widget-footer\'></div></div></div></div></div></div></div>',
    'slideout': '<button type=\'button\' class=\'pf-widget-close\' aria-label=\'Close\'>&times;</button><div class=\'pf-widget-body\'></div><div class=\'pf-widget-content\'><h2 class=\'pf-widget-headline\'></h2><p class=\'pf-widget-message\'></p><a class=\'pf-content-unit stack\'></a> <button type=\'button\' class=\'pf-widget-btn pf-widget-ok\'>Confirm</button> <button type=\'button\' class=\'pf-widget-btn pf-widget-cancel\'>Cancel</button><div class=\'pf-widget-footer\'></div></div>'
  },
  'includes': {},
  'form': {
    'inline': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><div class=\'pf-widget-text\'><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><form><input name=\'username\' type=\'text\' aria-label=\'Name\'> <input name=\'email\' type=\'email\' aria-label=\'Email\'> <input class=\'pf-field-half-width\' name=\'title\' type=\'text\' aria-label=\'Title\'> <input class=\'pf-field-half-width\' name=\'company\' type=\'text\' aria-label=\'Company\'> <input class=\'pf-field-half-width\' name=\'phone\' type=\'text\' aria-label=\'Phone\'> <select class=\'pf-field-half-width\' name=\'country\' aria-label=\'Country\'><option value=\'\'>Country</option><option value=\'AF\'>Afghanistan</option><option value=\'AL\'>Albania</option><option value=\'DZ\'>Algeria</option><option value=\'AS\'>American Samoa</option><option value=\'AD\'>Andorra</option><option value=\'AG\'>Angola</option><option value=\'AI\'>Anguilla</option><option value=\'AG\'>Antigua &amp; Barbuda</option><option value=\'AR\'>Argentina</option><option value=\'AA\'>Armenia</option><option value=\'AW\'>Aruba</option><option value=\'AU\'>Australia</option><option value=\'AT\'>Austria</option><option value=\'AZ\'>Azerbaijan</option><option value=\'BS\'>Bahamas</option><option value=\'BH\'>Bahrain</option><option value=\'BD\'>Bangladesh</option><option value=\'BB\'>Barbados</option><option value=\'BY\'>Belarus</option><option value=\'BE\'>Belgium</option><option value=\'BZ\'>Belize</option><option value=\'BJ\'>Benin</option><option value=\'BM\'>Bermuda</option><option value=\'BT\'>Bhutan</option><option value=\'BO\'>Bolivia</option><option value=\'BL\'>Bonaire</option><option value=\'BA\'>Bosnia &amp; Herzegovina</option><option value=\'BW\'>Botswana</option><option value=\'BR\'>Brazil</option><option value=\'BC\'>British Indian Ocean Ter</option><option value=\'BN\'>Brunei</option><option value=\'BG\'>Bulgaria</option><option value=\'BF\'>Burkina Faso</option><option value=\'BI\'>Burundi</option><option value=\'KH\'>Cambodia</option><option value=\'CM\'>Cameroon</option><option value=\'CA\'>Canada</option><option value=\'IC\'>Canary Islands</option><option value=\'CV\'>Cape Verde</option><option value=\'KY\'>Cayman Islands</option><option value=\'CF\'>Central African Republic</option><option value=\'TD\'>Chad</option><option value=\'CD\'>Channel Islands</option><option value=\'CL\'>Chile</option><option value=\'CN\'>China</option><option value=\'CI\'>Christmas Island</option><option value=\'CS\'>Cocos Island</option><option value=\'CO\'>Colombia</option><option value=\'CC\'>Comoros</option><option value=\'CG\'>Congo</option><option value=\'CK\'>Cook Islands</option><option value=\'CR\'>Costa Rica</option><option value=\'CT\'>Cote D&#39;Ivoire</option><option value=\'HR\'>Croatia</option><option value=\'CU\'>Cuba</option><option value=\'CB\'>Curacao</option><option value=\'CY\'>Cyprus</option><option value=\'CZ\'>Czech Republic</option><option value=\'DK\'>Denmark</option><option value=\'DJ\'>Djibouti</option><option value=\'DM\'>Dominica</option><option value=\'DO\'>Dominican Republic</option><option value=\'TM\'>East Timor</option><option value=\'EC\'>Ecuador</option><option value=\'EG\'>Egypt</option><option value=\'SV\'>El Salvador</option><option value=\'GQ\'>Equatorial Guinea</option><option value=\'ER\'>Eritrea</option><option value=\'EE\'>Estonia</option><option value=\'ET\'>Ethiopia</option><option value=\'FA\'>Falkland Islands</option><option value=\'FO\'>Faroe Islands</option><option value=\'FJ\'>Fiji</option><option value=\'FI\'>Finland</option><option value=\'FR\'>France</option><option value=\'GF\'>French Guiana</option><option value=\'PF\'>French Polynesia</option><option value=\'FS\'>French Southern Ter</option><option value=\'GA\'>Gabon</option><option value=\'GM\'>Gambia</option><option value=\'GE\'>Georgia</option><option value=\'DE\'>Germany</option><option value=\'GH\'>Ghana</option><option value=\'GI\'>Gibraltar</option><option value=\'GB\'>Great Britain</option><option value=\'GR\'>Greece</option><option value=\'GL\'>Greenland</option><option value=\'GD\'>Grenada</option><option value=\'GP\'>Guadeloupe</option><option value=\'GU\'>Guam</option><option value=\'GT\'>Guatemala</option><option value=\'GN\'>Guinea</option><option value=\'GY\'>Guyana</option><option value=\'HT\'>Haiti</option><option value=\'HW\'>Hawaii</option><option value=\'HN\'>Honduras</option><option value=\'HK\'>Hong Kong</option><option value=\'HU\'>Hungary</option><option value=\'IS\'>Iceland</option><option value=\'IN\'>India</option><option value=\'ID\'>Indonesia</option><option value=\'IA\'>Iran</option><option value=\'IQ\'>Iraq</option><option value=\'IR\'>Ireland</option><option value=\'IM\'>Isle of Man</option><option value=\'IL\'>Israel</option><option value=\'IT\'>Italy</option><option value=\'JM\'>Jamaica</option><option value=\'JP\'>Japan</option><option value=\'JO\'>Jordan</option><option value=\'KZ\'>Kazakhstan</option><option value=\'KE\'>Kenya</option><option value=\'KI\'>Kiribati</option><option value=\'NK\'>Korea North</option><option value=\'KS\'>Korea South</option><option value=\'KW\'>Kuwait</option><option value=\'KG\'>Kyrgyzstan</option><option value=\'LA\'>Laos</option><option value=\'LV\'>Latvia</option><option value=\'LB\'>Lebanon</option><option value=\'LS\'>Lesotho</option><option value=\'LR\'>Liberia</option><option value=\'LY\'>Libya</option><option value=\'LI\'>Liechtenstein</option><option value=\'LT\'>Lithuania</option><option value=\'LU\'>Luxembourg</option><option value=\'MO\'>Macau</option><option value=\'MK\'>Macedonia</option><option value=\'MG\'>Madagascar</option><option value=\'MY\'>Malaysia</option><option value=\'MW\'>Malawi</option><option value=\'MV\'>Maldives</option><option value=\'ML\'>Mali</option><option value=\'MT\'>Malta</option><option value=\'MH\'>Marshall Islands</option><option value=\'MQ\'>Martinique</option><option value=\'MR\'>Mauritania</option><option value=\'MU\'>Mauritius</option><option value=\'ME\'>Mayotte</option><option value=\'MX\'>Mexico</option><option value=\'MI\'>Midway Islands</option><option value=\'MD\'>Moldova</option><option value=\'MC\'>Monaco</option><option value=\'MN\'>Mongolia</option><option value=\'MS\'>Montserrat</option><option value=\'MA\'>Morocco</option><option value=\'MZ\'>Mozambique</option><option value=\'MM\'>Myanmar</option><option value=\'NA\'>Nambia</option><option value=\'NU\'>Nauru</option><option value=\'NP\'>Nepal</option><option value=\'AN\'>Netherland Antilles</option><option value=\'NL\'>Netherlands (Holland, Europe)</option><option value=\'NV\'>Nevis</option><option value=\'NC\'>New Caledonia</option><option value=\'NZ\'>New Zealand</option><option value=\'NI\'>Nicaragua</option><option value=\'NE\'>Niger</option><option value=\'NG\'>Nigeria</option><option value=\'NW\'>Niue</option><option value=\'NF\'>Norfolk Island</option><option value=\'NO\'>Norway</option><option value=\'OM\'>Oman</option><option value=\'PK\'>Pakistan</option><option value=\'PW\'>Palau Island</option><option value=\'PS\'>Palestine</option><option value=\'PA\'>Panama</option><option value=\'PG\'>Papua New Guinea</option><option value=\'PY\'>Paraguay</option><option value=\'PE\'>Peru</option><option value=\'PH\'>Philippines</option><option value=\'PO\'>Pitcairn Island</option><option value=\'PL\'>Poland</option><option value=\'PT\'>Portugal</option><option value=\'PR\'>Puerto Rico</option><option value=\'QA\'>Qatar</option><option value=\'ME\'>Republic of Montenegro</option><option value=\'RS\'>Republic of Serbia</option><option value=\'RE\'>Reunion</option><option value=\'RO\'>Romania</option><option value=\'RU\'>Russia</option><option value=\'RW\'>Rwanda</option><option value=\'NT\'>St Barthelemy</option><option value=\'EU\'>St Eustatius</option><option value=\'HE\'>St Helena</option><option value=\'KN\'>St Kitts-Nevis</option><option value=\'LC\'>St Lucia</option><option value=\'MB\'>St Maarten</option><option value=\'PM\'>St Pierre &amp; Miquelon</option><option value=\'VC\'>St Vincent &amp; Grenadines</option><option value=\'SP\'>Saipan</option><option value=\'SO\'>Samoa</option><option value=\'AS\'>Samoa American</option><option value=\'SM\'>San Marino</option><option value=\'ST\'>Sao Tome &amp; Principe</option><option value=\'SA\'>Saudi Arabia</option><option value=\'SN\'>Senegal</option><option value=\'RS\'>Serbia</option><option value=\'SC\'>Seychelles</option><option value=\'SL\'>Sierra Leone</option><option value=\'SG\'>Singapore</option><option value=\'SK\'>Slovakia</option><option value=\'SI\'>Slovenia</option><option value=\'SB\'>Solomon Islands</option><option value=\'OI\'>Somalia</option><option value=\'ZA\'>South Africa</option><option value=\'ES\'>Spain</option><option value=\'LK\'>Sri Lanka</option><option value=\'SD\'>Sudan</option><option value=\'SR\'>Suriname</option><option value=\'SZ\'>Swaziland</option><option value=\'SE\'>Sweden</option><option value=\'CH\'>Switzerland</option><option value=\'SY\'>Syria</option><option value=\'TA\'>Tahiti</option><option value=\'TW\'>Taiwan</option><option value=\'TJ\'>Tajikistan</option><option value=\'TZ\'>Tanzania</option><option value=\'TH\'>Thailand</option><option value=\'TG\'>Togo</option><option value=\'TK\'>Tokelau</option><option value=\'TO\'>Tonga</option><option value=\'TT\'>Trinidad &amp; Tobago</option><option value=\'TN\'>Tunisia</option><option value=\'TR\'>Turkey</option><option value=\'TU\'>Turkmenistan</option><option value=\'TC\'>Turks &amp; Caicos Is</option><option value=\'TV\'>Tuvalu</option><option value=\'UG\'>Uganda</option><option value=\'UA\'>Ukraine</option><option value=\'AE\'>United Arab Emirates</option><option value=\'GB\'>United Kingdom</option><option value=\'US\'>United States of America</option><option value=\'UY\'>Uruguay</option><option value=\'UZ\'>Uzbekistan</option><option value=\'VU\'>Vanuatu</option><option value=\'VS\'>Vatican City State</option><option value=\'VE\'>Venezuela</option><option value=\'VN\'>Vietnam</option><option value=\'VB\'>Virgin Islands (Brit)</option><option value=\'VA\'>Virgin Islands (USA)</option><option value=\'WK\'>Wake Island</option><option value=\'WF\'>Wallis &amp; Futana Is</option><option value=\'YE\'>Yemen</option><option value=\'ZR\'>Zaire</option><option value=\'ZM\'>Zambia</option><option value=\'ZW\'>Zimbabwe</option></select> <input class=\'pf-field-half-width\' name=\'referralEmail\' type=\'text\' aria-label=\'Referral Email\'> <textarea name=\'message\' rows=\'5\' aria-label=\'Message\'></textarea> <button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Confirm</button></form></div></div></div></div></div></div>',
    'modal': '<div class=\'pf-widget-container\' role=\'dialog\' aria-labeledby=\'pf-widget-headline\' aria-describedby=\'pf-widget-message\' aria-modal=\'true\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><button type=\'button\' class=\'pf-widget-close\' aria-label=\'Close\'>&times;</button><div class=\'pf-widget-text\'><h2 class=\'pf-widget-headline\' id=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\' id=\'pf-widget-message\'></p><form><input name=\'username\' type=\'text\' aria-label=\'Name\'> <input name=\'email\' type=\'email\' aria-label=\'Email\'> <input class=\'pf-field-half-width\' name=\'title\' type=\'text\' aria-label=\'Title\'> <input class=\'pf-field-half-width\' name=\'company\' type=\'text\' aria-label=\'Company\'> <input class=\'pf-field-half-width\' name=\'phone\' type=\'text\' aria-label=\'Phone\'> <select class=\'pf-field-half-width\' name=\'country\' aria-label=\'Country\'><option value=\'\'>Country</option><option value=\'AF\'>Afghanistan</option><option value=\'AL\'>Albania</option><option value=\'DZ\'>Algeria</option><option value=\'AS\'>American Samoa</option><option value=\'AD\'>Andorra</option><option value=\'AG\'>Angola</option><option value=\'AI\'>Anguilla</option><option value=\'AG\'>Antigua &amp; Barbuda</option><option value=\'AR\'>Argentina</option><option value=\'AA\'>Armenia</option><option value=\'AW\'>Aruba</option><option value=\'AU\'>Australia</option><option value=\'AT\'>Austria</option><option value=\'AZ\'>Azerbaijan</option><option value=\'BS\'>Bahamas</option><option value=\'BH\'>Bahrain</option><option value=\'BD\'>Bangladesh</option><option value=\'BB\'>Barbados</option><option value=\'BY\'>Belarus</option><option value=\'BE\'>Belgium</option><option value=\'BZ\'>Belize</option><option value=\'BJ\'>Benin</option><option value=\'BM\'>Bermuda</option><option value=\'BT\'>Bhutan</option><option value=\'BO\'>Bolivia</option><option value=\'BL\'>Bonaire</option><option value=\'BA\'>Bosnia &amp; Herzegovina</option><option value=\'BW\'>Botswana</option><option value=\'BR\'>Brazil</option><option value=\'BC\'>British Indian Ocean Ter</option><option value=\'BN\'>Brunei</option><option value=\'BG\'>Bulgaria</option><option value=\'BF\'>Burkina Faso</option><option value=\'BI\'>Burundi</option><option value=\'KH\'>Cambodia</option><option value=\'CM\'>Cameroon</option><option value=\'CA\'>Canada</option><option value=\'IC\'>Canary Islands</option><option value=\'CV\'>Cape Verde</option><option value=\'KY\'>Cayman Islands</option><option value=\'CF\'>Central African Republic</option><option value=\'TD\'>Chad</option><option value=\'CD\'>Channel Islands</option><option value=\'CL\'>Chile</option><option value=\'CN\'>China</option><option value=\'CI\'>Christmas Island</option><option value=\'CS\'>Cocos Island</option><option value=\'CO\'>Colombia</option><option value=\'CC\'>Comoros</option><option value=\'CG\'>Congo</option><option value=\'CK\'>Cook Islands</option><option value=\'CR\'>Costa Rica</option><option value=\'CT\'>Cote D&#39;Ivoire</option><option value=\'HR\'>Croatia</option><option value=\'CU\'>Cuba</option><option value=\'CB\'>Curacao</option><option value=\'CY\'>Cyprus</option><option value=\'CZ\'>Czech Republic</option><option value=\'DK\'>Denmark</option><option value=\'DJ\'>Djibouti</option><option value=\'DM\'>Dominica</option><option value=\'DO\'>Dominican Republic</option><option value=\'TM\'>East Timor</option><option value=\'EC\'>Ecuador</option><option value=\'EG\'>Egypt</option><option value=\'SV\'>El Salvador</option><option value=\'GQ\'>Equatorial Guinea</option><option value=\'ER\'>Eritrea</option><option value=\'EE\'>Estonia</option><option value=\'ET\'>Ethiopia</option><option value=\'FA\'>Falkland Islands</option><option value=\'FO\'>Faroe Islands</option><option value=\'FJ\'>Fiji</option><option value=\'FI\'>Finland</option><option value=\'FR\'>France</option><option value=\'GF\'>French Guiana</option><option value=\'PF\'>French Polynesia</option><option value=\'FS\'>French Southern Ter</option><option value=\'GA\'>Gabon</option><option value=\'GM\'>Gambia</option><option value=\'GE\'>Georgia</option><option value=\'DE\'>Germany</option><option value=\'GH\'>Ghana</option><option value=\'GI\'>Gibraltar</option><option value=\'GB\'>Great Britain</option><option value=\'GR\'>Greece</option><option value=\'GL\'>Greenland</option><option value=\'GD\'>Grenada</option><option value=\'GP\'>Guadeloupe</option><option value=\'GU\'>Guam</option><option value=\'GT\'>Guatemala</option><option value=\'GN\'>Guinea</option><option value=\'GY\'>Guyana</option><option value=\'HT\'>Haiti</option><option value=\'HW\'>Hawaii</option><option value=\'HN\'>Honduras</option><option value=\'HK\'>Hong Kong</option><option value=\'HU\'>Hungary</option><option value=\'IS\'>Iceland</option><option value=\'IN\'>India</option><option value=\'ID\'>Indonesia</option><option value=\'IA\'>Iran</option><option value=\'IQ\'>Iraq</option><option value=\'IR\'>Ireland</option><option value=\'IM\'>Isle of Man</option><option value=\'IL\'>Israel</option><option value=\'IT\'>Italy</option><option value=\'JM\'>Jamaica</option><option value=\'JP\'>Japan</option><option value=\'JO\'>Jordan</option><option value=\'KZ\'>Kazakhstan</option><option value=\'KE\'>Kenya</option><option value=\'KI\'>Kiribati</option><option value=\'NK\'>Korea North</option><option value=\'KS\'>Korea South</option><option value=\'KW\'>Kuwait</option><option value=\'KG\'>Kyrgyzstan</option><option value=\'LA\'>Laos</option><option value=\'LV\'>Latvia</option><option value=\'LB\'>Lebanon</option><option value=\'LS\'>Lesotho</option><option value=\'LR\'>Liberia</option><option value=\'LY\'>Libya</option><option value=\'LI\'>Liechtenstein</option><option value=\'LT\'>Lithuania</option><option value=\'LU\'>Luxembourg</option><option value=\'MO\'>Macau</option><option value=\'MK\'>Macedonia</option><option value=\'MG\'>Madagascar</option><option value=\'MY\'>Malaysia</option><option value=\'MW\'>Malawi</option><option value=\'MV\'>Maldives</option><option value=\'ML\'>Mali</option><option value=\'MT\'>Malta</option><option value=\'MH\'>Marshall Islands</option><option value=\'MQ\'>Martinique</option><option value=\'MR\'>Mauritania</option><option value=\'MU\'>Mauritius</option><option value=\'ME\'>Mayotte</option><option value=\'MX\'>Mexico</option><option value=\'MI\'>Midway Islands</option><option value=\'MD\'>Moldova</option><option value=\'MC\'>Monaco</option><option value=\'MN\'>Mongolia</option><option value=\'MS\'>Montserrat</option><option value=\'MA\'>Morocco</option><option value=\'MZ\'>Mozambique</option><option value=\'MM\'>Myanmar</option><option value=\'NA\'>Nambia</option><option value=\'NU\'>Nauru</option><option value=\'NP\'>Nepal</option><option value=\'AN\'>Netherland Antilles</option><option value=\'NL\'>Netherlands (Holland, Europe)</option><option value=\'NV\'>Nevis</option><option value=\'NC\'>New Caledonia</option><option value=\'NZ\'>New Zealand</option><option value=\'NI\'>Nicaragua</option><option value=\'NE\'>Niger</option><option value=\'NG\'>Nigeria</option><option value=\'NW\'>Niue</option><option value=\'NF\'>Norfolk Island</option><option value=\'NO\'>Norway</option><option value=\'OM\'>Oman</option><option value=\'PK\'>Pakistan</option><option value=\'PW\'>Palau Island</option><option value=\'PS\'>Palestine</option><option value=\'PA\'>Panama</option><option value=\'PG\'>Papua New Guinea</option><option value=\'PY\'>Paraguay</option><option value=\'PE\'>Peru</option><option value=\'PH\'>Philippines</option><option value=\'PO\'>Pitcairn Island</option><option value=\'PL\'>Poland</option><option value=\'PT\'>Portugal</option><option value=\'PR\'>Puerto Rico</option><option value=\'QA\'>Qatar</option><option value=\'ME\'>Republic of Montenegro</option><option value=\'RS\'>Republic of Serbia</option><option value=\'RE\'>Reunion</option><option value=\'RO\'>Romania</option><option value=\'RU\'>Russia</option><option value=\'RW\'>Rwanda</option><option value=\'NT\'>St Barthelemy</option><option value=\'EU\'>St Eustatius</option><option value=\'HE\'>St Helena</option><option value=\'KN\'>St Kitts-Nevis</option><option value=\'LC\'>St Lucia</option><option value=\'MB\'>St Maarten</option><option value=\'PM\'>St Pierre &amp; Miquelon</option><option value=\'VC\'>St Vincent &amp; Grenadines</option><option value=\'SP\'>Saipan</option><option value=\'SO\'>Samoa</option><option value=\'AS\'>Samoa American</option><option value=\'SM\'>San Marino</option><option value=\'ST\'>Sao Tome &amp; Principe</option><option value=\'SA\'>Saudi Arabia</option><option value=\'SN\'>Senegal</option><option value=\'RS\'>Serbia</option><option value=\'SC\'>Seychelles</option><option value=\'SL\'>Sierra Leone</option><option value=\'SG\'>Singapore</option><option value=\'SK\'>Slovakia</option><option value=\'SI\'>Slovenia</option><option value=\'SB\'>Solomon Islands</option><option value=\'OI\'>Somalia</option><option value=\'ZA\'>South Africa</option><option value=\'ES\'>Spain</option><option value=\'LK\'>Sri Lanka</option><option value=\'SD\'>Sudan</option><option value=\'SR\'>Suriname</option><option value=\'SZ\'>Swaziland</option><option value=\'SE\'>Sweden</option><option value=\'CH\'>Switzerland</option><option value=\'SY\'>Syria</option><option value=\'TA\'>Tahiti</option><option value=\'TW\'>Taiwan</option><option value=\'TJ\'>Tajikistan</option><option value=\'TZ\'>Tanzania</option><option value=\'TH\'>Thailand</option><option value=\'TG\'>Togo</option><option value=\'TK\'>Tokelau</option><option value=\'TO\'>Tonga</option><option value=\'TT\'>Trinidad &amp; Tobago</option><option value=\'TN\'>Tunisia</option><option value=\'TR\'>Turkey</option><option value=\'TU\'>Turkmenistan</option><option value=\'TC\'>Turks &amp; Caicos Is</option><option value=\'TV\'>Tuvalu</option><option value=\'UG\'>Uganda</option><option value=\'UA\'>Ukraine</option><option value=\'AE\'>United Arab Emirates</option><option value=\'GB\'>United Kingdom</option><option value=\'US\'>United States of America</option><option value=\'UY\'>Uruguay</option><option value=\'UZ\'>Uzbekistan</option><option value=\'VU\'>Vanuatu</option><option value=\'VS\'>Vatican City State</option><option value=\'VE\'>Venezuela</option><option value=\'VN\'>Vietnam</option><option value=\'VB\'>Virgin Islands (Brit)</option><option value=\'VA\'>Virgin Islands (USA)</option><option value=\'WK\'>Wake Island</option><option value=\'WF\'>Wallis &amp; Futana Is</option><option value=\'YE\'>Yemen</option><option value=\'ZR\'>Zaire</option><option value=\'ZM\'>Zambia</option><option value=\'ZW\'>Zimbabwe</option></select> <input class=\'pf-field-half-width\' name=\'referralEmail\' type=\'text\' aria-label=\'Referral Email\'> <textarea name=\'message\' rows=\'5\' aria-label=\'Message\'></textarea> <button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Confirm</button> <button type=\'button\' class=\'pf-widget-btn pf-widget-cancel\'>Cancel</button></form><div class=\'pf-widget-footer\'></div></div></div></div></div></div></div>',
    'slideout': '<button type=\'button\' class=\'pf-widget-close\' aria-label=\'Close\'>&times;</button><div class=\'pf-widget-body\'></div><div class=\'pf-widget-content\'><h2 class=\'pf-widget-headline\'></h2><p class=\'pf-widget-message\'></p><form><input name=\'username\' type=\'text\' aria-label=\'Name\'> <input name=\'email\' type=\'email\' aria-label=\'Email\'> <input class=\'pf-field-half-width\' name=\'title\' type=\'text\' aria-label=\'Title\'> <input class=\'pf-field-half-width\' name=\'company\' type=\'text\' aria-label=\'Company\'> <input class=\'pf-field-half-width\' name=\'phone\' type=\'text\' aria-label=\'Phone\'> <select class=\'pf-field-half-width\' name=\'country\' aria-label=\'Country\'><option value=\'\'>Country</option><option value=\'AF\'>Afghanistan</option><option value=\'AL\'>Albania</option><option value=\'DZ\'>Algeria</option><option value=\'AS\'>American Samoa</option><option value=\'AD\'>Andorra</option><option value=\'AG\'>Angola</option><option value=\'AI\'>Anguilla</option><option value=\'AG\'>Antigua &amp; Barbuda</option><option value=\'AR\'>Argentina</option><option value=\'AA\'>Armenia</option><option value=\'AW\'>Aruba</option><option value=\'AU\'>Australia</option><option value=\'AT\'>Austria</option><option value=\'AZ\'>Azerbaijan</option><option value=\'BS\'>Bahamas</option><option value=\'BH\'>Bahrain</option><option value=\'BD\'>Bangladesh</option><option value=\'BB\'>Barbados</option><option value=\'BY\'>Belarus</option><option value=\'BE\'>Belgium</option><option value=\'BZ\'>Belize</option><option value=\'BJ\'>Benin</option><option value=\'BM\'>Bermuda</option><option value=\'BT\'>Bhutan</option><option value=\'BO\'>Bolivia</option><option value=\'BL\'>Bonaire</option><option value=\'BA\'>Bosnia &amp; Herzegovina</option><option value=\'BW\'>Botswana</option><option value=\'BR\'>Brazil</option><option value=\'BC\'>British Indian Ocean Ter</option><option value=\'BN\'>Brunei</option><option value=\'BG\'>Bulgaria</option><option value=\'BF\'>Burkina Faso</option><option value=\'BI\'>Burundi</option><option value=\'KH\'>Cambodia</option><option value=\'CM\'>Cameroon</option><option value=\'CA\'>Canada</option><option value=\'IC\'>Canary Islands</option><option value=\'CV\'>Cape Verde</option><option value=\'KY\'>Cayman Islands</option><option value=\'CF\'>Central African Republic</option><option value=\'TD\'>Chad</option><option value=\'CD\'>Channel Islands</option><option value=\'CL\'>Chile</option><option value=\'CN\'>China</option><option value=\'CI\'>Christmas Island</option><option value=\'CS\'>Cocos Island</option><option value=\'CO\'>Colombia</option><option value=\'CC\'>Comoros</option><option value=\'CG\'>Congo</option><option value=\'CK\'>Cook Islands</option><option value=\'CR\'>Costa Rica</option><option value=\'CT\'>Cote D&#39;Ivoire</option><option value=\'HR\'>Croatia</option><option value=\'CU\'>Cuba</option><option value=\'CB\'>Curacao</option><option value=\'CY\'>Cyprus</option><option value=\'CZ\'>Czech Republic</option><option value=\'DK\'>Denmark</option><option value=\'DJ\'>Djibouti</option><option value=\'DM\'>Dominica</option><option value=\'DO\'>Dominican Republic</option><option value=\'TM\'>East Timor</option><option value=\'EC\'>Ecuador</option><option value=\'EG\'>Egypt</option><option value=\'SV\'>El Salvador</option><option value=\'GQ\'>Equatorial Guinea</option><option value=\'ER\'>Eritrea</option><option value=\'EE\'>Estonia</option><option value=\'ET\'>Ethiopia</option><option value=\'FA\'>Falkland Islands</option><option value=\'FO\'>Faroe Islands</option><option value=\'FJ\'>Fiji</option><option value=\'FI\'>Finland</option><option value=\'FR\'>France</option><option value=\'GF\'>French Guiana</option><option value=\'PF\'>French Polynesia</option><option value=\'FS\'>French Southern Ter</option><option value=\'GA\'>Gabon</option><option value=\'GM\'>Gambia</option><option value=\'GE\'>Georgia</option><option value=\'DE\'>Germany</option><option value=\'GH\'>Ghana</option><option value=\'GI\'>Gibraltar</option><option value=\'GB\'>Great Britain</option><option value=\'GR\'>Greece</option><option value=\'GL\'>Greenland</option><option value=\'GD\'>Grenada</option><option value=\'GP\'>Guadeloupe</option><option value=\'GU\'>Guam</option><option value=\'GT\'>Guatemala</option><option value=\'GN\'>Guinea</option><option value=\'GY\'>Guyana</option><option value=\'HT\'>Haiti</option><option value=\'HW\'>Hawaii</option><option value=\'HN\'>Honduras</option><option value=\'HK\'>Hong Kong</option><option value=\'HU\'>Hungary</option><option value=\'IS\'>Iceland</option><option value=\'IN\'>India</option><option value=\'ID\'>Indonesia</option><option value=\'IA\'>Iran</option><option value=\'IQ\'>Iraq</option><option value=\'IR\'>Ireland</option><option value=\'IM\'>Isle of Man</option><option value=\'IL\'>Israel</option><option value=\'IT\'>Italy</option><option value=\'JM\'>Jamaica</option><option value=\'JP\'>Japan</option><option value=\'JO\'>Jordan</option><option value=\'KZ\'>Kazakhstan</option><option value=\'KE\'>Kenya</option><option value=\'KI\'>Kiribati</option><option value=\'NK\'>Korea North</option><option value=\'KS\'>Korea South</option><option value=\'KW\'>Kuwait</option><option value=\'KG\'>Kyrgyzstan</option><option value=\'LA\'>Laos</option><option value=\'LV\'>Latvia</option><option value=\'LB\'>Lebanon</option><option value=\'LS\'>Lesotho</option><option value=\'LR\'>Liberia</option><option value=\'LY\'>Libya</option><option value=\'LI\'>Liechtenstein</option><option value=\'LT\'>Lithuania</option><option value=\'LU\'>Luxembourg</option><option value=\'MO\'>Macau</option><option value=\'MK\'>Macedonia</option><option value=\'MG\'>Madagascar</option><option value=\'MY\'>Malaysia</option><option value=\'MW\'>Malawi</option><option value=\'MV\'>Maldives</option><option value=\'ML\'>Mali</option><option value=\'MT\'>Malta</option><option value=\'MH\'>Marshall Islands</option><option value=\'MQ\'>Martinique</option><option value=\'MR\'>Mauritania</option><option value=\'MU\'>Mauritius</option><option value=\'ME\'>Mayotte</option><option value=\'MX\'>Mexico</option><option value=\'MI\'>Midway Islands</option><option value=\'MD\'>Moldova</option><option value=\'MC\'>Monaco</option><option value=\'MN\'>Mongolia</option><option value=\'MS\'>Montserrat</option><option value=\'MA\'>Morocco</option><option value=\'MZ\'>Mozambique</option><option value=\'MM\'>Myanmar</option><option value=\'NA\'>Nambia</option><option value=\'NU\'>Nauru</option><option value=\'NP\'>Nepal</option><option value=\'AN\'>Netherland Antilles</option><option value=\'NL\'>Netherlands (Holland, Europe)</option><option value=\'NV\'>Nevis</option><option value=\'NC\'>New Caledonia</option><option value=\'NZ\'>New Zealand</option><option value=\'NI\'>Nicaragua</option><option value=\'NE\'>Niger</option><option value=\'NG\'>Nigeria</option><option value=\'NW\'>Niue</option><option value=\'NF\'>Norfolk Island</option><option value=\'NO\'>Norway</option><option value=\'OM\'>Oman</option><option value=\'PK\'>Pakistan</option><option value=\'PW\'>Palau Island</option><option value=\'PS\'>Palestine</option><option value=\'PA\'>Panama</option><option value=\'PG\'>Papua New Guinea</option><option value=\'PY\'>Paraguay</option><option value=\'PE\'>Peru</option><option value=\'PH\'>Philippines</option><option value=\'PO\'>Pitcairn Island</option><option value=\'PL\'>Poland</option><option value=\'PT\'>Portugal</option><option value=\'PR\'>Puerto Rico</option><option value=\'QA\'>Qatar</option><option value=\'ME\'>Republic of Montenegro</option><option value=\'RS\'>Republic of Serbia</option><option value=\'RE\'>Reunion</option><option value=\'RO\'>Romania</option><option value=\'RU\'>Russia</option><option value=\'RW\'>Rwanda</option><option value=\'NT\'>St Barthelemy</option><option value=\'EU\'>St Eustatius</option><option value=\'HE\'>St Helena</option><option value=\'KN\'>St Kitts-Nevis</option><option value=\'LC\'>St Lucia</option><option value=\'MB\'>St Maarten</option><option value=\'PM\'>St Pierre &amp; Miquelon</option><option value=\'VC\'>St Vincent &amp; Grenadines</option><option value=\'SP\'>Saipan</option><option value=\'SO\'>Samoa</option><option value=\'AS\'>Samoa American</option><option value=\'SM\'>San Marino</option><option value=\'ST\'>Sao Tome &amp; Principe</option><option value=\'SA\'>Saudi Arabia</option><option value=\'SN\'>Senegal</option><option value=\'RS\'>Serbia</option><option value=\'SC\'>Seychelles</option><option value=\'SL\'>Sierra Leone</option><option value=\'SG\'>Singapore</option><option value=\'SK\'>Slovakia</option><option value=\'SI\'>Slovenia</option><option value=\'SB\'>Solomon Islands</option><option value=\'OI\'>Somalia</option><option value=\'ZA\'>South Africa</option><option value=\'ES\'>Spain</option><option value=\'LK\'>Sri Lanka</option><option value=\'SD\'>Sudan</option><option value=\'SR\'>Suriname</option><option value=\'SZ\'>Swaziland</option><option value=\'SE\'>Sweden</option><option value=\'CH\'>Switzerland</option><option value=\'SY\'>Syria</option><option value=\'TA\'>Tahiti</option><option value=\'TW\'>Taiwan</option><option value=\'TJ\'>Tajikistan</option><option value=\'TZ\'>Tanzania</option><option value=\'TH\'>Thailand</option><option value=\'TG\'>Togo</option><option value=\'TK\'>Tokelau</option><option value=\'TO\'>Tonga</option><option value=\'TT\'>Trinidad &amp; Tobago</option><option value=\'TN\'>Tunisia</option><option value=\'TR\'>Turkey</option><option value=\'TU\'>Turkmenistan</option><option value=\'TC\'>Turks &amp; Caicos Is</option><option value=\'TV\'>Tuvalu</option><option value=\'UG\'>Uganda</option><option value=\'UA\'>Ukraine</option><option value=\'AE\'>United Arab Emirates</option><option value=\'GB\'>United Kingdom</option><option value=\'US\'>United States of America</option><option value=\'UY\'>Uruguay</option><option value=\'UZ\'>Uzbekistan</option><option value=\'VU\'>Vanuatu</option><option value=\'VS\'>Vatican City State</option><option value=\'VE\'>Venezuela</option><option value=\'VN\'>Vietnam</option><option value=\'VB\'>Virgin Islands (Brit)</option><option value=\'VA\'>Virgin Islands (USA)</option><option value=\'WK\'>Wake Island</option><option value=\'WF\'>Wallis &amp; Futana Is</option><option value=\'YE\'>Yemen</option><option value=\'ZR\'>Zaire</option><option value=\'ZM\'>Zambia</option><option value=\'ZW\'>Zimbabwe</option></select> <input class=\'pf-field-half-width\' name=\'referralEmail\' type=\'text\' aria-label=\'Referral Email\'> <textarea name=\'message\' rows=\'5\' aria-label=\'Message\'></textarea> <button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Confirm</button> <button type=\'button\' class=\'pf-widget-btn pf-widget-cancel\'>Cancel</button></form><div class=\'pf-widget-footer\'></div></div>'
  },
  'assets': {
    'lytics': '<a href=\'https://www.getlytics.com?utm_source=pathfora&amp;utm_medium=web&amp;utm_campaign=personalization\' target=\'_blank\'><svg width=\'120\' height=\'30\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 143.97 36.85\'><title>lytics</title><path d=\'M122.26 11.36h.1c1.41-.39 2.33-1 2.2-2.94 0-.7-.28-1.06-.69-1.06-.7 0-1.3 1.38-1.37 1.53l-.09.21a3.22 3.22 0 0 0-.5 2 .38.38 0 0 0 .36.25\' transform=\'translate(-.85)\'/><path d=\'M88 5.27a.76.76 0 0 0-1.09.73v.18a1.57 1.57 0 0 0 .45.93 8.78 8.78 0 0 0 6 2.6h.21a.12.12 0 0 1 .13.14 32 32 0 0 1-2 8 1.76 1.76 0 0 1-1 1.17.6.6 0 0 1-.26-.07c-.32-.16-.74-.41-1.18-.67a13.8 13.8 0 0 0-1.72-.93 15.11 15.11 0 0 0-3.88-1.22c-1.81-.2-4.09.56-4.47 2.52a4.7 4.7 0 0 0 2 4.47 10 10 0 0 0 5.19 1.75 6.34 6.34 0 0 0 3.74-1.24l.47-.39c.27-.23.82-.69 1.13-.9a.12.12 0 0 1 .15 0l.5.41a7.84 7.84 0 0 0 .62.5 7.72 7.72 0 0 0 3.54 1.33h.58a5.21 5.21 0 0 0 2.62-.66.12.12 0 0 1 .15 0 2.19 2.19 0 0 0 1.6.68c1.75 0 3.76-1.83 5.06-3.29v.1a8.92 8.92 0 0 1-.83 2.69 7.53 7.53 0 0 1-1.06 1.33l-.47.52a35.84 35.84 0 0 0-3 4.07c-.9 1.43-1.67 2.95-1.31 4.35a3.2 3.2 0 0 0 1.65 2 3.39 3.39 0 0 0 1.67.49c2.09 0 3.25-2.42 3.75-3.86a16.38 16.38 0 0 0 .82-4c.07-.6.14-1.22.25-1.94l.08-.59a3.35 3.35 0 0 1 .8-2.22c.64-.57 1.28-1.17 1.89-1.74l.09-.09.72-.67.28-.25a.12.12 0 0 1 .2.06 4.52 4.52 0 0 0 .71 1.61 3.32 3.32 0 0 0 2.73 1.36 4 4 0 0 0 2.76-1.15 5.29 5.29 0 0 0 .53-.72.12.12 0 0 1 .2 0 2.1 2.1 0 0 0 .47.49 3.52 3.52 0 0 0 2.05.91c.87 0 1.54-.6 2.48-1.5a2.14 2.14 0 0 0 .29-.4.12.12 0 0 1 .21 0l.23.39a4.53 4.53 0 0 0 3.12 2 9.87 9.87 0 0 0 1.46.12 5.58 5.58 0 0 0 4.47-2.09.12.12 0 0 1 .19 0 5.41 5.41 0 0 0 .84.93 5.35 5.35 0 0 0 3.32 1.21 3 3 0 0 0 3.05-2.22 1.33 1.33 0 0 1 1.23-1.29c.67-.25 2.25-.95 2.45-2.16a.77.77 0 0 0-.14-.66.69.69 0 0 0-.55-.23 5.83 5.83 0 0 0-2.08.81 10.5 10.5 0 0 1-1 .46.12.12 0 0 1-.14 0 2.78 2.78 0 0 1-.24-.67 3.12 3.12 0 0 0-.12-.4 32.49 32.49 0 0 0-1.77-3.46 4.53 4.53 0 0 1-.25-.57 3 3 0 0 0-.61-1.1 2.89 2.89 0 0 0-1.53-.45.74.74 0 0 0-.8.42 1.23 1.23 0 0 0 .07.9l.08.26a2.77 2.77 0 0 1-.06.76 3.65 3.65 0 0 1-.69 1.44l-.14.18c-.3.37-.52.65-.67.87a.68.68 0 0 0-.28-.06.67.67 0 0 0-.52.25 3.21 3.21 0 0 0-.47 1.67v.06a13.23 13.23 0 0 0-.76 1.12c-.16.26-.31.5-.42.63a3.3 3.3 0 0 1-2.47 1 3.65 3.65 0 0 1-2.42-.95 1.76 1.76 0 0 1-.56-1.35 6.7 6.7 0 0 1 1.92-4.19 2.4 2.4 0 0 1 1.44-.77.66.66 0 0 1 .32-.02c.4.21.38.32.07.91a1.77 1.77 0 0 0-.3 1.26.48.48 0 0 0 .24.3l.72.4a.51.51 0 0 0 .63-.1 3.19 3.19 0 0 0 .83-3.35c-.48-1.07-1.71-1.59-3.25-1.34a6.61 6.61 0 0 0-4.9 5l-.09.44-.38.66c-.52.92-1.16 2.06-2 2.37a2.1 2.1 0 0 1-.68.17h-.06a3.3 3.3 0 0 1 .12-1.07l.08-.39a15.21 15.21 0 0 1 .78-2.53 12.54 12.54 0 0 0 .91-3.4 1.45 1.45 0 0 0-.4-1.11 1.2 1.2 0 0 0-.86-.41.94.94 0 0 0-.82.51 22.22 22.22 0 0 0-2.13 6.27v.06l-.28.37a7 7 0 0 1-2.37 2.32 1 1 0 0 1-1.22-.23 2 2 0 0 1-.21-1.7c.35-1.23.66-2.49 1-3.75a34.52 34.52 0 0 0 1.23-3.54l.1-.08c.85-.15 1.72-.3 2.56-.41.28 0 .56-.05.85-.07h.63a.5.5 0 0 0 .42-.31 1 1 0 0 0-.07-.88 1.79 1.79 0 0 0-1.4-.74h-.08c-.61 0-1.31 0-2 .08l-.13-.17a8.47 8.47 0 0 0 .46-2.67 2.68 2.68 0 0 0-.32-1.49 1.38 1.38 0 0 0-1.5-.67 2.07 2.07 0 0 0-1.13 1.48 14.92 14.92 0 0 0-.41 1.59c-.27.62-.56 1.33-.85 2.1l-.28.22h-.84a17.31 17.31 0 0 0-2.62.32 1.21 1.21 0 0 0-.91.76.81.81 0 0 0 .08.66 2.49 2.49 0 0 0 1.37 1 2 2 0 0 0 .49.06 8.68 8.68 0 0 0 1.61-.23h.14c-.12.41-.24.83-.35 1.26-.21.82-.37 1.58-.48 2.3-.29.51-.6 1-.94 1.49a12.48 12.48 0 0 1-1.83 1.9l-.23.38a39.76 39.76 0 0 1 .76-5.35.49.49 0 0 0-.16-.46l-.69-.59a.51.51 0 0 0-.33-.12h-.25a.38.38 0 0 0-.33.19c-.51.9-.9 1.7-1.27 2.47a23.51 23.51 0 0 1-2.07 3.66 2.8 2.8 0 0 1-2.05 1 1.06 1.06 0 0 1-.72-.23v-.08a1.38 1.38 0 0 0-.12-.41l-.15-.25v-.14a21.73 21.73 0 0 1 1.38-6.69 1.88 1.88 0 0 0 .15-1.67 1 1 0 0 0-.9-.39h-.25c-1.18.12-2.27 2.69-2.28 2.72a15.2 15.2 0 0 0-1 6.62.12.12 0 0 1-.06.12 3.83 3.83 0 0 1-2 .58c-.76-.06-1.72-.25-3.45-1.72a.12.12 0 0 1 0-.15 27 27 0 0 0 2.88-9.57 1.32 1.32 0 0 1 .28-.87 3.25 3.25 0 0 1 .87-.11h.14a17 17 0 0 0 2.8-.36 11.86 11.86 0 0 0 3.94-1.74 5.54 5.54 0 0 0 2.72-3.76 3.2 3.2 0 0 0-.85-2.5 3.83 3.83 0 0 0-3.09-1.2 8.54 8.54 0 0 0-5.3 2.31 21.6 21.6 0 0 0-2.48 3.16 6.87 6.87 0 0 0-.37.7 2 2 0 0 1-.92 1.19 6.38 6.38 0 0 1-4.63-1.36 5 5 0 0 0-.77-.52l-.43-.21zm14.3-2.93l.34-.11a2.16 2.16 0 0 1 2 .23.69.69 0 0 1 .1.6 4 4 0 0 1-1.64 2.3 11.44 11.44 0 0 1-5.63 1.88.12.12 0 0 1-.12-.18 9.82 9.82 0 0 1 5-4.73zm-17.3 19.95a4.36 4.36 0 0 1-3.39-2.16 1.22 1.22 0 0 1 .1-1.34 1.67 1.67 0 0 1 1.29-.44c2 0 5.08 1.71 6.41 2.47a.12.12 0 0 1 0 .18c-.74 1-2.16 1.42-4.44 1.29zm20.4 6.43c-.17 1-.35 1.94-.52 2.67-.33 1.4-.82 2.36-2.2 2.8h-.35a.39.39 0 0 1-.41-.14c-.09-.17-.25-1 1.71-3.86l.07-.1c.51-.76 1.1-1.54 1.65-2.23a.12.12 0 0 1 .22.1zm31.7-11.51h.2a9.64 9.64 0 0 1 1.55 2.64.12.12 0 0 1-.11.17 4.59 4.59 0 0 1-2.08-.47.72.72 0 0 1-.42-.43 3.23 3.23 0 0 1 .86-1.9zm1.85 5a.73.73 0 0 1-.88.61 3.3 3.3 0 0 1-1.65-.5 2.36 2.36 0 0 1-.65-1.05.12.12 0 0 1 .23-.17 6.66 6.66 0 0 0 2.42.9h.58v.18zM.85 21.74v-8h3.52a2.51 2.51 0 1 1 0 5h-2.12v3h-1.4zm4.69-5.49a1.26 1.26 0 0 0-1.37-1.25h-1.92v2.54h1.92a1.26 1.26 0 0 0 1.37-1.3zM7.79 17.74a4 4 0 0 1 4.09-4.14 4 4 0 0 1 4.12 4.14 4 4 0 0 1-4.09 4.14 4 4 0 0 1-4.12-4.14zm6.74 0a2.66 2.66 0 1 0-5.3 0 2.66 2.66 0 1 0 5.3 0z\' transform=\'translate(-.85)\'/><path d=\'M22.35 21.74l-1.56-5.9-1.55 5.9h-1.49l-2.29-8h1.57l1.56 6.16 1.66-6.16h1.12l1.66 6.16 1.55-6.16h1.57l-2.28 8h-1.52zM27.07 21.74v-8h5.48v1.26h-4.07v2h4v1.24h-4v2.26h4.07v1.24h-5.48z\'/><path d=\'M39.42 21.74l-1.77-3h-1.4v3h-1.4v-8h3.51a2.43 2.43 0 0 1 2.64 2.5 2.24 2.24 0 0 1-1.9 2.35l2 3.14h-1.68zm.12-5.49a1.26 1.26 0 0 0-1.37-1.25h-1.92v2.54h1.92a1.26 1.26 0 0 0 1.37-1.3z\' transform=\'translate(-.85)\'/><path d=\'M41.53 21.74v-8h5.48v1.26h-4.07v2h4v1.24h-4v2.26h4.08v1.24h-5.49z\'/><path d=\'M49.31 21.74v-8h3a3.91 3.91 0 0 1 4.19 4 3.9 3.9 0 0 1-4.19 4h-3zm5.72-4a2.59 2.59 0 0 0-2.75-2.74h-1.57v5.5h1.57a2.63 2.63 0 0 0 2.72-2.76zM60.91 21.74v-8h3.93a2 2 0 0 1 2.28 2 1.8 1.8 0 0 1-1.39 1.83 2 2 0 0 1 1.55 2 2.1 2.1 0 0 1-2.28 2.17h-4zm4.77-5.74a1 1 0 0 0-1.13-1h-2.24v2h2.24a1 1 0 0 0 1.13-1zm.16 3.37a1.1 1.1 0 0 0-1.22-1.1h-2.3v2.23h2.3a1.08 1.08 0 0 0 1.22-1.12z\' transform=\'translate(-.85)\'/><path d=\'M69.74 21.74v-3.33l-3.11-4.68h1.61l2.21 3.43 2.18-3.43h1.61l-3.09 4.68v3.32h-1.4z\'/></svg></a>'
  }
};
  /* eslint-enable quotes */

  /** @module pathfora/dom/window */

  /** @module pathfora/dom/document */

  var document$1 = window.document;

  /** @module pathfora/dom/on-dom-ready */

  function onDOMready (fn) {
    var handler,
        pf = this,
        hack = document$1.documentElement.doScroll,
        domContentLoaded = 'DOMContentLoaded',
        loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(document$1.readyState);

    if (!loaded) {
      document$1.addEventListener(domContentLoaded, handler = function () {
        document$1.removeEventListener(domContentLoaded, handler);
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
   * @params {regex} s
   * @returns {string} regex
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

  /** @module pathfora/utils/decode-safe */

  /**
   * Try decoding a string, return original string
   * if the decode fails.
   *
   * @exports decodeSafe
   * @params {string} s
   * @returns {string} decoded
   */
  function decodeSafe (s) {
    try {
      return decodeURIComponent(s);
    } catch (e) {
      return s;
    }
  }

  /** @module pathfora/utils/cookie/read-cookie */

  /**
   * Get the value of a cookie
   *
   * @exports readCookie
   * @params {string} name
   * @returns {string}
   */
  function readCookie (name) {
    var cookies = document$1.cookie,
        findCookieRegexp = cookies.match('(^|;)\\s*' + encodeURIComponent(escapeRegex(name)) + '\\s*=\\s*([^;]+)');

    // legacy - check for cookie names that haven't been escaped
    if (findCookieRegexp == null) {
      findCookieRegexp = cookies.match('(^|;)\\s*' + escapeRegex(name) + '\\s*=\\s*([^;]+)');
    }

    if (findCookieRegexp != null) {
      var val = findCookieRegexp.pop();

      return decodeSafe(val);
    }

    return null;
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

    document$1.cookie = [
      encodeURIComponent(name),
      '=',
      encodeURIComponent(value),
      expires,
      '; path = /'
    ].join('');
  }

  /** @module pathfora/utils/cookie/delete-cookie */

  /**
   * Delete a cookie
   *
   * @exports deleteCookie
   * @params {string} name
   */
  function deleteCookie (name) {
    var date = new Date('Thu, 01 Jan 1970 00:00:01 GMT');
    saveCookie(name, '', date);
  }

  var PAYLOAD_KEY = '$';
  var EXPIRES_KEY = '@';
  var PATHFORA_IDENTIFIER = 'PATHFORA';

  function safeJsonParse (json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      // recover
    }
  }

  function isExpired (record) {
    return Boolean(record[EXPIRES_KEY]) && Date.parse(record[EXPIRES_KEY]) < Date.now();
  }
  function isCreatedByThisLib (record) {
    return Boolean(record[PATHFORA_IDENTIFIER]);
  }

  var expiringLocalStorage = {
    getItem: function (key) {
      var serialized = localStorage.getItem(key);
      var record = safeJsonParse(serialized);

      if (record && EXPIRES_KEY in record) {
        if (isExpired(record)) {
          localStorage.removeItem(key);
          return null;
        }
        if (PAYLOAD_KEY in record) {
          // Extend the expiration date:
          this.setItem(key, record[PAYLOAD_KEY]);
          return record[PAYLOAD_KEY];
        }
      }
      return serialized;
    },

    setItem: function (key, payload, expiresOn) {
      if (!expiresOn) {
        expiresOn = new Date();
        expiresOn.setDate(expiresOn.getDate() + 365);
      }

      var record = {};

      record[PAYLOAD_KEY] = '' + payload;
      record[EXPIRES_KEY] = expiresOn;
      record[PATHFORA_IDENTIFIER] = PF_VERSION; // identify localStorage items created by this lib

      localStorage.setItem(key, JSON.stringify(record));
    },

    removeItem: function (key) {
      localStorage.removeItem(key);
    },

    ttl: function (key, payload, milliseconds) {
      if (milliseconds !== +milliseconds) {
        throw new Error('milliseconds must be a number!');
      }
      var date = new Date();

      date.setMilliseconds(date.getMilliseconds() + milliseconds);

      this.setItem(key, payload, date);
    },

    removeExpiredItems: function () {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var record = safeJsonParse(localStorage.getItem(key));

        if (record && isCreatedByThisLib(record) && isExpired(record)) {
          localStorage.removeItem(key);
        }
      }
    }
  };

  function write (key, value, expiration) {
    expiringLocalStorage.setItem(key, value, expiration);
  }

  /** @module pathfora/utils/is-not-encoded */

  /**
   * Check if a string is encoded or not.
   *
   * @exports isNotEncoded
   * @params {string} s
   * @returns {boolean} isNotEncoded
   */
  function isNotEncoded (s) {
    try {
      return decodeURIComponent(s) === s && encodeURIComponent(s) !== s;
    } catch (e) {
      return false;
    }
  }

  /** @module pathfora/utils/cookie/update-legacy-cookies */

  /**
   * Update legacy cookies to
   * encoded cookie values.
   *
   * @exports updateLegacyCookies
   */
  function updateLegacyCookies () {
    // We should update all cookies that have these prefixes.
    var cookieFind = [
      PREFIX_REC,
      PREFIX_UNLOCK,
      PREFIX_IMPRESSION,
      PREFIX_CONFIRM,
      PREFIX_CANCEL,
      PREFIX_CLOSE,
      PREFIX_AB_TEST,
      PF_PAGEVIEWS
    ];

    var i = 0;

    var filterFunc = function (c) {
      return c.trim().indexOf(cookieFind[i]) === 0;
    };

    var cookieFunc = function (c) {
      var split = c.trim().split('=');

      if (split.length === 2) {
        var name = split[0];
        var val = split[1];

        deleteCookie(name);
        write(name, decodeSafe(val));
      }
    };

    var sessionFunc = function (c) {
      var val = sessionStorage.getItem(c);

      if (isNotEncoded(val)) {
        sessionStorage.removeItem(c);
        sessionStorage.setItem(encodeURIComponent(c), encodeURIComponent(val));
      }
    };

    for (i = 0; i < cookieFind.length; i++) {
      document$1.cookie.split(';').filter(filterFunc).forEach(cookieFunc);
      Object.keys(sessionStorage).filter(filterFunc).forEach(sessionFunc);
    }
  }

  function read (key) {
    var item = expiringLocalStorage.getItem(key);

    if (item == null) {
      item = readCookie(key);

      if (item != null) {
        deleteCookie(key);
        expiringLocalStorage.setItem(key, item);
      }
    }

    return item;
  }

  function erase (key) {
    expiringLocalStorage.removeItem(key);
    deleteCookie(key);
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
            if (params[key].hasOwnProperty(i)) {
              if (i < Object.keys(params[key]).length && i > 0) {
                queries.push('&');
              }

              queries.push(key + '[]=' + params[key][i]);
            }
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

  /** @module pathfora/utils/objects/update-object */

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

  /** @module pathfora/utils/objects/set-object-value */

  /**
   * Set the value of a field on an object, supports
   * nested objects using the key dot notation.
   *
   * @exports setObjectValue
   * @params {object} object
   * @params {string} key
   * @params value
   * @returns {object}
   */
  function setObjectValue (object, key, value) {
    var parent = object;
    var fields = key.split('.');
    for (var i = 0; i < fields.length - 1; i++) {
      var elem = fields[i];

      if (!parent[elem]) {
        parent[elem] = {};
      }

      parent = parent[elem];
    }

    parent[fields[fields.length - 1]] = value;

    return parent;
  }

  /** @module pathfora/utils/objects/get-object-value */

  /**
   * Get the value of a field on an object, supports
   * nested objects using the key dot notation.
   *
   * @exports getObjectValue
   * @params {object} object
   * @params {string} key
   */
  function getObjectValue (object, key) {
    var parent = object;
    var fields = key.split('.');
    for (var i = 0; i < fields.length; i++) {
      if (typeof parent !== 'undefined') {
        parent = parent[fields[i]];
      }
    }

    return parent;
  }

  /** @module pathfora/utils/generate-unique-id */

  /**
   * Create a unique string identifier
   *
   * @exports generateUniqueId
   * @returns {string} id
   */
  function generateUniqueId () {
    var s4 = function () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };

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

  /** @module pathfora/utils/email-valid */

  /**
   * Validate that the string is a properly formatted email
   *
   * @exports emailValid
   * @params {string} email
   * @returns {boolean} valid
   */
  function emailValid (email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
    return regex.test(email);
  }

  /** @module pathfora/utils */


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
    deleteCookie: deleteCookie,
    updateLegacyCookies: updateLegacyCookies,

    // persist
    read: read,
    write: write,
    erase: erase,
    store: expiringLocalStorage,

    // scaffold
    initWidgetScaffold: initWidgetScaffold,
    insertWidget: insertWidget,

    // url
    constructQueries: constructQueries,
    escapeURI: escapeURI,

    // objects
    updateObject: updateObject,
    setObjectValue: setObjectValue,
    getObjectValue: getObjectValue,

    generateUniqueId: generateUniqueId,
    escapeRegex: escapeRegex,
    emailValid: emailValid,
    decodeSafe: decodeSafe,
    isNotEncoded: isNotEncoded
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

  /** @module pathfora/data/helpers/helper-rules */

  /**
   * Generic helper rules for widget targeting
   *
   * @exports helperRules
   */
  var helperRules = {
    includes: function (key, value) {
      return function (data) {
        return data[key].includes(value);
      };
    },

    excludes: function (key, value) {
      return function (data) {
        return !data[key].includes(value);
      };
    },

    eq: function (key, value) {
      return function (data) {
        return data[key] === value;
      };
    },

    notEq: function (key, value) {
      return function (data) {
        return data[key] !== value;
      };
    },

    gt: function (key, value) {
      return function (data) {
        return parseInt(data[key], 10) > value;
      };
    },

    gte: function (key, value) {
      return function (data) {
        return parseInt(data[key], 10) >= value;
      };
    },

    lt: function (key, value) {
      return function (data) {
        return parseInt(data[key], 10) < value;
      };
    },

    lte: function (key, value) {
      return function (data) {
        return parseInt(data[key], 10) <= value;
      };
    },

    inFlowStep: function (id, version, step) {
      return function (data) {
        var flows = data._flows;
        var flowKey = id + '-' + version;
        return !!(flows && flows[flowKey] && flows[flowKey].step === step);
      };
    },

    inSegment: function (segment) {
      return function (data) {
        return data.segments.indexOf(segment) !== -1;
      };
    },
  };

  /** @module pathfora/callbacks/add-callback */

  /**
   * Add a function to be called once jstag is loaded
   *
   * @exports addCallack
   * @params {function} cb
   */
  function addCallback(cb) {
    if (window.lio && window.lio.loaded) {
      // legacy
      cb(window.lio.data);
      return;
    } else if (window.jstag && typeof window.jstag.getEntity === 'function') {
      if ('entityReady' in window.jstag) {
        window.jstag.entityReady(function (e) {
          if (e.data && e.data.user) {
            cb(e.data.user);
          }
        });
      } else {
        var entity = window.jstag.getEntity();
        if (entity.data && entity.data.user) {
          cb(entity.data.user);
        }
      }
    }

    // fallback
    this.callbacks.push(cb);
  }

  /** @module pathfora/display-conditions/pageviews/init-pageviews */

  /**
   * Track and update the number of pageviews
   *
   * @exports initializePageViews
   */
  function initializePageViews () {
    var cookie = read(PF_PAGEVIEWS);

    write(PF_PAGEVIEWS, Math.min(~~cookie, 9998) + 1);
  }

  /** @module pathfora/display-conditions/impressions/impressions-checker */

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
    var parts,
        totalImpressions,
        since,
        id = PREFIX_IMPRESSION + widget.id,
        sinceId = PREFIX_TOTAL_IMPRESSIONS_SINCE + widget.id,
        sessionImpressions = ~~sessionStorage.getItem(id),
        sessionImpressionsForAllWidgets = 0,
        impressionsForAllWidgets = 0,
        lastImpressionTimeForAllWidgets = 0,
        total = read(id),
        now = Date.now();

    // retain backwards compatibility if using legacy method of:
    impressionConstraints.widget = impressionConstraints.widget || {};
    impressionConstraints.global = impressionConstraints.global || {};

    // migrate impressions.session to impressions.widget.session if not also set
    if (typeof impressionConstraints.widget.session === 'undefined') {
      impressionConstraints.widget.session = impressionConstraints.session;
    }
    // migrate impressions.total to impressions.widget.total if not also set
    if (typeof impressionConstraints.widget.total === 'undefined') {
      impressionConstraints.widget.total = impressionConstraints.total;
    }
    // migrate impressions.buffer to impressions.widget.buffer if not also set
    if (typeof impressionConstraints.widget.buffer === 'undefined') {
      impressionConstraints.widget.buffer = impressionConstraints.buffer;
    }

    // maintain and overwrite the "total since" value for impressions.global.duration
    if (impressionConstraints.global.total > 0 && impressionConstraints.global.duration > 0) {
      since = read(sinceId);

      var resetImpressions = function () {
        write(
          sinceId,
          '0|' + now,
          widget.expiration
        );
      };

      if (!since) {
        resetImpressions();
      } else {
        parts = since.split('|');
        if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) >= impressionConstraints.global.duration) {
          resetImpressions();
        }
      }
    }

    if (!sessionImpressions) {
      sessionImpressions = 0;
    }

    // check for impressions.widget.session
    if (sessionImpressions >= impressionConstraints.widget.session) {
      return false;
    }

    // widget specific historic total
    if (!total) {
      totalImpressions = 0;
    } else {
      parts = total.split('|');
      totalImpressions = parseInt(parts[0], 10);

      // check for impressions.widget.buffer
      if (typeof parts[1] !== 'undefined') {
        if (impressionConstraints.widget.buffer > 0 && (Math.abs(parts[1] - now) / 1000 < impressionConstraints.widget.buffer)) {
          return false;
        }

        // check for impressions.widget.duration
        if (
          impressionConstraints.widget.duration > 0 &&
          totalImpressions % impressionConstraints.widget.total === 0 &&
          Math.abs(parts[1] - now) / 1000 < impressionConstraints.widget.duration
        ) {
          return false;
        }
      }
    }

    // check for impressions.widget.total
    if (totalImpressions >= impressionConstraints.widget.total && typeof impressionConstraints.widget.duration === 'undefined') {
      return false;
    }

    // all widgets session total
    if (impressionConstraints.global.session > 0) {
      for (var i = 0; i < ~~sessionStorage.length; i++) {
        var k = sessionStorage.key(i);
        if (typeof k !== 'undefined' && k.includes(PREFIX_IMPRESSION)) {
          sessionImpressionsForAllWidgets =
            sessionImpressionsForAllWidgets + ~~sessionStorage.getItem(k);
        }
      }
    }

    // check for impressions.global.session
    if (sessionImpressionsForAllWidgets >= impressionConstraints.global.session) {
      return false;
    }

    // all widget multi-session total
    if (impressionConstraints.global.total > 0 || impressionConstraints.global.buffer > 0) {
      for (var j = 0; j < ~~localStorage.length; j++) {
        var l = localStorage.key(j);
        if (typeof l !== 'undefined' && l.includes(PREFIX_IMPRESSION)) {
          parts = read(l).split('|');
          totalImpressions = parseInt(parts[0], 10);
          impressionsForAllWidgets = impressionsForAllWidgets + totalImpressions;

          if (typeof parts[1] !== 'undefined') {
            lastImpressionTimeForAllWidgets = Math.max(parts[1], lastImpressionTimeForAllWidgets);
          }
        }
      }

      // check for impressions.global.buffer
      if (lastImpressionTimeForAllWidgets > 0) {
        if (impressionConstraints.global.buffer > 0 && (Math.abs(lastImpressionTimeForAllWidgets - now) / 1000 < impressionConstraints.global.buffer)) {
          return false;
        }
      }
    }

    // check for impressions.global.duration
    if (impressionConstraints.global.duration > 0) {
      since = read(sinceId);
      parts = since.split('|');
      if (parts[0] >= impressionConstraints.global.total) {
        return false;
      }
    }

    // check for impressions.global.total
    if (impressionsForAllWidgets >= impressionConstraints.global.total && typeof impressionConstraints.global.duration === 'undefined') {
      return false;
    }

    return true;
  }

  /**
   * Censor an object by its keys, by comparing against an array of strings and/or regexps. In the case of strings,
   * only exact matches are censored. For non-strings, if the object's test method returns true, the key will be censored.
   *
   * @param {object} data the data to censor
   * @param {obejct} keysToReject an array of strings or regexps to censor the data by preparatory to sending
   */
  function censorTrackingKeys (data, keysToReject) {
    return Object.keys(data)
      .filter(function (key) {
        return !keysToReject.some(function (keyToReject) {
          return typeof keyToReject === 'string'
            ? key === keyToReject
            : keyToReject.test(key);
        });
      })
      .reduce(function (memo, key) {
        memo[key] = data[key];
        return memo;
      }, {});
  }

  /** @module pathfora/data/request/report-data */

  /**
   * Send data object to Lytics and GA
   *
   * @exports reportData
   * @params {object} data
   * @widget {object}
   */
  function reportData (data, widget) {
    var gaLabel, trackers;

    if (typeof jstag === 'object') {
      window.jstag.send(
        widget.censorTrackingKeys
          ? censorTrackingKeys(data, widget.censorTrackingKeys)
          : data
      );
    }

    if (window.pathfora.enableGA === true && typeof window.ga === 'function' && typeof window.ga.getAll === 'function') {
      gaLabel = data['pf-widget-action'] || data['pf-widget-event'];
      trackers = window.ga.getAll();

      for (var i = 0; i < trackers.length; i++) {
        var name = trackers[i].get('name');

        window.ga(
          name + '.send',
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
  }

  /** @module pathfora/data/tracking/track-widget-action */

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
    case 'success.confirm':
      params['pf-widget-action'] = !!widget.formStates && !!widget.formStates.success
        && !!widget.formStates.success.confirmAction && widget.formStates.success.confirmAction.name || 'success confirm';
      pathforaDataObject.completedActions.push(params);
      break;
    case 'success.cancel':
      params['pf-widget-action'] = !!widget.formStates && !!widget.formStates.success
        && !!widget.formStates.success.cancelAction && widget.formStates.success.cancelAction.name || 'success cancel';
      pathforaDataObject.cancelledActions.push(params);
      break;
    case 'error.confirm':
      params['pf-widget-action'] = !!widget.formStates && !!widget.formStates.error
        && !!widget.formStates.error.confirmAction && widget.formStates.error.confirmAction.name || 'error confirm';
      pathforaDataObject.completedActions.push(params);
      break;
    case 'error.cancel':
      params['pf-widget-action'] = !!widget.formStates && !!widget.formStates.error
        && !!widget.formStates.error.cancelAction && widget.formStates.error.cancelAction.name || 'error cancel';
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
        write(PREFIX_UNLOCK + widget.id, true, widget.expiration);
      }

      break;
    case 'subscribe':
      params['pf-form-email'] = htmlElement.elements.email.value;
      break;
    case 'hover':
      if (hasClass(htmlElement, 'pf-content-unit')) {
        params['pf-widget-action'] = 'content recommendation';
      } else if (hasClass(htmlElement, 'pf-widget-ok')) {
        if (htmlElement.parentElement && hasClass(htmlElement.parentElement, 'success-state')) {
          params['pf-widget-action'] = 'success.confirm';
        } else if (htmlElement.parentElement && hasClass(htmlElement.parentElement, 'error-state')) {
          params['pf-widget-action'] = 'error.confirm';
        } else {
          params['pf-widget-action'] = 'confirm';
        }
      } else if (hasClass(htmlElement, 'pf-widget-cancel')) {
        if (htmlElement.parentElement && hasClass(htmlElement.parentElement, 'success-state')) {
          params['pf-widget-action'] = 'success.cancel';
        } else if (htmlElement.parentElement && hasClass(htmlElement.parentElement, 'error-state')) {
          params['pf-widget-action'] = 'error.cancel';
        } else {
          params['pf-widget-action'] = 'cancel';
        }
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
    reportData(params, widget);
  }

  /** @module pathfora/display-conditions/impressions/increment-impressions */

  /**
   * Increment the impression count for a widget
   *
   * @exports incrementImpressions
   * @params {object} widget
   */
  function incrementImpressions (widget) {
    var parts,
        totalImpressions,
        id = PREFIX_IMPRESSION + widget.id,
        sessionImpressions = ~~sessionStorage.getItem(id),
        total = read(id),
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
    write(id, Math.min(totalImpressions, 9998) + '|' + now, widget.expiration);

    // increment the "total since" values for modals with the impressions.global.duration config option
    for (var i = 0; i < ~~localStorage.length; i++) {
      var k = localStorage.key(i);
      if (typeof k !== 'undefined' && k.includes(PREFIX_TOTAL_IMPRESSIONS_SINCE)) {
        parts = read(k).split('|');
        totalImpressions = parseInt(parts[0], 10) + 1;
        write(k, totalImpressions + '|' + parts[1], widget.expiration);
      }
    }
  }

  /** @module pathfora/validation/validate-widget-position */

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
      choices = ['', 'middle-center'];
      break;
    case 'slideout':
      choices = [
        'bottom-left',
        'bottom-right',
        'left',
        'right',
        'top-left',
        'top-right'
      ];
      break;
    case 'bar':
      choices = ['top-absolute', 'top-fixed', 'bottom-fixed', 'top-center', 'bottom-center'];
      break;
    case 'button':
      choices = [
        'left',
        'right',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right'
      ];
      break;
    case 'inline':
      choices = [];
      break;
    }

    if (choices.length && choices.indexOf(config.position) === -1) {
      console.warn(
        config.position + ' is not a valid position for ' + config.layout
      );
    }
  }

  /** @module pathfora/widgets/setup-widget-position */

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

  /** @module pathfora/utils/date-valid */

  /**
   * Validate that the string is a valid date
   *
   * @exports dateValid
   * @params {string} date
   * @params {string} max
   * @params {string} min
   * @returns {boolean} valid
   */
  function dateValid (date, max, min) {
    var selectedDate = new Date(date).getTime(),
        maxDate = max ? new Date(max).getTime() : undefined,
        minDate = min ? new Date(min).getTime() : undefined;

    if (max && selectedDate > maxDate) {
      return false;
    }

    if (min && selectedDate < minDate) {
      return false;
    }

    return true;
  }

  /** @module pathfora/widgets/close-widget */

  /**
   * Close a widget and remove it from the dom
   *
   * @exports closeWidget
   * @params {string} id
   * @params {boolean} noTrack
   */
  function closeWidget (id, noTrack) {
    var i,
        node = document$1.getElementById(id);

    // FIXME Change to Array#some or Array#filter
    for (i = 0; i < widgetTracker.openedWidgets.length; i++) {
      if (widgetTracker.openedWidgets[i].id === id) {
        if (!noTrack) {
          trackWidgetAction('close', widgetTracker.openedWidgets[i]);
        }

        for (var key in widgetTracker.openedWidgets[i].listeners) {
          if (widgetTracker.openedWidgets[i].listeners.hasOwnProperty(key)) {
            var val = widgetTracker.openedWidgets[i].listeners[key];
            val.target.removeEventListener(val.type, val.fn);
          }
        }

        widgetTracker.openedWidgets.splice(i, 1);
        break;
      }
    }

    removeClass(node, 'opened');

    if (hasClass(node, 'pf-has-push-down')) {
      var pushDown = document$1.querySelector('.pf-push-down');
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

  /** @module pathfora/form/handle-form-states */

  /**
   * Handles showing the success or error state of a form.
   *
   * @exports handleFormStates
   * @params {boolean} successful
   * @params {object} widget
   * @params {object} config
   */
  function handleFormStates (successful, widget, config) {
    if (config.formStates) {
      var delay = 0;

      if (successful) {
        addClass(widget, 'success');
        delay = config.formStates.success && typeof config.formStates.success.delay !== 'undefined' ? config.formStates.success.delay * 1000 : 3000;
      } else {
        addClass(widget, 'error');
        delay = config.formStates.error && typeof config.formStates.error.delay !== 'undefined' ? config.formStates.error.delay * 1000 : 3000;
      }

      if (delay > 0) {
        setTimeout(function () {
          closeWidget(widget.id, true);
        }, delay);
      }
    }
  }

  /** @module pathfora/widgets/actions/widgetOnModalClose */

  /**
   * Execute the onModalClose callback
   * if set by the user
   *
   * @exports widgetOnModalClose
   * @params {object} widget
   * @params {object} config
   * @params {object} event
   */

  function widgetOnModalClose (widget, config, event) {
    if (typeof config.onModalClose === 'function') {
      config.onModalClose(callbackTypes.MODAL_CLOSE, {
        widget: widget,
        config: config,
        event: event
      });
    }
  }

  /** @module pathfora/widgets/actions/update-action-cookie */

  /**
   * Increase the value count of the actions
   * saves as cookies
   *
   * @exports updateActionCookie
   * @params {string} name
   * @params {object} expiration
   */

  function updateActionCookie (name, expiration) {
    var ct,
        val = read(name),
        duration = Date.now();

    if (val) {
      val = val.split('|');
      ct = Math.min(parseInt(val[0], 10), 9998) + 1;
    } else {
      ct = 1;
    }

    write(name, ct + '|' + duration, expiration);
  }

  /** @module pathfora/widgets/actions/buton-action */

  /**
   * Execute any callbacks that were assigned
   * to a button, and perform tracking
   *
   * @exports widgetOnModalClose
   * @params {object} btn
   * @params {string} type
   * @params {object} config
   * @params {object} widget
   */

  function buttonAction (btn, type, config, widget) {
    var prefix, callbackType, action, shouldClose;

    switch (type) {
    case 'close':
      prefix = PREFIX_CLOSE;
      callbackType = callbackTypes.MODAL_CLOSE;
      action = config.closeAction;
      shouldClose = true;
      break;
    case 'cancel':
    case 'success.cancel':
    case 'error.cancel':
      prefix = PREFIX_CANCEL;
      action = config.cancelAction;
      shouldClose = config.layout !== 'inline';

      if (type === 'success.cancel') {
        action = config.formStates.success.cancelAction;
      }

      if (type === 'error.cancel') {
        action = config.formStates.error.cancelAction;
      }

      break;
    case 'confirm':
    case 'success.confirm':
    case 'error.confirm':
      prefix = PREFIX_CONFIRM;
      shouldClose = config.layout !== 'inline';

      if (type === 'success.confirm') {
        action = config.formStates.success.confirmAction;
      }
      if (type === 'error.confirm') {
        action = config.formStates.error.confirmAction;
      }

      break;
    }

    btn.onmouseenter = function (event) {
      trackWidgetAction('hover', config, event.target);
    };

    btn.onclick = function (event) {
      trackWidgetAction(type, config);
      updateActionCookie(prefix + widget.id, config.expiration);

      if (typeof action === 'object') {
        if (action.close === false) {
          shouldClose = false;
        }

        if (typeof action.callback === 'function') {
          action.callback(callbackType, {
            widget: widget,
            config: config,
            event: event
          });
        }
      }

      if (shouldClose) {
        closeWidget(widget.id, true);
        widgetOnModalClose(widget, config, event);
      }
    };
  }

  /** @module pathfora/widgets/actions/construct-widget-actions */

  /**
   * Add callbacks and tracking for user interactions
   * with widgets
   *
   * @exports constructWidgetActions
   * @params {object} widget
   * @params {object} config
   */
  function constructWidgetActions(widget, config) {
    var widgetOnButtonClick,
      widgetFormValidate,
      widgetForm,
      widgetOk = widget.querySelector('.pf-widget-ok'),
      widgetCancel = widget.querySelector('.pf-widget-cancel'),
      widgetClose = widget.querySelector('.pf-widget-close'),
      widgetReco = widget.querySelector('.pf-content-unit');

    // Tracking for widgets with a form element
    switch (config.type) {
      case 'form':
      case 'sitegate':
      case 'subscription':
        widgetForm = widget.querySelector('form');

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
            if (
              typeof child.getAttribute !== 'undefined' &&
              child.getAttribute('name') !== null
            ) {
              // Track focus of form elements
              child.onfocus = onInputFocus;

              // Track input to indicate they've begun to interact with the form
              child.onchange = onInputChange;
            }
          }
        }

        // Form submit handler
        widgetFormValidate = function (event) {
          event.preventDefault();

          // Validate that the form is filled out correctly
          var valid = true;
          var requiredElements = Array.prototype.slice.call(
            widgetForm.querySelectorAll('[data-required=true]')
          );
          var validatableElements = Array.prototype.slice.call(
            widgetForm.querySelectorAll('[data-validate=true]')
          );
          var i;
          var field;
          var parent;

          for (i = 0; i < requiredElements.length; i++) {
            field = requiredElements[i];

            if (hasClass(widgetForm, 'pf-custom-form')) {
              if (field.parentNode) {
                parent = field.parentNode;
                removeClass(parent, 'invalid');

                if (
                  hasClass(parent, 'pf-widget-radio-group') ||
                  hasClass(parent, 'pf-widget-checkbox-group')
                ) {
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
                  if (field && i === 0) {
                    field.focus();
                  }
                }
              }
              // legacy support old, non-custom forms
            } else if (field.hasAttribute('data-required')) {
              removeClass(field, 'invalid');

              if (!field.value) {
                valid = false;
                addClass(field, 'invalid');
                if (field && i === 0) {
                  field.focus();
                }
              }
            }
          }

          for (i = 0; i < validatableElements.length; i++) {
            var meetsPattern = true;

            field = validatableElements[i];

            if (hasClass(widgetForm, 'pf-custom-form')) {
              if (field.parentNode) {
                parent = field.parentNode;
                removeClass(parent, 'bad-validation');

                // handle email type
                if (
                  field.value !== '' &&
                  field.getAttribute('type') === 'email' &&
                  !emailValid(field.value)
                ) {
                  valid = false;
                  meetsPattern = false;
                }

                // handle date type
                if (
                  field.getAttribute('type') === 'date' &&
                  !dateValid(
                    field.value,
                    field.getAttribute('max'),
                    field.getAttribute('min')
                  )
                ) {
                  valid = false;
                  meetsPattern = false;
                }

                // handle custom validation if a validation pattern exists
                var pattern = field.getAttribute('enforcePattern');
                if (pattern && field.value.length > 0) {
                  // validate the regex pattern against the input string
                  var regex = new RegExp(pattern);
                  if (!regex.test(field.value)) {
                    valid = false;
                    meetsPattern = false;
                  }
                }

                if (!meetsPattern) {
                  addClass(parent, 'bad-validation');
                  if (field && i === 0) {
                    field.focus();
                  }
                }
              }
              // legacy support old, non-custom forms
            } else if (field.hasAttribute('data-validate')) {
              removeClass(field, 'bad-validation');

              if (
                field.getAttribute('type') === 'email' &&
                !emailValid(field.value) &&
                field.value !== ''
              ) {
                valid = false;
                addClass(field, 'bad-validation');
                if (field && i === 0) {
                  field.focus();
                }
              }
            }
          }

          return valid;
        };

        break;
    }

    switch (config.layout) {
      case 'button':
        if (typeof config.onClick === 'function') {
          widgetOnButtonClick = function (event) {
            config.onClick(callbackTypes.CLICK, {
              widget: widget,
              config: config,
              event: event,
            });
          };
        }
        break;
      case 'modal':
        if (config.type !== 'sitegate') {
          config.listeners.escape = {
            type: 'keydown',
            target: document,
            fn: function (event) {
              event = event || window.event;
              if (event.keyCode === 27) {
                trackWidgetAction('close', config);
                updateActionCookie(PREFIX_CLOSE + widget.id, config.expiration);
                closeWidget(widget.id, true);
                widgetOnModalClose(widget, config, event);
              }
            },
          };
        }
        break;
    }

    if (widgetClose) {
      buttonAction(widgetClose, 'close', config, widget);
    }

    if (widgetCancel) {
      buttonAction(widgetCancel, 'cancel', config, widget);
    }

    if (widgetOk) {
      widgetOk.onmouseenter = function (event) {
        trackWidgetAction('hover', config, event.target);
      };

      widgetOk.onclick = function (event) {
        var data,
          widgetAction,
          shouldClose = true;

        // special case for form widgets
        if (typeof widgetFormValidate === 'function') {
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

          // validate form input
          if (!widgetAction || !widgetFormValidate(event)) {
            return;
          } else if (widgetForm) {
            trackWidgetAction(widgetAction, config, widgetForm);

            // get the data submitted to the form
            data = Array.prototype.slice
              .call(widgetForm.querySelectorAll('input, textarea, select'))
              .filter(function (element) {
                if (
                  element.type &&
                  (element.type === 'checkbox' || element.type === 'radio')
                ) {
                  return element.checked;
                }
                return true;
              })
              .map(function (element) {
                return {
                  name: element.name || element.id,
                  value: element.value,
                };
              });

            // onSubmit callback should be deprecated,
            // we keep the cb for backwards compatibility.
            if (typeof config.onSubmit === 'function') {
              config.onSubmit(callbackTypes.FORM_SUBMIT, {
                widget: widget,
                config: config,
                event: event,
                data: data,
              });
            }
          }
        }

        // track confirm action
        trackWidgetAction('confirm', config);
        updateActionCookie(PREFIX_CONFIRM + widget.id, config.expiration);

        // support onClick callback for button modules
        if (typeof widgetOnButtonClick === 'function') {
          widgetOnButtonClick(event);
        }

        // confirmAction
        if (typeof config.confirmAction === 'object') {
          if (config.confirmAction.close === false) {
            shouldClose = false;
          }

          if (typeof config.confirmAction.callback === 'function') {
            var param = {
              widget: widget,
              config: config,
              event: event,
            };

            // include the data from the form if we have it.
            if (data) {
              param.data = data;
            }

            // if waitForAsyncResponse we will handle the states as part of the callback
            if (config.confirmAction.waitForAsyncResponse === true) {
              config.confirmAction.callback(
                callbackTypes.MODAL_CONFIRM,
                param,
                function (successful) {
                  handleFormStates(successful, widget, config);
                }
              );
              return;
            } else {
              config.confirmAction.callback(callbackTypes.MODAL_CONFIRM, param);
            }
          }
        }

        if (shouldClose) {
          if (
            config.layout !== 'inline' &&
            (!config.formStates || !config.formStates.success)
          ) {
            closeWidget(widget.id, true);
            widgetOnModalClose(widget, config, event);
          } else {
            // show success state
            handleFormStates(true, widget, config);
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
        updateActionCookie(PREFIX_CONFIRM + widget.id, config.expiration);
      };
    }
  }

  /** @module pathfora/widgets/recommendation/setup-widget-content-unit */

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
            recImage = document$1.createElement('div'),
            recMeta = document$1.createElement('div'),
            recTitle = document$1.createElement('h4'),
            recDesc = document$1.createElement('p'),
            recInfo = document$1.createElement('span');

        widgetContentUnit.href = rec.url;

        // image div
        if (
          rec.image &&
          (!settings.display || settings.display.image !== false)
        ) {
          recImage.className = 'pf-content-unit-img';
          recImage.style.backgroundImage = "url('" + rec.image + "')";
          widgetContentUnit.appendChild(recImage);
        }

        recMeta.className = 'pf-content-unit-meta';

        // title h4
        if (
          rec.title &&
          (!settings.display || settings.display.title !== false)
        ) {
          recTitle.innerHTML = rec.title;
          recMeta.appendChild(recTitle);
        }

        if (
          rec.author &&
          (settings.display && settings.display.author === true)
        ) {
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
        if (
          rec.description &&
          (!settings.display || settings.display.description !== false)
        ) {
          var desc = rec.description,
              limit =
              config.layout === 'modal'
                ? DEFAULT_CHAR_LIMIT
                : DEFAULT_CHAR_LIMIT_STACK;

          // set the default character limit for descriptions
          if (!settings.display) {
            settings.display = {
              descriptionLimit: limit
            };
          } else if (!settings.display.descriptionLimit) {
            settings.display.descriptionLimit = limit;
          }

          if (
            desc.length > settings.display.descriptionLimit &&
            settings.display.descriptionLimit !== -1
          ) {
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

  /**
   * Build and insert a custom form element into
   * the widget's form
   *
   * @exports buildFormElement
   * @params {object} elem
   * @params {object} form
   */
  function buildFormElement(elem, form) {
    var content,
      i,
      val,
      label,
      wrapper = document$1.createElement('div'),
      isGroup = elem.hasOwnProperty('groupType'),
      reqFlag,
      reqTriangle;

    // group elements include: checkbox groups
    if (isGroup) {
      wrapper.className = 'pf-widget-' + elem.type;
      content = document$1.createElement('div');
    } else {
      switch (elem.type) {
        case 'email':
          content = document$1.createElement('input');
          content.setAttribute('type', 'email');
          break;
        case 'us-postal-code':
          content = document$1.createElement('input');
          content.setAttribute('type', 'text');
          if (!elem.pattern) {
            elem.pattern = '^[0-9]{5}$';
          }
          break;
        case 'text':
        case 'input':
          content = document$1.createElement('input');
          content.setAttribute('type', 'text');
          break;
        case 'date':
          content = document$1.createElement('input');
          content.setAttribute('type', 'date');
          break;
        default:
          content = document$1.createElement(elem.type);
          break;
      }

      // if custom validation is requested ensure that is stored on the element
      if (elem.pattern) {
        content.setAttribute('enforcePattern', elem.pattern);
      }

      content.setAttribute('name', elem.name);
      content.setAttribute('id', elem.name);

      // add row count for textarea
      if (elem.type === 'textarea') {
        content.setAttribute('rows', 5);
      }

      // add max and min date for date input
      if (elem.type === 'date') {
        var today = new Date(),
          offset = today.getTimezoneOffset(),
          todayTimezone = new Date(today.getTime() - offset * 60 * 1000),
          max = elem.maxDate
            ? elem.maxDate === 'today'
              ? todayTimezone
              : new Date(elem.maxDate)
            : null,
          min = elem.minDate
            ? elem.minDate === 'today'
              ? todayTimezone
              : new Date(elem.minDate)
            : null;

        if (max != null) {
          content.setAttribute('max', max.toISOString().split('T')[0]);
        }
        if (min != null) {
          content.setAttribute('min', min.toISOString().split('T')[0]);
        }
      }
    }

    if (elem.label) {
      if (isGroup) {
        label = document$1.createElement('span');
        label.id = elem.name;
        content.setAttribute('aria-labelledby', elem.name);
      } else {
        label = document$1.createElement('label');
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
        reqFlag = document$1.createElement('div');
        reqFlag.className = 'pf-required-flag';
        reqFlag.innerHTML = 'required';

        reqTriangle = document$1.createElement('span');
        reqFlag.appendChild(reqTriangle);
        wrapper.appendChild(reqFlag);
      }
    }

    if (elem.pattern) {
      content.setAttribute('data-validate', 'true');
      addClass(wrapper, 'pf-form-required-validation');
    }

    if (elem.type === 'date' || elem.type === 'email') {
      addClass(wrapper, 'pf-form-required');
      content.setAttribute('data-validate', 'true');

      if (elem.label) {
        reqFlag = document$1.createElement('div');
        reqFlag.className = 'pf-invalid-flag';
        reqFlag.innerHTML = 'invalid';

        reqTriangle = document$1.createElement('span');
        reqFlag.appendChild(reqTriangle);
        wrapper.appendChild(reqFlag);
      }
    }

    if (elem.placeholder) {
      // select element has first option as placeholder
      if (elem.type === 'select') {
        var placeholder = document$1.createElement('option');
        placeholder.setAttribute('value', '');
        placeholder.innerHTML = elem.placeholder;
        content.appendChild(placeholder);
      } else {
        content.placeholder = elem.placeholder;
      }

      if (!elem.label) {
        content.setAttribute('aria-label', elem.placeholder);
      }
    }

    if (elem.values) {
      for (i = 0; i < elem.values.length; i++) {
        val = elem.values[i];

        if (isGroup) {
          var input = document$1.createElement('input');
          input.setAttribute('type', elem.groupType);
          input.setAttribute('value', val.value);
          input.setAttribute('name', elem.name);

          if (val.label) {
            label = document$1.createElement('label');
            label.className = 'pf-widget-' + elem.groupType;
            label.appendChild(input);
            label.appendChild(document$1.createTextNode(val.label));
            content.appendChild(label);
          } else {
            throw new Error(
              elem.groupType + 'form group values must contain labels'
            );
          }
        } else if (elem.type === 'select') {
          var option = document$1.createElement('option');
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
      case 'us-postal-code':
      case 'textarea':
      case 'input':
      case 'text':
      case 'email':
      case 'date':
      case 'select':
        buildFormElement(elem, form);
        break;

      default:
        throw new Error('unrecognized form element type: ' + elem.type);
      }
    }
  }

  /** @module pathfora/form/construct-form-state */

  /**
   * Setup html for success or error state of a form module
   *
   * @exports constructFormState
   * @params {object} widget
   * @params {object} config
   * @params {string} name
   */
  function constructFormState (config, widget, name) {
    if (!config.formStates) {
      return;
    }

    var obj, defaultHeadline, defaultMsg;

    switch (name) {
    case 'success':
      obj = config.formStates.success;
      defaultMsg = 'We have received your submission.';
      defaultHeadline = 'Thank You';
      break;
    case 'error':
      obj = config.formStates.error;
      defaultMsg = 'There was an error receiving with your submission.';
      defaultHeadline = 'Error';
      break;
    default:
      throw new Error('Unrecognized formState: ' + name);
    }

    var elem = document$1.createElement('div');
    elem.className = name + '-state';

    var title = document$1.createElement('h2');
    title.className = 'pf-widget-headline';
    title.innerHTML = obj.headline || defaultHeadline;
    elem.appendChild(title);

    var msg = document$1.createElement('div');
    msg.className = 'pf-widget-message';
    msg.innerHTML = obj.msg || defaultMsg;
    elem.appendChild(msg);

    if (obj.okShow) {
      var ok = document$1.createElement('button');
      ok.type = 'button';
      ok.className = 'pf-widget-btn pf-widget-ok';
      ok.innerHTML = obj.okMessage || 'Confirm';
      elem.appendChild(ok);
    }

    if (obj.cancelShow) {
      var cancel = document$1.createElement('button');
      cancel.type = 'button';
      cancel.className = 'pf-widget-btn pf-widget-cancel';
      cancel.innerHTML = obj.cancelMessage || 'Cancel';
      elem.appendChild(cancel);
    }

    return elem;
  }

  /** @module pathfora/widgets/actions/form-state-actions */

  /**
   * Add callbacks and tracking for confirm and cancel
   * buttons on the success or error state of a form widget
   *
   * @exports formStateActions
   * @params {object} widget
   * @params {object} config
   * @params {name} string
   */
  function formStateActions (config, widget, name) {
    var ok = widget.querySelector('.' + name + '-state .pf-widget-ok'),
        cancel = widget.querySelector('.' + name + '-state .pf-widget-cancel');

    if (cancel) {
      buttonAction(cancel, name + '.cancel', config, widget);
    }

    if (ok) {
      buttonAction(ok, name + '.confirm', config, widget);
    }
  }

  /** @module pathfora/widgets/construct-widget-layout */

  /**
   * Setup inner html elements for a widget
   *
   * @exports constructWidgetLayout
   * @params {object} widget
   * @params {object} config
   */
  function constructWidgetLayout(widget, config) {
    var node,
      child,
      i,
      widgetContent = widget.querySelector('.pf-widget-content'),
      widgetCancel = widget.querySelector('.pf-widget-cancel'),
      widgetOk = widget.querySelector('.pf-widget-ok'),
      widgetHeadline = widget.querySelectorAll('.pf-widget-headline'),
      widgetBody = widget.querySelector('.pf-widget-body'),
      widgetMessage = widget.querySelector('.pf-widget-message'),
      widgetFooter = widget.querySelector('.pf-widget-footer');

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
            if (!config.formStates) {
              break;
            }

            // success state
            if (config.formStates.success) {
              var success = constructFormState(config, widget, 'success');
              widgetContent.appendChild(success);
              formStateActions(config, widget, 'success');
            }

            // error state
            if (config.formStates.error) {
              var error = constructFormState(config, widget, 'error');
              widgetContent.appendChild(error);
              formStateActions(config, widget, 'error');
            }

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
          var branding = document$1.createElement('div');
          branding.className = 'branding';
          branding.innerHTML = templates.assets.lytics;
          widgetContent.appendChild(branding);
        }

        break;
    }

    switch (config.type) {
      case 'form':
        switch (config.layout) {
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
      var widgetImage = document$1.createElement('img');
      widgetImage.src = config.image;
      widgetImage.className = 'pf-widget-img';
      widgetImage.alt = '';
      if (config.layout === 'button') ; else if (config.layout === 'modal' || config.layout === 'inline') {
        widgetContent.appendChild(widgetImage);
      } else {
        widgetBody.appendChild(widgetImage);
      }
    }

    switch (config.type) {
      case 'sitegate':
      case 'form':
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
          // support old form functions
          var getFormElement = function (field) {
            if (field === 'name') {
              return widget.querySelector('input[name="username"]');
            }

            return widget.querySelector('form [name="' + field + '"]');
          };

          // Set placeholders
          Object.keys(config.placeholders).forEach(function (field) {
            var element = getFormElement(field);

            if (element == null) {
              return;
            }
            if (typeof element.placeholder !== 'undefined') {
              element.placeholder = config.placeholders[field];
            } else if (typeof element.options !== 'undefined') {
              element.options[0].innerHTML = config.placeholders[field];
            }

            element.setAttribute('aria-label', config.placeholders[field]);
          });

          // Set required Fields
          Object.keys(config.required).forEach(function (field) {
            var element = getFormElement(field);

            if (element && config.required[field]) {
              element.setAttribute('data-required', 'true');
            }
          });

          // Set validation for email field
          var emailField = getFormElement('email');
          if (emailField && emailField.type === 'email') {
            emailField.setAttribute('data-validate', 'true');
          }

          // Hide fields
          Object.keys(config.fields).forEach(function (field) {
            var element = getFormElement(field);

            if (element && !config.fields[field] && element.parentNode) {
              element.parentNode.removeChild(element);
            }
          });

          // NOTE: collapse half-width inputs
          Array.prototype.slice
            .call(widget.querySelectorAll('form .pf-field-half-width'))
            .forEach(function (element, halfcount) {
              var parent = element.parentNode,
                prev = element.previousElementSibling,
                next = element.nextElementSibling;

              if (parent) {
                if (element.className.indexOf('pf-field-half-width') !== -1) {
                  if (halfcount % 2) {
                    // odd
                    addClass(element, 'right');

                    if (
                      !(
                        prev &&
                        prev.className.indexOf('pf-field-half-width') !== -1
                      )
                    ) {
                      removeClass(element, 'pf-field-half-width');
                    }
                  } else if (
                    !(
                      next && next.className.indexOf('pf-field-half-width') !== -1
                    )
                  ) {
                    // even
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

    if (config.footerText) {
      widgetFooter.innerHTML = config.footerText;
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
        headlineLeft = widget.querySelector(
          '.pf-widget-caption-left .pf-widget-headline'
        ),
        cancelBtn = widget.querySelectorAll('.pf-widget-btn.pf-widget-cancel'),
        okBtn = widget.querySelectorAll('.pf-widget-btn.pf-widget-ok'),
        arrow = widget.querySelector('.pf-widget-caption span'),
        arrowLeft = widget.querySelector('.pf-widget-caption-left span'),
        contentUnit = widget.querySelector('.pf-content-unit'),
        contentUnitMeta = widget.querySelector('.pf-content-unit-meta'),
        fields = widget.querySelectorAll('input, textarea, select'),
        branding = widget.querySelector('.branding svg'),
        required = widget.querySelectorAll('.pf-required-flag'),
        requiredAsterisk = widget.querySelectorAll('span.required'),
        requiredInline = widget.querySelectorAll(
          '[data-required=true]:not(.pf-has-label), [data-validate=true]:not(.pf-has-label)'
        ),
        body = widget.querySelector('.pf-widget-body');

    if (colors.background) {
      if (hasClass(widget, 'pf-widget-modal')) {
        widget
          .querySelector('.pf-widget-content')
          .style.setProperty('background-color', colors.background, 'important');
      } else {
        widget.style.setProperty(
          'background-color',
          colors.background,
          'important'
        );
      }
    }

    if (colors.fieldBackground) {
      for (i = 0; i < fields.length; i++) {
        fields[i].style.setProperty(
          'background-color',
          colors.fieldBackground,
          'important'
        );
      }
    }

    if (colors.required) {
      for (i = 0; i < required.length; i++) {
        required[i].style.setProperty(
          'background-color',
          colors.required,
          'important'
        );
        required[i]
          .querySelector('span')
          .style.setProperty('border-right-color', colors.required, 'important');
      }

      for (i = 0; i < requiredInline.length; i++) {
        requiredInline[i].style.setProperty(
          'border-color',
          colors.required,
          'important'
        );
      }

      for (i = 0; i < requiredAsterisk.length; i++) {
        requiredAsterisk[i].style.setProperty(
          'color',
          colors.required,
          'important'
        );
      }
    }

    if (colors.requiredText) {
      for (i = 0; i < required.length; i++) {
        required[i].style.setProperty('color', colors.requiredText, 'important');
      }
    }

    if (contentUnit && contentUnitMeta) {
      var contentUnitMetaTitle = contentUnitMeta.querySelector('h4');
      var contentUnitMetaDescription = contentUnitMeta.querySelector('p');

      if (colors.actionBackground) {
        contentUnit.style.setProperty(
          'background-color',
          colors.actionBackground,
          'important'
        );
      }

      if (colors.actionText && contentUnitMetaTitle) {
        contentUnitMetaTitle.style.setProperty(
          'color',
          colors.actionText,
          'important'
        );
      }

      if (colors.text && contentUnitMetaDescription) {
        contentUnitMetaDescription.style.setProperty(
          'color',
          colors.text,
          'important'
        );
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
      for (i = 0; i < cancelBtn.length; i++) {
        if (colors.cancelText) {
          cancelBtn[i].style.setProperty('color', colors.cancelText, 'important');
        }

        if (colors.cancelBackground) {
          cancelBtn[i].style.setProperty(
            'background-color',
            colors.cancelBackground,
            'important'
          );
        }
      }
    }

    if (okBtn) {
      for (i = 0; i < okBtn.length; i++) {
        if (colors.actionText) {
          okBtn[i].style.setProperty('color', colors.actionText, 'important');
        }

        if (colors.actionBackground) {
          okBtn[i].style.setProperty(
            'background-color',
            colors.actionBackground,
            'important'
          );
        }
      }
    }

    if (colors.text && branding) {
      branding.style.setProperty('fill', colors.text, 'important');
    }

    if (msg && colors.text) {
      for (i = 0; i < msg.length; i++) {
        msg[i].style.setProperty('color', colors.text, 'important');
      }
    }

    if (body && colors.text) {
      body.style.setProperty('color', colors.text, 'important');
    }
  }

  /** @module pathfora/wodgets/colors/setup-widget-colors */

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

  /**
   * Call all the necessary functions to construct
   * the widget html
   *
   * @exports createWidgetHtml
   * @params {object} config
   * @returns {object} widget
   */
  function createWidgetHtml (config) {
    var widget = document$1.createElement('div');

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

  /**
   * Make the widget visible to the user
   *
   * @exports showWidget
   * @params {object} widget
   */

  function showWidget (w) {
    var openWidget = function (widget) {
      // FIXME Change to Array#filter and Array#length
      for (var i = 0; i < widgetTracker.openedWidgets.length; i++) {
        if (widgetTracker.openedWidgets[i] === widget) {
          return;
        }
      }

      widgetTracker.openedWidgets.push(widget);
      trackWidgetAction('show', widget);

      // increment impressions for widget regardless of display condition need(s)
      incrementImpressions(widget);

      var node;

      try {
        node = createWidgetHtml(widget);
      } catch (error) {
        widgetTracker.openedWidgets.pop();
        throw new Error(error);
      }

      if (widget.pushDown) {
        addClass(document$1.querySelector('.pf-push-down'), 'opened');
      }

      if (
        widget.config.positionSelector == null &&
        widget.config.layout !== 'inline'
      ) {
        document$1.body.appendChild(node);

        if (widget.layout === 'modal' || widget.type === 'sitegate') {
          // ensure that we set focus the the modal for accessibility reasons
          var focusable = node.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (focusable.length) {
            widget.listeners.tabindex = {
              type: 'keydown',
              target: document$1,
              fn: function (ev) {
                // for modal and sitegate widgets we need to limit tab cycle focus to the widget
                if (ev.keyCode === 9) {
                  if (!node.contains(event.target)) {
                    ev.preventDefault();
                    focusable[0].focus();
                  } else if (ev.target === focusable[focusable.length - 1]) {
                    ev.preventDefault();
                    focusable[0].focus();
                  }
                }
              }
            };
          }
        }
      } else {
        // support legacy inline layout used position as selector.
        var selector = widget.config.positionSelector == null
          ? widget.config.position : widget.config.positionSelector;
        var hostNode = document$1.querySelector(selector);

        if (hostNode) {
          hostNode.appendChild(node);
        } else {
          widgetTracker.openedWidgets.pop();
          throw new Error('Widget could not be initialized in ' + selector);
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
        if (
          widget.config.layout === 'modal' &&
          typeof widget.config.onModalOpen === 'function'
        ) {
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

      widget.listeners.resize = {
        type: 'resize',
        target: window,
        fn: function () {
          widgetResizeListener(widget, node);
        }
      };

      for (var key in widget.listeners) {
        if (widget.listeners.hasOwnProperty(key)) {
          var val = widget.listeners[key];
          if (val.target && typeof val.target.addEventListener === 'function') {
            val.target.addEventListener(val.type, val.fn);
          }
        }
      }
    };

    var widgetOnInitCallback = w.onInit;
    if (typeof widgetOnInitCallback === 'function') {
      widgetOnInitCallback(callbackTypes.INIT, {
        config: w
      });
    }

    // account for showDelay condition
    if (w.displayConditions && w.displayConditions.showDelay) {
      widgetTracker.delayedWidgets[w.id] = setTimeout(function () {
        openWidget(w);
        document$1.querySelector('.pf-widget-ok').focus();
      }, w.displayConditions.showDelay * 1000);
    } else {
      openWidget(w);
    }
  }

  /** @module pathfora/display-conditions/watchers/validate-watchers */

  function validateWatchers (widget, cb, e) {
    var valid = true;

    for (var key in widget.watchers) {
      if (widget.watchers.hasOwnProperty(key) && widget.watchers[key] !== null) {
        valid = valid && widget.valid && widget.watchers[key].check(e);
      }
    }

    if (widget.displayConditions.impressions && valid) {
      valid = impressionsChecker(widget.displayConditions.impressions, widget);
    }

    if (valid) {
      showWidget(widget);
      widget.valid = false;
      cb();
      widget.watchers = [];

      return true;
    }

    return false;
  }

  /** @module pathfora/display-conditions/manual-trigger/trigger-widget */

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

  /** @module pathfora/data/segments/get-user-segments */

  /**
   * Get a list of Lytics segments for the user
   *
   * @exports getUserSegments
   * @returns {array} segments
   */
  function getUserSegments () {
    if (window.lio && window.lio.data && window.lio.data.segments) {
      // legacy
      return window.lio.data.segments;
    } else if (window.jstag && typeof window.jstag.getSegments === 'function') {
      // > jstag 3.0.0
      return window.jstag.getSegments();
    } else {
      // fallback
      return ['all'];
    }
  }

  /** @module pathfora/validation/validate-widgets-object */

  /**
   * Validate that object provided to initializeWidgets
   * is either an array of widgets or a targeting object
   * targetting object containing widgets.
   *
   * @exports validateWidgetsObject
   * @params {object} widgets
   */
  function validateWidgetsObject(widgets) {
    if (widgets.target) {
      widgets.common = widgets.common || [];

      for (var i = 0; i < widgets.target.length; i++) {
        if (!widgets.target[i].segment && !widgets.target[i].rule) {
          throw new Error(
            'All targeted widgets should have segment or rule function specified'
          );
        } else if (widgets.target[i].segment && widgets.target[i].rule) {
          throw new Error(
            'Widget cannot have both segment and rule function specified'
          );
        } else if (widgets.target[i].segment === '*') {
          widgets.common = widgets.common.concat(widgets.target[i].widgets);
          widgets.target.splice(i, 1);
        }
      }
    }

    if (widgets.exclude) {
      for (var j = 0; j < widgets.exclude.length; j++) {
        if (!widgets.exclude[j].segment) {
          throw new Error('All excluded widgets should have segment specified');
        }
      }
    }
  }

  /** @module pathfora/validation/validate-account-id */

  /**
   * Validate and set the Lytics account Id
   *
   * @exports validateAccountId
   * @params {object} pf
   */
  function validateAccountId (pf) {
    var acctid;

    // in the legacy javascript tag < 2.0, there is an lio object surfaced that holds the account id.
    // in > 3.0 this lio object is only available for backwards compatibility and not the main source
    // of truth. we should be getting the cid that is passed to the config, which is an array, by default
    // we can assume the first cid in the array is the one to be used for personalization and such.
    if (typeof pf.acctid === 'undefined' || pf.acctid === '') {
      if (window.lio && window.lio.account) {
        // tag is legacy
        acctid = window.lio.account.id;
      } else if (
        // tag is current gen
        window.jstag &&
        window.jstag.config &&
        window.jstag.config.cid &&
        window.jstag.config.cid.length > 0
      ) {
        acctid = window.jstag.config.cid[0];
      } else {
        throw new Error('Could not get account id from Lytics Javascript tag.');
      }

      // make sure we have a valid acctid before setting
      if (!!acctid) {
        pf.acctid = acctid;
      } else {
        throw new Error('Lytics Javascript tag returned an empty account id.');
      }
    }
  }

  /** @module pathfora/widgets/init-targeted-widgets */

  /**
   * Initialize widgets which are targeted by segments.
   *
   * @exports initializeWidgets
   * @params {object} widgets
   * @params {object} options
   */
  function initializeTargetedWidgets(widgets, options) {
    var pf = this,
      i;

    validateWidgetsObject(widgets);

    if (widgets.common) {
      pf.initializeWidgetArray(widgets.common, options);
    }

    // NOTE Target sensitive widgets
    if (widgets.target || widgets.exclude) {
      pf.addCallback(function (fields) {
        validateAccountId(pf);
        var targetedWidgets = [],
          segments = getUserSegments();

        // handle inclusions
        if (widgets.target) {
          for (i = 0; i < widgets.target.length; i++) {
            var target = widgets.target[i];
            if (
              target.segment &&
              segments &&
              segments.indexOf(target.segment) !== -1
            ) {
              // add the widgets with proper targeting to the master list
              // ensure we dont overwrite existing widgets in target
              targetedWidgets = targetedWidgets.concat(target.widgets);
            }
            // a rule function is allowed with targeting
            if (
              target.rule &&
              typeof target.rule === 'function' &&
              fields &&
              target.rule(fields)
            ) {
              targetedWidgets = targetedWidgets.concat(target.widgets);
            }
          }
        }

        // handle exclusions
        if (widgets.exclude) {
          for (i = 0; i < widgets.exclude.length; i++) {
            var exclude = widgets.exclude[i];
            if (segments && segments.indexOf(exclude.segment) !== -1) {
              // we found a match, ensure the corresponding segment(s) are not in the
              // targetted widgets array
              for (var x = 0; x < targetedWidgets.length; x++) {
                for (var y = 0; y < exclude.widgets.length; y++) {
                  if (targetedWidgets[x] === exclude.widgets[y]) {
                    targetedWidgets.splice(x, 1);
                  }
                }
              }
            }
          }
        }

        if (targetedWidgets.length) {
          pf.initializeWidgetArray(targetedWidgets, options);
        } else if (widgets.inverse) {
          pf.initializeWidgetArray(widgets.inverse, options);
        }
      });
    }
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

  /** @module pathfora/validation/validate-options */

  /**
   * Validate and set the Lytics account Id
   *
   * @exports validateAccountId
   * @params {object} pf
   */
  function validateOptions (options) {
    if (options) {
      // validate priority
      if (options.priority) {
        switch (options.priority) {
        case OPTIONS_PRIORITY_ORDERED:
          break;
        case OPTIONS_PRIORITY_UNORDERED:
          break;
        default:
          throw new Error('Invalid priority defined in options.');
        }
      }
    }
  }

  /** @module pathfora/widgets/init-widgets */

  /**
   * Public method used to initialize widgets once
   * the individual configs have been created
   *
   * @exports initializeWidgets
   * @params {object} widgets
   * @params {object} config
   * @params {object} options
   */
  function initializeWidgets(widgets, config, options) {
    var pf = this;
    trackTimeOnPage();
    // support legacy initialize function where we passed account id as
    // a second parameter and config as third
    if (typeof config === 'string') {
      if (options) {
        config = options;
        options = null;
      } else {
        config = null;
      }
    }

    if (!widgets) {
      throw new Error('Initialize called with no widgets');
    }

    validateOptions(options);

    if (config) {
      updateObject(defaultProps, config);
    }

    if (Array.isArray(widgets)) {
      pf.initializeWidgetArray(widgets, options);
    } else {
      pf.initializeTargetedWidgets(widgets, options);
    }
  }

  /** @module pathfora/widgets/has/has-recommend */

  /**
   * Check if the widget has recommendations.
   *
   * @exports hasRecommend
   * @params {object} widget
   * @returns {bool} hasRecommend
   */
  function hasRecommend (widget) {
    return widget.recommend && Object.keys(widget.recommend).length !== 0;
  }

  /** @module pathfora/widgets/has/has-entity-templates */

  /**
   * Check if the widget has entity field templates
   *
   * @exports hasEntityTemplates
   * @params {object} widget
   * @returns {bool} hasEntityTemplates
   */
  function hasEntityTemplates (widget) {
    for (var j = 0; j < ENTITY_FIELDS.length; j++) {
      var regex = new RegExp(ENTITY_FIELD_TEMPLATE_REGEX, 'g'),
          fieldValue = getObjectValue(widget, ENTITY_FIELDS[j]);

      // convert functions to a string
      if (typeof fieldValue === 'function') {
        fieldValue = fieldValue.toString();
      }

      if (typeof fieldValue === 'string') {
        if (regex.test(fieldValue)) {
          return true;
        }
      }
    }

    return false;
  }

  /** @module pathfora/widgets/preload-lio */

  /**
   * Check if the widget needs lio to be loaded, if so
   * wait for the callback, otherwise continue execution.
   *
   * @exports preloadLio
   * @params {object} widget
   * @params {object} pf
   * @params {function} cb
   */
  function preloadLio (widget, pf, cb) {
    if (hasRecommend(widget) || hasEntityTemplates(widget)) {
      pf.addCallback(function () {
        validateAccountId(pf);
        cb();
      });
    } else {
      cb();
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

    // ensure that the callback arg is a function
    if (typeof callback !== 'function') {
      console.warn('Could not make recommendation - missing callback function.');
      return;
    }

    // if we have the recommendation response cached in session storage
    // use that instead of making a new API request
    var storedRec = sessionStorage.getItem(PREFIX_REC + id);

    if (typeof storedRec === 'string' && params.visited !== false) {
      var rec;

      try {
        rec = JSON.parse(decodeSafe(storedRec));
      } catch (e) {
        console.warn('Could not parse json stored response:' + e);
      }

      if (rec && rec.data) {
        // special case: shuffle param
        if (params.shuffle === true) {
          rec.data.shift();
        }

        if (rec.data.length > 0) {
          sessionStorage.setItem(PREFIX_REC + id, encodeURIComponent(JSON.stringify(rec.data)));
          callback(rec.data);
        }
        return;
      }
    }

    // becuase you can override the base cookiename as well as field name/value we need to account for those
    var storedCookieName = 'seerid';
    var userByFieldName = '_uids';
    var userByFieldValue;

    // check for custom cookie name in jstag config
    if (window.jstag && window.jstag.config && window.jstag.config.cookie !== '') {
      storedCookieName = window.jstag.config.cookie;
    }

    // attempt to get value from stored cookie
    userByFieldValue = readCookie(storedCookieName);

    // override everything if key/value have been explicitly set for user
    if (
      window.liosetup &&
      window.liosetup.field &&
      window.liosetup.field !== '' &&
      window.liosetup.value &&
      window.liosetup.value !== ''
    ) {
      userByFieldName = window.liosetup.field;
      userByFieldValue = window.liosetup.value;
    }

    // ensure we have required params
    if (!userByFieldName && !userByFieldValue) {
      console.warn('Could not determine BY field and value from config');
      callback([]);
    }

    var recommendParts = [
      API_URL,
      'api',
      'content',
      'recommend',
      accountId,
      'user',
      userByFieldName,
      userByFieldValue
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

    var recommendUrl = recommendParts.join('/') + queries;

    getData(recommendUrl, function (json) {
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

        // set the session storage.
        sessionStorage.setItem(PREFIX_REC + id, encodeURIComponent(JSON.stringify(resp)));

        callback(resp.data);
      } else {
        callback([]);
      }
    }, function () {
      callback([]);
    });
  }

  /** @module pathfora/widgets/recommendation/set-widget-recommendation */

  /**
   * Make the call to get the recommendations then
   * handle assigning it to the widget.
   *
   * @exports setWidgetContent
   * @params {object} accountId
   * @params {object} widget
   * @params {function} cb
   */

  function setWidgetContent (accountId, widget, cb) {
    var params = widget.recommend;

    if (params && params.collection) {
      params.contentsegment = widget.recommend.collection;
      delete params.collection;
    }

    recommendContent(accountId, params, widget.id, function (resp) {
      // if we get a response from the recommend api put it as the first
      // element in the content object this replaces any default content
      if (resp[0]) {
        var content = resp[0];
        widget.content = [
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
      if (!widget.content) {
        throw new Error('Could not get recommendation and no default defined');
      }

      cb();
    });
  }

  /** @module pathfora/validation/validate-recommendation-widget */

  /**
   * Validate that a recommendation widget
   * is using the correct type and layout
   *
   * @exports validateRecommendationWidget
   * @params {object} widget
   */
  function validateRecommendationWidget (widget) {
    // validate
    if (widget.type !== 'message') {
      throw new Error('Unsupported widget type for content recommendation');
    }

    if (
      widget.layout !== 'slideout' &&
      widget.layout !== 'modal' &&
      widget.layout !== 'inline'
    ) {
      throw new Error('Unsupported layout for content recommendation');
    }

    if (widget.content && widget.content[0] && !widget.content[0].default) {
      throw new Error('Cannot define recommended content unless it is a default');
    }
  }

  /** @module pathfora/widgets/recommendation/preload-recommendation */

  /**
   * Check if the widget needs recommendations to be loaded, if so
   * wait for the callback, otherwise continue execution.
   *
   * @exports preloadRecommendation
   * @params {object} widget
   * @params {object} pf
   * @params {function} cb
   */
  function preloadRecommendation (widget, pf, cb) {
    if (hasRecommend(widget)) {
      validateRecommendationWidget(widget);
      setWidgetContent(pf.acctid, widget, cb);
    } else {
      cb();
    }
  }

  /** @module pathfora/widgets/initialize-widget-array */

  /**
   * Given an array of widgets, begin off the initialization
   * process for each
   *
   * @exports initializeWidgetArray
   * @params {array} array
   */
  function initializeWidgetArray (array, options) {
    var pf = this;
    widgetTracker.prioritizedWidgets = [];

    var initWidget = function (widgetArray, index, initOptions) {
      if (index >= widgetArray.length) {
        return;
      }

      var widget = widgetArray[index],
          defaults = defaultProps[widget.type],
          globals = defaultProps.generic;

      updateObject(widget, globals);
      updateObject(widget, defaults);
      updateObject(widget, widget.config);

      if (widgetTracker.initializedWidgets.indexOf(widget.id) < 0) {
        widgetTracker.initializedWidgets.push(widget.id);
      } else {
        throw new Error('Cannot add two widgets with the same id');
      }

      // retain support for old "success" field
      if (widget.success) {
        if (!widget.formStates) {
          widget.formStates = {};
        }

        if (!widget.formStates.success) {
          widget.formStates.success = widget.success;
        }
      }

      preloadLio(widget, pf, function () {
        preloadRecommendation(widget, pf, function () {
          pf.initializeWidget(widget, initOptions);
          if (initOptions && initOptions.priority === OPTIONS_PRIORITY_ORDERED) {
            if (
              widgetTracker.prioritizedWidgets.length &&
              widgetTracker.prioritizedWidgets[0].id === widget.id
            ) {
              return;
            }

            initWidget(widgetArray, index + 1, initOptions);
          }
        });
      });

      if (!initOptions || initOptions.priority !== OPTIONS_PRIORITY_ORDERED) {
        initWidget(widgetArray, index + 1, initOptions);
      }
    };

    initWidget(array, 0, options);
  }

  /** @module pathfora/display-conditions/replace-entity-field */

  /**
   * Fill in the data for a entity field template in
   * a widgets text field
   *
   * @exports replaceEntityField
   * @params {object} widget
   * @params {string} fieldName
   * @params {array} found
   * @returns {boolean}
   */
  function replaceEntityField (
    widget,
    fieldName,
    found,
    customData
  ) {
    if (!found || !found.length) {
      return true;
    }

    var fnParams,
        fn,
        currentVal = getObjectValue(widget, fieldName),
        isFn = false;

    // special case if the field is a function, convert it to a string first
    if (typeof currentVal === 'function') {
      fn = currentVal.toString();
      currentVal = fn.substring(fn.indexOf('{') + 1, fn.lastIndexOf('}')); // body of the function
      fnParams = fn.match(/(function.+\()(.+(?=\)))(.+$)/); // get the function param names
      isFn = true;
    }

    // for each template found...
    for (var f = 0; f < found.length; f++) {
      // parse the field name
      var foundval = found[f].slice(2).slice(0, -2),
          parts = foundval.split('|'),
          def = '';

      // get the default (fallback) value
      if (parts.length > 1) {
        def = parts[1].trim();
      }

      // check for subfields if the value is an object
      var split = parts[0].trim().split('.');

      // get entity data from tag
      var dataval;

      // for the legacy tag < 3.0, there is a lio object surfaced. within this object lives the personalization
      // data. however, in current gen tag > 3.0 we have a getEntity() method that should be used as the source
      // of truth, the returned data model is slightly different in that it supports the full personalization
      // api vs the legacy entity api that only returns segment and user field info.
      if (window.lio && window.lio.data) {
        dataval = window.lio.data;
        // tag is legacy
      } else if (window.jstag && typeof window.jstag.getEntity === 'function') {
        // tag is current gen
        var entity = window.jstag.getEntity();
        if (entity && entity.data && entity.data.user) {
          dataval = entity.data.user;
        }
      }

      var s;
      for (s = 0; s < split.length; s++) {
        if (typeof dataval !== 'undefined') {
          dataval = dataval[split[s]];
        }
      }

      // if we couldn't find the data in question on the lytics jstag, check customData provided
      if (typeof dataval === 'undefined') {
        dataval = customData;

        for (s = 0; s < split.length; s++) {
          if (typeof dataval !== 'undefined') {
            dataval = dataval[split[s]];
          }
        }
      }

      var val;

      // replace the template with the lytics data value
      if (typeof dataval !== 'undefined') {
        val = currentVal.replace(found[f], dataval);
        // if there's no default and we should error
      } else if (
        (!def || def.length === 0) &&
        widget.displayConditions.showOnMissingFields !== true
      ) {
        return false;
        // replace with the default option, or empty string if not found
      } else {
        val = currentVal.replace(found[f], def);
      }

      setObjectValue(widget, fieldName, val);
      currentVal = val;
    }

    // if the value is a function, convert it back from a string
    if (isFn) {
      if (fnParams) {
        fn = new Function(fnParams.join(','), getObjectValue(widget, fieldName));
      } else {
        fn = new Function(getObjectValue(widget, fieldName));
      }

      setObjectValue(widget, fieldName, fn);
    }

    return true;
  }

  /** @module pathfora/display-conditions/entity-fields/entity-field-checker */

  /**
   * Evaluate all fields on the list provided and check
   * if there are any entity templates that need to be
   * replaced.
   *
   * @exports entityFieldChecker
   * @params {array} fields
   * @params {object} widget
   * @params {function} cb
   */
  function entityFieldChecker (widget, customData) {
    var found,
        valid = true;

    for (var i = 0; i < ENTITY_FIELDS.length; i++) {
      var regex = new RegExp(ENTITY_FIELD_TEMPLATE_REGEX, 'g'),
          fieldValue = getObjectValue(widget, ENTITY_FIELDS[i]);

      // convert functions to a string
      if (typeof fieldValue === 'function') {
        fieldValue = fieldValue.toString();
      }

      if (typeof fieldValue === 'string') {
        found = fieldValue.match(regex);

        if (found && found.length > 0) {
          valid =
            valid &&
            replaceEntityField(widget, ENTITY_FIELDS[i], found, customData);
        }
      }
    }

    return valid;
  }

  /** @module pathfora/display-conditions/date-checker */

  /**
   * Check if the current date fits within the
   * date displayConditions for the widget
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

  /**
   * Check if the pagevisit count meets the requirements
   *
   * @exports pageVisitsChecker
   * @returns {boolean}
   */
  function pageVisitsChecker (pageVisitsRequired) {
    return (read(PF_PAGEVIEWS) >= pageVisitsRequired);
  }

  /** @module pathfora/display-conditions/hide-after-action-checker */

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
        confirm = read(PREFIX_CONFIRM + widget.id),
        cancel = read(PREFIX_CANCEL + widget.id),
        closed = read(PREFIX_CLOSE + widget.id);

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
   * @returns {boolean}
   */
  function compareQueries (query, matchQuery, rule) {
    switch (rule) {
    case 'exact':
      if (Object.keys(matchQuery).length !== Object.keys(query).length) {
        return false;
      }
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
  function phraseChecker(phrase, url, simpleurl, queries) {
    var valid = false;

    // legacy match allows for an array of strings, check if we are legacy or current object approach
    switch (typeof phrase) {
      case 'string':
        if (
          url.indexOf(escapeURI(phrase.split('?')[0], { keepEscaped: true })) !==
          -1
        ) {
          valid = compareQueries(queries, parseQuery(phrase), 'substring');
        }
        break;

      case 'object':
        if (phrase.match && phrase.value) {
          var phraseValue = escapeURI(phrase.value, { keepEscaped: true });
          var query = parseQuery(phraseValue);

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
              if (
                Object.keys(query).length > 0 &&
                url.split('?')[0].replace(/\/$/, '') ===
                  phraseValue.split('?')[0].replace(/\/$/, '')
              ) {
                valid = compareQueries(queries, query, phrase.match);
              } else {
                valid = url.replace(/\/$/, '') === phraseValue.replace(/\/$/, '');
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
              if (
                Object.keys(query).length > 0 &&
                url.indexOf(phraseValue.split('?')[0]) !== -1
              ) {
                valid = compareQueries(queries, query, phrase.match);
              } else {
                valid = url.indexOf(phraseValue) !== -1;
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
        valid = false,
        excludeValid = false,
        matchCt = 0,
        excludeCt = 0;

    if (!(phrases instanceof Array)) {
      phrases = Object.keys(phrases).map(function (key) {
        return phrases[key];
      });
    }

    // array of urlContains params is an "OR" list, so if any are true evaluate valid to true
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

  /** @module pathfora/display-conditions/meta-checker */

  /**
   * Check if the current page contains the meta
   * tag and value provided
   *
   * @exports metaChecker
   * @params {array} phrases
   * @returns {boolean}
   */
  function metaChecker (phrases) {
    var meta = document$1.querySelectorAll('meta');

    for (var j = 0; j < phrases.length; j++) {
      var rule = phrases[j],
          phraseValid = false;

      for (var i = 0; i < meta.length; i++) {
        for (var key in rule) {
          if (rule.hasOwnProperty(key)) {
            var val = meta[i].getAttribute(key);

            if (!val || val !== rule[key]) {
              phraseValid = false;
              break;
            } else {
              phraseValid = true;
            }
          }
        }

        if (phraseValid) {
          break;
        }
      }

      if (phraseValid) {
        return true;
      }
    }

    return false;
  }

  /** @module pathfora/display-conditions/exit-intent/register-exit-intent-watcher */

  /**
   * Setup watcher for showOnExitIntent
   * display condition
   *
   * @exports registerExitIntentWatcher
   * @params {string} selector
   * @params {object} widget
   * @returns {object} watcher
   */
  function registerExitIntentWatcher () {
    var watcher = {
      positions: [],
      check: function (e) {
        if (e != null) {
          var from = e.relatedTarget || e.toElement;

          // When there is registered movement and leaving the root element
          if (watcher.positions.length > 1 && (!from || from.nodeName === 'HTML')) {

            var y = watcher.positions[watcher.positions.length - 1].y;
            var py = watcher.positions[watcher.positions.length - 2].y;
            var ySpeed = Math.abs(y - py);

            watcher.positions = [];

            // Did the cursor move up?
            // Is it reasonable to believe that it left the top of the page, given the position and the speed?
            if (y - ySpeed <= 50 && y < py) {
              return true;
            }
          }
        }
        return false;
      }
    };

    return watcher;
  }

  var handlers = [];

  var eventHub = {
    add: function (target, type, listener) {
      target.addEventListener(type, listener);
      handlers.push({
        target: target,
        type: type,
        listener: listener
      });
    },
    remove: function (target, type, listener) {
      target.removeEventListener(type, listener);
    },
    removeAll: function () {
      var hub = this;
      handlers.forEach(function (h) {
        hub.remove(h.target, h.type, h.listener);
      });
      handlers.length = 0;
    }
  };

  /** @module pathfora/display-conditions/init-exit-intent */

  /**
   * Setup exitIntent for a widget
   *
   * @exports initExitIntent
   * @params {object} widget
   * @returns {boolean}
   */
  function initializeExitIntent (widget, watcher) {
    if (!widget.exitIntentListener) {
      widget.exitIntentListener = function (e) {
        watcher.positions.push({
          x: e.clientX,
          y: e.clientY
        });
        if (watcher.positions.length > 30) {
          watcher.positions.shift();
        }
      };

      widget.exitIntentTrigger = function (e) {
        validateWatchers(widget, function () {
          if (typeof document$1.removeEventListener === 'function') {
            eventHub.remove(document$1, 'mousemove', widget.exitIntentListener);
            eventHub.remove(document$1, 'mouseout', widget.exitIntentTrigger);
          } else {
            document$1.onmousemove = null;
            document$1.onmouseout = null;
          }
        }, e);
      };

      // FUTURE Discuss https://www.npmjs.com/package/ie8 polyfill
      if (typeof document$1.addEventListener === 'function') {
        eventHub.add(document$1, 'mousemove', widget.exitIntentListener);
        eventHub.add(document$1, 'mouseout', widget.exitIntentTrigger);
      } else {
        document$1.onmousemove = widget.exitIntentListener;
        document$1.onmouseout = widget.exitIntentTrigger;
      }
    }
    return true;

  }

  /** @module pathfora/display-conditions/scroll/register-element-watcher */

  /**
   * Setup watcher for displayWhenElementVisible
   * display condition
   *
   * @exports registerElementWatcher
   * @params {string} selector
   * @params {object} widget
   * @returns {object} watcher
   */
  function registerElementWatcher (selector) {
    var watcher = {
      elem: document$1.querySelector(selector),

      check: function () {
        var scrollTop = document$1.body.scrollTop || document$1.documentElement.scrollTop,
            scrolledToBottom = window.innerHeight + scrollTop >= document$1.body.offsetHeight;

        if (watcher.elem.offsetTop - window.innerHeight / 2 <= scrollTop || scrolledToBottom) {
          return true;
        }
        return false;
      }
    };

    return watcher;
  }

  /** @module pathfora/display-conditions/scroll/init-scroll-watchers */

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
          eventHub.remove(window, 'scroll', widget.scrollListener);
        } else {
          window.onscroll = null;
        }
      });
    };

    // FUTURE Discuss https://www.npmjs.com/package/ie8 polyfill
    if (typeof window.addEventListener === 'function') {
      eventHub.add(window, 'scroll', widget.scrollListener);
    } else {
      window.onscroll = widget.scrollListener;
    }
    return true;
  }

  /**
  * Based on https://github.com/cgygd/scrolling-element
  */

  var element = null;

  /* istanbul ignore next */
  function getScrollingElement () {
    if (element) {
      return element;
    }
    if (document.body.scrollTop) {
      // speed up if scrollTop > 0
      return (element = document.body);
    }
    var iframe = document.createElement('iframe');
    iframe.style.height = '1px';
    document.documentElement.appendChild(iframe);
    var doc = iframe.contentWindow.document;
    doc.write('<!DOCTYPE html><div style="height:9999em">x</div>');
    doc.close();
    var isCompliant = doc.documentElement.scrollHeight > doc.body.scrollHeight;
    iframe.parentNode.removeChild(iframe);
    return (element = isCompliant ? document.documentElement : document.body);
  }

  /** @module pathfora/display-conditions/scroll/register-position-watcher */

  /**
   * Setup watcher for scrollPercentageToDisplay
   * display condition
   *
   * @exports registerPositionWatcher
   * @params {int} percent
   * @params {object} widget
   * @returns {object} watcher
   */
  function registerPositionWatcher(percent) {
    var watcher = {
      check: function () {
        /* istanbul ignore next */
        var scrollingElement = document$1.scrollingElement || getScrollingElement(),
          scrollTop = scrollingElement.scrollTop,
          scrollHeight = scrollingElement.scrollHeight,
          clientHeight = scrollingElement.clientHeight,
          percentageScrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;

        // if NaN, will always return `false`
        return percentageScrolled >= percent;
      },
    };

    return watcher;
  }

  /** @module pathfora/display-conditions/manual-trigger/register-manual-trigger-watcher */

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
          return true;
        }
        return false;
      }
    };

    return watcher;
  }

  /** @module pathfora/widgets/init-widget */

  /**
   * Determine if a widget should be shown based on display
   * conditions, and if so show the widget
   *
   * @exports initializeWidget
   * @params {object} widget
   * @returns {bool} shown
   */
  function initializeWidget (widget, options) {
    var watcher,
        condition = widget.displayConditions,
        pf = this;

    widget.watchers = [];
    widget.listeners = [];

    // NOTE Default cookie expiration is one year from now
    widget.expiration = new Date();
    widget.expiration.setDate(widget.expiration.getDate() + 365);

    if (
      (widget.type === 'sitegate' &&
        read(PREFIX_UNLOCK + widget.id) === 'true') ||
      widget.hiddenViaABTests === true
    ) {
      return;
    }

    if (widget.pushDown) {
      if (
        widget.layout === 'bar' &&
        (widget.position === 'top-fixed' || widget.position === 'top-absolute')
      ) {
        addClass(document$1.querySelector(widget.pushDown), 'pf-push-down');
      } else {
        throw new Error(
          'Only top positioned bar widgets may have a pushDown property'
        );
      }
    }

    // entity fields
    widget.valid = widget.valid && entityFieldChecker(widget, pf.customData);

    // display conditions based on page load
    if (condition.date) {
      widget.valid = widget.valid && dateChecker(condition.date);
    }

    if (condition.pageVisits) {
      widget.valid = widget.valid && pageVisitsChecker(condition.pageVisits);
    }

    if (condition.hideAfterAction) {
      widget.valid =
        widget.valid && hideAfterActionChecker(condition.hideAfterAction, widget);
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

    // if it's valid at this point, add it to the priority list
    if (
      widget.valid &&
      options &&
      options.priority === OPTIONS_PRIORITY_ORDERED
    ) {
      widgetTracker.prioritizedWidgets.push(widget);
    }

    // display conditions based on page interaction
    if (condition.showOnExitIntent) {
      watcher = registerExitIntentWatcher();
      widget.watchers.push(watcher);
      initializeExitIntent(widget, watcher);
    }

    if (condition.displayWhenElementVisible) {
      watcher = registerElementWatcher(
        condition.displayWhenElementVisible
      );
      widget.watchers.push(watcher);
      initializeScrollWatchers(widget);
    }

    if (condition.scrollPercentageToDisplay) {
      watcher = registerPositionWatcher(
        condition.scrollPercentageToDisplay
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
  }

  /** @module pathfora/widgets/preview-widget */

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

  /** @module pathfora/display-conditions/cancel-delayed-widget */

  /**
   * Cancel waiting for a delayed widget
   *
   * @exports cancelDelayedWidget
   * @params {string} widgetKey id of the widget
   */
  function cancelDelayedWidget (widgetKey) {
    var delayObj = widgetTracker.delayedWidgets[widgetKey];

    if (delayObj) {
      clearTimeout(delayObj);
      delete widgetTracker.delayedWidgets[widgetKey];
    }
  }

  /** @module pathfora/widgets/clear-all */

  /**
   * Close all widgets and reset all settings to default
   *
   * @exports clearAll
   */
  function clearAll () {
    var opened = widgetTracker.openedWidgets,
        delayed = widgetTracker.delayedWidgets;

    opened.forEach(function (widget) {
      var element = document$1.getElementById(widget.id);
      removeClass(element, 'opened');
      element.parentNode.removeChild(element);

      for (var key in widget.listeners) {
        if (widget.listeners.hasOwnProperty(key)) {
          var val = widget.listeners[key];
          val.target.removeEventListener(val.type, val.fn);
        }
      }
    });

    for (var key in delayed) {
      if (delayed.hasOwnProperty(key)) {
        cancelDelayedWidget(key);
      }
    }

    eventHub.removeAll();

    resetWidgetTracker(widgetTracker);
    resetDataObject(pathforaDataObject);
    resetDefaultProps(defaultProps);
    this.callbacks = [];
    this.acctid = '';
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
    var widget = {
      valid: true,
      type: type
    };

    if (!config) {
      throw new Error('Config object is missing');
    }

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

  /**
   * Initialized A/B test from user config
   *
   * @exports initializeABTesting
   * @params {object} abTests
   */
  function initializeABTesting (abTests) {
    abTests.forEach(function (abTest) {
      var abTestingType = abTest.type,
          userAbTestingValue = read(abTest.cookieId),
          userAbTestingGroup = 0,
          date = new Date();

      if (!userAbTestingValue) {
        userAbTestingValue = Math.random();
      }

      // NOTE Always update the cookie to get the new exp date.
      date.setDate(date.getDate() + 365);
      write(abTest.cookieId, userAbTestingValue, date);

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
        elements = document$1.querySelectorAll('[' + attr + ']');

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
              block = theElement.getAttribute('data-pfblock'),
              shuffle = false;

          if (!block) {
            block = 'default';
          }

          if (!recommend) {
            recommend = 'default';
          }

          if (!dataElements[recommend]) {
            dataElements[recommend] = {
              blocks: []
            };
          }

          if (theElement.hasAttribute('data-pfshuffle')) {
            shuffle = theElement.getAttribute('data-pfshuffle') === 'true';
          }

          if (!dataElements[recommend].shuffle) {
            dataElements[recommend].shuffle = shuffle;
          }

          dataElements[recommend].blocks.push({
            elem: theElement,
            displayType: theElement.style.display,
            block: block,
            recommend: recommend,
            shuffle: shuffle,
            title: theElement.querySelector('[data-pftype="title"]'),
            image: theElement.querySelector('[data-pftype="image"]'),
            description: theElement.querySelector('[data-pftype="description"]'),
            url: theElement.querySelector('[data-pftype="url"]'),
            published: theElement.querySelector('[data-pftype="published"]'),
            author: theElement.querySelector('[data-pftype="author"]')
          });
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

            inline.procRecommendElements(elements[key], key, elements[key].shuffle, function () {
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
  function procRecommendElements (val, rec, shuffle, cb) {
    var inline = this;

    if (rec !== 'default') {
      // call the recommendation API using the url pattern urlPattern as a filter
      var params = {
        contentsegment: rec
      };

      if (shuffle) {
        params.shuffle = shuffle;
      }

      recommendContent(inline.parent.acctid, params, rec, function (resp) {
        val.blocks.forEach(function (elems, idx) {

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
            inline.preppedElements[elems.block] = elems;
          } else {
            return;
          }
        });
        cb();
      });
    } else {
      val.blocks.forEach(function (block) {
        inline.defaultElements[block.block] = block;
      });
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
        style = document$1.createElement('style');

    style.type = 'text/css';

    if (style.styleSheet) { // handle ie
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document$1.createTextNode(css));
    }

    document$1.getElementsByTagName('head')[0].appendChild(style);
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
        validateAccountId(pf);
        pf.inline.procElements();
      });
    });
  }

  /** @module pathfora */

  /**
   * Creates a new Pathfora instance
   *
   * @exports Pathfora
   * @class {function} Pathfora
   */
  var Pathfora = function () {
    // feature detections
    if (!('localStorage' in window) || !('sessionStorage' in window)) {
      throw new Error('The Pathfora SDK requires the Web Storage API!');
    }

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
    this.rules = helperRules;

    // callbacks
    this.addCallback = addCallback;

    // display conditions
    this.initializePageViews = initializePageViews;
    this.triggerWidgets = triggerWidgets;

    // widgets
    this.initializeTargetedWidgets = initializeTargetedWidgets;
    this.initializeWidgets = initializeWidgets;
    this.initializeWidgetArray = initializeWidgetArray;
    this.initializeWidget = initializeWidget;
    this.previewWidget = previewWidget;
    this.showWidget = showWidget;
    this.closeWidget = closeWidget;
    this.clearAll = clearAll;
    this.Message = Message;
    this.Subscription = Subscription;
    this.Form = Form;
    this.SiteGate = SiteGate;

    // recommendations
    this.recommendContent = recommendContent;

    // ab tests
    this.initializeABTesting = initializeABTesting;
    this.ABTest = ABTest;

    // inline
    this.initializeInline = initializeInline;
    this.inline = new Inline(this);
    this.initializeInline();
    this.initializePageViews();

    // add pathfora css
    var head = document$1.getElementsByTagName('head')[0],
      link = document$1.createElement('link');

    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', window.PathforaCSS || CSS_URL);

    this.utils.updateLegacyCookies();
    this.utils.store.removeExpiredItems();

    head.appendChild(link);
  };

  window.pathfora = window.pathfora || new Pathfora();

}());
