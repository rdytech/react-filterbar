var uri = require("URIjs");

import "core-js/stable";
import "regenerator-runtime/runtime";
import {FilterableTable} from "./components/FilterableTable.react";
import {FilterVerificator} from "./helpers/FilterVerificator";

function walk(node) {
  var nodeObject = {};

  if (node.nodeName === "DIV" || node.nodeName === "DL") {
    $.each($(node).children(), function(index, childNode) {
      nodeObject[$.camelCase(childNode.getAttribute("class"))] = walk(childNode);
    });
  } else if(node.nodeName === "DT") {
    nodeObject = node.getAttribute("data-value");
    if(nodeObject === null) {
      nodeObject = { from: node.getAttribute("data-value-from"), to: node.getAttribute("data-value-to") }
    }
  } else {
    throw "Malformed html configuration";
  }

  return nodeObject;
}

function setupConfiguration(configuration) {
  var url = uri(window.location),
      searchObject = url.search(true),
      storageKey = window.location.pathname.replace(/\//g, "");

  if (Object.keys(searchObject).length === 0 && localStorage[storageKey] !== undefined) {
    history.pushState({}, "", localStorage[storageKey]);
    url = uri(window.location).removeSearch("page");
  }

  var verifiedFilters = new FilterVerificator(configuration.filterBarConfiguration.filters).verify();

  if (!verifiedFilters || !url.hasSearch("q")) {
    url.setSearch("q", "");
  }

  if (!url.hasSearch("page")) {
    url.addSearch("page", 1);
  }

  configuration.tableConfiguration.dataUrl = url.pathname() + url.search();
  configuration.tableConfiguration.page = Number(url.query(true).page);

  if (url.query(true).q !== "") {
    const activeFilters = JSON.parse(url.query(true).q);
    configuration.filterBarConfiguration.activeFilters = [];

    if (Array.isArray(activeFilters[0])) {
      // Case 1: Filters with new format
      configuration.filterBarConfiguration.activeFilters = parseQueryVersion2(activeFilters, configuration);
    } else {
      // Case 2: Filters with old format
      configuration.filterBarConfiguration.activeFilters = parseQueryVersion1(activeFilters, configuration);
    }
  }

  if (configuration.batchActionsConfiguration === undefined) {
    configuration.batchActionsConfiguration = { actions: [] };
    configuration.tableConfiguration.selectable = undefined;
  }
  else {
    configuration.tableConfiguration.selectable = configuration.batchActionsConfiguration.selectable;
  }

  return configuration;
}

function parseQueryVersion1(activeFilters, configuration) {
  const _groupFilters = [];

  for (const filter of activeFilters) {
    const configFilter = parseAndGetFilter(filter, configuration)
    _groupFilters.push(configFilter);
  }

  return [_groupFilters];
}

function parseQueryVersion2(activeFilters, configuration) {
  const results = [];

  for (const groupFilters of activeFilters) {
    const _groupFilters = []
    groupFilters.map(function(filter) {
      const configFilter = parseAndGetFilter(filter, configuration)
      _groupFilters.push(configFilter);
    });
    results.push(_groupFilters);
  }

  return results;
}

function parseAndGetFilter(filter, configuration) {
  const configFilter = configuration.filterBarConfiguration.filters[filter.uid];

  if (configFilter) {
    configFilter.filterUid = filter.uid;
    configFilter.uid = filter.uid;
    configFilter.value = filter.value;

    if (filter.operator) {
      configFilter.operator = filter.operator;
    }
  }

  return configFilter;
}

document.addEventListener("DOMContentLoaded", function(){
  var configuration = {},
      filterableTableNode = document.getElementsByClassName("react-filterable-table")[0];

  configuration = walk(filterableTableNode);
  configuration = setupConfiguration(configuration);

  React.render(
    React.createElement(
      FilterableTable,
      {
        filterBarConfiguration: configuration.filterBarConfiguration,
        tableConfiguration: configuration.tableConfiguration,
        batchActionsConfiguration: configuration.batchActionsConfiguration
      }
    ),
    filterableTableNode
  );
});
