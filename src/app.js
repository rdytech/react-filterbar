import {FilterableTable} from './components/FilterableTable.react';

import * as SharedUtils from './utils/SharedUtils';

document.addEventListener('DOMContentLoaded', function(){
  var searchObject = SharedUtils.parseUrlSearchString(),
      filterableTables = document.getElementsByClassName('react-filterable-table'),
      filterableTableNode,
      filterBarConfiguration,
      tableConfiguration,
      filterableTableId,
      filterbar,
      table,
      page,
      filters;

  for (var i = 0; i < filterableTables.length; i++) {

    filterableTableNode = filterableTables[i];
    filterBarConfiguration = filterableTableNode.querySelector('dl.filterBarConfiguration');
    tableConfiguration = filterableTableNode.querySelector('dl.tableConfiguration');
    filterableTableId = filterableTableNode.getAttribute('id') || i;

    filterbar = SharedUtils.parseFilterBarConfiguration(filterBarConfiguration, filterableTableId);
    table = SharedUtils.parseTableConfiguration(tableConfiguration, filterableTableId);

    if (filterbar.persistent == 'true') {
      if (window.location.href.indexOf('?') == -1) {
        if (localStorage[window.location.pathname.replace(/\//g,'')]) {
          window.location.search = localStorage[window.location.pathname.replace(/\//g,'')];
        } else {
          SharedUtils.updateUrl('q', '');
          SharedUtils.updateUrl('page', 1);
        }
      }

      table.dataUrl = window.location.href;

      if (searchObject.hasOwnProperty('q') && searchObject.q != '') {
        filters = JSON.parse(searchObject.q);
        for (var filter of filters) {
          filterbar.filters[filter.uid].enabled = true;
          filterbar.filters[filter.uid].value = filter.value;
        }
      }

      if (searchObject.hasOwnProperty('page')) {
        table.page = JSON.parse(searchObject.page);
      }

    }

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
