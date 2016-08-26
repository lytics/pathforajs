/* global jstag, ga */
/**
 * @module Pathfora-API
 */
(function(context, document) {
  'use strict';
  // NOTE Output & processing variables
  var Pathfora, utils, core, api, Inline;

  // NOTE Default configuration object (originalConf is used when default data gets overriden)
  var originalConf;

  var defaultPositions = {
    modal: '',
    slideout: 'bottom-left',
    button: 'top-left',
    bar: 'top-absolute',
    folding: 'bottom-left'
  };

  var defaultProps = {
    generic: {
      className: 'pathfora',
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
        showDelay: 0,
        hideAfter: 0,
        displayWhenElementVisible: '',
        scrollPercentageToDisplay: 0
      }
    },
    message: {
      layout: 'modal',
      position: '',
      variant: '1',
      okMessage: 'Confirm',
      cancelMessage: 'Cancel',
      okShow: true,
      cancelShow: true,
      responsive: true,
      branding: true
    },
    subscription: {
      layout: 'modal',
      position: '',
      variant: '1',
      placeholders: {
        email: 'Email'
      },
      okMessage: 'Confirm',
      cancelMessage: 'Cancel',
      okShow: true,
      cancelShow: true,
      responsive: true,
      branding: true
    },
    form: {
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
        country: 'Country'
      },
      required: {
        name: true,
        email: true
      },
      fields: {
        company: false,
        phone: false,
        country: false
      },
      okMessage: 'Send',
      okShow: true,
      cancelMessage: 'Cancel',
      cancelShow: true,
      showSocialLogin: false,
      responsive: true,
      branding: true
    },
    sitegate: {
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
        country: 'Country'
      },
      required: {
        name: true,
        email: true
      },
      fields: {
        message: false,
        phone: false,
        country: false
      },
      okMessage: 'Submit',
      okShow: true,
      showSocialLogin: false,
      showForm: true,
      responsive: true,
      branding: true
    }
  };

  // NOTE HTML templates
  // FUTURE Move to separate files and concat
  /* eslint-disable indent */
  var templates = {
  'subscription': {
    'bar': '<div class=\'pf-widget-body\'></div><a class=\'pf-widget-close\'>&times;</a><div class=\'pf-bar-content\'><p class=\'pf-widget-message\'></p><form><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>X</button> <span><input name=\'email\' type=\'email\' placeholder=\'Email\' required></span></form></div>',
    'folding': '<a class=\'pf-widget-caption\'><p class=\'pf-widget-headline\'></p><span>&rsaquo;</span> </a><a class=\'pf-widget-caption-left\'><p class=\'pf-widget-headline\'></p><span>&rsaquo;</span></a><div class=\'pf-widget-body\'></div><div class=\'pf-widget-content\'><p class=\'pf-widget-message\'></p><form><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>X</button> <span><input name=\'email\' type=\'email\' required></span></form></div>',
    'inline': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><a class=\'pf-widget-close\'>&times;</a><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><form><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>X</button> <span><input name=\'email\' type=\'email\' required></span></form></div></div></div></div></div>',
    'modal': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><a class=\'pf-widget-close\'>&times;</a><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><form><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>X</button> <span><input name=\'email\' type=\'email\' required></span></form></div></div></div></div></div>',
    'slideout': '<a class=\'pf-widget-close\'>&times;</a><div class=\'pf-widget-body\'></div><div class=\'pf-widget-content\'><h2 class=\'pf-widget-headline\'></h2><p class=\'pf-widget-message\'></p><form><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>X</button> <span><input name=\'email\' type=\'email\' required></span></form></div>'
  },
  'social': {
    'facebookBtn': '<div class=\'social-login-btn facebook-login-btn\'>{{facebook-icon}} <span>Log In</span></div>',
    'googleBtn': '<div class=\'social-login-btn google-login-btn\'>{{google-icon}} <span>Sign In</span></div>',
    'googleMeta': '<meta name=\'google-signin-client_id\' content=\'{{google-clientId}}\'>'
  },
  'sitegate': {
    'inline': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><div class=\'pf-sitegate-social-plugins pf-social-login\'><p name=\'fb-login\' hidden></p><p name=\'google-login\' hidden></p></div><form><input name=\'username\' type=\'text\'> <input name=\'email\' type=\'email\'> <input class=\'pf-field-half-width\' name=\'company\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'title\' type=\'text\'> <input name=\'phone\' type=\'text\'> <select name=\'country\'><option value=\'\'>Country</option><option value=\'AF\'>Afghanistan</option><option value=\'AL\'>Albania</option><option value=\'DZ\'>Algeria</option><option value=\'AS\'>American Samoa</option><option value=\'AD\'>Andorra</option><option value=\'AG\'>Angola</option><option value=\'AI\'>Anguilla</option><option value=\'AG\'>Antigua &amp; Barbuda</option><option value=\'AR\'>Argentina</option><option value=\'AA\'>Armenia</option><option value=\'AW\'>Aruba</option><option value=\'AU\'>Australia</option><option value=\'AT\'>Austria</option><option value=\'AZ\'>Azerbaijan</option><option value=\'BS\'>Bahamas</option><option value=\'BH\'>Bahrain</option><option value=\'BD\'>Bangladesh</option><option value=\'BB\'>Barbados</option><option value=\'BY\'>Belarus</option><option value=\'BE\'>Belgium</option><option value=\'BZ\'>Belize</option><option value=\'BJ\'>Benin</option><option value=\'BM\'>Bermuda</option><option value=\'BT\'>Bhutan</option><option value=\'BO\'>Bolivia</option><option value=\'BL\'>Bonaire</option><option value=\'BA\'>Bosnia &amp; Herzegovina</option><option value=\'BW\'>Botswana</option><option value=\'BR\'>Brazil</option><option value=\'BC\'>British Indian Ocean Ter</option><option value=\'BN\'>Brunei</option><option value=\'BG\'>Bulgaria</option><option value=\'BF\'>Burkina Faso</option><option value=\'BI\'>Burundi</option><option value=\'KH\'>Cambodia</option><option value=\'CM\'>Cameroon</option><option value=\'CA\'>Canada</option><option value=\'IC\'>Canary Islands</option><option value=\'CV\'>Cape Verde</option><option value=\'KY\'>Cayman Islands</option><option value=\'CF\'>Central African Republic</option><option value=\'TD\'>Chad</option><option value=\'CD\'>Channel Islands</option><option value=\'CL\'>Chile</option><option value=\'CN\'>China</option><option value=\'CI\'>Christmas Island</option><option value=\'CS\'>Cocos Island</option><option value=\'CO\'>Colombia</option><option value=\'CC\'>Comoros</option><option value=\'CG\'>Congo</option><option value=\'CK\'>Cook Islands</option><option value=\'CR\'>Costa Rica</option><option value=\'CT\'>Cote D&#39;Ivoire</option><option value=\'HR\'>Croatia</option><option value=\'CU\'>Cuba</option><option value=\'CB\'>Curacao</option><option value=\'CY\'>Cyprus</option><option value=\'CZ\'>Czech Republic</option><option value=\'DK\'>Denmark</option><option value=\'DJ\'>Djibouti</option><option value=\'DM\'>Dominica</option><option value=\'DO\'>Dominican Republic</option><option value=\'TM\'>East Timor</option><option value=\'EC\'>Ecuador</option><option value=\'EG\'>Egypt</option><option value=\'SV\'>El Salvador</option><option value=\'GQ\'>Equatorial Guinea</option><option value=\'ER\'>Eritrea</option><option value=\'EE\'>Estonia</option><option value=\'ET\'>Ethiopia</option><option value=\'FA\'>Falkland Islands</option><option value=\'FO\'>Faroe Islands</option><option value=\'FJ\'>Fiji</option><option value=\'FI\'>Finland</option><option value=\'FR\'>France</option><option value=\'GF\'>French Guiana</option><option value=\'PF\'>French Polynesia</option><option value=\'FS\'>French Southern Ter</option><option value=\'GA\'>Gabon</option><option value=\'GM\'>Gambia</option><option value=\'GE\'>Georgia</option><option value=\'DE\'>Germany</option><option value=\'GH\'>Ghana</option><option value=\'GI\'>Gibraltar</option><option value=\'GB\'>Great Britain</option><option value=\'GR\'>Greece</option><option value=\'GL\'>Greenland</option><option value=\'GD\'>Grenada</option><option value=\'GP\'>Guadeloupe</option><option value=\'GU\'>Guam</option><option value=\'GT\'>Guatemala</option><option value=\'GN\'>Guinea</option><option value=\'GY\'>Guyana</option><option value=\'HT\'>Haiti</option><option value=\'HW\'>Hawaii</option><option value=\'HN\'>Honduras</option><option value=\'HK\'>Hong Kong</option><option value=\'HU\'>Hungary</option><option value=\'IS\'>Iceland</option><option value=\'IN\'>India</option><option value=\'ID\'>Indonesia</option><option value=\'IA\'>Iran</option><option value=\'IQ\'>Iraq</option><option value=\'IR\'>Ireland</option><option value=\'IM\'>Isle of Man</option><option value=\'IL\'>Israel</option><option value=\'IT\'>Italy</option><option value=\'JM\'>Jamaica</option><option value=\'JP\'>Japan</option><option value=\'JO\'>Jordan</option><option value=\'KZ\'>Kazakhstan</option><option value=\'KE\'>Kenya</option><option value=\'KI\'>Kiribati</option><option value=\'NK\'>Korea North</option><option value=\'KS\'>Korea South</option><option value=\'KW\'>Kuwait</option><option value=\'KG\'>Kyrgyzstan</option><option value=\'LA\'>Laos</option><option value=\'LV\'>Latvia</option><option value=\'LB\'>Lebanon</option><option value=\'LS\'>Lesotho</option><option value=\'LR\'>Liberia</option><option value=\'LY\'>Libya</option><option value=\'LI\'>Liechtenstein</option><option value=\'LT\'>Lithuania</option><option value=\'LU\'>Luxembourg</option><option value=\'MO\'>Macau</option><option value=\'MK\'>Macedonia</option><option value=\'MG\'>Madagascar</option><option value=\'MY\'>Malaysia</option><option value=\'MW\'>Malawi</option><option value=\'MV\'>Maldives</option><option value=\'ML\'>Mali</option><option value=\'MT\'>Malta</option><option value=\'MH\'>Marshall Islands</option><option value=\'MQ\'>Martinique</option><option value=\'MR\'>Mauritania</option><option value=\'MU\'>Mauritius</option><option value=\'ME\'>Mayotte</option><option value=\'MX\'>Mexico</option><option value=\'MI\'>Midway Islands</option><option value=\'MD\'>Moldova</option><option value=\'MC\'>Monaco</option><option value=\'MN\'>Mongolia</option><option value=\'MS\'>Montserrat</option><option value=\'MA\'>Morocco</option><option value=\'MZ\'>Mozambique</option><option value=\'MM\'>Myanmar</option><option value=\'NA\'>Nambia</option><option value=\'NU\'>Nauru</option><option value=\'NP\'>Nepal</option><option value=\'AN\'>Netherland Antilles</option><option value=\'NL\'>Netherlands (Holland, Europe)</option><option value=\'NV\'>Nevis</option><option value=\'NC\'>New Caledonia</option><option value=\'NZ\'>New Zealand</option><option value=\'NI\'>Nicaragua</option><option value=\'NE\'>Niger</option><option value=\'NG\'>Nigeria</option><option value=\'NW\'>Niue</option><option value=\'NF\'>Norfolk Island</option><option value=\'NO\'>Norway</option><option value=\'OM\'>Oman</option><option value=\'PK\'>Pakistan</option><option value=\'PW\'>Palau Island</option><option value=\'PS\'>Palestine</option><option value=\'PA\'>Panama</option><option value=\'PG\'>Papua New Guinea</option><option value=\'PY\'>Paraguay</option><option value=\'PE\'>Peru</option><option value=\'PH\'>Philippines</option><option value=\'PO\'>Pitcairn Island</option><option value=\'PL\'>Poland</option><option value=\'PT\'>Portugal</option><option value=\'PR\'>Puerto Rico</option><option value=\'QA\'>Qatar</option><option value=\'ME\'>Republic of Montenegro</option><option value=\'RS\'>Republic of Serbia</option><option value=\'RE\'>Reunion</option><option value=\'RO\'>Romania</option><option value=\'RU\'>Russia</option><option value=\'RW\'>Rwanda</option><option value=\'NT\'>St Barthelemy</option><option value=\'EU\'>St Eustatius</option><option value=\'HE\'>St Helena</option><option value=\'KN\'>St Kitts-Nevis</option><option value=\'LC\'>St Lucia</option><option value=\'MB\'>St Maarten</option><option value=\'PM\'>St Pierre &amp; Miquelon</option><option value=\'VC\'>St Vincent &amp; Grenadines</option><option value=\'SP\'>Saipan</option><option value=\'SO\'>Samoa</option><option value=\'AS\'>Samoa American</option><option value=\'SM\'>San Marino</option><option value=\'ST\'>Sao Tome &amp; Principe</option><option value=\'SA\'>Saudi Arabia</option><option value=\'SN\'>Senegal</option><option value=\'RS\'>Serbia</option><option value=\'SC\'>Seychelles</option><option value=\'SL\'>Sierra Leone</option><option value=\'SG\'>Singapore</option><option value=\'SK\'>Slovakia</option><option value=\'SI\'>Slovenia</option><option value=\'SB\'>Solomon Islands</option><option value=\'OI\'>Somalia</option><option value=\'ZA\'>South Africa</option><option value=\'ES\'>Spain</option><option value=\'LK\'>Sri Lanka</option><option value=\'SD\'>Sudan</option><option value=\'SR\'>Suriname</option><option value=\'SZ\'>Swaziland</option><option value=\'SE\'>Sweden</option><option value=\'CH\'>Switzerland</option><option value=\'SY\'>Syria</option><option value=\'TA\'>Tahiti</option><option value=\'TW\'>Taiwan</option><option value=\'TJ\'>Tajikistan</option><option value=\'TZ\'>Tanzania</option><option value=\'TH\'>Thailand</option><option value=\'TG\'>Togo</option><option value=\'TK\'>Tokelau</option><option value=\'TO\'>Tonga</option><option value=\'TT\'>Trinidad &amp; Tobago</option><option value=\'TN\'>Tunisia</option><option value=\'TR\'>Turkey</option><option value=\'TU\'>Turkmenistan</option><option value=\'TC\'>Turks &amp; Caicos Is</option><option value=\'TV\'>Tuvalu</option><option value=\'UG\'>Uganda</option><option value=\'UA\'>Ukraine</option><option value=\'AE\'>United Arab Emirates</option><option value=\'GB\'>United Kingdom</option><option value=\'US\'>United States of America</option><option value=\'UY\'>Uruguay</option><option value=\'UZ\'>Uzbekistan</option><option value=\'VU\'>Vanuatu</option><option value=\'VS\'>Vatican City State</option><option value=\'VE\'>Venezuela</option><option value=\'VN\'>Vietnam</option><option value=\'VB\'>Virgin Islands (Brit)</option><option value=\'VA\'>Virgin Islands (USA)</option><option value=\'WK\'>Wake Island</option><option value=\'WF\'>Wallis &amp; Futana Is</option><option value=\'YE\'>Yemen</option><option value=\'ZR\'>Zaire</option><option value=\'ZM\'>Zambia</option><option value=\'ZW\'>Zimbabwe</option></select><textarea name=\'message\' rows=\'5\'></textarea><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Submit</button></form></div></div></div></div></div>',
    'modal': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><div class=\'pf-sitegate-social-plugins pf-social-login\'><p name=\'fb-login\' hidden></p><p name=\'google-login\' hidden></p></div><form><input name=\'username\' type=\'text\'> <input name=\'email\' type=\'email\'> <input class=\'pf-field-half-width\' name=\'title\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'company\' type=\'text\'> <input name=\'phone\' type=\'text\'> <select name=\'country\'><option value=\'\'>Country</option><option value=\'AF\'>Afghanistan</option><option value=\'AL\'>Albania</option><option value=\'DZ\'>Algeria</option><option value=\'AS\'>American Samoa</option><option value=\'AD\'>Andorra</option><option value=\'AG\'>Angola</option><option value=\'AI\'>Anguilla</option><option value=\'AG\'>Antigua &amp; Barbuda</option><option value=\'AR\'>Argentina</option><option value=\'AA\'>Armenia</option><option value=\'AW\'>Aruba</option><option value=\'AU\'>Australia</option><option value=\'AT\'>Austria</option><option value=\'AZ\'>Azerbaijan</option><option value=\'BS\'>Bahamas</option><option value=\'BH\'>Bahrain</option><option value=\'BD\'>Bangladesh</option><option value=\'BB\'>Barbados</option><option value=\'BY\'>Belarus</option><option value=\'BE\'>Belgium</option><option value=\'BZ\'>Belize</option><option value=\'BJ\'>Benin</option><option value=\'BM\'>Bermuda</option><option value=\'BT\'>Bhutan</option><option value=\'BO\'>Bolivia</option><option value=\'BL\'>Bonaire</option><option value=\'BA\'>Bosnia &amp; Herzegovina</option><option value=\'BW\'>Botswana</option><option value=\'BR\'>Brazil</option><option value=\'BC\'>British Indian Ocean Ter</option><option value=\'BN\'>Brunei</option><option value=\'BG\'>Bulgaria</option><option value=\'BF\'>Burkina Faso</option><option value=\'BI\'>Burundi</option><option value=\'KH\'>Cambodia</option><option value=\'CM\'>Cameroon</option><option value=\'CA\'>Canada</option><option value=\'IC\'>Canary Islands</option><option value=\'CV\'>Cape Verde</option><option value=\'KY\'>Cayman Islands</option><option value=\'CF\'>Central African Republic</option><option value=\'TD\'>Chad</option><option value=\'CD\'>Channel Islands</option><option value=\'CL\'>Chile</option><option value=\'CN\'>China</option><option value=\'CI\'>Christmas Island</option><option value=\'CS\'>Cocos Island</option><option value=\'CO\'>Colombia</option><option value=\'CC\'>Comoros</option><option value=\'CG\'>Congo</option><option value=\'CK\'>Cook Islands</option><option value=\'CR\'>Costa Rica</option><option value=\'CT\'>Cote D&#39;Ivoire</option><option value=\'HR\'>Croatia</option><option value=\'CU\'>Cuba</option><option value=\'CB\'>Curacao</option><option value=\'CY\'>Cyprus</option><option value=\'CZ\'>Czech Republic</option><option value=\'DK\'>Denmark</option><option value=\'DJ\'>Djibouti</option><option value=\'DM\'>Dominica</option><option value=\'DO\'>Dominican Republic</option><option value=\'TM\'>East Timor</option><option value=\'EC\'>Ecuador</option><option value=\'EG\'>Egypt</option><option value=\'SV\'>El Salvador</option><option value=\'GQ\'>Equatorial Guinea</option><option value=\'ER\'>Eritrea</option><option value=\'EE\'>Estonia</option><option value=\'ET\'>Ethiopia</option><option value=\'FA\'>Falkland Islands</option><option value=\'FO\'>Faroe Islands</option><option value=\'FJ\'>Fiji</option><option value=\'FI\'>Finland</option><option value=\'FR\'>France</option><option value=\'GF\'>French Guiana</option><option value=\'PF\'>French Polynesia</option><option value=\'FS\'>French Southern Ter</option><option value=\'GA\'>Gabon</option><option value=\'GM\'>Gambia</option><option value=\'GE\'>Georgia</option><option value=\'DE\'>Germany</option><option value=\'GH\'>Ghana</option><option value=\'GI\'>Gibraltar</option><option value=\'GB\'>Great Britain</option><option value=\'GR\'>Greece</option><option value=\'GL\'>Greenland</option><option value=\'GD\'>Grenada</option><option value=\'GP\'>Guadeloupe</option><option value=\'GU\'>Guam</option><option value=\'GT\'>Guatemala</option><option value=\'GN\'>Guinea</option><option value=\'GY\'>Guyana</option><option value=\'HT\'>Haiti</option><option value=\'HW\'>Hawaii</option><option value=\'HN\'>Honduras</option><option value=\'HK\'>Hong Kong</option><option value=\'HU\'>Hungary</option><option value=\'IS\'>Iceland</option><option value=\'IN\'>India</option><option value=\'ID\'>Indonesia</option><option value=\'IA\'>Iran</option><option value=\'IQ\'>Iraq</option><option value=\'IR\'>Ireland</option><option value=\'IM\'>Isle of Man</option><option value=\'IL\'>Israel</option><option value=\'IT\'>Italy</option><option value=\'JM\'>Jamaica</option><option value=\'JP\'>Japan</option><option value=\'JO\'>Jordan</option><option value=\'KZ\'>Kazakhstan</option><option value=\'KE\'>Kenya</option><option value=\'KI\'>Kiribati</option><option value=\'NK\'>Korea North</option><option value=\'KS\'>Korea South</option><option value=\'KW\'>Kuwait</option><option value=\'KG\'>Kyrgyzstan</option><option value=\'LA\'>Laos</option><option value=\'LV\'>Latvia</option><option value=\'LB\'>Lebanon</option><option value=\'LS\'>Lesotho</option><option value=\'LR\'>Liberia</option><option value=\'LY\'>Libya</option><option value=\'LI\'>Liechtenstein</option><option value=\'LT\'>Lithuania</option><option value=\'LU\'>Luxembourg</option><option value=\'MO\'>Macau</option><option value=\'MK\'>Macedonia</option><option value=\'MG\'>Madagascar</option><option value=\'MY\'>Malaysia</option><option value=\'MW\'>Malawi</option><option value=\'MV\'>Maldives</option><option value=\'ML\'>Mali</option><option value=\'MT\'>Malta</option><option value=\'MH\'>Marshall Islands</option><option value=\'MQ\'>Martinique</option><option value=\'MR\'>Mauritania</option><option value=\'MU\'>Mauritius</option><option value=\'ME\'>Mayotte</option><option value=\'MX\'>Mexico</option><option value=\'MI\'>Midway Islands</option><option value=\'MD\'>Moldova</option><option value=\'MC\'>Monaco</option><option value=\'MN\'>Mongolia</option><option value=\'MS\'>Montserrat</option><option value=\'MA\'>Morocco</option><option value=\'MZ\'>Mozambique</option><option value=\'MM\'>Myanmar</option><option value=\'NA\'>Nambia</option><option value=\'NU\'>Nauru</option><option value=\'NP\'>Nepal</option><option value=\'AN\'>Netherland Antilles</option><option value=\'NL\'>Netherlands (Holland, Europe)</option><option value=\'NV\'>Nevis</option><option value=\'NC\'>New Caledonia</option><option value=\'NZ\'>New Zealand</option><option value=\'NI\'>Nicaragua</option><option value=\'NE\'>Niger</option><option value=\'NG\'>Nigeria</option><option value=\'NW\'>Niue</option><option value=\'NF\'>Norfolk Island</option><option value=\'NO\'>Norway</option><option value=\'OM\'>Oman</option><option value=\'PK\'>Pakistan</option><option value=\'PW\'>Palau Island</option><option value=\'PS\'>Palestine</option><option value=\'PA\'>Panama</option><option value=\'PG\'>Papua New Guinea</option><option value=\'PY\'>Paraguay</option><option value=\'PE\'>Peru</option><option value=\'PH\'>Philippines</option><option value=\'PO\'>Pitcairn Island</option><option value=\'PL\'>Poland</option><option value=\'PT\'>Portugal</option><option value=\'PR\'>Puerto Rico</option><option value=\'QA\'>Qatar</option><option value=\'ME\'>Republic of Montenegro</option><option value=\'RS\'>Republic of Serbia</option><option value=\'RE\'>Reunion</option><option value=\'RO\'>Romania</option><option value=\'RU\'>Russia</option><option value=\'RW\'>Rwanda</option><option value=\'NT\'>St Barthelemy</option><option value=\'EU\'>St Eustatius</option><option value=\'HE\'>St Helena</option><option value=\'KN\'>St Kitts-Nevis</option><option value=\'LC\'>St Lucia</option><option value=\'MB\'>St Maarten</option><option value=\'PM\'>St Pierre &amp; Miquelon</option><option value=\'VC\'>St Vincent &amp; Grenadines</option><option value=\'SP\'>Saipan</option><option value=\'SO\'>Samoa</option><option value=\'AS\'>Samoa American</option><option value=\'SM\'>San Marino</option><option value=\'ST\'>Sao Tome &amp; Principe</option><option value=\'SA\'>Saudi Arabia</option><option value=\'SN\'>Senegal</option><option value=\'RS\'>Serbia</option><option value=\'SC\'>Seychelles</option><option value=\'SL\'>Sierra Leone</option><option value=\'SG\'>Singapore</option><option value=\'SK\'>Slovakia</option><option value=\'SI\'>Slovenia</option><option value=\'SB\'>Solomon Islands</option><option value=\'OI\'>Somalia</option><option value=\'ZA\'>South Africa</option><option value=\'ES\'>Spain</option><option value=\'LK\'>Sri Lanka</option><option value=\'SD\'>Sudan</option><option value=\'SR\'>Suriname</option><option value=\'SZ\'>Swaziland</option><option value=\'SE\'>Sweden</option><option value=\'CH\'>Switzerland</option><option value=\'SY\'>Syria</option><option value=\'TA\'>Tahiti</option><option value=\'TW\'>Taiwan</option><option value=\'TJ\'>Tajikistan</option><option value=\'TZ\'>Tanzania</option><option value=\'TH\'>Thailand</option><option value=\'TG\'>Togo</option><option value=\'TK\'>Tokelau</option><option value=\'TO\'>Tonga</option><option value=\'TT\'>Trinidad &amp; Tobago</option><option value=\'TN\'>Tunisia</option><option value=\'TR\'>Turkey</option><option value=\'TU\'>Turkmenistan</option><option value=\'TC\'>Turks &amp; Caicos Is</option><option value=\'TV\'>Tuvalu</option><option value=\'UG\'>Uganda</option><option value=\'UA\'>Ukraine</option><option value=\'AE\'>United Arab Emirates</option><option value=\'GB\'>United Kingdom</option><option value=\'US\'>United States of America</option><option value=\'UY\'>Uruguay</option><option value=\'UZ\'>Uzbekistan</option><option value=\'VU\'>Vanuatu</option><option value=\'VS\'>Vatican City State</option><option value=\'VE\'>Venezuela</option><option value=\'VN\'>Vietnam</option><option value=\'VB\'>Virgin Islands (Brit)</option><option value=\'VA\'>Virgin Islands (USA)</option><option value=\'WK\'>Wake Island</option><option value=\'WF\'>Wallis &amp; Futana Is</option><option value=\'YE\'>Yemen</option><option value=\'ZR\'>Zaire</option><option value=\'ZM\'>Zambia</option><option value=\'ZW\'>Zimbabwe</option></select><textarea name=\'message\' rows=\'5\'></textarea><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Submit</button></form></div></div></div></div></div>'
  },
  'message': {
    'bar': '<a class=\'pf-widget-body\'></a> <a class=\'pf-widget-close\'>&times;</a><div class=\'pf-bar-content\'><p class=\'pf-widget-message\'></p><span><a class=\'pf-widget-btn pf-widget-ok\'>Confirm</a> <a class=\'pf-widget-btn pf-widget-cancel\'>Cancel</a></span></div>',
    'button': '<p class=\'pf-widget-message pf-widget-ok\'></p>',
    'inline': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><a class=\'pf-widget-close\'>&times;</a><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><a class=\'pf-widget-btn pf-widget-ok\'>Confirm</a> <a class=\'pf-widget-btn pf-widget-cancel\'>Cancel</a></div></div></div></div></div>',
    'modal': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><a class=\'pf-widget-close\'>&times;</a><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><a class=\'pf-content-unit\'></a> <a class=\'pf-widget-btn pf-widget-ok\'>Confirm</a> <a class=\'pf-widget-btn pf-widget-cancel\'>Cancel</a></div></div></div></div></div>',
    'slideout': '<a class=\'pf-widget-close\'>&times;</a><div class=\'pf-widget-body\'></div><div class=\'pf-widget-content\'><h2 class=\'pf-widget-headline\'></h2><p class=\'pf-widget-message\'></p><a class=\'pf-content-unit\'></a> <a class=\'pf-widget-btn pf-widget-ok\'>Confirm</a> <a class=\'pf-widget-btn pf-widget-cancel\'>Cancel</a></div>'
  },
  'includes': {},
  'form': {
    'folding': '<a class=\'pf-widget-caption\'><p class=\'pf-widget-headline\'></p><span>&rsaquo;</span> </a><a class=\'pf-widget-caption-left\'><p class=\'pf-widget-headline\'></p><span>&rsaquo;</span></a><div class=\'pf-widget-body\'></div><div class=\'pf-widget-content\'><p class=\'pf-widget-message\'></p><div class=\'pf-social-login\'><p name=\'fb-login\' hidden></p><p name=\'google-login\' hidden></p></div><form><input name=\'username\' type=\'text\'> <input name=\'email\' type=\'email\'> <input class=\'pf-field-half-width\' name=\'title\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'company\' type=\'text\'> <select name=\'country\'><option value=\'\'>Country</option><option value=\'AF\'>Afghanistan</option><option value=\'AL\'>Albania</option><option value=\'DZ\'>Algeria</option><option value=\'AS\'>American Samoa</option><option value=\'AD\'>Andorra</option><option value=\'AG\'>Angola</option><option value=\'AI\'>Anguilla</option><option value=\'AG\'>Antigua &amp; Barbuda</option><option value=\'AR\'>Argentina</option><option value=\'AA\'>Armenia</option><option value=\'AW\'>Aruba</option><option value=\'AU\'>Australia</option><option value=\'AT\'>Austria</option><option value=\'AZ\'>Azerbaijan</option><option value=\'BS\'>Bahamas</option><option value=\'BH\'>Bahrain</option><option value=\'BD\'>Bangladesh</option><option value=\'BB\'>Barbados</option><option value=\'BY\'>Belarus</option><option value=\'BE\'>Belgium</option><option value=\'BZ\'>Belize</option><option value=\'BJ\'>Benin</option><option value=\'BM\'>Bermuda</option><option value=\'BT\'>Bhutan</option><option value=\'BO\'>Bolivia</option><option value=\'BL\'>Bonaire</option><option value=\'BA\'>Bosnia &amp; Herzegovina</option><option value=\'BW\'>Botswana</option><option value=\'BR\'>Brazil</option><option value=\'BC\'>British Indian Ocean Ter</option><option value=\'BN\'>Brunei</option><option value=\'BG\'>Bulgaria</option><option value=\'BF\'>Burkina Faso</option><option value=\'BI\'>Burundi</option><option value=\'KH\'>Cambodia</option><option value=\'CM\'>Cameroon</option><option value=\'CA\'>Canada</option><option value=\'IC\'>Canary Islands</option><option value=\'CV\'>Cape Verde</option><option value=\'KY\'>Cayman Islands</option><option value=\'CF\'>Central African Republic</option><option value=\'TD\'>Chad</option><option value=\'CD\'>Channel Islands</option><option value=\'CL\'>Chile</option><option value=\'CN\'>China</option><option value=\'CI\'>Christmas Island</option><option value=\'CS\'>Cocos Island</option><option value=\'CO\'>Colombia</option><option value=\'CC\'>Comoros</option><option value=\'CG\'>Congo</option><option value=\'CK\'>Cook Islands</option><option value=\'CR\'>Costa Rica</option><option value=\'CT\'>Cote D&#39;Ivoire</option><option value=\'HR\'>Croatia</option><option value=\'CU\'>Cuba</option><option value=\'CB\'>Curacao</option><option value=\'CY\'>Cyprus</option><option value=\'CZ\'>Czech Republic</option><option value=\'DK\'>Denmark</option><option value=\'DJ\'>Djibouti</option><option value=\'DM\'>Dominica</option><option value=\'DO\'>Dominican Republic</option><option value=\'TM\'>East Timor</option><option value=\'EC\'>Ecuador</option><option value=\'EG\'>Egypt</option><option value=\'SV\'>El Salvador</option><option value=\'GQ\'>Equatorial Guinea</option><option value=\'ER\'>Eritrea</option><option value=\'EE\'>Estonia</option><option value=\'ET\'>Ethiopia</option><option value=\'FA\'>Falkland Islands</option><option value=\'FO\'>Faroe Islands</option><option value=\'FJ\'>Fiji</option><option value=\'FI\'>Finland</option><option value=\'FR\'>France</option><option value=\'GF\'>French Guiana</option><option value=\'PF\'>French Polynesia</option><option value=\'FS\'>French Southern Ter</option><option value=\'GA\'>Gabon</option><option value=\'GM\'>Gambia</option><option value=\'GE\'>Georgia</option><option value=\'DE\'>Germany</option><option value=\'GH\'>Ghana</option><option value=\'GI\'>Gibraltar</option><option value=\'GB\'>Great Britain</option><option value=\'GR\'>Greece</option><option value=\'GL\'>Greenland</option><option value=\'GD\'>Grenada</option><option value=\'GP\'>Guadeloupe</option><option value=\'GU\'>Guam</option><option value=\'GT\'>Guatemala</option><option value=\'GN\'>Guinea</option><option value=\'GY\'>Guyana</option><option value=\'HT\'>Haiti</option><option value=\'HW\'>Hawaii</option><option value=\'HN\'>Honduras</option><option value=\'HK\'>Hong Kong</option><option value=\'HU\'>Hungary</option><option value=\'IS\'>Iceland</option><option value=\'IN\'>India</option><option value=\'ID\'>Indonesia</option><option value=\'IA\'>Iran</option><option value=\'IQ\'>Iraq</option><option value=\'IR\'>Ireland</option><option value=\'IM\'>Isle of Man</option><option value=\'IL\'>Israel</option><option value=\'IT\'>Italy</option><option value=\'JM\'>Jamaica</option><option value=\'JP\'>Japan</option><option value=\'JO\'>Jordan</option><option value=\'KZ\'>Kazakhstan</option><option value=\'KE\'>Kenya</option><option value=\'KI\'>Kiribati</option><option value=\'NK\'>Korea North</option><option value=\'KS\'>Korea South</option><option value=\'KW\'>Kuwait</option><option value=\'KG\'>Kyrgyzstan</option><option value=\'LA\'>Laos</option><option value=\'LV\'>Latvia</option><option value=\'LB\'>Lebanon</option><option value=\'LS\'>Lesotho</option><option value=\'LR\'>Liberia</option><option value=\'LY\'>Libya</option><option value=\'LI\'>Liechtenstein</option><option value=\'LT\'>Lithuania</option><option value=\'LU\'>Luxembourg</option><option value=\'MO\'>Macau</option><option value=\'MK\'>Macedonia</option><option value=\'MG\'>Madagascar</option><option value=\'MY\'>Malaysia</option><option value=\'MW\'>Malawi</option><option value=\'MV\'>Maldives</option><option value=\'ML\'>Mali</option><option value=\'MT\'>Malta</option><option value=\'MH\'>Marshall Islands</option><option value=\'MQ\'>Martinique</option><option value=\'MR\'>Mauritania</option><option value=\'MU\'>Mauritius</option><option value=\'ME\'>Mayotte</option><option value=\'MX\'>Mexico</option><option value=\'MI\'>Midway Islands</option><option value=\'MD\'>Moldova</option><option value=\'MC\'>Monaco</option><option value=\'MN\'>Mongolia</option><option value=\'MS\'>Montserrat</option><option value=\'MA\'>Morocco</option><option value=\'MZ\'>Mozambique</option><option value=\'MM\'>Myanmar</option><option value=\'NA\'>Nambia</option><option value=\'NU\'>Nauru</option><option value=\'NP\'>Nepal</option><option value=\'AN\'>Netherland Antilles</option><option value=\'NL\'>Netherlands (Holland, Europe)</option><option value=\'NV\'>Nevis</option><option value=\'NC\'>New Caledonia</option><option value=\'NZ\'>New Zealand</option><option value=\'NI\'>Nicaragua</option><option value=\'NE\'>Niger</option><option value=\'NG\'>Nigeria</option><option value=\'NW\'>Niue</option><option value=\'NF\'>Norfolk Island</option><option value=\'NO\'>Norway</option><option value=\'OM\'>Oman</option><option value=\'PK\'>Pakistan</option><option value=\'PW\'>Palau Island</option><option value=\'PS\'>Palestine</option><option value=\'PA\'>Panama</option><option value=\'PG\'>Papua New Guinea</option><option value=\'PY\'>Paraguay</option><option value=\'PE\'>Peru</option><option value=\'PH\'>Philippines</option><option value=\'PO\'>Pitcairn Island</option><option value=\'PL\'>Poland</option><option value=\'PT\'>Portugal</option><option value=\'PR\'>Puerto Rico</option><option value=\'QA\'>Qatar</option><option value=\'ME\'>Republic of Montenegro</option><option value=\'RS\'>Republic of Serbia</option><option value=\'RE\'>Reunion</option><option value=\'RO\'>Romania</option><option value=\'RU\'>Russia</option><option value=\'RW\'>Rwanda</option><option value=\'NT\'>St Barthelemy</option><option value=\'EU\'>St Eustatius</option><option value=\'HE\'>St Helena</option><option value=\'KN\'>St Kitts-Nevis</option><option value=\'LC\'>St Lucia</option><option value=\'MB\'>St Maarten</option><option value=\'PM\'>St Pierre &amp; Miquelon</option><option value=\'VC\'>St Vincent &amp; Grenadines</option><option value=\'SP\'>Saipan</option><option value=\'SO\'>Samoa</option><option value=\'AS\'>Samoa American</option><option value=\'SM\'>San Marino</option><option value=\'ST\'>Sao Tome &amp; Principe</option><option value=\'SA\'>Saudi Arabia</option><option value=\'SN\'>Senegal</option><option value=\'RS\'>Serbia</option><option value=\'SC\'>Seychelles</option><option value=\'SL\'>Sierra Leone</option><option value=\'SG\'>Singapore</option><option value=\'SK\'>Slovakia</option><option value=\'SI\'>Slovenia</option><option value=\'SB\'>Solomon Islands</option><option value=\'OI\'>Somalia</option><option value=\'ZA\'>South Africa</option><option value=\'ES\'>Spain</option><option value=\'LK\'>Sri Lanka</option><option value=\'SD\'>Sudan</option><option value=\'SR\'>Suriname</option><option value=\'SZ\'>Swaziland</option><option value=\'SE\'>Sweden</option><option value=\'CH\'>Switzerland</option><option value=\'SY\'>Syria</option><option value=\'TA\'>Tahiti</option><option value=\'TW\'>Taiwan</option><option value=\'TJ\'>Tajikistan</option><option value=\'TZ\'>Tanzania</option><option value=\'TH\'>Thailand</option><option value=\'TG\'>Togo</option><option value=\'TK\'>Tokelau</option><option value=\'TO\'>Tonga</option><option value=\'TT\'>Trinidad &amp; Tobago</option><option value=\'TN\'>Tunisia</option><option value=\'TR\'>Turkey</option><option value=\'TU\'>Turkmenistan</option><option value=\'TC\'>Turks &amp; Caicos Is</option><option value=\'TV\'>Tuvalu</option><option value=\'UG\'>Uganda</option><option value=\'UA\'>Ukraine</option><option value=\'AE\'>United Arab Emirates</option><option value=\'GB\'>United Kingdom</option><option value=\'US\'>United States of America</option><option value=\'UY\'>Uruguay</option><option value=\'UZ\'>Uzbekistan</option><option value=\'VU\'>Vanuatu</option><option value=\'VS\'>Vatican City State</option><option value=\'VE\'>Venezuela</option><option value=\'VN\'>Vietnam</option><option value=\'VB\'>Virgin Islands (Brit)</option><option value=\'VA\'>Virgin Islands (USA)</option><option value=\'WK\'>Wake Island</option><option value=\'WF\'>Wallis &amp; Futana Is</option><option value=\'YE\'>Yemen</option><option value=\'ZR\'>Zaire</option><option value=\'ZM\'>Zambia</option><option value=\'ZW\'>Zimbabwe</option></select> <input name=\'phone\' type=\'text\'><textarea name=\'message\' rows=\'5\'></textarea><button class=\'pf-widget-btn pf-widget-cancel\'>Cancel</button> <button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Send</button></form></div>',
    'inline': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><a class=\'pf-widget-close\'>&times;</a><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><div class=\'pf-social-login\'><p name=\'fb-login\' hidden></p><p name=\'google-login\' hidden></p></div><form><input name=\'username\' type=\'text\'> <input name=\'email\' type=\'email\'> <input class=\'pf-field-half-width\' name=\'title\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'company\' type=\'text\'> <input name=\'phone\' type=\'text\'> <select name=\'country\'><option value=\'\'>Country</option><option value=\'AF\'>Afghanistan</option><option value=\'AL\'>Albania</option><option value=\'DZ\'>Algeria</option><option value=\'AS\'>American Samoa</option><option value=\'AD\'>Andorra</option><option value=\'AG\'>Angola</option><option value=\'AI\'>Anguilla</option><option value=\'AG\'>Antigua &amp; Barbuda</option><option value=\'AR\'>Argentina</option><option value=\'AA\'>Armenia</option><option value=\'AW\'>Aruba</option><option value=\'AU\'>Australia</option><option value=\'AT\'>Austria</option><option value=\'AZ\'>Azerbaijan</option><option value=\'BS\'>Bahamas</option><option value=\'BH\'>Bahrain</option><option value=\'BD\'>Bangladesh</option><option value=\'BB\'>Barbados</option><option value=\'BY\'>Belarus</option><option value=\'BE\'>Belgium</option><option value=\'BZ\'>Belize</option><option value=\'BJ\'>Benin</option><option value=\'BM\'>Bermuda</option><option value=\'BT\'>Bhutan</option><option value=\'BO\'>Bolivia</option><option value=\'BL\'>Bonaire</option><option value=\'BA\'>Bosnia &amp; Herzegovina</option><option value=\'BW\'>Botswana</option><option value=\'BR\'>Brazil</option><option value=\'BC\'>British Indian Ocean Ter</option><option value=\'BN\'>Brunei</option><option value=\'BG\'>Bulgaria</option><option value=\'BF\'>Burkina Faso</option><option value=\'BI\'>Burundi</option><option value=\'KH\'>Cambodia</option><option value=\'CM\'>Cameroon</option><option value=\'CA\'>Canada</option><option value=\'IC\'>Canary Islands</option><option value=\'CV\'>Cape Verde</option><option value=\'KY\'>Cayman Islands</option><option value=\'CF\'>Central African Republic</option><option value=\'TD\'>Chad</option><option value=\'CD\'>Channel Islands</option><option value=\'CL\'>Chile</option><option value=\'CN\'>China</option><option value=\'CI\'>Christmas Island</option><option value=\'CS\'>Cocos Island</option><option value=\'CO\'>Colombia</option><option value=\'CC\'>Comoros</option><option value=\'CG\'>Congo</option><option value=\'CK\'>Cook Islands</option><option value=\'CR\'>Costa Rica</option><option value=\'CT\'>Cote D&#39;Ivoire</option><option value=\'HR\'>Croatia</option><option value=\'CU\'>Cuba</option><option value=\'CB\'>Curacao</option><option value=\'CY\'>Cyprus</option><option value=\'CZ\'>Czech Republic</option><option value=\'DK\'>Denmark</option><option value=\'DJ\'>Djibouti</option><option value=\'DM\'>Dominica</option><option value=\'DO\'>Dominican Republic</option><option value=\'TM\'>East Timor</option><option value=\'EC\'>Ecuador</option><option value=\'EG\'>Egypt</option><option value=\'SV\'>El Salvador</option><option value=\'GQ\'>Equatorial Guinea</option><option value=\'ER\'>Eritrea</option><option value=\'EE\'>Estonia</option><option value=\'ET\'>Ethiopia</option><option value=\'FA\'>Falkland Islands</option><option value=\'FO\'>Faroe Islands</option><option value=\'FJ\'>Fiji</option><option value=\'FI\'>Finland</option><option value=\'FR\'>France</option><option value=\'GF\'>French Guiana</option><option value=\'PF\'>French Polynesia</option><option value=\'FS\'>French Southern Ter</option><option value=\'GA\'>Gabon</option><option value=\'GM\'>Gambia</option><option value=\'GE\'>Georgia</option><option value=\'DE\'>Germany</option><option value=\'GH\'>Ghana</option><option value=\'GI\'>Gibraltar</option><option value=\'GB\'>Great Britain</option><option value=\'GR\'>Greece</option><option value=\'GL\'>Greenland</option><option value=\'GD\'>Grenada</option><option value=\'GP\'>Guadeloupe</option><option value=\'GU\'>Guam</option><option value=\'GT\'>Guatemala</option><option value=\'GN\'>Guinea</option><option value=\'GY\'>Guyana</option><option value=\'HT\'>Haiti</option><option value=\'HW\'>Hawaii</option><option value=\'HN\'>Honduras</option><option value=\'HK\'>Hong Kong</option><option value=\'HU\'>Hungary</option><option value=\'IS\'>Iceland</option><option value=\'IN\'>India</option><option value=\'ID\'>Indonesia</option><option value=\'IA\'>Iran</option><option value=\'IQ\'>Iraq</option><option value=\'IR\'>Ireland</option><option value=\'IM\'>Isle of Man</option><option value=\'IL\'>Israel</option><option value=\'IT\'>Italy</option><option value=\'JM\'>Jamaica</option><option value=\'JP\'>Japan</option><option value=\'JO\'>Jordan</option><option value=\'KZ\'>Kazakhstan</option><option value=\'KE\'>Kenya</option><option value=\'KI\'>Kiribati</option><option value=\'NK\'>Korea North</option><option value=\'KS\'>Korea South</option><option value=\'KW\'>Kuwait</option><option value=\'KG\'>Kyrgyzstan</option><option value=\'LA\'>Laos</option><option value=\'LV\'>Latvia</option><option value=\'LB\'>Lebanon</option><option value=\'LS\'>Lesotho</option><option value=\'LR\'>Liberia</option><option value=\'LY\'>Libya</option><option value=\'LI\'>Liechtenstein</option><option value=\'LT\'>Lithuania</option><option value=\'LU\'>Luxembourg</option><option value=\'MO\'>Macau</option><option value=\'MK\'>Macedonia</option><option value=\'MG\'>Madagascar</option><option value=\'MY\'>Malaysia</option><option value=\'MW\'>Malawi</option><option value=\'MV\'>Maldives</option><option value=\'ML\'>Mali</option><option value=\'MT\'>Malta</option><option value=\'MH\'>Marshall Islands</option><option value=\'MQ\'>Martinique</option><option value=\'MR\'>Mauritania</option><option value=\'MU\'>Mauritius</option><option value=\'ME\'>Mayotte</option><option value=\'MX\'>Mexico</option><option value=\'MI\'>Midway Islands</option><option value=\'MD\'>Moldova</option><option value=\'MC\'>Monaco</option><option value=\'MN\'>Mongolia</option><option value=\'MS\'>Montserrat</option><option value=\'MA\'>Morocco</option><option value=\'MZ\'>Mozambique</option><option value=\'MM\'>Myanmar</option><option value=\'NA\'>Nambia</option><option value=\'NU\'>Nauru</option><option value=\'NP\'>Nepal</option><option value=\'AN\'>Netherland Antilles</option><option value=\'NL\'>Netherlands (Holland, Europe)</option><option value=\'NV\'>Nevis</option><option value=\'NC\'>New Caledonia</option><option value=\'NZ\'>New Zealand</option><option value=\'NI\'>Nicaragua</option><option value=\'NE\'>Niger</option><option value=\'NG\'>Nigeria</option><option value=\'NW\'>Niue</option><option value=\'NF\'>Norfolk Island</option><option value=\'NO\'>Norway</option><option value=\'OM\'>Oman</option><option value=\'PK\'>Pakistan</option><option value=\'PW\'>Palau Island</option><option value=\'PS\'>Palestine</option><option value=\'PA\'>Panama</option><option value=\'PG\'>Papua New Guinea</option><option value=\'PY\'>Paraguay</option><option value=\'PE\'>Peru</option><option value=\'PH\'>Philippines</option><option value=\'PO\'>Pitcairn Island</option><option value=\'PL\'>Poland</option><option value=\'PT\'>Portugal</option><option value=\'PR\'>Puerto Rico</option><option value=\'QA\'>Qatar</option><option value=\'ME\'>Republic of Montenegro</option><option value=\'RS\'>Republic of Serbia</option><option value=\'RE\'>Reunion</option><option value=\'RO\'>Romania</option><option value=\'RU\'>Russia</option><option value=\'RW\'>Rwanda</option><option value=\'NT\'>St Barthelemy</option><option value=\'EU\'>St Eustatius</option><option value=\'HE\'>St Helena</option><option value=\'KN\'>St Kitts-Nevis</option><option value=\'LC\'>St Lucia</option><option value=\'MB\'>St Maarten</option><option value=\'PM\'>St Pierre &amp; Miquelon</option><option value=\'VC\'>St Vincent &amp; Grenadines</option><option value=\'SP\'>Saipan</option><option value=\'SO\'>Samoa</option><option value=\'AS\'>Samoa American</option><option value=\'SM\'>San Marino</option><option value=\'ST\'>Sao Tome &amp; Principe</option><option value=\'SA\'>Saudi Arabia</option><option value=\'SN\'>Senegal</option><option value=\'RS\'>Serbia</option><option value=\'SC\'>Seychelles</option><option value=\'SL\'>Sierra Leone</option><option value=\'SG\'>Singapore</option><option value=\'SK\'>Slovakia</option><option value=\'SI\'>Slovenia</option><option value=\'SB\'>Solomon Islands</option><option value=\'OI\'>Somalia</option><option value=\'ZA\'>South Africa</option><option value=\'ES\'>Spain</option><option value=\'LK\'>Sri Lanka</option><option value=\'SD\'>Sudan</option><option value=\'SR\'>Suriname</option><option value=\'SZ\'>Swaziland</option><option value=\'SE\'>Sweden</option><option value=\'CH\'>Switzerland</option><option value=\'SY\'>Syria</option><option value=\'TA\'>Tahiti</option><option value=\'TW\'>Taiwan</option><option value=\'TJ\'>Tajikistan</option><option value=\'TZ\'>Tanzania</option><option value=\'TH\'>Thailand</option><option value=\'TG\'>Togo</option><option value=\'TK\'>Tokelau</option><option value=\'TO\'>Tonga</option><option value=\'TT\'>Trinidad &amp; Tobago</option><option value=\'TN\'>Tunisia</option><option value=\'TR\'>Turkey</option><option value=\'TU\'>Turkmenistan</option><option value=\'TC\'>Turks &amp; Caicos Is</option><option value=\'TV\'>Tuvalu</option><option value=\'UG\'>Uganda</option><option value=\'UA\'>Ukraine</option><option value=\'AE\'>United Arab Emirates</option><option value=\'GB\'>United Kingdom</option><option value=\'US\'>United States of America</option><option value=\'UY\'>Uruguay</option><option value=\'UZ\'>Uzbekistan</option><option value=\'VU\'>Vanuatu</option><option value=\'VS\'>Vatican City State</option><option value=\'VE\'>Venezuela</option><option value=\'VN\'>Vietnam</option><option value=\'VB\'>Virgin Islands (Brit)</option><option value=\'VA\'>Virgin Islands (USA)</option><option value=\'WK\'>Wake Island</option><option value=\'WF\'>Wallis &amp; Futana Is</option><option value=\'YE\'>Yemen</option><option value=\'ZR\'>Zaire</option><option value=\'ZM\'>Zambia</option><option value=\'ZW\'>Zimbabwe</option></select><textarea name=\'message\' rows=\'5\'></textarea><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Send</button> <button class=\'pf-widget-btn pf-widget-cancel\'>Cancel</button></form></div></div></div></div></div>',
    'modal': '<div class=\'pf-widget-container\'><div class=\'pf-va-middle\'><div class=\'pf-widget-content\'><a class=\'pf-widget-close\'>&times;</a><h2 class=\'pf-widget-headline\'></h2><div class=\'pf-widget-body\'><div class=\'pf-va-middle\'><p class=\'pf-widget-message\'></p><div class=\'pf-social-login\'><p name=\'fb-login\' hidden></p><p name=\'google-login\' hidden></p></div><form><input name=\'username\' type=\'text\'> <input name=\'email\' type=\'email\'> <input class=\'pf-field-half-width\' name=\'title\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'company\' type=\'text\'> <input name=\'phone\' type=\'text\'> <select name=\'country\'><option value=\'\'>Country</option><option value=\'AF\'>Afghanistan</option><option value=\'AL\'>Albania</option><option value=\'DZ\'>Algeria</option><option value=\'AS\'>American Samoa</option><option value=\'AD\'>Andorra</option><option value=\'AG\'>Angola</option><option value=\'AI\'>Anguilla</option><option value=\'AG\'>Antigua &amp; Barbuda</option><option value=\'AR\'>Argentina</option><option value=\'AA\'>Armenia</option><option value=\'AW\'>Aruba</option><option value=\'AU\'>Australia</option><option value=\'AT\'>Austria</option><option value=\'AZ\'>Azerbaijan</option><option value=\'BS\'>Bahamas</option><option value=\'BH\'>Bahrain</option><option value=\'BD\'>Bangladesh</option><option value=\'BB\'>Barbados</option><option value=\'BY\'>Belarus</option><option value=\'BE\'>Belgium</option><option value=\'BZ\'>Belize</option><option value=\'BJ\'>Benin</option><option value=\'BM\'>Bermuda</option><option value=\'BT\'>Bhutan</option><option value=\'BO\'>Bolivia</option><option value=\'BL\'>Bonaire</option><option value=\'BA\'>Bosnia &amp; Herzegovina</option><option value=\'BW\'>Botswana</option><option value=\'BR\'>Brazil</option><option value=\'BC\'>British Indian Ocean Ter</option><option value=\'BN\'>Brunei</option><option value=\'BG\'>Bulgaria</option><option value=\'BF\'>Burkina Faso</option><option value=\'BI\'>Burundi</option><option value=\'KH\'>Cambodia</option><option value=\'CM\'>Cameroon</option><option value=\'CA\'>Canada</option><option value=\'IC\'>Canary Islands</option><option value=\'CV\'>Cape Verde</option><option value=\'KY\'>Cayman Islands</option><option value=\'CF\'>Central African Republic</option><option value=\'TD\'>Chad</option><option value=\'CD\'>Channel Islands</option><option value=\'CL\'>Chile</option><option value=\'CN\'>China</option><option value=\'CI\'>Christmas Island</option><option value=\'CS\'>Cocos Island</option><option value=\'CO\'>Colombia</option><option value=\'CC\'>Comoros</option><option value=\'CG\'>Congo</option><option value=\'CK\'>Cook Islands</option><option value=\'CR\'>Costa Rica</option><option value=\'CT\'>Cote D&#39;Ivoire</option><option value=\'HR\'>Croatia</option><option value=\'CU\'>Cuba</option><option value=\'CB\'>Curacao</option><option value=\'CY\'>Cyprus</option><option value=\'CZ\'>Czech Republic</option><option value=\'DK\'>Denmark</option><option value=\'DJ\'>Djibouti</option><option value=\'DM\'>Dominica</option><option value=\'DO\'>Dominican Republic</option><option value=\'TM\'>East Timor</option><option value=\'EC\'>Ecuador</option><option value=\'EG\'>Egypt</option><option value=\'SV\'>El Salvador</option><option value=\'GQ\'>Equatorial Guinea</option><option value=\'ER\'>Eritrea</option><option value=\'EE\'>Estonia</option><option value=\'ET\'>Ethiopia</option><option value=\'FA\'>Falkland Islands</option><option value=\'FO\'>Faroe Islands</option><option value=\'FJ\'>Fiji</option><option value=\'FI\'>Finland</option><option value=\'FR\'>France</option><option value=\'GF\'>French Guiana</option><option value=\'PF\'>French Polynesia</option><option value=\'FS\'>French Southern Ter</option><option value=\'GA\'>Gabon</option><option value=\'GM\'>Gambia</option><option value=\'GE\'>Georgia</option><option value=\'DE\'>Germany</option><option value=\'GH\'>Ghana</option><option value=\'GI\'>Gibraltar</option><option value=\'GB\'>Great Britain</option><option value=\'GR\'>Greece</option><option value=\'GL\'>Greenland</option><option value=\'GD\'>Grenada</option><option value=\'GP\'>Guadeloupe</option><option value=\'GU\'>Guam</option><option value=\'GT\'>Guatemala</option><option value=\'GN\'>Guinea</option><option value=\'GY\'>Guyana</option><option value=\'HT\'>Haiti</option><option value=\'HW\'>Hawaii</option><option value=\'HN\'>Honduras</option><option value=\'HK\'>Hong Kong</option><option value=\'HU\'>Hungary</option><option value=\'IS\'>Iceland</option><option value=\'IN\'>India</option><option value=\'ID\'>Indonesia</option><option value=\'IA\'>Iran</option><option value=\'IQ\'>Iraq</option><option value=\'IR\'>Ireland</option><option value=\'IM\'>Isle of Man</option><option value=\'IL\'>Israel</option><option value=\'IT\'>Italy</option><option value=\'JM\'>Jamaica</option><option value=\'JP\'>Japan</option><option value=\'JO\'>Jordan</option><option value=\'KZ\'>Kazakhstan</option><option value=\'KE\'>Kenya</option><option value=\'KI\'>Kiribati</option><option value=\'NK\'>Korea North</option><option value=\'KS\'>Korea South</option><option value=\'KW\'>Kuwait</option><option value=\'KG\'>Kyrgyzstan</option><option value=\'LA\'>Laos</option><option value=\'LV\'>Latvia</option><option value=\'LB\'>Lebanon</option><option value=\'LS\'>Lesotho</option><option value=\'LR\'>Liberia</option><option value=\'LY\'>Libya</option><option value=\'LI\'>Liechtenstein</option><option value=\'LT\'>Lithuania</option><option value=\'LU\'>Luxembourg</option><option value=\'MO\'>Macau</option><option value=\'MK\'>Macedonia</option><option value=\'MG\'>Madagascar</option><option value=\'MY\'>Malaysia</option><option value=\'MW\'>Malawi</option><option value=\'MV\'>Maldives</option><option value=\'ML\'>Mali</option><option value=\'MT\'>Malta</option><option value=\'MH\'>Marshall Islands</option><option value=\'MQ\'>Martinique</option><option value=\'MR\'>Mauritania</option><option value=\'MU\'>Mauritius</option><option value=\'ME\'>Mayotte</option><option value=\'MX\'>Mexico</option><option value=\'MI\'>Midway Islands</option><option value=\'MD\'>Moldova</option><option value=\'MC\'>Monaco</option><option value=\'MN\'>Mongolia</option><option value=\'MS\'>Montserrat</option><option value=\'MA\'>Morocco</option><option value=\'MZ\'>Mozambique</option><option value=\'MM\'>Myanmar</option><option value=\'NA\'>Nambia</option><option value=\'NU\'>Nauru</option><option value=\'NP\'>Nepal</option><option value=\'AN\'>Netherland Antilles</option><option value=\'NL\'>Netherlands (Holland, Europe)</option><option value=\'NV\'>Nevis</option><option value=\'NC\'>New Caledonia</option><option value=\'NZ\'>New Zealand</option><option value=\'NI\'>Nicaragua</option><option value=\'NE\'>Niger</option><option value=\'NG\'>Nigeria</option><option value=\'NW\'>Niue</option><option value=\'NF\'>Norfolk Island</option><option value=\'NO\'>Norway</option><option value=\'OM\'>Oman</option><option value=\'PK\'>Pakistan</option><option value=\'PW\'>Palau Island</option><option value=\'PS\'>Palestine</option><option value=\'PA\'>Panama</option><option value=\'PG\'>Papua New Guinea</option><option value=\'PY\'>Paraguay</option><option value=\'PE\'>Peru</option><option value=\'PH\'>Philippines</option><option value=\'PO\'>Pitcairn Island</option><option value=\'PL\'>Poland</option><option value=\'PT\'>Portugal</option><option value=\'PR\'>Puerto Rico</option><option value=\'QA\'>Qatar</option><option value=\'ME\'>Republic of Montenegro</option><option value=\'RS\'>Republic of Serbia</option><option value=\'RE\'>Reunion</option><option value=\'RO\'>Romania</option><option value=\'RU\'>Russia</option><option value=\'RW\'>Rwanda</option><option value=\'NT\'>St Barthelemy</option><option value=\'EU\'>St Eustatius</option><option value=\'HE\'>St Helena</option><option value=\'KN\'>St Kitts-Nevis</option><option value=\'LC\'>St Lucia</option><option value=\'MB\'>St Maarten</option><option value=\'PM\'>St Pierre &amp; Miquelon</option><option value=\'VC\'>St Vincent &amp; Grenadines</option><option value=\'SP\'>Saipan</option><option value=\'SO\'>Samoa</option><option value=\'AS\'>Samoa American</option><option value=\'SM\'>San Marino</option><option value=\'ST\'>Sao Tome &amp; Principe</option><option value=\'SA\'>Saudi Arabia</option><option value=\'SN\'>Senegal</option><option value=\'RS\'>Serbia</option><option value=\'SC\'>Seychelles</option><option value=\'SL\'>Sierra Leone</option><option value=\'SG\'>Singapore</option><option value=\'SK\'>Slovakia</option><option value=\'SI\'>Slovenia</option><option value=\'SB\'>Solomon Islands</option><option value=\'OI\'>Somalia</option><option value=\'ZA\'>South Africa</option><option value=\'ES\'>Spain</option><option value=\'LK\'>Sri Lanka</option><option value=\'SD\'>Sudan</option><option value=\'SR\'>Suriname</option><option value=\'SZ\'>Swaziland</option><option value=\'SE\'>Sweden</option><option value=\'CH\'>Switzerland</option><option value=\'SY\'>Syria</option><option value=\'TA\'>Tahiti</option><option value=\'TW\'>Taiwan</option><option value=\'TJ\'>Tajikistan</option><option value=\'TZ\'>Tanzania</option><option value=\'TH\'>Thailand</option><option value=\'TG\'>Togo</option><option value=\'TK\'>Tokelau</option><option value=\'TO\'>Tonga</option><option value=\'TT\'>Trinidad &amp; Tobago</option><option value=\'TN\'>Tunisia</option><option value=\'TR\'>Turkey</option><option value=\'TU\'>Turkmenistan</option><option value=\'TC\'>Turks &amp; Caicos Is</option><option value=\'TV\'>Tuvalu</option><option value=\'UG\'>Uganda</option><option value=\'UA\'>Ukraine</option><option value=\'AE\'>United Arab Emirates</option><option value=\'GB\'>United Kingdom</option><option value=\'US\'>United States of America</option><option value=\'UY\'>Uruguay</option><option value=\'UZ\'>Uzbekistan</option><option value=\'VU\'>Vanuatu</option><option value=\'VS\'>Vatican City State</option><option value=\'VE\'>Venezuela</option><option value=\'VN\'>Vietnam</option><option value=\'VB\'>Virgin Islands (Brit)</option><option value=\'VA\'>Virgin Islands (USA)</option><option value=\'WK\'>Wake Island</option><option value=\'WF\'>Wallis &amp; Futana Is</option><option value=\'YE\'>Yemen</option><option value=\'ZR\'>Zaire</option><option value=\'ZM\'>Zambia</option><option value=\'ZW\'>Zimbabwe</option></select><textarea name=\'message\' rows=\'5\'></textarea><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Send</button> <button class=\'pf-widget-btn pf-widget-cancel\'>Cancel</button></form></div></div></div></div></div>',
    'slideout': '<a class=\'pf-widget-close\'>&times;</a><div class=\'pf-widget-body\'></div><div class=\'pf-widget-content\'><h2 class=\'pf-widget-headline\'></h2><p class=\'pf-widget-message\'></p><div class=\'pf-social-login\'><p name=\'fb-login\' hidden></p><p name=\'google-login\' hidden></p></div><form><input name=\'username\' type=\'text\'> <input name=\'email\' type=\'email\'> <input class=\'pf-field-half-width\' name=\'title\' type=\'text\'> <input class=\'pf-field-half-width\' name=\'company\' type=\'text\'> <input name=\'phone\' type=\'text\'> <select name=\'country\'><option value=\'\'>Country</option><option value=\'AF\'>Afghanistan</option><option value=\'AL\'>Albania</option><option value=\'DZ\'>Algeria</option><option value=\'AS\'>American Samoa</option><option value=\'AD\'>Andorra</option><option value=\'AG\'>Angola</option><option value=\'AI\'>Anguilla</option><option value=\'AG\'>Antigua &amp; Barbuda</option><option value=\'AR\'>Argentina</option><option value=\'AA\'>Armenia</option><option value=\'AW\'>Aruba</option><option value=\'AU\'>Australia</option><option value=\'AT\'>Austria</option><option value=\'AZ\'>Azerbaijan</option><option value=\'BS\'>Bahamas</option><option value=\'BH\'>Bahrain</option><option value=\'BD\'>Bangladesh</option><option value=\'BB\'>Barbados</option><option value=\'BY\'>Belarus</option><option value=\'BE\'>Belgium</option><option value=\'BZ\'>Belize</option><option value=\'BJ\'>Benin</option><option value=\'BM\'>Bermuda</option><option value=\'BT\'>Bhutan</option><option value=\'BO\'>Bolivia</option><option value=\'BL\'>Bonaire</option><option value=\'BA\'>Bosnia &amp; Herzegovina</option><option value=\'BW\'>Botswana</option><option value=\'BR\'>Brazil</option><option value=\'BC\'>British Indian Ocean Ter</option><option value=\'BN\'>Brunei</option><option value=\'BG\'>Bulgaria</option><option value=\'BF\'>Burkina Faso</option><option value=\'BI\'>Burundi</option><option value=\'KH\'>Cambodia</option><option value=\'CM\'>Cameroon</option><option value=\'CA\'>Canada</option><option value=\'IC\'>Canary Islands</option><option value=\'CV\'>Cape Verde</option><option value=\'KY\'>Cayman Islands</option><option value=\'CF\'>Central African Republic</option><option value=\'TD\'>Chad</option><option value=\'CD\'>Channel Islands</option><option value=\'CL\'>Chile</option><option value=\'CN\'>China</option><option value=\'CI\'>Christmas Island</option><option value=\'CS\'>Cocos Island</option><option value=\'CO\'>Colombia</option><option value=\'CC\'>Comoros</option><option value=\'CG\'>Congo</option><option value=\'CK\'>Cook Islands</option><option value=\'CR\'>Costa Rica</option><option value=\'CT\'>Cote D&#39;Ivoire</option><option value=\'HR\'>Croatia</option><option value=\'CU\'>Cuba</option><option value=\'CB\'>Curacao</option><option value=\'CY\'>Cyprus</option><option value=\'CZ\'>Czech Republic</option><option value=\'DK\'>Denmark</option><option value=\'DJ\'>Djibouti</option><option value=\'DM\'>Dominica</option><option value=\'DO\'>Dominican Republic</option><option value=\'TM\'>East Timor</option><option value=\'EC\'>Ecuador</option><option value=\'EG\'>Egypt</option><option value=\'SV\'>El Salvador</option><option value=\'GQ\'>Equatorial Guinea</option><option value=\'ER\'>Eritrea</option><option value=\'EE\'>Estonia</option><option value=\'ET\'>Ethiopia</option><option value=\'FA\'>Falkland Islands</option><option value=\'FO\'>Faroe Islands</option><option value=\'FJ\'>Fiji</option><option value=\'FI\'>Finland</option><option value=\'FR\'>France</option><option value=\'GF\'>French Guiana</option><option value=\'PF\'>French Polynesia</option><option value=\'FS\'>French Southern Ter</option><option value=\'GA\'>Gabon</option><option value=\'GM\'>Gambia</option><option value=\'GE\'>Georgia</option><option value=\'DE\'>Germany</option><option value=\'GH\'>Ghana</option><option value=\'GI\'>Gibraltar</option><option value=\'GB\'>Great Britain</option><option value=\'GR\'>Greece</option><option value=\'GL\'>Greenland</option><option value=\'GD\'>Grenada</option><option value=\'GP\'>Guadeloupe</option><option value=\'GU\'>Guam</option><option value=\'GT\'>Guatemala</option><option value=\'GN\'>Guinea</option><option value=\'GY\'>Guyana</option><option value=\'HT\'>Haiti</option><option value=\'HW\'>Hawaii</option><option value=\'HN\'>Honduras</option><option value=\'HK\'>Hong Kong</option><option value=\'HU\'>Hungary</option><option value=\'IS\'>Iceland</option><option value=\'IN\'>India</option><option value=\'ID\'>Indonesia</option><option value=\'IA\'>Iran</option><option value=\'IQ\'>Iraq</option><option value=\'IR\'>Ireland</option><option value=\'IM\'>Isle of Man</option><option value=\'IL\'>Israel</option><option value=\'IT\'>Italy</option><option value=\'JM\'>Jamaica</option><option value=\'JP\'>Japan</option><option value=\'JO\'>Jordan</option><option value=\'KZ\'>Kazakhstan</option><option value=\'KE\'>Kenya</option><option value=\'KI\'>Kiribati</option><option value=\'NK\'>Korea North</option><option value=\'KS\'>Korea South</option><option value=\'KW\'>Kuwait</option><option value=\'KG\'>Kyrgyzstan</option><option value=\'LA\'>Laos</option><option value=\'LV\'>Latvia</option><option value=\'LB\'>Lebanon</option><option value=\'LS\'>Lesotho</option><option value=\'LR\'>Liberia</option><option value=\'LY\'>Libya</option><option value=\'LI\'>Liechtenstein</option><option value=\'LT\'>Lithuania</option><option value=\'LU\'>Luxembourg</option><option value=\'MO\'>Macau</option><option value=\'MK\'>Macedonia</option><option value=\'MG\'>Madagascar</option><option value=\'MY\'>Malaysia</option><option value=\'MW\'>Malawi</option><option value=\'MV\'>Maldives</option><option value=\'ML\'>Mali</option><option value=\'MT\'>Malta</option><option value=\'MH\'>Marshall Islands</option><option value=\'MQ\'>Martinique</option><option value=\'MR\'>Mauritania</option><option value=\'MU\'>Mauritius</option><option value=\'ME\'>Mayotte</option><option value=\'MX\'>Mexico</option><option value=\'MI\'>Midway Islands</option><option value=\'MD\'>Moldova</option><option value=\'MC\'>Monaco</option><option value=\'MN\'>Mongolia</option><option value=\'MS\'>Montserrat</option><option value=\'MA\'>Morocco</option><option value=\'MZ\'>Mozambique</option><option value=\'MM\'>Myanmar</option><option value=\'NA\'>Nambia</option><option value=\'NU\'>Nauru</option><option value=\'NP\'>Nepal</option><option value=\'AN\'>Netherland Antilles</option><option value=\'NL\'>Netherlands (Holland, Europe)</option><option value=\'NV\'>Nevis</option><option value=\'NC\'>New Caledonia</option><option value=\'NZ\'>New Zealand</option><option value=\'NI\'>Nicaragua</option><option value=\'NE\'>Niger</option><option value=\'NG\'>Nigeria</option><option value=\'NW\'>Niue</option><option value=\'NF\'>Norfolk Island</option><option value=\'NO\'>Norway</option><option value=\'OM\'>Oman</option><option value=\'PK\'>Pakistan</option><option value=\'PW\'>Palau Island</option><option value=\'PS\'>Palestine</option><option value=\'PA\'>Panama</option><option value=\'PG\'>Papua New Guinea</option><option value=\'PY\'>Paraguay</option><option value=\'PE\'>Peru</option><option value=\'PH\'>Philippines</option><option value=\'PO\'>Pitcairn Island</option><option value=\'PL\'>Poland</option><option value=\'PT\'>Portugal</option><option value=\'PR\'>Puerto Rico</option><option value=\'QA\'>Qatar</option><option value=\'ME\'>Republic of Montenegro</option><option value=\'RS\'>Republic of Serbia</option><option value=\'RE\'>Reunion</option><option value=\'RO\'>Romania</option><option value=\'RU\'>Russia</option><option value=\'RW\'>Rwanda</option><option value=\'NT\'>St Barthelemy</option><option value=\'EU\'>St Eustatius</option><option value=\'HE\'>St Helena</option><option value=\'KN\'>St Kitts-Nevis</option><option value=\'LC\'>St Lucia</option><option value=\'MB\'>St Maarten</option><option value=\'PM\'>St Pierre &amp; Miquelon</option><option value=\'VC\'>St Vincent &amp; Grenadines</option><option value=\'SP\'>Saipan</option><option value=\'SO\'>Samoa</option><option value=\'AS\'>Samoa American</option><option value=\'SM\'>San Marino</option><option value=\'ST\'>Sao Tome &amp; Principe</option><option value=\'SA\'>Saudi Arabia</option><option value=\'SN\'>Senegal</option><option value=\'RS\'>Serbia</option><option value=\'SC\'>Seychelles</option><option value=\'SL\'>Sierra Leone</option><option value=\'SG\'>Singapore</option><option value=\'SK\'>Slovakia</option><option value=\'SI\'>Slovenia</option><option value=\'SB\'>Solomon Islands</option><option value=\'OI\'>Somalia</option><option value=\'ZA\'>South Africa</option><option value=\'ES\'>Spain</option><option value=\'LK\'>Sri Lanka</option><option value=\'SD\'>Sudan</option><option value=\'SR\'>Suriname</option><option value=\'SZ\'>Swaziland</option><option value=\'SE\'>Sweden</option><option value=\'CH\'>Switzerland</option><option value=\'SY\'>Syria</option><option value=\'TA\'>Tahiti</option><option value=\'TW\'>Taiwan</option><option value=\'TJ\'>Tajikistan</option><option value=\'TZ\'>Tanzania</option><option value=\'TH\'>Thailand</option><option value=\'TG\'>Togo</option><option value=\'TK\'>Tokelau</option><option value=\'TO\'>Tonga</option><option value=\'TT\'>Trinidad &amp; Tobago</option><option value=\'TN\'>Tunisia</option><option value=\'TR\'>Turkey</option><option value=\'TU\'>Turkmenistan</option><option value=\'TC\'>Turks &amp; Caicos Is</option><option value=\'TV\'>Tuvalu</option><option value=\'UG\'>Uganda</option><option value=\'UA\'>Ukraine</option><option value=\'AE\'>United Arab Emirates</option><option value=\'GB\'>United Kingdom</option><option value=\'US\'>United States of America</option><option value=\'UY\'>Uruguay</option><option value=\'UZ\'>Uzbekistan</option><option value=\'VU\'>Vanuatu</option><option value=\'VS\'>Vatican City State</option><option value=\'VE\'>Venezuela</option><option value=\'VN\'>Vietnam</option><option value=\'VB\'>Virgin Islands (Brit)</option><option value=\'VA\'>Virgin Islands (USA)</option><option value=\'WK\'>Wake Island</option><option value=\'WF\'>Wallis &amp; Futana Is</option><option value=\'YE\'>Yemen</option><option value=\'ZR\'>Zaire</option><option value=\'ZM\'>Zambia</option><option value=\'ZW\'>Zimbabwe</option></select><textarea name=\'message\' rows=\'5\'></textarea><button type=\'submit\' class=\'pf-widget-btn pf-widget-ok\'>Send</button> <button class=\'pf-widget-btn pf-widget-cancel\'>Cancel</button></form></div>'
  },
  'assets': {
    'facebookIcon': '<svg width=\'16\' height=\'16\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 266.89 266.89\'><title>facebookIcon</title><path d=\'M252.16 0h-237.43a14.73 14.73 0 0 0-14.73 14.73v237.43a14.73 14.73 0 0 0 14.73 14.73h127.83v-103.35h-34.79v-40.28h34.78v-29.71c0-34.47 21.05-53.24 51.81-53.24a285.41 285.41 0 0 1 31.08 1.59v36h-21.33c-16.72 0-20 7.95-20 19.61v25.72h39.89l-5.19 40.28h-34.66v103.38h68a14.73 14.73 0 0 0 14.73-14.73v-237.43a14.73 14.73 0 0 0-14.72-14.73z\' fill=\'#3c5a99\'/><path d=\'M218.84 163.54l5.16-40.28h-39.85v-25.72c0-11.66 3.24-19.61 20-19.61h21.33v-36a285.41 285.41 0 0 0-31.08-1.59c-30.75 0-51.81 18.77-51.81 53.24v29.71h-34.82v40.28h34.78v103.32h41.6v-103.35h34.69z\' fill=\'#fff\'/></svg>',
    'googleIcon': '<svg width=\'16\' height=\'16\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 18 18\'><title>googleIcon</title><g><path d=\'M17.64 9.2a10.34 10.34 0 0 0-.16-1.84h-8.48v3.48h4.84a4.14 4.14 0 0 1-1.84 2.72v2.26h3a8.78 8.78 0 0 0 2.64-6.62z\' fill=\'#4285f4\'/><path d=\'M9 18a8.59 8.59 0 0 0 6-2.18l-3-2.26a5.43 5.43 0 0 1-8-2.85h-3v2.29a9 9 0 0 0 8 5z\' fill=\'#34a853\'/><path d=\'M4 10.71a5.32 5.32 0 0 1 0-3.42v-2.29h-3a9 9 0 0 0 0 8l3-2.33z\' fill=\'#fbbc05\'/><path d=\'M9 3.58a4.86 4.86 0 0 1 3.44 1.35l2.56-2.59a8.65 8.65 0 0 0-6-2.34 9 9 0 0 0-8 5l3 2.29a5.36 5.36 0 0 1 5-3.71z\' fill=\'#ea4335\'/><path d=\'M0 0h18v18h-18v-18z\' fill=\'none\'/></g></svg>',
    'lytics': '<a href=\'https://www.getlytics.com?utm_source=pathfora&amp;utm_medium=web&amp;utm_campaign=personalization\' target=\'_blank\'><svg width=\'120\' height=\'30\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 143.97 36.85\'><title>lytics</title><path d=\'M122.26 11.36h.1c1.41-.39 2.33-1 2.2-2.94 0-.7-.28-1.06-.69-1.06-.7 0-1.3 1.38-1.37 1.53l-.09.21a3.22 3.22 0 0 0-.5 2 .38.38 0 0 0 .36.25\' transform=\'translate(-.85)\'/><path d=\'M88 5.27a.76.76 0 0 0-1.09.73v.18a1.57 1.57 0 0 0 .45.93 8.78 8.78 0 0 0 6 2.6h.21a.12.12 0 0 1 .13.14 32 32 0 0 1-2 8 1.76 1.76 0 0 1-1 1.17.6.6 0 0 1-.26-.07c-.32-.16-.74-.41-1.18-.67a13.8 13.8 0 0 0-1.72-.93 15.11 15.11 0 0 0-3.88-1.22c-1.81-.2-4.09.56-4.47 2.52a4.7 4.7 0 0 0 2 4.47 10 10 0 0 0 5.19 1.75 6.34 6.34 0 0 0 3.74-1.24l.47-.39c.27-.23.82-.69 1.13-.9a.12.12 0 0 1 .15 0l.5.41a7.84 7.84 0 0 0 .62.5 7.72 7.72 0 0 0 3.54 1.33h.58a5.21 5.21 0 0 0 2.62-.66.12.12 0 0 1 .15 0 2.19 2.19 0 0 0 1.6.68c1.75 0 3.76-1.83 5.06-3.29v.1a8.92 8.92 0 0 1-.83 2.69 7.53 7.53 0 0 1-1.06 1.33l-.47.52a35.84 35.84 0 0 0-3 4.07c-.9 1.43-1.67 2.95-1.31 4.35a3.2 3.2 0 0 0 1.65 2 3.39 3.39 0 0 0 1.67.49c2.09 0 3.25-2.42 3.75-3.86a16.38 16.38 0 0 0 .82-4c.07-.6.14-1.22.25-1.94l.08-.59a3.35 3.35 0 0 1 .8-2.22c.64-.57 1.28-1.17 1.89-1.74l.09-.09.72-.67.28-.25a.12.12 0 0 1 .2.06 4.52 4.52 0 0 0 .71 1.61 3.32 3.32 0 0 0 2.73 1.36 4 4 0 0 0 2.76-1.15 5.29 5.29 0 0 0 .53-.72.12.12 0 0 1 .2 0 2.1 2.1 0 0 0 .47.49 3.52 3.52 0 0 0 2.05.91c.87 0 1.54-.6 2.48-1.5a2.14 2.14 0 0 0 .29-.4.12.12 0 0 1 .21 0l.23.39a4.53 4.53 0 0 0 3.12 2 9.87 9.87 0 0 0 1.46.12 5.58 5.58 0 0 0 4.47-2.09.12.12 0 0 1 .19 0 5.41 5.41 0 0 0 .84.93 5.35 5.35 0 0 0 3.32 1.21 3 3 0 0 0 3.05-2.22 1.33 1.33 0 0 1 1.23-1.29c.67-.25 2.25-.95 2.45-2.16a.77.77 0 0 0-.14-.66.69.69 0 0 0-.55-.23 5.83 5.83 0 0 0-2.08.81 10.5 10.5 0 0 1-1 .46.12.12 0 0 1-.14 0 2.78 2.78 0 0 1-.24-.67 3.12 3.12 0 0 0-.12-.4 32.49 32.49 0 0 0-1.77-3.46 4.53 4.53 0 0 1-.25-.57 3 3 0 0 0-.61-1.1 2.89 2.89 0 0 0-1.53-.45.74.74 0 0 0-.8.42 1.23 1.23 0 0 0 .07.9l.08.26a2.77 2.77 0 0 1-.06.76 3.65 3.65 0 0 1-.69 1.44l-.14.18c-.3.37-.52.65-.67.87a.68.68 0 0 0-.28-.06.67.67 0 0 0-.52.25 3.21 3.21 0 0 0-.47 1.67v.06a13.23 13.23 0 0 0-.76 1.12c-.16.26-.31.5-.42.63a3.3 3.3 0 0 1-2.47 1 3.65 3.65 0 0 1-2.42-.95 1.76 1.76 0 0 1-.56-1.35 6.7 6.7 0 0 1 1.92-4.19 2.4 2.4 0 0 1 1.44-.77.66.66 0 0 1 .32-.02c.4.21.38.32.07.91a1.77 1.77 0 0 0-.3 1.26.48.48 0 0 0 .24.3l.72.4a.51.51 0 0 0 .63-.1 3.19 3.19 0 0 0 .83-3.35c-.48-1.07-1.71-1.59-3.25-1.34a6.61 6.61 0 0 0-4.9 5l-.09.44-.38.66c-.52.92-1.16 2.06-2 2.37a2.1 2.1 0 0 1-.68.17h-.06a3.3 3.3 0 0 1 .12-1.07l.08-.39a15.21 15.21 0 0 1 .78-2.53 12.54 12.54 0 0 0 .91-3.4 1.45 1.45 0 0 0-.4-1.11 1.2 1.2 0 0 0-.86-.41.94.94 0 0 0-.82.51 22.22 22.22 0 0 0-2.13 6.27v.06l-.28.37a7 7 0 0 1-2.37 2.32 1 1 0 0 1-1.22-.23 2 2 0 0 1-.21-1.7c.35-1.23.66-2.49 1-3.75a34.52 34.52 0 0 0 1.23-3.54l.1-.08c.85-.15 1.72-.3 2.56-.41.28 0 .56-.05.85-.07h.63a.5.5 0 0 0 .42-.31 1 1 0 0 0-.07-.88 1.79 1.79 0 0 0-1.4-.74h-.08c-.61 0-1.31 0-2 .08l-.13-.17a8.47 8.47 0 0 0 .46-2.67 2.68 2.68 0 0 0-.32-1.49 1.38 1.38 0 0 0-1.5-.67 2.07 2.07 0 0 0-1.13 1.48 14.92 14.92 0 0 0-.41 1.59c-.27.62-.56 1.33-.85 2.1l-.28.22h-.84a17.31 17.31 0 0 0-2.62.32 1.21 1.21 0 0 0-.91.76.81.81 0 0 0 .08.66 2.49 2.49 0 0 0 1.37 1 2 2 0 0 0 .49.06 8.68 8.68 0 0 0 1.61-.23h.14c-.12.41-.24.83-.35 1.26-.21.82-.37 1.58-.48 2.3-.29.51-.6 1-.94 1.49a12.48 12.48 0 0 1-1.83 1.9l-.23.38a39.76 39.76 0 0 1 .76-5.35.49.49 0 0 0-.16-.46l-.69-.59a.51.51 0 0 0-.33-.12h-.25a.38.38 0 0 0-.33.19c-.51.9-.9 1.7-1.27 2.47a23.51 23.51 0 0 1-2.07 3.66 2.8 2.8 0 0 1-2.05 1 1.06 1.06 0 0 1-.72-.23v-.08a1.38 1.38 0 0 0-.12-.41l-.15-.25v-.14a21.73 21.73 0 0 1 1.38-6.69 1.88 1.88 0 0 0 .15-1.67 1 1 0 0 0-.9-.39h-.25c-1.18.12-2.27 2.69-2.28 2.72a15.2 15.2 0 0 0-1 6.62.12.12 0 0 1-.06.12 3.83 3.83 0 0 1-2 .58c-.76-.06-1.72-.25-3.45-1.72a.12.12 0 0 1 0-.15 27 27 0 0 0 2.88-9.57 1.32 1.32 0 0 1 .28-.87 3.25 3.25 0 0 1 .87-.11h.14a17 17 0 0 0 2.8-.36 11.86 11.86 0 0 0 3.94-1.74 5.54 5.54 0 0 0 2.72-3.76 3.2 3.2 0 0 0-.85-2.5 3.83 3.83 0 0 0-3.09-1.2 8.54 8.54 0 0 0-5.3 2.31 21.6 21.6 0 0 0-2.48 3.16 6.87 6.87 0 0 0-.37.7 2 2 0 0 1-.92 1.19 6.38 6.38 0 0 1-4.63-1.36 5 5 0 0 0-.77-.52l-.43-.21zm14.3-2.93l.34-.11a2.16 2.16 0 0 1 2 .23.69.69 0 0 1 .1.6 4 4 0 0 1-1.64 2.3 11.44 11.44 0 0 1-5.63 1.88.12.12 0 0 1-.12-.18 9.82 9.82 0 0 1 5-4.73zm-17.3 19.95a4.36 4.36 0 0 1-3.39-2.16 1.22 1.22 0 0 1 .1-1.34 1.67 1.67 0 0 1 1.29-.44c2 0 5.08 1.71 6.41 2.47a.12.12 0 0 1 0 .18c-.74 1-2.16 1.42-4.44 1.29zm20.4 6.43c-.17 1-.35 1.94-.52 2.67-.33 1.4-.82 2.36-2.2 2.8h-.35a.39.39 0 0 1-.41-.14c-.09-.17-.25-1 1.71-3.86l.07-.1c.51-.76 1.1-1.54 1.65-2.23a.12.12 0 0 1 .22.1zm31.7-11.51h.2a9.64 9.64 0 0 1 1.55 2.64.12.12 0 0 1-.11.17 4.59 4.59 0 0 1-2.08-.47.72.72 0 0 1-.42-.43 3.23 3.23 0 0 1 .86-1.9zm1.85 5a.73.73 0 0 1-.88.61 3.3 3.3 0 0 1-1.65-.5 2.36 2.36 0 0 1-.65-1.05.12.12 0 0 1 .23-.17 6.66 6.66 0 0 0 2.42.9h.58v.18zM.85 21.74v-8h3.52a2.51 2.51 0 1 1 0 5h-2.12v3h-1.4zm4.69-5.49a1.26 1.26 0 0 0-1.37-1.25h-1.92v2.54h1.92a1.26 1.26 0 0 0 1.37-1.3zM7.79 17.74a4 4 0 0 1 4.09-4.14 4 4 0 0 1 4.12 4.14 4 4 0 0 1-4.09 4.14 4 4 0 0 1-4.12-4.14zm6.74 0a2.66 2.66 0 1 0-5.3 0 2.66 2.66 0 1 0 5.3 0z\' transform=\'translate(-.85)\'/><path d=\'M22.35 21.74l-1.56-5.9-1.55 5.9h-1.49l-2.29-8h1.57l1.56 6.16 1.66-6.16h1.12l1.66 6.16 1.55-6.16h1.57l-2.28 8h-1.52zM27.07 21.74v-8h5.48v1.26h-4.07v2h4v1.24h-4v2.26h4.07v1.24h-5.48z\'/><path d=\'M39.42 21.74l-1.77-3h-1.4v3h-1.4v-8h3.51a2.43 2.43 0 0 1 2.64 2.5 2.24 2.24 0 0 1-1.9 2.35l2 3.14h-1.68zm.12-5.49a1.26 1.26 0 0 0-1.37-1.25h-1.92v2.54h1.92a1.26 1.26 0 0 0 1.37-1.3z\' transform=\'translate(-.85)\'/><path d=\'M41.53 21.74v-8h5.48v1.26h-4.07v2h4v1.24h-4v2.26h4.08v1.24h-5.49z\'/><path d=\'M49.31 21.74v-8h3a3.91 3.91 0 0 1 4.19 4 3.9 3.9 0 0 1-4.19 4h-3zm5.72-4a2.59 2.59 0 0 0-2.75-2.74h-1.57v5.5h1.57a2.63 2.63 0 0 0 2.72-2.76zM60.91 21.74v-8h3.93a2 2 0 0 1 2.28 2 1.8 1.8 0 0 1-1.39 1.83 2 2 0 0 1 1.55 2 2.1 2.1 0 0 1-2.28 2.17h-4zm4.77-5.74a1 1 0 0 0-1.13-1h-2.24v2h2.24a1 1 0 0 0 1.13-1zm.16 3.37a1.1 1.1 0 0 0-1.22-1.1h-2.3v2.23h2.3a1.08 1.08 0 0 0 1.22-1.12z\' transform=\'translate(-.85)\'/><path d=\'M69.74 21.74v-3.33l-3.11-4.68h1.61l2.21 3.43 2.18-3.43h1.61l-3.09 4.68v3.32h-1.4z\'/></svg></a>'
  }
};
  /* eslint-enable indent */

  // NOTE Event callback types
  var callbackTypes = {
    INIT: 'widgetInitialized',
    LOAD: 'widgetLoaded',
    CLICK: 'buttonClicked',
    FORM_SUBMIT: 'formSubmitted',
    MODAL_OPEN: 'modalOpened',
    MODAL_CLOSE: 'modalClosed'
  };

  // NOTE AB testing types
  /**
   * @function createABTestingModePreset
   * @description Create an A/B testing object preset from groups list
   * @returns {object} A/B testing object instance
   */
  var createABTestingModePreset = function() {
    var groups = [];

    for (var i = 0; i < arguments.length; i++) {
      groups.push(arguments[i]);
    }

    var groupsSum = groups.reduce(function(sum, element) {
      return sum + element;
    });

    // NOTE If groups collapse into a number greater than 1, normalize
    if (groupsSum > 1) {
      var groupsSumRatio = 1 / groupsSum;

      groups = groups.map(function(element) {
        return element * groupsSumRatio;
      });
    }

    return {
      groups: groups,
      groupsNumber: groups.length
    };
  };

  /*
   * @global
   * @property abHashMD5
   * @description Hash used as the AB testing cookie (MD5 'ab')
   */
  var abHashMD5 = '187ef4436122d1cc2f40dc2b92f0eba0';
  /*
   * @global
   * @property abTestingTypes
   * @description AB testing groups definitions
   */
  var abTestingTypes = {
    '100': createABTestingModePreset(100),
    '50/50': createABTestingModePreset(50, 50),
    '80/20': createABTestingModePreset(80, 20)
  };

  // NOTE Empty Pathfora data object, containg all data stored by lib
  /*
   * @global
   * @property pathforaDataObject
   * @description Pathfora data state object
   */
  var pathforaDataObject = {
    pageViews: 0,
    timeSpentOnPage: 0,
    closedWidgets: [],
    completedActions: [],
    cancelledActions: [],
    displayedWidgets: [],
    abTestingGroups: [],
    socialNetworks: {}
  };

  /**
   * @function appendPathforaStylesheet
   * @description Append pathfora stylesheet to document
   */
  var appendPathforaStylesheet = function() {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');

    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', '//c.lytics.io/static/pathfora.min.css');

    head.appendChild(link);
  };

  /**
   * @namespace
   * @name utils
   * @description Helper utility functions
   */
  utils = {

    /**
     * @description Check if DOM node has the provided class
     * @param   {object}  DOMNode   DOM element
     * @param   {string}  className class name
     */
    hasClass: function(DOMNode, className) {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(DOMNode.className);
    },

    /**
     * @description Add new classes to the DOM node (removes duplicates)
     * @param   {object} DOMNode   DOM element
     * @param   {string} className class name(s)
     */
    addClass: function(DOMNode, className) {
      // NOTE Not necessary, but leaves a clean code after mutations
      this.removeClass(DOMNode, className);

      DOMNode.className = [
        DOMNode.className,
        className
      ].join(' ');
    },

    /**
     * @description Remove classes from the DOM node
     * @param {object} DOMNode   DOM element
     * @param {string} className class name(s)
     */
    removeClass: function(DOMNode, className) {
      var findClassRegexp = new RegExp([
        '(^|\\b)',
        className.split(' ').join('|'),
        '(\\b|$)'
      ].join(''), 'gi');

      DOMNode.className = DOMNode.className.replace(findClassRegexp, ' ');
    },

    /**
     * @description Read browser Cookie value of specified name
     * @param   {string} name cookie name
     * @returns {string} cookie value
     */
    readCookie: function(name) {
      var cookies = document.cookie;
      var findCookieRegexp = cookies.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');

      return findCookieRegexp ? findCookieRegexp.pop() : null;
    },

    /**
     * @description Save a new cookie
     * @param {string} name  cookie name
     * @param {string} value cookie value
     * @param {number} days  days until the cookie expires
     */
    saveCookie: function(name, value, expiration) {
      var expires;

      if (expiration) {
        expires = '; expires=' + expiration.toUTCString();
      } else {
        expires = '';
      }

      context.document.cookie = [
        name,
        '=',
        value,
        expires,
        '; path = /'
      ].join('');
    },

    /**
     * @description Generate unique ID
     * @returns {string} unique id
     */
    generateUniqueId: function() {
      var s4;

      if (typeof s4 === 'undefined') {
        s4 = function() {
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
    },

    /**
     * @description Return the basic object required for targetting
     * @returns {obj}
     */
    initWidgetScaffold: function() {
      return {
        target: [],
        exclude: [],
        inverse: []
      };
    },

    /**
     * @description Insert widget into existing scaffold
     * @param {obj} scaffold
     * @param {string} segment
     * @param {obj} widget
     * @throws {Error} error
     */
    insertWidget: function(method, segment, widget, config) {
      // assume that we need to add a new widget until proved otherwise
      var subject;
      var makeNew = true;

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
          'widgets': [ widget ]
        });
      }
    },

    /**
     * @description Escape URIs optionally without double-encoding
     * @param   {string}  text                 the uri text to escape
     * @param   {obj}     options
     * @param   {boolean} options.usePlus      escape `space` to `+` instead of `%20`
     * @param   {boolean} options.keepEscaped  do not double-encode text
     * @returns {string}  uri                  the uri-escaped text
     */
    escapeURI: function(text, options) {
      // NOTE This was ported from various bits of C++ code from Chromium
      options || (options = {});

      var length = text.length;
      var escaped = [];
      var usePlus = options.usePlus || false;
      var keepEscaped = options.keepEscaped || false;

      function isHexDigit(c) {
        return /[0-9A-Fa-f]/.test(c);
      }

      function toHexDigit(i) {
        return '0123456789ABCDEF'[i];
      }

      function containsChar(charMap, charCode) {
        return (charMap[charCode >> 5] & (1 << (charCode & 31))) !== 0;
      }

      function isURISeparator(c) {
        return [ '#', ':', ';', '/', '?', '$', '&', '+', ',', '@', '=' ].indexOf(c) !== -1;
      }

      function shouldEscape(charText) {
        return !isURISeparator(charText) && containsChar([
          0xffffffff, 0xf80008fd, 0x78000001, 0xb8000001,
          0xffffffff, 0xffffffff, 0xffffffff, 0xffffffff
        ], charText.charCodeAt(0));
      }

      for (var index = 0; index < length; index++) {
        var charText = text[index];
        var charCode = text.charCodeAt(index);

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
  };

  /**
   * @namespace
   * @name core
   * @description Core library function set
   */
  core = {
    delayedWidgets: {},
    openedWidgets: [],
    initializedWidgets: [],
    watchers: [],
    expiration: null,
    valid: true,
    pageViews: ~~utils.readCookie('PathforaPageView'),

    /**
     * @description Display a single widget
     *              or register a handler for displaying it later
     * @param {object} widget
     */
    initializeWidget: function(widget) {
      var watcher;
      var condition = widget.displayConditions;

      core.valid = true;

      // NOTE Default cookie expiration is one year from now
      core.expiration = new Date();
      core.expiration.setDate(core.expiration.getDate() + 365);

      if (widget.pushDown) {
        if (widget.layout === 'bar' && (widget.position === 'top-fixed' || widget.position === 'top-absolute')) {
          utils.addClass(document.querySelector(widget.pushDown), 'pf-push-down');
        } else {
          throw new Error('Only top positioned bar widgets may have a pushDown property');
        }
      }

      if (condition.date) {
        core.valid = core.valid && core.dateChecker(condition.date);
      }

      if (condition.displayWhenElementVisible) {
        watcher = core.registerElementWatcher(condition.displayWhenElementVisible);
        core.watchers.push(watcher);
        core.initializeScrollWatchers(core.watchers, widget);
      }

      if (condition.scrollPercentageToDisplay) {
        watcher = core.registerPositionWatcher(condition.scrollPercentageToDisplay);
        core.watchers.push(watcher);
        core.initializeScrollWatchers(core.watchers, widget);
      }

      if (condition.pageVisits) {
        core.valid = core.valid && core.pageVisitsChecker(condition.pageVisits);
      }

      if (condition.hideAfterAction) {
        core.valid = core.valid && core.hideAfterActionChecker(condition.hideAfterAction, widget);
      }
      if (condition.urlContains) {
        core.valid = core.valid && core.urlChecker(condition.urlContains);
      }

      core.valid = core.valid && condition.showOnInit;

      if (core.watchers.length === 0) {
        if (condition.impressions) {
          core.valid = core.valid && core.impressionsChecker(condition.impressions, widget);
        }

        if (core.valid) {
          context.pathfora.showWidget(widget);
        }
      }
    },

    /**
     * @description Take array of scroll aware elements
     *              and check if it should display any
     *              when user is scrolling the page
     * @param {array} watchers
     */
    initializeScrollWatchers: function(watchers, widget) {
      if (!core.scrollListener) {
        core.scrollListener = function() {
          var valid;

          for (var key in watchers) {
            if (watchers.hasOwnProperty(key) && watchers[key] !== null) {
              valid = core.valid && watchers[key].check();
            }
          }

          if (widget.displayConditions.impressions && valid) {
            valid = core.impressionsChecker(widget.displayConditions.impressions, widget);
          }

          if (valid) {
            context.pathfora.showWidget(widget);
          }
        };

        // FUTURE Discuss https://www.npmjs.com/package/ie8 polyfill
        if (typeof context.addEventListener === 'function') {
          context.addEventListener('scroll', core.scrollListener, false);
        } else {
          context.onscroll = core.scrollListener;
        }
      }
      return true;
    },

    /**
     * @description Parse url queries as an object
     * @param {string} url
     */
    parseQuery: function(url) {
      var query = {};
      var pieces = utils.escapeURI(url, { keepEscaped: true }).split('?');

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
    },

    /**
     * @description Compare query params between the url
     *              the user is visiting and the match
     *              rule provided
     * @param {obj} queries
     * @param {obj} matchQueries
     * @param {string} rule
     */
    compareQueries: function(query, matchQuery, rule) {
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
    },

    urlChecker: function(phrases) {
      var url = utils.escapeURI(window.location.href, { keepEscaped: true });
      var simpleurl = window.location.hostname + window.location.pathname;
      var queries = core.parseQuery(url);
      var valid = false;

      if (!(phrases instanceof Array)) {
        phrases = Object.keys(phrases).map(function(key) {
          return phrases[key];
        });
      }

      // array of urlContains params is an or list, so if any are true evaluate valid to true
      if (phrases.indexOf('*') === -1) {
        phrases.forEach(function(phrase) {
          // legacy match allows for an array of strings, check if we are legacy or current object approach
          switch (typeof phrase) {
            case 'string':
              if (url.indexOf(utils.escapeURI(phrase.split('?')[0], { keepEscaped: true })) !== -1) {
                valid = core.compareQueries(queries, core.parseQuery(phrase), 'substring') && true;
              }
              break;

            case 'object':
              if (phrase.match && phrase.value) {
                var phraseValue = utils.escapeURI(phrase.value, { keepEscaped: true });

                switch (phrase.match) {
              // simple match
                  case 'simple':
                    if (simpleurl === phrase.value) {
                      valid = true;
                    }
                    break;

              // exact match
                  case 'exact':
                    if (url.split('?')[0].replace(/\/$/, '') === phraseValue.split('?')[0].replace(/\/$/, '')) {
                      valid = core.compareQueries(queries, core.parseQuery(phraseValue), phrase.match) && true;
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
                      valid = core.compareQueries(queries, core.parseQuery(phraseValue), phrase.match) && true;
                    }
                    break;
                }
              } else {
                /* eslint-disable no-console */
                console.log('invalid display conditions');
                /* eslint-enable no-console */
              }
              break;

            default:
              /* eslint-disable no-console */
              console.log('invalid display conditions');
              /* eslint-enable no-console */
              break;
          }
        });
      } else {
        valid = true;
      }

      return valid;
    },

    pageVisitsChecker: function(pageVisitsRequired) {
      return (core.pageViews >= pageVisitsRequired);
    },

    dateChecker: function(date) {
      var valid = true;
      var today = Date.now();

      if (date.start_at && today < new Date(date.start_at).getTime()) {
        valid = false;
      }

      if (date.end_at && today > new Date(date.end_at).getTime()) {
        valid = false;
      }

      return valid;
    },

    impressionsChecker: function(impressionConstraints, widget) {
      var parts, totalImpressions;
      var valid = true;
      var id = 'PathforaImpressions_' + widget.id;
      var sessionImpressions = ~~sessionStorage.getItem(id);
      var total = utils.readCookie(id);
      var now = Date.now();

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
        // NOTE Retain support for cookies with comma - can remove on 5/2/2016
        parts = parts.length === 1 ? total.split(',') : parts;

        if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < impressionConstraints.buffer) {
          valid = false;
        }
      }

      if (sessionImpressions > impressionConstraints.session || totalImpressions > impressionConstraints.total) {
        valid = false;
      }

      if (valid && core.valid) {
        sessionStorage.setItem(id, sessionImpressions);
        utils.saveCookie(id, Math.min(totalImpressions, 9998) + '|' + now, core.expiration);
      }

      return valid;
    },

    hideAfterActionChecker: function(hideAfterActionConstraints, widget) {
      var parts;
      var valid = true;
      var now = Date.now();
      var confirm = utils.readCookie('PathforaConfirm_' + widget.id);
      var cancel = utils.readCookie('PathforaCancel_' + widget.id);
      var closed = utils.readCookie('PathforaClosed_' + widget.id);

      if (hideAfterActionConstraints.confirm && confirm) {
        parts = confirm.split('|');
        // NOTE Retain support for cookies with comma - can remove on 5/2/2016
        parts = parts.length === 1 ? confirm.split(',') : parts;

        if (parseInt(parts[0], 10) >= hideAfterActionConstraints.confirm.hideCount) {
          valid = false;
        }

        if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.confirm.duration) {
          valid = false;
        }
      }

      if (hideAfterActionConstraints.cancel && cancel) {
        parts = cancel.split('|');
        // NOTE Retain support for cookies with comma - can remove on 5/2/2016
        parts = parts.length === 1 ? cancel.split(',') : parts;

        if (parseInt(parts[0], 10) >= hideAfterActionConstraints.cancel.hideCount) {
          valid = false;
        }

        if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.cancel.duration) {
          valid = false;
        }
      }

      if (hideAfterActionConstraints.closed && closed) {
        parts = closed.split('|');
        // NOTE Retain support for cookies with comma - can remove on 5/2/2016
        parts = parts.length === 1 ? closed.split(',') : parts;

        if (parseInt(parts[0], 10) >= hideAfterActionConstraints.closed.hideCount) {
          valid = false;
        }

        if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.closed.duration) {
          valid = false;
        }
      }

      return valid;
    },

    /**
     * @description Take array of watchers and clear it
     * @param {array} watchers
     */
    removeScrollWatchers: function(watchers) {
      watchers.forEach(function(watcher) {
        core.removeWatcher(watcher);
      });

      context.removeEventListener('scroll', core.scrollListener, false);
    },

    /**
     * @description Register a time-tiggered widget
     * @param {object} widget
     */
    registerDelayedWidget: function(widget) {
      this.delayedWidgets[widget.id] = setTimeout(function() {
        core.initializeWidget(widget);
      }, widget.displayConditions.showDelay * 1000);
    },

    /**
     * @description Prevent timely delayed widget from initialization
     * @param {object} widget
     */
    cancelDelayedWidget: function(widget) {
      var delayObj = this.delayedWidgets[widget.id];

      if (delayObj) {
        clearTimeout(delayObj);
        delete this.delayedWidgets[widget.id];
      }
    },

    /**
     * @description Register a scroll position-triggered widget
     * @param   {number} percent scroll percentage at
     *                   which the widget should be displayed
     * @param   {object} widget
     * @returns {object} object, containing onscroll callback function 'check'
     */
    registerPositionWatcher: function(percent) {
      var watcher = {
        check: function() {
          var positionInPixels = (document.body.offsetHeight - window.innerHeight) * percent / 100;
          var offset = document.documentElement.scrollTop || document.body.scrollTop;
          if (offset >= positionInPixels) {
            core.removeWatcher(watcher);
            return true;
          }
          return false;
        }
      };

      return watcher;
    },

    /**
     * @description Register element visibility-triggered widget
     * @param   {string} id     trigger element id (DOMElement.id property)
     * @param   {object} widget
     * @returns {object} object, containing onscroll callback function 'check', and
     *                   triggering element reference 'elem'
     */
    registerElementWatcher: function(selector) {
      var watcher = {
        elem: document.querySelector(selector),

        check: function() {
          var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
          var scrolledToBottom = window.innerHeight + scrollTop >= document.body.offsetHeight;

          if (watcher.elem.offsetTop - window.innerHeight / 2 <= scrollTop || scrolledToBottom) {
            core.removeWatcher(watcher);
            return true;
          }
          return false;
        }
      };

      return watcher;
    },

    /**
     * @description Unassign a watcher
     * @param {object} watcher
     */
    removeWatcher: function(watcher) {
      for (var key in core.watchers) {
        if (core.watchers.hasOwnProperty(key) && watcher === core.watchers[key]) {
          core.watchers.splice(key, 1);
        }
      }
    },

    /**
     * @description Construct DOM layout for the widget
     * @throws {Error} error
     * @param {object} widget
     * @param {object} config
     */
    constructWidgetLayout: function(widget, config) {
      var node, child, i;
      var widgetContent = widget.querySelector('.pf-widget-content');
      var widgetCancel = widget.querySelector('.pf-widget-cancel');
      var widgetOk = widget.querySelector('.pf-widget-ok');
      var widgetHeadline = widget.querySelectorAll('.pf-widget-headline');
      var widgetBody = widget.querySelector('.pf-widget-body');
      var widgetMessage = widget.querySelector('.pf-widget-message');
      var widgetClose = widget.querySelector('.pf-widget-close');

      if (widgetCancel !== null && !config.cancelShow || config.layout === 'inline') {
        node = widgetCancel;

        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }

      if (config.layout === 'inline') {
        node = widgetClose;

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

      switch (config.layout) {
        case 'modal':
        case 'slideout':
        case 'sitegate':
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
            case 'inline':
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

          var getFormElement = function(field) {
            if (field === 'name') {
              return widget.querySelector('input[name="username"]');
            }

            return widget.querySelector('form [name="' + field + '"]');
          };

        // Set placeholders
          Object.keys(config.placeholders).forEach(function(field) {
            var element = getFormElement(field);

            if (element && typeof element.placeholder !== 'undefined') {
              element.placeholder = config.placeholders[field];
            } else if (element && typeof element.options !== 'undefined') {
              element.options[0].innerHTML = config.placeholders[field];
            }
          });

        // Set required Fields
          Object.keys(config.required).forEach(function(field) {
            var element = getFormElement(field);

            if (element && config.required[field]) {
              element.setAttribute('required', '');
            }
          });

        // Hide fields
          Object.keys(config.fields).forEach(function(field) {
            var parent, prev, next;
            var element = getFormElement(field);

            if (element && !config.fields[field]) {
              parent = element.parentNode;
              prev = element.previousElementSibling;
              next = element.nextElementSibling;

              if (parent) {
              // NOTE: collapse half-width inputs
                if (element.className.indexOf('pf-field-half-width') !== -1) {
                  if (prev && prev.className.indexOf('pf-field-half-width') !== -1) {
                    utils.removeClass(prev, 'pf-field-half-width');
                  }

                  if (next && next.className.indexOf('pf-field-half-width') !== -1) {
                    utils.removeClass(next, 'pf-field-half-width');
                  }
                }

                parent.removeChild(element);
              }
            }
          });

        // For select boxes we need to control the color of
        // the placeholder text
          var selects = widget.querySelectorAll('select');

          for (i = 0; i < selects.length; i++) {
          // default class indicates the placeholder text color
            utils.addClass(selects[i], 'default');

            selects[i].onchange = function() {
              if (this.selectedIndex !== 0) {
                utils.removeClass(this, 'default');
              } else {
                utils.addClass(this, 'default');
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
    },

    /**
     * @description Append event handlers to the widget
     * @param {object} widget
     * @param {object} config
     */
    constructWidgetActions: function(widget, config) {
      var widgetOnModalClose, updateActionCookie, widgetOnButtonClick;
      var widgetOk = widget.querySelector('.pf-widget-ok');

      switch (config.type) {
        case 'form':
        case 'sitegate':
        case 'subscription':
          var widgetForm = widget.querySelector('form');

          var widgetOnFormSubmit = function(event) {
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

            if (widgetAction) {
              core.trackWidgetAction(widgetAction, config, event.target);
            }

            if (typeof config.onSubmit === 'function') {
              config.onSubmit(callbackTypes.FORM_SUBMIT, {
                widget: widget,
                event: event,
                data: Array.prototype.slice.call(
                widgetForm.querySelectorAll('input, textarea, select')
              ).map(function(element) {
                return {
                  name: element.name || element.id,
                  value: element.value
                };
              })
              });
            }
          };

          if (widgetForm.addEventListener) {
            widgetForm.addEventListener('submit', widgetOnFormSubmit);
          } else {
            widgetForm.attachEvent('submit', widgetOnFormSubmit);
          }
          break;
      }

      switch (config.layout) {
        case 'folding':
          var widgetAllCaptions = widget.querySelectorAll('.pf-widget-caption, .pf-widget-caption-left');
          var widgetFirstCaption = widget.querySelector('.pf-widget-caption');

          if (config.position !== 'left') {
            setTimeout(function() {
              var height = widget.offsetHeight - widgetFirstCaption.offsetHeight;
              widget.style.bottom = -height + 'px';
            }, 0);
          }

          for (var i = widgetAllCaptions.length - 1; i >= 0; i--) {
            widgetAllCaptions[i].onclick = function() {
              if (utils.hasClass(widget, 'opened')) {
                utils.removeClass(widget, 'opened');
              } else {
                utils.addClass(widget, 'opened');
              }
            };
          }
          break;

        case 'button':
          if (typeof config.onClick === 'function') {
            widgetOnButtonClick = function(event) {
              config.onClick(callbackTypes.CLICK, {
                widget: widget,
                event: event
              });
            };
          }
          break;

        case 'modal':
        case 'slideout':
        case 'bar':
        case 'inline':
          var widgetCancel = widget.querySelector('.pf-widget-cancel');
          var widgetClose = widget.querySelector('.pf-widget-close');

          widgetOnModalClose = function(event) {
            if (typeof config.onModalClose === 'function') {
              config.onModalClose(callbackTypes.MODAL_CLOSE, {
                widget: widget,
                event: event
              });
            }
          };

          updateActionCookie = function(name) {
            var ct;
            var val = utils.readCookie(name);
            var duration = Date.now();

            if (val) {
              val = val.split('|');
            // NOTE Retain support for cookies with comma - can remove on 5/2/2016
              val = val.length === 1 ? val.split(',') : val;
              ct = Math.min(parseInt(val[0], 10), 9998) + 1;
            } else {
              ct = 1;
            }

            utils.saveCookie(name, ct + '|' + duration, core.expiration);
          };

          if (widgetClose) {
            widgetClose.onclick = function(event) {
              context.pathfora.closeWidget(widget.id);
              updateActionCookie('PathforaClosed_' + widget.id);
              widgetOnModalClose(event);
            };
          }

          if (widgetCancel) {
            if (typeof config.cancelAction === 'object') {
              widgetCancel.onclick = function(event) {
                core.trackWidgetAction('cancel', config);
                if (typeof config.cancelAction.callback === 'function') {
                  config.cancelAction.callback();
                }
                updateActionCookie('PathforaCancel_' + widget.id);
                widgetOnModalClose(event);
              };
            } else {
              widgetCancel.onclick = function(event) {
                core.trackWidgetAction('cancel', config);
                updateActionCookie('PathforaCancel_' + widget.id);
                widgetOnModalClose(event);
              };
            }
          }
        default:
          break;
      }

      if (typeof config.confirmAction === 'object') {
        widgetOk.onclick = function() {
          core.trackWidgetAction('confirm', config);
          if (typeof updateActionCookie === 'function') {
            updateActionCookie('PathforaConfirm_' + widget.id);
          }
          if (typeof config.confirmAction.callback === 'function') {
            config.confirmAction.callback();
          }
          if (typeof widgetOnButtonClick === 'function') {
            widgetOnButtonClick(event);
          }
          if (typeof widgetOnModalClose === 'function') {
            widgetOnModalClose(event);
          }

          if (config.layout !== 'inline') {
            context.pathfora.closeWidget(widget.id, true);
          }
        };
      } else if (config.type === 'message') {
        widgetOk.onclick = function() {
          core.trackWidgetAction('confirm', config);
          if (typeof updateActionCookie === 'function') {
            updateActionCookie('PathforaConfirm_' + widget.id);
          }
          if (typeof widgetOnButtonClick === 'function') {
            widgetOnButtonClick(event);
          }
          if (config.layout !== 'inline') {
            context.pathfora.closeWidget(widget.id);
          }
        };
      } else if (config.type === 'form' || config.type === 'sitegate' || config.type === 'subscription') {
        widgetOk.onclick = function() {
          var valid = true;

          Array.prototype.slice.call(
            widget.querySelectorAll('input, textarea, select')
          ).forEach(function(inputField) {
            if (inputField.hasAttribute('required') && !inputField.value) {
              valid = false;
            }
          });

          if (valid) {
            if (typeof updateActionCookie === 'function') {
              updateActionCookie('PathforaConfirm_' + widget.id);
            }
            if (typeof widgetOnModalClose === 'function') {
              widgetOnModalClose(event);
            }

            if (config.layout !== 'inline') {
              context.pathfora.closeWidget(widget.id);
            }
          }
        };
      }
    },

    /**
     * @description Build color theme for the widget
     * @param {object} widget
     * @param {object} config
     */
    setupWidgetColors: function(widget, config) {
      if (config.theme) {
        if (config.theme === 'custom') {
          if (config.colors) {
            core.setCustomColors(widget, config.colors);
          }
        } else {
          core.setCustomColors(widget, defaultProps.generic.themes[config.theme]);
        }
      }
    },

    /**
     * @description Generate and set class names for the widget
     * @param {object} widget
     * @param {object} config
     */
    setWidgetClassname: function(widget, config) {
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
    },

    /**
     * @description Setup content recommendation if we have one
     * @param {object} widget
     * @param {object} config
     */
    setupWidgetContentUnit: function(widget, config) {
      var widgetContentUnit = widget.querySelector('.pf-content-unit');

      if (config.recommend && config.content) {
        // Make sure we have content to get
        if (Object.keys(config.content).length > 0) {
          // The top recommendation should be default if we couldn't
          // get one from the api
          var rec = config.content[0];
          var recImage = document.createElement('div');
          var recMeta = document.createElement('div');
          var recTitle = document.createElement('h4');
          var recDesc = document.createElement('p');

          widgetContentUnit.href = rec.url;

          // image div
          recImage.className = 'pf-content-unit-img';
          recImage.style.backgroundImage = "url('" + rec.image + "')";
          widgetContentUnit.appendChild(recImage);

          recMeta.className = 'pf-content-unit-meta';

          // title h4
          recTitle.innerHTML = rec.title;
          recMeta.appendChild(recTitle);

          // description p
          recDesc.innerHTML = rec.description;
          recMeta.appendChild(recDesc);

          widgetContentUnit.appendChild(recMeta);
        }
      }
    },

    /**
     * Validate position for a widget of specific type
     * @param   {object}   widget
     * @param   {object}   config
     */
    validateWidgetPosition: function(widget, config) {
      var choices;

      switch (config.layout) {
        case 'modal':
          choices = [ '' ];
          break;
        case 'slideout':
          choices = [ 'bottom-left', 'bottom-right' ];
          break;
        case 'bar':
          choices = [ 'top-absolute', 'top-fixed', 'bottom-fixed' ];
          break;
        case 'button':
          choices = [ 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right' ];
          break;
        case 'folding':
          choices = [ 'left', 'bottom-left', 'bottom-right' ];
          break;
        case 'inline':
          choices = [];
          break;
      }

      if (choices.indexOf(config.position) === -1) {
        // NOTE config.position + ' is not valid position for ' + config.layout
      }
    },

    /**
     * @description Set default widget position, if current one is invalid
     * @param {object} widget
     * @param {object} config
     */
    setupWidgetPosition: function(widget, config) {
      if (config.position) {
        this.validateWidgetPosition(widget, config);
      } else {
        config.position = defaultPositions[config.layout];
      }
    },

    /**
     * @description Construct DOM element for the widget
     * @param   {object} config
     * @returns {object} widget DOM element
     */
    createWidgetHtml: function(config) {
      var widget = document.createElement('div');

      widget.innerHTML = templates[config.type][config.layout] || '';
      widget.id = config.id;

      this.setupWidgetPosition(widget, config);
      this.constructWidgetActions(widget, config);
      this.setupWidgetContentUnit(widget, config);
      this.setWidgetClassname(widget, config);
      this.constructWidgetLayout(widget, config);
      this.setupWidgetColors(widget, config);

      return widget;
    },

    // FIXME Inefficient and inaccurate, either cache initial time and subtract
    //       or calculate delta
    /**
     * @description Track time spent on page
     */
    trackTimeOnPage: function() {
      core.tickHandler = setInterval(function() {
        pathforaDataObject.timeSpentOnPage += 1;
      }, 1000);
    },

    /**
     * @description Determine whether the user visited the site before (set the cookie)
     * @returns {boolean}
     */
    checkIfUserJustEntered: function() {
      if (!utils.readCookie('PathforaInit')) {
        utils.saveCookie('PathforaInit', true, core.expiration);
        return true;
      }
      return false;
    },

    /**
     * @description Set custom color theme for the widget
     * @param {object} widget
     * @param {object} colors custom theme
     */
    setCustomColors: function(widget, colors) {
      var close = widget.querySelector('.pf-widget-close');
      var headline = widget.querySelector('.pf-widget-headline');
      var headlineLeft = widget.querySelector('.pf-widget-caption-left .pf-widget-headline');
      var cancelBtn = widget.querySelector('.pf-widget-btn.pf-widget-cancel');
      var okBtn = widget.querySelector('.pf-widget-btn.pf-widget-ok');
      var arrow = widget.querySelector('.pf-widget-caption span');
      var arrowLeft = widget.querySelector('.pf-widget-caption-left span');
      var contentUnit = widget.querySelector('.pf-content-unit');
      var contentUnitMeta = widget.querySelector('.pf-content-unit-meta');
      var fields = widget.querySelectorAll('input, textarea, select');
      var branding = widget.querySelector('.branding svg');
      var socialBtns = Array.prototype.slice.call(widget.querySelectorAll('.social-login-btn'));

      if (colors.background) {
        if (utils.hasClass(widget, 'pf-widget-modal')) {
          widget.querySelector('.pf-widget-content').style.backgroundColor = colors.background;
        } else {
          widget.style.backgroundColor = colors.background;
        }
      }

      if (colors.fieldBackground) {
        if (fields.length > 0) {
          for (var i = 0; i < fields.length; i++) {
            fields[i].style.backgroundColor = colors.fieldBackground;
          }
        }
      }

      if (contentUnit && contentUnitMeta) {
        if (colors.actionBackground) {
          contentUnit.style.backgroundColor = colors.actionBackground;
        }

        if (colors.actionText) {
          contentUnitMeta.querySelector('h4').style.color = colors.actionText;
        }

        if (colors.text) {
          contentUnitMeta.querySelector('p').style.color = colors.text;
        }
      }

      if (close && colors.close) {
        close.style.color = colors.close;
      }

      if (headline && colors.headline) {
        headline.style.color = colors.headline;
      }

      if (headlineLeft && colors.headline) {
        headlineLeft.style.color = colors.headline;
      }

      if (arrow && colors.close) {
        arrow.style.color = colors.close;
      }

      if (arrowLeft && colors.close) {
        arrowLeft.style.color = colors.close;
      }

      if (cancelBtn) {
        if (colors.cancelText) {
          cancelBtn.style.color = colors.cancelText;
        }

        if (colors.cancelBackground) {
          cancelBtn.style.backgroundColor = colors.cancelBackground;
        }
      }

      if (okBtn) {
        if (colors.actionText) {
          okBtn.style.color = colors.actionText;
        }

        if (colors.actionBackground) {
          okBtn.style.backgroundColor = colors.actionBackground;
        }
      }

      if (colors.text && branding) {
        branding.style.fill = colors.text;
      }

      socialBtns.forEach(function(btn) {
        if (colors.actionText) {
          btn.style.color = colors.actionText;
        }

        if (colors.actionBackground) {
          btn.style.backgroundColor = colors.actionBackground;
        }
      });

      widget.querySelector('.pf-widget-message').style.color = colors.text;
    },

    /**
     * @description Report data related to the user action with widget
     * @list  actions   [close, show, confirm, cancel, submit, subscribe]
     * @param {string}  action      action name
     * @param {object}  widget      related widget
     * @param {Element} htmlElement related DOM element
     */
    trackWidgetAction: function(action, widget, htmlElement) {
      var child, childName, elem;
      var valid = true;

      var params = {
        'pf-widget-id': widget.id,
        'pf-widget-type': widget.type,
        'pf-widget-layout': widget.layout,
        'pf-widget-variant': widget.variant
      };

      switch (action) {
        case 'show':
          pathforaDataObject.displayedWidgets.push(params);
          break;
        case 'close':
          pathforaDataObject.closedWidgets.push(params);
          break;
        case 'confirm':
          params['pf-widget-action'] = !!widget.confirmAction && widget.confirmAction.name || 'default confirm';
          pathforaDataObject.completedActions.push(params);
          break;
        case 'cancel':
          params['pf-widget-action'] = !!widget.cancelAction && widget.cancelAction.name || 'default cancel';
          pathforaDataObject.cancelledActions.push(params);
          break;
        case 'submit':
          for (elem in htmlElement.children) {
            if (htmlElement.children.hasOwnProperty(elem)) {
              child = htmlElement.children[elem];
              if (typeof child.getAttribute !== 'undefined' && child.getAttribute('name') !== null) {
                childName = child.getAttribute('name');
                params['pf-form-' + childName] = child.value;
              }
            }
          }
          break;
        case 'subscribe':
          params['pf-form-email'] = htmlElement.elements.email.value;
          break;
        case 'unlock':
          for (elem in htmlElement.children) {
            if (htmlElement.children.hasOwnProperty(elem)) {
              child = htmlElement.children[elem];
              if (typeof child.getAttribute !== 'undefined' && child.getAttribute('name') !== null) {
                childName = child.getAttribute('name');
                params['pf-form-' + childName] = child.value;
              }

              if (typeof child.hasAttribute !== 'undefined' && child.hasAttribute('required') && !params['pf-form-' + childName]) {
                child.setAttribute('invalid', '');
                valid = false;
              }
            }
          }
          utils.saveCookie('PathforaUnlocked_' + widget.id, valid, core.expiration);
          break;
      }

      params['pf-widget-event'] = action;
      if (valid === true) {
        api.reportData(params);
      }
    },

    /**
     * @description Override object with new config parameters
     * @param {object} object original object
     * @param {object} config new configuration
     */
    updateObject: function(object, config) {
      for (var prop in config) {
        if (config.hasOwnProperty(prop) && typeof config[prop] === 'object' && config[prop] !== null) {
          if (config.hasOwnProperty(prop)) {
            if (typeof object[prop] === 'undefined') {
              object[prop] = {};
            }
            core.updateObject(object[prop], config[prop]);
          }
        } else if (config.hasOwnProperty(prop)) {
          object[prop] = config[prop];
        }
      }
    },

    /**
     * @description Initialize widgets from the given array
     * @throws {Error} error
     * @param  {array} array list of widgets to initialize
     */
    initializeWidgetArray: function(array) {
      var displayWidget = function(w) {
        if (w.displayConditions.showDelay) {
          core.registerDelayedWidget(w);
        } else {
          core.initializeWidget(w);
        }
      };

      var recContent = function(w) {
        pathfora.addCallback(function() {
          if (pathfora.acctid === '') {
            if (context.lio && context.lio.account) {
              pathfora.acctid = context.lio.account.id;
            } else {
              throw new Error('Could not get account id from Lytics Javascript tag.');
            }
          }

          api.recommendContent(pathfora.acctid, w.recommend.ql.raw, function(resp) {
            // if we get a response from the recommend api put it as the first
            // element in the content object this replaces any default content
            if (resp[0]) {
              var content = resp[0];
              w.content = {
                0: {
                  title: content.title,
                  description: content.description,
                  url: 'http://' + content.url,
                  image: content.primary_image
                }
              };
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

        var widgetOnInitCallback = widget.config.onInit;
        var defaults = defaultProps[widget.type];
        var globals = defaultProps.generic;

        if (widget.type === 'sitegate' && utils.readCookie('PathforaUnlocked_' + widget.id) === 'true' || widget.hiddenViaABTests === true) {
          continue;
        }

        if (this.initializedWidgets.indexOf(widget.id) < 0) {
          this.initializedWidgets.push(widget.id);
        } else {
          throw new Error('Cannot add two widgets with the same id');
        }

        this.updateObject(widget, globals);
        this.updateObject(widget, defaults);
        this.updateObject(widget, widget.config);

        if (widget.type === 'message' && (widget.recommend && widget.recommend.ql || widget.content)) {
          if (widget.layout !== 'slideout' && widget.layout !== 'modal') {
            throw new Error('Unsupported layout for content recommendation');
          }

          if (widget.content && widget.content[0] && !widget.content[0].default) {
            throw new Error('Cannot define recommended content unless it is a default');
          }

          recContent(widget);
        } else {
          displayWidget(widget);
        }

        // NOTE onInit feels better here
        if (typeof widgetOnInitCallback === 'function') {
          widgetOnInitCallback(callbackTypes.INIT, {
            widget: widget
          });
        }
      }
    },

    /**
     * @description Validate a list of widget elements
     * @throws {Error} error
     * @param {object} widgets
     */
    validateWidgetsObject: function(widgets) {
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
    },

    /**
     * @description Generate a new widget object
     * @throws {Error} error
     * @param   {string} type   widget type
     * @param   {object} config
     * @returns {object} generated widget object
     */
    prepareWidget: function(type, config) {
      var props, random;
      var widget = {};

      if (!config) {
        throw new Error('Config object is missing');
      }

      if (config.layout === 'random') {
        props = {
          layout: [ 'modal', 'slideout', 'bar', 'folding' ],
          variant: [ '1', '2' ],
          slideout: [ 'bottom-left', 'bottom-right' ],
          bar: [ 'top-absolute', 'top-fixed', 'bottom-fixed' ],
          folding: [ 'left', 'bottom-left', 'bottom-right' ]
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
    },

    prepareABTest: function(config) {
      var test = {};

      if (!config) {
        throw new Error('Config object is missing');
      }

      test.id = config.id;
      test.cookieId = 'PathforaTest_' + config.id;
      test.groups = config.groups;

      if (!abTestingTypes[config.type]) {
        throw new Error('Unknown AB testing type: ' + config.type);
      }

      test.type = abTestingTypes[config.type];

      return test;
    },
    /**
     * @description Load callback for facebook integration
     */
    onFacebookLoad: function() {
      var fbBtns = Array.prototype.slice.call(document.querySelectorAll('.social-login-btn.facebook-login-btn span'));

      FB.getLoginStatus(function(connection) {
        if (connection.status === 'connected') {
          core.autoCompleteFacebookData(fbBtns);
        }
      });

      fbBtns.forEach(function(element) {
        if (element.parentElement) {
          element.parentElement.onclick = function() {
            core.onFacebookClick(fbBtns);
          };
        }
      });
    },

    /**
     * @description Attempt to load forms data from Facebook API.
     * @param {object} facebook buttons element selector
     */
    autoCompleteFacebookData: function(elements) {
      FB.api('/me', {
        fields: 'name,email,work'
      }, function(resp) {
        if (resp && !resp.error) {
          core.autoCompleteFormFields({
            type: 'facebook',
            username: resp.name || '',
            email: resp.email || ''
          });

          elements.forEach(function(item) {
            item.innerHTML = 'Log Out';
          });
        }
      });
    },

    /**
     * @description Click handler to log in/log out from facebook.
     * @param {object} facebook buttons element selector
     */
    onFacebookClick: function(elements) {
      FB.getLoginStatus(function(connection) {
        if (connection.status === 'connected') {
          FB.logout(function() {
            elements.forEach(function(elem) {
              elem.innerHTML = 'Log In';
            });
            core.clearFormFields('facebook', [ 'username', 'email' ]);
          });
        } else {
          FB.login(function(resp) {
            if (resp.authResponse) {
              core.autoCompleteFacebookData(elements);
            }
          });
        }
      });
    },

    /**
     * @description Load callback for google integration
     * @param {object} optional widget object
     */
    onGoogleLoad: function() {
      gapi.load('auth2', function() {
        var auth2 = gapi.auth2.init({
          clientId: pathforaDataObject.socialNetworks.googleClientID,
          cookiepolicy: 'single_host_origin',
          scope: 'profile'
        });

        var googleBtns = Array.prototype.slice.call(document.querySelectorAll('.social-login-btn.google-login-btn span'));

        auth2.then(function() {
          var user = auth2.currentUser.get();
          core.autoCompleteGoogleData(user, googleBtns);

          googleBtns.forEach(function(element) {
            if (element.parentElement) {
              element.parentElement.onclick = function() {
                core.onGoogleClick(googleBtns);
              };
            }
          });
        });
      });
    },

    /**
     * @description Attempt to load forms' data from Google+ API.
     * @param {object} current googleUser
     * @param {object} google buttons element selector
     */
    autoCompleteGoogleData: function(user, elements) {
      if (typeof user !== 'undefined') {
        var profile = user.getBasicProfile();

        if (typeof profile !== 'undefined') {
          core.autoCompleteFormFields({
            type: 'google',
            username: profile.getName() || '',
            email: profile.getEmail() || ''
          });

          elements.forEach(function(item) {
            item.innerHTML = 'Sign Out';
          });
        }
      }
    },

    /**
     * @description Click handler to sign in/sign out from google.
     * @param {object} google buttons element selector
     */
    onGoogleClick: function(elements) {
      var auth2 = gapi.auth2.getAuthInstance();

      if (auth2.isSignedIn.get()) {
        auth2.signOut().then(function() {
          elements.forEach(function(elem) {
            elem.innerHTML = 'Sign In';
          });
          core.clearFormFields('google', [ 'username', 'email' ]);
        });
      } else {
        auth2.signIn().then(function() {
          core.autoCompleteGoogleData(auth2.currentUser.get(), elements);
        });
      }
    },

    /**
     * @description Fill form DOM objects with user data
     * @param {object} data user data
     */
    autoCompleteFormFields: function(data) {
      var widgets = Array.prototype.slice.call(document.querySelectorAll('.pf-widget-content'));

      widgets.forEach(function(widget) {
        if (widget.querySelector('.' + data.type + '-login-btn')) {
          Object.keys(data).forEach(function(inputField) {
            var field = widget.querySelector('input[name="' + inputField + '"]');

            if (field && !field.value) {
              field.value = data[inputField];
            }
          });
        }
      });
    },

    /**
     * @description Clear user data from form fields
     * @param {object} type of integration
     * @param {object} fields to clear
     */
    clearFormFields: function(type, fields) {
      var widgets = Array.prototype.slice.call(document.querySelectorAll('.pf-widget-content'));

      widgets.forEach(function(widget) {
        if (widget.querySelector('.' + type + '-login-btn')) {
          fields.forEach(function(inputField) {
            var field = widget.querySelector('input[name="' + inputField + '"]');

            if (field) {
              field.value = '';
            }
          });
        }
      });
    }
  };

  /**
   * @namespace
   * @name api
   * @description Lytics API integration tools
   */
  api = {
    /**
     * @description Prepare GET HTTP request
     * @param {string}   url       target url
     * @param {function} onSuccess success callback
     * @param {function} onError   error callback
     */
    getData: function(url, onSuccess, onError) {
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          onSuccess(xhr.responseText);
        } else if (xhr.readyState === 4) {
          onError(xhr.responseText);
        }
      };

      xhr.open('GET', url);
      xhr.send();
    },

    /**
     * @description Prepare POST HTTP request
     * @param {string}   url       target url
     * @param {object}   data      payload
     * @param {function} onSuccess success callback
     * @param {function} onError   error callback
     */
    postData: function(url, data, onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-type', 'application/json');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          onSuccess(xhr.responseText);
        } else if (xhr.readyState === 4) {
          onError(xhr.responseText);
        }
      };

      xhr.send(data);
    },

    /**
     * @description Send data to Lytics API
     *              Optionally to Google Analytics (if 'ga' function is available)
     * @param {object} data payload
     */
    reportData: function(data) {
      var gaLabel;

      if (typeof jstag === 'object') {
        jstag.send(data);
      } else {
        // NOTE Cannot find Lytics tag, reporting disabled
      }

      if (typeof ga === 'function') {
        gaLabel = data['pf-widget-action'] || data['pf-widget-event'];

        ga(
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
    },

    /**
     * @description Retrieve user segment data from Lytics
     */
    getUserSegments: function() {
      if (context.lio && context.lio.data && context.lio.data.segments) {
        return context.lio.data.segments;
      } else {
        return [ 'all' ];
      }
    },

    /**
     * @description Check if a user is a member of
     * @param {match} name of segment to check for match
     */
    inSegment: function(match) {
      return (this.getUserSegments().indexOf(match) !== -1);
    },

    /**
     * @description Fetch content to recommend
     * @throws {Error} error
     * @param {string} accountId  Lytics account ID
     */
    recommendContent: function(accountId, filter, callback) {
      // Recommendation API:
      // https://www.getlytics.com/developers/rest-api/beta#content-recommendation

      var recommendUrl;
      var seerId = utils.readCookie('seerid');

      if (!seerId) {
        throw new Error('Cannot find SEERID cookie');
      }

      recommendUrl = [
        '//api.lytics.io/api/content/recommend/',
        accountId,
        '/user/_uids/',
        seerId,
        filter ? '?ql=' + filter : ''
      ].join('');

      this.getData(recommendUrl, function(json) {
        var resp = JSON.parse(json);
        if (resp.data && resp.data.length > 0) {
          callback(resp.data);
        } else {
          callback([]);
        }
      }, function() {
        callback([]);
      });
    },

    /**
     * @description Construct filter for inline content recommendations
     * @param {string} urlPat  pattern of URL to match
     */
    constructRecommendFilter: function(urlPat) {
      // URL pattern uses wildcards '*'
      // should not contain http protocol
      // examples:
      // www.example.com/blog/posts/*
      // www.example.com/*
      // *
      // (Note: using a single wildcard results in no filtering and can
      // potentially return any url on your website)
      return 'FILTER AND(url LIKE "' + urlPat + '") FROM content';
    }
  };

  /**
   * @class
   * @name Inline
   * @description Inline Personalization
   */
  Inline = function() {
    this.elements = [];
    this.preppedElements = [];
    this.defaultElements = [];

    /*
     * @description Prepare all the triggered or recommended elements
     * @param {attr} name of attribute to select by
     */
    this.prepElements = function(attr) {
      var dataElements = {};
      var elements = document.querySelectorAll('[' + attr + ']');

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
              var recommend = theElement.getAttribute('data-pfrecommend');
              var block = theElement.getAttribute('data-pfblock');

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
                url: theElement.querySelector('[data-pftype="url"]')
              };
              break;
          }
        }
      }
      return dataElements;
    };

    /*
     * @description show/hide the elements based on membership
     */
    this.procElements = function() {
      var attrs = [ 'data-pftrigger', 'data-pfrecommend' ];
      var inline = this;
      var count = 0;

      var cb = function(elements) {
        count++;
        // After we have processed all elements, proc defaults
        if (count === Object.keys(elements).length) {
          inline.setDefaultRecommend(elements);
        }
      };

      attrs.forEach(function(attr) {
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
                if (context.pathfora.acctid === '') {
                  throw new Error('Could not get account id from Lytics Javascript tag.');
                }

                inline.procRecommendElements(elements[key], key, function() {
                  cb(elements);
                });
                break;
            }
          }
        }
      });
    };

    this.procTriggerElements = function(elems, group) {
      var matched = false;
      var defaultEl = {};

      for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];

        // if we find a match show that and prevent others from showing in same group
        if (api.inSegment(elem.trigger) && !matched) {
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
    };

    this.procRecommendElements = function(blocks, rec, cb) {
      var inline = this;

      if (rec !== 'default') {
        // call the recommendation API using the url pattern urlPattern as a filter
        api.recommendContent(context.pathfora.acctid, api.constructRecommendFilter(rec), function(resp) {
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
                    elems.url.href = 'http://' + content.url;
                  // if attribute is on container element
                  } else {
                    elems.url.innerHTML = 'http://' + content.url;
                  }
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
    };

    this.setDefaultRecommend = function() {
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
    };

    // for our automatic element handling we need to ensure they are all hidden by default
    var css = '[data-pftrigger], [data-pfrecommend]{ display: none; }';
    var style = document.createElement('style');

    style.type = 'text/css';

    if (style.styleSheet) { // handle ie
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName('head')[0].appendChild(style);
  };

  /**
   * @class
   * @name Pathfora
   * @description Pathfora public API class
   */
  Pathfora = function() {
    /**
     * @public
     * @description Current version
     */
    this.version = '0.0.7';

    /**
     * @public
     * @description callbacks to execute once segments load
     */
    this.callbacks = [];

    /**
     * @public
     * @description Lytics account ID required for content recos
     */
    this.acctid = '';

    /**
     * @public
     * @description Indicates if the DOM has been loaded
     */
    this.DOMLoaded = false;

    /**
     * @public
     * @description Add callbacks to execute once segments load
     */
    this.addCallback = function(cb) {
      if (context.lio && context.lio.loaded) {
        cb(context.lio.data);
      } else {
        this.callbacks.push(cb);
      }
    };

    /**
     * @public
     * @description Create page view cookie
     */
    this.initializePageViews = function() {
      var cookie = utils.readCookie('PathforaPageView');
      var date = new Date();
      date.setDate(date.getDate() + 365);
      utils.saveCookie('PathforaPageView', Math.min(~~cookie, 9998) + 1, date);
    };

    /**
     * @public
     * @description Listener to wait until the DOM is ready
     */
    this.onDOMready = function(fn) {
      var handler;
      var pf = this;
      var hack = document.documentElement.doScroll;
      var domContentLoaded = 'DOMContentLoaded';
      var loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(document.readyState);

      if (!loaded) {
        document.addEventListener(domContentLoaded, handler = function() {
          document.removeEventListener(domContentLoaded, handler);
          pf.DOMLoaded = true;
          fn();
        });
      } else {
        pf.DOMLoaded = true;
        fn();
      }
    };

    /**
     * @public
     * @description Initialize inline personalization
     */
    this.initializeInline = function() {
      var pf = this;

      pf.onDOMready(function() {
        pf.addCallback(function() {
          if (pf.acctid === '') {
            if (context.lio && context.lio.account) {
              pf.acctid = context.lio.account.id;
            }
          }

          pf.inline.procElements();
        });
      });
    };

    /**
     * @public
     * @description Initialize Pathfora widgets from a container
     * @param {object|array}   widgets
     * @param {object}         config
     */
    this.initializeWidgets = function(widgets, config) {
      // NOTE IE < 10 not supported
      // FIXME Why? 'atob' can be polyfilled, 'all' is not necessary anymore?
      if (document.all && !context.atob) {
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

      core.validateWidgetsObject(widgets);
      core.trackTimeOnPage();

      if (config) {
        originalConf = JSON.parse(JSON.stringify(defaultProps));
        core.updateObject(defaultProps, config);
      }

      if (widgets instanceof Array) {
        // NOTE Simple initialization
        core.initializeWidgetArray(widgets);
      } else {
        // NOTE Target sensitive widgets
        if (widgets.common) {
          core.initializeWidgetArray(widgets.common);
          core.updateObject(defaultProps, widgets.common.config);
        }

        if (widgets.target || widgets.exclude) {
          // Add callback to initialize once we know segments are loaded
          this.addCallback(function() {
            var target, ti, tl, exclude, ei, ex, ey, el;
            var targetedwidgets = [];
            var excludematched = false;
            var segments = api.getUserSegments();

            // handle inclusions
            if (widgets.target) {
              tl = widgets.target.length;
              for (ti = 0; ti < tl; ti++) {
                target = widgets.target[ti];
                if (segments && segments.indexOf(target.segment) !== -1) {
                  targetedwidgets = target.widgets;
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
              core.initializeWidgetArray(targetedwidgets);
            }

            if (!targetedwidgets.length && !excludematched && widgets.inverse) {
              core.initializeWidgetArray(widgets.inverse);
            }
          });
        }
      }
    };

    /**
     * @public
     * @description Create a minimal widget for a preview
     * @param   {object}   widget
     * @returns {object}   widget DOM element
     */
    this.previewWidget = function(widget) {
      widget.id = utils.generateUniqueId();
      return core.createWidgetHtml(widget);
    };

    /**
     * // FIXME outdated/not completed
     * @public
     * @description Set A/B testing modes for the global Pathfora object
     * @param {string} abTests A/B testing modes array
     */
    this.initializeABTesting = function(abTests) {
      abTests.forEach(function(abTest) {
        var abTestingType = abTest.type;
        var userAbTestingValue = utils.readCookie(abTest.cookieId);
        var userAbTestingGroup = 0;
        var date = new Date();

        if (!userAbTestingValue) {
          // Support old cookie name convention
          userAbTestingValue = utils.readCookie(abHashMD5 + abTest.id);

          if (!userAbTestingValue) {
            userAbTestingValue = Math.random();
          }
        }

        // NOTE Always update the cookie to get the new exp date.
        date.setDate(date.getDate() + 365);
        utils.saveCookie(abTest.cookieId, userAbTestingValue, date);

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
        abTest.groups.forEach(function(group, index) {
          group.forEach(function(widget) {
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
    };

    /**
     * @public
     * @description Create a Message widget
     * @param   {object}   config
     * @returns {object}   Message widget
     */
    this.Message = function(config) {
      return core.prepareWidget('message', config);
    };

    /**
     * @public
     * @description Create a Subscription widget
     * @param   {object}   config
     * @returns {object}   Subscription widget
     */
    this.Subscription = function(config) {
      return core.prepareWidget('subscription', config);
    };

    /**
     * @public
     * @description Create a Form widget
     * @param   {object}   config
     * @returns {object}   Form widget
     */
    this.Form = function(config) {
      return core.prepareWidget('form', config);
    };

    /**
     * @public
     * @description Create a Site Gate widget
     * @param   {object}   config
     * @returns {object}   SiteGate widget
     */
    this.SiteGate = function(config) {
      return core.prepareWidget('sitegate', config);
    };

    /**
     * @public
     * @description Display a widget
     * @param {object} widget
     */
    this.showWidget = function(widget) {
      // FIXME Change to Array#filter and Array#length
      for (var i = 0; i < core.openedWidgets.length; i++) {
        if (core.openedWidgets[i] === widget) {
          return;
        }
      }

      core.openedWidgets.push(widget);
      core.trackWidgetAction('show', widget);

      var node = core.createWidgetHtml(widget);

      if (widget.showSocialLogin) {
        if (widget.showForm === false) {
          throw new Error('Social login requires a form on the widget');
        }
      }

      if (widget.pushDown) {
        utils.addClass(document.querySelector('.pf-push-down'), 'opened');
      }

      if (widget.config.layout !== 'inline') {
        document.body.appendChild(node);
      } else {
        var hostNode = document.querySelector(widget.config.position);

        if (hostNode) {
          hostNode.appendChild(node);
        } else {
          throw new Error('Inline widget could not be initialized in ' + widget.config.position);
        }
      }

      // NOTE wait for appending to DOM to trigger the animation
      // FIXME 50 - magical number
      setTimeout(function() {
        var widgetLoadCallback = widget.config.onLoad;

        utils.addClass(node, 'opened');

        if (typeof widgetLoadCallback === 'function') {
          widgetLoadCallback(callbackTypes.LOAD, {
            widget: widget,
            node: node
          });
        }
        if (widget.config.layout === 'modal' && typeof widget.config.onModalOpen === 'function') {
          widget.config.onModalOpen(callbackTypes.MODAL_OPEN, {
            widget: widget
          });
        }
      }, 50);

      if (widget.displayConditions.hideAfter) {
        setTimeout(function() {
          context.pathfora.closeWidget(widget.id);
        }, widget.displayConditions.hideAfter * 1000);
      }
    };

    /**
     * @public
     * @description Close the widget
     *              and remove it from DOM
     * @param {string}  id      widget it
     * @param {boolean} noTrack if true, closing action will not be recorded
     */
    this.closeWidget = function(id, noTrack) {
      var node = document.getElementById(id);

      // FIXME Change to Array#some or Array#filter
      for (var i = 0; i < core.openedWidgets.length; i++) {
        if (core.openedWidgets[i].id === id) {
          if (!noTrack) {
            core.trackWidgetAction('close', core.openedWidgets[i]);
          }
          core.openedWidgets.splice(i, 1);
          break;
        }
      }

      utils.removeClass(node, 'opened');

      if (utils.hasClass(node, 'pf-has-push-down')) {
        var pushDown = document.querySelector('.pf-push-down');
        if (pushDown) {
          utils.removeClass(pushDown, 'opened');
        }
      }

      // FIXME 500 - magical number
      setTimeout(function() {
        if (node && node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }, 500);
    };

    /**
     * @public
     * @description Get the current Pathfora data store
     * @returns {object} Pathfora data store
     */
    this.getData = function() {
      return pathforaDataObject;
    };

    /**
     * @public
     * @description Clean widgets and data state
     */
    this.clearAll = function() {
      var opened = core.openedWidgets;
      var delayed = core.delayedWidgets;

      opened.forEach(function(widget) {
        var element = document.getElementById(widget.id);
        utils.removeClass(element, 'opened');
        element.parentNode.removeChild(element);
      });

      opened.slice(0);

      for (var i = delayed.length; i > -1; i--) {
        core.cancelDelayedWidget(delayed[i]);
      }

      core.openedWidgets = [];
      core.initializedWidgets = [];
      core.removeScrollWatchers(core.watchers);

      pathforaDataObject = {
        pageViews: 0,
        timeSpentOnPage: 0,
        closedWidgets: [],
        completedActions: [],
        cancelledActions: [],
        displayedWidgets: [],
        abTestingGroups: [],
        socialNetworks: {}
      };

      if (originalConf) {
        defaultProps = originalConf;
      }
    };

    /**
     * @public
     * @description Intergrate with Facebook App API
     * @param {string} appId
     */
    this.integrateWithFacebook = function(appId) {
      if (appId !== '') {
        var btn = templates.social.facebookBtn.replace(
          /(\{){2}facebook-icon(\}){2}/gm,
          templates.assets.facebookIcon
        );

        var parseFBLoginTemplate = function(parentTemplates) {
          Object.keys(parentTemplates).forEach(function(type) {
            parentTemplates[type] = parentTemplates[type].replace(
              /<p name='fb-login' hidden><\/p>/gm,
              btn
            );
          });
        };

        window.fbAsyncInit = function() {
          window.FB.init({
            appId: appId,
            xfbml: true,
            version: 'v2.5',
            status: true,
            cookie: true
          });

          core.onFacebookLoad();
        };

        // NOTE API initialization
        (function(d, s, id) {
          var js;
          var fjs = d.getElementsByTagName(s)[0];
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
    };

    /**
     * @public
     * @description Integrate with Google App API
     * @param {string} clientId
     */
    this.integrateWithGoogle = function(clientId) {
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

        var parseGoogleLoginTemplate = function(parentTemplates) {
          Object.keys(parentTemplates).forEach(function(type) {
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

        window.pathforaGoogleOnLoad = core.onGoogleLoad;

        // NOTE Google API
        (function() {
          var s;
          var po = document.createElement('script');
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
    };

    /*
     * @public
     */
    this.ABTest = function(config) {
      return core.prepareABTest(config);
    };

    /*
     * @public
     * @description Get utils object
     */
    this.utils = utils;

    /*
     * @public
     * @description Inline personalization class
     */
    this.inline = new Inline();

    this.initializePageViews();
    this.initializeInline();
  };

  // NOTE Initialize context
  appendPathforaStylesheet();
  context.pathfora = new Pathfora();
}(window, document));
