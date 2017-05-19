/** @module pathfora/utils */

import generateUniqueId from './generate-unique-id';
import updateObject from './update-object';

import addClass from './class/add-class';
import hasClass from './class/has-class';
import removeClass from './class/remove-class';

import readCookie from './cookies/read-cookie';
import saveCookie from './cookies/save-cookie';

import initWidgetScaffold from './scaffold/init-scaffold';
import insertWidget from './scaffold/insert-widget';

import constructQueries from './url/construct-queries';
import escapeURI from './url/escape-uri';

/**
 * Object containing utility functions
 *
 * @exports utils
 */

export var utils = {
  generateUniqueId: generateUniqueId,
  updateObject: updateObject,
  addClass: addClass,
  hasClass: hasClass,
  removeClass: removeClass,
  readCookie: readCookie,
  saveCookie: saveCookie,
  initWidgetScaffold: initWidgetScaffold,
  insertWidget: insertWidget,
  constructQueries: constructQueries,
  escapeURI: escapeURI
};

