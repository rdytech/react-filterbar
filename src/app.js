import {FilterableTable} from './components/FilterableTable.react';

document.addEventListener('DOMContentLoaded', function(){
  var filterableTables = document.getElementsByClassName('react-filterable-table');

  var filterableTableNode,
      filterBarConfiguration,
      tableConfiguration;

  for (var i = 0; i < filterableTables.length; i++) {
    filterableTableNode = filterableTables[i];
    filterBarConfiguration = filterableTableNode.querySelector('dl.filterBarConfiguration');
    parseFilterBarConfiguration(filterBarConfiguration);
    tableConfiguration = filterableTableNode.querySelector('dl.tableConfiguration');
    parseTableConfiguration(tableConfiguration);

    React.render(
      React.createElement(
        FilterableTable,
        {
          filterableTableId: filterableTableNode.getAttribute('id'),
          filterbar: {
            configuration: filterBarConfiguration
          },
          table: {
            configuration: tableConfiguration
          }
        }
      ),
      filterableTableNode
    );
  }
});

var parseFilterBarConfiguration = function(filterBarConfiguration) {
  var parsedFilterBarConfiguration = {},
      rawFilter,
      rawFilters,
      parsedFilters = {};

  rawFilters = filterBarConfiguration.querySelector('dl.filters').querySelectorAll('dt.filter');

  for (var i = 0; i < rawFilters.length; i++) {
    rawFilter = rawFilters[i];
    parsedFilters[rawFilter.getAttribute('data-uid')] = {
      label: rawFilter.getAttribute('data-label'),
      type: rawFilter.getAttribute('data-type'),
      field: rawFilter.getAttribute('data-field'),
      value: '',
      enabled: false
    };
  }

  parsedFilterBarConfiguration.searchUrl = filterBarConfiguration.querySelector('dt.search-url').getAttribute('data-url');
  parsedFilterBarConfiguration.saveSearchUrl = filterBarConfiguration.querySelector('dt.save-search-url').getAttribute('data-url');
  parsedFilterBarConfiguration.savedSearchUrl = filterBarConfiguration.querySelector('dt.saved-search-url').getAttribute('data-url');
  parsedFilterBarConfiguration.exportResultsUrl = filterBarConfiguration.querySelector('dt.export-results-url').getAttribute('data-url');
  parsedFilterBarConfiguration.filters = parsedFilters;

  console.log(parsedFilterBarConfiguration);
}

var parseTableConfiguration = function(tableConfiguration) {
  var parsedTableConfiguration = {};

  console.log(parsedTableConfiguration);
}
