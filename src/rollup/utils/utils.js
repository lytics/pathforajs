/** @module pathfora/utils */

// class
import addClass from './class/add-class';
import hasClass from './class/has-class';
import removeClass from './class/remove-class';

// cookies
import readCookie from './cookies/read-cookie';
import saveCookie from './cookies/save-cookie';
import deleteCookie from './cookies/delete-cookie';
import updateLegacyCookies from './cookies/update-legacy-cookies';

// scaffold
import initWidgetScaffold from './scaffold/init-scaffold';
import insertWidget from './scaffold/insert-widget';

// url
import constructQueries from './url/construct-queries';
import escapeURI from './url/escape-uri';

// objects
import updateObject from './objects/update-object';
import setObjectValue from './objects/set-object-value';
import getObjectValue from './objects/get-object-value';

import generateUniqueId from './generate-unique-id';
import escapeRegex from './escape-regex';
import emailValid from './email-valid';

/**
 * Object containing utility functions
 *
 * @exports utils
 */

export var utils = {
  // class
  addClass: addClass,
  hasClass: hasClass,
  removeClass: removeClass,

  // cookies
  readCookie: readCookie,
  saveCookie: saveCookie,
  deleteCookie: deleteCookie,
  updateLegacyCookies: updateLegacyCookies,

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
  emailValid: emailValid
};
