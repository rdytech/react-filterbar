export function serialize(obj, prefix) {
  var str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
      str.push(typeof v === "object" ?
        this.serialize(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}

export function ajaxGet(url, type, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = type;
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.onload = function() {
    var status = xhr.status;
    var response = xhr.response;
    if (status === 200) {
      return success(response);
    } else {
      return error(response);
    }
  };
  xhr.send();
}

export function ajaxPost(url, type, data, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.responseType = type;
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.setRequestHeader("X_CSRF_TOKEN", document.querySelector("meta[name=csrf-token]").getAttribute("content"));
  xhr.onload = function() {
    var response = xhr.response;
  };
  xhr.send(JSON.stringify(data));
}

export function parseFilterBarConfiguration(filterBarConfiguration, id) {
  var parsedFilterBarConfiguration = {},
      rawFilter,
      rawFilters,
      parsedFilters = {};

  rawFilters = filterBarConfiguration.querySelector("dl.filters").querySelectorAll("dt.filter");

  for (var i = 0; i < rawFilters.length; i++) {
    rawFilter = rawFilters[i];
    parsedFilters[rawFilter.getAttribute("data-uid")] = {
      label: rawFilter.getAttribute("data-label"),
      type: rawFilter.getAttribute("data-type"),
      field: rawFilter.getAttribute("data-field"),
      url: rawFilter.getAttribute("data-url"),
      value: "",
      enabled: false
    };
  }

  parsedFilterBarConfiguration.id = id;
  parsedFilterBarConfiguration.persistent = filterBarConfiguration.querySelector("dt.persistent").getAttribute("data-persistent");
  parsedFilterBarConfiguration.searchUrl = filterBarConfiguration.querySelector("dt.search-url").getAttribute("data-url");
  parsedFilterBarConfiguration.saveSearchUrl = filterBarConfiguration.querySelector("dt.save-search-url").getAttribute("data-url");
  parsedFilterBarConfiguration.savedSearchUrl = filterBarConfiguration.querySelector("dt.saved-search-url").getAttribute("data-url");
  parsedFilterBarConfiguration.exportResultsUrl = filterBarConfiguration.querySelector("dt.export-results-url").getAttribute("data-url");
  parsedFilterBarConfiguration.filters = parsedFilters;

  return parsedFilterBarConfiguration;
}

export function parseTableConfiguration(tableConfiguration, id) {
  var parsedTableConfiguration = {},
      rawColumns,
      rawColumn,
      parsedColumns = {};

  rawColumns = tableConfiguration.querySelector("dl.columns").querySelectorAll("dt.column");

  for (var i = 0; i < rawColumns.length; i++) {
    rawColumn = rawColumns[i];
    parsedColumns[rawColumn.getAttribute("data-field")] = {
      heading: rawColumn.getAttribute("data-heading"),
      type: rawColumn.getAttribute("data-type")
    };
  }

  parsedTableConfiguration.id = id;
  parsedTableConfiguration.dataUrl = tableConfiguration.querySelector("dt.data-url").getAttribute("data-url");
  parsedTableConfiguration.columns = parsedColumns;

  return parsedTableConfiguration;
}

export function parseUrlSearchString() {
  // taken from https://github.com/sindresorhus/query-string/blob/master/query-string.js

  var str = window.location.search;

  if (typeof str !== "string") {
    return {};
  }

  str = str.trim().replace(/^(\?|#)/, "");

  if (!str) {
    return {};
  }

  return str.trim().split("&").reduce(function (ret, param) {
    var parts = param.replace(/\+/g, " ").split("=");
    var key = parts[0];
    var val = parts[1];

    key = decodeURIComponent(key);
    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val === undefined ? null : decodeURIComponent(val);

    if (!ret.hasOwnProperty(key)) {
      ret[key] = val;
    } else if (Array.isArray(ret[key])) {
      ret[key].push(val);
    } else {
      ret[key] = [ret[key], val];
    }

    return ret;
  }, {});
}

export function createUrlSearchString(obj) {
  // taken from https://github.com/sindresorhus/query-string/blob/master/query-string.js
  return obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (Array.isArray(val)) {
      return val.map(function (val2) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(val2);
      }).join("&");
    }

    return encodeURIComponent(key) + "=" + encodeURIComponent(val);
  }).join("&") : "";
}

export function updateUrl(propKey, propValue) {
  var searchObject = parseUrlSearchString();

  searchObject[propKey] = propValue;

  var newSearchString = "?" + createUrlSearchString(searchObject);

  history.pushState({}, "", window.location.origin + window.location.pathname + newSearchString);
  localStorage[window.location.pathname.replace(/\//g, "")] = newSearchString;
}
