/** @module pathfora/on-dom-ready */

export default function onDOMready (fn) {
  var handler,
      pf = this,
      hack = document.documentElement.doScroll,
      domContentLoaded = 'DOMContentLoaded',
      loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(document.readyState);

  if (!loaded) {
    document.addEventListener(domContentLoaded, handler = function () {
      document.removeEventListener(domContentLoaded, handler);
      pf.DOMLoaded = true;
      fn();
    });
  } else {
    pf.DOMLoaded = true;
    fn();
  }
};