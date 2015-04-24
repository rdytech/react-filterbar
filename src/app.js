import {FilterableTable} from './components/FilterableTable.react';

import {ConfigurationFactory} from './factories/ConfigurationFactory';

document.addEventListener('DOMContentLoaded', function(){
  var configuration,
      filterableTables = document.getElementsByClassName('react-filterable-table'),
      filterableTableNode,
      htmlConfiguration,
      urlConfiguration;

  for (var i = 0; i < filterableTables.length; i++) {
    filterableTableNode = filterableTables[i];
    htmlConfiguration = new ConfigurationFactory('html', filterableTableNode);
    if (htmlConfiguration.filterBarConfiguration.persistent) {
      urlConfiguration = new ConfigurationFactory('url');
    } else {
      urlConfiguration = {};
    }

    configuration = $.extend(true, {}, htmlConfiguration, urlConfiguration);

    React.render(
      React.createElement(
        FilterableTable,
        {
          filterbar: configuration.filterBarConfiguration,
          table: configuration.tableConfiguration
        }
      ),
      filterableTableNode
    );
  }
});
