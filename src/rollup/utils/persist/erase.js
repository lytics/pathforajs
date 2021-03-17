import expiringLocalStorage from './expiring-local-storage';
import deleteCookie from '../cookies/delete-cookie';

export default function erase (key) {
  expiringLocalStorage.removeItem(key);
  deleteCookie(key);
}
