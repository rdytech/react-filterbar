require("babel/polyfill");
var uri = require("URIjs");

import {FilterableTable} from "./components/FilterableTable.react";

function walk(node) {
  var nodeObject = {};

  if (node.nodeName === "DIV" || node.nodeName === "DL") {
    $.each($(node).children(), function(index, childNode) {
      nodeObject[$.camelCase(childNode.getAttribute("class"))] = walk(childNode);
    });
  } else if(node.nodeName === "DT") {
    nodeObject = node.getAttribute("data-value");
  } else {
    throw "Malformed html configuration";
  }

  return nodeObject;
}

function updateConfigurationWithUrlOptions(configuration) {
  var url = uri(window.location),
      searchObject = url.search(true);

  if (Object.keys(searchObject).length === 0) {
    history.pushState({}, "", localStorage[window.location.pathname.replace(/\//g, "")]);
    url = uri(window.location);
  }

  if (!url.hasSearch("q")) {
    url.addSearch("q", "");
  }

  if (!url.hasSearch("page")) {
    url.addSearch("page", 1);
  }

  configuration.tableConfiguration.dataUrl = url.pathname() + url.search();
  configuration.tableConfiguration.page = Number(url.query(true).page);

  if (url.query(true).q !== "") {
    for (var filter of JSON.parse(url.query(true).q)) {
      configuration.filterBarConfiguration.filters[filter.uid].enabled = true;
      configuration.filterBarConfiguration.filters[filter.uid].value = filter.value;
    }
  }

  return configuration;
}

document.addEventListener("DOMContentLoaded", function(){
  var configuration = {},
      filterableTableNode = document.getElementsByClassName("react-filterable-table")[0];

  configuration = walk(filterableTableNode);
  configuration = updateConfigurationWithUrlOptions(configuration);

  React.render(
    React.createElement(
      FilterableTable,
      {
        filterBarConfiguration: configuration.filterBarConfiguration,
        tableConfiguration: configuration.tableConfiguration
      }
    ),
    filterableTableNode
  );
});
