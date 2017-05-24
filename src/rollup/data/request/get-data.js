/** @module pathfora/data/request/get-data */

/**
 * Make an http GET request
 *
 * @exports getData
 * @params {string} url
 * @params {function} onSuccess
 * @params {function} onError
 */
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
}
