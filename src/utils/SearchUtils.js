import {ajaxGet} from './SharedUtils';

export function search(url, success) {
  ajaxGet(url, 'json', success);
}
