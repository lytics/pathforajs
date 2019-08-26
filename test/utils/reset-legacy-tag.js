export default function resetLegacyTag () {
  window.jstag = {
    send: function () {},
    config: {
      cookie: 'seerid'
    }
  };
}
