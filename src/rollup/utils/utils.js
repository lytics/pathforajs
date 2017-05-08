/** @module utils */

import generateUniqueId from './generate-unique-id'
import updateObject from './update-object'

import addClass from './class/add-class'
import hasClass from './class/has-class'
import removeClass from './class/remove-class'

import readCookie from './cookies/read-cookie'
import saveCookie from './cookies/save-cookie'

import initializeScaffold from './scaffold/init-scaffold'
import insertWidget from './scaffold/insert-widget'

import constructQueries from './url/construct-queries'
import escapeURI from './url/escape-uri'

export var utils = {
  generateUniqueId: generateUniqueId,
  updateObject: updateObject,
  addClass: addClass,
  hasClass: hasClass,
  removeClass: removeClass,
  readCookie: readCookie,
  saveCookie: saveCookie,
  initializeScaffold: initializeScaffold,
  insertWidget: insertWidget,
  constructQueries: constructQueries,
  escapeURI: escapeURI
};