/** @module pathfora/utils */

// class
import addClass from './class/add-class';
import hasClass from './class/has-class';
import removeClass from './class/remove-class';

// cookies
import readCookie from './cookies/read-cookie';
import saveCookie from './cookies/save-cookie';

// scaffold
import initWidgetScaffold from './scaffold/init-scaffold';
import insertWidget from './scaffold/insert-widget';

// url
import constructQueries from './url/construct-queries';
import escapeURI from './url/escape-uri';

import generateUniqueId from './generate-unique-id';
import updateObject from './update-object';

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

  // scaffold
  initWidgetScaffold: initWidgetScaffold,
  insertWidget: insertWidget,

  // url
  constructQueries: constructQueries,
  escapeURI: escapeURI,

  generateUniqueId: generateUniqueId,
  updateObject: updateObject
};

