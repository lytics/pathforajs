export default function globalReset () {
  // reset jstag
  window.jstag = {
    send: function () {},
    config: {
      cookie: 'seerid'
    }
  };
  window.lio = {};
  window.liosetup = {};

  // reset pathfora
  window.pathfora.dateOptions = {};
  window.pathfora.acctid = '';
  window.pathfora.enableGA = false;
  window.pathfora.inline.elements = [];
  window.pathfora.callbacks = [];
  window.pathfora.clearAll();

  // reset storage
  document.cookie = '';
  window.pathfora.utils.saveCookie('seerid', 123);
  sessionStorage.clear();
  localStorage.clear();
}
