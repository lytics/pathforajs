import expiringLocalStorage from './expiring-local-storage';
import readCookie from '../cookies/read-cookie';
import deleteCookie from '../cookies/delete-cookie';

export default function read (key) {
  var item = expiringLocalStorage.getItem(key);

  if (item == null) {
    item = readCookie(key);

    if (item != null) {
      deleteCookie(key);
      expiringLocalStorage.setItem(key, item);
    }
  }

  return item;
}
