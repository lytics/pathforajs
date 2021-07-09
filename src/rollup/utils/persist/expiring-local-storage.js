import { PF_VERSION } from '../../globals/config';
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

export default {
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
