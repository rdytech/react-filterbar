var uri = require("URIjs");

export function ConfigurationFactory(sourceType, rawConfiguration) {
  var configuration = {
    filterBarConfiguration: {},
    tableConfiguration: {}
  };

  if (sourceType === "html") {
    var rawFilterBarConfiguration = rawConfiguration.querySelector("dl.filterBarConfiguration"),
        rawFilter,
        rawFilters,
        parsedFilters = {},
        rawTableConfiguration = rawConfiguration.querySelector("dl.tableConfiguration"),
        rawColumn,
        rawColumns,
        parsedColumns = {};

    rawFilters = rawFilterBarConfiguration.querySelector("dl.filters").querySelectorAll("dt.filter");

    for (var filterIndex = 0; filterIndex < rawFilters.length; filterIndex++) {
      rawFilter = rawFilters[filterIndex];
      parsedFilters[rawFilter.getAttribute("data-uid")] = {
        label: rawFilter.getAttribute("data-label"),
        type: rawFilter.getAttribute("data-type"),
        field: rawFilter.getAttribute("data-field"),
        url: rawFilter.getAttribute("data-url"),
        value: "",
        enabled: false
      };
    }

    configuration.filterBarConfiguration.persistent = rawFilterBarConfiguration.querySelector("dt.persistent").getAttribute("data-persistent");
    configuration.filterBarConfiguration.searchUrl = rawFilterBarConfiguration.querySelector("dt.search-url").getAttribute("data-url");
    configuration.filterBarConfiguration.saveSearchUrl = rawFilterBarConfiguration.querySelector("dt.save-search-url").getAttribute("data-url");
    configuration.filterBarConfiguration.savedSearchesUrl = rawFilterBarConfiguration.querySelector("dt.saved-searches-url").getAttribute("data-url");
    configuration.filterBarConfiguration.exportResultsUrl = rawFilterBarConfiguration.querySelector("dt.export-results-url").getAttribute("data-url");
    configuration.filterBarConfiguration.filters = parsedFilters;

    rawColumns = rawTableConfiguration.querySelector("dl.columns").querySelectorAll("dt.column");

    for (var tableIndex = 0; tableIndex < rawColumns.length; tableIndex++) {
      rawColumn = rawColumns[tableIndex];
      parsedColumns[rawColumn.getAttribute("data-field")] = {
        value: rawColumn.getAttribute("data-heading"),
        type: rawColumn.getAttribute("data-type")
      };
    }

    configuration.tableConfiguration.dataUrl = rawTableConfiguration.querySelector("dt.data-url").getAttribute("data-url");
    configuration.tableConfiguration.columns = parsedColumns;
  } else if (sourceType === "url") {
    var url = uri(window.location.href);

    if (!url.query()) {
      if (localStorage[window.location.pathname.replace(/\//g, "")]) {
        history.pushState({}, "", localStorage[window.location.pathname.replace(/\//g, "")]);
      }
    }

    if (!url.hasQuery("q")) {
      url.addQuery("q", "");
    }

    if (!url.hasQuery("page")) {
      url.addQuery("page", 1);
    }

    configuration.tableConfiguration.dataUrl = url.pathname() + url.search();
    configuration.tableConfiguration.page = url.query(true).page;

    configuration.filterBarConfiguration.filters = {};

    if (url.query(true).q !== "") {
      for (var filter of JSON.parse(url.query(true).q)) {
        configuration.filterBarConfiguration.filters[filter.uid] = {enabled: true, value: filter.value};
        configuration.filterBarConfiguration.filters[filter.uid].enabled = true;
        configuration.filterBarConfiguration.filters[filter.uid].value = filter.value;
      }
    }
  }
  return configuration;
}

