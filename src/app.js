import {FilterableTable} from './components/FilterableTable.react';

document.addEventListener('DOMContentLoaded', function(){
  var filterableTables = document.getElementsByClassName('react-filterable-table');

  var filterableTableNode,
      filterBarConfiguration,
      tableConfiguration;

  for (var i = 0; i < filterableTables.length; i++) {
    filterableTableNode = filterableTables[i];
    filterBarConfiguration = filterableTableNode.querySelector('dl.filterBarConfiguration');
    tableConfiguration = filterableTableNode.querySelector('dl.tableConfiguration');

    React.render(
      React.createElement(
        FilterableTable,
        {
          filterableTableId: i,
          filterbar: {
            filterBarId: i,
            configuration: filterBarConfiguration
          },
          table: {
            tableId: i,
            configuration: tableConfiguration
          }
        }
      ),
      filterableTableNode
    );
  }
});
