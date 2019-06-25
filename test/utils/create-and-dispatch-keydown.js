export default function createAndDispatchKeydown (key, target) {
  var eventObj = document.createEvent('Event');
  eventObj.initEvent('keydown', false, false);
  eventObj.which = key;
  eventObj.keyCode = key;
  target.dispatchEvent(eventObj);
}
