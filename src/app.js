require("babel/polyfill");
var uri = require("URIjs");

import {FilterableTable} from "./components/FilterableTable.react";
import {FilterableJobsBoard} from "./components/FilterableJobsBoard.react";

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

function windowUrl() {
  return uri(window.location);
}

function dataUrlGenerator(url) {
  var searchObject = url.search(true),
      storageKey = window.location.pathname.replace(/\//g, "");

  if (Object.keys(searchObject).length === 0 && localStorage[storageKey] !== undefined) {
    history.pushState({}, "", localStorage[storageKey]);
    url = uri(window.location);
  }

  if (!url.hasSearch("q")) {
    url.addSearch("q", "");
  }

  if (!url.hasSearch("page")) {
    url.addSearch("page", 1);
  }

  return url.pathname() + url.search();
}

function configureFilterbar(configuration) {
  if (windowUrl().query(true).q !== "") {
    for (var filter of JSON.parse(windowUrl().query(true).q)) {
      configuration.filterBarConfiguration.filters[filter.uid].enabled = true;
      configuration.filterBarConfiguration.filters[filter.uid].value = filter.value;
    }
  }
  return configuration;
}

function updateConfigurationWithUrlOptions(configuration) {
  configuration.tableConfiguration.dataUrl = dataUrlGenerator(windowUrl());
  configuration.tableConfiguration.page = Number(windowUrl().query(true).page);

  configuration = configureFilterbar(configuration);
  return configuration;
}

function updateJobsBoardConfiguration(configuration) {
  configuration.jobsBoardConfiguration.dataUrl = dataUrlGenerator(windowUrl());
  configuration.jobsBoardConfiguration.page = Number(windowUrl().query(true).page);

  configuration = configureFilterbar(configuration);
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

document.addEventListener("DOMContentLoaded", function(){
  var configuration = {},
      filterableJobsBoardNode = document.getElementsByClassName("react-filterable-jobs-board")[0];

  configuration = walk(filterableJobsBoardNode);
  configuration = updateJobsBoardConfiguration(configuration);
  

  React.render(
    React.createElement(
      FilterableJobsBoard,
      {
        filterBarConfiguration: configuration.filterBarConfiguration,
        jobsBoardConfiguration: configuration.jobsBoardConfiguration
      }
    ),
    filterableJobsBoardNode
  );
});
