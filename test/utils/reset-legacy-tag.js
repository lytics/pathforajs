export default function resetLegacyTag () {
  window.jstag = {
    send: function () {}
  };
}
