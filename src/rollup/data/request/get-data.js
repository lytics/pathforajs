/** @module api/request/get-data */

export default function getData (url, onSuccess, onError) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      onSuccess(xhr.responseText);
    } else if (xhr.readyState === 4) {
      onError(xhr.responseText);
    }
  };

  xhr.open('GET', url);
  xhr.send();
};