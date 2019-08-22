/** @module pathfora/recommendations/recommend-content */

// globals
import { PREFIX_REC, API_URL } from '../globals/config';

// utils
import readCookie from '../utils/cookies/read-cookie';
import constructQueries from '../utils/url/construct-queries';
import decodeSafe from '../utils/decode-safe';

// data
import getData from '../data/request/get-data';


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
export default function recommendContent (accountId, params, id, callback) {
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
  if (window.jstag && window.jstag.config && window.jstag.cookie !== '') {
    storedCookieName = window.jstag.cookie;
  }

  // attempt to get value from stored cookie
  userByFieldValue = readCookie(storedCookieName);

  // override everything is key/value have been explicitly set for user
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
