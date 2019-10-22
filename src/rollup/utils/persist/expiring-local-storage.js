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

    if (value && value.expiresOn) {
      if (Date.parse(value.expiresOn) < Date.now()) {
        localStorage.removeItem(key);
        return null;
      }
      return value.payload || value;
    }
    return localStorage.getItem(key);
  },

  setItem: function (key, payload, expiresOn) {
    if (!expiresOn) {
      expiresOn = new Date();
      expiresOn.setDate(expiresOn.getDate() + 365);
    }
    localStorage.setItem(
      key,
      JSON.stringify({
        payload: '' + payload,
        expiresOn: expiresOn.toISOString()
      })
    );
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
