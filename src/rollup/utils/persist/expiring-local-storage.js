var PAYLOAD_KEY = '$';
var EXPIRES_KEY = '@';

function safeJsonParse (json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    // recover
  }
}

export default {
  getItem: function (key) {
    var textValue = localStorage.getItem(key);
    var value = safeJsonParse(textValue);

    if (value && EXPIRES_KEY in value) {
      if (Date.parse(value[EXPIRES_KEY]) < Date.now()) {
        localStorage.removeItem(key);
        return null;
      }
      if (PAYLOAD_KEY in value) {
        // Extend the expiration date:
        this.setItem(key, value[PAYLOAD_KEY]);
        return value[PAYLOAD_KEY];
      }
    }
    return textValue;
  },

  setItem: function (key, payload, expiresOn) {
    if (!expiresOn) {
      expiresOn = new Date();
      expiresOn.setDate(expiresOn.getDate() + 365);
    }

    var record = {};

    record[PAYLOAD_KEY] = '' + payload;
    record[EXPIRES_KEY] = expiresOn;

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
  }
};
