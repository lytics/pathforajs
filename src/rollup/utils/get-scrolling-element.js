/**
* Based on https://github.com/cgygd/scrolling-element
*/

var element = null;

/* istanbul ignore next */
export default function getScrollingElement () {
  if (element) {
    return element;
  }
  if (document.body.scrollTop) {
    // speed up if scrollTop > 0
    return (element = document.body);
  }
  var iframe = document.createElement('iframe');
  iframe.style.height = '1px';
  document.documentElement.appendChild(iframe);
  var doc = iframe.contentWindow.document;
  doc.write('<!DOCTYPE html><div style="height:9999em">x</div>');
  doc.close();
  var isCompliant = doc.documentElement.scrollHeight > doc.body.scrollHeight;
  iframe.parentNode.removeChild(iframe);
  return (element = isCompliant ? document.documentElement : document.body);
}
