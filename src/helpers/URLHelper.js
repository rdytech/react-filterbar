var uri = require("URIjs");

export function updateApplicationUrlState(url) {
  history.pushState({}, "", window.location.origin + url);
  localStorage[window.location.pathname.replace(/\//g, "")] = url.search();
}

export function updateUrlSearch(url, field, value) {
  return uri(url).removeSearch(field).addSearch(field, value);
}

export function redirectUrl(url) {
    window.location.href = url;
}
