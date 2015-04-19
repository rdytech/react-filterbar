import {FilterableTable} from './components/FilterableTable.react';

import * as SharedUtils from './utils/SharedUtils';

document.addEventListener('DOMContentLoaded', function(){
  var searchObject = SharedUtils.parseUrlSearchString(),
      filterableTables = document.getElementsByClassName('react-filterable-table'),
      filterableTableNode,
      filterBarConfiguration,
      tableConfiguration,
      filterableTableId,
      searchString = '?',
      filterbar,
      table,
      page,
      filters,
      a;

  for (var i = 0; i < filterableTables.length; i++) {
    filterableTableNode = filterableTables[i];
    filterBarConfiguration = filterableTableNode.querySelector('dl.filterBarConfiguration');
    tableConfiguration = filterableTableNode.querySelector('dl.tableConfiguration');
    filterableTableId = filterableTableNode.getAttribute('id');

    filterbar = SharedUtils.parseFilterBarConfiguration(filterBarConfiguration, filterableTableId);
    table = SharedUtils.parseTableConfiguration(tableConfiguration, filterableTableId);

    //if (searchObject.hasOwnProperty(filterableTableId)) {
//      a = JSON.parse(searchObject[filterableTableId]);
    //} else {
    //  a = {};
    //}

//    if (a.hasOwnProperty('page')) {
//      table.page = a.page;
//    }
//
//    if (a.hasOwnProperty('filters')) {
//      if (a.filters != '') {
//        for (var filter of JSON.parse(a.filters)) {
//          filterbar.filters[filter.uid].enabled = true;
//          filterbar.filters[filter.uid].value = filter.value;
//        }
//      }
//    }


    React.render(
      React.createElement(
        FilterableTable,
        {
          filterableTableId: filterableTableId,
          filterbar: filterbar,
          table: table
        }
      ),
      filterableTableNode
    );
  }
});
