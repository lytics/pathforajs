var handlers = [];

export default {
  add: function (target, type, listener) {
    target.addEventListener(type, listener);
    handlers.push({
      target: target,
      type: type,
      listener: listener
    });
  },
  remove: function (target, type, listener) {
    target.removeEventListener(type, listener);
  },
  removeAll: function () {
    var hub = this;
    handlers.forEach(function (h) {
      hub.remove(h.target, h.type, h.listener);
    });
    handlers.length = 0;
  }
};
