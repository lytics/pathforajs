export default function createAndDispatchKeydown (key, target, shiftKey) {
  var eventObj = document.createEvent('Event');
  eventObj.initEvent('keydown', false, false);
  eventObj.which = key;
  eventObj.keyCode = key;
  eventObj.shiftKey = shiftKey === true;
  target.dispatchEvent(eventObj);
}
