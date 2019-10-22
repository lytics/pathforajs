import expiringLocalStorage from './expiring-local-storage';

export default function write (key, value, expiration) {
  expiringLocalStorage.setItem(key, value, expiration);
}
