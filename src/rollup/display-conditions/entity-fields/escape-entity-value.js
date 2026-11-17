/** @module pathfora/display-conditions/entity-fields/escape-entity-value */

// fields rendered with innerHTML
var HTML_FIELDS = ['msg', 'headline'];

// fields whose template text is JavaScript source recompiled with new Function
var JS_FIELDS = ['confirmAction.callback'];

// schemes that run script when the value lands in an href/src attribute
var SCRIPT_SCHEME = /^(javascript|vbscript|data):/i;

/**
 * Escape a string for use as text or a quoted attribute value in HTML.
 *
 * @params {string} s
 * @returns {string}
 */
export function escapeHTML (s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}

/**
 * Escape a string for use inside a JavaScript string, template or regex
 * literal. Every character other than [A-Za-z0-9_] becomes a \xNN or \uNNNN
 * escape, which a literal decodes back to the original character. Outside a
 * literal the escapes are a syntax error, so the value can never form code.
 *
 * @params {string} s
 * @returns {string}
 */
export function escapeJS (s) {
  return s.replace(/[^A-Za-z0-9_]/g, function (c) {
    var code = c.charCodeAt(0),
        hex = code.toString(16);

    if (code < 0x100) {
      return '\\x' + ('00' + hex).slice(-2);
    }

    return '\\u' + ('0000' + hex).slice(-4);
  });
}

/**
 * Report whether a value would run script if it formed a whole URL attribute.
 * Browsers ignore control characters and whitespace when reading a scheme,
 * so they are stripped before checking.
 *
 * @params {string} s
 * @returns {boolean}
 */
export function hasScriptScheme (s) {
  return SCRIPT_SCHEME.test(s.replace(/[\u0000- ]/g, ''));
}

/**
 * Prepare a profile or custom data value for substitution into a widget field.
 * Returns undefined when the value cannot be placed in the field safely, so the
 * caller falls back to the template's default as it does for a missing value.
 *
 * @exports escapeEntityValue
 * @params {string} fieldName
 * @params {*} value
 * @returns {string|undefined}
 */
export default function escapeEntityValue (fieldName, value) {
  var s = String(value);

  if (HTML_FIELDS.indexOf(fieldName) !== -1) {
    if (hasScriptScheme(s)) {
      return undefined;
    }

    return escapeHTML(s);
  }

  if (JS_FIELDS.indexOf(fieldName) !== -1) {
    return escapeJS(s);
  }

  // image is assigned to img.src as a property, where entities are not decoded
  // and a script scheme does not run
  return s;
}
