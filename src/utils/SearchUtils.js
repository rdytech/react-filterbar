var SharedUtils = require('./SharedUtils');

export function search(url, success) {
  SharedUtils.ajaxGet(url, 'json', success);
}
