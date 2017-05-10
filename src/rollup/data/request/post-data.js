/** @module api/request/post-data */

export default function postData (url, data, onSuccess, onError) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-type', 'application/json');

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      onSuccess(xhr.responseText);
    } else if (xhr.readyState === 4) {
      onError(xhr.responseText);
    }
  };

  xhr.send(data);
};