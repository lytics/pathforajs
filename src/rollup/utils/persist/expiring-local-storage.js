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
    var value = safeJsonParse(localStorage.getItem(key));

    if (value && value[EXPIRES_KEY]) {
      if (Date.parse(value[EXPIRES_KEY]) < Date.now()) {
        localStorage.removeItem(key);
        return null;
      }
      return value[PAYLOAD_KEY] || value;
    }
    return localStorage.getItem(key);
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
